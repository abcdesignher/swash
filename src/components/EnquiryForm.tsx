"use client";

import { useState, type FormEvent } from "react";
import styles from "@/app/page.module.css";

interface CreatedEnquiry {
  id: string;
  fullName: string;
  email: string;
  serviceType: string;
  notes: string | null;
  createdAt: string;
}

export default function EnquiryForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [serviceType, setServiceType] = useState("Individual Subscription");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdRecord, setCreatedRecord] = useState<CreatedEnquiry | null>(
    null
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setCreatedRecord(null);

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          serviceType,
          notes,
        }),
      });

      const payload = (await response.json()) as {
        message?: string;
        error?: string;
        enquiry?: CreatedEnquiry;
      };

      if (response.status !== 201 || !payload.enquiry) {
        setErrorMessage(
          payload.error ??
            `Request failed with status ${response.status}. Your enquiry was not saved.`
        );
        return;
      }

      setCreatedRecord(payload.enquiry);
      setFullName("");
      setEmail("");
      setServiceType("Individual Subscription");
      setNotes("");
    } catch {
      setErrorMessage(
        "Network error while contacting Swash. Your input has been preserved—please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.fieldGroup}>
        <label htmlFor="enquiry-full-name" className={styles.label}>
          Full name
        </label>
        <input
          id="enquiry-full-name"
          name="fullName"
          type="text"
          required
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="e.g. Adebayo Ogunlesi"
          className={styles.input}
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="enquiry-email" className={styles.label}>
          Email address
        </label>
        <input
          id="enquiry-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g. adebayo@example.com"
          className={styles.input}
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="enquiry-service-type" className={styles.label}>
          Who is this laundry plan for?
        </label>
        <select
          id="enquiry-service-type"
          name="serviceType"
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          className={styles.select}
          disabled={isSubmitting}
        >
          <option value="Individual Subscription">
            Individual (1–2 people)
          </option>
          <option value="Family Subscription">
            Family Household (3+ people)
          </option>
          <option value="Small Business Subscription">
            Small Business / Office
          </option>
        </select>
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="enquiry-notes" className={styles.label}>
          Pickup area or special items (optional)
        </label>
        <textarea
          id="enquiry-notes"
          name="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Saturday pickup in Lekki or duvet wash question"
          className={styles.textarea}
          disabled={isSubmitting}
        />
      </div>

      {errorMessage && (
        <div className={styles.errorBanner} role="alert" aria-live="assertive">
          <p className={styles.bannerTitle}>Enquiry not saved</p>
          <p className={styles.bannerBody}>{errorMessage}</p>
        </div>
      )}

      {createdRecord && (
        <div className={styles.successBanner} role="status" aria-live="polite">
          <p className={styles.bannerTitle}>
            Enquiry saved to PostgreSQL (HTTP 201)
          </p>
          <p className={styles.bannerBody}>
            Record ID: <code>{createdRecord.id}</code> — Created at{" "}
            <code>{createdRecord.createdAt}</code>
          </p>
        </div>
      )}

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving enquiry..." : "Request Service Information"}
      </button>
    </form>
  );
}
