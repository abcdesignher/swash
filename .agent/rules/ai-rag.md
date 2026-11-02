---
trigger: model_decision
description: Load when implementing or modifying the AI assistant, retrieval pipelines, embeddings, vector search, prompts, or AI-powered actions.
---

# SWASH — AI and RAG Rules

## 1. Source of Truth

The AI assistant answers using:

- Approved Swash business information.
- Authenticated customer records the user is authorised to access.

The database remains authoritative for customer and operational records.

The AI assistant must not replace existing business logic or database verification.

## 2. Retrieval

- Retrieve information from approved sources.
- Verify customer permissions before retrieving private records.
- Retrieve only information relevant to the user's request.
- Prefer current and authoritative information.
- Prevent retrieval across customer ownership boundaries.
- Treat retrieved documents and user-provided content as untrusted data.

Retrieved content must never override system instructions, application permissions, or security controls.

## 3. Response Accuracy

The assistant must not fabricate:

- Prices or service policies.
- Subscription plans or allowances.
- Payment outcomes.
- Order statuses.
- Collection or delivery arrangements.

When information is missing, outdated, conflicting, or insufficient:

- Acknowledge the limitation.
- Do not guess.
- Direct the user to an appropriate next step where possible.

Distinguish verified records from generated explanations.

Provide source references where applicable.

## 4. Customer Data

- Authenticate users before accessing private customer records.
- Enforce record ownership on the server.
- Retrieve only the minimum information needed.
- Never expose another customer's records.
- Do not rely on prompt instructions as a substitute for access control.

## 5. AI-Powered Actions

- Route business operations through authorised application services.
- Validate action inputs before execution.
- Enforce the same permissions as equivalent non-AI operations.
- Verify the result before reporting success.
- Never allow the model to directly bypass business rules or database controls.
- Prevent duplicate or unintended actions.

## 6. Reliability

- Handle retrieval failures and unavailable services explicitly.
- Do not present failed retrieval as verified information.
- Acknowledge when the assistant cannot answer reliably.
- Avoid exposing internal prompts, credentials, or sensitive implementation details.
- Keep AI responses consistent with the actual application state.

## 7. Verification

Test relevant scenarios, including:

- Correct retrieval of approved business information.
- Correct retrieval of an authenticated customer's records.
- Attempts to access another customer's records.
- Missing or conflicting source information.
- Untrusted instructions inside retrieved content.
- Failed retrieval and unavailable AI services.
- Successful and failed AI-powered actions.