import { UserRole } from "@prisma/client";
import { z } from "zod";

import { optionalText, requiredText } from "@/lib/validation";

const internalRoleSchema = z.enum([UserRole.ADMIN, UserRole.MECHANIC]);

export const createInternalUserSchema = z.object({
  name: requiredText(3, 120),
  email: z.string().trim().email(),
  password: requiredText(8, 128),
  role: internalRoleSchema,
});

export const updateInternalUserSchema = z.object({
  role: internalRoleSchema,
  active: z.boolean(),
  password: optionalText(128),
});
