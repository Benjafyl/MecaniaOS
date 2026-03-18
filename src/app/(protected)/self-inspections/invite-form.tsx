"use client";

import { useActionState } from "react";

import { createSelfInspectionInviteAction } from "@/app/(protected)/self-inspections/actions";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { initialActionState } from "@/lib/form-state";
import { SELF_INSPECTION_SOURCE_LABELS } from "@/modules/self-inspections/self-inspection.constants";

type InviteFormProps = {
  clients: Array<{
    id: string;
    fullName: string;
  }>;
  vehicles: Array<{
    id: string;
    label: string;
  }>;
};

export function InviteForm({ clients, vehicles }: InviteFormProps) {
  const [state, formAction] = useActionState(createSelfInspectionInviteAction, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="customerId">
          Cliente
        </label>
        <Select id="customerId" name="customerId">
          <option value="">Selecciona un cliente</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.fullName}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="vehicleId">
          Vehiculo asociado
        </label>
        <Select id="vehicleId" name="vehicleId">
          <option value="">El cliente lo definira en el wizard</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="sourceChannel">
            Canal de origen
          </label>
          <Select defaultValue="SECURE_LINK" id="sourceChannel" name="sourceChannel">
            {Object.entries(SELF_INSPECTION_SOURCE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="expiresInDays">
            Expira en dias
          </label>
          <Input defaultValue="7" id="expiresInDays" min="1" name="expiresInDays" type="number" />
        </div>
      </div>

      <FormMessage message={state.error} />
      <SubmitButton label="Generar enlace seguro" pendingLabel="Generando enlace..." />
    </form>
  );
}
