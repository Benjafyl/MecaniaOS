"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

type PublicLinkPanelProps = {
  publicUrl: string;
  qrCodeDataUrl: string | null;
};

export function PublicLinkPanel({ publicUrl, qrCodeDataUrl }: PublicLinkPanelProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 2500);
    } catch {
      setCopyState("error");
    }
  }

  return (
    <div className="rounded-[24px] border border-[rgba(200,92,42,0.18)] bg-[rgba(200,92,42,0.08)] p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
        Enlace seguro recien generado
      </p>
      {qrCodeDataUrl ? (
        <div className="mt-3 flex justify-center rounded-[20px] border border-white/70 bg-white/90 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Codigo QR para abrir la autoinspeccion"
            className="h-40 w-40 rounded-[16px]"
            src={qrCodeDataUrl}
          />
        </div>
      ) : null}
      <p className="mt-2 break-all text-sm font-semibold text-[color:var(--foreground)]">
        {publicUrl}
      </p>
      <p className="mt-2 text-xs text-[color:var(--muted-strong)]">
        Puedes abrirlo tu mismo para simular al cliente, escanear el QR o copiarlo y enviarlo.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <a href={publicUrl} rel="noreferrer" target="_blank">
          <Button variant="primary">Abrir enlace cliente</Button>
        </a>
        <Button onClick={handleCopy} type="button" variant="secondary">
          {copyState === "copied"
            ? "Enlace copiado"
            : copyState === "error"
              ? "No se pudo copiar"
              : "Copiar enlace"}
        </Button>
      </div>
    </div>
  );
}
