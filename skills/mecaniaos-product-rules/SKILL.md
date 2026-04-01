---
name: mecaniaos-product-rules
description: Apply MecaniaOS internal product, delivery, and team rules. Use when Codex needs project-specific guidance about architecture boundaries, branch/versioning conventions, Jira sprint execution, acceptance-criteria discipline, or how to describe the product consistently to the team or professor.
---

# MecaniaOS Product Rules

Use this skill when a task depends on team conventions or product-specific delivery rules.

## Scope

- Apply MecaniaOS branch and release conventions.
- Respect Jira-driven sprint execution.
- Keep explanations of the architecture technically accurate.
- Preserve product vocabulary and internal workflow consistency.

## Workflow

1. Anchor execution to Jira stories and acceptance criteria when sprint work is involved.
2. Keep Git workflow consistent:
   - `main` for production
   - `develop` for integration
   - `feature/...` for implementation branches
3. Name feature branches from Jira issue keys when possible.
4. Treat Vercel production as the public demo environment.
5. Avoid claiming features are complete unless the user flow is actually testable end-to-end.

## Product explanation rules

- Describe MecaniaOS as a workshop operations platform.
- Explain the architecture as:
  - Next.js frontend and backend on Vercel
  - Supabase PostgreSQL and Storage
  - Prisma as the data access layer
- Do not say “the whole backend is in Supabase”.

## Team rules

- Benjamin Yañez coordinates Jira and integration.
- Work should be delegated by feature branch, not by personal branch.
- Sprint tasks should map cleanly from Jira issue to branch name.

## References

- For Git, Jira, and presentation rules, read `references/workflow.md`.

