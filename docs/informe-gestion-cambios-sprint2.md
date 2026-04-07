# Informe de Gestión de Cambios y Planificación del Sprint 2

**Proyecto:** MecaniaOS
**Fechas de Planificación:** [Insertar Fecha Actual]

## 1. Resumen Ejecutivo
El presente documento describe la gestión de cambios aplicada al proyecto MecaniaOS. El objetivo principal de esta fase de gestión fue saldar la **deuda técnica a nivel documental y arquitectónico**, integrando los desarrollos de semanas anteriores (específicamente la Inspección Autónoma) dentro del hilo principal del proyecto, y sentando las bases técnico-documentales detalladas para el inicio del **Sprint 2**.

## 2. Mitigación de Deuda Técnica (Documental)
Se detectó que el módulo de **Self-Inspection (Inspección Autónoma)** había sido construido con éxito pero se encontraba desvinculado de la documentación base, del modelo de componentes y del diagrama de arquitectura central del proyecto. 

Para solucionar esto, se realizaron las siguientes acciones:
- **Integración al README**: Se actualizó la bitácora principal del repositorio para incluir el módulo de *Self-Inspection* como hito oficial completado del Sprint 1.
- **Plan de Implementación Refactorizado**: Se organizaron los avances en el archivo `docs/implementation-plan.md`, dejando la *Fase 4* lista para abarcar los incrementos operativos del nuevo ciclo.

## 3. Planificación y Alcance del Sprint 2
Se han analizado las historias de usuario y se han divido los nuevos requerimientos funcionales en dos grandes epopeyas (*Epics*) tecnológicas:

### Módulo de Inventario de Repuestos (Fase 4.1)
El sistema permitirá el control estricto de las unidades físicas o *repuestos* del taller. Quedan excluidos del modelo de inventario detallado los "suministros" misceláneos (que serán manejados por cargos de texto libre), enfocando la base de datos en piezas de alto valor.
* **MOS-6:** Controlar el stock de repuestos para evitar quiebres de planificación.
* **MOS-84:** Registrar los ingresos por reposición de compras.
* **MOS-85:** Descuentos automáticos al vincular repuestos a una Orden de Trabajo.
* **MOS-86:** Vista de consultas de inventario disponible y detección de stock mínimo (alertas).
* **MOS-87:** Soporte para justificar ajustes manuales de stock en caso de desviaciones de la vida real.

### Módulo de Presupuestos y Cotizaciones (Fase 4.2)
El sistema introducirá un ciclo de vida comercial previo a la ejecución mecánica, logrando el desglose financiero del trabajo.
* **MOS-7:** Generar presupuesto base con agrupación de Mano de Obra, Repuestos y Suministros integrados.
* **MOS-61:** Enviar/Dejar disponible para la revisión del cliente o aseguradora.
* **Flujo de Aprobación Comercial:** Capacidad de Aprobar (MOS-11) o Rechazar (MOS-62) los presupuestos antes de comprometer la mecánica.
* **MOS-63:** Conversión automática del presupuesto en Orden de Trabajo directa (Work Order) para evitar burocracia de doble ingreso.

## 4. Evolución de la Arquitectura de Software
Para soportar el Sprint 2, la arquitectura y los modelos de datos sufrieron una maduración integral, reflejada en los nuevos Modelos UML. 

**Nuevas Entidades y Vínculos:**
- Entidad `QUOTE` (Presupuestos), que se asocia tanto a un `CLIENT` como a un `VEHICLE` (incluso pudiendo derivar de un `SELF_INSPECTION` previo).
- Un `QUOTE` puede tener múltiples `QUOTE_ITEM`, los cuales opcionalmente hacen referencia al catálogo formal de `PART` (Repuestos del inventario) o simplemente representan líneas de servicio.
- Finalmente, se implementó el vínculo transaccional `PART_CONSUMPTION` dictaminado por una `WORK_ORDER`, cerrando el lazo entre el taller mecánico y la lógica de contabilidad de repuestos.

*(Se adjuntan los esquemas UML Entidad-Relación y Máquina de Estados del proceso de Presupuestación generados en el archivo architecture.md)*

**[ PEGAR FOTO DEL DIAGRAMA ENTIDAD-RELACIÓN AQUÍ ]**
*Figura 1: Modelo Entidad-Relación mostrando la integración estructural de los nuevos Módulos de Presupuestos (Quotes) e Inventario (Parts) con las Órdenes de Trabajo.*

**[ PEGAR FOTO DE LA MÁQUINA DE ESTADOS AQUÍ ]**
*Figura 2: Diagrama de Máquina de Estados representando el ciclo de vida transaccional de un presupuesto comercial (Draft, Envío, Aprobación, y Conversión).*

---
*Informe generado tras la sesión de planificación arquitectónica y refactorización documental.*
