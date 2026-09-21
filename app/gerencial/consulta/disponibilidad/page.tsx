"use client";

// GERENCIAL › Consulta › Disponibilidad de Red
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Activity, AlertOctagon } from "lucide-react";
import { AppShell } from "@/components/sgmr/shell";
import { KpiCard, type KpiData } from "@/components/kpi-card";
import { MapPlaceholder } from "@/components/map-placeholder";
import { CriticidadBadge, Panel, Pill, Progress, Segmented, toneActivo, toneOt } from "@/components/sgmr/ui";
import { useSgmr } from "@/lib/store";
import { fmtNum } from "@/lib/data";
import kpisJson from "@/mock-data/kpis.json";
import type { Activo, Segmento } from "@/lib/types";

const KPIS = kpisJson.kpis as KpiData[];

function resumen(activos: Activo[]) {
  const total = activos.length;
  const op = activos.filter((a) => a.estado === "Operativo").length;
  const deg = activos.filter((a) => a.estado === "En alerta" || a.estado === "En mantenimiento").length;
  const caidos = activos.filter((a) => a.estado === "Fuera de servicio");
  const clientes = activos.reduce((s, a) => s + a.clientes, 0);
  const afectados = caidos.reduce((s, a) => s + a.clientes, 0);
  return {
    total,
    op,
    deg,
    caidos: caidos.length,
    disp: total ? ((total - caidos.length) / total) * 100 : 100,
    clientes,
    afectados,
    dispClientes: clientes ? ((clientes - afectados) / clientes) * 100 : 100,
  };
}

const pct = (n: number) => `${n.toFixed(1)} %`;

export default function DisponibilidadPage() {
  const { datos } = useSgmr();
  const [seg, setSeg] = useState<Segmento | "all">("all");

  const activos = useMemo(() => datos.activos.filter((a) => seg === "all" || a.segmento === seg), [datos.activos, seg]);
  const global = resumen(activos);
  const porZona = datos.zonas.map((z) => ({ z, r: resumen(activos.filter((a) => a.zonaId === z.id)) })).filter((x) => x.r.total > 0);
  const porCentral = datos.centrales
    .map((c) => ({ c, r: resumen(activos.filter((a) => a.centralId === c.id)) }))
    .filter((x) => x.r.total > 0)
    .sort((a, b) => a.r.disp - b.r.disp);
  const incidencias = activos.filter((a) => a.estado !== "Operativo").sort((a, b) => (a.estado === "Fuera de servicio" ? -1 : 1) - (b.estado === "Fuera de servicio" ? -1 : 1));

  return (
    <AppShell fn="disponibilidad">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {KPIS.map((k) => (
          <KpiCard key={k.id} kpi={k} />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented<Segmento | "all">
          value={seg}
          onChange={setSeg}
          options={[
            { value: "all", label: "Toda la red" },
            { value: "Core", label: "Core" },
            { value: "Planta Externa", label: "Planta Externa" },
            { value: "Última Milla", label: "Última Milla" },
          ]}
        />
        <p className="text-xs text-mv-ink-2">Disponibilidad calculada sobre el catálogo de activos y su estado actual.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-lg border border-mv-line bg-white p-3.5">
          <p className="text-xs font-medium text-mv-ink-2">Disponibilidad de activos</p>
          <p className={`num mt-1 text-2xl font-bold ${global.disp >= 95 ? "text-st-ok-fg" : global.disp >= 90 ? "text-st-warn-fg" : "text-st-crit-fg"}`}>{pct(global.disp)}</p>
          <Progress className="mt-2" value={global.disp} tone={global.disp >= 95 ? "ok" : global.disp >= 90 ? "warn" : "crit"} />
        </div>
        <div className="rounded-lg border border-mv-line bg-white p-3.5">
          <p className="text-xs font-medium text-mv-ink-2">Clientes con servicio</p>
          <p className={`num mt-1 text-2xl font-bold ${global.dispClientes >= 95 ? "text-st-ok-fg" : "text-st-warn-fg"}`}>{pct(global.dispClientes)}</p>
          <p className="num mt-1 text-[11px] text-mv-muted">{fmtNum(global.afectados)} de {fmtNum(global.clientes)} afectados</p>
        </div>
        <div className="rounded-lg border border-mv-line bg-white p-3.5">
          <p className="text-xs font-medium text-mv-ink-2">Degradados (alerta / mantenimiento)</p>
          <p className="num mt-1 text-2xl font-bold text-st-warn-fg">{global.deg}</p>
          <p className="text-[11px] text-mv-muted">de {global.total} activos</p>
        </div>
        <div className="rounded-lg border border-mv-line bg-white p-3.5">
          <p className="text-xs font-medium text-mv-ink-2">Fuera de servicio</p>
          <p className="num mt-1 text-2xl font-bold text-st-crit-fg">{global.caidos}</p>
          <p className="text-[11px] text-mv-muted">requieren atención correctiva</p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Disponibilidad por zona" icon={<Activity className="h-4 w-4" />} noPad>
          <div className="overflow-x-auto">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Zona</th>
                  <th className="text-right">Activos</th>
                  <th className="text-right">Operativos</th>
                  <th className="text-right">Degradados</th>
                  <th className="text-right">Caídos</th>
                  <th className="min-w-[140px]">Disponibilidad</th>
                  <th className="text-right">Clientes afectados</th>
                </tr>
              </thead>
              <tbody>
                {porZona.map(({ z, r }) => (
                  <tr key={z.id}>
                    <td className="font-semibold">{z.nombre}</td>
                    <td className="num text-right">{r.total}</td>
                    <td className="num text-right text-st-ok-fg">{r.op}</td>
                    <td className="num text-right text-st-warn-fg">{r.deg}</td>
                    <td className="num text-right text-st-crit-fg">{r.caidos}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Progress value={r.disp} tone={r.disp >= 95 ? "ok" : r.disp >= 85 ? "warn" : "crit"} />
                        <span className="num w-14 text-right text-xs font-semibold">{pct(r.disp)}</span>
                      </div>
                    </td>
                    <td className="num text-right">{fmtNum(r.afectados)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Centrales ordenadas por disponibilidad" subtitle="Las más comprometidas primero" noPad>
          <ul className="divide-y divide-mv-line">
            {porCentral.map(({ c, r }) => (
              <li key={c.id} className="flex items-center gap-3 px-4 py-2.5 text-[13px]">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-mv-ink">{c.nombre}</p>
                  <p className="text-[11px] text-mv-ink-2">
                    {r.total} activos · {r.deg} degradados · {r.caidos} caídos
                  </p>
                </div>
                <div className="w-40">
                  <Progress value={r.disp} tone={r.disp >= 95 ? "ok" : r.disp >= 85 ? "warn" : "crit"} />
                </div>
                <span className="num w-14 text-right text-xs font-bold">{pct(r.disp)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Panel title="Activos con incidencia" icon={<AlertOctagon className="h-4 w-4" />} subtitle={`${incidencias.length} activos no operativos`} noPad>
          <div className="max-h-[440px] overflow-auto">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Activo</th>
                  <th>Estado</th>
                  <th>Criticidad</th>
                  <th className="text-right">Clientes</th>
                  <th>Atención</th>
                </tr>
              </thead>
              <tbody>
                {incidencias.map((a) => {
                  const ot = datos.ots.find((o) => o.activoId === a.codigo && o.status !== "CERRADA");
                  const tk = datos.tickets.find((t) => t.activoId === a.codigo && t.estado !== "Cerrado");
                  return (
                    <tr key={a.codigo}>
                      <td className="min-w-[180px]">
                        <Link href={`/gerencial/parametros/activos?codigo=${a.codigo}`} className="font-mono text-xs font-bold text-mv-green-700 hover:underline">{a.codigo}</Link>
                        <span className="block text-[12px] text-mv-ink-2">{a.descripcion}</span>
                      </td>
                      <td><Pill tone={toneActivo(a.estado)} dot>{a.estado}</Pill></td>
                      <td><CriticidadBadge c={a.criticidad} /></td>
                      <td className="num text-right">{fmtNum(a.clientes)}</td>
                      <td className="whitespace-nowrap text-xs">
                        {ot ? (
                          <Pill tone={toneOt(ot.status)}>{ot.id} · {ot.status}</Pill>
                        ) : tk ? (
                          <Link href={`/gerencial/consulta/tickets?id=${tk.id}`} className="font-semibold text-st-warn-fg underline">{tk.id} sin OT</Link>
                        ) : a.estado === "En mantenimiento" ? (
                          <span className="text-mv-ink-2">Mantenimiento programado</span>
                        ) : (
                          <span className="font-semibold text-st-crit-fg">Sin ticket</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel title="Topología geo-referenciada" subtitle="Filtre por segmento o muestre solo activos con alerta">
          <MapPlaceholder height={360} inicial="alerts" />
        </Panel>
      </div>
    </AppShell>
  );
}
