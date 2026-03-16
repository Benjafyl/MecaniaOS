import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { listClients } from "@/modules/clients/client.service";
import { VehicleForm } from "@/app/(protected)/vehicles/vehicle-form";

type NewVehiclePageProps = {
  searchParams: Promise<{
    clientId?: string;
  }>;
};

export default async function NewVehiclePage({ searchParams }: NewVehiclePageProps) {
  const { clientId } = await searchParams;
  const clients = await listClients();

  return (
    <div className="space-y-6">
      <Card className="rounded-[32px]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
              Alta rapida
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold">Registrar vehiculo</h1>
          </div>

          <Link href="/vehicles">
            <Button variant="secondary">Volver al listado</Button>
          </Link>
        </div>
      </Card>

      <Card className="rounded-[32px]">
        <VehicleForm
          clients={clients.map((client) => ({
            id: client.id,
            fullName: client.fullName,
          }))}
          defaultClientId={clientId}
        />
      </Card>
    </div>
  );
}
