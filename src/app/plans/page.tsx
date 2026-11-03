import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import styles from "@/app/page.module.css";

export const metadata: Metadata = {
  title: "Subscription Plans & Allowance Tiers",
  description:
    "Compare Swash laundry subscription tiers for individuals, families, and small businesses in Nigeria.",
  alternates: {
    canonical: "/plans",
  },
  openGraph: {
    title: "Subscription Plans & Allowance Tiers | Swash Laundry",
    description:
      "Compare Swash laundry subscription tiers for individuals, families, and small businesses in Nigeria.",
    url: "https://swash.ng/plans",
    siteName: "Swash",
    locale: "en_NG",
    type: "website",
  },
};

export default function PlansPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <SiteHeader />

        <main className={styles.card}>
          <section aria-labelledby="plans-heading" className={styles.heroSection}>
            <span className={styles.badge}>Monthly Laundry Allowances</span>
            <h1 id="plans-heading" className={styles.heroHeading}>
              Subscription tiers tailored to your weekly laundry volume
            </h1>
            <p className={styles.description}>
              Every Swash plan tracks your remaining allowance, scheduled
              collections, and verified payment status in one connected record.
            </p>
          </section>

          <section
            aria-label="Subscription categories"
            className={styles.planGrid}
          >
            <article className={styles.planItem}>
              <h2 className={styles.sectionHeading}>Individual Professionals</h2>
              <p className={styles.description}>
                Built for busy professionals managing workwear and everyday
                garments with predictable scheduled pickups.
              </p>
            </article>

            <article className={styles.planItem}>
              <h2 className={styles.sectionHeading}>Families &amp; Households</h2>
              <p className={styles.description}>
                Shared household item allowances with clear tracking for regular
                garments and special household items such as duvets.
              </p>
            </article>

            <article className={styles.planItem}>
              <h2 className={styles.sectionHeading}>Small Businesses</h2>
              <p className={styles.description}>
                Recurring linen, uniform, and towel care with connected order
                and invoice records for reliable operations.
              </p>
            </article>
          </section>

          <div className={styles.actionRow}>
            <Link href="/#enquiry-heading" className={styles.submitButton}>
              Request Plan Details
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

