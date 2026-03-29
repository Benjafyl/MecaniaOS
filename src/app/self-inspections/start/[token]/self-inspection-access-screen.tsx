"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type AccessScreenProps = {
  token: string;
  customerName: string;
  customerEmail: string;
  statusLabel: string;
  sessionEmail: string | null;
  sessionRole: string | null;
};

class RequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RequestError";
  }
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const body = await response.json();

  if (!response.ok) {
    throw new RequestError(body.error ?? "No fue posible completar la solicitud");
  }

  return body.data as T;
}

export function SelfInspectionAccessScreen({
  token,
  customerName,
  customerEmail,
  statusLabel,
  sessionEmail,
  sessionRole,
}: AccessScreenProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasDifferentSession =
    Boolean(sessionEmail) && sessionEmail?.toLowerCase() !== customerEmail.toLowerCase();

  async function handleSubmit() {
    setError(null);
    setIsSubmitting(true);

    try {
      await requestJson(`/api/self-inspections/public/${token}/access`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          mode === "login"
            ? {
                mode,
                password,
              }
            : {
                mode,
                password,
                confirmPassword,
              },
        ),
      });

      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No fue posible iniciar sesion");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="rounded-[32px] border-[rgba(14,79,82,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(242,247,246,0.96))]">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
              Acceso rapido
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold">
              Ingresa antes de comenzar
            </h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted-strong)]">
              Esta autoinspeccion fue preparada para <strong>{customerName}</strong>. Al entrar,
              podras completar el formulario corto y subir evidencia en 2 a 3 minutos.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[24px] border border-[color:var(--border)] bg-white/80 p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Correo del enlace
              </p>
              <p className="mt-2 text-sm font-semibold text-[color:var(--foreground)]">
                {customerEmail}
              </p>
            </div>
            <div className="rounded-[24px] border border-[color:var(--border)] bg-white/80 p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Estado actual
              </p>
              <p className="mt-2 text-sm font-semibold text-[color:var(--foreground)]">
                {statusLabel}
              </p>
            </div>
          </div>

          <div className="rounded-[24px] border border-[rgba(14,79,82,0.14)] bg-[rgba(14,79,82,0.07)] p-4 text-sm text-[color:var(--muted-strong)]">
            Usa este mismo correo para entrar o crear tu acceso. No necesitas una cuenta del
            taller, solo una clave corta para continuar.
          </div>
        </div>

        <div className="rounded-[28px] border border-[rgba(200,92,42,0.12)] bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="grid grid-cols-2 gap-2 rounded-full bg-[color:var(--surface)] p-1">
            {[
              { value: "login", label: "Iniciar sesion" },
              { value: "register", label: "Crear acceso" },
            ].map((option) => (
              <button
                className={`min-h-11 rounded-full px-4 text-sm font-semibold transition ${
                  mode === option.value
                    ? "bg-white text-[color:var(--foreground)] shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                    : "text-[color:var(--muted)]"
                }`}
                key={option.value}
                onClick={() => {
                  setMode(option.value as "login" | "register");
                  setError(null);
                }}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="access-email">
                Correo
              </label>
              <Input disabled id="access-email" value={customerEmail} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="access-password">
                Contrasena
              </label>
              <Input
                id="access-password"
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                value={password}
              />
            </div>

            {mode === "register" ? (
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-[color:var(--muted-strong)]"
                  htmlFor="access-confirm-password"
                >
                  Confirmar contrasena
                </label>
                <Input
                  id="access-confirm-password"
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  type="password"
                  value={confirmPassword}
                />
              </div>
            ) : null}

            {hasDifferentSession ? (
              <div className="rounded-[20px] border border-[rgba(200,92,42,0.18)] bg-[rgba(200,92,42,0.08)] px-4 py-3 text-sm text-[color:var(--accent-strong)]">
                Hay una sesion abierta como <strong>{sessionEmail}</strong>
                {sessionRole ? ` (${sessionRole.toLowerCase()})` : ""}. Al continuar se cambiara a
                la cuenta del cliente.
              </div>
            ) : null}

            {error ? (
              <div className="rounded-[20px] border border-[rgba(200,92,42,0.18)] bg-[rgba(200,92,42,0.08)] px-4 py-3 text-sm text-[color:var(--accent-strong)]">
                {error}
              </div>
            ) : null}

            <Button
              className="w-full"
              disabled={
                isSubmitting ||
                password.trim().length < 8 ||
                (mode === "register" && confirmPassword.trim().length < 8)
              }
              onClick={handleSubmit}
              type="button"
            >
              {isSubmitting
                ? mode === "login"
                  ? "Ingresando..."
                  : "Creando acceso..."
                : mode === "login"
                  ? "Entrar y continuar"
                  : "Crear acceso y continuar"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
