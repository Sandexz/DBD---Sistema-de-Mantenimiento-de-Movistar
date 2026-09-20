"use client";

import React, { useState } from "react";
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
  Clock,
  TrendingUp,
  Award,
  Calendar,
  AlertOctagon,
} from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import liquidacionesData from "@/mock-data/liquidaciones.json";

export default function BatchPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPenaltiesModalOpen, setIsPenaltiesModalOpen] = useState(false);
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
      }, 1800);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-slate-100 flex flex-col font-sans">
      <Topbar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Module Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E232B] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-6 h-6 text-[#00AEEF]" />
              <h1 className="text-xl sm:text-2xl font-bold font-grotesk tracking-tight text-white">
                Procesamiento Batch & Liquidaciones
              </h1>
              <Badge variant="cyan" size="sm">
                Q3 2026 AUDITORÍA
              </Badge>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Cierre periódico de órdenes de mantenimiento, auditoría de contratistas y penalizaciones
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="cyan" size="md">
              PERÍODO: 01-15 SEP 2026
            </Badge>
          </div>
        </div>

        {/* 4 Cards Grid as specified */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ================= TARJETA 1: MANTENIMIENTO PREVENTIVO ================= */}
          <Card className="flex flex-col justify-between">
            <div>
              <CardHeader
                title="Mantenimiento Preventivo (Batch)"
                subtitle="Avance del ciclo trimestral de inspección en planta"
                icon={<Wrench className="w-5 h-5" />}
                action={
                  <Badge variant="cyan" size="sm">
                    {preventivo.cumplimientoPorcentaje} AVANCE
                  </Badge>
                }
              />

              <div className="space-y-4">
                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-[#0B0C0E] p-3 rounded-lg border border-[#1E232B]">
                    <span className="text-[11px] text-slate-400 block font-sans">
                      Programadas
                    </span>
                    <span className="text-xl font-bold font-mono text-white">
                      {preventivo.totalProgramado}
                    </span>
                  </div>
                  <div className="bg-[#0B0C0E] p-3 rounded-lg border border-[#1E232B]">
                    <span className="text-[11px] text-slate-400 block font-sans">
                      Ejecutadas
                    </span>
                    <span className="text-xl font-bold font-mono text-[#00AEEF]">
                      {preventivo.ejecutado}
                    </span>
                  </div>
                  <div className="bg-[#0B0C0E] p-3 rounded-lg border border-[#1E232B]">
                    <span className="text-[11px] text-slate-400 block font-sans">
                      Pendientes
                    </span>
                    <span className="text-xl font-bold font-mono text-slate-400">
                      {preventivo.pendientes}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                    <span>Cumplimiento Q3</span>
                    <span className="text-[#00AEEF] font-bold">
                      {preventivo.cumplimientoPorcentaje}
                    </span>
                  </div>
                  <div className="w-full bg-[#0B0C0E] h-2 rounded-full overflow-hidden border border-[#1E232B]">
                    <div
                      className="bg-[#00AEEF] h-full rounded-full transition-all duration-500"
                      style={{ width: preventivo.cumplimientoPorcentaje }}
                    />
                  </div>
                </div>

                {/* Details list */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Muestreo de Nodos Auditados:
                  </span>
                  {preventivo.detalles.map((d, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-[#0B0C0E] rounded border border-[#1E232B] text-xs font-mono"
                    >
                      <span className="text-slate-200">{d.nodo}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#00AEEF]">{d.inspeccion}</span>
                        <Badge
                          variant={d.estado === "OK" ? "cyan" : "orange"}
                          size="sm"
                        >
                          {d.estado}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1E232B] flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Próxima Auditoría: {preventivo.proximaAuditoria}</span>
              <span className="text-[#00AEEF]">Sincronización Batch OK</span>
            </div>
          </Card>

          {/* ================= TARJETA 2: RENDIMIENTO DE CONTRATISTAS ================= */}
          <Card className="flex flex-col justify-between">
            <div>
              <CardHeader
                title="Rendimiento de Contratistas"
                subtitle="Evaluación de cuadrillas y cumplimiento de SLA"
                icon={<Users className="w-5 h-5" />}
                action={
                  <span className="text-xs font-mono text-slate-400">
                    3 Empresas
                  </span>
                }
              />

              <div className="space-y-3">
                {contratistas.map((c, index) => {
                  const isObservado = c.estado === "BAJO OBSERVACIÓN";
                  return (
                    <div
                      key={c.id}
                      className={`p-3 rounded-lg border transition-all text-xs space-y-2 ${
                        isObservado
                          ? "bg-[#0B0C0E] border-[#FF6A13]/30"
                          : "bg-[#0B0C0E] border-[#1E232B]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-slate-400 bg-[#121418] px-1.5 py-0.5 rounded border border-[#1E232B]">
                            #{index + 1}
                          </span>
                          <div>
                            <h4 className="font-bold text-white font-grotesk text-xs">
                              {c.nombre}
                            </h4>
                            <span className="text-[11px] font-mono text-slate-400">
                              {c.cuadrillas} Cuadrillas · {c.otsCompletadas} OTs
                            </span>
                          </div>
                        </div>

                        <Badge
                          variant={isObservado ? "orange" : "cyan"}
                          size="sm"
                        >
                          {c.estado}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-[#1E232B] font-mono">
                        <span className="text-slate-400">
                          SLA Cumplido:{" "}
                          <strong
                            className={
                              isObservado ? "text-[#FF6A13]" : "text-[#00AEEF]"
                            }
                          >
                            {c.slaCumplido}
                          </strong>
                        </span>
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          {c.calificacion}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1E232B] flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Auditoría de Cuadrillas en Línea</span>
              <span className="text-[#00AEEF]">Ranking Semanal</span>
            </div>
          </Card>

          {/* ================= TARJETA 3: PRE-LIQUIDACIONES (CON BOTÓN EXPORTAR) ================= */}
          <Card className="flex flex-col justify-between">
            <div>
              <CardHeader
                title="Pre-Liquidaciones de Servicios"
                subtitle="Cálculo acumulado de facturación y servicios de campo"
                icon={<DollarSign className="w-5 h-5" />}
                action={
                  <Badge variant="cyan" size="sm">
                    {preliquidaciones.estadoCierre}
                  </Badge>
                }
              />

              <div className="space-y-4">
                {/* Total Value */}
                <div className="bg-[#0B0C0E] p-4 rounded-xl border border-[#1E232B] flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-sans">
                      Monto Total Pre-Liquidado:
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-grotesk tracking-tight">
                      {preliquidaciones.montoTotal}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-[#00AEEF] block">
                      {preliquidaciones.ordenesFacturables} OTs
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Auditadas 100%
                    </span>
                  </div>
                </div>

                {/* Desglose */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Desglose de Costos Operativos:
                  </span>
                  {preliquidaciones.desglose.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-[#0B0C0E] rounded border border-[#1E232B] text-xs font-mono"
                    >
                      <span className="text-slate-300">{item.rubro}</span>
                      <span className="text-white font-bold">{item.monto}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Button: Exportar (Opens modal only, as required) */}
            <div className="mt-5 pt-4 border-t border-[#1E232B] flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                Período: {preliquidaciones.periodo}
              </span>

              <Button
                variant="orange"
                size="sm"
                onClick={() => setIsExportModalOpen(true)}
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                <span>Exportar reporte de pago</span>
              </Button>
            </div>
          </Card>

          {/* ================= TARJETA 4: PENALIDADES (CON BOTÓN VER DETALLE) ================= */}
          <Card className="flex flex-col justify-between">
            <div>
              <CardHeader
                title="Penalidades & Deducciones"
                subtitle="Descuentos aplicados por incumplimiento de SLA"
                icon={<AlertTriangle className="w-5 h-5 text-[#FF6A13]" />}
                action={
                  <Badge variant="orange" size="sm">
                    {penalidades.estado}
                  </Badge>
                }
              />

              <div className="space-y-4">
                {/* Total Penalties Value */}
                <div className="bg-[#0B0C0E] p-4 rounded-xl border border-[#FF6A13]/30 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-sans">
                      Total Penalizaciones Deducidas:
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#FF6A13] font-grotesk tracking-tight">
                      {penalidades.totalPenalidades}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-[#FF6A13] block font-bold">
                      {penalidades.casosRegistrados} Casos
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Q3 Liquidación
                    </span>
                  </div>
                </div>

                {/* Preview of top incident */}
                <div className="p-3 bg-[#0B0C0E] rounded-lg border border-[#1E232B] text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                    <span>Mayor Deducción Registrada:</span>
                    <span className="text-[#FF6A13] font-bold">
                      {penalidades.casos[0].monto}
                    </span>
                  </div>
                  <p className="font-bold text-white font-grotesk">
                    {penalidades.casos[0].contratista}
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    {penalidades.casos[0].motivo}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button: Ver Detalle (Opens modal only, as required) */}
            <div className="mt-5 pt-4 border-t border-[#1E232B] flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                {penalidades.casos.length} incidentes con acta
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPenaltiesModalOpen(true)}
                className="text-slate-200 hover:text-white"
              >
                <Eye className="w-3.5 h-3.5 mr-1.5 text-[#00AEEF]" />
                <span>Ver detalle</span>
              </Button>
            </div>
          </Card>
        </div>
      </main>

      {/* ================= MODAL 1: EXPORTAR REPORTE DE PAGO ================= */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Exportar Reporte de Pre-Liquidación"
        subtitle="Generación de acta de pago y resumen consolidado"
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
              variant="orange"
              size="sm"
              onClick={handleSimulateExport}
              isLoading={isExporting}
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              <span>Confirmar Descarga (Simulada)</span>
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {exportSuccess ? (
            <div className="p-4 bg-emerald-500/15 border border-emerald-500/40 rounded-xl flex items-center gap-3 text-emerald-300">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold font-grotesk text-sm">
                  ¡Reporte generado exitosamente!
                </p>
                <p className="text-xs text-slate-300 font-mono mt-0.5">
                  Archivo simulado: SGMR_Liquidacion_Q3_SEP2026.xlsx
                </p>
              </div>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-300 leading-relaxed">
                Seleccione el formato de salida para exportar la pre-liquidación correspondiente al período del{" "}
                <strong className="text-white">{preliquidaciones.periodo}</strong>.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <label className="p-3 bg-[#0B0C0E] border border-[#00AEEF]/50 rounded-lg flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    defaultChecked
                    className="text-[#00AEEF]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      <span>Formato Excel</span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      .XLSX con fórmulas
                    </span>
                  </div>
                </label>

                <label className="p-3 bg-[#0B0C0E] border border-[#1E232B] rounded-lg flex items-center gap-2.5 cursor-pointer">
                  <input type="radio" name="format" className="text-[#00AEEF]" />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                      <FileText className="w-4 h-4 text-[#FF6A13]" />
                      <span>Formato PDF</span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Acta formal con firma
                    </span>
                  </div>
                </label>
              </div>

              <div className="p-3 bg-[#0B0C0E] rounded-lg border border-[#1E232B] space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Liquidable:</span>
                  <span className="text-white font-bold">{preliquidaciones.montoTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Deducciones:</span>
                  <span className="text-[#FF6A13] font-bold">-{penalidades.totalPenalidades}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#1E232B]">
                  <span className="text-[#00AEEF] font-bold">Neto a Transferir:</span>
                  <span className="text-[#00AEEF] font-bold">$ 144,070.00 USD</span>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* ================= MODAL 2: VER DETALLE DE PENALIDADES ================= */}
      <Modal
        isOpen={isPenaltiesModalOpen}
        onClose={() => setIsPenaltiesModalOpen(false)}
        title="Detalle de Penalidades Aplicadas"
        subtitle="Registro de actas de incumplimiento técnico y SLA"
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
        <div className="space-y-3">
          <p className="text-xs text-slate-300">
            Desglose de los casos auditados durante el período actual. Todas las penalidades cuentan con validación técnica del NOC.
          </p>

          <div className="space-y-2.5">
            {penalidades.casos.map((caso) => (
              <div
                key={caso.id}
                className="p-3 bg-[#0B0C0E] border border-[#1E232B] rounded-lg text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">
                      {caso.id}
                    </span>
                    <Badge variant="orange" size="sm">
                      {caso.monto}
                    </Badge>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {caso.fecha}
                  </span>
                </div>

                <div className="text-slate-300">
                  <span className="text-slate-400">Contratista: </span>
                  <strong className="text-white">{caso.contratista}</strong>
                  <span className="text-slate-400 font-mono ml-2">
                    (Ref: {caso.otId})
                  </span>
                </div>

                <p className="text-slate-400 text-[11px] bg-[#121418] p-2 rounded border border-[#1E232B]">
                  {caso.motivo}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
