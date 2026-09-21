"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  FileText,
  FileCheck2,
  Receipt,
  ShieldAlert,
  Printer,
  Download,
  CheckCircle2,
  HardHat,
  MapPin,
  Calendar,
  Layers,
  Radio,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import reportesData from "@/mock-data/reportes.json";

function ReportesContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "asignacion";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const { papeletaAsignacion, constanciaConformidad, valeConsumo, papeletaAts } = reportesData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#0070B8] bg-[#E5F4FD] px-2 py-0.5 rounded border border-[#B8E2FB]">
              ON-LINE OPERATIVO
            </span>
            <span className="text-xs text-slate-400 font-mono">/ Centro de Reportes</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-grotesk tracking-tight text-slate-900 mt-1">
            Reportes Operativos e Interfaces Inmediatas
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Emisión y consulta de comprobantes formales generados en el ciclo de vida de mantenimiento
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handlePrint} className="print:hidden">
          <Printer className="w-4 h-4 mr-1 text-[#019DF4]" />
          <span>Imprimir Comprobante</span>
        </Button>
      </div>

      {/* 4 Tabs Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono print:hidden">
        <button
          onClick={() => setActiveTab("asignacion")}
          className={`p-3 rounded-xl border text-left transition-all ${
            activeTab === "asignacion"
              ? "bg-[#F0F9E8] border-[#5BC500] text-[#3F8500] font-bold shadow-sm"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <FileCheck2 className="w-4 h-4 mb-1 text-[#5BC500]" />
          <span className="block font-sans text-xs">Papeleta de Asignación</span>
          <span className="text-[10px] text-slate-400 font-normal">Despacho digital</span>
        </button>

        <button
          onClick={() => setActiveTab("conformidad")}
          className={`p-3 rounded-xl border text-left transition-all ${
            activeTab === "conformidad"
              ? "bg-[#F0F9E8] border-[#5BC500] text-[#3F8500] font-bold shadow-sm"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <FileText className="w-4 h-4 mb-1 text-[#019DF4]" />
          <span className="block font-sans text-xs">Constancia de Conformidad</span>
          <span className="text-[10px] text-slate-400 font-normal">Cierre con firma</span>
        </button>

        <button
          onClick={() => setActiveTab("vale")}
          className={`p-3 rounded-xl border text-left transition-all ${
            activeTab === "vale"
              ? "bg-[#F0F9E8] border-[#5BC500] text-[#3F8500] font-bold shadow-sm"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Receipt className="w-4 h-4 mb-1 text-amber-500" />
          <span className="block font-sans text-xs">Vale de Materiales</span>
          <span className="text-[10px] text-slate-400 font-normal">Consumo de stock</span>
        </button>

        <button
          onClick={() => setActiveTab("ats")}
          className={`p-3 rounded-xl border text-left transition-all ${
            activeTab === "ats"
              ? "bg-[#F0F9E8] border-[#5BC500] text-[#3F8500] font-bold shadow-sm"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <ShieldAlert className="w-4 h-4 mb-1 text-rose-500" />
          <span className="block font-sans text-xs">Papeleta ATS (Seguridad)</span>
          <span className="text-[10px] text-slate-400 font-normal">Inspección de riesgos</span>
        </button>
      </div>

      {/* Visual Report Container - Styled like an official Movistar Document */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-8 shadow-card-clean max-w-4xl mx-auto space-y-6">
        {/* Document Header with Movistar Identity */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5BC500] text-white flex items-center justify-center font-bold text-lg font-grotesk shadow-movistar-green">
              M
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-grotesk text-slate-900 leading-tight">
                Telefónica del Perú S.A.A. · Movistar
              </h2>
              <p className="text-xs text-slate-500 font-sans">
                Gerencia Central de Redes & Operaciones NOC · SGMR
              </p>
            </div>
          </div>

          <div className="text-right font-mono text-xs">
            <Badge variant="movistar" size="sm">
              DOCUMENTO OFICIAL
            </Badge>
            <p className="text-[10px] text-slate-400 mt-1">R.U.C. 20100017491</p>
          </div>
        </div>

        {/* ================= REPORTE 1: PAPELETA DE ASIGNACIÓN ================= */}
        {activeTab === "asignacion" && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#0070B8] uppercase">
                  Papeleta de Asignación y Despacho Operativo
                </span>
                <h3 className="text-xl font-bold font-grotesk text-slate-900">
                  Orden de Trabajo: {papeletaAsignacion.otId}
                </h3>
              </div>
              <Badge variant="movistar" size="md">
                TIPO: {papeletaAsignacion.tipoMantenimiento}
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Fecha de Despacho:</span>
                <strong className="text-slate-900">{papeletaAsignacion.fechaEmision}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Prioridad & SLA:</span>
                <strong className="text-rose-600">{papeletaAsignacion.prioridad}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Activo / Nodo:</span>
                <strong className="text-slate-900">{papeletaAsignacion.activo}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Empresa Contratista:</span>
                <span className="text-slate-800 font-medium">{papeletaAsignacion.contratista}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Cuadrilla Asignada:</span>
                <span className="text-slate-800 font-medium">{papeletaAsignacion.cuadrilla}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Vehículo / Móvil:</span>
                <span className="text-slate-800 font-medium">{papeletaAsignacion.vehiculo}</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="font-bold font-mono text-slate-700 uppercase tracking-wider block">
                Actividad y Especificación Técnica:
              </span>
              <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 font-sans leading-relaxed">
                {papeletaAsignacion.actividad}
              </p>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <span className="font-bold text-slate-700 uppercase tracking-wider block">
                Insumos y Repuestos Autorizados para la Atención:
              </span>
              <ul className="list-disc list-inside space-y-1 p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                {papeletaAsignacion.insumosAutorizados.map((ins, i) => (
                  <li key={i}>{ins}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ================= REPORTE 2: CONSTANCIA DE CONFORMIDAD ================= */}
        {activeTab === "conformidad" && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#3F8500] uppercase">
                  Acta de Liquidación y Conformidad de Servicio
                </span>
                <h3 className="text-xl font-bold font-grotesk text-slate-900">
                  Constancia N°: {constanciaConformidad.numeroConstancia}
                </h3>
              </div>
              <Badge variant="green" size="md">
                {constanciaConformidad.conformidadCliente}
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Folio OT:</span>
                <strong className="text-slate-900">{constanciaConformidad.otId}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Fecha de Cierre:</span>
                <strong className="text-slate-900">{constanciaConformidad.fechaCierre}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Duración:</span>
                <strong className="text-[#3F8500]">{constanciaConformidad.duracionIntervencion}</strong>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[10px]">Solicitante / Supervisor:</span>
                <span className="text-slate-800">{constanciaConformidad.supervisorAprobador}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Cuadrilla Ejecutora:</span>
                <span className="text-slate-800">{constanciaConformidad.cuadrilla}</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="font-bold font-mono text-slate-700 uppercase tracking-wider block">
                Descripción del Trabajo Realizado:
              </span>
              <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 font-sans leading-relaxed">
                {constanciaConformidad.trabajoRealizado}
              </p>
            </div>

            {/* Mediciones */}
            <div className="space-y-1.5 text-xs font-mono">
              <span className="font-bold text-slate-700 uppercase tracking-wider block">
                Mediciones Técnicas y Calidad Óptica / Eléctrica:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {constanciaConformidad.mediciones.map((m, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">{m.parametro}</span>
                    <strong className="text-slate-900">{m.valor}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Firmas Digitales */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-center text-xs font-mono">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-[#3F8500] font-bold text-[10px]">✓ FIRMADO DIGITALMENTE</p>
                <p className="text-slate-800 font-bold mt-1">Ing. Luis Valdivia</p>
                <p className="text-[10px] text-slate-400">Supervisor NOC Nivel 3 Movistar</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-[#3F8500] font-bold text-[10px]">✓ FIRMADO DIGITALMENTE</p>
                <p className="text-slate-800 font-bold mt-1">Manuel Silva</p>
                <p className="text-[10px] text-slate-400">Líder de Cuadrilla Ejecutora</p>
              </div>
            </div>
          </div>
        )}

        {/* ================= REPORTE 3: VALE DE CONSUMO ================= */}
        {activeTab === "vale" && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-amber-700 uppercase">
                  Vale Instantáneo de Consumo de Materiales
                </span>
                <h3 className="text-xl font-bold font-grotesk text-slate-900">
                  Vale N°: {valeConsumo.numeroVale}
                </h3>
              </div>
              <Badge variant="yellow" size="md">
                {valeConsumo.descuentoAlmacen}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">OT Vinculada:</span>
                <strong className="text-slate-900">{valeConsumo.otId}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Fecha y Hora:</span>
                <strong className="text-slate-900">{valeConsumo.fechaDescargo}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Técnico Responsable:</span>
                <strong className="text-slate-900">{valeConsumo.tecnico}</strong>
              </div>
            </div>

            {/* Tabla de Materiales */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left font-mono">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 uppercase">
                    <th className="py-2.5 px-3">Código</th>
                    <th className="py-2.5 px-3">Descripción Insumo</th>
                    <th className="py-2.5 px-3">Cantidad</th>
                    <th className="py-2.5 px-3">Unidad</th>
                    <th className="py-2.5 px-3">Lote</th>
                    <th className="py-2.5 px-3 text-right">Stock Restante</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {valeConsumo.materiales.map((m) => (
                    <tr key={m.codigo}>
                      <td className="py-2.5 px-3 text-[#0070B8] font-bold">{m.codigo}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-800">{m.descripcion}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{m.cantidad}</td>
                      <td className="py-2.5 px-3 text-slate-500">{m.unidad}</td>
                      <td className="py-2.5 px-3 text-slate-500">{m.lote}</td>
                      <td className="py-2.5 px-3 text-right text-[#3F8500] font-bold">
                        {m.stockRestante} {m.unidad}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= REPORTE 4: PAPELETA ATS ================= */}
        {activeTab === "ats" && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-rose-700 uppercase">
                  Papeleta de Análisis de Trabajo Seguro (ATS)
                </span>
                <h3 className="text-xl font-bold font-grotesk text-slate-900">
                  Formulario N°: {papeletaAts.numeroAts}
                </h3>
              </div>
              <Badge variant="green" size="md">
                {papeletaAts.estadoAutorizacion}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">OT de Referencia:</span>
                <strong className="text-slate-900">{papeletaAts.otId}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Cuadrilla Evaluada:</span>
                <strong className="text-slate-900">{papeletaAts.cuadrilla}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Altura de Trabajo:</span>
                <strong className="text-rose-600">{papeletaAts.alturaTrabajo}</strong>
              </div>
            </div>

            {/* Matriz de Riesgos */}
            <div className="space-y-2 text-xs">
              <span className="font-bold font-mono text-slate-700 uppercase tracking-wider block">
                Matriz de Identificación de Peligros y Medidas de Control:
              </span>
              <div className="space-y-2">
                {papeletaAts.riesgosEvaluados.map((r, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 font-sans block">{r.riesgo}</span>
                      <p className="text-slate-600 text-[11px] font-mono mt-0.5">{r.medidaControl}</p>
                    </div>
                    <Badge variant={r.aplica ? "yellow" : "gray"} size="sm">
                      {r.aplica ? "APLICA" : "NO APLICA"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Verificación de EPP */}
            <div className="p-3 bg-[#F0F9E8] border border-[#C6EE94] rounded-xl text-xs space-y-1">
              <span className="font-bold font-mono text-[#3F8500] uppercase block">
                ✓ Verificación de Elementos de Protección Personal (EPP):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] text-slate-700 pt-1">
                <span>• Casco dieléctrico: OK</span>
                <span>• Barbiquejo: OK</span>
                <span>• Lentes de seguridad: OK</span>
                <span>• Arnés certificado: OK</span>
                <span>• Guantes dieléctricos: OK</span>
                <span>• Botas dieléctricas: OK</span>
                <span>• Chaleco reflectivo: OK</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 text-xs font-mono text-right text-slate-600">
              <span>Aprobado por: </span>
              <strong className="text-slate-900">{papeletaAts.firmadoPor}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReportesOperativosPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500 font-mono text-sm">
          Cargando Centro de Reportes...
        </div>
      }
    >
      <ReportesContent />
    </Suspense>
  );
}
