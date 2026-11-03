import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.badge}>Subscription Laundry Service</span>
          <h1 className={styles.brandTitle}>Swash</h1>
          <p className={styles.tagline}>
            A simpler, smarter laundry experience for Nigeria.
          </p>
        </header>

        <main className={styles.card}>
          <section aria-labelledby="welcome-heading">
            <h2 id="welcome-heading" className={styles.sectionHeading}>
              Effortless laundry for busy professionals, families, and small businesses
            </h2>
          </section>

          <p className={styles.description}>
            Swash brings laundry orders, payments, subscription allowances, and
            collection or delivery arrangements into one connected experience,
            supported by an AI assistant grounded in your authorised records.
          </p>

          <aside className={styles.notice} aria-label="Service principle">
            <p className={styles.noticeText}>
              Every order links directly to its payment, subscription allowance,
              and current operational status for reliable, transparent updates.
            </p>
          </aside>
        </main>
      </div>
    </div>
  );
}

