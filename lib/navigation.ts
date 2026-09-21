// Fuente única de la arquitectura del sistema (ON-LINE → Gerencial / Operativo).
// De esta definición se derivan: menú lateral, migas de pan, cabecera de trazabilidad,
// control de acceso por perfil y la página de trazabilidad (/trazabilidad).
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Boxes,
  Timer,
  Network,
  Building2,
  CalendarRange,
  Navigation,
  Ticket,
  Activity,
  BarChart3,
  FilePlus2,
  ClipboardList,
  MapPinned,
  PackageMinus,
  FileCheck2,
  ClipboardCheck,
  BadgeCheck,
  Receipt,
  ShieldAlert,
} from "lucide-react";
import type { Rol } from "./types";

export const ARQUITECTURA = "ON-LINE";

export type ModuloId = "GERENCIAL" | "OPERATIVO";
export type Submodulo =
  | "Supervisión"
  | "Mantenimiento de Parámetros"
  | "Consulta"
  | "DATA ENTRY"
  | "REPORTES";

export type TipoInterfaz =
  | "Panel de supervisión"
  | "Mantenimiento de parámetros"
  | "Consulta"
  | "Transacción (Data Entry)"
  | "Transacción de campo"
  | "Reporte documental";

export type Alcance = "Preventivo" | "Correctivo" | "Preventivo y correctivo";

export interface FuncionNav {
  id: string;
  nombre: string;
  ruta: string;
  modulo: ModuloId;
  submodulo: Submodulo;
  interfaz: TipoInterfaz;
  descripcion: string;
  roles: Rol[];
  icon: LucideIcon;
  alcance: Alcance;
  prioritaria?: boolean;
  /** true: no figura en la arquitectura de referencia (pantalla complementaria heredada) */
  complementaria?: boolean;
}

export const ROLES: Record<Rol, { nombre: string; descripcion: string }> = {
  NOC: {
    nombre: "Ingeniero NOC",
    descripcion: "Supervisión de la red, parámetros, consultas, registro de tickets y despacho de OT.",
  },
  SUPERVISOR: {
    nombre: "Supervisor",
    descripcion: "Funciones gerenciales y supervisión de la operación en campo.",
  },
  TECNICO: {
    nombre: "Técnico de Campo",
    descripcion: "Solo funciones operativas de campo y sus reportes.",
  },
};

const GER: Rol[] = ["NOC", "SUPERVISOR"];
const CAMPO: Rol[] = ["SUPERVISOR", "TECNICO"];
const TODOS: Rol[] = ["NOC", "SUPERVISOR", "TECNICO"];

export const FUNCIONES: FuncionNav[] = [
  // ───────────── GERENCIAL › Supervisión (pantalla existente, complementaria)
  {
    id: "dashboard",
    nombre: "Dashboard Gerencial",
    ruta: "/dashboard",
    modulo: "GERENCIAL",
    submodulo: "Supervisión",
    interfaz: "Panel de supervisión",
    descripcion: "Indicadores de red, alertas del NOC, topología y resumen de mantenimiento.",
    roles: GER,
    icon: LayoutDashboard,
    alcance: "Preventivo y correctivo",
    complementaria: true,
  },
  // ───────────── GERENCIAL › Mantenimiento de Parámetros
  {
    id: "activos",
    nombre: "Gestión de Activos y Vida Útil",
    ruta: "/gerencial/parametros/activos",
    modulo: "GERENCIAL",
    submodulo: "Mantenimiento de Parámetros",
    interfaz: "Mantenimiento de parámetros",
    descripcion: "Catálogo de activos de red con vida útil, fecha estimada de renovación y criticidad.",
    roles: GER,
    icon: Boxes,
    alcance: "Preventivo",
  },
  {
    id: "sla",
    nombre: "SLA y Tiempos Base",
    ruta: "/gerencial/parametros/sla",
    modulo: "GERENCIAL",
    submodulo: "Mantenimiento de Parámetros",
    interfaz: "Mantenimiento de parámetros",
    descripcion: "Severidad, prioridad, tiempo máximo de atención y tiempo objetivo de solución.",
    roles: GER,
    icon: Timer,
    alcance: "Preventivo y correctivo",
  },
  {
    id: "zonas",
    nombre: "Zonas y Centrales",
    ruta: "/gerencial/parametros/zonas",
    modulo: "GERENCIAL",
    submodulo: "Mantenimiento de Parámetros",
    interfaz: "Mantenimiento de parámetros",
    descripcion: "Estructura territorial jerárquica Región → Zona → Central → Activos.",
    roles: GER,
    icon: Network,
    alcance: "Preventivo y correctivo",
  },
  {
    id: "contratistas",
    nombre: "Contratistas",
    ruta: "/gerencial/parametros/contratistas",
    modulo: "GERENCIAL",
    submodulo: "Mantenimiento de Parámetros",
    interfaz: "Mantenimiento de parámetros",
    descripcion: "Registro de empresas contratistas y sus cuadrillas (el rendimiento se evalúa en Batch).",
    roles: GER,
    icon: Building2,
    alcance: "Preventivo y correctivo",
  },
  {
    id: "planificacion",
    nombre: "Planificación de Mantenimientos",
    ruta: "/gerencial/parametros/planificacion",
    modulo: "GERENCIAL",
    submodulo: "Mantenimiento de Parámetros",
    interfaz: "Mantenimiento de parámetros",
    descripcion: "Plan de mantenimiento por activo, periodicidad y cuadrilla. No genera OT (lo hace Batch).",
    roles: GER,
    icon: CalendarRange,
    alcance: "Preventivo",
    prioritaria: true,
  },
  // ───────────── GERENCIAL › Consulta
  {
    id: "tracking",
    nombre: "Tracking y Geolocalización",
    ruta: "/gerencial/consulta/tracking",
    modulo: "GERENCIAL",
    submodulo: "Consulta",
    interfaz: "Consulta",
    descripcion: "Posición y estado de las cuadrillas en campo respecto de sus órdenes de trabajo.",
    roles: GER,
    icon: Navigation,
    alcance: "Preventivo y correctivo",
  },
  {
    id: "estado-tickets",
    nombre: "Estado de Tickets e Incidencias",
    ruta: "/gerencial/consulta/tickets",
    modulo: "GERENCIAL",
    submodulo: "Consulta",
    interfaz: "Consulta",
    descripcion: "Ciclo de vida de cada ticket, cumplimiento de SLA y OT asociada.",
    roles: GER,
    icon: Ticket,
    alcance: "Correctivo",
  },
  {
    id: "disponibilidad",
    nombre: "Disponibilidad de Red",
    ruta: "/gerencial/consulta/disponibilidad",
    modulo: "GERENCIAL",
    submodulo: "Consulta",
    interfaz: "Consulta",
    descripcion: "Disponibilidad por segmento, zona y central; activos degradados o fuera de servicio.",
    roles: GER,
    icon: Activity,
    alcance: "Preventivo y correctivo",
  },
  {
    id: "seguimiento",
    nombre: "Seguimiento de Mantenimientos",
    ruta: "/gerencial/consulta/seguimiento",
    modulo: "GERENCIAL",
    submodulo: "Consulta",
    interfaz: "Consulta",
    descripcion: "Mantenimientos programados frente a ejecutados, pendientes e incumplidos.",
    roles: GER,
    icon: BarChart3,
    alcance: "Preventivo y correctivo",
  },
  // ───────────── OPERATIVO › DATA ENTRY
  {
    id: "registro-tickets",
    nombre: "Registro de Tickets e Incidencias",
    ruta: "/operativo/data-entry/tickets",
    modulo: "OPERATIVO",
    submodulo: "DATA ENTRY",
    interfaz: "Transacción (Data Entry)",
    descripcion: "Alta de incidencias desde Call Center, NOC o detección automática, con control de duplicados.",
    roles: GER,
    icon: FilePlus2,
    alcance: "Correctivo",
  },
  {
    id: "ots",
    nombre: "Gestión de Órdenes de Trabajo",
    ruta: "/operativo/ots",
    modulo: "OPERATIVO",
    submodulo: "DATA ENTRY",
    interfaz: "Transacción (Data Entry)",
    descripcion: "Generación, asignación y despacho de OT preventivas y correctivas.",
    roles: GER,
    icon: ClipboardList,
    alcance: "Preventivo y correctivo",
  },
  {
    id: "checkin",
    nombre: "Check-in y Ejecución Dinámica",
    ruta: "/operativo/campo/checkin",
    modulo: "OPERATIVO",
    submodulo: "DATA ENTRY",
    interfaz: "Transacción de campo",
    descripcion: "Check-in con validación GPS, Análisis de Trabajo Seguro y ejecución según el tipo de OT.",
    roles: CAMPO,
    icon: MapPinned,
    alcance: "Preventivo y correctivo",
  },
  {
    id: "repuestos",
    nombre: "Descargo de Repuestos",
    ruta: "/operativo/campo/repuestos",
    modulo: "OPERATIVO",
    submodulo: "DATA ENTRY",
    interfaz: "Transacción de campo",
    descripcion: "Descargo de materiales usados contra el stock de la cuadrilla.",
    roles: CAMPO,
    icon: PackageMinus,
    alcance: "Preventivo y correctivo",
  },
  {
    id: "cierre",
    nombre: "Cierre Transaccional",
    ruta: "/operativo/campo/cierre",
    modulo: "OPERATIVO",
    submodulo: "DATA ENTRY",
    interfaz: "Transacción de campo",
    descripcion: "Cierre de la OT con evidencia obligatoria y actualización de ticket, plan y activo.",
    roles: CAMPO,
    icon: FileCheck2,
    alcance: "Preventivo y correctivo",
  },
  // ───────────── OPERATIVO › REPORTES
  {
    id: "rep-asignacion",
    nombre: "Papeleta de Asignación de OT",
    ruta: "/operativo/reportes/asignacion-ot",
    modulo: "OPERATIVO",
    submodulo: "REPORTES",
    interfaz: "Reporte documental",
    descripcion: "Documento que entrega la OT a la cuadrilla con actividad, SLA y materiales previstos.",
    roles: TODOS,
    icon: ClipboardCheck,
    alcance: "Preventivo y correctivo",
  },
  {
    id: "rep-conformidad",
    nombre: "Constancia de Conformidad de Servicio",
    ruta: "/operativo/reportes/conformidad",
    modulo: "OPERATIVO",
    submodulo: "REPORTES",
    interfaz: "Reporte documental",
    descripcion: "Constancia firmada del trabajo realizado y del resultado técnico obtenido.",
    roles: CAMPO,
    icon: BadgeCheck,
    alcance: "Preventivo y correctivo",
  },
  {
    id: "rep-vale",
    nombre: "Vale Instantáneo de Consumo de Materiales",
    ruta: "/operativo/reportes/vale-consumo",
    modulo: "OPERATIVO",
    submodulo: "REPORTES",
    interfaz: "Reporte documental",
    descripcion: "Vale de salida de materiales generado en el descargo de repuestos.",
    roles: CAMPO,
    icon: Receipt,
    alcance: "Preventivo y correctivo",
  },
  {
    id: "rep-ats",
    nombre: "Papeleta de Análisis de Trabajo Seguro (ATS)",
    ruta: "/operativo/reportes/ats",
    modulo: "OPERATIVO",
    submodulo: "REPORTES",
    interfaz: "Reporte documental",
    descripcion: "Registro de riesgos, clima, arnés, EPP y autorización previa a la ejecución.",
    roles: CAMPO,
    icon: ShieldAlert,
    alcance: "Preventivo y correctivo",
  },
];

export interface GrupoNav {
  modulo: ModuloId;
  submodulo: Submodulo;
  funciones: FuncionNav[];
}

export const MODULOS: { id: ModuloId; nombre: string; ruta: string; descripcion: string }[] = [
  {
    id: "GERENCIAL",
    nombre: "Gerencial",
    ruta: "/gerencial",
    descripcion: "Mantenimiento de parámetros del sistema y consultas de supervisión.",
  },
  {
    id: "OPERATIVO",
    nombre: "Operativo",
    ruta: "/operativo",
    descripcion: "Registro de transacciones del día a día y emisión de documentos de campo.",
  },
];

const ORDEN_SUB: Submodulo[] = [
  "Supervisión",
  "Mantenimiento de Parámetros",
  "Consulta",
  "DATA ENTRY",
  "REPORTES",
];

export function gruposPorModulo(modulo: ModuloId, rol?: Rol | null): GrupoNav[] {
  return ORDEN_SUB.map((sub) => ({
    modulo,
    submodulo: sub,
    funciones: FUNCIONES.filter(
      (f) => f.modulo === modulo && f.submodulo === sub && (!rol || f.roles.includes(rol))
    ),
  })).filter((g) => g.funciones.length > 0);
}

export function getFuncion(id: string): FuncionNav {
  const f = FUNCIONES.find((x) => x.id === id);
  if (!f) throw new Error(`Función no registrada en la arquitectura: ${id}`);
  return f;
}

export function funcionPorRuta(pathname: string): FuncionNav | undefined {
  return FUNCIONES.find((f) => pathname === f.ruta || pathname.startsWith(f.ruta + "/"));
}

export function puedeAcceder(rol: Rol | null | undefined, id: string): boolean {
  if (!rol) return false;
  return getFuncion(id).roles.includes(rol);
}

export function moduloVisible(rol: Rol | null | undefined, modulo: ModuloId): boolean {
  return FUNCIONES.some((f) => f.modulo === modulo && !!rol && f.roles.includes(rol));
}

/** Ruta de inicio según el perfil. */
export function inicioPorRol(rol: Rol): string {
  return rol === "TECNICO" ? "/operativo/campo/checkin" : "/dashboard";
}

/** Módulo Batch (equipo Batch): solo se referencia, no se modifica. */
export const BATCH = {
  nombre: "Batch (Aplicativo / Técnico)",
  ruta: "/batch",
  roles: GER,
  descripcion:
    "Procesos periódicos del equipo Batch: generación de OT preventivas, rendimiento por contratista, pre-liquidaciones y penalidades.",
};
