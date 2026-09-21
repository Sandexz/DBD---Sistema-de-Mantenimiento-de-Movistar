"use client";

// OPERATIVO › DATA ENTRY › Registro de Tickets e Incidencias
// Alta de incidencias (Call Center, NOC o detección automática) con validación de duplicados.
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { FilePlus2, Headphones, MonitorDot, Cpu, Link2, ArrowRight, CheckCircle2, Inbox, Clock } from "lucide-react";
import { AppShell } from "@/components/sgmr/shell";
import {
  Btn,
  Callout,
  CheckboxRow,
  CriticidadBadge,
  Field,
  Input,
  Panel,
  Pill,
  Segmented,
  Select,
  Textarea,
  toneActivo,
  toneTicket,
} from "@/components/sgmr/ui";
import { useSgmr } from "@/lib/store";
import { CRITICIDADES, fmtNum, horasTexto, prioridadPorCriticidad, slaPorCriticidad } from "@/lib/data";
import { ticketsDuplicados } from "@/lib/validaciones";
import { fmtMinutos, minutosEntre } from "@/lib/fechas";
import type { Criticidad, OrigenTicket, Ticket } from "@/lib/types";

const TIPOS = ["Corte de fibra", "Degradación de señal", "Caída de servicio", "Falla de energía", "Falla de equipo", "Daño por terceros"];

const ORIGENES: { value: OrigenTicket; label: React.ReactNode }[] = [
  { value: "Call Center", label: <span className="flex items-center gap-1.5"><Headphones className="h-3.5 w-3.5" /> Call Center</span> },
  { value: "NOC", label: <span className="flex items-center gap-1.5"><MonitorDot className="h-3.5 w-3.5" /> NOC</span> },
  { value: "Detección automática", label: <span className="flex items-center gap-1.5"><Cpu className="h-3.5 w-3.5" /> Detección automática</span> },
];

const vacio = {
  origen: "Call Center" as OrigenTicket,
  activoId: "",
  tipo: "",
  severidad: "" as Criticidad | "",
  cliente: "",
  clientesAfectados: "",
  descripcion: "",
};

export default function RegistroTicketsPage() {
  const { datos, ahora, registrarTicket, vincularReporte, mutar, notificar } = useSgmr();
  const [f, setF] = useState(vacio);
  const [distinto, setDistinto] = useState(false);
  const [intentado, setIntentado] = useState(false);
  const [resultado, setResultado] = useState<{ tipo: "nuevo" | "vinculado"; ticket: Ticket } | null>(null);

  const activo = datos.activos.find((a) => a.codigo === f.activoId);
  const duplicados = useMemo(() => ticketsDuplicados(datos.tickets, f.activoId), [datos.tickets, f.activoId]);
  const sla = f.severidad ? slaPorCriticidad(datos.sla, f.severidad) : undefined;

  const errores = {
    activoId: !f.activoId ? "Seleccione el activo afectado." : null,
    tipo: !f.tipo ? "Indique el tipo de incidencia." : null,
    severidad: !f.severidad ? "Indique la severidad." : null,
    cliente: f.cliente.trim().length < 3 ? "Indique el cliente o usuarios afectados." : null,
    descripcion: f.descripcion.trim().length < 10 ? "Describa la incidencia (mínimo 10 caracteres)." : null,
  };
  const hayErrores = Object.values(errores).some(Boolean);
  const bloqueoDuplicado = duplicados.length > 0 && !distinto;

  const elegirActivo = (codigo: string) => {
    const a = datos.activos.find((x) => x.codigo === codigo);
    setDistinto(false);
    setF((p) => ({
      ...p,
      activoId: codigo,
      severidad: p.severidad || (a?.criticidad ?? ""),
      clientesAfectados: p.clientesAfectados || (a ? String(a.clientes) : ""),
    }));
  };

  const registrar = () => {
    setIntentado(true);
    if (hayErrores || bloqueoDuplicado) return;
    const t = registrarTicket({
      tipo: f.tipo,
      activoId: f.activoId,
      severidad: f.severidad as Criticidad,
      origen: f.origen,
      descripcion: f.descripcion.trim(),
      cliente: f.cliente.trim(),
      clientesAfectados: parseInt(f.clientesAfectados || "0", 10) || 0,
    });
    notificar(`Ticket ${t.id} registrado (${t.prioridad}).`);
    setResultado({ tipo: "nuevo", ticket: t });
    setF(vacio);
    setIntentado(false);
    setDistinto(false);
  };

  const vincular = (t: Ticket) => {
    vincularReporte(t.id);
    notificar(`Reporte vinculado a ${t.id}. No se creó un ticket duplicado.`, "info");
    setResultado({ tipo: "vinculado", ticket: t });
    setF(vacio);
    setIntentado(false);
  };

  const confirmarDetectado = (t: Ticket) => {
    mutar(
      (d) => ({
        ...d,
        tickets: d.tickets.map((x) =>
          x.id === t.id ? { ...x, estado: "Registrado", historial: { ...x.historial, Registrado: ahora.replace(" ", "T") } } : x
        ),
      }),
      { accion: "Incidencia detectada confirmada como ticket", ref: t.id }
    );
    notificar(`${t.id} pasó de Detectado a Registrado.`);
  };

  const detectados = datos.tickets.filter((t) => t.estado === "Detectado");
  const sinOt = datos.tickets.filter((t) => t.estado === "Registrado" && !t.otId);

  return (
    <AppShell fn="registro-tickets">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-5">
          {resultado && (
            <Callout tone={resultado.tipo === "nuevo" ? "ok" : "info"} title={resultado.tipo === "nuevo" ? `Ticket ${resultado.ticket.id} registrado` : `Reporte vinculado a ${resultado.ticket.id}`}>
              {resultado.tipo === "nuevo" ? (
                <>
                  Estado <strong>Registrado</strong> · prioridad {resultado.ticket.prioridad}.{" "}
                  <Link href={`/operativo/ots?ticket=${resultado.ticket.id}`}>Generar OT correctiva</Link> ·{" "}
                  <Link href={`/gerencial/consulta/tickets?id=${resultado.ticket.id}`}>Ver ciclo de vida</Link>
                </>
              ) : (
                <>El ticket existente suma {resultado.ticket.reportesAdicionales + 1} reporte(s) adicional(es). Se evitó un duplicado.</>
              )}
            </Callout>
          )}

          <Panel title="Nueva incidencia" icon={<FilePlus2 className="h-4 w-4" />} subtitle="Los campos con * son obligatorios">
            <div className="space-y-4">
              <Field label="Origen del reporte" required>
                <Segmented<OrigenTicket> value={f.origen} onChange={(v) => setF({ ...f, origen: v })} options={ORIGENES} />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Activo afectado"
                  required
                  error={intentado ? errores.activoId : null}
                  hint={activo ? `${activo.tipo} · ${activo.direccion}` : "El catálogo proviene de Gestión de Activos."}
                >
                  <Select value={f.activoId} onChange={(e) => elegirActivo(e.target.value)} className="font-mono text-xs">
                    <option value="">Seleccione…</option>
                    {datos.activos.map((a) => (
                      <option key={a.codigo} value={a.codigo}>
                        {a.codigo} — {a.descripcion}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Tipo de incidencia" required error={intentado ? errores.tipo : null}>
                  <Select value={f.tipo} onChange={(e) => setF({ ...f, tipo: e.target.value })}>
                    <option value="">Seleccione…</option>
                    {TIPOS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </Select>
                </Field>
              </div>

              {activo && (
                <div className="flex flex-wrap items-center gap-2 rounded-md bg-mv-surface-2 px-3 py-2 text-xs text-mv-ink-2">
                  Estado actual del activo: <Pill tone={toneActivo(activo.estado)} dot>{activo.estado}</Pill>
                  Criticidad: <CriticidadBadge c={activo.criticidad} />
                  Clientes: <span className="num font-semibold text-mv-ink">{fmtNum(activo.clientes)}</span>
                </div>
              )}

              {/* Validación de tickets duplicados */}
              {f.activoId && duplicados.length === 0 && (
                <Callout tone="ok" title="Sin tickets duplicados">No existen tickets abiertos sobre {f.activoId}.</Callout>
              )}
              {duplicados.length > 0 && (
                <div className="space-y-2 rounded-lg border border-st-warn/50 bg-st-warn-bg p-3.5">
                  <p className="text-[13px] font-semibold text-st-warn-fg">
                    Posible ticket duplicado: {duplicados.length} ticket(s) abierto(s) sobre {f.activoId}
                  </p>
                  {duplicados.map((d) => (
                    <div key={d.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-st-warn/30 bg-white px-3 py-2 text-xs">
                      <div>
                        <span className="font-mono font-bold text-mv-ink">{d.id}</span> · {d.tipo} ·{" "}
                        <Pill tone={toneTicket(d.estado)}>{d.estado}</Pill>
                        <p className="mt-0.5 text-mv-ink-2">
                          {d.descripcion} · hace {fmtMinutos(Math.max(0, minutosEntre(d.historial.Detectado ?? d.historial.Registrado ?? ahora, ahora)))}
                        </p>
                      </div>
                      <Btn size="sm" variant="primary" icon={<Link2 className="h-3.5 w-3.5" />} onClick={() => vincular(d)}>
                        Vincular reporte
                      </Btn>
                    </div>
                  ))}
                  <CheckboxRow
                    checked={distinto}
                    onChange={setDistinto}
                    label="Confirmo que se trata de una incidencia distinta"
                    hint="Solo así se permite registrar un nuevo ticket sobre el mismo activo."
                  />
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Severidad" required error={intentado ? errores.severidad : null} hint="Se sugiere según la criticidad del activo.">
                  <Select value={f.severidad} onChange={(e) => setF({ ...f, severidad: e.target.value as Criticidad })}>
                    <option value="">Seleccione…</option>
                    {CRITICIDADES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Cliente / usuarios afectados" required error={intentado ? errores.cliente : null} className="md:col-span-2">
                  <Input value={f.cliente} onChange={(e) => setF({ ...f, cliente: e.target.value })} placeholder="Ej: Banco Andino S.A. — sede Miraflores" />
                </Field>
                <Field label="N.º de clientes afectados">
                  <Input type="number" min={0} value={f.clientesAfectados} onChange={(e) => setF({ ...f, clientesAfectados: e.target.value })} />
                </Field>
                <div className="md:col-span-2">
                  <p className="mb-1 text-xs font-semibold text-mv-ink">SLA aplicable (SLA y Tiempos Base)</p>
                  {sla ? (
                    <div className="flex flex-wrap gap-2 text-xs">
                      <Pill tone="info">Prioridad {prioridadPorCriticidad(sla.severidad)}</Pill>
                      <Pill tone="neutral">Atención máx. {horasTexto(sla.atencionMin)}</Pill>
                      <Pill tone="neutral">Solución objetivo {horasTexto(sla.solucionMin)}</Pill>
                    </div>
                  ) : (
                    <p className="text-xs text-mv-muted">Seleccione la severidad.</p>
                  )}
                </div>
              </div>

              <Field label="Descripción de la incidencia" required error={intentado ? errores.descripcion : null}>
                <Textarea value={f.descripcion} onChange={(e) => setF({ ...f, descripcion: e.target.value })} placeholder="Síntoma reportado, alarmas observadas, alcance." />
              </Field>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-mv-line pt-4">
                <p className="text-[11px] text-mv-muted">
                  Ciclo de vida: Detectado → Registrado → Asignado → En ruta → En atención → Solucionado → Cerrado
                </p>
                <div className="flex gap-2">
                  <Btn onClick={() => { setF(vacio); setIntentado(false); setDistinto(false); }}>Limpiar</Btn>
                  <Btn variant="primary" icon={<FilePlus2 className="h-4 w-4" />} onClick={registrar} disabled={bloqueoDuplicado}>
                    Registrar ticket
                  </Btn>
                </div>
              </div>
            </div>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel title="Detectados por monitoreo" icon={<Cpu className="h-4 w-4" />} subtitle="Alarmas convertidas en ticket, pendientes de confirmación">
            {detectados.length === 0 ? (
              <p className="text-xs text-mv-muted">Sin incidencias detectadas pendientes.</p>
            ) : (
              <ul className="space-y-2">
                {detectados.map((t) => (
                  <li key={t.id} className="rounded-md border border-mv-line p-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-mv-ink">{t.id}</span>
                      <CriticidadBadge c={t.severidad} />
                    </div>
                    <p className="mt-1 text-mv-ink">{t.descripcion}</p>
                    <p className="text-mv-muted">{t.activoId} · {t.historial.Detectado?.slice(11)}</p>
                    <Btn size="sm" className="mt-2" icon={<CheckCircle2 className="h-3.5 w-3.5" />} onClick={() => confirmarDetectado(t)}>
                      Confirmar registro
                    </Btn>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Registrados sin OT" icon={<Inbox className="h-4 w-4" />} subtitle="Pendientes de generación de orden correctiva">
            {sinOt.length === 0 ? (
              <p className="text-xs text-mv-muted">Todos los tickets registrados tienen OT.</p>
            ) : (
              <ul className="divide-y divide-mv-line">
                {sinOt.map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-2 py-2 text-xs">
                    <div className="min-w-0">
                      <p className="font-mono font-bold text-mv-ink">{t.id}</p>
                      <p className="truncate text-mv-ink-2">
                        {t.activoId} · {t.tipo}
                      </p>
                      <p className="flex items-center gap-1 text-mv-muted">
                        <Clock className="h-3 w-3" /> {t.historial.Registrado?.slice(11)} · {t.origen}
                      </p>
                    </div>
                    <Link href={`/operativo/ots?ticket=${t.id}`} className="inline-flex shrink-0 items-center gap-1 rounded-md border border-mv-green/40 bg-mv-green-50 px-2 py-1 font-semibold text-mv-green-800">
                      Generar OT <ArrowRight className="h-3 w-3" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
