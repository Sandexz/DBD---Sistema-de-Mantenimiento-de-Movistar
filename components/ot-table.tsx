"use client";

// Tabla de órdenes de trabajo (componente existente, conservado y ampliado).
// Se mantienen: búsqueda, filtros por criticidad y estado, contador, copiar ID,
// marca NUEVA, estado vacío y ficha de detalle. Se agregan: filtro y etiqueta por tipo
// (OT PREVENTIVA / OT CORRECTIVA), columna de actividad y accesos de asignación/despacho.
import React, { useState } from "react";
import { MapPin, Clock, HardHat, Sparkles, Copy, Check, Eye, Send, UserPlus } from "lucide-react";
import type { OrdenTrabajo } from "@/lib/types";
import { useSgmr } from "@/lib/store";
import { fmtFechaHora } from "@/lib/fechas";
import { OtDetailModal } from "./ot-detail-modal";
import { CriticidadBadge, Pill, SearchInput, TipoOtTag, toneOt, cx } from "./sgmr/ui";

export type OtRecord = OrdenTrabajo & { statusBadge?: string };

interface OtTableProps {
  ots: OtRecord[];
}

const ESTADOS = ["PENDIENTE", "ASIGNADA", "EN RUTA", "EN EJECUCIÓN", "PENDIENTE DE CIERRE", "CERRADA"];

export function OtTable({ ots }: OtTableProps) {
  const { despacharOt, notificar } = useSgmr();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCrit, setFilterCrit] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterTipo, setFilterTipo] = useState("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const q = searchTerm.toLowerCase();
  const filteredOts = ots.filter((ot) => {
    const matchesSearch =
      !q ||
      [ot.id, ot.infra, ot.crew, ot.origin, ot.materials ?? "", ot.actividad, ot.ticketId ?? "", ot.planId ?? ""].some((v) =>
        v.toLowerCase().includes(q)
      );
    const matchesCrit = filterCrit === "ALL" || ot.criticality === filterCrit;
    const matchesStatus = filterStatus === "ALL" || ot.status === filterStatus;
    const matchesTipo = filterTipo === "ALL" || ot.tipo === filterTipo;
    return matchesSearch && matchesCrit && matchesStatus && matchesTipo;
  });

  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const chip = (activo: boolean) =>
    cx(
      "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
      activo ? "border-mv-ink bg-mv-ink text-white" : "border-mv-line bg-white text-mv-ink-2 hover:bg-mv-surface"
    );

  const selected = ots.find((o) => o.id === selectedId) ?? null;

  return (
    <div className="overflow-hidden rounded-lg border border-mv-line bg-white">
      <div className="space-y-3 border-b border-mv-line bg-mv-surface-2 p-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <SearchInput
            className="w-full max-w-md"
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por OT, ticket, activo, cuadrilla u origen…"
          />
          <span className="num text-xs text-mv-ink-2">
            Mostrando {filteredOts.length} de {ots.length} OT
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[11px] font-semibold uppercase tracking-wide text-mv-muted">Tipo:</span>
            {[
              { id: "ALL", label: "Todas" },
              { id: "PREVENTIVO", label: "Preventivas" },
              { id: "CORRECTIVO", label: "Correctivas" },
            ].map((t) => (
              <button key={t.id} onClick={() => setFilterTipo(t.id)} className={chip(filterTipo === t.id)}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[11px] font-semibold uppercase tracking-wide text-mv-muted">Criticidad:</span>
            {[
              { id: "ALL", label: "Todas" },
              { id: "CRÍTICA", label: "Crítica" },
              { id: "ALTA", label: "Alta" },
              { id: "MEDIA", label: "Media" },
              { id: "BAJA", label: "Baja" },
            ].map((f) => (
              <button key={f.id} onClick={() => setFilterCrit(f.id)} className={chip(filterCrit === f.id)}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[11px] font-semibold uppercase tracking-wide text-mv-muted">Estado:</span>
            <button onClick={() => setFilterStatus("ALL")} className={chip(filterStatus === "ALL")}>
              Todos
            </button>
            {ESTADOS.map((st) => (
              <button key={st} onClick={() => setFilterStatus(st)} className={chip(filterStatus === st)}>
                {st.charAt(0) + st.slice(1).toLowerCase()} <span className="num opacity-70">{ots.filter((o) => o.status === st).length}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="tbl">
          <thead>
            <tr>
              <th>Orden / tipo</th>
              <th>Criticidad / SLA</th>
              <th>Activo / actividad</th>
              <th>Origen</th>
              <th>Cuadrilla</th>
              <th>Estado</th>
              <th className="text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredOts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <p className="font-semibold text-mv-ink">No se encontraron órdenes</p>
                  <p className="text-xs text-mv-ink-2">Pruebe con otro término de búsqueda o restablezca los filtros.</p>
                </td>
              </tr>
            ) : (
              filteredOts.map((ot) => (
                <tr key={ot.id} onClick={() => setSelectedId(ot.id)} className={cx("is-clickable group", ot.isNew && "bg-st-info-bg/50")}>
                  <td className="whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-mv-ink">{ot.id}</span>
                      {ot.isNew && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-st-info px-1.5 py-0.5 text-[9px] font-bold text-white">
                          <Sparkles className="h-2.5 w-2.5" /> NUEVA
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => handleCopyId(ot.id, e)}
                        title="Copiar ID"
                        className="p-0.5 text-mv-muted opacity-0 transition-opacity hover:text-mv-ink group-hover:opacity-100"
                      >
                        {copiedId === ot.id ? <Check className="h-3 w-3 text-st-ok" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                    <span className="mt-0.5 block font-mono text-[11px] text-mv-muted">{fmtFechaHora(ot.createdAt)}</span>
                    <span className="mt-1 block">
                      <TipoOtTag tipo={ot.tipo} short />
                    </span>
                  </td>
                  <td className="whitespace-nowrap">
                    <CriticidadBadge c={ot.criticality} />
                    <span className="mt-1 flex items-center gap-1 font-mono text-[11px] text-mv-ink-2">
                      <Clock className="h-3 w-3" /> {ot.slaHours}
                    </span>
                  </td>
                  <td className="min-w-[190px]">
                    <div className="font-semibold text-mv-ink">{ot.infra}</div>
                    <div className="text-[12px] text-mv-ink-2">{ot.actividad}</div>
                    <div className="mt-0.5 flex items-center gap-1 font-mono text-[11px] text-mv-muted">
                      <MapPin className="h-3 w-3" /> {ot.coordinates}
                    </div>
                  </td>
                  <td className="min-w-[130px] max-w-[170px] text-mv-ink-2">
                    <span className="line-clamp-2 text-[12px]">{ot.origin}</span>
                    <span className="mt-0.5 block font-mono text-[10px] text-mv-muted">{ot.ticketId ?? ot.planId ?? "Sin documento"}</span>
                  </td>
                  <td className="min-w-[140px] max-w-[190px]">
                    <div className="flex items-center gap-1.5 font-medium text-mv-ink">
                      <HardHat className="h-3.5 w-3.5 shrink-0 text-mv-muted" />
                      <span className="truncate">{ot.crew}</span>
                    </div>
                    {ot.materials && <span className="mt-0.5 block max-w-[180px] truncate font-mono text-[11px] text-mv-muted">{ot.materials}</span>}
                  </td>
                  <td className="whitespace-nowrap">
                    <Pill tone={toneOt(ot.status)} dot>
                      {ot.status}
                    </Pill>
                  </td>
                  <td className="whitespace-nowrap text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {ot.status === "ASIGNADA" && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            despacharOt(ot.id);
                            notificar(`${ot.id} despachada: ${ot.crew} en ruta.`);
                          }}
                          className="inline-flex items-center gap-1 rounded-md border border-mv-green/40 bg-mv-green-50 px-2 py-1 text-xs font-semibold text-mv-green-800 hover:bg-mv-green-100"
                        >
                          <Send className="h-3.5 w-3.5" /> Despachar
                        </button>
                      )}
                      {ot.status === "PENDIENTE" && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(ot.id);
                          }}
                          className="inline-flex items-center gap-1 rounded-md border border-st-warn/50 bg-st-warn-bg px-2 py-1 text-xs font-semibold text-st-warn-fg"
                        >
                          <UserPlus className="h-3.5 w-3.5" /> Asignar
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(ot.id);
                        }}
                        className="inline-flex items-center gap-1 rounded-md border border-mv-line bg-white px-2 py-1 text-xs font-semibold text-mv-ink hover:bg-mv-surface"
                      >
                        <Eye className="h-3.5 w-3.5" /> Detalle
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-between gap-2 border-t border-mv-line bg-mv-surface-2 px-4 py-2.5 text-xs text-mv-ink-2 sm:flex-row">
        <span>Datos compartidos en memoria con consultas, campo y reportes</span>
        <span className="num text-mv-muted">Total de órdenes cargadas: {ots.length}</span>
      </div>

      <OtDetailModal ot={selected} isOpen={Boolean(selected)} onClose={() => setSelectedId(null)} />
    </div>
  );
}
