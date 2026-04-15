import { z } from "zod";

const booleanFromEnv = z.preprocess((value) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["1", "true", "yes", "on"].includes(normalized)) {
      return true;
    }

    if (["0", "false", "no", "off", ""].includes(normalized)) {
      return false;
    }
  }

  return value;
}, z.boolean());

const envSchema = z.object({
  DATABASE_URL: z.url(),
  SESSION_SECRET: z.string().min(32),
  APP_URL: z.url().default("http://localhost:3000"),
  SUPABASE_URL: z.url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  SUPABASE_STORAGE_BUCKET_SELF_INSPECTIONS: z.string().min(1).optional(),
  SUPABASE_STORAGE_BUCKET_WORK_ORDERS: z.string().min(1).optional(),
  DEMO_MODE: booleanFromEnv.default(false),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,
  APP_URL: process.env.APP_URL,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_STORAGE_BUCKET_SELF_INSPECTIONS: process.env.SUPABASE_STORAGE_BUCKET_SELF_INSPECTIONS,
  SUPABASE_STORAGE_BUCKET_WORK_ORDERS: process.env.SUPABASE_STORAGE_BUCKET_WORK_ORDERS,
  DEMO_MODE: process.env.DEMO_MODE,
  NODE_ENV: process.env.NODE_ENV,
});
