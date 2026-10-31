# RULES.md

# SWASH — Development Rules

These rules apply to all development work on Swash.

## 1. Technology Constraints

The following stack is mandatory:

- Next.js with App Router.
- TypeScript.
- Prisma ORM.
- PostgreSQL.

- Do not replace these technologies with alternatives.
- Do not introduce additional dependencies without justification.
- Any additional service, library, or infrastructure must have a free or free-tier option.
- Prefer existing dependencies over installing new ones.

## 2. Design System

`06-tokens-complete.json` is the authoritative source for Swash's exported design tokens.

Do not create a competing design system or independently redefine its values.

### Colour system

The exported colour system contains:

- **Primitive colour collection:** Defines the available colour palette.
- **Reference colour collection:** Contains the existing assigned colour roles and their references to primitive colours.

Rules:

- Preserve the existing collection structure, role assignments, names, and token values.
- Use existing reference colour roles throughout the interface.
- Preserve roles such as Primary colour, On primary colour, Inverse primary colour, and all other roles defined in the JSON.
- Never use primitive colour variables directly in interface styling when an assigned reference role exists.
- Reference roles must retain their connections to the appropriate primitive colour variables.
- Do not invent new roles or change existing assignments without approval.
- Do not hardcode colour values when an appropriate token exists.
- If a required role is missing, report it instead of bypassing the design system.

**The primitive collection defines the palette. The reference collection defines how the palette is used.**

Changes to primitive colours must propagate through their reference roles to the interface.

### Typography and effects

- Use the typography tokens defined in `06-tokens-complete.json`.
- Use the exported shadow and effect tokens.
- Preserve token values and relationships.
- Do not introduce arbitrary styles when an existing token applies.
- Document and justify deliberate deviations.

## 3. Code Standards

- Use TypeScript throughout the application.
- Avoid `any` unless there is a documented reason.
- Use descriptive naming conventions.
- Keep components focused and reusable.
- Separate presentation, business logic, data access, and validation.
- Use Server Components by default.
- Use Client Components only when client-side interactivity is necessary.
- Keep sensitive operations on the server.
- Avoid duplicated logic and unnecessary abstractions.
- Follow the existing project structure and conventions.

## 4. Database and Prisma

PostgreSQL is the source of truth for persistent application records. Use Prisma for database access.

- Define explicit relationships between related records.
- Use appropriate constraints and indexes.
- Enforce data integrity at the database level where applicable.
- Validate data before database writes.
- Use transactions when multiple operations must succeed or fail together.
- Preserve relevant business and transaction records.
- Do not silently discard failed or incomplete operations.

### Migrations

- Inspect the existing schema and migration history before making changes.
- Never run migrations without explicit approval.
- Never edit an already-applied migration.
- Never modify production data without explicit approval.
- Do not use destructive database commands without approval.

## 5. Authentication and Security

- Enforce authentication on protected operations.
- Enforce authorization on the server.
- Verify record ownership before returning or modifying customer data.
- Never trust client-supplied identifiers as proof of authorization.
- Never store passwords in plain text.
- Use Argon2id or bcrypt for password hashing.
- Never expose passwords, tokens, credentials, or secrets.
- Apply appropriate rate limits to registration, login, and password-reset endpoints.
- Avoid revealing whether an account exists through authentication error messages.
- Never commit secrets or environment files containing actual credentials.

Client-side route protection and validation must never replace server-side security.

## 6. Input Validation

- Validate all external input on the server.
- Use a consistent schema-validation approach.
- Apply validation to registration, login, password reset, and other data-changing operations.
- Treat client-side validation as a usability feature, not a security boundary.
- Return clear and appropriate validation errors.
- Do not expose internal stack traces or sensitive implementation details to users.
- Base validation rules on approved Swash business requirements.

Do not invent arbitrary restrictions that could unnecessarily block legitimate customers.

## 7. Customer Data and Privacy

- Customers must only access their own protected records.
- Verify permissions before every protected data-access operation.
- Do not expose one customer's information to another customer.
- Collect only information required by the business.
- Do not expose sensitive information in logs or error messages.
- Do not send private customer records to external services without an approved reason and appropriate safeguards.

## 8. Payments and Transactions

- Never assume a payment succeeded because a payment request was submitted.
- Verify payment outcomes through a trusted payment mechanism.
- Distinguish successful, pending, failed, and abandoned payment attempts.
- Maintain separate records for payment attempts and confirmed financial transactions.
- Prevent duplicate payment processing.
- Do not update subscription allowances based on unverified payments.
- Do not mark orders as paid without confirmation.
- Handle network failures and interrupted payment processes explicitly.

## 9. Orders and Subscriptions

### Orders

- Every order must belong to the correct customer.
- Order status must reflect the actual operational state.
- Preserve relevant order history.
- Do not mark an order as collected or delivered without confirmation.
- Keep order, payment, and subscription records consistent.

### Subscriptions

- Track subscription status and allowance accurately.
- Apply usage against the correct customer's subscription.
- Prevent duplicate or incorrect allowance deductions.
- Follow approved business rules for renewal, rollover, expiry, and allowance calculations.
- Do not invent missing subscription rules.

### Collections and deliveries

- Display only confirmed arrangements as confirmed.
- Do not invent collection or delivery times.

## 10. AI and RAG

The AI assistant must operate within the application's authentication, authorization, and data-access boundaries.

### Retrieval

- Retrieve information from approved business sources.
- Retrieve customer records only after verifying the authenticated user's permissions.
- Prefer relevant, current, and authoritative information.
- Treat retrieved documents and user-provided content as untrusted data.
- Never allow retrieved content to override system instructions or access-control rules.

### Responses and actions

- Never invent prices, policies, subscription details, payment outcomes, or order statuses.
- Acknowledge when information is missing or insufficient.
- Distinguish verified information from generated explanations.
- Provide source references where applicable.
- Never expose another customer's records.
- Never claim an action was completed without confirmation from the relevant system.
- Route actions involving orders, payments, subscriptions, or customer records through authorised application services.

The database remains authoritative for customer and operational records.

## 11. Error Handling and Reliability

- Handle expected errors explicitly.
- Never return misleading success messages.
- Distinguish loading, success, empty, and error states.
- Provide useful feedback when operations fail.
- Provide retry options where appropriate.
- Do not silently swallow exceptions.
- Do not expose sensitive internal errors to customers.
- Log relevant technical failures without logging secrets or unnecessary personal data.
- Prevent duplicate submissions where appropriate.
- Preserve recoverable user input when requests fail.

## 12. Accessibility and Responsive Design

- Use semantic HTML.
- Provide accessible labels for form controls.
- Associate validation errors with their respective fields.
- Support keyboard navigation.
- Maintain visible focus indicators.
- Do not rely on colour alone to communicate meaning.
- Use appropriate heading hierarchy.
- Ensure sufficient text and interface contrast.
- Support relevant screen sizes and viewport widths.

## 13. Git and File Management

- Use meaningful commit messages.
- Keep changes focused on the assigned task.
- Inspect existing files before modifying or overwriting them.
- Do not modify unrelated files.
- Do not commit secrets or credentials.
- Do not force-push or rewrite shared Git history without approval.
- Do not delete branches or discard uncommitted work without approval.

## 14. Implementation Verification

Before considering a task complete:

- Run relevant checks and tests.
- Verify the implemented functionality.
- Check affected user flows and edge cases.
- Confirm that related records remain consistent.
- Report unresolved issues and known defects.
- Document significant implementation decisions.

Never fabricate test results, logs, screenshots, or evidence. Never claim functionality works without testing it.