"use client";

// OPERATIVO › DATA ENTRY › Gestión de Órdenes de Trabajo
// Conserva todo lo que ofrecía /ots (KPIs, formulario de despacho, tabla con búsqueda,
// filtros y detalle) y agrega tipo de OT, asignación, despacho y enlace con tickets/planes.
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Activity, AlertTriangle, HardHat, Clock, FileText, Smartphone, Navigation, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/sgmr/shell";
import { OtForm, type NewOtPayload } from "@/components/ot-form";
import { OtTable } from "@/components/ot-table";
import { Stat } from "@/components/sgmr/ui";
import { useSgmr, type Datos } from "@/lib/store";
import { puedeAcceder } from "@/lib/navigation";
import { useQueryParam } from "@/lib/use-query";
import { minutosEntre } from "@/lib/fechas";

export default function GestionOtsPage() {
  const { datos, sesion, crearOt, mutar, notificar } = useSgmr();
  const [ticket] = useQueryParam("ticket");
  const [snapshot, setSnapshot] = useState<Datos | null>(null);
  const ots = datos.ots;

  const handleAddOt = (p: NewOtPayload) => {
    setSnapshot(datos);
    const ot = crearOt({
      tipo: p.tipo,
      ticketId: p.ticketId,
      planId: p.planId,
      activoId: p.activoId,
      origin: p.origin,
      criticality: p.criticality,
      slaHours: p.slaHours,
      cuadrillaId: p.cuadrillaId,
      actividad: p.actividad,
      materials: p.materials,
      despachar: p.despachar,
    });
    notificar(ot.status === "EN RUTA" ? `${ot.id} despachada a ${ot.crew}.` : `${ot.id} generada (pendiente de asignación).`);
    return ot;
  };

  const handleResetLast = () => {
    if (!snapshot) return;
    mutar(() => snapshot, { accion: "Se deshizo la última OT generada", ref: "—" });
    setSnapshot(null);
    notificar("Se deshizo la última orden generada.", "info");
  };

  const kpi = useMemo(() => {
    const activas = ots.filter((o) => o.status !== "CERRADA");
    const altas = activas.filter((o) => o.criticality === "CRÍTICA" || o.criticality === "ALTA").length;
    const enRuta = datos.tracking.filter((t) => t.estado === "En ruta").length;
    const cerradasCorr = ots.filter((o) => o.status === "CERRADA" && o.tipo === "CORRECTIVO" && o.cerradaEn);
    const enPlazo = cerradasCorr.filter((o) => {
      const s = datos.sla.find((x) => x.severidad === o.criticality);
      return s ? minutosEntre(o.createdAt, o.cerradaEn!) <= s.solucionMin : true;
    }).length;
    const pct = cerradasCorr.length ? (enPlazo / cerradasCorr.length) * 100 : 100;
    return {
      activas: activas.length,
      prev: activas.filter((o) => o.tipo === "PREVENTIVO").length,
      corr: activas.filter((o) => o.tipo === "CORRECTIVO").length,
      altas,
      enRuta,
      pct,
      enPlazo,
      total: cerradasCorr.length,
    };
  }, [ots, datos.tracking, datos.sla]);

  const verCampo = puedeAcceder(sesion?.rol, "checkin");

  return (
    <AppShell
      fn="ots"
      acciones={
        verCampo ? (
          <Link
            href="/operativo/campo/checkin"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-mv-line-2 bg-white px-3.5 text-[13px] font-semibold text-mv-ink hover:bg-mv-surface"
          >
            <Smartphone className="h-4 w-4 text-mv-teal-700" /> Ver App del Técnico <ArrowRight className="h-3.5 w-3.5 text-mv-muted" />
          </Link>
        ) : (
          <Link
            href="/gerencial/consulta/tracking"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-mv-line-2 bg-white px-3.5 text-[13px] font-semibold text-mv-ink hover:bg-mv-surface"
          >
            <Navigation className="h-4 w-4 text-mv-teal-700" /> Tracking de cuadrillas <ArrowRight className="h-3.5 w-3.5 text-mv-muted" />
          </Link>
        )
      }
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Órdenes activas" value={kpi.activas} hint={`${kpi.corr} correctivas · ${kpi.prev} preventivas`} icon={<Activity className="h-4 w-4" />} />
        <Stat label="Alta / Crítica activas" value={kpi.altas} tone="crit" hint="Prioridad NOC" icon={<AlertTriangle className="h-4 w-4" />} />
        <Stat label="Cuadrillas en ruta" value={kpi.enRuta} tone="info" hint={`de ${datos.cuadrillas.length} cuadrillas registradas`} icon={<HardHat className="h-4 w-4" />} />
        <Stat
          label="Cumplimiento SLA (correctivas)"
          value={`${kpi.pct.toFixed(1)} %`}
          tone={kpi.pct >= 95 ? "ok" : "warn"}
          hint={`${kpi.enPlazo} de ${kpi.total} cerradas en plazo · meta > 95 %`}
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      <OtForm onAddOt={handleAddOt} onResetLast={handleResetLast} puedeDeshacer={!!snapshot} ticketInicial={ticket} />

      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-mv-ink">
            <FileText className="h-4 w-4 text-mv-green-700" /> Órdenes de trabajo en sistema ({ots.length})
          </h2>
          <span className="text-[11px] text-mv-muted">Pulse una fila para ver la trazabilidad completa</span>
        </div>
        <OtTable ots={ots} />
      </section>
    </AppShell>
  );
}
