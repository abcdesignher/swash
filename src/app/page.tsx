import Link from "next/link";
import EnquiryForm from "@/components/EnquiryForm";
import SiteHeader from "@/components/SiteHeader";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <SiteHeader />

        <main className={styles.card}>
          <section
            aria-labelledby="welcome-heading"
            className={styles.heroSection}
          >
            <span className={styles.badge}>Subscription Laundry Service</span>
            <h1 id="welcome-heading" className={styles.heroHeading}>
              Effortless laundry for busy professionals, families, and small
              businesses
            </h1>
            <p className={styles.description}>
              Manage scheduled collections, monthly item allowances, and
              verified payments in one connected record.
            </p>
            <div className={styles.actionRow}>
              <Link href="/plans" className={styles.secondaryButton}>
                Compare Subscription Plans
              </Link>
            </div>
          </section>

          <section
            className={styles.enquirySection}
            aria-labelledby="enquiry-heading"
          >
            <h2 id="enquiry-heading" className={styles.sectionHeading}>
              Request subscription or service details
            </h2>
            <EnquiryForm />
          </section>
        </main>
      </div>
    </div>
  );
}
