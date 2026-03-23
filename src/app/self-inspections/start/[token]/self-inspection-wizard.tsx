"use client";

import { useMemo, useState } from "react";

import { BooleanSegmentField } from "@/components/self-inspections/boolean-segment-field";
import { ChoiceSegmentField } from "@/components/self-inspections/choice-segment-field";
import { PhotoSlotCard } from "@/components/self-inspections/photo-slot-card";
import { QuestionField } from "@/components/self-inspections/question-field";
import { SelfInspectionRiskBadge } from "@/components/self-inspections/self-inspection-risk-badge";
import { SelfInspectionStatusBadge } from "@/components/self-inspections/self-inspection-status-badge";
import { WizardProgress } from "@/components/self-inspections/wizard-progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  BRAKE_PEDAL_FEEL_OPTIONS,
  CLUTCH_PEDAL_POSITION_OPTIONS,
  DAMAGE_AFFECTED_ZONE_OPTIONS,
  DAMAGE_AGE_OPTIONS,
  DAMAGE_EXPOSURE_EVENT_OPTIONS,
  ISSUE_FREQUENCY_OPTIONS,
  MULTIMEDIA_WORKING_OPTIONS,
  SELF_INSPECTION_PHOTO_TYPE_LABELS,
  SELF_INSPECTION_REASON_OPTIONS,
  START_BEHAVIOR_OPTIONS,
  TIRE_WEAR_PATTERN_OPTIONS,
  VEHICLE_FUEL_TYPE_OPTIONS,
  VEHICLE_TRANSMISSION_OPTIONS,
} from "@/modules/self-inspections/self-inspection.constants";
import type { PublicSelfInspectionWizardData } from "@/modules/self-inspections/self-inspection.service";

type WizardProps = {
  token: string;
  initialData: PublicSelfInspectionWizardData;
};

type ApiValidationDetail = {
  path: string[];
  message: string;
};

class RequestError extends Error {
  constructor(
    message: string,
    public readonly details: ApiValidationDetail[] = [],
  ) {
    super(message);
    this.name = "RequestError";
  }
}

const operationalBooleanQuestions = [
  ["unusualNoises", "Presenta ruidos inusuales"],
  ["vibrations", "Presenta vibraciones"],
  ["shutsOffByItself", "Se apaga solo"],
  ["powerLoss", "Ha perdido potencia"],
  ["unusualSmoke", "Ha presentado humo inusual"],
  ["strangeSmell", "Hay olor extrano al conducir o al encender"],
  ["dashboardWarningLights", "Tiene testigos encendidos en el tablero"],
] as const;

const engineBooleanQuestions = [
  ["knockingNoises", "Escucha golpeteos, chillidos o traqueteos"],
  ["powerLossUnderLoad", "Siente perdida de fuerza en subidas o aceleracion"],
  ["idleUnstable", "El motor regula inestable"],
  ["overheating", "El motor se calienta mas de lo normal"],
  ["fluidLeaks", "Ha visto fugas de aceite, refrigerante u otro fluido"],
  ["checkEngineLight", "Se ha encendido luz de check engine"],
  ["coldStartProblems", "Ha tenido problemas al encender en frio"],
  ["highFuelConsumption", "Consume mas combustible de lo normal"],
] as const;

const brakesBooleanQuestions = [
  ["workingProperly", "Siente que el vehiculo frena correctamente"],
  ["noise", "Escucha ruidos al frenar"],
  ["pullsSide", "El vehiculo tira hacia un lado al frenar"],
  ["vibration", "Vibra al frenar"],
  ["absWarning", "Se ha encendido luz de frenos o ABS"],
] as const;

const steeringQuestions = [
  ["steeringHard", "La direccion esta dura"],
  ["steeringVibration", "La direccion vibra"],
  ["vehiclePullsSide", "El vehiculo se va hacia un lado"],
  ["suspensionKnocks", "Escucha golpes al pasar lomos de toro o baches"],
  ["excessiveBounce", "Siente rebote excesivo"],
  ["unevenRideHeight", "Nota desnivel en la altura del vehiculo"],
] as const;

const tiresQuestions = [
  ["worn", "Hay neumaticos desgastados"],
  ["lowPressureOrPuncture", "Algun neumatico pinchado o con baja presion"],
  ["damagedRims", "Hay llantas danadas"],
  ["speedVibration", "Siente vibracion a cierta velocidad"],
] as const;

const electricalQuestions = [
  ["frontLights", "Funcionan las luces delanteras"],
  ["rearLights", "Funcionan las luces traseras"],
  ["turnSignals", "Funcionan intermitentes"],
  ["horn", "Funciona bocina"],
  ["climateControl", "Funciona aire acondicionado / climatizacion"],
  ["centralLocking", "Funciona cierre centralizado"],
  ["windows", "Funcionan alzavidrios"],
  ["batteryFailedRecently", "La bateria ha fallado recientemente"],
] as const;

const interiorQuestions = [
  ["visibleDamage", "Hay danos visibles en interior"],
  ["instrumentPanelWorking", "Funciona panel de instrumentos"],
  ["waterLeaks", "Se observan filtraciones de agua"],
  ["cabinStrangeSmells", "Hay olores extranos en cabina"],
] as const;

const exteriorQuestions = [
  ["scratches", "Tiene rayones"],
  ["dents", "Tiene abolladuras"],
  ["misalignedPanels", "Tiene piezas descuadradas o sueltas"],
  ["damagedGlassOrLights", "Hay vidrios o focos danados"],
  ["brokenTrim", "Hay piezas rotas en parachoques, espejos o molduras"],
] as const;

function getInitialCurrentStep(data: PublicSelfInspectionWizardData) {
  if (
    data.inspection.status === "SUBMITTED" ||
    data.inspection.status === "UNDER_REVIEW" ||
    data.inspection.status === "REVIEWED" ||
    data.inspection.status === "CONVERTED_TO_WORK_ORDER"
  ) {
    return 10;
  }

  if (data.inspection.lastCompletedStep <= 1) {
    return 1;
  }

  return Math.min(data.inspection.lastCompletedStep + 1, 9);
}

const validationPathLabels: Record<string, string> = {
  operational: "Operacion",
  engine: "Motor",
  brakes: "Frenos",
  steeringSuspension: "Direccion y suspension",
  automaticTransmission: "Transmision automatica",
  manualTransmission: "Transmision manual",
  tires: "Neumaticos y ruedas",
  electrical: "Sistema electrico",
  interior: "Interior / confort",
  exterior: "Exterior / carroceria",
  dashboardWarningDetails: "detalle de testigos encendidos",
  fluidLeakDetails: "detalle de fuga o fluido visible",
  startBehavior: "comportamiento al encender",
  pedalFeel: "sensacion del pedal de freno",
  clutchPedalPosition: "posicion del pedal de embrague",
  wearPattern: "tipo de desgaste",
  multimediaWorking: "estado de multimedia",
  damageAge: "antiguedad del dano",
};

function formatValidationDetail(detail: ApiValidationDetail) {
  if (detail.path.length === 0) {
    return detail.message;
  }

  const formattedPath = detail.path
    .map((segment) => validationPathLabels[segment] ?? segment)
    .join(" / ");

  return `${formattedPath}: ${detail.message}`;
}

function getErrorMessages(error: unknown) {
  if (error instanceof RequestError) {
    if (error.details.length > 0) {
      return error.details.map(formatValidationDetail);
    }

    return [error.message];
  }

  if (error instanceof Error) {
    return [error.message];
  }

  return ["No fue posible completar la solicitud"];
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const body = await response.json();

  if (!response.ok) {
    throw new RequestError(body.error ?? "No fue posible completar la solicitud", body.details ?? []);
  }

  return body.data as T;
}

export function SelfInspectionWizard({ token, initialData }: WizardProps) {
  const [data, setData] = useState(initialData);
  const [currentStep, setCurrentStep] = useState(getInitialCurrentStep(initialData));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingPhotoType, setUploadingPhotoType] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [acceptance, setAcceptance] = useState(false);

  const isReadOnly = useMemo(
    () =>
      ["SUBMITTED", "UNDER_REVIEW", "REVIEWED", "CONVERTED_TO_WORK_ORDER"].includes(
        data.inspection.status,
      ),
    [data.inspection.status],
  );
  const isAutomatic =
    data.form.vehicle.transmission === "AUTOMATIC" ||
    data.form.vehicle.transmission === "CVT" ||
    data.form.vehicle.transmission === "DUAL_CLUTCH";
  const requiresProblemTimeline =
    data.form.reason.inspectionReason !== "PREVENTIVE_MAINTENANCE" &&
    data.form.reason.inspectionReason !== "PRE_PURCHASE";

  function buildGeneralPayload() {
    return {
      ...data.form.general,
      automaticTransmission: isAutomatic ? data.form.general.automaticTransmission : undefined,
      manualTransmission: isAutomatic ? undefined : data.form.general.manualTransmission,
    };
  }

  async function saveStep(endpoint: string, payload: unknown, nextStep?: number) {
    setErrorMessages([]);
    setIsSubmitting(true);

    try {
      const nextData = await requestJson<PublicSelfInspectionWizardData>(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      setData(nextData);

      if (nextStep) {
        setCurrentStep(nextStep);
      }
    } catch (saveError) {
      setErrorMessages(getErrorMessages(saveError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePhotoUpload(file: File, photoType: string) {
    setErrorMessages([]);
    setUploadingPhotoType(photoType);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("photoType", photoType);
      const slot = data.photoSlots.find((entry) => entry.photoType === photoType);
      formData.append("sortOrder", String(slot?.sortOrder ?? 0));

      const nextData = await requestJson<PublicSelfInspectionWizardData>(
        `/api/self-inspections/public/${token}/photos`,
        {
          method: "POST",
          body: formData,
        },
      );

      setData(nextData);
    } catch (uploadError) {
      setErrorMessages(getErrorMessages(uploadError));
    } finally {
      setUploadingPhotoType(null);
    }
  }

  async function handlePhotoDelete(photoId: string) {
    setErrorMessages([]);
    setUploadingPhotoType(photoId);

    try {
      const nextData = await requestJson<PublicSelfInspectionWizardData>(
        `/api/self-inspections/public/${token}/photos/${photoId}`,
        {
          method: "DELETE",
        },
      );

      setData(nextData);
    } catch (deleteError) {
      setErrorMessages(getErrorMessages(deleteError));
    } finally {
      setUploadingPhotoType(null);
    }
  }

  async function handleSubmit() {
    setErrorMessages([]);
    setIsSubmitting(true);

    try {
      const nextData = await requestJson<PublicSelfInspectionWizardData>(
        `/api/self-inspections/public/${token}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            acceptance,
          }),
        },
      );

      setData(nextData);
      setCurrentStep(10);
    } catch (submitError) {
      setErrorMessages(getErrorMessages(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateVehicleField(field: string, value: unknown) {
    setData((current) => ({
      ...current,
      form: {
        ...current.form,
        vehicle: {
          ...current.form.vehicle,
          [field]: value,
        },
      },
    }));
  }

  function updateReasonField(field: string, value: unknown) {
    setData((current) => ({
      ...current,
      form: {
        ...current.form,
        reason: {
          ...current.form.reason,
          [field]: value,
        },
      },
    }));
  }

  function updateGeneralField(section: string, field: string, value: unknown) {
    setData((current) => ({
      ...current,
      form: {
        ...current.form,
        general: {
          ...current.form.general,
          [section]: {
            ...current.form.general[section as keyof typeof current.form.general],
            [field]: value,
          },
        },
      },
    }));
  }

  function updateDamageField(field: string, value: unknown) {
    setData((current) => ({
      ...current,
      form: {
        ...current.form,
        damage: {
          ...current.form.damage,
          [field]: value,
        },
      },
    }));
  }

  function updateHistoryField(field: string, value: unknown) {
    setData((current) => ({
      ...current,
      form: {
        ...current.form,
        history: {
          ...current.form.history,
          [field]: value,
        },
      },
    }));
  }

  function updateNotesField(field: string, value: string) {
    setData((current) => ({
      ...current,
      form: {
        ...current.form,
        notes: {
          ...current.form.notes,
          [field]: value,
        },
      },
    }));
  }

  function renderBooleanList(
    section: Record<string, unknown>,
    sectionKey: string,
    questions: ReadonlyArray<readonly [string, string]>,
  ) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {questions.map(([field, label]) => (
          <QuestionField key={field} label={label}>
            <BooleanSegmentField
              disabled={isReadOnly}
              onChange={(value) => updateGeneralField(sectionKey, field, value)}
              value={section[field] as boolean | undefined}
            />
          </QuestionField>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-[32px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <SelfInspectionStatusBadge status={data.inspection.status} />
              <SelfInspectionRiskBadge level={data.inspection.overallRiskLevel} />
            </div>
            <p className="mt-3 text-sm text-[color:var(--muted-strong)]">
              Cliente {data.customer.fullName} / contacto {data.customer.phone}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <WizardProgress
            completionPercent={data.inspection.completionPercent}
            currentStep={currentStep === 10 ? 9 : currentStep}
          />
        </div>
      </Card>

      {errorMessages.length > 0 ? (
        <Card className="rounded-[28px] border-[rgba(200,92,42,0.18)] bg-[rgba(200,92,42,0.08)]">
          <p className="text-sm font-semibold text-[color:var(--accent-strong)]">
            Revisa estos campos antes de continuar:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-[color:var(--accent-strong)]">
            {errorMessages.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </Card>
      ) : null}

      {currentStep === 1 ? (
        <Card className="rounded-[32px]">
          <h2 className="font-heading text-3xl font-semibold">Antes de comenzar</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              "Esta autoinspeccion no reemplaza una revision tecnica profesional.",
              "Responde con la mayor precision posible, aunque no conozcas terminos tecnicos.",
              "Haz las fotos con buena luz, con el vehiculo detenido y en un lugar seguro.",
              "Puedes guardar en borrador y retomar el enlace mas tarde mientras siga vigente.",
            ].map((item) => (
              <div
                className="rounded-[24px] border border-[color:var(--border)] bg-white/70 p-4 text-sm text-[color:var(--muted-strong)]"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={() => setCurrentStep(2)} type="button">
              Comenzar autoinspeccion
            </Button>
          </div>
        </Card>
      ) : null}

      {currentStep === 2 ? (
        <Card className="rounded-[32px]">
          <h2 className="font-heading text-3xl font-semibold">Identificacion del vehiculo</h2>
          <div className="mt-5 space-y-5">
            <QuestionField
              helpText="Si el taller ya te asocio un vehiculo, puedes reutilizarlo y luego corregir cualquier dato."
              label="Vehiculo registrado"
            >
              <Select
                disabled={isReadOnly}
                onChange={(event) => {
                  const selected = data.vehicles.find((vehicle) => vehicle.id === event.target.value);
                  updateVehicleField("vehicleId", event.target.value);

                  if (selected) {
                    updateVehicleField("plate", selected.plate ?? "");
                    updateVehicleField("vin", selected.vin ?? "");
                    updateVehicleField("make", selected.make);
                    updateVehicleField("model", selected.model);
                    updateVehicleField("year", selected.year ?? "");
                    updateVehicleField("color", selected.color ?? "");
                    updateVehicleField("mileage", selected.mileage ?? "");
                    updateVehicleField("fuelType", selected.fuelType ?? "");
                    updateVehicleField("transmission", selected.transmission ?? "");
                  }
                }}
                value={String(data.form.vehicle.vehicleId ?? "")}
              >
                <option value="">Ingresar manualmente</option>
                {data.vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.label}
                  </option>
                ))}
              </Select>
            </QuestionField>

            <div className="grid gap-5 md:grid-cols-2">
              <QuestionField label="Patente">
                <Input
                  disabled={isReadOnly}
                  onChange={(event) => updateVehicleField("plate", event.target.value)}
                  value={String(data.form.vehicle.plate ?? "")}
                />
              </QuestionField>
              <QuestionField label="VIN">
                <Input
                  disabled={isReadOnly}
                  onChange={(event) => updateVehicleField("vin", event.target.value)}
                  value={String(data.form.vehicle.vin ?? "")}
                />
              </QuestionField>
              <QuestionField label="Marca">
                <Input
                  disabled={isReadOnly}
                  onChange={(event) => updateVehicleField("make", event.target.value)}
                  value={String(data.form.vehicle.make ?? "")}
                />
              </QuestionField>
              <QuestionField label="Modelo">
                <Input
                  disabled={isReadOnly}
                  onChange={(event) => updateVehicleField("model", event.target.value)}
                  value={String(data.form.vehicle.model ?? "")}
                />
              </QuestionField>
              <QuestionField label="Ano">
                <Input
                  disabled={isReadOnly}
                  onChange={(event) => updateVehicleField("year", Number(event.target.value))}
                  type="number"
                  value={String(data.form.vehicle.year ?? "")}
                />
              </QuestionField>
              <QuestionField label="Color">
                <Input
                  disabled={isReadOnly}
                  onChange={(event) => updateVehicleField("color", event.target.value)}
                  value={String(data.form.vehicle.color ?? "")}
                />
              </QuestionField>
              <QuestionField label="Kilometraje actual">
                <Input
                  disabled={isReadOnly}
                  onChange={(event) => updateVehicleField("mileage", Number(event.target.value))}
                  type="number"
                  value={String(data.form.vehicle.mileage ?? "")}
                />
              </QuestionField>
              <QuestionField label="Tipo de combustible">
                <Select
                  disabled={isReadOnly}
                  onChange={(event) => updateVehicleField("fuelType", event.target.value)}
                  value={String(data.form.vehicle.fuelType ?? "")}
                >
                  <option value="">Selecciona</option>
                  {VEHICLE_FUEL_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </QuestionField>
              <QuestionField label="Transmision">
                <Select
                  disabled={isReadOnly}
                  onChange={(event) => updateVehicleField("transmission", event.target.value)}
                  value={String(data.form.vehicle.transmission ?? "")}
                >
                  <option value="">Selecciona</option>
                  {VEHICLE_TRANSMISSION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </QuestionField>
              <QuestionField label="El vehiculo enciende">
                <BooleanSegmentField
                  disabled={isReadOnly}
                  onChange={(value) => updateVehicleField("starts", value)}
                  value={Boolean(data.form.vehicle.starts)}
                />
              </QuestionField>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Button onClick={() => setCurrentStep(1)} type="button" variant="ghost">
              Volver
            </Button>
            <Button
              disabled={isReadOnly || isSubmitting}
              onClick={() =>
                saveStep(`/api/self-inspections/public/${token}/vehicle`, data.form.vehicle, 3)
              }
              type="button"
            >
              Guardar y continuar
            </Button>
          </div>
        </Card>
      ) : null}

      {currentStep === 3 ? (
        <Card className="rounded-[32px]">
          <h2 className="font-heading text-3xl font-semibold">Motivo de inspeccion</h2>
          <div className="mt-5 space-y-5">
            <QuestionField label="Motivo principal">
              <ChoiceSegmentField
                columns={3}
                disabled={isReadOnly}
                onChange={(value) => updateReasonField("inspectionReason", value)}
                options={SELF_INSPECTION_REASON_OPTIONS}
                value={String(data.form.reason.inspectionReason ?? "")}
              />
            </QuestionField>

            {data.form.reason.inspectionReason === "OTHER" ? (
              <QuestionField label="Especifica el motivo">
                <Input
                  disabled={isReadOnly}
                  onChange={(event) => updateReasonField("inspectionReasonOther", event.target.value)}
                  value={String(data.form.reason.inspectionReasonOther ?? "")}
                />
              </QuestionField>
            ) : null}

            <QuestionField
              label={
                requiresProblemTimeline
                  ? "Describe el problema principal"
                  : "Describe que quieres revisar o solicitar"
              }
            >
              <Textarea
                disabled={isReadOnly}
                onChange={(event) => updateReasonField("mainComplaint", event.target.value)}
                value={String(data.form.reason.mainComplaint ?? "")}
              />
            </QuestionField>

            <div className="grid gap-5 md:grid-cols-2">
              {requiresProblemTimeline ? (
                <QuestionField label="Desde cuando ocurre el problema">
                  <Input
                    disabled={isReadOnly}
                    onChange={(event) => updateReasonField("problemSince", event.target.value)}
                    value={String(data.form.reason.problemSince ?? "")}
                  />
                </QuestionField>
              ) : null}
              {requiresProblemTimeline ? (
                <QuestionField label="Frecuencia">
                  <ChoiceSegmentField
                    disabled={isReadOnly}
                    onChange={(value) => updateReasonField("issueFrequency", value)}
                    options={ISSUE_FREQUENCY_OPTIONS.map((option) => ({
                      label: option.label,
                      value: option.value,
                    }))}
                    value={String(data.form.reason.issueFrequency ?? "")}
                  />
                </QuestionField>
              ) : null}
              <QuestionField label="El vehiculo puede circular">
                <BooleanSegmentField
                  disabled={isReadOnly}
                  onChange={(value) => updateReasonField("canDrive", value)}
                  value={data.form.reason.canDrive as boolean | undefined}
                />
              </QuestionField>
              {requiresProblemTimeline ? (
                <QuestionField label="El problema empeoro recientemente">
                  <BooleanSegmentField
                    disabled={isReadOnly}
                    onChange={(value) => updateReasonField("worsenedRecently", value)}
                    value={data.form.reason.worsenedRecently as boolean | undefined}
                  />
                </QuestionField>
              ) : null}
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Button onClick={() => setCurrentStep(2)} type="button" variant="ghost">
              Volver
            </Button>
            <Button
              disabled={isReadOnly || isSubmitting}
              onClick={() =>
                saveStep(`/api/self-inspections/public/${token}/reason`, data.form.reason, 4)
              }
              type="button"
            >
              Guardar y continuar
            </Button>
          </div>
        </Card>
      ) : null}

      {currentStep === 4 ? (
        <Card className="rounded-[32px]">
          <h2 className="font-heading text-3xl font-semibold">Estado general reportado</h2>
          <div className="mt-6 space-y-8">
            <div className="space-y-4">
              <h3 className="font-heading text-2xl font-semibold">Estado operativo basico</h3>
              <QuestionField label="Arranque">
                <ChoiceSegmentField
                  disabled={isReadOnly}
                  onChange={(value) => updateGeneralField("operational", "startBehavior", value)}
                  options={START_BEHAVIOR_OPTIONS.map((option) => ({
                    label: option.label,
                    value: option.value,
                  }))}
                  value={String(data.form.general.operational.startBehavior ?? "")}
                />
              </QuestionField>
              {renderBooleanList(data.form.general.operational, "operational", operationalBooleanQuestions)}
              {data.form.general.operational.dashboardWarningLights ? (
                <QuestionField label="Cuales son los testigos encendidos">
                  <Input
                    disabled={isReadOnly}
                    onChange={(event) =>
                      updateGeneralField(
                        "operational",
                        "dashboardWarningDetails",
                        event.target.value,
                      )
                    }
                    value={String(data.form.general.operational.dashboardWarningDetails ?? "")}
                  />
                </QuestionField>
              ) : null}
            </div>

            <div className="space-y-4">
              <h3 className="font-heading text-2xl font-semibold">Motor y funcionamiento</h3>
              {renderBooleanList(data.form.general.engine, "engine", engineBooleanQuestions)}
              {data.form.general.engine.fluidLeaks ? (
                <QuestionField label="Detalle de fuga o fluido visible">
                  <Input
                    disabled={isReadOnly}
                    onChange={(event) =>
                      updateGeneralField("engine", "fluidLeakDetails", event.target.value)
                    }
                    value={String(data.form.general.engine.fluidLeakDetails ?? "")}
                  />
                </QuestionField>
              ) : null}
            </div>

            <div className="space-y-4">
              <h3 className="font-heading text-2xl font-semibold">Frenos</h3>
              {renderBooleanList(data.form.general.brakes, "brakes", brakesBooleanQuestions)}
              <QuestionField label="Como se siente el pedal">
                <ChoiceSegmentField
                  disabled={isReadOnly}
                  onChange={(value) => updateGeneralField("brakes", "pedalFeel", value)}
                  options={BRAKE_PEDAL_FEEL_OPTIONS.map((option) => ({
                    label: option.label,
                    value: option.value,
                  }))}
                  value={String(data.form.general.brakes.pedalFeel ?? "")}
                />
              </QuestionField>
            </div>

            <div className="space-y-4">
              <h3 className="font-heading text-2xl font-semibold">Direccion y suspension</h3>
              {renderBooleanList(
                data.form.general.steeringSuspension,
                "steeringSuspension",
                steeringQuestions,
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-heading text-2xl font-semibold">Transmision / embrague</h3>
              {isAutomatic ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    ["shiftSmooth", "Los cambios entran suaves"],
                    ["jerks", "Siente tirones al cambiar"],
                    ["delay", "Hay retraso al engranar D o R"],
                    ["shiftNoise", "Escucha ruidos extranos al cambiar"],
                  ].map(([field, label]) => (
                    <QuestionField key={field} label={label}>
                      <BooleanSegmentField
                        disabled={isReadOnly}
                        onChange={(value) =>
                          updateGeneralField("automaticTransmission", field, value)
                        }
                        value={
                          data.form.general.automaticTransmission?.[
                            field as keyof typeof data.form.general.automaticTransmission
                          ] as boolean | undefined
                        }
                      />
                    </QuestionField>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      ["hardGears", "Le cuesta entrar algun cambio"],
                      ["clutchSlipping", "El embrague patina"],
                      ["clutchNoise", "Escucha ruidos al presionar embrague"],
                    ].map(([field, label]) => (
                      <QuestionField key={field} label={label}>
                        <BooleanSegmentField
                          disabled={isReadOnly}
                          onChange={(value) =>
                            updateGeneralField("manualTransmission", field, value)
                          }
                          value={
                            data.form.general.manualTransmission?.[
                              field as keyof typeof data.form.general.manualTransmission
                            ] as boolean | undefined
                          }
                        />
                      </QuestionField>
                    ))}
                  </div>
                  <QuestionField label="Altura del pedal de embrague">
                    <ChoiceSegmentField
                      disabled={isReadOnly}
                      onChange={(value) =>
                        updateGeneralField("manualTransmission", "clutchPedalPosition", value)
                      }
                      options={CLUTCH_PEDAL_POSITION_OPTIONS.map((option) => ({
                        label: option.label,
                        value: option.value,
                      }))}
                      value={String(data.form.general.manualTransmission?.clutchPedalPosition ?? "")}
                    />
                  </QuestionField>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-heading text-2xl font-semibold">Neumaticos y ruedas</h3>
              {renderBooleanList(data.form.general.tires, "tires", tiresQuestions)}
              <QuestionField label="Tipo de desgaste">
                <ChoiceSegmentField
                  disabled={isReadOnly}
                  onChange={(value) => updateGeneralField("tires", "wearPattern", value)}
                  options={TIRE_WEAR_PATTERN_OPTIONS.map((option) => ({
                    label: option.label,
                    value: option.value,
                  }))}
                  value={String(data.form.general.tires.wearPattern ?? "")}
                />
              </QuestionField>
            </div>

            <div className="space-y-4">
              <h3 className="font-heading text-2xl font-semibold">Sistema electrico</h3>
              {renderBooleanList(data.form.general.electrical, "electrical", electricalQuestions)}
            </div>

            <div className="space-y-4">
              <h3 className="font-heading text-2xl font-semibold">Interior / confort</h3>
              {renderBooleanList(data.form.general.interior, "interior", interiorQuestions)}
              <QuestionField label="Funciona multimedia">
                <ChoiceSegmentField
                  disabled={isReadOnly}
                  onChange={(value) => updateGeneralField("interior", "multimediaWorking", value)}
                  options={MULTIMEDIA_WORKING_OPTIONS.map((option) => ({
                    label: option.label,
                    value: option.value,
                  }))}
                  value={String(data.form.general.interior.multimediaWorking ?? "")}
                />
              </QuestionField>
            </div>

            <div className="space-y-4">
              <h3 className="font-heading text-2xl font-semibold">Exterior / carroceria</h3>
              {renderBooleanList(data.form.general.exterior, "exterior", exteriorQuestions)}
              <QuestionField label="Antiguedad del dano">
                <ChoiceSegmentField
                  disabled={isReadOnly}
                  onChange={(value) => updateGeneralField("exterior", "damageAge", value)}
                  options={DAMAGE_AGE_OPTIONS.map((option) => ({
                    label: option.label,
                    value: option.value,
                  }))}
                  value={String(data.form.general.exterior.damageAge ?? "")}
                />
              </QuestionField>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Button onClick={() => setCurrentStep(3)} type="button" variant="ghost">
              Volver
            </Button>
            <Button
              disabled={isReadOnly || isSubmitting}
              onClick={() =>
                saveStep(`/api/self-inspections/public/${token}/general`, buildGeneralPayload(), 5)
              }
              type="button"
            >
              Guardar y continuar
            </Button>
          </div>
        </Card>
      ) : null}

      {currentStep === 5 ? (
        <Card className="rounded-[32px]">
          <h2 className="font-heading text-3xl font-semibold">Danos y siniestros</h2>
          <div className="mt-5 space-y-5">
            <QuestionField label="El vehiculo sufrio choque o roce reciente">
              <BooleanSegmentField
                disabled={isReadOnly}
                onChange={(value) => updateDamageField("recentCollision", value)}
                value={data.form.damage.recentCollision as boolean | undefined}
              />
            </QuestionField>
            <QuestionField label="Zona afectada">
              <ChoiceSegmentField
                columns={3}
                disabled={isReadOnly}
                onChange={(value) => updateDamageField("affectedZone", value)}
                options={DAMAGE_AFFECTED_ZONE_OPTIONS.map((option) => ({
                  label: option.label,
                  value: option.value,
                }))}
                value={String(data.form.damage.affectedZone ?? "")}
              />
            </QuestionField>
            <div className="grid gap-5 md:grid-cols-2">
              <QuestionField label="El dano afecta funcionamiento">
                <BooleanSegmentField
                  disabled={isReadOnly}
                  onChange={(value) => updateDamageField("affectsFunctionality", value)}
                  value={data.form.damage.affectsFunctionality as boolean | undefined}
                />
              </QuestionField>
              <QuestionField label="Se observa posible golpe estructural">
                <BooleanSegmentField
                  disabled={isReadOnly}
                  onChange={(value) => updateDamageField("structuralImpact", value)}
                  value={data.form.damage.structuralImpact as boolean | undefined}
                />
              </QuestionField>
              <QuestionField label="Hay denuncia o seguro involucrado">
                <BooleanSegmentField
                  disabled={isReadOnly}
                  onChange={(value) => updateDamageField("insuranceOrPoliceReport", value)}
                  value={data.form.damage.insuranceOrPoliceReport as boolean | undefined}
                />
              </QuestionField>
              <QuestionField label="Desea evaluacion para aseguradora">
                <BooleanSegmentField
                  disabled={isReadOnly}
                  onChange={(value) => updateDamageField("wantsInsuranceEvaluation", value)}
                  value={data.form.damage.wantsInsuranceEvaluation as boolean | undefined}
                />
              </QuestionField>
            </div>
            <QuestionField label="Fue arrastrado, inundado o expuesto a incendio">
              <div className="grid gap-3 md:grid-cols-3">
                {DAMAGE_EXPOSURE_EVENT_OPTIONS.map((option) => {
                  const active = data.form.damage.exposureEvents.includes(option.value);

                  return (
                    <button
                      className={`min-h-11 rounded-2xl border px-4 text-left text-sm font-semibold transition ${
                        active
                          ? "border-[color:var(--accent)] bg-[rgba(200,92,42,0.1)] text-[color:var(--accent-strong)]"
                          : "border-[color:var(--border)] bg-white/80 text-[color:var(--muted-strong)]"
                      }`}
                      disabled={isReadOnly}
                      key={option.value}
                      onClick={() => {
                        const nextValues = active
                          ? data.form.damage.exposureEvents.filter((value) => value !== option.value)
                          : [...data.form.damage.exposureEvents, option.value];
                        updateDamageField("exposureEvents", nextValues);
                      }}
                      type="button"
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </QuestionField>
          </div>

          <div className="mt-6 flex justify-between">
            <Button onClick={() => setCurrentStep(4)} type="button" variant="ghost">
              Volver
            </Button>
            <Button
              disabled={isReadOnly || isSubmitting}
              onClick={() =>
                saveStep(`/api/self-inspections/public/${token}/damage`, data.form.damage, 6)
              }
              type="button"
            >
              Guardar y continuar
            </Button>
          </div>
        </Card>
      ) : null}

      {currentStep === 6 ? (
        <Card className="rounded-[32px]">
          <h2 className="font-heading text-3xl font-semibold">Mantenciones previas e historial</h2>
          <div className="mt-5 space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <QuestionField label="Cuando fue la ultima mantencion">
                <Input
                  disabled={isReadOnly}
                  onChange={(event) => updateHistoryField("lastMaintenanceAt", event.target.value)}
                  value={String(data.form.history.lastMaintenanceAt ?? "")}
                />
              </QuestionField>
              <QuestionField label="Que mantencion se realizo">
                <Input
                  disabled={isReadOnly}
                  onChange={(event) =>
                    updateHistoryField("lastMaintenancePerformed", event.target.value)
                  }
                  value={String(data.form.history.lastMaintenancePerformed ?? "")}
                />
              </QuestionField>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["brakesReplacedRecently", "Se han cambiado frenos recientemente"],
                ["batteryReplacedRecently", "Se ha cambiado bateria recientemente"],
                ["tiresReplacedRecently", "Se han cambiado neumaticos recientemente"],
                ["oilAndFiltersChanged", "Se ha hecho cambio de aceite y filtros"],
                ["pendingRecentRepairs", "Tiene reparaciones recientes pendientes"],
                ["checkedByAnotherWorkshop", "Ya fue revisado por otro taller"],
                ["previousQuoteOrDiagnosis", "Tiene presupuesto o diagnostico previo"],
              ].map(([field, label]) => (
                <QuestionField key={field} label={label}>
                  <BooleanSegmentField
                    disabled={isReadOnly}
                    onChange={(value) => updateHistoryField(field, value)}
                    value={data.form.history[field as keyof typeof data.form.history] as boolean | undefined}
                  />
                </QuestionField>
              ))}
            </div>

            {data.form.history.previousQuoteOrDiagnosis ? (
              <QuestionField label="Detalle del presupuesto o diagnostico previo">
                <Textarea
                  disabled={isReadOnly}
                  onChange={(event) =>
                    updateHistoryField("previousDiagnosisDetails", event.target.value)
                  }
                  value={String(data.form.history.previousDiagnosisDetails ?? "")}
                />
              </QuestionField>
            ) : null}
          </div>

          <div className="mt-6 flex justify-between">
            <Button onClick={() => setCurrentStep(5)} type="button" variant="ghost">
              Volver
            </Button>
            <Button
              disabled={isReadOnly || isSubmitting}
              onClick={() =>
                saveStep(`/api/self-inspections/public/${token}/history`, data.form.history, 7)
              }
              type="button"
            >
              Guardar y continuar
            </Button>
          </div>
        </Card>
      ) : null}

      {currentStep === 7 ? (
        <Card className="rounded-[32px]">
          <h2 className="font-heading text-3xl font-semibold">Evidencia fotografica</h2>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Las fotos obligatorias permiten al taller revisar danos visibles, kilometraje,
            testigos y estado exterior antes de la recepcion fisica del vehiculo.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.photoSlots.map((slot) => (
              <PhotoSlotCard
                key={slot.photoType}
                onDelete={handlePhotoDelete}
                onUpload={handlePhotoUpload}
                photo={data.photos.find((photo) => photo.photoType === slot.photoType)}
                slot={slot}
                uploading={uploadingPhotoType === slot.photoType}
              />
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <Button onClick={() => setCurrentStep(6)} type="button" variant="ghost">
              Volver
            </Button>
            <Button disabled={isReadOnly} onClick={() => setCurrentStep(8)} type="button">
              Continuar
            </Button>
          </div>
        </Card>
      ) : null}

      {currentStep === 8 ? (
        <Card className="rounded-[32px]">
          <h2 className="font-heading text-3xl font-semibold">Observaciones libres</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <QuestionField label="Explicacion adicional del problema">
              <Textarea
                disabled={isReadOnly}
                onChange={(event) => updateNotesField("additionalProblemContext", event.target.value)}
                value={String(data.form.notes.additionalProblemContext ?? "")}
              />
            </QuestionField>
            <QuestionField label="Condiciones en que ocurre">
              <Textarea
                disabled={isReadOnly}
                onChange={(event) => updateNotesField("triggerConditions", event.target.value)}
                value={String(data.form.notes.triggerConditions ?? "")}
              />
            </QuestionField>
            <QuestionField label="Antecedentes importantes">
              <Textarea
                disabled={isReadOnly}
                onChange={(event) => updateNotesField("importantBackground", event.target.value)}
                value={String(data.form.notes.importantBackground ?? "")}
              />
            </QuestionField>
            <QuestionField label="Instrucciones para el taller">
              <Textarea
                disabled={isReadOnly}
                onChange={(event) => updateNotesField("workshopInstructions", event.target.value)}
                value={String(data.form.notes.workshopInstructions ?? "")}
              />
            </QuestionField>
            <QuestionField label="Disponibilidad del cliente" className="md:col-span-2">
              <Input
                disabled={isReadOnly}
                onChange={(event) => updateNotesField("customerAvailability", event.target.value)}
                value={String(data.form.notes.customerAvailability ?? "")}
              />
            </QuestionField>
          </div>

          <div className="mt-6 flex justify-between">
            <Button onClick={() => setCurrentStep(7)} type="button" variant="ghost">
              Volver
            </Button>
            <Button
              disabled={isReadOnly || isSubmitting}
              onClick={() =>
                saveStep(`/api/self-inspections/public/${token}/notes`, data.form.notes, 9)
              }
              type="button"
            >
              Guardar y revisar resumen
            </Button>
          </div>
        </Card>
      ) : null}

      {currentStep === 9 ? (
        <Card className="rounded-[32px]">
          <h2 className="font-heading text-3xl font-semibold">Resumen final</h2>
          <div className="mt-5 space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-[color:var(--border)] bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
                  Vehiculo
                </p>
                <p className="mt-2 text-sm text-[color:var(--muted-strong)]">
                  {data.form.vehicle.make} {data.form.vehicle.model} / {data.form.vehicle.plate}
                </p>
                <Button className="mt-4" onClick={() => setCurrentStep(2)} type="button" variant="ghost">
                  Editar vehiculo
                </Button>
              </div>

              <div className="rounded-[24px] border border-[color:var(--border)] bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
                  Motivo principal
                </p>
                <p className="mt-2 text-sm text-[color:var(--muted-strong)]">
                  {data.form.reason.mainComplaint}
                </p>
                <Button className="mt-4" onClick={() => setCurrentStep(3)} type="button" variant="ghost">
                  Editar motivo
                </Button>
              </div>
            </div>

            <div className="rounded-[24px] border border-[color:var(--border)] bg-white/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
                Validaciones antes de enviar
              </p>
              <div className="mt-3 space-y-2 text-sm text-[color:var(--muted-strong)]">
                <p>
                  Fotos obligatorias pendientes:{" "}
                  {data.missingRequiredPhotoTypes.length > 0
                    ? data.missingRequiredPhotoTypes
                        .map((photoType) => SELF_INSPECTION_PHOTO_TYPE_LABELS[photoType])
                        .join(", ")
                    : "ninguna"}
                </p>
                <p>
                  Riesgo preliminar detectado: <strong>{data.inspection.overallRiskLabel}</strong>
                </p>
                {data.criticalFindings.length > 0 ? (
                  <p>
                    Alertas destacadas:{" "}
                    {data.criticalFindings.map((finding) => finding.label).join(", ")}
                  </p>
                ) : null}
              </div>
            </div>

            <label className="flex items-start gap-3 rounded-[24px] border border-[color:var(--border)] bg-white/70 p-4 text-sm text-[color:var(--muted-strong)]">
              <input
                checked={acceptance}
                className="mt-1 size-4 rounded border-[color:var(--border-strong)]"
                onChange={(event) => setAcceptance(event.target.checked)}
                type="checkbox"
              />
              Confirmo que la informacion entregada refleja el estado actual del vehiculo y
              entiendo que esta autoinspeccion no reemplaza una revision tecnica profesional.
            </label>
          </div>

          <div className="mt-6 flex justify-between">
            <Button onClick={() => setCurrentStep(8)} type="button" variant="ghost">
              Volver
            </Button>
            <Button disabled={isSubmitting || isReadOnly} onClick={handleSubmit} type="button">
              Enviar autoinspeccion
            </Button>
          </div>
        </Card>
      ) : null}

      {currentStep === 10 ? (
        <Card className="rounded-[32px]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="font-heading text-3xl font-semibold">Autoinspeccion enviada</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted-strong)]">
                El taller ya puede revisar el resumen, las respuestas estructuradas y la galeria
                fotografica para preparar el prediagnostico.
              </p>
              <p className="mt-3 text-sm text-[color:var(--muted)]">
                Estado actual: {data.inspection.statusLabel}
              </p>
            </div>
            <SelfInspectionRiskBadge level={data.inspection.overallRiskLevel} />
          </div>
        </Card>
      ) : null}
    </div>
  );
}
