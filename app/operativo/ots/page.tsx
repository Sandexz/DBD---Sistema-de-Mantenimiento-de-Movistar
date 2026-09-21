"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ClipboardList,
  PlusCircle,
  FileText,
  Search,
  Filter,
  ArrowRight,
  HardHat,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  FileCheck2,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import initialOts from "@/mock-data/ots.json";
import initialActivos from "@/mock-data/activos.json";

export default function OtsOperativoPage() {
  const [ots, setOts] = useState<any[]>(initialOts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("TODOS");
  const [filterEstado, setFilterEstado] = useState("TODOS");
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newOtSuccess, setNewOtSuccess] = useState(false);

  const [newOtForm, setNewOtForm] = useState({
    tipo: "PREVENTIVO",
    activo: "BTS-014",
    infra: "BTS Cerro San Cristóbal",
    zona: "Norte",
    prioridad: "P2 - Alta",
    criticality: "ALTA",
    slaHours: "4 horas",
    crew: "Cuadrilla Alfa 01 (L. Ramos)",
    ubicacion: "Mirador San Cristóbal S/N, Rímac",
    fechaProgramada: new Date().toISOString().slice(0, 10),
    materials: "Banco de Baterías Litio 48V, Conectores Anderson",
    origin: "Programación Preventiva NOC",
  });

  const handleCreateOt = (e: React.FormEvent) => {
    e.preventDefault();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newRecord: any = {
      id: `OT-2026-${randomSuffix}`,
      tipo: newOtForm.tipo,
      activo: newOtForm.activo,
      origin: newOtForm.origin,
      criticality: newOtForm.criticality,
      prioridad: newOtForm.prioridad,
      zona: newOtForm.zona,
      slaHours: newOtForm.slaHours,
      infra: newOtForm.infra,
      crew: newOtForm.crew,
      status: "Asignada",
      statusBadge: newOtForm.tipo === "PREVENTIVO" ? "blue" : "red",
      coordinates: "-12.0311, -77.0194",
      ubicacion: newOtForm.ubicacion,
      createdAt: new Date().toISOString().replace("T", " ").slice(0, 16),
      fechaProgramada: newOtForm.fechaProgramada,
      materials: newOtForm.materials,
      isNew: true,
    };

    setOts([newRecord, ...ots]);
    setNewOtSuccess(true);
    setTimeout(() => {
      setNewOtSuccess(false);
      setIsNewModalOpen(false);
    }, 1200);
  };

  const filtered = ots.filter((ot) => {
    const matchesSearch =
      ot.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ot.activo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ot.infra.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ot.crew.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === "TODOS" || ot.tipo === filterTipo;
    const matchesEstado = filterEstado === "TODOS" || ot.status.toUpperCase() === filterEstado.toUpperCase();
    return matchesSearch && matchesTipo && matchesEstado;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#0070B8] bg-[#E5F4FD] px-2 py-0.5 rounded border border-[#B8E2FB]">
              ON-LINE OPERATIVO
            </span>
            <span className="text-xs text-slate-400 font-mono">/ Despacho y Órdenes de Trabajo</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-grotesk tracking-tight text-slate-900 mt-1">
            Gestión de Órdenes de Trabajo (OT)
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Generación, asignación de cuadrillas y seguimiento de OTs Preventivas y Correctivas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/operativo/mobile"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm transition-colors"
          >
            <HardHat className="w-4 h-4 text-[#5BC500]" />
            <span>Simulador App Móvil</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <Button variant="primary" size="sm" onClick={() => setIsNewModalOpen(true)}>
            <PlusCircle className="w-4 h-4 mr-1" />
            <span>Nueva Orden de Trabajo</span>
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por Folio OT, activo, cuadrilla..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <div className="flex items-center gap-1">
            <span className="text-slate-400 font-mono text-[11px]">Tipo OT:</span>
            {["TODOS", "PREVENTIVO", "CORRECTIVO"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterTipo(t)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors ${
                  filterTipo === t
                    ? "bg-[#5BC500] text-white font-bold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
            <span className="text-slate-400 font-mono text-[11px]">Estado:</span>
            {["TODOS", "Pendiente", "Asignada", "En ruta", "En ejecución", "Cerrada"].map((st) => (
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
      </div>

      {/* Table of OTs */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card-clean">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase text-slate-500">
                <th className="py-3 px-4 font-semibold">Folio / Fecha</th>
                <th className="py-3 px-4 font-semibold">Tipo de OT</th>
                <th className="py-3 px-4 font-semibold">Activo / Infraestructura</th>
                <th className="py-3 px-4 font-semibold">Zona & Ubicación</th>
                <th className="py-3 px-4 font-semibold">Prioridad & SLA</th>
                <th className="py-3 px-4 font-semibold">Cuadrilla Asignada</th>
                <th className="py-3 px-4 font-semibold">Estado Operativo</th>
                <th className="py-3 px-4 font-semibold text-right">Papeleta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((ot) => {
                const isPreventivo = ot.tipo === "PREVENTIVO";

                return (
                  <tr
                    key={ot.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      ot.isNew ? "bg-[#F0F9E8]/50" : ""
                    }`}
                  >
                    {/* Folio */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-slate-900">{ot.id}</span>
                        {ot.isNew && (
                          <span className="text-[9px] font-bold bg-[#5BC500] text-white px-1.5 py-0.2 rounded font-mono">
                            NUEVA
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                        {ot.createdAt}
                      </span>
                    </td>

                    {/* Tipo con etiquetas requeridas */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded font-mono text-[10px] font-bold tracking-wider ${
                          isPreventivo
                            ? "bg-[#F0F9E8] text-[#3F8500] border border-[#C6EE94]"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {isPreventivo ? "OT PREVENTIVA" : "OT CORRECTIVA"}
                      </span>
                    </td>

                    {/* Activo / Infra */}
                    <td className="py-3.5 px-4">
                      <strong className="text-slate-900 font-mono text-xs block">{ot.activo}</strong>
                      <span className="text-[11px] text-slate-500 line-clamp-1">{ot.infra}</span>
                    </td>

                    {/* Zona & Ubicación */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-slate-700 font-bold block">{ot.zona}</span>
                      <span className="text-[11px] text-slate-400 line-clamp-1">{ot.ubicacion}</span>
                    </td>

                    {/* Prioridad & SLA */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge variant={ot.criticality === "CRÍTICA" ? "red" : "blue"} size="sm">
                        {ot.prioridad || ot.criticality}
                      </Badge>
                      <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                        SLA: {ot.slaHours}
                      </span>
                    </td>

                    {/* Cuadrilla */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-slate-800 font-medium block">{ot.crew}</span>
                      <span className="text-[10px] font-mono text-slate-400">Prog: {ot.fechaProgramada}</span>
                    </td>

                    {/* Estado */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge
                        variant={
                          ot.status.toLowerCase().includes("cerrad")
                            ? "green"
                            : ot.status.toLowerCase().includes("ejecu")
                            ? "blue"
                            : ot.status.toLowerCase().includes("ruta")
                            ? "yellow"
                            : "gray"
                        }
                        size="sm"
                      >
                        {ot.status}
                      </Badge>
                    </td>

                    {/* Link a Papeleta */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <Link
                        href={`/operativo/reportes?tab=asignacion&ot=${ot.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-[#0070B8] hover:text-[#005088] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded transition-colors"
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                        <span>Papeleta</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para Crear y Despachar OT */}
      {isNewModalOpen && (
        <Modal
          isOpen={isNewModalOpen}
          onClose={() => setIsNewModalOpen(false)}
          title="Generación y Despacho de Orden de Trabajo"
          subtitle="Asignación directa de ticket a cuadrilla móvil en tiempo real"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setIsNewModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreateOt}>
                Generar y Despachar OT
              </Button>
            </>
          }
        >
          <form onSubmit={handleCreateOt} className="space-y-4 text-xs">
            {newOtSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>¡Orden de trabajo despachada a la cuadrilla exitosamente!</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-700 font-semibold block">Tipo de Mantenimiento Obligatorio</label>
                <select
                  value={newOtForm.tipo}
                  onChange={(e) => setNewOtForm({ ...newOtForm, tipo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                >
                  <option value="PREVENTIVO">PREVENTIVO (Inspección / Cambio de Vida Útil)</option>
                  <option value="CORRECTIVO">CORRECTIVO (Avería / Incidencia Imprevista)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold block">Activo Asociado</label>
                <select
                  value={newOtForm.activo}
                  onChange={(e) => {
                    const cod = e.target.value;
                    const a = initialActivos.find((x) => x.codigo === cod);
                    if (a) {
                      setNewOtForm({
                        ...newOtForm,
                        activo: cod,
                        infra: a.descripcion,
                        zona: a.zona,
                        ubicacion: a.ubicacion,
                      });
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                >
                  {initialActivos.map((a) => (
                    <option key={a.codigo} value={a.codigo}>
                      {a.codigo} ({a.tipo})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-700 font-semibold block">Cuadrilla Asignada</label>
                <select
                  value={newOtForm.crew}
                  onChange={(e) => setNewOtForm({ ...newOtForm, crew: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Cuadrilla Alfa 01 (L. Ramos)">Cuadrilla Alfa 01 (L. Ramos - Lari)</option>
                  <option value="Cuadrilla Beta 03 (M. Silva)">Cuadrilla Beta 03 (M. Silva - Cobra)</option>
                  <option value="Cuadrilla Gamma 05 (J. Gómez)">Cuadrilla Gamma 05 (J. Gómez - Telconet)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold block">Prioridad & SLA</label>
                <select
                  value={newOtForm.prioridad}
                  onChange={(e) =>
                    setNewOtForm({
                      ...newOtForm,
                      prioridad: e.target.value,
                      criticality: e.target.value.includes("P1") ? "CRÍTICA" : "ALTA",
                      slaHours: e.target.value.includes("P1") ? "1 hora" : "4 horas",
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="P1 - Crítica">P1 - Crítica (SLA 1 hora)</option>
                  <option value="P2 - Alta">P2 - Alta (SLA 4 horas)</option>
                  <option value="P3 - Media">P3 - Media (SLA 8 horas)</option>
                  <option value="P4 - Baja">P4 - Baja (SLA 24 horas)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-semibold block">Materiales Asignados para la Intervención</label>
              <input
                type="text"
                value={newOtForm.materials}
                onChange={(e) => setNewOtForm({ ...newOtForm, materials: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
