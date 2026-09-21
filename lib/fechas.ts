// Fecha de referencia del prototipo: todos los datos mock se construyen alrededor de ella.
export const FECHA_REFERENCIA = "2026-09-20";
export const HORA_REFERENCIA = "10:15";

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const MESES_LARGOS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function toISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** dd/mm/aaaa */
export function fmtFecha(iso?: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}

/** dd/mm/aaaa hh:mm (acepta "yyyy-mm-dd hh:mm" o ISO con T) */
export function fmtFechaHora(v?: string | null): string {
  if (!v) return "—";
  const hora = v.length > 10 ? v.slice(11, 16) : "";
  return hora ? `${fmtFecha(v)} ${hora}` : fmtFecha(v);
}

export function fmtMesCorto(iso: string): string {
  const d = parseISO(iso);
  return `${MESES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function nombreMes(indice0: number): string {
  return MESES_LARGOS[indice0];
}

export function addMonths(iso: string, months: number): string {
  const d = parseISO(iso);
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + months);
  const last = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  d.setUTCDate(Math.min(day, last));
  return toISO(d);
}

export function addYears(iso: string, years: number): string {
  return addMonths(iso, years * 12);
}

export function addDays(iso: string, days: number): string {
  const d = parseISO(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return toISO(d);
}

/** Diferencia en días (b - a). */
export function diffDays(a: string, b: string): number {
  return Math.round((parseISO(b).getTime() - parseISO(a).getTime()) / 86400000);
}

export function ahoraReferencia(): string {
  return `${FECHA_REFERENCIA} ${HORA_REFERENCIA}`;
}

/** Marca de tiempo "yyyy-mm-dd hh:mm" usando la fecha de referencia y la hora real del equipo. */
export function sello(): string {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return `${FECHA_REFERENCIA} ${hh}:${mm}`;
}

export function fmtMinutos(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

// ───────── Marcas de tiempo "yyyy-mm-dd hh:mm" (también aceptan el separador "T")
function aMinutosAbs(v: string): number {
  const fecha = parseISO(v.slice(0, 10)).getTime() / 60000;
  const hh = Number(v.slice(11, 13) || 0);
  const mm = Number(v.slice(14, 16) || 0);
  return fecha + hh * 60 + mm;
}

/** Minutos transcurridos entre dos marcas de tiempo (b - a). */
export function minutosEntre(a: string, b: string): number {
  return Math.round(aMinutosAbs(b) - aMinutosAbs(a));
}

/** Suma minutos a una marca "yyyy-mm-dd hh:mm". */
export function sumarMinutos(v: string, min: number): string {
  const total = aMinutosAbs(v) + min;
  const dia = Math.floor(total / 1440);
  const resto = total - dia * 1440;
  const d = new Date(dia * 86400000);
  const hh = String(Math.floor(resto / 60)).padStart(2, "0");
  const mm = String(Math.round(resto % 60)).padStart(2, "0");
  return `${toISO(d)} ${hh}:${mm}`;
}

/** Hora "hh:mm" de una marca de tiempo. */
export function horaDe(v?: string | null): string {
  return v && v.length > 10 ? v.slice(11, 16) : "—";
}
