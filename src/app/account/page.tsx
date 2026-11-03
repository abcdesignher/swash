import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import AccountDashboard from "@/components/AccountDashboard";
import styles from "@/app/page.module.css";

export const metadata: Metadata = {
  title: "My Account | Swash Laundry",
  description: "Manage your Swash laundry subscription, active sessions, and account security.",
};

export default function AccountPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <SiteHeader />
        <main>
          <AccountDashboard />
        </main>
      </div>
    </div>
  );
}

