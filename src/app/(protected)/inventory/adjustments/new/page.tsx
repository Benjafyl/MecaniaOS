import Link from "next/link";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import { StockAdjustmentForm } from "@/app/(protected)/inventory/stock-adjustment-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentSession } from "@/modules/auth/auth.service";
import { listInventoryOptions } from "@/modules/inventory/inventory.service";

export default async function NewInventoryAdjustmentPage() {
  const session = await getCurrentSession();

  if (session?.user.role !== UserRole.ADMIN) {
    redirect("/inventory");
  }

  const repuestos = await listInventoryOptions();

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
              Movimiento de inventario
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold">Ajuste manual</h1>
          </div>

          <Link href="/inventory">
            <Button variant="secondary">Volver a inventario</Button>
          </Link>
        </div>
      </Card>

      <Card className="rounded-2xl">
        <StockAdjustmentForm repuestos={repuestos} />
      </Card>
    </div>
  );
}
