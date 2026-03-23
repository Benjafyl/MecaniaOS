import { env } from "@/lib/env";
import { AppError } from "@/lib/errors";

function requireStorageEnv() {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new AppError("Falta SUPABASE_SERVICE_ROLE_KEY en el entorno.", 500);
  }
}

function encodeStoragePath(storageKey: string) {
  return storageKey
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

async function storageRequest(path: string, init?: RequestInit) {
  requireStorageEnv();
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY as string;

  const response = await fetch(`${env.SUPABASE_URL}/storage/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new AppError(`No fue posible operar con Storage: ${detail}`, response.status);
  }

  return response;
}

export function buildPublicStorageUrl(bucket: string, storageKey: string) {
  return `${env.SUPABASE_URL}/storage/v1/object/public/${bucket}/${encodeStoragePath(storageKey)}`;
}

export async function uploadPublicStorageObject(input: {
  bucket: string;
  storageKey: string;
  file: File;
  upsert?: boolean;
}) {
  const buffer = Buffer.from(await input.file.arrayBuffer());

  await storageRequest(`/object/${input.bucket}/${encodeStoragePath(input.storageKey)}`, {
    method: "POST",
    headers: {
      "Content-Type": input.file.type,
      "x-upsert": input.upsert ? "true" : "false",
    },
    body: buffer,
  });

  return {
    storageKey: input.storageKey,
    fileUrl: buildPublicStorageUrl(input.bucket, input.storageKey),
    fileName: input.file.name,
    mimeType: input.file.type,
    sizeBytes: input.file.size,
  };
}

export async function deleteStorageObject(bucket: string, storageKey: string) {
  await storageRequest(`/object/${bucket}/${encodeStoragePath(storageKey)}`, {
    method: "DELETE",
  }).catch(() => undefined);
}
