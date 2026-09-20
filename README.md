# SGMR — Sistema de Gestión de Mantenimiento de Redes (Movistar)

> **Skeleton Visual de Alta Fidelidad** · Plataforma de Supervisión NOC, Gestión de Incidencias, Despacho de Cuadrillas y Aplicación Móvil de Campo.

---

## 📌 Alcance del Proyecto

Este repositorio contiene la maquetación y diseño visual completo del sistema SGMR para el mantenimiento de redes de telecomunicaciones (Fibra Óptica / OSP / Core / FTTH).

- **100% Frontend & Visual:** Implementado con Next.js 14 (App Router), TypeScript y Tailwind CSS.
- **Sin Backend ni BD Real:** Telemetría, KPIs, órdenes de trabajo y liquidaciones basadas en datos estructurados en formato JSON (`mock-data/`).
- **Navegación e Interactividad:** Estados locales reactivos, simuladores de carga, mapa de topología SVG interactivo y flujo guiado para técnicos de campo.

---

## 🎨 Paleta de Diseño Oficial & Tipografía

| Color | Hex | Uso en el Sistema |
|---|---|---|
| **Azul Brand** | `#0A2E5C` | Encabezados, topbar, estructura de tarjetas y navegación |
| **Celeste Live** | `#00AEEF` | Telemetría en tiempo real, enlaces, indicadores de estado OK |
| **Naranja Alerta** | `#FF6A13` | Exclusivo para alarmas NOC, cortes de fibra, criticidad y acciones destacadas |
| **Negro Base** | `#0B0C0E` | Fondo base NOC para pantallas Gerenciales, Operativas y Batch |
| **Blanco Base** | `#FFFFFF` | Fondo de la App Móvil de Campo (legibilidad óptima en exteriores bajo luz solar) |

**Tipografías:**
- **Space Grotesk:** Títulos principales y métricas de impacto.
- **Public Sans:** Cuerpo de texto, formularios y descripciones.
- **IBM Plex Mono:** Códigos de OT, coordenadas geográficas WGS-84, lecturas ópticas dBm y timestamps.

---

## 🖥️ Módulos y Pantallas

```text
/
├── /login       # Pantalla 1: Login con selector de perfil rápido y spinner de autenticación simulada
├── /dashboard   # Pantalla 2: Dashboard Gerencial con 3 KPIs semafóricos, mapa NOC y feed de alertas
├── /ots         # Pantalla 3: Gestión de OTs con buscador, validación "Sin tickets duplicados" y despacho
├── /mobile      # Pantalla 4: Simulador de App Técnica de Campo (Flujo de 3 pasos: Arribo -> Scan -> Cierre)
└── /batch       # Pantalla 5: Módulo Batch y Liquidaciones con modales de exportación y detalle de penalidades
```

---

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js 18+ instalado
- npm o yarn

### Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Sandexz/DBD---Sistema-de-Mantenimiento-de-Movistar.git
   cd DBD---Sistema-de-Mantenimiento-de-Movistar
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor en modo desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador:**
   - [http://localhost:3000](http://localhost:3000)

---

## 📁 Estructura del Código

```text
├── app/
│   ├── layout.tsx             # Configuración de Google Fonts y metadatos globales
│   ├── globals.css            # Tokens CSS, variables de diseño y animaciones de radar
│   ├── page.tsx               # Redirección automática a /login
│   ├── login/page.tsx         # Pantalla de Control de Acceso
│   ├── dashboard/page.tsx     # Pantalla de Monitoreo Gerencial
│   ├── ots/page.tsx           # Pantalla de Gestión de OTs
│   ├── mobile/page.tsx        # Pantalla de App Técnica de Campo
│   └── batch/page.tsx         # Pantalla de Procesamiento Batch
├── components/
│   ├── layout/                # Topbar con reloj UTC y Sidebar con tabs
│   ├── ui/                    # Botones, Cards, Modales, Badges reutilizables
│   ├── kpi-card.tsx           # Tarjeta KPI con semáforo de color
│   ├── map-placeholder.tsx    # Topología de red en SVG con corte de fibra y radar
│   ├── ot-form.tsx            # Formulario de alta rápida reactivo
│   ├── ot-table.tsx           # Tabla de órdenes con búsqueda y filtros
│   └── mobile-flow.tsx        # Flujo de 3 pasos para técnicos en exteriores
├── mock-data/                 # Archivos JSON con datos de ejemplo estáticos
└── tailwind.config.js         # Configuración de tokens de color y fuentes
```

---

## 📄 Licencia
Proyecto desarrollado con fines académicos / demostrativos.
