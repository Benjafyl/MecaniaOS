import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClientForm } from "@/app/(protected)/clients/client-form";

export default function NewClientPage() {
  return (
    <div className="space-y-6">
      <Card className="rounded-[32px]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
              Alta rapida
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold">Registrar cliente</h1>
          </div>

          <Link href="/clients">
            <Button variant="secondary">Volver al listado</Button>
          </Link>
        </div>
      </Card>

      <Card className="rounded-[32px]">
        <ClientForm />
      </Card>
    </div>
  );
}
