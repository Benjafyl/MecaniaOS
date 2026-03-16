import { apiError, apiResponse } from "@/lib/http";
import { signIn } from "@/modules/auth/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await signIn(body);
    return apiResponse(user, 200);
  } catch (error) {
    return apiError(error);
  }
}
