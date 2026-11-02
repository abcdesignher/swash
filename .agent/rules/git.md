---
trigger: model_decision
description: Load when creating branches, committing changes, merging, pushing, reverting, or performing other Git operations.
---

# SWASH — Git Rules

## 1. Before Changes

- Inspect the current branch and working-tree status.
- Review existing changes before modifying files.
- Do not overwrite or discard uncommitted work.
- Keep changes focused on the assigned task.

## 2. Branches and Commits

- Use the project's established branching conventions.
- Create focused branches when required.
- Use meaningful commit messages.
- Keep commits small enough to review.
- Do not include unrelated changes in a commit.

## 3. Protected Operations

Without explicit approval, do not:

- Force-push.
- Rewrite shared Git history.
- Delete branches.
- Reset or discard uncommitted changes.
- Overwrite existing commits.
- Merge changes into protected branches.

## 4. Secrets and Files

- Never commit credentials, API keys, tokens, or secrets.
- Respect `.gitignore`.
- Do not commit generated files or dependencies unless required by the project.
- Inspect staged changes before committing.

## 5. Completion

After Git operations:

- Confirm the intended branch.
- Confirm the expected files changed.
- Check the working-tree status.
- Report the commit, push, or merge outcome accurately.

Never claim a Git operation succeeded without confirmation.