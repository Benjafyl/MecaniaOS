import { UserRole } from "@prisma/client";

import { RepuestoForm } from "@/app/(protected)/inventory/repuesto-form";
import { StockAdjustmentForm } from "@/app/(protected)/inventory/stock-adjustment-form";
import { StockEntryForm } from "@/app/(protected)/inventory/stock-entry-form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import { getCurrentSession } from "@/modules/auth/auth.service";
import { STOCK_MOVEMENT_TYPE_LABELS } from "@/modules/inventory/inventory.constants";
import {
  listInventory,
  listInventoryOptions,
  listRecentStockMovements,
} from "@/modules/inventory/inventory.service";

type InventoryPageProps = {
  searchParams: Promise<{
    q?: string;
    lowStock?: string;
  }>;
};

function formatSignedQuantity(quantity: number) {
  return quantity > 0 ? `+${quantity}` : String(quantity);
}

export default async function InventoryPage({ searchParams }: InventoryPageProps) {
  const { q, lowStock } = await searchParams;
  const session = await getCurrentSession();
  const isAdmin = session?.user.role === UserRole.ADMIN;
  const [repuestos, options, movements] = await Promise.all([
    listInventory({
      search: q,
      lowStock: lowStock === "1",
    }),
    listInventoryOptions(),
    listRecentStockMovements(20),
  ]);

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
              Repuestos y stock
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold">Inventario</h1>
            <p className="mt-2 text-sm text-[color:var(--muted-strong)]">
              Catalogo, stock disponible, alertas de minimo y movimientos trazables.
            </p>
          </div>

          <form className="flex flex-col gap-3 md:flex-row" method="get">
            <Input defaultValue={q} name="q" placeholder="Buscar por nombre o codigo" />
            <Select defaultValue={lowStock ?? ""} name="lowStock">
              <option value="">Todo el inventario</option>
              <option value="1">Solo stock bajo</option>
            </Select>
            <Button type="submit" variant="secondary">
              Filtrar
            </Button>
          </form>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-4">
          {repuestos.map((repuesto) => (
            <Card className="rounded-xl" key={repuesto.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-heading text-2xl font-semibold">{repuesto.name}</h2>
                    {repuesto.isLowStock ? (
                      <span className="rounded-full border border-[#f59e0b]/30 bg-[#fff7ed] px-3 py-1 text-xs font-semibold text-[#9a3412]">
                        Stock bajo
                      </span>
                    ) : (
                      <span className="rounded-full border border-[#16a34a]/25 bg-[#f0fdf4] px-3 py-1 text-xs font-semibold text-[#166534]">
                        Disponible
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-[color:var(--muted-strong)]">
                    Codigo {repuesto.code}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm md:min-w-72">
                  <div className="rounded-xl border border-[color:var(--border)] bg-white/70 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
                      Stock actual
                    </p>
                    <p className="mt-2 font-heading text-3xl font-semibold">
                      {repuesto.currentStock}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[color:var(--border)] bg-white/70 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
                      Stock minimo
                    </p>
                    <p className="mt-2 font-heading text-3xl font-semibold">
                      {repuesto.minimumStock}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {repuestos.length === 0 ? (
            <Card className="rounded-xl text-center">
              <p className="text-[color:var(--muted-strong)]">
                No hay repuestos con esos filtros.
              </p>
            </Card>
          ) : null}
        </div>

        <div className="space-y-6">
          {isAdmin ? (
            <>
              <Card className="rounded-2xl">
                <h2 className="font-heading text-2xl font-semibold">Nuevo repuesto</h2>
                <div className="mt-5">
                  <RepuestoForm />
                </div>
              </Card>

              <Card className="rounded-2xl">
                <h2 className="font-heading text-2xl font-semibold">Ingreso de stock</h2>
                <div className="mt-5">
                  <StockEntryForm repuestos={options} />
                </div>
              </Card>

              <Card className="rounded-2xl">
                <h2 className="font-heading text-2xl font-semibold">Ajuste manual</h2>
                <div className="mt-5">
                  <StockAdjustmentForm repuestos={options} />
                </div>
              </Card>
            </>
          ) : null}

          <Card className="rounded-2xl">
            <h2 className="font-heading text-2xl font-semibold">Movimientos recientes</h2>
            <div className="mt-5 space-y-4">
              {movements.map((movement) => (
                <div
                  className="rounded-xl border border-[color:var(--border)] bg-white/70 p-4"
                  key={movement.id}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-[color:var(--foreground)]">
                      {movement.repuesto.name}
                    </p>
                    <span className="rounded-full border border-[color:var(--border)] px-3 py-1 text-xs font-semibold">
                      {formatSignedQuantity(movement.quantity)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[color:var(--muted-strong)]">
                    {STOCK_MOVEMENT_TYPE_LABELS[movement.type]} / {movement.previousStock} a{" "}
                    {movement.newStock}
                  </p>
                  <p className="mt-1 text-sm text-[color:var(--muted)]">
                    {movement.reason ?? "Sin observacion"}
                  </p>
                  <p className="mt-2 text-xs text-[color:var(--muted)]">
                    {movement.createdBy?.name ?? "Sistema"} / {formatDateTime(movement.createdAt)}
                  </p>
                </div>
              ))}

              {movements.length === 0 ? (
                <p className="text-sm text-[color:var(--muted)]">
                  Aun no hay movimientos de inventario.
                </p>
              ) : null}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
