"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ClipboardList,
  PlusCircle,
  FileText,
  Filter,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Activity,
  AlertTriangle,
  HardHat,
  TrendingUp,
  Clock,
  Sparkles,
  Smartphone,
} from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { OtForm, NewOtPayload } from "@/components/ot-form";
import { OtTable, OtRecord } from "@/components/ot-table";
import initialOtsData from "@/mock-data/ots.json";

export default function OtsPage() {
  // Local in-memory React state for OTs
  const [ots, setOts] = useState<OtRecord[]>(initialOtsData as OtRecord[]);

  // Function to handle adding a new OT visually in memory
  const handleAddOt = (payload: NewOtPayload) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const timeString = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const newRecord: OtRecord = {
      id: `OT-2026-${randomSuffix}`,
      origin: payload.origin,
      criticality: payload.criticality,
      slaHours: payload.slaHours,
      infra: payload.infra,
      crew: payload.crew,
      status: "EN RUTA",
      statusBadge: "naranja",
      coordinates: "-12.0463, -77.0427 (GPS)",
      createdAt: timeString,
      materials: payload.materials || "Material estándar de empalme",
      isNew: true,
    };

    // Prepend to list in memory
    setOts([newRecord, ...ots]);
  };

  const handleResetLast = () => {
    if (ots.length > initialOtsData.length) {
      setOts(ots.slice(1));
    }
  };

  // Metrics
  const activeCount = ots.filter((o) => o.status !== "CERRADA").length;
  const criticalCount = ots.filter(
    (o) => o.criticality === "CRÍTICA" || o.criticality === "ALTA"
  ).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      <Topbar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-7 max-w-7xl mx-auto w-full">
        {/* Apple-style minimalist Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#0A2E5C] text-white flex items-center justify-center shadow-sm">
                <ClipboardList className="w-5 h-5 text-[#00AEEF]" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold font-grotesk tracking-tight text-slate-900">
                  Gestión de Incidencias & Despacho
                </h1>
              </div>
              <span className="text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0066CC] border border-blue-200/70">
                NOC DISPATCH
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-1">
              Centro operativo de emisión, control de SLAs y despacho de cuadrillas de campo
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/mobile"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-[#FF6A13]/50 group"
            >
              <Smartphone className="w-4 h-4 text-[#FF6A13]" />
              <span>Ver App del Técnico</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 4 Minimalist Summary KPI Pills */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Activas */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-4.5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Órdenes Activas</span>
              <Activity className="w-4 h-4 text-[#0066CC]" />
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-bold font-grotesk text-slate-900">
                {activeCount}
              </span>
              <span className="text-[11px] font-mono text-[#0066CC] font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
                En progreso
              </span>
            </div>
          </div>

          {/* Card 2: Críticas */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-4.5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Alta / Crítica</span>
              <AlertTriangle className="w-4 h-4 text-[#FF6A13]" />
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-bold font-grotesk text-[#FF6A13]">
                {criticalCount}
              </span>
              <span className="text-[11px] font-mono text-[#FF6A13] font-semibold bg-orange-50 px-2 py-0.5 rounded-full">
                Prioridad NOC
              </span>
            </div>
          </div>

          {/* Card 3: Cuadrillas */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-4.5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Cuadrillas en Ruta</span>
              <HardHat className="w-4 h-4 text-[#0066CC]" />
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-bold font-grotesk text-slate-900">
                5
              </span>
              <span className="text-[11px] font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                100% Operativas
              </span>
            </div>
          </div>

          {/* Card 4: SLA Compliance */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-4.5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Cumplimiento SLA</span>
              <Clock className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-bold font-grotesk text-slate-900">
                98.4%
              </span>
              <span className="text-[11px] font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                Meta &gt; 95%
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Formulario de Despacho de OT */}
        <section>
          <OtForm onAddOt={handleAddOt} onResetLast={handleResetLast} />
        </section>

        {/* Section 2: Tabla de Órdenes */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0066CC]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 font-mono">
                Órdenes de Trabajo en Sistema ({ots.length})
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Datos reactivos sincronizados
            </span>
          </div>

          <OtTable ots={ots} />
        </section>
      </main>
    </div>
  );
}
