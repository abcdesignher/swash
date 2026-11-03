import Link from "next/link";
import styles from "@/app/page.module.css";

export default function SiteHeader() {
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
          <Link href="/auth?mode=register" className={styles.navButton}>
            Account
          </Link>
        </nav>
      </div>
      <p className={styles.tagline}>
        Subscription laundry pickup and delivery across Lagos.
      </p>
    </header>
  );
}
