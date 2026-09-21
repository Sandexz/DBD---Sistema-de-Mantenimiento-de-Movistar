"use client";

import React, { useState } from "react";
import {
  Clock,
  ShieldCheck,
  AlertTriangle,
  Edit,
  CheckCircle2,
  FileCheck2,
  Sliders,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import initialSla from "@/mock-data/sla.json";

export default function SlaPage() {
  const [slas, setSlas] = useState(initialSla);
  const [editingSla, setEditingSla] = useState<any | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSlas(slas.map((s) => (s.id === editingSla.id ? editingSla : s)));
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setEditingSla(null);
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
            <span className="text-xs text-slate-400 font-mono">/ SLAs & Tiempos Base</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-grotesk tracking-tight text-slate-900 mt-1">
            SLA y Tiempos Base de Atención
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Configuración de umbrales máximos contractuales de resolución y penalidades regulatorias (OSIPTEL)
          </p>
        </div>

        <Badge variant="blue" size="md">
          REGULACIÓN OSIPTEL 2026
        </Badge>
      </div>

      {/* Info Regulatory Banner */}
      <div className="bg-[#E5F4FD] border border-[#B8E2FB] rounded-xl p-4 flex items-start gap-3 text-xs text-slate-700">
        <ShieldCheck className="w-5 h-5 text-[#0070B8] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#0070B8] block font-grotesk text-sm">
            Tiempos Contractuales y Cumplimiento Regulatorio
          </strong>
          <span className="text-slate-600">
            Los tiempos definidos en esta matriz son aplicados en tiempo real por el motor de despacho para el cálculo
            de vencimientos de tickets, cálculo de penalidades a contratas y prevención de multas ante OSIPTEL.
          </span>
        </div>
      </div>

      {/* Grid of SLAs by Severity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {slas.map((s) => {
          const isCrit = s.severidad === "CRÍTICA";
          const isAlta = s.severidad === "ALTA";

          return (
            <div
              key={s.id}
              className={`bg-white border rounded-xl p-5 shadow-card-clean space-y-3 transition-all ${
                isCrit
                  ? "border-rose-200 hover:border-rose-400"
                  : isAlta
                  ? "border-amber-200 hover:border-amber-400"
                  : "border-slate-200 hover:border-[#5BC500]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-grotesk font-extrabold text-base text-slate-900">
                      {s.severidad}
                    </span>
                    <Badge
                      variant={isCrit ? "red" : isAlta ? "orange" : "blue"}
                      size="sm"
                    >
                      {s.prioridad}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">{s.descripcion}</p>
                </div>

                <button
                  onClick={() => setEditingSla({ ...s })}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Editar tiempos"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>

              {/* Tiempos Box */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-150 font-mono text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Tiempo Máx. Atención:
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{s.tiempoMaximoAtencion}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Tiempo Obj. Solución:
                  </span>
                  <span
                    className={`font-bold text-sm ${
                      isCrit ? "text-rose-600" : isAlta ? "text-amber-600" : "text-[#0070B8]"
                    }`}
                  >
                    {s.tiempoObjetivoSolucion}
                  </span>
                </div>
              </div>

              {/* Extras: Horario & Penalidad */}
              <div className="space-y-1 text-xs text-slate-600 pt-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Horario Cobertura:</span>
                  <span className="font-mono text-slate-700">{s.horarioCobertura}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Penalidad Regulatoria:</span>
                  <span className="font-mono font-bold text-rose-600">{s.penalidadOsiptel}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Edición de Tiempos SLA */}
      {editingSla && (
        <Modal
          isOpen={!!editingSla}
          onClose={() => setEditingSla(null)}
          title={`Ajustar Parámetros de SLA: ${editingSla.severidad}`}
          subtitle="Modificación de umbrales regulatorios de atención y solución"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setEditingSla(null)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={handleSave}>
                Guardar SLA
              </Button>
            </>
          }
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            {saveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>¡SLA actualizado correctamente!</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-slate-700 font-semibold">Descripción del Nivel</label>
              <input
                type="text"
                value={editingSla.descripcion}
                onChange={(e) => setEditingSla({ ...editingSla, descripcion: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">Tiempo Máximo de Atención</label>
                <input
                  type="text"
                  value={editingSla.tiempoMaximoAtencion}
                  onChange={(e) =>
                    setEditingSla({ ...editingSla, tiempoMaximoAtencion: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">Tiempo Objetivo de Solución</label>
                <input
                  type="text"
                  value={editingSla.tiempoObjetivoSolucion}
                  onChange={(e) =>
                    setEditingSla({ ...editingSla, tiempoObjetivoSolucion: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-semibold">Penalidad OSIPTEL</label>
              <input
                type="text"
                value={editingSla.penalidadOsiptel}
                onChange={(e) => setEditingSla({ ...editingSla, penalidadOsiptel: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
