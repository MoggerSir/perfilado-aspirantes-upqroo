# Perfilado de Aspirantes UPQROO — Nexo Idiomas

Prototipo web navegable para presentar el funcionamiento de una herramienta interna de apoyo al perfilado de aspirantes a docentes de inglés. Centraliza los expedientes recibidos, criterios aplicables, evaluaciones, estados, historial, comunicaciones documentales, reportes y bitácora sin sustituir las decisiones humanas ni las atribuciones de Recursos Humanos.

Todos los nombres, expedientes y métricas del mockup son datos simulados.

## Stack

- React 19 + TypeScript estricto + Vite
- Tailwind CSS con sistema visual propio
- Componentes basados en patrones de shadcn/ui y primitivas Radix UI
- Wouter, TanStack Query, React Hook Form y Zod
- Lucide React y Sonner
- GSAP y `@gsap/react` para secuencias reutilizables; CSS para microinteracciones
- Vitest, React Testing Library y Testing Library User Event
- Oxlint y cobertura V8

## Ejecución

```bash
npm install
npm run dev
```

Vite mostrará la dirección local, normalmente `http://localhost:5173`.

Comandos de calidad:

```bash
npm run lint
npm run test
npm run test:coverage
npm run build
npm run check
npm run audit:visual
```

## Rutas disponibles

| Ruta                  | Vista                                   |
| --------------------- | --------------------------------------- |
| `/`                   | Presentación y alcance del mockup       |
| `/acceso`             | Inicio de sesión simulado               |
| `/app`                | Dashboard del Director                   |
| `/app/importar`       | Importación controlada de expedientes   |
| `/app/aspirantes`     | Búsqueda, filtros y listado             |
| `/app/aspirantes/:id` | Expediente y trazabilidad individual    |
| `/app/evaluacion`     | Evaluación por criterios y estado       |
| `/app/historial`      | Participaciones y trabajo previo        |
| `/app/documentos`     | Plantillas y documentos administrativos |
| `/app/reportes`       | Reportes y respaldos simulados          |
| `/app/bitacora`       | Eventos auditables                      |
| `/app/configuracion`  | Perfil y preferencias                   |

## Rol simulado

El único usuario operativo confirmado es el **Director de Idiomas**. Recursos Humanos se representa como proveedor externo de archivos, no como usuario del mockup. Un futuro usuario autorizado podría consultar bitácora conforme a permisos institucionales.

## Arquitectura

```text
src/
├── app/                 # Cliente de caché, rutas precargables y warm-up
├── animations/          # Configuración y secuencias globales de movimiento
├── components/          # UI, layout y visualización reutilizable
├── core/
│   ├── domain/          # Entidades, tipos y contratos sin React
│   ├── application/     # Casos de uso y reglas de coordinación
│   └── infrastructure/  # Repositorios simulados e inyección
├── data/                # Datos de demostración centralizados
├── features/            # Consultas cacheables por dominio
├── hooks/               # Movimiento reducido y animaciones reutilizables
├── lib/                 # Utilidades transversales
├── pages/               # Composición de vistas por ruta
├── styles/              # Sistema CSS de animaciones e interacciones
└── tests/               # Configuración de pruebas
```

### Patrones aplicados

- **Repository:** desacopla candidatos, importaciones y auditoría de su fuente de datos.
- **Dependency Injection:** los casos de uso reciben contratos; el contenedor elige las implementaciones en memoria.
- **Use Case / Command:** evaluación, búsqueda, creación e importación concentran reglas que no pertenecen al JSX.
- **Adapter simulado:** el repositorio de importación representa el futuro procesamiento de archivos sin fingir un backend real.

No se introdujeron jerarquías de herencia ni patrones adicionales porque no reducían complejidad en este alcance.

## Decisiones de UI/UX

- Brutalismo suave: bordes visibles, sombras sólidas y composición editorial sin sacrificar calma.
- Base blanco hueso, tinta cálida, verde salvia, azul grisáceo y terracota semántica.
- Navegación lateral en escritorio y panel desplegable en móvil.
- Estados y acciones principales visibles; las decisiones sensibles siempre requieren confirmación humana.
- Tablas solo donde aportan lectura comparativa; los expedientes usan tarjetas adaptables.
- Foco visible, etiquetas asociadas, áreas táctiles de 44 px y respeto por `prefers-reduced-motion`.

## Sistema de movimiento

El movimiento refuerza jerarquía y feedback sin retrasar las tareas:

- Duraciones globales de **140 ms**, **260 ms** y **480 ms**; entradas de GSAP de hasta **520 ms**.
- Curvas CSS `cubic-bezier(0.22, 1, 0.36, 1)` y `cubic-bezier(0.16, 1, 0.3, 1)`; equivalentes GSAP `power3.out` y `power2.out`.
- Encabezados, acciones, tarjetas y filas entran en orden visual. El stagger se limita a 12 elementos para evitar secuencias largas.
- Las tarjetas de aspirantes usan una secuencia exclusiva y solapada: cada contenedor entra desde la derecha con fade; al llegar al 50% inicia la siguiente tarjeta y comienza la cascada de los cinco grupos internos de la anterior.
- La importación acepta cualquier archivo como disparador local: una superficie de procesamiento cubre el área de trabajo, conserva la navegación y recorre siete fases legibles antes de revelar métricas y hallazgos con una secuencia editorial propia.
- CSS resuelve hover, foco, presión, errores, skeletons, overlays, modales y drawer; GSAP se reserva para entradas y listas coordinadas.
- Las rutas usan View Transitions cuando están disponibles y navegación inmediata como fallback. El contenido nuevo recibe una entrada corta sin bloquear interacción.
- `useEntranceAnimation`, `useStaggerAnimation` y `useReducedMotion` concentran la integración y la limpieza de GSAP.
- Con `prefers-reduced-motion: reduce` no se ejecutan timelines complejos, se eliminan desplazamientos y la interfaz conserva todo su contenido y funcionalidad.
- Solo se animan `transform` y `opacity` en secuencias; no se aplica `will-change` global, no se usa ScrollTrigger en el dashboard y los contextos se limpian al desmontar.

La auditoría visual recorre 24 combinaciones de ruta y viewport. Una segunda auditoría abre drawer y modal, comprueba el retorno de foco, cambia rápidamente de ruta, ejecuta la importación simulada en escritorio y móvil y valida el modo de movimiento reducido.

## Precarga y caché

La aplicación utiliza un solo documento HTML y navegación SPA. Los archivos separados son módulos internos de JavaScript, no páginas HTML independientes.

Después de validar el formulario de acceso, `preloadWorkspace()` ejecuta en paralelo:

- descarga de todos los módulos de las rutas administrativas;
- consulta y caché del listado de aspirantes;
- creación de entradas de caché para cada expediente individual;
- consulta y caché de la bitácora.

TanStack Query conserva estos datos en memoria durante 30 minutos y los considera vigentes durante la sesión del mockup. Los filtros trabajan localmente sobre la copia cacheada, sin repetir la espera simulada del repositorio. Los cargadores de ruta conservan tanto la promesa como el módulo resuelto, de modo que React puede renderizar directamente una vista ya preparada sin mostrar el fallback de `Suspense`.

No se utilizan cookies para almacenar módulos ni expedientes. Las cookies tienen un tamaño reducido, se envían en cada petición y no son apropiadas para código o información personal. El navegador conserva los chunks mediante su caché HTTP; una implementación real deberá definir explícitamente si algún dato puede persistir más allá de la sesión.

## Límites del prototipo

No hay autenticación, persistencia, carga real, OCR, mensajería interna, generación PDF ni descarga de datos personales. Los accesos de WhatsApp y correo solamente abren servicios externos con un mensaje de seguimiento preparado. El archivo soltado activa una simulación local y siempre produce el mismo escenario demostrativo de 54 documentos, 18 expedientes probables y hallazgos predefinidos. Las funciones reales requieren backend, políticas institucionales, plantillas autorizadas y validación con archivos auténticos.

## Publicación

El proyecto se despliega automáticamente mediante GitHub Actions y GitHub Pages cuando se actualiza la rama `main`.

- Sitio previsto: `https://idiomas.josmargalindo.com`
- Repositorio: `MoggerSir/perfilado-aspirantes-upqroo`
- Salida de producción: `dist/`
- DNS: CNAME `idiomas` → `MoggerSir.github.io`

Cloudflare se utiliza únicamente como proveedor DNS. GitHub Pages aloja los archivos estáticos, por lo que no se necesita Cloudflare Tunnel.
