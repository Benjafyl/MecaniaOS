import {
  ReviewRecommendedNextStep,
  SelfInspectionAnswerType,
  SelfInspectionDepartment,
  SelfInspectionPhotoType,
  SelfInspectionReason,
  SelfInspectionRiskLevel,
  SelfInspectionSource,
  SelfInspectionStatus,
  VehicleFuelType,
  VehicleTransmissionType,
} from "@prisma/client";

export const SELF_INSPECTION_WIZARD_STEPS = [
  { key: "intro", label: "Inicio" },
  { key: "vehicle", label: "Vehiculo" },
  { key: "reason", label: "Motivo" },
  { key: "general", label: "Estado general" },
  { key: "damage", label: "Danos" },
  { key: "history", label: "Historial" },
  { key: "photos", label: "Fotos" },
  { key: "notes", label: "Observaciones" },
  { key: "summary", label: "Resumen" },
  { key: "confirmation", label: "Confirmacion" },
] as const;

export const SELF_INSPECTION_DATA_STEP_KEYS = [
  "vehicle",
  "reason",
  "general",
  "damage",
  "history",
  "photos",
  "notes",
] as const;

export const SELF_INSPECTION_STATUS_LABELS: Record<SelfInspectionStatus, string> = {
  [SelfInspectionStatus.DRAFT]: "Borrador",
  [SelfInspectionStatus.IN_PROGRESS]: "En progreso",
  [SelfInspectionStatus.SUBMITTED]: "Enviada",
  [SelfInspectionStatus.UNDER_REVIEW]: "En revision",
  [SelfInspectionStatus.REVIEWED]: "Revisada",
  [SelfInspectionStatus.CONVERTED_TO_WORK_ORDER]: "Convertida a OT",
  [SelfInspectionStatus.CANCELLED]: "Cancelada",
};

export const SELF_INSPECTION_RISK_LABELS: Record<SelfInspectionRiskLevel, string> = {
  [SelfInspectionRiskLevel.LOW]: "Bajo",
  [SelfInspectionRiskLevel.MEDIUM]: "Medio",
  [SelfInspectionRiskLevel.HIGH]: "Alto",
  [SelfInspectionRiskLevel.CRITICAL]: "Critico",
};

export const SELF_INSPECTION_REASON_LABELS: Record<SelfInspectionReason, string> = {
  [SelfInspectionReason.PREVENTIVE_MAINTENANCE]: "Mantencion preventiva",
  [SelfInspectionReason.MECHANICAL_FAILURE]: "Falla mecanica",
  [SelfInspectionReason.STRANGE_NOISE]: "Ruido extrano",
  [SelfInspectionReason.DASHBOARD_WARNING_LIGHTS]: "Luces de tablero",
  [SelfInspectionReason.COLLISION_DAMAGE]: "Danos por choque",
  [SelfInspectionReason.BODY_PAINT_DAMAGE]: "Carroceria / pintura",
  [SelfInspectionReason.PRE_PURCHASE]: "Revision precompra",
  [SelfInspectionReason.OTHER]: "Otro",
};

export const SELF_INSPECTION_SOURCE_LABELS: Record<SelfInspectionSource, string> = {
  [SelfInspectionSource.CUSTOMER_PORTAL]: "Portal cliente",
  [SelfInspectionSource.SECURE_LINK]: "Enlace seguro",
  [SelfInspectionSource.STAFF_ASSISTED]: "Asistida por taller",
};

export const VEHICLE_FUEL_TYPE_LABELS: Record<VehicleFuelType, string> = {
  [VehicleFuelType.GASOLINE]: "Gasolina",
  [VehicleFuelType.DIESEL]: "Diesel",
  [VehicleFuelType.HYBRID]: "Hibrido",
  [VehicleFuelType.ELECTRIC]: "Electrico",
  [VehicleFuelType.LPG]: "GLP",
  [VehicleFuelType.CNG]: "GNC",
  [VehicleFuelType.FLEX]: "Flex",
  [VehicleFuelType.OTHER]: "Otro",
};

export const VEHICLE_TRANSMISSION_LABELS: Record<VehicleTransmissionType, string> = {
  [VehicleTransmissionType.MANUAL]: "Manual",
  [VehicleTransmissionType.AUTOMATIC]: "Automatica",
  [VehicleTransmissionType.CVT]: "CVT",
  [VehicleTransmissionType.DUAL_CLUTCH]: "Doble embrague",
  [VehicleTransmissionType.OTHER]: "Otra",
};

export const SELF_INSPECTION_DEPARTMENT_LABELS: Record<SelfInspectionDepartment, string> = {
  [SelfInspectionDepartment.MECHANICS]: "Mecanica",
  [SelfInspectionDepartment.BODY_PAINT]: "Carroceria y pintura",
  [SelfInspectionDepartment.ELECTRICAL]: "Electrico",
  [SelfInspectionDepartment.INSURANCE]: "Seguros",
  [SelfInspectionDepartment.GENERAL_DIAGNOSIS]: "Diagnostico general",
};

export const SELF_INSPECTION_NEXT_STEP_LABELS: Record<ReviewRecommendedNextStep, string> = {
  [ReviewRecommendedNextStep.SCHEDULE_DIAGNOSTIC]: "Agendar diagnostico",
  [ReviewRecommendedNextStep.REQUEST_TOW]: "Solicitar grua",
  [ReviewRecommendedNextStep.REFER_MECHANICS]: "Derivar a mecanica",
  [ReviewRecommendedNextStep.REFER_BODY_PAINT]: "Derivar a pintura",
  [ReviewRecommendedNextStep.REFER_ELECTRICAL]: "Derivar a electrico",
  [ReviewRecommendedNextStep.PREPARE_QUOTE]: "Preparar cotizacion",
  [ReviewRecommendedNextStep.REQUEST_MORE_EVIDENCE]: "Solicitar mas evidencia",
  [ReviewRecommendedNextStep.FOLLOW_UP_CALL]: "Llamada de seguimiento",
};

export const SELF_INSPECTION_PHOTO_TYPE_LABELS: Record<SelfInspectionPhotoType, string> = {
  [SelfInspectionPhotoType.FRONTAL_FULL]: "Frontal completo",
  [SelfInspectionPhotoType.REAR_FULL]: "Trasera completa",
  [SelfInspectionPhotoType.LEFT_SIDE_FULL]: "Lateral izquierdo",
  [SelfInspectionPhotoType.RIGHT_SIDE_FULL]: "Lateral derecho",
  [SelfInspectionPhotoType.DASHBOARD_ON]: "Tablero encendido",
  [SelfInspectionPhotoType.ODOMETER]: "Odometro visible",
  [SelfInspectionPhotoType.FRONT_LEFT_TIRE]: "Neumatico delantero izquierdo",
  [SelfInspectionPhotoType.FRONT_RIGHT_TIRE]: "Neumatico delantero derecho",
  [SelfInspectionPhotoType.REAR_LEFT_TIRE]: "Neumatico trasero izquierdo",
  [SelfInspectionPhotoType.REAR_RIGHT_TIRE]: "Neumatico trasero derecho",
  [SelfInspectionPhotoType.PRIMARY_DAMAGE]: "Dano o problema principal",
  [SelfInspectionPhotoType.DAMAGE_CONTEXT]: "Contexto del dano",
  [SelfInspectionPhotoType.ENGINE]: "Motor",
  [SelfInspectionPhotoType.TRUNK]: "Maletero",
  [SelfInspectionPhotoType.FRONT_INTERIOR]: "Interior delantero",
  [SelfInspectionPhotoType.REAR_INTERIOR]: "Interior trasero",
  [SelfInspectionPhotoType.VEHICLE_DOCUMENTS]: "Documentos del vehiculo",
  [SelfInspectionPhotoType.COLLISION_ZONE]: "Zona especifica del choque",
  [SelfInspectionPhotoType.FLUID_LEAK]: "Fuga visible",
  [SelfInspectionPhotoType.DASHBOARD_WARNING_DETAIL]: "Detalle de testigos",
  [SelfInspectionPhotoType.BROKEN_PART]: "Pieza rota",
  [SelfInspectionPhotoType.VIN_VISIBLE]: "VIN visible",
  [SelfInspectionPhotoType.OTHER]: "Foto adicional",
};

export const SELF_INSPECTION_REASON_OPTIONS = Object.entries(SELF_INSPECTION_REASON_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export const SELF_INSPECTION_STATUS_OPTIONS = Object.entries(SELF_INSPECTION_STATUS_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export const SELF_INSPECTION_RISK_OPTIONS = Object.entries(SELF_INSPECTION_RISK_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export const VEHICLE_FUEL_TYPE_OPTIONS = Object.entries(VEHICLE_FUEL_TYPE_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export const VEHICLE_TRANSMISSION_OPTIONS = Object.entries(
  VEHICLE_TRANSMISSION_LABELS,
).map(([value, label]) => ({ value, label }));

export const SELF_INSPECTION_DEPARTMENT_OPTIONS = Object.entries(
  SELF_INSPECTION_DEPARTMENT_LABELS,
).map(([value, label]) => ({ value, label }));

export const SELF_INSPECTION_NEXT_STEP_OPTIONS = Object.entries(
  SELF_INSPECTION_NEXT_STEP_LABELS,
).map(([value, label]) => ({ value, label }));

export const YES_NO_OPTIONS = [
  { value: "true", label: "Si" },
  { value: "false", label: "No" },
] as const;

export const ISSUE_FREQUENCY_OPTIONS = [
  { value: "CONSTANT", label: "Constante" },
  { value: "INTERMITTENT", label: "Intermitente" },
] as const;

export const START_BEHAVIOR_OPTIONS = [
  { value: "NORMAL", label: "Arranca normal" },
  { value: "DIFFICULT", label: "Arranca con dificultad" },
  { value: "NO_START", label: "No arranca" },
] as const;

export const BRAKE_PEDAL_FEEL_OPTIONS = [
  { value: "NORMAL", label: "Normal" },
  { value: "SOFT", label: "Blando" },
  { value: "HARD", label: "Duro" },
] as const;

export const CLUTCH_PEDAL_POSITION_OPTIONS = [
  { value: "NORMAL", label: "Normal" },
  { value: "HIGH", label: "Muy alto" },
  { value: "LOW", label: "Muy bajo" },
] as const;

export const TIRE_WEAR_PATTERN_OPTIONS = [
  { value: "EVEN", label: "Parejo" },
  { value: "UNEVEN", label: "Irregular" },
  { value: "NOT_SURE", label: "No estoy seguro" },
] as const;

export const MULTIMEDIA_WORKING_OPTIONS = [
  { value: "YES", label: "Funciona" },
  { value: "NO", label: "No funciona" },
  { value: "NOT_APPLICABLE", label: "No aplica" },
] as const;

export const DAMAGE_AGE_OPTIONS = [
  { value: "RECENT", label: "Reciente" },
  { value: "OLD", label: "Antiguo" },
  { value: "MIXED", label: "Mixto" },
  { value: "NOT_APPLICABLE", label: "No aplica" },
] as const;

export const DAMAGE_AFFECTED_ZONE_OPTIONS = [
  { value: "FRONTAL", label: "Frontal" },
  { value: "REAR", label: "Trasera" },
  { value: "LEFT_SIDE", label: "Lateral izquierdo" },
  { value: "RIGHT_SIDE", label: "Lateral derecho" },
  { value: "ROOF", label: "Techo" },
  { value: "MULTIPLE", label: "Multiples zonas" },
  { value: "NONE", label: "Sin zona definida" },
] as const;

export const DAMAGE_EXPOSURE_EVENT_OPTIONS = [
  { value: "TOWED", label: "Fue arrastrado" },
  { value: "FLOODED", label: "Sufrio inundacion" },
  { value: "FIRE", label: "Expuesto a incendio" },
] as const;

export const SELF_INSPECTION_SECTION_LABELS: Record<string, string> = {
  reason: "Motivo de inspeccion",
  operational: "Estado operativo basico",
  engine: "Motor y funcionamiento",
  brakes: "Frenos",
  steeringSuspension: "Direccion y suspension",
  transmission: "Transmision / embrague",
  tires: "Neumaticos y ruedas",
  electrical: "Sistema electrico",
  interior: "Interior / confort",
  exterior: "Exterior / carroceria",
  damage: "Danos y siniestros",
  history: "Historial reportado",
};

export type SelfInspectionQuestionDefinition = {
  key: string;
  section: string;
  label: string;
  answerType: SelfInspectionAnswerType;
};

export const SELF_INSPECTION_QUESTION_DEFINITIONS: Record<
  string,
  SelfInspectionQuestionDefinition
> = {};

Object.assign(SELF_INSPECTION_QUESTION_DEFINITIONS, {
  vehicle_starts: {
    key: "vehicle_starts",
    section: "operational",
    label: "El vehiculo enciende",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  reason_can_drive: {
    key: "reason_can_drive",
    section: "reason",
    label: "El vehiculo puede circular actualmente",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  reason_problem_since: {
    key: "reason_problem_since",
    section: "reason",
    label: "Desde cuando ocurre el problema",
    answerType: SelfInspectionAnswerType.TEXT,
  },
  reason_issue_frequency: {
    key: "reason_issue_frequency",
    section: "reason",
    label: "El problema es constante o intermitente",
    answerType: SelfInspectionAnswerType.SINGLE_CHOICE,
  },
  reason_worsened_recently: {
    key: "reason_worsened_recently",
    section: "reason",
    label: "El problema empeoro recientemente",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  operational_start_behavior: {
    key: "operational_start_behavior",
    section: "operational",
    label: "Arranca normalmente o con dificultad",
    answerType: SelfInspectionAnswerType.SINGLE_CHOICE,
  },
  operational_unusual_noises: {
    key: "operational_unusual_noises",
    section: "operational",
    label: "Presenta ruidos inusuales",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  operational_vibrations: {
    key: "operational_vibrations",
    section: "operational",
    label: "Presenta vibraciones",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  operational_shuts_off: {
    key: "operational_shuts_off",
    section: "operational",
    label: "Se apaga solo",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  operational_power_loss: {
    key: "operational_power_loss",
    section: "operational",
    label: "Ha perdido potencia",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  operational_unusual_smoke: {
    key: "operational_unusual_smoke",
    section: "operational",
    label: "Ha presentado humo inusual",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  operational_strange_smell: {
    key: "operational_strange_smell",
    section: "operational",
    label: "Hay olor extrano al conducir o al encender",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  operational_dashboard_warning_lights: {
    key: "operational_dashboard_warning_lights",
    section: "operational",
    label: "Tiene testigos encendidos en el tablero",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  operational_dashboard_warning_details: {
    key: "operational_dashboard_warning_details",
    section: "operational",
    label: "Cuales son los testigos encendidos",
    answerType: SelfInspectionAnswerType.TEXT,
  },
  engine_knocking_noises: {
    key: "engine_knocking_noises",
    section: "engine",
    label: "Escucha golpeteos, chillidos o traqueteos",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  engine_power_loss_under_load: {
    key: "engine_power_loss_under_load",
    section: "engine",
    label: "Siente perdida de fuerza en subidas o aceleracion",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  engine_idle_unstable: {
    key: "engine_idle_unstable",
    section: "engine",
    label: "El motor regula inestable",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  engine_overheating: {
    key: "engine_overheating",
    section: "engine",
    label: "El motor se calienta mas de lo normal",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  engine_fluid_leaks: {
    key: "engine_fluid_leaks",
    section: "engine",
    label: "Ha visto fugas de aceite, refrigerante u otro fluido",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  engine_fluid_leak_details: {
    key: "engine_fluid_leak_details",
    section: "engine",
    label: "Detalle de las fugas visibles",
    answerType: SelfInspectionAnswerType.TEXT,
  },
  engine_check_engine_light: {
    key: "engine_check_engine_light",
    section: "engine",
    label: "Se ha encendido luz de check engine",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  engine_cold_start_problems: {
    key: "engine_cold_start_problems",
    section: "engine",
    label: "Ha tenido problemas al encender en frio",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  engine_high_fuel_consumption: {
    key: "engine_high_fuel_consumption",
    section: "engine",
    label: "Consume mas combustible de lo normal",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
});

Object.assign(SELF_INSPECTION_QUESTION_DEFINITIONS, {
  brakes_working_properly: {
    key: "brakes_working_properly",
    section: "brakes",
    label: "Siente que el vehiculo frena correctamente",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  brakes_noise: {
    key: "brakes_noise",
    section: "brakes",
    label: "Escucha ruidos al frenar",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  brakes_pedal_feel: {
    key: "brakes_pedal_feel",
    section: "brakes",
    label: "Como se siente el pedal",
    answerType: SelfInspectionAnswerType.SINGLE_CHOICE,
  },
  brakes_pulls_side: {
    key: "brakes_pulls_side",
    section: "brakes",
    label: "El vehiculo tira hacia un lado al frenar",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  brakes_vibration: {
    key: "brakes_vibration",
    section: "brakes",
    label: "Vibra al frenar",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  brakes_abs_warning: {
    key: "brakes_abs_warning",
    section: "brakes",
    label: "Se ha encendido luz de frenos o ABS",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  steering_hard: {
    key: "steering_hard",
    section: "steeringSuspension",
    label: "La direccion esta dura",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  steering_vibration: {
    key: "steering_vibration",
    section: "steeringSuspension",
    label: "La direccion vibra",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  steering_pulls_side: {
    key: "steering_pulls_side",
    section: "steeringSuspension",
    label: "El vehiculo se va hacia un lado",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  suspension_knocks: {
    key: "suspension_knocks",
    section: "steeringSuspension",
    label: "Escucha golpes al pasar lomos de toro o baches",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  suspension_excessive_bounce: {
    key: "suspension_excessive_bounce",
    section: "steeringSuspension",
    label: "Siente rebote excesivo",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  suspension_uneven_height: {
    key: "suspension_uneven_height",
    section: "steeringSuspension",
    label: "Nota desnivel en la altura del vehiculo",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  transmission_auto_shift_smooth: {
    key: "transmission_auto_shift_smooth",
    section: "transmission",
    label: "Los cambios entran suaves",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  transmission_auto_jerks: {
    key: "transmission_auto_jerks",
    section: "transmission",
    label: "Siente tirones al cambiar",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  transmission_auto_delay: {
    key: "transmission_auto_delay",
    section: "transmission",
    label: "Hay retraso al engranar D o R",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  transmission_auto_shift_noise: {
    key: "transmission_auto_shift_noise",
    section: "transmission",
    label: "Escucha ruidos extranos al cambiar",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  transmission_manual_hard_gears: {
    key: "transmission_manual_hard_gears",
    section: "transmission",
    label: "Le cuesta entrar algun cambio",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  transmission_manual_clutch_slipping: {
    key: "transmission_manual_clutch_slipping",
    section: "transmission",
    label: "El embrague patina",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  transmission_manual_clutch_pedal_position: {
    key: "transmission_manual_clutch_pedal_position",
    section: "transmission",
    label: "Altura del pedal de embrague",
    answerType: SelfInspectionAnswerType.SINGLE_CHOICE,
  },
  transmission_manual_clutch_noise: {
    key: "transmission_manual_clutch_noise",
    section: "transmission",
    label: "Escucha ruidos al presionar el embrague",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  tires_worn: {
    key: "tires_worn",
    section: "tires",
    label: "Hay neumaticos desgastados",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  tires_wear_pattern: {
    key: "tires_wear_pattern",
    section: "tires",
    label: "Tipo de desgaste",
    answerType: SelfInspectionAnswerType.SINGLE_CHOICE,
  },
  tires_low_pressure_or_puncture: {
    key: "tires_low_pressure_or_puncture",
    section: "tires",
    label: "Algun neumatico pinchado o con baja presion",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  tires_damaged_rims: {
    key: "tires_damaged_rims",
    section: "tires",
    label: "Hay llantas danadas",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  tires_speed_vibration: {
    key: "tires_speed_vibration",
    section: "tires",
    label: "Siente vibracion a cierta velocidad",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  electrical_front_lights: {
    key: "electrical_front_lights",
    section: "electrical",
    label: "Funcionan las luces delanteras",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  electrical_rear_lights: {
    key: "electrical_rear_lights",
    section: "electrical",
    label: "Funcionan las luces traseras",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  electrical_turn_signals: {
    key: "electrical_turn_signals",
    section: "electrical",
    label: "Funcionan los intermitentes",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  electrical_horn: {
    key: "electrical_horn",
    section: "electrical",
    label: "Funciona la bocina",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  electrical_climate_control: {
    key: "electrical_climate_control",
    section: "electrical",
    label: "Funciona el aire acondicionado / climatizacion",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  electrical_central_locking: {
    key: "electrical_central_locking",
    section: "electrical",
    label: "Funciona el cierre centralizado",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  electrical_windows: {
    key: "electrical_windows",
    section: "electrical",
    label: "Funcionan los alzavidrios",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  electrical_battery_failed_recently: {
    key: "electrical_battery_failed_recently",
    section: "electrical",
    label: "La bateria ha fallado recientemente",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
});

Object.assign(SELF_INSPECTION_QUESTION_DEFINITIONS, {
  interior_visible_damage: {
    key: "interior_visible_damage",
    section: "interior",
    label: "Hay danos visibles en el interior",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  interior_instrument_panel_working: {
    key: "interior_instrument_panel_working",
    section: "interior",
    label: "Funciona el panel de instrumentos",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  interior_multimedia_working: {
    key: "interior_multimedia_working",
    section: "interior",
    label: "Funciona la multimedia",
    answerType: SelfInspectionAnswerType.SINGLE_CHOICE,
  },
  interior_water_leaks: {
    key: "interior_water_leaks",
    section: "interior",
    label: "Se observan filtraciones de agua",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  interior_cabin_strange_smells: {
    key: "interior_cabin_strange_smells",
    section: "interior",
    label: "Hay olores extranos en cabina",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  exterior_scratches: {
    key: "exterior_scratches",
    section: "exterior",
    label: "Tiene rayones",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  exterior_dents: {
    key: "exterior_dents",
    section: "exterior",
    label: "Tiene abolladuras",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  exterior_misaligned_panels: {
    key: "exterior_misaligned_panels",
    section: "exterior",
    label: "Tiene piezas descuadradas o sueltas",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  exterior_damaged_glass_or_lights: {
    key: "exterior_damaged_glass_or_lights",
    section: "exterior",
    label: "Hay vidrios o focos danados",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  exterior_broken_trim: {
    key: "exterior_broken_trim",
    section: "exterior",
    label: "Hay piezas rotas en parachoques, espejos o molduras",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  exterior_damage_age: {
    key: "exterior_damage_age",
    section: "exterior",
    label: "El dano es reciente o antiguo",
    answerType: SelfInspectionAnswerType.SINGLE_CHOICE,
  },
  damage_recent_collision: {
    key: "damage_recent_collision",
    section: "damage",
    label: "El vehiculo sufrio choque o roce reciente",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  damage_affected_zone: {
    key: "damage_affected_zone",
    section: "damage",
    label: "Zona afectada",
    answerType: SelfInspectionAnswerType.SINGLE_CHOICE,
  },
  damage_affects_functionality: {
    key: "damage_affects_functionality",
    section: "damage",
    label: "El dano afecta funcionamiento",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  damage_structural_impact: {
    key: "damage_structural_impact",
    section: "damage",
    label: "Se observa posible golpe estructural",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  damage_exposure_events: {
    key: "damage_exposure_events",
    section: "damage",
    label: "Fue arrastrado, inundado o expuesto a incendio",
    answerType: SelfInspectionAnswerType.MULTI_CHOICE,
  },
  damage_insurance_or_police_report: {
    key: "damage_insurance_or_police_report",
    section: "damage",
    label: "Hay denuncia o seguro involucrado",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  damage_wants_insurance_evaluation: {
    key: "damage_wants_insurance_evaluation",
    section: "damage",
    label: "Desea evaluacion para aseguradora",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  history_last_maintenance_at: {
    key: "history_last_maintenance_at",
    section: "history",
    label: "Cuando fue la ultima mantencion",
    answerType: SelfInspectionAnswerType.TEXT,
  },
  history_last_maintenance_performed: {
    key: "history_last_maintenance_performed",
    section: "history",
    label: "Que mantencion se realizo",
    answerType: SelfInspectionAnswerType.LONG_TEXT,
  },
  history_brakes_replaced_recently: {
    key: "history_brakes_replaced_recently",
    section: "history",
    label: "Se han cambiado frenos recientemente",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  history_battery_replaced_recently: {
    key: "history_battery_replaced_recently",
    section: "history",
    label: "Se ha cambiado bateria recientemente",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  history_tires_replaced_recently: {
    key: "history_tires_replaced_recently",
    section: "history",
    label: "Se han cambiado neumaticos recientemente",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  history_oil_and_filters_changed: {
    key: "history_oil_and_filters_changed",
    section: "history",
    label: "Se ha hecho cambio de aceite y filtros",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  history_pending_recent_repairs: {
    key: "history_pending_recent_repairs",
    section: "history",
    label: "El vehiculo tiene reparaciones recientes pendientes",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  history_checked_by_another_workshop: {
    key: "history_checked_by_another_workshop",
    section: "history",
    label: "Ya fue revisado por otro taller",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  history_previous_quote_or_diagnosis: {
    key: "history_previous_quote_or_diagnosis",
    section: "history",
    label: "Tiene presupuesto o diagnostico previo",
    answerType: SelfInspectionAnswerType.BOOLEAN,
  },
  history_previous_diagnosis_details: {
    key: "history_previous_diagnosis_details",
    section: "history",
    label: "Detalle de presupuesto o diagnostico previo",
    answerType: SelfInspectionAnswerType.LONG_TEXT,
  },
});

export const SELF_INSPECTION_REQUIRED_ANSWER_KEYS = [
  "reason_problem_since",
  "reason_issue_frequency",
  "reason_can_drive",
  "reason_worsened_recently",
  "operational_start_behavior",
  "operational_unusual_noises",
  "operational_vibrations",
  "operational_shuts_off",
  "operational_power_loss",
  "operational_unusual_smoke",
  "operational_strange_smell",
  "operational_dashboard_warning_lights",
  "engine_knocking_noises",
  "engine_power_loss_under_load",
  "engine_idle_unstable",
  "engine_overheating",
  "engine_fluid_leaks",
  "engine_check_engine_light",
  "engine_cold_start_problems",
  "engine_high_fuel_consumption",
  "brakes_working_properly",
  "brakes_noise",
  "brakes_pedal_feel",
  "brakes_pulls_side",
  "brakes_vibration",
  "brakes_abs_warning",
  "steering_hard",
  "steering_vibration",
  "steering_pulls_side",
  "suspension_knocks",
  "suspension_excessive_bounce",
  "suspension_uneven_height",
  "tires_worn",
  "tires_wear_pattern",
  "tires_low_pressure_or_puncture",
  "tires_damaged_rims",
  "tires_speed_vibration",
  "electrical_front_lights",
  "electrical_rear_lights",
  "electrical_turn_signals",
  "electrical_horn",
  "electrical_climate_control",
  "electrical_central_locking",
  "electrical_windows",
  "electrical_battery_failed_recently",
  "interior_visible_damage",
  "interior_instrument_panel_working",
  "interior_multimedia_working",
  "interior_water_leaks",
  "interior_cabin_strange_smells",
  "exterior_scratches",
  "exterior_dents",
  "exterior_misaligned_panels",
  "exterior_damaged_glass_or_lights",
  "exterior_broken_trim",
  "exterior_damage_age",
  "damage_recent_collision",
  "damage_affected_zone",
  "damage_affects_functionality",
  "damage_structural_impact",
  "damage_exposure_events",
  "damage_insurance_or_police_report",
  "damage_wants_insurance_evaluation",
  "history_last_maintenance_at",
  "history_last_maintenance_performed",
  "history_brakes_replaced_recently",
  "history_battery_replaced_recently",
  "history_tires_replaced_recently",
  "history_oil_and_filters_changed",
  "history_pending_recent_repairs",
  "history_checked_by_another_workshop",
  "history_previous_quote_or_diagnosis",
] as const;

export const SELF_INSPECTION_AUTOMATIC_ONLY_KEYS = [
  "transmission_auto_shift_smooth",
  "transmission_auto_jerks",
  "transmission_auto_delay",
  "transmission_auto_shift_noise",
] as const;

export const SELF_INSPECTION_MANUAL_ONLY_KEYS = [
  "transmission_manual_hard_gears",
  "transmission_manual_clutch_slipping",
  "transmission_manual_clutch_pedal_position",
  "transmission_manual_clutch_noise",
] as const;

export const SELF_INSPECTION_REQUIRED_PHOTO_TYPES: SelfInspectionPhotoType[] = [
  SelfInspectionPhotoType.FRONTAL_FULL,
  SelfInspectionPhotoType.REAR_FULL,
  SelfInspectionPhotoType.LEFT_SIDE_FULL,
  SelfInspectionPhotoType.RIGHT_SIDE_FULL,
  SelfInspectionPhotoType.DASHBOARD_ON,
  SelfInspectionPhotoType.ODOMETER,
  SelfInspectionPhotoType.FRONT_LEFT_TIRE,
  SelfInspectionPhotoType.FRONT_RIGHT_TIRE,
  SelfInspectionPhotoType.REAR_LEFT_TIRE,
  SelfInspectionPhotoType.REAR_RIGHT_TIRE,
  SelfInspectionPhotoType.PRIMARY_DAMAGE,
  SelfInspectionPhotoType.DAMAGE_CONTEXT,
] as const;

export const SELF_INSPECTION_PHOTO_SLOTS = [
  {
    photoType: SelfInspectionPhotoType.FRONTAL_FULL,
    label: "Frontal completo",
    helpText: "Toma el vehiculo de frente y completo en un lugar bien iluminado.",
    required: true,
    sortOrder: 1,
  },
  {
    photoType: SelfInspectionPhotoType.REAR_FULL,
    label: "Trasera completa",
    helpText: "Incluye focos, parachoques y tapa del maletero.",
    required: true,
    sortOrder: 2,
  },
  {
    photoType: SelfInspectionPhotoType.LEFT_SIDE_FULL,
    label: "Lateral izquierdo",
    helpText: "Captura ambas puertas, ruedas y linea general del costado.",
    required: true,
    sortOrder: 3,
  },
  {
    photoType: SelfInspectionPhotoType.RIGHT_SIDE_FULL,
    label: "Lateral derecho",
    helpText: "Captura el costado completo del vehiculo.",
    required: true,
    sortOrder: 4,
  },
  {
    photoType: SelfInspectionPhotoType.DASHBOARD_ON,
    label: "Tablero encendido",
    helpText: "Enciende el contacto y muestra el tablero completo.",
    required: true,
    sortOrder: 5,
  },
  {
    photoType: SelfInspectionPhotoType.ODOMETER,
    label: "Odometro / kilometraje",
    helpText: "Asegura que el kilometraje se vea con nitidez.",
    required: true,
    sortOrder: 6,
  },
  {
    photoType: SelfInspectionPhotoType.FRONT_LEFT_TIRE,
    label: "Neumatico delantero izquierdo",
    helpText: "Toma la banda de rodado y el lateral del neumatico.",
    required: true,
    sortOrder: 7,
  },
  {
    photoType: SelfInspectionPhotoType.FRONT_RIGHT_TIRE,
    label: "Neumatico delantero derecho",
    helpText: "Muestra desgaste y estado general.",
    required: true,
    sortOrder: 8,
  },
  {
    photoType: SelfInspectionPhotoType.REAR_LEFT_TIRE,
    label: "Neumatico trasero izquierdo",
    helpText: "Busca buena luz y enfoque.",
    required: true,
    sortOrder: 9,
  },
  {
    photoType: SelfInspectionPhotoType.REAR_RIGHT_TIRE,
    label: "Neumatico trasero derecho",
    helpText: "Incluye llanta si hay dano.",
    required: true,
    sortOrder: 10,
  },
  {
    photoType: SelfInspectionPhotoType.PRIMARY_DAMAGE,
    label: "Dano o problema principal",
    helpText: "Acercate al dano, ruido o fuga principal si es visible.",
    required: true,
    sortOrder: 11,
  },
  {
    photoType: SelfInspectionPhotoType.DAMAGE_CONTEXT,
    label: "Contexto del dano",
    helpText: "Toma otra foto mas abierta para entender ubicacion y alcance.",
    required: true,
    sortOrder: 12,
  },
  {
    photoType: SelfInspectionPhotoType.ENGINE,
    label: "Motor",
    helpText: "Opcional, util si el problema proviene del vano motor.",
    required: false,
    sortOrder: 13,
  },
  {
    photoType: SelfInspectionPhotoType.TRUNK,
    label: "Maletero",
    helpText: "Opcional.",
    required: false,
    sortOrder: 14,
  },
  {
    photoType: SelfInspectionPhotoType.FRONT_INTERIOR,
    label: "Interior delantero",
    helpText: "Opcional, incluye volante, asientos y consola.",
    required: false,
    sortOrder: 15,
  },
  {
    photoType: SelfInspectionPhotoType.REAR_INTERIOR,
    label: "Interior trasero",
    helpText: "Opcional.",
    required: false,
    sortOrder: 16,
  },
  {
    photoType: SelfInspectionPhotoType.VEHICLE_DOCUMENTS,
    label: "Documentos del vehiculo",
    helpText: "Opcional, solo si el taller lo solicita.",
    required: false,
    sortOrder: 17,
  },
  {
    photoType: SelfInspectionPhotoType.COLLISION_ZONE,
    label: "Zona especifica del choque",
    helpText: "Opcional, prioriza angulos cerrados del impacto.",
    required: false,
    sortOrder: 18,
  },
  {
    photoType: SelfInspectionPhotoType.FLUID_LEAK,
    label: "Fuga visible",
    helpText: "Opcional, util si reportaste fluidos o manchas.",
    required: false,
    sortOrder: 19,
  },
  {
    photoType: SelfInspectionPhotoType.DASHBOARD_WARNING_DETAIL,
    label: "Detalle de testigos",
    helpText: "Opcional si hay luces encendidas.",
    required: false,
    sortOrder: 20,
  },
  {
    photoType: SelfInspectionPhotoType.BROKEN_PART,
    label: "Pieza rota",
    helpText: "Opcional para espejos, molduras, focos o parachoques.",
    required: false,
    sortOrder: 21,
  },
  {
    photoType: SelfInspectionPhotoType.VIN_VISIBLE,
    label: "VIN visible",
    helpText: "Opcional si puedes fotografiar la placa VIN con seguridad.",
    required: false,
    sortOrder: 22,
  },
  {
    photoType: SelfInspectionPhotoType.OTHER,
    label: "Foto adicional",
    helpText: "Opcional para cualquier evidencia relevante.",
    required: false,
    sortOrder: 23,
  },
] as const;
