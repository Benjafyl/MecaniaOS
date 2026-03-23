import {
  ReviewRecommendedNextStep,
  SelfInspectionDepartment,
  SelfInspectionPhotoType,
  SelfInspectionReason,
  SelfInspectionRiskLevel,
  SelfInspectionSource,
  SelfInspectionStatus,
  VehicleFuelType,
  VehicleTransmissionType,
} from "@prisma/client";
import { z } from "zod";

import { requiredInteger, requiredText } from "@/lib/validation";

const currentYear = new Date().getFullYear() + 1;
const plateRegex = /^([A-Z]{4}\d{2}|[A-Z]{2}\d{4})$/;

function emptyToUndefined(value: unknown) {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  return value;
}

function optionalText(max = 255) {
  return z.preprocess(emptyToUndefined, z.string().trim().max(max).optional());
}

function requiredBoolean(message: string) {
  return z.preprocess((value) => {
    if (typeof value === "boolean") {
      return value;
    }

    if (value === "true") {
      return true;
    }

    if (value === "false") {
      return false;
    }

    return value;
  }, z.boolean({ error: message }));
}

function optionalBoolean() {
  return z.preprocess((value) => {
    if (typeof value === "boolean") {
      return value;
    }

    if (value === "true") {
      return true;
    }

    if (value === "false") {
      return false;
    }

    return emptyToUndefined(value);
  }, z.boolean().optional());
}

function numberFromUnknown(min: number, max: number) {
  return z.preprocess((value) => {
    if (typeof value === "number") {
      return value;
    }

    if (typeof value === "string") {
      return Number(value);
    }

    return value;
  }, z.number().int().min(min).max(max));
}

export function normalizePlate(value: string) {
  return value.replace(/[\s-]/g, "").toUpperCase();
}

export const plateSchema = z
  .string()
  .trim()
  .transform(normalizePlate)
  .refine((value) => plateRegex.test(value), "La patente no tiene un formato valido");

export const optionalPlateSchema = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .trim()
    .transform(normalizePlate)
    .refine((value) => plateRegex.test(value), "La patente no tiene un formato valido")
    .optional(),
);

export const selfInspectionVehicleStepSchema = z.object({
  vehicleId: optionalText(40),
  plate: plateSchema,
  vin: optionalText(32).transform((value) => value?.toUpperCase()),
  make: requiredText(1, 80),
  model: requiredText(1, 80),
  year: requiredInteger(1950, currentYear),
  color: optionalText(40),
  mileage: requiredInteger(0, 2_000_000),
  fuelType: z.nativeEnum(VehicleFuelType),
  transmission: z.nativeEnum(VehicleTransmissionType),
  starts: requiredBoolean("Debes indicar si el vehiculo enciende"),
});

export const selfInspectionReasonStepSchema = z
  .object({
    inspectionReason: z.nativeEnum(SelfInspectionReason),
    inspectionReasonOther: optionalText(120),
    mainComplaint: requiredText(5, 600),
    problemSince: optionalText(120),
    issueFrequency: z.enum(["CONSTANT", "INTERMITTENT"]).optional(),
    canDrive: requiredBoolean("Debes indicar si el vehiculo puede circular"),
    worsenedRecently: optionalBoolean(),
  })
  .superRefine((value, ctx) => {
    if (value.inspectionReason === SelfInspectionReason.OTHER && !value.inspectionReasonOther) {
      ctx.addIssue({
        code: "custom",
        message: "Debes especificar el motivo cuando seleccionas 'Otro'",
        path: ["inspectionReasonOther"],
      });
    }

    const requiresProblemTimeline =
      value.inspectionReason !== SelfInspectionReason.PREVENTIVE_MAINTENANCE &&
      value.inspectionReason !== SelfInspectionReason.PRE_PURCHASE;

    if (requiresProblemTimeline && !value.problemSince) {
      ctx.addIssue({
        code: "custom",
        message: "Indica desde cuando ocurre el problema",
        path: ["problemSince"],
      });
    }

    if (requiresProblemTimeline && !value.issueFrequency) {
      ctx.addIssue({
        code: "custom",
        message: "Selecciona la frecuencia del problema",
        path: ["issueFrequency"],
      });
    }

    if (requiresProblemTimeline && value.worsenedRecently === undefined) {
      ctx.addIssue({
        code: "custom",
        message: "Debes indicar si el problema empeoro recientemente",
        path: ["worsenedRecently"],
      });
    }
  });

const operationalSchema = z
  .object({
    startBehavior: z.enum(["NORMAL", "DIFFICULT", "NO_START"]),
    unusualNoises: requiredBoolean("Selecciona una opcion"),
    vibrations: requiredBoolean("Selecciona una opcion"),
    shutsOffByItself: requiredBoolean("Selecciona una opcion"),
    powerLoss: requiredBoolean("Selecciona una opcion"),
    unusualSmoke: requiredBoolean("Selecciona una opcion"),
    strangeSmell: requiredBoolean("Selecciona una opcion"),
    dashboardWarningLights: requiredBoolean("Selecciona una opcion"),
    dashboardWarningDetails: optionalText(160),
  })
  .superRefine((value, ctx) => {
    if (value.dashboardWarningLights && !value.dashboardWarningDetails) {
      ctx.addIssue({
        code: "custom",
        message: "Describe los testigos encendidos",
        path: ["dashboardWarningDetails"],
      });
    }
  });

const engineSchema = z
  .object({
    knockingNoises: requiredBoolean("Selecciona una opcion"),
    powerLossUnderLoad: requiredBoolean("Selecciona una opcion"),
    idleUnstable: requiredBoolean("Selecciona una opcion"),
    overheating: requiredBoolean("Selecciona una opcion"),
    fluidLeaks: requiredBoolean("Selecciona una opcion"),
    fluidLeakDetails: optionalText(160),
    checkEngineLight: requiredBoolean("Selecciona una opcion"),
    coldStartProblems: requiredBoolean("Selecciona una opcion"),
    highFuelConsumption: requiredBoolean("Selecciona una opcion"),
  })
  .superRefine((value, ctx) => {
    if (value.fluidLeaks && !value.fluidLeakDetails) {
      ctx.addIssue({
        code: "custom",
        message: "Describe la fuga o el fluido visible",
        path: ["fluidLeakDetails"],
      });
    }
  });

const brakesSchema = z.object({
  workingProperly: requiredBoolean("Selecciona una opcion"),
  noise: requiredBoolean("Selecciona una opcion"),
  pedalFeel: z.enum(["NORMAL", "SOFT", "HARD"]),
  pullsSide: requiredBoolean("Selecciona una opcion"),
  vibration: requiredBoolean("Selecciona una opcion"),
  absWarning: requiredBoolean("Selecciona una opcion"),
});

const steeringSuspensionSchema = z.object({
  steeringHard: requiredBoolean("Selecciona una opcion"),
  steeringVibration: requiredBoolean("Selecciona una opcion"),
  vehiclePullsSide: requiredBoolean("Selecciona una opcion"),
  suspensionKnocks: requiredBoolean("Selecciona una opcion"),
  excessiveBounce: requiredBoolean("Selecciona una opcion"),
  unevenRideHeight: requiredBoolean("Selecciona una opcion"),
});

const automaticTransmissionSchema = z.object({
  shiftSmooth: requiredBoolean("Selecciona una opcion"),
  jerks: requiredBoolean("Selecciona una opcion"),
  delay: requiredBoolean("Selecciona una opcion"),
  shiftNoise: requiredBoolean("Selecciona una opcion"),
});

const manualTransmissionSchema = z.object({
  hardGears: requiredBoolean("Selecciona una opcion"),
  clutchSlipping: requiredBoolean("Selecciona una opcion"),
  clutchPedalPosition: z.enum(["NORMAL", "HIGH", "LOW"]),
  clutchNoise: requiredBoolean("Selecciona una opcion"),
});

const tiresSchema = z.object({
  worn: requiredBoolean("Selecciona una opcion"),
  wearPattern: z.enum(["EVEN", "UNEVEN", "NOT_SURE"]),
  lowPressureOrPuncture: requiredBoolean("Selecciona una opcion"),
  damagedRims: requiredBoolean("Selecciona una opcion"),
  speedVibration: requiredBoolean("Selecciona una opcion"),
});

const electricalSchema = z.object({
  frontLights: requiredBoolean("Selecciona una opcion"),
  rearLights: requiredBoolean("Selecciona una opcion"),
  turnSignals: requiredBoolean("Selecciona una opcion"),
  horn: requiredBoolean("Selecciona una opcion"),
  climateControl: requiredBoolean("Selecciona una opcion"),
  centralLocking: requiredBoolean("Selecciona una opcion"),
  windows: requiredBoolean("Selecciona una opcion"),
  batteryFailedRecently: requiredBoolean("Selecciona una opcion"),
});

const interiorSchema = z.object({
  visibleDamage: requiredBoolean("Selecciona una opcion"),
  instrumentPanelWorking: requiredBoolean("Selecciona una opcion"),
  multimediaWorking: z.enum(["YES", "NO", "NOT_APPLICABLE"]),
  waterLeaks: requiredBoolean("Selecciona una opcion"),
  cabinStrangeSmells: requiredBoolean("Selecciona una opcion"),
});

const exteriorSchema = z.object({
  scratches: requiredBoolean("Selecciona una opcion"),
  dents: requiredBoolean("Selecciona una opcion"),
  misalignedPanels: requiredBoolean("Selecciona una opcion"),
  damagedGlassOrLights: requiredBoolean("Selecciona una opcion"),
  brokenTrim: requiredBoolean("Selecciona una opcion"),
  damageAge: z.enum(["RECENT", "OLD", "MIXED", "NOT_APPLICABLE"]),
});

export const selfInspectionGeneralStepSchema = z.object({
  operational: operationalSchema,
  engine: engineSchema,
  brakes: brakesSchema,
  steeringSuspension: steeringSuspensionSchema,
  automaticTransmission: automaticTransmissionSchema.optional(),
  manualTransmission: manualTransmissionSchema.optional(),
  tires: tiresSchema,
  electrical: electricalSchema,
  interior: interiorSchema,
  exterior: exteriorSchema,
});

export const selfInspectionDamageStepSchema = z.object({
  recentCollision: requiredBoolean("Selecciona una opcion"),
  affectedZone: z.enum(["FRONTAL", "REAR", "LEFT_SIDE", "RIGHT_SIDE", "ROOF", "MULTIPLE", "NONE"]),
  affectsFunctionality: requiredBoolean("Selecciona una opcion"),
  structuralImpact: requiredBoolean("Selecciona una opcion"),
  exposureEvents: z
    .array(z.enum(["TOWED", "FLOODED", "FIRE"]))
    .max(3)
    .default([]),
  insuranceOrPoliceReport: requiredBoolean("Selecciona una opcion"),
  wantsInsuranceEvaluation: requiredBoolean("Selecciona una opcion"),
});

export const selfInspectionHistoryStepSchema = z
  .object({
    lastMaintenanceAt: requiredText(2, 80),
    lastMaintenancePerformed: requiredText(4, 400),
    brakesReplacedRecently: requiredBoolean("Selecciona una opcion"),
    batteryReplacedRecently: requiredBoolean("Selecciona una opcion"),
    tiresReplacedRecently: requiredBoolean("Selecciona una opcion"),
    oilAndFiltersChanged: requiredBoolean("Selecciona una opcion"),
    pendingRecentRepairs: requiredBoolean("Selecciona una opcion"),
    checkedByAnotherWorkshop: requiredBoolean("Selecciona una opcion"),
    previousQuoteOrDiagnosis: requiredBoolean("Selecciona una opcion"),
    previousDiagnosisDetails: optionalText(600),
  })
  .superRefine((value, ctx) => {
    if (value.previousQuoteOrDiagnosis && !value.previousDiagnosisDetails) {
      ctx.addIssue({
        code: "custom",
        message: "Describe el presupuesto o diagnostico previo",
        path: ["previousDiagnosisDetails"],
      });
    }
  });

export const selfInspectionNotesStepSchema = z.object({
  additionalProblemContext: optionalText(1_000),
  triggerConditions: optionalText(800),
  importantBackground: optionalText(1_000),
  workshopInstructions: optionalText(800),
  customerAvailability: optionalText(400),
});

export const createSelfInspectionInviteSchema = z.object({
  customerId: requiredText(1, 40),
  vehicleId: optionalText(40),
  sourceChannel: z.nativeEnum(SelfInspectionSource).default(SelfInspectionSource.SECURE_LINK),
  expiresInDays: numberFromUnknown(1, 30).default(7),
});

export const reviewSelfInspectionSchema = z.object({
  riskAssessment: z.nativeEnum(SelfInspectionRiskLevel),
  internalSummary: requiredText(12, 2_000),
  recommendedNextStep: z.nativeEnum(ReviewRecommendedNextStep),
  departmentSuggestion: z.preprocess(
    emptyToUndefined,
    z.nativeEnum(SelfInspectionDepartment).optional(),
  ),
  createWorkOrderSuggestion: optionalBoolean().transform((value) => value ?? false),
  createQuoteSuggestion: optionalBoolean().transform((value) => value ?? false),
  note: optionalText(500),
});

export const updateSelfInspectionStatusSchema = z.object({
  status: z.nativeEnum(SelfInspectionStatus),
  note: optionalText(255),
});

export const selfInspectionFiltersSchema = z.object({
  q: optionalText(120),
  status: z.preprocess(emptyToUndefined, z.nativeEnum(SelfInspectionStatus).optional()),
  risk: z.preprocess(emptyToUndefined, z.nativeEnum(SelfInspectionRiskLevel).optional()),
});

export const selfInspectionPhotoUploadSchema = z.object({
  photoType: z.nativeEnum(SelfInspectionPhotoType),
  comment: optionalText(240),
  sortOrder: numberFromUnknown(0, 100).default(0),
});

export const submitSelfInspectionSchema = z.object({
  acceptance: requiredBoolean("Debes confirmar la declaracion final").refine(Boolean, {
    message: "Debes confirmar la declaracion final",
  }),
});

export type SelfInspectionVehicleStepInput = z.infer<typeof selfInspectionVehicleStepSchema>;
export type SelfInspectionReasonStepInput = z.infer<typeof selfInspectionReasonStepSchema>;
export type SelfInspectionGeneralStepInput = z.infer<typeof selfInspectionGeneralStepSchema>;
export type SelfInspectionDamageStepInput = z.infer<typeof selfInspectionDamageStepSchema>;
export type SelfInspectionHistoryStepInput = z.infer<typeof selfInspectionHistoryStepSchema>;
export type SelfInspectionNotesStepInput = z.infer<typeof selfInspectionNotesStepSchema>;
export type CreateSelfInspectionInviteInput = z.infer<typeof createSelfInspectionInviteSchema>;
export type ReviewSelfInspectionInput = z.infer<typeof reviewSelfInspectionSchema>;
