---
trigger: always_on
---

# RULES.md

# SWASH — General Engineering Rules

These rules apply to all implementation work.

## 1. Technology

- Use Next.js App Router, TypeScript, Prisma, and PostgreSQL.
- Do not replace the mandatory stack.
- Prefer existing dependencies and project conventions.
- Every additional dependency or service must have a free or free-tier option and a clear justification.
- Avoid unnecessary abstractions, packages, and infrastructure.

## 2. Code Quality

- Use TypeScript; avoid `any` unless justified.
- Use descriptive names and focused, reusable components.
- Keep code readable and maintainable.
- Avoid duplicated logic.
- Separate presentation, business logic, and data access where appropriate.
- Prefer Server Components; use Client Components only when necessary.
- Keep sensitive operations on the server.

## 3. Product Behaviour

- Follow approved product requirements and business rules.
- Do not invent functionality, policies, prices, or operational rules.
- Keep interfaces consistent with actual application state.
- Provide clear loading, empty, success, and error states.
- Design for unreliable network conditions.
- Prevent duplicate submissions where appropriate.
- Preserve recoverable user input after failures.

## 4. Reliability

- Handle expected errors explicitly.
- Do not silently swallow exceptions.
- Provide useful feedback when an operation fails.
- Do not display success before the relevant operation is confirmed.
- Avoid exposing internal errors or implementation details to customers.
- Keep logs useful without exposing secrets or unnecessary personal data.

## 5. Accessibility

- Use semantic HTML.
- Provide accessible labels for interactive elements and form fields.
- Associate validation errors with their fields.
- Support keyboard navigation and visible focus.
- Do not rely on colour alone to communicate meaning.
- Maintain readable contrast and heading hierarchy.

## 6. Verification

- Run relevant checks and tests before declaring work complete.
- Verify affected functionality and user flows.
- Check relevant edge cases.
- Report failed checks and unresolved issues honestly.
- Never fabricate test results or verification evidence.

## 7. Scope Control

- Inspect existing files before modifying them.
- Modify only files relevant to the assigned task.
- Preserve existing functionality unless a change is required.
- Do not perform unrelated refactoring.
- Do not overwrite existing work without understanding its purpose.

Follow the specialised rules when working in their respective domains.

### Typography

- Use Open Sans for body text and default headings.
- Reserve Playfair Display for occasional expression only; never use Playfair as the default heading font or when a sentence or heading has more than 5 words.

### Password Security

- Use Argon2id for password hashing.
- Use the `argon2` package for Node.js implementation.
- Never store plaintext passwords.
- Never use MD5, SHA-1, SHA-256 or SHA-512 alone for password storage.
- Never implement custom password-hashing or salting algorithms.
- Generate a unique cryptographically secure salt for every password.
- Allow the Argon2id library to generate and manage salts automatically.
- Use the following initial Argon2id configuration:
  - Memory cost: 19456 KiB
  - Time cost: 2
  - Parallelism: 1
- Store only the resulting encoded password hash in PostgreSQL.
- Verify passwords using the library's verification function.
- Perform password hashing and verification exclusively on the server.
- Never expose password hashes through API responses.
- Never log passwords or other authentication secrets.
- Benchmark password-hashing performance in the deployment environment.