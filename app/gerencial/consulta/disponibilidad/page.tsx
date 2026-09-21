"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  Radio,
  Server,
  Bell,
  RefreshCw,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  HardHat,
  CalendarDays,
  ShieldCheck,
  BarChart3,
  Layers,
} from "lucide-react";
import { KpiCard, KpiData } from "@/components/kpi-card";
import { MapPlaceholder } from "@/components/map-placeholder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import kpisData from "@/mock-data/kpis.json";
import alertasData from "@/mock-data/alertas.json";

export default function DisponibilidadPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState("ALL");

  const kpis: KpiData[] = kpisData.kpis as KpiData[];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const filteredAlertas = alertasData.filter((al) => {
    if (filterSeverity === "ALL") return true;
    return al.severity === filterSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#0070B8] bg-[#E5F4FD] px-2 py-0.5 rounded border border-[#B8E2FB]">
              CONSULTA GERENCIAL
            </span>
            <span className="text-xs text-slate-400 font-mono">/ Disponibilidad & Topología</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-grotesk tracking-tight text-slate-900 mt-1">
            Disponibilidad de Red & Monitoreo NOC
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Supervisión integral de Core, Planta Externa (OSP) y Última Milla con telemetría en tiempo real
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            isLoading={isRefreshing}
            className="font-mono text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Actualizar Telemetría
          </Button>

          <Link href="/operativo/ots">
            <Button variant="primary" size="sm">
              <span>+ Despachar OT</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 6 TARJETAS KPI DE SUPERVISIÓN (PREVENTIVO + CORRECTIVO + RED) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs uppercase font-mono tracking-wider font-bold text-slate-500 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#5BC500]" />
            Métricas de Rendimiento, Disponibilidad y Mantenimiento Preventivo
          </h2>
          <span className="text-[11px] font-mono text-slate-400">
            Actualización automática cada 10s
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Tarjeta 1: Core Network */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-card-clean hover:shadow-card-hover transition-all space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase bg-[#F0F9E8] text-[#3F8500] px-2 py-0.5 rounded border border-[#C6EE94] font-bold">
                CORE NETWORK
              </span>
              <Badge variant="movistar" size="sm">OPERATIVO ÓPTIMO</Badge>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-2xl font-extrabold text-slate-900 font-grotesk">99.98%</span>
                <span className="text-xs text-slate-400 ml-1.5">(Obj: 99.95%)</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#3F8500]">+0.04% vs ayer</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">Tráfico Pico:</span>
                <span className="font-bold text-slate-800">42.8 Gbps</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Latencia Media:</span>
                <span className="font-bold text-[#0070B8]">3.8 ms</span>
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Planta Externa (OSP) */}
          <div className="bg-white border border-rose-200 rounded-xl p-4 shadow-card-clean hover:shadow-card-hover transition-all space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200 font-bold">
                PLANTA EXTERNA (OSP)
              </span>
              <Badge variant="red" size="sm" pulse>ALERTA CRÍTICA</Badge>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-2xl font-extrabold text-slate-900 font-grotesk">87.40%</span>
                <span className="text-xs text-slate-400 ml-1.5">(Obj: 95.00%)</span>
              </div>
              <span className="text-xs font-mono font-bold text-rose-600">-4.20% corte FO</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">Cortes de Fibra:</span>
                <span className="font-bold text-rose-600">2 críticos</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Cuadrillas Despachadas:</span>
                <span className="font-bold text-slate-800">5 cuadrillas</span>
              </div>
            </div>
          </div>

          {/* Tarjeta 3: Última Milla (FTTx) */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-card-clean hover:shadow-card-hover transition-all space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase bg-sky-50 text-[#0070B8] px-2 py-0.5 rounded border border-sky-200 font-bold">
                ÚLTIMA MILLA (FTTx)
              </span>
              <Badge variant="blue" size="sm">EN MÉTRICA SLA</Badge>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-2xl font-extrabold text-slate-900 font-grotesk">94.20%</span>
                <span className="text-xs text-slate-400 ml-1.5">(Obj: 92.00%)</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#0070B8]">+1.10% estabilizado</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">ONUs En Línea:</span>
                <span className="font-bold text-slate-800">24,850 activas</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">MTTR Promedio:</span>
                <span className="font-bold text-[#3F8500]">45 min</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 TARJETAS ADICIONALES EXIGIDAS EN LA ARQUITECTURA: CUMPLIMIENTO PREVENTIVO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tarjeta 4: CUMPLIMIENTO DEL MANTENIMIENTO PREVENTIVO */}
          <div className="bg-[#F0F9E8] border border-[#C6EE94] rounded-xl p-4 shadow-card-clean space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-[#3F8500]">
                SUPERVISIÓN GERENCIAL
              </span>
              <Badge variant="movistar" size="sm">79.2% CUMPLIMIENTO</Badge>
            </div>
            <h3 className="text-sm font-bold text-slate-900 font-grotesk">
              Cumplimiento del Mantenimiento Preventivo
            </h3>
            <div className="w-full bg-white h-2.5 rounded-full overflow-hidden border border-[#C6EE94]">
              <div className="bg-[#5BC500] h-full rounded-full w-[79.2%]" />
            </div>
            <p className="text-[11px] font-mono text-slate-600 pt-1">
              95 de 120 rutinas ejecutadas a tiempo en el ciclo Q3
            </p>
          </div>

          {/* Tarjeta 5: MANTENIMIENTOS PENDIENTES */}
          <div className="bg-white border border-amber-200 rounded-xl p-4 shadow-card-clean space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-amber-700">
                AUDITORÍA EN CURSO
              </span>
              <Badge variant="yellow" size="sm">18 PENDIENTES</Badge>
            </div>
            <h3 className="text-sm font-bold text-slate-900 font-grotesk">
              Mantenimientos Pendientes
            </h3>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-amber-600 font-grotesk">18 Rutinas</span>
              <span className="text-[11px] font-mono text-slate-500">7 con riesgo de mora</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Prioridad en nodos POP-02 y estación BTS San Cristóbal
            </p>
          </div>

          {/* Tarjeta 6: OTs PREVENTIVAS PRÓXIMAS */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-card-clean space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-[#0070B8]">
                PLANIFICADOR BATCH
              </span>
              <Badge variant="blue" size="sm">48 HORAS</Badge>
            </div>
            <h3 className="text-sm font-bold text-slate-900 font-grotesk">
              OTs Preventivas Próximas
            </h3>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-[#0070B8] font-grotesk">12 OTs</span>
              <span className="text-[11px] font-mono text-slate-500">Listas para despacho</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Próximo lote nocturno automático programado a las 02:00 AM
            </p>
          </div>
        </div>
      </div>

      {/* TOPOLOGÍA VISUAL FUNCIONAL & FEED DE ALERTAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topología SVG Funcional (2 Cols) */}
        <div className="lg:col-span-2 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase font-mono tracking-wider font-bold text-slate-500">
              Topología Geo-Espacial de Red & Estado de Nodos
            </h2>
            <span className="text-[11px] font-mono text-[#0070B8]">
              7 Nodos Monitoreados · Telemetría Activa
            </span>
          </div>
          <MapPlaceholder />
        </div>

        {/* Feed de Alertas NOC (1 Col) */}
        <div id="alertas" className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase font-mono tracking-wider font-bold text-slate-500 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-rose-500" />
              Alertas Activas NOC ({filteredAlertas.length})
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilterSeverity("ALL")}
                className={`px-2 py-0.5 text-[10px] font-mono rounded ${
                  filterSeverity === "ALL"
                    ? "bg-[#5BC500] text-white font-bold"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                Todo
              </button>
              <button
                onClick={() => setFilterSeverity("CRITICAL")}
                className={`px-2 py-0.5 text-[10px] font-mono rounded ${
                  filterSeverity === "CRITICAL"
                    ? "bg-rose-600 text-white font-bold"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                Críticas
              </button>
            </div>
          </div>

          <div className="space-y-2.5 bg-white border border-slate-200 rounded-xl p-4 shadow-card-clean max-h-[460px] overflow-y-auto">
            {filteredAlertas.map((alerta) => {
              const isCrit = alerta.severity === "CRITICAL";

              return (
                <div
                  key={alerta.id}
                  className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                    isCrit
                      ? "bg-rose-50/50 border-rose-200 hover:border-rose-400"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Badge variant={isCrit ? "red" : "blue"} size="sm" pulse={isCrit}>
                      {alerta.severity}
                    </Badge>
                    <span className="font-mono text-[10px] text-slate-400">{alerta.timestamp}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 font-grotesk text-xs leading-tight">
                    {alerta.title}
                  </h3>

                  <p className="text-slate-600 text-[11px] font-sans line-clamp-1">
                    {alerta.location}
                  </p>

                  <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono">
                    <span className={isCrit ? "text-rose-600 font-bold" : "text-slate-500"}>
                      SLA: {alerta.slaRemaining}
                    </span>
                    <span className="text-[#0070B8] truncate max-w-[120px] font-medium">
                      {alerta.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
