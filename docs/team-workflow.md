# Flujo de trabajo del equipo

## Objetivo

Este documento define el flujo oficial de trabajo para el equipo de desarrollo de MecaniaOS. Aplica tanto para desarrolladores humanos como para asistentes de IA usados dentro de cada rama de trabajo.

La meta es mantener orden entre Jira, ramas Git, integracion en `develop` y despliegue controlado en `main`.

## Estructura de ramas

- `main`: produccion desplegada en `Vercel`.
- `develop`: rama de integracion del equipo.
- `feature/...`: nuevas funcionalidades.
- `fix/...`: correcciones de bugs o ajustes sobre funcionalidades existentes.
- `hotfix/...`: correcciones urgentes sobre produccion.

## Reglas obligatorias

- nadie trabaja directo en `main`.
- nadie trabaja directo en `develop`.
- toda rama nueva sale desde `develop`.
- toda tarea debe estar asociada a un ticket de Jira.
- toda rama debe incluir la clave del ticket.
- toda integracion hacia `develop` debe pasar por `push` a rama propia y `Pull Request`.
- `main` solo se actualiza cuando `develop` esta estable y listo para despliegue.
- todo cambio relevante debe quedar registrado en uno o mas commits en espanol.
- los mensajes de commit deben ser claros, breves y describir el cambio funcional o tecnico realizado.

## Flujo operativo esperado

1. Benjamin define o valida el ticket en Jira.
2. Benjamin define que rama corresponde a ese ticket.
3. El desarrollador crea su rama desde `develop`.
4. El desarrollador implementa el trabajo en su rama.
5. El desarrollador hace `push` a esa misma rama remota.
6. El desarrollador abre `Pull Request` hacia `develop`.
7. Benjamin revisa, coordina ajustes y aprueba la integracion.
8. El cambio se mergea a `develop`.
9. Cuando `develop` esta estable, Benjamin integra a `main`.

## Convencion de ramas

Formato recomendado:

- `feature/mos-9-portal-cliente`
- `feature/mos-10-evidencia-cliente`
- `feature/mos-7-presupuestos`
- `feature/mos-12-portal-aseguradora`
- `fix/mos-47-flujo-autoinspeccion`
- `hotfix/login-produccion`

Reglas de nombre:

- usar prefijo segun tipo de trabajo.
- incluir siempre la clave Jira en minusculas.
- usar una descripcion corta y legible.
- evitar nombres genericos como `feature/nueva-vista` o `fix/arreglo`.

## Convencion de commits

Los commits del proyecto deben escribirse en espanol para mantener un historial consistente y entendible para todo el equipo.

Reglas recomendadas:

- usar verbo en infinitivo o imperativo claro.
- describir el cambio principal y no el proceso.
- evitar mensajes vacios o genericos como `cambios`, `fix`, `update` o `avance`.
- si un commit corresponde a un ticket puntual, se puede incluir la clave Jira al inicio.

Ejemplos validos:

- `MOS-7 agregar formulario base de presupuesto`
- `MOS-63 crear flujo de OT desde presupuesto aprobado`
- `ajustar validacion de autoinspeccion`
- `corregir visibilidad de evidencias para cliente`

## Relacion con Jira

- cada historia o bug debe existir primero en Jira.
- la rama debe mapear 1 a 1 con el ticket principal cuando sea posible.
- si un ticket es demasiado grande, debe dividirse en historias o subtareas antes de implementarse.
- los `story points` y el sprint se gestionan desde Jira, no desde el nombre de la rama.

## Responsabilidades

### Benjamin Yañez

- coordinacion general del proyecto.
- definicion y mantenimiento de Jira.
- asignacion de trabajo por ticket.
- supervision de `Pull Requests`.
- merges a `develop`.
- paso de `develop` a `main`.
- apoyo transversal y fixes.

### Desarrolladores del equipo

- tomar solo tickets asignados o coordinados.
- crear su rama desde `develop`.
- trabajar exclusivamente en su propia rama.
- hacer `push` frecuente.
- abrir `PR` cuando la tarea este lista para integracion.
- avisar cuando una rama este lista para revision.

### Asistentes de IA usados por el equipo

- deben respetar este flujo de ramas y no asumir libertad para trabajar en `main` o `develop`.
- deben mantener el nombre de rama asociado al ticket Jira activo.
- deben priorizar cambios acotados al ticket asignado.
- deben evitar mezclar multiples historias no relacionadas en una sola rama.
- deben asumir que la integracion final la controla Benjamin.

## Que no se debe hacer

- trabajar directo en `main`.
- trabajar directo en `develop`.
- crear ramas sin ticket Jira asociado.
- mezclar varias historias no relacionadas en una sola rama.
- hacer merge directo a `develop` sin `PR`.
- pasar a `main` cambios no validados.

## Mensaje corto para el equipo

Instruccion base:

> Nadie trabaja directo en `main` ni en `develop`.
> Todas las ramas salen desde `develop`.
> Cada tarea debe tener ticket Jira y rama propia.
> Cuando terminen, hacen `push`, abren `PR` hacia `develop` y avisan para integrar.

## Nota de coordinacion

La asignacion concreta de integrantes a ramas puede cambiar por sprint. Lo fijo no es quien toma cada ticket, sino el flujo:

- ticket en Jira
- rama propia desde `develop`
- trabajo aislado
- `PR` a `develop`
- integracion controlada
- promocion posterior a `main`
