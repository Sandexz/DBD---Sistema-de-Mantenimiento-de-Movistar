"use client";

// GERENCIAL › Consulta › Estado de Tickets e Incidencias
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Ticket as TicketIcon, Link2, ArrowRight, Users } from "lucide-react";
import { AppShell } from "@/components/sgmr/shell";
import { CriticidadBadge, EmptyState, KV, Panel, Pill, Progress, SearchInput, Select, Stat, toneOt, toneTicket, cx, DetailAside } from "@/components/sgmr/ui";
import { useCatalogos, useSgmr } from "@/lib/store";
import { useQueryParam } from "@/lib/use-query";
import { fmtNum, horasTexto } from "@/lib/data";
import { fmtFechaHora, fmtMinutos, minutosEntre } from "@/lib/fechas";
import { puedeAcceder } from "@/lib/navigation";
import type { EstadoTicket, Ticket } from "@/lib/types";

const CICLO: EstadoTicket[] = ["Detectado", "Registrado", "Asignado", "En ruta", "En atención", "Solucionado", "Cerrado"];

function useSlaTicket() {
  const { datos, ahora } = useSgmr();
  return (t: Ticket) => {
    const sla = datos.sla.find((s) => s.severidad === t.severidad);
    const inicio = t.historial.Registrado ?? t.historial.Detectado ?? ahora;
    const finAt = t.historial["En atención"] ?? ahora.replace(" ", "T");
    const finSol = t.historial.Solucionado ?? ahora.replace(" ", "T");
    const at = Math.max(0, minutosEntre(inicio, finAt));
    const sol = Math.max(0, minutosEntre(inicio, finSol));
    const pctAt = sla ? (at / sla.atencionMin) * 100 : 0;
    const pctSol = sla ? (sol / sla.solucionMin) * 100 : 0;
    const estadoSla: "ok" | "warn" | "crit" = pctSol > 100 || pctAt > 100 ? "crit" : pctSol > 75 || pctAt > 75 ? "warn" : "ok";
    return { sla, at, sol, pctAt, pctSol, estadoSla, atCerrado: !!t.historial["En atención"], solCerrado: !!t.historial.Solucionado };
  };
}

export default function EstadoTicketsPage() {
  const { datos, sesion } = useSgmr();
  const cat = useCatalogos();
  const slaDe = useSlaTicket();
  const [idSel, setIdSel] = useQueryParam("id");
  const [estado, setEstado] = useState<EstadoTicket | "">("");
  const [sev, setSev] = useState("");
  const [origen, setOrigen] = useState("");
  const [q, setQ] = useState("");

  const filtrados = useMemo(
    () =>
      datos.tickets.filter(
        (t) =>
          (!estado || t.estado === estado) &&
          (!sev || t.severidad === sev) &&
          (!origen || t.origen === origen) &&
          (!q || [t.id, t.activoId, t.tipo, t.cliente, t.descripcion, t.otId ?? ""].some((v) => v.toLowerCase().includes(q.toLowerCase())))
      ),
    [datos.tickets, estado, sev, origen, q]
  );

  const sel = datos.tickets.find((t) => t.id === idSel) ?? null;
  const selSla = sel ? slaDe(sel) : null;
  const selOt = cat.ot(sel?.otId);
  const abiertos = datos.tickets.filter((t) => t.estado !== "Cerrado" && t.estado !== "Solucionado");
  const enRiesgo = abiertos.filter((t) => slaDe(t).estadoSla !== "ok").length;

  return (
    <AppShell fn="estado-tickets">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8">
        <Stat label="Todos" value={datos.tickets.length} onClick={() => setEstado("")} active={!estado} />
        {CICLO.map((e) => (
          <Stat
            key={e}
            label={e}
            value={datos.tickets.filter((t) => t.estado === e).length}
            tone={toneTicket(e) === "neutral" ? undefined : toneTicket(e)}
            onClick={() => setEstado(estado === e ? "" : e)}
            active={estado === e}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-mv-line bg-mv-surface-2 px-4 py-2.5 text-xs text-mv-ink-2">
        <span><strong className="num text-mv-ink">{abiertos.length}</strong> tickets abiertos</span>
        <span className="text-mv-line-2">|</span>
        <span><strong className="num text-st-crit-fg">{enRiesgo}</strong> con SLA en riesgo o vencido</span>
        <span className="text-mv-line-2">|</span>
        <span><strong className="num text-mv-ink">{datos.tickets.reduce((s, t) => s + t.reportesAdicionales, 0)}</strong> reportes duplicados vinculados</span>
      </div>

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_400px]">
        <Panel noPad title="Tickets e incidencias" icon={<TicketIcon className="h-4 w-4" />} subtitle={`${filtrados.length} resultados`}>
          <div className="flex flex-wrap gap-2 border-b border-mv-line px-4 py-3">
            <SearchInput className="w-full max-w-xs" value={q} onChange={setQ} placeholder="Ticket, activo, cliente u OT" />
            <Select className="w-auto" value={sev} onChange={(e) => setSev(e.target.value)}>
              <option value="">Toda severidad</option>
              <option>CRÍTICA</option>
              <option>ALTA</option>
              <option>MEDIA</option>
              <option>BAJA</option>
            </Select>
            <Select className="w-auto" value={origen} onChange={(e) => setOrigen(e.target.value)}>
              <option value="">Todo origen</option>
              <option>Call Center</option>
              <option>NOC</option>
              <option>Detección automática</option>
            </Select>
          </div>
          {filtrados.length === 0 ? (
            <EmptyState title="Sin tickets para los filtros aplicados" />
          ) : (
            <div className="overflow-x-auto">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Incidencia / activo</th>
                    <th>Severidad</th>
                    <th>Origen</th>
                    <th>Estado</th>
                    <th>SLA</th>
                    <th>OT</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((t) => {
                    const s = slaDe(t);
                    const cerrado = t.estado === "Cerrado" || t.estado === "Solucionado";
                    return (
                      <tr key={t.id} onClick={() => setIdSel(t.id)} className={cx("is-clickable", idSel === t.id && "is-selected")}>
                        <td className="whitespace-nowrap">
                          <span className="font-mono text-xs font-bold">{t.id}</span>
                          <span className="block font-mono text-[11px] text-mv-muted">{(t.historial.Detectado ?? t.historial.Registrado ?? "").replace("T", " ").slice(5)}</span>
                        </td>
                        <td className="min-w-[200px]">
                          <span className="font-semibold">{t.tipo}</span>
                          <span className="block text-[12px] text-mv-ink-2">{t.activoId} · {t.cliente}</span>
                        </td>
                        <td className="whitespace-nowrap">
                          <CriticidadBadge c={t.severidad} />
                          <span className="ml-1 font-mono text-[11px] text-mv-ink-2">{t.prioridad}</span>
                        </td>
                        <td className="whitespace-nowrap text-mv-ink-2">{t.origen}</td>
                        <td><Pill tone={toneTicket(t.estado)} dot>{t.estado}</Pill></td>
                        <td className="whitespace-nowrap">
                          <Pill tone={cerrado ? (s.pctSol <= 100 ? "ok" : "crit") : s.estadoSla}>
                            {cerrado ? (s.pctSol <= 100 ? "Cumplido" : "Vencido") : s.estadoSla === "ok" ? "En plazo" : s.estadoSla === "warn" ? "En riesgo" : "Vencido"}
                          </Pill>
                        </td>
                        <td className="whitespace-nowrap font-mono text-xs">{t.otId ?? <span className="text-st-warn-fg">Sin OT</span>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <DetailAside open={!!sel} onClose={() => setIdSel(null)}>
        <Panel title={sel ? sel.id : "Ciclo de vida del ticket"} subtitle={sel ? `${sel.tipo} · ${sel.origen}` : "Seleccione un ticket"}>
          {!sel || !selSla ? (
            <EmptyState title="Ningún ticket seleccionado">El detalle muestra las marcas de tiempo de cada estado y el cumplimiento de SLA.</EmptyState>
          ) : (
            <div className="space-y-4 text-[13px]">
              <div className="flex flex-wrap items-center gap-1.5">
                <CriticidadBadge c={sel.severidad} />
                <Pill tone="neutral">{sel.prioridad}</Pill>
                <Pill tone={toneTicket(sel.estado)} dot>{sel.estado}</Pill>
              </div>
              <ol className="relative space-y-0 border-l-2 border-mv-line pl-4">
                {CICLO.map((e) => {
                  const h = sel.historial[e];
                  const actual = sel.estado === e;
                  return (
                    <li key={e} className="relative pb-3 last:pb-0">
                      <span
                        className={cx(
                          "absolute -left-[23px] top-0.5 h-3 w-3 rounded-full border-2 border-white",
                          h ? (actual ? "bg-mv-teal ring-2 ring-mv-teal-50" : "bg-st-ok") : "bg-mv-line-2"
                        )}
                      />
                      <div className="flex items-baseline justify-between gap-2">
                        <span className={cx("text-xs font-semibold", h ? "text-mv-ink" : "text-mv-muted")}>{e}</span>
                        <span className="font-mono text-[11px] text-mv-ink-2">{h ? fmtFechaHora(h) : "—"}</span>
                      </div>
                    </li>
                  );
                })}
              </ol>
              {selSla.sla && (
                <div className="space-y-2.5 rounded-lg border border-mv-line p-3">
                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-mv-ink-2">Atención (registro → arribo)</span>
                      <span className="num font-semibold">{fmtMinutos(selSla.at)} / {horasTexto(selSla.sla.atencionMin)}</span>
                    </div>
                    <Progress className="mt-1" value={selSla.pctAt} tone={selSla.pctAt > 100 ? "crit" : selSla.pctAt > 75 ? "warn" : "ok"} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-mv-ink-2">Solución (registro → solucionado)</span>
                      <span className="num font-semibold">{fmtMinutos(selSla.sol)} / {horasTexto(selSla.sla.solucionMin)}</span>
                    </div>
                    <Progress className="mt-1" value={selSla.pctSol} tone={selSla.pctSol > 100 ? "crit" : selSla.pctSol > 75 ? "warn" : "ok"} />
                  </div>
                </div>
              )}
              <p className="text-mv-ink">{sel.descripcion}</p>
              <dl className="grid grid-cols-2 gap-3">
                <KV k="Activo" v={<Link className="font-mono font-semibold text-mv-green-700 hover:underline" href={`/gerencial/parametros/activos?codigo=${sel.activoId}`}>{sel.activoId}</Link>} />
                <KV k="Ubicación" v={sel.ubicacion} />
                <KV k="Cliente" v={sel.cliente} />
                <KV k="Clientes afectados" v={<span className="flex items-center gap-1"><Users className="h-3 w-3" /> {fmtNum(sel.clientesAfectados)}</span>} />
                <KV k="Reportes adicionales vinculados" v={<span className="flex items-center gap-1"><Link2 className="h-3 w-3" /> {sel.reportesAdicionales}</span>} />
              </dl>
              {selOt ? (
                <div className="flex items-center justify-between rounded-lg border border-mv-line px-3 py-2 text-xs">
                  <span>
                    OT <span className="font-mono font-bold">{selOt.id}</span> · {selOt.crew}
                  </span>
                  <Pill tone={toneOt(selOt.status)}>{selOt.status}</Pill>
                </div>
              ) : (
                puedeAcceder(sesion?.rol, "ots") &&
                sel.estado !== "Cerrado" && (
                  <Link href={`/operativo/ots?ticket=${sel.id}`} className="inline-flex items-center gap-1 rounded-md border border-mv-green/40 bg-mv-green-50 px-3 py-2 text-xs font-semibold text-mv-green-800">
                    Generar OT correctiva <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )
              )}
            </div>
          )}
        </Panel>
        </DetailAside>
      </div>
    </AppShell>
  );
}
