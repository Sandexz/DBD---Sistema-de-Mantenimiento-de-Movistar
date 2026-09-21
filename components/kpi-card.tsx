import React from "react";
import { Server, Activity, Radio, ArrowUpRight, ArrowDownRight } from "lucide-react";

// Tarjeta KPI por segmento de red. Se conserva la interfaz KpiData original;
// solo cambia la presentación (tema claro y colores semánticos).
export interface KpiData {
  id: string;
  title: string;
  segment: string;
  value: string;
  target: string;
  status: "ok" | "critical" | "warning";
  statusColor: string;
  statusLabel: string;
  nodesActive?: number;
  nodesTotal?: number;
  trafficPeak?: string;
  latencyAvg?: string;
  mttr?: string;
  trend?: string;
  incidentsOpen?: number;
  fiberCuts?: number;
  cuadrillasDispatched?: number;
  affectedNaps?: number;
  onusOnline?: string;
  powerLowAlerts?: number;
  pendingInstalls?: number;
}

interface KpiCardProps {
  kpi: KpiData;
}

export function KpiCard({ kpi }: KpiCardProps) {
  const isCritical = kpi.status === "critical";
  const isOk = kpi.status === "ok";
  const Icon = kpi.id.includes("core") ? Server : kpi.id.includes("planta") ? Radio : Activity;
  const tono = isCritical
    ? { barra: "bg-st-crit", pill: "bg-st-crit-bg text-st-crit-fg", valor: "text-st-crit-fg", sem: "Crítico" }
    : isOk
    ? { barra: "bg-st-ok", pill: "bg-st-ok-bg text-st-ok-fg", valor: "text-mv-ink", sem: "Correcto" }
    : { barra: "bg-st-warn", pill: "bg-st-warn-bg text-st-warn-fg", valor: "text-mv-ink", sem: "En vigilancia" };

  const secundarios: [string, React.ReactNode][] =
    kpi.id === "core-network"
      ? [
          ["Tráfico pico", kpi.trafficPeak],
          ["Latencia media", kpi.latencyAvg],
        ]
      : kpi.id === "planta-externa"
      ? [
          ["Cortes de fibra", `${kpi.fiberCuts} críticos`],
          ["Cuadrillas en campo", `${kpi.cuadrillasDispatched} asignadas`],
        ]
      : [
          ["ONU en línea", kpi.onusOnline],
          ["MTTR promedio", kpi.mttr],
        ];

  return (
    <div className="relative overflow-hidden rounded-lg border border-mv-line bg-white p-4">
      <span className={`absolute inset-x-0 top-0 h-1 ${tono.barra}`} />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-mv-surface text-mv-ink-2">
            <Icon className="h-[18px] w-[18px]" />
          </span>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-mv-muted">{kpi.segment}</span>
            <h3 className="text-[13px] font-semibold leading-tight text-mv-ink">{kpi.title}</h3>
          </div>
        </div>
        <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold ${tono.pill}`}>{tono.sem}</span>
      </div>

      <div className="mt-4 flex items-end justify-between gap-2 border-b border-mv-line pb-3">
        <div>
          <span className={`num text-[28px] font-bold leading-none tracking-tight ${tono.valor}`}>{kpi.value}</span>
          <span className="ml-2 text-xs text-mv-muted">
            meta <span className="num font-semibold text-mv-ink-2">{kpi.target}</span>
          </span>
        </div>
        {kpi.trend && (
          <span className={`flex items-center gap-0.5 text-right text-[11px] font-semibold ${isCritical ? "text-st-crit-fg" : "text-st-ok-fg"}`}>
            {isCritical ? <ArrowDownRight className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
            {kpi.trend}
          </span>
        )}
      </div>

      <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-mv-muted">{kpi.statusLabel}</p>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
        {secundarios.map(([k, v]) => (
          <div key={k} className="rounded-md bg-mv-surface px-2.5 py-2">
            <span className="block text-[11px] text-mv-ink-2">{k}</span>
            <span className="num font-semibold text-mv-ink">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
