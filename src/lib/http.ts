import { NextResponse } from "next/server";

import { normalizeError } from "@/lib/errors";

export function apiResponse<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function apiError(error: unknown) {
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
