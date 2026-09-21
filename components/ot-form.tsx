"use client";

// Formulario de generación y despacho de OT (componente existente, conservado y ampliado).
// Se mantienen: selector de criticidad con SLA automático, origen, SLA, cuadrilla,
// infraestructura con sugerencias rápidas, materiales, restablecer y aviso de despacho.
// Se agregan: tipo de mantenimiento (OT PREVENTIVA / OT CORRECTIVA), activo del catálogo,
// ticket o plan de origen con prellenado, y validación REAL de duplicados.
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Send,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Radio,
  Clock,
  HardHat,
  Network,
  CheckCircle2,
  MapPin,
  Wrench,
  Undo2,
  FileText,
} from "lucide-react";
import { useSgmr } from "@/lib/store";
import { horasTexto, slaPorCriticidad } from "@/lib/data";
import { otsDuplicadas, ticketsDuplicados } from "@/lib/validaciones";
import type { Criticidad, OrdenTrabajo, TipoMantenimiento } from "@/lib/types";
import { Callout, Field, Input, Select, Segmented, Textarea, TipoOtTag, cx } from "./sgmr/ui";

export interface NewOtPayload {
  // campos originales
  origin: string;
  criticality: Criticidad;
  slaHours: string;
  infra: string;
  crew: string;
  materials?: string;
  // campos agregados
  tipo: TipoMantenimiento;
  activoId: string;
  cuadrillaId: string | null;
  ticketId: string | null;
  planId: string | null;
  actividad: string;
  despachar: boolean;
}

interface OtFormProps {
  onAddOt: (ot: NewOtPayload) => OrdenTrabajo | void;
  onResetLast?: () => void;
  puedeDeshacer?: boolean;
  ticketInicial?: string | null;
}

const criticalityOptions: { value: Criticidad; label: string }[] = [
  { value: "CRÍTICA", label: "Crítica" },
  { value: "ALTA", label: "Alta" },
  { value: "MEDIA", label: "Media" },
  { value: "BAJA", label: "Baja" },
];

const SLA_OPCIONES = [
  ["1 hora", "1 hora (SLA Platinum VIP)"],
  ["1.5 horas", "1.5 horas (SLA Troncal OSP)"],
  ["2 horas", "2 horas (SLA Distribución)"],
  ["4 horas", "4 horas (SLA Red Acceso)"],
  ["8 horas", "8 horas (SLA Estándar)"],
  ["24 horas", "24 horas (SLA Preventivo)"],
];

const ORIGENES = [
  "Alarma NOC Automática (NMS)",
  "Reclamo Cliente VIP Corp",
  "Reclamo Call Center",
  "Avería Masiva por Obras Civiles",
  "Corte de Energía Subestación",
  "Inspección Preventiva Trimestral",
  "Plan preventivo (OT extraordinaria)",
];

const quickInfraSuggestions = ["POP-01", "POP-02", "NAP-104", "NAP-882", "SWC-SIS-01"];

const vacio = {
  tipo: "CORRECTIVO" as TipoMantenimiento,
  ticketId: "",
  planId: "",
  activoId: "",
  criticality: "ALTA" as Criticidad,
  slaHours: "2 horas",
  origin: "Alarma NOC Automática (NMS)",
  cuadrillaId: "",
  actividad: "",
  materials: "",
};

export function OtForm({ onAddOt, onResetLast, puedeDeshacer, ticketInicial }: OtFormProps) {
  const { datos } = useSgmr();
  const [f, setF] = useState(vacio);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [creada, setCreada] = useState<OrdenTrabajo | null>(null);
  const [intentado, setIntentado] = useState(false);

  const slaDe = (c: Criticidad) => {
    const s = slaPorCriticidad(datos.sla, c);
    return s ? horasTexto(s.atencionMin) : "4 horas";
  };

  const aplicarTicket = (id: string) => {
    const t = datos.tickets.find((x) => x.id === id);
    if (!t) {
      setF((p) => ({ ...p, ticketId: "" }));
      return;
    }
    setF((p) => ({
      ...p,
      tipo: "CORRECTIVO",
      ticketId: t.id,
      activoId: t.activoId,
      criticality: t.severidad,
      slaHours: slaDe(t.severidad),
      origin:
        t.origen === "Call Center" ? (t.cliente.includes("S.A") ? "Reclamo Cliente VIP Corp" : "Reclamo Call Center") : "Alarma NOC Automática (NMS)",
      actividad: t.descripcion,
    }));
  };

  const aplicarPlan = (id: string) => {
    const pl = datos.planes.find((x) => x.id === id);
    if (!pl) {
      setF((p) => ({ ...p, planId: "" }));
      return;
    }
    const a = datos.activos.find((x) => x.codigo === pl.activoId);
    setF((p) => ({
      ...p,
      tipo: "PREVENTIVO",
      planId: pl.id,
      activoId: pl.activoId,
      criticality: a?.criticidad === "CRÍTICA" ? "ALTA" : "MEDIA",
      slaHours: "24 horas",
      origin: "Plan preventivo (OT extraordinaria)",
      cuadrillaId: pl.cuadrillaId,
      actividad: pl.actividad,
    }));
  };

  // Prellenado desde /operativo/ots?ticket=...
  useEffect(() => {
    if (ticketInicial) aplicarTicket(ticketInicial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketInicial]);

  const ticketsSinOt = datos.tickets.filter((t) => !t.otId && t.estado !== "Cerrado" && t.estado !== "Solucionado");
  const planesSinOt = datos.planes.filter((p) => !p.otId && p.estado !== "Ejecutado");
  const activo = datos.activos.find((a) => a.codigo === f.activoId);

  // ── Validación de duplicados (tickets y OT abiertas sobre el mismo activo)
  const dup = useMemo(() => {
    if (!f.activoId) return { bloquea: [] as OrdenTrabajo[], avisoOt: [] as OrdenTrabajo[], tickets: [] as typeof datos.tickets };
    const abiertas = otsDuplicadas(datos.ots, f.activoId, f.ticketId || null);
    const bloquea = abiertas.filter((o) => o.tipo === f.tipo || (f.ticketId && o.ticketId === f.ticketId));
    const avisoOt = abiertas.filter((o) => !bloquea.includes(o));
    const tickets = ticketsDuplicados(datos.tickets, f.activoId).filter((t) => t.id !== f.ticketId);
    return { bloquea, avisoOt, tickets };
  }, [datos, f.activoId, f.ticketId, f.tipo]);

  const errores = {
    activoId: !f.activoId ? "Seleccione el activo afectado." : null,
    actividad: f.actividad.trim().length < 6 ? "Describa la actividad a realizar." : null,
  };
  const hayErrores = Object.values(errores).some(Boolean);
  const bloqueado = dup.bloquea.length > 0;

  const handleCriticalityChange = (crit: Criticidad) => setF((p) => ({ ...p, criticality: crit, slaHours: slaDe(crit) }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIntentado(true);
    if (hayErrores || bloqueado) return;
    setIsSubmitting(true);
    const cuadrilla = datos.cuadrillas.find((c) => c.id === f.cuadrillaId);
    window.setTimeout(() => {
      const res = onAddOt({
        origin: f.origin,
        criticality: f.criticality,
        slaHours: f.slaHours,
        infra: activo ? `${activo.codigo} / ${activo.descripcion}` : f.activoId,
        crew: cuadrilla ? `${cuadrilla.id} ${cuadrilla.nombre}` : "Sin asignar",
        materials: f.materials || undefined,
        tipo: f.tipo,
        activoId: f.activoId,
        cuadrillaId: f.cuadrillaId || null,
        ticketId: f.tipo === "CORRECTIVO" ? f.ticketId || null : null,
        planId: f.tipo === "PREVENTIVO" ? f.planId || null : null,
        actividad: f.actividad.trim(),
        despachar: !!f.cuadrillaId,
      });
      setIsSubmitting(false);
      setIntentado(false);
      if (res) setCreada(res);
      setF(vacio);
    }, 450);
  };

  const handleReset = () => {
    setF(vacio);
    setIntentado(false);
  };

  return (
    <div className="rounded-lg border border-mv-line bg-white">
      <div className="flex flex-col justify-between gap-3 border-b border-mv-line px-4 py-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-mv-green-50 text-mv-green-700">
            <Radio className="h-[18px] w-[18px]" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-mv-ink">Generación y despacho de OT</h2>
            <p className="text-xs text-mv-ink-2">Emisión de órdenes de trabajo y asignación inmediata a cuadrillas</p>
          </div>
        </div>
        {/* Validación visible de duplicados (antes era una etiqueta estática) */}
        {!f.activoId ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-mv-line bg-mv-surface px-3 py-1 text-xs font-medium text-mv-ink-2">
            <ShieldCheck className="h-3.5 w-3.5" /> Control de duplicados: seleccione un activo
          </span>
        ) : bloqueado ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-st-crit/30 bg-st-crit-bg px-3 py-1 text-xs font-semibold text-st-crit-fg">
            <ShieldAlert className="h-3.5 w-3.5" /> Duplicado detectado: {dup.bloquea.map((o) => o.id).join(", ")}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-st-ok/30 bg-st-ok-bg px-3 py-1 text-xs font-semibold text-st-ok-fg">
            <ShieldCheck className="h-3.5 w-3.5" /> ✓ Sin tickets duplicados
          </span>
        )}
      </div>

      {creada && (
        <div className="mx-4 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-st-ok/30 bg-st-ok-bg px-3.5 py-3 text-[13px] text-st-ok-fg">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {creada.status === "EN RUTA" ? (
                <>
                  <strong>{creada.id}</strong> despachada con éxito. Se notificó a la cuadrilla {creada.crew} y su estado de tracking pasó a <em>En ruta</em>.
                </>
              ) : (
                <>
                  <strong>{creada.id}</strong> generada en estado PENDIENTE. Asigne una cuadrilla desde el detalle de la orden.
                </>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/operativo/reportes/asignacion-ot?ot=${creada.id}`} className="inline-flex items-center gap-1 text-xs font-semibold underline">
              <FileText className="h-3.5 w-3.5" /> Papeleta de asignación
            </Link>
            {puedeDeshacer && onResetLast && (
              <button
                type="button"
                onClick={() => {
                  onResetLast();
                  setCreada(null);
                }}
                className="inline-flex items-center gap-1 rounded-md border border-st-ok/40 bg-white px-2 py-1 text-xs font-semibold"
              >
                <Undo2 className="h-3.5 w-3.5" /> Deshacer
              </button>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 p-4">
        <div className="flex flex-wrap items-end gap-4">
          <Field label="Tipo de mantenimiento" required>
            <Segmented<TipoMantenimiento>
              value={f.tipo}
              onChange={(t) => setF((p) => ({ ...p, tipo: t, ticketId: "", planId: "", slaHours: t === "PREVENTIVO" ? "24 horas" : slaDe(p.criticality) }))}
              options={[
                { value: "CORRECTIVO", label: <TipoOtTag tipo="CORRECTIVO" /> },
                { value: "PREVENTIVO", label: <TipoOtTag tipo="PREVENTIVO" /> },
              ]}
            />
          </Field>
          {f.tipo === "CORRECTIVO" ? (
            <Field label="Ticket de origen" className="min-w-[260px] flex-1" hint="Al elegirlo se prellenan activo, criticidad y actividad.">
              <Select value={f.ticketId} onChange={(e) => aplicarTicket(e.target.value)}>
                <option value="">Sin ticket (alarma directa)</option>
                {ticketsSinOt.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id} · {t.activoId} · {t.severidad} · {t.tipo}
                  </option>
                ))}
              </Select>
            </Field>
          ) : (
            <Field label="Plan de mantenimiento" className="min-w-[260px] flex-1" hint="OT preventiva extraordinaria vinculada a un plan.">
              <Select value={f.planId} onChange={(e) => aplicarPlan(e.target.value)}>
                <option value="">Sin plan asociado</option>
                {planesSinOt.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id} · {p.activoId} · {p.actividad} ({p.estado})
                  </option>
                ))}
              </Select>
            </Field>
          )}
        </div>

        {f.tipo === "PREVENTIVO" && (
          <Callout tone="info">
            Las OT preventivas del ciclo regular las genera el proceso <strong>Batch</strong> a partir de la planificación.
            Desde aquí solo se emiten OT preventivas extraordinarias.
          </Callout>
        )}

        <div className="space-y-2">
          <label className="flex items-center justify-between text-xs font-semibold text-mv-ink">
            <span>Nivel de criticidad operativa</span>
            <span className="font-normal text-mv-muted">Ajusta automáticamente el SLA según los parámetros vigentes</span>
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {criticalityOptions.map((opt) => {
              const sel = f.criticality === opt.value;
              const tono =
                opt.value === "CRÍTICA"
                  ? "border-st-crit bg-st-crit text-white"
                  : opt.value === "ALTA"
                  ? "border-st-warn bg-st-warn text-mv-ink"
                  : opt.value === "MEDIA"
                  ? "border-st-info bg-st-info text-white"
                  : "border-mv-ink-2 bg-mv-ink-2 text-white";
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => handleCriticalityChange(opt.value)}
                  className={cx(
                    "flex items-center justify-between rounded-md border px-3 py-2 text-xs font-semibold transition-colors",
                    sel ? tono : "border-mv-line bg-white text-mv-ink-2 hover:bg-mv-surface"
                  )}
                  aria-pressed={sel}
                >
                  <span>{opt.label}</span>
                  <span className={cx("rounded px-1.5 py-0.5 font-mono text-[10px]", sel ? "bg-white/25" : "bg-mv-surface")}>{slaDe(opt.value)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Field label="Origen del incidente">
            <div className="relative">
              <Network className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mv-muted" />
              <Select className="pl-8" value={f.origin} onChange={(e) => setF({ ...f, origin: e.target.value })}>
                {ORIGENES.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </Select>
            </div>
          </Field>

          <Field label="SLA máximo de atención">
            <div className="relative">
              <Clock className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mv-muted" />
              <Select className="pl-8 font-mono" value={f.slaHours} onChange={(e) => setF({ ...f, slaHours: e.target.value })}>
                {SLA_OPCIONES.map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </Select>
            </div>
          </Field>

          <Field label="Cuadrilla de campo" hint={f.cuadrillaId ? "Se despachará de inmediato (En ruta)." : "Sin cuadrilla la OT queda PENDIENTE."}>
            <div className="relative">
              <HardHat className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mv-muted" />
              <Select className="pl-8" value={f.cuadrillaId} onChange={(e) => setF({ ...f, cuadrillaId: e.target.value })}>
                <option value="">Sin asignar (queda pendiente)</option>
                {datos.cuadrillas.map((c) => {
                  const tr = datos.tracking.find((t) => t.cuadrillaId === c.id);
                  const z = datos.zonas.find((x) => x.id === c.zonaId);
                  return (
                    <option key={c.id} value={c.id}>
                      {c.id} {c.nombre} ({c.lider}) · {z?.nombre} · {tr?.estado ?? "Disponible"}
                    </option>
                  );
                })}
              </Select>
            </div>
          </Field>

          <Field
            label="Infraestructura / activo afectado"
            required
            className="md:col-span-2"
            error={intentado ? errores.activoId : null}
            hint={activo ? `${activo.tipo} · ${activo.direccion} · Estado: ${activo.estado}` : "Catálogo de activos (Gestión de Activos y Vida Útil)."}
          >
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mv-muted" />
              <Select className="pl-8 font-mono text-xs" value={f.activoId} onChange={(e) => setF({ ...f, activoId: e.target.value })}>
                <option value="">Seleccione un activo…</option>
                {datos.activos.map((a) => (
                  <option key={a.codigo} value={a.codigo}>
                    {a.codigo} / {a.descripcion}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {quickInfraSuggestions.map((sug) => (
                <button
                  type="button"
                  key={sug}
                  onClick={() => setF({ ...f, activoId: sug })}
                  className="rounded-full border border-mv-line bg-mv-surface px-2.5 py-0.5 font-mono text-[10px] text-mv-ink-2 hover:border-mv-green/40 hover:text-mv-green-800"
                >
                  + {sug}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Materiales y repuestos previstos">
            <div className="relative">
              <Wrench className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mv-muted" />
              <Input
                className="pl-8 font-mono text-xs"
                value={f.materials}
                onChange={(e) => setF({ ...f, materials: e.target.value })}
                placeholder="Ej: Mufa 48FO, Pigtails SC/APC"
              />
            </div>
          </Field>

          <Field label="Actividad a realizar" required className="md:col-span-2 lg:col-span-3" error={intentado ? errores.actividad : null}>
            <Textarea
              value={f.actividad}
              onChange={(e) => setF({ ...f, actividad: e.target.value })}
              placeholder="Ej: Localización del corte con OTDR y fusión de 48 hilos"
              className="min-h-[60px]"
            />
          </Field>
        </div>

        {f.activoId && (dup.bloquea.length > 0 || dup.avisoOt.length > 0 || dup.tickets.length > 0) && (
          <div className="space-y-2">
            {dup.bloquea.length > 0 && (
              <Callout tone="crit" title="Validación de duplicados: no se puede generar la OT">
                El activo {f.activoId} ya tiene {dup.bloquea.length === 1 ? "una orden abierta" : "órdenes abiertas"} del mismo tipo:{" "}
                {dup.bloquea.map((o) => `${o.id} (${o.status})`).join(", ")}. Gestione la orden existente para evitar doble despacho.
              </Callout>
            )}
            {dup.avisoOt.length > 0 && (
              <Callout tone="warn" title="Existe otra orden abierta sobre el activo">
                {dup.avisoOt.map((o) => `${o.id} · ${o.tipo} · ${o.status}`).join(", ")}. Se permite continuar porque es de distinto tipo.
              </Callout>
            )}
            {dup.tickets.length > 0 && (
              <Callout tone="warn" title="Tickets abiertos sobre el mismo activo">
                {dup.tickets.map((t) => `${t.id} (${t.estado})`).join(", ")}. Verifique que no correspondan a la misma incidencia.
              </Callout>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-mv-line pt-4">
          <p className="text-[11px] text-mv-muted">
            Secuencia de campo: OT → Check-in → ATS → Validación → Ejecución → Repuestos → Cierre
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-mv-line-2 bg-white px-3.5 text-[13px] font-semibold text-mv-ink hover:bg-mv-surface"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Restablecer
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (intentado && (hayErrores || bloqueado)) || bloqueado}
              className="inline-flex h-9 items-center gap-2 rounded-md bg-mv-green-700 px-4 text-[13px] font-semibold text-white shadow-sm hover:bg-mv-green-800 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {isSubmitting ? (
                "Despachando orden…"
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  {f.cuadrillaId ? "Generar y despachar OT" : "Generar OT"}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
