---
trigger: model_decision
description: Load when configuring, reading, modifying, or documenting environment variables, .env files, .env.example, database connection strings, API keys, or runtime secrets.
---

# SWASH — Environment Variable Rules

## 1. Secret Protection

- Never commit `.env`, `.env.local`, `.env.development`, `.env.production`, or any file containing real credentials, API keys, tokens, or connection passwords to version control.
- Verify that `.env*` (except `.env.example`) is listed in `.gitignore` before staging or committing files.
- Never output, log, or echo secret environment variable values in terminal evidence files, server logs, client responses, or documentation.

## 2. Documentation and `.env.example`

- Maintain `.env.example` in the repository root with every required environment variable name and a safe placeholder value.
- Document every required environment variable name and its purpose in the main `README.md`, never its secret value.
- Update `.env.example` and `README.md` whenever a new environment variable is introduced or removed.

## 3. Server vs. Client Boundary

- Keep database connection strings (`DATABASE_URL`), authentication secrets, payment keys, and AI provider keys strictly on the server.
- Never prefix sensitive variables with `NEXT_PUBLIC_`.
- Only prefix variables with `NEXT_PUBLIC_` when the value is explicitly safe and intended to be embedded in client-side browser bundles.

## 4. Validation and Failure Handling

- Validate that required environment variables are present on the server before executing operations that depend on them.
- Fail explicitly with a safe, clear server log message when a required environment variable is missing or malformed.
- Do not expose raw connection strings, hostnames, or credential details in client-facing error responses.
- During controlled local failure testing (such as simulating an unavailable database connection), restore `.env` to its working state immediately after capturing the required diagnostic evidence.

