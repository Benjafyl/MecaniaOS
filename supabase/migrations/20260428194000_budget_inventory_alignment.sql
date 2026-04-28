DO $$
BEGIN
  CREATE TYPE "BudgetStatus" AS ENUM ('DRAFT', 'SENT', 'APPROVED', 'REJECTED', 'CONVERTED_TO_WORK_ORDER');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "BudgetItemType" AS ENUM ('PART', 'LABOR', 'SUPPLY');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "StockMovementType" AS ENUM ('INITIAL', 'ENTRY', 'OUT', 'ADJUSTMENT');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "StockMovementSourceType" AS ENUM ('INVENTORY', 'WORK_ORDER');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "Repuesto" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "code" VARCHAR(80) NOT NULL,
  "unitPrice" INTEGER NOT NULL DEFAULT 0,
  "currentStock" INTEGER NOT NULL DEFAULT 0,
  "minimumStock" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Repuesto_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Repuesto_code_key" ON "Repuesto"("code");
CREATE INDEX IF NOT EXISTS "Repuesto_name_idx" ON "Repuesto"("name");
CREATE INDEX IF NOT EXISTS "Repuesto_currentStock_minimumStock_idx" ON "Repuesto"("currentStock", "minimumStock");

CREATE TABLE IF NOT EXISTS "WorkOrderPart" (
  "id" TEXT NOT NULL,
  "workOrderId" TEXT NOT NULL,
  "repuestoId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "createdById" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "WorkOrderPart_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "WorkOrderPart_workOrderId_repuestoId_key" ON "WorkOrderPart"("workOrderId", "repuestoId");
CREATE INDEX IF NOT EXISTS "WorkOrderPart_repuestoId_idx" ON "WorkOrderPart"("repuestoId");

CREATE TABLE IF NOT EXISTS "StockMovement" (
  "id" TEXT NOT NULL,
  "repuestoId" TEXT NOT NULL,
  "type" "StockMovementType" NOT NULL,
  "quantity" INTEGER NOT NULL,
  "previousStock" INTEGER NOT NULL,
  "newStock" INTEGER NOT NULL,
  "reason" TEXT,
  "sourceType" "StockMovementSourceType",
  "sourceId" TEXT,
  "createdById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StockMovement_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "StockMovement_repuestoId_createdAt_idx" ON "StockMovement"("repuestoId", "createdAt");
CREATE INDEX IF NOT EXISTS "StockMovement_type_createdAt_idx" ON "StockMovement"("type", "createdAt");
CREATE INDEX IF NOT EXISTS "StockMovement_sourceType_sourceId_idx" ON "StockMovement"("sourceType", "sourceId");

CREATE TABLE IF NOT EXISTS "Budget" (
  "id" TEXT NOT NULL,
  "budgetNumber" TEXT NOT NULL,
  "clientId" TEXT NOT NULL,
  "vehicleId" TEXT NOT NULL,
  "selfInspectionId" TEXT,
  "workOrderId" TEXT,
  "title" TEXT NOT NULL,
  "summary" TEXT,
  "status" "BudgetStatus" NOT NULL DEFAULT 'DRAFT',
  "subtotalParts" INTEGER NOT NULL DEFAULT 0,
  "subtotalLabor" INTEGER NOT NULL DEFAULT 0,
  "subtotalSupplies" INTEGER NOT NULL DEFAULT 0,
  "totalAmount" INTEGER NOT NULL DEFAULT 0,
  "sentAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "rejectedAt" TIMESTAMP(3),
  "createdById" TEXT NOT NULL,
  "updatedById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Budget_budgetNumber_key" ON "Budget"("budgetNumber");
CREATE UNIQUE INDEX IF NOT EXISTS "Budget_workOrderId_key" ON "Budget"("workOrderId");
CREATE INDEX IF NOT EXISTS "Budget_clientId_createdAt_idx" ON "Budget"("clientId", "createdAt");
CREATE INDEX IF NOT EXISTS "Budget_vehicleId_createdAt_idx" ON "Budget"("vehicleId", "createdAt");
CREATE INDEX IF NOT EXISTS "Budget_status_createdAt_idx" ON "Budget"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "Budget_selfInspectionId_idx" ON "Budget"("selfInspectionId");

CREATE TABLE IF NOT EXISTS "BudgetReferenceCatalog" (
  "id" TEXT NOT NULL,
  "itemType" "BudgetItemType" NOT NULL,
  "name" TEXT NOT NULL,
  "referenceCode" VARCHAR(40),
  "unitPrice" INTEGER NOT NULL,
  "sourceLabel" TEXT NOT NULL,
  "sourceUrl" TEXT,
  "vehicleCompatibility" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BudgetReferenceCatalog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "BudgetReferenceCatalog_referenceCode_key" ON "BudgetReferenceCatalog"("referenceCode");
CREATE INDEX IF NOT EXISTS "BudgetReferenceCatalog_itemType_active_idx" ON "BudgetReferenceCatalog"("itemType", "active");
CREATE INDEX IF NOT EXISTS "BudgetReferenceCatalog_name_idx" ON "BudgetReferenceCatalog"("name");

CREATE TABLE IF NOT EXISTS "BudgetItem" (
  "id" TEXT NOT NULL,
  "budgetId" TEXT NOT NULL,
  "referenceCatalogId" TEXT,
  "itemType" "BudgetItemType" NOT NULL,
  "description" TEXT NOT NULL,
  "referenceCode" VARCHAR(40),
  "quantity" INTEGER NOT NULL,
  "unitPrice" INTEGER NOT NULL,
  "subtotal" INTEGER NOT NULL,
  "sourceLabel" TEXT,
  "sourceUrl" TEXT,
  "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BudgetItem_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "BudgetItem_budgetId_itemType_idx" ON "BudgetItem"("budgetId", "itemType");
CREATE INDEX IF NOT EXISTS "BudgetItem_referenceCatalogId_idx" ON "BudgetItem"("referenceCatalogId");

CREATE TABLE IF NOT EXISTS "BudgetStatusLog" (
  "id" TEXT NOT NULL,
  "budgetId" TEXT NOT NULL,
  "previousStatus" "BudgetStatus",
  "nextStatus" "BudgetStatus" NOT NULL,
  "note" TEXT,
  "changedById" TEXT NOT NULL,
  "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BudgetStatusLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "BudgetStatusLog_budgetId_changedAt_idx" ON "BudgetStatusLog"("budgetId", "changedAt");

INSERT INTO "Repuesto" ("id", "name", "code", "unitPrice", "currentStock", "minimumStock", "createdAt", "updatedAt")
SELECT
  "id",
  "name",
  "code",
  0,
  "currentStock",
  "minimumStock",
  "createdAt",
  "updatedAt"
FROM "SparePart"
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "StockMovement" ("id", "repuestoId", "type", "quantity", "previousStock", "newStock", "reason", "sourceType", "sourceId", "createdById", "createdAt")
SELECT
  "id",
  "sparePartId",
  CASE
    WHEN "type"::text = 'INBOUND' THEN 'ENTRY'::"StockMovementType"
    WHEN "type"::text = 'OUTBOUND' THEN 'OUT'::"StockMovementType"
    ELSE 'ADJUSTMENT'::"StockMovementType"
  END,
  "quantity",
  "previousStock",
  "resultingStock",
  "note",
  NULL,
  NULL,
  "createdById",
  "createdAt"
FROM "SparePartMovement"
WHERE EXISTS (
  SELECT 1
  FROM "Repuesto"
  WHERE "Repuesto"."id" = "SparePartMovement"."sparePartId"
)
ON CONFLICT ("id") DO NOTHING;

WITH quote_totals AS (
  SELECT
    qi."quoteId",
    COALESCE(SUM(CASE WHEN qi."type"::text = 'PART' THEN ROUND(qi."lineTotal")::integer ELSE 0 END), 0) AS "subtotalParts",
    COALESCE(SUM(CASE WHEN qi."type"::text = 'LABOR' THEN ROUND(qi."lineTotal")::integer ELSE 0 END), 0) AS "subtotalLabor",
    COALESCE(SUM(CASE WHEN qi."type"::text = 'SUPPLY' THEN ROUND(qi."lineTotal")::integer ELSE 0 END), 0) AS "subtotalSupplies"
  FROM "QuoteItem" qi
  GROUP BY qi."quoteId"
)
INSERT INTO "Budget" (
  "id",
  "budgetNumber",
  "clientId",
  "vehicleId",
  "selfInspectionId",
  "workOrderId",
  "title",
  "summary",
  "status",
  "subtotalParts",
  "subtotalLabor",
  "subtotalSupplies",
  "totalAmount",
  "sentAt",
  "approvedAt",
  "rejectedAt",
  "createdById",
  "updatedById",
  "createdAt",
  "updatedAt"
)
SELECT
  q."id",
  q."quoteNumber",
  q."clientId",
  q."vehicleId",
  q."selfInspectionId",
  NULL,
  COALESCE(NULLIF(TRIM(q."summary"), ''), 'Presupuesto ' || q."quoteNumber"),
  q."summary",
  CASE
    WHEN q."status"::text = 'DRAFT' THEN 'DRAFT'::"BudgetStatus"
    WHEN q."status"::text = 'SENT' THEN 'SENT'::"BudgetStatus"
    WHEN q."status"::text = 'APPROVED' THEN 'APPROVED'::"BudgetStatus"
    ELSE 'REJECTED'::"BudgetStatus"
  END,
  COALESCE(t."subtotalParts", 0),
  COALESCE(t."subtotalLabor", 0),
  COALESCE(t."subtotalSupplies", 0),
  ROUND(q."totalAmount")::integer,
  q."sentAt",
  q."approvedAt",
  q."rejectedAt",
  q."createdById",
  q."updatedById",
  q."createdAt",
  q."updatedAt"
FROM "Quote" q
LEFT JOIN quote_totals t ON t."quoteId" = q."id"
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "BudgetItem" (
  "id",
  "budgetId",
  "referenceCatalogId",
  "itemType",
  "description",
  "referenceCode",
  "quantity",
  "unitPrice",
  "subtotal",
  "sourceLabel",
  "sourceUrl",
  "note",
  "createdAt",
  "updatedAt"
)
SELECT
  qi."id",
  qi."quoteId",
  NULL,
  qi."type"::text::"BudgetItemType",
  qi."description",
  NULL,
  GREATEST(ROUND(qi."quantity")::integer, 0),
  ROUND(qi."unitPrice")::integer,
  ROUND(qi."lineTotal")::integer,
  NULL,
  NULL,
  NULL,
  qi."createdAt",
  qi."updatedAt"
FROM "QuoteItem" qi
WHERE EXISTS (
  SELECT 1
  FROM "Budget"
  WHERE "Budget"."id" = qi."quoteId"
)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "BudgetStatusLog" (
  "id",
  "budgetId",
  "previousStatus",
  "nextStatus",
  "note",
  "changedById",
  "changedAt"
)
SELECT
  qsl."id",
  qsl."quoteId",
  CASE
    WHEN qsl."previousStatus" IS NULL THEN NULL
    ELSE qsl."previousStatus"::text::"BudgetStatus"
  END,
  qsl."nextStatus"::text::"BudgetStatus",
  qsl."note",
  qsl."changedById",
  qsl."changedAt"
FROM "QuoteStatusLog" qsl
WHERE EXISTS (
  SELECT 1
  FROM "Budget"
  WHERE "Budget"."id" = qsl."quoteId"
)
ON CONFLICT ("id") DO NOTHING;

DO $$
BEGIN
  ALTER TABLE "WorkOrderPart"
    ADD CONSTRAINT "WorkOrderPart_workOrderId_fkey"
    FOREIGN KEY ("workOrderId") REFERENCES "WorkOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "WorkOrderPart"
    ADD CONSTRAINT "WorkOrderPart_repuestoId_fkey"
    FOREIGN KEY ("repuestoId") REFERENCES "Repuesto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "WorkOrderPart"
    ADD CONSTRAINT "WorkOrderPart_createdById_fkey"
    FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "StockMovement"
    ADD CONSTRAINT "StockMovement_repuestoId_fkey"
    FOREIGN KEY ("repuestoId") REFERENCES "Repuesto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "StockMovement"
    ADD CONSTRAINT "StockMovement_createdById_fkey"
    FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "Budget"
    ADD CONSTRAINT "Budget_clientId_fkey"
    FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "Budget"
    ADD CONSTRAINT "Budget_vehicleId_fkey"
    FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "Budget"
    ADD CONSTRAINT "Budget_selfInspectionId_fkey"
    FOREIGN KEY ("selfInspectionId") REFERENCES "SelfInspection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "Budget"
    ADD CONSTRAINT "Budget_workOrderId_fkey"
    FOREIGN KEY ("workOrderId") REFERENCES "WorkOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "Budget"
    ADD CONSTRAINT "Budget_createdById_fkey"
    FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "Budget"
    ADD CONSTRAINT "Budget_updatedById_fkey"
    FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "BudgetItem"
    ADD CONSTRAINT "BudgetItem_budgetId_fkey"
    FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "BudgetItem"
    ADD CONSTRAINT "BudgetItem_referenceCatalogId_fkey"
    FOREIGN KEY ("referenceCatalogId") REFERENCES "BudgetReferenceCatalog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "BudgetStatusLog"
    ADD CONSTRAINT "BudgetStatusLog_budgetId_fkey"
    FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "BudgetStatusLog"
    ADD CONSTRAINT "BudgetStatusLog_changedById_fkey"
    FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
