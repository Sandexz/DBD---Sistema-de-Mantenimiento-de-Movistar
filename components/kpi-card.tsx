import React from "react";
import { Server, Activity, Radio, ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "./ui/badge";

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

  const getIcon = () => {
    if (kpi.id.includes("core")) return Server;
    if (kpi.id.includes("planta")) return Radio;
    return Activity;
  };

  const Icon = getIcon();

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-5 transition-all duration-200 bg-[#121418] ${
        isCritical
          ? "border-[#FF6A13]/50 shadow-glow-orange/20"
          : "border-[#1E232B] hover:border-[#00AEEF]/50"
      }`}
    >
      {/* Top indicator bar with traffic light accent */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          isCritical
            ? "bg-[#FF6A13]"
            : isOk
            ? "bg-[#00AEEF]"
            : "bg-[#00AEEF]/60"
        }`}
      />

      {/* Header of KPI */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-lg border ${
              isCritical
                ? "bg-[#FF6A13]/10 border-[#FF6A13]/30 text-[#FF6A13]"
                : "bg-[#0A2E5C]/30 border-[#0A2E5C] text-[#00AEEF]"
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold bg-[#0B0C0E] px-1.5 py-0.5 rounded border border-[#1E232B]">
                {kpi.segment}
              </span>
              <Badge
                variant={isCritical ? "orange" : "cyan"}
                size="sm"
                pulse={isCritical}
              >
                {kpi.statusLabel}
              </Badge>
            </div>
            <h3 className="text-sm font-bold text-white font-grotesk mt-1">{kpi.title}</h3>
          </div>
        </div>

        {/* Semáforo visual dot */}
        <div className="flex items-center gap-1.5 bg-[#0B0C0E] px-2 py-1 rounded-full border border-[#1E232B]">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isCritical
                ? "bg-[#FF6A13] animate-ping"
                : isOk
                ? "bg-[#00AEEF]"
                : "bg-[#00AEEF]"
            }`}
          />
          <span
            className={`text-[10px] font-mono font-bold ${
              isCritical ? "text-[#FF6A13]" : "text-[#00AEEF]"
            }`}
          >
            {isCritical ? "ALERTA" : "OK"}
          </span>
        </div>
      </div>

      {/* Primary Value Display */}
      <div className="flex items-baseline justify-between mt-4 pb-3 border-b border-[#1E232B]">
        <div>
          <span className="text-3xl font-extrabold text-white font-grotesk tracking-tight">
            {kpi.value}
          </span>
          <span className="text-xs text-slate-400 font-sans ml-2">
            (Obj: <span className="font-mono text-slate-300">{kpi.target}</span>)
          </span>
        </div>
        {kpi.trend && (
          <span
            className={`text-xs font-mono font-medium flex items-center gap-1 ${
              isCritical ? "text-[#FF6A13]" : "text-[#00AEEF]"
            }`}
          >
            {isCritical ? (
              <ArrowDownRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowUpRight className="w-3.5 h-3.5" />
            )}
            {kpi.trend}
          </span>
        )}
      </div>

      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5 mt-3 text-xs">
        {kpi.id === "core-network" && (
          <>
            <div className="bg-[#0B0C0E] p-2 rounded border border-[#1E232B]">
              <span className="text-slate-400 block text-[11px]">Tráfico Pico</span>
              <span className="font-mono font-bold text-[#00AEEF]">{kpi.trafficPeak}</span>
            </div>
            <div className="bg-[#0B0C0E] p-2 rounded border border-[#1E232B]">
              <span className="text-slate-400 block text-[11px]">Latencia Media</span>
              <span className="font-mono font-bold text-white">{kpi.latencyAvg}</span>
            </div>
          </>
        )}

        {kpi.id === "planta-externa" && (
          <>
            <div className="bg-[#0B0C0E] p-2 rounded border border-[#FF6A13]/20">
              <span className="text-[#FF6A13] block text-[11px] font-semibold">Cortes de Fibra</span>
              <span className="font-mono font-bold text-[#FF6A13]">{kpi.fiberCuts} críticos</span>
            </div>
            <div className="bg-[#0B0C0E] p-2 rounded border border-[#1E232B]">
              <span className="text-slate-400 block text-[11px]">Cuadrillas Campo</span>
              <span className="font-mono font-bold text-white">{kpi.cuadrillasDispatched} asignadas</span>
            </div>
          </>
        )}

        {kpi.id === "ultima-milla" && (
          <>
            <div className="bg-[#0B0C0E] p-2 rounded border border-[#1E232B]">
              <span className="text-slate-400 block text-[11px]">ONUs En Línea</span>
              <span className="font-mono font-bold text-[#00AEEF]">{kpi.onusOnline}</span>
            </div>
            <div className="bg-[#0B0C0E] p-2 rounded border border-[#1E232B]">
              <span className="text-slate-400 block text-[11px]">MTTR Promedio</span>
              <span className="font-mono font-bold text-white">{kpi.mttr}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
