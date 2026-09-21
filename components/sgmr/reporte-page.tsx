"use client";

// Plantilla común de los reportes operativos: selector de OT, impresión y hoja documental.
import React from "react";
import { Printer, FileSearch } from "lucide-react";
import { AppShell } from "./shell";
import { Btn, Field, Select, Pill, toneOt } from "./ui";
import { SinDocumento } from "./doc-sheet";
import { useSgmr } from "@/lib/store";
import { useQueryParam } from "@/lib/use-query";
import type { OrdenTrabajo } from "@/lib/types";
import type { Datos } from "@/lib/store";

export function ReportePage({
  fn,
  aplica,
  criterio,
  render,
}: {
  fn: string;
  /** qué OT tienen información suficiente para emitir el documento */
  aplica: (ot: OrdenTrabajo, d: Datos) => boolean;
  criterio: string;
  render: (ot: OrdenTrabajo) => React.ReactNode;
}) {
  const { datos, sesion } = useSgmr();
  const [otParam, setOtParam, leido] = useQueryParam("ot");

  const visibles = datos.ots.filter(
    (o) => sesion?.rol !== "TECNICO" || (sesion.cuadrillaId && o.cuadrillaId === sesion.cuadrillaId)
  );
  const disponibles = visibles.filter((o) => aplica(o, datos));
  const pedida = otParam ? visibles.find((o) => o.id === otParam) : undefined;
  const ot = leido ? pedida ?? disponibles[0] : undefined;
  const emitible = ot ? aplica(ot, datos) : false;

  return (
    <AppShell
      fn={fn}
      acciones={
        <Btn variant="primary" icon={<Printer className="h-4 w-4" />} onClick={() => window.print()} disabled={!emitible}>
          Imprimir / PDF
        </Btn>
      }
    >
      <div className="no-print flex flex-wrap items-end gap-3 rounded-lg border border-mv-line bg-mv-surface-2 p-3">
        <Field label="Orden de trabajo" className="min-w-[280px] flex-1" hint={criterio}>
          <Select value={ot?.id ?? ""} onChange={(e) => setOtParam(e.target.value || null)}>
            {disponibles.length === 0 && <option value="">Sin órdenes disponibles</option>}
            {pedida && !disponibles.includes(pedida) && (
              <option value={pedida.id}>
                {pedida.id} · {pedida.status} (sin información suficiente)
              </option>
            )}
            {disponibles.map((o) => (
              <option key={o.id} value={o.id}>
                {o.id} · {o.tipo === "PREVENTIVO" ? "Preventiva" : "Correctiva"} · {o.activoId} · {o.status}
              </option>
            ))}
          </Select>
        </Field>
        {ot && (
          <div className="flex items-center gap-2 pb-5 text-xs text-mv-ink-2">
            Estado: <Pill tone={toneOt(ot.status)}>{ot.status}</Pill>
          </div>
        )}
      </div>

      {!ot ? (
        <SinDocumento>
          <FileSearch className="mx-auto mb-2 h-6 w-6 text-mv-muted" />
          No hay órdenes con la información necesaria para emitir este documento.
        </SinDocumento>
      ) : !emitible ? (
        <SinDocumento>
          <FileSearch className="mx-auto mb-2 h-6 w-6 text-mv-muted" />
          La orden {ot.id} aún no reúne la información para este documento. {criterio}
        </SinDocumento>
      ) : (
        render(ot)
      )}
    </AppShell>
  );
}
