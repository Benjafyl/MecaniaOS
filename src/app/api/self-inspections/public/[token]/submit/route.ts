import { apiError, apiResponse } from "@/lib/http";
import { submitPublicSelfInspection } from "@/modules/self-inspections/self-inspection.service";

type RouteContext = {
  params: Promise<{
    token: string;
  }>;
};

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const body = await request.json();
    const { token } = await params;
    const inspection = await submitPublicSelfInspection(token, body);

    return apiResponse(inspection);
  } catch (error) {
    return apiError(error);
  }
}
