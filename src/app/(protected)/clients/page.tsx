import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { listClients } from "@/modules/clients/client.service";

type ClientsPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const { q } = await searchParams;
  const clients = await listClients(q);

  return (
    <div className="space-y-6">
      <Card className="rounded-[32px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
              Gestion de clientes
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold">Clientes del taller</h1>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <form className="flex gap-3" method="get">
              <Input defaultValue={q} name="q" placeholder="Buscar por nombre, correo o telefono" />
              <Button type="submit" variant="secondary">
                Buscar
              </Button>
            </form>
            <Link href="/clients/new">
              <Button>Nuevo cliente</Button>
            </Link>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {clients.map((client) => (
          <Card className="rounded-[28px]" key={client.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-heading text-2xl font-semibold">{client.fullName}</h2>
                <p className="mt-2 text-sm text-[color:var(--muted-strong)]">
                  {client.phone} / {client.email}
                </p>
                <p className="mt-1 text-sm text-[color:var(--muted)]">
                  Creado el {formatDate(client.createdAt)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-full bg-[color:var(--surface-strong)] px-4 py-2 text-sm">
                  {client._count.vehicles} vehiculos
                </div>
                <div className="rounded-full bg-[color:var(--surface-strong)] px-4 py-2 text-sm">
                  {client._count.workOrders} ordenes
                </div>
                <Link className="text-sm font-semibold text-[color:var(--accent)]" href={`/clients/${client.id}`}>
                  Ver detalle
                </Link>
              </div>
            </div>
          </Card>
        ))}

        {clients.length === 0 ? (
          <Card className="rounded-[28px] text-center">
            <p className="text-[color:var(--muted-strong)]">
              No hay clientes que coincidan con la busqueda.
            </p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
