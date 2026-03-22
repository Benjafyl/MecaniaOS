import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { AppError } from "@/lib/errors";

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const mimeExtensionMap: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

function getUploadsRoot() {
  return path.join(process.cwd(), "public", "uploads", "work-orders");
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function resolveFileExtension(fileName: string, mimeType: string) {
  const explicitExtension = path.extname(fileName);

  if (explicitExtension) {
    return explicitExtension.toLowerCase();
  }

  return mimeExtensionMap[mimeType] ?? ".jpg";
}

export function validateWorkOrderEvidenceFile(file: File) {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new AppError("Formato no permitido. Usa JPG, PNG o WEBP.", 422);
  }

  if (file.size <= 0) {
    throw new AppError("El archivo enviado esta vacio.", 422);
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new AppError("La imagen supera el tamano maximo de 8 MB.", 422);
  }
}

export async function saveWorkOrderEvidenceFile(input: {
  workOrderId: string;
  file: File;
}) {
  validateWorkOrderEvidenceFile(input.file);

  const orderDir = path.join(getUploadsRoot(), input.workOrderId);
  await mkdir(orderDir, { recursive: true });

  const extension = resolveFileExtension(input.file.name, input.file.type);
  const safeOriginalName = sanitizeFileName(
    path.basename(input.file.name, path.extname(input.file.name)) || "evidence",
  );
  const finalFileName = `evidence-${safeOriginalName}-${randomUUID()}${extension}`;
  const storageKey = path.posix.join("uploads", "work-orders", input.workOrderId, finalFileName);
  const absoluteFilePath = path.join(getUploadsRoot(), input.workOrderId, finalFileName);
  const buffer = Buffer.from(await input.file.arrayBuffer());

  await writeFile(absoluteFilePath, buffer);

  return {
    storageKey,
    fileUrl: `/${storageKey}`,
    fileName: input.file.name,
    mimeType: input.file.type,
    sizeBytes: input.file.size,
  };
}

export async function deleteWorkOrderEvidenceFile(storageKey: string) {
  const absoluteFilePath = path.join(process.cwd(), "public", storageKey);

  await unlink(absoluteFilePath).catch(() => undefined);
}
