import { UserRole } from "@prisma/client";
import { hash } from "bcryptjs";

import { ConflictError, NotFoundError } from "@/lib/errors";
import { userRepository } from "@/modules/users/user.repository";
import {
  createInternalUserSchema,
  updateInternalUserSchema,
} from "@/modules/users/user.schemas";

export async function listInternalUsers() {
  return userRepository.listInternalUsers();
}

export async function listMechanics() {
  return userRepository.listMechanics();
}

export async function listLiquidators() {
  return userRepository.listLiquidators();
}

export async function createInternalUser(input: unknown) {
  const data = createInternalUserSchema.parse(input);
  const email = data.email.toLowerCase();
  const existing = await userRepository.findByEmail(email);

  if (existing) {
    throw new ConflictError("Ya existe un usuario con ese correo");
  }

  return userRepository.create({
    name: data.name,
    email,
    passwordHash: await hash(data.password, 10),
    role: data.role,
  });
}

export async function updateInternalUser(id: string, input: unknown) {
  const data = updateInternalUserSchema.parse(input);
  const existing = await userRepository.findById(id);

  if (!existing) {
    throw new NotFoundError("Usuario no encontrado");
  }

  const passwordHash = data.password ? await hash(data.password, 10) : undefined;

  return userRepository.update(id, {
    role: data.role,
    active: data.active,
    passwordHash,
  });
}

export function getInternalRoleLabel(role: UserRole) {
  if (role === UserRole.ADMIN) {
    return "Administrador";
  }

  if (role === UserRole.MECHANIC) {
    return "Mecanico";
  }

  if (role === UserRole.LIQUIDATOR) {
    return "Liquidador";
  }

  return "Cliente";
}
