import { apiError, apiResponse } from "@/lib/http";
import { signOut } from "@/modules/auth/auth.service";

export async function POST() {
  try {
    await signOut();
    return apiResponse({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
