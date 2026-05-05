import { Card } from "@/components/ui/card";
import {
  TrashActionRow,
  TrashEmptyState,
  TrashMeta,
  TrashPageHeader,
} from "@/components/trash/trash-ui";
import { listTrashItems, TRASH_RETENTION_DAYS } from "@/modules/trash/trash.service";

export default async function InventoryTrashPage() {
  const { repuestos } = await listTrashItems();

  return (
    <div className="space-y-6">
      <TrashPageHeader
        backHref="/inventory"
        backLabel="Volver a inventario"
        count={repuestos.length}
        description={`Aqui solo ves repuestos enviados a papelera. Puedes recuperarlos antes de ${TRASH_RETENTION_DAYS} dias o eliminarlos definitivamente.`}
        eyebrow="Repuestos eliminados"
        title="Papelera de inventario"
      />

      <div className="space-y-4">
        {repuestos.map((repuesto) => (
          <Card className="rounded-xl" key={repuesto.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <div>
                  <h2 className="font-heading text-2xl font-semibold">{repuesto.name}</h2>
                  <p className="mt-1 text-sm text-[color:var(--muted-strong)]">
                    Codigo {repuesto.code}
                  </p>
                </div>
                <p className="text-sm text-[color:var(--muted-strong)]">
                  Stock al momento de borrar: {repuesto.currentStock}
                </p>
                <TrashMeta daysRemaining={repuesto.daysRemaining} deletedAt={repuesto.deletedAt} />
              </div>
              <TrashActionRow
                entityId={repuesto.id}
                entityType="repuesto"
                redirectTo="/inventory/trash"
              />
            </div>
          </Card>
        ))}

        {repuestos.length === 0 ? (
          <TrashEmptyState label="No hay repuestos en papelera por ahora." />
        ) : null}
      </div>
    </div>
  );
}
