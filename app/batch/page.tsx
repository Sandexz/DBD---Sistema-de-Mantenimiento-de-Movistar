"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Wrench,
  Users,
  DollarSign,
  AlertTriangle,
  Download,
  FileSpreadsheet,
  FileText,
  Eye,
  CheckCircle2,
  Award,
  AlertOctagon,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import liquidacionesData from "@/mock-data/liquidaciones.json";

export default function BatchPage() {
  // Modal states
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPenaltiesModalOpen, setIsPenaltiesModalOpen] = useState(false);
  const [isPreliqModalOpen, setIsPreliqModalOpen] = useState(false);

  // Export modal state
  const [exportFormat, setExportFormat] = useState<"excel" | "pdf">("excel");
  const [dateRange, setDateRange] = useState("ultimo-lote");
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const { preventivo, contratistas, preliquidaciones, penalidades } =
    liquidacionesData;

  const handleSimulateExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
        setIsExportModalOpen(false);
      }, 1600);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Topbar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#EBF5FF] border border-[#019DF4]/30 flex items-center justify-center text-[#019DF4] shadow-sm">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold font-grotesk tracking-tight text-slate-900">
                    Procesamiento Lote & Auditoría de Contratistas
                  </h1>
                </div>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  Liquidación de servicios de planta externa, auditoría nocturna de SLA y deducción de penalidades · Movistar Perú
                </p>
              </div>
            </div>
          </div>

          {/* Header Action Badges & Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Badge: BATCH COMPLETO - 03:00 AM */}
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-300/60 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-emerald-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>BATCH COMPLETO — 03:00 AM</span>
            </div>

            {/* Botón Prominente: Exportar Reporte General */}
            <Button
              variant="cyan"
              size="sm"
              onClick={() => setIsExportModalOpen(true)}
              className="bg-[#019DF4] hover:bg-[#0081CB] text-white shadow-md shadow-[#019DF4]/20 font-bold"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              <span>Exportar Reporte General</span>
            </Button>
          </div>
        </div>

        {/* Quick Shortcut Buttons Banner for Diego's modules */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white border border-slate-200 rounded-2xl text-xs shadow-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Sparkles className="w-4 h-4 text-[#019DF4]" />
            <span>Módulos Asignados a Diego:</span>
            <span className="font-mono text-[#019DF4] font-bold">
              /batch (Liquidaciones) & /mobile (App Técnica)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPreliqModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[#EBF5FF] hover:bg-[#019DF4] text-[#019DF4] hover:text-white border border-[#019DF4]/30 font-semibold transition-all cursor-pointer"
            >
              Ver Pre-Liquidaciones
            </button>
            <button
              type="button"
              onClick={() => setIsPenaltiesModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-[#FF6A13] text-[#FF6A13] hover:text-white border border-[#FF6A13]/30 font-semibold transition-all cursor-pointer"
            >
              Ver Actas de Penalidades
            </button>
            <Link
              href="/mobile"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-sm"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Ir a App de Campo</span>
            </Link>
          </div>
        </div>

        {/* =========================================================================
            4 TARJETAS DE AUDITORÍA (KPI CARDS)
        ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ═══ TARJETA 1: MANTENIMIENTO PREVENTIVO ═══ */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col hover:border-[#019DF4]/40 transition-colors">
            <div>
              <CardHeader
                title="Mantenimiento Preventivo (Batch)"
                subtitle="Avance del ciclo trimestral de inspección en planta externa"
                icon={<Wrench className="w-5 h-5 text-[#019DF4]" />}
                action={
                  <Badge variant="cyan" size="sm" className="bg-[#019DF4]/20 text-[#019DF4] border-[#019DF4]/40">
                    {preventivo.cumplimientoPorcentaje} AVANCE
                  </Badge>
                }
              />

              <div className="space-y-4 pt-1">
                {/* Requerimiento exacto: 1,240 OTs Preventivas Generadas Automáticamente por Vida Útil de Activos */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">Lote Automático Nocturno:</span>
                    <span className="text-xs font-mono font-bold text-emerald-600">SLA ÓPTIMO</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 font-grotesk leading-snug">
                    1,240 OTs Preventivas Generadas Automáticamente por Vida Útil de Activos
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Algoritmo preventivo basado en horas de operación, atenuación dBm y telemetría de fallas.
                  </p>
                </div>

                {/* Barra de progreso en 84% */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono text-slate-400">
                    <span>Cumplimiento del Lote Batch</span>
                    <span className="text-[#019DF4] font-bold">84% Completado</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#019DF4] to-[#00A86B] h-full rounded-full transition-all duration-700 shadow-sm"
                      style={{ width: "84%" }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-500">
                    <span>1,042 Ejecutadas</span>
                    <span>118 En Progreso</span>
                    <span>80 Pendientes</span>
                  </div>
                </div>

                {/* Muestreo de Nodos */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                    Muestreo de Nodos Auditados en Lote:
                  </span>
                  {preventivo.detalles.map((d, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono"
                    >
                      <div>
                        <span className="text-slate-900 font-semibold">{d.nodo}</span>
                        <span className="text-[10px] text-slate-500 block">{d.tipo}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#019DF4]">{d.inspeccion}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            d.estado === "CONFORME"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {d.estado}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Próxima Auditoría: 2026-09-30 03:00 AM</span>
              <span className="text-emerald-600 font-bold">✓ Sincronizado</span>
            </div>
          </div>

          {/* ================= TARJETA 2: RENDIMIENTO DE CONTRATISTAS ================= */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col hover:border-[#019DF4]/40 transition-colors">
            <div>
              <CardHeader
                title="Rendimiento de Contratistas"
                subtitle="Evaluación de cuadrillas y cumplimiento de SLA (Cobra / Lari)"
                icon={<Users className="w-5 h-5 text-[#019DF4]" />}
                action={
                  <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    3 Contratistas
                  </span>
                }
              />

              <div className="space-y-3 pt-1">
                {/* Contractor 1: Cobra: 94% */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-emerald-200/60 text-xs space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 font-grotesk text-sm">
                          Cobra Instalaciones & Redes
                        </span>
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                          ÓPTIMO
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Zona: Lima Norte / Callao · 14 Cuadrillas activas
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-bold font-mono text-emerald-600">
                        94%
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        Eficiencia
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "94%" }} />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-200">
                    <span>SLA Cumplido: <strong className="text-slate-800">98.2%</strong></span>
                    <span>480 OTs Conformes</span>
                    <span className="text-amber-500 font-bold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> 4.9 / 5.0
                    </span>
                  </div>
                </div>

                {/* Contractor 2: Lari: 88% */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-[#019DF4]/20 text-xs space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 font-grotesk text-sm">
                          Lari Telecomunicaciones S.A.C.
                        </span>
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-[#019DF4]/20 text-[#019DF4]">
                          CONFORME
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Zona: Lima Este / Centro · 11 Cuadrillas activas
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-bold font-mono text-[#019DF4]">
                        88%
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        Eficiencia
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#019DF4] h-full rounded-full" style={{ width: "88%" }} />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-200">
                    <span>SLA Cumplido: <strong className="text-slate-800">91.5%</strong></span>
                    <span>360 OTs Conformes</span>
                    <span className="text-amber-500 font-bold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> 4.3 / 5.0
                    </span>
                  </div>
                </div>

                {/* Contractor 3: CAM Perú */}
                <div className="p-2.5 bg-orange-50 rounded-xl border border-orange-200/60 text-xs flex items-center justify-between font-mono">
                  <div>
                    <span className="text-slate-700 font-bold">CAM Perú Servicios</span>
                    <span className="text-[10px] text-[#FF6A13] block">Bajo Observación (SLA 84.0%)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#FF6A13] font-bold">82%</span>
                    <span className="text-[10px] text-slate-500 block">Eficiencia</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Auditoría de Cuadrillas en Línea</span>
              <span className="text-[#019DF4]">Ranking Semanal Cerrado</span>
            </div>
          </div>

          {/* ================= TARJETA 3: PRE-LIQUIDACIONES MENSUALES ================= */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col hover:border-emerald-400/40 transition-colors">
            <div>
              <CardHeader
                title="Pre-Liquidaciones Mensuales"
                subtitle="Cálculo consolidado para facturación de contratistas"
                icon={<DollarSign className="w-5 h-5 text-[#00A86B]" />}
                action={
                  <Badge variant="cyan" size="sm" className="bg-[#00A86B]/20 text-[#00A86B] border-[#00A86B]/40">
                    PRE-APROBADO
                  </Badge>
                }
              />

              <div className="space-y-4 pt-1">
                {/* Monto Requerido: S/ 452,180.00 */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-sans">
                      Monto Total Calculado para Pago de Servicios:
                    </span>
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-grotesk tracking-tight" suppressHydrationWarning>
                      S/ 452,180.00
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-[#019DF4] block font-bold">
                      1,032 OTs
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Auditadas 100%
                    </span>
                  </div>
                </div>

                {/* Desglose de Costos Operativos */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                    Desglose de Facturación Auditada:
                  </span>
                  {preliquidaciones.desglose.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono"
                    >
                      <span className="text-slate-600">{item.rubro}</span>
                      <span className="text-slate-900 font-bold">{item.monto}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Botón Prominente: Ver Detalle de Pre-Liquidaciones */}
            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                Período: {preliquidaciones.periodo}
              </span>

              <button
                type="button"
                onClick={() => setIsPreliqModalOpen(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-[#019DF4] hover:underline"
              >
                <Eye className="w-3.5 h-3.5" />
                Ver Detalle de Pre-Liquidaciones
              </button>
            </div>
          </div>

          {/* ================= TARJETA 4: PENALIDADES SLA ================= */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col hover:border-orange-400/40 transition-colors">
            <div>
              <CardHeader
                title="Penalidades SLA"
                subtitle="Deducciones acumuladas por demoras o reincidencias de fallas"
                icon={<AlertTriangle className="w-5 h-5 text-[#FF6A13]" />}
                action={
                  <Badge variant="orange" size="sm">
                    {penalidades.estado}
                  </Badge>
                }
              />

              <div className="space-y-4 pt-1">
                {/* Monto Requerido: -S/ 28,400.00 */}
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-200/60 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-sans">
                      Monto Acumulado por Penalidades SLA:
                    </span>
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#FF6A13] font-grotesk tracking-tight" suppressHydrationWarning>
                      -S/ 28,400.00
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-[#FF6A13] block font-bold">
                      {penalidades.casosRegistrados} Actas Emitidas
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Cobra & Lari
                    </span>
                  </div>
                </div>

                {/* Motivos Clave de Penalización */}
                <div className="space-y-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-500 font-mono text-[11px]">
                      <span>Incumplimiento Crítico MTTR:</span>
                      <span className="text-[#FF6A13] font-bold">S/ 4,500.00 + S/ 8,200.00</span>
                    </div>
                    <p className="font-bold text-slate-900 font-grotesk">
                      Cobra: Incumplimiento MTTR &gt; 4hrs
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      Enlace troncal en Nodo NOD-CARABAYLLO-04 y San Martín de Porres.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-500 font-mono text-[11px]">
                      <span>Reincidencia de Averías:</span>
                      <span className="text-[#FF6A13] font-bold">S/ 8,200.00 + S/ 7,500.00</span>
                    </div>
                    <p className="font-bold text-slate-900 font-grotesk">
                      Lari: Reincidencia en Nodo NOD-LIM-02
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Segunda falla en mufa óptica HFC en menos de 48 horas.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón Prominente: Ver Actas de Penalidades */}
            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                {penalidades.casos.length} Actas formalizadas
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPenaltiesModalOpen(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-[#FF6A13] hover:underline text-left"
              >
                <AlertOctagon className="w-3.5 h-3.5 mr-1.5 text-[#FF6A13]" />
                <span>Ver Actas de Penalidades</span>
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* =========================================================================
          MODAL 1: EXPORTACIÓN DE REPORTES (Excel / PDF / Fechas / Descargar)
      ========================================================================= */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Exportación de Reporte General de Auditoría"
        subtitle="Generación consolidada de liquidaciones y auditorías para Movistar Perú"
        footer={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExportModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="cyan"
              size="sm"
              onClick={handleSimulateExport}
              isLoading={isExporting}
              className="bg-[#019DF4] hover:bg-[#0081CB] text-white font-bold"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              <span>Descargar Documento</span>
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {exportSuccess ? (
            <div className="p-4 bg-[#E6F6F0] border border-[#00A86B] rounded-2xl flex items-center gap-3 text-[#00A86B] animate-in fade-in">
              <CheckCircle2 className="w-6 h-6 text-[#00A86B] shrink-0" />
              <div>
                <p className="font-bold font-grotesk text-sm">
                  ¡Documento descargado exitosamente!
                </p>
                <p className="text-xs text-slate-600 font-mono mt-0.5">
                  Archivo: Movistar_Auditoria_Batch_Q3_{exportFormat.toUpperCase()}.{exportFormat === "excel" ? "xlsx" : "pdf"}
                </p>
              </div>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-300 leading-relaxed">
                Seleccione el formato oficial y el rango de fechas para el cierre financiero de contratistas:
              </p>

              {/* Selector de Formato: Excel (.xlsx) o PDF Ejecutivo */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                  Formato de Salida:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setExportFormat("excel")}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                      exportFormat === "excel"
                        ? "bg-[#0B2742] border-[#019DF4] text-white shadow-sm ring-1 ring-[#019DF4]"
                        : "bg-[#0B0C0E] border-[#1E232B] text-slate-400 hover:text-white"
                    }`}
                  >
                    <FileSpreadsheet className="w-6 h-6 text-[#00A86B]" />
                    <div>
                      <span className="font-bold text-xs block text-white">Excel (.xlsx)</span>
                      <span className="text-[10px] text-slate-400">Planilla con fórmulas & OTs</span>
                    </div>
                  </div>

                  <div
                    onClick={() => setExportFormat("pdf")}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                      exportFormat === "pdf"
                        ? "bg-[#0B2742] border-[#019DF4] text-white shadow-sm ring-1 ring-[#019DF4]"
                        : "bg-[#0B0C0E] border-[#1E232B] text-slate-400 hover:text-white"
                    }`}
                  >
                    <FileText className="w-6 h-6 text-[#FF6A13]" />
                    <div>
                      <span className="font-bold text-xs block text-white">PDF Ejecutivo</span>
                      <span className="text-[10px] text-slate-400">Acta formal con firmas</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Opciones de Rango de Fechas */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                  Rango de Fechas / Período:
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full bg-[#0B0C0E] border border-[#1E232B] rounded-xl px-3.5 py-2.5 text-slate-100 text-xs font-mono focus:outline-none focus:border-[#019DF4] cursor-pointer"
                >
                  <option value="ultimo-lote">Último Lote Procesado (03:00 AM - Hoy)</option>
                  <option value="quincena-1">1 al 15 de Septiembre 2026 (Quincena Actual)</option>
                  <option value="mes-completo">Mes Completo Septiembre 2026</option>
                  <option value="trimestre-q3">Trimestre Q3 2026 Consolidado</option>
                </select>
              </div>

              {/* Resumen Financiero del Reporte */}
              <div className="p-3.5 bg-[#0B0C0E] rounded-xl border border-[#1E232B] space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Pre-Liquidación:</span>
                  <span className="text-white font-bold">S/ 452,180.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Deducción de Penalidades:</span>
                  <span className="text-[#FF6A13] font-bold">-S/ 28,400.00</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-[#1E232B] text-sm">
                  <span className="text-[#00A86B] font-bold">Neto a Liquidar:</span>
                  <span className="text-[#00A86B] font-bold">S/ 423,780.00</span>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* =========================================================================
          MODAL 2: DETALLE DE PENALIDADES SLA (Tabla detallada con montos)
      ========================================================================= */}
      <Modal
        isOpen={isPenaltiesModalOpen}
        onClose={() => setIsPenaltiesModalOpen(false)}
        title="Actas de Penalidades & Deducciones SLA"
        subtitle="Registro de expedientes por incumplimiento de MTTR y reincidencias"
        maxWidth="xl"
        footer={
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPenaltiesModalOpen(false)}
          >
            Cerrar Detalle
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="p-3 bg-[#0B0C0E] rounded-xl border border-[#FF6A13]/40 flex items-center justify-between text-xs font-mono">
            <span>Total Deducciones Auditadas:</span>
            <span className="text-[#FF6A13] font-bold text-base">-S/ 28,400.00</span>
          </div>

          {/* Tabla de Actas */}
          <div className="overflow-x-auto border border-[#1E232B] rounded-xl bg-[#0B0C0E]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#1E232B] text-[11px] font-mono text-slate-400 bg-[#121418]">
                  <th className="py-2.5 px-3">ID Acta</th>
                  <th className="py-2.5 px-3">Contrata</th>
                  <th className="py-2.5 px-4">Motivo de Penalidad</th>
                  <th className="py-2.5 px-3">OT / Nodo</th>
                  <th className="py-2.5 px-3 text-right">Deducción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E232B] font-mono">
                {penalidades.casos.map((caso) => (
                  <tr key={caso.id} className="hover:bg-[#121418]/60 transition-colors">
                    <td className="py-3 px-3 font-bold text-white whitespace-nowrap">
                      {caso.id}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          caso.contratista === "Cobra"
                            ? "bg-[#019DF4]/20 text-[#019DF4]"
                            : "bg-[#00A86B]/20 text-[#00A86B]"
                        }`}
                      >
                        {caso.contratista}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-200">
                      <p className="font-semibold text-white">{caso.motivo}</p>
                      <p className="text-[10px] text-slate-400 font-sans mt-0.5">{caso.detalle}</p>
                    </td>
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap text-[11px]">
                      <div>{caso.otId}</div>
                      <div className="text-[10px] text-[#019DF4]">{caso.nodo}</div>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-[#FF6A13] whitespace-nowrap">
                      -{caso.monto}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-[#121418] rounded-xl border border-[#1E232B] text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Validado por NOC Central Movistar Perú</span>
            <span className="text-[#00A86B]">Todas las actas cuentan con sustento OTDR</span>
          </div>
        </div>
      </Modal>

      {/* =========================================================================
          MODAL 3: DETALLE DE PRE-LIQUIDACIONES
      ========================================================================= */}
      <Modal
        isOpen={isPreliqModalOpen}
        onClose={() => setIsPreliqModalOpen(false)}
        title="Detalle de Pre-Liquidaciones por Contratista"
        subtitle="Cálculo acumulado de facturación correspondiente al período actual"
        maxWidth="xl"
        footer={
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreliqModalOpen(false)}
          >
            Cerrar Detalle
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="p-3 bg-[#0B0C0E] rounded-xl border border-[#00A86B]/40 flex items-center justify-between text-xs font-mono">
            <span>Monto Total Pre-Liquidado:</span>
            <span className="text-[#00A86B] font-bold text-base">S/ 452,180.00</span>
          </div>

          {/* Tabla Desglose por Contratista */}
          <div className="overflow-x-auto border border-[#1E232B] rounded-xl bg-[#0B0C0E]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#1E232B] text-[11px] font-mono text-slate-400 bg-[#121418]">
                  <th className="py-2.5 px-3">Contratista</th>
                  <th className="py-2.5 px-3">OTs Conformes</th>
                  <th className="py-2.5 px-3 text-right">Subtotal Facturable</th>
                  <th className="py-2.5 px-3 text-right">Penalidades</th>
                  <th className="py-2.5 px-3 text-right">Neto Aprobado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E232B] font-mono">
                {preliquidaciones.porContratista.map((c, idx) => (
                  <tr key={idx} className="hover:bg-[#121418]/60 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">
                      {c.contratista}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {c.ots} OTs
                    </td>
                    <td className="py-3 px-3 text-right text-white">
                      {c.subtotal}
                    </td>
                    <td className="py-3 px-3 text-right text-[#FF6A13]">
                      -{c.penalidades}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-[#00A86B]">
                      {c.neto}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 bg-[#121418] rounded-xl border border-[#1E232B] text-xs font-mono space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Estado de Aprobación:</span>
              <span className="text-[#00A86B] font-bold">PRE-APROBADO PARA TRANSFERENCIA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Auditor Responsable:</span>
              <span className="text-white">Gerencia de Planta Externa & Finanzas</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
