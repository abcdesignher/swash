# Security Controls Deliberately Not Implemented (Task 04, Step 12)

This document transparently records four enterprise security controls that were evaluated during Task 04 design but deliberately deferred. None of these controls are described as existing features.

---

## 1. SMS / WhatsApp Two-Factor Authentication (OTP)

- **What the control does:** Sends a 6-digit one-time passcode via SMS or WhatsApp Business API to the customer's phone number during registration and login.
- **Why not justified at this stage:**
  - Significant recurring per-message cost (approx. ₦4–₦15 per SMS via Termii or Twilio in Nigeria), which violates the project principle of keeping startup operational overhead low.
  - Nigerian telco SMS delivery suffers from frequent carrier routing delays (DND restrictions, network blackouts), causing customer signup abandonment.
- **What risk remains:** An attacker who compromises a customer's email inbox can take over their Swash account without needing access to their physical phone.
- **Trigger for implementation:** When Swash launches high-value corporate subscriptions or allows customers to store digital wallet balances exceeding ₦100,000.

---

## 2. Hardware WebAuthn / Passkeys / FIDO2 Authentication

- **What the control does:** Replaces or supplements passwords with cryptographic biometric hardware tokens (Face ID, Windows Hello, YubiKeys).
- **Why not justified at this stage:**
  - Adds substantial client-side implementation complexity and potential cross-browser compatibility hurdles for Swash's non-technical customer base.
  - Primary target audience uses standard desktop and laptop browsers where biometric hardware is not universally available.
- **What risk remains:** Susceptibility to sophisticated phishing attacks that trick users into entering passwords on lookalike domains.
- **Trigger for implementation:** When native mobile apps (iOS / Android) are launched, where biometric hardware (FaceID / Fingerprint) is standard and frictionless.

---

## 3. Distributed Redis Rate Limiting (Token Bucket via Upstash/Valkey)

- **What the control does:** Shares sliding-window rate limit counters across multiple server instances in an atomic Redis cluster.
- **Why not justified at this stage:**
  - Swash currently operates on a single Node.js runtime process; in-memory sliding-window tracking (`src/lib/rate-limit.ts`) is completely free, introduces 0ms network latency, and requires zero cloud infrastructure provisioning.
- **What risk remains:** If the Node.js server process restarts, rate limit counters reset to zero. Furthermore, scaling horizontally across multiple container replicas will allow attackers to distribute requests across instances.
- **Trigger for implementation:** Moving to multi-instance cloud deployments (e.g. AWS ECS with autoscaling or Vercel serverless multi-region functions).

---

## 4. Strict Country IP Geofencing (Blocking non-Nigerian IP Addresses)

- **What the control does:** Uses MaxMind GeoIP or Cloudflare WAF to drop all traffic originating outside Nigeria.
- **Why not justified at this stage:**
  - High rate of false positives: Nigerian diaspora professionals living in the UK, US, or Canada frequently manage and pay for laundry subscriptions for their elderly parents or relatives living in Lagos.
  - Nigerian professionals frequently use corporate VPNs whose exit nodes are located in London, Frankfurt, or Johannesburg.
- **What risk remains:** Endpoints are exposed to global automated credential stuffing botnets scanning public IP ranges.
- **Trigger for implementation:** If telemetry demonstrates automated volumetric DDoS attacks originating from specific high-risk Autonomous System Numbers (ASNs) with zero legitimate Nigerian user traffic.

