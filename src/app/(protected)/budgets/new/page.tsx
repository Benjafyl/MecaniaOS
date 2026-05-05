import { BudgetCreateForm } from "@/app/(protected)/budgets/budget-create-form";
import { Card } from "@/components/ui/card";
import { getBudgetCreateContext } from "@/modules/budgets/budget.service";

export default async function NewBudgetPage() {
  const context = await getBudgetCreateContext();

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(239,246,255,0.94)_100%)]">
        <div className="space-y-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
                Nuevo presupuesto
              </p>
              <h1 className="mt-2 font-heading text-3xl font-semibold">
                Armar presupuesto tecnico del caso
              </h1>
              <p className="mt-3 max-w-3xl text-sm text-[color:var(--muted-strong)]">
                Puedes partir desde cliente y vehiculo existentes o desde una autoinspeccion
                revisada. El presupuesto queda ordenado por repuestos, mano de obra e insumos para
                revisarlo facil desde oficina o celular.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <HeroStat label="Clientes" value={context.clients.length} />
              <HeroStat label="Autoinspecciones" value={context.selfInspections.length} />
              <HeroStat label="Repuestos catalogados" value={context.inventoryParts.length} />
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            <GuideCard
              description="Relaciona el presupuesto con una autoinspeccion revisada o con un cliente existente."
              step="1"
              title="Origen del caso"
            />
            <GuideCard
              description="Agrega repuestos, mano de obra e insumos usando valores conectados a inventario y catalogo."
              step="2"
              title="Detalle tecnico"
            />
            <GuideCard
              description="Guarda el borrador y continua despues con envio, aprobacion y conversion a OT."
              step="3"
              title="Continuidad del flujo"
            />
          </div>
        </div>
      </Card>

      <BudgetCreateForm
        clients={context.clients.map((client) => ({
          id: client.id,
          fullName: client.fullName,
        }))}
        selfInspections={context.selfInspections.map((inspection) => ({
          id: inspection.id,
          customerId: inspection.customer.id,
          customerName: inspection.customer.fullName,
          vehicleId: inspection.vehicleId,
          vehicleLabel: inspection.vehicle
            ? `${inspection.vehicle.make} ${inspection.vehicle.model} / ${inspection.vehicle.plate ?? inspection.vehicle.vin}`
            : "Vehiculo pendiente",
          reviewedAt: inspection.reviewedAt,
        }))}
        inventoryParts={context.inventoryParts.map((repuesto) => ({
          id: repuesto.id,
          name: repuesto.name,
          code: repuesto.code,
          unitPrice: repuesto.unitPrice,
          currentStock: repuesto.currentStock,
          minimumStock: repuesto.minimumStock,
        }))}
        references={context.references.map((reference) => ({
          id: reference.id,
          itemType: reference.itemType,
          name: reference.name,
          referenceCode: reference.referenceCode,
          unitPrice: reference.unitPrice,
          sourceLabel: reference.sourceLabel,
          sourceUrl: reference.sourceUrl,
          vehicleCompatibility: reference.vehicleCompatibility,
        }))}
        vehicles={context.vehicles.map((vehicle) => ({
          id: vehicle.id,
          plate: vehicle.plate,
          vin: vehicle.vin,
          make: vehicle.make,
          model: vehicle.model,
          clientId: vehicle.clientId,
          clientName: vehicle.clientName,
        }))}
      />
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[rgba(37,99,235,0.12)] bg-white/80 px-4 py-3 shadow-[0_10px_24px_rgba(37,99,235,0.06)]">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--muted)]">{label}</p>
      <p className="mt-2 font-heading text-3xl font-semibold text-[color:var(--foreground)]">
        {value}
      </p>
    </div>
  );
}

function GuideCard({
  description,
  step,
  title,
}: {
  description: string;
  step: string;
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-[rgba(37,99,235,0.12)] bg-white/78 p-4 shadow-[0_10px_24px_rgba(37,99,235,0.05)]">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(180deg,#17345e_0%,#2563eb_100%)] text-sm font-semibold text-white">
          {step}
        </span>
        <h2 className="font-heading text-lg font-semibold text-[color:var(--foreground)]">
          {title}
        </h2>
      </div>
      <p className="mt-3 text-sm leading-6 text-[color:var(--muted-strong)]">{description}</p>
    </div>
  );
}
