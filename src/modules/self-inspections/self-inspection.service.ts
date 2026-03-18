import {
  Prisma,
  SelfInspectionAnswerType,
  SelfInspectionNoteType,
  SelfInspectionRiskLevel,
  SelfInspectionStatus,
  VehicleFuelType,
  VehicleTransmissionType,
} from "@prisma/client";
import { createHash, randomBytes } from "node:crypto";

import { AppError, ConflictError, NotFoundError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import {
  SELF_INSPECTION_AUTOMATIC_ONLY_KEYS,
  SELF_INSPECTION_MANUAL_ONLY_KEYS,
  SELF_INSPECTION_NEXT_STEP_LABELS,
  SELF_INSPECTION_PHOTO_SLOTS,
  SELF_INSPECTION_PHOTO_TYPE_LABELS,
  SELF_INSPECTION_QUESTION_DEFINITIONS,
  SELF_INSPECTION_REASON_LABELS,
  SELF_INSPECTION_REQUIRED_ANSWER_KEYS,
  SELF_INSPECTION_REQUIRED_PHOTO_TYPES,
  SELF_INSPECTION_RISK_LABELS,
  SELF_INSPECTION_SECTION_LABELS,
  SELF_INSPECTION_STATUS_LABELS,
} from "@/modules/self-inspections/self-inspection.constants";
import {
  createSelfInspectionInviteSchema,
  reviewSelfInspectionSchema,
  selfInspectionDamageStepSchema,
  selfInspectionFiltersSchema,
  selfInspectionGeneralStepSchema,
  selfInspectionHistoryStepSchema,
  selfInspectionNotesStepSchema,
  selfInspectionPhotoUploadSchema,
  selfInspectionReasonStepSchema,
  selfInspectionVehicleStepSchema,
  submitSelfInspectionSchema,
  updateSelfInspectionStatusSchema,
  type CreateSelfInspectionInviteInput,
} from "@/modules/self-inspections/self-inspection.schemas";
import { selfInspectionRepository } from "@/modules/self-inspections/self-inspection.repository";
import {
  deleteInspectionPhotoFile,
  saveInspectionPhotoFile,
} from "@/modules/self-inspections/self-inspection.storage";

type AnswerRecordInput = {
  section: string;
  questionKey: string;
  questionLabel: string;
  answerType: SelfInspectionAnswerType;
  answerValue: Prisma.InputJsonValue;
  severity: SelfInspectionRiskLevel | null;
};

type AnswerMap = Record<string, unknown>;

const AUTOMATIC_TRANSMISSIONS = new Set<VehicleTransmissionType>([
  VehicleTransmissionType.AUTOMATIC,
  VehicleTransmissionType.CVT,
  VehicleTransmissionType.DUAL_CLUTCH,
]);

const CUSTOMER_NOTE_FIELDS = [
  {
    fieldKey: "additionalProblemContext",
    noteType: SelfInspectionNoteType.CUSTOMER_OBSERVATION,
  },
  {
    fieldKey: "triggerConditions",
    noteType: SelfInspectionNoteType.CUSTOMER_OBSERVATION,
  },
  {
    fieldKey: "importantBackground",
    noteType: SelfInspectionNoteType.CUSTOMER_BACKGROUND,
  },
  {
    fieldKey: "workshopInstructions",
    noteType: SelfInspectionNoteType.CUSTOMER_INSTRUCTION,
  },
  {
    fieldKey: "customerAvailability",
    noteType: SelfInspectionNoteType.CUSTOMER_AVAILABILITY,
  },
] as const;

const RISK_PRIORITY: Record<SelfInspectionRiskLevel, number> = {
  [SelfInspectionRiskLevel.LOW]: 0,
  [SelfInspectionRiskLevel.MEDIUM]: 1,
  [SelfInspectionRiskLevel.HIGH]: 2,
  [SelfInspectionRiskLevel.CRITICAL]: 3,
};

function createAccessToken() {
  return randomBytes(32).toString("hex");
}

function hashAccessToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function getHigherRisk(
  current: SelfInspectionRiskLevel,
  next: SelfInspectionRiskLevel | null | undefined,
) {
  if (!next) {
    return current;
  }

  return RISK_PRIORITY[next] > RISK_PRIORITY[current] ? next : current;
}

function isCustomerEditableStatus(status: SelfInspectionStatus) {
  return status === SelfInspectionStatus.DRAFT || status === SelfInspectionStatus.IN_PROGRESS;
}

function serializeNoteContent(fieldKey: string, value: string) {
  return `[[${fieldKey}]] ${value}`;
}

function parseNoteContent(value: string) {
  const match = value.match(/^\[\[(.+?)\]\]\s([\s\S]*)$/);

  if (!match) {
    return {
      fieldKey: null,
      content: value,
    };
  }

  return {
    fieldKey: match[1],
    content: match[2],
  };
}

function isAutomaticTransmission(value: VehicleTransmissionType) {
  return AUTOMATIC_TRANSMISSIONS.has(value);
}

function getCompletionPercent(lastCompletedStep: number, status: SelfInspectionStatus) {
  if (
    status === SelfInspectionStatus.SUBMITTED ||
    status === SelfInspectionStatus.UNDER_REVIEW ||
    status === SelfInspectionStatus.REVIEWED ||
    status === SelfInspectionStatus.CONVERTED_TO_WORK_ORDER
  ) {
    return 100;
  }

  return Math.min(95, Math.max(10, Math.round(((lastCompletedStep - 1) / 8) * 100)));
}

function mapAnswersToRecord(answers: Array<{ questionKey: string; answerValue: Prisma.JsonValue }>) {
  return answers.reduce<AnswerMap>((accumulator, answer) => {
    accumulator[answer.questionKey] = answer.answerValue;
    return accumulator;
  }, {});
}

function parseCustomerNotes(
  notes: Array<{ noteType: SelfInspectionNoteType; content: string }>,
) {
  return notes.reduce(
    (accumulator, note) => {
      const parsed = parseNoteContent(note.content);

      if (parsed.fieldKey) {
        accumulator[parsed.fieldKey] = parsed.content;
      }

      return accumulator;
    },
    {
      additionalProblemContext: "",
      triggerConditions: "",
      importantBackground: "",
      workshopInstructions: "",
      customerAvailability: "",
    } as Record<string, string>,
  );
}

function getVehicleSnapshotFromVehicle(vehicle?: {
  id: string;
  plate: string | null;
  vin: string;
  make: string;
  model: string;
  year: number;
  color: string | null;
  mileage: number | null;
  fuelType: VehicleFuelType | null;
  transmission: VehicleTransmissionType | null;
}) {
  if (!vehicle) {
    return null;
  }

  return {
    vehicleId: vehicle.id,
    plate: vehicle.plate ?? "",
    vin: vehicle.vin ?? "",
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    color: vehicle.color ?? "",
    mileage: vehicle.mileage ?? 0,
    fuelType: vehicle.fuelType ?? undefined,
    transmission: vehicle.transmission ?? undefined,
    starts: true,
  };
}

function buildVehicleStepDraft(
  inspection: NonNullable<Awaited<ReturnType<typeof selfInspectionRepository.findByAccessTokenHash>>>,
) {
  const snapshot = inspection.vehicleSnapshot;
  const vehicle = inspection.vehicle;
  const fallback = getVehicleSnapshotFromVehicle(vehicle ?? undefined);

  return {
    vehicleId: inspection.vehicleId ?? "",
    plate: snapshot?.plate ?? fallback?.plate ?? "",
    vin: snapshot?.vin ?? fallback?.vin ?? "",
    make: snapshot?.make ?? fallback?.make ?? "",
    model: snapshot?.model ?? fallback?.model ?? "",
    year: snapshot?.year ?? fallback?.year ?? "",
    color: snapshot?.color ?? fallback?.color ?? "",
    mileage: snapshot?.mileage ?? fallback?.mileage ?? "",
    fuelType: snapshot?.fuelType ?? fallback?.fuelType ?? "",
    transmission: snapshot?.transmission ?? fallback?.transmission ?? "",
    starts: snapshot?.starts ?? true,
  };
}

function buildReasonStepDraft(
  inspection: NonNullable<Awaited<ReturnType<typeof selfInspectionRepository.findByAccessTokenHash>>>,
  answersMap: AnswerMap,
) {
  return {
    inspectionReason: inspection.inspectionReason ?? "",
    inspectionReasonOther: inspection.inspectionReasonOther ?? "",
    mainComplaint: inspection.mainComplaint ?? "",
    problemSince: String(answersMap.reason_problem_since ?? ""),
    issueFrequency: String(answersMap.reason_issue_frequency ?? ""),
    canDrive: inspection.canDrive ?? true,
    worsenedRecently: answersMap.reason_worsened_recently ?? undefined,
  };
}

function buildGeneralStepDraft(answersMap: AnswerMap) {
  return {
    operational: {
      startBehavior: String(answersMap.operational_start_behavior ?? ""),
      unusualNoises: answersMap.operational_unusual_noises ?? undefined,
      vibrations: answersMap.operational_vibrations ?? undefined,
      shutsOffByItself: answersMap.operational_shuts_off ?? undefined,
      powerLoss: answersMap.operational_power_loss ?? undefined,
      unusualSmoke: answersMap.operational_unusual_smoke ?? undefined,
      strangeSmell: answersMap.operational_strange_smell ?? undefined,
      dashboardWarningLights: answersMap.operational_dashboard_warning_lights ?? undefined,
      dashboardWarningDetails: String(answersMap.operational_dashboard_warning_details ?? ""),
    },
    engine: {
      knockingNoises: answersMap.engine_knocking_noises ?? undefined,
      powerLossUnderLoad: answersMap.engine_power_loss_under_load ?? undefined,
      idleUnstable: answersMap.engine_idle_unstable ?? undefined,
      overheating: answersMap.engine_overheating ?? undefined,
      fluidLeaks: answersMap.engine_fluid_leaks ?? undefined,
      fluidLeakDetails: String(answersMap.engine_fluid_leak_details ?? ""),
      checkEngineLight: answersMap.engine_check_engine_light ?? undefined,
      coldStartProblems: answersMap.engine_cold_start_problems ?? undefined,
      highFuelConsumption: answersMap.engine_high_fuel_consumption ?? undefined,
    },
    brakes: {
      workingProperly: answersMap.brakes_working_properly ?? undefined,
      noise: answersMap.brakes_noise ?? undefined,
      pedalFeel: String(answersMap.brakes_pedal_feel ?? ""),
      pullsSide: answersMap.brakes_pulls_side ?? undefined,
      vibration: answersMap.brakes_vibration ?? undefined,
      absWarning: answersMap.brakes_abs_warning ?? undefined,
    },
    steeringSuspension: {
      steeringHard: answersMap.steering_hard ?? undefined,
      steeringVibration: answersMap.steering_vibration ?? undefined,
      vehiclePullsSide: answersMap.steering_pulls_side ?? undefined,
      suspensionKnocks: answersMap.suspension_knocks ?? undefined,
      excessiveBounce: answersMap.suspension_excessive_bounce ?? undefined,
      unevenRideHeight: answersMap.suspension_uneven_height ?? undefined,
    },
    automaticTransmission: {
      shiftSmooth: answersMap.transmission_auto_shift_smooth ?? undefined,
      jerks: answersMap.transmission_auto_jerks ?? undefined,
      delay: answersMap.transmission_auto_delay ?? undefined,
      shiftNoise: answersMap.transmission_auto_shift_noise ?? undefined,
    },
    manualTransmission: {
      hardGears: answersMap.transmission_manual_hard_gears ?? undefined,
      clutchSlipping: answersMap.transmission_manual_clutch_slipping ?? undefined,
      clutchPedalPosition: String(answersMap.transmission_manual_clutch_pedal_position ?? ""),
      clutchNoise: answersMap.transmission_manual_clutch_noise ?? undefined,
    },
    tires: {
      worn: answersMap.tires_worn ?? undefined,
      wearPattern: String(answersMap.tires_wear_pattern ?? ""),
      lowPressureOrPuncture: answersMap.tires_low_pressure_or_puncture ?? undefined,
      damagedRims: answersMap.tires_damaged_rims ?? undefined,
      speedVibration: answersMap.tires_speed_vibration ?? undefined,
    },
    electrical: {
      frontLights: answersMap.electrical_front_lights ?? undefined,
      rearLights: answersMap.electrical_rear_lights ?? undefined,
      turnSignals: answersMap.electrical_turn_signals ?? undefined,
      horn: answersMap.electrical_horn ?? undefined,
      climateControl: answersMap.electrical_climate_control ?? undefined,
      centralLocking: answersMap.electrical_central_locking ?? undefined,
      windows: answersMap.electrical_windows ?? undefined,
      batteryFailedRecently: answersMap.electrical_battery_failed_recently ?? undefined,
    },
    interior: {
      visibleDamage: answersMap.interior_visible_damage ?? undefined,
      instrumentPanelWorking: answersMap.interior_instrument_panel_working ?? undefined,
      multimediaWorking: String(answersMap.interior_multimedia_working ?? ""),
      waterLeaks: answersMap.interior_water_leaks ?? undefined,
      cabinStrangeSmells: answersMap.interior_cabin_strange_smells ?? undefined,
    },
    exterior: {
      scratches: answersMap.exterior_scratches ?? undefined,
      dents: answersMap.exterior_dents ?? undefined,
      misalignedPanels: answersMap.exterior_misaligned_panels ?? undefined,
      damagedGlassOrLights: answersMap.exterior_damaged_glass_or_lights ?? undefined,
      brokenTrim: answersMap.exterior_broken_trim ?? undefined,
      damageAge: String(answersMap.exterior_damage_age ?? ""),
    },
  };
}

function buildDamageStepDraft(answersMap: AnswerMap) {
  return {
    recentCollision: answersMap.damage_recent_collision ?? undefined,
    affectedZone: String(answersMap.damage_affected_zone ?? ""),
    affectsFunctionality: answersMap.damage_affects_functionality ?? undefined,
    structuralImpact: answersMap.damage_structural_impact ?? undefined,
    exposureEvents: Array.isArray(answersMap.damage_exposure_events)
      ? answersMap.damage_exposure_events
      : [],
    insuranceOrPoliceReport: answersMap.damage_insurance_or_police_report ?? undefined,
    wantsInsuranceEvaluation: answersMap.damage_wants_insurance_evaluation ?? undefined,
  };
}

function buildHistoryStepDraft(answersMap: AnswerMap) {
  return {
    lastMaintenanceAt: String(answersMap.history_last_maintenance_at ?? ""),
    lastMaintenancePerformed: String(answersMap.history_last_maintenance_performed ?? ""),
    brakesReplacedRecently: answersMap.history_brakes_replaced_recently ?? undefined,
    batteryReplacedRecently: answersMap.history_battery_replaced_recently ?? undefined,
    tiresReplacedRecently: answersMap.history_tires_replaced_recently ?? undefined,
    oilAndFiltersChanged: answersMap.history_oil_and_filters_changed ?? undefined,
    pendingRecentRepairs: answersMap.history_pending_recent_repairs ?? undefined,
    checkedByAnotherWorkshop: answersMap.history_checked_by_another_workshop ?? undefined,
    previousQuoteOrDiagnosis: answersMap.history_previous_quote_or_diagnosis ?? undefined,
    previousDiagnosisDetails: String(answersMap.history_previous_diagnosis_details ?? ""),
  };
}

function resolveAnswerSeverity(questionKey: string, answerValue: unknown) {
  switch (questionKey) {
    case "vehicle_starts":
      return answerValue === false ? SelfInspectionRiskLevel.CRITICAL : null;
    case "reason_can_drive":
      return answerValue === false ? SelfInspectionRiskLevel.CRITICAL : null;
    case "operational_start_behavior":
      return answerValue === "NO_START" ? SelfInspectionRiskLevel.CRITICAL : null;
    case "operational_unusual_smoke":
    case "engine_overheating":
    case "damage_structural_impact":
      return answerValue === true ? SelfInspectionRiskLevel.CRITICAL : null;
    case "engine_fluid_leaks":
    case "engine_check_engine_light":
    case "brakes_abs_warning":
    case "steering_hard":
    case "damage_recent_collision":
    case "damage_affects_functionality":
      return answerValue === true ? SelfInspectionRiskLevel.HIGH : null;
    case "brakes_working_properly":
      return answerValue === false ? SelfInspectionRiskLevel.CRITICAL : null;
    case "operational_dashboard_warning_lights":
      return answerValue === true ? SelfInspectionRiskLevel.HIGH : null;
    case "operational_vibrations":
    case "steering_vibration":
    case "steering_pulls_side":
    case "tires_speed_vibration":
      return answerValue === true ? SelfInspectionRiskLevel.HIGH : null;
    default:
      return null;
  }
}

function buildAnswerRecord(questionKey: string, answerValue: Prisma.InputJsonValue): AnswerRecordInput {
  const definition = SELF_INSPECTION_QUESTION_DEFINITIONS[questionKey];

  if (!definition) {
    throw new AppError(`No existe definicion para la pregunta ${questionKey}`, 500);
  }

  return {
    section: definition.section,
    questionKey,
    questionLabel: definition.label,
    answerType: definition.answerType,
    answerValue,
    severity: resolveAnswerSeverity(questionKey, answerValue),
  };
}

function createCriticalFindings(input: {
  snapshot: {
    starts: boolean;
    transmission: VehicleTransmissionType;
  } | null;
  canDrive: boolean | null;
  answersMap: AnswerMap;
}) {
  const findings: Array<{ label: string; severity: SelfInspectionRiskLevel }> = [];

  if (input.snapshot?.starts === false) {
    findings.push({ label: "Vehiculo no enciende", severity: SelfInspectionRiskLevel.CRITICAL });
  }

  if (input.canDrive === false) {
    findings.push({
      label: "Vehiculo no circulable",
      severity: SelfInspectionRiskLevel.CRITICAL,
    });
  }

  const flaggedQuestions = Object.entries(input.answersMap)
    .map(([questionKey, answerValue]) => {
      const severity = resolveAnswerSeverity(questionKey, answerValue);

      if (!severity) {
        return null;
      }

      return {
        label: SELF_INSPECTION_QUESTION_DEFINITIONS[questionKey]?.label ?? questionKey,
        severity,
      };
    })
    .filter(Boolean) as Array<{ label: string; severity: SelfInspectionRiskLevel }>;

  return [...findings, ...flaggedQuestions];
}

function calculateRiskLevel(input: {
  snapshot: {
    starts: boolean;
  } | null;
  canDrive: boolean | null;
  answersMap: AnswerMap;
}) {
  let overallRisk: SelfInspectionRiskLevel = SelfInspectionRiskLevel.LOW;

  if (input.snapshot?.starts === false || input.canDrive === false) {
    overallRisk = SelfInspectionRiskLevel.CRITICAL;
  }

  for (const [questionKey, answerValue] of Object.entries(input.answersMap)) {
    overallRisk = getHigherRisk(overallRisk, resolveAnswerSeverity(questionKey, answerValue));
  }

  return overallRisk;
}

function buildSummary(input: {
  customerName: string;
  snapshot: {
    plate: string | null;
    make: string;
    model: string;
    mileage: number;
    starts: boolean;
    transmission: VehicleTransmissionType;
  } | null;
  inspectionReason: string | null;
  mainComplaint: string | null;
  canDrive: boolean | null;
  overallRiskLevel: SelfInspectionRiskLevel;
  answersMap: AnswerMap;
  photoCount: number;
}) {
  const findings = createCriticalFindings({
    snapshot: input.snapshot
      ? {
          starts: input.snapshot.starts,
          transmission: input.snapshot.transmission,
        }
      : null,
    canDrive: input.canDrive,
    answersMap: input.answersMap,
  })
    .slice(0, 4)
    .map((entry) => entry.label.toLowerCase());

  const segments = [
    `${input.customerName} reporta ${input.mainComplaint?.trim() || "una revision pendiente"}.`,
    input.snapshot
      ? `Vehiculo ${input.snapshot.make} ${input.snapshot.model} ${input.snapshot.plate ?? "sin patente"} con ${input.snapshot.mileage.toLocaleString("es-CL")} km.`
      : "Vehiculo sin snapshot completo todavia.",
    input.inspectionReason
      ? `Motivo principal: ${input.inspectionReason.toLowerCase()}.`
      : "Motivo principal sin definir.",
    input.canDrive === false
      ? "El cliente informa que el vehiculo no puede circular."
      : "El cliente indica que el vehiculo aun puede circular.",
    findings.length > 0
      ? `Alertas detectadas: ${findings.join(", ")}.`
      : "No hay alertas criticas reportadas en este momento.",
    `Riesgo preliminar ${SELF_INSPECTION_RISK_LABELS[input.overallRiskLevel].toLowerCase()} con ${input.photoCount} fotos cargadas.`,
  ];

  return segments.join(" ");
}

async function assertInspectionCustomerEditableByToken(token: string) {
  const inspection = await getPublicSelfInspectionEntity(token);

  if (!isCustomerEditableStatus(inspection.status)) {
    throw new ConflictError("La autoinspeccion ya fue enviada y no admite mas cambios");
  }

  return inspection;
}

async function getPublicSelfInspectionEntity(token: string) {
  const inspection = await selfInspectionRepository.findByAccessTokenHash(hashAccessToken(token));

  if (!inspection) {
    throw new NotFoundError("Enlace de autoinspeccion no encontrado");
  }

  if (inspection.accessTokenExpiresAt && inspection.accessTokenExpiresAt < new Date()) {
    throw new AppError("El enlace seguro ha expirado", 410);
  }

  return inspection;
}

async function updateInspectionDerivedState(selfInspectionId: string, input?: { lastCompletedStep?: number }) {
  const inspection = await selfInspectionRepository.findSummaryById(selfInspectionId);

  if (!inspection) {
    throw new NotFoundError("Autoinspeccion no encontrada");
  }

  const answersMap = mapAnswersToRecord(inspection.answers);
  const overallRiskLevel = calculateRiskLevel({
    snapshot: inspection.vehicleSnapshot
      ? {
          starts: inspection.vehicleSnapshot.starts,
        }
      : null,
    canDrive: inspection.canDrive,
    answersMap,
  });
  const summaryGenerated = buildSummary({
    customerName: inspection.customer.fullName,
    snapshot: inspection.vehicleSnapshot
      ? {
          plate: inspection.vehicleSnapshot.plate,
          make: inspection.vehicleSnapshot.make,
          model: inspection.vehicleSnapshot.model,
          mileage: inspection.vehicleSnapshot.mileage,
          starts: inspection.vehicleSnapshot.starts,
          transmission: inspection.vehicleSnapshot.transmission,
        }
      : null,
    inspectionReason: inspection.inspectionReason
      ? SELF_INSPECTION_REASON_LABELS[inspection.inspectionReason]
      : null,
    mainComplaint: inspection.mainComplaint,
    canDrive: inspection.canDrive,
    overallRiskLevel,
    answersMap,
    photoCount: inspection.photos.length,
  });
  const lastCompletedStep = Math.max(input?.lastCompletedStep ?? inspection.lastCompletedStep, inspection.lastCompletedStep);
  const nextStatus =
    inspection.status === SelfInspectionStatus.DRAFT &&
    (input?.lastCompletedStep ?? inspection.lastCompletedStep) > 1
      ? SelfInspectionStatus.IN_PROGRESS
      : inspection.status;

  await prisma.selfInspection.update({
    where: {
      id: selfInspectionId,
    },
    data: {
      status: nextStatus,
      overallRiskLevel,
      summaryGenerated,
      lastCompletedStep,
      completionPercent: getCompletionPercent(lastCompletedStep, nextStatus),
    },
  });
}

export async function listSelfInspections(input?: unknown) {
  const filters = selfInspectionFiltersSchema.parse(input ?? {});
  const inspections = await selfInspectionRepository.list({
    search: filters.q?.trim(),
    status: filters.status,
    risk: filters.risk,
  });

  return inspections.map((inspection) => {
    const answersMap = mapAnswersToRecord(inspection.answers);
    const criticalFindings = createCriticalFindings({
      snapshot: inspection.vehicleSnapshot
        ? {
            starts: inspection.vehicleSnapshot.starts,
            transmission: inspection.vehicleSnapshot.transmission,
          }
        : null,
      canDrive: inspection.canDrive,
      answersMap,
    });

    return {
      ...inspection,
      criticalFindings,
    };
  });
}

export async function getSelfInspectionById(id: string) {
  const inspection = await selfInspectionRepository.findById(id);

  if (!inspection) {
    throw new NotFoundError("Autoinspeccion no encontrada");
  }

  const answersMap = mapAnswersToRecord(inspection.answers);
  const groupedAnswers = Object.entries(SELF_INSPECTION_SECTION_LABELS).map(([sectionKey, sectionLabel]) => ({
    key: sectionKey,
    label: sectionLabel,
    answers: inspection.answers.filter((answer) => answer.section === sectionKey),
  }));
  const criticalFindings = createCriticalFindings({
    snapshot: inspection.vehicleSnapshot
      ? {
          starts: inspection.vehicleSnapshot.starts,
          transmission: inspection.vehicleSnapshot.transmission,
        }
      : null,
    canDrive: inspection.canDrive,
    answersMap,
  });
  const missingRequiredPhotoTypes = SELF_INSPECTION_REQUIRED_PHOTO_TYPES.filter(
    (photoType) => !inspection.photos.some((photo) => photo.photoType === photoType),
  );

  return {
    ...inspection,
    groupedAnswers,
    criticalFindings,
    missingRequiredPhotoTypes,
  };
}

export async function createSelfInspectionInvite(input: unknown) {
  const data = createSelfInspectionInviteSchema.parse(input) as CreateSelfInspectionInviteInput;
  const customer = await prisma.client.findUnique({
    where: { id: data.customerId },
    include: {
      vehicles: true,
    },
  });

  if (!customer) {
    throw new NotFoundError("Cliente no encontrado");
  }

  let vehicle = data.vehicleId
    ? await selfInspectionRepository.findVehicleForCustomer(data.customerId, data.vehicleId)
    : null;

  if (data.vehicleId && !vehicle) {
    throw new ConflictError("El vehiculo no pertenece al cliente seleccionado");
  }

  const rawToken = createAccessToken();
  const accessTokenHash = hashAccessToken(rawToken);
  const accessTokenExpiresAt = new Date(Date.now() + data.expiresInDays * 24 * 60 * 60 * 1000);

  const created = await prisma.$transaction(async (tx) => {
    const inspection = await tx.selfInspection.create({
      data: {
        customerId: data.customerId,
        vehicleId: vehicle?.id,
        sourceChannel: data.sourceChannel,
        accessTokenHash,
        accessTokenExpiresAt,
        status: SelfInspectionStatus.DRAFT,
        lastCompletedStep: 1,
        completionPercent: 10,
        vehicleSnapshot: vehicle
          ? {
              create: {
                plate: vehicle.plate,
                vin: vehicle.vin,
                make: vehicle.make,
                model: vehicle.model,
                year: vehicle.year,
                color: vehicle.color,
                mileage: vehicle.mileage ?? 0,
                fuelType: vehicle.fuelType ?? VehicleFuelType.GASOLINE,
                transmission: vehicle.transmission ?? VehicleTransmissionType.MANUAL,
                starts: true,
              },
            }
          : undefined,
      },
    });

    await tx.selfInspectionStatusLog.create({
      data: {
        selfInspectionId: inspection.id,
        previousStatus: null,
        nextStatus: SelfInspectionStatus.DRAFT,
        note: "Autoinspeccion creada y enlace seguro generado",
      },
    });

    return inspection;
  });

  vehicle = vehicle ?? customer.vehicles[0] ?? null;

  return {
    inspectionId: created.id,
    token: rawToken,
    accessTokenExpiresAt,
    publicPath: `/self-inspections/start/${rawToken}`,
    customer: {
      id: customer.id,
      fullName: customer.fullName,
    },
    vehicle: vehicle
      ? {
          id: vehicle.id,
          label: `${vehicle.make} ${vehicle.model} / ${vehicle.plate ?? "Sin patente"}`,
        }
      : null,
  };
}

export async function getPublicSelfInspectionWizard(token: string) {
  const inspection = await getPublicSelfInspectionEntity(token);
  const answersMap = mapAnswersToRecord(inspection.answers);
  const customerNotes = parseCustomerNotes(inspection.notes);
  const criticalFindings = createCriticalFindings({
    snapshot: inspection.vehicleSnapshot
      ? {
          starts: inspection.vehicleSnapshot.starts,
          transmission: inspection.vehicleSnapshot.transmission,
        }
      : null,
    canDrive: inspection.canDrive,
    answersMap,
  });

  return {
    inspection: {
      id: inspection.id,
      status: inspection.status,
      statusLabel: SELF_INSPECTION_STATUS_LABELS[inspection.status],
      overallRiskLevel: inspection.overallRiskLevel,
      overallRiskLabel: SELF_INSPECTION_RISK_LABELS[inspection.overallRiskLevel],
      sourceChannel: inspection.sourceChannel,
      completionPercent: inspection.completionPercent,
      lastCompletedStep: inspection.lastCompletedStep,
      startedAt: inspection.startedAt,
      submittedAt: inspection.submittedAt,
      summaryGenerated: inspection.summaryGenerated,
      accessTokenExpiresAt: inspection.accessTokenExpiresAt,
    },
    customer: {
      id: inspection.customer.id,
      fullName: inspection.customer.fullName,
      phone: inspection.customer.phone,
      email: inspection.customer.email,
    },
    vehicles: inspection.customer.vehicles.map((vehicle) => ({
      id: vehicle.id,
      label: `${vehicle.make} ${vehicle.model} / ${vehicle.plate ?? "Sin patente"}`,
      plate: vehicle.plate,
      vin: vehicle.vin,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color,
      mileage: vehicle.mileage,
      fuelType: vehicle.fuelType,
      transmission: vehicle.transmission,
    })),
    form: {
      vehicle: buildVehicleStepDraft(inspection),
      reason: buildReasonStepDraft(inspection, answersMap),
      general: buildGeneralStepDraft(answersMap),
      damage: buildDamageStepDraft(answersMap),
      history: buildHistoryStepDraft(answersMap),
      notes: customerNotes,
    },
    photos: inspection.photos.map((photo) => ({
      id: photo.id,
      photoType: photo.photoType,
      photoTypeLabel: SELF_INSPECTION_PHOTO_TYPE_LABELS[photo.photoType],
      fileUrl: photo.fileUrl,
      fileName: photo.fileName,
      comment: photo.comment,
      isRequired: photo.isRequired,
      sortOrder: photo.sortOrder,
      createdAt: photo.createdAt,
    })),
    photoSlots: SELF_INSPECTION_PHOTO_SLOTS,
    criticalFindings,
    missingRequiredPhotoTypes: SELF_INSPECTION_REQUIRED_PHOTO_TYPES.filter(
      (photoType) => !inspection.photos.some((photo) => photo.photoType === photoType),
    ),
  };
}

async function upsertAnswerRecords(selfInspectionId: string, answers: AnswerRecordInput[]) {
  if (answers.length === 0) {
    return;
  }

  await prisma.$transaction(
    answers.map((answer) =>
      prisma.selfInspectionAnswer.upsert({
        where: {
          selfInspectionId_questionKey: {
            selfInspectionId,
            questionKey: answer.questionKey,
          },
        },
        create: {
          selfInspectionId,
          section: answer.section,
          questionKey: answer.questionKey,
          questionLabel: answer.questionLabel,
          answerType: answer.answerType,
          answerValue: answer.answerValue,
          severity: answer.severity,
        },
        update: {
          section: answer.section,
          questionLabel: answer.questionLabel,
          answerType: answer.answerType,
          answerValue: answer.answerValue,
          severity: answer.severity,
        },
      }),
    ),
  );
}

async function deleteAnswerKeys(selfInspectionId: string, questionKeys: readonly string[]) {
  if (questionKeys.length === 0) {
    return;
  }

  await prisma.selfInspectionAnswer.deleteMany({
    where: {
      selfInspectionId,
      questionKey: {
        in: [...questionKeys],
      },
    },
  });
}

async function persistCustomerNotes(
  selfInspectionId: string,
  input: Record<string, string | undefined>,
) {
  const noteTypes = [...new Set(CUSTOMER_NOTE_FIELDS.map((entry) => entry.noteType))];

  await prisma.$transaction(async (tx) => {
    await tx.selfInspectionNote.deleteMany({
      where: {
        selfInspectionId,
        noteType: {
          in: noteTypes,
        },
      },
    });

    const notesToCreate = CUSTOMER_NOTE_FIELDS.flatMap((entry) => {
      const rawValue = input[entry.fieldKey];
      const trimmed = rawValue?.trim();

      if (!trimmed) {
        return [];
      }

      return [
        {
          selfInspectionId,
          noteType: entry.noteType,
          content: serializeNoteContent(entry.fieldKey, trimmed),
        },
      ];
    });

    if (notesToCreate.length > 0) {
      await tx.selfInspectionNote.createMany({
        data: notesToCreate,
      });
    }
  });
}

async function syncTransmissionBranchAnswers(
  selfInspectionId: string,
  transmission: VehicleTransmissionType,
) {
  if (isAutomaticTransmission(transmission)) {
    await deleteAnswerKeys(selfInspectionId, SELF_INSPECTION_MANUAL_ONLY_KEYS);
    return;
  }

  if (transmission === VehicleTransmissionType.MANUAL) {
    await deleteAnswerKeys(selfInspectionId, SELF_INSPECTION_AUTOMATIC_ONLY_KEYS);
    return;
  }

  await deleteAnswerKeys(selfInspectionId, [
    ...SELF_INSPECTION_AUTOMATIC_ONLY_KEYS,
    ...SELF_INSPECTION_MANUAL_ONLY_KEYS,
  ]);
}

function buildReasonAnswerRecords(data: ReturnType<typeof selfInspectionReasonStepSchema.parse>) {
  return [
    buildAnswerRecord("reason_problem_since", data.problemSince),
    buildAnswerRecord("reason_issue_frequency", data.issueFrequency),
    buildAnswerRecord("reason_can_drive", data.canDrive),
    buildAnswerRecord("reason_worsened_recently", data.worsenedRecently),
  ];
}

function buildGeneralAnswerRecords(data: ReturnType<typeof selfInspectionGeneralStepSchema.parse>) {
  const answers: AnswerRecordInput[] = [
    buildAnswerRecord("operational_start_behavior", data.operational.startBehavior),
    buildAnswerRecord("operational_unusual_noises", data.operational.unusualNoises),
    buildAnswerRecord("operational_vibrations", data.operational.vibrations),
    buildAnswerRecord("operational_shuts_off", data.operational.shutsOffByItself),
    buildAnswerRecord("operational_power_loss", data.operational.powerLoss),
    buildAnswerRecord("operational_unusual_smoke", data.operational.unusualSmoke),
    buildAnswerRecord("operational_strange_smell", data.operational.strangeSmell),
    buildAnswerRecord(
      "operational_dashboard_warning_lights",
      data.operational.dashboardWarningLights,
    ),
    buildAnswerRecord(
      "operational_dashboard_warning_details",
      data.operational.dashboardWarningDetails ?? "",
    ),
    buildAnswerRecord("engine_knocking_noises", data.engine.knockingNoises),
    buildAnswerRecord("engine_power_loss_under_load", data.engine.powerLossUnderLoad),
    buildAnswerRecord("engine_idle_unstable", data.engine.idleUnstable),
    buildAnswerRecord("engine_overheating", data.engine.overheating),
    buildAnswerRecord("engine_fluid_leaks", data.engine.fluidLeaks),
    buildAnswerRecord("engine_fluid_leak_details", data.engine.fluidLeakDetails ?? ""),
    buildAnswerRecord("engine_check_engine_light", data.engine.checkEngineLight),
    buildAnswerRecord("engine_cold_start_problems", data.engine.coldStartProblems),
    buildAnswerRecord("engine_high_fuel_consumption", data.engine.highFuelConsumption),
    buildAnswerRecord("brakes_working_properly", data.brakes.workingProperly),
    buildAnswerRecord("brakes_noise", data.brakes.noise),
    buildAnswerRecord("brakes_pedal_feel", data.brakes.pedalFeel),
    buildAnswerRecord("brakes_pulls_side", data.brakes.pullsSide),
    buildAnswerRecord("brakes_vibration", data.brakes.vibration),
    buildAnswerRecord("brakes_abs_warning", data.brakes.absWarning),
    buildAnswerRecord("steering_hard", data.steeringSuspension.steeringHard),
    buildAnswerRecord("steering_vibration", data.steeringSuspension.steeringVibration),
    buildAnswerRecord("steering_pulls_side", data.steeringSuspension.vehiclePullsSide),
    buildAnswerRecord("suspension_knocks", data.steeringSuspension.suspensionKnocks),
    buildAnswerRecord(
      "suspension_excessive_bounce",
      data.steeringSuspension.excessiveBounce,
    ),
    buildAnswerRecord("suspension_uneven_height", data.steeringSuspension.unevenRideHeight),
    buildAnswerRecord("tires_worn", data.tires.worn),
    buildAnswerRecord("tires_wear_pattern", data.tires.wearPattern),
    buildAnswerRecord("tires_low_pressure_or_puncture", data.tires.lowPressureOrPuncture),
    buildAnswerRecord("tires_damaged_rims", data.tires.damagedRims),
    buildAnswerRecord("tires_speed_vibration", data.tires.speedVibration),
    buildAnswerRecord("electrical_front_lights", data.electrical.frontLights),
    buildAnswerRecord("electrical_rear_lights", data.electrical.rearLights),
    buildAnswerRecord("electrical_turn_signals", data.electrical.turnSignals),
    buildAnswerRecord("electrical_horn", data.electrical.horn),
    buildAnswerRecord("electrical_climate_control", data.electrical.climateControl),
    buildAnswerRecord("electrical_central_locking", data.electrical.centralLocking),
    buildAnswerRecord("electrical_windows", data.electrical.windows),
    buildAnswerRecord(
      "electrical_battery_failed_recently",
      data.electrical.batteryFailedRecently,
    ),
    buildAnswerRecord("interior_visible_damage", data.interior.visibleDamage),
    buildAnswerRecord(
      "interior_instrument_panel_working",
      data.interior.instrumentPanelWorking,
    ),
    buildAnswerRecord("interior_multimedia_working", data.interior.multimediaWorking),
    buildAnswerRecord("interior_water_leaks", data.interior.waterLeaks),
    buildAnswerRecord("interior_cabin_strange_smells", data.interior.cabinStrangeSmells),
    buildAnswerRecord("exterior_scratches", data.exterior.scratches),
    buildAnswerRecord("exterior_dents", data.exterior.dents),
    buildAnswerRecord("exterior_misaligned_panels", data.exterior.misalignedPanels),
    buildAnswerRecord(
      "exterior_damaged_glass_or_lights",
      data.exterior.damagedGlassOrLights,
    ),
    buildAnswerRecord("exterior_broken_trim", data.exterior.brokenTrim),
    buildAnswerRecord("exterior_damage_age", data.exterior.damageAge),
  ];

  if (data.automaticTransmission) {
    answers.push(
      buildAnswerRecord(
        "transmission_auto_shift_smooth",
        data.automaticTransmission.shiftSmooth,
      ),
      buildAnswerRecord("transmission_auto_jerks", data.automaticTransmission.jerks),
      buildAnswerRecord("transmission_auto_delay", data.automaticTransmission.delay),
      buildAnswerRecord(
        "transmission_auto_shift_noise",
        data.automaticTransmission.shiftNoise,
      ),
    );
  }

  if (data.manualTransmission) {
    answers.push(
      buildAnswerRecord("transmission_manual_hard_gears", data.manualTransmission.hardGears),
      buildAnswerRecord(
        "transmission_manual_clutch_slipping",
        data.manualTransmission.clutchSlipping,
      ),
      buildAnswerRecord(
        "transmission_manual_clutch_pedal_position",
        data.manualTransmission.clutchPedalPosition,
      ),
      buildAnswerRecord("transmission_manual_clutch_noise", data.manualTransmission.clutchNoise),
    );
  }

  return answers;
}

function buildDamageAnswerRecords(data: ReturnType<typeof selfInspectionDamageStepSchema.parse>) {
  return [
    buildAnswerRecord("damage_recent_collision", data.recentCollision),
    buildAnswerRecord("damage_affected_zone", data.affectedZone),
    buildAnswerRecord("damage_affects_functionality", data.affectsFunctionality),
    buildAnswerRecord("damage_structural_impact", data.structuralImpact),
    buildAnswerRecord("damage_exposure_events", data.exposureEvents),
    buildAnswerRecord("damage_insurance_or_police_report", data.insuranceOrPoliceReport),
    buildAnswerRecord(
      "damage_wants_insurance_evaluation",
      data.wantsInsuranceEvaluation,
    ),
  ];
}

function buildHistoryAnswerRecords(data: ReturnType<typeof selfInspectionHistoryStepSchema.parse>) {
  return [
    buildAnswerRecord("history_last_maintenance_at", data.lastMaintenanceAt),
    buildAnswerRecord("history_last_maintenance_performed", data.lastMaintenancePerformed),
    buildAnswerRecord(
      "history_brakes_replaced_recently",
      data.brakesReplacedRecently,
    ),
    buildAnswerRecord(
      "history_battery_replaced_recently",
      data.batteryReplacedRecently,
    ),
    buildAnswerRecord("history_tires_replaced_recently", data.tiresReplacedRecently),
    buildAnswerRecord("history_oil_and_filters_changed", data.oilAndFiltersChanged),
    buildAnswerRecord("history_pending_recent_repairs", data.pendingRecentRepairs),
    buildAnswerRecord(
      "history_checked_by_another_workshop",
      data.checkedByAnotherWorkshop,
    ),
    buildAnswerRecord(
      "history_previous_quote_or_diagnosis",
      data.previousQuoteOrDiagnosis,
    ),
    buildAnswerRecord(
      "history_previous_diagnosis_details",
      data.previousDiagnosisDetails ?? "",
    ),
  ];
}

function getRequiredAnswerKeysForSubmission(
  transmission: VehicleTransmissionType,
  answersMap: AnswerMap,
) {
  const required: string[] = [...SELF_INSPECTION_REQUIRED_ANSWER_KEYS];

  if (isAutomaticTransmission(transmission)) {
    required.push(...SELF_INSPECTION_AUTOMATIC_ONLY_KEYS);
  } else if (transmission === VehicleTransmissionType.MANUAL) {
    required.push(...SELF_INSPECTION_MANUAL_ONLY_KEYS);
  }

  if (answersMap.operational_dashboard_warning_lights === true) {
    required.push("operational_dashboard_warning_details");
  }

  if (answersMap.engine_fluid_leaks === true) {
    required.push("engine_fluid_leak_details");
  }

  if (answersMap.history_previous_quote_or_diagnosis === true) {
    required.push("history_previous_diagnosis_details");
  }

  return required;
}

export async function savePublicSelfInspectionVehicle(token: string, input: unknown) {
  const inspection = await assertInspectionCustomerEditableByToken(token);
  const data = selfInspectionVehicleStepSchema.parse(input);

  let selectedVehicle = null;

  if (data.vehicleId) {
    selectedVehicle = await selfInspectionRepository.findVehicleForCustomer(
      inspection.customerId,
      data.vehicleId,
    );

    if (!selectedVehicle) {
      throw new ConflictError("El vehiculo seleccionado no pertenece al cliente");
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.selfInspection.update({
      where: {
        id: inspection.id,
      },
      data: {
        vehicleId: selectedVehicle?.id ?? null,
      },
    });

    await tx.selfInspectionVehicleSnapshot.upsert({
      where: {
        selfInspectionId: inspection.id,
      },
      create: {
        selfInspectionId: inspection.id,
        plate: data.plate,
        vin: data.vin ?? null,
        make: data.make,
        model: data.model,
        year: data.year,
        color: data.color ?? null,
        mileage: data.mileage,
        fuelType: data.fuelType,
        transmission: data.transmission,
        starts: data.starts,
      },
      update: {
        plate: data.plate,
        vin: data.vin ?? null,
        make: data.make,
        model: data.model,
        year: data.year,
        color: data.color ?? null,
        mileage: data.mileage,
        fuelType: data.fuelType,
        transmission: data.transmission,
        starts: data.starts,
      },
    });
  });

  await upsertAnswerRecords(inspection.id, [buildAnswerRecord("vehicle_starts", data.starts)]);
  await syncTransmissionBranchAnswers(inspection.id, data.transmission);
  await updateInspectionDerivedState(inspection.id, { lastCompletedStep: 2 });

  return getPublicSelfInspectionWizard(token);
}

export async function savePublicSelfInspectionReason(token: string, input: unknown) {
  const inspection = await assertInspectionCustomerEditableByToken(token);
  const data = selfInspectionReasonStepSchema.parse(input);

  await prisma.selfInspection.update({
    where: {
      id: inspection.id,
    },
    data: {
      inspectionReason: data.inspectionReason,
      inspectionReasonOther:
        data.inspectionReason === "OTHER" ? data.inspectionReasonOther ?? null : null,
      mainComplaint: data.mainComplaint,
      canDrive: data.canDrive,
    },
  });

  await upsertAnswerRecords(inspection.id, buildReasonAnswerRecords(data));
  await updateInspectionDerivedState(inspection.id, { lastCompletedStep: 3 });

  return getPublicSelfInspectionWizard(token);
}

export async function savePublicSelfInspectionGeneral(token: string, input: unknown) {
  const inspection = await assertInspectionCustomerEditableByToken(token);
  const data = selfInspectionGeneralStepSchema.parse(input);
  const transmission =
    inspection.vehicleSnapshot?.transmission ?? inspection.vehicle?.transmission ?? null;

  if (!transmission) {
    throw new ConflictError("Debes completar primero la identificacion del vehiculo");
  }

  if (isAutomaticTransmission(transmission) && !data.automaticTransmission) {
    throw new AppError("Faltan respuestas de la seccion de transmision automatica", 422);
  }

  if (transmission === VehicleTransmissionType.MANUAL && !data.manualTransmission) {
    throw new AppError("Faltan respuestas de la seccion de embrague manual", 422);
  }

  if (data.operational.startBehavior === "NO_START" && inspection.vehicleSnapshot?.starts !== false) {
    await prisma.selfInspectionVehicleSnapshot.update({
      where: {
        selfInspectionId: inspection.id,
      },
      data: {
        starts: false,
      },
    });
  }

  await upsertAnswerRecords(inspection.id, buildGeneralAnswerRecords(data));
  await syncTransmissionBranchAnswers(inspection.id, transmission);
  await updateInspectionDerivedState(inspection.id, { lastCompletedStep: 4 });

  return getPublicSelfInspectionWizard(token);
}

export async function savePublicSelfInspectionDamage(token: string, input: unknown) {
  const inspection = await assertInspectionCustomerEditableByToken(token);
  const data = selfInspectionDamageStepSchema.parse(input);

  await upsertAnswerRecords(inspection.id, buildDamageAnswerRecords(data));
  await updateInspectionDerivedState(inspection.id, { lastCompletedStep: 5 });

  return getPublicSelfInspectionWizard(token);
}

export async function savePublicSelfInspectionHistory(token: string, input: unknown) {
  const inspection = await assertInspectionCustomerEditableByToken(token);
  const data = selfInspectionHistoryStepSchema.parse(input);

  await upsertAnswerRecords(inspection.id, buildHistoryAnswerRecords(data));
  await updateInspectionDerivedState(inspection.id, { lastCompletedStep: 6 });

  return getPublicSelfInspectionWizard(token);
}

export async function savePublicSelfInspectionNotes(token: string, input: unknown) {
  const inspection = await assertInspectionCustomerEditableByToken(token);
  const data = selfInspectionNotesStepSchema.parse(input);

  await persistCustomerNotes(inspection.id, data);
  await updateInspectionDerivedState(inspection.id, { lastCompletedStep: 8 });

  return getPublicSelfInspectionWizard(token);
}

export async function uploadPublicSelfInspectionPhoto(
  token: string,
  file: File,
  input: unknown,
) {
  const inspection = await assertInspectionCustomerEditableByToken(token);
  const data = selfInspectionPhotoUploadSchema.parse(input);
  const slot = SELF_INSPECTION_PHOTO_SLOTS.find((entry) => entry.photoType === data.photoType);
  const uploaded = await saveInspectionPhotoFile({
    inspectionId: inspection.id,
    photoType: data.photoType,
    file,
  });
  const existingPhotos = await prisma.selfInspectionPhoto.findMany({
    where: {
      selfInspectionId: inspection.id,
      photoType: data.photoType,
    },
  });

  await prisma.$transaction(async (tx) => {
    if (existingPhotos.length > 0) {
      await tx.selfInspectionPhoto.deleteMany({
        where: {
          id: {
            in: existingPhotos.map((photo) => photo.id),
          },
        },
      });
    }

    await tx.selfInspectionPhoto.create({
      data: {
        selfInspectionId: inspection.id,
        photoType: data.photoType,
        fileUrl: uploaded.fileUrl,
        storageKey: uploaded.storageKey,
        fileName: uploaded.fileName,
        mimeType: uploaded.mimeType,
        sizeBytes: uploaded.sizeBytes,
        sortOrder: slot?.sortOrder ?? data.sortOrder,
        isRequired: slot?.required ?? false,
        comment: data.comment ?? null,
      },
    });
  });

  await Promise.all(existingPhotos.map((photo) => deleteInspectionPhotoFile(photo.storageKey)));
  await updateInspectionDerivedState(inspection.id, { lastCompletedStep: 7 });

  return getPublicSelfInspectionWizard(token);
}

export async function deletePublicSelfInspectionPhoto(token: string, photoId: string) {
  const inspection = await assertInspectionCustomerEditableByToken(token);
  const photo = await prisma.selfInspectionPhoto.findFirst({
    where: {
      id: photoId,
      selfInspectionId: inspection.id,
    },
  });

  if (!photo) {
    throw new NotFoundError("Foto de autoinspeccion no encontrada");
  }

  await prisma.selfInspectionPhoto.delete({
    where: {
      id: photo.id,
    },
  });
  await deleteInspectionPhotoFile(photo.storageKey);
  await updateInspectionDerivedState(inspection.id, { lastCompletedStep: 7 });

  return getPublicSelfInspectionWizard(token);
}

export async function submitPublicSelfInspection(token: string, input: unknown) {
  submitSelfInspectionSchema.parse(input);

  const editableInspection = await assertInspectionCustomerEditableByToken(token);
  const inspection = await selfInspectionRepository.findSummaryById(editableInspection.id);

  if (!inspection || !inspection.vehicleSnapshot) {
    throw new AppError("Debes completar la informacion del vehiculo antes de enviar", 422);
  }

  const answersMap = mapAnswersToRecord(inspection.answers);
  const requiredAnswerKeys = getRequiredAnswerKeysForSubmission(
    inspection.vehicleSnapshot.transmission,
    answersMap,
  );
  const missingAnswers = requiredAnswerKeys.filter((questionKey) => {
    const value = answersMap[questionKey];

    if (value === undefined || value === null) {
      return true;
    }

    if (typeof value === "string") {
      return value.trim() === "";
    }

    if (Array.isArray(value)) {
      return false;
    }

    return false;
  });
  const missingPhotoTypes = SELF_INSPECTION_REQUIRED_PHOTO_TYPES.filter(
    (photoType) => !inspection.photos.some((photo) => photo.photoType === photoType),
  );

  if (!inspection.inspectionReason || !inspection.mainComplaint || inspection.canDrive === null) {
    throw new AppError("Faltan datos clave del motivo principal de inspeccion", 422);
  }

  if (missingAnswers.length > 0) {
    const labels = missingAnswers
      .slice(0, 5)
      .map((questionKey) => SELF_INSPECTION_QUESTION_DEFINITIONS[questionKey]?.label ?? questionKey);
    throw new AppError(`Faltan respuestas obligatorias: ${labels.join(", ")}`, 422);
  }

  if (missingPhotoTypes.length > 0) {
    const labels = missingPhotoTypes
      .map((photoType) => SELF_INSPECTION_PHOTO_TYPE_LABELS[photoType])
      .join(", ");
    throw new AppError(`Faltan fotos obligatorias: ${labels}`, 422);
  }

  const overallRiskLevel = calculateRiskLevel({
    snapshot: {
      starts: inspection.vehicleSnapshot.starts,
    },
    canDrive: inspection.canDrive,
    answersMap,
  });
  const summaryGenerated = buildSummary({
    customerName: inspection.customer.fullName,
    snapshot: {
      plate: inspection.vehicleSnapshot.plate,
      make: inspection.vehicleSnapshot.make,
      model: inspection.vehicleSnapshot.model,
      mileage: inspection.vehicleSnapshot.mileage,
      starts: inspection.vehicleSnapshot.starts,
      transmission: inspection.vehicleSnapshot.transmission,
    },
    inspectionReason: SELF_INSPECTION_REASON_LABELS[inspection.inspectionReason],
    mainComplaint: inspection.mainComplaint,
    canDrive: inspection.canDrive,
    overallRiskLevel,
    answersMap,
    photoCount: inspection.photos.length,
  });

  await prisma.$transaction(async (tx) => {
    await tx.selfInspection.update({
      where: {
        id: inspection.id,
      },
      data: {
        status: SelfInspectionStatus.SUBMITTED,
        submittedAt: new Date(),
        overallRiskLevel,
        summaryGenerated,
        lastCompletedStep: 9,
        completionPercent: 100,
      },
    });

    await tx.selfInspectionStatusLog.create({
      data: {
        selfInspectionId: inspection.id,
        previousStatus: editableInspection.status,
        nextStatus: SelfInspectionStatus.SUBMITTED,
        note: "Autoinspeccion enviada por el cliente",
      },
    });
  });

  return getPublicSelfInspectionWizard(token);
}

export async function updateSelfInspectionStatus(id: string, input: unknown, actorId: string) {
  const parsedStatus = updateSelfInspectionStatusSchema.parse(input);
  const existing = await prisma.selfInspection.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
    },
  });

  if (!existing) {
    throw new NotFoundError("Autoinspeccion no encontrada");
  }

  if (existing.status === parsedStatus.status) {
    return getSelfInspectionById(id);
  }

  await prisma.$transaction(async (tx) => {
    await tx.selfInspection.update({
      where: {
        id,
      },
      data: {
        status: parsedStatus.status,
        reviewerId:
          parsedStatus.status === SelfInspectionStatus.UNDER_REVIEW ||
          parsedStatus.status === SelfInspectionStatus.REVIEWED
            ? actorId
            : undefined,
        reviewedAt:
          parsedStatus.status === SelfInspectionStatus.REVIEWED ? new Date() : undefined,
      },
    });

    await tx.selfInspectionStatusLog.create({
      data: {
        selfInspectionId: id,
        previousStatus: existing.status,
        nextStatus: parsedStatus.status,
        note: parsedStatus.note ?? "Cambio de estado manual",
        changedById: actorId,
      },
    });
  });

  return getSelfInspectionById(id);
}

export async function reviewSelfInspection(id: string, input: unknown, actorId: string) {
  const data = reviewSelfInspectionSchema.parse(input);
  const existing = await prisma.selfInspection.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!existing) {
    throw new NotFoundError("Autoinspeccion no encontrada");
  }

  await prisma.$transaction(async (tx) => {
    await tx.selfInspectionReview.create({
      data: {
        selfInspectionId: id,
        reviewedById: actorId,
        riskAssessment: data.riskAssessment,
        internalSummary: data.internalSummary,
        recommendedNextStep: data.recommendedNextStep,
        departmentSuggestion: data.departmentSuggestion ?? null,
        createWorkOrderSuggestion: data.createWorkOrderSuggestion,
        createQuoteSuggestion: data.createQuoteSuggestion,
      },
    });

    if (data.note) {
      await tx.selfInspectionNote.create({
        data: {
          selfInspectionId: id,
          noteType: SelfInspectionNoteType.INTERNAL_REVIEW,
          content: data.note,
          createdById: actorId,
        },
      });
    }

    await tx.selfInspection.update({
      where: {
        id,
      },
      data: {
        status: SelfInspectionStatus.REVIEWED,
        reviewedAt: new Date(),
        reviewerId: actorId,
        overallRiskLevel: data.riskAssessment,
      },
    });

    await tx.selfInspectionStatusLog.create({
      data: {
        selfInspectionId: id,
        previousStatus: existing.status,
        nextStatus: SelfInspectionStatus.REVIEWED,
        note: `Revision interna registrada. Proximo paso sugerido: ${SELF_INSPECTION_NEXT_STEP_LABELS[data.recommendedNextStep]}`,
        changedById: actorId,
      },
    });
  });

  return getSelfInspectionById(id);
}

export type PublicSelfInspectionWizardData = Awaited<
  ReturnType<typeof getPublicSelfInspectionWizard>
>;
export type SelfInspectionDetailData = Awaited<ReturnType<typeof getSelfInspectionById>>;
