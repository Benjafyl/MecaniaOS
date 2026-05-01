#!/bin/sh
set -eu

echo "Sincronizando esquema Prisma..."
pnpm db:push

if [ -n "${BOOTSTRAP_ADMIN_EMAIL:-}" ] && [ -n "${BOOTSTRAP_ADMIN_PASSWORD:-}" ]; then
  echo "Verificando administrador inicial..."
  pnpm db:bootstrap
fi

echo "Iniciando app..."
exec pnpm start
