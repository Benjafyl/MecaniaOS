import { notFound } from "next/navigation";

import { Card } from "@/components/ui/card";
import { normalizeError } from "@/lib/errors";
import {
  getPublicSelfInspectionWizard,
  type PublicSelfInspectionWizardData,
} from "@/modules/self-inspections/self-inspection.service";
import { SelfInspectionWizard } from "@/app/self-inspections/start/[token]/self-inspection-wizard";

type PublicWizardPageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function PublicWizardPage({ params }: PublicWizardPageProps) {
  const { token } = await params;
  const initialData = await getPublicSelfInspectionWizard(token).catch((error) => {
    const normalized = normalizeError(error);

    if (normalized.statusCode === 404 || normalized.statusCode === 410) {
      notFound();
    }

    throw error;
  });

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1200px] flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
      <Card className="rounded-[32px] bg-[linear-gradient(135deg,rgba(255,250,240,0.96),rgba(237,242,241,0.98))]">
        <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
          Autoinspeccion del Vehiculo
        </p>
        <h1 className="mt-3 font-heading text-4xl font-semibold">
          Recepcion digital previa al taller
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted-strong)]">
          Esta autoinspeccion ayuda al taller a levantar sintomas, danos visibles y estado
          general del vehiculo antes de una revision tecnica inicial. No reemplaza una
          evaluacion profesional. Responde con la mayor precision posible y toma las fotos
          solo en un lugar seguro y bien iluminado.
        </p>
      </Card>

      <SelfInspectionWizard initialData={initialData as PublicSelfInspectionWizardData} token={token} />
    </div>
  );
}
