---
trigger: model_decision
description: Load when implementing or modifying laundry orders, payments, subscriptions, allowances, collections, deliveries, or related business workflows.
---

# SWASH — Business Operations Rules

## 1. Record Relationships

Every order must be correctly associated with:

- Its customer.
- Its payment records.
- Its subscription where applicable.
- Its current operational status.
- Its collection and delivery details where applicable.

Keep these relationships consistent across customer-facing and staff-facing functionality.

## 2. Orders

- Associate every order with the authenticated customer who owns it.
- Maintain accurate order statuses.
- Preserve relevant order history.
- Reflect actual operational progress.
- Do not mark an order collected or delivered without confirmation.
- Prevent duplicate order submissions.
- Do not invent missing order information.

## 3. Payments

- Verify payment outcomes through a trusted payment mechanism.
- Distinguish successful, pending, failed, and abandoned payment attempts.
- Keep payment attempts separate from confirmed transactions.
- Prevent duplicate payment processing.
- Do not mark an order as paid based on an unverified client response.
- Do not update subscription allowances based on unverified payments.
- Handle interrupted payments and network failures explicitly.

## 4. Subscriptions

- Track each customer's subscription plan and status.
- Maintain accurate allowance and usage records.
- Prevent duplicate or incorrect allowance deductions.
- Reflect actual subscription expiry and renewal status.
- Apply only approved rules for renewals, expiry, rollover, and allowance deductions.
- Do not invent subscription benefits or policies.

## 5. Collections and Deliveries

- Associate arrangements with the correct order and customer.
- Display only confirmed arrangements as confirmed.
- Distinguish requested, scheduled, and completed arrangements where supported by the approved workflow.
- Never invent collection or delivery times.
- Preserve relevant arrangement updates.

## 6. Business Rules

The approved PRD and feature specifications define operational behaviour.

When a rule is missing or ambiguous:

- Identify the missing decision.
- Explain what implementation depends on it.
- Request clarification before introducing the rule.

Do not independently decide pricing, subscription benefits, renewal policies, or operational exceptions.

## 7. Reliability

- Keep related business updates consistent.
- Use transactions when multiple records must change together.
- Handle failed and interrupted operations explicitly.
- Prevent duplicate processing.
- Do not report an operation as successful until the relevant system confirms it.

## 8. Verification

Test relevant workflows, including:

- Order creation and status changes.
- Payment success and failure.
- Duplicate payment notifications.
- Subscription allowance updates.
- Subscription expiry and renewal where implemented.
- Collection and delivery updates.
- Correct relationships between customers, orders, payments, and subscriptions.