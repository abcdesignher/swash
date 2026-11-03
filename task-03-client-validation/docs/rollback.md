# Step 9 — Rolling Back a Change by Commit ID (`docs/rollback.md`)

## 1. Change Made and Why We Decided Against It

During Task 03, we committed an experimental change in [`src/components/AuthForm.tsx`](../../src/components/AuthForm.tsx) that added a pre-checked (`defaultChecked`) WhatsApp promotional opt-in checkbox (`#auth-whatsapp-promo`: *"Send me weekly WhatsApp promotional discounts and partner offers"*) beneath the Terms of Service checkbox on the registration form.

We decided against this change and rolled it back immediately for two reasons:

1. **Violates Field Minimisation (Step 2):** In [`docs/field-justification.md`](field-justification.md), we explicitly removed marketing and referral fields from registration to keep onboarding focused strictly on the six operational fields required to collect, wash, bill, and deliver laundry in Lagos.
2. **Violates NDPA 2023 Consent Principles (Step 2):** Under the Nigeria Data Protection Act (NDPA) 2023, marketing consent must be freely given, specific, and unambiguous; bundling a pre-ticked promotional checkbox (`defaultChecked`) into account creation is a dark pattern that undermines customer trust.

---

## 2. Commit Selection and Rollback Execution

### Commit List Inspected (`git log --oneline -n 6`)

```text
416c092 feat(auth): add pre-checked WhatsApp promotional opt-in checkbox
e4e46b5 feat(task-03): implement consolidated /auth route, client validation, a11y fixes, and evidence 01-16
89cf5ec updated repository files
450abc2 docs(task-01): add line-height multipliers, 12-git-log-branch-unmerged.txt, and update README
308034a docs(task-02): record PR link, complete Task 02 READMEs, and add 15-git-log-graph.txt
bf4ac8c Merge branch 'feat/information-design': Step 10 information design and responsive typography
```

### Target Commit Identified

- **Short SHA:** `416c092`
- **Full SHA:** `416c092aa64a082a38c3f146bd77a173f2f1be49`
- **Commit Message:** `feat(auth): add pre-checked WhatsApp promotional opt-in checkbox`

### Command Executed

```bash
git revert 416c092 --no-edit
```

### Outcome

Git created a new revert commit `5d1f6ac` (`5d1f6ac59799220dc4f3dfc20c0671340adf28b3`) with the message `Revert "feat(auth): add pre-checked WhatsApp promotional opt-in checkbox"`, cleanly removing the 13 added lines in [`src/components/AuthForm.tsx`](../../src/components/AuthForm.tsx) while preserving the full audit history on `main`.

---

## 3. Why Identifying a Commit by SHA Is Safer Than Describing a Change to an Agent

1. **Deterministic, Content-Addressed Precision vs. Natural-Language Ambiguity:**
   - A Git commit SHA (`416c092aa64a082a38c3f146bd77a173f2f1be49`) is a cryptographic hash of the exact tree diff, parent commit, author, and timestamp. Executing `git revert 416c092` computes the exact algebraic inverse of those 13 lines and nothing else.
   - By contrast, asking an AI coding agent in natural language (*"remove the checkbox we added earlier"*) is ambiguous when a component contains multiple checkboxes (`#auth-accept-terms` vs. `#auth-whatsapp-promo`). An agent interpreting prose may accidentally delete the mandatory Terms of Service checkbox, alter adjacent validation state (`visibleErrors.acceptTerms`), or reformat surrounding JSX.
2. **Non-Destructive Audit Trail:**
   - Using `git revert <sha>` records both the original experiment (`416c092`) and its explicit reversal (`5d1f6ac`) in the repository history without rewriting shared history (`git reset --hard`) or relying on an agent's context window memory.

