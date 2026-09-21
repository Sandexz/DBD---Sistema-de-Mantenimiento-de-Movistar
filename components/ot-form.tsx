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
  AlertTriangle,
  Sparkles,
  Layers,
  MapPin,
  Wrench,
} from "lucide-react";

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

const initialForm: NewOtPayload = {
  origin: "Alarma NOC Automática (NMS)",
  criticality: "ALTA",
  slaHours: "2 horas",
  infra: "POP-02 / ODF Troncal 48FO",
  crew: "Cuadrilla Alfa 01 (L. Ramos)",
  materials: "Mufa Fusión 48FO, Tubos termo retráctiles",
};

const criticalityOptions: Array<{
  value: "CRÍTICA" | "ALTA" | "MEDIA" | "BAJA";
  label: string;
  defaultSla: string;
  badgeClass: string;
}> = [
  {
    value: "CRÍTICA",
    label: "Crítica",
    defaultSla: "1 hora",
    badgeClass: "text-[#FF6A13] border-orange-200 bg-orange-50",
  },
  {
    value: "ALTA",
    label: "Alta",
    defaultSla: "2 horas",
    badgeClass: "text-[#FF6A13] border-orange-200 bg-orange-50/60",
  },
  {
    value: "MEDIA",
    label: "Media",
    defaultSla: "4 horas",
    badgeClass: "text-[#0066CC] border-blue-200 bg-blue-50",
  },
  {
    value: "BAJA",
    label: "Baja",
    defaultSla: "24 horas",
    badgeClass: "text-slate-600 border-slate-200 bg-slate-50",
  },
];

const quickInfraSuggestions = [
  "POP-01 Centro / ODF-96",
  "POP-02 Norte / Troncal 48FO",
  "POP-03 Sur / NAP-104",
  "NAP-882 Postería Urbana",
  "Switch Core Huawei S6730",
];

export function OtForm({ onAddOt, onResetLast }: OtFormProps) {
  const [formData, setFormData] = useState<NewOtPayload>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState(false);

  const handleCriticalityChange = (crit: "CRÍTICA" | "ALTA" | "MEDIA" | "BAJA") => {
    const matched = criticalityOptions.find((c) => c.value === crit);
    setFormData((prev) => ({
      ...prev,
      criticality: crit,
      slaHours: matched ? matched.defaultSla : prev.slaHours,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      onAddOt(formData);
      setIsSubmitting(false);
      setSuccessBanner(true);

      setTimeout(() => {
        setSuccessBanner(false);
      }, 4500);
    }, 500);
  };

  const handleReset = () => {
    setFormData(initialForm);
    if (onResetLast) onResetLast();
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm transition-all text-slate-800">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0A2E5C] text-white flex items-center justify-center shadow-sm">
            <Radio className="w-5 h-5 text-[#00AEEF]" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-grotesk">
              Generación & Despacho Rápido de OT
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Asignación inmediata de órdenes de trabajo a cuadrillas móviles
            </p>
          </div>
        </div>

        {/* Apple-style minimalist verification pill */}
        <div className="inline-flex items-center gap-1.5 bg-blue-50/80 border border-blue-100/90 text-[#0066CC] px-3 py-1.5 rounded-full text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0066CC]" />
          <span>✓ Sin tickets duplicados</span>
        </div>
      </div>

      {/* Dispatched Notification Toast Banner */}
      {successBanner && (
        <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 text-emerald-800 text-xs font-medium animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              ¡Orden despachada con éxito! Se ha notificado a la cuadrilla asignada vía red móvil.
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-600 font-bold">
            LIVE DISPATCH
          </span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Criticality Selector (Minimalist Apple-style Segmented Pills) */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF6A13]" />
              Nivel de Criticidad Operativa
            </span>
            <span className="text-[11px] font-mono text-slate-400 font-normal">
              Ajusta automáticamente el SLA
            </span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {criticalityOptions.map((opt) => {
              const isSelected = formData.criticality === opt.value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => handleCriticalityChange(opt.value)}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-semibold border transition-all flex items-center justify-between ${
                    isSelected
                      ? opt.value === "CRÍTICA" || opt.value === "ALTA"
                        ? "bg-[#FF6A13] text-white border-[#FF6A13] shadow-sm ring-2 ring-orange-100"
                        : "bg-[#0A2E5C] text-white border-[#0A2E5C] shadow-sm ring-2 ring-blue-100"
                      : "bg-slate-50 hover:bg-slate-100/80 text-slate-600 border-slate-200/80"
                  }`}
                >
                  <span>{opt.label}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-white text-slate-500 border border-slate-200"
                    }`}
                  >
                    {opt.defaultSla}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid of Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          {/* Origen del Incidente */}
          <div className="space-y-1.5">
            <label className="text-slate-700 font-semibold flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5 text-[#0066CC]" />
              Origen del Incidente
            </label>
            <select
              value={formData.origin}
              onChange={(e) =>
                setFormData({ ...formData, origin: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer font-sans"
            >
              <option value="Alarma NOC Automática (NMS)">Alarma NOC Automática (NMS)</option>
              <option value="Reclamo Cliente VIP Corp">Reclamo Cliente VIP Corp</option>
              <option value="Avería Masiva por Obras Civiles">Avería Masiva por Obras Civiles</option>
              <option value="Inspección Preventiva Trimestral">Inspección Preventiva Trimestral</option>
              <option value="Corte de Energía Subestación">Corte de Energía Subestación</option>
            </select>
          </div>

          {/* SLA Máximo */}
          <div className="space-y-1.5">
            <label className="text-slate-700 font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FF6A13]" />
              SLA Máximo de Atención
            </label>
            <select
              value={formData.slaHours}
              onChange={(e) =>
                setFormData({ ...formData, slaHours: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 text-slate-800 font-mono focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
            >
              <option value="1 hora">1 hora (SLA Platinum VIP)</option>
              <option value="1.5 horas">1.5 horas (SLA Troncal OSP)</option>
              <option value="2 horas">2 horas (SLA Distribución)</option>
              <option value="4 horas">4 horas (SLA Red Acceso)</option>
              <option value="8 horas">8 horas (SLA Estándar)</option>
              <option value="24 horas">24 horas (SLA Preventivo)</option>
            </select>
          </div>

          {/* Cuadrilla Asignada */}
          <div className="space-y-1.5">
            <label className="text-slate-700 font-semibold flex items-center gap-1.5">
              <HardHat className="w-3.5 h-3.5 text-[#0066CC]" />
              Cuadrilla de Campo
            </label>
            <select
              value={formData.crew}
              onChange={(e) => setFormData({ ...formData, crew: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
            >
              <option value="Cuadrilla Alfa 01 (L. Ramos)">Cuadrilla Alfa 01 (L. Ramos - Zona Norte)</option>
              <option value="Cuadrilla Beta 03 (M. Silva)">Cuadrilla Beta 03 (M. Silva - Zona Centro)</option>
              <option value="Cuadrilla Gamma 05 (J. Gómez)">Cuadrilla Gamma 05 (J. Gómez - Zona Sur)</option>
              <option value="Cuadrilla Especial FO 09 (E. Torre)">Cuadrilla Especial FO 09 (E. Torre - Fusión)</option>
              <option value="Cuadrilla Delta 02 (C. Prado)">Cuadrilla Delta 02 (C. Prado - Planta Externa)</option>
            </select>
          </div>

          {/* Infraestructura / Nodo Afectado */}
          <div className="space-y-1.5 md:col-span-2 lg:col-span-2">
            <label className="text-slate-700 font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0066CC]" />
                Infraestructura / Nodo Afectado
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                Sugerencias rápidas abajo
              </span>
            </label>
            <input
              type="text"
              value={formData.infra}
              onChange={(e) => setFormData({ ...formData, infra: e.target.value })}
              placeholder="Ej: POP-02 / ODF Troncal 48FO"
              className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 text-slate-800 font-mono text-xs focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-blue-100 transition-all"
            />
            {/* Quick preset chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {quickInfraSuggestions.map((sug) => (
                <button
                  type="button"
                  key={sug}
                  onClick={() => setFormData({ ...formData, infra: sug })}
                  className="px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-blue-50 text-[10px] text-slate-600 hover:text-[#0066CC] border border-slate-200/60 transition-colors font-mono"
                >
                  + {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Materiales y Repuestos */}
          <div className="space-y-1.5">
            <label className="text-slate-700 font-semibold flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-[#0066CC]" />
              Materiales y Repuestos Previstos
            </label>
            <input
              type="text"
              value={formData.materials || ""}
              onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
              placeholder="Ej: Mufa Fusión 48FO, Pigtails SC-APC"
              className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 text-slate-800 font-mono text-xs focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Despacho reactivo inmediato a móvil</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-bold text-white bg-[#019DF4] hover:bg-[#0081CB] active:scale-[0.98] shadow-md shadow-[#019DF4]/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Despachando orden...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Generar OT</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
