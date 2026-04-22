import { z } from "zod";
import { BudgetStatus } from "@prisma/client";

import { optionalText, requiredInteger, requiredText } from "@/lib/validation";

export const createBudgetSchema = z.object({
  clientId: requiredText(1, 40),
  vehicleId: requiredText(1, 40),
  title: requiredText(5, 120),
  summary: optionalText(1200),
});

export const updateBudgetDraftSchema = z.object({
  title: requiredText(5, 120),
  summary: optionalText(1200),
});

export const budgetLineUpdateSchema = z.object({
  quantity: requiredInteger(1, 999),
  unitPrice: requiredInteger(0, 50_000_000),
  note: optionalText(400),
});

export const transitionBudgetStatusSchema = z.object({
  nextStatus: z.nativeEnum(BudgetStatus),
  note: optionalText(400),
});
