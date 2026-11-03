import { createHash } from "node:crypto";

export interface BreachCheckResult {
  isBreached: boolean;
  breachCount: number;
  prefix: string;
  checkedRemotely: boolean;
}

/**
 * Privacy-preserving breached password check using k-Anonymity (HIBP Pwned Passwords API).
 *
 * 1. Compute SHA-1 hash of password: e.g. 5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8 ("password")
 * 2. Prefix = first 5 characters: "5BAA6"
 * 3. Suffix = remaining 35 characters: "1E4C9B93F3F0682250B6CF8331B7EE68FD8"
 * 4. Only the 5-character prefix is sent to https://api.pwnedpasswords.com/range/{prefix}
 * 5. The full password NEVER leaves the Swash server.
 */
export async function checkPasswordBreached(
  password: string,
): Promise<BreachCheckResult> {
  const sha1 = createHash("sha1").update(password).digest("hex").toUpperCase();
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000); // 3s timeout

    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      method: "GET",
      headers: {
        "User-Agent": "Swash-Security-Audit/1.0",
        "Add-Padding": "true", // Minimises response-size side-channel leakage
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(
        `[breach-check] HIBP API returned status ${res.status}. Allowing fallback.`,
      );
      return { isBreached: false, breachCount: 0, prefix, checkedRemotely: false };
    }

    const text = await res.text();
    const lines = text.split(/\r?\n/);
    for (const line of lines) {
      const [hashSuffix, countStr] = line.split(":");
      if (hashSuffix && hashSuffix.trim() === suffix) {
        const count = parseInt(countStr.trim(), 10) || 1;
        return {
          isBreached: true,
          breachCount: count,
          prefix,
          checkedRemotely: true,
        };
      }
    }

    return { isBreached: false, breachCount: 0, prefix, checkedRemotely: true };
  } catch (err) {
    console.warn("[breach-check] Network error or timeout contacting HIBP:", err);
    // On network failure or offline mode, do not hard-block legitimate customer registrations.
    return { isBreached: false, breachCount: 0, prefix, checkedRemotely: false };
  }
}

