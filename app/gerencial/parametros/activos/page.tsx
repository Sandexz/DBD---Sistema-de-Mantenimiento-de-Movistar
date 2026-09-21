"use client";

// GERENCIAL › Mantenimiento de Parámetros › Gestión de Activos y Vida Útil
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Boxes, Plus, Pencil, Info, AlertTriangle } from "lucide-react";
import { AppShell } from "@/components/sgmr/shell";
import {
  Btn,
  Callout,
  CriticidadBadge,
  Dialog,
  EmptyState,
  Field,
  Input,
  KV,
  Panel,
  Pill,
  Progress,
  SearchInput,
  Select,
  Stat,
  toneActivo,
  tonePlan,
  toneTicket,
  toneOt,
  cx,
  DetailAside,
} from "@/components/sgmr/ui";
import { useCatalogos, useSgmr } from "@/lib/store";
import { useQueryParam } from "@/lib/use-query";
import { CRITICIDADES, TIPOS_ACTIVO, fechaRenovacion, fmtCoord, fmtNum, vidaUtil, type EstadoVidaUtil } from "@/lib/data";
import { fmtFecha } from "@/lib/fechas";
import type { Activo, Criticidad, EstadoActivo, Segmento } from "@/lib/types";

const ESTADOS: EstadoActivo[] = ["Operativo", "En alerta", "Fuera de servicio", "En mantenimiento"];
const SEGMENTOS: Segmento[] = ["Core", "Planta Externa", "Última Milla"];
const TONO_VIDA: Record<EstadoVidaUtil, "ok" | "warn" | "crit"> = {
  Vigente: "ok",
  "Renovación próxima": "warn",
  "Vida útil excedida": "crit",
};

type Form = Omit<Activo, "vidaUtilAnios" | "lat" | "lng" | "clientes"> & {
  vidaUtilAnios: string;
  lat: string;
  lng: string;
  clientes: string;
  editando: boolean;
};

const VACIO: Form = {
  codigo: "",
  tipo: "",
  descripcion: "",
  modelo: "",
  direccion: "",
  zonaId: "",
  centralId: "",
  segmento: "Planta Externa",
  estado: "Operativo",
  fechaInstalacion: "",
  vidaUtilAnios: "",
  criticidad: "MEDIA",
  lat: "",
  lng: "",
  clientes: "0",
  editando: false,
};

export default function ActivosPage() {
  const { datos, mutar, notificar } = useSgmr();
  const cat = useCatalogos();
  const [codigoSel, setCodigoSel] = useQueryParam("codigo");
  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState("");
  const [zona, setZona] = useState("");
  const [central, setCentral] = useState("");
  const [estado, setEstado] = useState("");
  const [crit, setCrit] = useState("");
  const [vida, setVida] = useState<EstadoVidaUtil | "">("");
  const [form, setForm] = useState<Form | null>(null);
  const [intentado, setIntentado] = useState(false);

  const conVida = useMemo(() => datos.activos.map((a) => ({ a, v: vidaUtil(a) })), [datos.activos]);

  const filtrados = conVida.filter(({ a, v }) => {
    const t = q.toLowerCase();
    return (
      (!t || [a.codigo, a.descripcion, a.direccion, a.modelo].some((x) => x.toLowerCase().includes(t))) &&
      (!tipo || a.tipo === tipo) &&
      (!zona || a.zonaId === zona) &&
      (!central || a.centralId === central) &&
      (!estado || a.estado === estado) &&
      (!crit || a.criticidad === crit) &&
      (!vida || v.estado === vida)
    );
  });

  const stats = {
    total: datos.activos.length,
    operativos: datos.activos.filter((a) => a.estado === "Operativo").length,
    incidencia: datos.activos.filter((a) => a.estado === "En alerta" || a.estado === "Fuera de servicio").length,
    excedida: conVida.filter((x) => x.v.estado === "Vida útil excedida").length,
    proxima: conVida.filter((x) => x.v.estado === "Renovación próxima").length,
  };

  const sel = datos.activos.find((a) => a.codigo === codigoSel);
  const selVida = sel ? vidaUtil(sel) : null;

  // ── Formulario
  const centralesForm = datos.centrales.filter((c) => !form?.zonaId || c.zonaId === form.zonaId);
  const errores = form
    ? {
        codigo: !/^[A-Z0-9-]{3,16}$/.test(form.codigo)
          ? "Use de 3 a 16 caracteres en mayúsculas, dígitos o guiones."
          : !form.editando && datos.activos.some((a) => a.codigo === form.codigo)
          ? "Ya existe un activo con este código."
          : null,
        tipo: !form.tipo ? "Seleccione el tipo." : null,
        descripcion: form.descripcion.trim().length < 5 ? "Describa el activo." : null,
        zonaId: !form.zonaId ? "Seleccione la zona." : null,
        centralId: !form.centralId ? "Seleccione la central." : null,
        fechaInstalacion: !form.fechaInstalacion ? "Indique la fecha de instalación." : form.fechaInstalacion > "2026-09-20" ? "No puede ser posterior a hoy." : null,
        vidaUtilAnios: !(Number(form.vidaUtilAnios) >= 1 && Number(form.vidaUtilAnios) <= 50) ? "Entre 1 y 50 años." : null,
        lat: !(Number(form.lat) < -11.7 && Number(form.lat) > -12.4) ? "Latitud fuera de Lima/Callao." : null,
        lng: !(Number(form.lng) < -76.8 && Number(form.lng) > -77.25) ? "Longitud fuera de Lima/Callao." : null,
        direccion: form.direccion.trim().length < 5 ? "Indique la dirección." : null,
      }
    : {};
  const hayErrores = Object.values(errores).some(Boolean);
  const previewRenov =
    form?.fechaInstalacion && Number(form.vidaUtilAnios) > 0
      ? fechaRenovacion({ fechaInstalacion: form.fechaInstalacion, vidaUtilAnios: Number(form.vidaUtilAnios) })
      : null;

  const abrir = (a?: Activo) => {
    setIntentado(false);
    setForm(
      a
        ? { ...a, vidaUtilAnios: String(a.vidaUtilAnios), lat: String(a.lat), lng: String(a.lng), clientes: String(a.clientes), editando: true }
        : { ...VACIO }
    );
  };

  const guardar = () => {
    if (!form) return;
    setIntentado(true);
    if (hayErrores) return;
    const { editando, ...rest } = form;
    const activo: Activo = {
      ...rest,
      descripcion: rest.descripcion.trim(),
      vidaUtilAnios: Number(form.vidaUtilAnios),
      lat: Number(form.lat),
      lng: Number(form.lng),
      clientes: Number(form.clientes) || 0,
    };
    mutar(
      (d) => ({
        ...d,
        activos: editando ? d.activos.map((a) => (a.codigo === activo.codigo ? activo : a)) : [...d.activos, activo],
      }),
      { accion: editando ? "Activo actualizado" : "Activo registrado", ref: activo.codigo }
    );
    notificar(`${activo.codigo} ${editando ? "actualizado" : "registrado"}. Renovación estimada: ${fmtFecha(fechaRenovacion(activo))}.`);
    setCodigoSel(activo.codigo);
    setForm(null);
  };

  const limpiar = () => {
    setQ("");
    setTipo("");
    setZona("");
    setCentral("");
    setEstado("");
    setCrit("");
    setVida("");
  };

  return (
    <AppShell
      fn="activos"
      acciones={
        <Btn variant="primary" icon={<Plus className="h-4 w-4" />} onClick={() => abrir()}>
          Nuevo activo
        </Btn>
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Stat label="Activos registrados" value={stats.total} icon={<Boxes className="h-4 w-4" />} onClick={limpiar} />
        <Stat label="Operativos" value={stats.operativos} tone="ok" onClick={() => { limpiar(); setEstado("Operativo"); }} active={estado === "Operativo"} />
        <Stat label="En alerta / fuera de servicio" value={stats.incidencia} tone="crit" hint="Ver Disponibilidad de Red" />
        <Stat label="Vida útil excedida" value={stats.excedida} tone="crit" onClick={() => { limpiar(); setVida("Vida útil excedida"); }} active={vida === "Vida útil excedida"} />
        <Stat label="Renovación en ≤ 12 meses" value={stats.proxima} tone="warn" onClick={() => { limpiar(); setVida("Renovación próxima"); }} active={vida === "Renovación próxima"} />
      </div>

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel noPad title="Catálogo de activos" subtitle={`${filtrados.length} de ${datos.activos.length} activos`} icon={<Boxes className="h-4 w-4" />}>
          <div className="grid gap-2 border-b border-mv-line px-4 py-3 sm:grid-cols-2 lg:grid-cols-4">
            <SearchInput className="sm:col-span-2" value={q} onChange={setQ} placeholder="Código, descripción, dirección o modelo" />
            <Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="">Todos los tipos</option>
              {TIPOS_ACTIVO.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </Select>
            <Select value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="">Todos los estados</option>
              {ESTADOS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </Select>
            <Select value={zona} onChange={(e) => { setZona(e.target.value); setCentral(""); }}>
              <option value="">Todas las zonas</option>
              {datos.zonas.map((z) => (
                <option key={z.id} value={z.id}>{z.nombre}</option>
              ))}
            </Select>
            <Select value={central} onChange={(e) => setCentral(e.target.value)}>
              <option value="">Todas las centrales</option>
              {datos.centrales.filter((c) => !zona || c.zonaId === zona).map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </Select>
            <Select value={crit} onChange={(e) => setCrit(e.target.value)}>
              <option value="">Toda criticidad</option>
              {CRITICIDADES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
            <Select value={vida} onChange={(e) => setVida(e.target.value as EstadoVidaUtil | "")}>
              <option value="">Toda vida útil</option>
              <option>Vigente</option>
              <option>Renovación próxima</option>
              <option>Vida útil excedida</option>
            </Select>
          </div>
          {filtrados.length === 0 ? (
            <EmptyState title="Sin activos para los filtros aplicados">
              <button className="font-semibold text-mv-green-700 underline" onClick={limpiar}>Limpiar filtros</button>
            </EmptyState>
          ) : (
            <div className="max-h-[640px] overflow-auto">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Tipo / descripción</th>
                    <th>Ubicación</th>
                    <th>Estado</th>
                    <th>Instalación</th>
                    <th>Vida útil</th>
                    <th>Renovación estimada</th>
                    <th>Criticidad</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map(({ a, v }) => (
                    <tr key={a.codigo} onClick={() => setCodigoSel(a.codigo)} className={cx("is-clickable", codigoSel === a.codigo && "is-selected")}>
                      <td className="whitespace-nowrap font-mono text-xs font-bold">{a.codigo}</td>
                      <td className="min-w-[200px]">
                        <span className="text-[11px] font-semibold uppercase text-mv-ink-2">{a.tipo}</span>
                        <span className="block">{a.descripcion}</span>
                      </td>
                      <td className="min-w-[140px] text-[12px]">
                        {cat.central(a.centralId)?.nombre}
                        <span className="block text-mv-muted">{cat.zona(a.zonaId)?.nombre}</span>
                      </td>
                      <td>
                        <Pill tone={toneActivo(a.estado)} dot>{a.estado}</Pill>
                      </td>
                      <td className="num whitespace-nowrap">{fmtFecha(a.fechaInstalacion)}</td>
                      <td className="min-w-[120px]">
                        <span className="num text-xs font-semibold">{a.vidaUtilAnios} años · {v.pct} %</span>
                        <Progress className="mt-1" value={v.pct} tone={TONO_VIDA[v.estado]} />
                      </td>
                      <td className="whitespace-nowrap">
                        <span className="num font-semibold">{fmtFecha(v.renovacion)}</span>
                        <span className="block">
                          <Pill tone={TONO_VIDA[v.estado]}>{v.estado}</Pill>
                        </span>
                      </td>
                      <td>
                        <CriticidadBadge c={a.criticidad} />
                      </td>
                      <td className="text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); abrir(a); }}
                          className="rounded-md p-1.5 text-mv-muted hover:bg-mv-surface hover:text-mv-ink"
                          aria-label={`Editar ${a.codigo}`}
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

        <DetailAside open={!!sel} onClose={() => setCodigoSel(null)}>
        <Panel title={sel ? sel.codigo : "Ficha del activo"} subtitle={sel?.descripcion ?? "Seleccione un activo"}>
          {!sel || !selVida ? (
            <EmptyState title="Ningún activo seleccionado" icon={<Info className="h-5 w-5" />}>
              La ficha muestra vida útil, planes, tickets y órdenes asociadas.
            </EmptyState>
          ) : (
            <div className="space-y-4 text-[13px]">
              <div className="flex flex-wrap gap-1.5">
                <Pill tone={toneActivo(sel.estado)} dot>{sel.estado}</Pill>
                <CriticidadBadge c={sel.criticidad} />
                <Pill tone="neutral">{sel.segmento}</Pill>
              </div>
              <div className="rounded-lg border border-mv-line p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-mv-ink">Vida útil consumida</span>
                  <span className="num font-bold">{selVida.pct} %</span>
                </div>
                <Progress className="mt-1.5" value={selVida.pct} tone={TONO_VIDA[selVida.estado]} />
                <p className="mt-1.5 text-xs text-mv-ink-2">
                  Instalado el {fmtFecha(sel.fechaInstalacion)} · {sel.vidaUtilAnios} años · renovación estimada{" "}
                  <strong className="text-mv-ink">{fmtFecha(selVida.renovacion)}</strong>
                  {selVida.diasRestantes < 0 ? ` (excedida hace ${Math.round(-selVida.diasRestantes / 30)} meses)` : ` (en ${selVida.aniosRestantes.toFixed(1)} años)`}
                </p>
              </div>
              {selVida.estado === "Vida útil excedida" && (
                <Callout tone="crit" icon={<AlertTriangle className="h-4 w-4" />}>
                  Vida útil excedida: priorice su renovación en la Planificación de Mantenimientos.
                </Callout>
              )}
              <dl className="grid grid-cols-2 gap-3">
                <KV k="Tipo" v={sel.tipo} />
                <KV k="Modelo" v={sel.modelo} />
                <KV k="Central" v={cat.central(sel.centralId)?.nombre} />
                <KV k="Zona" v={cat.zona(sel.zonaId)?.nombre} />
                <KV k="Dirección" v={sel.direccion} />
                <KV k="Coordenadas" v={fmtCoord(sel.lat, sel.lng)} mono />
                <KV k="Clientes dependientes" v={fmtNum(sel.clientes)} />
              </dl>
              <Asociados codigo={sel.codigo} />
              <Btn size="sm" icon={<Pencil className="h-3.5 w-3.5" />} onClick={() => abrir(sel)}>
                Editar activo
              </Btn>
            </div>
          )}
        </Panel>
        </DetailAside>
      </div>

      <Dialog
        open={!!form}
        onClose={() => setForm(null)}
        title={form?.editando ? `Editar activo ${form.codigo}` : "Registrar activo"}
        subtitle="La fecha estimada de renovación se calcula como fecha de instalación + vida útil."
        size="lg"
        footer={
          <>
            <Btn onClick={() => setForm(null)}>Cancelar</Btn>
            <Btn variant="primary" onClick={guardar}>{form?.editando ? "Guardar cambios" : "Registrar activo"}</Btn>
          </>
        }
      >
        {form && (
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Código" required error={intentado ? errores.codigo : null}>
              <Input value={form.codigo} disabled={form.editando} onChange={(e) => setForm({ ...form, codigo: e.target.value.toUpperCase() })} placeholder="N-026" className="font-mono" />
            </Field>
            <Field label="Tipo de activo" required error={intentado ? errores.tipo : null}>
              <Select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
                <option value="">Seleccione…</option>
                {TIPOS_ACTIVO.map((t) => <option key={t}>{t}</option>)}
              </Select>
            </Field>
            <Field label="Criticidad" required>
              <Select value={form.criticidad} onChange={(e) => setForm({ ...form, criticidad: e.target.value as Criticidad })}>
                {CRITICIDADES.map((c) => <option key={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Descripción" required className="md:col-span-2" error={intentado ? errores.descripcion : null}>
              <Input value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
            </Field>
            <Field label="Modelo / fabricante">
              <Input value={form.modelo} onChange={(e) => setForm({ ...form, modelo: e.target.value })} />
            </Field>
            <Field label="Zona" required error={intentado ? errores.zonaId : null}>
              <Select value={form.zonaId} onChange={(e) => setForm({ ...form, zonaId: e.target.value, centralId: "" })}>
                <option value="">Seleccione…</option>
                {datos.zonas.map((z) => <option key={z.id} value={z.id}>{z.nombre}</option>)}
              </Select>
            </Field>
            <Field label="Central" required error={intentado ? errores.centralId : null}>
              <Select value={form.centralId} onChange={(e) => setForm({ ...form, centralId: e.target.value })}>
                <option value="">Seleccione…</option>
                {centralesForm.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </Select>
            </Field>
            <Field label="Segmento de red">
              <Select value={form.segmento} onChange={(e) => setForm({ ...form, segmento: e.target.value as Segmento })}>
                {SEGMENTOS.map((s) => <option key={s}>{s}</option>)}
              </Select>
            </Field>
            <Field label="Dirección" required className="md:col-span-2" error={intentado ? errores.direccion : null}>
              <Input value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
            </Field>
            <Field label="Estado" required>
              <Select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value as EstadoActivo })}>
                {ESTADOS.map((s) => <option key={s}>{s}</option>)}
              </Select>
            </Field>
            <Field label="Fecha de instalación" required error={intentado ? errores.fechaInstalacion : null}>
              <Input type="date" value={form.fechaInstalacion} onChange={(e) => setForm({ ...form, fechaInstalacion: e.target.value })} />
            </Field>
            <Field label="Vida útil (años)" required error={intentado ? errores.vidaUtilAnios : null}>
              <Input type="number" min={1} max={50} value={form.vidaUtilAnios} onChange={(e) => setForm({ ...form, vidaUtilAnios: e.target.value })} />
            </Field>
            <Field label="Fecha estimada de renovación" hint="Calculada automáticamente">
              <Input value={previewRenov ? fmtFecha(previewRenov) : "—"} disabled />
            </Field>
            <Field label="Latitud" required error={intentado ? errores.lat : null}>
              <Input value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} placeholder="-12.0463" className="font-mono" />
            </Field>
            <Field label="Longitud" required error={intentado ? errores.lng : null}>
              <Input value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} placeholder="-77.0427" className="font-mono" />
            </Field>
            <Field label="Clientes dependientes">
              <Input type="number" min={0} value={form.clientes} onChange={(e) => setForm({ ...form, clientes: e.target.value })} />
            </Field>
          </div>
        )}
      </Dialog>
    </AppShell>
  );
}

function Asociados({ codigo }: { codigo: string }) {
  const { datos } = useSgmr();
  const planes = datos.planes.filter((p) => p.activoId === codigo);
  const tickets = datos.tickets.filter((t) => t.activoId === codigo);
  const ots = datos.ots.filter((o) => o.activoId === codigo);
  return (
    <div className="space-y-3 border-t border-mv-line pt-3 text-xs">
      <div>
        <p className="mb-1 font-semibold text-mv-ink">Planes de mantenimiento ({planes.length})</p>
        {planes.length === 0 ? <p className="text-mv-muted">Sin planes. <Link className="font-semibold text-mv-green-700 underline" href="/gerencial/parametros/planificacion">Planificar</Link></p> : planes.map((p) => (
          <Link key={p.id} href={`/gerencial/parametros/planificacion?plan=${p.id}`} className="flex items-center justify-between gap-2 py-0.5 hover:underline">
            <span>{p.id} · {p.actividad} · {fmtFecha(p.fechaProgramada)}</span>
            <Pill tone={tonePlan(p.estado)}>{p.estado}</Pill>
          </Link>
        ))}
      </div>
      <div>
        <p className="mb-1 font-semibold text-mv-ink">Tickets ({tickets.length})</p>
        {tickets.length === 0 ? <p className="text-mv-muted">Sin tickets.</p> : tickets.map((t) => (
          <Link key={t.id} href={`/gerencial/consulta/tickets?id=${t.id}`} className="flex items-center justify-between gap-2 py-0.5 hover:underline">
            <span>{t.id} · {t.tipo}</span>
            <Pill tone={toneTicket(t.estado)}>{t.estado}</Pill>
          </Link>
        ))}
      </div>
      <div>
        <p className="mb-1 font-semibold text-mv-ink">Órdenes de trabajo ({ots.length})</p>
        {ots.length === 0 ? <p className="text-mv-muted">Sin órdenes.</p> : ots.map((o) => (
          <div key={o.id} className="flex items-center justify-between gap-2 py-0.5">
            <span>{o.id} · {o.tipo === "PREVENTIVO" ? "Preventiva" : "Correctiva"}</span>
            <Pill tone={toneOt(o.status)}>{o.status}</Pill>
          </div>
        ))}
      </div>
    </div>
  );
}
