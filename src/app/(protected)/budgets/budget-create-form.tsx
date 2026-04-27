"use client";

import { BudgetItemType } from "@prisma/client";
import { useActionState } from "react";

import { createBudgetDraftAction } from "@/app/(protected)/budgets/actions";
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
    customerName: string;
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
  references,
}: BudgetCreateFormProps) {
  const [state, formAction] = useActionState(createBudgetDraftAction, initialActionState);
  const manualSlots = [1, 2] as const;

  const groupedReferences = {
    [BudgetItemType.PART]: references.filter((reference) => reference.itemType === BudgetItemType.PART),
    [BudgetItemType.LABOR]: references.filter((reference) => reference.itemType === BudgetItemType.LABOR),
    [BudgetItemType.SUPPLY]: references.filter((reference) => reference.itemType === BudgetItemType.SUPPLY),
  };

  return (
    <form action={formAction} className="space-y-6">
      <Card className="rounded-2xl">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2 lg:col-span-2">
            <label
              className="text-sm font-medium text-[color:var(--muted-strong)]"
              htmlFor="selfInspectionId"
            >
              Autoinspeccion revisada
            </label>
            <Select id="selfInspectionId" name="selfInspectionId">
              <option value="">Sin autoinspeccion asociada</option>
              {selfInspections.map((inspection) => (
                <option key={inspection.id} value={inspection.id}>
                  {inspection.customerName} / {inspection.vehicleLabel}
                </option>
              ))}
            </Select>
            <p className="text-sm text-[color:var(--muted)]">
              Si eliges una autoinspeccion revisada, el sistema toma desde ahi el cliente y el
              vehiculo del presupuesto.
            </p>
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
            <Select id="clientId" name="clientId">
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
            <Select id="vehicleId" name="vehicleId">
              <option value="">Selecciona un vehiculo si no usaras autoinspeccion</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.clientName} / {vehicle.make} {vehicle.model} / {vehicle.plate ?? vehicle.vin}
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

      {([BudgetItemType.PART, BudgetItemType.LABOR] as const).map((type) => (
        <Card className="rounded-2xl" key={type}>
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
                Seleccionar del catalogo
              </p>
              <h2 className="mt-2 font-heading text-2xl font-semibold">
                {BUDGET_ITEM_TYPE_LABELS[type]}
              </h2>
            </div>

            <div className="space-y-4">
              {groupedReferences[type].length === 0 ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  No hay items cargados en el catalogo para esta categoria. Puedes continuar
                  agregando un item manual para que el flujo no se bloquee.
                </div>
              ) : null}

              {groupedReferences[type].map((reference) => (
                <div
                  className="grid gap-4 rounded-2xl border border-[color:var(--border)] bg-white p-4 lg:grid-cols-[1.5fr_160px]"
                  key={reference.id}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-[color:var(--foreground)]">
                        {reference.name}
                      </h3>
                      {reference.referenceCode ? (
                        <span className="rounded-md bg-[color:var(--surface-strong)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--muted-strong)]">
                          {reference.referenceCode}
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-2 text-sm text-[color:var(--muted-strong)]">
                      Valor real de referencia: <strong>{formatCurrency(reference.unitPrice)}</strong>
                    </p>
                    <p className="mt-1 text-sm text-[color:var(--muted)]">
                      Fuente:{" "}
                      {reference.sourceUrl ? (
                        <a
                          className="font-medium text-[#2563eb] hover:text-[#1d4ed8]"
                          href={reference.sourceUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          {reference.sourceLabel}
                        </a>
                      ) : (
                        reference.sourceLabel
                      )}
                    </p>
                    {reference.vehicleCompatibility ? (
                      <p className="mt-1 text-sm text-[color:var(--muted)]">
                        Aplicacion: {reference.vehicleCompatibility}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium text-[color:var(--muted-strong)]"
                      htmlFor={`referenceQty:${reference.id}`}
                    >
                      Cantidad a presupuestar
                    </label>
                    <Input
                      defaultValue="0"
                      id={`referenceQty:${reference.id}`}
                      min="0"
                      name={`referenceQty:${reference.id}`}
                      type="number"
                    />
                  </div>
                </div>
              ))}

              <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--surface)] p-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
                    Agregar manualmente
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-[color:var(--foreground)]">
                    {BUDGET_ITEM_TYPE_LABELS[type]} fuera del catalogo
                  </h3>
                  <p className="mt-1 text-sm text-[color:var(--muted)]">
                    Usa esta opcion si aun no hay datos cargados en el catalogo o necesitas
                    presupuestar un item puntual.
                  </p>
                </div>

                <div className="mt-4 space-y-4">
                  {manualSlots.map((slot) => (
                    <div
                      className="grid gap-3 rounded-2xl border border-[color:var(--border)] bg-white p-4 lg:grid-cols-[2fr_140px_140px]"
                      key={`${type}-${slot}`}
                    >
                      <div className="space-y-2 lg:col-span-3">
                        <label
                          className="text-sm font-medium text-[color:var(--muted-strong)]"
                          htmlFor={`manualDescription:${type}:${slot}`}
                        >
                          Descripcion manual
                        </label>
                        <Input
                          id={`manualDescription:${type}:${slot}`}
                          name={`manualDescription:${type}:${slot}`}
                          placeholder={
                            type === BudgetItemType.PART
                              ? "Ej. Pastillas Brembo delanteras"
                              : "Ej. Mano de obra cambio discos y rectificado"
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium text-[color:var(--muted-strong)]"
                          htmlFor={`manualQuantity:${type}:${slot}`}
                        >
                          Cantidad
                        </label>
                        <Input
                          defaultValue="0"
                          id={`manualQuantity:${type}:${slot}`}
                          min="0"
                          name={`manualQuantity:${type}:${slot}`}
                          type="number"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium text-[color:var(--muted-strong)]"
                          htmlFor={`manualPrice:${type}:${slot}`}
                        >
                          Valor unitario
                        </label>
                        <Input
                          defaultValue="0"
                          id={`manualPrice:${type}:${slot}`}
                          min="0"
                          name={`manualPrice:${type}:${slot}`}
                          type="number"
                        />
                      </div>

                      <div className="space-y-2 lg:col-span-3">
                        <label
                          className="text-sm font-medium text-[color:var(--muted-strong)]"
                          htmlFor={`manualNote:${type}:${slot}`}
                        >
                          Nota opcional
                        </label>
                        <Input
                          id={`manualNote:${type}:${slot}`}
                          name={`manualNote:${type}:${slot}`}
                          placeholder="Ej. Valor conversado con proveedor o servicio referencial del taller"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}

      <FormMessage message={state.error} />
      <SubmitButton label="Crear presupuesto borrador" pendingLabel="Creando presupuesto..." />
    </form>
  );
}
