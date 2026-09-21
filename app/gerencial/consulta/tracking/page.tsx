"use client";

// GERENCIAL › Consulta › Tracking y Geolocalización
import React, { useMemo, useState } from "react";
import { Navigation, Truck, Clock } from "lucide-react";
import { AppShell } from "@/components/sgmr/shell";
import { GeoMap, LeyendaItem, type MapLine, type MapPoint } from "@/components/sgmr/geo-map";
import { EmptyState, KV, Panel, Pill, SearchInput, Select, Stat, TipoOtTag, toneTracking, cx } from "@/components/sgmr/ui";
import { useCatalogos, useSgmr } from "@/lib/store";
import { distanciaM, fmtCoord, fmtDistancia } from "@/lib/data";
import type { EstadoTracking } from "@/lib/types";

const ESTADOS: EstadoTracking[] = ["Disponible", "En ruta", "En sitio", "En ejecución", "Finalizado"];
const VEL_KMH = 25; // velocidad media urbana supuesta para el tiempo estimado de arribo

export default function TrackingPage() {
  const { datos } = useSgmr();
  const cat = useCatalogos();
  const [estado, setEstado] = useState<EstadoTracking | "">("");
  const [zona, setZona] = useState("");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<string | null>("C-01");

  const filas = useMemo(
    () =>
      datos.cuadrillas.map((c) => {
        const tr = datos.tracking.find((t) => t.cuadrillaId === c.id);
        const ot = cat.ot(tr?.otId);
        const destino = cat.activo(ot?.activoId);
        const dist = tr && destino ? distanciaM(tr.lat, tr.lng, destino.lat, destino.lng) : null;
        return { c, tr, estado: (tr?.estado ?? "Disponible") as EstadoTracking, ot, destino, dist };
      }),
    [datos.cuadrillas, datos.tracking, cat]
  );

  const filtradas = filas.filter(
    (f) =>
      (!estado || f.estado === estado) &&
      (!zona || f.c.zonaId === zona) &&
      (!q || [f.c.id, f.c.nombre, f.c.lider, f.ot?.id ?? ""].some((v) => v.toLowerCase().includes(q.toLowerCase())))
  );

  const puntos: MapPoint[] = [
    ...filtradas
      .filter((f) => f.destino && f.estado !== "Finalizado")
      .map((f) => ({ id: `dest-${f.c.id}`, lat: f.destino!.lat, lng: f.destino!.lng, label: f.destino!.codigo, tone: "neutral" as const, kind: "activo" as const })),
    ...filtradas
      .filter((f) => f.tr)
      .map((f) => ({ id: f.c.id, lat: f.tr!.lat, lng: f.tr!.lng, label: `${f.c.id} ${f.c.nombre}`, tone: toneTracking(f.estado), kind: "cuadrilla" as const })),
  ];
  const lineas: MapLine[] = filtradas
    .filter((f) => f.tr && f.destino && (f.estado === "En ruta" || f.estado === "En sitio"))
    .map((f) => ({ from: f.tr!, to: f.destino!, tone: toneTracking(f.estado), dashed: f.estado === "En ruta" }));

  const s = filas.find((f) => f.c.id === sel);

  return (
    <AppShell fn="tracking">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {ESTADOS.map((e) => (
          <Stat
            key={e}
            label={e}
            value={filas.filter((f) => f.estado === e).length}
            tone={toneTracking(e) === "neutral" ? undefined : toneTracking(e)}
            onClick={() => setEstado(estado === e ? "" : e)}
            active={estado === e}
          />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <SearchInput className="w-full max-w-xs" value={q} onChange={setQ} placeholder="Cuadrilla, técnico u OT" />
            <Select className="w-auto" value={zona} onChange={(e) => setZona(e.target.value)}>
              <option value="">Todas las zonas</option>
              {datos.zonas.map((z) => (
                <option key={z.id} value={z.id}>{z.nombre}</option>
              ))}
            </Select>
          </div>
          <GeoMap
            points={puntos}
            lines={lineas}
            selected={sel}
            onSelect={(id) => !id.startsWith("dest-") && setSel(id)}
            height={460}
            leyenda={
              <>
                {ESTADOS.map((e) => (
                  <LeyendaItem key={e} tone={toneTracking(e)} label={e} shape="diamond" />
                ))}
                <LeyendaItem tone="neutral" label="Activo destino" />
              </>
            }
          />
        </div>

        <Panel title={s ? `${s.c.id} ${s.c.nombre}` : "Cuadrilla"} subtitle={s ? `${s.c.lider} · ${cat.contratista(s.c.contratistaId)?.empresa}` : undefined} icon={<Truck className="h-4 w-4" />}>
          {!s ? (
            <EmptyState title="Seleccione una cuadrilla en el mapa o la tabla" />
          ) : (
            <div className="space-y-4 text-[13px]">
              <div className="flex items-center gap-2">
                <Pill tone={toneTracking(s.estado)} dot>{s.estado}</Pill>
                {s.tr && <span className="flex items-center gap-1 text-xs text-mv-ink-2"><Clock className="h-3 w-3" /> act. {s.tr.actualizado}</span>}
              </div>
              <dl className="grid grid-cols-2 gap-3">
                <KV k="Zona" v={cat.zona(s.c.zonaId)?.nombre} />
                <KV k="Integrantes" v={s.c.integrantes} />
                <KV k="Especialidad" v={s.c.especialidad} />
                <KV k="Posición" v={s.tr ? fmtCoord(s.tr.lat, s.tr.lng) : "Sin reporte GPS"} mono />
              </dl>
              {s.ot ? (
                <div className="space-y-2 rounded-lg border border-mv-line p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold">{s.ot.id}</span>
                    <TipoOtTag tipo={s.ot.tipo} short />
                  </div>
                  <p className="text-xs text-mv-ink">{s.ot.actividad}</p>
                  <p className="text-xs text-mv-ink-2">Destino: {s.destino?.codigo} · {s.destino?.direccion}</p>
                  {s.dist !== null && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <KV k="Distancia al activo" v={<span className="num font-semibold">{fmtDistancia(s.dist)}</span>} />
                      <KV
                        k={s.estado === "En ruta" ? "Arribo estimado" : "Check-in"}
                        v={
                          s.estado === "En ruta"
                            ? `≈ ${Math.max(1, Math.round((s.dist / 1000 / VEL_KMH) * 60))} min`
                            : s.dist <= 50
                            ? "Dentro del radio"
                            : "Fuera del radio"
                        }
                      />
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-mv-muted">Sin orden asignada en este momento.</p>
              )}
            </div>
          )}
        </Panel>
      </div>

      <Panel noPad title="Cuadrillas" subtitle={`${filtradas.length} de ${filas.length}`} icon={<Navigation className="h-4 w-4" />}>
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th>Cuadrilla</th>
                <th>Técnico líder</th>
                <th>Zona</th>
                <th>Estado</th>
                <th>OT</th>
                <th>Activo destino</th>
                <th className="text-right">Distancia</th>
                <th>Actualizado</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((f) => (
                <tr key={f.c.id} onClick={() => setSel(f.c.id)} className={cx("is-clickable", sel === f.c.id && "is-selected")}>
                  <td className="whitespace-nowrap font-semibold">{f.c.id} {f.c.nombre}</td>
                  <td>{f.c.lider}</td>
                  <td className="text-mv-ink-2">{cat.zona(f.c.zonaId)?.nombre}</td>
                  <td><Pill tone={toneTracking(f.estado)} dot>{f.estado}</Pill></td>
                  <td className="whitespace-nowrap font-mono text-xs">{f.ot?.id ?? "—"}</td>
                  <td className="font-mono text-xs">{f.destino?.codigo ?? "—"}</td>
                  <td className="num text-right">{f.dist !== null ? fmtDistancia(f.dist) : "—"}</td>
                  <td className="font-mono text-xs text-mv-ink-2">{f.tr?.actualizado ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </AppShell>
  );
}
