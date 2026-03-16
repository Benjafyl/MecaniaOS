import { NotFoundError } from "@/lib/errors";
import { clientRepository } from "@/modules/clients/client.repository";
import {
  createClientSchema,
  updateClientSchema,
} from "@/modules/clients/client.schemas";

export async function listClients(search?: string) {
  return clientRepository.list(search?.trim());
}

export async function getClientById(id: string) {
  const client = await clientRepository.findById(id);

  if (!client) {
    throw new NotFoundError("Cliente no encontrado");
  }

  return client;
}

export async function createClient(input: unknown) {
  const data = createClientSchema.parse(input);

  return clientRepository.create({
    fullName: data.fullName,
    localIdentifier: data.localIdentifier,
    phone: data.phone,
    email: data.email.toLowerCase(),
    address: data.address,
  });
}

export async function updateClient(id: string, input: unknown) {
  const data = updateClientSchema.parse(input);

  return clientRepository.update(id, {
    fullName: data.fullName,
    localIdentifier: data.localIdentifier,
    phone: data.phone,
    email: data.email?.toLowerCase(),
    address: data.address,
  });
}
