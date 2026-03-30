import { z } from "zod";

import { optionalText, requiredText } from "@/lib/validation";

export const createClientSchema = z.object({
  fullName: requiredText(3, 120),
  localIdentifier: optionalText(32),
  phone: requiredText(6, 32),
  email: z.email().trim(),
  address: optionalText(255),
  portalPassword: optionalText(128),
});

export const updateClientSchema = createClientSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "Debe enviar al menos un campo para actualizar",
);
