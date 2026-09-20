"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  AlertTriangle,
  Clock,
  MapPin,
  RefreshCw,
  TrendingUp,
  Radio,
  Server,
  Sliders,
  Search,
  History,
  CheckCircle2,
  HardHat,
  ArrowRight,
  Filter,
} from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Sidebar } from "@/components/layout/sidebar";
import { KpiCard, KpiData } from "@/components/kpi-card";
import { MapPlaceholder } from "@/components/map-placeholder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Import mock data directly
import kpisData from "@/mock-data/kpis.json";
import alertasData from "@/mock-data/alertas.json";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<string>("general");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");

  const kpis: KpiData[] = kpisData.kpis as KpiData[];
  const summary = kpisData.summary;

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
    <div className="min-h-screen bg-[#0B0C0E] text-slate-100 flex flex-col font-sans">
      <Topbar />

      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Dashboard Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E232B] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-grotesk tracking-tight text-white">
                  {activeTab === "general" && "Dashboard Gerencial & Supervisión NOC"}
                  {activeTab === "parametros" && "Parámetros & Umbrales de Red (SLA)"}
                  {activeTab === "consultas" && "Consultas & Topología de Nodos"}
                  {activeTab === "historico" && "Histórico & Bitácora de Eventos NOC"}
                </h1>
                <Badge variant="cyan" size="sm">
                  LIVE SIMULADO
                </Badge>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Centro de Operaciones de Red Telecom · Supervisión en tiempo real
              </p>
            </div>

            {/* Quick Action bar */}
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

              <Link href="/ots">
                <Button variant="orange" size="sm" className="font-sans">
                  <span>+ Despachar OT</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* ================= SECTION: PARAMETROS (WHEN TAB IS SELECTED) ================= */}
          {activeTab === "parametros" && (
            <div className="bg-[#121418] border border-[#1E232B] rounded-xl p-6 space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-[#00AEEF] pb-2 border-b border-[#1E232B]">
                <Sliders className="w-5 h-5" />
                <h2 className="text-base font-bold text-white font-grotesk">
                  Configuración de Umbrales de Calidad Óptica
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="bg-[#0B0C0E] p-4 rounded-lg border border-[#1E232B]">
                  <span className="text-slate-400 block mb-1">Umbral Óptimo NAP:</span>
                  <span className="text-emerald-400 font-bold text-lg">-15 a -22 dBm</span>
                </div>
                <div className="bg-[#0B0C0E] p-4 rounded-lg border border-[#FF6A13]/30">
                  <span className="text-[#FF6A13] block mb-1">Alerta de Atenuación:</span>
                  <span className="text-[#FF6A13] font-bold text-lg">&lt; -27.0 dBm</span>
                </div>
                <div className="bg-[#0B0C0E] p-4 rounded-lg border border-[#1E232B]">
                  <span className="text-slate-400 block mb-1">SLA Corte FO Troncal:</span>
                  <span className="text-[#00AEEF] font-bold text-lg">Max. 120 minutos</span>
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION: CONSULTAS (WHEN TAB IS SELECTED) ================= */}
          {activeTab === "consultas" && (
            <div className="bg-[#121418] border border-[#1E232B] rounded-xl p-6 space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-[#00AEEF] pb-2 border-b border-[#1E232B]">
                <Search className="w-5 h-5" />
                <h2 className="text-base font-bold text-white font-grotesk">
                  Consulta Rápida de Infraestructura
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-[#0B0C0E] rounded-lg border border-[#1E232B]">
                  <p className="font-bold text-white">POP-01 Centro</p>
                  <p className="text-slate-400 font-mono text-[11px]">12,400 Clientes · OK</p>
                </div>
                <div className="p-3 bg-[#0B0C0E] rounded-lg border border-[#FF6A13]/30">
                  <p className="font-bold text-[#FF6A13]">POP-02 Norte</p>
                  <p className="text-slate-400 font-mono text-[11px]">4,200 Clientes · ALERTA</p>
                </div>
                <div className="p-3 bg-[#0B0C0E] rounded-lg border border-[#1E232B]">
                  <p className="font-bold text-white">POP-03 Sur</p>
                  <p className="text-slate-400 font-mono text-[11px]">6,800 Clientes · OK</p>
                </div>
                <div className="p-3 bg-[#0B0C0E] rounded-lg border border-[#1E232B]">
                  <p className="font-bold text-white">REP-09 Repetidor</p>
                  <p className="text-slate-400 font-mono text-[11px]">1,800 Clientes · OK</p>
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION: HISTORICO (WHEN TAB IS SELECTED) ================= */}
          {activeTab === "historico" && (
            <div className="bg-[#121418] border border-[#1E232B] rounded-xl p-6 space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-[#00AEEF] pb-2 border-b border-[#1E232B]">
                <History className="w-5 h-5" />
                <h2 className="text-base font-bold text-white font-grotesk">
                  Bitácora de Incidentes Resueltos (Últimas 24h)
                </h2>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 bg-[#0B0C0E] rounded border border-[#1E232B] flex justify-between">
                  <span>OT-2026-9038 · Fusión Mufa Km 12 · Resuelto en 42 min</span>
                  <Badge variant="cyan" size="sm">CERRADO</Badge>
                </div>
                <div className="p-2.5 bg-[#0B0C0E] rounded border border-[#1E232B] flex justify-between">
                  <span>OT-2026-9032 · Reemplazo SFP+ Switch Sur · Resuelto en 25 min</span>
                  <Badge variant="cyan" size="sm">CERRADO</Badge>
                </div>
              </div>
            </div>
          )}

          {/* ================= 3 TARJETAS KPI (CORE / PLANTA EXTERNA / ULTIMA MILLA) ================= */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-400">
                Métricas de Rendimiento & Disponibilidad
              </h2>
              <span className="text-[11px] font-mono text-slate-500">
                Actualización: {new Date().toLocaleTimeString()}
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
                <h2 className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-400">
                  Topología Geo-Espacial de Enlaces
                </h2>
                <span className="text-[11px] font-mono text-[#00AEEF]">
                  7 Nodos Monitoreados
                </span>
              </div>
              <MapPlaceholder />
            </div>

            {/* Feed de Últimas Alertas (1 Columna) */}
            <div id="alertas" className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-[#FF6A13]" />
                  Últimas Alertas NOC ({filteredAlertas.length})
                </h2>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setFilterSeverity("ALL")}
                    className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                      filterSeverity === "ALL"
                        ? "bg-[#0A2E5C] text-[#00AEEF]"
                        : "text-slate-500"
                    }`}
                  >
                    Todo
                  </button>
                  <button
                    onClick={() => setFilterSeverity("CRITICAL")}
                    className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                      filterSeverity === "CRITICAL"
                        ? "bg-[#FF6A13]/20 text-[#FF6A13]"
                        : "text-slate-500"
                    }`}
                  >
                    Críticas
                  </button>
                </div>
              </div>

              {/* Alerts List Container */}
              <div className="space-y-3 bg-[#121418] border border-[#1E232B] rounded-xl p-4 shadow-card-dark">
                {filteredAlertas.map((alerta) => {
                  const isCritical = alerta.severity === "CRITICAL";

                  return (
                    <div
                      key={alerta.id}
                      className={`p-3 rounded-lg border transition-all text-xs space-y-1.5 ${
                        isCritical
                          ? "bg-[#0B0C0E] border-[#FF6A13]/40 hover:border-[#FF6A13]"
                          : "bg-[#0B0C0E] border-[#1E232B] hover:border-[#00AEEF]/40"
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
                      <h3 className="font-bold text-white font-grotesk text-xs leading-tight">
                        {alerta.title}
                      </h3>

                      {/* Location & Impact */}
                      <div className="space-y-0.5 text-[11px] text-slate-400">
                        <p className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate">{alerta.location}</span>
                        </p>
                        <p className="text-slate-300 font-medium">
                          Impacto: {alerta.impact}
                        </p>
                      </div>

                      {/* SLA and Status */}
                      <div className="pt-2 border-t border-[#1E232B] flex items-center justify-between text-[10px] font-mono">
                        <span
                          className={
                            isCritical ? "text-[#FF6A13] font-bold" : "text-slate-400"
                          }
                        >
                          SLA Restante: {alerta.slaRemaining}
                        </span>
                        <span className="text-[#00AEEF] truncate max-w-[130px]">
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
