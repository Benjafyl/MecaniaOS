"use client";

import { BudgetItemType } from "@prisma/client";
import { ChangeEvent, useActionState, useMemo, useState } from "react";

import { createBudgetDraftAction } from "@/app/(protected)/budgets/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { initialActionState } from "@/lib/form-state";
import { formatCurrency } from "@/lib/utils";
import { BUDGET_ITEM_TYPE_LABELS } from "@/modules/budgets/budget.constants";

type BudgetCreateFormProps = {
  clients: Array<{
    id: string;
    fullName: string;
  }>;
  selfInspections: Array<{
    id: string;
    customerId: string;
    customerName: string;
    vehicleId: string | null;
    vehicleLabel: string;
    reviewedAt: Date | null;
  }>;
  vehicles: Array<{
    id: string;
    plate: string | null;
    vin: string;
    make: string;
    model: string;
    clientId: string;
    clientName: string;
  }>;
  inventoryParts: Array<{
    id: string;
    name: string;
    code: string;
    unitPrice: number;
    currentStock: number;
    minimumStock: number;
  }>;
  references: Array<{
    id: string;
    itemType: BudgetItemType;
    name: string;
    referenceCode: string | null;
    unitPrice: number;
    sourceLabel: string;
    sourceUrl: string | null;
    vehicleCompatibility: string | null;
  }>;
};

export function BudgetCreateForm({
  clients,
  selfInspections,
  vehicles,
  inventoryParts,
  references,
}: BudgetCreateFormProps) {
  const [state, formAction] = useActionState(createBudgetDraftAction, initialActionState);
  const manualSlots = [1, 2] as const;
  const partSlots = [1, 2, 3, 4] as const;
  const laborSlots = [1, 2, 3] as const;
  const supplySlots = [1, 2] as const;
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [selectedSelfInspectionId, setSelectedSelfInspectionId] = useState("");
  const [selectedPartIds, setSelectedPartIds] = useState<Record<string, string>>({});
  const [selectedReferenceIds, setSelectedReferenceIds] = useState<Record<string, string>>({});
  const [visiblePartSlots, setVisiblePartSlots] = useState(1);
  const [visibleLaborSlots, setVisibleLaborSlots] = useState(1);
  const [visibleSupplySlots, setVisibleSupplySlots] = useState(1);
  const [showPartManual, setShowPartManual] = useState(false);
  const [showLaborManual, setShowLaborManual] = useState(false);
  const [showSupplyManual, setShowSupplyManual] = useState(false);
  const [visiblePartManualSlots, setVisiblePartManualSlots] = useState(1);
  const [visibleLaborManualSlots, setVisibleLaborManualSlots] = useState(1);
  const [visibleSupplyManualSlots, setVisibleSupplyManualSlots] = useState(1);

  const groupedReferences = useMemo(
    () => ({
      [BudgetItemType.LABOR]: references.filter(
        (reference) => reference.itemType === BudgetItemType.LABOR,
      ),
      [BudgetItemType.SUPPLY]: references.filter(
        (reference) => reference.itemType === BudgetItemType.SUPPLY,
      ),
    }),
    [references],
  );
  const selectedInspection = selfInspections.find(
    (inspection) => inspection.id === selectedSelfInspectionId,
  );
  const availableVehicles = selectedClientId
    ? vehicles.filter((vehicle) => vehicle.clientId === selectedClientId)
    : [];

  function handleClientChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextClientId = event.target.value;
    setSelectedClientId(nextClientId);

    const currentVehicleBelongsToNextClient = vehicles.some(
      (vehicle) => vehicle.id === selectedVehicleId && vehicle.clientId === nextClientId,
    );

    if (!nextClientId || !currentVehicleBelongsToNextClient) {
      setSelectedVehicleId("");
    }
  }

  function handleSelfInspectionChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextInspectionId = event.target.value;
    setSelectedSelfInspectionId(nextInspectionId);

    const inspection = selfInspections.find((entry) => entry.id === nextInspectionId);

    if (!inspection) {
      return;
    }

    setSelectedClientId(inspection.customerId);
    setSelectedVehicleId(inspection.vehicleId ?? "");
  }

  function findSelectedPart(slot: number) {
    return inventoryParts.find((part) => part.id === selectedPartIds[String(slot)]);
  }

  function findSelectedReference(type: "LABOR" | "SUPPLY", slot: number) {
    return groupedReferences[type]?.find(
      (reference) => reference.id === selectedReferenceIds[`${type}:${slot}`],
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <input name="clientId" type="hidden" value={selectedClientId} />
      <input name="vehicleId" type="hidden" value={selectedVehicleId} />

      <Card className="rounded-2xl">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2 lg:col-span-2">
            <label
              className="text-sm font-medium text-[color:var(--muted-strong)]"
              htmlFor="selfInspectionId"
            >
              Autoinspeccion revisada
            </label>
            <Select
              id="selfInspectionId"
              name="selfInspectionId"
              onChange={handleSelfInspectionChange}
              value={selectedSelfInspectionId}
            >
              <option value="">Sin autoinspeccion asociada</option>
              {selfInspections.map((inspection) => (
                <option key={inspection.id} value={inspection.id}>
                  {inspection.customerName} / {inspection.vehicleLabel}
                </option>
              ))}
            </Select>
            <p className="text-sm text-[color:var(--muted)]">
              Si eliges una autoinspeccion revisada, el sistema completa desde ahi el cliente y el
              vehiculo del presupuesto.
            </p>
            {selectedInspection ? (
              <p className="text-sm text-[#1d4ed8]">
                Cliente y vehiculo completados automaticamente desde la autoinspeccion.
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="title">
              Titulo del presupuesto
            </label>
            <Input id="title" name="title" placeholder="Ej. Reparacion frenos delanteros y mantencion" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="clientId">
              Cliente
            </label>
            <Select
              disabled={Boolean(selectedInspection)}
              id="clientId"
              onChange={handleClientChange}
              value={selectedClientId}
            >
              <option value="">Selecciona un cliente si no usaras autoinspeccion</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.fullName}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="vehicleId">
              Vehiculo
            </label>
            <Select
              disabled={!selectedClientId || Boolean(selectedInspection)}
              id="vehicleId"
              onChange={(event) => setSelectedVehicleId(event.target.value)}
              value={selectedVehicleId}
            >
              <option value="">
                {selectedClientId
                  ? "Selecciona un vehiculo del cliente"
                  : "Selecciona primero un cliente"}
              </option>
              {availableVehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.make} {vehicle.model} / {vehicle.plate ?? vehicle.vin}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2 lg:col-span-2">
            <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="summary">
              Resumen tecnico
            </label>
            <Textarea
              id="summary"
              name="summary"
              placeholder="Describe el motivo del presupuesto, el diagnostico base y cualquier alcance relevante."
            />
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl">
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
              Repuestos conectados a inventario
            </p>
            <h2 className="mt-2 font-heading text-2xl font-semibold">
              {BUDGET_ITEM_TYPE_LABELS[BudgetItemType.PART]}
            </h2>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              Selecciona repuestos reales del inventario. El valor unitario se completa
              automaticamente y solo ajustas la cantidad.
            </p>
          </div>

          <div className="space-y-4">
            {partSlots.slice(0, visiblePartSlots).map((slot) => {
              const selectedPart = findSelectedPart(slot);

              return (
                <div
                  className="grid gap-4 rounded-2xl border border-[color:var(--border)] bg-white p-4 lg:grid-cols-[1.8fr_180px_140px]"
                  key={`part-slot-${slot}`}
                >
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium text-[color:var(--muted-strong)]"
                      htmlFor={`partItem:${slot}`}
                    >
                      Repuesto
                    </label>
                    <Select
                      id={`partItem:${slot}`}
                      name={`partItem:${slot}`}
                      onChange={(event) =>
                        setSelectedPartIds((current) => ({
                          ...current,
                          [String(slot)]: event.target.value,
                        }))
                      }
                      value={selectedPartIds[String(slot)] ?? ""}
                    >
                      <option value="">Selecciona un repuesto</option>
                      {inventoryParts.map((part) => (
                        <option key={part.id} value={part.id}>
                          {part.name} / {part.code} / {formatCurrency(part.unitPrice)} / stock{" "}
                          {part.currentStock}
                        </option>
                      ))}
                    </Select>
                    {selectedPart ? (
                      <p className="text-sm text-[color:var(--muted)]">
                        Stock actual {selectedPart.currentStock} / minimo {selectedPart.minimumStock}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium text-[color:var(--muted-strong)]"
                      htmlFor={`partPriceDisplay:${slot}`}
                    >
                      Valor unitario
                    </label>
                    <Input
                      id={`partPriceDisplay:${slot}`}
                      readOnly
                      value={selectedPart ? String(selectedPart.unitPrice) : ""}
                    />
                    <p className="text-xs text-[color:var(--muted)]">
                      {selectedPart ? formatCurrency(selectedPart.unitPrice) : "Se completa al elegir"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium text-[color:var(--muted-strong)]"
                      htmlFor={`partQuantity:${slot}`}
                    >
                      Cantidad
                    </label>
                    <Input
                      defaultValue="0"
                      id={`partQuantity:${slot}`}
                      min="0"
                      name={`partQuantity:${slot}`}
                      type="number"
                    />
                  </div>
                </div>
              );
            })}

            {visiblePartSlots < partSlots.length ? (
              <Button
                onClick={() => setVisiblePartSlots((current) => Math.min(current + 1, partSlots.length))}
                type="button"
                variant="secondary"
              >
                Agregar otro repuesto
              </Button>
            ) : null}
          </div>
        </div>
      </Card>

      {([BudgetItemType.LABOR, BudgetItemType.SUPPLY] as const).map((type) => {
        const slots = type === BudgetItemType.LABOR ? laborSlots : supplySlots;
        const visibleSlots = type === BudgetItemType.LABOR ? visibleLaborSlots : visibleSupplySlots;
        const showManual = type === BudgetItemType.LABOR ? showLaborManual : showSupplyManual;
        const visibleManualSlots =
          type === BudgetItemType.LABOR ? visibleLaborManualSlots : visibleSupplyManualSlots;

        return (
          <Card className="rounded-2xl" key={type}>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
                  Catalogo referencial
                </p>
                <h2 className="mt-2 font-heading text-2xl font-semibold">
                  {BUDGET_ITEM_TYPE_LABELS[type]}
                </h2>
                <p className="mt-2 text-sm text-[color:var(--muted)]">
                  Selecciona un item del catalogo y el valor unitario se completa automaticamente.
                </p>
              </div>

              {groupedReferences[type].length === 0 ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  No hay items cargados en esta categoria. Puedes usar la opcion manual si la
                  necesitas.
                </div>
              ) : (
                <div className="space-y-4">
                  {slots.slice(0, visibleSlots).map((slot) => {
                    const selectedReference = findSelectedReference(type, slot);

                    return (
                      <div
                        className="grid gap-4 rounded-2xl border border-[color:var(--border)] bg-white p-4 lg:grid-cols-[1.8fr_180px_140px]"
                        key={`${type}-slot-${slot}`}
                      >
                        <div className="space-y-2">
                          <label
                            className="text-sm font-medium text-[color:var(--muted-strong)]"
                            htmlFor={`referenceItem:${type}:${slot}`}
                          >
                            {BUDGET_ITEM_TYPE_LABELS[type]}
                          </label>
                          <Select
                            id={`referenceItem:${type}:${slot}`}
                            name={`referenceItem:${type}:${slot}`}
                            onChange={(event) =>
                              setSelectedReferenceIds((current) => ({
                                ...current,
                                [`${type}:${slot}`]: event.target.value,
                              }))
                            }
                            value={selectedReferenceIds[`${type}:${slot}`] ?? ""}
                          >
                            <option value="">Selecciona una referencia</option>
                            {groupedReferences[type].map((reference) => (
                              <option key={reference.id} value={reference.id}>
                                {reference.name} / {reference.referenceCode ?? "sin codigo"} /{" "}
                                {formatCurrency(reference.unitPrice)}
                              </option>
                            ))}
                          </Select>
                          {selectedReference?.vehicleCompatibility ? (
                            <p className="text-sm text-[color:var(--muted)]">
                              Aplicacion: {selectedReference.vehicleCompatibility}
                            </p>
                          ) : null}
                        </div>

                        <div className="space-y-2">
                          <label
                            className="text-sm font-medium text-[color:var(--muted-strong)]"
                            htmlFor={`referencePriceDisplay:${type}:${slot}`}
                          >
                            Valor unitario
                          </label>
                          <Input
                            id={`referencePriceDisplay:${type}:${slot}`}
                            readOnly
                            value={selectedReference ? String(selectedReference.unitPrice) : ""}
                          />
                          <p className="text-xs text-[color:var(--muted)]">
                            {selectedReference
                              ? formatCurrency(selectedReference.unitPrice)
                              : "Se completa al elegir"}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label
                            className="text-sm font-medium text-[color:var(--muted-strong)]"
                            htmlFor={`referenceQuantity:${type}:${slot}`}
                          >
                            Cantidad
                          </label>
                          <Input
                            defaultValue="0"
                            id={`referenceQuantity:${type}:${slot}`}
                            min="0"
                            name={`referenceQuantity:${type}:${slot}`}
                            type="number"
                          />
                        </div>
                      </div>
                    );
                  })}

                  {visibleSlots < slots.length ? (
                    <Button
                      onClick={() => {
                        if (type === BudgetItemType.LABOR) {
                          setVisibleLaborSlots((current) => Math.min(current + 1, laborSlots.length));
                          return;
                        }

                        setVisibleSupplySlots((current) => Math.min(current + 1, supplySlots.length));
                      }}
                      type="button"
                      variant="secondary"
                    >
                      Agregar otro {type === BudgetItemType.LABOR ? "item de mano de obra" : "suministro"}
                    </Button>
                  ) : null}
                </div>
              )}

              {showManual ? (
                <ManualFallbackSection
                  itemType={type}
                  manualSlots={manualSlots.slice(0, visibleManualSlots)}
                  onAddMore={
                    visibleManualSlots < manualSlots.length
                      ? () => {
                          if (type === BudgetItemType.LABOR) {
                            setVisibleLaborManualSlots((current) =>
                              Math.min(current + 1, manualSlots.length),
                            );
                            return;
                          }

                          setVisibleSupplyManualSlots((current) =>
                            Math.min(current + 1, manualSlots.length),
                          );
                        }
                      : undefined
                  }
                  placeholderDescription={
                    type === BudgetItemType.LABOR
                      ? "Ej. Mano de obra cambio discos y rectificado"
                      : "Ej. Limpiador de frenos o insumo puntual"
                  }
                  placeholderNote="Ej. Valor conversado con proveedor o servicio puntual"
                  title={`${BUDGET_ITEM_TYPE_LABELS[type]} fuera del catalogo`}
                />
              ) : (
                <Button
                  onClick={() => {
                    if (type === BudgetItemType.LABOR) {
                      setShowLaborManual(true);
                      return;
                    }

                    setShowSupplyManual(true);
                  }}
                  type="button"
                  variant="secondary"
                >
                  Agregar {BUDGET_ITEM_TYPE_LABELS[type].toLowerCase()} manual
                </Button>
              )}
            </div>
          </Card>
        );
      })}

      {showPartManual ? (
        <Card className="rounded-2xl">
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
                Respaldo manual
              </p>
              <h2 className="mt-2 font-heading text-2xl font-semibold">
                {BUDGET_ITEM_TYPE_LABELS[BudgetItemType.PART]} fuera del inventario
              </h2>
              <p className="mt-2 text-sm text-[color:var(--muted)]">
                Usa este bloque solo si el repuesto aun no esta cargado en inventario.
              </p>
            </div>

            <ManualFallbackRows
              itemType={BudgetItemType.PART}
              manualSlots={manualSlots.slice(0, visiblePartManualSlots)}
              onAddMore={
                visiblePartManualSlots < manualSlots.length
                  ? () =>
                      setVisiblePartManualSlots((current) =>
                        Math.min(current + 1, manualSlots.length),
                      )
                  : undefined
              }
              placeholderDescription="Ej. Pastillas Brembo delanteras"
              placeholderNote="Ej. Repuesto pendiente de cargar en inventario"
            />
          </div>
        </Card>
      ) : (
        <Button onClick={() => setShowPartManual(true)} type="button" variant="secondary">
          Agregar repuesto manual
        </Button>
      )}

      <FormMessage message={state.error} />
      <SubmitButton label="Crear presupuesto borrador" pendingLabel="Creando presupuesto..." />
    </form>
  );
}

function ManualFallbackSection({
  itemType,
  manualSlots,
  onAddMore,
  placeholderDescription,
  placeholderNote,
  title,
}: {
  itemType: BudgetItemType;
  manualSlots: readonly number[];
  onAddMore?: () => void;
  placeholderDescription: string;
  placeholderNote: string;
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--surface)] p-4">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
          Respaldo manual
        </p>
        <h3 className="mt-2 text-lg font-semibold text-[color:var(--foreground)]">{title}</h3>
        <p className="mt-1 text-sm text-[color:var(--muted)]">
          Usa esta opcion solo si el item aun no existe cargado en inventario o catalogo.
        </p>
      </div>

      <div className="mt-4">
        <ManualFallbackRows
          itemType={itemType}
          manualSlots={manualSlots}
          onAddMore={onAddMore}
          placeholderDescription={placeholderDescription}
          placeholderNote={placeholderNote}
        />
      </div>
    </div>
  );
}

function ManualFallbackRows({
  itemType,
  manualSlots,
  onAddMore,
  placeholderDescription,
  placeholderNote,
}: {
  itemType: BudgetItemType;
  manualSlots: readonly number[];
  onAddMore?: () => void;
  placeholderDescription: string;
  placeholderNote: string;
}) {
  return (
    <div className="space-y-4">
      {manualSlots.map((slot) => (
        <div
          className="grid gap-3 rounded-2xl border border-[color:var(--border)] bg-white p-4 lg:grid-cols-[2fr_140px_140px]"
          key={`${itemType}-${slot}`}
        >
          <div className="space-y-2 lg:col-span-3">
            <label
              className="text-sm font-medium text-[color:var(--muted-strong)]"
              htmlFor={`manualDescription:${itemType}:${slot}`}
            >
              Descripcion manual
            </label>
            <Input
              id={`manualDescription:${itemType}:${slot}`}
              name={`manualDescription:${itemType}:${slot}`}
              placeholder={placeholderDescription}
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-[color:var(--muted-strong)]"
              htmlFor={`manualQuantity:${itemType}:${slot}`}
            >
              Cantidad
            </label>
            <Input
              defaultValue="0"
              id={`manualQuantity:${itemType}:${slot}`}
              min="0"
              name={`manualQuantity:${itemType}:${slot}`}
              type="number"
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-[color:var(--muted-strong)]"
              htmlFor={`manualPrice:${itemType}:${slot}`}
            >
              Valor unitario
            </label>
            <Input
              defaultValue="0"
              id={`manualPrice:${itemType}:${slot}`}
              min="0"
              name={`manualPrice:${itemType}:${slot}`}
              type="number"
            />
          </div>

          <div className="space-y-2 lg:col-span-3">
            <label
              className="text-sm font-medium text-[color:var(--muted-strong)]"
              htmlFor={`manualNote:${itemType}:${slot}`}
            >
              Nota opcional
            </label>
            <Input
              id={`manualNote:${itemType}:${slot}`}
              name={`manualNote:${itemType}:${slot}`}
              placeholder={placeholderNote}
            />
          </div>
        </div>
      ))}

      {onAddMore ? (
        <Button onClick={onAddMore} type="button" variant="secondary">
          Agregar otro item manual
        </Button>
      ) : null}
    </div>
  );
}
