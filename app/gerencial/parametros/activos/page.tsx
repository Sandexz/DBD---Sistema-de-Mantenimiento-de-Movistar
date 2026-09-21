"use client";

import React, { useState } from "react";
import {
  Database,
  Search,
  Filter,
  Eye,
  Edit,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Server,
  Layers,
  Calendar,
  X,
  Plus,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import initialActivos from "@/mock-data/activos.json";

export default function ActivosPage() {
  const [activos, setActivos] = useState(initialActivos);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterZona, setFilterZona] = useState("TODAS");
  const [filterCriticidad, setFilterCriticidad] = useState("TODAS");
  const [selectedActivo, setSelectedActivo] = useState<any | null>(null);
  const [editActivo, setEditActivo] = useState<any | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filtrado
  const filtered = activos.filter((a) => {
    const matchSearch =
      a.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.central.toLowerCase().includes(searchTerm.toLowerCase());
    const matchZona = filterZona === "TODAS" || a.zona === filterZona;
    const matchCrit = filterCriticidad === "TODAS" || a.criticidad.toUpperCase() === filterCriticidad;
    return matchSearch && matchZona && matchCrit;
  });

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setActivos(activos.map((a) => (a.codigo === editActivo.codigo ? editActivo : a)));
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setEditActivo(null);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#5BC500] bg-[#F0F9E8] px-2 py-0.5 rounded border border-[#C6EE94]">
              MANTENIMIENTO DE PARÁMETROS
            </span>
            <span className="text-xs text-slate-400 font-mono">/ Activos & Vida Útil</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-grotesk tracking-tight text-slate-900 mt-1">
            Gestión de Activos y Vida Útil de Red
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Catálogo maestro de infraestructura crítica de telecomunicaciones Movistar y parametrización preventiva
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="movistar" size="md">
            {activos.length} ACTIVOS AUDITADOS
          </Badge>
        </div>
      </div>

      {/* Info Card: Base del Preventivo */}
      <div className="bg-[#F0F9E8] border border-[#C6EE94] rounded-xl p-4 flex items-start gap-3 text-xs text-slate-700">
        <Clock className="w-5 h-5 text-[#3F8500] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#3F8500] block font-grotesk text-sm">
            Referencia Neurálgica del Mantenimiento Preventivo
          </strong>
          <span className="text-slate-600">
            La parametrización de la vida útil en meses determina cuándo deben programarse inspecciones técnicas o
            reemplazos de componentes críticos (ej. bancos de baterías con límite de 24 meses) antes de que ocurra una
            falla en campo.
          </span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código, tipo, central..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#5BC500] focus:ring-1 focus:ring-[#5BC500]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto text-xs">
          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-[11px] font-mono mr-1">Zona:</span>
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

          <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
            <span className="text-slate-400 text-[11px] font-mono mr-1">Criticidad:</span>
            {["TODAS", "ALTA", "MEDIA", "BAJA"].map((c) => (
              <button
                key={c}
                onClick={() => setFilterCriticidad(c)}
                className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-colors ${
                  filterCriticidad === c
                    ? "bg-slate-900 text-white font-bold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card-clean">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase text-slate-500">
                <th className="py-3 px-4 font-semibold">Código / Activo</th>
                <th className="py-3 px-4 font-semibold">Tipo & Central</th>
                <th className="py-3 px-4 font-semibold">Zona / Ubicación</th>
                <th className="py-3 px-4 font-semibold">Criticidad</th>
                <th className="py-3 px-4 font-semibold">Vida Útil Consumida</th>
                <th className="py-3 px-4 font-semibold">Próxima Renovación</th>
                <th className="py-3 px-4 font-semibold">Estado</th>
                <th className="py-3 px-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => {
                const isNearEnd = item.vidaUtilConsumidaPorc >= 75;
                const isCritical = item.vidaUtilConsumidaPorc >= 90;

                return (
                  <tr key={item.codigo} className="hover:bg-slate-50/80 transition-colors">
                    {/* Código */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="text-[#0070B8]">{item.codigo}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-sans line-clamp-1">
                        {item.descripcion}
                      </span>
                    </td>

                    {/* Tipo & Central */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800 block">{item.tipo}</span>
                      <span className="text-[11px] text-slate-500">{item.central}</span>
                    </td>

                    {/* Ubicación */}
                    <td className="py-3 px-4">
                      <span className="font-mono font-medium text-slate-700 block text-[11px]">
                        {item.zona}
                      </span>
                      <span className="text-[11px] text-slate-500 line-clamp-1">{item.ubicacion}</span>
                    </td>

                    {/* Criticidad */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge
                        variant={
                          item.criticidad === "Alta"
                            ? "red"
                            : item.criticidad === "Media"
                            ? "yellow"
                            : "blue"
                        }
                        size="sm"
                      >
                        {item.criticidad}
                      </Badge>
                    </td>

                    {/* Vida Útil con representación explícita */}
                    <td className="py-3 px-4 min-w-[150px]">
                      <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                        <span className="text-slate-600 font-semibold">{item.vidaUtilMeses} meses tot.</span>
                        <span
                          className={`font-bold ${
                            isCritical
                              ? "text-rose-600"
                              : isNearEnd
                              ? "text-amber-600"
                              : "text-[#3F8500]"
                          }`}
                        >
                          {item.vidaUtilConsumidaPorc}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isCritical
                              ? "bg-rose-500"
                              : isNearEnd
                              ? "bg-amber-500"
                              : "bg-[#5BC500]"
                          }`}
                          style={{ width: `${item.vidaUtilConsumidaPorc}%` }}
                        />
                      </div>
                    </td>

                    {/* Fecha Renovación */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-700 text-[11px]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.fechaRenovacion}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block">Inst: {item.fechaInstalacion}</span>
                    </td>

                    {/* Estado */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge
                        variant={item.estado === "Operativo" ? "green" : "yellow"}
                        size="sm"
                      >
                        {item.estado}
                      </Badge>
                    </td>

                    {/* Acciones */}
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedActivo(item)}
                          className="p-1.5 text-slate-500 hover:text-[#019DF4] hover:bg-slate-100 rounded-lg transition-colors"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditActivo(item)}
                          className="p-1.5 text-slate-500 hover:text-[#5BC500] hover:bg-slate-100 rounded-lg transition-colors"
                          title="Editar parámetros"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalle */}
      {selectedActivo && (
        <Modal
          isOpen={!!selectedActivo}
          onClose={() => setSelectedActivo(null)}
          title={`Ficha de Activo: ${selectedActivo.codigo}`}
          subtitle={selectedActivo.descripcion}
          footer={
            <Button variant="outline" size="sm" onClick={() => setSelectedActivo(null)}>
              Cerrar Ficha
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">Tipo de Activo:</span>
                <span className="font-bold text-slate-800">{selectedActivo.tipo}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Zona Operativa:</span>
                <span className="font-bold text-slate-800">{selectedActivo.zona}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Central Asociada:</span>
                <span className="font-bold text-slate-800">{selectedActivo.central}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Criticidad:</span>
                <Badge
                  variant={selectedActivo.criticidad === "Alta" ? "red" : "yellow"}
                  size="sm"
                >
                  {selectedActivo.criticidad}
                </Badge>
              </div>
            </div>

            {/* Ciclo de Vida */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold font-grotesk text-slate-900 text-xs flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#5BC500]" />
                Parámetros de Vida Útil & Mantenimiento Preventivo
              </h4>
              <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 block">Instalado:</span>
                  <span className="text-slate-700">{selectedActivo.fechaInstalacion}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Vida Útil:</span>
                  <span className="text-slate-700 font-bold">{selectedActivo.vidaUtilMeses} meses</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Próxima Renovación:</span>
                  <span className="text-rose-600 font-bold">{selectedActivo.fechaRenovacion}</span>
                </div>
              </div>
            </div>

            {/* Componentes del Activo */}
            {selectedActivo.componentes && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                  Componentes Críticos Monitoreados:
                </span>
                <div className="space-y-1.5">
                  {selectedActivo.componentes.map((c: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs font-mono"
                    >
                      <div>
                        <span className="font-bold text-slate-800 block">{c.nombre}</span>
                        <span className="text-[10px] text-slate-500">
                          Vida útil: {c.vidaUtil} · Reemplazo preventivo: {c.reemplazoPreventivo}
                        </span>
                      </div>
                      <Badge variant="movistar" size="sm">
                        {c.estado}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Modal de Edición */}
      {editActivo && (
        <Modal
          isOpen={!!editActivo}
          onClose={() => setEditActivo(null)}
          title={`Editar Parámetros de Activo: ${editActivo.codigo}`}
          subtitle="Ajuste de vida útil, criticidad y ciclo de renovación preventiva"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setEditActivo(null)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveEdit}>
                Guardar Parámetros
              </Button>
            </>
          }
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            {saveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>¡Parámetros actualizados exitosamente!</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-slate-700 font-semibold">Descripción del Activo</label>
              <input
                type="text"
                value={editActivo.descripcion}
                onChange={(e) => setEditActivo({ ...editActivo, descripcion: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">Vida Útil (Meses)</label>
                <input
                  type="number"
                  value={editActivo.vidaUtilMeses}
                  onChange={(e) =>
                    setEditActivo({ ...editActivo, vidaUtilMeses: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">Criticidad</label>
                <select
                  value={editActivo.criticidad}
                  onChange={(e) => setEditActivo({ ...editActivo, criticidad: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">Fecha de Renovación Estimada</label>
                <input
                  type="date"
                  value={editActivo.fechaRenovacion}
                  onChange={(e) => setEditActivo({ ...editActivo, fechaRenovacion: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">Estado Operativo</label>
                <select
                  value={editActivo.estado}
                  onChange={(e) => setEditActivo({ ...editActivo, estado: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Operativo">Operativo</option>
                  <option value="En Alerta">En Alerta</option>
                  <option value="En Mantenimiento">En Mantenimiento</option>
                </select>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
