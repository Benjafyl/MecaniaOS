import { PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.selfInspectionStatusLog.deleteMany();
  await prisma.selfInspectionReview.deleteMany();
  await prisma.selfInspectionNote.deleteMany();
  await prisma.selfInspectionPhoto.deleteMany();
  await prisma.selfInspectionAnswer.deleteMany();
  await prisma.selfInspectionVehicleSnapshot.deleteMany();
  await prisma.selfInspection.deleteMany();
  await prisma.workOrderStatusLog.deleteMany();
  await prisma.workOrderEvidence.deleteMany();
  await prisma.workOrder.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.client.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await hash("Admin1234!", 10);
  const mechanicPassword = await hash("Mechanic1234!", 10);

  await Promise.all([
    prisma.user.create({
      data: {
        name: "Tomas Herrera",
        email: "admin@mecaniaos.local",
        passwordHash: adminPassword,
        role: UserRole.ADMIN,
      },
    }),
    prisma.user.create({
      data: {
        name: "Paula Rojas",
        email: "mecanico@mecaniaos.local",
        passwordHash: mechanicPassword,
        role: UserRole.MECHANIC,
      },
    }),
  ]);

  console.log("Seed listo");
  console.log("Admin: admin@mecaniaos.local / Admin1234!");
  console.log("Mecanico: mecanico@mecaniaos.local / Mechanic1234!");
  console.log("Autoinspecciones: 0");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
