# Deploy en Ubuntu

## Estado actual de la app

- La app usa `Prisma` contra PostgreSQL.
- Hoy no existe integracion activa con `@supabase/supabase-js`.
- La autenticacion es propia, basada en sesiones guardadas en la tabla `Session`.
- Las fotos de autoinspeccion se guardan en disco local bajo `public/uploads/self-inspections`.

Eso significa que Supabase puede seguir siendo el backend de base de datos, pero en este repo se usa como PostgreSQL remoto, no como Auth o Storage.

## Variables necesarias

Crear `.env.production` a partir de `.env.production.example`:

```env
DATABASE_URL="postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&schema=public"
DIRECT_URL="postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres?schema=public&sslmode=require"
SESSION_SECRET="replace-with-a-long-random-secret-at-least-32-characters"
APP_URL="https://app.your-domain.com"
NODE_ENV="production"
SUPABASE_URL="https://<project-ref>.supabase.co"
```

## Opcion 1: Node.js sin Docker

1. Instalar Node.js 22 y pnpm.
2. Clonar el repo.
3. Crear `.env.production`.
4. Instalar dependencias con `pnpm install --frozen-lockfile`.
5. Generar Prisma Client con `pnpm db:generate`.
6. Aplicar migraciones o sincronizar esquema:
   - recomendado en cambios controlados: `pnpm prisma migrate deploy`
   - si el proyecto aun depende de `db push`: `pnpm db:push`
7. Compilar con `pnpm build`.
8. Iniciar con `pnpm start`.

## Opcion 2: Docker

1. Copiar `.env.production.example` a `.env.production`.
2. Ajustar dominio y credenciales de Supabase.
3. Levantar con `docker compose -f docker-compose.prod.yml up -d --build`.
4. Publicar el puerto `3000` detras de Nginx o Caddy.

## Recomendaciones operativas

- Montar `public/uploads` en volumen persistente. Si no, las fotos subidas se pierden al recrear el contenedor.
- Terminar TLS en Nginx o Caddy y exponer la app solo por proxy reverso.
- Definir `APP_URL` con el dominio publico final para evitar cookies o enlaces inconsistentes.
- Mantener `DATABASE_URL` apuntando al pooler de Supabase y `DIRECT_URL` a la conexion directa para tareas de Prisma.
- Si en el futuro quieren usar Supabase Storage para fotos, ahi si conviene reemplazar la capa de `self-inspection.storage.ts`.
