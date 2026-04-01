# MecaniaOS Workflow Rules

## Branching model

- `main`: production branch deployed on Vercel
- `develop`: integration branch
- `feature/<issue-key>-<slug>`: work branch from `develop`
- `fix/<issue-key>-<slug>`: bugfix branch

## Example branch names

- `feature/mos-9-portal-cliente`
- `feature/mos-6-controlar-inventario-repuestos`
- `fix/mos-47-flujo-autoinspeccion`

## Jira rule

- Sprint work should be grounded in the Jira issue description and acceptance criteria.
- A ticket should not be treated as done if the user flow is incomplete or hidden behind a broken handoff.

## Demo rule

Before presenting a feature, confirm:

- the route is reachable
- the target role can use it
- the happy path completes
- the resulting data is visible to the expected admin/internal view

## Architecture summary for presentations

Use this wording when needed:

“MecaniaOS corre como una aplicación full-stack en Next.js desplegada en Vercel. La persistencia de datos se maneja con Supabase PostgreSQL y el acceso a datos se resuelve mediante Prisma. Los archivos e imágenes se almacenan en buckets de Supabase Storage.”

