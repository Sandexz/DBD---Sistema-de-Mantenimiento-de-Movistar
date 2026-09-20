"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  HardHat,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Badge } from "./ui/badge";

export interface OtRecord {
  id: string;
  origin: string;
  criticality: "ALTA" | "CRÍTICA" | "MEDIA" | "BAJA";
  slaHours: string;
  infra: string;
  crew: string;
  status: string;
  statusBadge?: string;
  coordinates: string;
  createdAt: string;
  materials?: string;
  isNew?: boolean;
}

interface OtTableProps {
  ots: OtRecord[];
}

export function OtTable({ ots }: OtTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCrit, setFilterCrit] = useState("ALL");

  const filteredOts = ots.filter((ot) => {
    const matchesSearch =
      ot.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ot.infra.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ot.crew.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ot.origin.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCrit =
      filterCrit === "ALL" || ot.criticality === filterCrit;

    return matchesSearch && matchesCrit;
  });

  return (
    <div className="bg-[#121418] border border-[#1E232B] rounded-xl overflow-hidden shadow-card-dark">
      {/* Search and Filters Header */}
      <div className="p-4 border-b border-[#1E232B] bg-[#0B0C0E]/70 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Quick Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por ID, Nodo, Cuadrilla u Origen..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#121418] border border-[#1E232B] rounded-md text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00AEEF]"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
          <span className="text-slate-400 text-[11px] font-mono mr-1">
            Filtrar:
          </span>
          {["ALL", "CRÍTICA", "ALTA", "MEDIA", "BAJA"].map((f) => (
            <button
              key={f}
              onClick={() => setFilterCrit(f)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                filterCrit === f
                  ? "bg-[#0A2E5C] text-[#00AEEF] border border-[#00AEEF]/40 font-semibold"
                  : "bg-[#0B0C0E] text-slate-400 hover:text-white border border-[#1E232B]"
              }`}
            >
              {f === "ALL" ? "Todas" : f}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#0A2E5C]/40 border-b border-[#1E232B] text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">ID de Orden</th>
              <th className="py-3 px-4">Criticidad / SLA</th>
              <th className="py-3 px-4">Nodo / Infraestructura</th>
              <th className="py-3 px-4">Origen</th>
              <th className="py-3 px-4">Cuadrilla Asignada</th>
              <th className="py-3 px-4">Estado Operativo</th>
              <th className="py-3 px-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E232B]">
            {filteredOts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500 font-mono">
                  No se encontraron órdenes con el criterio especificado.
                </td>
              </tr>
            ) : (
              filteredOts.map((ot) => {
                const isCrit = ot.criticality === "CRÍTICA" || ot.criticality === "ALTA";

                return (
                  <tr
                    key={ot.id}
                    className={`hover:bg-[#181B21] transition-colors group ${
                      ot.isNew ? "bg-[#00AEEF]/5 border-l-2 border-l-[#00AEEF]" : ""
                    }`}
                  >
                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-white whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#00AEEF]">{ot.id}</span>
                        {ot.isNew && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-sans font-bold bg-[#00AEEF] text-[#061D3A] px-1 rounded">
                            <Sparkles className="w-2.5 h-2.5" /> NUEVA
                          </span>
                        )}
                      </div>
                      <span className="block text-[10px] text-slate-500 font-normal">
                        {ot.createdAt}
                      </span>
                    </td>

                    {/* Criticality & SLA */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <Badge
                          variant={isCrit ? "orange" : "cyan"}
                          size="sm"
                          pulse={ot.criticality === "CRÍTICA"}
                        >
                          {ot.criticality}
                        </Badge>
                        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          SLA: {ot.slaHours}
                        </span>
                      </div>
                    </td>

                    {/* Infraestructura */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{ot.infra}</div>
                      <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#00AEEF]" />
                        {ot.coordinates}
                      </div>
                    </td>

                    {/* Origen */}
                    <td className="py-3.5 px-4 text-slate-300">
                      <span>{ot.origin}</span>
                    </td>

                    {/* Cuadrilla */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-200">
                        <HardHat className="w-3.5 h-3.5 text-[#00AEEF] shrink-0" />
                        <span className="truncate">{ot.crew}</span>
                      </div>
                      {ot.materials && (
                        <span className="block text-[10px] font-mono text-slate-400 truncate max-w-[180px]">
                          Mat: {ot.materials}
                        </span>
                      )}
                    </td>

                    {/* Estado */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge
                        variant={
                          ot.status === "EN ATENCIÓN" || ot.status === "EN RUTA"
                            ? "orange"
                            : "cyan"
                        }
                        size="sm"
                      >
                        {ot.status}
                      </Badge>
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-[#00AEEF] hover:text-white px-2 py-1 rounded hover:bg-[#0A2E5C] transition-colors"
                      >
                        <span>Detalle</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-4 py-3 bg-[#0B0C0E] border-t border-[#1E232B] flex items-center justify-between text-xs text-slate-400 font-mono">
        <span>Mostrando {filteredOts.length} de {ots.length} registros en memoria</span>
        <span className="text-[11px] text-slate-500">Datos mock actualizados</span>
      </div>
    </div>
  );
}
