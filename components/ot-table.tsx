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
  X,
  FileText,
  Copy,
  Check,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { OtDetailModal } from "./ot-detail-modal";

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
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedOt, setSelectedOt] = useState<OtRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredOts = ots.filter((ot) => {
    const matchesSearch =
      ot.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ot.infra.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ot.crew.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ot.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ot.materials?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCrit =
      filterCrit === "ALL" || ot.criticality === filterCrit;

    const matchesStatus =
      filterStatus === "ALL" || ot.status === filterStatus;

    return matchesSearch && matchesCrit && matchesStatus;
  });

  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm overflow-hidden text-slate-800">
      {/* Search & Filter Top Bar */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col gap-4 bg-slate-50/50">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Apple-style minimalist search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por ID de ticket, nodo, cuadrilla u origen..."
              className="w-full pl-10 pr-9 py-2 bg-white border border-slate-200/80 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-blue-100 shadow-sm transition-all font-sans"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Count Badge */}
          <div className="flex items-center gap-2 self-end sm:self-center text-xs font-mono text-slate-500">
            <span>Mostrando {filteredOts.length} de {ots.length} OTs</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          {/* Criticality Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 mr-1 uppercase tracking-wider">
              Criticidad:
            </span>
            {[
              { id: "ALL", label: "Todas" },
              { id: "CRÍTICA", label: "Crítica", color: "text-[#FF6A13]" },
              { id: "ALTA", label: "Alta", color: "text-[#FF6A13]" },
              { id: "MEDIA", label: "Media", color: "text-[#0066CC]" },
              { id: "BAJA", label: "Baja", color: "text-slate-600" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterCrit(f.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  filterCrit === f.id
                    ? f.id === "CRÍTICA" || f.id === "ALTA"
                      ? "bg-[#FF6A13] text-white shadow-sm"
                      : "bg-[#0A2E5C] text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Status Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 mr-1 uppercase tracking-wider">
              Estado:
            </span>
            {[
              { id: "ALL", label: "Todos" },
              { id: "EN RUTA", label: "En Ruta" },
              { id: "EN ATENCIÓN", label: "En Atención" },
              { id: "PENDIENTE", label: "Pendiente" },
              { id: "CERRADA", label: "Cerrada" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setFilterStatus(st.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  filterStatus === st.id
                    ? "bg-slate-800 text-white shadow-sm"
                    : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-50/70">
              <th className="py-3.5 px-5">ID de Orden</th>
              <th className="py-3.5 px-4">Criticidad / SLA</th>
              <th className="py-3.5 px-4">Nodo / Ubicación</th>
              <th className="py-3.5 px-4">Origen</th>
              <th className="py-3.5 px-4">Cuadrilla Asignada</th>
              <th className="py-3.5 px-4">Estado</th>
              <th className="py-3.5 px-5 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="font-semibold text-slate-700">No se encontraron órdenes</p>
                    <p className="text-xs text-slate-400">
                      Prueba con otro término de búsqueda o restablece los filtros.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOts.map((ot) => {
                const isCrit = ot.criticality === "CRÍTICA" || ot.criticality === "ALTA";

                return (
                  <tr
                    key={ot.id}
                    onClick={() => setSelectedOt(ot)}
                    className={`hover:bg-slate-50/80 transition-colors cursor-pointer group ${
                      ot.isNew ? "bg-blue-50/40" : ""
                    }`}
                  >
                    {/* ID & Date */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 group-hover:text-[#0066CC] transition-colors">
                          {ot.id}
                        </span>
                        {ot.isNew && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-[#0066CC] text-white px-2 py-0.5 rounded-full shadow-sm">
                            <Sparkles className="w-2.5 h-2.5" /> NUEVA
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => handleCopyId(ot.id, e)}
                          title="Copiar ID"
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 transition-opacity p-0.5"
                        >
                          {copiedId === ot.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <span className="block text-[11px] text-slate-400 font-mono mt-0.5">
                        {ot.createdAt}
                      </span>
                    </td>

                    {/* Criticality & SLA */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1 items-start">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-block ${
                            isCrit
                              ? "bg-orange-50 text-[#FF6A13] border border-orange-200/80"
                              : ot.criticality === "MEDIA"
                              ? "bg-blue-50 text-[#0066CC] border border-blue-200/80"
                              : "bg-slate-100 text-slate-600 border border-slate-200/80"
                          }`}
                        >
                          {ot.criticality}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {ot.slaHours}
                        </span>
                      </div>
                    </td>

                    {/* Infraestructura */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-900 font-sans">
                        {ot.infra}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#0066CC]" />
                        <span>{ot.coordinates}</span>
                      </div>
                    </td>

                    {/* Origen */}
                    <td className="py-4 px-4 text-slate-600">
                      <span className="line-clamp-1">{ot.origin}</span>
                    </td>

                    {/* Cuadrilla */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                        <HardHat className="w-3.5 h-3.5 text-[#0066CC] shrink-0" />
                        <span className="truncate max-w-[170px]">{ot.crew}</span>
                      </div>
                      {ot.materials && (
                        <span className="block text-[11px] font-mono text-slate-400 truncate max-w-[170px] mt-0.5">
                          {ot.materials}
                        </span>
                      )}
                    </td>

                    {/* Estado */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-block ${
                          ot.status === "EN ATENCIÓN" || ot.status === "EN RUTA"
                            ? "bg-orange-50 text-[#FF6A13] border border-orange-200/70"
                            : ot.status === "CERRADA"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/70"
                            : "bg-blue-50 text-[#0066CC] border border-blue-200/70"
                        }`}
                      >
                        {ot.status}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOt(ot);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#0A2E5C] text-slate-700 hover:text-white text-xs font-semibold transition-all shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detalle</span>
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
      <div className="p-4 px-6 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 font-mono">
        <span>Sincronización en memoria con Centro de Despacho NOC</span>
        <span className="text-[11px] text-slate-400">Total tickets cargados: {ots.length}</span>
      </div>

      {/* Detail Modal */}
      <OtDetailModal
        ot={selectedOt}
        isOpen={Boolean(selectedOt)}
        onClose={() => setSelectedOt(null)}
      />
    </div>
  );
}
