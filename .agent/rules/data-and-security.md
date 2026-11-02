---
trigger: model_decision
description: Load when working on database models, Prisma, authentication, authorisation, customer records, data validation, or sensitive information.
---

# SWASH — Data and Security Rules

## 1. Database

- PostgreSQL is the source of truth for persistent application records.
- Use Prisma for database access.
- Define explicit relationships, appropriate constraints, and indexes.
- Validate data before database writes.
- Enforce data integrity at the database level where applicable.
- Use transactions when related operations must succeed or fail together.
- Preserve relevant customer, order, subscription, and financial records.

## 2. Authentication and Authorisation

- Protect routes and operations that require authentication.
- Enforce authorisation on the server.
- Verify record ownership before accessing or modifying customer data.
- Never trust client-supplied identifiers as proof of permission.
- Apply appropriate rate limits to authentication and password-reset operations.
- Avoid exposing whether an account exists through authentication errors.

Client-side checks must never replace server-side authorisation.

## 3. Customer Privacy

- Customers must only access their own private records.
- Never expose another customer's information through queries, responses, logs, or AI retrieval.
- Collect only information required for the service.
- Protect credentials, tokens, and environment secrets.
- Never store plaintext passwords.
- Do not send customer data to external services without an approved reason and appropriate safeguards.

## 4. Input Validation

- Validate all external input on the server.
- Use a consistent schema-validation approach.
- Validate data before database writes and sensitive operations.
- Do not rely solely on client-side validation.
- Base restrictions on approved product requirements.
- Do not introduce arbitrary restrictions that block legitimate operations.

## 5. Database Changes

- Inspect the existing schema and migration history before making changes.
- Never edit an already-applied migration.
- Do not run migrations without explicit approval.
- Do not modify production data or execute destructive database commands without approval.
- Preserve existing records and relationships when changing schemas.

## 6. Data Integrity

- Keep related records consistent.
- Prevent duplicate or invalid operations.
- Do not silently discard failed or incomplete transactions.
- Use appropriate transactions and constraints to protect related updates.
- Treat database records as authoritative over client-side or AI-generated information.

## 7. Verification

For affected functionality, verify:

- Correct customer ownership.
- Authorised and unauthorised access.
- Valid and invalid inputs.
- Expected database relationships.
- Successful and failed writes.
- Relevant privacy boundaries.