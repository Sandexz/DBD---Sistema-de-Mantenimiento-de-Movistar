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
} from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { OtForm, NewOtPayload } from "@/components/ot-form";
import { OtTable, OtRecord } from "@/components/ot-table";
import { Badge } from "@/components/ui/badge";
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

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-slate-100 flex flex-col font-sans">
      <Topbar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E232B] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-[#00AEEF]" />
              <h1 className="text-xl sm:text-2xl font-bold font-grotesk tracking-tight text-white">
                Gestión de Incidencias y Despacho de OTs
              </h1>
              <Badge variant="cyan" size="sm">
                NOC DISPATCH
              </Badge>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Generación de órdenes de trabajo, asignación de cuadrillas y seguimiento en tiempo real
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/mobile"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121418] hover:bg-[#181B21] border border-[#1E232B] text-xs font-semibold text-slate-200 transition-colors"
            >
              <span>Ver App del Técnico</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#FF6A13]" />
            </Link>
          </div>
        </div>

        {/* Formulario de Alta y Despacho de OT */}
        <section>
          <OtForm onAddOt={handleAddOt} onResetLast={handleResetLast} />
        </section>

        {/* Tabla de OTs de Ejemplo */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-400 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#00AEEF]" />
              Órdenes de Trabajo Activas en Red ({ots.length})
            </h2>
            <span className="text-[11px] font-mono text-slate-500">
              Memoria local reactiva · Sin persistencia de base de datos
            </span>
          </div>

          <OtTable ots={ots} />
        </section>
      </main>
    </div>
  );
}
