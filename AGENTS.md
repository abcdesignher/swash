# AGENTS.md

# SWASH — Project Context & Agent Instructions

## 1. Project Overview

Swash is a subscription-led laundry service in Nigeria that simplifies how individuals, families, and small businesses manage laundry services.

The product is being developed as a web application that connects customers with laundry operations through a unified digital experience.

Customers should be able to manage their laundry orders, payments, subscriptions, collections, and deliveries without repeatedly contacting staff for information.

Swash also includes an AI-powered assistant that helps customers access relevant business information and their personal account records.

## 2. Target Audience

The primary audience consists of Nigerian professionals aged 25–40.

Their characteristics:

- Primarily use laptops and desktop computers.
- Are comfortable with basic computer operations and familiar web interfaces.
- May experience slow or unreliable internet connections.
- Want to manage laundry services, understand costs, and receive reliable updates without unnecessary communication.

The interface should feel familiar, simple, reassuring, and easy to navigate.

## 3. Core Product Requirement

**Accurate and connected customer records are the foundation of Swash.**

Every customer order must be correctly connected to:

- The customer who placed it.
- Its associated payment records.
- The customer's subscription and available allowance.
- Its current operational status.
- Relevant collection and delivery information.

The customer interface, staff interface, database, and AI assistant must reflect consistent information.

An action must not be presented as successful until the system has confirmed that it was completed.

## 4. Product Capabilities

Swash is expected to support the following areas:

### Customer Management
- Customer registration and authentication.
- Customer profiles and account information.
- Access to personal orders, payments, and subscriptions.

### Laundry Orders
- Order creation and management.
- Order status tracking.
- Collection and delivery arrangements.
- Access to relevant order history.

### Payments
- Payment initiation and verification.
- Payment history.
- Tracking of successful, pending, failed, and abandoned payment attempts.

### Subscriptions
- Subscription plans and management.
- Allowance tracking.
- Subscription status and usage history.

Specific business rules concerning pricing, renewals, expiry, rollover, and allowance calculations must be established from approved product requirements. Do not invent them.

### AI Assistant
The assistant uses Retrieval-Augmented Generation (RAG) to retrieve relevant information from approved business documents and authenticated customer records.

It should help customers answer questions such as:

- Pricing: How much does it cost to wash my duvet?
- Subscriptions: How much of my allowance is remaining?
- Orders: What is the status of my laundry order?

The assistant must respect customer permissions, provide reliable answers, acknowledge missing information, and never fabricate business or customer records.

## 5. Technology Stack

The following technologies are mandatory:

- Next.js with App Router.
- TypeScript.
- Prisma ORM.
- PostgreSQL.

Do not propose alternatives to these technologies.

Additional technologies and services may be introduced when necessary. Any addition must have a free or free-tier option and a clear justification.

Refer to `RULES.md` for implementation constraints and technical standards.

## 6. Project Sources of Truth

Use the following resources when working on Swash:

| Resource | Purpose |
|---|---|
| `business-brief.md` | Business definition, target audience and core requirements |
| `06-tokens-complete.json` | Exported Figma design tokens |
| `RULES.md` | Development standards and implementation constraints |
| `SKILLS.md` | Reusable procedures for specialised tasks |
| Existing source code | Current implementation and established project structure |
| Product documentation | Approved feature requirements and technical decisions |

Before implementing a task, inspect the relevant documentation and existing code.

If two sources conflict, identify the conflict and ask for clarification. Do not silently choose one.

## 7. Design Direction

Swash should provide a simple, familiar, reassuring, and slightly expressive experience.

The visual direction draws inspiration from Nigerian Ankara fabrics, using rich brown, gold, and deep violet/purple.

The design system uses:

- Open Sans for readability.
- Playfair for expressive headings.
- An established Figma colour system.
- Defined typography and shadow styles.

The interface should prioritise:

- Clear information hierarchy.
- Readable layouts.
- Consistent components.
- Responsive behaviour.
- Lightweight pages.
- Helpful loading, error, and retry states.

The exported design tokens are the source of truth for visual implementation. Refer to `RULES.md` for their usage requirements.

## 8. Product Engineering Approach

Build Swash as a connected product, not a collection of independent screens.

Consider how each feature interacts with:

- Customer records.
- Order records.
- Payment records.
- Subscription records.
- Staff operations.
- The AI assistant.

Before implementing a feature, understand its place in the wider product.

Prioritise data consistency, clear system behaviour, maintainability, and a reliable customer experience over unnecessary complexity.

Do not implement functionality simply because it appears in a typical laundry application. It must serve an identified Swash requirement.

## 9. Agent Workflow

Follow this process when working on a task:

### Step 1: Understand
- Read the relevant project documentation.
- Inspect the existing implementation.
- Identify dependencies and affected areas.
- Understand how the requested feature relates to the wider product.

### Step 2: Plan
- Summarise your understanding of the task.
- Identify the files likely to be created or modified.
- Explain the proposed implementation.
- State assumptions and potential risks.

### Step 3: Clarify
- Ask questions when requirements are ambiguous.
- Do not invent missing business rules.
- Resolve conflicts with existing project decisions before proceeding.

### Step 4: Implement
- Follow the approved approach.
- Make focused changes.
- Reuse existing components and utilities where appropriate.
- Avoid unnecessary modifications outside the task scope.

### Step 5: Verify
- Test the implemented functionality.
- Check relevant user flows and edge cases.
- Verify that connected records remain consistent.
- Report failures and limitations honestly.

### Step 6: Document
- Update relevant documentation when decisions or implementation details change.
- Report files changed, important decisions, verification results, and outstanding issues.

## 10. Communication

When working with the product owner:

- Be direct and specific.
- Explain technical decisions in understandable language.
- Distinguish confirmed facts from assumptions.
- Identify risks and trade-offs.
- Challenge decisions when there is a clear product or technical reason.
- Avoid unnecessary explanations and repetitive status updates.
- Do not claim work is complete without verification.

## 11. Project Objective

Build Swash into a reliable, secure, maintainable web application that simplifies laundry management for Nigerian customers.

The product should deliver a connected experience in which customers can manage their services confidently, staff can maintain accurate operational records, and the AI assistant can provide useful answers grounded in verified information.

**Every implementation decision should contribute to that objective.**