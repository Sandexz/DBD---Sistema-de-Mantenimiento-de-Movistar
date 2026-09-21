"use client";

// OPERATIVO › REPORTES › Constancia de Conformidad de Servicio
import React from "react";
import { ReportePage } from "@/components/sgmr/reporte-page";
import { DocFirmas, DocGrid, DocSection, DocSheet } from "@/components/sgmr/doc-sheet";
import { Pill, TipoOtTag } from "@/components/sgmr/ui";
import { useCatalogos, useSgmr } from "@/lib/store";
import { fmtDistancia } from "@/lib/data";
import { fmtFechaHora, fmtMinutos, minutosEntre } from "@/lib/fechas";
import type { OrdenTrabajo } from "@/lib/types";

function Constancia({ ot }: { ot: OrdenTrabajo }) {
  const { ahora } = useSgmr();
  const cat = useCatalogos();
  const a = cat.activo(ot.activoId);
  const c = cat.cuadrilla(ot.cuadrillaId);
  const ej = cat.ejecucion(ot.id)!;
  const ticket = cat.ticket(ot.ticketId);
  const zona = cat.zona(a?.zonaId);
  const duracion = ej.checkIn && ot.cerradaEn ? minutosEntre(ej.checkIn.hora, ot.cerradaEn) : null;

  return (
    <DocSheet
      titulo="Constancia de Conformidad de Servicio"
      codigo="SGMR-OP-R02"
      numero={ot.id.replace("OT-", "CC-")}
      emitido={fmtFechaHora(ot.cerradaEn ?? ahora)}
      estado={
        <div className="flex items-center gap-2">
          <TipoOtTag tipo={ot.tipo} />
          <Pill tone={ej.conformidad === "Conforme" ? "ok" : "warn"}>{ej.conformidad}</Pill>
        </div>
      }
    >
      <DocSection titulo="1. Servicio atendido">
        <DocGrid
          items={[
            ["Orden de trabajo", <span key="o" className="font-mono font-bold">{ot.id}</span>],
            ["Ticket", ticket?.id ?? "—"],
            ["Plan", ot.planId ?? "—"],
            ["Activo", `${a?.codigo} — ${a?.descripcion}`],
            ["Dirección", a?.direccion],
            ["Cliente / área usuaria", ot.cliente],
          ]}
        />
      </DocSection>

      <DocSection titulo="2. Tiempos de atención">
        <DocGrid
          cols={4}
          items={[
            ["Emisión de la OT", fmtFechaHora(ot.createdAt)],
            ["Arribo (check-in GPS)", ej.checkIn ? `${fmtFechaHora(ej.checkIn.hora)} · ${fmtDistancia(ej.checkIn.distanciaM)}` : "—"],
            ["Cierre", fmtFechaHora(ot.cerradaEn)],
            ["Duración en sitio", duracion !== null ? fmtMinutos(duracion) : "—"],
          ]}
        />
      </DocSection>

      <DocSection titulo="3. Trabajo realizado">
        <ul className="grid gap-1 sm:grid-cols-2">
          {ej.actividades.map((x) => (
            <li key={x} className="flex items-start gap-1.5">
              <span className="text-st-ok">✓</span> {x}
            </li>
          ))}
        </ul>
        {ot.tipo === "CORRECTIVO" ? (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <p>
              <strong>Causa de la falla:</strong> {ej.causa ?? "Registrada en la atención"}
            </p>
            <p>
              <strong>Acción correctiva:</strong> {ej.accion ?? ot.actividad}
            </p>
          </div>
        ) : (
          <p className="mt-3">
            <strong>Hallazgos:</strong> {ej.hallazgos || "Sin hallazgos que requieran acción correctiva."}
            {ej.requiereCorrectivo && <span className="ml-1 font-semibold text-st-warn-fg">(Requiere mantenimiento correctivo)</span>}
          </p>
        )}
      </DocSection>

      <DocSection titulo="4. Resultado técnico">
        <p className="rounded-md border border-mv-line bg-mv-surface-2 px-3 py-2 font-mono text-[12px]">{ej.evidencia}</p>
        <p className="mt-2 text-mv-ink-2">Evidencia fotográfica: {ej.foto ? "adjunta en el sistema" : "no adjunta"}.</p>
      </DocSection>

      <DocSection titulo="5. Conformidad">
        <p>
          El firmante declara el servicio <strong>{ej.conformidad?.toLowerCase()}</strong>.
          {ej.observacion && <> Observación: {ej.observacion}</>}
        </p>
      </DocSection>

      <DocFirmas
        firmas={[
          { rol: `Técnico responsable (${c?.id ?? "—"})`, nombre: c?.lider, firmado: true },
          { rol: "Conformidad del servicio", nombre: ej.firmante, firmado: ej.firma },
          { rol: "Jefe de zona", nombre: zona?.jefeZona, firmado: false },
        ]}
      />
    </DocSheet>
  );
}

export default function Page() {
  return (
    <ReportePage
      fn="rep-conformidad"
      criterio="Disponible para órdenes cerradas con firma de conformidad."
      aplica={(o, d) => o.status === "CERRADA" && !!d.ejecuciones.find((e) => e.otId === o.id)?.firma}
      render={(ot) => <Constancia ot={ot} />}
    />
  );
}
