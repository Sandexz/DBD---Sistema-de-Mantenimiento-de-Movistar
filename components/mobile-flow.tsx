"use client";

import React, { useState } from "react";
import {
  MapPin,
  QrCode,
  Camera,
  PenTool,
  CheckCircle2,
  HardHat,
  Clock,
  ArrowRight,
  RotateCcw,
  Wifi,
  Battery,
  Signal,
  Check,
  Package,
  FileCheck2,
  AlertCircle,
  Smartphone,
} from "lucide-react";
import { Button } from "./ui/button";

export function MobileFlow() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isLoading, setIsLoading] = useState(false);

  // Simulated state for step actions
  const [checkInDone, setCheckInDone] = useState(false);
  const [materialScanned, setMaterialScanned] = useState(false);
  const [evidenceCaptured, setEvidenceCaptured] = useState(false);
  const [signatureDone, setSignatureDone] = useState(false);
  const [otClosed, setOtClosed] = useState(false);

  // Step 1: Check-in Action
  const handleCheckIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCheckInDone(true);
      setTimeout(() => {
        setCurrentStep(2);
      }, 1000);
    }, 800);
  };

  // Step 2: Scan Material Action
  const handleScanCode = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMaterialScanned(true);
      setTimeout(() => {
        setCurrentStep(3);
      }, 1000);
    }, 800);
  };

  // Step 3: Evidencia
  const handleCaptureEvidence = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setEvidenceCaptured(true);
    }, 600);
  };

  // Step 3: Signature
  const handleGetSignature = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSignatureDone(true);
    }, 600);
  };

  // Step 3: Close OT
  const handleCloseOt = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtClosed(true);
      setCurrentStep(4); // Summary / Success
    }, 900);
  };

  const handleResetFlow = () => {
    setCurrentStep(1);
    setCheckInDone(false);
    setMaterialScanned(false);
    setEvidenceCaptured(false);
    setSignatureDone(false);
    setOtClosed(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Mobile Device Frame Mockup for testing and outdoor visual preview */}
      <div className="w-full max-w-[420px] bg-white text-slate-900 rounded-3xl shadow-2xl border-4 border-slate-700 overflow-hidden flex flex-col min-h-[720px] font-sans">
        {/* Mobile Status Bar (Theme: White/Outdoor) */}
        <div className="bg-slate-900 text-white px-5 py-2 flex items-center justify-between text-xs font-mono select-none">
          <span className="font-bold">14:32</span>
          <div className="flex items-center gap-2">
            <Signal className="w-3.5 h-3.5 text-white" />
            <Wifi className="w-3.5 h-3.5 text-white" />
            <span className="text-[10px]">98%</span>
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Mobile Header: SGMR Campo */}
        <div className="bg-[#0A2E5C] text-white px-4 py-3 border-b border-[#061D3A] flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-white/10 rounded">
              <HardHat className="w-4 h-4 text-[#00AEEF]" />
            </div>
            <div>
              <h1 className="text-sm font-bold font-grotesk tracking-wide leading-none">
                SGMR Móvil Campo
              </h1>
              <span className="text-[10px] text-slate-300 font-mono">
                Téc. Luis Ramos (Cuadrilla Alfa 01)
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-[#00AEEF] text-[#061D3A] px-2 py-0.5 rounded-full font-bold">
            4G OK
          </span>
        </div>

        {/* 3-Step Progress Indicator Bar (Required Specification) */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Step 1 */}
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${
                  currentStep > 1 || checkInDone
                    ? "bg-emerald-600 text-white"
                    : currentStep === 1
                    ? "bg-[#0A2E5C] text-white ring-2 ring-[#00AEEF]"
                    : "bg-slate-300 text-slate-600"
                }`}
              >
                {currentStep > 1 || checkInDone ? <Check className="w-4 h-4" /> : "1"}
              </div>
              <span className="text-[10px] font-bold mt-1 text-slate-700">
                1. Llegada
              </span>
            </div>

            <div
              className={`h-0.5 flex-1 mx-1 ${
                currentStep > 1 ? "bg-emerald-600" : "bg-slate-300"
              }`}
            />

            {/* Step 2 */}
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${
                  currentStep > 2 || materialScanned
                    ? "bg-emerald-600 text-white"
                    : currentStep === 2
                    ? "bg-[#0A2E5C] text-white ring-2 ring-[#00AEEF]"
                    : "bg-slate-300 text-slate-600"
                }`}
              >
                {currentStep > 2 || materialScanned ? <Check className="w-4 h-4" /> : "2"}
              </div>
              <span className="text-[10px] font-bold mt-1 text-slate-700">
                2. Material
              </span>
            </div>

            <div
              className={`h-0.5 flex-1 mx-1 ${
                currentStep > 2 ? "bg-emerald-600" : "bg-slate-300"
              }`}
            />

            {/* Step 3 */}
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${
                  otClosed
                    ? "bg-emerald-600 text-white"
                    : currentStep === 3
                    ? "bg-[#0A2E5C] text-white ring-2 ring-[#00AEEF]"
                    : "bg-slate-300 text-slate-600"
                }`}
              >
                {otClosed ? <Check className="w-4 h-4" /> : "3"}
              </div>
              <span className="text-[10px] font-bold mt-1 text-slate-700">
                3. Cierre
              </span>
            </div>
          </div>
        </div>

        {/* OT Context Card Info */}
        <div className="bg-slate-50 border-b border-slate-200 p-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-[#0A2E5C] text-sm">
              OT-2026-9041
            </span>
            <span className="bg-[#FF6A13] text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">
              CRITICIDAD ALTA
            </span>
          </div>
          <p className="text-slate-600 text-xs font-medium mt-1">
            Infraestructura: <strong className="text-slate-800">POP-03 / ODF Troncal 96FO</strong>
          </p>
          <p className="text-[11px] text-slate-500 font-mono">
            Ubicación: Av. Panamericana Km 18.5
          </p>
        </div>

        {/* Dynamic Step Content Container */}
        <div className="flex-1 p-4 flex flex-col justify-between space-y-4 bg-white">
          {/* ================= STEP 1: LLEGADA ================= */}
          {currentStep === 1 && (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-[#00AEEF] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-sm text-[#0A2E5C] font-grotesk">
                      Paso 1: Confirmación de Arribo
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Verifica que te encuentras a menos de 50 metros del nodo según el GPS simulado.
                    </p>
                  </div>
                </div>

                {/* Simulated GPS Status box */}
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between text-slate-600">
                    <span>GPS Telemetría:</span>
                    <span className="text-emerald-600 font-bold">PRECISIÓN ALTA (3m)</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Coordenadas:</span>
                    <span className="text-slate-800">-12.0463, -77.0427</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Distancia al POP:</span>
                    <span className="text-slate-800 font-bold">12 metros (En rango)</span>
                  </div>
                </div>

                {checkInDone && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-bold animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Check-in exitoso. Avanzando al Paso 2...</span>
                  </div>
                )}
              </div>

              {/* Step 1 Action Button */}
              <button
                type="button"
                onClick={handleCheckIn}
                disabled={isLoading || checkInDone}
                className="w-full py-3.5 px-4 bg-[#0A2E5C] hover:bg-[#144585] text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Registrando GPS...</span>
                ) : checkInDone ? (
                  <span>✓ Check-in Realizado</span>
                ) : (
                  <>
                    <MapPin className="w-4 h-4 text-[#00AEEF]" />
                    <span>Marcar llegada (Check-in)</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* ================= STEP 2: MATERIAL ================= */}
          {currentStep === 2 && (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-3">
                  <QrCode className="w-6 h-6 text-[#00AEEF] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-sm text-[#0A2E5C] font-grotesk">
                      Paso 2: Asignación de Material
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Escanea el código de barras/QR de los repuestos utilizados para descontar del stock de cuadrilla.
                    </p>
                  </div>
                </div>

                {/* Simulated Scanner viewfinder placeholder */}
                <div className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="w-20 h-20 border-2 border-[#00AEEF] rounded-lg relative flex items-center justify-center bg-white shadow-inner">
                    <div className="w-16 h-0.5 bg-[#FF6A13] animate-pulse" />
                    <Package className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-[11px] font-mono text-slate-500">
                    Cámara Scanner QR/Barcode (Simulación)
                  </p>
                </div>

                {materialScanned && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-bold animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p>Material asignado correctamente:</p>
                      <p className="font-mono text-[11px] font-normal text-emerald-700">
                        • Mufa 48FO 3M (SN: #MUF-9982)
                        <br />• Pigtail SC/APC x4 (Lote #L-204)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2 Action Button */}
              <button
                type="button"
                onClick={handleScanCode}
                disabled={isLoading || materialScanned}
                className="w-full py-3.5 px-4 bg-[#0A2E5C] hover:bg-[#144585] text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Leyendo código...</span>
                ) : materialScanned ? (
                  <span>✓ Material Registrado</span>
                ) : (
                  <>
                    <QrCode className="w-4 h-4 text-[#00AEEF]" />
                    <span>Escanear código de material</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* ================= STEP 3: EVIDENCIA, FIRMA & CIERRE ================= */}
          {currentStep === 3 && (
            <div className="space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-3">
                  <FileCheck2 className="w-6 h-6 text-[#00AEEF] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-sm text-[#0A2E5C] font-grotesk">
                      Paso 3: Evidencias y Cierre de OT
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Adjunta la foto de la mufa fusionada y la firma de conformidad del cliente/supervisor.
                    </p>
                  </div>
                </div>

                {/* Sub-action 1: Foto Evidencia */}
                <div className="border border-slate-200 rounded-xl p-2.5 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <Camera className="w-4 h-4 text-[#0A2E5C]" />
                    <span className="font-semibold text-slate-800">
                      Foto de Fusión OTDR
                    </span>
                  </div>
                  {evidenceCaptured ? (
                    <span className="text-xs font-bold text-emerald-600 font-mono flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> 1 Foto Lista
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCaptureEvidence}
                      className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-medium"
                    >
                      Capturar evidencia
                    </button>
                  )}
                </div>

                {/* Sub-action 2: Firma */}
                <div className="border border-slate-200 rounded-xl p-2.5 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <PenTool className="w-4 h-4 text-[#0A2E5C]" />
                    <span className="font-semibold text-slate-800">
                      Firma de Conformidad
                    </span>
                  </div>
                  {signatureDone ? (
                    <span className="text-xs font-bold text-emerald-600 font-mono flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Firmado
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleGetSignature}
                      className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-medium"
                    >
                      Obtener firma
                    </button>
                  )}
                </div>

                {/* Summary checklist */}
                <div className="p-2.5 bg-slate-100 rounded-xl text-[11px] font-mono text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Arribo validado:</span>
                    <span className="text-emerald-700 font-bold">SÍ (GPS)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Materiales descargados:</span>
                    <span className="text-emerald-700 font-bold">2 ÍTEMS</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SLA Cumplido:</span>
                    <span className="text-emerald-700 font-bold">1h 12m / 2h 00m</span>
                  </div>
                </div>
              </div>

              {/* Close OT Action Button */}
              <button
                type="button"
                onClick={handleCloseOt}
                disabled={isLoading || !evidenceCaptured || !signatureDone}
                className="w-full py-3.5 px-4 bg-[#FF6A13] hover:bg-[#E5590B] text-white font-bold rounded-xl shadow-lg shadow-[#FF6A13]/25 flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span>Sincronizando cierre con NOC...</span>
                ) : (
                  <>
                    <FileCheck2 className="w-4 h-4" />
                    <span>Cerrar OT #OT-2026-9041</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* ================= STEP 4: FINALIZADO / SUCCESS ================= */}
          {currentStep === 4 && (
            <div className="space-y-4 flex-1 flex flex-col items-center justify-center text-center p-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center animate-bounce">
                <Check className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0A2E5C] font-grotesk">
                  ¡Orden de Trabajo Cerrada!
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  El ticket ha sido liquidado en el sistema con SLA conforme.
                </p>
                <div className="mt-3 p-3 bg-slate-100 rounded-xl text-xs font-mono text-slate-700 text-left space-y-1">
                  <p>• Folio: OT-2026-9041</p>
                  <p>• Estado: CONFORME / LIQUIDADO</p>
                  <p>• Notificación enviada al NOC</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetFlow}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Simular nueva orden de campo</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Navigation Step Bar Buttons for Demonstration */}
        <div className="bg-slate-100 border-t border-slate-200 px-4 py-2 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as any) : 1))}
            disabled={currentStep === 1}
            className="text-slate-600 hover:text-slate-900 disabled:opacity-30 font-medium"
          >
            ← Paso Anterior
          </button>
          <span className="font-mono text-[11px] text-slate-500">
            Paso {Math.min(currentStep, 3)} de 3
          </span>
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => (prev < 3 ? ((prev + 1) as any) : 3))}
            disabled={currentStep >= 3}
            className="text-[#0A2E5C] hover:underline font-bold disabled:opacity-30"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );
}
