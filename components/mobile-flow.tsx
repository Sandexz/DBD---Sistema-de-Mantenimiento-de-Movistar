"use client";

// App de campo (componente existente, conservado y ampliado de 3 a 5 pasos).
// Secuencia: OT → Check-in (GPS) → ATS → Validación → Ejecución → Repuestos → Cierre.
// Cada fase corresponde a una función de la arquitectura OPERATIVO › DATA ENTRY:
//   · Check-in y Ejecución Dinámica  → pasos 1, 2 y 3
//   · Descargo de Repuestos          → paso 4
//   · Cierre Transaccional           → paso 5
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  QrCode,
  Camera,
  PenTool,
  CheckCircle2,
  HardHat,
  Wifi,
  Battery,
  Signal,
  Check,
  Package,
  FileCheck2,
  ShieldCheck,
  Crosshair,
  Navigation,
  Lock,
  Plus,
  Trash2,
  ClipboardList,
  ArrowRight,
  FileText,
} from "lucide-react";
import { useCatalogos, useSgmr } from "@/lib/store";
import {
  CAUSAS_FALLA,
  CLIMAS_ATS,
  EPP_ATS,
  MATERIALES,
  RIESGOS_ATS,
  actividadesPara,
  fmtCoord,
  fmtDistancia,
  medicionSugerida,
  riesgosSugeridos,
  RADIO_CHECKIN_M,
} from "@/lib/data";
import { validarAts, validarCierre, validarProximidad, validarStock, type Chequeo, type LineaDescargo } from "@/lib/validaciones";
import type { Activo, AtsRegistro, Ejecucion, OrdenTrabajo } from "@/lib/types";
import { Callout, CheckboxRow, Checklist, CriticidadBadge, Field, Input, Pill, Select, Textarea, TipoOtTag, toneOt, cx } from "./sgmr/ui";

export type FaseCampo = "checkin" | "repuestos" | "cierre";

const PASOS = [
  { n: 1, label: "Check-in", fase: "checkin" as FaseCampo },
  { n: 2, label: "ATS", fase: "checkin" as FaseCampo },
  { n: 3, label: "Ejecución", fase: "checkin" as FaseCampo },
  { n: 4, label: "Repuestos", fase: "repuestos" as FaseCampo },
  { n: 5, label: "Cierre", fase: "cierre" as FaseCampo },
];

function BigBtn({
  children,
  onClick,
  disabled,
  tone = "primary",
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  tone?: "primary" | "secondary" | "teal";
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "flex h-12 w-full items-center justify-center gap-2 rounded-lg text-sm font-bold transition-colors active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40",
        tone === "primary" && "bg-mv-green-700 text-white hover:bg-mv-green-800",
        tone === "teal" && "bg-mv-teal-700 text-white hover:bg-[#006570]",
        tone === "secondary" && "border border-mv-line-2 bg-white text-mv-ink hover:bg-mv-surface"
      )}
    >
      {children}
    </button>
  );
}

function StepTitle({ icon, title, children }: { icon: React.ReactNode; title: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-mv-line bg-mv-surface-2 p-3">
      <span className="mt-0.5 text-mv-green-700">{icon}</span>
      <div>
        <h3 className="text-sm font-bold text-mv-ink">{title}</h3>
        {children && <p className="mt-0.5 text-xs text-mv-ink-2">{children}</p>}
      </div>
    </div>
  );
}

export function MobileFlow({ fase = "checkin", otId }: { fase?: FaseCampo; otId?: string | null }) {
  const router = useRouter();
  const { datos, sesion, ahora } = useSgmr();
  const cat = useCatalogos();
  const ot = cat.ot(otId);
  const activo = cat.activo(ot?.activoId);
  const ej = cat.ejecucion(ot?.id);
  const tr = datos.tracking.find((t) => t.cuadrillaId === ot?.cuadrillaId);
  const consumos = datos.consumos.filter((c) => c.otId === ot?.id);
  const [vista, setVista] = useState<number | null>(null);
  const [cambiosCierre, setCambiosCierre] = useState<string[] | null>(null);

  useEffect(() => {
    setVista(null);
    setCambiosCierre(null);
  }, [otId, fase]);

  const hecho = {
    1: !!ej?.checkIn?.valido,
    2: !!ej?.atsValido,
    3: ot?.status === "PENDIENTE DE CIERRE" || ot?.status === "CERRADA",
    4: consumos.length > 0 || !!ej?.sinConsumo,
    5: ot?.status === "CERRADA",
  } as Record<number, boolean>;

  const pasoNatural = fase === "repuestos" ? 4 : fase === "cierre" ? 5 : !hecho[1] ? 1 : !hecho[2] ? 2 : 3;
  const paso = vista ?? pasoNatural;

  const irA = (n: number) => {
    const p = PASOS[n - 1];
    if (!ot) return;
    if (p.fase === fase) {
      if (p.fase === "checkin") setVista(n === pasoNatural ? null : n <= pasoNatural ? n : null);
      return;
    }
    router.push(`/operativo/campo/${p.fase}?ot=${ot.id}`);
  };

  const cuadrilla = cat.cuadrilla(ot?.cuadrillaId);

  return (
    <div className="mx-auto w-full max-w-[440px]">
      <div className="flex min-h-[720px] flex-col overflow-hidden bg-white sm:rounded-[28px] sm:border-[6px] sm:border-mv-ink sm:shadow-pop">
        {/* Barra de estado del dispositivo */}
        <div className="flex select-none items-center justify-between bg-mv-ink px-5 py-1.5 font-mono text-[11px] text-white">
          <span className="font-bold">{ahora.slice(11, 16)}</span>
          <span className="flex items-center gap-1.5">
            <Signal className="h-3.5 w-3.5" />
            <Wifi className="h-3.5 w-3.5" />
            <span>86%</span>
            <Battery className="h-4 w-4 text-mv-green" />
          </span>
        </div>

        {/* Cabecera de la app */}
        <div className="flex items-center justify-between border-b border-mv-line bg-white px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-mv-green text-white">
              <HardHat className="h-4 w-4" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold text-mv-ink">SGMR Campo</p>
              <p className="text-[10px] text-mv-ink-2">
                {sesion?.rol === "TECNICO" ? sesion.usuario : cuadrilla?.lider ?? "—"} · {cuadrilla ? `${cuadrilla.id} ${cuadrilla.nombre}` : "sin cuadrilla"}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-mv-green-50 px-2 py-0.5 text-[10px] font-bold text-mv-green-800">4G · GPS</span>
        </div>

        {/* Indicador de 5 pasos */}
        <div className="border-b border-mv-line bg-mv-surface-2 px-3 py-2.5">
          <ol className="flex items-start">
            {PASOS.map((p, i) => {
              const ok = hecho[p.n];
              const actual = paso === p.n;
              return (
                <li key={p.n} className="relative flex flex-1 flex-col items-center">
                  {i > 0 && <span className={cx("absolute right-1/2 top-3.5 h-0.5 w-full", hecho[p.n - 1] ? "bg-st-ok" : "bg-mv-line-2")} />}
                  <button
                    type="button"
                    onClick={() => irA(p.n)}
                    disabled={!ot}
                    className={cx(
                      "relative z-[1] flex h-7 w-7 items-center justify-center rounded-full font-mono text-xs font-bold transition-all",
                      ok && !actual && "bg-st-ok text-white",
                      actual && "bg-mv-green-700 text-white ring-4 ring-mv-green-100",
                      !ok && !actual && "bg-mv-line-2 text-mv-ink-2"
                    )}
                    aria-current={actual ? "step" : undefined}
                    aria-label={`Paso ${p.n}: ${p.label}`}
                  >
                    {ok && !actual ? <Check className="h-4 w-4" /> : p.n}
                  </button>
                  <span className={cx("mt-1 text-[10px] font-bold", actual ? "text-mv-green-800" : "text-mv-ink-2")}>{p.label}</span>
                </li>
              );
            })}
          </ol>
        </div>

        {!ot || !activo ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
            <ClipboardList className="h-8 w-8 text-mv-muted" />
            <p className="text-sm font-semibold text-mv-ink">Seleccione una orden de trabajo</p>
            <p className="text-xs text-mv-ink-2">Elija una OT asignada para iniciar la secuencia de campo.</p>
          </div>
        ) : (
          <>
            {/* Contexto de la OT */}
            <div className="border-b border-mv-line bg-white px-4 py-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-sm font-bold text-mv-ink">{ot.id}</span>
                <div className="flex items-center gap-1.5">
                  <TipoOtTag tipo={ot.tipo} />
                  <CriticidadBadge c={ot.criticality} />
                </div>
              </div>
              <p className="mt-1 font-medium text-mv-ink">{ot.infra}</p>
              <p className="text-[11px] text-mv-ink-2">{activo.direccion}</p>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-[11px] text-mv-ink-2">{ot.actividad}</span>
                <Pill tone={toneOt(ot.status)}>{ot.status}</Pill>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-4 p-4">
              {paso === 1 && <StepCheckin ot={ot} activo={activo} ej={ej} trPos={tr ? { lat: tr.lat, lng: tr.lng } : null} />}
              {paso === 2 && <StepAts ot={ot} activo={activo} ej={ej} />}
              {paso === 3 && <StepEjecucion ot={ot} activo={activo} ej={ej} />}
              {paso === 4 && <StepRepuestos ot={ot} ej={ej} />}
              {paso === 5 &&
                (ot.status === "CERRADA" ? (
                  <ResumenCierre ot={ot} cambios={cambiosCierre} />
                ) : (
                  <StepCierre ot={ot} ej={ej} consumos={consumos.length} onCerrado={setCambiosCierre} />
                ))}
            </div>
          </>
        )}

        {/* Navegación inferior entre fases */}
        <div className="flex items-center justify-between border-t border-mv-line bg-mv-surface-2 px-4 py-2 text-xs">
          <button
            type="button"
            onClick={() => irA(Math.max(1, paso - 1))}
            disabled={!ot || paso === 1}
            className="font-semibold text-mv-ink-2 hover:text-mv-ink disabled:opacity-30"
          >
            ← Paso anterior
          </button>
          <span className="num font-mono text-[11px] text-mv-muted">Paso {paso} de 5</span>
          <button
            type="button"
            onClick={() => irA(Math.min(5, paso + 1))}
            disabled={!ot || paso === 5 || !hecho[paso]}
            className="font-bold text-mv-green-800 hover:underline disabled:opacity-30"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────── Paso 1: Check-in con validación de proximidad GPS
function StepCheckin({
  ot,
  activo,
  ej,
  trPos,
}: {
  ot: OrdenTrabajo;
  activo: Activo;
  ej?: Ejecucion;
  trPos: { lat: number; lng: number } | null;
}) {
  const { registrarCheckIn, ahora, notificar } = useSgmr();
  const ultimo = trPos ?? { lat: activo.lat + 0.012, lng: activo.lng + 0.009 };
  const [pos, setPos] = useState(ultimo);
  const [origen, setOrigen] = useState<"ultima" | "sitio">("ultima");
  const [enviando, setEnviando] = useState(false);
  const v = validarProximidad(activo, pos.lat, pos.lng);

  if (ej?.checkIn?.valido) {
    return (
      <div className="space-y-3">
        <StepTitle icon={<MapPin className="h-5 w-5" />} title="Paso 1 · Check-in registrado" />
        <Callout tone="ok" title="Arribo validado por GPS">
          {ej.checkIn.hora.slice(11)} h · a {fmtDistancia(ej.checkIn.distanciaM)} del activo · {fmtCoord(ej.checkIn.lat, ej.checkIn.lng)}
        </Callout>
      </div>
    );
  }

  const marcar = () => {
    setEnviando(true);
    window.setTimeout(() => {
      registrarCheckIn(ot.id, { lat: pos.lat, lng: pos.lng, distanciaM: v.distancia, valido: v.valido, hora: ahora });
      setEnviando(false);
      notificar(v.valido ? `Check-in válido en ${ot.id}. Continúe con el ATS.` : `Check-in rechazado: está a ${fmtDistancia(v.distancia)} del activo.`, v.valido ? "ok" : "crit");
    }, 600);
  };

  return (
    <div className="flex flex-1 flex-col justify-between gap-4">
      <div className="space-y-3">
        <StepTitle icon={<MapPin className="h-5 w-5" />} title="Paso 1 · Confirmación de arribo">
          El check-in solo se acepta a {RADIO_CHECKIN_M} m o menos del activo.
        </StepTitle>

        <div className="space-y-1.5 rounded-lg border border-mv-line p-3 font-mono text-xs">
          <div className="flex justify-between text-mv-ink-2">
            <span>Activo ({activo.codigo})</span>
            <span className="text-mv-ink">{fmtCoord(activo.lat, activo.lng)}</span>
          </div>
          <div className="flex justify-between text-mv-ink-2">
            <span>Posición del dispositivo</span>
            <span className="text-mv-ink">{fmtCoord(pos.lat, pos.lng)}</span>
          </div>
          <div className="flex justify-between text-mv-ink-2">
            <span>Distancia al activo</span>
            <span className={cx("font-bold", v.valido ? "text-st-ok-fg" : "text-st-crit-fg")}>
              {fmtDistancia(v.distancia)} {v.valido ? "(en rango)" : "(fuera de rango)"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setPos(ultimo);
              setOrigen("ultima");
            }}
            className={cx(
              "flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2.5 text-xs font-semibold",
              origen === "ultima" ? "border-mv-ink bg-mv-ink text-white" : "border-mv-line text-mv-ink-2"
            )}
          >
            <Navigation className="h-3.5 w-3.5" /> Última posición
          </button>
          <button
            type="button"
            onClick={() => {
              setPos({ lat: activo.lat + 0.00011, lng: activo.lng - 0.00009 });
              setOrigen("sitio");
            }}
            className={cx(
              "flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2.5 text-xs font-semibold",
              origen === "sitio" ? "border-mv-ink bg-mv-ink text-white" : "border-mv-line text-mv-ink-2"
            )}
          >
            <Crosshair className="h-3.5 w-3.5" /> Simular arribo al sitio
          </button>
        </div>

        {ej?.checkIn && !ej.checkIn.valido && (
          <Callout tone="crit" title="Último intento rechazado">
            {ej.checkIn.hora.slice(11)} h a {fmtDistancia(ej.checkIn.distanciaM)} del activo. Acérquese al punto y vuelva a intentarlo.
          </Callout>
        )}
        <Callout tone={v.valido ? "ok" : "warn"}>{v.mensaje}</Callout>
      </div>

      <BigBtn onClick={marcar} disabled={enviando}>
        {enviando ? "Registrando GPS…" : (
          <>
            <MapPin className="h-4 w-4" /> Marcar llegada (Check-in)
          </>
        )}
      </BigBtn>
    </div>
  );
}

// ───────────────────────────── Paso 2: Análisis de Trabajo Seguro + Validación
function StepAts({ ot, activo, ej }: { ot: OrdenTrabajo; activo: Activo; ej?: Ejecucion }) {
  const { datos, registrarAts, notificar } = useSgmr();
  const jefe = datos.zonas.find((z) => z.id === activo.zonaId)?.jefeZona ?? "";
  const [ats, setAts] = useState<AtsRegistro>(
    ej?.ats ?? { riesgos: riesgosSugeridos(activo.tipo), clima: "", arnes: "", epp: [], autorizadoPor: jefe, autorizado: false }
  );
  const checks = validarAts(ats);
  const ok = checks.every((c) => c.ok);
  const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  if (ej?.atsValido && ej.ats) {
    return (
      <div className="space-y-3">
        <StepTitle icon={<ShieldCheck className="h-5 w-5" />} title="Paso 2 · ATS aprobado" />
        <Checklist items={validarAts(ej.ats)} compact />
        <Link href={`/operativo/reportes/ats?ot=${ot.id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-mv-green-700 hover:underline">
          <FileText className="h-3.5 w-3.5" /> Ver papeleta ATS
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <StepTitle icon={<ShieldCheck className="h-5 w-5" />} title="Paso 2 · Análisis de Trabajo Seguro (ATS)">
        Registre riesgos, clima, arnés, EPP y la autorización antes de ejecutar.
      </StepTitle>

      <Field label="Riesgos identificados" hint={`Sugeridos para ${activo.tipo}; confirme o ajuste.`}>
        <div className="grid gap-1.5">
          {RIESGOS_ATS.map((r) => (
            <CheckboxRow key={r} checked={ats.riesgos.includes(r)} onChange={() => setAts({ ...ats, riesgos: toggle(ats.riesgos, r) })} label={r} />
          ))}
        </div>
      </Field>

      <div className="grid grid-cols-1 gap-3">
        <Field label="Condición climática" required>
          <Select value={ats.clima} onChange={(e) => setAts({ ...ats, clima: e.target.value })}>
            <option value="">Seleccione…</option>
            {CLIMAS_ATS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </Field>
        <Field label="¿Usará arnés?" required>
          <div className="grid grid-cols-3 gap-1.5">
            {(["Sí", "No", "No aplica"] as const).map((a) => (
              <button
                type="button"
                key={a}
                onClick={() => setAts({ ...ats, arnes: a })}
                className={cx(
                  "h-10 rounded-md border text-xs font-semibold",
                  ats.arnes === a ? "border-mv-green-700 bg-mv-green-50 text-mv-green-800" : "border-mv-line text-mv-ink-2"
                )}
              >
                {a}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <Field label="Equipo de protección personal (EPP)">
        <div className="grid grid-cols-2 gap-1.5">
          {EPP_ATS.map((e) => (
            <label
              key={e}
              className={cx(
                "flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-2 text-xs",
                ats.epp.includes(e) ? "border-mv-green/50 bg-mv-green-50 font-semibold text-mv-ink" : "border-mv-line text-mv-ink-2"
              )}
            >
              <input type="checkbox" className="h-3.5 w-3.5 accent-[#3B8500]" checked={ats.epp.includes(e)} onChange={() => setAts({ ...ats, epp: toggle(ats.epp, e) })} />
              {e}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Autorización del supervisor" required>
        <Input value={ats.autorizadoPor} onChange={(e) => setAts({ ...ats, autorizadoPor: e.target.value })} placeholder="Nombre del supervisor" />
        <div className="pt-1.5">
          <CheckboxRow checked={ats.autorizado} onChange={(v) => setAts({ ...ats, autorizado: v })} label="El supervisor autoriza el inicio de los trabajos" />
        </div>
      </Field>

      <div className="space-y-2">
        <p className="text-xs font-bold text-mv-ink">Validación previa a la ejecución</p>
        <Checklist
          compact
          items={[
            { id: "gps", etiqueta: "Check-in validado por GPS", ok: !!ej?.checkIn?.valido, detalle: ej?.checkIn ? `A ${fmtDistancia(ej.checkIn.distanciaM)} del activo.` : "Sin check-in." },
            ...checks,
          ]}
        />
      </div>

      {ej?.ats && !ej.atsValido && <Callout tone="crit" title="ATS observado">Corrija los puntos marcados en rojo y vuelva a registrar.</Callout>}

      <BigBtn
        onClick={() => {
          registrarAts(ot.id, ats, ok);
          notificar(ok ? "ATS aprobado. Validación superada: puede iniciar la ejecución." : "ATS observado: no se autoriza la ejecución.", ok ? "ok" : "crit");
        }}
      >
        <ShieldCheck className="h-4 w-4" /> Registrar ATS y validar
      </BigBtn>
    </div>
  );
}

// ───────────────────────────── Paso 3: Ejecución dinámica (preventiva / correctiva)
function StepEjecucion({ ot, activo, ej }: { ot: OrdenTrabajo; activo: Activo; ej?: Ejecucion }) {
  const router = useRouter();
  const { guardarEjecucion, finalizarEjecucion, notificar } = useSgmr();
  const prev = ot.tipo === "PREVENTIVO";
  const requeridas = actividadesPara(ot.tipo);
  const [act, setAct] = useState<string[]>(ej?.actividades ?? []);
  const [medicion, setMedicion] = useState(ej?.evidencia ?? "");
  const [causa, setCausa] = useState(ej?.causa ?? "");
  const [accion, setAccion] = useState(ej?.accion ?? "");
  const [hallazgos, setHallazgos] = useState(ej?.hallazgos ?? "");
  const [reqCorr, setReqCorr] = useState(!!ej?.requiereCorrectivo);
  const finalizada = ot.status === "PENDIENTE DE CIERRE" || ot.status === "CERRADA";

  const guardar = (patch: Partial<Ejecucion>) => guardarEjecucion(ot.id, patch);

  const requisitos: Chequeo[] = [
    { id: "act", etiqueta: "Actividades completas", ok: requeridas.every((a) => act.includes(a)), detalle: `${act.filter((a) => requeridas.includes(a)).length} de ${requeridas.length}` },
    { id: "med", etiqueta: "Medición registrada", ok: medicion.trim().length >= 8, detalle: medicion.trim() || medicionSugerida(activo.tipo) },
    ...(prev
      ? []
      : [
          { id: "causa", etiqueta: "Causa de la falla", ok: !!causa, detalle: causa || "Seleccione la causa." },
          { id: "accion", etiqueta: "Acción correctiva", ok: accion.trim().length >= 5, detalle: accion.trim() || "Describa la acción aplicada." },
        ]),
  ];
  const listo = requisitos.every((r) => r.ok);

  if (finalizada) {
    return (
      <div className="space-y-3">
        <StepTitle icon={<ClipboardList className="h-5 w-5" />} title="Paso 3 · Ejecución finalizada" />
        <Callout tone="ok" title={`${requeridas.length} actividades ${prev ? "preventivas" : "correctivas"} registradas`}>
          Medición: {ej?.evidencia}
        </Callout>
        <BigBtn tone="teal" onClick={() => router.push(`/operativo/campo/repuestos?ot=${ot.id}`)}>
          Ir a Descargo de Repuestos <ArrowRight className="h-4 w-4" />
        </BigBtn>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <StepTitle icon={<ClipboardList className="h-5 w-5" />} title={`Paso 3 · Ejecución ${prev ? "preventiva" : "correctiva"}`}>
        Formulario dinámico según el tipo de OT {prev ? "(plan de mantenimiento)" : "(atención de falla)"}.
      </StepTitle>

      <Field label={prev ? "Actividades del plan preventivo" : "Actividades de atención de la falla"}>
        <div className="grid gap-1.5">
          {requeridas.map((a, i) => (
            <CheckboxRow
              key={a}
              checked={act.includes(a)}
              onChange={(v) => {
                const n = v ? [...act, a] : act.filter((x) => x !== a);
                setAct(n);
                guardar({ actividades: n });
              }}
              label={`${i + 1}. ${a}`}
            />
          ))}
        </div>
      </Field>

      {!prev && (
        <>
          <Field label="Causa de la falla" required>
            <Select
              value={causa}
              onChange={(e) => {
                setCausa(e.target.value);
                guardar({ causa: e.target.value });
              }}
            >
              <option value="">Seleccione…</option>
              {CAUSAS_FALLA.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
          </Field>
          <Field label="Acción correctiva aplicada" required>
            <Textarea value={accion} onChange={(e) => setAccion(e.target.value)} onBlur={() => guardar({ accion })} placeholder="Ej: Fusión de 48 hilos y reemplazo de mufa" />
          </Field>
        </>
      )}

      <Field label="Medición / resultado técnico" required hint={`Sugerido: ${medicionSugerida(activo.tipo)}`}>
        <Input value={medicion} onChange={(e) => setMedicion(e.target.value)} onBlur={() => guardar({ evidencia: medicion })} placeholder="Ej: Potencia -19,8 dBm" />
      </Field>

      {prev && (
        <>
          <Field label="Hallazgos de la inspección">
            <Textarea value={hallazgos} onChange={(e) => setHallazgos(e.target.value)} onBlur={() => guardar({ hallazgos })} placeholder="Estado general, desgaste, observaciones" />
          </Field>
          <CheckboxRow
            checked={reqCorr}
            onChange={(v) => {
              setReqCorr(v);
              guardar({ requiereCorrectivo: v });
            }}
            label="Se detectó una falla que requiere mantenimiento correctivo"
            hint="El NOC deberá registrar el ticket correspondiente."
          />
        </>
      )}

      <Checklist items={requisitos} compact />

      <BigBtn
        disabled={!listo}
        onClick={() => {
          guardar({ actividades: act, evidencia: medicion, causa, accion, hallazgos, requiereCorrectivo: reqCorr });
          finalizarEjecucion(ot.id);
          notificar(`Ejecución de ${ot.id} finalizada. Registre el descargo de repuestos.`);
          router.push(`/operativo/campo/repuestos?ot=${ot.id}`);
        }}
      >
        <CheckCircle2 className="h-4 w-4" /> Finalizar ejecución
      </BigBtn>
    </div>
  );
}

// ───────────────────────────── Paso 4: Descargo de repuestos con validación de stock
function StepRepuestos({ ot, ej }: { ot: OrdenTrabajo; ej?: Ejecucion }) {
  const router = useRouter();
  const { datos, descargarRepuestos, guardarEjecucion, notificar } = useSgmr();
  const stock = datos.stock[ot.cuadrillaId ?? ""] ?? {};
  const consumos = datos.consumos.filter((c) => c.otId === ot.id);
  const [lineas, setLineas] = useState<LineaDescargo[]>([]);
  const [codigo, setCodigo] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const validacion = useMemo(() => validarStock(stock, lineas), [stock, lineas]);
  const invalidas = validacion.filter((l) => !l.ok);
  const enStock = MATERIALES.filter((m) => (stock[m.codigo] ?? 0) > 0);

  if (!ej?.atsValido) {
    return (
      <div className="space-y-3">
        <StepTitle icon={<Lock className="h-5 w-5" />} title="Paso 4 · Descargo bloqueado" />
        <Callout tone="warn" title="Primero complete el check-in y el ATS">
          El descargo de materiales solo se habilita cuando la ejecución fue autorizada.
        </Callout>
        <BigBtn tone="secondary" onClick={() => router.push(`/operativo/campo/checkin?ot=${ot.id}`)}>
          Ir a Check-in y Ejecución
        </BigBtn>
      </div>
    );
  }

  const agregar = (cod: string, cant: number) => {
    if (!cod || cant <= 0) return;
    setLineas((l) => [...l, { codigo: cod, cantidad: cant }]);
    setCodigo("");
    setCantidad(1);
  };

  const confirmar = () => {
    const vales = descargarRepuestos(ot.id, lineas);
    setLineas([]);
    notificar(`Descargo registrado: ${vales.map((v) => v.id).join(", ")}. Stock de ${ot.cuadrillaId} actualizado.`);
  };

  const puedeContinuar = (consumos.length > 0 || !!ej.sinConsumo) && ot.status === "PENDIENTE DE CIERRE";

  return (
    <div className="space-y-4">
      <StepTitle icon={<QrCode className="h-5 w-5" />} title="Paso 4 · Descargo de repuestos">
        Escanee o seleccione los materiales usados. Se valida contra el stock de la cuadrilla {ot.cuadrillaId}.
      </StepTitle>

      <p className="rounded-md bg-mv-surface px-3 py-2 font-mono text-[11px] text-mv-ink-2">Previstos en la OT: {ot.materials || "—"}</p>

      <div className="rounded-lg border-2 border-dashed border-mv-line-2 p-3">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-mv-ink">
          <QrCode className="h-4 w-4 text-mv-green-700" /> Lectura rápida (stock de la cuadrilla)
        </p>
        <div className="flex flex-wrap gap-1.5">
          {enStock.length === 0 && <span className="text-xs text-mv-muted">La cuadrilla no tiene materiales en stock.</span>}
          {enStock.map((m) => (
            <button
              type="button"
              key={m.codigo}
              onClick={() => agregar(m.codigo, 1)}
              className="rounded-full border border-mv-line bg-white px-2 py-1 text-[11px] text-mv-ink-2 hover:border-mv-green/50 hover:text-mv-green-800"
            >
              + {m.nombre} <span className="num text-mv-muted">({stock[m.codigo]})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_72px_auto] items-end gap-2">
        <Field label="Material">
          <Select value={codigo} onChange={(e) => setCodigo(e.target.value)}>
            <option value="">Seleccione…</option>
            {MATERIALES.map((m) => (
              <option key={m.codigo} value={m.codigo}>
                {m.nombre} · disp. {stock[m.codigo] ?? 0}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Cant.">
          <Input type="number" min={1} value={cantidad} onChange={(e) => setCantidad(Math.max(0, parseInt(e.target.value || "0", 10)))} />
        </Field>
        <button
          type="button"
          onClick={() => agregar(codigo, cantidad)}
          disabled={!codigo || cantidad <= 0}
          className="flex h-9 w-9 items-center justify-center rounded-md bg-mv-ink text-white disabled:opacity-30"
          aria-label="Agregar material"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {validacion.length > 0 && (
        <ul className="divide-y divide-mv-line rounded-lg border border-mv-line text-xs">
          {validacion.map((l, i) => {
            const m = MATERIALES.find((x) => x.codigo === l.codigo);
            return (
              <li key={i} className={cx("flex items-center justify-between gap-2 px-3 py-2", !l.ok && "bg-st-crit-bg")}>
                <div className="min-w-0">
                  <p className="font-semibold text-mv-ink">{m?.nombre}</p>
                  <p className={cx("text-[11px]", l.ok ? "text-mv-ink-2" : "font-semibold text-st-crit-fg")}>
                    {l.cantidad} {m?.unidad} · disponible {l.disponible} {l.ok ? "" : "— stock insuficiente"}
                  </p>
                </div>
                <button type="button" onClick={() => setLineas((x) => x.filter((_, j) => j !== i))} className="p-1 text-mv-muted hover:text-st-crit" aria-label="Quitar">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {invalidas.length > 0 && (
        <Callout tone="crit" title="Validación de stock: descargo bloqueado">
          No hay stock suficiente en la cuadrilla para {invalidas.length === 1 ? "un material" : `${invalidas.length} materiales`}. Solicite reposición al almacén o ajuste la cantidad.
        </Callout>
      )}

      <BigBtn tone="teal" onClick={confirmar} disabled={lineas.length === 0 || invalidas.length > 0}>
        <Package className="h-4 w-4" /> Confirmar descargo ({lineas.length})
      </BigBtn>

      {consumos.length > 0 && (
        <div className="rounded-lg border border-st-ok/30 bg-st-ok-bg p-3 text-xs text-st-ok-fg">
          <p className="font-bold">Materiales descargados</p>
          <ul className="mt-1 space-y-0.5">
            {consumos.map((c) => (
              <li key={c.id} className="flex justify-between gap-2">
                <span>
                  {c.id} · {MATERIALES.find((m) => m.codigo === c.codigo)?.nombre}
                </span>
                <span className="num font-semibold">× {c.cantidad}</span>
              </li>
            ))}
          </ul>
          <Link href={`/operativo/reportes/vale-consumo?ot=${ot.id}`} className="mt-1.5 inline-block font-semibold underline">
            Ver vale de consumo
          </Link>
        </div>
      )}

      {consumos.length === 0 && (
        <CheckboxRow
          checked={!!ej.sinConsumo}
          onChange={(v) => guardarEjecucion(ot.id, { sinConsumo: v })}
          label="No se utilizaron materiales en esta OT"
          hint="Deja constancia de consumo cero para el cierre."
        />
      )}

      {ot.status === "EN EJECUCIÓN" && (
        <Callout tone="info">
          La ejecución aún no fue finalizada. <Link href={`/operativo/campo/checkin?ot=${ot.id}`}>Complete el paso 3</Link> para habilitar el cierre.
        </Callout>
      )}

      <BigBtn tone="primary" disabled={!puedeContinuar} onClick={() => router.push(`/operativo/campo/cierre?ot=${ot.id}`)}>
        Continuar a Cierre Transaccional <ArrowRight className="h-4 w-4" />
      </BigBtn>
    </div>
  );
}

// ───────────────────────────── Paso 5: Cierre transaccional con validación de evidencia
function StepCierre({
  ot,
  ej,
  consumos,
  onCerrado,
}: {
  ot: OrdenTrabajo;
  ej?: Ejecucion;
  consumos: number;
  onCerrado: (c: string[]) => void;
}) {
  const { datos, guardarEjecucion, cerrarOt, notificar } = useSgmr();
  const activo = datos.activos.find((a) => a.codigo === ot.activoId);
  const jefe = datos.zonas.find((z) => z.id === activo?.zonaId)?.jefeZona;
  const [firmante, setFirmante] = useState(ej?.firmante ?? "");
  const [obs, setObs] = useState(ej?.observacion ?? "");
  const [cerrando, setCerrando] = useState(false);

  if (ot.status !== "PENDIENTE DE CIERRE") {
    return (
      <div className="space-y-3">
        <StepTitle icon={<Lock className="h-5 w-5" />} title="Paso 5 · Cierre no disponible" />
        <Callout tone="warn" title="La OT aún no está pendiente de cierre">
          Estado actual: {ot.status}. Complete la ejecución (paso 3) y el descargo de repuestos (paso 4).
        </Callout>
        <Link href={`/operativo/campo/checkin?ot=${ot.id}`} className="text-xs font-semibold text-mv-green-700 underline">
          Ir a Check-in y Ejecución
        </Link>
      </div>
    );
  }

  const checks: Chequeo[] = [
    ...validarCierre(ot, ej, actividadesPara(ot.tipo)),
    {
      id: "repuestos",
      etiqueta: "Descargo de repuestos",
      ok: consumos > 0 || !!ej?.sinConsumo,
      detalle: consumos > 0 ? `${consumos} línea(s) en el vale de consumo.` : ej?.sinConsumo ? "Declarado sin consumo de materiales." : "Registre el descargo o declare consumo cero.",
    },
  ];
  const ok = checks.every((c) => c.ok);

  const cerrar = () => {
    setCerrando(true);
    window.setTimeout(() => {
      const cambios = cerrarOt(ot.id);
      setCerrando(false);
      onCerrado(cambios);
      notificar(`${ot.id} cerrada. Ticket, plan, activo y tracking actualizados.`);
    }, 700);
  };

  return (
    <div className="space-y-4">
      <StepTitle icon={<FileCheck2 className="h-5 w-5" />} title="Paso 5 · Evidencias y cierre de la OT">
        La OT solo se cierra con evidencia completa.
      </StepTitle>

      <div className="flex items-center justify-between rounded-lg border border-mv-line p-3">
        <span className="flex items-center gap-2 text-xs font-semibold text-mv-ink">
          <Camera className="h-4 w-4 text-mv-ink-2" /> Fotografía del trabajo terminado
        </span>
        {ej?.foto ? (
          <span className="flex items-center gap-1 font-mono text-xs font-bold text-st-ok-fg">
            <Check className="h-3.5 w-3.5" /> 1 foto
          </span>
        ) : (
          <button type="button" onClick={() => guardarEjecucion(ot.id, { foto: true })} className="rounded-md bg-mv-surface px-2.5 py-1.5 text-xs font-semibold text-mv-ink hover:bg-mv-line">
            Capturar evidencia
          </button>
        )}
      </div>

      <Field label="Firmante de la conformidad" required hint={ot.tipo === "PREVENTIVO" ? `Sugerido: ${jefe} (jefe de zona)` : "Representante del cliente o jefe de zona"}>
        <Input value={firmante} onChange={(e) => setFirmante(e.target.value)} onBlur={() => guardarEjecucion(ot.id, { firmante })} placeholder="Nombre y cargo" />
      </Field>

      <Field label="Tipo de conformidad" required>
        <Select value={ej?.conformidad ?? ""} onChange={(e) => guardarEjecucion(ot.id, { conformidad: (e.target.value || undefined) as Ejecucion["conformidad"] })}>
          <option value="">Seleccione…</option>
          <option>Conforme</option>
          <option>Conforme con observaciones</option>
        </Select>
      </Field>

      <div className="rounded-lg border border-mv-line p-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs font-semibold text-mv-ink">
            <PenTool className="h-4 w-4 text-mv-ink-2" /> Firma de conformidad
          </span>
          {ej?.firma ? (
            <span className="flex items-center gap-1 font-mono text-xs font-bold text-st-ok-fg">
              <Check className="h-3.5 w-3.5" /> Firmado
            </span>
          ) : (
            <button
              type="button"
              disabled={firmante.trim().length < 3}
              onClick={() => guardarEjecucion(ot.id, { firma: true, firmante })}
              className="rounded-md bg-mv-surface px-2.5 py-1.5 text-xs font-semibold text-mv-ink hover:bg-mv-line disabled:opacity-40"
            >
              Obtener firma
            </button>
          )}
        </div>
        {ej?.firma && (
          <svg viewBox="0 0 200 40" className="mt-2 h-10 w-full text-mv-ink">
            <path d="M5 30 C 25 5, 35 35, 55 18 S 85 30, 100 12 S 130 34, 150 16 S 180 26, 195 10" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        )}
      </div>

      <Field label="Observaciones">
        <Textarea value={obs} onChange={(e) => setObs(e.target.value)} onBlur={() => guardarEjecucion(ot.id, { observacion: obs })} placeholder="Opcional" />
      </Field>

      <div className="space-y-2">
        <p className="text-xs font-bold text-mv-ink">Validación de evidencia para el cierre</p>
        <Checklist items={checks} compact />
      </div>

      <BigBtn onClick={cerrar} disabled={!ok || cerrando}>
        {cerrando ? "Sincronizando cierre con el NOC…" : (
          <>
            <FileCheck2 className="h-4 w-4" /> Cerrar OT {ot.id}
          </>
        )}
      </BigBtn>
    </div>
  );
}

function ResumenCierre({ ot, cambios }: { ot: OrdenTrabajo; cambios: string[] | null }) {
  const { datos } = useSgmr();
  const ticket = datos.tickets.find((t) => t.id === ot.ticketId);
  const lista =
    cambios ??
    [
      `Orden ${ot.id}: CERRADA ${ot.cerradaEn ? `(${ot.cerradaEn.slice(11)})` : ""}`,
      ticket ? `Ticket ${ticket.id}: ${ticket.estado}` : null,
      ot.planId ? `Plan ${ot.planId}: Ejecutado` : null,
    ].filter(Boolean) as string[];
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col items-center gap-2 pt-2 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-st-ok bg-st-ok-bg text-st-ok-fg">
          <Check className="h-7 w-7" />
        </span>
        <h3 className="text-lg font-bold text-mv-ink">Cierre transaccional completado</h3>
        <p className="text-xs text-mv-ink-2">Todas las actualizaciones se aplicaron en una sola operación.</p>
      </div>
      <ul className="space-y-1.5 rounded-lg border border-mv-line bg-mv-surface-2 p-3 text-xs">
        {lista.map((c) => (
          <li key={c} className="flex items-start gap-2 text-mv-ink">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-st-ok" /> {c}
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-1 gap-2 text-xs">
        <Link href={`/operativo/reportes/conformidad?ot=${ot.id}`} className="flex items-center justify-between rounded-lg border border-mv-line px-3 py-2.5 font-semibold text-mv-ink hover:bg-mv-surface">
          Constancia de Conformidad de Servicio <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link href={`/operativo/reportes/vale-consumo?ot=${ot.id}`} className="flex items-center justify-between rounded-lg border border-mv-line px-3 py-2.5 font-semibold text-mv-ink hover:bg-mv-surface">
          Vale de Consumo de Materiales <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link href={`/operativo/reportes/ats?ot=${ot.id}`} className="flex items-center justify-between rounded-lg border border-mv-line px-3 py-2.5 font-semibold text-mv-ink hover:bg-mv-surface">
          Papeleta ATS <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <Link href="/operativo/campo/checkin" className="mt-auto flex h-11 items-center justify-center rounded-lg bg-mv-ink text-sm font-semibold text-white">
        Volver a mis órdenes
      </Link>
    </div>
  );
}
