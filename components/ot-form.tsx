"use client";

import React, { useState } from "react";
import {
  Send,
  RotateCcw,
  ShieldCheck,
  Radio,
  Clock,
  HardHat,
  Network,
  CheckCircle2,
} from "lucide-react";
import { Button } from "./ui/button";

export interface NewOtPayload {
  origin: string;
  criticality: "ALTA" | "CRÍTICA" | "MEDIA" | "BAJA";
  slaHours: string;
  infra: string;
  crew: string;
  materials?: string;
}

interface OtFormProps {
  onAddOt: (ot: NewOtPayload) => void;
  onResetLast?: () => void;
}

const initialForm = {
  origin: "Alarma NOC Automática (NMS)",
  criticality: "ALTA" as const,
  slaHours: "2 horas",
  infra: "POP-02 / ODF Troncal 48FO",
  crew: "Cuadrilla Alfa 01 (L. Ramos)",
  materials: "Mufa Fusión 48FO, Tubos termo retráctiles",
};

export function OtForm({ onAddOt, onResetLast }: OtFormProps) {
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulated visual dispatch latency
    setTimeout(() => {
      onAddOt(formData);
      setIsSubmitting(false);
      setSuccessBanner(true);

      setTimeout(() => {
        setSuccessBanner(false);
      }, 4000);
    }, 600);
  };

  const handleReset = () => {
    setFormData(initialForm);
    if (onResetLast) onResetLast();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#121418] border border-[#1E232B] rounded-xl p-5 space-y-4 shadow-card-dark"
    >
      {/* Form Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E232B] pb-3">
        <div>
          <h2 className="text-base font-bold text-white font-grotesk flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#00AEEF]" />
            Generación y Despacho Rápido de OT
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Asignación directa de ticket a cuadrilla móvil en tiempo real
          </p>
        </div>

        {/* Fixed System Validation Pill (As specified: 'Sin tickets duplicados') */}
        <div className="inline-flex items-center gap-1.5 bg-[#061D3A]/60 border border-[#00AEEF]/40 px-2.5 py-1 rounded text-xs font-mono text-[#00AEEF]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>✓ Sin tickets duplicados</span>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="flex items-center gap-2 p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs font-mono animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            ¡OT generada y notificada a la app del técnico exitosamente! (Simulación visual)
          </span>
        </div>
      )}

      {/* Form Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {/* Origen */}
        <div className="space-y-1.5">
          <label className="text-slate-300 font-medium flex items-center gap-1.5">
            <Network className="w-3.5 h-3.5 text-[#00AEEF]" />
            Origen del Incidente
          </label>
          <select
            value={formData.origin}
            onChange={(e) =>
              setFormData({ ...formData, origin: e.target.value })
            }
            className="w-full bg-[#0B0C0E] border border-[#1E232B] rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:border-[#00AEEF] focus:ring-1 focus:ring-[#00AEEF]"
          >
            <option value="Alarma NOC Automática (NMS)">
              Alarma NOC Automática (NMS)
            </option>
            <option value="Reclamo Cliente VIP Corp">
              Reclamo Cliente VIP Corp
            </option>
            <option value="Avería Masiva por Obras Civiles">
              Avería Masiva por Obras Civiles
            </option>
            <option value="Inspección Preventiva Trimestral">
              Inspección Preventiva Trimestral
            </option>
            <option value="Corte de Energía Subestación">
              Corte de Energía Subestación
            </option>
          </select>
        </div>

        {/* Criticidad */}
        <div className="space-y-1.5">
          <label className="text-slate-300 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF6A13]" />
            Criticidad Operativa
          </label>
          <select
            value={formData.criticality}
            onChange={(e) =>
              setFormData({
                ...formData,
                criticality: e.target.value as any,
              })
            }
            className="w-full bg-[#0B0C0E] border border-[#1E232B] rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:border-[#00AEEF] focus:ring-1 focus:ring-[#00AEEF]"
          >
            <option value="CRÍTICA">CRÍTICA (Afectación Core / VIP)</option>
            <option value="ALTA">ALTA (Corte OSP / Fibra Troncal)</option>
            <option value="MEDIA">MEDIA (Degradación óptica en NAP)</option>
            <option value="BAJA">BAJA (Mantenimiento programado)</option>
          </select>
        </div>

        {/* SLA Estimado */}
        <div className="space-y-1.5">
          <label className="text-slate-300 font-medium flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#00AEEF]" />
            SLA Máximo de Atención
          </label>
          <select
            value={formData.slaHours}
            onChange={(e) =>
              setFormData({ ...formData, slaHours: e.target.value })
            }
            className="w-full bg-[#0B0C0E] border border-[#1E232B] rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:border-[#00AEEF] focus:ring-1 focus:ring-[#00AEEF]"
          >
            <option value="1 hora">1 hora (SLA Platinum VIP)</option>
            <option value="2 horas">2 horas (SLA Troncal OSP)</option>
            <option value="4 horas">4 horas (SLA Distribución)</option>
            <option value="8 horas">8 horas (SLA Estándar)</option>
            <option value="24 horas">24 horas (SLA Programado)</option>
          </select>
        </div>

        {/* Infraestructura Afectada */}
        <div className="space-y-1.5">
          <label className="text-slate-300 font-medium">
            Infraestructura / Nodo Afectado
          </label>
          <input
            type="text"
            value={formData.infra}
            onChange={(e) =>
              setFormData({ ...formData, infra: e.target.value })
            }
            placeholder="Ej: POP-02 / NAP-104 / ODF-48"
            className="w-full bg-[#0B0C0E] border border-[#1E232B] rounded-md px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-[#00AEEF] focus:ring-1 focus:ring-[#00AEEF]"
          />
        </div>

        {/* Cuadrilla Asignada */}
        <div className="space-y-1.5">
          <label className="text-slate-300 font-medium flex items-center gap-1.5">
            <HardHat className="w-3.5 h-3.5 text-[#00AEEF]" />
            Cuadrilla de Campo Asignada
          </label>
          <select
            value={formData.crew}
            onChange={(e) => setFormData({ ...formData, crew: e.target.value })}
            className="w-full bg-[#0B0C0E] border border-[#1E232B] rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:border-[#00AEEF] focus:ring-1 focus:ring-[#00AEEF]"
          >
            <option value="Cuadrilla Alfa 01 (L. Ramos)">
              Cuadrilla Alfa 01 (L. Ramos - En Zona Norte)
            </option>
            <option value="Cuadrilla Beta 03 (M. Silva)">
              Cuadrilla Beta 03 (M. Silva - En Zona Centro)
            </option>
            <option value="Cuadrilla Gamma 05 (J. Gómez)">
              Cuadrilla Gamma 05 (J. Gómez - En Zona Sur)
            </option>
            <option value="Cuadrilla Especial FO 09 (E. Torre)">
              Cuadrilla Especial FO 09 (E. Torre - Fusión Pesada)
            </option>
          </select>
        </div>

        {/* Materiales Asignados */}
        <div className="space-y-1.5">
          <label className="text-slate-300 font-medium">
            Materiales y Repuestos Previstos
          </label>
          <input
            type="text"
            value={formData.materials}
            onChange={(e) =>
              setFormData({ ...formData, materials: e.target.value })
            }
            placeholder="Ej: Bobina FO 144 hilos, Mufa 3M"
            className="w-full bg-[#0B0C0E] border border-[#1E232B] rounded-md px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-[#00AEEF] focus:ring-1 focus:ring-[#00AEEF]"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-[#1E232B]">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="text-slate-400 hover:text-white"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Deshacer
        </Button>

        {/* Action Button: uses orange for prominent action as permitted */}
        <Button
          type="submit"
          variant="orange"
          size="md"
          isLoading={isSubmitting}
        >
          <Send className="w-4 h-4 mr-1.5" />
          Generar y despachar OT
        </Button>
      </div>
    </form>
  );
}
