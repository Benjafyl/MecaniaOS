import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { listClients } from "@/modules/clients/client.service";
import { listVehicles } from "@/modules/vehicles/vehicle.service";
import { WorkOrderForm } from "@/app/(protected)/work-orders/work-order-form";

type NewWorkOrderPageProps = {
  searchParams: Promise<{
    clientId?: string;
    vehicleId?: string;
  }>;
};

export default async function NewWorkOrderPage({ searchParams }: NewWorkOrderPageProps) {
  const { clientId, vehicleId } = await searchParams;
  const [clients, vehicles] = await Promise.all([listClients(), listVehicles()]);

  return (
    <div className="space-y-6">
      <Card className="rounded-[32px]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
              Flujo operativo
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold">Nueva orden de trabajo</h1>
          </div>

          <Link href="/work-orders">
            <Button variant="secondary">Volver al listado</Button>
          </Link>
        </div>
      </Card>

      <Card className="rounded-[32px]">
        <WorkOrderForm
          clients={clients.map((client) => ({
            id: client.id,
            fullName: client.fullName,
          }))}
          defaultClientId={clientId}
          defaultVehicleId={vehicleId}
          vehicles={vehicles.map((vehicle) => ({
            id: vehicle.id,
            label: `${vehicle.client.fullName} / ${vehicle.make} ${vehicle.model} / ${vehicle.vin}`,
          }))}
        />
      </Card>
    </div>
  );
}
