import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MoveToTrashButton, SectionTrashLink } from "@/components/trash/trash-ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import { BudgetStatusBadge } from "@/modules/budgets/budget-status-badge";
import { listBudgets } from "@/modules/budgets/budget.service";

type BudgetsPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function BudgetsPage({ searchParams }: BudgetsPageProps) {
  const { q } = await searchParams;
  const { budgets, summary } = await listBudgets(q);

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl">
        <div className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
              Presupuestos y aprobaciones
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold">Presupuestos del taller</h1>
            <p className="mt-2 max-w-3xl text-sm text-[color:var(--muted-strong)]">
              Vista rapida de borradores, aprobaciones y montos del flujo comercial del taller.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <form className="flex flex-col gap-3 md:flex-row lg:min-w-[520px]" method="get">
              <Input
                defaultValue={q}
                name="q"
                placeholder="Buscar por numero, cliente o vehiculo"
              />
              <Button type="submit" variant="secondary">
                Buscar
              </Button>
            </form>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/budgets/new">
                <Button>Nuevo presupuesto</Button>
              </Link>
              <SectionTrashLink href="/budgets/trash" />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryStat label="Total" tone="default" value={summary.total} />
        <SummaryStat label="Borradores" tone="info" value={summary.drafts} />
        <SummaryStat label="Enviados" tone="primary" value={summary.sent} />
        <SummaryStat label="Aprobados" tone="success" value={summary.approved} />
      </div>

      <div className="space-y-3">
        {budgets.map((budget) => (
          <Card className="rounded-xl px-5 py-4" key={budget.id}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="truncate font-heading text-xl font-semibold">{budget.title}</h2>
                    <span className="text-sm text-[color:var(--muted)]">{budget.budgetNumber}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm text-[color:var(--muted-strong)]">{budget.client.fullName}</p>
                    <BudgetStatusBadge status={budget.status} />
                  </div>
                  <p className="text-sm text-[color:var(--muted)]">
                    {budget.vehicle.make} {budget.vehicle.model} / {budget.vehicle.plate ?? budget.vehicle.vin} /
                    {" "}Creado {formatDate(budget.createdAt)}
                  </p>
                </div>

                <div className="grid gap-2 sm:grid-cols-4">
                  <MiniBudgetStat
                    label="Repuestos"
                    tone="danger"
                    value={formatCurrency(budget.subtotalParts)}
                  />
                  <MiniBudgetStat
                    label="Mano de obra"
                    tone="primary"
                    value={formatCurrency(budget.subtotalLabor)}
                  />
                  <MiniBudgetStat
                    label="Items"
                    tone="default"
                    value={String(budget.items.length)}
                  />
                  <MiniBudgetStat
                    label="Total"
                    tone="default"
                    value={formatCurrency(budget.totalAmount)}
                  />
                </div>
              </div>

              <div className="flex items-start justify-end gap-5">
                <MoveToTrashButton entityId={budget.id} entityType="budget" redirectTo="/budgets" />
                <div className="flex flex-wrap justify-end gap-3">
                  <Link
                    className="text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8]"
                    href={`/budgets/${budget.id}`}
                  >
                    Ver detalle
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {budgets.length === 0 ? (
          <Card className="rounded-xl text-center">
            <p className="text-[color:var(--muted-strong)]">
              No hay presupuestos para mostrar con este filtro.
            </p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

function SummaryStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "default" | "info" | "primary" | "success";
}) {
  const toneClass =
    tone === "info"
      ? "text-[#1d4ed8]"
      : tone === "primary"
        ? "text-[#1e3a8a]"
        : tone === "success"
          ? "text-[#0f766e]"
          : "text-[color:var(--foreground)]";

  return (
    <Card className="rounded-xl px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--muted)]">{label}</p>
      <p className={`mt-2 font-heading text-3xl font-semibold ${toneClass}`}>{value}</p>
    </Card>
  );
}

function MiniBudgetStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "default" | "danger" | "primary";
}) {
  const classes =
    tone === "danger"
      ? "border-[rgba(185,28,28,0.12)] bg-[rgba(185,28,28,0.05)]"
      : tone === "primary"
        ? "border-[rgba(37,99,235,0.12)] bg-[rgba(37,99,235,0.05)]"
        : "border-[color:var(--border)] bg-white/75";

  return (
    <div className={`rounded-lg border px-3 py-2 ${classes}`}>
      <p className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--muted)]">{label}</p>
      <p className="mt-1 font-heading text-base font-semibold text-[color:var(--foreground)]">
        {value}
      </p>
    </div>
  );
}
