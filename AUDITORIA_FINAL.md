# Auditoría final del mockup

**Fecha:** 5 de agosto de 2026  
**Fuente principal:** Expediente de Ingeniería de Requerimientos v1.0, fechado el 3 de agosto de 2026.

## Módulos implementados

- Acceso simulado y layout responsive.
- Dashboard con prioridades y trazabilidad.
- Organización de lotes de expedientes recibidos, sin administrar convocatorias.
- Importación demostrativa por selección o drag and drop, activable con cualquier archivo.
- Pipeline inmersivo de siete fases con extracción, cruce histórico, perfilado y preparación de resultados simulados.
- Resumen posterior con aspirantes identificados, experiencia universitaria, requisitos mínimos, coincidencias históricas, calidad documental e incidencias priorizadas.
- Listado, filtros, búsqueda y detalle de aspirantes.
- Evaluación por criterios, observaciones, estados y reglas de motivo.
- Historial de participaciones y trabajo previo.
- Documentos versionados, reportes y respaldos.
- Bitácora de actividad y configuración del perfil.
- Estados de carga, vacío, éxito, error, procesamiento, datos incompletos y acceso restringido informativo.
- Sistema de movimiento global con entradas escalonadas, transición de rutas, microinteracciones y feedback de formularios.
- Drawer móvil y modales coordinados, con cierre por teclado y devolución del foco.
- Precarga posterior al acceso de todas las rutas, aspirantes, expedientes individuales y bitácora.
- Caché en memoria con TanStack Query y filtrado local sin nuevas esperas de repositorio.

## Funciones simuladas

- Credenciales y sesión.
- Persistencia en memoria.
- Procesamiento documental: cualquier archivo local activa el mismo escenario fijo sin subir ni leer su contenido.
- Detección de aspirantes, incidencias, duplicados, requisitos e historial.
- Envío de comunicación, generación de documentos y descargas.
- Notificaciones, reportes y métricas.

## Dependencias de un backend real

- Autenticación institucional y permisos por rol.
- Base de datos, bitácora inmutable y cifrado.
- Almacenamiento seguro, antivirus y validación documental.
- Importador tolerante a formatos reales; OCR solo después de una prueba de concepto.
- Correo o mensajería mediante canal institucional autorizado.
- Generación de PDF/CSV y respaldos con control de acceso.
- Retención, eliminación, RPO/RTO y monitoreo.

## Información faltante o pendiente de validación

- Nombre oficial de la plataforma y del área.
- Estructura y límites reales de archivos entregados por RH.
- Campos y documentos que debe revisar Idiomas en cada lote recibido.
- Criterios, ponderaciones y estados oficiales.
- Política de privacidad, retención y eliminación.
- Canales de comunicación autorizados.
- Plantillas administrativas vigentes.
- Volumen esperado, infraestructura, presupuesto y responsables.

## Revisión técnica

- Arquitectura separada en presentación, aplicación, dominio e infraestructura.
- TypeScript estricto; sin `any`, `@ts-ignore` ni reglas deshabilitadas.
- Rutas con carga diferida y datos simulados centralizados.
- Registro de módulos resueltos que evita el fallback de `Suspense` después de la preparación inicial.
- Formularios críticos con React Hook Form y validación específica.
- Diseño mobile-first sin tablas obligatorias para la navegación principal.
- Foco visible, enlace para saltar al contenido y etiquetas accesibles.
- Pruebas de reglas, límites, repositorios, estados vacíos y formulario de acceso.
- Pruebas de movimiento reducido, límites del stagger, transición de rutas, limpieza al desmontar, drawer y modal.
- Compilación, lint y pruebas automatizadas incluidos en `npm run check`.
- Auditoría de 24 vistas responsive y flujos interactivos, incluida la importación completa en escritorio y móvil, sin errores de consola, desbordamientos ni violaciones WCAG A/AA detectables.

## Revisión de movimiento y rendimiento

- Tokens compartidos de duración, distancia, curvas y stagger en CSS y TypeScript.
- GSAP encapsulado en hooks reutilizables mediante `useGSAP`, con limpieza automática por contexto.
- Stagger limitado a los primeros 12 elementos; las listas extensas no animan cada fila indefinidamente.
- La cuadrícula de aspirantes queda fuera de la entrada global para evitar transformaciones duplicadas; su timeline lateral solapa al 50% la siguiente tarjeta con la cascada interna de la anterior.
- Los resultados de importación repiten esa lógica de solapamiento en sus métricas y continúan con paneles de calidad, hallazgos y trazabilidad, evitando revelar toda la información al mismo tiempo.
- Sin parallax, animaciones continuas ni ScrollTrigger en las vistas administrativas.
- Skeletons conservan espacio y evitan saltos; los estados dinámicos entran con transiciones cortas.
- `prefers-reduced-motion` desactiva timelines, desplazamientos, escalas y View Transitions sin ocultar contenido.

## Revisión de precarga y caché

- El proyecto continúa siendo una SPA con un único `index.html`; la separación por archivos mantiene el código modular.
- El acceso correcto ejecuta la preparación de rutas y consultas en paralelo con la verificación inicial; en el mockup local queda absorbida por ese único estado de espera.
- Las llamadas de precarga se deduplican mediante una única promesa compartida.
- Los datos cacheados tienen `staleTime` infinito para la sesión del mockup, `gcTime` de 30 minutos y no se reconsultan al enfocar la ventana.
- Las evaluaciones actualizan las entradas de lista y detalle para evitar información incoherente.
- No se almacenan expedientes en cookies ni almacenamiento persistente del navegador.

## Riesgos conscientes

Las fuentes antiguas de la carpeta describen otro proceso sobre preinscripción de alumnos. No se mezcló con el alcance reciente de perfilado docente. Recursos Humanos no recibió pantallas internas porque la documentación vigente indica que hoy proporciona archivos fuera del sistema y su rol como actor todavía está por validar.

La administración de convocatorias fue retirada expresamente del mockup: su publicación, recepción formal de postulaciones y contratación corresponden a Recursos Humanos. Idiomas únicamente organiza y revisa la documentación que recibe.
