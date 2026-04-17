FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apk add --no-cache libc6-compat
RUN corepack enable

FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app

ENV DATABASE_URL="postgresql://user:password@127.0.0.1:5432/mecaniaos?schema=public"
ENV DIRECT_URL="postgresql://user:password@127.0.0.1:5432/mecaniaos?schema=public"
ENV SESSION_SECRET="replace-this-with-a-long-random-secret-at-least-32-characters"
ENV APP_URL="https://example.com"
ENV NODE_ENV="production"

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm prisma generate
RUN pnpm build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
