"use client";

// GERENCIAL › Mantenimiento de Parámetros › Contratistas
// Registro de empresas y cuadrillas. El "Rendimiento por Contratista" es un proceso de Batch.
import React, { useState } from "react";
import Link from "next/link";
import { Building2, Plus, Pencil, Users, Phone, Mail, Layers, Info } from "lucide-react";
import { AppShell } from "@/components/sgmr/shell";
import { Btn, Callout, Dialog, EmptyState, Field, Input, KV, Panel, Pill, SearchInput, Select, Stat, toneTracking, cx, DetailAside } from "@/components/sgmr/ui";
import { useSgmr } from "@/lib/store";
import { fmtSoles } from "@/lib/data";
import type { Contratista, Cuadrilla, EstadoContratista } from "@/lib/types";

const ESTADOS: EstadoContratista[] = ["Activo", "En homologación", "Suspendido"];
const tono = (e: EstadoContratista) => (e === "Activo" ? "ok" : e === "En homologación" ? "info" : "crit");

type FormC = Omit<Contratista, "tarifaHora"> & { tarifaHora: string; nuevo: boolean };
type FormQ = Omit<Cuadrilla, "integrantes"> & { integrantes: string };

export default function ContratistasPage() {
  const { datos, mutar, notificar } = useSgmr();
  const [q, setQ] = useState("");
  const [estado, setEstado] = useState("");
  const [selId, setSelId] = useState<string | null>(null);
  const [form, setForm] = useState<FormC | null>(null);
  const [formQ, setFormQ] = useState<FormQ | null>(null);
  const [intentado, setIntentado] = useState(false);

  const filtrados = datos.contratistas.filter(
    (c) =>
      (!estado || c.estado === estado) &&
      (!q || [c.id, c.empresa, c.ruc, c.especialidad, c.contacto].some((v) => v.toLowerCase().includes(q.toLowerCase())))
  );
  const sel = datos.contratistas.find((c) => c.id === selId);
  const cuadrillasSel = datos.cuadrillas.filter((c) => c.contratistaId === selId);
  const otsAbiertas = datos.ots.filter((o) => o.status !== "CERRADA" && cuadrillasSel.some((c) => c.id === o.cuadrillaId));

  const e = form
    ? {
        empresa: form.empresa.trim().length < 5 ? "Indique la razón social." : null,
        ruc: !/^(10|20)\d{9}$/.test(form.ruc)
          ? "El RUC debe tener 11 dígitos e iniciar en 10 o 20."
          : datos.contratistas.some((c) => c.ruc === form.ruc && c.id !== form.id)
          ? "RUC ya registrado."
          : null,
        contacto: form.contacto.trim().length < 5 ? "Indique el contacto." : null,
        telefono: !/^9\d{2}\s?\d{3}\s?\d{3}$/.test(form.telefono.trim()) ? "Celular de 9 dígitos (p. ej. 987 112 340)." : null,
        correo: !/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(form.correo) ? "Correo no válido." : null,
        especialidad: form.especialidad.trim().length < 4 ? "Indique la especialidad." : null,
        tarifaHora: !(Number(form.tarifaHora) > 0) ? "Debe ser mayor que 0." : null,
      }
    : {};
  const avisoSuspension =
    form && !form.nuevo && form.estado === "Suspendido"
      ? datos.ots.filter((o) => o.status !== "CERRADA" && datos.cuadrillas.some((c) => c.contratistaId === form.id && c.id === o.cuadrillaId)).length
      : 0;

  const guardar = () => {
    if (!form) return;
    setIntentado(true);
    if (Object.values(e).some(Boolean)) return;
    const { nuevo, ...c } = form;
    const ctr: Contratista = { ...c, empresa: c.empresa.trim(), tarifaHora: Number(c.tarifaHora) };
    mutar((d) => ({ ...d, contratistas: nuevo ? [...d.contratistas, ctr] : d.contratistas.map((x) => (x.id === ctr.id ? ctr : x)) }), {
      accion: nuevo ? "Contratista registrado" : "Contratista actualizado",
      ref: ctr.id,
    });
    notificar(`${ctr.empresa} ${nuevo ? "registrado" : "actualizado"}.`);
    setSelId(ctr.id);
    setForm(null);
  };

  const eQ = formQ
    ? {
        nombre: formQ.nombre.trim().length < 3 ? "Indique el nombre." : null,
        lider: formQ.lider.trim().length < 5 ? "Indique el líder." : null,
        zonaId: !formQ.zonaId ? "Seleccione la zona." : null,
        integrantes: !(Number(formQ.integrantes) >= 2 && Number(formQ.integrantes) <= 6) ? "Entre 2 y 6 integrantes." : null,
      }
    : {};
  const guardarQ = () => {
    if (!formQ) return;
    setIntentado(true);
    if (Object.values(eQ).some(Boolean)) return;
    const c: Cuadrilla = { ...formQ, integrantes: Number(formQ.integrantes) };
    mutar((d) => ({ ...d, cuadrillas: [...d.cuadrillas, c] }), { accion: "Cuadrilla registrada", ref: c.id });
    notificar(`Cuadrilla ${c.id} ${c.nombre} registrada.`);
    setFormQ(null);
  };

  const nuevo = () => {
    setIntentado(false);
    const max = Math.max(...datos.contratistas.map((c) => parseInt(c.id.slice(4), 10)));
    setForm({ id: `CTR-${String(max + 1).padStart(2, "0")}`, empresa: "", ruc: "", contacto: "", telefono: "", correo: "", especialidad: "", tarifaHora: "", estado: "En homologación", nuevo: true });
  };

  return (
    <AppShell
      fn="contratistas"
      acciones={<Btn variant="primary" icon={<Plus className="h-4 w-4" />} onClick={nuevo}>Nuevo contratista</Btn>}
    >
      <Callout tone="info" title="Registro de contratistas ≠ Rendimiento por contratista">
        Aquí se mantienen los datos maestros de las empresas y sus cuadrillas. La evaluación de rendimiento, pre-liquidaciones y
        penalidades pertenece al <Link href="/batch">módulo Batch</Link>.
      </Callout>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Contratistas activos" value={datos.contratistas.filter((c) => c.estado === "Activo").length} tone="ok" />
        <Stat label="En homologación" value={datos.contratistas.filter((c) => c.estado === "En homologación").length} tone="info" />
        <Stat label="Suspendidos" value={datos.contratistas.filter((c) => c.estado === "Suspendido").length} tone="crit" />
        <Stat label="Cuadrillas registradas" value={datos.cuadrillas.length} icon={<Users className="h-4 w-4" />} />
      </div>

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_400px]">
        <Panel noPad title="Empresas contratistas" icon={<Building2 className="h-4 w-4" />} subtitle={`${filtrados.length} registradas`}>
          <div className="flex flex-wrap gap-2 border-b border-mv-line px-4 py-3">
            <SearchInput className="w-full max-w-xs" value={q} onChange={setQ} placeholder="Empresa, RUC, especialidad…" />
            <Select className="w-auto" value={estado} onChange={(ev) => setEstado(ev.target.value)}>
              <option value="">Todos los estados</option>
              {ESTADOS.map((s) => <option key={s}>{s}</option>)}
            </Select>
          </div>
          {filtrados.length === 0 ? (
            <EmptyState title="Sin contratistas para los filtros aplicados" />
          ) : (
            <div className="overflow-x-auto">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Empresa / RUC</th>
                    <th>Especialidad</th>
                    <th>Contacto</th>
                    <th className="text-right">Tarifa hora-cuadrilla</th>
                    <th className="text-right">Cuadrillas</th>
                    <th>Estado</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((c) => (
                    <tr key={c.id} onClick={() => setSelId(c.id)} className={cx("is-clickable", selId === c.id && "is-selected")}>
                      <td className="font-mono text-xs font-bold">{c.id}</td>
                      <td className="min-w-[200px]">
                        <span className="font-semibold">{c.empresa}</span>
                        <span className="block font-mono text-[11px] text-mv-muted">RUC {c.ruc}</span>
                      </td>
                      <td className="min-w-[160px] text-mv-ink-2">{c.especialidad}</td>
                      <td className="min-w-[150px] text-[12px]">
                        {c.contacto}
                        <span className="block text-mv-muted">{c.telefono}</span>
                      </td>
                      <td className="num text-right">{fmtSoles(c.tarifaHora)}</td>
                      <td className="num text-right">{datos.cuadrillas.filter((q) => q.contratistaId === c.id).length}</td>
                      <td><Pill tone={tono(c.estado)} dot>{c.estado}</Pill></td>
                      <td className="text-right">
                        <button
                          onClick={(ev) => { ev.stopPropagation(); setIntentado(false); setForm({ ...c, tarifaHora: String(c.tarifaHora), nuevo: false }); }}
                          className="rounded-md p-1.5 text-mv-muted hover:bg-mv-surface hover:text-mv-ink"
                          aria-label={`Editar ${c.id}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <DetailAside open={!!sel} onClose={() => setSelId(null)}>
        <Panel
          title={sel?.empresa ?? "Detalle"}
          subtitle={sel ? `${sel.id} · ${sel.especialidad}` : undefined}
          actions={
            sel && (
              <Btn
                size="sm"
                icon={<Plus className="h-3.5 w-3.5" />}
                onClick={() => {
                  setIntentado(false);
                  const max = Math.max(...datos.cuadrillas.map((c) => parseInt(c.id.slice(2), 10)));
                  setFormQ({ id: `C-${String(max + 1).padStart(2, "0")}`, nombre: "", lider: "", contratistaId: sel.id, zonaId: "", integrantes: "3", especialidad: sel.especialidad.split(",")[0] });
                }}
              >
                Cuadrilla
              </Btn>
            )
          }
        >
          {!sel ? (
            <EmptyState title="Seleccione un contratista" icon={<Info className="h-5 w-5" />} />
          ) : (
            <div className="space-y-4 text-[13px]">
              <dl className="grid grid-cols-2 gap-3">
                <KV k="RUC" v={sel.ruc} mono />
                <KV k="Estado" v={<Pill tone={tono(sel.estado)} dot>{sel.estado}</Pill>} />
                <KV k="Contacto" v={sel.contacto} />
                <KV k="Tarifa" v={`${fmtSoles(sel.tarifaHora)} / hora-cuadrilla`} />
                <KV k="Teléfono" v={<span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {sel.telefono}</span>} />
                <KV k="Correo" v={<span className="flex items-center gap-1 break-all"><Mail className="h-3 w-3 shrink-0" /> {sel.correo}</span>} />
              </dl>
              <div>
                <p className="mb-2 text-xs font-semibold text-mv-ink">Cuadrillas ({cuadrillasSel.length}) · {otsAbiertas.length} OT abiertas asignadas</p>
                <ul className="divide-y divide-mv-line rounded-lg border border-mv-line">
                  {cuadrillasSel.map((c) => {
                    const tr = datos.tracking.find((t) => t.cuadrillaId === c.id);
                    return (
                      <li key={c.id} className="flex items-center justify-between gap-2 px-3 py-2 text-xs">
                        <div className="min-w-0">
                          <p className="font-semibold text-mv-ink">{c.id} {c.nombre} · {c.lider}</p>
                          <p className="text-mv-ink-2">{datos.zonas.find((z) => z.id === c.zonaId)?.nombre} · {c.integrantes} integrantes · {c.especialidad}</p>
                        </div>
                        <Pill tone={toneTracking(tr?.estado ?? "Disponible")}>{tr?.estado ?? "Disponible"}</Pill>
                      </li>
                    );
                  })}
                  {cuadrillasSel.length === 0 && <li className="px-3 py-3 text-xs text-mv-muted">Sin cuadrillas registradas.</li>}
                </ul>
              </div>
              <Link href="/batch" className="inline-flex items-center gap-1.5 text-xs font-semibold text-mv-green-700 hover:underline">
                <Layers className="h-3.5 w-3.5" /> Ver rendimiento del contratista en Batch
              </Link>
            </div>
          )}
        </Panel>
        </DetailAside>
      </div>

      <Dialog
        open={!!form}
        onClose={() => setForm(null)}
        title={form?.nuevo ? "Nuevo contratista" : `Editar ${form?.id}`}
        size="lg"
        footer={<><Btn onClick={() => setForm(null)}>Cancelar</Btn><Btn variant="primary" onClick={guardar}>Guardar</Btn></>}
      >
        {form && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Razón social" required className="sm:col-span-2" error={intentado ? e.empresa : null}>
              <Input value={form.empresa} onChange={(ev) => setForm({ ...form, empresa: ev.target.value })} />
            </Field>
            <Field label="RUC" required error={intentado ? e.ruc : null}>
              <Input value={form.ruc} maxLength={11} onChange={(ev) => setForm({ ...form, ruc: ev.target.value.replace(/\D/g, "") })} className="font-mono" />
            </Field>
            <Field label="Estado" required>
              <Select value={form.estado} onChange={(ev) => setForm({ ...form, estado: ev.target.value as EstadoContratista })}>
                {ESTADOS.map((s) => <option key={s}>{s}</option>)}
              </Select>
            </Field>
            <Field label="Contacto" required error={intentado ? e.contacto : null}>
              <Input value={form.contacto} onChange={(ev) => setForm({ ...form, contacto: ev.target.value })} />
            </Field>
            <Field label="Teléfono" required error={intentado ? e.telefono : null}>
              <Input value={form.telefono} onChange={(ev) => setForm({ ...form, telefono: ev.target.value })} placeholder="987 112 340" />
            </Field>
            <Field label="Correo" required error={intentado ? e.correo : null}>
              <Input type="email" value={form.correo} onChange={(ev) => setForm({ ...form, correo: ev.target.value })} />
            </Field>
            <Field label="Tarifa hora-cuadrilla (S/)" required error={intentado ? e.tarifaHora : null}>
              <Input type="number" min={1} value={form.tarifaHora} onChange={(ev) => setForm({ ...form, tarifaHora: ev.target.value })} />
            </Field>
            <Field label="Especialidad" required className="sm:col-span-2" error={intentado ? e.especialidad : null}>
              <Input value={form.especialidad} onChange={(ev) => setForm({ ...form, especialidad: ev.target.value })} placeholder="Fibra óptica, energía…" />
            </Field>
            {avisoSuspension > 0 && (
              <Callout tone="warn" className="sm:col-span-2">
                El contratista tiene {avisoSuspension} OT abiertas asignadas a sus cuadrillas. Reasígnelas antes de suspenderlo.
              </Callout>
            )}
          </div>
        )}
      </Dialog>

      <Dialog
        open={!!formQ}
        onClose={() => setFormQ(null)}
        title={`Nueva cuadrilla ${formQ?.id ?? ""}`}
        subtitle={sel?.empresa}
        footer={<><Btn onClick={() => setFormQ(null)}>Cancelar</Btn><Btn variant="primary" onClick={guardarQ}>Registrar</Btn></>}
      >
        {formQ && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre" required error={intentado ? eQ.nombre : null}>
              <Input value={formQ.nombre} onChange={(ev) => setFormQ({ ...formQ, nombre: ev.target.value })} placeholder="Ej: Omega" />
            </Field>
            <Field label="Líder" required error={intentado ? eQ.lider : null}>
              <Input value={formQ.lider} onChange={(ev) => setFormQ({ ...formQ, lider: ev.target.value })} />
            </Field>
            <Field label="Zona" required error={intentado ? eQ.zonaId : null}>
              <Select value={formQ.zonaId} onChange={(ev) => setFormQ({ ...formQ, zonaId: ev.target.value })}>
                <option value="">Seleccione…</option>
                {datos.zonas.map((z) => <option key={z.id} value={z.id}>{z.nombre}</option>)}
              </Select>
            </Field>
            <Field label="Integrantes" required error={intentado ? eQ.integrantes : null}>
              <Input type="number" min={2} max={6} value={formQ.integrantes} onChange={(ev) => setFormQ({ ...formQ, integrantes: ev.target.value })} />
            </Field>
            <Field label="Especialidad" className="sm:col-span-2">
              <Input value={formQ.especialidad} onChange={(ev) => setFormQ({ ...formQ, especialidad: ev.target.value })} />
            </Field>
          </div>
        )}
      </Dialog>
    </AppShell>
  );
}
