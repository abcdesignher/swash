/**
 * Server-side request schemas (Zod). These re-implement every Task 03 client-side
 * rule so the API never relies on the browser having validated anything.
 *
 * Each field is parsed as `unknown`-safe: non-string input (arrays, objects,
 * numbers) fails `z.string()` before any normalisation or database use.
 * Unknown keys are stripped, so a caller cannot smuggle in fields such as `role`.
 */
import { z } from "zod";
import {
  normaliseEmail,
  normalisePassword,
  trimEdgeWhitespace,
} from "@/lib/normalise";

export const SERVICE_PLANS = [
  "Individual Subscription",
  "Family Subscription",
  "Small Business Subscription",
] as const;

const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s'-]{1,79}$/;
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NIGERIAN_PHONE_PATTERN = /^(?:0[789][01]\d{8}|\+234[789][01]\d{8})$/;

// Hard cap applied BEFORE normalisation so enormous strings are never processed.
const RAW_INPUT_LIMIT = 1024;

const rawString = (requiredMessage: string) =>
  z
    .string({ message: requiredMessage })
    .max(RAW_INPUT_LIMIT, "This value is too long.");

const fullName = rawString("Enter your full name.")
  .transform(trimEdgeWhitespace)
  .pipe(
    z
      .string()
      .min(2, "Full name must be at least 2 characters long.")
      .max(80, "Full name must not exceed 80 characters.")
      .regex(
        NAME_PATTERN,
        "Use letters, spaces, hyphens, or apostrophes only (2–80 characters).",
      ),
  );

const email = rawString("Enter your email address.")
  .transform(normaliseEmail)
  .pipe(
    z
      .string()
      .min(1, "Enter your email address.")
      .max(254, "Email address must not exceed 254 characters.")
      .regex(EMAIL_PATTERN, "Enter a valid email format such as name@domain.com."),
  );

const phone = rawString("Enter a Nigerian mobile number.")
  .transform(trimEdgeWhitespace)
  .pipe(
    z
      .string()
      .regex(
        NIGERIAN_PHONE_PATTERN,
        "Enter an 11-digit Nigerian mobile number (e.g. 08031234567) or +234 format.",
      ),
  );

const newPassword = rawString("Create a password.")
  .transform(normalisePassword)
  .pipe(
    z
      .string()
      .min(1, "Password cannot consist solely of spaces.")
      .min(10, "Password must be at least 10 characters long, not counting spaces at the start or end.")
      .max(128, "Password must not exceed 128 characters."),
  );

export const registerSchema = z.object({
  fullName,
  email,
  phone,
  servicePlan: z.enum(SERVICE_PLANS, {
    message: "Choose one of the available subscription plans.",
  }),
  password: newPassword,
  acceptTerms: z.literal(true, {
    message: "Please accept the Swash Terms of Service and Privacy Policy to continue.",
  }),
});

// Login deliberately applies no password-policy rules (see Task 03 enumeration.md).
export const loginSchema = z.object({
  email: rawString("Enter the email address for your Swash account.")
    .transform(normaliseEmail)
    .pipe(z.string().min(1, "Enter the email address for your Swash account.").max(254)),
  password: rawString("Enter your account password to sign in.")
    .transform(normalisePassword)
    .pipe(z.string().min(1, "Enter your account password to sign in.")),
});

// Password reset: the request step only needs an email address.
export const passwordResetRequestSchema = z.object({ email });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

/** Flattens Zod issues into `{ field: firstMessage }` for the API response. */
export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!(key in result)) result[key] = issue.message;
  }
  return result;
}

