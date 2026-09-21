"use client";

// OPERATIVO › REPORTES › Papeleta de Análisis de Trabajo Seguro (ATS)
import React from "react";
import { ReportePage } from "@/components/sgmr/reporte-page";
import { DocFirmas, DocGrid, DocSection, DocSheet } from "@/components/sgmr/doc-sheet";
import { Pill, TipoOtTag } from "@/components/sgmr/ui";
import { useCatalogos } from "@/lib/store";
import { EPP_ATS, RIESGOS_ATS, fmtCoord, fmtDistancia } from "@/lib/data";
import { validarAts } from "@/lib/validaciones";
import { fmtFechaHora } from "@/lib/fechas";
import type { OrdenTrabajo } from "@/lib/types";

function Marca({ ok }: { ok: boolean }) {
  return (
    <span className={`inline-flex h-4 w-4 items-center justify-center rounded-[3px] border text-[10px] font-bold ${ok ? "border-mv-green-700 bg-mv-green-700 text-white" : "border-mv-line-2 bg-white"}`}>
      {ok ? "✓" : ""}
    </span>
  );
}

function PapeletaAts({ ot }: { ot: OrdenTrabajo }) {
  const cat = useCatalogos();
  const ej = cat.ejecucion(ot.id)!;
  const ats = ej.ats!;
  const a = cat.activo(ot.activoId);
  const c = cat.cuadrilla(ot.cuadrillaId);
  const checks = validarAts(ats);

  return (
    <DocSheet
      titulo="Papeleta de Análisis de Trabajo Seguro (ATS)"
      codigo="SGMR-OP-R04"
      numero={ot.id.replace("OT-", "ATS-")}
      emitido={fmtFechaHora(ats.registradoEn)}
      estado={
        <div className="flex items-center gap-2">
          <TipoOtTag tipo={ot.tipo} />
          <Pill tone={ej.atsValido ? "ok" : "crit"}>{ej.atsValido ? "ATS APROBADO" : "ATS OBSERVADO"}</Pill>
        </div>
      }
    >
      <DocSection titulo="1. Trabajo y lugar">
        <DocGrid
          items={[
            ["Orden de trabajo", <span key="o" className="font-mono font-bold">{ot.id}</span>],
            ["Actividad", ot.actividad],
            ["Activo", `${a?.codigo} — ${a?.tipo}`],
            ["Dirección", a?.direccion],
            ["Cuadrilla", c ? `${c.id} ${c.nombre} (${c.integrantes} integrantes)` : "—"],
            ["Check-in GPS", ej.checkIn ? `${fmtCoord(ej.checkIn.lat, ej.checkIn.lng)} · ${fmtDistancia(ej.checkIn.distanciaM)}` : "—"],
          ]}
        />
      </DocSection>

      <DocSection titulo="2. Riesgos identificados">
        <ul className="grid gap-1.5 sm:grid-cols-3">
          {RIESGOS_ATS.map((r) => (
            <li key={r} className="flex items-center gap-2">
              <Marca ok={ats.riesgos.includes(r)} /> {r}
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection titulo="3. Condiciones">
        <DocGrid
          items={[
            ["Condición climática", ats.clima],
            ["Uso de arnés", ats.arnes],
            ["Hora de registro", fmtFechaHora(ats.registradoEn)],
          ]}
        />
      </DocSection>

      <DocSection titulo="4. Equipo de protección personal verificado">
        <ul className="grid gap-1.5 sm:grid-cols-3">
          {EPP_ATS.map((e) => (
            <li key={e} className="flex items-center gap-2">
              <Marca ok={ats.epp.includes(e)} /> {e}
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection titulo="5. Validación del sistema">
        <ul className="space-y-1">
          {checks.map((ch) => (
            <li key={ch.id} className="flex items-start gap-2">
              <span className={ch.ok ? "text-st-ok" : "text-st-crit"}>{ch.ok ? "✓" : "✗"}</span>
              <span>
                <strong>{ch.etiqueta}:</strong> {ch.detalle}
              </span>
            </li>
          ))}
        </ul>
      </DocSection>

      <DocFirmas
        firmas={[
          { rol: "Líder de cuadrilla", nombre: c?.lider, firmado: true },
          { rol: "Supervisor que autoriza", nombre: ats.autorizadoPor, firmado: ats.autorizado },
        ]}
      />
    </DocSheet>
  );
}

export default function Page() {
  return (
    <ReportePage
      fn="rep-ats"
      criterio="Disponible para órdenes con ATS registrado en campo."
      aplica={(o, d) => !!d.ejecuciones.find((e) => e.otId === o.id)?.ats}
      render={(ot) => <PapeletaAts ot={ot} />}
    />
  );
}
