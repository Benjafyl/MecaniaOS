import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
              Presupuestos y aprobaciones
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold">Presupuestos del taller</h1>
            <p className="mt-2 max-w-3xl text-sm text-[color:var(--muted-strong)]">
              Construye borradores con valores reales de repuestos y mano de obra, dejando claro
              cuanto corresponde a cada componente del presupuesto.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <form className="flex gap-3" method="get">
              <Input defaultValue={q} name="q" placeholder="Buscar por numero, cliente o vehiculo" />
              <Button type="submit" variant="secondary">
                Buscar
              </Button>
            </form>
            <Link href="/budgets/new">
              <Button>Nuevo presupuesto</Button>
            </Link>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-2xl">
          <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
            Total registrados
          </p>
          <p className="mt-4 text-4xl font-semibold">{summary.total}</p>
        </Card>
        <Card className="rounded-2xl">
          <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
            Borradores
          </p>
          <p className="mt-4 text-4xl font-semibold text-[#1d4ed8]">{summary.drafts}</p>
        </Card>
        <Card className="rounded-2xl">
          <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
            Enviados
          </p>
          <p className="mt-4 text-4xl font-semibold text-[#1e3a8a]">{summary.sent}</p>
        </Card>
        <Card className="rounded-2xl">
          <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
            Aprobados
          </p>
          <p className="mt-4 text-4xl font-semibold text-[#0f766e]">{summary.approved}</p>
        </Card>
      </div>

      <div className="space-y-4">
        {budgets.map((budget) => (
          <Card className="rounded-2xl" key={budget.id}>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-heading text-2xl font-semibold">{budget.title}</h2>
                  <BudgetStatusBadge status={budget.status} />
                </div>
                <p className="text-sm text-[color:var(--muted-strong)]">
                  {budget.budgetNumber} / {budget.client.fullName}
                </p>
                <p className="text-sm text-[color:var(--muted)]">
                  {budget.vehicle.make} {budget.vehicle.model} /{" "}
                  {budget.vehicle.plate ?? budget.vehicle.vin} / Creado {formatDate(budget.createdAt)}
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-3 xl:min-w-[440px]">
                <div className="rounded-xl border border-[rgba(185,28,28,0.12)] bg-[rgba(185,28,28,0.05)] px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#991b1b]">Repuestos</p>
                  <p className="mt-2 text-lg font-semibold">{formatCurrency(budget.subtotalParts)}</p>
                </div>
                <div className="rounded-xl border border-[rgba(37,99,235,0.12)] bg-[rgba(37,99,235,0.05)] px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#1d4ed8]">Mano de obra</p>
                  <p className="mt-2 text-lg font-semibold">{formatCurrency(budget.subtotalLabor)}</p>
                </div>
                <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">Total</p>
                  <p className="mt-2 text-lg font-semibold">{formatCurrency(budget.totalAmount)}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Link className="text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8]" href={`/budgets/${budget.id}`}>
                Ver y editar borrador
              </Link>
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
