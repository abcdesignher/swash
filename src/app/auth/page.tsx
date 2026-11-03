import type { Metadata } from "next";
import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";
import SiteHeader from "@/components/SiteHeader";
import styles from "@/app/page.module.css";

export const metadata: Metadata = {
  title: "Account Registration & Sign In",
  description:
    "Create your Swash laundry subscription account or sign in to manage collections, allowances, and payments.",
  alternates: {
    canonical: "/auth",
  },
  openGraph: {
    title: "Account Registration & Sign In | Swash Laundry",
    description:
      "Create your Swash laundry subscription account or sign in to manage collections, allowances, and payments.",
    url: "https://swash.ng/auth",
    siteName: "Swash",
    locale: "en_NG",
    type: "website",
  },
};

export default function AuthPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <SiteHeader />

        <main className={styles.card}>
          <section aria-labelledby="auth-heading" className={styles.heroSection}>
            <span className={styles.badge}>Customer Account</span>
            <h1 id="auth-heading" className={styles.heroHeading}>
              Manage your Swash laundry subscription in one place
            </h1>
            <p className={styles.description}>
              Register for scheduled Lagos pickups or sign in to view your
              monthly item allowance and payment status.
            </p>
          </section>

          <Suspense
            fallback={
              <p className={styles.description}>Loading account form...</p>
            }
          >
            <AuthForm />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

