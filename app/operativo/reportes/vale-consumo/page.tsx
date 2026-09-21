"use client";

// OPERATIVO › REPORTES › Vale Instantáneo de Consumo de Materiales
import React from "react";
import { ReportePage } from "@/components/sgmr/reporte-page";
import { DocFirmas, DocGrid, DocSection, DocSheet } from "@/components/sgmr/doc-sheet";
import { TipoOtTag } from "@/components/sgmr/ui";
import { useCatalogos, useSgmr } from "@/lib/store";
import { MATERIALES } from "@/lib/data";
import { fmtFechaHora } from "@/lib/fechas";
import type { OrdenTrabajo } from "@/lib/types";

function Vale({ ot }: { ot: OrdenTrabajo }) {
  const { datos } = useSgmr();
  const cat = useCatalogos();
  const consumos = datos.consumos.filter((c) => c.otId === ot.id);
  const c = cat.cuadrilla(ot.cuadrillaId);
  const ctr = cat.contratista(c?.contratistaId);
  const stock = datos.stock[ot.cuadrillaId ?? ""] ?? {};
  const total = consumos.reduce((s, x) => s + x.cantidad, 0);
  const primero = consumos[0];

  return (
    <DocSheet
      titulo="Vale Instantáneo de Consumo de Materiales"
      codigo="SGMR-OP-R03"
      numero={primero ? primero.id : "—"}
      emitido={fmtFechaHora(primero?.fecha)}
      estado={<TipoOtTag tipo={ot.tipo} />}
    >
      <DocSection titulo="1. Referencia">
        <DocGrid
          items={[
            ["Orden de trabajo", <span key="o" className="font-mono font-bold">{ot.id}</span>],
            ["Activo", ot.infra],
            ["Cuadrilla", c ? `${c.id} ${c.nombre}` : "—"],
            ["Técnico que descarga", primero?.tecnico ?? c?.lider],
            ["Contratista", ctr?.empresa],
            ["Líneas del vale", String(consumos.length)],
          ]}
        />
      </DocSection>

      <DocSection titulo="2. Materiales descargados">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[12px]">
            <thead>
              <tr className="border-b-2 border-mv-ink/70 text-[10.5px] uppercase tracking-wide text-mv-ink-2">
                <th className="py-1.5 pr-2">N.º vale</th>
                <th className="py-1.5 pr-2">Código</th>
                <th className="py-1.5 pr-2">Descripción</th>
                <th className="py-1.5 pr-2">Unidad</th>
                <th className="py-1.5 pr-2 text-right">Cantidad</th>
                <th className="py-1.5 pr-2 text-right">Saldo en cuadrilla</th>
                <th className="py-1.5">Fecha y hora</th>
              </tr>
            </thead>
            <tbody>
              {consumos.map((x) => {
                const m = MATERIALES.find((y) => y.codigo === x.codigo);
                return (
                  <tr key={x.id} className="border-b border-mv-line">
                    <td className="py-1.5 pr-2 font-mono">{x.id}</td>
                    <td className="py-1.5 pr-2 font-mono">{x.codigo}</td>
                    <td className="py-1.5 pr-2">{m?.nombre}</td>
                    <td className="py-1.5 pr-2">{m?.unidad}</td>
                    <td className="num py-1.5 pr-2 text-right font-semibold">{x.cantidad}</td>
                    <td className="num py-1.5 pr-2 text-right">{stock[x.codigo] ?? 0}</td>
                    <td className="py-1.5 font-mono">{x.fecha.slice(11)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="py-2 text-right font-semibold">
                  Total de unidades
                </td>
                <td className="num py-2 pr-2 text-right font-bold">{total}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="mt-2 text-[11px] text-mv-muted">
          La cantidad de cada línea fue validada contra el stock de la cuadrilla al momento del descargo. La valorización y
          liquidación de materiales corresponde al proceso Batch.
        </p>
      </DocSection>

      <DocFirmas
        firmas={[
          { rol: "Técnico que consume", nombre: primero?.tecnico ?? c?.lider, firmado: true },
          { rol: "Control de almacén", nombre: "Almacén de planta externa" },
        ]}
      />
    </DocSheet>
  );
}

export default function Page() {
  return (
    <ReportePage
      fn="rep-vale"
      criterio="Disponible para órdenes con materiales descargados."
      aplica={(o, d) => d.consumos.some((c) => c.otId === o.id)}
      render={(ot) => <Vale ot={ot} />}
    />
  );
}
