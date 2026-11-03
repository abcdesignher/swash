import type { Metadata } from "next";
import { Suspense } from "react";
import VerifyCodeForm from "@/components/VerifyCodeForm";
import SiteHeader from "@/components/SiteHeader";
import styles from "@/app/page.module.css";

export const metadata: Metadata = {
  title: "Verify Email Address | Swash Laundry",
  description: "Enter your unique verification code to activate your Swash laundry subscription.",
};

export default function VerifyPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <SiteHeader />

        <main className={styles.card}>
          <section aria-labelledby="verify-heading" className={styles.heroSection}>
            <span className={styles.badge}>Security Verification</span>
            <h1 id="verify-heading" className={styles.heroHeading}>
              Verify your email address
            </h1>
            <p className={styles.description}>
              Enter the unique verification code sent to your email to activate your account.
            </p>
          </section>

          <Suspense fallback={<p className={styles.description}>Loading verification form...</p>}>
            <VerifyCodeForm />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
