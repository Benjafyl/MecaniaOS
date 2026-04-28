


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."InventoryMovementType" AS ENUM (
    'INBOUND',
    'OUTBOUND',
    'ADJUSTMENT'
);


ALTER TYPE "public"."InventoryMovementType" OWNER TO "postgres";


CREATE TYPE "public"."QuoteItemType" AS ENUM (
    'LABOR',
    'PART',
    'SUPPLY'
);


ALTER TYPE "public"."QuoteItemType" OWNER TO "postgres";


CREATE TYPE "public"."QuoteRecipientType" AS ENUM (
    'CUSTOMER',
    'INSURER'
);


ALTER TYPE "public"."QuoteRecipientType" OWNER TO "postgres";


CREATE TYPE "public"."QuoteStatus" AS ENUM (
    'DRAFT',
    'SENT',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE "public"."QuoteStatus" OWNER TO "postgres";


CREATE TYPE "public"."ReviewRecommendedNextStep" AS ENUM (
    'SCHEDULE_DIAGNOSTIC',
    'REQUEST_TOW',
    'REFER_MECHANICS',
    'REFER_BODY_PAINT',
    'REFER_ELECTRICAL',
    'PREPARE_QUOTE',
    'REQUEST_MORE_EVIDENCE',
    'FOLLOW_UP_CALL'
);


ALTER TYPE "public"."ReviewRecommendedNextStep" OWNER TO "postgres";


CREATE TYPE "public"."SelfInspectionAnswerType" AS ENUM (
    'BOOLEAN',
    'SINGLE_CHOICE',
    'MULTI_CHOICE',
    'TEXT',
    'LONG_TEXT',
    'NUMBER',
    'DATE'
);


ALTER TYPE "public"."SelfInspectionAnswerType" OWNER TO "postgres";


CREATE TYPE "public"."SelfInspectionDepartment" AS ENUM (
    'MECHANICS',
    'BODY_PAINT',
    'ELECTRICAL',
    'INSURANCE',
    'GENERAL_DIAGNOSIS'
);


ALTER TYPE "public"."SelfInspectionDepartment" OWNER TO "postgres";


CREATE TYPE "public"."SelfInspectionNoteType" AS ENUM (
    'CUSTOMER_OBSERVATION',
    'CUSTOMER_BACKGROUND',
    'CUSTOMER_INSTRUCTION',
    'CUSTOMER_AVAILABILITY',
    'INTERNAL_REVIEW',
    'SYSTEM_SUMMARY'
);


ALTER TYPE "public"."SelfInspectionNoteType" OWNER TO "postgres";


CREATE TYPE "public"."SelfInspectionPhotoType" AS ENUM (
    'FRONTAL_FULL',
    'REAR_FULL',
    'LEFT_SIDE_FULL',
    'RIGHT_SIDE_FULL',
    'DASHBOARD_ON',
    'ODOMETER',
    'FRONT_LEFT_TIRE',
    'FRONT_RIGHT_TIRE',
    'REAR_LEFT_TIRE',
    'REAR_RIGHT_TIRE',
    'PRIMARY_DAMAGE',
    'DAMAGE_CONTEXT',
    'ENGINE',
    'TRUNK',
    'FRONT_INTERIOR',
    'REAR_INTERIOR',
    'VEHICLE_DOCUMENTS',
    'COLLISION_ZONE',
    'FLUID_LEAK',
    'DASHBOARD_WARNING_DETAIL',
    'BROKEN_PART',
    'VIN_VISIBLE',
    'OTHER'
);


ALTER TYPE "public"."SelfInspectionPhotoType" OWNER TO "postgres";


CREATE TYPE "public"."SelfInspectionReason" AS ENUM (
    'PREVENTIVE_MAINTENANCE',
    'MECHANICAL_FAILURE',
    'STRANGE_NOISE',
    'DASHBOARD_WARNING_LIGHTS',
    'COLLISION_DAMAGE',
    'BODY_PAINT_DAMAGE',
    'PRE_PURCHASE',
    'OTHER'
);


ALTER TYPE "public"."SelfInspectionReason" OWNER TO "postgres";


CREATE TYPE "public"."SelfInspectionRiskLevel" AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
);


ALTER TYPE "public"."SelfInspectionRiskLevel" OWNER TO "postgres";


CREATE TYPE "public"."SelfInspectionSource" AS ENUM (
    'CUSTOMER_PORTAL',
    'SECURE_LINK',
    'STAFF_ASSISTED'
);


ALTER TYPE "public"."SelfInspectionSource" OWNER TO "postgres";


CREATE TYPE "public"."SelfInspectionStatus" AS ENUM (
    'DRAFT',
    'IN_PROGRESS',
    'SUBMITTED',
    'UNDER_REVIEW',
    'REVIEWED',
    'CONVERTED_TO_WORK_ORDER',
    'CANCELLED'
);


ALTER TYPE "public"."SelfInspectionStatus" OWNER TO "postgres";


CREATE TYPE "public"."UserRole" AS ENUM (
    'ADMIN',
    'MECHANIC',
    'CUSTOMER'
);


ALTER TYPE "public"."UserRole" OWNER TO "postgres";


CREATE TYPE "public"."VehicleFuelType" AS ENUM (
    'GASOLINE',
    'DIESEL',
    'HYBRID',
    'ELECTRIC',
    'LPG',
    'CNG',
    'FLEX',
    'OTHER'
);


ALTER TYPE "public"."VehicleFuelType" OWNER TO "postgres";


CREATE TYPE "public"."VehicleTransmissionType" AS ENUM (
    'MANUAL',
    'AUTOMATIC',
    'CVT',
    'DUAL_CLUTCH',
    'OTHER'
);


ALTER TYPE "public"."VehicleTransmissionType" OWNER TO "postgres";


CREATE TYPE "public"."WorkOrderStatus" AS ENUM (
    'RECEIVED',
    'IN_DIAGNOSIS',
    'WAITING_APPROVAL',
    'WAITING_PARTS',
    'IN_REPAIR',
    'IN_PAINT',
    'READY_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED'
);


ALTER TYPE "public"."WorkOrderStatus" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."Client" (
    "id" "text" NOT NULL,
    "fullName" "text" NOT NULL,
    "localIdentifier" character varying(32),
    "phone" character varying(32) NOT NULL,
    "email" character varying(255) NOT NULL,
    "address" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."Client" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Quote" (
    "id" "text" NOT NULL,
    "quoteNumber" "text" NOT NULL,
    "clientId" "text" NOT NULL,
    "vehicleId" "text" NOT NULL,
    "selfInspectionId" "text",
    "recipientType" "public"."QuoteRecipientType" DEFAULT 'CUSTOMER'::"public"."QuoteRecipientType" NOT NULL,
    "status" "public"."QuoteStatus" DEFAULT 'DRAFT'::"public"."QuoteStatus" NOT NULL,
    "summary" "text",
    "internalNotes" "text",
    "totalAmount" numeric(12,2) NOT NULL,
    "sentAt" timestamp(3) without time zone,
    "sentById" "text",
    "approvedAt" timestamp(3) without time zone,
    "approvedById" "text",
    "rejectedAt" timestamp(3) without time zone,
    "rejectedById" "text",
    "createdById" "text" NOT NULL,
    "updatedById" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."Quote" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."QuoteItem" (
    "id" "text" NOT NULL,
    "quoteId" "text" NOT NULL,
    "type" "public"."QuoteItemType" NOT NULL,
    "description" "text" NOT NULL,
    "quantity" numeric(10,2) NOT NULL,
    "unitPrice" numeric(12,2) NOT NULL,
    "lineTotal" numeric(12,2) NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."QuoteItem" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."QuoteStatusLog" (
    "id" "text" NOT NULL,
    "quoteId" "text" NOT NULL,
    "previousStatus" "public"."QuoteStatus",
    "nextStatus" "public"."QuoteStatus" NOT NULL,
    "note" "text",
    "changedById" "text" NOT NULL,
    "changedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public"."QuoteStatusLog" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."SelfInspection" (
    "id" "text" NOT NULL,
    "customerId" "text" NOT NULL,
    "vehicleId" "text",
    "workOrderId" "text",
    "status" "public"."SelfInspectionStatus" DEFAULT 'DRAFT'::"public"."SelfInspectionStatus" NOT NULL,
    "sourceChannel" "public"."SelfInspectionSource" DEFAULT 'SECURE_LINK'::"public"."SelfInspectionSource" NOT NULL,
    "accessTokenHash" "text",
    "accessTokenExpiresAt" timestamp(3) without time zone,
    "inspectionReason" "public"."SelfInspectionReason",
    "inspectionReasonOther" "text",
    "mainComplaint" "text",
    "canDrive" boolean,
    "startedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "submittedAt" timestamp(3) without time zone,
    "reviewedAt" timestamp(3) without time zone,
    "reviewerId" "text",
    "overallRiskLevel" "public"."SelfInspectionRiskLevel" DEFAULT 'LOW'::"public"."SelfInspectionRiskLevel" NOT NULL,
    "summaryGenerated" "text",
    "completionPercent" integer DEFAULT 0 NOT NULL,
    "lastCompletedStep" integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."SelfInspection" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."SelfInspectionAnswer" (
    "id" "text" NOT NULL,
    "selfInspectionId" "text" NOT NULL,
    "section" character varying(64) NOT NULL,
    "questionKey" character varying(80) NOT NULL,
    "questionLabel" character varying(255) NOT NULL,
    "answerType" "public"."SelfInspectionAnswerType" NOT NULL,
    "answerValue" "jsonb" NOT NULL,
    "severity" "public"."SelfInspectionRiskLevel",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."SelfInspectionAnswer" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."SelfInspectionNote" (
    "id" "text" NOT NULL,
    "selfInspectionId" "text" NOT NULL,
    "noteType" "public"."SelfInspectionNoteType" NOT NULL,
    "content" "text" NOT NULL,
    "createdById" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."SelfInspectionNote" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."SelfInspectionPhoto" (
    "id" "text" NOT NULL,
    "selfInspectionId" "text" NOT NULL,
    "photoType" "public"."SelfInspectionPhotoType" NOT NULL,
    "fileUrl" "text" NOT NULL,
    "storageKey" "text" NOT NULL,
    "fileName" "text" NOT NULL,
    "mimeType" "text" NOT NULL,
    "sizeBytes" integer NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "isRequired" boolean NOT NULL,
    "comment" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public"."SelfInspectionPhoto" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."SelfInspectionReview" (
    "id" "text" NOT NULL,
    "selfInspectionId" "text" NOT NULL,
    "reviewedById" "text" NOT NULL,
    "riskAssessment" "public"."SelfInspectionRiskLevel" NOT NULL,
    "internalSummary" "text" NOT NULL,
    "recommendedNextStep" "public"."ReviewRecommendedNextStep" NOT NULL,
    "departmentSuggestion" "public"."SelfInspectionDepartment",
    "createWorkOrderSuggestion" boolean DEFAULT false NOT NULL,
    "createQuoteSuggestion" boolean DEFAULT false NOT NULL,
    "reviewedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public"."SelfInspectionReview" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."SelfInspectionStatusLog" (
    "id" "text" NOT NULL,
    "selfInspectionId" "text" NOT NULL,
    "previousStatus" "public"."SelfInspectionStatus",
    "nextStatus" "public"."SelfInspectionStatus" NOT NULL,
    "note" "text",
    "changedById" "text",
    "changedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public"."SelfInspectionStatusLog" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."SelfInspectionVehicleSnapshot" (
    "id" "text" NOT NULL,
    "selfInspectionId" "text" NOT NULL,
    "plate" character varying(16),
    "vin" character varying(32),
    "make" "text" NOT NULL,
    "model" "text" NOT NULL,
    "year" integer NOT NULL,
    "color" "text",
    "mileage" integer NOT NULL,
    "fuelType" "public"."VehicleFuelType" NOT NULL,
    "transmission" "public"."VehicleTransmissionType" NOT NULL,
    "starts" boolean NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."SelfInspectionVehicleSnapshot" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Session" (
    "id" "text" NOT NULL,
    "tokenHash" "text" NOT NULL,
    "userId" "text" NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public"."Session" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."SparePart" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "code" character varying(64) NOT NULL,
    "reference" character varying(64),
    "currentStock" integer DEFAULT 0 NOT NULL,
    "minimumStock" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."SparePart" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."SparePartMovement" (
    "id" "text" NOT NULL,
    "sparePartId" "text" NOT NULL,
    "type" "public"."InventoryMovementType" NOT NULL,
    "quantity" integer NOT NULL,
    "previousStock" integer NOT NULL,
    "resultingStock" integer NOT NULL,
    "note" "text",
    "createdById" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public"."SparePartMovement" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."User" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "passwordHash" "text" NOT NULL,
    "role" "public"."UserRole" NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "clientId" "text"
);


ALTER TABLE "public"."User" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Vehicle" (
    "id" "text" NOT NULL,
    "clientId" "text" NOT NULL,
    "plate" character varying(16),
    "vin" character varying(32) NOT NULL,
    "make" "text" NOT NULL,
    "model" "text" NOT NULL,
    "year" integer NOT NULL,
    "color" "text",
    "mileage" integer,
    "fuelType" "public"."VehicleFuelType",
    "transmission" "public"."VehicleTransmissionType",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."Vehicle" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."WorkOrder" (
    "id" "text" NOT NULL,
    "clientId" "text" NOT NULL,
    "vehicleId" "text" NOT NULL,
    "orderNumber" "text" NOT NULL,
    "reason" "text" NOT NULL,
    "initialDiagnosis" "text",
    "status" "public"."WorkOrderStatus" DEFAULT 'RECEIVED'::"public"."WorkOrderStatus" NOT NULL,
    "intakeDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "estimatedDate" timestamp(3) without time zone,
    "closedDate" timestamp(3) without time zone,
    "notes" "text",
    "createdById" "text" NOT NULL,
    "updatedById" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "assignedTechnicianId" "text"
);


ALTER TABLE "public"."WorkOrder" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."WorkOrderEvidence" (
    "id" "text" NOT NULL,
    "workOrderId" "text" NOT NULL,
    "uploadedById" "text" NOT NULL,
    "fileUrl" "text" NOT NULL,
    "storageKey" "text" NOT NULL,
    "fileName" "text" NOT NULL,
    "mimeType" "text" NOT NULL,
    "sizeBytes" integer NOT NULL,
    "note" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public"."WorkOrderEvidence" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."WorkOrderStatusLog" (
    "id" "text" NOT NULL,
    "workOrderId" "text" NOT NULL,
    "previousStatus" "public"."WorkOrderStatus",
    "nextStatus" "public"."WorkOrderStatus" NOT NULL,
    "note" "text",
    "changedById" "text" NOT NULL,
    "changedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public"."WorkOrderStatusLog" OWNER TO "postgres";


ALTER TABLE ONLY "public"."Client"
    ADD CONSTRAINT "Client_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."QuoteItem"
    ADD CONSTRAINT "QuoteItem_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."QuoteStatusLog"
    ADD CONSTRAINT "QuoteStatusLog_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Quote"
    ADD CONSTRAINT "Quote_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."SelfInspectionAnswer"
    ADD CONSTRAINT "SelfInspectionAnswer_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."SelfInspectionNote"
    ADD CONSTRAINT "SelfInspectionNote_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."SelfInspectionPhoto"
    ADD CONSTRAINT "SelfInspectionPhoto_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."SelfInspectionReview"
    ADD CONSTRAINT "SelfInspectionReview_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."SelfInspectionStatusLog"
    ADD CONSTRAINT "SelfInspectionStatusLog_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."SelfInspectionVehicleSnapshot"
    ADD CONSTRAINT "SelfInspectionVehicleSnapshot_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."SelfInspection"
    ADD CONSTRAINT "SelfInspection_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."SparePartMovement"
    ADD CONSTRAINT "SparePartMovement_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."SparePart"
    ADD CONSTRAINT "SparePart_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Vehicle"
    ADD CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."WorkOrderEvidence"
    ADD CONSTRAINT "WorkOrderEvidence_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."WorkOrderStatusLog"
    ADD CONSTRAINT "WorkOrderStatusLog_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."WorkOrder"
    ADD CONSTRAINT "WorkOrder_pkey" PRIMARY KEY ("id");



CREATE INDEX "Client_email_idx" ON "public"."Client" USING "btree" ("email");



CREATE INDEX "Client_fullName_idx" ON "public"."Client" USING "btree" ("fullName");



CREATE INDEX "QuoteItem_quoteId_sortOrder_idx" ON "public"."QuoteItem" USING "btree" ("quoteId", "sortOrder");



CREATE INDEX "QuoteStatusLog_quoteId_changedAt_idx" ON "public"."QuoteStatusLog" USING "btree" ("quoteId", "changedAt");



CREATE INDEX "Quote_clientId_createdAt_idx" ON "public"."Quote" USING "btree" ("clientId", "createdAt");



CREATE UNIQUE INDEX "Quote_quoteNumber_key" ON "public"."Quote" USING "btree" ("quoteNumber");



CREATE INDEX "Quote_selfInspectionId_idx" ON "public"."Quote" USING "btree" ("selfInspectionId");



CREATE INDEX "Quote_status_recipientType_idx" ON "public"."Quote" USING "btree" ("status", "recipientType");



CREATE INDEX "Quote_vehicleId_createdAt_idx" ON "public"."Quote" USING "btree" ("vehicleId", "createdAt");



CREATE UNIQUE INDEX "SelfInspectionAnswer_selfInspectionId_questionKey_key" ON "public"."SelfInspectionAnswer" USING "btree" ("selfInspectionId", "questionKey");



CREATE INDEX "SelfInspectionAnswer_selfInspectionId_section_idx" ON "public"."SelfInspectionAnswer" USING "btree" ("selfInspectionId", "section");



CREATE INDEX "SelfInspectionAnswer_severity_idx" ON "public"."SelfInspectionAnswer" USING "btree" ("severity");



CREATE INDEX "SelfInspectionNote_selfInspectionId_noteType_idx" ON "public"."SelfInspectionNote" USING "btree" ("selfInspectionId", "noteType");



CREATE INDEX "SelfInspectionPhoto_selfInspectionId_photoType_idx" ON "public"."SelfInspectionPhoto" USING "btree" ("selfInspectionId", "photoType");



CREATE UNIQUE INDEX "SelfInspectionPhoto_storageKey_key" ON "public"."SelfInspectionPhoto" USING "btree" ("storageKey");



CREATE INDEX "SelfInspectionReview_selfInspectionId_reviewedAt_idx" ON "public"."SelfInspectionReview" USING "btree" ("selfInspectionId", "reviewedAt");



CREATE INDEX "SelfInspectionStatusLog_selfInspectionId_changedAt_idx" ON "public"."SelfInspectionStatusLog" USING "btree" ("selfInspectionId", "changedAt");



CREATE INDEX "SelfInspectionVehicleSnapshot_plate_idx" ON "public"."SelfInspectionVehicleSnapshot" USING "btree" ("plate");



CREATE UNIQUE INDEX "SelfInspectionVehicleSnapshot_selfInspectionId_key" ON "public"."SelfInspectionVehicleSnapshot" USING "btree" ("selfInspectionId");



CREATE INDEX "SelfInspectionVehicleSnapshot_vin_idx" ON "public"."SelfInspectionVehicleSnapshot" USING "btree" ("vin");



CREATE UNIQUE INDEX "SelfInspection_accessTokenHash_key" ON "public"."SelfInspection" USING "btree" ("accessTokenHash");



CREATE INDEX "SelfInspection_customerId_createdAt_idx" ON "public"."SelfInspection" USING "btree" ("customerId", "createdAt");



CREATE INDEX "SelfInspection_status_overallRiskLevel_idx" ON "public"."SelfInspection" USING "btree" ("status", "overallRiskLevel");



CREATE INDEX "SelfInspection_submittedAt_idx" ON "public"."SelfInspection" USING "btree" ("submittedAt");



CREATE INDEX "SelfInspection_vehicleId_createdAt_idx" ON "public"."SelfInspection" USING "btree" ("vehicleId", "createdAt");



CREATE INDEX "Session_expiresAt_idx" ON "public"."Session" USING "btree" ("expiresAt");



CREATE UNIQUE INDEX "Session_tokenHash_key" ON "public"."Session" USING "btree" ("tokenHash");



CREATE INDEX "Session_userId_idx" ON "public"."Session" USING "btree" ("userId");



CREATE INDEX "SparePartMovement_sparePartId_createdAt_idx" ON "public"."SparePartMovement" USING "btree" ("sparePartId", "createdAt");



CREATE INDEX "SparePartMovement_type_createdAt_idx" ON "public"."SparePartMovement" USING "btree" ("type", "createdAt");



CREATE UNIQUE INDEX "SparePart_code_key" ON "public"."SparePart" USING "btree" ("code");



CREATE INDEX "SparePart_currentStock_minimumStock_idx" ON "public"."SparePart" USING "btree" ("currentStock", "minimumStock");



CREATE INDEX "SparePart_name_idx" ON "public"."SparePart" USING "btree" ("name");



CREATE UNIQUE INDEX "User_clientId_key" ON "public"."User" USING "btree" ("clientId");



CREATE UNIQUE INDEX "User_email_key" ON "public"."User" USING "btree" ("email");



CREATE INDEX "Vehicle_clientId_idx" ON "public"."Vehicle" USING "btree" ("clientId");



CREATE INDEX "Vehicle_make_model_idx" ON "public"."Vehicle" USING "btree" ("make", "model");



CREATE UNIQUE INDEX "Vehicle_plate_key" ON "public"."Vehicle" USING "btree" ("plate");



CREATE UNIQUE INDEX "Vehicle_vin_key" ON "public"."Vehicle" USING "btree" ("vin");



CREATE UNIQUE INDEX "WorkOrderEvidence_storageKey_key" ON "public"."WorkOrderEvidence" USING "btree" ("storageKey");



CREATE INDEX "WorkOrderEvidence_workOrderId_createdAt_idx" ON "public"."WorkOrderEvidence" USING "btree" ("workOrderId", "createdAt");



CREATE INDEX "WorkOrderStatusLog_workOrderId_changedAt_idx" ON "public"."WorkOrderStatusLog" USING "btree" ("workOrderId", "changedAt");



CREATE INDEX "WorkOrder_assignedTechnicianId_intakeDate_idx" ON "public"."WorkOrder" USING "btree" ("assignedTechnicianId", "intakeDate");



CREATE INDEX "WorkOrder_clientId_intakeDate_idx" ON "public"."WorkOrder" USING "btree" ("clientId", "intakeDate");



CREATE UNIQUE INDEX "WorkOrder_orderNumber_key" ON "public"."WorkOrder" USING "btree" ("orderNumber");



CREATE INDEX "WorkOrder_status_idx" ON "public"."WorkOrder" USING "btree" ("status");



CREATE INDEX "WorkOrder_vehicleId_intakeDate_idx" ON "public"."WorkOrder" USING "btree" ("vehicleId", "intakeDate");



ALTER TABLE ONLY "public"."QuoteItem"
    ADD CONSTRAINT "QuoteItem_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "public"."Quote"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."QuoteStatusLog"
    ADD CONSTRAINT "QuoteStatusLog_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."QuoteStatusLog"
    ADD CONSTRAINT "QuoteStatusLog_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "public"."Quote"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Quote"
    ADD CONSTRAINT "Quote_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."Quote"
    ADD CONSTRAINT "Quote_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Quote"
    ADD CONSTRAINT "Quote_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Quote"
    ADD CONSTRAINT "Quote_rejectedById_fkey" FOREIGN KEY ("rejectedById") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."Quote"
    ADD CONSTRAINT "Quote_selfInspectionId_fkey" FOREIGN KEY ("selfInspectionId") REFERENCES "public"."SelfInspection"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."Quote"
    ADD CONSTRAINT "Quote_sentById_fkey" FOREIGN KEY ("sentById") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."Quote"
    ADD CONSTRAINT "Quote_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."Quote"
    ADD CONSTRAINT "Quote_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "public"."Vehicle"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."SelfInspectionAnswer"
    ADD CONSTRAINT "SelfInspectionAnswer_selfInspectionId_fkey" FOREIGN KEY ("selfInspectionId") REFERENCES "public"."SelfInspection"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."SelfInspectionNote"
    ADD CONSTRAINT "SelfInspectionNote_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."SelfInspectionNote"
    ADD CONSTRAINT "SelfInspectionNote_selfInspectionId_fkey" FOREIGN KEY ("selfInspectionId") REFERENCES "public"."SelfInspection"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."SelfInspectionPhoto"
    ADD CONSTRAINT "SelfInspectionPhoto_selfInspectionId_fkey" FOREIGN KEY ("selfInspectionId") REFERENCES "public"."SelfInspection"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."SelfInspectionReview"
    ADD CONSTRAINT "SelfInspectionReview_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."SelfInspectionReview"
    ADD CONSTRAINT "SelfInspectionReview_selfInspectionId_fkey" FOREIGN KEY ("selfInspectionId") REFERENCES "public"."SelfInspection"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."SelfInspectionStatusLog"
    ADD CONSTRAINT "SelfInspectionStatusLog_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."SelfInspectionStatusLog"
    ADD CONSTRAINT "SelfInspectionStatusLog_selfInspectionId_fkey" FOREIGN KEY ("selfInspectionId") REFERENCES "public"."SelfInspection"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."SelfInspectionVehicleSnapshot"
    ADD CONSTRAINT "SelfInspectionVehicleSnapshot_selfInspectionId_fkey" FOREIGN KEY ("selfInspectionId") REFERENCES "public"."SelfInspection"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."SelfInspection"
    ADD CONSTRAINT "SelfInspection_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Client"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."SelfInspection"
    ADD CONSTRAINT "SelfInspection_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."SelfInspection"
    ADD CONSTRAINT "SelfInspection_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "public"."Vehicle"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."SelfInspection"
    ADD CONSTRAINT "SelfInspection_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "public"."WorkOrder"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."SparePartMovement"
    ADD CONSTRAINT "SparePartMovement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."SparePartMovement"
    ADD CONSTRAINT "SparePartMovement_sparePartId_fkey" FOREIGN KEY ("sparePartId") REFERENCES "public"."SparePart"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "User_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."Vehicle"
    ADD CONSTRAINT "Vehicle_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."WorkOrderEvidence"
    ADD CONSTRAINT "WorkOrderEvidence_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."WorkOrderEvidence"
    ADD CONSTRAINT "WorkOrderEvidence_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "public"."WorkOrder"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."WorkOrderStatusLog"
    ADD CONSTRAINT "WorkOrderStatusLog_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."WorkOrderStatusLog"
    ADD CONSTRAINT "WorkOrderStatusLog_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "public"."WorkOrder"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."WorkOrder"
    ADD CONSTRAINT "WorkOrder_assignedTechnicianId_fkey" FOREIGN KEY ("assignedTechnicianId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."WorkOrder"
    ADD CONSTRAINT "WorkOrder_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."WorkOrder"
    ADD CONSTRAINT "WorkOrder_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."WorkOrder"
    ADD CONSTRAINT "WorkOrder_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."WorkOrder"
    ADD CONSTRAINT "WorkOrder_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "public"."Vehicle"("id") ON UPDATE CASCADE ON DELETE RESTRICT;





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";





































































































































































GRANT ALL ON TABLE "public"."Client" TO "anon";
GRANT ALL ON TABLE "public"."Client" TO "authenticated";
GRANT ALL ON TABLE "public"."Client" TO "service_role";



GRANT ALL ON TABLE "public"."Quote" TO "anon";
GRANT ALL ON TABLE "public"."Quote" TO "authenticated";
GRANT ALL ON TABLE "public"."Quote" TO "service_role";



GRANT ALL ON TABLE "public"."QuoteItem" TO "anon";
GRANT ALL ON TABLE "public"."QuoteItem" TO "authenticated";
GRANT ALL ON TABLE "public"."QuoteItem" TO "service_role";



GRANT ALL ON TABLE "public"."QuoteStatusLog" TO "anon";
GRANT ALL ON TABLE "public"."QuoteStatusLog" TO "authenticated";
GRANT ALL ON TABLE "public"."QuoteStatusLog" TO "service_role";



GRANT ALL ON TABLE "public"."SelfInspection" TO "anon";
GRANT ALL ON TABLE "public"."SelfInspection" TO "authenticated";
GRANT ALL ON TABLE "public"."SelfInspection" TO "service_role";



GRANT ALL ON TABLE "public"."SelfInspectionAnswer" TO "anon";
GRANT ALL ON TABLE "public"."SelfInspectionAnswer" TO "authenticated";
GRANT ALL ON TABLE "public"."SelfInspectionAnswer" TO "service_role";



GRANT ALL ON TABLE "public"."SelfInspectionNote" TO "anon";
GRANT ALL ON TABLE "public"."SelfInspectionNote" TO "authenticated";
GRANT ALL ON TABLE "public"."SelfInspectionNote" TO "service_role";



GRANT ALL ON TABLE "public"."SelfInspectionPhoto" TO "anon";
GRANT ALL ON TABLE "public"."SelfInspectionPhoto" TO "authenticated";
GRANT ALL ON TABLE "public"."SelfInspectionPhoto" TO "service_role";



GRANT ALL ON TABLE "public"."SelfInspectionReview" TO "anon";
GRANT ALL ON TABLE "public"."SelfInspectionReview" TO "authenticated";
GRANT ALL ON TABLE "public"."SelfInspectionReview" TO "service_role";



GRANT ALL ON TABLE "public"."SelfInspectionStatusLog" TO "anon";
GRANT ALL ON TABLE "public"."SelfInspectionStatusLog" TO "authenticated";
GRANT ALL ON TABLE "public"."SelfInspectionStatusLog" TO "service_role";



GRANT ALL ON TABLE "public"."SelfInspectionVehicleSnapshot" TO "anon";
GRANT ALL ON TABLE "public"."SelfInspectionVehicleSnapshot" TO "authenticated";
GRANT ALL ON TABLE "public"."SelfInspectionVehicleSnapshot" TO "service_role";



GRANT ALL ON TABLE "public"."Session" TO "anon";
GRANT ALL ON TABLE "public"."Session" TO "authenticated";
GRANT ALL ON TABLE "public"."Session" TO "service_role";



GRANT ALL ON TABLE "public"."SparePart" TO "anon";
GRANT ALL ON TABLE "public"."SparePart" TO "authenticated";
GRANT ALL ON TABLE "public"."SparePart" TO "service_role";



GRANT ALL ON TABLE "public"."SparePartMovement" TO "anon";
GRANT ALL ON TABLE "public"."SparePartMovement" TO "authenticated";
GRANT ALL ON TABLE "public"."SparePartMovement" TO "service_role";



GRANT ALL ON TABLE "public"."User" TO "anon";
GRANT ALL ON TABLE "public"."User" TO "authenticated";
GRANT ALL ON TABLE "public"."User" TO "service_role";



GRANT ALL ON TABLE "public"."Vehicle" TO "anon";
GRANT ALL ON TABLE "public"."Vehicle" TO "authenticated";
GRANT ALL ON TABLE "public"."Vehicle" TO "service_role";



GRANT ALL ON TABLE "public"."WorkOrder" TO "anon";
GRANT ALL ON TABLE "public"."WorkOrder" TO "authenticated";
GRANT ALL ON TABLE "public"."WorkOrder" TO "service_role";



GRANT ALL ON TABLE "public"."WorkOrderEvidence" TO "anon";
GRANT ALL ON TABLE "public"."WorkOrderEvidence" TO "authenticated";
GRANT ALL ON TABLE "public"."WorkOrderEvidence" TO "service_role";



GRANT ALL ON TABLE "public"."WorkOrderStatusLog" TO "anon";
GRANT ALL ON TABLE "public"."WorkOrderStatusLog" TO "authenticated";
GRANT ALL ON TABLE "public"."WorkOrderStatusLog" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";


