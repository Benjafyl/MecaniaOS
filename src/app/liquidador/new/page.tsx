import { Card } from "@/components/ui/card";
import { InsuranceCaseForm } from "@/app/liquidador/insurance-case-form";
import { getInsuranceCaseCreateContext } from "@/modules/insurance-cases/insurance-case.service";

export default async function NewInsuranceCasePage() {
  const context = await getInsuranceCaseCreateContext();

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl">
        <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
          Nuevo siniestro
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold">
          Registrar caso para evaluacion del taller
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-[color:var(--muted-strong)]">
          Completa los datos del choque y adjunta fotos iniciales. El sistema crea la solicitud y
          la deja conectada con el vehiculo para que el taller y el presupuesto queden vinculados de
          forma automatica.
        </p>
      </Card>

      <InsuranceCaseForm
        clients={context.clients.map((client) => ({
          id: client.id,
          fullName: client.fullName,
        }))}
        vehicles={context.vehicles.map((vehicle) => ({
          id: vehicle.id,
          clientId: vehicle.clientId,
          plate: vehicle.plate,
          vin: vehicle.vin,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          color: vehicle.color,
        }))}
      />
    </div>
  );
}
