"use client";

import React, { useEffect } from "react";
import {
  X,
  MapPin,
  Clock,
  HardHat,
  Package,
  ShieldCheck,
  AlertTriangle,
  Radio,
  Calendar,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Phone,
} from "lucide-react";
import { OtRecord } from "./ot-table";

interface OtDetailModalProps {
  ot: OtRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OtDetailModal({ ot, isOpen, onClose }: OtDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !ot) return null;

  const isCritical = ot.criticality === "CRÍTICA" || ot.criticality === "ALTA";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 flex flex-col max-h-[90vh] text-slate-800">
        {/* Apple-style sleek header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-mono font-bold text-xs ${
                isCritical
                  ? "bg-orange-50 text-[#FF6A13] border border-orange-100"
                  : "bg-blue-50 text-[#0066CC] border border-blue-100"
              }`}
            >
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight font-grotesk">
                  {ot.id}
                </h3>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                    isCritical
                      ? "bg-orange-100/80 text-[#FF6A13]"
                      : "bg-blue-100/80 text-[#0066CC]"
                  }`}
                >
                  {ot.criticality}
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {ot.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Creado: {ot.createdAt} · Origen: {ot.origin}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Progress Timeline Stepper */}
          <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Trazabilidad Operativa de la Orden
            </h4>
            <div className="flex items-center justify-between text-xs">
              <div className="flex flex-col items-center flex-1">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[11px] shadow-sm">
                  ✓
                </div>
                <span className="text-[11px] font-semibold text-slate-800 mt-1.5">Generada</span>
                <span className="text-[10px] text-slate-400 font-mono">NOC NMS</span>
              </div>
              <div className="h-0.5 flex-1 bg-emerald-500 mx-1" />

              <div className="flex flex-col items-center flex-1">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[11px] shadow-sm">
                  ✓
                </div>
                <span className="text-[11px] font-semibold text-slate-800 mt-1.5">Despachada</span>
                <span className="text-[10px] text-slate-400 font-mono">Cuadrilla</span>
              </div>
              <div className="h-0.5 flex-1 bg-orange-400 mx-1" />

              <div className="flex flex-col items-center flex-1">
                <div className="w-7 h-7 rounded-full bg-[#FF6A13] text-white flex items-center justify-center font-bold text-[11px] shadow-sm ring-4 ring-orange-100">
                  3
                </div>
                <span className="text-[11px] font-semibold text-[#FF6A13] mt-1.5">En Atención</span>
                <span className="text-[10px] text-slate-400 font-mono">En Sitio</span>
              </div>
              <div className="h-0.5 flex-1 bg-slate-200 mx-1" />

              <div className="flex flex-col items-center flex-1">
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center font-bold text-[11px]">
                  4
                </div>
                <span className="text-[11px] font-semibold text-slate-400 mt-1.5">Liquidación</span>
                <span className="text-[10px] text-slate-400 font-mono">Cierre OT</span>
              </div>
            </div>
          </div>

          {/* Core Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Infraestructura y Coordenadas */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-[#0A2E5C]">
                <MapPin className="w-4 h-4 text-[#0066CC]" />
                <h5 className="font-bold text-xs uppercase tracking-wide text-slate-700">
                  Infraestructura & Ubicación
                </h5>
              </div>
              <div className="space-y-1.5">
                <p className="font-bold text-slate-900 text-sm">{ot.infra}</p>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                    GPS: {ot.coordinates}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 pt-1">
                  Nodo troncal de fibra óptica de alta densidad. Acceso habilitado 24/7.
                </p>
              </div>
            </div>

            {/* SLA y Tiempos */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-[#FF6A13]">
                <Clock className="w-4 h-4 text-[#FF6A13]" />
                <h5 className="font-bold text-xs uppercase tracking-wide text-slate-700">
                  SLA & Ventana de Atención
                </h5>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500">Tiempo Máximo:</span>
                  <span className="font-bold text-slate-900 text-sm font-mono">{ot.slaHours}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500">Estado de SLA:</span>
                  <span className="font-bold text-emerald-600 text-xs font-mono">DENTRO DE PLAZO</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                  <div className="bg-[#FF6A13] h-full w-[45%] rounded-full" />
                </div>
              </div>
            </div>

            {/* Cuadrilla */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#0A2E5C]">
                  <HardHat className="w-4 h-4 text-[#0066CC]" />
                  <h5 className="font-bold text-xs uppercase tracking-wide text-slate-700">
                    Cuadrilla de Campo
                  </h5>
                </div>
                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  En Zona
                </span>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-900 text-sm">{ot.crew}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>RPC: +51 987 654 321 (Canal Radio 4G)</span>
                </div>
              </div>
            </div>

            {/* Materiales */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-[#0A2E5C]">
                <Package className="w-4 h-4 text-[#0066CC]" />
                <h5 className="font-bold text-xs uppercase tracking-wide text-slate-700">
                  Materiales Previstos
                </h5>
              </div>
              <p className="text-xs text-slate-700 font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                {ot.materials || "Material estándar de empalme y diagnóstico OTDR"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Validación NOC: Conforme</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
}
