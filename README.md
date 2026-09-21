# Sistema de Mantenimiento e Infraestructura de Redes — Movistar Perú

> **Plataforma Web Frontend de Alta Fidelidad** · Supervisión NOC, Gestión de Incidencias, Despacho de Cuadrillas, Módulo Batch Nocturno y App Móvil de Campo para Técnicos.

---

## 📌 Alcance del Proyecto

Este repositorio contiene la maquetación y desarrollo visual interactivo del **"Sistema de Mantenimiento e Infraestructura de Redes de Movistar Perú"** (Fibra Óptica / OSP / FTTH / HFC / Core).

- **100% Frontend & Visual:** Implementado con Next.js (App Router), TypeScript, Tailwind CSS y Lucide Icons.
- **Sin Backend ni Base de Datos Externa:** Telemetría, KPIs, órdenes de trabajo, contratos y auditorías modeladas con estados locales reactivos (`useState`) y datos estructurados en `mock-data/`.
- **Experiencia de Usuario Interactiva:** Simulador de escáner QR/Código de Barras láser, mapa vectorial interactivo GPS, lienzo HTML5 de firma digital para pantalla táctil/mouse, modales dinámicos de exportación y deducción de penalidades.

---

## 🎨 Paleta de Colores Corporativos Movistar

| Nombre | Código HEX | Rol y Uso en la Interfaz |
|---|---|---|
| **Azul Marino** | `#0B2742` | Topbar principal, cabeceras de módulos, tarjetas de auditoría y botones de acción |
| **Azul Movistar** | `#019DF4` | Indicadores de telemetría activa, enlaces, escáner láser, acentos interactivos |
| **Verde Éxito** | `#00A86B` | Validaciones GPS en rango, stock verificado, sellos de conformidad y cierres |
| **Gris Claro** | `#F4F6F9` | Fondos de datos de alto contraste, tablas y tarjetas secundarias |
| **Blanco Puro** | `#FFFFFF` | Fondo de la App Móvil de Campo (legibilidad óptima en exteriores bajo luz solar) |

---

## 🖥️ Módulos y Rutas Principales

### 1. `/mobile` — App Móvil Técnica de Campo (Asignada a Diego)
Simulador en contenedor con formato Smartphone centrado y fondo blanco `#FFFFFF` de alto contraste:
- **Encabezado:** Título `"Movistar Campo - OT #89421"`, badge `"EN PROGRESO"` y barra de progreso de 4 pasos interactiva.
- **Paso 1 (Llegada GPS):** Mapa satelital vectorial con coordenadas del nodo FTTH/HFC (`NOD-CARABAYLLO-04`), alerta verde de validación `"✓ GPS Validado: Estás a 12 metros del Nodo NOD-CARABAYLLO-04"` y botón `"Confirmar Arribo al Sitio"`.
- **Paso 2 (Materiales y Repuestos):** Recuadro con visor de cámara y animación de haz láser QR. Botón `"Escanear Repuesto"` que agrega secuencialmente la Mufa Óptica 24 hilos y Cable Drop FTTH con validación verde `"✓ Stock verificado en camioneta del técnico"`. Botón `"Continuar a Evidencia"`.
- **Paso 3 (Cierre y Evidencia):** Subida simulada de fotografía de reflectometría OTDR (`0.02 dB - Conforme`) y recuadro de lienzo HTML5 Canvas para captura de **Firma Digital interactiva** a mano alzada. Botón principal `"Cerrar y Despachar OT"`.
- **Paso 4 (Éxito):** Pantalla con ícono gigante de verificación verde, mensaje `"¡Orden de Trabajo Cerrada / Conforme!"`, resumen del tiempo de atención (`34 min`) y botón `"Reiniciar Simulación"`.

### 2. `/batch` — Módulo Batch, Liquidaciones y Penalidades (Asignada a Diego)
Dashboard Gerencial nocturno con auditoría de contratistas:
- **Encabezado:** Título `"Procesamiento Lote & Auditoría de Contratistas"`, badge `"BATCH COMPLETO - 03:00 AM"` y botón `"Exportar Reporte General"`.
- **4 Tarjetas de Auditoría (KPI Cards):**
  1. **Mantenimiento Preventivo:** Barra de progreso en `84%`, texto `"1,240 OTs Preventivas Generadas Automáticamente por Vida Útil de Activos"`.
  2. **Rendimiento de Contratistas:** Eficiencia por contrata (`Cobra: 94%`, `Lari: 88%`, CAM: 82%).
  3. **Pre-Liquidaciones Mensuales:** Monto `"S/ 452,180.00"` calculado para pago de servicios de campo.
  4. **Penalidades SLA:** Monto `"-S/ 28,400.00"` acumulado por demoras o reincidencias de fallas.
- **Modales Interactivos:**
  - **Modal 1 (Exportación de Reportes):** Selector de formato `"Excel (.xlsx)"` o `"PDF Ejecutivo"`, rango de fechas y botón `"Descargar Documento"`.
  - **Modal 2 (Detalle de Penalidades SLA):** Tabla detallada con `ID Acta`, `Contrata` (Cobra / Lari), `Motivo` (*"Incumplimiento MTTR > 4hrs"*, *"Reincidencia en Nodo NOD-LIM-02"*) y `Monto de Deducción` (ej. `S/ 4,500.00`, `S/ 8,200.00`).
  - **Modal 3 (Detalle de Pre-Liquidaciones):** Desglose por contrata de los `S/ 452,180.00`.

### 3. Rutas de Soporte Global
- **`/login`:** Pantalla corporativa con selector rápido de 3 perfiles:
  - *Ing. NOC* (`noc.central@movistar.pe`) → Acceso a `/ots`.
  - *Supervisor* (`supervisor.lima@movistar.pe`) → Acceso a `/batch`.
  - *Técnico* (`diego.quispe@movistar.pe`) → Acceso directo a `/mobile`.
- **`/ots`:** Centro de despacho y tabla reactiva de incidencias con formulario rápido, botón `"Generar OT"` que añade órdenes con el badge dinámico `"NUEVA"` y filtros por criticidad (Crítica, Alta, Media, Baja).

---

## 🚀 Puesta en Marcha Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Abrir en el navegador
http://localhost:3000
```
