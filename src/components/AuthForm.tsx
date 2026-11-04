"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "@/app/page.module.css";
import {
  normaliseEmail,
  normalisePassword,
  passwordHadEdgeWhitespace,
} from "@/lib/normalise";

type AuthMode = "register" | "login";

interface FieldErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  acceptTerms?: string;
}

const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s'-]{1,79}$/;
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NIGERIAN_PHONE_PATTERN = /^(?:0[789][01]\d{8}|\+234[789][01]\d{8})$/;

export function validateFullName(value: string): string | undefined {
  if (value.length === 0) {
    return "Enter your full name so Swash riders can identify your collection.";
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return "Full name cannot contain only spaces.";
  }
  if (trimmed.length < 2) {
    return "Full name must be at least 2 characters long.";
  }
  if (trimmed.length > 80) {
    return "Full name must not exceed 80 characters.";
  }
  if (!NAME_PATTERN.test(trimmed)) {
    return "Use letters, spaces, hyphens, or apostrophes only (2–80 characters).";
  }
  return undefined;
}

export function validateRegisterEmail(value: string): string | undefined {
  if (value.length === 0) {
    return "Enter your email address to receive order and payment updates.";
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return "Email address cannot contain only spaces.";
  }
  if (trimmed.length > 254) {
    return "Email address must not exceed 254 characters.";
  }
  if (!EMAIL_PATTERN.test(trimmed)) {
    return "Enter a valid email format such as name@domain.com.";
  }
  return undefined;
}

export function validatePhone(value: string): string | undefined {
  if (value.length === 0) {
    return "Enter a Nigerian mobile number so our rider can coordinate pickup.";
  }
  const trimmed = value.trim();
  if (!NIGERIAN_PHONE_PATTERN.test(trimmed)) {
    return "Enter an 11-digit Nigerian mobile number (e.g. 08031234567) or +234 format.";
  }
  return undefined;
}

export function validateRegisterPassword(rawValue: string): string | undefined {
  if (rawValue.length === 0) {
    return "Create a password to protect your Swash subscription account.";
  }
  // Leading and trailing spaces are removed before hashing, so the rules apply
  // to the value that will actually be stored.
  const value = normalisePassword(rawValue);
  if (value.length === 0) {
    return "Password cannot consist solely of spaces.";
  }
  if (value.length < 10) {
    return "Password must be at least 10 characters long, not counting spaces at the start or end.";
  }
  if (value.length > 128) {
    return "Password must not exceed 128 characters.";
  }
  return undefined;
}

export default function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const rawMode = searchParams.get("mode");
  const mode: AuthMode = rawMode === "login" ? "login" : "register";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [servicePlan, setServicePlan] = useState("Individual Subscription");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loginSubmitted, setLoginSubmitted] = useState(false);
  const [termsAttempted, setTermsAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<{
    message: string;
    recordId?: string;
  } | null>(null);

  function switchMode(nextMode: AuthMode) {
    setServerError(null);
    setServerSuccess(null);
    setTouched({});
    setLoginSubmitted(false);
    setTermsAttempted(false);
    router.replace(`/auth?mode=${nextMode}`, { scroll: false });
  }

  // Compute errors based on mode
  const registerErrors: FieldErrors = {
    fullName: validateFullName(fullName),
    email: validateRegisterEmail(email),
    phone: validatePhone(phone),
    password: validateRegisterPassword(password),
    acceptTerms: acceptTerms
      ? undefined
      : "Please accept the Swash Terms of Service and Privacy Policy to continue.",
  };

  const loginErrors: FieldErrors = {
    email:
      email.trim().length === 0
        ? "Enter the email address for your Swash account."
        : !EMAIL_PATTERN.test(email.trim())
        ? "Enter a valid email address to sign in."
        : undefined,
    password:
      normalisePassword(password).length === 0
        ? "Enter your account password to sign in."
        : undefined,
  };

  const visibleErrors: FieldErrors =
    mode === "register"
      ? {
          fullName:
            touched.fullName || fullName.length > 0
              ? registerErrors.fullName
              : undefined,
          email:
            touched.email || email.length > 0
              ? registerErrors.email
              : undefined,
          phone:
            touched.phone || phone.length > 0
              ? registerErrors.phone
              : undefined,
          password:
            touched.password || password.length > 0
              ? registerErrors.password
              : undefined,
          acceptTerms:
            touched.acceptTerms || termsAttempted
              ? registerErrors.acceptTerms
              : undefined,
        }
      : {
          // Login mode: empty field on blur (Category 1), format only on submit (Category 3)
          email: loginSubmitted
            ? loginErrors.email
            : touched.email && email.trim().length === 0
            ? "Enter the email address for your Swash account."
            : undefined,
          password: loginSubmitted
            ? loginErrors.password
            : touched.password && normalisePassword(password).length === 0
            ? "Enter your account password to sign in."
            : undefined,
        };

  const isRegisterFieldsValid =
    !registerErrors.fullName &&
    !registerErrors.email &&
    !registerErrors.phone &&
    !registerErrors.password;

  const isRegisterFormValid = isRegisterFieldsValid && acceptTerms;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setServerError(null);
    setServerSuccess(null);

    if (mode === "login") {
      setLoginSubmitted(true);
      setTouched({ email: true, password: true });
      if (loginErrors.email || loginErrors.password) {
        return;
      }
    } else {
      setTouched({
        fullName: true,
        email: true,
        phone: true,
        password: true,
        acceptTerms: true,
      });
      setTermsAttempted(true);
      if (!isRegisterFormValid) {
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          fullName: fullName.trim(),
          email: normaliseEmail(email),
          phone: phone.trim(),
          servicePlan,
          password: normalisePassword(password),
          acceptTerms,
        }),
      });

      const payload = (await response.json()) as {
        message?: string;
        error?: string;
        fieldErrors?: Record<string, string>;
        record?: { id: string };
        user?: any;
      };

      if (!response.ok) {
        // The server is the authority. Show its field messages and keep the
        // user's input so nothing has to be retyped.
        const errorMsg =
          payload.error ?? "Request could not be completed. Please try again.";
        const details = payload.fieldErrors
          ? Object.values(payload.fieldErrors)
              .filter((msg) => !errorMsg.includes(msg))
              .join(" ")
          : "";
        setServerError([errorMsg, details].filter(Boolean).join(" "));
        return;
      }

      setServerSuccess({
        message:
          payload.message ??
          (mode === "register"
            ? "Account registration recorded."
            : "Sign-in request submitted."),
        recordId: payload.record?.id,
      });

      if (mode === "login") {
        if (payload.user) {
          login(payload.user);
        }
        router.push("/account");
        router.refresh();
        return;
      }

      if (mode === "register") {
        router.push(`/auth/verify?email=${encodeURIComponent(normaliseEmail(email))}`);
      }
    } catch {
      setServerError(
        "Network error while contacting Swash. Your input has been preserved."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.authContainer}>
      <div
        className={styles.modeSwitcher}
        role="tablist"
        aria-label="Authentication mode"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "register"}
          className={
            mode === "register" ? styles.modeTabActive : styles.modeTab
          }
          onClick={() => switchMode("register")}
        >
          Create Account
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "login"}
          className={mode === "login" ? styles.modeTabActive : styles.modeTab}
          onClick={() => switchMode("login")}
        >
          Sign In
        </button>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {mode === "register" && (
          <div className={styles.fieldGroup}>
            <label htmlFor="auth-full-name" className={styles.label}>
              Full name
            </label>
            <input
              id="auth-full-name"
              name="fullName"
              type="text"
              required
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onBlur={() =>
                setTouched((prev) => ({ ...prev, fullName: true }))
              }
              placeholder="e.g. Adaeze Okafor"
              aria-invalid={Boolean(visibleErrors.fullName)}
              aria-describedby={
                visibleErrors.fullName ? "auth-full-name-error" : undefined
              }
              className={
                visibleErrors.fullName ? styles.inputError : styles.input
              }
              disabled={isSubmitting}
            />
            {visibleErrors.fullName && (
              <p
                id="auth-full-name-error"
                className={styles.inlineError}
                role="alert"
              >
                <span aria-hidden="true" className={styles.cautionIcon}>
                  ⚠
                </span>
                <span>{visibleErrors.fullName}</span>
              </p>
            )}
          </div>
        )}

        <div className={styles.fieldGroup}>
          <label htmlFor="auth-email" className={styles.label}>
            Email address
          </label>
          <input
            id="auth-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
            placeholder="e.g. adaeze@example.com"
            aria-invalid={Boolean(visibleErrors.email)}
            aria-describedby={
              visibleErrors.email
                ? "auth-email-error"
                : mode === "register" &&
                  email.trim().length > 0 &&
                  !registerErrors.email
                ? "auth-email-ownership-note"
                : undefined
            }
            className={visibleErrors.email ? styles.inputError : styles.input}
            disabled={isSubmitting}
          />
          {visibleErrors.email && (
            <p
              id="auth-email-error"
              className={styles.inlineError}
              role="alert"
            >
              <span aria-hidden="true" className={styles.cautionIcon}>
                ⚠
              </span>
              <span>{visibleErrors.email}</span>
            </p>
          )}
          {mode === "register" &&
            email.trim().length > 0 &&
            !registerErrors.email && (
              <p id="auth-email-ownership-note" className={styles.helperText}>
                Email format is valid. We will send a verification link after
                signup to confirm you own this address.
              </p>
            )}
        </div>

        {mode === "register" && (
          <>
            <div className={styles.fieldGroup}>
              <label htmlFor="auth-phone" className={styles.label}>
                Nigerian mobile number (for collection &amp; delivery)
              </label>
              <input
                id="auth-phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                required
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                placeholder="e.g. 08031234567 or +2348031234567"
                aria-invalid={Boolean(visibleErrors.phone)}
                aria-describedby={
                  visibleErrors.phone ? "auth-phone-error" : "auth-phone-hint"
                }
                className={
                  visibleErrors.phone ? styles.inputError : styles.input
                }
                disabled={isSubmitting}
              />
              <p id="auth-phone-hint" className={styles.helperText}>
                Used by Swash dispatch riders to coordinate laundry pickup.
              </p>
              {visibleErrors.phone && (
                <p
                  id="auth-phone-error"
                  className={styles.inlineError}
                  role="alert"
                >
                  <span aria-hidden="true" className={styles.cautionIcon}>
                    ⚠
                  </span>
                  <span>{visibleErrors.phone}</span>
                </p>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="auth-service-plan" className={styles.label}>
                Preferred laundry subscription
              </label>
              <select
                id="auth-service-plan"
                name="servicePlan"
                value={servicePlan}
                onChange={(e) => setServicePlan(e.target.value)}
                className={styles.select}
                disabled={isSubmitting}
              >
                <option value="Individual Subscription">
                  Individual (1–2 people)
                </option>
                <option value="Family Subscription">
                  Family Household (3+ people)
                </option>
                <option value="Small Business Subscription">
                  Small Business / Office
                </option>
              </select>
            </div>
          </>
        )}

        <div className={styles.fieldGroup}>
          <label htmlFor="auth-password" className={styles.label}>
            {mode === "register" ? "Create password" : "Password"}
          </label>
          <div className={styles.passwordWrapper}>
            <input
              id="auth-password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete={
                mode === "register" ? "new-password" : "current-password"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() =>
                setTouched((prev) => ({ ...prev, password: true }))
              }
              aria-invalid={Boolean(visibleErrors.password)}
              aria-describedby={
                [
                  mode === "register" && password.length > 0
                    ? "auth-password-guidance"
                    : null,
                  visibleErrors.password ? "auth-password-error" : null,
                ]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
              className={
                visibleErrors.password ? styles.inputError : styles.input
              }
              disabled={isSubmitting}
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              aria-controls="auth-password"
              id="auth-password-toggle"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-eye-off"
                  aria-hidden="true"
                >
                  <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                  <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                  <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                  <path d="m2 2 20 20" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-eye"
                  aria-hidden="true"
                >
                  <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {mode === "register" && password.length > 0 && (
            <p id="auth-password-guidance" className={styles.helperText}>
              Password guidance: Use 10 to 128 characters. Spaces inside a
              passphrase are kept. Spaces at the start or end are removed
              automatically
              {passwordHadEdgeWhitespace(password)
                ? " (we will remove the extra spaces you pasted before saving)."
                : "."}
            </p>
          )}

          {visibleErrors.password && (
            <p
              id="auth-password-error"
              className={styles.inlineError}
              role="alert"
            >
              <span aria-hidden="true" className={styles.cautionIcon}>
                ⚠
              </span>
              <span>{visibleErrors.password}</span>
            </p>
          )}
        </div>

        {mode === "register" && (
          <div className={styles.fieldGroup}>
            <div className={styles.checkboxRow}>
              <input
                id="auth-accept-terms"
                name="acceptTerms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => {
                  setAcceptTerms(e.target.checked);
                  setTouched((prev) => ({ ...prev, acceptTerms: true }));
                }}
                aria-invalid={Boolean(visibleErrors.acceptTerms)}
                aria-describedby={
                  visibleErrors.acceptTerms
                    ? "auth-accept-terms-error"
                    : "auth-terms-summary"
                }
                className={styles.checkbox}
                disabled={isSubmitting}
              />
              <label htmlFor="auth-accept-terms" className={styles.label}>
                I agree to the Swash Laundry Subscription Terms of Service and
                Privacy Notice
              </label>
            </div>
            <p id="auth-terms-summary" className={styles.helperText}>
              Covers scheduled collection windows, garment care liability, and
              NDPA-compliant customer record handling.
            </p>
            {(visibleErrors.acceptTerms ||
              (isRegisterFieldsValid && !acceptTerms)) && (
              <p
                id="auth-accept-terms-error"
                className={styles.inlineError}
                role="alert"
              >
                <span aria-hidden="true" className={styles.cautionIcon}>
                  ⚠
                </span>
                <span>
                  {visibleErrors.acceptTerms ??
                    "Accept the Swash Terms of Service and Privacy Notice above to enable the Create Swash Account button."}
                </span>
              </p>
            )}
          </div>
        )}

        {serverError && (
          <div className={styles.errorBanner} role="alert" aria-live="assertive">
            <p className={styles.bannerTitle}>Request not completed</p>
            <p className={styles.bannerBody}>{serverError}</p>
          </div>
        )}

        {serverSuccess && (
          <div className={styles.successBanner} role="status" aria-live="polite">
            <p className={styles.bannerTitle}>{serverSuccess.message}</p>
            {serverSuccess.recordId && (
              <p className={styles.bannerBody}>
                PostgreSQL Record ID: <code>{serverSuccess.recordId}</code>
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          id="auth-submit-button"
          className={styles.submitButton}
          disabled={
            isSubmitting || (mode === "register" && !isRegisterFormValid)
          }
        >
          {isSubmitting
            ? "Processing..."
            : mode === "register"
            ? "Create Swash Account"
            : "Sign In to Swash"}
        </button>
      </form>
    </div>
  );
}
