import Link from "next/link";

import { InviteForm } from "@/app/(protected)/self-inspections/invite-form";
import { SelfInspectionRiskBadge } from "@/components/self-inspections/self-inspection-risk-badge";
import { SelfInspectionStatusBadge } from "@/components/self-inspections/self-inspection-status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import {
  SELF_INSPECTION_RISK_OPTIONS,
  SELF_INSPECTION_STATUS_OPTIONS,
} from "@/modules/self-inspections/self-inspection.constants";
import { listSelfInspections } from "@/modules/self-inspections/self-inspection.service";

type SelfInspectionsPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
    risk?: string;
  }>;
};

export default async function SelfInspectionsPage({ searchParams }: SelfInspectionsPageProps) {
  const { q, status, risk } = await searchParams;
  const inspections = await listSelfInspections({
    q,
    status,
    risk,
  });

  return (
    <div className="space-y-6">
      <Card className="rounded-[32px]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
              Portal de recepcion
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold">
              Autoinspecciones del vehiculo
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-[color:var(--muted-strong)]">
              Flujo previo al ingreso al taller para levantar sintomas, danos visibles,
              kilometraje y evidencia fotografica antes del diagnostico.
            </p>
          </div>

          <form className="flex flex-col gap-3 md:flex-row" method="get">
            <Input defaultValue={q} name="q" placeholder="Buscar por cliente, patente o VIN" />
            <Select defaultValue={status ?? ""} name="status">
              <option value="">Todos los estados</option>
              {SELF_INSPECTION_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select defaultValue={risk ?? ""} name="risk">
              <option value="">Todos los riesgos</option>
              {SELF_INSPECTION_RISK_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Button type="submit" variant="secondary">
              Filtrar
            </Button>
          </form>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-[32px]">
          <h2 className="font-heading text-2xl font-semibold">Generar enlace seguro</h2>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Crea una autoinspeccion en borrador sin depender de seleccionar clientes o vehiculos
            existentes.
          </p>

          <div className="mt-5">
            <InviteForm />
          </div>
        </Card>

        <div className="space-y-4">
          {inspections.map((inspection) => (
            <Card className="rounded-[28px]" key={inspection.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-heading text-2xl font-semibold">
                      {inspection.vehicleSnapshot?.make ?? inspection.vehicle?.make ?? "Vehiculo"}{" "}
                      {inspection.vehicleSnapshot?.model ?? inspection.vehicle?.model ?? ""}
                    </h2>
                    <SelfInspectionStatusBadge status={inspection.status} />
                    <SelfInspectionRiskBadge level={inspection.overallRiskLevel} />
                  </div>
                  <p className="mt-2 text-sm text-[color:var(--muted-strong)]">
                    {inspection.customer.fullName} /{" "}
                    {inspection.vehicleSnapshot?.plate ?? inspection.vehicle?.plate ?? "Sin patente"}
                  </p>
                  <p className="mt-1 text-sm text-[color:var(--muted)]">
                    {inspection.mainComplaint ?? "Sin motivo principal definido"}
                  </p>
                  <p className="mt-2 text-xs text-[color:var(--muted)]">
                    Inicio {formatDate(inspection.startedAt)} / {inspection._count.photos} fotos /{" "}
                    {inspection._count.answers} respuestas
                  </p>
                </div>

                <div className="flex flex-col items-start gap-3 md:items-end">
                  {inspection.criticalFindings.length > 0 ? (
                    <p className="max-w-sm text-right text-xs text-[color:var(--accent-strong)]">
                      Alertas:{" "}
                      {inspection.criticalFindings
                        .slice(0, 3)
                        .map((finding) => finding.label)
                        .join(", ")}
                    </p>
                  ) : null}
                  <Link href={`/self-inspections/${inspection.id}`}>
                    <Button>Abrir inspeccion</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}

          {inspections.length === 0 ? (
            <Card className="rounded-[28px] text-center">
              <p className="text-[color:var(--muted-strong)]">
                No hay autoinspecciones con esos filtros.
              </p>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
