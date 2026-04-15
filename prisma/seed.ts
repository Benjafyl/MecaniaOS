import {
  PrismaClient,
  SelfInspectionAnswerType,
  SelfInspectionPhotoType,
  SelfInspectionReason,
  SelfInspectionRiskLevel,
  SelfInspectionSource,
  SelfInspectionStatus,
  UserRole,
  VehicleFuelType,
  VehicleTransmissionType,
} from "@prisma/client";
import { hash } from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";

const prisma = new PrismaClient();

function hashAccessToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function createPendingClientDraft() {
  const suffix = randomBytes(10).toString("hex");

  return {
    fullName: "Cliente por identificar",
    phone: "",
    email: `pending+self-inspection-${suffix}@self-inspection.pending.mecaniaos.local`,
    localIdentifier: `SI_PENDING:${suffix}`,
  };
}

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

  const pendingClient = await prisma.client.create({
    data: createPendingClientDraft(),
  });

  const publicDraftToken = "portal-cliente-hilux-rysb49";

  const selfInspectionDraft = await prisma.selfInspection.create({
    data: {
      customerId: pendingClient.id,
      status: SelfInspectionStatus.DRAFT,
      sourceChannel: SelfInspectionSource.SECURE_LINK,
      accessTokenHash: hashAccessToken(publicDraftToken),
      accessTokenExpiresAt: new Date("2027-04-30T23:59:59.000Z"),
      inspectionReason: SelfInspectionReason.STRANGE_NOISE,
      mainComplaint: "Ruido intermitente en tren delantero al frenar y al pasar lomos de toro",
      canDrive: null,
      startedAt: new Date("2026-03-15T12:00:00.000Z"),
      overallRiskLevel: SelfInspectionRiskLevel.LOW,
      summaryGenerated:
        "Benjamin Yañez agenda autoinspeccion para una Toyota Hilux blanca patente RY SB 49. El flujo queda listo para completar el ingreso previo desde el enlace seguro.",
      completionPercent: 0,
      lastCompletedStep: 0,
      vehicleSnapshot: {
        create: {
          plate: "RY SB 49",
          vin: "8AJBA3CD7GL184926",
          make: "Toyota",
          model: "Hilux",
          year: 2021,
          color: "Blanca",
          mileage: 68420,
          fuelType: VehicleFuelType.GASOLINE,
          transmission: VehicleTransmissionType.MANUAL,
          starts: false,
        },
      },
      answers: {
        create: [
          {
            section: "customerVehicle",
            questionKey: "customer_full_name",
            questionLabel: "Nombre completo",
            answerType: SelfInspectionAnswerType.TEXT,
            answerValue: "Benjamin Yañez",
          },
          {
            section: "customerVehicle",
            questionKey: "customer_phone",
            questionLabel: "Telefono",
            answerType: SelfInspectionAnswerType.TEXT,
            answerValue: "+56 9 5555 4949",
          },
          {
            section: "customerVehicle",
            questionKey: "customer_email",
            questionLabel: "Correo",
            answerType: SelfInspectionAnswerType.TEXT,
            answerValue: "benjamin.yanez@cliente.mecaniaos.cl",
          },
          {
            section: "problem",
            questionKey: "reason_problem_type",
            questionLabel: "Tipo de problema",
            answerType: SelfInspectionAnswerType.SINGLE_CHOICE,
            answerValue: "STEERING_SUSPENSION",
            severity: SelfInspectionRiskLevel.HIGH,
          },
          {
            section: "problem",
            questionKey: "vehicle_starts",
            questionLabel: "El vehiculo enciende",
            answerType: SelfInspectionAnswerType.BOOLEAN,
            answerValue: true,
          },
          {
            section: "problem",
            questionKey: "reason_can_drive",
            questionLabel: "El vehiculo puede circular actualmente",
            answerType: SelfInspectionAnswerType.BOOLEAN,
            answerValue: true,
          },
          {
            section: "problem",
            questionKey: "reason_warning_lights",
            questionLabel: "Hay luces de advertencia encendidas",
            answerType: SelfInspectionAnswerType.BOOLEAN,
            answerValue: true,
            severity: SelfInspectionRiskLevel.HIGH,
          },
          {
            section: "problem",
            questionKey: "reason_problem_since",
            questionLabel: "Desde cuando comenzo el problema",
            answerType: SelfInspectionAnswerType.SINGLE_CHOICE,
            answerValue: "WEEKS",
          },
          {
            section: "problem",
            questionKey: "reason_issue_frequency",
            questionLabel: "El problema es constante o intermitente",
            answerType: SelfInspectionAnswerType.SINGLE_CHOICE,
            answerValue: "INTERMITTENT",
          },
          {
            section: "problem",
            questionKey: "reason_problem_description",
            questionLabel: "Descripcion breve del problema",
            answerType: SelfInspectionAnswerType.LONG_TEXT,
            answerValue: "Ruido intermitente en tren delantero al frenar y al pasar lomos de toro",
          },
        ],
      },
      photos: {
        create: [
          {
            photoType: SelfInspectionPhotoType.PRIMARY_DAMAGE,
            fileUrl: "/demo/hilux-problema.webp",
            storageKey: "seed/self-inspections/portal-cliente-hilux-rysb49-primary-damage",
            fileName: "hilux-problema.webp",
            mimeType: "image/webp",
            sizeBytes: 93630,
            sortOrder: 1,
            isRequired: true,
          },
          {
            photoType: SelfInspectionPhotoType.DAMAGE_CONTEXT,
            fileUrl: "/demo/hilux-contexto.jpg",
            storageKey: "seed/self-inspections/portal-cliente-hilux-rysb49-damage-context",
            fileName: "hilux-contexto.jpg",
            mimeType: "image/jpeg",
            sizeBytes: 11432,
            sortOrder: 2,
            isRequired: false,
          },
          {
            photoType: SelfInspectionPhotoType.DASHBOARD_ON,
            fileUrl: "/demo/hilux-tablero.jpg",
            storageKey: "seed/self-inspections/portal-cliente-hilux-rysb49-dashboard",
            fileName: "hilux-tablero.jpg",
            mimeType: "image/jpeg",
            sizeBytes: 22998,
            sortOrder: 3,
            isRequired: false,
          },
          {
            photoType: SelfInspectionPhotoType.FRONTAL_FULL,
            fileUrl: "/demo/hilux-completa.jpeg",
            storageKey: "seed/self-inspections/portal-cliente-hilux-rysb49-vehicle-full",
            fileName: "hilux-completa.jpeg",
            mimeType: "image/jpeg",
            sizeBytes: 208471,
            sortOrder: 4,
            isRequired: false,
          },
        ],
      },
      statusLogs: {
        create: [
          {
            previousStatus: null,
            nextStatus: SelfInspectionStatus.DRAFT,
            note: "Autoinspeccion creada y lista para compartir",
            changedAt: new Date("2026-03-15T12:00:00.000Z"),
          },
        ],
      },
    },
  });

  console.log("Seed listo");
  console.log(`Admin: admin@mecaniaos.local / Admin1234!`);
  console.log(`Mecanico: mecanico@mecaniaos.local / Mechanic1234!`);
  console.log(`Autoinspeccion borrador: ${selfInspectionDraft.id}`);
  console.log(`Enlace seguro: /self-inspections/start/${publicDraftToken}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
