"use client";

import { useActionState } from "react";

import { addWorkOrderEvidenceAction } from "@/app/(protected)/work-orders/actions";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { initialActionState } from "@/lib/form-state";

type EvidenceUploadFormProps = {
  orderId: string;
};

export function EvidenceUploadForm({ orderId }: EvidenceUploadFormProps) {
  const [state, formAction] = useActionState(addWorkOrderEvidenceAction, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <input name="orderId" type="hidden" value={orderId} />
      <div className="space-y-2">
        <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="file">
          Imagen
        </label>
        <Input accept="image/jpeg,image/png,image/webp" id="file" name="file" type="file" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="note">
          Nota
        </label>
        <Textarea id="note" name="note" placeholder="Contexto opcional de la evidencia" />
      </div>
      <FormMessage message={state.error} />
      <SubmitButton label="Adjuntar evidencia" pendingLabel="Subiendo..." />
    </form>
  );
}
