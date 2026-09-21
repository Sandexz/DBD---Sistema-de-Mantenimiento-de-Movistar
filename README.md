# SGMR — Sistema de Mantenimiento de Redes (Movistar)

Prototipo académico (curso **SI-505 · Diseño de Base de Datos**) del sistema que planifica, registra, despacha, ejecuta y cierra el mantenimiento **preventivo y correctivo** de la red de Movistar.

Este repositorio corresponde al **Diseño Externo de la arquitectura ON-LINE**, en sus módulos **Gerencial** y **Operativo**. El módulo **Batch** pertenece a otro equipo: se conserva sin cambios funcionales y solo se enlaza desde la navegación.

> No hay backend ni base de datos real. Los datos provienen de `mock-data/*.json` y se mantienen en memoria (y en `sessionStorage`), de modo que las transacciones de una pantalla se reflejan en las demás durante la sesión.

---

## Ejecución

```bash
npm install
npm run dev        # http://localhost:3000
# o, para producción:
npm run build && npm start
```

Requisitos: Node.js 18 o superior. Las fuentes (Figtree e IBM Plex Mono) están autoalojadas con `@fontsource`, así que el proyecto compila sin acceso a Google Fonts.

---

## Arquitectura implementada y trazabilidad

La arquitectura se define en un único archivo, **`lib/navigation.ts`**. De él salen el menú lateral, las migas de pan, la cabecera de cada pantalla, los permisos por perfil y la página **`/trazabilidad`**.

```text
ON-LINE
├── GERENCIAL                                   /gerencial
│   ├── Supervisión (pantalla existente)
│   │   └── Dashboard Gerencial                 /dashboard
│   ├── Mantenimiento de Parámetros
│   │   ├── Gestión de Activos y Vida Útil      /gerencial/parametros/activos
│   │   ├── SLA y Tiempos Base                  /gerencial/parametros/sla
│   │   ├── Zonas y Centrales                   /gerencial/parametros/zonas
│   │   ├── Contratistas                        /gerencial/parametros/contratistas
│   │   └── Planificación de Mantenimientos ★   /gerencial/parametros/planificacion
│   └── Consulta
│       ├── Tracking y Geolocalización          /gerencial/consulta/tracking
│       ├── Estado de Tickets e Incidencias     /gerencial/consulta/tickets
│       ├── Disponibilidad de Red               /gerencial/consulta/disponibilidad
│       └── Seguimiento de Mantenimientos       /gerencial/consulta/seguimiento
└── OPERATIVO                                   /operativo
    ├── DATA ENTRY
    │   ├── Registro de Tickets e Incidencias   /operativo/data-entry/tickets
    │   ├── Gestión de Órdenes de Trabajo       /operativo/ots
    │   ├── Check-in y Ejecución Dinámica       /operativo/campo/checkin
    │   ├── Descargo de Repuestos               /operativo/campo/repuestos
    │   └── Cierre Transaccional                /operativo/campo/cierre
    └── REPORTES
        ├── Papeleta de Asignación de OT        /operativo/reportes/asignacion-ot
        ├── Constancia de Conformidad           /operativo/reportes/conformidad
        ├── Vale Instantáneo de Consumo         /operativo/reportes/vale-consumo
        └── Papeleta ATS                        /operativo/reportes/ats
```

★ Función prioritaria. Planifica los mantenimientos, pero **no genera OT**: esa generación la hace el proceso Batch.

**Rutas heredadas**

| Ruta | Comportamiento |
|---|---|
| `/` | Redirige a `/login`. |
| `/ots` | Redirige a `/operativo/ots` (paridad funcional verificada). |
| `/mobile` | Redirige a `/operativo/campo/checkin`. |
| `/batch` | Sin cambios funcionales. |

---

## Perfiles de acceso

| Perfil | Gerencial | Operativo |
|---|---|---|
| **Ingeniero NOC** | Todo | Registro de tickets, Gestión de OT, Papeleta de asignación |
| **Supervisor** | Todo | Todo |
| **Técnico de Campo** | — | Funciones de campo (su cuadrilla, C-01) y los cuatro reportes |

Se elige el perfil en `/login`; si una función no corresponde al perfil, se muestra una pantalla de «Acceso restringido». El menú de usuario permite cambiar de perfil y **restablecer los datos de demostración**.

---

## Validaciones visibles

| Validación | Dónde |
|---|---|
| Tickets duplicados | Registro de tickets (vincular reporte o confirmar incidencia distinta) y Gestión de OT (bloquea una OT abierta del mismo tipo sobre el activo). |
| Proximidad GPS | Check-in; se aceptan 50 m o menos, calculados con la fórmula de Haversine. |
| ATS | Riesgos, clima, arnés, EPP y autorización, validados antes de ejecutar. |
| Stock de repuestos | Descargo contra el stock de la cuadrilla. |
| Evidencia para cierre | Check-in, ATS, actividades, medición, foto, firma y descargo. |

## Secuencia de campo

**OT → Check-in → ATS → Validación → Ejecución → Repuestos → Cierre**

La ejecución es dinámica: la OT preventiva muestra las actividades del plan, la medición, los hallazgos y la opción «requiere correctivo»; la OT correctiva muestra el diagnóstico, la causa de la falla, la acción correctiva y la medición.

El cierre es transaccional y actualiza en una sola operación:
- la OT, que pasa a CERRADA;
- el ticket, que pasa a Cerrado;
- el plan, que pasa a Ejecutado y recalcula el Seguimiento;
- el activo, que vuelve a Operativo;
- el tracking de la cuadrilla, que pasa a Finalizado.

---

## Recorrido de demostración (≈ 5 min)

**1. Ingeniero NOC**
1. En Registro de Tickets, elija el activo `BTS-CAL-07`: el sistema detecta el duplicado `TCK-2026-0418`.
2. Registre un ticket nuevo sobre `NAP-517`.
3. Pulse «Generar OT correctiva»: el formulario se prellena. Asigne una cuadrilla y despache.

**2. Técnico de Campo**
1. Con la OT `OT-2026-9041`, intente el check-in con la «Última posición»: se rechaza, porque está a 3.0 km.
2. Pulse «Simular arribo al sitio», registre el ATS y complete la ejecución correctiva.
3. En el descargo, intente 10 m de FO 144 (stock 0): el descargo se bloquea. Descargue la mufa y los pigtails.
4. Adjunte foto y firma, y cierre la OT. Revise los tres reportes generados.

**3. Supervisor**
1. Verifique que `TCK-2026-0412` quedó Cerrado y que `TRM-N48` volvió a Operativo.
2. Cierre la preventiva `OT-2026-9047`.
3. Seguimiento pasa de **120 / 95 / 18 / 7 · 79.2 %** a **120 / 96 / 17 / 7 · 80.0 %**.

---

## Identidad visual

Fondo blanco predominante y verde Movistar (`mv-green #5BC500`, `mv-green-700 #3B8500`) usado con moderación. Tarjetas en gris claro, textos en gris oscuro y turquesa (`mv-teal`) como color complementario.

Colores semánticos: **verde** correcto, **amarillo** alerta, **rojo** crítico, **azul** información.

La paleta oscura original (`brand.*`) y `components/ui/*` se conservan porque el módulo Batch depende de ellos.

## Estructura del código

```text
app/                      rutas (App Router); app/batch sin cambios
components/
  layout/                 topbar y sidebar compartidos (Batch usa <Topbar />)
  sgmr/                   kit claro: ui, shell, mapa, hoja documental, plantillas de campo y reportes
  ot-form, ot-table, ot-detail-modal, mobile-flow, kpi-card, map-placeholder   (existentes, ampliados)
  ui/                     componentes oscuros originales (los usa Batch)
lib/
  navigation.ts           arquitectura, rutas y permisos (fuente única)
  store.tsx               estado compartido y transacciones
  validaciones.ts         reglas de validación
  data.ts · fechas.ts · types.ts · use-query.ts
mock-data/                datos simulados (liquidaciones.json pertenece a Batch y no se modificó)
scripts/                  generador determinista del seguimiento del III trimestre
docs/                     análisis inicial, plan y resumen de entrega
```

**Fuera de alcance** (por indicación del pliego): IA, aprendizaje automático, análisis predictivo, microservicios, backend y base de datos real.
