"use client";

import React, { useState } from "react";
import {
  FileSearch,
  Search,
  Filter,
  Eye,
  Clock,
  MapPin,
  CheckCircle2,
  HardHat,
  ChevronRight,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import initialOts from "@/mock-data/ots.json";

export default function TicketsConsultaPage() {
  const [tickets, setTickets] = useState(initialOts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterZona, setFilterZona] = useState("TODAS");
  const [filterTipo, setFilterTipo] = useState("TODOS");
  const [filterCriticidad, setFilterCriticidad] = useState("TODAS");
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  // Ciclo de vida arquitectónico formal de 7 pasos:
  const cicloVidaEtapas = [
    "Detectado",
    "Registrado",
    "Asignado",
    "En ruta",
    "En atención",
    "Solucionado",
    "Cerrado",
  ];

  const getStepIndex = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("cerrad")) return 6;
    if (s.includes("pend") && s.includes("cierre")) return 5;
    if (s.includes("ejecu") || s.includes("atenci")) return 4;
    if (s.includes("ruta")) return 3;
    if (s.includes("asigna")) return 2;
    if (s.includes("regist")) return 1;
    return 0; // Detectado
  };

  const filtered = tickets.filter((t) => {
    const matchSearch =
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.activo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.infra.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.crew.toLowerCase().includes(searchTerm.toLowerCase());
    const matchZona = filterZona === "TODAS" || t.zona === filterZona;
    const matchTipo = filterTipo === "TODOS" || t.tipo === filterTipo;
    const matchCrit = filterCriticidad === "TODAS" || t.criticality === filterCriticidad;
    return matchSearch && matchZona && matchTipo && matchCrit;
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
            <span className="text-xs text-slate-400 font-mono">/ Estado de Tickets</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-grotesk tracking-tight text-slate-900 mt-1">
            Estado de Tickets e Incidencias en Red
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Consulta visual y auditoría del ciclo de vida de tickets (Preventivo y Correctivo) sin alteración de datos
          </p>
        </div>

        <Badge variant="blue" size="md">
          {tickets.length} TICKETS AUDITADOS
        </Badge>
      </div>

      {/* Info Card: Modo Consulta */}
      <div className="bg-[#E5F4FD] border border-[#B8E2FB] rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-slate-700">
        <ShieldCheck className="w-5 h-5 text-[#0070B8] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#0070B8] block font-grotesk">
            Interfaz de Supervisión y Consulta Sin Alteración de Datos
          </strong>
          <span>
            Esta pantalla está diseñada exclusivamente para supervisores y NOC con fines de auditoría y trazabilidad.
            Para ingresar nuevas incidencias u órdenes de trabajo, utilice el módulo <strong>Data Entry</strong>.
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por ID, activo, nodo, cuadrilla..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <div className="flex items-center gap-1">
            <span className="text-slate-400 font-mono text-[11px]">Tipo:</span>
            {["TODOS", "PREVENTIVO", "CORRECTIVO"].map((tp) => (
              <button
                key={tp}
                onClick={() => setFilterTipo(tp)}
                className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-colors ${
                  filterTipo === tp
                    ? "bg-[#5BC500] text-white font-bold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tp}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
            <span className="text-slate-400 font-mono text-[11px]">Zona:</span>
            {["TODAS", "Norte", "Centro", "Sur", "Este"].map((z) => (
              <button
                key={z}
                onClick={() => setFilterZona(z)}
                className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-colors ${
                  filterZona === z
                    ? "bg-slate-900 text-white font-bold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {z}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table of Tickets */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card-clean">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase text-slate-500">
                <th className="py-3 px-4 font-semibold">ID / Tipo</th>
                <th className="py-3 px-4 font-semibold">Activo / Infraestructura</th>
                <th className="py-3 px-4 font-semibold">Zona & Origen</th>
                <th className="py-3 px-4 font-semibold">SLA Máximo</th>
                <th className="py-3 px-4 font-semibold">Cuadrilla Asignada</th>
                <th className="py-3 px-4 font-semibold">Ciclo de Vida Actual</th>
                <th className="py-3 px-4 font-semibold text-right">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t) => {
                const isPreventivo = t.tipo === "PREVENTIVO";
                const stepIdx = getStepIndex(t.status);

                return (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* ID */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-900 block">{t.id}</span>
                      <Badge variant={isPreventivo ? "movistar" : "yellow"} size="sm">
                        {t.tipo}
                      </Badge>
                    </td>

                    {/* Activo */}
                    <td className="py-3.5 px-4">
                      <strong className="text-slate-900 font-mono text-[11px] block">{t.activo}</strong>
                      <span className="text-slate-500 text-[11px] line-clamp-1">{t.infra}</span>
                    </td>

                    {/* Zona & Origen */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-slate-700 font-bold block">{t.zona}</span>
                      <span className="text-[11px] text-slate-400 line-clamp-1">{t.origin}</span>
                    </td>

                    {/* SLA */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-700">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{t.slaHours}</span>
                      </div>
                      <Badge variant={t.criticality === "CRÍTICA" ? "red" : "blue"} size="sm">
                        {t.criticality}
                      </Badge>
                    </td>

                    {/* Cuadrilla */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-slate-800 font-medium block">{t.crew}</span>
                      <span className="text-[10px] text-slate-400 font-mono">GPS: {t.coordinates}</span>
                    </td>

                    {/* Ciclo de vida progresivo visual */}
                    <td className="py-3.5 px-4 min-w-[200px]">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1">
                        <span>Paso {stepIdx + 1}/7</span>
                        <strong className="text-[#0070B8]">{cicloVidaEtapas[stepIdx]}</strong>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="bg-[#019DF4] h-full rounded-full transition-all"
                          style={{ width: `${((stepIdx + 1) / 7) * 100}%` }}
                        />
                      </div>
                    </td>

                    {/* Acción */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => setSelectedTicket(t)}
                        className="p-1.5 text-slate-400 hover:text-[#019DF4] hover:bg-slate-100 rounded-lg transition-colors"
                        title="Ver ciclo de vida detallado"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalle de Ciclo de Vida */}
      {selectedTicket && (
        <Modal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          title={`Auditoría de Ticket: ${selectedTicket.id}`}
          subtitle={`Activo: ${selectedTicket.activo} · Tipo: ${selectedTicket.tipo}`}
          maxWidth="xl"
          footer={
            <Button variant="outline" size="sm" onClick={() => setSelectedTicket(null)}>
              Cerrar Consulta
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            {/* Ciclo de Vida Stepper Horizontal */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <h4 className="font-bold text-slate-900 font-grotesk text-xs">
                Ciclo de Vida Arquitectónico Completo (7 Etapas)
              </h4>

              <div className="flex items-center justify-between text-center overflow-x-auto py-2">
                {cicloVidaEtapas.map((etapa, idx) => {
                  const currentIdx = getStepIndex(selectedTicket.status);
                  const isDone = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={etapa} className="flex flex-col items-center min-w-[75px]">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-[10px] transition-all ${
                          isDone
                            ? "bg-[#5BC500] text-white"
                            : isCurrent
                            ? "bg-[#019DF4] text-white ring-2 ring-[#019DF4]/40"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {isDone ? "✓" : idx + 1}
                      </div>
                      <span
                        className={`text-[10px] mt-1 font-mono leading-tight ${
                          isCurrent ? "font-bold text-slate-900" : isDone ? "text-slate-700" : "text-slate-400"
                        }`}
                      >
                        {etapa}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ficha técnica del ticket */}
            <div className="grid grid-cols-2 gap-3 font-mono text-[11px] p-3 bg-white border border-slate-200 rounded-xl">
              <div>
                <span className="text-slate-400 block text-[10px]">Infraestructura / Nodo:</span>
                <span className="font-bold text-slate-800">{selectedTicket.infra}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Zona Operativa:</span>
                <span className="font-bold text-slate-800">{selectedTicket.zona}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Cuadrilla Responsable:</span>
                <span className="font-bold text-slate-800">{selectedTicket.crew}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Materiales Asignados:</span>
                <span className="text-slate-700">{selectedTicket.materials || "Material estándar"}</span>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-150">
                <span className="text-slate-400 block text-[10px]">Origen de Detección:</span>
                <span className="text-slate-800">{selectedTicket.origin}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
