# Análisis del proyecto existente y plan de cambios

Alcance de este trabajo: **ON-LINE → Gerencial y Operativo**. El módulo **Batch** (`app/batch/`) pertenece al equipo Batch y no se modifica.

## 1. Estado inicial (antes de los cambios)

### Rutas existentes

| Ruta | Contenido | Observaciones |
|---|---|---|
| `/` | Redirección a `/login` | Se conserva |
| `/login` | Selector de perfil (NOC, Supervisor, Técnico) y autenticación simulada | El perfil elegido **no se usaba**: todos iban a `/dashboard` |
| `/dashboard` | 3 KPI (Core / Planta Externa / Última Milla), mapa de topología SVG, feed de alertas con filtro, pestañas internas (general, parámetros, consultas, histórico) | Pestañas con contenido estático mínimo; solo mostraba averías |
| `/ots` | KPIs, formulario de despacho (`ot-form`), tabla con búsqueda y filtros (`ot-table`), ficha de detalle (`ot-detail-modal`) | La etiqueta "Sin tickets duplicados" era **estática** (no validaba). No distinguía preventivo/correctivo |
| `/mobile` | App de campo en 3 pasos: llegada GPS, escaneo de material, evidencia + firma + cierre | GPS y stock sin validación real; el cierre sí exigía foto y firma |
| `/batch` | Preventivo (batch), rendimiento de contratistas, pre-liquidaciones, penalidades | **Equipo Batch: no se toca** |

### Componentes existentes y dependencias

| Componente | Usado por | Decisión |
|---|---|---|
| `layout/topbar.tsx` | dashboard, ots, **batch** | Se rediseña manteniendo la firma `<Topbar />` sin props (compatibilidad con Batch) |
| `layout/sidebar.tsx` | dashboard | Se reescribe como navegación jerárquica por arquitectura y perfil; props antiguas quedan opcionales |
| `ui/badge, button, card, modal` | **batch**, login, dashboard, mobile-flow, kpi-card, map | **No se alteran sus variantes** (Batch depende de su tema oscuro). Se crea un kit claro nuevo en `components/sgmr/` |
| `kpi-card.tsx` | dashboard | Se restiliza (misma interfaz `KpiData`) |
| `map-placeholder.tsx` | dashboard | Se conserva y mejora: pasa a usar el catálogo de activos y filtros por segmento |
| `ot-form.tsx` | ots | Se conserva y amplía: tipo de mantenimiento, activo del catálogo, validación real de duplicados, prellenado desde ticket |
| `ot-table.tsx` | ots | Se conserva y amplía: filtro por tipo, columnas nuevas, acciones de asignación/despacho |
| `ot-detail-modal.tsx` | ot-table | Se conserva y amplía: trazabilidad según estado real, ticket/plan de origen, acciones |
| `mobile-flow.tsx` | mobile | Se conserva y amplía a 5 pasos: Check-in GPS → ATS → Ejecución → Repuestos → Cierre |
| `mock-data/liquidaciones.json` | **batch** | **No se modifica** |

## 2. Brechas frente a la arquitectura

| Función arquitectónica | Situación inicial | Acción |
|---|---|---|
| Gestión de Activos y Vida Útil | No existía | Crear |
| SLA y Tiempos Base | Solo 3 umbrales en una pestaña del dashboard | Crear (conservando los umbrales ópticos) |
| Zonas y Centrales | 4 tarjetas estáticas en pestaña "consultas" | Crear (jerarquía Región → Zona → Central → Activos + mapa) |
| Contratistas | Solo "Rendimiento" dentro de Batch | Crear catálogo gerencial (distinto del rendimiento Batch) |
| Planificación de Mantenimientos | No existía | Crear (prioritaria; **no genera OT**) |
| Tracking y Geolocalización | Mapa decorativo de nodos | Crear consulta de cuadrillas sobre mapa |
| Estado de Tickets e Incidencias | Solo bitácora estática | Crear consulta con ciclo de vida |
| Disponibilidad de Red | KPI + mapa en dashboard | Crear pantalla de consulta funcional reutilizando KPI y topología |
| Seguimiento de Mantenimientos | No existía | Crear panel programados vs ejecutados |
| Registro de Tickets e Incidencias | No existía (se mezclaba con la OT) | Crear formulario con validación de duplicados |
| Gestión de Órdenes de Trabajo | `/ots` | Trasladar a `/operativo/ots` con paridad funcional; `/ots` redirige |
| Check-in y Ejecución Dinámica | Paso 1 de `/mobile` (sin validación) | Ampliar con validación de proximidad, ATS y ejecución preventiva/correctiva |
| Descargo de Repuestos | Paso 2 de `/mobile` (sin validación) | Ampliar con validación de stock |
| Cierre Transaccional | Paso 3 de `/mobile` | Conservar y reforzar la validación de evidencia |
| Reportes (4) | No existían | Crear las 4 salidas documentales |

## 3. Plan de cambios

1. **Identidad visual Movistar** en Tailwind y estilos globales, conservando la paleta `brand` y animaciones que usa Batch.
2. **Fuentes autoalojadas** (`@fontsource`) en lugar de `next/font/google`, para que el build no dependa de red.
3. **Fuente única de la arquitectura** (`lib/navigation.ts`): módulos, funciones, rutas, perfiles y tipo de interfaz. De ahí salen el menú, las migas de pan, el control de acceso y el mapa de trazabilidad.
4. **Contexto de sesión y datos** (`lib/store.tsx`): perfil activo y estado compartido en memoria, para que un ticket registrado pueda convertirse en OT, ejecutarse en campo, cerrarse y aparecer en los reportes y consultas.
5. **Datos mock coherentes** en `mock-data/` (una tabla por entidad, con claves foráneas por código).
6. **Shell común** (topbar + sidebar + cabecera con trazabilidad) y control de acceso por perfil.
7. Pantallas gerenciales (9) y operativas (9) + Dashboard Gerencial + mapa de trazabilidad.
8. Compatibilidad: `/ots` → `/operativo/ots`, `/mobile` → `/operativo/campo/checkin`, `/dashboard` se conserva, `/batch` intacto.
9. Verificación: build, recorrido de todas las rutas con navegador headless y capturas.

## 4. Matriz de acceso por perfil

| Función | Ing. NOC | Supervisor | Técnico de Campo |
|---|:-:|:-:|:-:|
| Dashboard Gerencial | ✓ | ✓ | |
| Mantenimiento de Parámetros (5) | ✓ | ✓ | |
| Consulta (4) | ✓ | ✓ | |
| Registro de Tickets e Incidencias | ✓ | ✓ | |
| Gestión de Órdenes de Trabajo | ✓ | ✓ | |
| Check-in y Ejecución / Repuestos / Cierre | | ✓ | ✓ |
| Papeleta de Asignación de OT | ✓ | ✓ | ✓ |
| Constancia / Vale / ATS | | ✓ | ✓ |
| Batch (enlace) | ✓ | ✓ | |

## 5. Estado

El plan se ejecutó completo. El detalle de archivos, rutas, paridad y comprobaciones está en [`ENTREGA.md`](./ENTREGA.md).
