ALTER TABLE "Client"
  ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "purgeAt" TIMESTAMP(3);

ALTER TABLE "Vehicle"
  ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "purgeAt" TIMESTAMP(3);

ALTER TABLE "WorkOrder"
  ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "purgeAt" TIMESTAMP(3);

ALTER TABLE "Repuesto"
  ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "purgeAt" TIMESTAMP(3);

ALTER TABLE "SelfInspection"
  ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "purgeAt" TIMESTAMP(3);

ALTER TABLE "Budget"
  ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "purgeAt" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "Client_deletedAt_purgeAt_idx"
  ON "Client"("deletedAt", "purgeAt");

CREATE INDEX IF NOT EXISTS "Vehicle_deletedAt_purgeAt_idx"
  ON "Vehicle"("deletedAt", "purgeAt");

CREATE INDEX IF NOT EXISTS "WorkOrder_deletedAt_purgeAt_idx"
  ON "WorkOrder"("deletedAt", "purgeAt");

CREATE INDEX IF NOT EXISTS "Repuesto_deletedAt_purgeAt_idx"
  ON "Repuesto"("deletedAt", "purgeAt");

CREATE INDEX IF NOT EXISTS "SelfInspection_deletedAt_purgeAt_idx"
  ON "SelfInspection"("deletedAt", "purgeAt");

CREATE INDEX IF NOT EXISTS "Budget_deletedAt_purgeAt_idx"
  ON "Budget"("deletedAt", "purgeAt");
