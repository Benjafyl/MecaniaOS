---
name: supabase-ops
description: Operate the MecaniaOS Supabase project for PostgreSQL, Storage, environment-variable alignment, and cloud data troubleshooting. Use when Codex needs to inspect MecaniaOS database/storage behavior, reason about Prisma against Supabase, verify buckets, or troubleshoot production data and upload flows.
---

# Supabase Ops

Use this skill when working on MecaniaOS data or storage inside Supabase.

## Scope

- Reason about Prisma-backed PostgreSQL data in Supabase.
- Inspect or explain the current schema and core entities.
- Validate Storage bucket usage for work orders and self-inspections.
- Troubleshoot data flow issues between Next.js and Supabase.

## Workflow

1. Assume Supabase is the system of record for persisted application data.
2. Separate concerns before debugging:
   - database schema/data issue
   - application logic issue
   - auth/session issue
   - storage/upload issue
3. Treat Prisma as the application access layer, not as the database itself.
4. When uploads fail, verify:
   - service role key presence
   - bucket names
   - public/private access expectations
   - object URL generation
5. Keep the explanation clear that MecaniaOS uses custom Next.js auth, not Supabase Auth.

## MecaniaOS-specific rules

- Database is Supabase PostgreSQL.
- Auth is custom application auth backed by `User` and `Session` tables.
- Storage buckets are split by domain:
  - `self-inspections`
  - `work-orders`
- Do not describe the system as “all backend in Supabase”; only data/storage live there.

## References

- For schema and storage details, read `references/schema-and-storage.md`.

