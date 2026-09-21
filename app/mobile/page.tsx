"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ClipboardList,
  Sun,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MobileFlow } from "@/components/mobile-flow";

export default function MobilePage() {
  return (
    <div className="min-h-screen bg-[#0B0C0E] text-slate-100 flex flex-col font-sans">
      {/* Top Bar for Simulator Context & Navigation Back to Movistar NOC */}
      <header className="bg-[#0B2742] border-b border-[#019DF4]/30 px-4 py-3 sticky top-0 z-40 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/batch"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-[#061625] px-3 py-1.5 rounded-lg border border-white/15 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#019DF4]" />
              <span>Módulo Batch</span>
            </Link>

            <Link
              href="/ots"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-2.5 py-1 rounded-lg hover:bg-[#123960] transition-colors"
            >
              <ClipboardList className="w-3.5 h-3.5 text-[#019DF4]" />
              <span>Gestión OTs</span>
            </Link>

            <div className="hidden md:block pl-2 border-l border-white/15">
              <h1 className="text-sm font-bold text-white font-grotesk flex items-center gap-2">
                <span>App Móvil Técnica de Campo</span>
                <span className="text-[10px] bg-[#019DF4]/20 text-[#019DF4] px-2 py-0.5 rounded-full font-mono font-normal">
                  Asignada a Diego Quispe
                </span>
              </h1>
              <p className="text-[11px] text-slate-300">
                Simulador interactivo de cuadrilla para exteriores · Movistar Perú
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/operativo/mobile"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-white bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 transition-colors"
            >
              <span>Vista en Módulo Operativo</span>
            </Link>
            <div className="flex items-center gap-1.5 bg-[#061625] border border-[#00A86B]/40 px-2.5 py-1 rounded-lg text-xs font-mono text-[#00A86B]">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Alto Contraste (#FFFFFF)</span>
              <span className="sm:hidden">Luz Solar</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-center gap-8 max-w-6xl mx-auto w-full">
        {/* Left Side: Field Explanatory Info Card (for reviewers) */}
        <div className="w-full lg:w-96 space-y-4 text-xs">
          <div className="bg-[#121418] border border-[#1E232B] rounded-2xl p-5 space-y-4 shadow-card-dark">
            <div className="flex items-center justify-between border-b border-[#1E232B] pb-3">
              <div className="flex items-center gap-2 text-[#019DF4]">
                <Smartphone className="w-5 h-5" />
                <h2 className="text-sm font-bold text-white font-grotesk">
                  Flujo de 4 Pasos de Campo
                </h2>
              </div>
              <span className="text-[10px] font-mono bg-[#00A86B]/20 text-[#00A86B] font-bold px-2 py-0.5 rounded-full">
                OT #89421
              </span>
            </div>

            <p className="text-slate-300 leading-relaxed font-sans">
              Simulación de la aplicación técnica para técnicos en sitio bajo condiciones de luz solar directa. Permite validar llegada GPS, escanear materiales por QR, adjuntar evidencia fotográfica y capturar la firma digital en lienzo.
            </p>

            <div className="space-y-2.5 font-sans pt-1">
              <div className="flex items-start gap-2.5 p-2.5 bg-[#0B0C0E] rounded-xl border border-[#1E232B]">
                <div className="w-6 h-6 rounded-full bg-[#0B2742] text-[#019DF4] flex items-center justify-center font-mono font-bold text-xs shrink-0 border border-[#019DF4]/30">
                  1
                </div>
                <div>
                  <strong className="text-white block font-grotesk">Paso 1: Llegada GPS</strong>
                  <span className="text-slate-400 text-[11px]">
                    Validación satelital en rango a 12m del Nodo <code className="text-[#019DF4]">NOD-CARABAYLLO-04</code>.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 bg-[#0B0C0E] rounded-xl border border-[#1E232B]">
                <div className="w-6 h-6 rounded-full bg-[#0B2742] text-[#019DF4] flex items-center justify-center font-mono font-bold text-xs shrink-0 border border-[#019DF4]/30">
                  2
                </div>
                <div>
                  <strong className="text-white block font-grotesk">Paso 2: Materiales & Repuestos</strong>
                  <span className="text-slate-400 text-[11px]">
                    Visor de escáner láser QR que descuenta Mufa 24h y Cable Drop FTTH de la camioneta.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 bg-[#0B0C0E] rounded-xl border border-[#1E232B]">
                <div className="w-6 h-6 rounded-full bg-[#0B2742] text-[#019DF4] flex items-center justify-center font-mono font-bold text-xs shrink-0 border border-[#019DF4]/30">
                  3
                </div>
                <div>
                  <strong className="text-white block font-grotesk">Paso 3: Cierre & Evidencia</strong>
                  <span className="text-slate-400 text-[11px]">
                    Subida de traza óptica OTDR y firma digital dibujable a mano alzada en lienzo.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 bg-[#0B0C0E] rounded-xl border border-[#1E232B]">
                <div className="w-6 h-6 rounded-full bg-[#0B2742] text-[#00A86B] flex items-center justify-center font-mono font-bold text-xs shrink-0 border border-[#00A86B]/30">
                  4
                </div>
                <div>
                  <strong className="text-white block font-grotesk">Paso 4: Éxito / Conforme</strong>
                  <span className="text-slate-400 text-[11px]">
                    Cierre final con métrica de atención de 34 min y reinicio de simulación.
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#0B2742]/40 border border-[#019DF4]/30 rounded-xl text-[11px] text-slate-300 font-mono">
              <span className="text-[#019DF4] font-bold">✓ Identidad Movistar:</span> Formato smartphone centrado con fondo blanco puro <code className="text-white font-bold">#FFFFFF</code> de alto contraste.
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Mobile Smartphone Frame */}
        <div className="w-full max-w-[420px] flex justify-center">
          <MobileFlow />
        </div>
      </main>
    </div>
  );
}
