"use client";

import React, { useState } from "react";
import {
  Users,
  Building,
  Phone,
  HardHat,
  Truck,
  DollarSign,
  ShieldCheck,
  Eye,
  CheckCircle2,
  FileCheck2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import initialContratistas from "@/mock-data/contratistas.json";

export default function ContratistasPage() {
  const [contratistas, setContratistas] = useState(initialContratistas);
  const [selectedEmpresa, setSelectedEmpresa] = useState<any | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#5BC500] bg-[#F0F9E8] px-2 py-0.5 rounded border border-[#C6EE94]">
              MANTENIMIENTO DE PARÁMETROS
            </span>
            <span className="text-xs text-slate-400 font-mono">/ Padrón de Tercerizados</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-grotesk tracking-tight text-slate-900 mt-1">
            Gestión de Empresas Contratistas
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Registro, tarifarios contractuales y padrón de cuadrillas operativas habilitadas (Lari, Cobra, Telconet)
          </p>
        </div>

        <Badge variant="movistar" size="md">
          {contratistas.length} EMPRESAS HOMOLOGADAS
        </Badge>
      </div>

      {/* Info Card */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-700">
        <Users className="w-5 h-5 text-[#5BC500] shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 block font-grotesk text-sm">
            Administración del Padrón de Terceros
          </strong>
          <span className="text-slate-600">
            Esta pantalla administra el registro formal de contratistas, datos de contacto de emergencia y cuadrillas asignadas por zona.
            Para la evaluación mensual de SLAs y penalidades, consultar el módulo Batch correspondiente.
          </span>
        </div>
      </div>

      {/* Contratistas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contratistas.map((c) => {
          const isLari = c.id === "CONT-LARI";
          const isObservado = c.estado === "Bajo Observación";

          return (
            <div
              key={c.id}
              className={`bg-white border rounded-2xl p-5 shadow-card-clean flex flex-col justify-between space-y-4 transition-all hover:shadow-card-hover ${
                isObservado ? "border-amber-200" : "border-slate-200"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      {c.codigo}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 font-grotesk mt-1 leading-snug">
                      {c.empresa}
                    </h3>
                  </div>
                  <Badge variant={isObservado ? "yellow" : "movistar"} size="sm">
                    {c.estado}
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 font-medium bg-[#F0F9E8] p-2 rounded-lg border border-[#C6EE94] text-[#3F8500]">
                  Especialidad: {c.especialidad}
                </p>

                <div className="space-y-1.5 text-xs text-slate-600 font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Zona Operativa:</span>
                    <span className="text-slate-800 font-bold">{c.zonaAsignada}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Tarifa Contractual:</span>
                    <span className="text-[#0070B8] font-bold">{c.tarifaHora}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Contacto Comercial / NOC:</span>
                    <span className="text-slate-700 text-[11px] block">{c.contacto}</span>
                  </div>
                </div>
              </div>

              {/* Cuadrillas preview & Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500 font-medium">
                  {c.cuadrillas.length} Cuadrillas registradas
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedEmpresa(c)}
                  className="font-medium"
                >
                  <Eye className="w-3.5 h-3.5 mr-1 text-[#019DF4]" />
                  <span>Ver Cuadrillas</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Detalle de Cuadrillas */}
      {selectedEmpresa && (
        <Modal
          isOpen={!!selectedEmpresa}
          onClose={() => setSelectedEmpresa(null)}
          title={`Cuadrillas de: ${selectedEmpresa.empresa}`}
          subtitle={`Código de Contrata: ${selectedEmpresa.codigo} · Zona: ${selectedEmpresa.zonaAsignada}`}
          footer={
            <Button variant="outline" size="sm" onClick={() => setSelectedEmpresa(null)}>
              Cerrar
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 font-sans">
              Cuadrillas de campo autorizadas para atención de incidencias preventivas y correctivas en planta externa:
            </p>

            <div className="space-y-2.5">
              {selectedEmpresa.cuadrillas.map((q: any) => (
                <div
                  key={q.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 font-mono"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HardHat className="w-4 h-4 text-[#5BC500]" />
                      <strong className="text-slate-900 font-grotesk text-sm">{q.nombre}</strong>
                    </div>
                    <Badge variant={q.estado === "En ruta" || q.estado === "En ejecución" ? "blue" : "gray"} size="sm">
                      {q.estado}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                    <div>
                      <span className="text-slate-400 block">Líder de Cuadrilla:</span>
                      <span className="font-bold text-slate-800">{q.lider}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Técnicos Habilitados:</span>
                      <span className="font-bold text-slate-800">{q.tecnicos} personas</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block">Vehículo / Logística:</span>
                      <span className="text-slate-700">{q.vehiculo}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
