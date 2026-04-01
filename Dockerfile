FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apk add --no-cache libc6-compat
RUN corepack enable

FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app

ARG DATABASE_URL="postgresql://postgres:postgres@db:5432/mecaniaos?schema=public"
ARG SESSION_SECRET="replace-this-with-a-long-random-secret-123"
ARG APP_URL="http://localhost:3000"
ARG SUPABASE_URL=""
ARG SUPABASE_SERVICE_ROLE_KEY=""
ARG SUPABASE_STORAGE_BUCKET_SELF_INSPECTIONS=""
ARG SUPABASE_STORAGE_BUCKET_WORK_ORDERS=""

ENV DATABASE_URL="postgresql://postgres:postgres@db:5432/mecaniaos?schema=public"
ENV SESSION_SECRET="replace-this-with-a-long-random-secret-123"
ENV APP_URL="http://localhost:3000"
ENV SUPABASE_URL="${SUPABASE_URL}"
ENV SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY}"
ENV SUPABASE_STORAGE_BUCKET_SELF_INSPECTIONS="${SUPABASE_STORAGE_BUCKET_SELF_INSPECTIONS}"
ENV SUPABASE_STORAGE_BUCKET_WORK_ORDERS="${SUPABASE_STORAGE_BUCKET_WORK_ORDERS}"

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm prisma generate
RUN pnpm build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["pnpm", "start"]
