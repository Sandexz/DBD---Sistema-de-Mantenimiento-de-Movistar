"use client";

// GERENCIAL › Mantenimiento de Parámetros › Planificación de Mantenimientos (PRIORITARIA)
// Planifica mantenimientos por activo. NO genera OT: la generación la realiza el proceso Batch.
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarRange, Plus, Pencil, List, CalendarDays, ChevronLeft, ChevronRight, Layers, Info } from "lucide-react";
import { AppShell } from "@/components/sgmr/shell";
import {
  Btn,
  Callout,
  Dialog,
  EmptyState,
  Field,
  Input,
  KV,
  Panel,
  Pill,
  SearchInput,
  Segmented,
  Select,
  Stat,
  Textarea,
  TipoMantTag,
  tonePlan,
  cx,
  DetailAside,
} from "@/components/sgmr/ui";
import { estadoPlanCalculado, seguimientoActual, useCatalogos, useSgmr } from "@/lib/store";
import { useQueryParam } from "@/lib/use-query";
import { FECHA_REFERENCIA, addMonths, diffDays, fmtFecha, nombreMes, parseISO, toISO } from "@/lib/fechas";
import { vidaUtil } from "@/lib/data";
import type { EstadoPlan, Periodicidad, PlanMantenimiento, TipoMantenimiento } from "@/lib/types";

const ESTADOS: EstadoPlan[] = ["Programado", "Próximo", "Ejecutado", "Pendiente", "Incumplido"];
const PERIODOS: Periodicidad[] = ["Mensual", "Trimestral", "Semestral", "Anual", "Única"];
const MESES_PERIODO: Record<Periodicidad, number> = { Mensual: 1, Trimestral: 3, Semestral: 6, Anual: 12, Única: 0 };
const TEXTO_PERIODO: Record<Periodicidad, string> = {
  Mensual: "cada mes",
  Trimestral: "cada 3 meses",
  Semestral: "cada 6 meses",
  Anual: "cada 12 meses",
  Única: "una sola vez",
};

function proximas(p: Pick<PlanMantenimiento, "fechaProgramada" | "periodicidad">, n = 3): string[] {
  const m = MESES_PERIODO[p.periodicidad];
  if (!m) return [];
  return Array.from({ length: n }, (_, i) => addMonths(p.fechaProgramada, m * (i + 1)));
}

function relativo(fecha: string): string {
  const d = diffDays(FECHA_REFERENCIA, fecha);
  if (d === 0) return "hoy";
  return d > 0 ? `en ${d} día${d === 1 ? "" : "s"}` : `hace ${-d} día${d === -1 ? "" : "s"}`;
}

type Form = {
  id?: string;
  activoId: string;
  tipo: TipoMantenimiento;
  actividad: string;
  periodicidad: Periodicidad;
  fechaProgramada: string;
  responsable: string;
  cuadrillaId: string;
  observacion: string;
};

const FORM_VACIO: Form = {
  activoId: "",
  tipo: "PREVENTIVO",
  actividad: "",
  periodicidad: "Semestral",
  fechaProgramada: "",
  responsable: "",
  cuadrillaId: "",
  observacion: "",
};

export default function PlanificacionPage() {
  const { datos, mutar, notificar } = useSgmr();
  const cat = useCatalogos();
  const [planSel, setPlanSel] = useQueryParam("plan");
  const [estado, setEstado] = useState<EstadoPlan | "Todos">("Todos");
  const [q, setQ] = useState("");
  const [zona, setZona] = useState("");
  const [vista, setVista] = useState<"tabla" | "calendario">("tabla");
  const [mes, setMes] = useState("2026-09-01");
  const [form, setForm] = useState<Form | null>(null);
  const [intentado, setIntentado] = useState(false);

  const conteo = useMemo(() => {
    const c: Record<string, number> = {};
    ESTADOS.forEach((e) => (c[e] = datos.planes.filter((p) => p.estado === e).length));
    return c;
  }, [datos.planes]);

  const filtrados = useMemo(() => {
    const t = q.toLowerCase();
    return datos.planes
      .filter((p) => estado === "Todos" || p.estado === estado)
      .filter((p) => !zona || cat.activo(p.activoId)?.zonaId === zona)
      .filter(
        (p) =>
          !t ||
          [p.id, p.activoId, p.actividad, p.responsable, p.cuadrillaId, cat.activo(p.activoId)?.tipo ?? ""].some((v) =>
            v.toLowerCase().includes(t)
          )
      )
      .sort((a, b) => a.fechaProgramada.localeCompare(b.fechaProgramada));
  }, [datos.planes, estado, zona, q, cat]);

  const sel = datos.planes.find((p) => p.id === planSel);
  const selActivo = cat.activo(sel?.activoId);
  const selTb = datos.tiemposBase.find((t) => t.actividad === sel?.actividad && t.tipoActivo === selActivo?.tipo);
  const selSeg = sel ? seguimientoActual(datos).filter((m) => m.planId === sel.id) : [];

  // ── Formulario
  const fActivo = cat.activo(form?.activoId);
  const tiempos = datos.tiemposBase.filter((t) => !fActivo || t.tipoActivo === fActivo.tipo);
  const responsables = Array.from(new Set(datos.zonas.map((z) => z.jefeZona)));
  const tb = datos.tiemposBase.find((t) => t.actividad === form?.actividad && t.tipoActivo === fActivo?.tipo);
  const estadoPrevio = form?.fechaProgramada ? estadoPlanCalculado(form.fechaProgramada, tb?.toleranciaDias ?? 7) : null;
  const cuadrillaForm = cat.cuadrilla(form?.cuadrillaId);

  const errores = form
    ? {
        activoId: !form.activoId ? "Seleccione el activo." : null,
        actividad: form.actividad.trim().length < 4 ? "Indique la actividad." : null,
        fechaProgramada: !form.fechaProgramada
          ? "Indique la fecha programada."
          : !form.id && form.fechaProgramada < FECHA_REFERENCIA
          ? "La fecha de un plan nuevo no puede ser anterior a hoy (20/09/2026)."
          : null,
        responsable: !form.responsable ? "Indique el responsable." : null,
        cuadrillaId: !form.cuadrillaId ? "Asigne la cuadrilla." : null,
        duplicado: datos.planes.some(
          (p) =>
            p.id !== form.id &&
            p.activoId === form.activoId &&
            p.actividad.toLowerCase() === form.actividad.trim().toLowerCase() &&
            p.fechaProgramada === form.fechaProgramada
        )
          ? "Ya existe un plan con el mismo activo, actividad y fecha."
          : null,
      }
    : {};
  const hayErrores = Object.values(errores).some(Boolean);

  const abrirNuevo = () => {
    setIntentado(false);
    setForm({ ...FORM_VACIO });
  };
  const abrirEditar = (p: PlanMantenimiento) => {
    setIntentado(false);
    setForm({
      id: p.id,
      activoId: p.activoId,
      tipo: p.tipo,
      actividad: p.actividad,
      periodicidad: p.periodicidad,
      fechaProgramada: p.fechaProgramada,
      responsable: p.responsable,
      cuadrillaId: p.cuadrillaId,
      observacion: p.observacion ?? "",
    });
  };

  const guardar = () => {
    if (!form) return;
    setIntentado(true);
    if (hayErrores) return;
    const est = estadoPlanCalculado(form.fechaProgramada, tb?.toleranciaDias ?? 7);
    if (form.id) {
      mutar(
        (d) => ({
          ...d,
          planes: d.planes.map((p) =>
            p.id === form.id
              ? {
                  ...p,
                  ...form,
                  actividad: form.actividad.trim(),
                  estado: p.estado === "Ejecutado" ? "Ejecutado" : est,
                  observacion: form.observacion || undefined,
                }
              : p
          ),
        }),
        { accion: "Plan de mantenimiento actualizado", ref: form.id }
      );
      notificar(`Plan ${form.id} actualizado.`);
    } else {
      const max = Math.max(...datos.planes.map((p) => parseInt(p.id.slice(4), 10)));
      const id = `PLN-${String(max + 1).padStart(4, "0")}`;
      const nuevo: PlanMantenimiento = {
        id,
        activoId: form.activoId,
        tipo: form.tipo,
        actividad: form.actividad.trim(),
        periodicidad: form.periodicidad,
        fechaProgramada: form.fechaProgramada,
        responsable: form.responsable,
        cuadrillaId: form.cuadrillaId,
        estado: est,
        otId: null,
        observacion: form.observacion || undefined,
      };
      mutar((d) => ({ ...d, planes: [...d.planes, nuevo] }), { accion: "Plan de mantenimiento registrado", ref: id });
      notificar(`Plan ${id} registrado en estado ${est}. La OT la generará el proceso Batch.`);
      setPlanSel(id);
    }
    setForm(null);
  };

  // ── Calendario
  const diasMes = useMemo(() => {
    const d0 = parseISO(mes);
    const y = d0.getUTCFullYear();
    const m = d0.getUTCMonth();
    const primero = new Date(Date.UTC(y, m, 1));
    const offset = (primero.getUTCDay() + 6) % 7; // lunes = 0
    const total = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
    const celdas: (string | null)[] = Array(offset).fill(null);
    for (let i = 1; i <= total; i++) celdas.push(toISO(new Date(Date.UTC(y, m, i))));
    while (celdas.length % 7) celdas.push(null);
    return { celdas, titulo: `${nombreMes(m)} ${y}` };
  }, [mes]);

  return (
    <AppShell
      fn="planificacion"
      acciones={
        <Btn variant="primary" icon={<Plus className="h-4 w-4" />} onClick={abrirNuevo}>
          Nuevo plan
        </Btn>
      }
    >
      <Callout tone="info" title="Esta función planifica; no genera órdenes de trabajo">
        Las OT preventivas se generan automáticamente en el proceso <Link href="/batch">Batch</Link> a partir de estos planes.
        La columna «OT (Batch)» solo muestra la orden que Batch ya emitió.
      </Callout>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Todos" value={datos.planes.length} onClick={() => setEstado("Todos")} active={estado === "Todos"} />
        {ESTADOS.map((e) => (
          <Stat
            key={e}
            label={e}
            value={conteo[e]}
            tone={tonePlan(e) === "neutral" ? undefined : tonePlan(e)}
            onClick={() => setEstado(e)}
            active={estado === e}
            hint={
              e === "Programado"
                ? "más de 7 días"
                : e === "Próximo"
                ? "próximos 7 días"
                : e === "Pendiente"
                ? "vencido, en tolerancia"
                : e === "Incumplido"
                ? "fuera de tolerancia"
                : "cerrado en campo"
            }
          />
        ))}
      </div>

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_340px]">
        <Panel
          noPad
          title="Plan de mantenimiento"
          subtitle={`${filtrados.length} planes ${estado !== "Todos" ? `en estado ${estado}` : ""}`}
          icon={<CalendarRange className="h-4 w-4" />}
          actions={
            <Segmented
              size="sm"
              value={vista}
              onChange={setVista}
              options={[
                { value: "tabla", label: <span className="flex items-center gap-1"><List className="h-3.5 w-3.5" /> Tabla</span> },
                { value: "calendario", label: <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> Calendario</span> },
              ]}
            />
          }
        >
          <div className="flex flex-wrap items-center gap-2 border-b border-mv-line px-4 py-3">
            <SearchInput className="w-full max-w-xs" value={q} onChange={setQ} placeholder="Buscar por activo, actividad, cuadrilla…" />
            <Select className="w-auto" value={zona} onChange={(e) => setZona(e.target.value)}>
              <option value="">Todas las zonas</option>
              {datos.zonas.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.nombre}
                </option>
              ))}
            </Select>
          </div>

          {vista === "tabla" ? (
            filtrados.length === 0 ? (
              <EmptyState title="Sin planes para los filtros aplicados" />
            ) : (
              <div className="overflow-x-auto">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Plan / activo</th>
                      <th>Actividad y periodicidad</th>
                      <th>Fecha programada</th>
                      <th>Responsable / cuadrilla</th>
                      <th>Estado</th>
                      <th>OT (Batch)</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {filtrados.map((p) => {
                      const a = cat.activo(p.activoId);
                      return (
                        <tr key={p.id} onClick={() => setPlanSel(p.id)} className={cx("is-clickable", planSel === p.id && "is-selected")}>
                          <td className="whitespace-nowrap">
                            <span className="font-mono text-xs font-bold">{p.id}</span>
                            <span className="block font-mono text-xs font-semibold text-mv-ink">{p.activoId}</span>
                            <span className="block text-[11px] text-mv-ink-2">{a?.tipo}</span>
                          </td>
                          <td className="min-w-[200px]">
                            <TipoMantTag tipo={p.tipo} />
                            <span className="mt-0.5 block">{p.actividad}</span>
                            <span className="block text-[11px] text-mv-muted">
                              {p.periodicidad} · {TEXTO_PERIODO[p.periodicidad]}
                            </span>
                          </td>
                          <td className="whitespace-nowrap">
                            <span className="num font-semibold">{fmtFecha(p.fechaProgramada)}</span>
                            <span className="block text-[11px] text-mv-muted">{relativo(p.fechaProgramada)}</span>
                          </td>
                          <td className="min-w-[150px]">
                            {p.responsable}
                            <span className="block text-[11px] text-mv-ink-2">
                              Cuadrilla {p.cuadrillaId} {cat.cuadrilla(p.cuadrillaId)?.nombre}
                            </span>
                          </td>
                          <td>
                            <Pill tone={tonePlan(p.estado)} dot>
                              {p.estado}
                            </Pill>
                          </td>
                          <td className="whitespace-nowrap font-mono text-[11px] text-mv-ink-2">{p.otId ?? "—"}</td>
                          <td className="text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                abrirEditar(p);
                              }}
                              className="rounded-md p-1.5 text-mv-muted hover:bg-mv-surface hover:text-mv-ink"
                              aria-label={`Editar ${p.id}`}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <button onClick={() => setMes(addMonths(mes, -1))} className="rounded-md p-1.5 hover:bg-mv-surface" aria-label="Mes anterior">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <p className="text-sm font-semibold capitalize text-mv-ink">{diasMes.titulo}</p>
                <button onClick={() => setMes(addMonths(mes, 1))} className="rounded-md p-1.5 hover:bg-mv-surface" aria-label="Mes siguiente">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-mv-line bg-mv-line text-xs">
                {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
                  <div key={d} className="bg-mv-surface-2 px-2 py-1.5 text-center text-[11px] font-semibold text-mv-ink-2">
                    {d}
                  </div>
                ))}
                {diasMes.celdas.map((d, i) => {
                  const planesDia = d ? filtrados.filter((p) => p.fechaProgramada === d) : [];
                  const hoy = d === FECHA_REFERENCIA;
                  return (
                    <div key={i} className={cx("min-h-[84px] bg-white p-1.5", !d && "bg-mv-surface-2")}>
                      {d && (
                        <>
                          <span className={cx("num inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px]", hoy ? "bg-mv-green-700 font-bold text-white" : "text-mv-ink-2")}>
                            {parseInt(d.slice(8), 10)}
                          </span>
                          <div className="mt-1 space-y-1">
                            {planesDia.map((p) => (
                              <button
                                key={p.id}
                                onClick={() => setPlanSel(p.id)}
                                className={cx(
                                  "block w-full truncate rounded px-1 py-0.5 text-left text-[10px] font-semibold",
                                  tonePlan(p.estado) === "ok" && "bg-st-ok-bg text-st-ok-fg",
                                  tonePlan(p.estado) === "warn" && "bg-st-warn-bg text-st-warn-fg",
                                  tonePlan(p.estado) === "crit" && "bg-st-crit-bg text-st-crit-fg",
                                  tonePlan(p.estado) === "info" && "bg-st-info-bg text-st-info-fg",
                                  tonePlan(p.estado) === "neutral" && "bg-mv-surface text-mv-ink"
                                )}
                                title={`${p.id} · ${p.activoId} · ${p.actividad}`}
                              >
                                {p.activoId}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Panel>

        <DetailAside open={!!sel} onClose={() => setPlanSel(null)}>
        <Panel title={sel ? `Plan ${sel.id}` : "Detalle del plan"} subtitle={sel ? selActivo?.descripcion : "Seleccione un plan de la tabla"}>
          {!sel ? (
            <EmptyState title="Ningún plan seleccionado" icon={<Info className="h-5 w-5" />}>
              Pulse una fila o un día del calendario para ver el ciclo de mantenimiento.
            </EmptyState>
          ) : (
            <div className="space-y-4 text-[13px]">
              <div className="flex flex-wrap items-center gap-2">
                <TipoMantTag tipo={sel.tipo} />
                <Pill tone={tonePlan(sel.estado)} dot>
                  {sel.estado}
                </Pill>
              </div>
              <dl className="grid grid-cols-2 gap-3">
                <KV k="Activo" v={<Link className="font-mono font-semibold text-mv-green-700 hover:underline" href={`/gerencial/parametros/activos?codigo=${sel.activoId}`}>{sel.activoId}</Link>} />
                <KV k="Tipo de activo" v={selActivo?.tipo} />
                <KV k="Actividad" v={sel.actividad} />
                <KV k="Periodicidad" v={`${sel.periodicidad} (${TEXTO_PERIODO[sel.periodicidad]})`} />
                <KV k="Fecha programada" v={`${fmtFecha(sel.fechaProgramada)} · ${relativo(sel.fechaProgramada)}`} />
                <KV k="Responsable" v={sel.responsable} />
                <KV k="Cuadrilla" v={`${sel.cuadrillaId} ${cat.cuadrilla(sel.cuadrillaId)?.nombre ?? ""}`} />
                <KV k="OT (Batch)" v={sel.otId ?? "Aún no generada por Batch"} mono />
                {selTb && <KV k="Tiempo base" v={`${selTb.duracionMin} min · tolerancia ${selTb.toleranciaDias} días`} />}
                {selActivo && <KV k="Vida útil" v={`${vidaUtil(selActivo).pct} % consumida · ${vidaUtil(selActivo).estado}`} />}
              </dl>
              {sel.observacion && <Callout tone="neutral">{sel.observacion}</Callout>}
              {proximas(sel).length > 0 && (
                <div>
                  <p className="mb-1.5 text-xs font-semibold text-mv-ink">Próximas fechas del ciclo</p>
                  <div className="flex flex-wrap gap-1.5">
                    {proximas(sel).map((f) => (
                      <span key={f} className="num rounded-md border border-mv-line bg-mv-surface-2 px-2 py-1 text-xs">
                        {fmtFecha(f)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selSeg.length > 0 && (
                <div>
                  <p className="mb-1.5 text-xs font-semibold text-mv-ink">Registro en Seguimiento de Mantenimientos</p>
                  {selSeg.map((m) => (
                    <p key={m.id} className="text-xs text-mv-ink-2">
                      {m.id} · programado {fmtFecha(m.fechaProgramada)} ·{" "}
                      <Pill tone={tonePlan(m.estado)}>{m.estado}</Pill>
                    </p>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-2 border-t border-mv-line pt-3">
                <Btn size="sm" icon={<Pencil className="h-3.5 w-3.5" />} onClick={() => abrirEditar(sel)}>
                  Editar / reprogramar
                </Btn>
                <Link href="/batch">
                  <Btn size="sm" variant="ghost" icon={<Layers className="h-3.5 w-3.5" />}>
                    Ver en Batch
                  </Btn>
                </Link>
              </div>
            </div>
          )}
        </Panel>
        </DetailAside>
      </div>

      <Dialog
        open={!!form}
        onClose={() => setForm(null)}
        title={form?.id ? `Editar plan ${form.id}` : "Nuevo plan de mantenimiento"}
        subtitle="El estado se calcula a partir de la fecha programada y la tolerancia del tiempo base."
        size="lg"
        footer={
          <>
            <Btn onClick={() => setForm(null)}>Cancelar</Btn>
            <Btn variant="primary" onClick={guardar}>
              {form?.id ? "Guardar cambios" : "Registrar plan"}
            </Btn>
          </>
        }
      >
        {form && (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Activo" required error={intentado ? errores.activoId : null} hint={fActivo ? `${fActivo.tipo} · ${fActivo.direccion}` : undefined}>
              <Select value={form.activoId} onChange={(e) => setForm({ ...form, activoId: e.target.value, actividad: "" })} className="font-mono text-xs">
                <option value="">Seleccione…</option>
                {datos.activos.map((a) => (
                  <option key={a.codigo} value={a.codigo}>
                    {a.codigo} — {a.tipo}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Tipo de mantenimiento" required>
              <Segmented<TipoMantenimiento>
                value={form.tipo}
                onChange={(t) => setForm({ ...form, tipo: t })}
                options={[
                  { value: "PREVENTIVO", label: "Preventivo" },
                  { value: "CORRECTIVO", label: "Correctivo programado" },
                ]}
              />
            </Field>
            <Field label="Actividad" required error={intentado ? errores.actividad : null} hint={tb ? `Tiempo base: ${tb.duracionMin} min · periodicidad sugerida ${tb.periodicidad}` : "Elija del catálogo de tiempos base o escriba una actividad."}>
              <Input list="actividades-tb" value={form.actividad} onChange={(e) => {
                const t = datos.tiemposBase.find((x) => x.actividad === e.target.value && (!fActivo || x.tipoActivo === fActivo.tipo));
                setForm({ ...form, actividad: e.target.value, periodicidad: t?.periodicidad ?? form.periodicidad });
              }} />
              <datalist id="actividades-tb">
                {tiempos.map((t) => (
                  <option key={t.id} value={t.actividad} />
                ))}
              </datalist>
            </Field>
            <Field label="Periodicidad" required>
              <Select value={form.periodicidad} onChange={(e) => setForm({ ...form, periodicidad: e.target.value as Periodicidad })}>
                {PERIODOS.map((p) => (
                  <option key={p} value={p}>
                    {p} ({TEXTO_PERIODO[p]})
                  </option>
                ))}
              </Select>
            </Field>
            <Field
              label="Fecha programada"
              required
              error={intentado ? errores.fechaProgramada : null}
              hint={estadoPrevio ? `Estado resultante: ${estadoPrevio}` : undefined}
            >
              <Input type="date" value={form.fechaProgramada} onChange={(e) => setForm({ ...form, fechaProgramada: e.target.value })} />
            </Field>
            <Field label="Responsable" required error={intentado ? errores.responsable : null}>
              <Select value={form.responsable} onChange={(e) => setForm({ ...form, responsable: e.target.value })}>
                <option value="">Seleccione…</option>
                {responsables.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </Select>
            </Field>
            <Field
              label="Cuadrilla"
              required
              error={intentado ? errores.cuadrillaId : null}
              hint={
                cuadrillaForm && fActivo && cuadrillaForm.zonaId !== fActivo.zonaId
                  ? "Aviso: la cuadrilla pertenece a otra zona."
                  : undefined
              }
            >
              <Select value={form.cuadrillaId} onChange={(e) => setForm({ ...form, cuadrillaId: e.target.value })}>
                <option value="">Seleccione…</option>
                {datos.cuadrillas
                  .slice()
                  .sort((a, b) => Number(b.zonaId === fActivo?.zonaId) - Number(a.zonaId === fActivo?.zonaId))
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id} {c.nombre} · {cat.zona(c.zonaId)?.nombre} · {c.especialidad}
                    </option>
                  ))}
              </Select>
            </Field>
            <Field label="Observación" className="md:col-span-2">
              <Textarea value={form.observacion} onChange={(e) => setForm({ ...form, observacion: e.target.value })} className="min-h-[56px]" />
            </Field>
            {intentado && errores.duplicado && (
              <Callout tone="crit" className="md:col-span-2">
                {errores.duplicado}
              </Callout>
            )}
            {form.fechaProgramada && proximas(form).length > 0 && (
              <p className="text-xs text-mv-ink-2 md:col-span-2">
                Ciclo previsto: {[form.fechaProgramada, ...proximas(form)].map(fmtFecha).join(" → ")}
              </p>
            )}
          </div>
        )}
      </Dialog>
    </AppShell>
  );
}
