"use client";

import React, { useState } from "react";
import {
  CalendarDays,
  Table as TableIcon,
  Filter,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Search,
  HardHat,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import initialPlans from "@/mock-data/planificaciones.json";

export default function PlanificacionPage() {
  const [plans, setPlans] = useState<any[]>(initialPlans);
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");
  const [filterZona, setFilterZona] = useState("TODAS");
  const [filterEstado, setFilterEstado] = useState("TODOS");
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    activoCodigo: "BTS-014",
    activoNombre: "BTS Cerro San Cristóbal",
    tipo: "PREVENTIVO",
    actividad: "Inspección de baterías y reflectometría",
    periodicidad: "Trimestral",
    fechaProgramada: "2026-10-20",
    responsable: "Ing. Luis Ramos",
    cuadrilla: "Cuadrilla Alfa 01 (L. Ramos)",
    zona: "Norte",
    estado: "Programado",
  });
  const [planSuccess, setPlanSuccess] = useState(false);

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `PLAN-2026-00${plans.length + 1}`;
    setPlans([
      {
        id,
        ...newPlan,
      },
      ...plans,
    ]);
    setPlanSuccess(true);
    setTimeout(() => {
      setPlanSuccess(false);
      setIsNewModalOpen(false);
    }, 1200);
  };

  const filtered = plans.filter((p) => {
    const matchZona = filterZona === "TODAS" || p.zona === filterZona;
    const matchEstado = filterEstado === "TODOS" || p.estado.toUpperCase() === filterEstado.toUpperCase();
    return matchZona && matchEstado;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#5BC500] bg-[#F0F9E8] px-2 py-0.5 rounded border border-[#C6EE94]">
              MANTENIMIENTO DE PARÁMETROS
            </span>
            <span className="text-xs text-slate-400 font-mono">/ Planificador Operativo</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-grotesk tracking-tight text-slate-900 mt-1">
            Planificación de Mantenimientos
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Definición y programación de rutinas preventivas y correctivos programados en infraestructura
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Switch de Vistas */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                viewMode === "table"
                  ? "bg-white text-slate-900 shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Tabla</span>
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                viewMode === "calendar"
                  ? "bg-white text-slate-900 shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Calendario</span>
            </button>
          </div>

          <Button variant="primary" size="sm" onClick={() => setIsNewModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />
            <span>Planificar Mantenimiento</span>
          </Button>
        </div>
      </div>

      {/* Alerta de Alcance Arquitectónico */}
      <div className="bg-[#EBF8DC] border border-[#C6EE94] rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-slate-700">
        <Sparkles className="w-4 h-4 text-[#3F8500] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#3F8500] block font-grotesk">
            Regla Arquitectónica del Módulo Gerencial
          </strong>
          <span>
            Esta pantalla <strong>planifica</strong> las rutinas con fecha, periodicidad y cuadrilla asignada. La
            emisión masiva nocturna de las OTs preventivas corresponde al algoritmo del módulo Batch (ACT-BD).
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <span className="text-slate-400 font-mono text-[11px]">Zona:</span>
          {["TODAS", "Norte", "Centro", "Sur", "Este"].map((z) => (
            <button
              key={z}
              onClick={() => setFilterZona(z)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors ${
                filterZona === z
                  ? "bg-[#5BC500] text-white font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {z}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <span className="text-slate-400 font-mono text-[11px]">Estado:</span>
          {["TODOS", "Programado", "Próximo", "Ejecutado", "Pendiente", "Incumplido"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterEstado(st)}
              className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-colors ${
                filterEstado.toUpperCase() === st.toUpperCase()
                  ? "bg-slate-900 text-white font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* VISTA 1: TABLA */}
      {viewMode === "table" && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card-clean">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase text-slate-500">
                  <th className="py-3 px-4 font-semibold">Folio / Tipo</th>
                  <th className="py-3 px-4 font-semibold">Activo & Zona</th>
                  <th className="py-3 px-4 font-semibold">Actividad Programada</th>
                  <th className="py-3 px-4 font-semibold">Periodicidad</th>
                  <th className="py-3 px-4 font-semibold">Fecha Programada</th>
                  <th className="py-3 px-4 font-semibold">Responsable / Cuadrilla</th>
                  <th className="py-3 px-4 font-semibold text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => {
                  const isPreventivo = item.tipo === "PREVENTIVO";
                  const isIncumplido = item.estado === "Incumplido";
                  const isProximo = item.estado === "Próximo";

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Folio & Tipo */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-900 block">{item.id}</span>
                        <Badge
                          variant={isPreventivo ? "movistar" : "yellow"}
                          size="sm"
                        >
                          {isPreventivo ? "PREVENTIVO" : "CORRECTIVO PROG."}
                        </Badge>
                      </td>

                      {/* Activo & Zona */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-slate-800 block">{item.activoNombre}</span>
                        <span className="font-mono text-[11px] text-slate-400">
                          {item.activoCodigo} · Zona {item.zona}
                        </span>
                      </td>

                      {/* Actividad */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-slate-700 font-sans line-clamp-2">{item.actividad}</p>
                      </td>

                      {/* Periodicidad */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-600">
                        {item.periodicidad}
                      </td>

                      {/* Fecha */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                        <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-[#5BC500]" />
                          <span>{item.fechaProgramada}</span>
                        </div>
                      </td>

                      {/* Responsable */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-slate-800 font-medium block">{item.responsable}</span>
                        <span className="text-[11px] font-mono text-slate-400">{item.cuadrilla}</span>
                      </td>

                      {/* Estado */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <Badge
                          variant={
                            item.estado === "Ejecutado"
                              ? "green"
                              : isProximo
                              ? "orange"
                              : isIncumplido
                              ? "red"
                              : "blue"
                          }
                          size="sm"
                        >
                          {item.estado}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VISTA 2: CALENDARIO */}
      {viewMode === "calendar" && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-card-clean space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-150">
            <h3 className="font-bold text-slate-900 font-grotesk text-sm">
              Septiembre - Octubre 2026 (Cronograma Preventivo)
            </h3>
            <span className="text-xs font-mono text-slate-400">{filtered.length} mantenimientos agendados</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 hover:border-[#5BC500] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900">
                    <Calendar className="w-3.5 h-3.5 text-[#5BC500]" />
                    <span>{item.fechaProgramada}</span>
                  </div>
                  <Badge variant={item.tipo === "PREVENTIVO" ? "movistar" : "yellow"} size="sm">
                    {item.tipo}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 font-grotesk text-xs">{item.activoNombre}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{item.actividad}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-500">{item.cuadrilla}</span>
                  <Badge
                    variant={
                      item.estado === "Ejecutado"
                        ? "green"
                        : item.estado === "Próximo"
                        ? "orange"
                        : item.estado === "Incumplido"
                        ? "red"
                        : "blue"
                    }
                    size="sm"
                  >
                    {item.estado}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal para Planificar Mantenimiento */}
      {isNewModalOpen && (
        <Modal
          isOpen={isNewModalOpen}
          onClose={() => setIsNewModalOpen(false)}
          title="Planificar Nueva Rutina de Mantenimiento"
          subtitle="Programación anticipada preventiva en el catálogo de activos"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setIsNewModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={handleAddPlan}>
                Registrar en Planificador
              </Button>
            </>
          }
        >
          <form onSubmit={handleAddPlan} className="space-y-4 text-xs">
            {planSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>¡Rutina planificada correctamente en el calendario!</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">Tipo de Mantenimiento</label>
                <select
                  value={newPlan.tipo}
                  onChange={(e) => setNewPlan({ ...newPlan, tipo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="PREVENTIVO">PREVENTIVO (Prioridad de Red)</option>
                  <option value="CORRECTIVO_PROGRAMADO">CORRECTIVO PROGRAMADO</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">Periodicidad</label>
                <select
                  value={newPlan.periodicidad}
                  onChange={(e) => setNewPlan({ ...newPlan, periodicidad: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Mensual">Mensual</option>
                  <option value="Trimestral">Trimestral</option>
                  <option value="Semestral">Semestral</option>
                  <option value="Anual">Anual</option>
                  <option value="Cada 24 meses">Cada 24 meses (Baterías)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-semibold">Activo de Red</label>
              <select
                value={newPlan.activoCodigo}
                onChange={(e) => {
                  const cod = e.target.value;
                  const name =
                    cod === "BTS-014"
                      ? "BTS Cerro San Cristóbal"
                      : cod === "DC-LIMA-01"
                      ? "Data Center Monterrico"
                      : "Nodo Óptico San Isidro";
                  setNewPlan({ ...newPlan, activoCodigo: cod, activoNombre: name });
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                <option value="BTS-014">BTS-014 - Estación Base San Cristóbal</option>
                <option value="DC-LIMA-01">DC-LIMA-01 - Data Center Monterrico</option>
                <option value="N-025">N-025 - Nodo Óptico San Isidro</option>
                <option value="OLT-SUR-02">OLT-SUR-02 - Cabecera Chorrillos</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-semibold">Descripción de la Actividad</label>
              <textarea
                value={newPlan.actividad}
                onChange={(e) => setNewPlan({ ...newPlan, actividad: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">Fecha Programada</label>
                <input
                  type="date"
                  value={newPlan.fechaProgramada}
                  onChange={(e) => setNewPlan({ ...newPlan, fechaProgramada: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">Cuadrilla Asignada</label>
                <select
                  value={newPlan.cuadrilla}
                  onChange={(e) => setNewPlan({ ...newPlan, cuadrilla: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Cuadrilla Alfa 01 (L. Ramos)">Cuadrilla Alfa 01 (L. Ramos - Lari)</option>
                  <option value="Cuadrilla Beta 03 (M. Silva)">Cuadrilla Beta 03 (M. Silva - Cobra)</option>
                  <option value="Cuadrilla Gamma 05 (J. Gómez)">Cuadrilla Gamma 05 (J. Gómez - Telconet)</option>
                </select>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
