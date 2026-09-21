# Resumen de entrega — Diseño Externo ON-LINE (Gerencial y Operativo)

Este documento responde a la sección 21 del pliego. El análisis previo y el plan se encuentran en [`ANALISIS_Y_PLAN.md`](./ANALISIS_Y_PLAN.md).

## 1. Archivos

### Modificados (20)

| Archivo | Cambio |
|---|---|
| `app/layout.tsx` | Usa fuentes autoalojadas, envuelve la app en `<SgmrProvider>` y actualiza título y metadatos. |
| `app/globals.css` | Pasa a un tema claro; agrega las clases `.tbl` y `.num`, reglas de impresión (`.print-sheet`, `.no-print`) y soporte de `prefers-reduced-motion`. Conserva las animaciones que usa Batch. |
| `tailwind.config.js` | Agrega la paleta `mv` y los colores semánticos `st`. **Conserva `brand` y las sombras oscuras** que usa Batch. |
| `package.json` / `package-lock.json` | Agrega `@fontsource-variable/figtree` y `@fontsource/ibm-plex-mono`, porque el build original fallaba sin acceso a Google Fonts. |
| `app/login/page.tsx` | Rediseño. Conserva perfil rápido, ID de operador, contraseña, «recordar sesión» y mensaje de estado. Ahora inicia una sesión real por perfil. |
| `app/dashboard/page.tsx` | Rediseño con `AppShell`. Conserva KPI, mapa, alertas filtrables, «Actualizar telemetría» y «Despachar OT». Las antiguas pestañas enlazan a sus funciones completas. |
| `app/ots/page.tsx` | Ahora redirige a `/operativo/ots`, tras verificar la paridad (§4). |
| `app/mobile/page.tsx` | Ahora redirige a `/operativo/campo/checkin`. |
| `components/layout/topbar.tsx` | Tema claro, navegación por módulo según el perfil, menú de usuario y menú móvil. **Mantiene la firma `<Topbar />`** que usa Batch. |
| `components/layout/sidebar.tsx` | Navegación jerárquica generada desde `lib/navigation.ts` y filtrada por perfil. Las props antiguas siguen siendo opcionales. |
| `components/kpi-card.tsx` | Solo cambia la presentación; la interfaz `KpiData` queda igual. |
| `components/map-placeholder.tsx` | Usa el catálogo real de activos, con filtros por segmento o alertas y una ficha del activo. |
| `components/ot-form.tsx` | Agrega tipo de OT, activo del catálogo, ticket o plan de origen con prellenado y la validación **real** de duplicados. |
| `components/ot-table.tsx` | Agrega filtro y etiqueta por tipo, columna de actividad y acciones Asignar y Despachar. |
| `components/ot-detail-modal.tsx` | La trazabilidad sigue el estado real de la OT. Agrega SLA transcurrido, origen, tracking, consumos, acciones y enlaces a reportes. |
| `components/mobile-flow.tsx` | Pasa de 3 a 5 pasos con validaciones reales y ejecución dinámica. |
| `mock-data/ots.json`, `alertas.json`, `kpis.json` | Datos enriquecidos (tipo, activo, ticket o plan, cuadrilla) y decimales con punto. |

### Nuevos

- **Páginas:** 21 archivos `page.tsx` nuevos (listados en §2), incluido `/trazabilidad`.
- **`lib/`:** `navigation.ts`, `store.tsx`, `validaciones.ts`, `data.ts`, `fechas.ts`, `types.ts`, `use-query.ts`.
- **`components/sgmr/`:** `ui.tsx`, `shell.tsx`, `geo-map.tsx`, `doc-sheet.tsx`, `campo-page.tsx`, `reporte-page.tsx`, `modulo-index.tsx`.
- **`mock-data/`:** `regiones`, `zonas`, `centrales`, `activos`, `sla`, `tiempos-base`, `umbrales`, `contratistas`, `cuadrillas`, `planes`, `tickets`, `tracking`, `materiales`, `stock`, `consumos`, `ejecuciones` y `seguimiento`.
- **Otros:** `scripts/generar-seguimiento.mjs` y los documentos de `docs/`.

### Eliminados

Ninguno.

### Sin cambios (verificado byte a byte)

- `app/batch/page.tsx`
- `components/ui/*`
- `mock-data/liquidaciones.json`
- `next.config.mjs`, `tsconfig.json`, `postcss.config.js`

## 2. Rutas

**Nuevas**
- **Índices de módulo:** `/gerencial` y `/operativo`.
- **Gerencial, parámetros:** 5 rutas bajo `/gerencial/parametros/…`
- **Gerencial, consulta:** 4 rutas bajo `/gerencial/consulta/…`
- **Operativo, data entry:** `/operativo/data-entry/tickets`, `/operativo/ots` y `/operativo/campo/{checkin,repuestos,cierre}`.
- **Operativo, reportes:** 4 rutas bajo `/operativo/reportes/…`
- **Trazabilidad:** `/trazabilidad`.

**Conservadas**
- `/`, `/login`, `/dashboard` y `/batch`.
- `/ots` y `/mobile` se conservan como redirecciones.

## 3. Funcionalidades

**Conservadas:**
- login por perfil;
- KPI por segmento;
- topología;
- alertas filtrables;
- formulario de despacho: criticidad con SLA automático, origen, SLA, cuadrilla, sugerencias de infraestructura, materiales y restablecer;
- tabla de OT: búsqueda, filtros por criticidad y estado, contador, copiar ID, marca NUEVA, estado vacío y ficha de detalle;
- app de campo: check-in, escaneo y cierre;
- Batch completo.

**Agregadas:** las 18 funciones de la arquitectura, con estas capacidades:
- mantenimiento (alta y edición) de activos, SLA, tiempos base, umbrales, zonas, centrales, contratistas, cuadrillas y planes;
- consultas con filtros y detalle;
- cadena transaccional ticket → OT → campo → cierre, que se refleja en consultas y reportes;
- cuatro documentos imprimibles;
- control de acceso por perfil;
- mapa de trazabilidad.

**Preventivo:**
- vida útil y renovación estimada de activos;
- tiempos base y tolerancias;
- planificación con vistas Programado, Próximo, Ejecutado, Pendiente e Incumplido, más calendario y próximas fechas del ciclo;
- OT PREVENTIVA con formulario dinámico preventivo;
- seguimiento programado vs. ejecutado.

**Correctivo:**
- tickets desde Call Center, NOC o detección automática, con su ciclo de vida de 7 estados;
- SLA de atención y de solución;
- OT CORRECTIVA con diagnóstico, causa y acción;
- disponibilidad de red y restitución del activo al cierre.

## 4. Paridad `/ots` → `/operativo/ots`

| Función de `/ots` original | En `/operativo/ots` |
|---|---|
| Creación de OT («Generar & Despachar») | ✔ Genera y despacha si hay cuadrilla; si no, la OT queda PENDIENTE. |
| Selector de criticidad con SLA automático | ✔ El SLA ahora se toma de los parámetros vigentes. |
| Origen, SLA, cuadrilla, infraestructura con sugerencias rápidas, materiales | ✔ La infraestructura ahora proviene del catálogo de activos. |
| Restablecer formulario y deshacer la última OT | ✔ «Restablecer» más «Deshacer», que restaura el estado previo. |
| Validación «Sin tickets duplicados» | ✔ Antes era una etiqueta estática; ahora es una validación real que bloquea. |
| Tabla con búsqueda, filtros por criticidad y estado, contador, copiar ID, NUEVA, estado vacío | ✔ Además, filtro por tipo. |
| Ficha de detalle | ✔ Con trazabilidad real, asignación y despacho. |
| 4 KPI | ✔ Ahora calculados: activas, alta o crítica, cuadrillas en ruta y cumplimiento de SLA. |
| Enlace «Ver App del Técnico» | ✔ Para perfiles con acceso a campo. El NOC ve «Tracking de cuadrillas», porque no tiene acceso a campo según la matriz de perfiles. |

## 5. Validaciones

- Tickets duplicados, en el registro y en la OT.
- Proximidad GPS de 50 m o menos.
- ATS: riesgos, clima, arnés, EPP y autorización.
- Stock de repuestos.
- Evidencia para el cierre: check-in, ATS, actividades, medición, foto, firma y descargo.
- Integridad de parámetros:
  - códigos únicos;
  - RUC de 11 dígitos;
  - coordenadas dentro de Lima y Callao;
  - tiempo de atención menor que el de solución;
  - planes duplicados;
  - no eliminar una central que tenga activos;
  - advertencia al suspender un contratista con OT abiertas.

## 6. Comprobaciones realizadas

1. **Compilación.** `next build` completa sin errores de tipos ni de lint y genera 30 rutas.
2. **Recorrido con Chromium** (Playwright) de todas las rutas con el perfil NOC: todas responden, cada `h1` corresponde a su función y hay **0 errores de consola**. `/ots` y `/mobile` redirigen correctamente.
3. **Prueba de extremo a extremo con los tres perfiles**, con 0 errores de consola:
   1. El duplicado `TCK-2026-0418` se detecta y se vincula como reporte.
   2. Se registra `TCK-2026-0419` y se genera la OT prellenada `OT-2026-9054`.
   3. La OT duplicada sobre `TRM-N48` se bloquea.
   4. La búsqueda y los filtros de la tabla funcionan.
   5. En `OT-2026-9041`: el check-in se rechaza a 3.0 km y se acepta tras el arribo; un ATS incompleto queda observado y el completo se aprueba; la ejecución correctiva se completa; el stock insuficiente bloquea el descargo; el cierre queda bloqueado sin evidencia y se completa con ella.
   6. Se emiten los cuatro reportes.
   7. `TCK-2026-0412` queda Cerrado y `TRM-N48` vuelve a Operativo.
   8. El cierre de la preventiva `OT-2026-9047` actualiza `PLN-0112`, y el Seguimiento pasa de **120/95/18/7 · 79.2 %** a **120/96/17/7 · 80.0 %**.
   9. Los accesos restringidos funcionan: el NOC no entra a campo y el técnico no entra a Gerencial.
4. **Móvil (390 px).** Login, check-in y menú lateral funcionan sin desbordamiento horizontal.
5. **Impresión.** Al imprimir la papeleta, solo sale la hoja del documento.
6. **Batch.** Se renderiza sin errores y su código y datos son idénticos al original.

## 7. Limitaciones conocidas

- El estado se guarda en `sessionStorage`: se conserva al recargar la pestaña, pero una pestaña nueva parte de los datos iniciales. «Restablecer datos de demostración» vuelve al estado inicial.
- El mapa es esquemático (SVG con coordenadas reales) porque el prototipo no usa servicios de cartografía.
- El reloj del sistema parte del 20/09/2026 a las 10:15 (la fecha de referencia de los datos) y avanza con el tiempo real.
