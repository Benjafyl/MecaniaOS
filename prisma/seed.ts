import { PrismaClient, UserRole, WorkOrderStatus } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.workOrderStatusLog.deleteMany();
  await prisma.workOrder.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.client.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await hash("Admin1234!", 10);
  const mechanicPassword = await hash("Mechanic1234!", 10);

  const [admin, mechanic] = await Promise.all([
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

  const clientA = await prisma.client.create({
    data: {
      fullName: "Maria Gonzalez",
      localIdentifier: "12.345.678-9",
      phone: "+56 9 5555 1111",
      email: "maria@example.com",
      address: "Av. Los Talleres 145, Santiago",
    },
  });

  const clientB = await prisma.client.create({
    data: {
      fullName: "Juan Perez",
      localIdentifier: "9.876.543-2",
      phone: "+56 9 5555 2222",
      email: "juan@example.com",
      address: "Pasaje Mecanica 220, Santiago",
    },
  });

  const vehicleA = await prisma.vehicle.create({
    data: {
      clientId: clientA.id,
      plate: "LTDK21",
      vin: "3VWFE21C04M000001",
      make: "Volkswagen",
      model: "Gol",
      year: 2020,
      color: "Blanco",
      mileage: 58200,
    },
  });

  const vehicleB = await prisma.vehicle.create({
    data: {
      clientId: clientB.id,
      plate: "KJRT54",
      vin: "1HGCM82633A000002",
      make: "Honda",
      model: "Civic",
      year: 2018,
      color: "Gris",
      mileage: 91450,
    },
  });

  const workOrderA = await prisma.workOrder.create({
    data: {
      clientId: clientA.id,
      vehicleId: vehicleA.id,
      orderNumber: "OT-2026-0001",
      reason: "Ruido en frenos delanteros",
      initialDiagnosis: "Pastillas con desgaste avanzado",
      status: WorkOrderStatus.IN_REPAIR,
      intakeDate: new Date("2026-03-10T10:00:00.000Z"),
      estimatedDate: new Date("2026-03-15T18:00:00.000Z"),
      notes: "Revisar discos y liquido de frenos",
      createdById: admin.id,
      updatedById: mechanic.id,
      statusLogs: {
        create: [
          {
            previousStatus: null,
            nextStatus: WorkOrderStatus.RECEIVED,
            note: "Ingreso inicial del vehiculo",
            changedById: admin.id,
            changedAt: new Date("2026-03-10T10:00:00.000Z"),
          },
          {
            previousStatus: WorkOrderStatus.RECEIVED,
            nextStatus: WorkOrderStatus.IN_DIAGNOSIS,
            note: "Inspeccion inicial",
            changedById: mechanic.id,
            changedAt: new Date("2026-03-10T11:00:00.000Z"),
          },
          {
            previousStatus: WorkOrderStatus.IN_DIAGNOSIS,
            nextStatus: WorkOrderStatus.IN_REPAIR,
            note: "Cliente aprueba reemplazo",
            changedById: mechanic.id,
            changedAt: new Date("2026-03-11T09:00:00.000Z"),
          },
        ],
      },
    },
  });

  await prisma.workOrder.create({
    data: {
      clientId: clientB.id,
      vehicleId: vehicleB.id,
      orderNumber: "OT-2026-0002",
      reason: "Mantencion por kilometraje",
      initialDiagnosis: "Cambio de aceite y filtros",
      status: WorkOrderStatus.READY_FOR_DELIVERY,
      intakeDate: new Date("2026-03-09T09:30:00.000Z"),
      estimatedDate: new Date("2026-03-12T17:00:00.000Z"),
      notes: "Incluye inspeccion general",
      createdById: mechanic.id,
      updatedById: mechanic.id,
      statusLogs: {
        create: [
          {
            previousStatus: null,
            nextStatus: WorkOrderStatus.RECEIVED,
            note: "Ingreso por mantencion",
            changedById: mechanic.id,
            changedAt: new Date("2026-03-09T09:30:00.000Z"),
          },
          {
            previousStatus: WorkOrderStatus.RECEIVED,
            nextStatus: WorkOrderStatus.IN_REPAIR,
            note: "Mantencion en proceso",
            changedById: mechanic.id,
            changedAt: new Date("2026-03-09T12:00:00.000Z"),
          },
          {
            previousStatus: WorkOrderStatus.IN_REPAIR,
            nextStatus: WorkOrderStatus.READY_FOR_DELIVERY,
            note: "Vehiculo listo",
            changedById: mechanic.id,
            changedAt: new Date("2026-03-11T16:00:00.000Z"),
          },
        ],
      },
    },
  });

  console.log("Seed listo");
  console.log(`Admin: admin@mecaniaos.local / Admin1234!`);
  console.log(`Mecanico: mecanico@mecaniaos.local / Mechanic1234!`);
  console.log(`Orden activa de referencia: ${workOrderA.orderNumber}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
