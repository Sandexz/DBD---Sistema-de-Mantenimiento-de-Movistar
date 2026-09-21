"use client";

// Topología geo-referenciada de la red (componente existente, conservado y mejorado):
// ahora usa el catálogo de activos real, permite filtrar por segmento o por alertas y
// muestra la ficha del activo seleccionado.
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, X } from "lucide-react";
import { useSgmr } from "@/lib/store";
import { fmtNum } from "@/lib/data";
import type { Activo, Segmento } from "@/lib/types";
import { GeoMap, LeyendaItem, type MapLine, type MapPoint } from "./sgmr/geo-map";
import { Pill, Segmented, toneActivo, CriticidadBadge } from "./sgmr/ui";

type Capa = "all" | Segmento | "alerts";

export function MapPlaceholder({ height = 380, inicial = "all" }: { height?: number; inicial?: Capa }) {
  const { datos } = useSgmr();
  const [layer, setLayer] = useState<Capa>(inicial);
  const [sel, setSel] = useState<string | null>("TRM-N48");

  const visibles = useMemo(
    () =>
      datos.activos.filter((a) =>
        layer === "all" ? true : layer === "alerts" ? a.estado !== "Operativo" : a.segmento === layer
      ),
    [datos.activos, layer]
  );

  const centralesUsadas = datos.centrales.filter((c) => visibles.some((a) => a.centralId === c.id));
  const puntos: MapPoint[] = [
    ...centralesUsadas.map((c) => ({ id: c.id, lat: c.lat, lng: c.lng, label: c.nombre, tone: "neutral" as const, kind: "central" as const })),
    ...visibles.map((a) => ({ id: a.codigo, lat: a.lat, lng: a.lng, label: a.codigo, tone: toneActivo(a.estado), kind: "activo" as const })),
  ];
  const lineas: MapLine[] = visibles
    .map((a) => {
      const c = datos.centrales.find((x) => x.id === a.centralId);
      return c ? { from: c, to: a, tone: a.estado === "Fuera de servicio" ? ("crit" as const) : ("neutral" as const), dashed: a.estado === "Fuera de servicio" } : null;
    })
    .filter(Boolean) as MapLine[];

  const activo: Activo | undefined = datos.activos.find((a) => a.codigo === sel);
  const central = datos.centrales.find((c) => c.id === activo?.centralId);

  const alertas = datos.activos.filter((a) => a.estado !== "Operativo").length;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Segmented<Capa>
          size="sm"
          value={layer}
          onChange={setLayer}
          options={[
            { value: "all", label: "Todos", count: datos.activos.length },
            { value: "Core", label: "Core" },
            { value: "Planta Externa", label: "Planta Externa" },
            { value: "Última Milla", label: "Última Milla" },
            { value: "alerts", label: "Solo alertas", count: alertas },
          ]}
        />
      </div>
      <div className="relative">
        <GeoMap
          points={puntos}
          lines={lineas}
          selected={sel}
          onSelect={(id) => datos.activos.some((a) => a.codigo === id) && setSel(id)}
          height={height}
          leyenda={
            <>
              <LeyendaItem tone="ok" label="Operativo" />
              <LeyendaItem tone="warn" label="En alerta" />
              <LeyendaItem tone="crit" label="Fuera de servicio" />
              <LeyendaItem tone="info" label="En mantenimiento" />
              <LeyendaItem tone="neutral" label="Central" shape="square" />
            </>
          }
        />
        {activo && (
          <div className="absolute bottom-12 left-3 w-[min(80%,280px)] rounded-lg border border-mv-line bg-white/95 p-3 text-xs shadow-pop backdrop-blur">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-mono text-[11px] font-semibold text-mv-ink-2">{activo.codigo}</p>
                <p className="font-semibold leading-snug text-mv-ink">{activo.descripcion}</p>
              </div>
              <div className="flex items-start gap-1">
                <Pill tone={toneActivo(activo.estado)} dot>
                  {activo.estado}
                </Pill>
                <button onClick={() => setSel(null)} className="rounded p-0.5 text-mv-muted hover:text-mv-ink" aria-label="Cerrar ficha">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
              <div>
                <dt className="text-[10px] text-mv-muted">Tipo · Segmento</dt>
                <dd className="text-mv-ink">
                  {activo.tipo} · {activo.segmento}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] text-mv-muted">Clientes</dt>
                <dd className="num text-mv-ink">{fmtNum(activo.clientes)}</dd>
              </div>
              <div>
                <dt className="text-[10px] text-mv-muted">Central</dt>
                <dd className="text-mv-ink">{central?.nombre}</dd>
              </div>
              <div>
                <dt className="text-[10px] text-mv-muted">Criticidad</dt>
                <dd>
                  <CriticidadBadge c={activo.criticidad} />
                </dd>
              </div>
            </dl>
            <p className="mt-2 flex items-center gap-1 text-[11px] text-mv-ink-2">
              <MapPin className="h-3 w-3" /> {activo.direccion}
            </p>
            <Link href={`/gerencial/parametros/activos?codigo=${activo.codigo}`} className="mt-2 inline-block text-[11px] font-semibold text-mv-green-700 hover:underline">
              Ver ficha del activo →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
