import { Card } from "@/components/ui/card";
import {
  TrashActionRow,
  TrashEmptyState,
  TrashMeta,
  TrashPageHeader,
} from "@/components/trash/trash-ui";
import { listTrashItems, TRASH_RETENTION_DAYS } from "@/modules/trash/trash.service";

export default async function ClientsTrashPage() {
  const { clients } = await listTrashItems();

  return (
    <div className="space-y-6">
      <TrashPageHeader
        backHref="/clients"
        backLabel="Volver a clientes"
        count={clients.length}
        description={`Aqui solo ves clientes enviados a papelera. Puedes recuperarlos antes de ${TRASH_RETENTION_DAYS} dias o eliminarlos definitivamente.`}
        eyebrow="Clientes eliminados"
        title="Papelera de clientes"
      />

      <div className="space-y-4">
        {clients.map((client) => (
          <Card className="rounded-xl" key={client.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <div>
                  <h2 className="font-heading text-2xl font-semibold">{client.fullName}</h2>
                  <p className="mt-1 text-sm text-[color:var(--muted-strong)]">{client.email}</p>
                </div>
                <p className="text-sm text-[color:var(--muted-strong)]">
                  {client._count.vehicles} vehiculos / {client._count.workOrders} ordenes /{" "}
                  {client._count.budgets} presupuestos asociados
                </p>
                <TrashMeta daysRemaining={client.daysRemaining} deletedAt={client.deletedAt} />
              </div>
              <TrashActionRow entityId={client.id} entityType="client" redirectTo="/clients/trash" />
            </div>
          </Card>
        ))}

        {clients.length === 0 ? (
          <TrashEmptyState label="No hay clientes en papelera por ahora." />
        ) : null}
      </div>
    </div>
  );
}
