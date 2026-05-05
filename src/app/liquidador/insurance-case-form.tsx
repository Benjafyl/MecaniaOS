"use client";

import Link from "next/link";
import { ChangeEvent, useActionState, useMemo, useState } from "react";

import { createInsuranceCaseAction } from "@/app/liquidador/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { initialActionState } from "@/lib/form-state";

type InsuranceCaseFormProps = {
  clients: Array<{
    id: string;
    fullName: string;
  }>;
  vehicles: Array<{
    id: string;
    clientId: string;
    plate: string | null;
    vin: string;
    make: string;
    model: string;
    year: number;
    color: string | null;
  }>;
};

export function InsuranceCaseForm({ clients, vehicles }: InsuranceCaseFormProps) {
  const [state, formAction] = useActionState(createInsuranceCaseAction, initialActionState);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState("");

  const availableVehicles = useMemo(
    () => vehicles.filter((vehicle) => vehicle.clientId === selectedClientId),
    [selectedClientId, vehicles],
  );
  const selectedVehicle = availableVehicles.find((vehicle) => vehicle.id === selectedVehicleId);

  function handleClientChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextClientId = event.target.value;
    setSelectedClientId(nextClientId);

    const nextVehicles = vehicles.filter((vehicle) => vehicle.clientId === nextClientId);
    if (!nextVehicles.some((vehicle) => vehicle.id === selectedVehicleId)) {
      setSelectedVehicleId("");
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      <input name="clientId" type="hidden" value={selectedClientId} />
      <input name="vehicleId" type="hidden" value={selectedVehicleId} />

      <Card className="rounded-2xl">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="clientId">
              Cliente asociado
            </label>
            <Select id="clientId" onChange={handleClientChange} value={selectedClientId}>
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
              Vehiculo siniestrado
            </label>
            <Select
              disabled={!selectedClientId}
              id="vehicleId"
              onChange={(event) => setSelectedVehicleId(event.target.value)}
              value={selectedVehicleId}
            >
              <option value="">
                {selectedClientId
                  ? "Selecciona un vehiculo del cliente"
                  : "Selecciona primero un cliente"}
              </option>
              {availableVehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.make} {vehicle.model} / {vehicle.plate ?? vehicle.vin}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="claimNumber">
              Numero de siniestro
            </label>
            <Input id="claimNumber" name="claimNumber" placeholder="Ej. CLM-2026-00045" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="policyNumber">
              Poliza
            </label>
            <Input id="policyNumber" name="policyNumber" placeholder="Ej. POL-8430201" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="incidentDate">
              Fecha del choque
            </label>
            <Input id="incidentDate" name="incidentDate" type="date" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="incidentLocation">
              Lugar del siniestro
            </label>
            <Input
              id="incidentLocation"
              name="incidentLocation"
              placeholder="Ej. Av. Kennedy con Manquehue"
            />
          </div>

          <div className="space-y-2 lg:col-span-2">
            <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="description">
              Descripcion del dano
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe el impacto, las zonas afectadas y cualquier contexto relevante para el taller."
            />
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl">
        <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
          Datos clave del vehiculo
        </p>
        {selectedVehicle ? (
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-[color:var(--border)] bg-white/75 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--muted)]">
                Patente
              </p>
              <p className="mt-2 font-semibold text-[color:var(--foreground)]">
                {selectedVehicle.plate ?? "Sin patente"}
              </p>
            </div>
            <div className="rounded-xl border border-[color:var(--border)] bg-white/75 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--muted)]">
                Marca
              </p>
              <p className="mt-2 font-semibold text-[color:var(--foreground)]">
                {selectedVehicle.make}
              </p>
            </div>
            <div className="rounded-xl border border-[color:var(--border)] bg-white/75 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--muted)]">
                Modelo
              </p>
              <p className="mt-2 font-semibold text-[color:var(--foreground)]">
                {selectedVehicle.model}
              </p>
            </div>
            <div className="rounded-xl border border-[color:var(--border)] bg-white/75 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--muted)]">
                Anio
              </p>
              <p className="mt-2 font-semibold text-[color:var(--foreground)]">
                {selectedVehicle.year}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-[color:var(--muted)]">
            Selecciona un vehiculo para validar patente, marca y modelo antes de guardar.
          </p>
        )}
      </Card>

      <Card className="rounded-2xl">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="photos">
            Fotos iniciales del choque
          </label>
          <Input
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            id="photos"
            multiple
            name="photos"
            type="file"
          />
          <p className="text-sm text-[color:var(--muted)]">
            Estas imagenes se guardan y quedan asociadas automaticamente a la solicitud de evaluacion para el taller.
          </p>
        </div>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link href="/liquidador">
          <Button type="button" variant="secondary">
            Volver al portal
          </Button>
        </Link>
        <SubmitButton label="Registrar siniestro" pendingLabel="Registrando..." />
      </div>

      <FormMessage message={state.error} />
    </form>
  );
}
