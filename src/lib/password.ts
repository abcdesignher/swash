import argon2 from "argon2";

/**
 * Argon2id parameters mandated by RULES.md (Password Security).
 * Salts are generated per hash by the argon2 library (16 random bytes) and
 * embedded in the encoded output, so no separate salt column is needed.
 */
export const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 19456, // KiB
  timeCost: 2,
  parallelism: 1,
} as const;

export function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, ARGON2_OPTIONS);
}

export async function verifyPassword(
  encodedHash: string,
  password: string,
): Promise<boolean> {
  try {
    return await argon2.verify(encodedHash, password);
  } catch {
    // Malformed stored hash: treat as a failed verification, never expose details.
    return false;
  }
}
