import { apiError, apiResponse } from "@/lib/http";
import { deletePublicSelfInspectionPhoto } from "@/modules/self-inspections/self-inspection.service";

type RouteContext = {
  params: Promise<{
    token: string;
    photoId: string;
  }>;
};

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { token, photoId } = await params;
    const inspection = await deletePublicSelfInspectionPhoto(token, photoId);

    return apiResponse(inspection);
  } catch (error) {
    return apiError(error);
  }
}
