# SWASH — Five-Task Build, Evidence and Assessment Guide

## 1. Purpose

This document defines five connected tasks for building, testing, documenting, and defending the Swash application.

The goal is not simply to produce a working laundry-service web app. The goal is to produce a professional, verifiable engineering project that demonstrates the ability to:

- Translate business requirements into a functional product.
- Direct AI coding agents and verify their work.
- Build and maintain a design system.
- Structure a repository and diagnose application behaviour.
- Implement accessible forms and client-side validation.
- Protect the application through server-side validation and security controls.
- Manage authentication, sessions, customer data, and account deletion.
- Explain technical decisions using evidence from the actual implementation.

The five tasks must be completed in sequence because each task produces work that the next task uses.

**Do not treat this as permission to build the entire product in one pass.** Each task has a defined scope, implementation steps, documentation requirements, and evidence deliverables.

---

# 2. Swash Context and Non-Negotiable Constraints

## 2.1 The business

Swash is a subscription-led laundry service in Nigeria serving individuals, families, and small businesses.

The first version is a web application for customers and authorised staff to manage laundry services, orders, payments, subscriptions, collections, and deliveries.

The primary audience is Nigerian professionals aged 25–40 who are comfortable with basic computer operations. Most will use laptops or desktop computers, although the application must remain responsive. Some users may have slow or unreliable internet connections.

## 2.2 The core product requirement

Swash must maintain accurate, connected customer records.

Every relevant order must be connected to the correct:

- Customer.
- Payment and payment attempts.
- Subscription or applicable service arrangement.
- Laundry order and its status.
- Collection and delivery details.

Customer-facing pages, staff operations, database records, and the AI assistant must not contradict one another.

## 2.3 Business workflows to use throughout the tasks

Derive all implementation decisions and validation rules from Swash's actual business requirements.

Relevant workflows include:

- Customer registration, login, and password recovery.
- Individual, family, and small-business subscriptions.
- Pay-per-order laundry requests.
- Special service or quotation requests.
- Subscription allowance and expiry.
- Laundry order creation and status tracking.
- Payment processing and payment history.
- Pickup and delivery arrangements.
- Customer records and order history.
- Staff access to authorised operational functions.
- Customer questions about pricing, subscriptions, orders, and delivery.

Do not introduce unrelated features merely to satisfy an assessment exercise.

## 2.4 Locked technology stack

Use only the following core stack:

- Next.js with the App Router.
- TypeScript.
- Prisma ORM.
- PostgreSQL.

Do not replace these technologies or propose alternatives.

Any additional technology must comply with the approved Swash requirements, including the free-tier or free-use constraint where applicable. Document its purpose, limitations, and expected impact as Swash grows.

## 2.5 Source-of-truth files

Before making changes, inspect the current repository and identify the authoritative files.

These include, where present:

- Business brief.
- Product requirements document.
- `AGENTS.md`.
- `RULES.md`.
- `SKILLS.md`.
- `06-tokens-complete.json`.
- Generated CSS variables.
- Other approved design-system files.
- Existing implementation and project documentation.

Treat approved project documents as the source of truth.

If two files conflict, do not silently choose one. Report the conflict and request clarification.

For design tokens, `06-tokens-complete.json` is the authoritative exported token source. Preserve its primitive colour collection, reference colour collection, existing role names, and token relationships.

Use existing reference roles in interface components rather than directly using primitive colour values wherever a reference role exists.

---

# 3. Rules for Working Through the Tasks

## 3.1 Inspect before implementing

At the beginning of each task:

1. Inspect the current repository.
2. Read relevant context and design-system files.
3. Identify what has already been implemented.
4. Compare the current state with the task requirements.
5. List completed, incomplete, incorrect, and unverified items.
6. Present a proposed implementation plan.
7. Wait for approval before making changes.

Do not recreate completed work unnecessarily.

## 3.2 Evidence must be genuine

Evidence must come from the actual Swash project and the machine on which it is being developed.

- Never fabricate terminal output, timestamps, process IDs, database records, HTTP responses, screenshots, or test results.
- Never invent measurements or claim a test passed without running it.
- Capture both failed and successful states where required.
- Save terminal output as text files, not screenshots of terminal text.
- Use screenshots for visual evidence.
- Use actual database records and identifiers.
- Record the commands used to produce evidence.
- If an exercise cannot be completed, explain why and identify what remains outstanding.

## 3.3 Record decisions as they happen

Maintain a decision log throughout each task.

For important decisions, document:

- The problem.
- The options considered.
- The decision made.
- Why it was chosen.
- The trade-off.
- When the decision would no longer be appropriate.

Do not reconstruct decisions at the end of a task.

## 3.4 Make deliberate failures only in controlled conditions

Some exercises require intentionally breaking part of the application.

Before doing so:

- Use a separate Git branch where specified.
- Confirm the working tree is in a safe state.
- Identify what is being changed.
- Capture the original state.
- Capture the broken state.
- Restore or fix the application.
- Capture the recovered state.
- Never merge a branch that the task explicitly requires to remain unmerged.

Do not deliberately break production data, real customer records, live payment systems, or production services.

## 3.5 Commit regularly

Use meaningful commits that describe actual changes.

The repository must demonstrate a genuine development process across multiple days.

Do not combine an entire task into one commit or create artificial commit history.

## 3.6 Know the implementation

The agent may write code, but the developer must understand it.

For every important feature, be able to explain:

- Where it is implemented.
- How it works.
- What data it reads or changes.
- What happens when it fails.
- What security or accessibility considerations apply.
- What remains incomplete.

---

# 4. Repository Structure

Use one public GitHub repository for Swash.

Maintain the following top-level structure:

```text
swash/
├── README.md
├── privacy.md
├── task-01-design-system/
│   ├── README.md
│   ├── docs/
│   └── evidence/
├── task-02-repository-and-scaffold/
│   ├── README.md
│   ├── docs/
│   └── evidence/
├── task-03-client-validation/
│   ├── README.md
│   ├── docs/
│   └── evidence/
├── task-04-server-security/
│   ├── README.md
│   ├── docs/
│   └── evidence/
├── task-05-sessions-compliance-defence/
│   ├── README.md
│   ├── docs/
│   └── evidence/
└── [application source files]
```

Adapt the exact folder placement to the existing Swash repository without unnecessarily moving working application files.

Each task folder must contain:

**README.md**
- What the task covers.
- What was implemented.
- Important decisions.
- What went wrong.
- Current completion status.
- Known defects.

**docs/**
- Technical explanations.
- Decision records.
- Implementation notes.
- Interview answers.
- Required task-specific documents.

**evidence/**
- Screenshots.
- Terminal output.
- Test results.
- Database evidence.
- Recordings or photographs where required.

Name evidence files so their contents are immediately clear.

---

# TASK 01 — DESIGN SYSTEM AND TOKEN INTEGRITY

**Working window: Five days**

## Objective

Build a complete, documented Swash design system, make it consumable by an AI coding agent, and prove that the agent actually uses it.

The design system must control the visual language of the application rather than merely provide a collection of colour values.

## Step 1: Document the business and design direction

Create:

`task-01-design-system/docs/business-brief.md`

Document:

- Swash's business model.
- Its target customers.
- The devices and connection conditions they use.
- The most important customer workflow.
- Three recurring questions customers ask that only Swash can answer.
- The intended interface personality and why it suits the business.

Keep the brief within 400 words.

Use the approved Swash business brief. Do not invent a different business model.

## Step 2: Build and document the colour system

Use the existing Figma design system.

Verify and document:

1. The Swash brand colour and its origin.
2. The pinned primary colour and the resulting palette.
3. The generated tonal palettes and the reason for the selected number of tones.
4. Functional colours, including error, warning, and success.
5. Semantic colour roles required by the interface.
6. Contrast ratios for every role pair used.

Capture the palette before and after pinning the brand colour if this evidence has not already been produced.

Create:

`task-01-design-system/docs/colour-roles.md`

For each role, document:

- Role name.
- Assigned token.
- Purpose.
- Contrast ratio where applicable.
- Whether it is suitable for text, icons, surfaces, or other uses.

Preserve the existing Swash token naming convention.

The primitive colour collection defines the underlying palette. The reference colour collection defines the roles used by the interface.

Do not replace this structure with a new naming system.

## Step 3: Build the typography system

Document five typography roles:

- Display.
- Headline.
- Title.
- Body.
- Label.

Each role has three sizes, producing fifteen styles.

For every style, record:

- Font family.
- Font weight.
- Font size.
- Letter spacing.
- Line height.

Line height must be justified using an appropriate multiplier of 1.4, 1.5, or 1.6.

Capture the display-large style at its default letter spacing and at the chosen letter spacing.

Document at least two deliberate deviations from the relevant design-system baseline.

For each deviation, explain:

- The default.
- The chosen value.
- Why the change suits Swash.
- When the decision would be inappropriate.

Create:

`task-01-design-system/docs/type-scale.md`

## Step 4: Build the shadow system

Define three shadows:

- Soft.
- Medium.
- Hard.

Build them using the Swash brand colour rather than automatically using black.

Record:

- X offset.
- Y offset.
- Blur.
- Spread.
- Opacity.

Create:

`task-01-design-system/docs/shadows.md`

Explain why brand-colour shadows produce a different visual result from black shadows.

## Step 5: Export the design system

Export the relevant Figma variables and effects as JSON.

Produce two files:

- `task-01-design-system/evidence/05-tokens-incomplete.json`
- `task-01-design-system/evidence/06-tokens-complete.json`

The incomplete file must demonstrate the export that omits colour variables.

The complete file must contain the required colour variables, typography, and effects.

Document the difference between the two exports.

If the original export mistake has already been genuinely reproduced and recorded, preserve that evidence rather than repeating it.

## Step 6: Convert the tokens to CSS variables

Use an AI coding agent to convert the complete JSON export into CSS variables.

The instruction must require the agent to:

- Read `06-tokens-complete.json`.
- Preserve token names and values.
- Preserve primitive-to-reference relationships.
- Use existing reference roles in interface components.
- Avoid direct primitive colour usage when a semantic role exists.
- Preserve typography and shadow definitions.
- Report missing or ambiguous tokens.
- Verify the generated variables against the source JSON.

The generated CSS variables are the implementation of the design system, not a replacement source of truth.

Record the exact prompt, failed attempts, changes, and outcome in:

`task-01-design-system/docs/prompts.md`

## Step 7: Prove the agent used the design system

Build one Swash screen using the agent.

Do not build the entire product for this exercise.

Then:

1. Search the codebase for raw colour values.
2. Save the exact command and complete output.
3. Ask the agent which typography style it applied to a specific interface element.
4. Save its exact response.
5. Capture the screen before using the design system.
6. Capture the same screen after using the design system.

Required evidence:

- `07-raw-value-search.txt`
- `08-agent-typography-answer.txt`
- `09-screen-without-system.png`
- `10-screen-with-system.png`

An empty raw-value search is acceptable only when the actual command and output are recorded.

## Step 8: Deliberately break token referencing

Create a separate Git branch.

On that branch:

1. Select a Swash interface element using a semantic colour role.
2. Break its reference by assigning a raw hex value.
3. Change the corresponding source colour role.
4. Observe which elements update and which do not.
5. Capture the inconsistent interface.
6. Explain why the broken reference prevented the source change from cascading.

Delete the branch without merging it.

Save:

- `11-broken-referencing.png`
- `12-git-log-branch-unmerged.txt`

The branch must remain unmerged.

## Documentation and deliverables

```text
task-01-design-system/
├── README.md
├── docs/
│   ├── business-brief.md
│   ├── colour-roles.md
│   ├── type-scale.md
│   ├── shadows.md
│   ├── divergences.md
│   ├── prompts.md
│   ├── defects.md
│   └── interview-answers.md
└── evidence/
    ├── 01-palette-before-pin.png
    ├── 02-palette-after-pin.png
    ├── 03-spacing-default.png
    ├── 04-spacing-chosen.png
    ├── 05-tokens-incomplete.json
    ├── 06-tokens-complete.json
    ├── 07-raw-value-search.txt
    ├── 08-agent-typography-answer.txt
    ├── 09-screen-without-system.png
    ├── 10-screen-with-system.png
    ├── 11-broken-referencing.png
    └── 12-git-log-branch-unmerged.txt
```

Optional: a four-minute walkthrough explaining three difficult typography decisions.

## Interview preparation

Create `docs/interview-answers.md`.

Answer all twelve questions in no more than 200 words each.

1. How would you structure design tokens?
2. When is a token change breaking?
3. How would you support multiple brands and themes?
4. Can tokens guarantee accessible contrast?
5. How do you ensure colour contrast guidelines are met?
6. What are the differences between WCAG levels A, AA, and AAA?
7. Why is semantic HTML important for accessibility?
8. How do you handle design handoff to developers using Figma?
9. Why do AI-generated interfaces tend to look generic, and what do you give an agent to prevent that?
10. Why did you choose the line height for your display-large style?
11. What part of your token structure would you build differently if starting again?
12. A candidate exports Figma hex values into CSS and calls that a single source of truth. What is missing?

## Task 1 completion criteria

- Complete and internally consistent design system.
- All fifteen typography styles documented.
- Colour roles and contrast ratios documented.
- Shadow system documented.
- Both token exports preserved.
- CSS variables generated and verified.
- Proof that the agent consumed the design system.
- Deliberate token-reference regression captured.
- Unmerged branch proven through Git history.
- Real defects documented.

---

# TASK 02 — REPOSITORY, SCAFFOLDING AND APPLICATION DIAGNOSTICS

**Working window: Six days**

## Objective

Establish a reliable Swash development foundation, verify that the application actually runs, prove that data can be stored, and present the repository professionally.

This task is about distinguishing a working application from an interface that only looks functional.

## Step 1: Write the scaffolding prompt

Create:

`task-02-repository-and-scaffold/docs/scaffold-prompt.md`

Write the initial prompt yourself.

The final prompt must instruct the coding agent to:

1. Read all approved context and design-system files before writing code.
2. Summarise its understanding and wait for approval.
3. Treat those files as the source of truth.
4. Ask when requirements conflict.
5. Use Swash design tokens without hardcoded styling values.
6. Set up the project foundation and build only a minimal Swash home screen.
7. Avoid implementing the entire product.
8. List every file created and every assumption made.
9. Audit its work against the prompt.

Include the initial prompt, final prompt, and a paragraph explaining what changed.

## Step 2: Capture the agent's plan

Run the approved prompt.

Before approving implementation, save:

- The agent's plan.
- Its assumptions.
- The files it intends to create.

Required evidence:

- `01-agent-plan.txt`
- `02-files-created.txt`

If the agent reports no assumptions, document whether that is credible and what you checked.

## Step 3: Choose models deliberately

Use Antigravity for the initial scaffold.

Use a different model or coding tool for at least one later feature, where appropriate.

Create:

`task-02-repository-and-scaffold/docs/model-choices.md`

Document:

- Which model was used for each task.
- Why it was selected.
- What differences you observed.
- One occasion when your initial model choice was wrong and you switched.

Do not claim a comparison you did not perform.

## Step 4: Run the application and inspect the logs

Start the actual Next.js development server.

Capture:

- The complete startup output.
- The port number.
- The first page load.
- HTTP status.
- Load time in milliseconds.

Save:

- `03-server-start.txt`
- `04-first-load.txt`

Create:

`docs/performance-note.md`

Explain the measured load time, the target you are using, and the likely causes of any gap.

Do not substitute an invented or external measurement for your own machine's result.

## Step 5: Break the development environment and recover

Reproduce three controlled failures.

### A. Incorrect nested project directory

Reproduce or recreate the condition where the project is nested inside another project directory.

Capture the resulting error.

Recover using both approaches:

- Instruct the agent to scaffold in the correct directory.
- Correct the working directory manually.

### B. Port conflict

Start another process using the same development port.

Capture the conflict.

Find the actual process ID, record the command used, stop the conflicting process, and capture the successful restart.

### C. 404 or blank page

Cause a 404 or blank page.

Capture the failure, status code, and timing.

Investigate the problem yourself before asking the agent for help.

Document the checks you performed, in order.

Save the six failure and recovery files with clear paired names.

## Step 6: Prove that the application writes to PostgreSQL

This is the core of the task.

Add one small, business-relevant form that writes a record to the Swash database.

Examples include a customer enquiry or another approved registration-related record.

Do not build unrelated product functionality.

Then:

1. Submit the form.
2. Capture the complete request logs.
3. Identify the HTTP status codes.
4. Verify whether a successful resource-creation response is returned.
5. Open the database inspector.
6. Capture the inserted row, including its actual ID and timestamp.
7. Submit a second record with different values.
8. Capture the second row.

Then deliberately break the database connection in a safe local environment.

1. Make the database connection unavailable.
2. Submit the form again.
3. Capture what the interface displays.
4. Capture the server logs.
5. Verify that no record was created.

Create:

`task-02-repository-and-scaffold/docs/false-success.md`

Explain:

- What the user saw.
- What the server actually did.
- What happened in the database.
- How a reviewer could have been misled by the interface.

Never report a failed database write as successful.

## Step 7: Prepare and test the main README

Create the repository's main `README.md`.

It must contain, in this order:

1. What Swash is and who it serves.
2. Current project status.
3. Technology stack and reasons for each choice.
4. Exact setup instructions.
5. Environment variable names and purposes, never their secret values.
6. What the application deliberately does not do.
7. Known defects with file references.

Give the README to someone unfamiliar with Swash and ask them to run the project.

Record their difficulties verbatim.

Create:

`docs/readme-test.md`

Fix the README based on the test.

## Step 8: Draw the working tree

Draw the development pipeline by hand.

Include:

- Your computer.
- Local Git repository.
- GitHub.
- Production.
- Main branch.
- Two feature branches.
- Where code becomes visible to users.
- Where mistakes become harder to reverse quietly.

Photograph the drawing with the date written by hand.

Save:

`14-working-tree-drawing.jpg`

Create:

`docs/working-tree.md`

Explain what breaks when a project uses only one branch and why this becomes more important after deployment.

## Step 9: Branch, merge and demonstrate a rejected change

After the first push:

1. Create a feature branch.
2. Complete the information-design exercise on that branch.
3. Commit and push it.
4. Open a pull request against your main branch.
5. Write a meaningful pull-request description.
6. Merge the approved work.
7. Create another branch.
8. Make a change you decide against.
9. Delete that second branch without merging.

Capture the Git graph.

The commit history must show at least twelve meaningful commits across at least three different days.

Save:

- `15-git-log-graph.txt`
- Pull request URL in the main README.

## Step 10: Improve information design

Apply information design to an appropriate Swash screen.

### Browser head

Implement and verify:

1. Page titles that change with navigation.
2. A concise description or tagline under ten words.
3. Appropriate SEO metadata on the marketing page.
4. A favicon created for Swash.
5. Open Graph metadata for shared links.

Capture the rendered page head on two different routes.

### Interface content

On one screen:

1. Remove redundant or misleading content.
2. Simplify a choice users should not have to make.
3. Set a maximum width for the main heading to control its line wrapping.
4. Use `rem`-based button padding instead of fixed width and height.
5. Apply the Task 1 label typography style to every relevant button.
6. Verify that clickable elements have pointer behaviour and visible hover feedback.
7. Ensure the Swash logo links home.

Document the decisions and reasoning in:

`docs/information-design.md`

### Responsive behaviour

Reduce the browser width until the largest heading breaks.

Capture the broken state.

Then make the typography responsive using `clamp()`.

Capture the corrected result at three viewport widths.

## Documentation and deliverables

```text
task-02-repository-and-scaffold/
├── README.md
├── docs/
│   ├── scaffold-prompt.md
│   ├── model-choices.md
│   ├── performance-note.md
│   ├── false-success.md
│   ├── readme-test.md
│   ├── working-tree.md
│   ├── information-design.md
│   ├── defects.md
│   └── interview-answers.md
└── evidence/
    ├── 01-agent-plan.txt
    ├── 02-files-created.txt
    ├── 03-server-start.txt
    ├── 04-first-load.txt
    ├── 05-nested-folder-error.txt
    ├── 06-nested-folder-fixed.txt
    ├── 07-port-conflict.txt
    ├── 08-port-conflict-resolved.txt
    ├── 09-404-error.txt
    ├── 10-404-resolved.txt
    ├── 11-write-succeeded-logs.txt
    ├── 12-database-rows.png
    ├── 13-write-failed-logs.txt
    ├── 14-working-tree-drawing.jpg
    ├── 15-git-log-graph.txt
    ├── 16-head-route-one.png
    ├── 17-head-route-two.png
    ├── 18-heading-wrap-bad.png
    ├── 19-heading-wrap-good.png
    └── 20-responsive-three-widths.png
```

Optional: a five-minute walkthrough showing the server logs, a form submission, and the corresponding status codes.

## Interview preparation

Answer all fifteen questions in `docs/interview-answers.md`, no more than 200 words each.

1. What is the difference between Git Flow and trunk-based development?
2. What does `git push --force` do, and why is `--force-with-lease` safer?
3. Why is rewriting shared Git history dangerous?
4. What is the difference between Git merge and rebase?
5. What causes a merge conflict?
6. What is the difference between the working directory, staging area, and repository?
7. What is branch protection?
8. Walk through a technical project you built end to end.
9. Tell me about a time something you built broke.
10. How do you learn an unfamiliar codebase?
11. What is the difference between correct code and complete code?
12. How do you build software another developer can maintain?
13. Where did your first page-load time go?
14. How did your application report success when no database record was created?
15. Why is navigating to a dashboard after signup not sufficient proof that the backend works?

Also prepare to explain how you would respond if sensitive information were accidentally committed to a public repository.

## Task 2 completion criteria

- Approved scaffold prompt and captured plan.
- Minimal Swash home screen.
- Correct project setup and startup.
- Three failure-and-recovery exercises.
- Real database writes and verified records.
- Database failure and false-success investigation.
- Tested professional README.
- Working-tree drawing.
- Meaningful branch and commit history.
- Information-design improvements.
- Responsive typography evidence.

---

# TASK 03 — CLIENT-SIDE VALIDATION AND ACCESSIBILITY

**Working window: Five days**

## Objective

Build an accessible, business-appropriate authentication form and demonstrate the limits of client-side validation.

The form must work for real Swash users, not only users who submit perfect information with a mouse.

## Step 1: Consolidate authentication forms

Use conditional rendering to consolidate the approved authentication forms into one page where appropriate.

The active state must be represented by a URL query parameter.

Prove:

- The page count before and after.
- The same route with different form-state parameters.
- Switching between forms without a full page reload.
- No unnecessary session creation when changing form states.

Create:

`docs/spa-rationale.md`

Explain why the approach was chosen, what the experience was before, and one situation where separate pages would be preferable.

Do not restructure the entire Swash application around this exercise.

## Step 2: Justify every form field

List every field in the relevant Swash form.

For each field, document:

- Why it is needed.
- What Swash does with the information.
- What happens if it is incorrect.
- Whether the field is necessary for the relevant business workflow.

Remove fields that cannot be justified.

Create:

`docs/field-justification.md`

Include acceptance of applicable terms and conditions.

Document the origin of the terms wording in:

`docs/terms-note.md`

Use an appropriate reviewed template or qualified legal review. Do not present AI-generated legal wording as verified legal advice.

Remove decorative elements that do not perform a useful function.

## Step 3: Implement client-side validation in four categories

### Category 1: Empty fields

Show a useful inline error when a user focuses a field and leaves it empty.

Use clear Swash-appropriate wording.

### Category 2: Length and structure

Define appropriate rules for every field with a meaningful structure.

Derive the rules from Swash's actual requirements.

For each rule, document:

- The rule.
- What goes wrong without it.
- Which legitimate users it may wrongly block.

Do not blindly copy rules from another business.

### Category 3: Format validation

Implement appropriate real-time format validation for registration.

For login, validate on submission rather than aggressively interrupting users while they type.

Distinguish email format from email ownership.

Do not claim that checking the email's format proves that the address exists or belongs to the user.

### Category 4: Accessible errors

Implement accessible field labels, error associations, and announcements.

This is developed further in Step 6.

Create:

`docs/validation-rules.md`

## Step 4: Choose an appropriate input type

Identify a Swash field where the obvious HTML input type may produce a poor user experience.

Reproduce the problem with the original input type.

Then implement the better alternative.

Capture both states and explain when the original input type would be appropriate.

Do not change input types without considering their actual data requirements.

## Step 5: Protect sensitive field information

Identify a field whose expected format or length should not be unnecessarily disclosed.

Remove hints that reveal sensitive information.

Create:

`docs/enumeration.md`

Explain:

- Which field is involved.
- Why its format is sensitive.
- What an attacker could learn from the hint.
- How removing the hint affects legitimate users.
- Whether the trade-off is justified.

Do not make ordinary customer information difficult to enter without a clear reason.

## Step 6: Audit and improve accessibility

Red borders alone are not sufficient.

Add a caution icon or another non-colour indicator beside every inline error.

Perform a manual field-by-field audit against:

- Colour independence.
- Keyboard reachability.
- Focus visibility.
- Screen-reader announcements.
- Error association.

Identify at least four actual accessibility problems in the implementation.

Fix them.

Test the form using a real screen reader.

Record the exact announcements before and after the fixes.

Create:

`docs/accessibility-audit.md`

A written transcript is required. Audio or video can supplement it.

Do not invent a screen-reader transcript.

## Step 7: Password rules and submit-button behaviour

Define a password minimum length based on Swash's requirements.

Explain the selected value.

Show password guidance when the user begins typing rather than displaying unnecessary instructions by default.

Choose either:

- A password confirmation field.
- A password visibility toggle.

Explain why you selected one and where the alternative would be preferable.

The submit button must be visible by default and disabled until the form is valid.

First implement and capture the hidden-button version. Then implement and capture the disabled-button version.

Explain why the disabled version provides a better experience.

If terms acceptance is required, provide an explanatory message when a user attempts to submit without accepting.

## Step 8: Attack the form

Test the client-side rules using deliberately invalid or unusual values.

Examples include:

- Single-character names.
- Whitespace-only passwords.
- Invalid email formats.
- Leading or trailing whitespace.
- Values at maximum lengths.

Record which attempts succeed and which fail.

Do not quietly hide failures.

Then bypass the browser entirely.

Send a direct request to the relevant endpoint using a command-line tool.

Capture:

- Exact command.
- Exact request.
- Exact response.
- Server logs.
- Whether a database record was created.

Create:

`docs/client-side-is-not-security.md`

Explain what the direct request proves about client-side validation and what Task 4 must enforce on the server.

If the server accepts the invalid request at this stage, record it honestly.

## Step 9: Roll back a change

Make a deliberate change that you decide against.

Identify the exact commit containing it.

Roll it back using the commit ID rather than vague instructions to an agent.

Record:

- Commit list.
- Selected commit ID.
- Command used.
- Why identifying a commit is safer than describing a change.

Create:

`docs/rollback.md`

## Documentation and deliverables

```text
task-03-client-validation/
├── README.md
├── docs/
│   ├── spa-rationale.md
│   ├── field-justification.md
│   ├── validation-rules.md
│   ├── terms-note.md
│   ├── enumeration.md
│   ├── accessibility-audit.md
│   ├── client-side-is-not-security.md
│   ├── rollback.md
│   ├── defects.md
│   └── interview-answers.md
└── evidence/
    ├── 01-page-count-before.txt
    ├── 02-page-count-after.txt
    ├── 03-url-states.png
    ├── 04-form-switch-logs.txt
    ├── 05-empty-field-error.png
    ├── 06-length-rule-blocking.png
    ├── 07-email-realtime-signup.png
    ├── 08-email-on-submit-login.png
    ├── 09-original-input-behaviour.png
    ├── 10-improved-input-behaviour.png
    ├── 11-screenreader-before.txt
    ├── 12-screenreader-after.txt
    ├── 13-button-hidden-version.png
    ├── 14-button-disabled-version.png
    ├── 15-form-attack-results.txt
    ├── 16-direct-request-command-and-response.txt
    └── 17-commit-list-and-rollback.txt
```

Optional: a five-minute walkthrough attacking the form and sending a direct request to the endpoint.

## Interview preparation

Answer all fourteen questions in `docs/interview-answers.md`, no more than 200 words each.

1. Why is client-side validation insufficient?
2. What security checks belong in the frontend, and what must the server enforce?
3. Is hiding an administrative button enough to protect the action?
4. What is the difference between validation, encoding, and sanitisation?
5. Why validate route parameters and query strings as well as request bodies?
6. What is a single-page application?
7. What are the advantages and disadvantages of a single-page application?
8. What are the four principles of WCAG?
9. Why is semantic HTML important for accessibility?
10. Tell me about a time you disagreed with what a customer wanted to build.
11. How would you explain a poorly performing AI implementation to a non-technical executive?
12. Which validation rule could wrongly block a legitimate Swash customer?
13. What happened when you sent a request directly to your endpoint?
14. Why is a strong frontend validation system not a substitute for backend protection?

Also prepare to explain user enumeration and how error messages can contribute to it.

## Task 3 completion criteria

- Authentication form states work correctly.
- Every field has a documented business justification.
- Four validation categories are implemented.
- Every rule has a documented trade-off.
- Sensitive format information is handled deliberately.
- Accessibility audit identifies and fixes real problems.
- Actual screen-reader transcripts are captured.
- Password and button behaviour is documented.
- Direct endpoint request is tested.
- Client-side security limitations are explained.
- A deliberate Git rollback is documented.

---

# TASK 04 — SERVER-SIDE SECURITY AND DATA INTEGRITY

**Working window: Eight days**

## Objective

Make the server the authority for Swash data.

The server must reject invalid requests even when the browser is bypassed.

This task covers database design, migrations, password protection, validation, rate limiting, email verification, and reliable background email delivery.

## Step 1: Design the database schema

Design the schema before implementation.

Draw it by hand and photograph it.

The schema must contain at least five tables and must include:

1. Users or customers.
2. Sessions.
3. Payments.
4. Payment attempts, separate from successful payments.
5. Retrieval-system chunks, if the approved Swash RAG design requires them.

Also model the actual Swash relationships needed for orders, subscriptions, and delivery arrangements.

Do not create tables merely to satisfy a count. Each table must serve an identified business or technical purpose.

Create:

`docs/schema.md`

For every table, document:

- Every column.
- Column type.
- Whether it can be empty.
- Relationships and cardinality.
- Indexes and why they exist.
- The cost of indexes on writes.
- Any duplicated information and why it is necessary.

Payment attempts must record relevant failed, abandoned, or interrupted payment attempts.

Explain why payment attempts and successful payments are separate records.

Use Swash's actual payment and accounting requirements when deciding what information must be retained.

## Step 2: Inspect the existing database

Before running migrations:

1. Open the database inspector.
2. Inspect the current database.
3. Record the tables that exist.
4. Compare the actual database with the Prisma schema.
5. Identify missing or inconsistent structures.

Capture the real database state.

If the database is already correct, prove how you verified it.

## Step 3: Run migrations deliberately

Run the initial migration and capture the complete command and output.

Then reproduce a required-column migration failure on a populated table in a safe development database.

Capture the failure.

Resolve it using a controlled three-step process:

1. Add the column as optional.
2. Populate existing rows.
3. Make the column required.

Capture each step.

Then deliberately create schema drift:

1. Change the Prisma schema without applying the corresponding migration.
2. Run the relevant application operation.
3. Capture the resulting error.
4. Explain what is out of sync.
5. Resolve the drift.

The coding agent must not independently execute database migrations.

It may prepare and explain a migration, but must stop and request approval before the migration is run.

Create:

`docs/migrations.md`

Explain:

- Forward-only migrations.
- Why an applied migration should not be edited.
- The difference between generating a Prisma client and applying a migration.
- Why migrations require controlled execution.
- The operational cost of manual migration approval.

## Step 4: Password hashing

Use Argon2id or bcrypt.

Never use SHA-256, SHA-512, or MD5 for password storage.

Prove the difference between a fast general-purpose hash and an adaptive password-hashing algorithm.

1. Hash the same password twice with your selected algorithm.
2. Capture both outputs.
3. Explain why they differ.
4. Measure the time taken by your selected algorithm.
5. Measure the time taken by SHA-256 on the same machine.
6. Calculate the corresponding approximate guesses per second.
7. Show the arithmetic.
8. Explain the role of salts and whether the selected algorithm handles them.

Use measurements from your actual development machine.

Create:

`docs/hashing.md`

Do not substitute example measurements from another machine.

## Step 5: Normalisation and trimming

Implement and prove the following behaviours:

- Email addresses are trimmed and lowercased consistently.
- Passwords are not lowercased or otherwise normalised.
- Leading and trailing password whitespace is handled according to the approved authentication policy.

Test the same account using different email casing.

Test the selected password-whitespace behaviour.

Capture the actual results.

Explain why email normalisation and password handling are different decisions.

## Step 6: Server-side schema validation

Install an appropriate validation library, such as Zod, if consistent with the approved architecture.

Document the selection.

Apply server-side validation to:

- Registration.
- Login.
- Password reset.

Validation must happen at the request boundary before untrusted input is used in database operations or other sensitive processes.

Measure request performance before and after validation.

Create:

`docs/validation-placement.md`

Explain:

- Where validation occurs.
- What runs before validation.
- What must not run before validation.
- Why a defined schema is preferable to scattered manual checks.

## Step 7: Enforce every client-side rule on the server

Take the validation rules from Task 3.

Implement them again on the server.

Repeat the exact direct request that bypassed the client-side form.

Capture:

- Original request.
- Task 3 response.
- Task 4 response.

The server must reject the invalid request according to the approved rules.

Save the comparison in:

`12-direct-request-before-and-after.txt`

This must demonstrate a real difference between the earlier and secured implementation.

## Step 8: Implement and test rate limiting

Apply rate limiting to:

- Registration.
- Login.
- Password reset.

Choose and justify:

- Threshold.
- Time window.
- Storage mechanism.
- Relevant request identifiers.

Trigger the rate limit and capture the response and status code.

Then test its limitations by changing the source IP through a legitimate testing method.

Capture whether the limit can be bypassed.

Create:

`docs/rate-limiting.md`

Explain:

- Why IP-only limits are insufficient.
- What other identifiers may be useful.
- Where counters are stored.
- What happens after a restart.
- The trade-off of the selected storage mechanism.
- What happens to legitimate users sharing an office or campus connection.

Do not claim a rate limiter is effective merely because one request was blocked.

## Step 9: Check breached passwords

Implement a breached-password check during registration.

Use a privacy-preserving approach in which the full password is not transmitted to the external service.

Test a password known to exist in the breached-password corpus.

Capture the rejection.

Create:

`docs/breach-check.md`

Explain the hash-prefix mechanism, local comparison, privacy implications, and why sending the complete password would be unacceptable.

## Step 10: Email verification

Implement email verification using a six-digit code generated with a cryptographically secure random function.

Document:

- Code generation.
- Expiry period.
- Attempt limits.
- Storage.
- Verification rules.
- Reuse prevention.

Choose an expiry duration based on the needs of Swash customers and the security trade-off.

Configure SMTP.

Capture the initial failure and successful configuration.

Verification and welcome emails must be sent through an approved background process rather than blocking the registration request.

Measure registration response time:

- With synchronous email delivery.
- With background email delivery.

Capture both results from your machine.

Test:

1. Successful verification.
2. Expired code.
3. Incorrect code.
4. Reuse of an already successful code.

Capture every result.

Create:

`docs/verification-design.md`

## Step 11: Make email look like Swash

The email must use the approved Swash design system.

Use the correct brand colour roles and typography where supported.

Capture the rendered email.

If the first version is visually incorrect, preserve the incorrect version and document the cause.

Create:

`docs/email-copy.md`

Explain what should be reviewed or changed before sending the message to real customers.

## Step 12: Document controls deliberately not implemented

Identify at least four security controls considered but not implemented.

For each, document:

- What the control does.
- Why it is not justified for Swash at this stage.
- What risk remains.
- What business or technical change would justify implementing it.

Create:

`docs/not-implemented.md`

Do not describe an unimplemented control as an existing feature.

## Documentation and deliverables

```text
task-04-server-security/
├── README.md
├── docs/
│   ├── schema.md
│   ├── migrations.md
│   ├── hashing.md
│   ├── validation-placement.md
│   ├── rate-limiting.md
│   ├── breach-check.md
│   ├── verification-design.md
│   ├── email-copy.md
│   ├── not-implemented.md
│   ├── defects.md
│   └── interview-answers.md
└── evidence/
    ├── 01-schema-drawing.jpg
    ├── 02-database-state-before.png
    ├── 03-initial-migration.txt
    ├── 04-required-column-failure.txt
    ├── 05-required-column-three-steps.txt
    ├── 06-drift-error.txt
    ├── 07-hash-twice-different.txt
    ├── 08-timing-argon-vs-sha.txt
    ├── 09-email-case-normalised.png
    ├── 10-password-trim-working.png
    ├── 11-validation-timing.txt
    ├── 12-direct-request-before-and-after.txt
    ├── 13-rate-limit-triggered.png
    ├── 14-rate-limit-defeated.txt
    ├── 15-breach-check-rejection.png
    ├── 16-smtp-failure.txt
    ├── 17-smtp-success.txt
    ├── 18-registration-timing-sync-vs-job.txt
    ├── 19-verification-row.png
    ├── 20-verification-expired.png
    ├── 21-verification-wrong-code.png
    ├── 22-verification-code-reused.png
    └── 23-rendered-email.png
```

Optional: a seven-minute walkthrough demonstrating the hashing comparison, rate limit, and direct-request rejection.

## Interview preparation

Answer all nineteen questions in `docs/interview-answers.md`, no more than 200 words each.

### Password hashing

1. Why should passwords be hashed?
2. Why use bcrypt or Argon2id instead of SHA-256?
3. What is a salt?
4. What work factor did you choose and why?
5. Why are plaintext storage, SHA-256, and reversible encryption unsuitable for password storage?

### Validation

6. Why is client-side validation insufficient?
7. What security checks belong in the frontend and backend?
8. Is hiding an administrative action enough to secure it?
9. What is the difference between validation, encoding, and sanitisation?
10. Why use parsed and validated request data?
11. Why validate route parameters and query strings?

### Rate limiting

12. How do you rate-limit unauthenticated requests?
13. What is the boundary burst problem?
14. Why use shared storage for rate-limit counters?
15. What status code should a rate limiter return?
16. Should the application fail open or closed when the rate-limit store is unavailable?

### Your implementation

17. What do your actual password-hashing measurements mean?
18. How does the breached-password check avoid transmitting the password?
19. Why is salted SHA-256 with IP-only rate limiting still insufficient?

Also prepare to explain database indexing, the N+1 problem, migrations, queues, idempotency, and email delivery.

## Task 4 completion criteria

- Schema documented and justified.
- Actual database state inspected.
- Migration failure and recovery captured.
- Schema drift reproduced and corrected.
- Secure password hashing implemented and measured.
- Email normalisation and password handling tested.
- Server-side validation implemented.
- Direct request rejected.
- Rate limiting triggered and its limitations demonstrated.
- Breached-password check implemented.
- Email verification and failure cases tested.
- Background email delivery measured.
- Four omitted security controls documented.

---

# TASK 05 — SESSIONS, ACCOUNT DELETION, COMPLIANCE AND DEFENCE

**Working window: Nine days**

## Objective

Implement secure session handling, proper logout, account deletion, data-retention decisions, and authorised administrative access.

This task also requires a complete explanation of the decisions and implementation from Tasks 1–4.

Start the documentation on the first day. Do not leave the written work until the end.

## Step 1: Implement secure sessions

On login:

1. Generate a fresh random session identifier using a cryptographically secure function.
2. Store the session record server-side.
3. Store only an appropriately protected representation of the session identifier.
4. Send the session cookie to the browser.
5. Configure appropriate cookie security flags.

Prove that two separate sign-ins generate different session identifiers.

Capture the actual session records.

Create:

`docs/sessions.md`

Explain:

- What session hijacking is.
- How a stolen session identifier could be abused.
- What logout does.
- How Swash limits the impact of a stolen session.

## Step 2: Choose the registration gating approach

Choose between:

**Soft gating:** The customer can access the application after registration without completing email verification first.

**Hard gating:** The customer must verify their email before accessing the protected application.

Choose based on Swash's business needs and customer experience.

Implement the selected approach.

Then implement the alternative on a separate branch and capture both flows.

Create:

`docs/gating.md`

Explain:

- Which approach Swash uses.
- Why it was selected.
- What the alternative costs in completed registrations.
- What trust, operational, or regulatory requirement could justify changing the decision.

## Step 3: Implement the login flow

Verify that login includes:

1. Schema validation.
2. Email trimming and lowercasing.
3. Database lookup using the identifying field.
4. Password verification using the stored password-hashing algorithm.
5. Rate limiting.
6. Generic error messages.
7. Verification-status handling.
8. A fresh session identifier.

Test a correct email with an incorrect password.

Then test an incorrect email.

The responses must not reveal which part of the credentials was wrong.

Document the actual behaviour for unverified customers.

## Step 4: Implement middleware and proper logout

Middleware must:

- Check the session cookie.
- Reject unauthenticated requests to protected routes.
- Confirm that the user remains valid and is not blocked.
- Attach the authenticated user's information to the request using the approved architecture.

Test two different users logging in through the same browser.

Verify that the application does not confuse their identities.

Logout must:

1. Send a server-side logout request.
2. Delete or invalidate the corresponding session record.
3. Clear the browser cookie.
4. Return an appropriate response.

Prove that the session record exists before logout and is gone afterwards.

### Network failure exercise

Reproduce a logout network failure.

Capture the situation where the interface appears to log the user out but the server-side session remains active.

Fix the behaviour.

Capture the failure and recovery.

Do not claim a session has been invalidated unless the server confirms it.

## Step 5: Make password reset invalidate existing sessions

After a successful password reset:

- Invalidate all previous sessions.
- Clear or revoke relevant cookies.
- Require a fresh login.

Test this using two separate browsers or sessions.

Capture the second session being invalidated.

Explain why password reset is different from an ordinary password change.

## Step 6: Implement account deletion as a process

Implement these four concepts:

**Soft delete:** Mark the account as scheduled for deletion.

**Grace period:** Lock the account while retaining its data temporarily.

**Hard delete:** Purge data that is approved for deletion after the grace period.

**Scheduled job:** Find expired deletion requests and process them.

Requirements:

1. Lock the account immediately after a deletion request.
2. Revoke active sessions.
3. Anonymise appropriate identity information.
4. Run the scheduled deletion job at the chosen interval.
5. Purge eligible data in a transaction.
6. Log job start and finish information, including relevant counts.
7. Make the job safe to run more than once.

Choose and justify Swash's grace period.

Run the job once and capture the result.

Run it again against the same data and prove that the second execution does not repeat destructive changes.

## Step 7: Build the retention matrix

Create:

`docs/retention-matrix.md`

List every database table and significant column.

For each, state:

- Whether it is purged or retained.
- Why.
- The legal or business basis for retention, where applicable.
- How long it is retained, if there is a defined period.
- Whether anonymisation is appropriate.

Consider Swash-specific records such as:

- Customer identity.
- Contact information.
- Sessions.
- Orders.
- Laundry service records.
- Pickup and delivery information.
- Payments.
- Payment attempts.
- Subscription records.
- Customer support interactions.
- AI conversation logs.
- Retrieval documents and chunks.
- Operational and security logs.

Do not copy a retention policy from another business.

### Backups

Explain:

- Where backups are stored.
- How frequently they are created.
- How deletion requests are reflected in backup retention.
- What happens when a backup is restored.

### The retention conflict

Identify at least one genuine conflict between a customer's deletion request and Swash's need or obligation to retain specific records.

Explain which requirement takes priority and why.

Distinguish between deleting identifiable information and retaining appropriately anonymised information.

Because Swash operates in Nigeria, assess applicable Nigerian data-protection and financial-record requirements. Verify the legal basis and retention periods against authoritative guidance or qualified legal advice rather than assuming that every record must be deleted immediately or retained permanently.

## Step 8: Write the privacy document

Create the repository-level:

`privacy.md`

Use clear language that customers can understand.

It must accurately describe:

- What information Swash collects.
- Why it collects it.
- How information is used.
- How long relevant information is retained.
- What happens when a customer requests account deletion.
- What information may be retained and why.
- How customers can make a deletion request.

Compare the promises in the document against the actual implementation.

Identify one promise the system cannot currently fulfil.

Preserve the original wording, remove or correct the unsupported promise, and document why it was wrong.

Save:

`docs/privacy-draft-with-broken-promise.md`

Never promise functionality or legal rights-handling processes that the application does not implement.

## Step 9: Review state management

Ask the agent which state-management approach the application currently uses.

Identify whether it relies on local component state, shared state, or an external state-management library.

Implement one meaningful state-management improvement.

It must solve a real Swash workflow problem.

Capture the improvement.

Create:

`docs/state-management.md`

Explain:

- What state-management approach Swash uses.
- What problem the improvement solves.
- Whether a dedicated library was necessary.
- At what point the application would genuinely need more extensive state management.

Do not install a library just because other applications use it.

## Step 10: Build a protected administrative view

Swash requires a distinction between ordinary customers and authorised staff.

Build an administrative view behind a protected route.

Requirements:

1. A separate administrative role.
2. The role stored and managed through the approved data model.
3. A protected route that checks authorisation, not merely authentication.
4. At least one action that only the authorised role can perform.
5. A copied-link test using an ordinary customer account.

Attempt to access the administrative route while logged in as an ordinary customer.

Capture the refusal.

The server must enforce the permission. Hiding the interface is not sufficient.

## Step 11: Conduct primary research with a real laundry operator

Interview a real person who operates a laundry business.

This must be a genuine conversation, not an AI-generated persona.

Ask:

1. What do customers ask repeatedly that only the business can answer?
2. What customer and order records are maintained?
3. Where are those records currently stored?
4. Has a customer ever requested deletion of their information?
5. What happens if business records are lost?
6. What would make the operator refuse to use a system like Swash?

Record:

- Interviewee's name.
- Business name.
- Date.
- Actual answers.
- Answers that contradict Swash's current assumptions.

Create:

`docs/interview-with-owner.md`

Then document what you got wrong or misunderstood about the original Swash business brief.

Do not invent an interview or claim that an AI-generated response came from a real operator.

## Step 12: Write the technical handbook

Create:

`docs/handbook.md`

Write a technical handbook for someone learning from the Swash project.

Include seven sections:

1. Typography, shadows, and design-system export.
2. Scaffolding, development server, and database diagnostics.
3. Information design, browser metadata, and responsive typography.
4. Git workflow, branching, and client-side validation.
5. Migrations, schema design, and email delivery.
6. Server-side validation, password hashing, rate limiting, and verification.
7. Sessions, logout, account deletion, and compliance.

Each section must include:

- Concept: define it in plain language.
- Purpose: explain the failure it prevents.
- Scenario: describe a realistic business situation.
- Implementation: explain how it works.
- Failure: describe what can go wrong and its consequences.
- Personal mistake: document a real mistake made during the Swash tasks.

The personal mistake must be verifiable against the actual project history or evidence.

Do not invent mistakes to fill the handbook.

## Step 13: Publish one technical article

Publish one written piece on LinkedIn, Medium, Substack, or an appropriate personal website.

Choose one significant decision from the Swash project.

Tell the story:

- The original problem.
- What you tried.
- What went wrong.
- What you changed.
- What happened.
- What you learned.

Include relevant prompts and genuine evidence.

Do not write a generic summary of the five tasks.

Add the published URL to the main repository README.

## Step 14: Document what you do not know

Create:

`docs/what-i-do-not-know.md`

List at least eight specific areas of the Swash implementation that you do not fully understand.

For each, document:

- What the topic is.
- What you currently understand.
- What you do not understand.
- How you would investigate or learn it.

Examples may include session-cookie protection, migration failure behaviour, rate-limit persistence, scheduled-job failure handling, or the legal basis for retaining particular records.

Do not use vague statements such as "I need to learn more about security."

## Documentation and deliverables

```text
task-05-sessions-compliance-defence/
├── README.md
├── docs/
│   ├── sessions.md
│   ├── gating.md
│   ├── retention-matrix.md
│   ├── state-management.md
│   ├── interview-with-owner.md
│   ├── handbook.md
│   ├── what-i-do-not-know.md
│   ├── privacy-draft-with-broken-promise.md
│   ├── defects.md
│   └── interview-answers.md
└── evidence/
    ├── 01-two-session-ids.txt
    ├── 02-cookie-flags.png
    ├── 03-soft-gating-flow.png
    ├── 04-hard-gating-flow.png
    ├── 05-generic-errors-both-cases.png
    ├── 06-two-users-one-browser.txt
    ├── 07-session-row-present.png
    ├── 08-session-row-deleted.png
    ├── 09-logout-network-failure.txt
    ├── 10-logout-edge-case-fixed.txt
    ├── 11-reset-kills-other-session.png
    ├── 12-deletion-request-locks-account.png
    ├── 13-scheduled-job-run-one.txt
    ├── 14-scheduled-job-run-two.txt
    ├── 15-state-management-working.png
    └── 16-admin-route-refused.png
```

Optional: a ten-minute walkthrough demonstrating the retention matrix, account deletion, and the safe second execution of the deletion job.

## Interview preparation

Create `docs/interview-answers.md`.

Answer all twenty-two questions, no more than 200 words each.

### Sessions

1. What should a secure browser session look like?
2. What is session fixation?
3. Are tokens better than server-side sessions?
4. How would you implement logout from all devices?
5. How do you invalidate sessions after a password change?
6. What do HttpOnly, Secure, and SameSite cookie flags protect against?
7. What is the difference between HTTP 401 and 403?

### Your session implementation

8. Why must logout be handled on the server?
9. What is the difference between authentication and authorisation?

### Compliance

10. Walk through an account deletion request.
11. Which records would Swash retain after deletion, and why?
12. What happens to backups after a deletion request?
13. What is the difference between anonymisation and deletion?

### Product and engineering role

14. Why build operational software rather than only conventional software features?
15. How would you respond to a business owner asking to add AI to their operations?
16. What is the difference between RAG and fine-tuning?
17. How do you evaluate an AI agent in production?

### State management

18. How do you choose between local state, context, and an external state manager?
19. How do you handle server state separately from client state?

### Your implementation and decisions

20. Cite three actual values from Tasks 1–4: one typography value, one password-hashing timing figure, and one rate-limit configuration. Explain each.
21. Which decision across the five tasks are you least confident about, and how would you resolve the uncertainty?
22. Analyse this claim: "Adding a delete-account button that immediately removes a user row makes the application fully compliant. Backups can be kept for a year in case the data is needed."

Also prepare to answer relevant RAG questions if the Swash assistant is implemented:

- RAG versus fine-tuning.
- Chunking and chunk-size decisions.
- Why RAG can still hallucinate.
- How to evaluate retrieval quality.
- How to distinguish retrieval failure from generation failure.
- When pgvector is appropriate.
- Whether structured records belong in vector search.
- How access control applies to retrieval.
- How the knowledge base stays current when source documents change.

## Task 5 completion criteria

- Secure session creation and storage.
- Correct cookie flags.
- Both registration-gating approaches demonstrated.
- Secure login flow and generic errors.
- Middleware and server-side logout.
- Logout network-failure case reproduced and fixed.
- Password reset invalidates existing sessions.
- Account deletion implemented as a repeat-safe process.
- Retention matrix includes a real conflict.
- Privacy document matches actual functionality.
- Administrative route protected by authorisation.
- State-management decision documented.
- Real laundry operator interviewed.
- Seven-section handbook completed.
- Public technical article published.
- At least eight specific knowledge gaps documented.

---

# 5. Cross-Task Requirements

Each task feeds the next.

| Task | Produces | Used by |
|---|---|---|
| 1. Design system | Tokens, CSS variables, visual rules | Task 2 and every interface built afterwards |
| 2. Repository and scaffold | Running project, Git history, database proof | Tasks 3–5 |
| 3. Client validation | Form rules, accessibility evidence, direct-request baseline | Task 4 |
| 4. Server security | Protected endpoints, schema, hashing, rate limits, verification | Task 5 |
| 5. Sessions and compliance | Secure sessions, deletion process, retention policy, complete defence | Final Swash submission |

## Cross-task consistency checks

Before completing Task 5, verify:

- The typography values cited in Task 5 match Task 1.
- The hashing measurements cited in Task 5 match Task 4.
- The rate-limit values cited in Task 5 match Task 4.
- The database schema matches the actual implementation.
- The privacy document matches the actual deletion process.
- The README accurately describes implemented features.
- Every claimed security control exists and has been tested.
- Known defects are consistent across documentation.
- Every evidence file corresponds to the actual implementation.

---

# 6. Assessment Weighting

Use the following weighting to prioritise the work.

| Task | Focus | Weight |
|---|---|---:|
| 1 | Design system | 15 |
| 2 | Repository and scaffolding | 20 |
| 3 | Client-side validation and accessibility | 15 |
| 4 | Server-side security | 30 |
| 5 | Sessions, compliance, and defence | 20 |
| | **Total** | **100** |

Each task is assessed across four areas:

- Working software: 30%.
- Evidence: 20%.
- Reasoning: 35%.
- Defence: 15%.

Optional walkthroughs can earn up to five bonus marks per task.

Task 4 deserves the greatest implementation and review attention because it carries the highest weighting.

---

# 7. Required Documentation and Quality Standards

Every task must have:

- A task README.
- A decision record.
- A defects document.
- Interview answers.
- Genuine evidence.
- A clear completion status.

The main repository README must be written for a technical reviewer who has approximately four minutes to understand the project.

It must explain:

1. What Swash is.
2. What currently works.
3. What remains incomplete.
4. The technology stack and reasons.
5. How to run the application.
6. Required environment variables by name and purpose, without values.
7. What the application deliberately does not do.
8. Known defects with file references.

Never commit secrets, even if they are later removed in another commit.

Never describe incomplete or unimplemented functionality as complete.

Every documented defect must correspond to something real in the code or a reproducible test.

---

# 8. Final Operating Instructions for the Coding Agent

1. Read this guide and all relevant Swash context files before beginning a task.
2. Inspect the existing repository before proposing implementation.
3. Do not restart, overwrite, or replace completed work without approval.
4. Work on only the current task.
5. Do not begin the next task until the current task has been reviewed and approved.
6. Do not implement the entire Swash product when a task asks for a limited exercise.
7. Follow `AGENTS.md`, `RULES.md`, and the approved design system.
8. Do not change the locked technology stack.
9. Do not invent business rules, customer data, measurements, test results, or evidence.
10. Do not run database migrations without explicit approval.
11. Do not perform destructive operations without explaining the impact and obtaining approval.
12. Do not use real customer data for deliberate failure exercises.
13. Preserve existing working functionality.
14. Report assumptions and unresolved questions before implementation.
15. After implementation, run relevant checks and report their actual results.
16. List every file created or modified.
17. Identify incomplete work, defects, and deviations from the approved requirements.
18. Update the task documentation and evidence index as work progresses.
19. Do not mark a task complete merely because the interface renders.
20. Wait for approval before moving to the next task.

**The final outcome must be one coherent Swash application, one repository, a genuine development history, five documented tasks, and evidence that supports every important implementation claim.**
