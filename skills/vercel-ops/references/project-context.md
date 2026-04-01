# MecaniaOS Vercel Context

## Project

- Vercel project name: `mecania-os-dtx6`
- Production branch: `main`
- Integration branch: `develop`

## Relevant environment variables

- `DATABASE_URL`
- `DIRECT_URL`
- `SESSION_SECRET`
- `APP_URL`
- `SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET_SELF_INSPECTIONS`
- `SUPABASE_STORAGE_BUCKET_WORK_ORDERS`

## Typical failure patterns

- `NEXT_REDIRECT` errors caused by catching `redirect()` in Server Actions.
- `Body exceeded 1 MB limit` for uploads when `serverActions.bodySizeLimit` is too low.
- Broken uploads when Vercel env vars are missing even if local `.env.local` works.
- Broken images if object storage URLs or public bucket access are misconfigured.

## Release rule

Only treat a change as production-ready when:

- `pnpm typecheck` passes
- `pnpm build` passes
- the latest deployment is `Ready`
- the relevant user flow was verified on the production URL

