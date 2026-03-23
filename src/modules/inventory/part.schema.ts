import { z } from "zod";

export const createPartSchema = z.object({
  code: z.string().min(1, "El código es requerido").max(50, "El código es muy largo"),
  name: z.string().min(1, "El nombre es requerido").max(100, "El nombre es muy largo"),
  description: z.string().max(255).optional().nullable(),
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo").default(0),
  minStock: z.coerce.number().int().min(0, "El stock mínimo no puede ser negativo").default(0),
  price: z.coerce.number().min(0).optional().nullable(),
});

export type CreatePartInput = z.infer<typeof createPartSchema>;

export const adjustStockSchema = z.object({
  partId: z.string().cuid("ID de repuesto inválido"),
  quantity: z.coerce.number().int(), // positive to add, negative to remove
});

export type AdjustStockInput = z.infer<typeof adjustStockSchema>;
