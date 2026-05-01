# MecaniaOS

Plataforma de gestion operativa para talleres mecanicos.

## Stack

- Next.js 16
- TypeScript
- Prisma 6.18
- PostgreSQL
- Tailwind CSS 4
- Zod
- Autenticacion por sesion con cookie `httpOnly`

## Arquitectura

Se usa un monolito modular: la UI y la API viven en el mismo proyecto, pero la logica de negocio queda separada por dominios dentro de `src/modules`.

Documentacion base:

- `docs/architecture.md`
- `docs/implementation-plan.md`

## Estructura

```text
.
|-- docs/
|-- prisma/
|-- src/
|   |-- app/
|   |   |-- api/
|   |   |-- login/
|   |   `-- (protected)/
|   |-- components/
|   |-- lib/
|   `-- modules/
|-- .env.example
`-- README.md
```

## Módulos implementados en Sprint 1

- Autenticación
- Clientes
- Vehículos
- Órdenes de trabajo
- Estados de reparación
- Historial técnico
- Inspección Autónoma (Self-Inspection)

## Objetivos del Sprint 2 (En Desarrollo)

**Módulo de Inventario:**
- Control stock de repuestos (MOS-6)
- Consulta de stock y alertas de mínimo (MOS-86)
- Registro de ingreso por reposición (MOS-84)
- Ajuste manual de inventario (MOS-87)
- Descuento automático por OTs (MOS-85)

**Módulo de Presupuestos:**
- Generar presupuesto desglosado (MOS-7)
- Enviar presupuesto a cliente/aseguradora (MOS-61)
- Aprobar presupuesto (MOS-11)
- Rechazar presupuesto (MOS-62)
- Convertir en Orden de Trabajo (MOS-63)

## Variables de entorno

Crear `.env` o `.env.local` usando [`.env.example`](/C:/Users/nacho/OneDrive/Escritorio/MecaniaOS/MecaniaOS/.env.example) como base.

Para Supabase y deploy en servidor ahora se usan estas variables:

```env
DATABASE_URL="postgresql://postgres.PROJECT_REF:YOUR_DB_PASSWORD@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
DIRECT_URL="postgresql://postgres.PROJECT_REF:YOUR_DB_PASSWORD@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
SESSION_SECRET="replace-this-with-a-long-random-secret"
APP_URL="https://your-domain.com"
SUPABASE_URL="https://PROJECT_REF.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
SUPABASE_STORAGE_BUCKET_SELF_INSPECTIONS="self-inspections"
SUPABASE_STORAGE_BUCKET_WORK_ORDERS="work-orders"
BOOTSTRAP_ADMIN_NAME="Administrador"
BOOTSTRAP_ADMIN_EMAIL="admin@your-domain.com"
BOOTSTRAP_ADMIN_PASSWORD="replace-this-admin-password"
```

Notas:

- `DATABASE_URL` y `DIRECT_URL` usan el `pooler` de Supabase para evitar problemas de conectividad IPv6 en servidores.
- Los buckets `self-inspections` y `work-orders` deben existir en Supabase Storage.
- Si defines `BOOTSTRAP_ADMIN_*`, el contenedor crea o reactiva un administrador al arrancar.

## Ejecucion local

### Si cambias a una rama nueva de Sprint 2

Cada vez que hagas checkout de una rama que cambie Prisma o datos base, corre estos pasos antes de probar:

```bash
pnpm install
pnpm db:generate
pnpm db:push
pnpm db:seed
```

Esto es especialmente importante en ramas como inventario y presupuestos, porque si no cargas los datos iniciales puedes quedar con catalogos vacios y el flujo se ve roto aunque el codigo este bien.

1. Instalar dependencias:

```bash
pnpm install
```

2. Levantar PostgreSQL con Docker:

```bash
pnpm docker:db:up
```

3. Generar cliente de Prisma:

```bash
pnpm db:generate
```

4. Crear la base o aplicar esquema:

```bash
pnpm db:push
```

5. Cargar datos iniciales:

```bash
pnpm db:seed
```

6. Levantar la aplicacion:

```bash
pnpm dev
```

## Flujo con Docker

Para desarrollo local rapido ahora hay dos modos separados:

### Modo recomendado para desarrollar y ver cambios rapido

Este modo levanta la app en Docker con hot reload, sin rebuild por cada cambio y sin tocar la configuracion de Dockploy:

```bash
pnpm docker:dev:up
```

Luego abre:

```text
http://localhost:3000/login
```

Comandos utiles de este modo:

- `pnpm docker:dev:up`
- `pnpm docker:dev:down`
- `pnpm docker:dev:logs`
- `pnpm docker:dev:db:push`
- `pnpm docker:dev:seed`
- `pnpm docker:dev:reset`

Notas:

- Los cambios en `src/` se reflejan sin reconstruir la imagen.
- `pnpm docker:dev:up` reconstruye solo la imagen liviana de dependencias cuando hace falta; los cambios normales de codigo se ven por hot reload.
- `pnpm db:push` corre al arrancar el contenedor para evitar desajustes de schema en local.
- Si cambias dependencias o Prisma y algo queda raro, usa `pnpm docker:dev:reset` y luego `pnpm docker:dev:up`.

### Modo de imagen de produccion local

Esto deja la app local parecida al deploy, util para validar una build cerrada:

```bash
pnpm docker:app:up
```

### Solo base de datos local

- `pnpm docker:db:up`
- `pnpm docker:db:down`
- `pnpm docker:db:logs`

## Supabase

La fuente de verdad de base de datos para deploy es Supabase.

Migraciones versionadas:

- [supabase/migrations/20260428180241_remote_schema.sql](/C:/Users/nacho/OneDrive/Escritorio/MecaniaOS/MecaniaOS/supabase/migrations/20260428180241_remote_schema.sql)
- [supabase/migrations/20260428194000_budget_inventory_alignment.sql](/C:/Users/nacho/OneDrive/Escritorio/MecaniaOS/MecaniaOS/supabase/migrations/20260428194000_budget_inventory_alignment.sql)

Para aplicar cambios del repo al proyecto enlazado:

```bash
npx supabase db push --linked
```

## Dockploy

Deje listo [docker-compose.dockploy.yml](/C:/Users/nacho/OneDrive/Escritorio/MecaniaOS/MecaniaOS/docker-compose.dockploy.yml) para desplegar `main` en Dockploy.

Flujo recomendado:

1. En Dockploy crear el servicio usando `docker-compose.dockploy.yml`.
2. Cargar las variables del bloque `.env.example`.
3. Confirmar que `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` y los buckets esten configurados.
4. Si es el primer deploy, dejar `BOOTSTRAP_ADMIN_*` cargado para crear el acceso inicial.
5. Desplegar.

Comandos utiles para simular el deploy en local:

```bash
pnpm docker:prod:up
pnpm docker:prod:down
```

## Datos iniciales

`pnpm db:seed` carga catalogos y registros base para desarrollo local.

## Scripts

- `pnpm dev`
- `pnpm build`
- `pnpm start`
- `pnpm start:prod`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm db:generate`
- `pnpm db:push`
- `pnpm db:migrate`
- `pnpm db:seed`
- `pnpm db:bootstrap`
- `pnpm studio`
- `pnpm docker:db:up`
- `pnpm docker:db:down`
- `pnpm docker:db:logs`
- `pnpm docker:dev:up`
- `pnpm docker:dev:down`
- `pnpm docker:dev:logs`
- `pnpm docker:dev:db:push`
- `pnpm docker:dev:seed`
- `pnpm docker:dev:reset`
- `pnpm docker:app:up`
- `pnpm docker:app:down`
- `pnpm docker:prod:up`
- `pnpm docker:prod:down`

## Endpoints base

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/clients`
- `POST /api/clients`
- `GET /api/clients/:id`
- `PATCH /api/clients/:id`
- `GET /api/vehicles`
- `POST /api/vehicles`
- `GET /api/vehicles/:id`
- `PATCH /api/vehicles/:id`
- `GET /api/vehicles/search?vin=...&plate=...`
- `GET /api/vehicles/:id/history`
- `GET /api/vehicles/history/search?vin=...`
- `GET /api/work-orders`
- `POST /api/work-orders`
- `GET /api/work-orders/:id`
- `PATCH /api/work-orders/:id`
- `PATCH /api/work-orders/:id/status`

## Siguiente fase sugerida

- Inventario basico
- Cotizaciones
- Evidencias fotograficas
- Portal cliente
