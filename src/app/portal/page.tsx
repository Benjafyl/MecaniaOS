import Link from "next/link";

import { WorkOrderProgress } from "@/components/customer-portal/work-order-progress";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import { getCustomerPortalOverview } from "@/modules/customer-portal/customer-portal.service";

export default async function CustomerPortalPage() {
  const portal = await getCustomerPortalOverview();

  if (!portal.customer) {
    return (
      <Card className="rounded-2xl">
        <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
          Portal cliente
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold">Tu acceso aun no esta habilitado</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--muted-strong)]">
          Tu cuenta existe, pero todavia no tiene una ficha de cliente vinculada con vehiculos
          visibles. Si llegaste desde una autoinspeccion, entra primero por tu link seguro. Si no,
          pide al taller que habilite tu acceso.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl">
        <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
          Portal cliente
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold">
          Hola, {portal.customer.fullName}
        </h1>
        <p className="mt-3 text-sm text-[color:var(--muted-strong)]">
          Aqui puedes revisar solo tus vehiculos, su estado actual y el avance de cada orden.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-[color:var(--border)] bg-white/75 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
              Vehiculos
            </p>
            <p className="mt-2 font-heading text-3xl font-semibold">{portal.stats.vehicles}</p>
          </div>
          <div className="rounded-xl border border-[color:var(--border)] bg-white/75 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
              Ordenes activas
            </p>
            <p className="mt-2 font-heading text-3xl font-semibold">{portal.stats.openOrders}</p>
          </div>
          <div className="rounded-xl border border-[color:var(--border)] bg-white/75 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
              Listos para retiro
            </p>
            <p className="mt-2 font-heading text-3xl font-semibold">{portal.stats.readyForDelivery}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {portal.vehicles.map((vehicle) => (
          <Card className="rounded-2xl" key={vehicle.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
                  Vehiculo
                </p>
                <h2 className="mt-2 font-heading text-2xl font-semibold">
                  {vehicle.make} {vehicle.model}
                </h2>
                <p className="mt-2 text-sm text-[color:var(--muted-strong)]">
                  {vehicle.plate ?? "Sin patente"} / VIN {vehicle.vin}
                </p>
              </div>
              {vehicle.currentOrder ? <StatusBadge status={vehicle.currentOrder.status} /> : null}
            </div>

            {vehicle.currentOrder ? (
              <div className="mt-5 space-y-4">
                <WorkOrderProgress status={vehicle.currentOrder.status} />
                <div className="text-sm text-[color:var(--muted-strong)]">
                  <p>
                    <span className="font-semibold text-[color:var(--foreground)]">Orden:</span>{" "}
                    {vehicle.currentOrder.orderNumber}
                  </p>
                  <p className="mt-1">
                    <span className="font-semibold text-[color:var(--foreground)]">Motivo:</span>{" "}
                    {vehicle.currentOrder.reason}
                  </p>
                  <p className="mt-1">
                    <span className="font-semibold text-[color:var(--foreground)]">Ingreso:</span>{" "}
                    {formatDate(vehicle.currentOrder.intakeDate)}
                  </p>
                  <p className="mt-1">
                    <span className="font-semibold text-[color:var(--foreground)]">Entrega estimada:</span>{" "}
                    {formatDate(vehicle.currentOrder.estimatedDate)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-5 text-sm text-[color:var(--muted)]">
                Este vehiculo aun no tiene ordenes de trabajo registradas.
              </p>
            )}

            <div className="mt-6 flex justify-end">
              <Link
                className="text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8]"
                href={`/portal/vehicles/${vehicle.id}`}
              >
                Ver detalle
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {portal.vehicles.length === 0 ? (
        <Card className="rounded-2xl text-center">
          <p className="text-[color:var(--muted-strong)]">
            Aun no tienes vehiculos asociados en el portal.
          </p>
        </Card>
      ) : null}
    </div>
  );
}
