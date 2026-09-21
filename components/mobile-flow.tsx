"use client";

import React, { useState, useRef, useEffect } from "react";
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
  Navigation,
  Sparkles,
  Zap,
  Trash2,
  Maximize2,
  ScanLine,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

export function MobileFlow() {
  // Pasos del flujo de campo:
  // 1: Llegada & Check-in GPS (< 50m)
  // 2: Verificación de Materiales & Escáner QR
  // 3: Cierre, Evidencia OTDR y Firma Digital en Lienzo
  // 4: Resumen / Éxito
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isLoading, setIsLoading] = useState(false);

  // Paso 1: GPS Arribo
  const [distanciaMetros, setDistanciaMetros] = useState<number>(12);
  const isGpsValido = distanciaMetros <= 50;
  const [gpsConfirmed, setGpsConfirmed] = useState(false);
  const [checkInTime, setCheckInTime] = useState("09:42:15");

  // Paso 2: Materiales escaneados
  const [scannedItems, setScannedItems] = useState<
    Array<{ id: string; name: string; sn: string; category: string }>
  >([]);
  const [isScanningActive, setIsScanningActive] = useState(false);

  // Paso 3: Evidencia y Firma
  const [evidencePhoto, setEvidencePhoto] = useState<boolean>(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [signerName, setSignerName] = useState("Ing. Roberto Mendoza (Supervisor Planta)");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize Canvas for Signature
  useEffect(() => {
    if (currentStep === 3 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = "#0B2742";
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    }
  }, [currentStep]);

  // Handle Canvas Drawing (Mouse & Touch)
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#0B2742";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleAutoSign = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#0B2742";
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(25, 45);
    ctx.bezierCurveTo(45, 15, 65, 60, 95, 25);
    ctx.bezierCurveTo(120, 10, 135, 55, 170, 35);
    ctx.lineTo(240, 45);
    ctx.moveTo(110, 50);
    ctx.lineTo(210, 50);
    ctx.stroke();

    setHasSignature(true);
  };

  // Step 1: Confirmar Arribo al Sitio
  const handleConfirmArrival = () => {
    if (!isGpsValido) return;
    setIsLoading(true);
    const now = new Date();
    setCheckInTime(
      now.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    );
    setTimeout(() => {
      setIsLoading(false);
      setGpsConfirmed(true);
      setTimeout(() => {
        setCurrentStep(2);
      }, 700);
    }, 600);
  };

  // Step 2: Escanear Repuesto
  const availableItemsToScan = [
    {
      id: "REP-01",
      name: "Mufa Óptica 24 hilos",
      sn: "SN: M-9921",
      category: "Fibra Óptica FTTH",
    },
    {
      id: "REP-02",
      name: "10m Cable Drop FTTH",
      sn: "Lote #DP-4402",
      category: "Conectividad Planta Externa",
    },
    {
      id: "REP-03",
      name: "Conector Rápido SC/APC (x2)",
      sn: "SN: CN-8812",
      category: "Accesorios de Terminación",
    },
  ];

  const handleScanRepuesto = () => {
    setIsScanningActive(true);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsScanningActive(false);

      if (scannedItems.length === 0) {
        setScannedItems([availableItemsToScan[0]]);
      } else if (scannedItems.length === 1) {
        setScannedItems([availableItemsToScan[0], availableItemsToScan[1]]);
      } else if (scannedItems.length === 2) {
        setScannedItems(availableItemsToScan);
      }
    }, 700);
  };

  // Step 3: Simular Foto OTDR
  const handleSimulatePhoto = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setEvidencePhoto(true);
    }, 500);
  };

  // Step 3: Cerrar y Despachar OT
  const handleCloseAndDispatch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep(4);
    }, 800);
  };

  // Step 4: Reiniciar Simulación
  const handleReset = () => {
    setCurrentStep(1);
    setDistanciaMetros(12);
    setGpsConfirmed(false);
    setCheckInTime("09:42:15");
    setScannedItems([]);
    setEvidencePhoto(false);
    setHasSignature(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Smartphone Outer Shell */}
      <div className="w-full max-w-[420px] bg-white rounded-[40px] shadow-2xl border-[8px] border-[#0B2742] overflow-hidden flex flex-col min-h-[760px] font-sans relative ring-1 ring-black/10">
        {/* Mobile Top Speaker & Camera Notch */}
        <div className="bg-[#0B2742] text-white px-6 pt-3 pb-2 flex items-center justify-between text-xs font-mono select-none">
          <span className="font-bold tracking-tight text-slate-100">09:41</span>
          {/* Hardware Dynamic Island Notch */}
          <div className="w-20 h-3.5 bg-black/70 rounded-full flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#019DF4]/60" />
            <span className="w-2 h-2 rounded-full bg-slate-800" />
          </div>
          <div className="flex items-center gap-2">
            <Signal className="w-3.5 h-3.5 text-[#019DF4]" />
            <Wifi className="w-3.5 h-3.5 text-white" />
            <Battery className="w-4 h-4 text-[#00A86B]" />
          </div>
        </div>

        {/* Encabezado Corporativo Movistar Campo */}
        <div className="bg-[#0B2742] text-white px-5 py-3 border-b border-[#019DF4]/30 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#019DF4] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                M
              </div>
              <div>
                <h1 className="text-sm font-bold font-grotesk tracking-wide leading-tight text-white">
                  Movistar Campo - OT #89421
                </h1>
                <p className="text-[10px] text-slate-300 font-mono">
                  Cuadrilla Alfa 01 · Téc. Diego Quispe
                </p>
              </div>
            </div>

            {/* Badge de Estado: EN PROGRESO */}
            <span className="inline-flex items-center gap-1.5 bg-[#019DF4]/20 border border-[#019DF4] text-[#019DF4] px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#019DF4] animate-pulse" />
              EN PROGRESO
            </span>
          </div>
        </div>

        {/* Barra de Progreso de 4 Pasos */}
        <div className="bg-[#F4F6F9] border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center flex-1 z-10">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${
                  currentStep > 1 || gpsConfirmed
                    ? "bg-[#00A86B] text-white shadow-sm"
                    : currentStep === 1
                    ? "bg-[#0B2742] text-white ring-2 ring-[#019DF4]"
                    : "bg-slate-300 text-slate-600"
                }`}
              >
                {currentStep > 1 || gpsConfirmed ? (
                  <Check className="w-4 h-4" />
                ) : (
                  "1"
                )}
              </div>
              <span className="text-[9px] font-bold mt-1 text-slate-700">
                1. Llegada
              </span>
            </div>

            <div
              className={`h-0.5 flex-1 mx-0.5 -mt-3 transition-colors ${
                currentStep > 1 ? "bg-[#00A86B]" : "bg-slate-300"
              }`}
            />

            {/* Step 2 */}
            <div className="flex flex-col items-center flex-1 z-10">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${
                  currentStep > 2 || scannedItems.length >= 2
                    ? "bg-[#00A86B] text-white shadow-sm"
                    : currentStep === 2
                    ? "bg-[#0B2742] text-white ring-2 ring-[#019DF4]"
                    : "bg-slate-300 text-slate-600"
                }`}
              >
                {currentStep > 2 || scannedItems.length >= 2 ? (
                  <Check className="w-4 h-4" />
                ) : (
                  "2"
                )}
              </div>
              <span className="text-[9px] font-bold mt-1 text-slate-700">
                2. Material
              </span>
            </div>

            <div
              className={`h-0.5 flex-1 mx-0.5 -mt-3 transition-colors ${
                currentStep > 2 ? "bg-[#00A86B]" : "bg-slate-300"
              }`}
            />

            {/* Step 3 */}
            <div className="flex flex-col items-center flex-1 z-10">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${
                  currentStep > 3
                    ? "bg-[#00A86B] text-white shadow-sm"
                    : currentStep === 3
                    ? "bg-[#0B2742] text-white ring-2 ring-[#019DF4]"
                    : "bg-slate-300 text-slate-600"
                }`}
              >
                {currentStep > 3 ? <Check className="w-4 h-4" /> : "3"}
              </div>
              <span className="text-[9px] font-bold mt-1 text-slate-700">
                3. Cierre
              </span>
            </div>

            <div
              className={`h-0.5 flex-1 mx-0.5 -mt-3 transition-colors ${
                currentStep === 4 ? "bg-[#00A86B]" : "bg-slate-300"
              }`}
            />

            {/* Step 4 */}
            <div className="flex flex-col items-center flex-1 z-10">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${
                  currentStep === 4
                    ? "bg-[#00A86B] text-white ring-2 ring-[#00A86B]/40 shadow-sm"
                    : "bg-slate-300 text-slate-600"
                }`}
              >
                {currentStep === 4 ? <Check className="w-4 h-4" /> : "4"}
              </div>
              <span className="text-[9px] font-bold mt-1 text-slate-700">
                4. Éxito
              </span>
            </div>
          </div>
        </div>

        {/* Sub-header de Orden (Fondo blanco de alto contraste) */}
        <div className="bg-white border-b border-slate-100 p-3.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-[#0B2742] text-sm">
              OT #89421 — FTTH / HFC
            </span>
            <span className="bg-[#019DF4]/10 text-[#019DF4] border border-[#019DF4]/40 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
              SLA: 120 MIN
            </span>
          </div>
          <p className="text-slate-600 text-xs mt-1">
            Destino: <strong className="text-[#0B2742]">Nodo NOD-CARABAYLLO-04</strong>
          </p>
          <p className="text-[11px] text-slate-500 font-mono">
            Ubicación: Av. Túpac Amaru Km 21.5 · Carabayllo, Lima
          </p>
        </div>

        {/* Dynamic Step Content Container (White Background #FFFFFF) */}
        <div className="flex-1 p-4 flex flex-col justify-between space-y-4 bg-white text-slate-800">
          {/* =========================================================================
              PASO 1: LLEGADA GPS
          ========================================================================= */}
          {currentStep === 1 && (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                {/* Simulated GPS Map */}
                <div className="relative w-full h-48 bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                  {/* Vectorial Map Background */}
                  <svg
                    className="w-full h-full opacity-60"
                    viewBox="0 0 400 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Street Grids */}
                    <path
                      d="M0 40 H400 M0 100 H400 M0 160 H400"
                      stroke="#1E3A5F"
                      strokeWidth="2"
                    />
                    <path
                      d="M60 0 V200 M160 0 V200 M260 0 V200 M360 0 V200"
                      stroke="#1E3A5F"
                      strokeWidth="2"
                    />
                    {/* Diagonal Avenue */}
                    <path
                      d="M-20 180 L280 20 L420 80"
                      stroke="#019DF4"
                      strokeWidth="3"
                      strokeDasharray="6 4"
                    />
                    {/* Concentric GPS Radar Rings */}
                    <circle
                      cx="210"
                      cy="95"
                      r="45"
                      stroke="#00A86B"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <circle
                      cx="210"
                      cy="95"
                      r="25"
                      stroke="#00A86B"
                      strokeWidth="1.5"
                    />
                  </svg>

                  {/* Target Node Pin (NOD-CARABAYLLO-04) */}
                  <div className="absolute top-[80px] left-[195px] flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#0B2742] border-2 border-[#019DF4] flex items-center justify-center text-white shadow-lg animate-pulse">
                      <MapPin className="w-4 h-4 text-[#019DF4]" />
                    </div>
                    <span className="text-[9px] font-bold font-mono bg-[#0B2742] text-white px-2 py-0.5 rounded shadow mt-0.5 whitespace-nowrap">
                      NOD-CARABAYLLO-04
                    </span>
                  </div>

                  {/* Technician Location Pin */}
                  <div className="absolute top-[105px] left-[165px] flex items-center gap-1 bg-[#00A86B] text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>Técnico (Tú)</span>
                  </div>

                  {/* Telemetry HUD Badge */}
                  <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-slate-200 border border-white/10">
                    <span className="text-[#019DF4] font-bold">WGS-84:</span> -11.8542, -77.0345
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-[#0B2742]/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-white">
                    Distancia: <span className="text-[#00A86B] font-bold">{distanciaMetros} m</span>
                  </div>
                </div>

                {/* Alerta Verde de Validación */}
                {isGpsValido ? (
                  <div className="p-3 bg-[#E6F6F0] border-2 border-[#00A86B] rounded-2xl flex items-start gap-2.5 text-[#00A86B] shadow-sm animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 text-[#00A86B] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold font-grotesk text-[#00A86B]">
                        ✓ GPS Validado: Estás a {distanciaMetros} metros del Nodo NOD-CARABAYLLO-04
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Coordenadas satelitales en rango de tolerancia (&lt; 50m). Autorizado para iniciar trabajos.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-start gap-2.5 text-rose-800 shadow-sm animate-in fade-in">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold font-grotesk text-rose-700">
                        ✗ Fuera de rango GPS ({distanciaMetros}m)
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Debes acercarte a menos de 50 metros del nodo para realizar el check-in.
                      </p>
                    </div>
                  </div>
                )}

                {/* Info Card */}
                <div className="p-3 bg-[#F4F6F9] rounded-xl border border-slate-200 text-xs font-mono space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Precisión del Dispositivo:</span>
                    <span className="text-[#00A86B] font-bold">ALTA (±2.8m)</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Hora Check-in:</span>
                    <span className="text-slate-800 font-bold" suppressHydrationWarning>{checkInTime}</span>
                  </div>
                </div>

                {/* Simulador de Distancia */}
                <div className="p-2 bg-slate-100 rounded-xl text-[10px] font-mono flex items-center justify-between">
                  <span className="text-slate-500">Prueba GPS:</span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setDistanciaMetros(12)}
                      className={`px-2 py-0.5 rounded font-bold ${
                        distanciaMetros === 12
                          ? "bg-[#00A86B] text-white"
                          : "bg-white text-slate-700 border"
                      }`}
                    >
                      12m (En Rango)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDistanciaMetros(80)}
                      className={`px-2 py-0.5 rounded font-bold ${
                        distanciaMetros === 80
                          ? "bg-rose-600 text-white"
                          : "bg-white text-slate-700 border"
                      }`}
                    >
                      80m (Fuera)
                    </button>
                  </div>
                </div>
              </div>

              {/* Botón Interactivo: Confirmar Arribo al Sitio */}
              <button
                type="button"
                onClick={handleConfirmArrival}
                disabled={isLoading || !isGpsValido || gpsConfirmed}
                className="w-full py-3.5 px-4 bg-[#0B2742] hover:bg-[#061625] text-white font-bold rounded-2xl shadow-lg shadow-[#0B2742]/20 flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span>Registrando coordenadas en NOC...</span>
                ) : gpsConfirmed ? (
                  <span className="flex items-center gap-1.5 text-white">
                    <Check className="w-4 h-4 text-[#00A86B]" /> Arribo Confirmado
                  </span>
                ) : (
                  <>
                    <Navigation className="w-4 h-4 text-[#019DF4]" />
                    <span>Confirmar Arribo al Sitio</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* =========================================================================
              PASO 2: MATERIALES Y REPUESTOS
          ========================================================================= */}
          {currentStep === 2 && (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                {/* Recuadro simulador de escáner QR/Código de Barras con animación */}
                <div className="border-2 border-slate-300 bg-slate-900 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden h-48 shadow-inner">
                  {/* Visor de Cámara con esquinas */}
                  <div className="w-36 h-36 border-2 border-[#019DF4] rounded-xl relative flex items-center justify-center bg-black/40">
                    {/* Animated Scanning Laser Beam */}
                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#019DF4] to-transparent shadow-[0_0_12px_#019DF4] animate-scan-beam" />

                    {/* Viewfinder Target Icon */}
                    <QrCode className="w-16 h-16 text-white/50" />

                    {/* Viewfinder Corner Brackets */}
                    <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-white" />
                    <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-white" />
                    <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-white" />
                    <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-white" />
                  </div>

                  <p className="text-[11px] font-mono text-slate-300 mt-2 flex items-center gap-1.5">
                    <ScanLine className="w-3.5 h-3.5 text-[#019DF4] animate-pulse" />
                    <span>Apunta la cámara al código de barras o QR</span>
                  </p>
                </div>

                {/* Botón "Escanear Repuesto" */}
                <button
                  type="button"
                  onClick={handleScanRepuesto}
                  disabled={isLoading || scannedItems.length >= 3}
                  className="w-full py-2.5 px-4 bg-[#019DF4] hover:bg-[#0081CB] text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-xs transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>
                    {isLoading
                      ? "Procesando código de barras..."
                      : scannedItems.length === 0
                      ? "Escanear Repuesto (Mufa Óptica 24 hilos)"
                      : scannedItems.length === 1
                      ? "Escanear Siguiente Repuesto (Cable Drop)"
                      : "Escanear Repuesto Adicional"}
                  </span>
                </button>

                {/* Lista de Repuestos Escaneados */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 block font-bold">
                    Materiales Escaneados ({scannedItems.length}):
                  </span>

                  {scannedItems.length === 0 ? (
                    <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-400">
                      Ningún repuesto escaneado aún. Pulsa el botón superior para registrar.
                    </div>
                  ) : (
                    scannedItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-[#F4F6F9] border border-slate-200 rounded-xl flex items-center justify-between text-xs animate-in fade-in"
                      >
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-[#019DF4]" />
                          <div>
                            <p className="font-bold text-[#0B2742]">{item.name}</p>
                            <p className="text-[10px] font-mono text-slate-500">
                              {item.sn} · {item.category}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-[#00A86B] bg-[#E6F6F0] px-2 py-0.5 rounded-full">
                          ✓ OK
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Alerta Verde de Validación de Stock */}
                {scannedItems.length > 0 && (
                  <div className="p-2.5 bg-[#E6F6F0] border border-[#00A86B] rounded-xl flex items-center gap-2 text-[#00A86B] text-xs font-bold animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-[#00A86B]" />
                    <span>✓ Stock verificado en camioneta del técnico</span>
                  </div>
                )}
              </div>

              {/* Botón: Continuar a Evidencia */}
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                disabled={scannedItems.length === 0}
                className="w-full py-3.5 px-4 bg-[#0B2742] hover:bg-[#061625] text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.98] disabled:opacity-40 cursor-pointer"
              >
                <span>Continuar a Evidencia</span>
                <ArrowRight className="w-4 h-4 text-[#019DF4]" />
              </button>
            </div>
          )}

          {/* =========================================================================
              PASO 3: CIERRE Y EVIDENCIA
          ========================================================================= */}
          {currentStep === 3 && (
            <div className="space-y-3.5 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                {/* 1. Subida de Foto de Evidencia (Fusión OTDR) */}
                <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-[#0B2742] flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-[#019DF4]" />
                      Evidencia de Trabajo (Fusión OTDR)
                    </span>
                    {evidencePhoto ? (
                      <span className="text-[10px] font-mono font-bold text-[#00A86B] bg-[#E6F6F0] px-2 py-0.5 rounded-full">
                        ✓ FOTO ADJUNTA
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        Pendiente
                      </span>
                    )}
                  </div>

                  {evidencePhoto ? (
                    <div className="p-2.5 bg-white border border-[#00A86B]/40 rounded-xl flex items-center gap-3">
                      <div className="w-14 h-14 bg-slate-800 rounded-lg flex items-center justify-center relative overflow-hidden shrink-0 border border-slate-700">
                        {/* Simulated OTDR curve */}
                        <svg className="w-full h-full p-1" viewBox="0 0 50 50">
                          <polyline
                            points="5,40 15,25 25,25 35,10 45,10"
                            fill="none"
                            stroke="#00A86B"
                            strokeWidth="2"
                          />
                        </svg>
                        <span className="absolute bottom-0.5 right-0.5 text-[8px] font-mono text-white bg-black/60 px-1 rounded">
                          OTDR
                        </span>
                      </div>
                      <div className="text-xs space-y-0.5">
                        <p className="font-bold text-[#0B2742]">Fusión_FO_OTDR_0942.jpg</p>
                        <p className="text-[11px] font-mono text-[#00A86B] font-semibold">
                          Atenuación: 0.02 dB (Conforme &lt; 0.05)
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          Longitud de Onda: 1310 / 1550nm
                        </p>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSimulatePhoto}
                      disabled={isLoading}
                      className="w-full py-2.5 px-3 border border-dashed border-[#019DF4] bg-[#019DF4]/5 hover:bg-[#019DF4]/10 rounded-xl text-xs font-semibold text-[#019DF4] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{isLoading ? "Cargando archivo..." : "Tomar Foto de Fusión OTDR"}</span>
                    </button>
                  )}
                </div>

                {/* 2. Área de Firma Digital (HTML5 Canvas Interactivo) */}
                <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#0B2742] flex items-center gap-1.5">
                      <PenTool className="w-4 h-4 text-[#019DF4]" />
                      Firma Digital del Cliente / Supervisor
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleClearSignature}
                        title="Borrar Firma"
                        className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-200 text-[10px] font-mono"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleAutoSign}
                        className="text-[10px] font-mono font-bold text-[#019DF4] hover:underline"
                      >
                        Auto-Firma
                      </button>
                    </div>
                  </div>

                  {/* Canvas Pad */}
                  <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-inner relative">
                    <canvas
                      ref={canvasRef}
                      width={340}
                      height={90}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="w-full h-[90px] cursor-crosshair touch-none"
                    />
                    {!hasSignature && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 text-xs font-mono">
                        Dibuja tu firma aquí con mouse o dedo
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>Firmante: {signerName}</span>
                    <span className={hasSignature ? "text-[#00A86B] font-bold" : "text-amber-600"}>
                      {hasSignature ? "✓ Firma Registrada" : "Falta Firma"}
                    </span>
                  </div>
                </div>

                {/* Resumen Checklist */}
                <div className="p-2.5 bg-[#F4F6F9] rounded-xl text-[11px] font-mono text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>GPS Arribo Validado:</span>
                    <span className="text-[#00A86B] font-bold">{distanciaMetros}m (OK)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Repuestos Consumidos:</span>
                    <span className="text-[#00A86B] font-bold">
                      {scannedItems.length} ítems liquidados
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>SLA Consumido:</span>
                    <span className="text-[#00A86B] font-bold">34 min / 120 min</span>
                  </div>
                </div>
              </div>

              {/* Botón Principal: Cerrar y Despachar OT */}
              <button
                type="button"
                onClick={handleCloseAndDispatch}
                disabled={isLoading || !evidencePhoto || !hasSignature}
                className="w-full py-3.5 px-4 bg-[#00A86B] hover:bg-[#008f5b] text-white font-bold rounded-2xl shadow-lg shadow-[#00A86B]/25 flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <span>Sincronizando cierre con NOC Movistar...</span>
                ) : (
                  <>
                    <FileCheck2 className="w-4 h-4" />
                    <span>Cerrar y Despachar OT</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* =========================================================================
              PASO 4: ÉXITO
          ========================================================================= */}
          {currentStep === 4 && (
            <div className="space-y-4 flex-1 flex flex-col items-center justify-center text-center p-4">
              {/* Ícono gigante de verificación verde */}
              <div className="w-20 h-20 rounded-full bg-[#E6F6F0] border-4 border-[#00A86B] text-[#00A86B] flex items-center justify-center shadow-lg animate-bounce">
                <Check className="w-10 h-10 stroke-[3]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-[#0B2742] font-grotesk tracking-tight">
                  ¡Orden de Trabajo Cerrada / Conforme!
                </h3>
                <p className="text-xs text-slate-600">
                  La orden ha sido liquidada en el sistema central de Movistar Perú con SLA óptimo.
                </p>
              </div>

              {/* Resumen del Tiempo de Atención */}
              <div className="w-full bg-[#F4F6F9] border border-slate-200 rounded-2xl p-4 text-xs font-mono text-left space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Tiempo de Atención:</span>
                  <span className="text-base font-bold text-[#00A86B]">34 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Folio:</span>
                  <span className="text-slate-800 font-bold">OT #89421</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Nodo:</span>
                  <span className="text-slate-800 font-bold">NOD-CARABAYLLO-04</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Materiales Asignados:</span>
                  <span className="text-[#019DF4] font-bold">
                    {scannedItems.length || 2} repuestos descargados
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Estado de Liquidación:</span>
                  <span className="text-[#00A86B] font-bold">LIQUIDADO / CONFORME</span>
                </div>
              </div>

              {/* Botón para Reiniciar Simulación */}
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-3 px-4 bg-[#0B2742] hover:bg-[#061625] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <RotateCcw className="w-4 h-4 text-[#019DF4]" />
                <span>Reiniciar Simulación</span>
              </button>
            </div>
          )}
        </div>

        {/* Step Navigation Pill Bar (Footer for testing & review) */}
        <div className="bg-[#F4F6F9] border-t border-slate-200 px-4 py-2 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as any) : 1))}
            disabled={currentStep === 1}
            className="text-slate-600 hover:text-[#0B2742] disabled:opacity-30 font-medium cursor-pointer"
          >
            ← Paso Anterior
          </button>
          <span className="font-mono text-[11px] text-slate-500">
            Paso {currentStep} de 4
          </span>
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => (prev < 4 ? ((prev + 1) as any) : 4))}
            disabled={currentStep >= 4}
            className="text-[#019DF4] hover:underline font-bold disabled:opacity-30 cursor-pointer"
          >
            Paso Siguiente →
          </button>
        </div>
      </div>
    </div>
  );
}
