# Plan de implementacion MVP

## Arquitectura objetivo

- Monolito modular con `Next.js 16`, `App Router`, `TypeScript`, `Prisma` y `PostgreSQL`.
- UI y API en el mismo proyecto para acelerar el MVP sin sacrificar separacion de responsabilidades.
- Logica de negocio encapsulada por modulo dentro de `src/modules`.
- Persistencia centralizada en Prisma.
- Autenticacion basada en sesiones con cookie `httpOnly` y control de roles.

## Fases

### Fase 0. Fundacion tecnica

- Inicializacion de proyecto y convenciones.
- Configuracion de Tailwind, Prisma, variables de entorno y utilidades compartidas.
- Definicion del esquema base de datos.
- Seeds iniciales.

### Fase 1. Base del sistema

- Autenticacion con sesiones seguras.
- Usuarios y roles `ADMIN`, `MECHANIC`, `CUSTOMER`.
- Layout protegido y middleware.
- Dashboard interno inicial.

### Fase 2. Maestro operacional

- CRUD base de clientes.
- CRUD base de vehiculos.
- Validaciones de VIN y patente.
- Busqueda por VIN y patente.

### Fase 3. Nucleo operativo

- Creacion y listado de ordenes de trabajo.
- Estados de reparacion.
- Bitacora de cambios de estado para trazabilidad.
- Historial tecnico por vehiculo y VIN.

### Fase 4. Complementos del MVP (Sprint 2 - En Desarrollo)

**Fase 4.1 Inventario de Repuestos**
- Control de inventario de repuestos (MOS-17 / MOS-6).
- Registro de ingresos de stock de repuestos (MOS-84).
- Ajustes manuales justificados (MOS-87).
- Consultas de disponibilidad y alertas de stock bajo (MOS-86).
- Descuento automático por partes utilizadas en Orden de Trabajo (MOS-85).

**Fase 4.2 Presupuestos / Cotizaciones**
- Emisión de presupuesto asociado a orden/vehículo con desglose de mano de obra, repuestos y suministros (MOS-19 / MOS-7).
- Envío de presupuesto al cliente o aseguradora (MOS-61).
- Flujo de Aprobación (MOS-11) y Rechazo (MOS-62).
- Conversión a Orden de Trabajo sin duplicar datos (MOS-63).

**Fase 4.3 Expansión Futura**
- Evidencias fotograficas (Integración completa desde Self-Inspection).
- Portal cliente.

### Fase 5. Evolutivos

- Proveedores.
- Aseguradoras.
- Pagos.
- Analitica y alertas.

## Sprint 1 implementado en esta base

- Autenticacion.
- Clientes.
- Vehiculos.
- Ordenes de trabajo.
- Estados de reparacion.
- Historial tecnico.
- Self-Inspection (Inspección Autónoma con enlace seguro).
