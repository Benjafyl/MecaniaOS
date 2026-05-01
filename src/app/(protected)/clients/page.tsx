import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoveToTrashButton, SectionTrashLink } from "@/components/trash/trash-ui";
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
      <Card className="rounded-2xl">
        <div className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
              Gestion de clientes
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold">Clientes del taller</h1>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <form className="flex flex-col gap-3 md:flex-row lg:min-w-[520px]" method="get">
              <Input
                defaultValue={q}
                name="q"
                placeholder="Buscar por nombre, correo o telefono"
              />
              <Button type="submit" variant="secondary">
                Buscar
              </Button>
            </form>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/clients/new">
                <Button>Nuevo cliente</Button>
              </Link>
              <SectionTrashLink href="/clients/trash" />
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {clients.map((client) => (
          <Card className="rounded-xl" key={client.id}>
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

              <div className="flex items-start gap-5 lg:items-center">
                <MoveToTrashButton entityId={client.id} entityType="client" redirectTo="/clients" />
                <div className="flex flex-wrap items-center gap-3">
                  <div className="rounded-md bg-[color:var(--surface-strong)] px-4 py-2 text-sm">
                    {client._count.vehicles} vehiculos
                  </div>
                  <div className="rounded-md bg-[color:var(--surface-strong)] px-4 py-2 text-sm">
                    {client._count.workOrders} ordenes
                  </div>
                  <Link
                    className="text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8]"
                    href={`/clients/${client.id}`}
                  >
                    Ver detalle
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {clients.length === 0 ? (
          <Card className="rounded-xl text-center">
            <p className="text-[color:var(--muted-strong)]">
              No hay clientes que coincidan con la busqueda.
            </p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

