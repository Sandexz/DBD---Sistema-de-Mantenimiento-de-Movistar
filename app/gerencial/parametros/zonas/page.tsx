"use client";

import React, { useState } from "react";
import {
  MapPin,
  Building2,
  Server,
  Layers,
  Search,
  ChevronRight,
  Database,
  Radio,
  CheckCircle2,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import initialZonas from "@/mock-data/zonas.json";

export default function ZonasPage() {
  const [selectedZona, setSelectedZona] = useState<any>(initialZonas.zonas[0]);
  const [selectedCentral, setSelectedCentral] = useState<any>(initialZonas.zonas[0].centrales[0]);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#5BC500] bg-[#F0F9E8] px-2 py-0.5 rounded border border-[#C6EE94]">
              MANTENIMIENTO DE PARÁMETROS
            </span>
            <span className="text-xs text-slate-400 font-mono">/ Estructura Geográfica</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-grotesk tracking-tight text-slate-900 mt-1">
            Zonas y Centrales de Telecomunicaciones
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Estructura jerárquica operativa: Región → Zona Operativa → Central Telefónica → Activos Críticos
          </p>
        </div>

        <Badge variant="movistar" size="md">
          {initialZonas.region}
        </Badge>
      </div>

      {/* 4-Level Breadcrumb Hierarchy Navigator */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm flex items-center gap-2 text-xs font-mono overflow-x-auto">
        <div className="flex items-center gap-1 text-slate-500 shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#5BC500]" />
          <span>REGIÓN:</span>
          <strong className="text-slate-900">Metropolitana Lima</strong>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />

        <div className="flex items-center gap-1 text-[#0070B8] shrink-0">
          <span>ZONA:</span>
          <strong className="font-bold">{selectedZona.nombre}</strong>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />

        <div className="flex items-center gap-1 text-[#5BC500] shrink-0">
          <span>CENTRAL:</span>
          <strong className="font-bold">{selectedCentral?.nombre || "Seleccionar"}</strong>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />

        <div className="text-slate-500 shrink-0">
          <span>ACTIVOS:</span>{" "}
          <strong className="text-slate-900 font-bold">{selectedCentral?.activos?.length || 0} asignados</strong>
        </div>
      </div>

      {/* Grid: 3 Paneles Drill-Down */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nivel 1: Zonas Operativas */}
        <div className="space-y-3">
          <h2 className="text-xs uppercase font-mono font-bold text-slate-500 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#5BC500]" />
            1. Zonas Operativas ({initialZonas.zonas.length})
          </h2>

          <div className="space-y-2">
            {initialZonas.zonas.map((z) => {
              const isSelected = selectedZona.id === z.id;
              return (
                <button
                  key={z.id}
                  onClick={() => {
                    setSelectedZona(z);
                    setSelectedCentral(z.centrales[0]);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-[#F0F9E8] border-[#C6EE94] shadow-sm ring-1 ring-[#5BC500]"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 font-grotesk text-xs">{z.nombre}</h4>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {z.centrales.length} Centrales · Cobertura {z.coberturaKm2} km²
                      </p>
                    </div>
                    <Badge variant={isSelected ? "movistar" : "gray"} size="sm">
                      {z.id}
                    </Badge>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Nivel 2: Centrales Telefónicas en la Zona seleccionada */}
        <div className="space-y-3">
          <h2 className="text-xs uppercase font-mono font-bold text-slate-500 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-[#019DF4]" />
            2. Centrales en {selectedZona.nombre}
          </h2>

          <div className="space-y-2">
            {selectedZona.centrales.map((c: any) => {
              const isSelected = selectedCentral?.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCentral(c)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-[#E5F4FD] border-[#B8E2FB] shadow-sm ring-1 ring-[#019DF4]"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 font-grotesk text-xs">{c.nombre}</h4>
                      <p className="text-[11px] text-slate-500 font-sans mt-0.5">{c.direccion}</p>
                      <span className="text-[10px] font-mono text-[#0070B8] mt-1 block">
                        Capacidad: {c.capacidadPuertos.toLocaleString()} puertos
                      </span>
                    </div>
                    <Badge variant={isSelected ? "blue" : "gray"} size="sm">
                      {c.activos.length} Activos
                    </Badge>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Nivel 3: Activos Críticos de la Central */}
        <div className="space-y-3">
          <h2 className="text-xs uppercase font-mono font-bold text-slate-500 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-[#5BC500]" />
            3. Activos en {selectedCentral?.nombre}
          </h2>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-card-clean space-y-3">
            <p className="text-xs text-slate-600 font-sans">
              Elementos de infraestructura de red asociados jerárquicamente a esta central para mantenimiento y telemetría:
            </p>

            <div className="space-y-2">
              {selectedCentral?.activos?.map((activoCodigo: string) => (
                <div
                  key={activoCodigo}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#5BC500]" />
                    <span className="font-bold text-slate-900">{activoCodigo}</span>
                  </div>
                  <Badge variant="movistar" size="sm">
                    OPERATIVO
                  </Badge>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-mono flex items-center justify-between">
              <span>Jerarquía validada</span>
              <span className="text-[#5BC500] font-bold">100% Asignado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
