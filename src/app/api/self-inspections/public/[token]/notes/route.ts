import { apiError, apiResponse } from "@/lib/http";
import { savePublicSelfInspectionNotes } from "@/modules/self-inspections/self-inspection.service";

type RouteContext = {
  params: Promise<{
    token: string;
  }>;
};

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const body = await request.json();
    const { token } = await params;
    const inspection = await savePublicSelfInspectionNotes(token, body);

    return apiResponse(inspection);
  } catch (error) {
    return apiError(error);
  }
}
