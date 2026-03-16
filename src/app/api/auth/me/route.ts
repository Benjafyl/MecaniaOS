import { apiError, apiResponse } from "@/lib/http";
import { requireApiUser } from "@/modules/auth/auth.service";

export async function GET() {
  try {
    const session = await requireApiUser();
    return apiResponse(session.user);
  } catch (error) {
    return apiError(error);
  }
}
