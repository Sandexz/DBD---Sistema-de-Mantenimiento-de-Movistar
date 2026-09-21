// Datos iniciales (mock) tipados y utilidades de dominio compartidas por las pantallas.
import regionesJson from "@/mock-data/regiones.json";
import zonasJson from "@/mock-data/zonas.json";
import centralesJson from "@/mock-data/centrales.json";
import activosJson from "@/mock-data/activos.json";
import slaJson from "@/mock-data/sla.json";
import tiemposJson from "@/mock-data/tiempos-base.json";
import umbralesJson from "@/mock-data/umbrales.json";
import contratistasJson from "@/mock-data/contratistas.json";
import cuadrillasJson from "@/mock-data/cuadrillas.json";
import planesJson from "@/mock-data/planes.json";
import ticketsJson from "@/mock-data/tickets.json";
import otsJson from "@/mock-data/ots.json";
import trackingJson from "@/mock-data/tracking.json";
import materialesJson from "@/mock-data/materiales.json";
import stockJson from "@/mock-data/stock.json";
import consumosJson from "@/mock-data/consumos.json";
import ejecucionesJson from "@/mock-data/ejecuciones.json";
import alertasJson from "@/mock-data/alertas.json";
import seguimientoJson from "@/mock-data/seguimiento.json";

import type {
  Activo,
  Alerta,
  Central,
  Consumo,
  Contratista,
  Criticidad,
  Cuadrilla,
  Ejecucion,
  MantenimientoPeriodo,
  Material,
  OrdenTrabajo,
  PlanMantenimiento,
  PosicionCuadrilla,
  Region,
  SlaParametro,
  Ticket,
  TiempoBase,
  UmbralRed,
  Zona,
} from "./types";
import { FECHA_REFERENCIA, addYears, diffDays } from "./fechas";

export const INICIAL = {
  regiones: regionesJson as Region[],
  zonas: zonasJson as Zona[],
  centrales: centralesJson as Central[],
  activos: activosJson as unknown as Activo[],
  sla: slaJson as unknown as SlaParametro[],
  tiemposBase: tiemposJson as unknown as TiempoBase[],
  umbrales: umbralesJson as UmbralRed[],
  contratistas: contratistasJson as unknown as Contratista[],
  cuadrillas: cuadrillasJson as Cuadrilla[],
  planes: planesJson as unknown as PlanMantenimiento[],
  tickets: ticketsJson as unknown as Ticket[],
  ots: otsJson as unknown as OrdenTrabajo[],
  tracking: trackingJson as unknown as PosicionCuadrilla[],
  stock: stockJson as Record<string, Record<string, number>>,
  consumos: consumosJson as Consumo[],
  ejecuciones: ejecucionesJson as unknown as Ejecucion[],
  seguimiento: seguimientoJson as unknown as MantenimientoPeriodo[],
};

export const MATERIALES = materialesJson as Material[];
export const ALERTAS = alertasJson as unknown as Alerta[];

export const TIPOS_ACTIVO = [
  "Data Center",
  "Central",
  "Nodo",
  "Switch Core",
  "OLT",
  "BTS",
  "ODF",
  "Mufa",
  "Splitter",
  "Caja NAP",
  "Tramo de fibra óptica",
  "Equipo de respaldo",
];

export const CRITICIDADES: Criticidad[] = ["CRÍTICA", "ALTA", "MEDIA", "BAJA"];

// ───────────────────────── Vida útil
export type EstadoVidaUtil = "Vigente" | "Renovación próxima" | "Vida útil excedida";

export function fechaRenovacion(a: Pick<Activo, "fechaInstalacion" | "vidaUtilAnios">): string {
  return addYears(a.fechaInstalacion, a.vidaUtilAnios);
}

export function vidaUtil(a: Pick<Activo, "fechaInstalacion" | "vidaUtilAnios">) {
  const renovacion = fechaRenovacion(a);
  const totalDias = Math.max(1, diffDays(a.fechaInstalacion, renovacion));
  const usados = diffDays(a.fechaInstalacion, FECHA_REFERENCIA);
  const pct = Math.max(0, Math.round((usados / totalDias) * 100));
  const diasRestantes = diffDays(FECHA_REFERENCIA, renovacion);
  let estado: EstadoVidaUtil = "Vigente";
  if (diasRestantes < 0) estado = "Vida útil excedida";
  else if (diasRestantes <= 365) estado = "Renovación próxima";
  const aniosRestantes = diasRestantes / 365.25;
  return { renovacion, pct, diasRestantes, aniosRestantes, estado };
}

// ───────────────────────── SLA
export function slaPorCriticidad(sla: SlaParametro[], c: Criticidad): SlaParametro | undefined {
  return sla.find((s) => s.severidad === c && s.estado === "Vigente");
}

export function prioridadPorCriticidad(c: Criticidad): "P1" | "P2" | "P3" | "P4" {
  return ({ CRÍTICA: "P1", ALTA: "P2", MEDIA: "P3", BAJA: "P4" } as const)[c];
}

export function horasTexto(min: number): string {
  if (min % 60 !== 0) return `${(min / 60).toFixed(1)} horas`;
  const h = min / 60;
  return h === 1 ? "1 hora" : `${h} horas`;
}

/** Convierte "2 horas" / "1.5 horas" / "24 horas" en minutos. */
export function slaTextoAMin(txt: string): number {
  const n = parseFloat(txt.replace(",", "."));
  if (Number.isNaN(n)) return 0;
  return Math.round(n * 60);
}

// ───────────────────────── Geografía
/** Distancia en metros entre dos coordenadas (fórmula de Haversine). */
export function distanciaM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(a)));
}

export function fmtDistancia(m: number): string {
  if (m < 1000) return `${m} m`;
  return `${(m / 1000).toFixed(1)} km`;
}

export function fmtCoord(lat: number, lng: number): string {
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

export function fmtNum(n: number): string {
  return n.toLocaleString("es-PE");
}

export function fmtSoles(n: number): string {
  return `S/ ${n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Radio máximo permitido para el check-in (metros). */
export const RADIO_CHECKIN_M = 50;

// ───────────────────────── Catálogos del ATS y de ejecución
export const RIESGOS_ATS = [
  "Trabajo en altura",
  "Riesgo eléctrico",
  "Espacio confinado",
  "Tránsito vehicular",
  "Exposición a láser de fibra",
  "Exposición a radiofrecuencia",
];

export const CLIMAS_ATS = [
  "Despejado",
  "Nublado",
  "Lluvia ligera",
  "Lluvia intensa o tormenta eléctrica",
  "Vientos fuertes",
];

export const EPP_ATS = [
  "Casco",
  "Lentes de seguridad",
  "Guantes de trabajo",
  "Guantes dieléctricos",
  "Calzado dieléctrico",
  "Chaleco reflectivo",
  "Arnés y línea de vida",
  "Protección auditiva",
  "Detector de gases",
];

export const ACTIVIDADES_PREVENTIVAS = [
  "Inspección visual del activo y su entorno",
  "Revisión de conexiones y estado físico",
  "Prueba de funcionamiento",
  "Mantenimiento programado (limpieza y ajuste)",
  "Registro de mediciones",
];

export const ACTIVIDADES_CORRECTIVAS = [
  "Diagnóstico de la falla",
  "Aislamiento del punto de falla",
  "Reparación o reemplazo",
  "Prueba de restablecimiento del servicio",
  "Confirmación con el NOC",
];

export const CAUSAS_FALLA = [
  "Daño por terceros (obras civiles)",
  "Vandalismo o robo",
  "Falla de hardware",
  "Falla de energía comercial",
  "Degradación por antigüedad",
  "Condiciones climáticas",
  "Error de configuración",
];

/** Medición sugerida según tipo de activo (guía para la evidencia técnica). */
export function medicionSugerida(tipoActivo: string): string {
  const t = tipoActivo.toLowerCase();
  if (t.includes("tramo") || t.includes("mufa") || t.includes("odf")) return "Medición OTDR (dB/km y pérdida por empalme)";
  if (t.includes("nap") || t.includes("splitter") || t.includes("olt")) return "Potencia óptica en puerto (dBm)";
  if (t.includes("bts")) return "VSWR por sector y throughput";
  if (t.includes("respaldo")) return "Tensión de salida (V) y autonomía (h)";
  if (t.includes("data center") || t.includes("central")) return "Temperatura de sala (°C) y carga eléctrica (%)";
  return "Parámetros operativos (potencia, alarmas, CPU)";
}

export function actividadesPara(tipo: "PREVENTIVO" | "CORRECTIVO"): string[] {
  return tipo === "PREVENTIVO" ? ACTIVIDADES_PREVENTIVAS : ACTIVIDADES_CORRECTIVAS;
}

/** Riesgos sugeridos para el ATS según el tipo de activo (el técnico los confirma). */
export function riesgosSugeridos(tipoActivo: string): string[] {
  const t = tipoActivo.toLowerCase();
  if (t.includes("bts")) return ["Trabajo en altura", "Exposición a radiofrecuencia"];
  if (t.includes("tramo")) return ["Tránsito vehicular", "Exposición a láser de fibra"];
  if (t.includes("mufa")) return ["Espacio confinado", "Exposición a láser de fibra"];
  if (t.includes("nap") || t.includes("splitter")) return ["Trabajo en altura", "Exposición a láser de fibra"];
  return ["Riesgo eléctrico"];
}
