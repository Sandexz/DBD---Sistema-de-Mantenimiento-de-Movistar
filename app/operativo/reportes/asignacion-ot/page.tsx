"use client";

// OPERATIVO › REPORTES › Papeleta de Asignación de OT
import React from "react";
import { ReportePage } from "@/components/sgmr/reporte-page";
import { DocFirmas, DocGrid, DocSection, DocSheet } from "@/components/sgmr/doc-sheet";
import { CriticidadBadge, Pill, TipoOtTag, toneOt } from "@/components/sgmr/ui";
import { useCatalogos, useSgmr } from "@/lib/store";
import { RADIO_CHECKIN_M, actividadesPara, fmtCoord, medicionSugerida } from "@/lib/data";
import { fmtFecha, fmtFechaHora } from "@/lib/fechas";
import type { OrdenTrabajo } from "@/lib/types";

function Papeleta({ ot }: { ot: OrdenTrabajo }) {
  const { sesion, ahora } = useSgmr();
  const cat = useCatalogos();
  const a = cat.activo(ot.activoId);
  const c = cat.cuadrilla(ot.cuadrillaId);
  const ctr = cat.contratista(c?.contratistaId);
  const central = cat.central(a?.centralId);
  const zona = cat.zona(a?.zonaId);
  const ticket = cat.ticket(ot.ticketId);
  const plan = cat.plan(ot.planId);

  return (
    <DocSheet
      titulo="Papeleta de Asignación de OT"
      codigo="SGMR-OP-R01"
      numero={ot.id.replace("OT-", "PA-")}
      emitido={fmtFechaHora(ahora)}
      estado={
        <div className="flex items-center gap-2">
          <TipoOtTag tipo={ot.tipo} />
          <Pill tone={toneOt(ot.status)}>{ot.status}</Pill>
        </div>
      }
    >
      <DocSection titulo="1. Datos de la orden">
        <DocGrid
          items={[
            ["N.º de OT", <span key="id" className="font-mono font-bold">{ot.id}</span>],
            ["Tipo de mantenimiento", ot.tipo],
            ["Criticidad", <CriticidadBadge key="c" c={ot.criticality} />],
            ["Fecha de emisión", fmtFechaHora(ot.createdAt)],
            ["Fecha programada", fmtFecha(ot.fechaProgramada)],
            ["SLA máximo de atención", ot.slaHours],
            ["Origen", ot.origin],
            ["Documento de origen", ticket ? `Ticket ${ticket.id}` : plan ? `Plan ${plan.id} (${plan.periodicidad})` : "Alarma directa"],
            ["Cliente / área usuaria", ot.cliente],
          ]}
        />
      </DocSection>

      <DocSection titulo="2. Activo e ubicación">
        <DocGrid
          items={[
            ["Código", <span key="a" className="font-mono">{a?.codigo}</span>],
            ["Tipo", a?.tipo],
            ["Criticidad del activo", a?.criticidad],
            ["Descripción", a?.descripcion],
            ["Central / zona", `${central?.nombre ?? "—"} · ${zona?.nombre ?? "—"}`],
            ["Coordenadas", a ? fmtCoord(a.lat, a.lng) : ot.coordinates],
            ["Dirección", a?.direccion],
          ]}
        />
      </DocSection>

      <DocSection titulo="3. Cuadrilla asignada">
        <DocGrid
          items={[
            ["Cuadrilla", c ? `${c.id} ${c.nombre}` : "Sin asignar"],
            ["Líder", c?.lider],
            ["Integrantes", c ? String(c.integrantes) : "—"],
            ["Especialidad", c?.especialidad],
            ["Empresa contratista", ctr?.empresa],
            ["Jefe de zona", zona?.jefeZona],
          ]}
        />
      </DocSection>

      <DocSection titulo="4. Trabajo a realizar">
        <p className="mb-2 font-semibold">{ot.actividad}</p>
        <ol className="list-decimal space-y-0.5 pl-5 text-mv-ink-2">
          {actividadesPara(ot.tipo).map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ol>
        <p className="mt-2 text-mv-ink-2">
          <strong className="text-mv-ink">Medición exigida:</strong> {a ? medicionSugerida(a.tipo) : "—"}
        </p>
        <p className="mt-1 text-mv-ink-2">
          <strong className="text-mv-ink">Materiales previstos:</strong> {ot.materials || "Material estándar de diagnóstico"}
        </p>
      </DocSection>

      <DocSection titulo="5. Condiciones obligatorias en campo">
        <ul className="list-disc space-y-0.5 pl-5 text-mv-ink-2">
          <li>Check-in con GPS a {RADIO_CHECKIN_M} m o menos del activo antes de iniciar.</li>
          <li>Análisis de Trabajo Seguro (ATS) aprobado y autorizado por el supervisor antes de ejecutar.</li>
          <li>Descargo de materiales contra el stock de la cuadrilla (vale de consumo).</li>
          <li>Cierre solo con fotografía, medición final y firma de conformidad.</li>
        </ul>
      </DocSection>

      <DocFirmas
        firmas={[
          { rol: "Emitido por (NOC / Supervisión)", nombre: sesion?.usuario, firmado: true },
          { rol: "Recibido por (líder de cuadrilla)", nombre: c?.lider, firmado: ot.status !== "ASIGNADA" && ot.status !== "PENDIENTE" },
        ]}
      />
    </DocSheet>
  );
}

export default function Page() {
  return (
    <ReportePage
      fn="rep-asignacion"
      criterio="Disponible para órdenes con cuadrilla asignada."
      aplica={(o) => !!o.cuadrillaId}
      render={(ot) => <Papeleta ot={ot} />}
    />
  );
}
