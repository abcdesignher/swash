"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "@/app/page.module.css";

export default function AccountDashboard() {
  const { user, isAuthenticated, isLoading, logout, refresh } = useAuth();
  const router = useRouter();

  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (isLoading) {
    return (
      <div className={styles.card}>
        <p className={styles.description}>Loading account information...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className={styles.card}>
        <h2 className={styles.titleMedium}>Sign In Required</h2>
        <p className={styles.description}>
          You must be signed in to access your Swash laundry subscription account.
        </p>
        <div style={{ marginTop: "1rem" }}>
          <Link href="/auth?mode=login" className={styles.submitButton}>
            Sign In to Swash
          </Link>
        </div>
      </div>
    );
  }

  async function handlePasswordReset(e: React.FormEvent) {
    e.preventDefault();
    setResetError(null);
    setResetMessage(null);
    setIsResetting(true);

    try {
      const res = await fetch("/api/account/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setResetError(data.error || "Failed to reset password.");
      } else {
        setResetMessage(data.message);
        setNewPassword("");
        // Terminated session on server requires sign in
        setTimeout(() => {
          logout();
        }, 2500);
      }
    } catch {
      setResetError("Network error while resetting password.");
    } finally {
      setIsResetting(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleteError(null);
    setDeleteMessage(null);
    setIsDeleting(true);

    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data.error || "Failed to submit deletion request.");
      } else {
        setDeleteMessage(data.message);
        setTimeout(() => {
          router.push("/auth?mode=login");
          router.refresh();
        }, 3000);
      }
    } catch {
      setDeleteError("Network error while submitting deletion request.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.heroSection}>
        <span className={styles.badge}>Customer Portal</span>
        <h1 className={styles.heroHeading}>My Swash Account</h1>
        <p className={styles.description}>
          Manage your laundry subscription allowances, pickup preferences, and account security.
        </p>
      </div>

      {/* Soft Gating Notice: Active session but email verification uncompleted */}
      {!user.emailVerified && (
        <div
          role="alert"
          style={{
            background: "#fff8e6",
            border: "1px solid #ffd166",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1.5rem",
            color: "#6b4e00",
          }}
        >
          <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
            ⚠️ Email Verification Pending (Soft Gating)
          </div>
          <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.875rem" }}>
            You are browsing Swash in exploratory mode. To activate dispatch rider collections
            and receive garment tracking updates, please enter the unique verification code sent to your email.
          </p>
          <Link
            href={`/auth/verify?email=${encodeURIComponent(user.email)}`}
            className={styles.submitButton}
            style={{
              display: "inline-block",
              width: "auto",
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              background: "#350078",
              color: "#fff",
              textDecoration: "none",
            }}
          >
            Enter Verification Code
          </Link>
        </div>
      )}

      {/* Account Details */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 className={styles.titleMedium} style={{ marginBottom: "1rem" }}>
          Profile Information
        </h2>
        <div style={{ display: "grid", gap: "0.75rem", fontSize: "0.95rem" }}>
          <div>
            <strong>Full Name:</strong> {user.fullName}
          </div>
          <div>
            <strong>Email Address:</strong> {user.email} (
            {user.emailVerified ? "Verified ✅" : "Unverified ⚠️"})
          </div>
          <div>
            <strong>Mobile Number:</strong> {user.phone || "Not provided"}
          </div>
          <div>
            <strong>Preferred Plan:</strong> {user.preferredPlan || "Individual (1–2 people)"}
          </div>
          <div>
            <strong>Default Pickup Zone:</strong> {user.defaultPickupZone || "Lagos Mainland"}
          </div>
          <div>
            <strong>Account Role:</strong> {user.role}
          </div>
        </div>
      </section>

      {/* Security Actions */}
      <section style={{ borderTop: "1px solid #eee", paddingTop: "1.5rem", marginBottom: "1.5rem" }}>
        <h2 className={styles.titleMedium} style={{ marginBottom: "1rem" }}>
          Account Security & Active Sessions
        </h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setResetPasswordOpen(!resetPasswordOpen)}
            className={styles.navButton}
            style={{ background: "#f5f0ff", color: "#350078", border: "1px solid #dcd0ff", cursor: "pointer" }}
          >
            {resetPasswordOpen ? "Cancel Password Reset" : "Reset Password (Revokes All Sessions)"}
          </button>

          <button
            type="button"
            onClick={() => logout()}
            className={styles.navButton}
            style={{ background: "#f5f5f5", color: "#333", border: "1px solid #ccc", cursor: "pointer" }}
          >
            Sign Out
          </button>
        </div>

        {resetPasswordOpen && (
          <form
            onSubmit={handlePasswordReset}
            style={{ marginTop: "1rem", background: "#fafafa", padding: "1rem", borderRadius: "8px" }}
          >
            <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>Reset Your Password</h3>
            <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.75rem" }}>
              Resetting your password immediately terminates all active sessions across all devices.
            </p>
            {resetError && (
              <div role="alert" className={styles.alertError} style={{ marginBottom: "0.75rem" }}>
                {resetError}
              </div>
            )}
            {resetMessage && (
              <div role="alert" style={{ color: "#007a33", marginBottom: "0.75rem" }}>
                {resetMessage}
              </div>
            )}
            <div style={{ marginBottom: "0.75rem" }}>
              <input
                type="password"
                placeholder="New secure passphrase (min 10 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className={styles.inputField}
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </div>
            <button
              type="submit"
              disabled={isResetting || newPassword.length < 10}
              className={styles.submitButton}
              style={{ width: "auto", padding: "0.5rem 1.25rem" }}
            >
              {isResetting ? "Updating..." : "Update Password & Kill Sessions"}
            </button>
          </form>
        )}
      </section>

      {/* Account Deletion (NDPA 2023) */}
      <section style={{ borderTop: "1px solid #eee", paddingTop: "1.5rem" }}>
        <h2 className={styles.titleMedium} style={{ color: "#d90429", marginBottom: "0.5rem" }}>
          Danger Zone
        </h2>
        <p style={{ fontSize: "0.875rem", color: "#666", marginBottom: "1rem" }}>
          Request permanent closure and erasure of your Swash account pursuant to Section 34 of the Nigeria Data Protection Act (NDPA) 2023.
        </p>

        {!deleteModalOpen ? (
          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            style={{
              background: "#ffebee",
              color: "#c62828",
              border: "1px solid #ffcdd2",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Request Account Deletion
          </button>
        ) : (
          <div style={{ background: "#fff5f5", border: "1px solid #ffcdd2", padding: "1rem", borderRadius: "8px" }}>
            <h3 style={{ color: "#c62828", fontSize: "1rem", marginBottom: "0.5rem" }}>
              Confirm Account Deletion Request
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#555", marginBottom: "0.75rem" }}>
              Upon submission:
              <br />• Your account will be locked immediately and all browser sessions revoked.
              <br />• A <strong>14-day grace period</strong> applies before permanent data purging.
              <br />• Statutory tax records (receipts) are retained in anonymised form for 6 years (CAMA 2020).
            </p>
            {deleteError && (
              <div role="alert" className={styles.alertError} style={{ marginBottom: "0.75rem" }}>
                {deleteError}
              </div>
            )}
            {deleteMessage && (
              <div role="alert" style={{ color: "#007a33", marginBottom: "0.75rem" }}>
                {deleteMessage}
              </div>
            )}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                style={{
                  background: "#c62828",
                  color: "#fff",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {isDeleting ? "Locking account..." : "Yes, Lock and Delete My Account"}
              </button>
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={isDeleting}
                style={{
                  background: "#eee",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

