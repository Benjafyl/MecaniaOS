import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { listVehicles } from "@/modules/vehicles/vehicle.service";

type VehiclesPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function VehiclesPage({ searchParams }: VehiclesPageProps) {
  const { q } = await searchParams;
  const vehicles = await listVehicles(q);

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
              Registro vehicular
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold">Vehiculos del taller</h1>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <form className="flex gap-3" method="get">
              <Input defaultValue={q} name="q" placeholder="Buscar por VIN, patente o cliente" />
              <Button type="submit" variant="secondary">
                Buscar
              </Button>
            </form>
            <Link href="/vehicles/new">
              <Button>Nuevo vehiculo</Button>
            </Link>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {vehicles.map((vehicle) => (
          <Card className="rounded-xl" key={vehicle.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-heading text-2xl font-semibold">
                  {vehicle.make} {vehicle.model}
                </h2>
                <p className="mt-2 text-sm text-[color:var(--muted-strong)]">
                  {vehicle.client.fullName} / {vehicle.plate ?? "Sin patente"}
                </p>
                <p className="mt-1 text-sm text-[color:var(--muted)]">
                  VIN {vehicle.vin} / Registrado {formatDate(vehicle.createdAt)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-md bg-[color:var(--surface-strong)] px-4 py-2 text-sm">
                  {vehicle._count.workOrders} ordenes
                </div>
                <Link className="text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8]" href={`/vehicles/${vehicle.id}`}>
                  Ver ficha
                </Link>
              </div>
            </div>
          </Card>
        ))}

        {vehicles.length === 0 ? (
          <Card className="rounded-xl text-center">
            <p className="text-[color:var(--muted-strong)]">
              No hay vehiculos para mostrar con este filtro.
            </p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

