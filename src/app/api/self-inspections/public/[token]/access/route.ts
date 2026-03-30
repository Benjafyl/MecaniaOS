import { apiError, apiResponse } from "@/lib/http";
import { authorizePublicSelfInspectionAccess } from "@/modules/self-inspections/self-inspection.service";

type RouteContext = {
  params: Promise<{
    token: string;
  }>;
};

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const body = await request.json();
    const { token } = await params;
    const access = await authorizePublicSelfInspectionAccess(token, body);

    return apiResponse(access);
  } catch (error) {
    return apiError(error);
  }
}
