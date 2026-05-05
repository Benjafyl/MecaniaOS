import { Card } from "@/components/ui/card";
import {
  TrashActionRow,
  TrashEmptyState,
  TrashMeta,
  TrashPageHeader,
} from "@/components/trash/trash-ui";
import { BUDGET_STATUS_LABELS } from "@/modules/budgets/budget.constants";
import { listTrashItems, TRASH_RETENTION_DAYS } from "@/modules/trash/trash.service";

export default async function BudgetsTrashPage() {
  const { budgets } = await listTrashItems();

  return (
    <div className="space-y-6">
      <TrashPageHeader
        backHref="/budgets"
        backLabel="Volver a presupuestos"
        count={budgets.length}
        description={`Aqui solo ves presupuestos enviados a papelera. Puedes recuperarlos antes de ${TRASH_RETENTION_DAYS} dias o eliminarlos definitivamente.`}
        eyebrow="Presupuestos eliminados"
        title="Papelera de presupuestos"
      />

      <div className="space-y-4">
        {budgets.map((budget) => (
          <Card className="rounded-xl" key={budget.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <div>
                  <h2 className="font-heading text-2xl font-semibold">{budget.title}</h2>
                  <p className="mt-1 text-sm text-[color:var(--muted-strong)]">
                    {budget.budgetNumber} / {budget.client.fullName}
                  </p>
                </div>
                <p className="text-sm text-[color:var(--muted-strong)]">
                  {BUDGET_STATUS_LABELS[budget.status]} / {budget.vehicle.make}{" "}
                  {budget.vehicle.model} / {budget.vehicle.plate ?? "Sin patente"}
                </p>
                <TrashMeta daysRemaining={budget.daysRemaining} deletedAt={budget.deletedAt} />
              </div>
              <TrashActionRow entityId={budget.id} entityType="budget" redirectTo="/budgets/trash" />
            </div>
          </Card>
        ))}

        {budgets.length === 0 ? (
          <TrashEmptyState label="No hay presupuestos en papelera por ahora." />
        ) : null}
      </div>
    </div>
  );
}
