---
name: vercel-ops
description: Operate the MecaniaOS Vercel project for deploys, environment variables, deployment validation, and production troubleshooting. Use when Codex needs to inspect MecaniaOS deploys, reason about main vs develop releases, verify production incidents, or update guidance related to the Vercel project `mecania-os-dtx6`.
---

# Vercel Ops

Use this skill when working on MecaniaOS deployments in Vercel.

## Scope

- Inspect production deploy status for MecaniaOS.
- Validate whether `main` is healthy before or after a release.
- Reason about environment variables used by the deployed app.
- Troubleshoot production issues that happen only on Vercel.

## Workflow

1. Treat `main` as production and `develop` as pre-production integration.
2. Prefer checking the latest production deployment before proposing config changes.
3. When debugging deploys, first distinguish:
   - build-time failure
   - runtime failure
   - client-side crash
   - environment-variable mismatch
4. For runtime issues, compare the app code with the Vercel environment variables and the current deployment logs.
5. Keep fixes compatible with serverless execution and ephemeral filesystem constraints.

## MecaniaOS-specific rules

- Production domain is expected to be `https://mecania-os-dtx6.vercel.app`.
- `main` should be the only branch promoted to production.
- Uploads must not depend on local filesystem persistence in Vercel.
- If a production issue only affects uploads or file access, check Supabase Storage configuration before assuming a frontend bug.

## References

- For project-specific deployment details, read `references/project-context.md`.

