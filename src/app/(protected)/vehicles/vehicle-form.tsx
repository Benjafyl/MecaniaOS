"use client";

import { useActionState } from "react";

import { createVehicleAction } from "@/app/(protected)/vehicles/actions";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { initialActionState } from "@/lib/form-state";

type VehicleFormProps = {
  clients: Array<{
    id: string;
    fullName: string;
  }>;
  defaultClientId?: string;
};

export function VehicleForm({ clients, defaultClientId }: VehicleFormProps) {
  const [state, formAction] = useActionState(createVehicleAction, initialActionState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="clientId">
            Cliente
          </label>
          <Select defaultValue={defaultClientId} id="clientId" name="clientId">
            <option value="">Selecciona un cliente</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.fullName}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="plate">
            Patente
          </label>
          <Input id="plate" name="plate" placeholder="Opcional" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="vin">
            VIN
          </label>
          <Input id="vin" name="vin" placeholder="Identificador tecnico unico" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="make">
            Marca
          </label>
          <Input id="make" name="make" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="model">
            Modelo
          </label>
          <Input id="model" name="model" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="year">
            Ano
          </label>
          <Input id="year" name="year" placeholder="2022" type="number" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="mileage">
            Kilometraje
          </label>
          <Input id="mileage" name="mileage" placeholder="Opcional" type="number" />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="color">
            Color
          </label>
          <Input id="color" name="color" placeholder="Opcional" />
        </div>
      </div>

      <FormMessage message={state.error} />
      <SubmitButton label="Registrar vehiculo" pendingLabel="Guardando vehiculo..." />
    </form>
  );
}
