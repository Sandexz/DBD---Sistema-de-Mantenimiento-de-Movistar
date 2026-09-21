"use client";

import React from "react";
import Link from "next/link";
import {
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  HardHat,
  MapPin,
  QrCode,
  FileCheck2,
  ShieldAlert,
} from "lucide-react";
import { MobileFlow } from "@/components/mobile-flow";
import { Badge } from "@/components/ui/badge";

export default function OperativoMobilePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#0070B8] bg-[#E5F4FD] px-2 py-0.5 rounded border border-[#B8E2FB]">
              ON-LINE OPERATIVO
            </span>
            <span className="text-xs text-slate-400 font-mono">/ Aplicación Técnica de Campo</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-grotesk tracking-tight text-slate-900 mt-1">
            Simulador de App Móvil de Campo
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Flujo guiado para técnicos en exteriores: Check-in GPS &lt; 50m → ATS → Ejecución → Descargo de Stock → Cierre
          </p>
        </div>

        <Badge variant="movistar" size="md">
          TEMA CLARO · ALTO CONTRASTE EXTERIORES
        </Badge>
      </div>

      {/* Main Container: Guide Info + Phone Frame */}
      <div className="flex flex-col lg:flex-row items-start justify-center gap-8 max-w-6xl mx-auto">
        {/* Left Side: Guía de Validaciones Activas para el evaluador */}
        <div className="w-full lg:w-96 space-y-4 text-xs">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3.5 shadow-card-clean">
            <div className="flex items-center gap-2 text-[#0070B8] border-b border-slate-150 pb-2.5">
              <ShieldCheck className="w-5 h-5 text-[#5BC500]" />
              <h2 className="text-sm font-bold text-slate-900 font-grotesk">
                Validaciones Activas de la Arquitectura
              </h2>
            </div>

            <p className="text-slate-600 leading-relaxed font-sans">
              La aplicación móvil implementa todas las reglas transaccionales requeridas para proteger la integridad de datos:
            </p>

            <div className="space-y-2.5 font-sans pt-1">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <MapPin className="w-4 h-4 text-[#5BC500]" />
                  <span>1. Check-in GPS (&lt; 50 metros)</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Si el técnico se encuentra a más de 50m del nodo según el GPS del móvil, el sistema rechaza el check-in.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <ShieldAlert className="w-4 h-4 text-[#019DF4]" />
                  <span>2. Papeleta ATS Obligatoria</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Bloquea el inicio del trabajo hasta validar EPP, uso de arnés certificado y condiciones climáticas.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <QrCode className="w-4 h-4 text-amber-500" />
                  <span>3. Verificación de Stock de Camioneta</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  El escaneo QR descuenta en milisegundos los insumos verificando disponibilidad en el móvil.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <FileCheck2 className="w-4 h-4 text-rose-500" />
                  <span>4. Cierre Transaccional</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Exige obligatoriamente fotografía técnica de la intervención y firma digital de conformidad.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Phone Simulator */}
        <div className="w-full max-w-[420px] shrink-0">
          <MobileFlow />
        </div>
      </div>
    </div>
  );
}
