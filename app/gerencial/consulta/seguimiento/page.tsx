"use client";

// GERENCIAL › Consulta › Seguimiento de Mantenimientos
// Programados vs ejecutados, pendientes e incumplidos, con filtros por período, zona,
// central, activo, contratista, estado y tipo.
import React, { useMemo, useState } from "react";
import { BarChart3, RotateCcw, Filter } from "lucide-react";
import { AppShell } from "@/components/sgmr/shell";
import { Btn, EmptyState, Field, Panel, Pill, Select, Stat, TipoMantTag, tonePlan, cx } from "@/components/sgmr/ui";
import { seguimientoActual, useCatalogos, useSgmr } from "@/lib/store";
import { diffDays, fmtFecha } from "@/lib/fechas";
import type { MantenimientoPeriodo } from "@/lib/types";

const PERIODOS = [
  { v: "", l: "III trimestre 2026 (jul–sep)" },
  { v: "2026-07", l: "Julio 2026" },
  { v: "2026-08", l: "Agosto 2026" },
  { v: "2026-09", l: "Septiembre 2026" },
];

function calc(lista: MantenimientoPeriodo[]) {
  const programados = lista.length;
  const ejecutados = lista.filter((m) => m.estado === "Ejecutado").length;
  const pendientes = lista.filter((m) => m.estado === "Pendiente").length;
  const incumplidos = lista.filter((m) => m.estado === "Incumplido").length;
  const cumplimiento = programados ? (ejecutados / programados) * 100 : 0;
  return { programados, ejecutados, pendientes, incumplidos, cumplimiento };
}

function Barra({ label, lista, max }: { label: string; lista: MantenimientoPeriodo[]; max: number }) {
  const r = calc(lista);
  const w = (n: number) => `${max ? (n / max) * 100 : 0}%`;
  return (
    <div className="grid grid-cols-[minmax(90px,150px)_minmax(0,1fr)_104px] items-center gap-3 text-xs">
      <span className="truncate font-medium text-mv-ink" title={label}>{label}</span>
      <div className="flex h-5 overflow-hidden rounded bg-mv-surface" title={`${r.ejecutados} ejecutados · ${r.pendientes} pendientes · ${r.incumplidos} incumplidos`}>
        <div className="h-full bg-st-ok" style={{ width: w(r.ejecutados) }} />
        <div className="h-full bg-st-warn" style={{ width: w(r.pendientes) }} />
        <div className="h-full bg-st-crit" style={{ width: w(r.incumplidos) }} />
      </div>
      <span className="num text-right text-mv-ink-2">
        {r.ejecutados}/{r.programados} · <strong className="text-mv-ink">{r.cumplimiento.toFixed(1)} %</strong>
      </span>
    </div>
  );
}

export default function SeguimientoPage() {
  const { datos } = useSgmr();
  const cat = useCatalogos();
  const base = useMemo(() => seguimientoActual(datos), [datos]);
  const [f, setF] = useState({ periodo: "", zona: "", central: "", activo: "", contratista: "", estado: "", tipo: "" });
  const [limite, setLimite] = useState(20);

  const lista = base.filter(
    (m) =>
      (!f.periodo || m.fechaProgramada.startsWith(f.periodo)) &&
      (!f.zona || m.zonaId === f.zona) &&
      (!f.central || m.centralId === f.central) &&
      (!f.activo || m.activoId === f.activo) &&
      (!f.contratista || m.contratistaId === f.contratista) &&
      (!f.estado || m.estado === f.estado) &&
      (!f.tipo || m.tipo === f.tipo)
  );
  const r = calc(lista);
  const activosEnBase = Array.from(new Set(base.map((m) => m.activoId))).sort();
  const hayFiltros = Object.values(f).some(Boolean);

  const porMes = ["2026-07", "2026-08", "2026-09"].map((p) => ({ label: PERIODOS.find((x) => x.v === p)!.l.split(" ")[0], lista: lista.filter((m) => m.fechaProgramada.startsWith(p)) }));
  const porZona = datos.zonas.map((z) => ({ label: z.nombre, lista: lista.filter((m) => m.zonaId === z.id) })).filter((x) => x.lista.length);
  const porCtr = datos.contratistas.map((c) => ({ label: c.empresa.replace(/ S\.A\.C?\.?$/, ""), lista: lista.filter((m) => m.contratistaId === c.id) })).filter((x) => x.lista.length);
  const maxMes = Math.max(1, ...porMes.map((x) => x.lista.length));
  const maxZona = Math.max(1, ...porZona.map((x) => x.lista.length));
  const maxCtr = Math.max(1, ...porCtr.map((x) => x.lista.length));

  const ordenados = [...lista].sort((a, b) => {
    const pri = { Incumplido: 0, Pendiente: 1, Ejecutado: 2 } as const;
    return pri[a.estado] - pri[b.estado] || b.fechaProgramada.localeCompare(a.fechaProgramada);
  });

  return (
    <AppShell fn="seguimiento">
      <Panel title="Filtros de consulta" icon={<Filter className="h-4 w-4" />} actions={hayFiltros && <Btn size="sm" variant="ghost" icon={<RotateCcw className="h-3.5 w-3.5" />} onClick={() => setF({ periodo: "", zona: "", central: "", activo: "", contratista: "", estado: "", tipo: "" })}>Limpiar filtros</Btn>}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7">
          <Field label="Período">
            <Select value={f.periodo} onChange={(e) => setF({ ...f, periodo: e.target.value })}>
              {PERIODOS.map((p) => <option key={p.v} value={p.v}>{p.l}</option>)}
            </Select>
          </Field>
          <Field label="Zona">
            <Select value={f.zona} onChange={(e) => setF({ ...f, zona: e.target.value, central: "" })}>
              <option value="">Todas</option>
              {datos.zonas.map((z) => <option key={z.id} value={z.id}>{z.nombre}</option>)}
            </Select>
          </Field>
          <Field label="Central">
            <Select value={f.central} onChange={(e) => setF({ ...f, central: e.target.value })}>
              <option value="">Todas</option>
              {datos.centrales.filter((c) => !f.zona || c.zonaId === f.zona).map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </Select>
          </Field>
          <Field label="Activo">
            <Select value={f.activo} onChange={(e) => setF({ ...f, activo: e.target.value })}>
              <option value="">Todos</option>
              {activosEnBase.map((a) => <option key={a}>{a}</option>)}
            </Select>
          </Field>
          <Field label="Contratista">
            <Select value={f.contratista} onChange={(e) => setF({ ...f, contratista: e.target.value })}>
              <option value="">Todos</option>
              {datos.contratistas.map((c) => <option key={c.id} value={c.id}>{c.empresa}</option>)}
            </Select>
          </Field>
          <Field label="Estado">
            <Select value={f.estado} onChange={(e) => setF({ ...f, estado: e.target.value })}>
              <option value="">Todos</option>
              <option>Ejecutado</option>
              <option>Pendiente</option>
              <option>Incumplido</option>
            </Select>
          </Field>
          <Field label="Tipo">
            <Select value={f.tipo} onChange={(e) => setF({ ...f, tipo: e.target.value })}>
              <option value="">Todos</option>
              <option value="PREVENTIVO">Preventivo</option>
              <option value="CORRECTIVO">Correctivo</option>
            </Select>
          </Field>
        </div>
      </Panel>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Stat label="Programados" value={r.programados} hint={PERIODOS.find((p) => p.v === f.periodo)?.l} />
        <Stat label="Ejecutados" value={r.ejecutados} tone="ok" onClick={() => setF({ ...f, estado: f.estado === "Ejecutado" ? "" : "Ejecutado" })} active={f.estado === "Ejecutado"} />
        <Stat label="Pendientes" value={r.pendientes} tone="warn" onClick={() => setF({ ...f, estado: f.estado === "Pendiente" ? "" : "Pendiente" })} active={f.estado === "Pendiente"} />
        <Stat label="Incumplidos" value={r.incumplidos} tone="crit" onClick={() => setF({ ...f, estado: f.estado === "Incumplido" ? "" : "Incumplido" })} active={f.estado === "Incumplido"} />
        <Stat
          label="Cumplimiento"
          value={`${r.cumplimiento.toFixed(1)} %`}
          tone={r.cumplimiento >= 90 ? "ok" : r.cumplimiento >= 75 ? "warn" : "crit"}
          hint="Ejecutados ÷ programados · meta 90 %"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Panel title="Por mes" icon={<BarChart3 className="h-4 w-4" />}>
          <div className="space-y-2.5">{porMes.map((x) => <Barra key={x.label} {...x} max={maxMes} />)}</div>
        </Panel>
        <Panel title="Por zona">
          <div className="space-y-2.5">{porZona.length ? porZona.map((x) => <Barra key={x.label} {...x} max={maxZona} />) : <p className="text-xs text-mv-muted">Sin datos.</p>}</div>
        </Panel>
        <Panel title="Por contratista">
          <div className="space-y-2.5">{porCtr.length ? porCtr.map((x) => <Barra key={x.label} {...x} max={maxCtr} />) : <p className="text-xs text-mv-muted">Sin datos.</p>}</div>
          <div className="mt-3 flex gap-3 border-t border-mv-line pt-2 text-[11px] text-mv-ink-2">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-st-ok" /> Ejecutado</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-st-warn" /> Pendiente</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-st-crit" /> Incumplido</span>
          </div>
        </Panel>
      </div>

      <Panel noPad title="Detalle de mantenimientos" subtitle={`${lista.length} registros · primero incumplidos y pendientes`}>
        {lista.length === 0 ? (
          <EmptyState title="Sin mantenimientos para los filtros aplicados" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Registro</th>
                    <th>Activo</th>
                    <th>Zona / central</th>
                    <th>Contratista / cuadrilla</th>
                    <th>Actividad</th>
                    <th>Programado</th>
                    <th>Ejecutado</th>
                    <th>Desfase</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenados.slice(0, limite).map((m) => {
                    const desfase = m.fechaEjecucion ? diffDays(m.fechaProgramada, m.fechaEjecucion) : null;
                    return (
                      <tr key={m.id}>
                        <td className="whitespace-nowrap font-mono text-xs">
                          {m.id}
                          {m.planId && <span className="block text-[10px] text-mv-muted">{m.planId}</span>}
                        </td>
                        <td className="whitespace-nowrap font-mono text-xs font-semibold">{m.activoId}</td>
                        <td className="text-[12px]">
                          {cat.zona(m.zonaId)?.nombre}
                          <span className="block text-mv-muted">{cat.central(m.centralId)?.nombre}</span>
                        </td>
                        <td className="text-[12px]">
                          {cat.contratista(m.contratistaId)?.empresa.split(" ").slice(0, 3).join(" ")}
                          <span className="block text-mv-muted">{m.cuadrillaId}</span>
                        </td>
                        <td className="min-w-[180px]">
                          <TipoMantTag tipo={m.tipo} />
                          <span className="block">{m.actividad}</span>
                        </td>
                        <td className="num whitespace-nowrap">{fmtFecha(m.fechaProgramada)}</td>
                        <td className="num whitespace-nowrap">{fmtFecha(m.fechaEjecucion)}</td>
                        <td className={cx("num whitespace-nowrap text-xs", desfase !== null && desfase > 0 ? "text-st-warn-fg" : "text-mv-ink-2")}>
                          {desfase === null ? "—" : desfase === 0 ? "a tiempo" : desfase > 0 ? `+${desfase} d` : `${desfase} d`}
                        </td>
                        <td><Pill tone={tonePlan(m.estado)} dot>{m.estado}</Pill></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {lista.length > limite && (
              <div className="border-t border-mv-line p-3 text-center">
                <Btn size="sm" onClick={() => setLimite((l) => l + 30)}>
                  Mostrar más ({lista.length - limite} restantes)
                </Btn>
              </div>
            )}
          </>
        )}
      </Panel>
    </AppShell>
  );
}
