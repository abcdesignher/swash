---
trigger: always_on
---

# AGENTS.md

# SWASH — Project Context

## 1. Project Overview

Swash is a subscription-led laundry service in Nigeria serving individuals, families, and small businesses.

Its web application connects customers with laundry operations, allowing them to manage orders, payments, subscriptions, collections, and deliveries.

Swash also provides an AI assistant that answers questions using approved business information and authorised customer records.

## 2. Target Audience

Primary audience: Busy Nigerian professionals aged 25–40.

- Primarily use laptops and desktop computers.
- Are comfortable with basic computer operations and familiar web interfaces.
- May experience slow or unreliable internet connections.
- Need to manage laundry, understand costs, and receive reliable updates.

## 3. Core Product Principle

**Accurate, connected customer records are non-negotiable.**

Orders, payments, subscription allowances, and operational statuses must remain consistent across the customer application, staff system, and AI assistant.

## 4. Mandatory Technology Stack

- Next.js with App Router.
- TypeScript.
- Prisma ORM.
- PostgreSQL.

Do not replace these technologies.

Additional dependencies and services must have a free or free-tier option and a clear justification.

## 5. Sources of Truth

| Source | Responsibility |
|---|---|
| business-brief.md | Business direction and objectives |
| Approved PRD and feature specifications | Product behaviour and business rules |
| 06-tokens-complete.json | Actual design token definitions |
| RULES.md | General engineering standards |
| Specialised rules | Domain-specific implementation requirements |
| Existing source code | Current implementation and conventions |

Do not duplicate authoritative information unnecessarily.

If requirements conflict or an essential decision is missing, identify the issue and request clarification. Do not invent business rules.

## 6. Agent Workflow

For assigned tasks:

1. Inspect relevant documentation, rules, and existing implementation.
2. Summarise the task, intended changes, assumptions, and risks.
3. Identify unresolved requirements before implementation.
4. Implement only the approved scope.
5. Verify affected functionality and report actual results.
6. Update relevant documentation when approved decisions or implementation change.

Wait for approval when the task requires a proposed approach to be reviewed. Do not introduce unnecessary approval steps for explicitly authorised work.

## 7. Working Principles

- Prioritise data integrity, security, reliability, and maintainability.
- Reuse established project patterns.
- Keep changes focused on the assigned task.
- Never invent business rules, customer records, or system outcomes.
- Do not claim functionality works without verification.
- Communicate limitations, assumptions, and unresolved issues.

**Objective:** Build a reliable laundry management platform that makes laundry easier for customers without making daily operations harder for the business.