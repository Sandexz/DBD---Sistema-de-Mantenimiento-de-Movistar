"use client";

// GERENCIAL › Mantenimiento de Parámetros › SLA y Tiempos Base
import React, { useState } from "react";
import { Timer, Pencil, Plus, Gauge, Clock } from "lucide-react";
import { AppShell } from "@/components/sgmr/shell";
import { Btn, Callout, CriticidadBadge, Dialog, Field, Input, Panel, Pill, Select, Textarea } from "@/components/sgmr/ui";
import { useSgmr } from "@/lib/store";
import { TIPOS_ACTIVO, horasTexto } from "@/lib/data";
import type { EstadoParametro, Periodicidad, SlaParametro, TiempoBase, UmbralRed } from "@/lib/types";

const PERIODOS: Periodicidad[] = ["Mensual", "Trimestral", "Semestral", "Anual", "Única"];
const tonoEstado = (e: EstadoParametro) => (e === "Vigente" ? "ok" : e === "En revisión" ? "warn" : "neutral");

export default function SlaPage() {
  const { datos, mutar, notificar } = useSgmr();
  const [sla, setSla] = useState<(Omit<SlaParametro, "atencionMin" | "solucionMin"> & { atencion: string; solucion: string }) | null>(null);
  const [tb, setTb] = useState<(Omit<TiempoBase, "duracionMin" | "toleranciaDias"> & { duracion: string; tolerancia: string; nuevo: boolean }) | null>(null);
  const [umb, setUmb] = useState<UmbralRed | null>(null);
  const [intentado, setIntentado] = useState(false);

  const maxSol = Math.max(...datos.sla.map((s) => s.solucionMin));

  // ── Validaciones SLA
  const eSla = sla
    ? {
        atencion: !(Number(sla.atencion) > 0) ? "Debe ser mayor que 0." : null,
        solucion:
          !(Number(sla.solucion) > 0)
            ? "Debe ser mayor que 0."
            : Number(sla.solucion) <= Number(sla.atencion)
            ? "El tiempo de solución debe superar al de atención."
            : null,
        alcance: sla.alcance.trim().length < 5 ? "Describa el alcance." : null,
      }
    : {};
  const guardarSla = () => {
    if (!sla) return;
    setIntentado(true);
    if (Object.values(eSla).some(Boolean)) return;
    const s: SlaParametro = {
      id: sla.id,
      severidad: sla.severidad,
      prioridad: sla.prioridad,
      alcance: sla.alcance.trim(),
      atencionMin: Math.round(Number(sla.atencion) * 60),
      solucionMin: Math.round(Number(sla.solucion) * 60),
      estado: sla.estado,
    };
    mutar((d) => ({ ...d, sla: d.sla.map((x) => (x.id === s.id ? s : x)) }), { accion: "Parámetro SLA actualizado", ref: s.id });
    notificar(`SLA ${s.severidad} actualizado: atención ${horasTexto(s.atencionMin)}, solución ${horasTexto(s.solucionMin)}.`);
    setSla(null);
  };

  // ── Validaciones tiempo base
  const eTb = tb
    ? {
        actividad: tb.actividad.trim().length < 4 ? "Indique la actividad." : null,
        tipoActivo: !tb.tipoActivo ? "Seleccione el tipo de activo." : null,
        duracion: !(Number(tb.duracion) >= 15 && Number(tb.duracion) <= 1440) ? "Entre 15 y 1440 minutos." : null,
        tolerancia: !(Number(tb.tolerancia) >= 0 && Number(tb.tolerancia) <= 30) ? "Entre 0 y 30 días." : null,
        duplicado: datos.tiemposBase.some(
          (x) => x.id !== tb.id && x.tipoActivo === tb.tipoActivo && x.actividad.toLowerCase() === tb.actividad.trim().toLowerCase()
        )
          ? "Ya existe ese tiempo base para el tipo de activo."
          : null,
      }
    : {};
  const guardarTb = () => {
    if (!tb) return;
    setIntentado(true);
    if (Object.values(eTb).some(Boolean)) return;
    const t: TiempoBase = {
      id: tb.id,
      actividad: tb.actividad.trim(),
      tipoActivo: tb.tipoActivo,
      periodicidad: tb.periodicidad,
      duracionMin: Number(tb.duracion),
      toleranciaDias: Number(tb.tolerancia),
    };
    mutar(
      (d) => ({ ...d, tiemposBase: tb.nuevo ? [...d.tiemposBase, t] : d.tiemposBase.map((x) => (x.id === t.id ? t : x)) }),
      { accion: tb.nuevo ? "Tiempo base registrado" : "Tiempo base actualizado", ref: t.id }
    );
    notificar(`Tiempo base ${t.id} ${tb.nuevo ? "registrado" : "actualizado"}.`);
    setTb(null);
  };

  const nuevoTb = () => {
    setIntentado(false);
    const max = Math.max(...datos.tiemposBase.map((x) => parseInt(x.id.slice(3), 10)));
    setTb({ id: `TB-${String(max + 1).padStart(2, "0")}`, actividad: "", tipoActivo: "", periodicidad: "Semestral", duracion: "60", tolerancia: "7", nuevo: true });
  };

  return (
    <AppShell fn="sla">
      <Callout tone="info" title="Parámetros que alimentan a otras funciones">
        El SLA vigente de cada severidad fija el SLA automático en Gestión de OT, el SLA aplicable en Registro de Tickets y el
        cumplimiento en Estado de Tickets. Los tiempos base definen duración y tolerancia en la Planificación de Mantenimientos.
      </Callout>

      <Panel title="Acuerdos de nivel de servicio (SLA)" icon={<Timer className="h-4 w-4" />} subtitle="Severidad, prioridad, tiempo máximo de atención y tiempo objetivo de solución" noPad>
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th>Severidad</th>
                <th>Prioridad</th>
                <th>Alcance</th>
                <th>Tiempo máx. de atención</th>
                <th>Tiempo objetivo de solución</th>
                <th className="min-w-[180px]">Comparativo</th>
                <th>Estado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {datos.sla.map((s) => (
                <tr key={s.id}>
                  <td><CriticidadBadge c={s.severidad} /></td>
                  <td className="font-mono font-bold">{s.prioridad}</td>
                  <td className="min-w-[220px] text-mv-ink-2">{s.alcance}</td>
                  <td className="num whitespace-nowrap font-semibold">{horasTexto(s.atencionMin)}</td>
                  <td className="num whitespace-nowrap font-semibold">{horasTexto(s.solucionMin)}</td>
                  <td>
                    <div className="space-y-1">
                      <div className="h-1.5 rounded-full bg-mv-teal" style={{ width: `${(s.atencionMin / maxSol) * 100}%`, minWidth: 4 }} title="Atención" />
                      <div className="h-1.5 rounded-full bg-mv-green" style={{ width: `${(s.solucionMin / maxSol) * 100}%` }} title="Solución" />
                    </div>
                  </td>
                  <td><Pill tone={tonoEstado(s.estado)} dot>{s.estado}</Pill></td>
                  <td className="text-right">
                    <button
                      onClick={() => {
                        setIntentado(false);
                        setSla({ ...s, atencion: String(s.atencionMin / 60), solucion: String(s.solucionMin / 60) });
                      }}
                      className="rounded-md p-1.5 text-mv-muted hover:bg-mv-surface hover:text-mv-ink"
                      aria-label={`Editar SLA ${s.severidad}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-4 border-t border-mv-line px-4 py-2 text-[11px] text-mv-ink-2">
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-4 rounded-full bg-mv-teal" /> Atención</span>
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-4 rounded-full bg-mv-green" /> Solución</span>
        </div>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Panel
          title="Tiempos base por actividad"
          icon={<Clock className="h-4 w-4" />}
          subtitle="Duración estándar y tolerancia usadas por la planificación"
          noPad
          actions={<Btn size="sm" icon={<Plus className="h-3.5 w-3.5" />} onClick={nuevoTb}>Nuevo tiempo base</Btn>}
        >
          <div className="overflow-x-auto">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Actividad</th>
                  <th>Tipo de activo</th>
                  <th>Periodicidad</th>
                  <th className="text-right">Duración</th>
                  <th className="text-right">Tolerancia</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {datos.tiemposBase.map((t) => (
                  <tr key={t.id}>
                    <td className="font-mono text-xs font-bold">{t.id}</td>
                    <td>{t.actividad}</td>
                    <td className="text-mv-ink-2">{t.tipoActivo}</td>
                    <td>{t.periodicidad}</td>
                    <td className="num text-right">{t.duracionMin} min</td>
                    <td className="num text-right">{t.toleranciaDias} días</td>
                    <td className="text-right">
                      <button
                        onClick={() => {
                          setIntentado(false);
                          setTb({ ...t, duracion: String(t.duracionMin), tolerancia: String(t.toleranciaDias), nuevo: false });
                        }}
                        className="rounded-md p-1.5 text-mv-muted hover:bg-mv-surface hover:text-mv-ink"
                        aria-label={`Editar ${t.id}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Umbrales de red" icon={<Gauge className="h-4 w-4" />} subtitle="Valores que disparan alarmas y escalamientos">
          <ul className="space-y-2.5">
            {datos.umbrales.map((u) => (
              <li key={u.id} className="rounded-lg border border-mv-line p-3 text-[13px]">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-mv-ink">{u.parametro}</p>
                  <button onClick={() => setUmb(u)} className="rounded-md p-1 text-mv-muted hover:bg-mv-surface hover:text-mv-ink" aria-label={`Editar ${u.id}`}>
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="num mt-1 font-mono text-sm font-bold text-mv-teal-700">{u.valor}</p>
                <p className="text-xs text-mv-ink-2">{u.accion}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Dialog
        open={!!sla}
        onClose={() => setSla(null)}
        title={`Editar SLA · severidad ${sla?.severidad ?? ""}`}
        subtitle="Tiempos en horas (se admiten decimales, p. ej. 1.5)."
        footer={<><Btn onClick={() => setSla(null)}>Cancelar</Btn><Btn variant="primary" onClick={guardarSla}>Guardar</Btn></>}
      >
        {sla && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tiempo máximo de atención (h)" required error={intentado ? eSla.atencion : null}>
              <Input type="number" step="0.5" min="0.5" value={sla.atencion} onChange={(e) => setSla({ ...sla, atencion: e.target.value })} />
            </Field>
            <Field label="Tiempo objetivo de solución (h)" required error={intentado ? eSla.solucion : null}>
              <Input type="number" step="0.5" min="0.5" value={sla.solucion} onChange={(e) => setSla({ ...sla, solucion: e.target.value })} />
            </Field>
            <Field label="Alcance" required className="sm:col-span-2" error={intentado ? eSla.alcance : null}>
              <Textarea value={sla.alcance} onChange={(e) => setSla({ ...sla, alcance: e.target.value })} className="min-h-[56px]" />
            </Field>
            <Field label="Estado">
              <Select value={sla.estado} onChange={(e) => setSla({ ...sla, estado: e.target.value as EstadoParametro })}>
                <option>Vigente</option>
                <option>En revisión</option>
                <option>Inactivo</option>
              </Select>
            </Field>
            {sla.estado !== "Vigente" && (
              <Callout tone="warn" className="sm:col-span-2">
                Sin un SLA vigente para {sla.severidad}, la Gestión de OT aplicará un SLA estándar de 4 horas.
              </Callout>
            )}
          </div>
        )}
      </Dialog>

      <Dialog
        open={!!tb}
        onClose={() => setTb(null)}
        title={tb?.nuevo ? "Nuevo tiempo base" : `Editar ${tb?.id}`}
        footer={<><Btn onClick={() => setTb(null)}>Cancelar</Btn><Btn variant="primary" onClick={guardarTb}>Guardar</Btn></>}
      >
        {tb && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Actividad" required className="sm:col-span-2" error={intentado ? eTb.actividad : null}>
              <Input value={tb.actividad} onChange={(e) => setTb({ ...tb, actividad: e.target.value })} />
            </Field>
            <Field label="Tipo de activo" required error={intentado ? eTb.tipoActivo : null}>
              <Select value={tb.tipoActivo} onChange={(e) => setTb({ ...tb, tipoActivo: e.target.value })}>
                <option value="">Seleccione…</option>
                {TIPOS_ACTIVO.map((t) => <option key={t}>{t}</option>)}
              </Select>
            </Field>
            <Field label="Periodicidad sugerida">
              <Select value={tb.periodicidad} onChange={(e) => setTb({ ...tb, periodicidad: e.target.value as Periodicidad })}>
                {PERIODOS.map((p) => <option key={p}>{p}</option>)}
              </Select>
            </Field>
            <Field label="Duración (minutos)" required error={intentado ? eTb.duracion : null}>
              <Input type="number" value={tb.duracion} onChange={(e) => setTb({ ...tb, duracion: e.target.value })} />
            </Field>
            <Field label="Tolerancia (días)" required error={intentado ? eTb.tolerancia : null}>
              <Input type="number" value={tb.tolerancia} onChange={(e) => setTb({ ...tb, tolerancia: e.target.value })} />
            </Field>
            {intentado && eTb.duplicado && <Callout tone="crit" className="sm:col-span-2">{eTb.duplicado}</Callout>}
          </div>
        )}
      </Dialog>

      <Dialog
        open={!!umb}
        onClose={() => setUmb(null)}
        title={`Editar umbral ${umb?.id ?? ""}`}
        footer={
          <>
            <Btn onClick={() => setUmb(null)}>Cancelar</Btn>
            <Btn
              variant="primary"
              disabled={!umb?.valor.trim()}
              onClick={() => {
                if (!umb) return;
                mutar((d) => ({ ...d, umbrales: d.umbrales.map((x) => (x.id === umb.id ? umb : x)) }), { accion: "Umbral de red actualizado", ref: umb.id });
                notificar(`Umbral ${umb.id} actualizado.`);
                setUmb(null);
              }}
            >
              Guardar
            </Btn>
          </>
        }
      >
        {umb && (
          <div className="grid gap-4">
            <p className="text-sm font-semibold text-mv-ink">{umb.parametro}</p>
            <Field label="Valor" required>
              <Input value={umb.valor} onChange={(e) => setUmb({ ...umb, valor: e.target.value })} className="font-mono" />
            </Field>
            <Field label="Acción al superarse">
              <Textarea value={umb.accion} onChange={(e) => setUmb({ ...umb, accion: e.target.value })} className="min-h-[56px]" />
            </Field>
          </div>
        )}
      </Dialog>
    </AppShell>
  );
}
