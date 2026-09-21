"use client";

// GERENCIAL › Mantenimiento de Parámetros › Zonas y Centrales
// Estructura jerárquica REGIÓN → ZONA → CENTRAL → ACTIVOS.
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, Globe2, MapPinned, Building, Box, Plus, Pencil, Trash2, Network } from "lucide-react";
import { AppShell } from "@/components/sgmr/shell";
import { GeoMap, LeyendaItem, type MapPoint } from "@/components/sgmr/geo-map";
import { Btn, Callout, Dialog, Field, Input, KV, Panel, Pill, Select, Stat, toneActivo, CriticidadBadge, cx } from "@/components/sgmr/ui";
import { useSgmr } from "@/lib/store";
import { fmtCoord, fmtNum } from "@/lib/data";
import type { Central, Zona } from "@/lib/types";

type Nodo = { tipo: "region" | "zona" | "central" | "activo"; id: string };

export default function ZonasPage() {
  const { datos, mutar, notificar } = useSgmr();
  const [abiertos, setAbiertos] = useState<Record<string, boolean>>({ "REG-LIM": true, "ZN-NOR": true });
  const [sel, setSel] = useState<Nodo>({ tipo: "zona", id: "ZN-NOR" });
  const [zonaForm, setZonaForm] = useState<(Zona & { nuevo: boolean }) | null>(null);
  const [centralForm, setCentralForm] = useState<(Omit<Central, "lat" | "lng" | "clientes"> & { lat: string; lng: string; clientes: string; nuevo: boolean }) | null>(null);
  const [intentado, setIntentado] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  const toggle = (id: string) => setAbiertos((a) => ({ ...a, [id]: !a[id] }));
  const incid = (ids: string[]) => datos.activos.filter((a) => ids.includes(a.codigo) && a.estado !== "Operativo").length;

  const activosDe = (n: Nodo) => {
    if (n.tipo === "region") {
      const zs = datos.zonas.filter((z) => z.regionId === n.id).map((z) => z.id);
      return datos.activos.filter((a) => zs.includes(a.zonaId));
    }
    if (n.tipo === "zona") return datos.activos.filter((a) => a.zonaId === n.id);
    if (n.tipo === "central") return datos.activos.filter((a) => a.centralId === n.id);
    return datos.activos.filter((a) => a.codigo === n.id);
  };
  const activosSel = activosDe(sel);
  const centralesSel =
    sel.tipo === "region"
      ? datos.centrales.filter((c) => datos.zonas.find((z) => z.id === c.zonaId)?.regionId === sel.id)
      : sel.tipo === "zona"
      ? datos.centrales.filter((c) => c.zonaId === sel.id)
      : sel.tipo === "central"
      ? datos.centrales.filter((c) => c.id === sel.id)
      : datos.centrales.filter((c) => c.id === activosSel[0]?.centralId);

  const puntos: MapPoint[] = useMemo(
    () => [
      ...datos.centrales.map((c) => ({
        id: c.id,
        lat: c.lat,
        lng: c.lng,
        label: c.nombre,
        kind: "central" as const,
        tone: centralesSel.some((x) => x.id === c.id) ? ("brand" as const) : ("neutral" as const),
      })),
      ...activosSel.map((a) => ({ id: a.codigo, lat: a.lat, lng: a.lng, label: a.codigo, tone: toneActivo(a.estado), kind: "activo" as const })),
    ],
    [datos.centrales, centralesSel, activosSel]
  );

  const selZona = sel.tipo === "zona" ? datos.zonas.find((z) => z.id === sel.id) : undefined;
  const selCentral = sel.tipo === "central" ? datos.centrales.find((c) => c.id === sel.id) : undefined;
  const selRegion = sel.tipo === "region" ? datos.regiones.find((r) => r.id === sel.id) : undefined;
  const selActivo = sel.tipo === "activo" ? datos.activos.find((a) => a.codigo === sel.id) : undefined;

  // ── Validaciones
  const eZona = zonaForm
    ? {
        id: !/^ZN-[A-Z]{3}$/.test(zonaForm.id) ? "Formato ZN-XXX (tres letras)." : zonaForm.nuevo && datos.zonas.some((z) => z.id === zonaForm.id) ? "Código ya registrado." : null,
        nombre: zonaForm.nombre.trim().length < 3 ? "Indique el nombre." : null,
        jefeZona: zonaForm.jefeZona.trim().length < 5 ? "Indique el jefe de zona." : null,
      }
    : {};
  const eCentral = centralForm
    ? {
        id: !/^CEN-[A-Z]{3}$/.test(centralForm.id) ? "Formato CEN-XXX (tres letras)." : centralForm.nuevo && datos.centrales.some((c) => c.id === centralForm.id) ? "Código ya registrado." : null,
        nombre: centralForm.nombre.trim().length < 4 ? "Indique el nombre." : null,
        zonaId: !centralForm.zonaId ? "Seleccione la zona." : null,
        direccion: centralForm.direccion.trim().length < 5 ? "Indique la dirección." : null,
        lat: !(Number(centralForm.lat) < -11.7 && Number(centralForm.lat) > -12.4) ? "Latitud fuera de Lima/Callao." : null,
        lng: !(Number(centralForm.lng) < -76.8 && Number(centralForm.lng) > -77.25) ? "Longitud fuera de Lima/Callao." : null,
      }
    : {};

  const guardarZona = () => {
    if (!zonaForm) return;
    setIntentado(true);
    if (Object.values(eZona).some(Boolean)) return;
    const { nuevo, ...z } = zonaForm;
    mutar((d) => ({ ...d, zonas: nuevo ? [...d.zonas, z] : d.zonas.map((x) => (x.id === z.id ? z : x)) }), {
      accion: nuevo ? "Zona registrada" : "Zona actualizada",
      ref: z.id,
    });
    notificar(`Zona ${z.nombre} ${nuevo ? "registrada" : "actualizada"}.`);
    setSel({ tipo: "zona", id: z.id });
    setAbiertos((a) => ({ ...a, [z.regionId]: true }));
    setZonaForm(null);
  };

  const guardarCentral = () => {
    if (!centralForm) return;
    setIntentado(true);
    if (Object.values(eCentral).some(Boolean)) return;
    const { nuevo, ...c } = centralForm;
    const central: Central = { ...c, lat: Number(c.lat), lng: Number(c.lng), clientes: Number(c.clientes) || 0 };
    mutar((d) => ({ ...d, centrales: nuevo ? [...d.centrales, central] : d.centrales.map((x) => (x.id === central.id ? central : x)) }), {
      accion: nuevo ? "Central registrada" : "Central actualizada",
      ref: central.id,
    });
    notificar(`${central.nombre} ${nuevo ? "registrada" : "actualizada"}.`);
    setSel({ tipo: "central", id: central.id });
    setAbiertos((a) => ({ ...a, [central.zonaId]: true }));
    setCentralForm(null);
  };

  const eliminarCentral = (c: Central) => {
    const n = datos.activos.filter((a) => a.centralId === c.id).length;
    if (n > 0) {
      setAviso(`No se puede eliminar ${c.nombre}: tiene ${n} activo(s) asociado(s). Reasígnelos primero en Gestión de Activos.`);
      return;
    }
    mutar((d) => ({ ...d, centrales: d.centrales.filter((x) => x.id !== c.id) }), { accion: "Central eliminada", ref: c.id });
    notificar(`${c.nombre} eliminada.`, "info");
    setSel({ tipo: "zona", id: c.zonaId });
  };

  const fila = (n: Nodo, nivel: number, icon: React.ReactNode, texto: React.ReactNode, extra: React.ReactNode, expandible: boolean) => {
    const activo = sel.tipo === n.tipo && sel.id === n.id;
    return (
      <div
        className={cx("flex items-center gap-1.5 rounded-md py-1.5 pr-2 text-[13px]", activo ? "bg-mv-green-50 font-semibold" : "hover:bg-mv-surface")}
        style={{ paddingLeft: 6 + nivel * 18 }}
      >
        {expandible ? (
          <button onClick={() => toggle(n.id)} className="rounded p-0.5 text-mv-muted hover:text-mv-ink" aria-label={abiertos[n.id] ? "Contraer" : "Expandir"}>
            {abiertos[n.id] ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </button>
        ) : (
          <span className="w-[18px]" />
        )}
        <button onClick={() => setSel(n)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
          <span className="shrink-0 text-mv-muted">{icon}</span>
          <span className="min-w-0 truncate text-mv-ink">{texto}</span>
          <span className="ml-auto flex shrink-0 items-center gap-1.5">{extra}</span>
        </button>
      </div>
    );
  };

  return (
    <AppShell
      fn="zonas"
      acciones={
        <>
          <Btn icon={<Plus className="h-4 w-4" />} onClick={() => { setIntentado(false); setZonaForm({ id: "ZN-", nombre: "", regionId: "REG-LIM", jefeZona: "", nuevo: true }); }}>
            Nueva zona
          </Btn>
          <Btn
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => {
              setIntentado(false);
              setCentralForm({ id: "CEN-", nombre: "", zonaId: selZona?.id ?? selCentral?.zonaId ?? "", tipo: "Central de distribución", direccion: "", lat: "", lng: "", clientes: "0", nuevo: true });
            }}
          >
            Nueva central
          </Btn>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Regiones" value={datos.regiones.length} icon={<Globe2 className="h-4 w-4" />} />
        <Stat label="Zonas" value={datos.zonas.length} icon={<MapPinned className="h-4 w-4" />} />
        <Stat label="Centrales" value={datos.centrales.length} icon={<Building className="h-4 w-4" />} />
        <Stat label="Activos georreferenciados" value={datos.activos.length} icon={<Box className="h-4 w-4" />} />
      </div>

      {aviso && (
        <Callout tone="crit" title="Validación de integridad">
          {aviso} <button className="ml-1 underline" onClick={() => setAviso(null)}>Entendido</button>
        </Callout>
      )}

      <div className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
        <Panel title="Estructura territorial" subtitle="Región → Zona → Central → Activos" icon={<Network className="h-4 w-4" />} bodyClassName="p-2">
          <div className="max-h-[640px] space-y-0.5 overflow-y-auto">
            {datos.regiones.map((r) => {
              const zonas = datos.zonas.filter((z) => z.regionId === r.id);
              const activosR = activosDe({ tipo: "region", id: r.id });
              return (
                <div key={r.id}>
                  {fila({ tipo: "region", id: r.id }, 0, <Globe2 className="h-4 w-4" />, <span className="font-semibold">{r.nombre}</span>, <span className="num text-[11px] text-mv-muted">{zonas.length} zonas</span>, true)}
                  {abiertos[r.id] &&
                    zonas.map((z) => {
                      const centrales = datos.centrales.filter((c) => c.zonaId === z.id);
                      const az = datos.activos.filter((a) => a.zonaId === z.id);
                      const nInc = incid(az.map((a) => a.codigo));
                      return (
                        <div key={z.id}>
                          {fila(
                            { tipo: "zona", id: z.id },
                            1,
                            <MapPinned className="h-4 w-4" />,
                            z.nombre,
                            <>
                              {nInc > 0 && <Pill tone="warn">{nInc}</Pill>}
                              <span className="num text-[11px] text-mv-muted">{centrales.length} centr.</span>
                            </>,
                            true
                          )}
                          {abiertos[z.id] &&
                            centrales.map((c) => {
                              const ac = datos.activos.filter((a) => a.centralId === c.id);
                              const ci = incid(ac.map((a) => a.codigo));
                              return (
                                <div key={c.id}>
                                  {fila(
                                    { tipo: "central", id: c.id },
                                    2,
                                    <Building className="h-4 w-4" />,
                                    c.nombre,
                                    <>
                                      {ci > 0 && <Pill tone="warn">{ci}</Pill>}
                                      <span className="num text-[11px] text-mv-muted">{ac.length} act.</span>
                                    </>,
                                    ac.length > 0
                                  )}
                                  {abiertos[c.id] &&
                                    ac.map((a) =>
                                      <React.Fragment key={a.codigo}>
                                        {fila(
                                          { tipo: "activo", id: a.codigo },
                                          3,
                                          <span className={cx("inline-block h-2 w-2 rounded-full", a.estado === "Operativo" ? "bg-st-ok" : a.estado === "Fuera de servicio" ? "bg-st-crit" : a.estado === "En alerta" ? "bg-st-warn" : "bg-st-info")} />,
                                          <span className="font-mono text-xs">{a.codigo} <span className="font-sans text-mv-ink-2">· {a.tipo}</span></span>,
                                          null,
                                          false
                                        )}
                                      </React.Fragment>
                                    )}
                                </div>
                              );
                            })}
                        </div>
                      );
                    })}
                  {abiertos[r.id] && zonas.length === 0 && <p className="py-1 pl-10 text-xs text-mv-muted">Sin zonas</p>}
                  {activosR.length === 0 && null}
                </div>
              );
            })}
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel
            title={selRegion?.nombre ?? selZona?.nombre ?? selCentral?.nombre ?? selActivo?.codigo ?? ""}
            subtitle={sel.tipo === "region" ? "Región" : sel.tipo === "zona" ? `Zona · ${datos.regiones.find((r) => r.id === selZona?.regionId)?.nombre}` : sel.tipo === "central" ? `Central · ${datos.zonas.find((z) => z.id === selCentral?.zonaId)?.nombre}` : "Activo"}
            actions={
              selZona ? (
                <Btn size="sm" icon={<Pencil className="h-3.5 w-3.5" />} onClick={() => { setIntentado(false); setZonaForm({ ...selZona, nuevo: false }); }}>Editar zona</Btn>
              ) : selCentral ? (
                <>
                  <Btn size="sm" icon={<Pencil className="h-3.5 w-3.5" />} onClick={() => { setIntentado(false); setCentralForm({ ...selCentral, lat: String(selCentral.lat), lng: String(selCentral.lng), clientes: String(selCentral.clientes), nuevo: false }); }}>Editar</Btn>
                  <Btn size="sm" variant="ghost" icon={<Trash2 className="h-3.5 w-3.5" />} onClick={() => eliminarCentral(selCentral)}>Eliminar</Btn>
                </>
              ) : selActivo ? (
                <Link href={`/gerencial/parametros/activos?codigo=${selActivo.codigo}`}><Btn size="sm">Abrir ficha del activo</Btn></Link>
              ) : null
            }
          >
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {selZona && (
                <>
                  <KV k="Código" v={selZona.id} mono />
                  <KV k="Jefe de zona" v={selZona.jefeZona} />
                  <KV k="Centrales" v={centralesSel.length} />
                  <KV k="Activos (con incidencia)" v={`${activosSel.length} (${incid(activosSel.map((a) => a.codigo))})`} />
                </>
              )}
              {selCentral && (
                <>
                  <KV k="Código" v={selCentral.id} mono />
                  <KV k="Tipo" v={selCentral.tipo} />
                  <KV k="Clientes" v={fmtNum(selCentral.clientes)} />
                  <KV k="Coordenadas" v={fmtCoord(selCentral.lat, selCentral.lng)} mono />
                  <KV k="Dirección" v={selCentral.direccion} />
                  <KV k="Activos" v={activosSel.length} />
                </>
              )}
              {selRegion && (
                <>
                  <KV k="Código" v={selRegion.id} mono />
                  <KV k="Zonas" v={datos.zonas.filter((z) => z.regionId === selRegion.id).length} />
                  <KV k="Centrales" v={centralesSel.length} />
                  <KV k="Activos" v={activosSel.length} />
                </>
              )}
              {selActivo && (
                <>
                  <KV k="Tipo" v={selActivo.tipo} />
                  <KV k="Estado" v={<Pill tone={toneActivo(selActivo.estado)} dot>{selActivo.estado}</Pill>} />
                  <KV k="Criticidad" v={<CriticidadBadge c={selActivo.criticidad} />} />
                  <KV k="Dirección" v={selActivo.direccion} />
                </>
              )}
            </dl>
          </Panel>

          <GeoMap
            points={puntos}
            selected={sel.tipo === "central" ? sel.id : sel.tipo === "activo" ? sel.id : null}
            onSelect={(id) => setSel(datos.centrales.some((c) => c.id === id) ? { tipo: "central", id } : { tipo: "activo", id })}
            height={400}
            showLabels={sel.tipo === "central" || sel.tipo === "activo" ? "selected" : "none"}
            leyenda={
              <>
                <LeyendaItem tone="brand" label="Central seleccionada" shape="square" />
                <LeyendaItem tone="neutral" label="Otras centrales" shape="square" />
                <LeyendaItem tone="ok" label="Activo operativo" />
                <LeyendaItem tone="warn" label="En alerta" />
                <LeyendaItem tone="crit" label="Fuera de servicio" />
              </>
            }
          />
        </div>
      </div>

      <Dialog
        open={!!zonaForm}
        onClose={() => setZonaForm(null)}
        title={zonaForm?.nuevo ? "Nueva zona" : `Editar zona ${zonaForm?.id}`}
        footer={<><Btn onClick={() => setZonaForm(null)}>Cancelar</Btn><Btn variant="primary" onClick={guardarZona}>Guardar</Btn></>}
      >
        {zonaForm && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Código" required error={intentado ? eZona.id : null}>
              <Input value={zonaForm.id} disabled={!zonaForm.nuevo} onChange={(e) => setZonaForm({ ...zonaForm, id: e.target.value.toUpperCase() })} className="font-mono" />
            </Field>
            <Field label="Región" required>
              <Select value={zonaForm.regionId} onChange={(e) => setZonaForm({ ...zonaForm, regionId: e.target.value })}>
                {datos.regiones.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
              </Select>
            </Field>
            <Field label="Nombre" required error={intentado ? eZona.nombre : null}>
              <Input value={zonaForm.nombre} onChange={(e) => setZonaForm({ ...zonaForm, nombre: e.target.value })} />
            </Field>
            <Field label="Jefe de zona" required error={intentado ? eZona.jefeZona : null}>
              <Input value={zonaForm.jefeZona} onChange={(e) => setZonaForm({ ...zonaForm, jefeZona: e.target.value })} placeholder="Ing. Nombre Apellido" />
            </Field>
          </div>
        )}
      </Dialog>

      <Dialog
        open={!!centralForm}
        onClose={() => setCentralForm(null)}
        title={centralForm?.nuevo ? "Nueva central" : `Editar ${centralForm?.id}`}
        size="lg"
        footer={<><Btn onClick={() => setCentralForm(null)}>Cancelar</Btn><Btn variant="primary" onClick={guardarCentral}>Guardar</Btn></>}
      >
        {centralForm && (
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Código" required error={intentado ? eCentral.id : null}>
              <Input value={centralForm.id} disabled={!centralForm.nuevo} onChange={(e) => setCentralForm({ ...centralForm, id: e.target.value.toUpperCase() })} className="font-mono" />
            </Field>
            <Field label="Nombre" required className="sm:col-span-2" error={intentado ? eCentral.nombre : null}>
              <Input value={centralForm.nombre} onChange={(e) => setCentralForm({ ...centralForm, nombre: e.target.value })} />
            </Field>
            <Field label="Zona" required error={intentado ? eCentral.zonaId : null}>
              <Select value={centralForm.zonaId} onChange={(e) => setCentralForm({ ...centralForm, zonaId: e.target.value })}>
                <option value="">Seleccione…</option>
                {datos.zonas.map((z) => <option key={z.id} value={z.id}>{z.nombre}</option>)}
              </Select>
            </Field>
            <Field label="Tipo">
              <Select value={centralForm.tipo} onChange={(e) => setCentralForm({ ...centralForm, tipo: e.target.value })}>
                <option>Central principal</option>
                <option>Central de distribución</option>
                <option>Nodo de agregación</option>
              </Select>
            </Field>
            <Field label="Clientes">
              <Input type="number" value={centralForm.clientes} onChange={(e) => setCentralForm({ ...centralForm, clientes: e.target.value })} />
            </Field>
            <Field label="Dirección" required className="sm:col-span-3" error={intentado ? eCentral.direccion : null}>
              <Input value={centralForm.direccion} onChange={(e) => setCentralForm({ ...centralForm, direccion: e.target.value })} />
            </Field>
            <Field label="Latitud" required error={intentado ? eCentral.lat : null}>
              <Input value={centralForm.lat} onChange={(e) => setCentralForm({ ...centralForm, lat: e.target.value })} className="font-mono" placeholder="-12.0500" />
            </Field>
            <Field label="Longitud" required error={intentado ? eCentral.lng : null}>
              <Input value={centralForm.lng} onChange={(e) => setCentralForm({ ...centralForm, lng: e.target.value })} className="font-mono" placeholder="-77.0400" />
            </Field>
          </div>
        )}
      </Dialog>
    </AppShell>
  );
}
