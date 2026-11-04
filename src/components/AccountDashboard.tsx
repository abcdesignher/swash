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
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (!currentPassword) {
      setResetError("Please enter your current password.");
      return;
    }

    if (newPassword.length < 10) {
      setResetError("New password must be at least 10 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError("New passwords do not match. Please verify your confirmation password.");
      return;
    }

    setIsResetting(true);

    try {
      const res = await fetch("/api/account/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setResetError(data.error || "Failed to reset password.");
      } else {
        setResetMessage(data.message);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        // Terminated session on server requires sign in
        setTimeout(() => {
          logout();
        }, 3000);
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
            background: "#fff8e1",
            border: "1px solid #ffe082",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "1.25rem" }}>⚠️</span>
            <strong style={{ color: "#b78103", fontSize: "1rem" }}>Email verification pending</strong>
          </div>
          <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.9rem", color: "#5d4037" }}>
            Your account has soft access to browse subscription history, but order placements are hard-gated until you verify your email address.
          </p>
          <Link
            href={`/auth/verify?email=${encodeURIComponent(user.email)}`}
            style={{
              display: "inline-block",
              background: "#1d064a",
              color: "#fff",
              padding: "0.4rem 0.8rem",
              borderRadius: "4px",
              fontSize: "0.85rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Enter Verification Code &rarr;
          </Link>
        </div>
      )}

      {/* Profile Overview */}
      <section style={{ marginBottom: "1.5rem" }}>
        <h2 className={styles.titleMedium} style={{ marginBottom: "0.75rem" }}>
          Subscriber Profile
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            background: "#f9f9fb",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          <div>
            <span style={{ fontSize: "0.8rem", color: "#666" }}>Full Name</span>
            <p style={{ fontWeight: 600, margin: "0.2rem 0" }}>{user.fullName}</p>
          </div>
          <div>
            <span style={{ fontSize: "0.8rem", color: "#666" }}>Email Address</span>
            <p style={{ fontWeight: 600, margin: "0.2rem 0" }}>{user.email}</p>
          </div>
          <div>
            <span style={{ fontSize: "0.8rem", color: "#666" }}>Account Role</span>
            <p style={{ fontWeight: 600, margin: "0.2rem 0" }}>
              <span
                style={{
                  background: user.role === "ADMIN" ? "#e0f2fe" : "#f3e8ff",
                  color: user.role === "ADMIN" ? "#0369a1" : "#6b21a8",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                }}
              >
                {user.role}
              </span>
            </p>
          </div>
          <div>
            <span style={{ fontSize: "0.8rem", color: "#666" }}>Verification Status</span>
            <p style={{ fontWeight: 600, margin: "0.2rem 0" }}>
              {user.emailVerified ? (
                <span style={{ color: "#166534" }}>✓ Verified</span>
              ) : (
                <span style={{ color: "#b45309" }}>Pending</span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Subscription Allowance */}
      <section style={{ marginBottom: "1.5rem" }}>
        <h2 className={styles.titleMedium} style={{ marginBottom: "0.75rem" }}>
          Active Subscription Allowance
        </h2>
        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "1rem",
            background: "#ffffff",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ fontWeight: 600 }}>Standard Wash &amp; Fold Plan</span>
            <span style={{ color: "#007a33", fontWeight: 700 }}>Active</span>
          </div>
          <div style={{ display: "flex", gap: "2rem", fontSize: "0.9rem", color: "#555" }}>
            <div>
              Remaining Bag Quota: <strong>3 of 4 bags</strong>
            </div>
            <div>
              Scheduled Pickup: <strong>Saturday, 9:00 AM</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Security Actions */}
      <section style={{ borderTop: "1px solid #eee", paddingTop: "1.5rem", marginBottom: "1.5rem" }}>
        <h2 className={styles.titleMedium} style={{ marginBottom: "1rem" }}>
          Account Security &amp; Active Sessions
        </h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <button
            type="button"
            onClick={() => {
              setResetPasswordOpen(!resetPasswordOpen);
              setResetError(null);
              setResetMessage(null);
            }}
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
            style={{ marginTop: "1rem", background: "#fafafa", padding: "1.25rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}
          >
            <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem", fontWeight: 700 }}>
              Reset Your Password
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "1rem" }}>
              To protect your account, enter your current password followed by your new password. Resetting immediately terminates all active sessions across all devices.
            </p>

            {resetError && (
              <div
                role="alert"
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#991b1b",
                  padding: "0.75rem",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  marginBottom: "1rem",
                }}
              >
                {resetError}
              </div>
            )}

            {resetMessage && (
              <div
                role="alert"
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  color: "#166534",
                  padding: "0.75rem",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  marginBottom: "1rem",
                }}
              >
                {resetMessage}
              </div>
            )}

            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="reset-current-password"
                style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.25rem", color: "#333" }}
              >
                Current Password
              </label>
              <input
                id="reset-current-password"
                type="password"
                placeholder="Enter your current password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (resetError) setResetError(null);
                  if (resetMessage) setResetMessage(null);
                }}
                required
                className={styles.input}
                style={{ width: "100%", padding: "0.6rem 0.75rem" }}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="reset-new-password"
                style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.25rem", color: "#333" }}
              >
                New Password
              </label>
              <input
                id="reset-new-password"
                type="password"
                placeholder="New secure passphrase (min 10 characters)"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (resetError) setResetError(null);
                  if (resetMessage) setResetMessage(null);
                }}
                required
                className={styles.input}
                style={{ width: "100%", padding: "0.6rem 0.75rem" }}
              />
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <label
                htmlFor="reset-confirm-password"
                style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.25rem", color: "#333" }}
              >
                Confirm New Password
              </label>
              <input
                id="reset-confirm-password"
                type="password"
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (resetError) setResetError(null);
                  if (resetMessage) setResetMessage(null);
                }}
                required
                className={styles.input}
                style={{ width: "100%", padding: "0.6rem 0.75rem" }}
              />
            </div>

            <button
              type="submit"
              disabled={isResetting || !currentPassword || newPassword.length < 10 || !confirmPassword}
              className={styles.submitButton}
              style={{ width: "auto", padding: "0.6rem 1.5rem" }}
            >
              {isResetting ? "Updating..." : "Update Password & Kill Sessions"}
            </button>
          </form>
        )}

        {/* Access Control Test link for Step 1 / Evidence 16 */}
        <div style={{ marginTop: "1.25rem", padding: "0.75rem 1rem", background: "#f8fafc", borderRadius: "6px", border: "1px dashed #cbd5e1" }}>
          <p style={{ fontSize: "0.85rem", color: "#475569", margin: "0 0 0.4rem 0" }}>
            <strong>Staff Portal Access Control (RBAC):</strong>
          </p>
          <Link
            href="/admin"
            style={{
              fontSize: "0.85rem",
              color: "#350078",
              textDecoration: "underline",
              fontWeight: 600,
            }}
          >
            Click here to test Staff Portal (/admin) — ordinary customers are refused with HTTP 403 &rarr;
          </Link>
        </div>
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
