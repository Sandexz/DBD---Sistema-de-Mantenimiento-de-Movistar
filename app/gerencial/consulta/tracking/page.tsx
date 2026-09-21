"use client";

import React, { useState } from "react";
import {
  Navigation,
  MapPin,
  Truck,
  HardHat,
  Filter,
  CheckCircle2,
  Clock,
  Radio,
  Compass,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import initialTracking from "@/mock-data/tracking.json";

export default function TrackingPage() {
  const [trackingList, setTrackingList] = useState(initialTracking);
  const [selectedMobile, setSelectedMobile] = useState<any>(initialTracking[0]);
  const [filterEstado, setFilterEstado] = useState("TODOS");
  const [filterTipo, setFilterTipo] = useState("TODOS");

  const filtered = trackingList.filter((m) => {
    const matchEstado = filterEstado === "TODOS" || m.estado === filterEstado;
    const matchTipo = filterTipo === "TODOS" || m.tipoMantenimiento === filterTipo;
    return matchEstado && matchTipo;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#0070B8] bg-[#E5F4FD] px-2 py-0.5 rounded border border-[#B8E2FB]">
              CONSULTA GERENCIAL
            </span>
            <span className="text-xs text-slate-400 font-mono">/ Geolocalización en Vivo</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-grotesk tracking-tight text-slate-900 mt-1">
            Tracking y Geolocalización de Cuadrillas
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Monitoreo en tiempo real del desplazamiento y posicionamiento de móviles técnicos para preventivo y correctivo
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="movistar" size="md" pulse>
            TELEMETRÍA GPS ACTIVA
          </Badge>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <span className="text-slate-400 font-mono text-[11px]">Estado:</span>
          {["TODOS", "Disponible", "En ruta", "En sitio", "En ejecución", "Finalizado"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterEstado(st)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors ${
                filterEstado === st
                  ? "bg-[#5BC500] text-white font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <span className="text-slate-400 font-mono text-[11px]">Tipo Mantenimiento:</span>
          {["TODOS", "PREVENTIVO", "CORRECTIVO"].map((tp) => (
            <button
              key={tp}
              onClick={() => setFilterTipo(tp)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors ${
                filterTipo === tp
                  ? "bg-slate-900 text-white font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tp}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Interactive GPS Map + Cuadrillas List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mapa SVG de Cuadrillas (2 Cols) */}
        <div className="lg:col-span-2 space-y-2">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card-clean">
            {/* Map Topbar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#5BC500] animate-pulse" />
                <span className="font-grotesk font-bold text-slate-800">
                  Visualizador Geo-Espacial de Cuadrillas Movistar
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500">
                <Compass className="w-3.5 h-3.5 text-[#019DF4]" />
                <span>GPS WGS-84 / Escala OSP 1:50,000</span>
              </div>
            </div>

            {/* SVG Visual Canvas with crew markers */}
            <div className="relative h-[420px] w-full bg-slate-900 overflow-hidden flex items-center justify-center">
              {/* Radar and Grid */}
              <div
                className="absolute inset-0 opacity-25 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(#019DF4 1px, transparent 1px), linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)`,
                  backgroundSize: "24px 24px, 48px 48px, 48px 48px",
                }}
              />

              {/* Radar sweep */}
              <div className="absolute w-[600px] h-[600px] rounded-full border border-sky-500/15 pointer-events-none flex items-center justify-center">
                <div
                  className="absolute inset-0 origin-center animate-radar pointer-events-none"
                  style={{
                    background:
                      "conic-gradient(from 0deg at 50% 50%, rgba(91, 197, 0, 0.15) 0deg, transparent 60deg, transparent 360deg)",
                  }}
                />
              </div>

              {/* SVG Topology with Crew Coordinates */}
              <svg viewBox="0 0 600 420" className="w-full h-full absolute inset-0 select-none">
                {/* Arterias viales simuladas */}
                <path
                  d="M 120 40 L 260 180 L 380 260 L 520 380"
                  stroke="#475569"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="6 4"
                />
                <path
                  d="M 480 80 L 380 260 L 210 320"
                  stroke="#334155"
                  strokeWidth="2"
                  fill="none"
                />

                {/* Marcadores de cuadrillas */}
                {filtered.map((m, idx) => {
                  const x = 150 + idx * 80;
                  const y = 90 + idx * 60;
                  const isSelected = selectedMobile?.id === m.id;
                  const isPreventivo = m.tipoMantenimiento === "PREVENTIVO";

                  return (
                    <g
                      key={m.id}
                      transform={`translate(${x}, ${y})`}
                      onClick={() => setSelectedMobile(m)}
                      className="cursor-pointer group"
                    >
                      {/* Pulse Ring */}
                      <circle
                        r={isSelected ? "18" : "12"}
                        fill={isPreventivo ? "#5BC500" : "#FF6A13"}
                        fillOpacity={isSelected ? "0.4" : "0.2"}
                        className="transition-all duration-200"
                      />
                      {/* Pin Center */}
                      <circle
                        r="7"
                        fill={isPreventivo ? "#5BC500" : "#FF6A13"}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />
                      {/* Label */}
                      <text
                        x="12"
                        y="4"
                        fill={isSelected ? "#5BC500" : "#E2E8F0"}
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight="bold"
                        className="select-none"
                      >
                        {m.cuadrilla}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Overlay Selected Crew Detail Card */}
              {selectedMobile && (
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-3.5 shadow-xl text-xs text-slate-800 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-150 pb-2">
                    <div className="flex items-center gap-2">
                      <HardHat className="w-4 h-4 text-[#5BC500]" />
                      <strong className="font-grotesk font-bold text-sm text-slate-900">
                        {selectedMobile.cuadrilla}
                      </strong>
                      <Badge
                        variant={selectedMobile.tipoMantenimiento === "PREVENTIVO" ? "movistar" : "yellow"}
                        size="sm"
                      >
                        {selectedMobile.tipoMantenimiento}
                      </Badge>
                    </div>
                    <Badge variant="blue" size="sm">
                      {selectedMobile.estado}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Técnico Líder:</span>
                      <span className="font-bold text-slate-800">{selectedMobile.tecnico}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">OT Vinculada:</span>
                      <span className="font-bold text-[#0070B8]">{selectedMobile.otId || "En guardia"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Ubicación Actual:</span>
                      <span className="text-slate-700 truncate block">{selectedMobile.ubicacion}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Distancia al Activo:</span>
                      <span className="text-[#3F8500] font-bold">{selectedMobile.distanciaAlActivoMetros}m (GPS)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lista Lateral de Cuadrillas Monitoreadas */}
        <div className="space-y-3">
          <h2 className="text-xs uppercase font-mono font-bold text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#019DF4]" />
              Cuadrillas en Terreno ({filtered.length})
            </span>
            <span className="text-[10px] text-[#5BC500] font-mono">100% Online</span>
          </h2>

          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {filtered.map((m) => {
              const isSelected = selectedMobile?.id === m.id;
              const isPreventivo = m.tipoMantenimiento === "PREVENTIVO";

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMobile(m)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#F0F9E8] border-[#C6EE94] shadow-sm ring-1 ring-[#5BC500]"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono font-bold text-slate-900 text-xs block">
                        {m.cuadrilla}
                      </span>
                      <span className="text-[11px] text-slate-500 font-sans">
                        {m.tecnico} ({m.contratista})
                      </span>
                    </div>
                    <Badge variant={m.estado === "En ejecución" ? "blue" : "gray"} size="sm">
                      {m.estado}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-1 mt-1 font-sans">
                    {m.actividad}
                  </p>

                  <div className="pt-2 mt-2 border-t border-slate-150 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500">{m.vehiculo}</span>
                    <Badge variant={isPreventivo ? "movistar" : "yellow"} size="sm">
                      {m.tipoMantenimiento}
                    </Badge>
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
