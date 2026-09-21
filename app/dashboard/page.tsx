"use client";

// GERENCIAL › Supervisión › Dashboard Gerencial (pantalla existente, conservada y rediseñada).
// Se conservan: KPI por segmento, topología geo-referenciada, feed de alertas con filtro,
// "Actualizar telemetría", acceso a despacho de OT, umbrales, consulta rápida e histórico.
// Las antiguas pestañas ahora enlazan a sus funciones completas de la arquitectura.
import React, { useState } from "react";
import Link from "next/link";
import {
  RefreshCw,
  PlusCircle,
  Bell,
  MapPin,
  Ticket,
  ClipboardList,
  CalendarCheck,
  HardHat,
  Timer,
  Gauge,
  History,
  ArrowRight,
  Network,
} from "lucide-react";
import { AppShell } from "@/components/sgmr/shell";
import { KpiCard, type KpiData } from "@/components/kpi-card";
import { MapPlaceholder } from "@/components/map-placeholder";
import { Btn, Panel, Pill, Segmented, Stat, TipoMantTag, tonePlan, cx } from "@/components/sgmr/ui";
import { seguimientoActual, useSgmr } from "@/lib/store";
import { ALERTAS } from "@/lib/data";
import { fmtFecha, fmtMinutos, minutosEntre } from "@/lib/fechas";
import kpisJson from "@/mock-data/kpis.json";

const kpis = kpisJson.kpis as KpiData[];

export default function DashboardPage() {
  const { datos, ahora, bitacora } = useSgmr();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actualizado, setActualizado] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<"ALL" | "CRITICAL">("ALL");

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.setTimeout(() => {
      setIsRefreshing(false);
      setActualizado(ahora.slice(11, 16));
    }, 900);
  };

  const filteredAlertas = ALERTAS.filter((a) => filterSeverity === "ALL" || a.severity === "CRITICAL");
  const ticketsAbiertos = datos.tickets.filter((t) => t.estado !== "Cerrado" && t.estado !== "Solucionado");
  const otsActivas = datos.ots.filter((o) => o.status !== "CERRADA");
  const seg = seguimientoActual(datos);
  const ejecutados = seg.filter((m) => m.estado === "Ejecutado").length;
  const cumplimiento = seg.length ? (ejecutados / seg.length) * 100 : 0;
  const enCampo = datos.tracking.filter((t) => t.estado !== "Disponible" && t.estado !== "Finalizado").length;
  const proximos = datos.planes
    .filter((p) => p.estado === "Próximo" || p.estado === "Pendiente" || p.estado === "Incumplido")
    .sort((a, b) => a.fechaProgramada.localeCompare(b.fechaProgramada))
    .slice(0, 6);
  const cerradas = datos.ots
    .filter((o) => o.status === "CERRADA" && o.cerradaEn && o.cerradaEn >= "2026-09-19")
    .sort((a, b) => (b.cerradaEn ?? "").localeCompare(a.cerradaEn ?? ""));

  return (
    <AppShell
      fn="dashboard"
      acciones={
        <>
          <Btn onClick={handleRefresh} icon={<RefreshCw className={cx("h-4 w-4", isRefreshing && "animate-spin")} />}>
            {isRefreshing ? "Sincronizando…" : "Actualizar telemetría"}
          </Btn>
          <Link href="/operativo/ots">
            <Btn variant="primary" icon={<PlusCircle className="h-4 w-4" />}>
              Despachar OT
            </Btn>
          </Link>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Link href="/gerencial/consulta/tickets">
          <Stat label="Tickets abiertos" value={ticketsAbiertos.length} tone="warn" hint={`${ticketsAbiertos.filter((t) => !t.otId).length} sin OT asignada`} icon={<Ticket className="h-4 w-4" />} />
        </Link>
        <Link href="/operativo/ots">
          <Stat
            label="OT activas"
            value={otsActivas.length}
            hint={`${otsActivas.filter((o) => o.tipo === "CORRECTIVO").length} correctivas · ${otsActivas.filter((o) => o.tipo === "PREVENTIVO").length} preventivas`}
            icon={<ClipboardList className="h-4 w-4" />}
          />
        </Link>
        <Link href="/gerencial/consulta/seguimiento">
          <Stat
            label="Cumplimiento de mantenimiento"
            value={`${cumplimiento.toFixed(1)} %`}
            tone={cumplimiento >= 90 ? "ok" : cumplimiento >= 75 ? "warn" : "crit"}
            hint={`${ejecutados} de ${seg.length} programados (III trim.)`}
            icon={<CalendarCheck className="h-4 w-4" />}
          />
        </Link>
        <Link href="/gerencial/consulta/tracking">
          <Stat label="Cuadrillas en campo" value={`${enCampo}/${datos.cuadrillas.length}`} tone="info" hint="En ruta, en sitio o en ejecución" icon={<HardHat className="h-4 w-4" />} />
        </Link>
      </div>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-mv-ink">Rendimiento y disponibilidad por segmento</h2>
          <span className="font-mono text-[11px] text-mv-muted">Actualización: {actualizado ?? ahora.slice(11, 16)}</span>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.id} kpi={kpi} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Panel className="lg:col-span-2" title="Topología geo-espacial de enlaces" subtitle={`${datos.activos.length} activos monitoreados`} icon={<Network className="h-4 w-4" />}>
          <MapPlaceholder height={380} />
        </Panel>

        <Panel
          id="alertas"
          title={`Últimas alertas NOC (${filteredAlertas.length})`}
          icon={<Bell className="h-4 w-4" />}
          actions={
            <Segmented
              size="sm"
              value={filterSeverity}
              onChange={setFilterSeverity}
              options={[
                { value: "ALL", label: "Todo" },
                { value: "CRITICAL", label: "Críticas" },
              ]}
            />
          }
          bodyClassName="max-h-[470px] space-y-2.5 overflow-y-auto p-3"
        >
          {filteredAlertas.map((a) => {
            const tono = a.severity === "CRITICAL" ? "crit" : a.severity === "WARNING" ? "warn" : "info";
            const slaTexto = a.slaRemaining;
            return (
              <div key={a.id} className={cx("space-y-1 rounded-lg border p-3 text-xs", tono === "crit" ? "border-st-crit/30 bg-st-crit-bg/40" : "border-mv-line bg-white")}>
                <div className="flex items-center justify-between gap-2">
                  <Pill tone={tono} dot>
                    {a.severity === "CRITICAL" ? "Crítica" : a.severity === "WARNING" ? "Alerta" : "Información"}
                  </Pill>
                  <span className="font-mono text-[11px] text-mv-muted">{a.timestamp}</span>
                </div>
                <p className="font-semibold leading-snug text-mv-ink">{a.title}</p>
                <p className="flex items-start gap-1 text-mv-ink-2">
                  <MapPin className="mt-0.5 h-3 w-3 shrink-0" /> {a.location}
                </p>
                <p className="text-mv-ink-2">{a.impact}</p>
                <div className="flex items-center justify-between gap-2 border-t border-mv-line/70 pt-1.5">
                  <span className="text-[11px] font-medium text-mv-ink">{a.status}</span>
                  <span className={cx("font-mono text-[11px] font-bold", tono === "crit" ? "text-st-crit-fg" : "text-mv-ink-2")}>
                    SLA {slaTexto}
                  </span>
                </div>
                {a.activoId && (
                  <Link href={`/gerencial/parametros/activos?codigo=${a.activoId}`} className="text-[11px] font-semibold text-mv-green-700 hover:underline">
                    Ver activo {a.activoId}
                  </Link>
                )}
              </div>
            );
          })}
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Panel
          title="Mantenimientos que requieren atención"
          subtitle="Próximos, pendientes e incumplidos"
          icon={<CalendarCheck className="h-4 w-4" />}
          actions={<Link href="/gerencial/parametros/planificacion" className="text-xs font-semibold text-mv-green-700 hover:underline">Planificación →</Link>}
          noPad
        >
          <ul className="divide-y divide-mv-line">
            {proximos.map((p) => (
              <li key={p.id}>
                <Link href={`/gerencial/parametros/planificacion?plan=${p.id}`} className="flex items-center justify-between gap-2 px-4 py-2.5 text-xs hover:bg-mv-surface-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-mv-ink">
                      {p.activoId} · <span className="font-normal">{p.actividad}</span>
                    </p>
                    <p className="text-mv-muted">
                      {fmtFecha(p.fechaProgramada)} · {p.cuadrillaId} <TipoMantTag tipo={p.tipo} />
                    </p>
                  </div>
                  <Pill tone={tonePlan(p.estado)}>{p.estado}</Pill>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Histórico y bitácora" subtitle="Órdenes cerradas en las últimas 24 h y acciones de la sesión" icon={<History className="h-4 w-4" />} noPad>
          <ul className="max-h-[320px] divide-y divide-mv-line overflow-y-auto">
            {bitacora.slice(0, 6).map((e) => (
              <li key={e.id} className="px-4 py-2 text-xs">
                <p className="text-mv-ink">
                  <span className="font-mono text-mv-muted">{e.hora.slice(11)}</span> · {e.accion} <span className="font-mono font-semibold">{e.ref}</span>
                </p>
                <p className="text-[11px] text-mv-muted">{e.usuario}</p>
              </li>
            ))}
            {cerradas.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-2 px-4 py-2 text-xs">
                <span className="min-w-0 text-mv-ink">
                  <span className="font-mono font-semibold">{o.id}</span> · {o.actividad}
                  <span className="block text-[11px] text-mv-muted">
                    {o.tipo === "CORRECTIVO"
                      ? `Correctiva · resuelta en ${fmtMinutos(minutosEntre(o.createdAt, o.cerradaEn!))}`
                      : `Preventiva · cerrada el ${fmtFecha(o.cerradaEn)} a las ${o.cerradaEn!.slice(11, 16)}`}
                  </span>
                </span>
                <Pill tone="ok">CERRADA</Pill>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Accesos a parámetros y consultas" subtitle="Antes eran pestañas del dashboard; ahora son funciones completas" noPad>
          <ul className="divide-y divide-mv-line text-[13px]">
            {[
              { href: "/gerencial/parametros/sla", Icon: Timer, t: "SLA y Tiempos Base", d: `${datos.sla.filter((s) => s.estado === "Vigente").length} SLA vigentes · umbrales de red` },
              { href: "/gerencial/parametros/sla", Icon: Gauge, t: "Umbrales de calidad óptica", d: datos.umbrales.slice(0, 2).map((u) => u.valor).join(" · ") },
              { href: "/gerencial/parametros/zonas", Icon: Network, t: "Consulta de infraestructura", d: `${datos.centrales.length} centrales · ${datos.activos.length} activos` },
              { href: "/gerencial/consulta/disponibilidad", Icon: Gauge, t: "Disponibilidad de Red", d: `${datos.activos.filter((a) => a.estado === "Fuera de servicio").length} activos fuera de servicio` },
              { href: "/gerencial/consulta/seguimiento", Icon: History, t: "Seguimiento de Mantenimientos", d: "Programados vs ejecutados" },
            ].map(({ href, Icon, t, d }) => (
              <li key={t}>
                <Link href={href} className="flex items-center gap-3 px-4 py-2.5 hover:bg-mv-surface-2">
                  <Icon className="h-4 w-4 shrink-0 text-mv-green-700" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-mv-ink">{t}</span>
                    <span className="block truncate text-[11px] text-mv-ink-2">{d}</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-mv-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </AppShell>
  );
}
