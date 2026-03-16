import { UserRole } from "@prisma/client";

import { apiError, apiResponse } from "@/lib/http";
import { requireApiUser } from "@/modules/auth/auth.service";
import { getClientById, updateClient } from "@/modules/clients/client.service";

type ClientRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: ClientRouteContext) {
  try {
    await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);
    const { id } = await context.params;
    const client = await getClientById(id);
    return apiResponse(client);
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: Request, context: ClientRouteContext) {
  try {
    await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);
    const { id } = await context.params;
    const body = await request.json();
    const client = await updateClient(id, body);
    return apiResponse(client);
  } catch (error) {
    return apiError(error);
  }
}
