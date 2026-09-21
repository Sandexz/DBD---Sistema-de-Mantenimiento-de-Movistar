"use client";

// Ficha de detalle de la OT (componente existente, conservado y ampliado).
// La trazabilidad ahora refleja el estado real de la orden, muestra el ticket o plan de
// origen, el SLA transcurrido, la cuadrilla con su tracking, materiales y acciones.
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { X, MapPin, Clock, HardHat, Package, ShieldCheck, Radio, Send, UserPlus, FileText, Smartphone, Link2 } from "lucide-react";
import type { OtRecord } from "./ot-table";
import { useCatalogos, useSgmr } from "@/lib/store";
import { puedeAcceder } from "@/lib/navigation";
import { MATERIALES, slaTextoAMin } from "@/lib/data";
import { fmtFechaHora, fmtMinutos, minutosEntre } from "@/lib/fechas";
import { CriticidadBadge, Pill, Progress, Select, TipoOtTag, toneActivo, toneOt, toneTracking, cx } from "./sgmr/ui";

interface OtDetailModalProps {
  ot: OtRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

const PASOS = ["Generada", "Asignada", "En ruta", "En ejecución", "Pendiente de cierre", "Cerrada"];
const INDICE: Record<string, number> = {
  PENDIENTE: 0,
  ASIGNADA: 1,
  "EN RUTA": 2,
  "EN EJECUCIÓN": 3,
  "PENDIENTE DE CIERRE": 4,
  CERRADA: 5,
};

export function OtDetailModal({ ot, isOpen, onClose }: OtDetailModalProps) {
  const { datos, sesion, ahora, asignarOt, despacharOt, notificar } = useSgmr();
  const cat = useCatalogos();
  const [cuadrilla, setCuadrilla] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => setCuadrilla(""), [ot?.id]);

  if (!isOpen || !ot) return null;

  const activo = cat.activo(ot.activoId);
  const ticket = cat.ticket(ot.ticketId);
  const plan = cat.plan(ot.planId);
  const ej = cat.ejecucion(ot.id);
  const tr = datos.tracking.find((t) => t.cuadrillaId === ot.cuadrillaId);
  const consumos = datos.consumos.filter((c) => c.otId === ot.id);
  const idx = INDICE[ot.status] ?? 0;

  const horas: (string | undefined)[] = [
    ot.createdAt,
    ticket?.historial["Asignado"],
    ticket?.historial["En ruta"],
    ej?.checkIn?.valido ? ej.checkIn.hora : undefined,
    ticket?.historial["Solucionado"],
    ot.cerradaEn,
  ];

  const slaMin = slaTextoAMin(ot.slaHours);
  const fin = ot.cerradaEn ?? ahora;
  const transcurrido = Math.max(0, minutosEntre(ot.createdAt, fin));
  const pct = slaMin ? Math.round((transcurrido / slaMin) * 100) : 0;
  const esCorrectiva = ot.tipo === "CORRECTIVO";
  const slaTono = !esCorrectiva ? "info" : pct > 100 ? "crit" : pct > 75 ? "warn" : "ok";
  const slaTexto = !esCorrectiva
    ? `Programada para el ${fmtFechaHora(ot.fechaProgramada)}`
    : pct > 100
    ? "FUERA DE PLAZO"
    : pct > 75
    ? "EN RIESGO"
    : "DENTRO DE PLAZO";

  const rol = sesion?.rol;
  const puedeGestionar = puedeAcceder(rol, "ots");
  const puedeCampo = puedeAcceder(rol, "checkin");
  const rutaCampo =
    ot.status === "PENDIENTE DE CIERRE" ? "/operativo/campo/cierre" : "/operativo/campo/checkin";

  return (
    <div className="no-print fixed inset-0 z-50 flex items-end justify-center bg-mv-ink/40 sm:items-center sm:p-6" role="dialog" aria-modal="true">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-xl bg-white shadow-pop sm:rounded-xl">
        <div className="flex items-start justify-between gap-3 border-b border-mv-line px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-mv-surface text-mv-ink-2">
              <Radio className="h-5 w-5" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-mono text-base font-bold text-mv-ink">{ot.id}</h3>
                <TipoOtTag tipo={ot.tipo} />
                <CriticidadBadge c={ot.criticality} />
                <Pill tone={toneOt(ot.status)} dot>
                  {ot.status}
                </Pill>
              </div>
              <p className="mt-0.5 text-xs text-mv-ink-2">
                Creada: {fmtFechaHora(ot.createdAt)} · Origen: {ot.origin}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-mv-muted hover:bg-mv-surface hover:text-mv-ink" aria-label="Cerrar">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5 text-[13px]">
          <div className="rounded-lg border border-mv-line bg-mv-surface-2 p-4">
            <h4 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-mv-ink-2">Trazabilidad operativa de la orden</h4>
            <ol className="flex items-start">
              {PASOS.map((p, i) => {
                const hecho = i < idx || (i === idx && ot.status === "CERRADA") || (i === 0);
                const actual = i === idx && ot.status !== "CERRADA";
                return (
                  <li key={p} className="relative flex flex-1 flex-col items-center text-center">
                    {i > 0 && <span className={cx("absolute right-1/2 top-3 h-0.5 w-full", i <= idx ? "bg-st-ok" : "bg-mv-line-2")} />}
                    <span
                      className={cx(
                        "relative z-[1] flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold",
                        hecho && !actual ? "bg-st-ok text-white" : actual ? "bg-mv-teal text-white ring-4 ring-mv-teal-50" : "bg-mv-line-2 text-mv-muted"
                      )}
                    >
                      {hecho && !actual ? "✓" : i + 1}
                    </span>
                    <span className={cx("mt-1.5 text-[10.5px] font-semibold leading-tight", actual ? "text-mv-teal-700" : i <= idx ? "text-mv-ink" : "text-mv-muted")}>{p}</span>
                    <span className="font-mono text-[9.5px] text-mv-muted">{i <= idx && horas[i] ? horas[i]!.replace("T", " ").slice(11, 16) : ""}</span>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="space-y-2 rounded-lg border border-mv-line p-3.5">
              <h5 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-mv-ink-2">
                <MapPin className="h-3.5 w-3.5" /> Activo y ubicación
              </h5>
              <p className="font-semibold text-mv-ink">{ot.infra}</p>
              <p className="text-xs text-mv-ink-2">{activo?.direccion}</p>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="rounded bg-mv-surface px-2 py-0.5 font-mono text-[11px] text-mv-ink-2">GPS: {ot.coordinates}</span>
                {activo && (
                  <Pill tone={toneActivo(activo.estado)} dot>
                    {activo.estado}
                  </Pill>
                )}
              </div>
              <p className="text-xs text-mv-ink-2">
                <strong className="text-mv-ink">Actividad:</strong> {ot.actividad}
              </p>
            </div>

            <div className="space-y-2 rounded-lg border border-mv-line p-3.5">
              <h5 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-mv-ink-2">
                <Clock className="h-3.5 w-3.5" /> SLA y ventana de atención
              </h5>
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-mv-ink-2">Tiempo máximo</span>
                <span className="font-mono font-bold text-mv-ink">{ot.slaHours}</span>
              </div>
              {esCorrectiva && (
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-mv-ink-2">Transcurrido</span>
                  <span className="num font-semibold text-mv-ink">{fmtMinutos(transcurrido)}</span>
                </div>
              )}
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-mv-ink-2">Estado de SLA</span>
                <span className={cx("text-xs font-bold", slaTono === "crit" ? "text-st-crit-fg" : slaTono === "warn" ? "text-st-warn-fg" : slaTono === "ok" ? "text-st-ok-fg" : "text-st-info-fg")}>
                  {slaTexto}
                </span>
              </div>
              {esCorrectiva && <Progress value={pct} tone={slaTono} />}
            </div>

            <div className="space-y-2 rounded-lg border border-mv-line p-3.5">
              <div className="flex items-center justify-between">
                <h5 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-mv-ink-2">
                  <HardHat className="h-3.5 w-3.5" /> Cuadrilla de campo
                </h5>
                {tr && (
                  <Pill tone={toneTracking(tr.estado)} dot>
                    {tr.estado}
                  </Pill>
                )}
              </div>
              <p className="font-semibold text-mv-ink">{ot.crew}</p>
              {ot.cuadrillaId && (
                <p className="text-xs text-mv-ink-2">
                  {cat.contratista(cat.cuadrilla(ot.cuadrillaId)?.contratistaId)?.empresa} · actualizado {tr?.actualizado ?? "—"}
                </p>
              )}
              {puedeGestionar && ot.status === "PENDIENTE" && (
                <div className="flex gap-2 pt-1">
                  <Select value={cuadrilla} onChange={(e) => setCuadrilla(e.target.value)}>
                    <option value="">Seleccione cuadrilla…</option>
                    {datos.cuadrillas.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.id} {c.nombre} · {c.especialidad}
                      </option>
                    ))}
                  </Select>
                  <button
                    disabled={!cuadrilla}
                    onClick={() => {
                      asignarOt(ot.id, cuadrilla);
                      notificar(`${ot.id} asignada a ${cuadrilla}.`);
                    }}
                    className="inline-flex h-9 shrink-0 items-center gap-1 rounded-md bg-mv-green-700 px-3 text-xs font-semibold text-white disabled:opacity-40"
                  >
                    <UserPlus className="h-3.5 w-3.5" /> Asignar
                  </button>
                </div>
              )}
              {puedeGestionar && ot.status === "ASIGNADA" && (
                <button
                  onClick={() => {
                    despacharOt(ot.id);
                    notificar(`${ot.id} despachada: ${ot.crew} en ruta.`);
                  }}
                  className="inline-flex h-9 items-center gap-1.5 rounded-md bg-mv-green-700 px-3 text-xs font-semibold text-white"
                >
                  <Send className="h-3.5 w-3.5" /> Despachar (En ruta)
                </button>
              )}
            </div>

            <div className="space-y-2 rounded-lg border border-mv-line p-3.5">
              <h5 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-mv-ink-2">
                <Package className="h-3.5 w-3.5" /> Materiales
              </h5>
              <p className="rounded-md bg-mv-surface p-2 font-mono text-xs text-mv-ink">
                Previstos: {ot.materials || "Material estándar de diagnóstico"}
              </p>
              {consumos.length > 0 ? (
                <ul className="space-y-0.5 text-xs text-mv-ink-2">
                  {consumos.map((c) => (
                    <li key={c.id} className="flex justify-between gap-2">
                      <span>{MATERIALES.find((m) => m.codigo === c.codigo)?.nombre}</span>
                      <span className="num font-semibold text-mv-ink">× {c.cantidad}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-mv-muted">Sin consumos descargados.</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-mv-line p-3.5">
            <h5 className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-mv-ink-2">
              <Link2 className="h-3.5 w-3.5" /> Origen y documentos
            </h5>
            <div className="flex flex-wrap gap-2 text-xs">
              {ticket && (
                <Link href={`/gerencial/consulta/tickets?id=${ticket.id}`} className="rounded-md border border-mv-line px-2.5 py-1.5 font-semibold text-mv-ink hover:bg-mv-surface">
                  Ticket {ticket.id} · {ticket.estado}
                </Link>
              )}
              {plan && (
                <Link href={`/gerencial/parametros/planificacion?plan=${plan.id}`} className="rounded-md border border-mv-line px-2.5 py-1.5 font-semibold text-mv-ink hover:bg-mv-surface">
                  Plan {plan.id} · {plan.periodicidad}
                </Link>
              )}
              <Link href={`/operativo/reportes/asignacion-ot?ot=${ot.id}`} className="inline-flex items-center gap-1 rounded-md border border-mv-line px-2.5 py-1.5 font-semibold text-mv-ink hover:bg-mv-surface">
                <FileText className="h-3.5 w-3.5" /> Papeleta de asignación
              </Link>
              {puedeCampo && ["EN RUTA", "EN EJECUCIÓN", "PENDIENTE DE CIERRE", "ASIGNADA"].includes(ot.status) && (
                <Link href={`${rutaCampo}?ot=${ot.id}`} className="inline-flex items-center gap-1 rounded-md border border-mv-teal/40 bg-mv-teal-50 px-2.5 py-1.5 font-semibold text-mv-teal-700">
                  <Smartphone className="h-3.5 w-3.5" /> Abrir en app de campo
                </Link>
              )}
              {puedeAcceder(rol, "rep-conformidad") && ot.status === "CERRADA" && (
                <Link href={`/operativo/reportes/conformidad?ot=${ot.id}`} className="rounded-md border border-mv-line px-2.5 py-1.5 font-semibold text-mv-ink hover:bg-mv-surface">
                  Constancia de conformidad
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-mv-line bg-mv-surface-2 px-5 py-3">
          <span className="flex items-center gap-1.5 text-xs text-mv-ink-2">
            <ShieldCheck className="h-4 w-4 text-st-ok" /> Validación de duplicados superada al emitir la orden
          </span>
          <button onClick={onClose} className="h-9 rounded-md bg-mv-ink px-4 text-xs font-semibold text-white hover:bg-black">
            Cerrar ficha
          </button>
        </div>
      </div>
    </div>
  );
}
