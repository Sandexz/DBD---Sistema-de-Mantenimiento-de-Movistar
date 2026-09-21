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
      className={`relative overflow-hidden rounded-2xl border bg-white p-5 transition-all duration-200 shadow-sm hover:shadow-md ${
        isCritical
          ? "border-orange-200 hover:border-orange-300"
          : "border-slate-200 hover:border-[#019DF4]/40"
      }`}
    >
      {/* Top accent bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${
          isCritical
            ? "bg-[#FF6A13]"
            : isOk
            ? "bg-[#019DF4]"
            : "bg-[#019DF4]/60"
        }`}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4 mt-1">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-xl border ${
              isCritical
                ? "bg-orange-50 border-orange-100 text-[#FF6A13]"
                : "bg-[#EBF5FF] border-[#019DF4]/20 text-[#019DF4]"
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
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
            <h3 className="text-sm font-bold text-slate-800 font-grotesk mt-1">{kpi.title}</h3>
          </div>
        </div>

        {/* Status dot */}
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border ${
          isCritical ? "bg-orange-50 border-orange-200" : "bg-[#EBF5FF] border-[#019DF4]/20"
        }`}>
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isCritical
                ? "bg-[#FF6A13] animate-ping"
                : "bg-[#019DF4]"
            }`}
          />
          <span
            className={`text-[10px] font-mono font-bold ${
              isCritical ? "text-[#FF6A13]" : "text-[#019DF4]"
            }`}
          >
            {isCritical ? "ALERTA" : "OK"}
          </span>
        </div>
      </div>

      {/* Primary Value */}
      <div className="flex items-baseline justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="text-3xl font-extrabold text-slate-900 font-grotesk tracking-tight">
            {kpi.value}
          </span>
          <span className="text-xs text-slate-500 font-sans ml-2">
            (Obj: <span className="font-mono text-slate-700">{kpi.target}</span>)
          </span>
        </div>
        {kpi.trend && (
          <span
            className={`text-xs font-mono font-medium flex items-center gap-1 ${
              isCritical ? "text-[#FF6A13]" : "text-[#019DF4]"
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
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Tráfico Pico</span>
              <span className="font-mono font-bold text-[#019DF4]">{kpi.trafficPeak}</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Latencia Media</span>
              <span className="font-mono font-bold text-slate-800">{kpi.latencyAvg}</span>
            </div>
          </>
        )}

        {kpi.id === "planta-externa" && (
          <>
            <div className="bg-orange-50 p-2 rounded-lg border border-orange-200/60">
              <span className="text-[#FF6A13] block text-[11px] font-semibold">Cortes de Fibra</span>
              <span className="font-mono font-bold text-[#FF6A13]">{kpi.fiberCuts} críticos</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Cuadrillas Campo</span>
              <span className="font-mono font-bold text-slate-800">{kpi.cuadrillasDispatched} asignadas</span>
            </div>
          </>
        )}

        {kpi.id === "ultima-milla" && (
          <>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px]">ONUs En Línea</span>
              <span className="font-mono font-bold text-[#019DF4]">{kpi.onusOnline}</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px]">MTTR Promedio</span>
              <span className="font-mono font-bold text-slate-800">{kpi.mttr}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
