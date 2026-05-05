import Link from "next/link";

import { BudgetStatusBadge } from "@/modules/budgets/budget-status-badge";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { listInternalInsuranceCases } from "@/modules/insurance-cases/insurance-case.service";

export default async function InsuranceCasesPage() {
  const insuranceCases = await listInternalInsuranceCases();

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl">
        <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
          Portal de aseguradoras
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold">Solicitudes de evaluacion</h1>
        <p className="mt-2 max-w-3xl text-sm text-[color:var(--muted-strong)]">
          Aqui el taller ve los casos creados por liquidadores, sus fotos iniciales y el estado
          conectado del presupuesto y la orden de trabajo.
        </p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {insuranceCases.map((insuranceCase) => (
          <Card className="rounded-2xl" key={insuranceCase.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
                  {insuranceCase.caseNumber}
                </p>
                <h2 className="mt-2 font-heading text-2xl font-semibold">
                  {insuranceCase.vehicle.make} {insuranceCase.vehicle.model}
                </h2>
                <p className="mt-2 text-sm text-[color:var(--muted-strong)]">
                  {insuranceCase.client.fullName} / Liquidador {insuranceCase.liquidator.name}
                </p>
              </div>
              <span className="rounded-full border border-[rgba(37,99,235,0.16)] bg-[rgba(37,99,235,0.08)] px-3 py-1 text-xs font-semibold text-[#1d4ed8]">
                {insuranceCase.stageLabel}
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-[color:var(--border)] bg-white/75 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--muted)]">
                  Choque
                </p>
                <p className="mt-2 font-semibold">{formatDate(insuranceCase.incidentDate)}</p>
              </div>
              <div className="rounded-xl border border-[color:var(--border)] bg-white/75 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--muted)]">
                  Presupuesto
                </p>
                <div className="mt-2">
                  {insuranceCase.latestBudget ? (
                    <BudgetStatusBadge status={insuranceCase.latestBudget.status} />
                  ) : (
                    <span className="text-sm text-[color:var(--muted)]">Pendiente</span>
                  )}
                </div>
              </div>
              <div className="rounded-xl border border-[color:var(--border)] bg-white/75 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--muted)]">
                  OT
                </p>
                <div className="mt-2">
                  {insuranceCase.currentWorkOrder ? (
                    <StatusBadge status={insuranceCase.currentWorkOrder.status} />
                  ) : (
                    <span className="text-sm text-[color:var(--muted)]">Aun no creada</span>
                  )}
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm text-[color:var(--muted)]">
              {insuranceCase.latestBudget
                ? `Monto actual: ${formatCurrency(insuranceCase.latestBudget.totalAmount)}`
                : "Todavia no existe un presupuesto conectado a este caso."}
            </p>

            <div className="mt-6 flex justify-end">
              <Link
                className="text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8]"
                href={`/insurance-cases/${insuranceCase.id}`}
              >
                Ver solicitud completa
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
