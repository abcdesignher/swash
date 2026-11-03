# Technical Knowledge Gaps and Learning Plan

This document articulates eight specific areas of the Swash software architecture, security implementation, and infrastructure where my current understanding has concrete boundaries. Each topic defines the exact scope, what is currently understood, the specific unanswered technical questions, and the investigative methodology to resolve them.

---

## 1. Sliding-Window Rate Limiting Under Multi-Instance Serverless Autoscaling

### What the Topic Is
In-memory versus distributed rate-limiting architectures when Next.js Route Handlers are deployed across autoscaling serverless instances (such as Vercel Edge Functions, AWS Lambda, or multiple container replicas on Railway).

### What I Currently Understand
In `src/lib/rate-limit.ts`, Swash uses an in-memory sliding-window algorithm backed by a JavaScript `Map<string, number[]>`. It accurately tracks request timestamps per client IP, evicts timestamps older than 15 minutes, calculates remaining time for `Retry-After`, and blocks requests exceeding 5 attempts with HTTP 429.

### What I Do Not Understand
Because the in-process `Map` exists solely in the RAM of a single Node.js runtime, it does not synchronize across distributed container replicas or serverless workers. If a deployment autoscales to 10 instances behind an AWS Application Load Balancer or Vercel edge router, an attacker rotating TCP connections across instances can achieve $10 \times 5 = 50$ attempts before any single worker triggers rate limiting. Furthermore, cold starts purge in-memory maps completely.

### How I Would Investigate and Learn It
1. Review Redis sliding-window counter implementations using atomic Redis Lua scripts (`ZADD`, `ZREMRANGEBYSCORE`, `ZCARD`, `EXPIRE`) or Upstash Redis REST rate-limiting SDKs.
2. Benchmark network latency overhead of an external Redis roundtrip (~5–15 ms) versus local memory lookup (0.01 ms) within the Next.js request boundary.
3. Simulate distributed traffic locally by spinning up 3 parallel Next.js processes behind an Nginx round-robin reverse proxy and running an automated ApacheBench/k6 attack script.

---

## 2. Distributed Database Migration Locking and Transaction Isolation During Failures

### What the Topic Is
PostgreSQL table-level lock behavior (`AccessExclusiveLock`) and failure recovery semantics during schema migrations executed on high-concurrency production databases.

### What I Currently Understand
Prisma executes migrations using an advisory lock table (`_prisma_migrations`) and wraps individual DDL statements in transactions where supported by PostgreSQL. We verified the Expand $\rightarrow$ Backfill $\rightarrow$ Contract migration pattern to prevent table locks and avoid PostgreSQL Error 23502.

### What I Do Not Understand
I do not fully understand how PostgreSQL handles lock acquisition queuing when a migration requests an `AccessExclusiveLock` on a heavily queried table (such as `LaundryOrder` with hundreds of concurrent read/write transactions). If long-running analytical queries hold shared locks, does the pending migration lock block all subsequent customer read queries, causing connection pool exhaustion? Furthermore, if a multi-statement migration fails halfway through a non-transactional DDL statement (e.g. `CREATE INDEX CONCURRENTLY`), how does Prisma clean up partially constructed indexes without manual database administrator intervention?

### How I Would Investigate and Learn It
1. Study PostgreSQL official documentation on Lock Modes (`pg_locks`, `lock_timeout`, and `statement_timeout`).
2. Read real-world post-mortems from GitLab, Stripe, and Supabase regarding zero-downtime database migrations under high write loads.
3. Construct a stress test using `pgbench` to flood a local PostgreSQL table with 500 concurrent read/write queries while executing a schema alteration with a deliberately restricted `lock_timeout = 2s`.

---

## 3. WebAuthn / FIDO2 Passkey Integration vs. Traditional Password Hashing

### What the Topic Is
Replacing shared credential secrets and password-hashing pipelines with asymmetric public-key cryptography via WebAuthn / Passkeys for African e-commerce.

### What I Currently Understand
Swash implements RFC 9106 Argon2id password hashing with memory-hard parameters (`m=19456, t=2, p=1`), verified unique salts, and breach checks via HaveIBeenPwned. It requires hashing computation on the server and transmission of user passwords over HTTPS.

### What I Do Not Understand
I do not fully understand the exact handshake ceremony between the browser's `navigator.credentials.create()`, the platform authenticator (e.g. Apple Touch ID, Windows Hello, Android Biometrics), and the server-side challenge verification using `@simplewebauthn/server`. Specifically, how does passkey synchronization across multi-device ecosystems (i.e. a user switching between an Android phone and a Windows PC) affect account recovery when a user loses their physical hardware token, and how does passkey fallback operate when biometrics are unavailable?

### How I Would Investigate and Learn It
1. Read the W3C Web Authentication (WebAuthn) Level 3 Specification and FIDO Alliance architectural guidelines.
2. Build an isolated prototype repository implementing `@simplewebauthn/browser` and `@simplewebauthn/server` with Prisma PostgreSQL storage for WebAuthn public keys and credential counters.
3. Test enrollment, authentication, and cross-platform QR-code handshakes between mobile devices and desktop browsers.

---

## 4. Cross-Border Cloud Hosting and NDPA 2023 Cross-Border Data Transfer Rules

### What the Topic Is
Regulatory compliance under Section 41–43 of the Nigeria Data Protection Act 2023 when hosting customer data on international cloud providers (such as AWS us-east-1, GCP europe-west1, or Neon).

### What I Currently Understand
NDPA 2023 regulates the processing and storage of personal data of Nigerian residents. The Act emphasizes storage limitation, purpose limitation, and protection of citizen privacy. Swash retains financial accounting data for 6 years in accordance with CAMA 2020.

### What I Do Not Understand
Section 41 of the NDPA restricts the transfer of personal data from Nigeria to another country unless that country ensures an "adequate level of protection" approved by the Nigeria Data Protection Commission (NDPC), or specific exceptions apply (such as standard contractual clauses or explicit consent). I do not understand the exact legal classification of hosting PostgreSQL databases on international AWS/GCP regions outside Nigeria when those cloud providers maintain ISO 27001 and SOC 2 certifications, and whether a formal Data Protection Impact Assessment (DPIA) must be lodged with the NDPC before production launch.

### How I Would Investigate and Learn It
1. Review published regulatory guidance and circulars issued by the Nigeria Data Protection Commission (NDPC) regarding cross-border data transfer adequacy lists.
2. Read standard Nigerian legal analyses of the NDPA 2023 published by accredited Nigerian commercial law firms (e.g. Aluko & Oyebode, Banwo & Ighodalo).
3. Draft a formal Data Protection Impact Assessment (DPIA) template for Swash and review it with a qualified Nigerian privacy attorney.

---

## 5. Resilient Transactional Email Deliverability and DMARC / DKIM / SPF Alignment in Nigeria

### What the Topic Is
Achieving high inbox placement and sub-second deliverability for transactional verification codes sent to Nigerian domains and corporate email systems.

### What I Currently Understand
Swash uses Nodemailer with a background `EmailJob` queue to process outbound emails asynchronously, avoiding request latency. The email contains a cryptographically secure 6-digit code with a 15-minute expiration window.

### What I Do Not Understand
I do not fully understand why transactional emails sent to Nigerian corporate mail servers (e.g. corporate domains hosted on Microsoft 365 or private mail exchanges) frequently experience greylisting or quarantine delays, despite valid SPF records. Specifically, how do DKIM canonicalization algorithms (`relaxed/simple`), DMARC policy enforcement modes (`p=reject` vs. `p=quarantine`), and sender domain warm-up schedules affect initial deliverability for a newly registered `.ng` domain?

### How I Would Investigate and Learn It
1. Study RFC 6376 (DKIM), RFC 7208 (SPF), and RFC 7489 (DMARC) specifications.
2. Use email deliverability analysis tools (e.g. Mail-Tester, MXToolbox) to inspect raw message headers, DKIM cryptographic signatures, and reverse DNS (PTR) alignment.
3. Test deliverability across major Nigerian consumer mail providers (Gmail, Yahoo, Outlook) and corporate Microsoft Exchange servers under controlled sending volumes.

---

## 6. Long-Running Worker Processes vs. Serverless Schedulers for Deletion Jobs

### What the Topic Is
Operational mechanics of executing scheduled background jobs (such as the 14-day account deletion purge) within a serverless App Router deployment.

### What I Currently Understand
`runAccountDeletionJob()` is written as an idempotent, transaction-safe function that finds soft-deleted accounts past their grace period, purges transient tokens, and anonymizes order ledgers. It is safe to execute multiple times.

### What I Do Not Understand
In a serverless environment (like Vercel or AWS Lambda), there is no persistent Node.js daemon running continuously to execute `cron` intervals. If a scheduled cron trigger (e.g. Vercel Cron or GitHub Actions) invokes a serverless Route Handler that processes 10,000 pending account purges, the handler may exceed the maximum execution timeout (15–60 seconds). I do not understand how to architect chunked pagination and stateful cursor resumption so that large batch deletion jobs execute safely across multiple consecutive short-lived serverless invocations.

### How I Would Investigate and Learn It
1. Review chunked processing patterns using cursor-based database pagination (`take: 100`, `skip: 1`, `cursor: { id: lastProcessedId }`).
2. Study dedicated background worker architectures such as BullMQ (backed by Redis), Inngest, or AWS SQS + Lambda event-driven queues.
3. Implement a proof-of-concept chunked deletion worker that processes batches of 50 records per invocation, writing progress checkpoints to a `JobExecution` database model.

---

## 7. PostgreSQL Full-Text Search vs. pgvector Semantic Search for Laundry RAG Assistants

### What the Topic Is
Architectural trade-offs between lexical full-text indexing (PostgreSQL `tsvector` with BM25 ranking) and dense vector embeddings (`pgvector` with cosine similarity) for customer support retrieval-augmented generation.

### What I Currently Understand
Swash's database schema includes the `KnowledgeChunk` model (`documentSlug`, `sectionTitle`, `content`) designed to store approved business guidelines for an AI assistant.

### What I Do Not Understand
I do not understand the exact retrieval threshold where dense semantic vector search (e.g., using OpenAI or Gemini embeddings with `pgvector`) outperforms classic PostgreSQL trigram (`pg_trgm`) and full-text search (`tsvector`) for specific domain queries. For example, when a Nigerian customer asks: *"Can I give your rider my Agbada with heavy embroidery for standard wash?"*, does semantic vector search accurately capture the distinction between dry-cleaning restrictions and wash-and-fold allowances, or does it hallucinate false semantic similarity compared to exact lexical keyword matching?

### How I Would Investigate and Learn It
1. Read academic benchmarks comparing Hybrid Search (Reciprocal Rank Fusion of BM25 + Dense Vectors) against pure vector retrieval.
2. Install `pgvector` on a local PostgreSQL instance, generate 768-dimensional embeddings using the Gemini API, and create HNSW and IVFFlat index structures.
3. Evaluate retrieval accuracy (Precision@k and Recall@k) across 50 realistic Nigerian laundry customer queries using a Python evaluation harness.

---

## 8. Cryptographic Token Binding and Prevention of Stolen Cookie Replay via TLS Exporter

### What the Topic Is
Hardware-bound session authentication mechanisms (such as DPoP - Demonstrating Proof-of-Possession, or Token Binding) that prevent stolen session cookies from being replayed on adversary machines.

### What I Currently Understand
Swash configures session cookies with `HttpOnly`, `SameSite=Lax`, and `Secure` flags, and stores SHA-256 hashes in PostgreSQL. While this prevents JavaScript XSS theft and database rainbow attacks, if an adversary physically clones the cookie file from a compromised operating system, they can transmit the bearer cookie from another machine.

### What I Do Not Understand
I do not fully understand how Emerging standards like DPoP (RFC 9449) and Application-Layer TLS Token Binding bind session credentials to a client-side cryptographic private key stored in the browser's hardware Secure Enclave or TPM (Trusted Platform Module). Specifically, how does a Next.js server verify asymmetric client signatures on incoming HTTP requests without introducing severe CPU bottlenecks on high-traffic web applications?

### How I Would Investigate and Learn It
1. Read RFC 9449 (OAuth 2.0 Demonstrating Proof of Possession at the Application Layer).
2. Experiment with Web Crypto API (`window.crypto.subtle.generateKey`) to generate non-extractable client-side keypairs and attach signed JWT proof headers to sensitive operational requests.
3. Measure server-side signature verification throughput and latency under Node.js `node:crypto`.

