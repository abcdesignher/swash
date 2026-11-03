import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, validateSession } from "@/lib/session";
import SiteHeader from "@/components/SiteHeader";
import AdminDashboard from "@/components/AdminDashboard";
import styles from "@/app/page.module.css";

export const metadata: Metadata = {
  title: "Staff Administration Portal | Swash Laundry",
  description: "Authorized staff portal for laundry operational management and deletion compliance.",
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    redirect("/auth?mode=login&from=/admin");
  }

  const sessionData = await validateSession(sessionCookie.value);
  if (!sessionData) {
    redirect("/auth?mode=login&from=/admin");
  }

  const { user } = sessionData;

  // Strict Server-Side Authorisation Check (Step 10)
  if (user.role !== "ADMIN") {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <SiteHeader />
          <main className={styles.card}>
            <div className={styles.heroSection}>
              <span
                className={styles.badge}
                style={{ background: "#ffebee", color: "#c62828", borderColor: "#ffcdd2" }}
              >
                Access Refused — 403 Forbidden
              </span>
              <h1 className={styles.heroHeading} style={{ color: "#c62828" }}>
                Staff Authorization Required
              </h1>
              <p className={styles.description}>
                You are currently signed in as an ordinary customer (<strong>{user.email}</strong>, role: <code>{user.role}</code>).
              </p>
            </div>

            <div
              role="alert"
              style={{
                background: "#fff5f5",
                border: "1px solid #ffcdd2",
                borderRadius: "8px",
                padding: "1.25rem",
                marginTop: "1rem",
                color: "#7f1d1d",
              }}
            >
              <h2 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "0.5rem" }}>
                Server-Enforced Role-Based Access Control (RBAC)
              </h2>
              <p style={{ margin: "0 0 1rem 0", lineHeight: "1.5", fontSize: "0.95rem" }}>
                Merely possessing a valid session or knowing the URL path <code>/admin</code> does not grant administrative privileges.
                The Swash application server inspects your database role on every request and actively rejects unauthorized attempts
                to view customer records, dispatch lists, or operational controls.
              </p>
              <div style={{ display: "flex", gap: "1rem" }}>
                <Link
                  href="/account"
                  className={styles.submitButton}
                  style={{
                    display: "inline-block",
                    width: "auto",
                    padding: "0.5rem 1.25rem",
                    textDecoration: "none",
                  }}
                >
                  Return to Customer Portal
                </Link>
                <Link
                  href="/"
                  className={styles.navButton}
                  style={{ textDecoration: "none" }}
                >
                  Home
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Render Admin View for authorized staff
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <SiteHeader />
        <main>
          <AdminDashboard adminUser={user} />
        </main>
      </div>
    </div>
  );
}

