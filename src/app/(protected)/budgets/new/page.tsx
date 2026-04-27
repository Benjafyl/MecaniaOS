import { Card } from "@/components/ui/card";
import { BudgetCreateForm } from "@/app/(protected)/budgets/budget-create-form";
import { getBudgetCreateContext } from "@/modules/budgets/budget.service";

export default async function NewBudgetPage() {
  const context = await getBudgetCreateContext();

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl">
        <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
          Nuevo presupuesto
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold">
          Crear borrador con valores reales
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-[color:var(--muted-strong)]">
          Puedes partir desde cliente y vehiculo existentes o desde una autoinspeccion revisada.
          El presupuesto queda como borrador editable para seguir completando el flujo de Sprint 2.
        </p>
      </Card>

      <BudgetCreateForm
        clients={context.clients.map((client) => ({
          id: client.id,
          fullName: client.fullName,
        }))}
        selfInspections={context.selfInspections.map((inspection) => ({
          id: inspection.id,
          customerName: inspection.customer.fullName,
          vehicleLabel: inspection.vehicle
            ? `${inspection.vehicle.make} ${inspection.vehicle.model} / ${inspection.vehicle.plate ?? inspection.vehicle.vin}`
            : "Vehiculo pendiente",
          reviewedAt: inspection.reviewedAt,
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
