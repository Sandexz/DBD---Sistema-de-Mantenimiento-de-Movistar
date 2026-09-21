"use client";

import React, { useState } from "react";
import {
  FilePlus2,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Send,
  RotateCcw,
  Network,
  Clock,
  MapPin,
  HardHat,
  Database,
  Radio,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import initialOts from "@/mock-data/ots.json";
import initialActivos from "@/mock-data/activos.json";

export default function TicketsDataEntryPage() {
  const [tickets, setTickets] = useState<any[]>(initialOts);

  // Form state
  const [formData, setFormData] = useState({
    tipoIncidencia: "Avería por Atenuación Óptica",
    tipoMantenimiento: "CORRECTIVO",
    activoCodigo: "MUF-TRONCAL-48",
    ubicacion: "Panamericana Norte Km 18.5 Poste 104, Los Olivos",
    zona: "Norte",
    severidad: "ALTA",
    prioridad: "P2 - Alta (SLA 2 horas)",
    origen: "Detección automática (NOC/SNMP Trap)",
    descripcion: "Pérdida de potencia óptica superior a 4.5 dBm en puerto troncal",
  });

  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lista de activos que actualmente tienen tickets abiertos (no cerrados)
  const activosConTicketAbierto = tickets
    .filter((t) => t.status.toLowerCase() !== "cerrada" && t.status.toLowerCase() !== "cerrado")
    .map((t) => t.activo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessMessage(null);

    // VALIDACIÓN ACTIVA ARQUITECTÓNICA: SIN TICKETS DUPLICADOS EN EL MISMO NODO/ACTIVO
    if (activosConTicketAbierto.includes(formData.activoCodigo)) {
      setValidationError(
        `VALIDACIÓN ACTIVA RECHAZADA: El activo "${formData.activoCodigo}" ya cuenta con una incidencia activa en curso. La regla arquitectónica impide tickets duplicados en el mismo elemento de red.`
      );
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const newId = `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const newRecord: any = {
        id: newId,
        tipo: formData.tipoMantenimiento,
        activo: formData.activoCodigo,
        origin: formData.origen,
        criticality: formData.severidad,
        prioridad: formData.prioridad,
        zona: formData.zona,
        slaHours: formData.severidad === "CRÍTICA" ? "1 hora" : "2 horas",
        infra: `${formData.activoCodigo} - ${formData.ubicacion}`,
        crew: "Por asignar en despacho",
        status: "Registrado",
        statusBadge: "blue",
        coordinates: "-12.0463, -77.0427",
        ubicacion: formData.ubicacion,
        createdAt: new Date().toISOString().replace("T", " ").slice(0, 16),
        fechaProgramada: new Date().toISOString().replace("T", " ").slice(0, 16),
        materials: "Por determinar en inspección",
      };

      setTickets([newRecord, ...tickets]);
      setSuccessMessage(
        `¡Ticket ${newId} registrado exitosamente con validación de no duplicidad conforme!`
      );
    }, 600);
  };

  const handleActivoChange = (codigo: string) => {
    const activo = initialActivos.find((a) => a.codigo === codigo);
    if (activo) {
      setFormData({
        ...formData,
        activoCodigo: codigo,
        ubicacion: activo.direccion,
        zona: activo.zonaId,
        severidad: activo.criticidad.toUpperCase() === "ALTA" ? "ALTA" : "MEDIA",
      });
    }
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
            <span className="text-xs text-slate-400 font-mono">/ Data Entry Transaccional</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-grotesk tracking-tight text-slate-900 mt-1">
            Registro de Tickets e Incidencias
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Captura de eventos de red con validación activa obligatoria contra duplicidad en el mismo nodo
          </p>
        </div>

        {/* Validation Pill */}
        <div className="inline-flex items-center gap-1.5 bg-[#F0F9E8] border border-[#C6EE94] px-3 py-1.5 rounded-lg text-xs font-mono text-[#3F8500] font-bold">
          <ShieldCheck className="w-4 h-4 text-[#5BC500]" />
          <span>✓ Validación: Sin tickets duplicados</span>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card-clean max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-150">
            <div className="flex items-center gap-2 font-grotesk font-bold text-slate-900 text-sm">
              <FilePlus2 className="w-4 h-4 text-[#5BC500]" />
              <span>Formulario de Ingreso de Incidencia Operativa</span>
            </div>
            <Badge variant={formData.tipoMantenimiento === "PREVENTIVO" ? "movistar" : "yellow"} size="sm">
              {formData.tipoMantenimiento}
            </Badge>
          </div>

          {/* Error Banner if Duplicate Detected */}
          {validationError && (
            <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs font-mono flex items-start gap-2.5 animate-in fade-in">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">REGLA ARQUITECTÓNICA ACTIVADA:</strong>
                <span>{validationError}</span>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-mono flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Tipo de Mantenimiento */}
            <div className="space-y-1.5">
              <label className="text-slate-700 font-semibold block">Tipo de Mantenimiento</label>
              <select
                value={formData.tipoMantenimiento}
                onChange={(e) => setFormData({ ...formData, tipoMantenimiento: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
              >
                <option value="CORRECTIVO">CORRECTIVO (Atención de Avería / Falla)</option>
                <option value="PREVENTIVO">PREVENTIVO (Inspección / Cambio Anticipado)</option>
              </select>
            </div>

            {/* Tipo de Incidencia */}
            <div className="space-y-1.5">
              <label className="text-slate-700 font-semibold block">Tipo de Incidencia / Evento</label>
              <select
                value={formData.tipoIncidencia}
                onChange={(e) => setFormData({ ...formData, tipoIncidencia: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                <option value="Avería por Atenuación Óptica">Avería por Atenuación Óptica</option>
                <option value="Corte de Fibra Troncal OSP">Corte de Fibra Troncal OSP</option>
                <option value="Fallo de Energía Comercial y Baterías">Fallo de Energía Comercial y Baterías</option>
                <option value="Avería Masiva por Obras Civiles">Avería Masiva por Obras Civiles</option>
                <option value="Reemplazo Programado de Batería">Reemplazo Programado de Batería</option>
              </select>
            </div>

            {/* Activo / Nodo con indicador de ocupado */}
            <div className="space-y-1.5">
              <label className="text-slate-700 font-semibold flex items-center justify-between">
                <span>Activo de Red Afectado</span>
                <span className="text-[10px] font-mono text-slate-400">
                  {activosConTicketAbierto.length} con ticket abierto
                </span>
              </label>
              <select
                value={formData.activoCodigo}
                onChange={(e) => handleActivoChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-medium"
              >
                {initialActivos.map((a) => {
                  const tieneTicketAbierto = activosConTicketAbierto.includes(a.codigo);
                  return (
                    <option key={a.codigo} value={a.codigo}>
                      {a.codigo} - {a.descripcion} {tieneTicketAbierto ? "(Ticket Activo)" : "✓ Libre"}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Origen */}
            <div className="space-y-1.5">
              <label className="text-slate-700 font-semibold block">Origen de Detección</label>
              <select
                value={formData.origen}
                onChange={(e) => setFormData({ ...formData, origen: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                <option value="Detección automática (NOC/SNMP Trap)">
                  Detección automática (NOC / SNMP Trap / Telemetría)
                </option>
                <option value="Call Center (Reclamo Cliente)">
                  Call Center (Reclamo Cliente Corporativo / Residencial)
                </option>
                <option value="Supervisión NOC Manual">
                  Supervisión NOC Manual (Operador de Consola)
                </option>
              </select>
            </div>

            {/* Severidad */}
            <div className="space-y-1.5">
              <label className="text-slate-700 font-semibold block">Severidad</label>
              <select
                value={formData.severidad}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    severidad: e.target.value,
                    prioridad:
                      e.target.value === "CRÍTICA"
                        ? "P1 - Crítica (SLA 1 hora)"
                        : e.target.value === "ALTA"
                        ? "P2 - Alta (SLA 2 horas)"
                        : "P3 - Media (SLA 8 horas)",
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                <option value="CRÍTICA">CRÍTICA (Afectación Core / VIP)</option>
                <option value="ALTA">ALTA (Corte OSP / Fibra Troncal)</option>
                <option value="MEDIA">MEDIA (Afectación parcial de puertos)</option>
                <option value="BAJA">BAJA (Mantenimiento menor)</option>
              </select>
            </div>

            {/* Prioridad y SLA calculado */}
            <div className="space-y-1.5">
              <label className="text-slate-700 font-semibold block">Prioridad Calculada</label>
              <input
                type="text"
                readOnly
                value={formData.prioridad}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-600 cursor-not-allowed"
              />
            </div>

            {/* Ubicación */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-slate-700 font-semibold block">Ubicación Geográfica y Referencia</label>
              <input
                type="text"
                value={formData.ubicacion}
                onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>

            {/* Descripción */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-slate-700 font-semibold block">Detalle Técnico del Incidente</label>
              <textarea
                rows={2}
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-150 flex items-center justify-end gap-3">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
            >
              <Send className="w-4 h-4 mr-1.5" />
              <span>Validar e Ingresar Ticket</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
