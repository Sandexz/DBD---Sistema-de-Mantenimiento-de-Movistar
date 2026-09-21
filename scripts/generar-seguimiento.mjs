// Genera mock-data/seguimiento.json: consolidado de mantenimientos del 3er trimestre 2026.
// Conceptualmente es la salida que el proceso BATCH deja disponible para lectura;
// la pantalla "Seguimiento de Mantenimientos" (Gerencial › Consulta) solo la consulta.
//
// Reglas: Ejecutado = con fecha de ejecución; Pendiente = sin ejecutar y aún dentro de
// plazo/tolerancia; Incumplido = vencido fuera de tolerancia sin ejecución.
// Uso: node scripts/generar-seguimiento.mjs
import { readFileSync, writeFileSync } from "node:fs";

const rd = (f) => JSON.parse(readFileSync(new URL(`../mock-data/${f}`, import.meta.url)));
const activos = rd("activos.json");
const cuadrillas = rd("cuadrillas.json");
const planes = rd("planes.json");
const tiempos = rd("tiempos-base.json");

const REF = "2026-09-20";
const TOTALES = { Ejecutado: 95, Pendiente: 18, Incumplido: 7 };

// PRNG determinista (mulberry32)
let seed = 20260920;
const rnd = () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (s, n) => { const d = new Date(s + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return iso(d); };
const between = (a, b) => addDays(a, Math.floor(rnd() * ((new Date(b) - new Date(a)) / 86400000 + 1)));

const crewOf = (id) => cuadrillas.find((c) => c.id === id);
const activo = (id) => activos.find((a) => a.codigo === id);
const crewForZone = (zonaId) => {
  const same = cuadrillas.filter((c) => c.zonaId === zonaId && c.contratistaId !== "CTR-04");
  return pick(same.length ? same : cuadrillas.filter((c) => c.contratistaId !== "CTR-04"));
};
const actividadPara = (a, tipo) => {
  if (tipo === "CORRECTIVO") return pick(["Reparación diferida de avería menor", "Reemplazo programado de componente", "Corrección de observación de inspección"]);
  const t = tiempos.filter((x) => x.tipoActivo === a.tipo);
  return t.length ? pick(t).actividad : "Inspección técnica";
};

const registros = [];
let n = 0;
const push = (r) => registros.push({ id: `MNT-Q3-${String(++n).padStart(3, "0")}`, ...r });

// 1) Planes reales cuya fecha cae en el trimestre (jul-sep 2026)
const mapEstado = { Ejecutado: "Ejecutado", Incumplido: "Incumplido", Pendiente: "Pendiente", "Próximo": "Pendiente", Programado: "Pendiente" };
for (const p of planes.filter((p) => p.fechaProgramada >= "2026-07-01" && p.fechaProgramada <= "2026-09-30")) {
  const a = activo(p.activoId);
  const c = crewOf(p.cuadrillaId);
  const estado = mapEstado[p.estado];
  push({
    planId: p.id, activoId: a.codigo, centralId: a.centralId, zonaId: a.zonaId,
    contratistaId: c.contratistaId, cuadrillaId: c.id, tipo: p.tipo, actividad: p.actividad,
    fechaProgramada: p.fechaProgramada,
    fechaEjecucion: estado === "Ejecutado" ? p.fechaProgramada : null,
    estado,
  });
}

// 2) Completar hasta los totales del trimestre
const faltan = { ...TOTALES };
for (const r of registros) faltan[r.estado]--;

// Distribución mensual de los ejecutados restantes (jul/ago/sep)
const ejecMes = { "07": 37, "08": 37, "09": faltan.Ejecutado - 74 };
const incMes = ["07", "08", "08", "09", "09"].slice(0, faltan.Incumplido);
const rangos = { "07": ["2026-07-01", "2026-07-31"], "08": ["2026-08-01", "2026-08-31"], "09": ["2026-09-01", REF] };

const nuevo = (estado, fechaProgramada) => {
  const a = pick(activos);
  const c = crewForZone(a.zonaId);
  const tipo = rnd() < 0.12 ? "CORRECTIVO" : "PREVENTIVO";
  let fechaEjecucion = null;
  if (estado === "Ejecutado") {
    fechaEjecucion = addDays(fechaProgramada, Math.floor(rnd() * 5) - 2);
    if (fechaEjecucion > REF) fechaEjecucion = REF;
  }
  push({
    planId: null, activoId: a.codigo, centralId: a.centralId, zonaId: a.zonaId,
    contratistaId: c.contratistaId, cuadrillaId: c.id, tipo, actividad: actividadPara(a, tipo),
    fechaProgramada, fechaEjecucion, estado,
  });
};

for (const [mes, cant] of Object.entries(ejecMes)) for (let i = 0; i < cant; i++) nuevo("Ejecutado", between(...rangos[mes]));
for (const mes of incMes) nuevo("Incumplido", mes === "09" ? between("2026-09-01", "2026-09-10") : between(...rangos[mes]));
for (let i = 0; i < faltan.Pendiente; i++) nuevo("Pendiente", between("2026-09-14", "2026-09-30"));

registros.sort((a, b) => a.fechaProgramada.localeCompare(b.fechaProgramada));
registros.forEach((r, i) => (r.id = `MNT-Q3-${String(i + 1).padStart(3, "0")}`));

const cuenta = registros.reduce((acc, r) => ((acc[r.estado] = (acc[r.estado] || 0) + 1), acc), {});
console.log("Total", registros.length, cuenta);
writeFileSync(new URL("../mock-data/seguimiento.json", import.meta.url), JSON.stringify(registros, null, 1) + "\n");
