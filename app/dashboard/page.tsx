"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sliders,
  Search,
  History,
  RefreshCw,
  Bell,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Radio,
  ArrowRight,
} from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Sidebar } from "@/components/layout/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KpiCard, KpiData } from "@/components/kpi-card";
import { MapPlaceholder } from "@/components/map-placeholder";
import kpisData from "@/mock-data/kpis.json";
import alertasData from "@/mock-data/alertas.json";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<string>("general");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString("es-PE", { hour12: false }));
  }, []);

  const kpis: KpiData[] = kpisData.kpis as KpiData[];
  const summary = kpisData.summary;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date().toLocaleTimeString("es-PE", { hour12: false }));
    }, 600);
  };

  const filteredAlertas = alertasData.filter((al) => {
    if (filterSeverity === "ALL") return true;
    return al.severity === filterSeverity;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      <Topbar />

      <div className="flex flex-1">
        {/* Sidebar Navigation with all action and module buttons on the left */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Clean Dashboard Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-grotesk tracking-tight text-slate-900">
                  {activeTab === "general" && "Dashboard Gerencial & Supervisión NOC"}
                  {activeTab === "parametros" && "Parámetros & Umbrales de Red (SLA)"}
                  {activeTab === "consultas" && "Consultas & Topología de Nodos"}
                  {activeTab === "historico" && "Histórico & Bitácora de Eventos NOC"}
                </h1>
                <Badge variant="cyan" size="sm">
                  LIVE SIMULADO
                </Badge>
              </div>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Centro de Operaciones de Red Telecom · Supervisión en tiempo real
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Telemetría Activa
              </span>
              <span className="hidden sm:inline text-slate-300">|</span>
              <span className="hidden sm:inline">
                {lastUpdated ? `Sync: ${lastUpdated}` : "Sync en vivo"}
              </span>
            </div>
          </div>

          {/* ================= SECTION: PARAMETROS (WHEN TAB IS SELECTED) ================= */}
          {activeTab === "parametros" && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 animate-in fade-in shadow-sm">
              <div className="flex items-center gap-2 text-[#019DF4] pb-3 border-b border-slate-100">
                <Sliders className="w-5 h-5" />
                <h2 className="text-base font-bold text-slate-800 font-grotesk">
                  Configuración de Umbrales de Calidad Óptica
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block mb-1">Umbral Óptimo NAP:</span>
                  <span className="text-emerald-600 font-bold text-lg">-15 a -22 dBm</span>
                </div>
                <div className="bg-rose-50 p-4 rounded-xl border border-rose-200">
                  <span className="text-rose-600 block mb-1">Alerta de Atenuación:</span>
                  <span className="text-rose-600 font-bold text-lg">&lt; -27.0 dBm</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block mb-1">SLA Corte FO Troncal:</span>
                  <span className="text-[#019DF4] font-bold text-lg">Max. 120 minutos</span>
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION: CONSULTAS (WHEN TAB IS SELECTED) ================= */}
          {activeTab === "consultas" && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 animate-in fade-in shadow-sm">
              <div className="flex items-center gap-2 text-[#019DF4] pb-3 border-b border-slate-100">
                <Search className="w-5 h-5" />
                <h2 className="text-base font-bold text-slate-800 font-grotesk">
                  Consulta Rápida de Infraestructura
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-bold text-slate-800">POP-01 Centro</p>
                  <p className="text-slate-500 font-mono text-[11px]">12,400 Clientes · OK</p>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                  <p className="font-bold text-rose-600">POP-02 Norte</p>
                  <p className="text-slate-500 font-mono text-[11px]">4,200 Clientes · ALERTA</p>
                </div>
              </div>
            </div>

          )}

          {/* ================= SECTION: HISTORICO (WHEN TAB IS SELECTED) ================= */}
          {activeTab === "historico" && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 animate-in fade-in shadow-sm">
              <div className="flex items-center gap-2 text-[#019DF4] pb-3 border-b border-slate-100">
                <History className="w-5 h-5" />
                <h2 className="text-base font-bold text-slate-800 font-grotesk">
                  Bitácora de Incidentes Resueltos (Últimas 24h)
                </h2>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between text-slate-700">
                  <span>OT-2026-9038 · Fusión Mufa Km 12 · Resuelto en 42 min</span>
                  <Badge variant="cyan" size="sm">CERRADO</Badge>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between text-slate-700">
                  <span>OT-2026-9032 · Reemplazo SFP+ Switch Sur · Resuelto en 25 min</span>
                  <Badge variant="cyan" size="sm">CERRADO</Badge>
                </div>
              </div>
            </div>
          )}

          {/* ================= 3 TARJETAS KPI (CORE / PLANTA EXTERNA / ULTIMA MILLA) ================= */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-500">
                Métricas de Rendimiento & Disponibilidad
              </h2>
              <span className="text-[11px] font-mono text-slate-400" suppressHydrationWarning>
                {lastUpdated ? `Actualización: ${lastUpdated}` : "Actualización: En vivo"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {kpis.map((kpi) => (
                <KpiCard key={kpi.id} kpi={kpi} />
              ))}
            </div>
          </div>

          {/* ================= GRID: MAPA DE RED & FEED DE ALERTAS ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bloque de Mapa (2 Columnas) */}
            <div className="lg:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-500">
                  Topología Geo-Espacial de Enlaces
                </h2>
                <span className="text-[11px] font-mono text-[#019DF4] font-semibold">
                  7 Nodos Monitoreados
                </span>
              </div>
              <MapPlaceholder />
            </div>

            {/* Feed de Últimas Alertas (1 Columna) */}
            <div id="alertas" className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-500 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-[#FF6A13]" />
                  Últimas Alertas NOC ({filteredAlertas.length})
                </h2>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setFilterSeverity("ALL")}
                    className={`px-1.5 py-0.5 text-[10px] font-mono rounded transition-colors ${
                      filterSeverity === "ALL"
                        ? "bg-[#EBF5FF] text-[#019DF4] font-semibold"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    Todo
                  </button>
                  <button
                    onClick={() => setFilterSeverity("CRITICAL")}
                    className={`px-1.5 py-0.5 text-[10px] font-mono rounded transition-colors ${
                      filterSeverity === "CRITICAL"
                        ? "bg-rose-50 text-rose-600 font-semibold"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    Críticas
                  </button>
                </div>
              </div>

              {/* Alerts List Container */}
              <div className="space-y-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                {filteredAlertas.map((alerta) => {
                  const isCritical = alerta.severity === "CRITICAL";

                  return (
                    <div
                      key={alerta.id}
                      className={`p-3 rounded-xl border transition-all text-xs space-y-1.5 ${
                        isCritical
                          ? "bg-rose-50 border-rose-200 hover:border-rose-300"
                          : "bg-slate-50 border-slate-200 hover:border-[#019DF4]/40"
                      }`}
                    >
                      {/* Alert Top Info */}
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={isCritical ? "orange" : "cyan"}
                          size="sm"
                          pulse={isCritical}
                        >
                          {alerta.severity}
                        </Badge>
                        <span className="font-mono text-[10px] text-slate-400">
                          {alerta.timestamp}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-slate-800 font-grotesk text-xs leading-tight">
                        {alerta.title}
                      </h3>

                      {/* Location & Impact */}
                      <div className="space-y-0.5 text-[11px] text-slate-500">
                        <p className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{alerta.location}</span>
                        </p>
                        <p className="text-slate-600 font-medium">
                          Impacto: {alerta.impact}
                        </p>
                      </div>

                      {/* SLA and Status */}
                      <div className={`pt-2 border-t flex items-center justify-between text-[10px] font-mono ${
                        isCritical ? "border-rose-200" : "border-slate-200"
                      }`}>
                        <span
                          className={
                            isCritical ? "text-rose-600 font-bold" : "text-slate-500"
                          }
                        >
                          SLA Restante: {alerta.slaRemaining}
                        </span>
                        <span className="text-[#019DF4] truncate max-w-[130px]">
                          {alerta.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
