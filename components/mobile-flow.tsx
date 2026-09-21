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
  ShieldAlert,
  Sliders,
  CheckSquare,
} from "lucide-react";
import { Button } from "./ui/button";

export function MobileFlow() {
  // Pasos:
  // 1: Check-in GPS (< 50m)
  // 2: Papeleta ATS (Seguridad y Riesgos)
  // 3: Ejecución de Actividades (Preventivo / Correctivo)
  // 4: Descargo de Repuestos (Stock en camioneta)
  // 5: Cierre Transaccional (Foto + Firma)
  // 6: Resumen / Éxito
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [tipoOt, setTipoOt] = useState<"PREVENTIVO" | "CORRECTIVO">("PREVENTIVO");
  const [isLoading, setIsLoading] = useState(false);

  // Simulación de Distancia GPS (para probar validación de <50m vs >50m)
  const [distanciaMetros, setDistanciaMetros] = useState<number>(14);
  const isGpsValido = distanciaMetros <= 50;

  // Paso 2: ATS State
  const [atsForm, setAtsForm] = useState({
    arnes: true,
    casco: true,
    botas: true,
    guantes: true,
    climaApto: true,
    riesgoElectricoControlado: true,
  });
  const [atsCompletado, setAtsCompletado] = useState(false);

  // Paso 3: Actividades ejecutadas
  const [actividadesDone, setActividadesDone] = useState<Record<string, boolean>>({
    act1: false,
    act2: false,
    act3: false,
  });

  // Paso 4: Descargo de Repuestos
  const [simularSinStock, setSimularSinStock] = useState(false);
  const [materialScanned, setMaterialScanned] = useState(false);

  // Paso 5: Evidencia y Firma
  const [evidenceCaptured, setEvidenceCaptured] = useState(false);
  const [signatureDone, setSignatureDone] = useState(false);

  // ============ Handlers ============

  // Paso 1: Check-in
  const handleCheckIn = () => {
    if (!isGpsValido) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep(2); // Ir a ATS
    }, 600);
  };

  // Paso 2: ATS
  const handleConfirmAts = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAtsCompletado(true);
      setCurrentStep(3); // Ir a Ejecución
    }, 600);
  };

  // Paso 3: Ejecución
  const handleCompleteExecution = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep(4); // Ir a Descargo de Repuestos
    }, 600);
  };

  // Paso 4: Descargo de Repuestos
  const handleScanMaterial = () => {
    if (simularSinStock) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMaterialScanned(true);
      setTimeout(() => {
        setCurrentStep(5); // Ir a Cierre
      }, 700);
    }, 600);
  };

  // Paso 5: Cierre
  const handleCloseOt = () => {
    if (!evidenceCaptured || !signatureDone) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep(6); // Finalizado
    }, 800);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setDistanciaMetros(14);
    setAtsCompletado(false);
    setActividadesDone({ act1: false, act2: false, act3: false });
    setMaterialScanned(false);
    setEvidenceCaptured(false);
    setSignatureDone(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Marco de Dispositivo Móvil */}
      <div className="w-full max-w-[420px] bg-white text-slate-900 rounded-3xl shadow-2xl border-4 border-slate-700 overflow-hidden flex flex-col min-h-[740px] font-sans">
        {/* Status Bar */}
        <div className="bg-[#0B2742] text-white px-5 py-2 flex items-center justify-between text-xs font-mono select-none">
          <span className="font-bold">14:35</span>
          <div className="flex items-center gap-2">
            <Signal className="w-3.5 h-3.5 text-white" />
            <Wifi className="w-3.5 h-3.5 text-white" />
            <span className="text-[10px]">98%</span>
            <Battery className="w-4 h-4 text-[#5BC500]" />
          </div>
        </div>

        {/* Mobile Header: Movistar Campo */}
        <div className="bg-[#5BC500] text-white px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-white/20 rounded-lg">
              <HardHat className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold font-grotesk tracking-wide leading-none text-white">
                Movistar Móvil Campo
              </h1>
              <span className="text-[10px] text-white/90 font-mono">
                Cuadrilla Alfa 01 · Téc. Luis Ramos
              </span>
            </div>
          </div>

          {/* Toggle para cambiar tipo OT demostrativo */}
          <button
            onClick={() => setTipoOt(tipoOt === "PREVENTIVO" ? "CORRECTIVO" : "PREVENTIVO")}
            className="text-[9px] font-mono font-bold bg-white text-[#3F8500] px-2 py-1 rounded-full uppercase shadow-sm"
          >
            {tipoOt} ⇄
          </button>
        </div>

        {/* Barra de Progreso de 5 Pasos */}
        <div className="bg-slate-50 border-b border-slate-200 px-3 py-2.5">
          <div className="flex items-center justify-between text-center text-[9px] font-mono">
            {[
              { num: 1, label: "GPS" },
              { num: 2, label: "ATS" },
              { num: 3, label: "Tareas" },
              { num: 4, label: "Stock" },
              { num: 5, label: "Cierre" },
            ].map((st) => {
              const isPast = currentStep > st.num || currentStep === 6;
              const isCurrent = currentStep === st.num;

              return (
                <div key={st.num} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold transition-all ${
                      isPast
                        ? "bg-[#5BC500] text-white"
                        : isCurrent
                        ? "bg-[#0B2742] text-white ring-2 ring-[#5BC500]"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {isPast ? "✓" : st.num}
                  </div>
                  <span
                    className={`mt-0.5 ${
                      isCurrent ? "font-bold text-slate-900" : "text-slate-500"
                    }`}
                  >
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* OT Banner Contextual */}
        <div className="bg-slate-100 border-b border-slate-200 p-2.5 text-xs flex items-center justify-between">
          <div>
            <span className="font-mono font-bold text-slate-900">OT-2026-9041</span>
            <p className="text-[11px] text-slate-600 truncate max-w-[220px]">
              Activo: <strong>BTS-014 (San Cristóbal)</strong>
            </p>
          </div>
          <span
            className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
              tipoOt === "PREVENTIVO"
                ? "bg-[#F0F9E8] text-[#3F8500] border border-[#C6EE94]"
                : "bg-amber-100 text-amber-900 border border-amber-300"
            }`}
          >
            OT {tipoOt}
          </span>
        </div>

        {/* Contenido Dinámico según el Paso */}
        <div className="flex-1 p-4 flex flex-col justify-between bg-white overflow-y-auto">
          {/* ================= PASO 1: CHECK-IN GPS ================= */}
          {currentStep === 1 && (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="bg-[#E5F4FD] border border-[#B8E2FB] rounded-xl p-3 flex items-start gap-2.5">
                  <MapPin className="w-5 h-5 text-[#0070B8] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 font-grotesk">
                      Paso 1: Check-in por Proximidad GPS
                    </h3>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Validación activa: La distancia al nodo debe ser estrictamente menor a 50 metros.
                    </p>
                  </div>
                </div>

                {/* Telemetría GPS Box */}
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 text-xs font-mono space-y-1.5">
                  <div className="flex justify-between text-slate-600 text-[11px]">
                    <span>Ubicación Técnico (GPS):</span>
                    <span className="text-slate-900 font-bold">-12.0312, -77.0195</span>
                  </div>
                  <div className="flex justify-between text-slate-600 text-[11px]">
                    <span>Coordenadas del Activo:</span>
                    <span className="text-slate-900 font-bold">-12.0311, -77.0194</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                    <span className="text-slate-600">Distancia Calculada:</span>
                    <span
                      className={`font-bold text-sm ${
                        isGpsValido ? "text-[#3F8500]" : "text-rose-600"
                      }`}
                    >
                      {distanciaMetros} metros
                    </span>
                  </div>
                </div>

                {/* Resultado de Validación Activa */}
                {isGpsValido ? (
                  <div className="p-3 bg-[#F0F9E8] border border-[#C6EE94] rounded-xl flex items-center gap-2 text-[#3F8500] text-xs font-bold font-mono animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>✓ Check-in autorizado (En radio &lt; 50m)</span>
                  </div>
                ) : (
                  <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl flex items-center gap-2 text-rose-800 text-xs font-bold font-mono animate-in fade-in">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>✗ Check-in rechazado: Distancia &gt; 50 metros</span>
                  </div>
                )}

                {/* Simulador de Distancia para Demostración */}
                <div className="p-2.5 bg-slate-100 rounded-xl text-[11px] font-mono flex items-center justify-between">
                  <span className="text-slate-500">Simular Distancia:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setDistanciaMetros(14)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        distanciaMetros === 14
                          ? "bg-[#5BC500] text-white"
                          : "bg-white text-slate-700 border border-slate-300"
                      }`}
                    >
                      14m (En rango)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDistanciaMetros(85)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        distanciaMetros === 85
                          ? "bg-rose-600 text-white"
                          : "bg-white text-slate-700 border border-slate-300"
                      }`}
                    >
                      85m (Fuera)
                    </button>
                  </div>
                </div>
              </div>

              {/* Botón Acción Check-in */}
              <button
                type="button"
                onClick={handleCheckIn}
                disabled={!isGpsValido || isLoading}
                className="w-full py-3.5 px-4 bg-[#5BC500] hover:bg-[#489E00] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.99]"
              >
                {isLoading ? (
                  <span>Validando GPS con NOC...</span>
                ) : isGpsValido ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirmar Llegada (Check-in)</span>
                  </>
                ) : (
                  <span>Rechazado por distancia</span>
                )}
              </button>
            </div>
          )}

          {/* ================= PASO 2: PAPELETA ATS ================= */}
          {currentStep === 2 && (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="bg-[#E5F4FD] border border-[#B8E2FB] rounded-xl p-3 flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-[#0070B8] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 font-grotesk">
                      Paso 2: Papeleta de Trabajo Seguro (ATS)
                    </h3>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Validación obligatoria de EPP y riesgos en sitio antes de intervenir el nodo.
                    </p>
                  </div>
                </div>

                {/* Formulario ATS Checklist */}
                <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50 text-xs">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={atsForm.arnes}
                      onChange={(e) => setAtsForm({ ...atsForm, arnes: e.target.checked })}
                      className="w-4 h-4 rounded text-[#5BC500] focus:ring-[#5BC500]"
                    />
                    <span className="font-medium text-slate-800">
                      Arnés de seguridad y línea de vida verificado
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={atsForm.casco}
                      onChange={(e) => setAtsForm({ ...atsForm, casco: e.target.checked })}
                      className="w-4 h-4 rounded text-[#5BC500] focus:ring-[#5BC500]"
                    />
                    <span className="font-medium text-slate-800">
                      Casco dieléctrico con barbiquejo abrochado
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={atsForm.guantes}
                      onChange={(e) => setAtsForm({ ...atsForm, guantes: e.target.checked })}
                      className="w-4 h-4 rounded text-[#5BC500] focus:ring-[#5BC500]"
                    />
                    <span className="font-medium text-slate-800">
                      Guantes de protección mecánica y dieléctrica
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={atsForm.climaApto}
                      onChange={(e) => setAtsForm({ ...atsForm, climaApto: e.target.checked })}
                      className="w-4 h-4 rounded text-[#5BC500] focus:ring-[#5BC500]"
                    />
                    <span className="font-medium text-slate-800">
                      Condición climática apta (sin lluvia ni tormenta)
                    </span>
                  </label>
                </div>

                <div className="p-2.5 bg-[#F0F9E8] border border-[#C6EE94] rounded-xl text-[11px] font-mono text-[#3F8500]">
                  <span>✓ Habilitación SST líder: Ing. Luis Ramos (Autorizado)</span>
                </div>
              </div>

              {/* Botón Confirmar ATS */}
              <button
                type="button"
                onClick={handleConfirmAts}
                disabled={!atsForm.arnes || !atsForm.casco || isLoading}
                className="w-full py-3.5 px-4 bg-[#5BC500] hover:bg-[#489E00] text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all"
              >
                {isLoading ? (
                  <span>Registrando ATS en sistema...</span>
                ) : (
                  <>
                    <FileCheck2 className="w-4 h-4" />
                    <span>Aprobar ATS y Continuar</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* ================= PASO 3: EJECUCIÓN DE TAREAS ================= */}
          {currentStep === 3 && (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="bg-[#E5F4FD] border border-[#B8E2FB] rounded-xl p-3 flex items-start gap-2.5">
                  <WrenchIcon className="w-5 h-5 text-[#0070B8] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 font-grotesk">
                      Paso 3: Ejecución de Tareas ({tipoOt})
                    </h3>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {tipoOt === "PREVENTIVO"
                        ? "Actividades de inspección, calibración y pruebas de vida útil."
                        : "Actividades de reparación, sangrado y fusión de fibra óptica."}
                    </p>
                  </div>
                </div>

                {/* Lista de Tareas según Preventivo o Correctivo */}
                <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50 text-xs font-mono">
                  {tipoOt === "PREVENTIVO" ? (
                    <>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={actividadesDone.act1}
                          onChange={(e) =>
                            setActividadesDone({ ...actividadesDone, act1: e.target.checked })
                          }
                          className="w-4 h-4 rounded text-[#5BC500]"
                        />
                        <span className="text-slate-800">
                          1. Inspección visual y limpieza con alcohol isopropílico
                        </span>
                      </label>

                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={actividadesDone.act2}
                          onChange={(e) =>
                            setActividadesDone({ ...actividadesDone, act2: e.target.checked })
                          }
                          className="w-4 h-4 rounded text-[#5BC500]"
                        />
                        <span className="text-slate-800">
                          2. Medición de potencia óptica OTDR (-19.2 dBm OK)
                        </span>
                      </label>

                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={actividadesDone.act3}
                          onChange={(e) =>
                            setActividadesDone({ ...actividadesDone, act3: e.target.checked })
                          }
                          className="w-4 h-4 rounded text-[#5BC500]"
                        />
                        <span className="text-slate-800">
                          3. Prueba de banco de baterías de respaldo
                        </span>
                      </label>
                    </>
                  ) : (
                    <>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={actividadesDone.act1}
                          onChange={(e) =>
                            setActividadesDone({ ...actividadesDone, act1: e.target.checked })
                          }
                          className="w-4 h-4 rounded text-[#5BC500]"
                        />
                        <span className="text-slate-800">
                          1. Sangrado y desenvainado de cable troncal 48FO
                        </span>
                      </label>

                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={actividadesDone.act2}
                          onChange={(e) =>
                            setActividadesDone({ ...actividadesDone, act2: e.target.checked })
                          }
                          className="w-4 h-4 rounded text-[#5BC500]"
                        />
                        <span className="text-slate-800">
                          2. Fusión por arco eléctrico (Atenuación &lt; 0.02 dB)
                        </span>
                      </label>

                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={actividadesDone.act3}
                          onChange={(e) =>
                            setActividadesDone({ ...actividadesDone, act3: e.target.checked })
                          }
                          className="w-4 h-4 rounded text-[#5BC500]"
                        />
                        <span className="text-slate-800">
                          3. Sellado hermético de mufa domo IP68
                        </span>
                      </label>
                    </>
                  )}
                </div>
              </div>

              {/* Botón Continuar a Repuestos */}
              <button
                type="button"
                onClick={handleCompleteExecution}
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-[#5BC500] hover:bg-[#489E00] text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all"
              >
                {isLoading ? (
                  <span>Registrando avances...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Completar Tareas y Descargar Material</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* ================= PASO 4: DESCARGO DE REPUESTOS ================= */}
          {currentStep === 4 && (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="bg-[#E5F4FD] border border-[#B8E2FB] rounded-xl p-3 flex items-start gap-2.5">
                  <QrCode className="w-5 h-5 text-[#0070B8] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 font-grotesk">
                      Paso 4: Descargo de Repuestos (Escáner)
                    </h3>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Verificación en tiempo real del stock asignado a la camioneta del técnico.
                    </p>
                  </div>
                </div>

                {/* Viewfinder Simulado */}
                <div className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="w-16 h-16 border-2 border-[#5BC500] rounded-xl relative flex items-center justify-center bg-white shadow-inner">
                    <Package className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-[11px] font-mono text-slate-600">
                    Material a descargar: <strong>Mufa 48FO Domo 3M (#MUF-9982)</strong>
                  </p>
                </div>

                {/* Control de Stock Disponible vs Insuficiente */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">Stock en Camioneta:</span>
                    <strong className={simularSinStock ? "text-rose-600" : "text-[#3F8500]"}>
                      {simularSinStock ? "0 unidades (Agotado)" : "2 unidades (Disponible)"}
                    </strong>
                  </div>

                  {/* Estado de validación */}
                  {!simularSinStock ? (
                    <div className="text-[#3F8500] font-bold text-[11px] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Stock disponible para descargo</span>
                    </div>
                  ) : (
                    <div className="text-rose-600 font-bold text-[11px] flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" />
                      <span>Stock insuficiente en móvil de cuadrilla</span>
                    </div>
                  )}

                  {/* Toggle para pruebas */}
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Simular prueba:</span>
                    <button
                      type="button"
                      onClick={() => setSimularSinStock(!simularSinStock)}
                      className="px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                    >
                      {simularSinStock ? "Probar con stock" : "Probar sin stock"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Botón Escanear */}
              <button
                type="button"
                onClick={handleScanMaterial}
                disabled={simularSinStock || isLoading}
                className="w-full py-3.5 px-4 bg-[#5BC500] hover:bg-[#489E00] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all"
              >
                {isLoading ? (
                  <span>Descontando de stock...</span>
                ) : !simularSinStock ? (
                  <>
                    <QrCode className="w-4 h-4" />
                    <span>Escanear y Descargar Insumo</span>
                  </>
                ) : (
                  <span>Bloqueado por falta de stock</span>
                )}
              </button>
            </div>
          )}

          {/* ================= PASO 5: CIERRE TRANSACCIONAL ================= */}
          {currentStep === 5 && (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="bg-[#E5F4FD] border border-[#B8E2FB] rounded-xl p-3 flex items-start gap-2.5">
                  <FileCheck2 className="w-5 h-5 text-[#0070B8] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 font-grotesk">
                      Paso 5: Cierre Transaccional de OT
                    </h3>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Validación obligatoria: Exige fotografía técnica de evidencia y firma de conformidad.
                    </p>
                  </div>
                </div>

                {/* Sub-acción 1: Fotografía Técnica */}
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-slate-700" />
                    <div>
                      <span className="font-bold text-slate-800 block">Fotografía de Evidencia</span>
                      <span className="text-[10px] text-slate-400 font-mono">Fusión OTDR / Termografía</span>
                    </div>
                  </div>
                  {evidenceCaptured ? (
                    <span className="text-xs font-bold text-[#3F8500] font-mono flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> 1 Foto Lista
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEvidenceCaptured(true)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-lg text-xs font-semibold"
                    >
                      Capturar Foto
                    </button>
                  )}
                </div>

                {/* Sub-acción 2: Firma de Conformidad */}
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <PenTool className="w-4 h-4 text-slate-700" />
                    <div>
                      <span className="font-bold text-slate-800 block">Firma de Conformidad</span>
                      <span className="text-[10px] text-slate-400 font-mono">Supervisor / Cliente Movistar</span>
                    </div>
                  </div>
                  {signatureDone ? (
                    <span className="text-xs font-bold text-[#3F8500] font-mono flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Firmado OK
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSignatureDone(true)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-lg text-xs font-semibold"
                    >
                      Firmar
                    </button>
                  )}
                </div>
              </div>

              {/* Botón Cierre Transaccional */}
              <button
                type="button"
                onClick={handleCloseOt}
                disabled={!evidenceCaptured || !signatureDone || isLoading}
                className="w-full py-3.5 px-4 bg-[#5BC500] hover:bg-[#489E00] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all"
              >
                {isLoading ? (
                  <span>Sincronizando liquidación con NOC...</span>
                ) : (
                  <>
                    <FileCheck2 className="w-4 h-4" />
                    <span>Cerrar OT Transaccionalmente</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* ================= PASO 6: ÉXITO / FINALIZADO ================= */}
          {currentStep === 6 && (
            <div className="space-y-4 flex-1 flex flex-col items-center justify-center text-center p-4">
              <div className="w-16 h-16 rounded-full bg-[#F0F9E8] border-2 border-[#5BC500] text-[#3F8500] flex items-center justify-center animate-bounce">
                <Check className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-grotesk">
                  ¡OT cerrada correctamente!
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  La orden ha sido liquidada en el sistema central con validaciones cumplidas.
                </p>

                <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 text-left space-y-1">
                  <p>• Folio: OT-2026-9041</p>
                  <p>• Tipo: {tipoOt}</p>
                  <p>• Activo: BTS-014 (San Cristóbal)</p>
                  <p>• Estado: CERRADA / CONFORME</p>
                  <p>• Constancia de Conformidad generada</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="w-full py-2.5 px-4 bg-[#0B2742] hover:bg-[#144585] text-white font-medium rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#5BC500]" />
                <span>Simular nueva intervención</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WrenchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}
