import { apiError, apiResponse } from "@/lib/http";
import { getPublicSelfInspectionWizard } from "@/modules/self-inspections/self-inspection.service";

type RouteContext = {
  params: Promise<{
    token: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { token } = await params;
    const inspection = await getPublicSelfInspectionWizard(token);

    return apiResponse(inspection);
  } catch (error) {
    return apiError(error);
  }
}
