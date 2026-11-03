"use client";

import React, { useState } from "react";
import styles from "@/app/page.module.css";

interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export default function AdminDashboard({ adminUser }: { adminUser: AdminUser }) {
  const [jobRunning, setJobRunning] = useState(false);
  const [jobResult, setJobResult] = useState<any>(null);
  const [jobError, setJobError] = useState<string | null>(null);

  async function handleRunDeletionJob() {
    setJobRunning(true);
    setJobError(null);
    setJobResult(null);

    try {
      const res = await fetch("/api/admin/run-deletion-job", {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) {
        setJobError(data.error || "Failed to trigger job.");
      } else {
        setJobResult(data.result);
      }
    } catch {
      setJobError("Network error while communicating with staff API.");
    } finally {
      setJobRunning(false);
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.heroSection}>
        <span
          className={styles.badge}
          style={{ background: "#e0f2fe", color: "#0369a1", borderColor: "#bae6fd" }}
        >
          Staff Administration
        </span>
        <h1 className={styles.heroHeading}>Swash Laundry Operations & Compliance</h1>
        <p className={styles.description}>
          Authenticated Staff: <strong>{adminUser.fullName}</strong> ({adminUser.email}) — Role: <code>{adminUser.role}</code>
        </p>
      </div>

      <section style={{ marginBottom: "2rem" }}>
        <h2 className={styles.titleMedium} style={{ marginBottom: "0.75rem" }}>
          Operational Actions (Staff Only)
        </h2>
        <p style={{ fontSize: "0.9rem", color: "#555", marginBottom: "1rem" }}>
          Ordinary customer accounts cannot invoke these actions. Every request is verified server-side against the <code>User.role</code> column in PostgreSQL.
        </p>

        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "1.25rem", borderRadius: "8px" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.5rem" }}>
            Trigger Scheduled Account Deletion Job (NDPA 2023 Compliance)
          </h3>
          <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "1rem" }}>
            Scans for soft-deleted customer accounts past the 14-day grace period. Anonymises financial transaction ledgers (CAMA 2020) and purges transient tokens.
          </p>

          <button
            type="button"
            onClick={handleRunDeletionJob}
            disabled={jobRunning}
            className={styles.submitButton}
            style={{ width: "auto", padding: "0.6rem 1.5rem" }}
          >
            {jobRunning ? "Executing Job..." : "Execute Deletion Job Now"}
          </button>

          {jobError && (
            <div role="alert" className={styles.alertError} style={{ marginTop: "1rem" }}>
              {jobError}
            </div>
          )}

          {jobResult && (
            <div
              style={{
                marginTop: "1rem",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                padding: "1rem",
                borderRadius: "6px",
                fontSize: "0.85rem",
              }}
            >
              <div style={{ fontWeight: "700", color: "#166534", marginBottom: "0.5rem" }}>
                Job Execution Completed Successfully
              </div>
              <div><strong>Eligible Accounts:</strong> {jobResult.eligibleCount}</div>
              <div><strong>Processed Accounts:</strong> {jobResult.processedCount}</div>
              <div><strong>Hard-Deleted Accounts:</strong> {jobResult.hardDeletedUsersCount}</div>
              <div><strong>Anonymised Accounts:</strong> {jobResult.anonymizedUsersCount}</div>
              <div><strong>Sessions Purged:</strong> {jobResult.sessionsPurged}</div>
              <div><strong>Started:</strong> {jobResult.startedAt}</div>
              <div><strong>Finished:</strong> {jobResult.finishedAt}</div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

