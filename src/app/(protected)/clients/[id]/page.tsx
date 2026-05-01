import Link from "next/link";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoveToTrashButton } from "@/components/trash/trash-ui";
import { StatusBadge } from "@/components/ui/status-badge";
import { normalizeError } from "@/lib/errors";
import { formatDate } from "@/lib/utils";
import { getClientById } from "@/modules/clients/client.service";

type ClientDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { id } = await params;
  const client = await getClientById(id).catch((error) => {
    if (normalizeError(error).statusCode === 404) {
      notFound();
    }

    throw error;
  });

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
              Ficha de cliente
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold">{client.fullName}</h1>
            <p className="mt-3 text-sm text-[color:var(--muted-strong)]">
              {client.phone} / {client.email}
            </p>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              Ingreso al sistema {formatDate(client.createdAt)}
            </p>
          </div>

          <div className="flex items-start gap-5 lg:items-center">
            <MoveToTrashButton entityId={client.id} entityType="client" redirectTo="/clients/trash" />
            <div className="flex flex-wrap gap-3">
              <Link href={`/vehicles/new?clientId=${client.id}`}>
                <Button>Agregar vehiculo</Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-2xl">
          <h2 className="font-heading text-2xl font-semibold">Vehiculos asociados</h2>

          <div className="mt-5 space-y-3">
            {client.vehicles.map((vehicle) => (
              <Link
                className="block rounded-lg border border-[color:var(--border)] bg-white/70 p-4 transition hover:border-[color:var(--border-strong)]"
                href={`/vehicles/${vehicle.id}`}
                key={vehicle.id}
              >
                <p className="font-semibold">
                  {vehicle.make} {vehicle.model}
                </p>
                <p className="mt-1 text-sm text-[color:var(--muted-strong)]">
                  {vehicle.plate ?? "Sin patente"} / VIN {vehicle.vin}
                </p>
              </Link>
            ))}

            {client.vehicles.length === 0 ? (
              <p className="text-sm text-[color:var(--muted)]">Este cliente aun no tiene vehiculos.</p>
            ) : null}
          </div>
        </Card>

        <Card className="rounded-2xl">
          <h2 className="font-heading text-2xl font-semibold">Ordenes registradas</h2>

          <div className="mt-5 space-y-3">
            {client.workOrders.map((order) => (
              <Link
                className="block rounded-lg border border-[color:var(--border)] bg-white/70 p-4 transition hover:border-[color:var(--border-strong)]"
                href={`/work-orders/${order.id}`}
                key={order.id}
              >
                <div className="flex items-center gap-3">
                  <p className="font-semibold">{order.orderNumber}</p>
                  <StatusBadge status={order.status} />
                </div>
                <p className="mt-2 text-sm text-[color:var(--muted-strong)]">
                  {order.vehicle.make} {order.vehicle.model} / {order.reason}
                </p>
                <p className="mt-1 text-sm text-[color:var(--muted)]">
                  Ingreso {formatDate(order.intakeDate)}
                </p>
              </Link>
            ))}

            {client.workOrders.length === 0 ? (
              <p className="text-sm text-[color:var(--muted)]">Sin ordenes de trabajo todavia.</p>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
