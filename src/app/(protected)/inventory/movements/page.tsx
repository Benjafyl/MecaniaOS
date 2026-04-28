import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import { STOCK_MOVEMENT_TYPE_LABELS } from "@/modules/inventory/inventory.constants";
import { listRecentStockMovements } from "@/modules/inventory/inventory.service";

function formatSignedQuantity(quantity: number) {
  return quantity > 0 ? `+${quantity}` : String(quantity);
}

export default async function InventoryMovementsPage() {
  const movements = await listRecentStockMovements(50);

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
              Trazabilidad de inventario
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold">Movimientos recientes</h1>
          </div>

          <Link href="/inventory">
            <Button variant="secondary">Volver a inventario</Button>
          </Link>
        </div>
      </Card>

      <div className="space-y-4">
        {movements.map((movement) => (
          <Card className="rounded-xl" key={movement.id}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-heading text-xl font-semibold">{movement.repuesto.name}</h2>
                  <span className="rounded-full border border-[color:var(--border)] px-3 py-1 text-xs font-semibold">
                    {formatSignedQuantity(movement.quantity)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[color:var(--muted-strong)]">
                  {STOCK_MOVEMENT_TYPE_LABELS[movement.type]} / {movement.previousStock} a{" "}
                  {movement.newStock}
                </p>
                <p className="mt-1 text-sm text-[color:var(--muted)]">
                  {movement.reason ?? "Sin observacion"}
                </p>
              </div>

              <div className="text-sm text-[color:var(--muted)] lg:text-right">
                <p>{movement.createdBy?.name ?? "Sistema"}</p>
                <p className="mt-1">{formatDateTime(movement.createdAt)}</p>
              </div>
            </div>
          </Card>
        ))}

        {movements.length === 0 ? (
          <Card className="rounded-xl text-center">
            <p className="text-[color:var(--muted-strong)]">
              Aun no hay movimientos de inventario.
            </p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
