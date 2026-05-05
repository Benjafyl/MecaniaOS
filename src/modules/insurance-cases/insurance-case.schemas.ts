import { z } from "zod";

import { optionalDateOnly, optionalText, requiredText } from "@/lib/validation";

export const createInsuranceCaseSchema = z.object({
  clientId: requiredText(1, 40),
  vehicleId: requiredText(1, 40),
  claimNumber: optionalText(64),
  policyNumber: optionalText(64),
  incidentDate: optionalDateOnly(),
  incidentLocation: optionalText(255),
  description: requiredText(10, 1500),
});
