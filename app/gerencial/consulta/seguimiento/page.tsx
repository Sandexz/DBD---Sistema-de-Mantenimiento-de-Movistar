"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Filter,
  Calendar,
  Layers,
  Building,
  HardHat,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SeguimientoPage() {
  const [filterPeriodo, setFilterPeriodo] = useState("Q3-2026");
  const [filterZona, setFilterZona] = useState("TODAS");
  const [filterContratista, setFilterContratista] = useState("TODOS");

  // Métricas exigidas por la arquitectura:
  const metricas = {
    programados: 120,
    ejecutados: 95,
    pendientes: 18,
    incumplidos: 7,
    cumplimiento: 79.2,
  };

  // Datos comparativos mensuales para el gráfico
  const mesesData = [
    { mes: "Julio 2026", programados: 40, ejecutados: 36, porcentaje: 90 },
    { mes: "Agosto 2026", programados: 42, ejecutados: 35, porcentaje: 83.3 },
    { mes: "Septiembre 2026 (En curso)", programados: 38, ejecutados: 24, porcentaje: 63.1 },
  ];

  const zonasBreakdown = [
    { zona: "Zona Norte (Los Olivos / Rímac)", programados: 35, ejecutados: 30, cumplimiento: 85.7, estado: "Conforme" },
    { zona: "Zona Centro (San Isidro / Surco)", programados: 40, ejecutados: 34, cumplimiento: 85.0, estado: "Conforme" },
    { zona: "Zona Sur (Chorrillos / SJM)", programados: 25, ejecutados: 18, cumplimiento: 72.0, estado: "En Seguimiento" },
    { zona: "Zona Este (Ate / Carretera Central)", programados: 20, ejecutados: 13, cumplimiento: 65.0, estado: "Alerta de Mora" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#0070B8] bg-[#E5F4FD] px-2 py-0.5 rounded border border-[#B8E2FB]">
              CONSULTA GERENCIAL
            </span>
            <span className="text-xs text-slate-400 font-mono">/ Supervisión Preventiva</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-grotesk tracking-tight text-slate-900 mt-1">
            Seguimiento de Mantenimientos Preventivos
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Panel de supervisión gerencial de cumplimiento de rutinas programadas vs. ejecutadas y auditoría de moras
          </p>
        </div>

        <Badge variant="movistar" size="md">
          CICLO Q3 · PERÍODO VIGENTE
        </Badge>
      </div>

      {/* 5 Tarjetas Semafóricas Principales */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        {/* 1. Programados */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-card-clean">
          <span className="text-[11px] font-mono text-slate-500 uppercase block font-semibold">
            Programados
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-grotesk tracking-tight mt-1 block">
            {metricas.programados}
          </span>
          <span className="text-[10px] font-mono text-slate-400 mt-1 block">
            100% Meta Trimestral
          </span>
        </div>

        {/* 2. Ejecutados */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-card-clean">
          <span className="text-[11px] font-mono text-[#3F8500] uppercase block font-semibold">
            Ejecutados
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#3F8500] font-grotesk tracking-tight mt-1 block">
            {metricas.ejecutados}
          </span>
          <span className="text-[10px] font-mono text-[#3F8500] mt-1 block font-bold">
            ✓ Conformes y auditados
          </span>
        </div>

        {/* 3. Pendientes */}
        <div className="bg-white border border-amber-200 rounded-xl p-4 shadow-card-clean">
          <span className="text-[11px] font-mono text-amber-700 uppercase block font-semibold">
            Pendientes
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-grotesk tracking-tight mt-1 block">
            {metricas.pendientes}
          </span>
          <span className="text-[10px] font-mono text-amber-700 mt-1 block">
            En ventana de ejecución
          </span>
        </div>

        {/* 4. Incumplidos */}
        <div className="bg-white border border-rose-200 rounded-xl p-4 shadow-card-clean">
          <span className="text-[11px] font-mono text-rose-700 uppercase block font-semibold">
            Incumplidos
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 font-grotesk tracking-tight mt-1 block">
            {metricas.incumplidos}
          </span>
          <span className="text-[10px] font-mono text-rose-600 mt-1 block font-bold">
            Sujetos a penalidad
          </span>
        </div>

        {/* 5. % Cumplimiento */}
        <div className="bg-[#F0F9E8] border border-[#C6EE94] rounded-xl p-4 shadow-card-clean col-span-2 sm:col-span-1">
          <span className="text-[11px] font-mono text-[#3F8500] uppercase block font-semibold">
            Cumplimiento
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#3F8500] font-grotesk tracking-tight mt-1 block">
            {metricas.cumplimiento}%
          </span>
          <span className="text-[10px] font-mono text-slate-600 mt-1 block">
            Meta OSIPTEL &gt;= 80.0%
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <span className="text-slate-400 font-mono text-[11px]">Período:</span>
          {["Q3-2026", "Mes Actual (Sep)", "Año 2026"].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPeriodo(p)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors ${
                filterPeriodo === p
                  ? "bg-[#5BC500] text-white font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <span className="text-slate-400 font-mono text-[11px]">Contratista:</span>
          {["TODOS", "Lari", "Cobra", "Telconet"].map((ct) => (
            <button
              key={ct}
              onClick={() => setFilterContratista(ct)}
              className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-colors ${
                filterContratista === ct
                  ? "bg-slate-900 text-white font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {ct}
            </button>
          ))}
        </div>
      </div>

      {/* Gráfico Comparativo: PROGRAMADOS VS EJECUTADOS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card-clean space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-150">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-grotesk flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#5BC500]" />
              Gráfico Comparativo: Programados vs Ejecutados (Evolución Mensual Q3)
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Contraste de volumen de rutinas preventivas agendadas contra liquidaciones efectivas
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded bg-slate-300" />
              Programados
            </span>
            <span className="flex items-center gap-1.5 text-slate-900 font-bold">
              <span className="w-3 h-3 rounded bg-[#5BC500]" />
              Ejecutados
            </span>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="space-y-4 pt-2">
          {mesesData.map((item) => (
            <div key={item.mes} className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-slate-700">
                <span className="font-semibold">{item.mes}</span>
                <span className="text-[#3F8500] font-bold">
                  {item.ejecutados} de {item.programados} ({item.porcentaje}%)
                </span>
              </div>

              {/* Progress track */}
              <div className="w-full bg-slate-100 h-6 rounded-lg overflow-hidden border border-slate-200 flex">
                <div
                  className="bg-[#5BC500] h-full transition-all duration-500 flex items-center justify-end pr-2 text-[10px] font-mono text-white font-bold"
                  style={{ width: `${item.porcentaje}%` }}
                >
                  {item.ejecutados}
                </div>
                <div
                  className="bg-slate-200 h-full flex items-center justify-center text-[10px] font-mono text-slate-500"
                  style={{ width: `${100 - item.porcentaje}%` }}
                >
                  {item.programados - item.ejecutados} pendientes
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabla de Desglose por Zonas */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card-clean">
        <div className="p-4 border-b border-slate-150 bg-slate-50/70">
          <h4 className="font-bold text-slate-900 font-grotesk text-xs uppercase tracking-wider">
            Desglose Zonal de Cumplimiento Preventivo
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase text-slate-500">
                <th className="py-3 px-4 font-semibold">Zona Operativa</th>
                <th className="py-3 px-4 font-semibold">Programados</th>
                <th className="py-3 px-4 font-semibold">Ejecutados</th>
                <th className="py-3 px-4 font-semibold">Avance Zonal</th>
                <th className="py-3 px-4 font-semibold text-right">Estado de Cumplimiento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {zonasBreakdown.map((z) => (
                <tr key={z.zona} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">{z.zona}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{z.programados}</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#3F8500]">{z.ejecutados}</td>
                  <td className="py-3 px-4 min-w-[150px]">
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      <span className="font-bold text-slate-800">{z.cumplimiento}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className={`h-full rounded-full ${
                          z.cumplimiento >= 80 ? "bg-[#5BC500]" : "bg-amber-500"
                        }`}
                        style={{ width: `${z.cumplimiento}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant={z.cumplimiento >= 80 ? "movistar" : "yellow"} size="sm">
                      {z.estado}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
