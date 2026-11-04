"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "@/app/page.module.css";
import { useAuth } from "@/context/AuthContext";

const RESEND_COOLDOWN_SECONDS = 120; // 2 minutes

export default function VerifyCodeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(RESEND_COOLDOWN_SECONDS);

  // 2-minute countdown timer for code resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;

    setServerError(null);
    setServerSuccess(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    if (!cleanEmail) {
      setServerError("Please enter the email address you registered with.");
      return;
    }

    if (!cleanCode) {
      setServerError("Please enter the unique verification code sent to your email.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, code: cleanCode }),
      });

      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || "Verification failed. Please check the code.");
      } else {
        setServerSuccess("Email verified successfully! Redirecting to your dashboard...");
        if (data.user) {
          login(data.user);
        }
        const targetUrl = data.redirect || "/account";
        router.push(targetUrl);
        router.refresh();
      }
    } catch {
      setServerError("Network error contacting Swash. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResendCode() {
    if (countdown > 0 || isResending) return;

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setServerError("Enter your registered email address to resend your code.");
      return;
    }

    setServerError(null);
    setServerSuccess(null);
    setIsResending(true);

    try {
      const res = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || "Failed to resend code. Please wait a moment.");
      } else {
        setServerSuccess(data.message || "A new unique verification code has been sent.");
        setCountdown(RESEND_COOLDOWN_SECONDS);
      }
    } catch {
      setServerError("Network error contacting Swash. Please try again.");
    } finally {
      setIsResending(false);
    }
  }

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={styles.authContainer}>
      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        <div className={styles.fieldGroup}>
          <label htmlFor="verify-email" className={styles.label}>
            Email address
          </label>
          <input
            id="verify-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (serverError) setServerError(null);
              if (serverSuccess) setServerSuccess(null);
            }}
            className={styles.input}
            placeholder="adaeze@example.com"
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="verify-code" className={styles.label}>
            Unique Verification Code
          </label>
          <input
            id="verify-code"
            type="text"
            inputMode="numeric"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/\D/g, ""));
              if (serverError) setServerError(null);
              if (serverSuccess) setServerSuccess(null);
            }}
            className={styles.input}
            style={{ fontSize: "20px", letterSpacing: "4px", textAlign: "center" }}
            required
          />
          <p className={styles.helperText}>
            Enter the unique code sent to your email. Codes expire after 15 minutes.
          </p>
        </div>

        {serverError && (
          <div role="alert" className={styles.errorBanner}>
            <strong>Request not completed</strong>
            <p>{serverError}</p>
          </div>
        )}

        {serverSuccess && (
          <div role="status" className={styles.successBanner}>
            <p>{serverSuccess}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? "Verifying..." : "Verify Code"}
        </button>

        <div style={{ marginTop: "20px", textAlign: "center", fontSize: "14px", color: "var(--colour-text-secondary-role, #452717)" }}>
          <span>Didn&apos;t receive code? </span>
          {countdown > 0 ? (
            <span style={{ fontWeight: 600, color: "var(--colour-primary-role, #1d064a)" }}>
              Resend code in {formatCountdown(countdown)}
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending}
              style={{
                background: "none",
                border: "none",
                color: "var(--colour-primary-role, #350078)",
                fontWeight: 700,
                cursor: "pointer",
                textDecoration: "underline",
                padding: "0",
                fontSize: "14px",
              }}
            >
              {isResending ? "Sending..." : "Resend code"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
