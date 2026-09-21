// Reglas de validación del sistema. Todas devuelven resultados legibles para mostrarlos
// en pantalla (la interfaz explica qué se validó y por qué se bloquea una acción).
import type { Activo, AtsRegistro, Ejecucion, OrdenTrabajo, Ticket } from "./types";
import { RADIO_CHECKIN_M, distanciaM, fmtDistancia } from "./data";

export interface Chequeo {
  id: string;
  etiqueta: string;
  ok: boolean;
  detalle: string;
}

const TICKET_CERRADO = ["Solucionado", "Cerrado"];

// ───────────── 1. Tickets duplicados
/** Tickets abiertos sobre el mismo activo (posibles duplicados). */
export function ticketsDuplicados(tickets: Ticket[], activoId: string): Ticket[] {
  if (!activoId) return [];
  return tickets.filter((t) => t.activoId === activoId && !TICKET_CERRADO.includes(t.estado));
}

/** OT abiertas del mismo activo o del mismo ticket (evita despachar dos veces la misma incidencia). */
export function otsDuplicadas(
  ots: OrdenTrabajo[],
  activoId: string,
  ticketId?: string | null
): OrdenTrabajo[] {
  return ots.filter(
    (o) =>
      o.status !== "CERRADA" &&
      ((activoId && o.activoId === activoId) || (ticketId && o.ticketId === ticketId))
  );
}

// ───────────── 2. Proximidad GPS
export function validarProximidad(activo: Activo, lat: number, lng: number) {
  const distancia = distanciaM(activo.lat, activo.lng, lat, lng);
  const valido = distancia <= RADIO_CHECKIN_M;
  return {
    distancia,
    valido,
    mensaje: valido
      ? `Posición a ${fmtDistancia(distancia)} del activo (dentro del radio de ${RADIO_CHECKIN_M} m).`
      : `Posición a ${fmtDistancia(distancia)} del activo. El check-in exige estar a ${RADIO_CHECKIN_M} m o menos.`,
  };
}

// ───────────── ATS (condición previa a la ejecución)
export function validarAts(ats: AtsRegistro): Chequeo[] {
  const altura = ats.riesgos.includes("Trabajo en altura");
  const electrico = ats.riesgos.includes("Riesgo eléctrico");
  const confinado = ats.riesgos.includes("Espacio confinado");
  const climaSevero =
    ats.clima === "Lluvia intensa o tormenta eléctrica" || ats.clima === "Vientos fuertes";
  const eppBase = ["Casco", "Lentes de seguridad"].every((e) => ats.epp.includes(e));

  return [
    {
      id: "riesgos",
      etiqueta: "Riesgos identificados",
      ok: ats.riesgos.length > 0,
      detalle: ats.riesgos.length ? ats.riesgos.join(", ") : "Debe identificar al menos un riesgo.",
    },
    {
      id: "clima",
      etiqueta: "Condición climática",
      ok: !!ats.clima && !(altura && climaSevero),
      detalle: !ats.clima
        ? "Registre la condición climática."
        : altura && climaSevero
        ? `Con "${ats.clima}" no se autoriza trabajo en altura: reprogramar.`
        : ats.clima,
    },
    {
      id: "arnes",
      etiqueta: "Uso de arnés",
      ok: altura ? ats.arnes === "Sí" : ats.arnes !== "",
      detalle: altura
        ? ats.arnes === "Sí"
          ? "Arnés verificado para trabajo en altura."
          : "El trabajo en altura exige arnés y línea de vida."
        : ats.arnes
        ? ats.arnes
        : "Indique si usará arnés.",
    },
    {
      id: "epp",
      etiqueta: "Equipo de protección personal",
      ok:
        eppBase &&
        (!electrico || ats.epp.includes("Guantes dieléctricos")) &&
        (!altura || ats.epp.includes("Arnés y línea de vida")) &&
        (!confinado || ats.epp.includes("Detector de gases")),
      detalle: !eppBase
        ? "Casco y lentes de seguridad son obligatorios."
        : electrico && !ats.epp.includes("Guantes dieléctricos")
        ? "Riesgo eléctrico: faltan guantes dieléctricos."
        : altura && !ats.epp.includes("Arnés y línea de vida")
        ? "Trabajo en altura: falta arnés y línea de vida."
        : confinado && !ats.epp.includes("Detector de gases")
        ? "Espacio confinado: falta detector de gases."
        : `${ats.epp.length} elementos verificados.`,
    },
    {
      id: "autorizacion",
      etiqueta: "Autorización del supervisor",
      ok: ats.autorizado && ats.autorizadoPor.trim().length > 2,
      detalle:
        ats.autorizado && ats.autorizadoPor.trim().length > 2
          ? `Autorizado por ${ats.autorizadoPor}.`
          : "Se requiere nombre y conformidad del supervisor que autoriza.",
    },
  ];
}

// ───────────── 3. Stock de repuestos
export interface LineaDescargo {
  codigo: string;
  cantidad: number;
}

export function validarStock(
  stock: Record<string, number> | undefined,
  lineas: LineaDescargo[]
): (LineaDescargo & { disponible: number; ok: boolean })[] {
  const acumulado: Record<string, number> = {};
  return lineas.map((l) => {
    acumulado[l.codigo] = (acumulado[l.codigo] ?? 0) + l.cantidad;
    const disponible = stock?.[l.codigo] ?? 0;
    return { ...l, disponible, ok: l.cantidad > 0 && acumulado[l.codigo] <= disponible };
  });
}

// ───────────── 4. Evidencia para el cierre
export function validarCierre(ot: OrdenTrabajo, ej: Ejecucion | undefined, actividadesRequeridas: string[]): Chequeo[] {
  const act = ej?.actividades ?? [];
  const faltan = actividadesRequeridas.filter((a) => !act.includes(a));
  return [
    {
      id: "checkin",
      etiqueta: "Check-in validado por GPS",
      ok: !!ej?.checkIn?.valido,
      detalle: ej?.checkIn?.valido
        ? `Registrado ${ej.checkIn.hora.slice(11)} a ${fmtDistancia(ej.checkIn.distanciaM)} del activo.`
        : "No hay check-in válido para esta OT.",
    },
    {
      id: "ats",
      etiqueta: "ATS aprobado",
      ok: !!ej?.atsValido,
      detalle: ej?.atsValido ? `Autorizado por ${ej.ats?.autorizadoPor}.` : "Falta registrar o aprobar el ATS.",
    },
    {
      id: "actividades",
      etiqueta: `Actividades ${ot.tipo === "PREVENTIVO" ? "preventivas" : "correctivas"} completas`,
      ok: faltan.length === 0,
      detalle: faltan.length === 0 ? `${act.length} actividades registradas.` : `Pendiente: ${faltan.join(", ")}.`,
    },
    {
      id: "medicion",
      etiqueta: "Resultado técnico / medición",
      ok: (ej?.evidencia ?? "").trim().length >= 8,
      detalle: (ej?.evidencia ?? "").trim().length >= 8 ? ej!.evidencia : "Registre la medición final (mínimo 8 caracteres).",
    },
    {
      id: "foto",
      etiqueta: "Fotografía de evidencia",
      ok: !!ej?.foto,
      detalle: ej?.foto ? "Fotografía adjunta." : "Adjunte al menos una fotografía del trabajo terminado.",
    },
    {
      id: "firma",
      etiqueta: "Firma de conformidad",
      ok: !!ej?.firma && !!ej?.firmante && !!ej?.conformidad,
      detalle:
        ej?.firma && ej?.firmante && ej?.conformidad
          ? `${ej.conformidad} · ${ej.firmante}`
          : "Registre firmante, tipo de conformidad y firma.",
    },
  ];
}
