"use client";

import React from "react";
import Link from "next/link";
import {
  Smartphone,
  ArrowLeft,
  Sun,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
} from "lucide-react";
import { MobileFlow } from "@/components/mobile-flow";
import { Badge } from "@/components/ui/badge";

export default function MobilePage() {
  return (
    <div className="min-h-screen bg-[#0B0C0E] text-slate-100 flex flex-col font-sans">
      {/* Top Bar for Simulator Context & Navigation Back to NOC */}
      <header className="bg-[#0A2E5C] border-b border-[#144585] px-4 py-3 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-[#061D3A] px-3 py-1.5 rounded-lg border border-white/15 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver al NOC</span>
            </Link>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-white font-grotesk">
                Simulador de App Técnica en Campo
              </h1>
              <p className="text-[11px] text-slate-300">
                Flujo móvil para cuadrillas de mantenimiento en exteriores
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#061D3A] border border-[#00AEEF]/40 px-2.5 py-1 rounded text-xs font-mono text-[#00AEEF]">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Tema Claro (#FFFFFF) para Exteriores</span>
              <span className="sm:hidden">Exteriores</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-center gap-8 max-w-6xl mx-auto w-full">
        {/* Left Side: Field Explanatory Info Card (for reviewers) */}
        <div className="w-full lg:w-96 space-y-4 text-xs">
          <div className="bg-[#121418] border border-[#1E232B] rounded-2xl p-5 space-y-3 shadow-card-dark">
            <div className="flex items-center gap-2 text-[#00AEEF] border-b border-[#1E232B] pb-2">
              <Smartphone className="w-5 h-5" />
              <h2 className="text-sm font-bold text-white font-grotesk">
                Flujo Operativo de 3 Pasos
              </h2>
            </div>

            <p className="text-slate-300 leading-relaxed font-sans">
              Esta pantalla simula la aplicación móvil que utiliza el técnico en campo con alto contraste y fondo blanco para óptima legibilidad bajo luz solar directa.
            </p>

            <div className="space-y-2.5 font-sans pt-2">
              <div className="flex items-start gap-2.5 p-2.5 bg-[#0B0C0E] rounded-lg border border-[#1E232B]">
                <div className="w-5 h-5 rounded-full bg-[#0A2E5C] text-[#00AEEF] flex items-center justify-center font-mono font-bold text-xs shrink-0">
                  1
                </div>
                <div>
                  <strong className="text-white block font-grotesk">Paso 1: Arribo</strong>
                  <span className="text-slate-400 text-[11px]">
                    Clic en &quot;Marcar llegada&quot; registra el check-in con validación GPS.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 bg-[#0B0C0E] rounded-lg border border-[#1E232B]">
                <div className="w-5 h-5 rounded-full bg-[#0A2E5C] text-[#00AEEF] flex items-center justify-center font-mono font-bold text-xs shrink-0">
                  2
                </div>
                <div>
                  <strong className="text-white block font-grotesk">Paso 2: Material</strong>
                  <span className="text-slate-400 text-[11px]">
                    Clic en &quot;Escanear código&quot; simula la lectura de código de barras/QR de insumos.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 bg-[#0B0C0E] rounded-lg border border-[#1E232B]">
                <div className="w-5 h-5 rounded-full bg-[#0A2E5C] text-[#00AEEF] flex items-center justify-center font-mono font-bold text-xs shrink-0">
                  3
                </div>
                <div>
                  <strong className="text-white block font-grotesk">Paso 3: Cierre</strong>
                  <span className="text-slate-400 text-[11px]">
                    Captura de foto evidencia, firma digital y cierre final de la OT.
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#0A2E5C]/30 border border-[#00AEEF]/30 rounded-lg text-[11px] text-slate-300 font-mono">
              <span className="text-[#00AEEF] font-bold">✓ Nota técnica:</span> Simulación visual completa sin acceso a hardware real de cámara ni GPS.
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Mobile Component Frame */}
        <div className="w-full max-w-[420px]">
          <MobileFlow />
        </div>
      </main>
    </div>
  );
}
