"use client";

import Link from "next/link";
import styles from "@/app/page.module.css";
import { useAuth } from "@/context/AuthContext";

export default function SiteHeader() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className={styles.siteHeader}>
      <div className={styles.navBar}>
        <Link href="/" className={styles.logoLink} aria-label="Swash home">
          Swash
        </Link>
        <nav aria-label="Primary navigation" className={styles.navLinks}>
          <Link href="/" className={styles.navButton}>
            Home
          </Link>
          <Link href="/plans" className={styles.navButton}>
            Subscription Plans
          </Link>

          {isAuthenticated && user ? (
            <>
              <Link
                href="/admin"
                className={styles.navButton}
                title="Staff Portal (Restricted to Administrators)"
              >
                Staff Portal
              </Link>
              <Link href="/account" className={styles.navButton}>
                Account
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className={styles.navButton}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/auth?mode=login" className={styles.navButton}>
              Sign In
            </Link>
          )}
        </nav>
      </div>
      <p className={styles.tagline}>
        Subscription laundry pickup and delivery across Lagos.
      </p>
    </header>
  );
}
