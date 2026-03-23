import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { normalizeError } from "@/lib/errors";

export function apiResponse<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function apiError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: error.issues[0]?.message ?? "Datos invalidos",
        details: error.issues.map((issue) => ({
          path: issue.path.map((segment) => String(segment)),
          message: issue.message,
        })),
      },
      {
        status: 422,
      },
    );
  }

  const normalized = normalizeError(error);

  return NextResponse.json(
    {
      error: normalized.message,
    },
    {
      status: normalized.statusCode,
    },
  );
}
