import { hash } from "bcryptjs";
import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const adminEmail = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
const adminPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD?.trim();
const adminName = process.env.BOOTSTRAP_ADMIN_NAME?.trim() || "Administrador";

async function main() {
  if (!adminEmail || !adminPassword) {
    console.log("Bootstrap admin omitido: faltan variables BOOTSTRAP_ADMIN_*.");
    return;
  }

  if (adminPassword.length < 8) {
    throw new Error("BOOTSTRAP_ADMIN_PASSWORD debe tener al menos 8 caracteres.");
  }

  const existing = await prisma.user.findUnique({
    where: {
      email: adminEmail,
    },
  });

  if (existing) {
    if (existing.role !== UserRole.ADMIN) {
      throw new Error("Ya existe un usuario con ese correo y no es ADMIN.");
    }

    if (!existing.active || existing.name !== adminName) {
      await prisma.user.update({
        where: {
          id: existing.id,
        },
        data: {
          name: adminName,
          active: true,
        },
      });
    }

    console.log(`Bootstrap admin listo: ${adminEmail}`);
    return;
  }

  await prisma.user.create({
    data: {
      name: adminName,
      email: adminEmail,
      passwordHash: await hash(adminPassword, 10),
      role: UserRole.ADMIN,
      active: true,
    },
  });

  console.log(`Bootstrap admin creado: ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
