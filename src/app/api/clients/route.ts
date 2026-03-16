import { UserRole } from "@prisma/client";

import { apiError, apiResponse } from "@/lib/http";
import { requireApiUser } from "@/modules/auth/auth.service";
import { createClient, listClients } from "@/modules/clients/client.service";

export async function GET(request: Request) {
  try {
    await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);
    const { searchParams } = new URL(request.url);
    const clients = await listClients(searchParams.get("q") ?? undefined);
    return apiResponse(clients);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);
    const body = await request.json();
    const client = await createClient(body);
    return apiResponse(client, 201);
  } catch (error) {
    return apiError(error);
  }
}
