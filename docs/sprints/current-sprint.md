# Sprint 1

- Project: MOS
- Board ID: 100
- State: active
- Synced at: 2026-03-22T23:13:30.925Z
- Goal: Consolidar el nucleo funcional actual de MecaniaOS, asegurando la gestion basica de clientes, vehiculos y ordenes de trabajo, junto con el flujo inicial de autoinspeccion y la base minima de control de acceso por roles.

## Issues

### MOS-1 - Registrar clientes
- Status: Finalizada
- Type: Historia
- Priority: High
- Jira: https://uandresbello-team-bg7iosbc.atlassian.net/browse/MOS-1

Description:
Como administrador, quiero registrar clientes para asociarlos a vehiculos y servicios.

Acceptance Criteria:
- El formulario solicita al menos nombre completo, telefono y correo electronico.
- El sistema valida los campos obligatorios antes de guardar.
- El cliente queda registrado y disponible para asociar vehiculos y ordenes de trabajo.
- El listado de clientes refleja el nuevo registro luego del guardado.

Acceptance Criteria:
- El formulario solicita al menos nombre completo, telefono y correo electronico.
- El sistema valida los campos obligatorios antes de guardar.
- El cliente queda registrado y disponible para asociar vehiculos y ordenes de trabajo.
- El listado de clientes refleja el nuevo registro luego del guardado.

### MOS-2 - Registrar vehículos
- Status: Finalizada
- Type: Historia
- Priority: High
- Jira: https://uandresbello-team-bg7iosbc.atlassian.net/browse/MOS-2

Description:
Como mecanico, quiero registrar vehiculos por VIN para mantener historial tecnico.

Acceptance Criteria:
- El formulario permite asociar el vehiculo a un cliente existente.
- El sistema solicita al menos VIN, marca, modelo y anio.
- El VIN debe ser unico y validarse antes de guardar.
- El vehiculo registrado queda disponible para ordenes de trabajo e historial tecnico.

Acceptance Criteria:
- El formulario permite asociar el vehiculo a un cliente existente.
- El sistema solicita al menos VIN, marca, modelo y anio.
- El VIN debe ser unico y validarse antes de guardar.
- El vehiculo registrado queda disponible para ordenes de trabajo e historial tecnico.

### MOS-3 - Crear orden de trabajo
- Status: Finalizada
- Type: Historia
- Priority: High
- Jira: https://uandresbello-team-bg7iosbc.atlassian.net/browse/MOS-3

Description:
Como mecanico, quiero crear una orden de trabajo para registrar la mantencion del vehiculo.

Acceptance Criteria:
- La orden de trabajo se puede crear seleccionando cliente y vehiculo existentes.
- El sistema solicita al menos motivo de ingreso y fecha de ingreso.
- Al crear la orden, se genera un numero identificador unico.
- La orden creada queda visible en el listado general y en el detalle del vehiculo.

Acceptance Criteria:
- La orden de trabajo se puede crear seleccionando cliente y vehiculo existentes.
- El sistema solicita al menos motivo de ingreso y fecha de ingreso.
- Al crear la orden, se genera un numero identificador unico.
- La orden creada queda visible en el listado general y en el detalle del vehiculo.

### MOS-4 - Actualizar estado de reparación
- Status: Finalizada
- Type: Historia
- Priority: High
- Jira: https://uandresbello-team-bg7iosbc.atlassian.net/browse/MOS-4

Description:
Como mecanico, quiero actualizar el estado del servicio para informar el progreso.

Acceptance Criteria:
- Una orden de trabajo permite cambiar su estado dentro del flujo definido.
- Cada cambio de estado queda reflejado inmediatamente en la vista de la orden.
- El sistema conserva un historial de cambios de estado con fecha.
- El estado actualizado aparece en los listados y vistas relacionadas.

Acceptance Criteria:
- Una orden de trabajo permite cambiar su estado dentro del flujo definido.
- Cada cambio de estado queda reflejado inmediatamente en la vista de la orden.
- El sistema conserva un historial de cambios de estado con fecha.
- El estado actualizado aparece en los listados y vistas relacionadas.

### MOS-5 - Consultar historial del vehículo
- Status: Finalizada
- Type: Historia
- Priority: High
- Jira: https://uandresbello-team-bg7iosbc.atlassian.net/browse/MOS-5

Description:
Como mecanico, quiero revisar el historial del vehiculo para diagnosticar mejor.

Acceptance Criteria:
- Desde el vehiculo se puede consultar el historial de ordenes de trabajo previas.
- El historial muestra al menos fecha, motivo y estado de cada orden.
- La informacion se presenta ordenada de la mas reciente a la mas antigua.
- El historial se puede consultar sin editar registros previos.

Acceptance Criteria:
- Desde el vehiculo se puede consultar el historial de ordenes de trabajo previas.
- El historial muestra al menos fecha, motivo y estado de cada orden.
- La informacion se presenta ordenada de la mas reciente a la mas antigua.
- El historial se puede consultar sin editar registros previos.

### MOS-46 - Generar enlace seguro de autoinspección
- Status: Finalizada
- Type: Historia
- Priority: Medium
- Jira: https://uandresbello-team-bg7iosbc.atlassian.net/browse/MOS-46

Description:
Como cliente, quiero recibir un enlace seguro para acceder a mi autoinspeccion, para completar el proceso sin necesidad de credenciales complejas.

Acceptance Criteria:
- El sistema puede generar un enlace unico asociado a una autoinspeccion.
- El enlace permite acceder al flujo de autoinspeccion sin iniciar sesion tradicional.
- El enlace queda asociado al cliente o vehiculo correcto.
- Si el enlace no existe o no es valido, el sistema bloquea el acceso.

Acceptance Criteria:
- El sistema puede generar un enlace unico asociado a una autoinspeccion.
- El enlace permite acceder al flujo de autoinspeccion sin iniciar sesion tradicional.
- El enlace queda asociado al cliente o vehiculo correcto.
- Si el enlace no existe o no es valido, el sistema bloquea el acceso.

### MOS-47 - Completar autoinspección guiada
- Status: Finalizada
- Type: Historia
- Priority: Medium
- Jira: https://uandresbello-team-bg7iosbc.atlassian.net/browse/MOS-47

Description:
Como cliente, quiero completar un formulario guiado de autoinspeccion, para reportar el estado de mi vehiculo de forma clara y estructurada.

Acceptance Criteria:
- El flujo de autoinspeccion muestra pasos o secciones claramente diferenciadas.
- El cliente puede responder preguntas clave del estado del vehiculo.
- El sistema guarda las respuestas estructuradas por seccion o pregunta.
- El progreso de la autoinspeccion permite identificar el avance actual.

Acceptance Criteria:
- El flujo de autoinspeccion muestra pasos o secciones claramente diferenciadas.
- El cliente puede responder preguntas clave del estado del vehiculo.
- El sistema guarda las respuestas estructuradas por seccion o pregunta.
- El progreso de la autoinspeccion permite identificar el avance actual.

### MOS-48 - Adjuntar fotos obligatorias del vehículo
- Status: Finalizada
- Type: Historia
- Priority: Medium
- Jira: https://uandresbello-team-bg7iosbc.atlassian.net/browse/MOS-48

Description:
Como cliente, quiero subir fotos de mi vehiculo durante la autoinspeccion, para que el taller pueda evaluar visualmente los danos.

Acceptance Criteria:
- El flujo exige cargar las fotos obligatorias definidas por la autoinspeccion.
- El sistema valida formato y tamano basico de los archivos antes de guardar.
- Cada foto queda asociada a la autoinspeccion correcta.
- Las fotos cargadas quedan visibles para revision posterior del taller.

Acceptance Criteria:
- El flujo exige cargar las fotos obligatorias definidas por la autoinspeccion.
- El sistema valida formato y tamano basico de los archivos antes de guardar.
- Cada foto queda asociada a la autoinspeccion correcta.
- Las fotos cargadas quedan visibles para revision posterior del taller.

### MOS-49 - Guardar autoinspección en borrador
- Status: Finalizada
- Type: Historia
- Priority: Medium
- Jira: https://uandresbello-team-bg7iosbc.atlassian.net/browse/MOS-49

Description:
Como cliente, quiero guardar mi autoinspeccion sin terminar, para poder continuarla posteriormente.

Acceptance Criteria:
- El cliente puede guardar una autoinspeccion incompleta sin enviarla al taller.
- El sistema conserva respuestas, fotos y avances ya ingresados.
- Al reingresar con el enlace, la autoinspeccion se retoma desde el estado guardado.
- Una autoinspeccion en borrador no debe marcarse como enviada.

Acceptance Criteria:
- El cliente puede guardar una autoinspeccion incompleta sin enviarla al taller.
- El sistema conserva respuestas, fotos y avances ya ingresados.
- Al reingresar con el enlace, la autoinspeccion se retoma desde el estado guardado.
- Una autoinspeccion en borrador no debe marcarse como enviada.

### MOS-50 - Enviar autoinspección al taller
- Status: Finalizada
- Type: Historia
- Priority: Medium
- Jira: https://uandresbello-team-bg7iosbc.atlassian.net/browse/MOS-50

Description:
Como cliente, quiero enviar la autoinspeccion completa, para que el taller pueda iniciar el diagnostico del vehiculo.

Acceptance Criteria:
- El cliente puede enviar la autoinspeccion solo cuando los datos requeridos estan completos.
- Al enviar, el estado de la autoinspeccion cambia a enviado o equivalente.
- Una vez enviada, la autoinspeccion queda disponible para revision interna.
- El sistema evita envios duplicados accidentales.

Acceptance Criteria:
- El cliente puede enviar la autoinspeccion solo cuando los datos requeridos estan completos.
- Al enviar, el estado de la autoinspeccion cambia a enviado o equivalente.
- Una vez enviada, la autoinspeccion queda disponible para revision interna.
- El sistema evita envios duplicados accidentales.

### MOS-51 - Revisar autoinspección internamente
- Status: Finalizada
- Type: Historia
- Priority: Medium
- Jira: https://uandresbello-team-bg7iosbc.atlassian.net/browse/MOS-51

Description:
Como mecanico, quiero revisar la autoinspeccion enviada por el cliente, para analizar el estado del vehiculo antes de su ingreso al taller.

Acceptance Criteria:
- El usuario interno puede abrir el detalle completo de una autoinspeccion enviada.
- La revision muestra respuestas, fotos y datos principales del vehiculo.
- La pantalla permite registrar observaciones o una conclusion inicial.
- El resultado de la revision queda persistido para consulta posterior.

Acceptance Criteria:
- El usuario interno puede abrir el detalle completo de una autoinspeccion enviada.
- La revision muestra respuestas, fotos y datos principales del vehiculo.
- La pantalla permite registrar observaciones o una conclusion inicial.
- El resultado de la revision queda persistido para consulta posterior.

### MOS-52 - Adjuntar evidencias a orden de trabajo
- Status: Finalizada
- Type: Historia
- Priority: Medium
- Jira: https://uandresbello-team-bg7iosbc.atlassian.net/browse/MOS-52

Description:
Como mecanico, quiero adjuntar imagenes a una orden, para documentar la reparacion.

Acceptance Criteria:
- Una orden de trabajo permite adjuntar una o mas evidencias visuales.
- Cada evidencia queda asociada a la orden correcta.
- El sistema registra al menos archivo, fecha y contexto basico de la evidencia.
- Las evidencias adjuntas quedan disponibles para visualizacion posterior.

Acceptance Criteria:
- Una orden de trabajo permite adjuntar una o mas evidencias visuales.
- Cada evidencia queda asociada a la orden correcta.
- El sistema registra al menos archivo, fecha y contexto basico de la evidencia.
- Las evidencias adjuntas quedan disponibles para visualizacion posterior.

### MOS-53 - Adjuntar evidencias a orden de trabajo
- Status: Finalizada
- Type: Historia
- Priority: Medium
- Jira: https://uandresbello-team-bg7iosbc.atlassian.net/browse/MOS-53

Description:
Como usuario interno, quiero ver todas las evidencias, para analizar el historial visual.

Acceptance Criteria:
- El usuario interno puede visualizar las evidencias asociadas a una orden o autoinspeccion.
- La interfaz muestra las evidencias de forma ordenada y accesible.
- Cada evidencia conserva su contexto de origen.
- La consulta de evidencias no requiere modificar la informacion almacenada.

Acceptance Criteria:
- El usuario interno puede visualizar las evidencias asociadas a una orden o autoinspeccion.
- La interfaz muestra las evidencias de forma ordenada y accesible.
- Cada evidencia conserva su contexto de origen.
- La consulta de evidencias no requiere modificar la informacion almacenada.

### MOS-54 - Registrar usuarios internos
- Status: Finalizada
- Type: Historia
- Priority: Medium
- Jira: https://uandresbello-team-bg7iosbc.atlassian.net/browse/MOS-54

Description:
Como administrador, quiero crear usuarios internos en el sistema, para permitir el acceso controlado de los miembros del taller.

Acceptance Criteria:
- El administrador puede registrar un usuario interno con nombre, correo y credenciales iniciales.
- El correo del usuario debe ser unico dentro del sistema.
- El usuario creado queda habilitado para iniciar sesion segun su estado.
- El registro de usuarios internos queda disponible para administracion posterior.

Acceptance Criteria:
- El administrador puede registrar un usuario interno con nombre, correo y credenciales iniciales.
- El correo del usuario debe ser unico dentro del sistema.
- El usuario creado queda habilitado para iniciar sesion segun su estado.
- El registro de usuarios internos queda disponible para administracion posterior.

### MOS-55 - Asignar roles a usuarios
- Status: Finalizada
- Type: Historia
- Priority: Medium
- Jira: https://uandresbello-team-bg7iosbc.atlassian.net/browse/MOS-55

Description:
Como administrador, quiero asignar roles a los usuarios del sistema, para definir sus permisos y responsabilidades dentro de la plataforma.

Acceptance Criteria:
- Cada usuario interno puede tener un rol valido definido por el sistema.
- El rol asignado queda persistido y visible en el perfil o listado del usuario.
- El administrador puede cambiar el rol de un usuario existente.
- Los cambios de rol impactan los permisos aplicados en la plataforma.

Acceptance Criteria:
- Cada usuario interno puede tener un rol valido definido por el sistema.
- El rol asignado queda persistido y visible en el perfil o listado del usuario.
- El administrador puede cambiar el rol de un usuario existente.
- Los cambios de rol impactan los permisos aplicados en la plataforma.

### MOS-56 - Restringir acceso por rol
- Status: Finalizada
- Type: Historia
- Priority: Medium
- Jira: https://uandresbello-team-bg7iosbc.atlassian.net/browse/MOS-56

Description:
Como sistema, quiero restringir el acceso a funcionalidades segun el rol del usuario, para garantizar la seguridad y correcta operacion del sistema.

Acceptance Criteria:
- Las rutas o acciones protegidas validan la sesion del usuario.
- El sistema permite o bloquea funcionalidades segun el rol configurado.
- Un usuario sin permisos recibe una respuesta de acceso denegado.
- La restriccion aplica tanto a vistas como a operaciones sensibles.

Acceptance Criteria:
- Las rutas o acciones protegidas validan la sesion del usuario.
- El sistema permite o bloquea funcionalidades segun el rol configurado.
- Un usuario sin permisos recibe una respuesta de acceso denegado.
- La restriccion aplica tanto a vistas como a operaciones sensibles.

### MOS-57 - Acceso de mecánico
- Status: Finalizada
- Type: Historia
- Priority: Medium
- Jira: https://uandresbello-team-bg7iosbc.atlassian.net/browse/MOS-57

Description:
Como mecanico, quiero ver mis ordenes asignadas, para gestionar mi trabajo.

Acceptance Criteria:
- El mecanico puede acceder a una vista filtrada de ordenes relevantes para su trabajo.
- La vista muestra al menos numero de orden, vehiculo, estado y fecha.
- El mecanico no debe ver funcionalidades reservadas a administracion.
- Desde esa vista puede abrir el detalle de una orden permitida.

Acceptance Criteria:
- El mecanico puede acceder a una vista filtrada de ordenes relevantes para su trabajo.
- La vista muestra al menos numero de orden, vehiculo, estado y fecha.
- El mecanico no debe ver funcionalidades reservadas a administracion.
- Desde esa vista puede abrir el detalle de una orden permitida.

### MOS-58 - Acceso de jefe de operaciones
- Status: Finalizada
- Type: Historia
- Priority: Medium
- Jira: https://uandresbello-team-bg7iosbc.atlassian.net/browse/MOS-58

Description:
Como jefe de operaciones, quiero ver todas las ordenes, para supervisar el taller.

Acceptance Criteria:
- El jefe de operaciones puede ver el listado completo de ordenes de trabajo.
- La vista permite identificar estado, cliente, vehiculo y fechas principales.
- El acceso incluye supervision global y no solo ordenes individuales.
- El rol puede entrar al detalle de cualquier orden para seguimiento.

Acceptance Criteria:
- El jefe de operaciones puede ver el listado completo de ordenes de trabajo.
- La vista permite identificar estado, cliente, vehiculo y fechas principales.
- El acceso incluye supervision global y no solo ordenes individuales.
- El rol puede entrar al detalle de cualquier orden para seguimiento.

