"use client";

// Plantilla común de las tres funciones de campo (Check-in y Ejecución Dinámica,
// Descargo de Repuestos y Cierre Transaccional): selector de OT asignadas + app móvil.
import React, { useMemo } from "react";
import Link from "next/link";
import { MapPinned, PackageMinus, FileCheck2, ChevronRight, Info } from "lucide-react";
import { AppShell } from "./shell";
import { MobileFlow, type FaseCampo } from "@/components/mobile-flow";
import { useCatalogos, useSgmr } from "@/lib/store";
import { useQueryParam } from "@/lib/use-query";
import type { EstadoOt } from "@/lib/types";
import { Panel, Pill, TipoOtTag, toneOt, cx } from "./ui";

const FASES: Record<FaseCampo, { fn: string; estados: EstadoOt[]; titulo: string; texto: string }> = {
  checkin: {
    fn: "checkin",
    estados: ["ASIGNADA", "EN RUTA", "EN EJECUCIÓN"],
    titulo: "Pasos 1–3",
    texto: "Check-in con validación de proximidad GPS, ATS con validación previa y ejecución dinámica según el tipo de OT.",
  },
  repuestos: {
    fn: "repuestos",
    estados: ["EN EJECUCIÓN", "PENDIENTE DE CIERRE"],
    titulo: "Paso 4",
    texto: "Descargo de los materiales usados; la cantidad se valida contra el stock de la cuadrilla.",
  },
  cierre: {
    fn: "cierre",
    estados: ["PENDIENTE DE CIERRE"],
    titulo: "Paso 5",
    texto: "Cierre con evidencia obligatoria. Actualiza en una sola operación la OT, el ticket, el plan, el activo y el tracking.",
  },
};

const SECUENCIA: { fase: FaseCampo; nombre: string; Icon: typeof MapPinned }[] = [
  { fase: "checkin", nombre: "Check-in y Ejecución Dinámica", Icon: MapPinned },
  { fase: "repuestos", nombre: "Descargo de Repuestos", Icon: PackageMinus },
  { fase: "cierre", nombre: "Cierre Transaccional", Icon: FileCheck2 },
];

export function CampoPage({ fase }: { fase: FaseCampo }) {
  const { datos, sesion } = useSgmr();
  const cat = useCatalogos();
  const [otParam, setOtParam, leido] = useQueryParam("ot");
  const cfg = FASES[fase];

  const misOts = useMemo(
    () =>
      datos.ots.filter(
        (o) => sesion?.rol !== "TECNICO" || (sesion.cuadrillaId && o.cuadrillaId === sesion.cuadrillaId)
      ),
    [datos.ots, sesion]
  );
  const candidatas = misOts.filter((o) => cfg.estados.includes(o.status));
  const otras = misOts.filter((o) => !cfg.estados.includes(o.status) && o.status !== "PENDIENTE" && o.status !== "CERRADA");
  const cerradasHoy = misOts.filter((o) => o.status === "CERRADA" && o.cerradaEn?.startsWith("2026-09-20"));

  const valida = otParam && misOts.some((o) => o.id === otParam) ? otParam : null;
  const seleccion = leido ? valida ?? candidatas[0]?.id ?? null : null;

  const Item = ({ id }: { id: string }) => {
    const o = cat.ot(id)!;
    const a = cat.activo(o.activoId);
    const sel = seleccion === id;
    return (
      <button
        type="button"
        onClick={() => setOtParam(id)}
        className={cx(
          "w-full rounded-lg border px-3 py-2.5 text-left transition-colors",
          sel ? "border-mv-green-700 bg-mv-green-50 ring-1 ring-mv-green-700" : "border-mv-line bg-white hover:bg-mv-surface-2"
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-bold text-mv-ink">{o.id}</span>
          <TipoOtTag tipo={o.tipo} short />
        </div>
        <p className="mt-1 line-clamp-1 text-[12px] font-medium text-mv-ink">{a?.descripcion ?? o.infra}</p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="truncate text-[11px] text-mv-ink-2">{o.cuadrillaId ?? "Sin cuadrilla"} · {o.criticality}</span>
          <Pill tone={toneOt(o.status)}>{o.status}</Pill>
        </div>
      </button>
    );
  };

  return (
    <AppShell fn={cfg.fn}>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_440px] xl:grid-cols-[minmax(0,1fr)_460px]">
        <div className="order-2 space-y-4 lg:order-1">
          <Panel title="Secuencia de trabajo en campo" subtitle="OT → Check-in → ATS → Validación → Ejecución → Repuestos → Cierre">
            <ol className="grid gap-2 sm:grid-cols-3">
              {SECUENCIA.map((s, i) => {
                const actual = s.fase === fase;
                return (
                  <li key={s.fase}>
                    <Link
                      href={`/operativo/campo/${s.fase}${seleccion ? `?ot=${seleccion}` : ""}`}
                      className={cx(
                        "flex h-full items-start gap-2.5 rounded-lg border p-3 text-xs",
                        actual ? "border-mv-teal bg-mv-teal-50" : "border-mv-line hover:bg-mv-surface-2"
                      )}
                    >
                      <s.Icon className={cx("mt-0.5 h-4 w-4 shrink-0", actual ? "text-mv-teal-700" : "text-mv-muted")} />
                      <span>
                        <span className="block text-[10px] font-bold uppercase tracking-wide text-mv-muted">Función {i + 1}</span>
                        <span className={cx("font-semibold", actual ? "text-mv-ink" : "text-mv-ink-2")}>{s.nombre}</span>
                      </span>
                      {i < 2 && <ChevronRight className="ml-auto mt-0.5 hidden h-4 w-4 text-mv-line-2 sm:block" />}
                    </Link>
                  </li>
                );
              })}
            </ol>
            <p className="mt-3 flex items-start gap-2 rounded-md bg-mv-surface-2 px-3 py-2 text-xs text-mv-ink-2">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                <strong className="text-mv-ink">{cfg.titulo}:</strong> {cfg.texto}
              </span>
            </p>
          </Panel>

          <Panel
            title={sesion?.rol === "TECNICO" ? `Mis órdenes · cuadrilla ${sesion.cuadrillaId}` : "Órdenes en campo"}
            subtitle={`Listas para esta función: ${cfg.estados.join(", ").toLowerCase()}`}
          >
            <div className="space-y-4">
              <div className="grid gap-2 sm:grid-cols-2">
                {candidatas.length === 0 && (
                  <p className="text-xs text-mv-muted sm:col-span-2">No hay órdenes en estado apto para esta función.</p>
                )}
                {candidatas.map((o) => (
                  <Item key={o.id} id={o.id} />
                ))}
              </div>
              {otras.length > 0 && (
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-mv-muted">Otras órdenes en curso</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {otras.map((o) => (
                      <Item key={o.id} id={o.id} />
                    ))}
                  </div>
                </div>
              )}
              {cerradasHoy.length > 0 && (
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-mv-muted">Cerradas hoy</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {cerradasHoy.map((o) => (
                      <Item key={o.id} id={o.id} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Panel>
        </div>

        <div className="order-1 lg:order-2">
          <MobileFlow fase={fase} otId={seleccion} />
        </div>
      </div>
    </AppShell>
  );
}
