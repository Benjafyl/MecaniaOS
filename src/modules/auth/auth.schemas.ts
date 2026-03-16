import { z } from "zod";

import { requiredText } from "@/lib/validation";

export const loginSchema = z.object({
  email: z.email().trim(),
  password: requiredText(8, 128),
});
