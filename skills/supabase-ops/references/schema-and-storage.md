# MecaniaOS Supabase Context

## Core database facts

- Provider: PostgreSQL via Supabase
- ORM/access layer: Prisma
- Main schema file: `prisma/schema.prisma`

## Key entities

- `User`
- `Session`
- `Client`
- `Vehicle`
- `WorkOrder`
- `WorkOrderEvidence`
- `WorkOrderStatusLog`
- `SelfInspection`
- `SelfInspectionVehicleSnapshot`
- `SelfInspectionAnswer`
- `SelfInspectionPhoto`
- `SelfInspectionNote`
- `SelfInspectionReview`
- `SelfInspectionStatusLog`

## Storage facts

- Self-inspection photos go to bucket `self-inspections`.
- Work-order evidence goes to bucket `work-orders`.
- The application stores both `storageKey` and `fileUrl` in the database.

## Environment variables relevant to Supabase

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET_SELF_INSPECTIONS`
- `SUPABASE_STORAGE_BUCKET_WORK_ORDERS`
- `DATABASE_URL`
- `DIRECT_URL`

## Important architectural clarification

Supabase currently provides:

- PostgreSQL
- Storage

Supabase currently does not provide:

- application business logic
- route handling
- current login/session workflow

That logic still lives in the Next.js application.

