"use client";

import React from "react";
import { Radio } from "lucide-react";
import { cx } from "./ui";

export function DocSheet({
  titulo,
  codigo,
  numero,
  emitido,
  children,
  estado,
}: {
  titulo: string;
  codigo: string;
  numero: string;
  emitido: string;
  estado?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <article className="print-sheet mx-auto w-full max-w-[860px] rounded-lg border border-mv-line-2 bg-white text-[12.5px] text-mv-ink shadow-sm">
      <div className="h-1.5 rounded-t-lg bg-mv-green" />
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-mv-line px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-mv-green text-white">
            <Radio className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-bold">
              Movistar · <span className="font-semibold">Gerencia de Mantenimiento de Redes</span>
            </p>
            <p className="text-[11px] text-mv-muted">SGMR — Sistema de Mantenimiento de Redes</p>
          </div>
        </div>
        <div className="text-right leading-tight">
          <p className="font-mono text-[11px] text-mv-muted">{codigo}</p>
          <p className="font-mono text-sm font-bold">N.º {numero}</p>
          <p className="text-[11px] text-mv-ink-2">Emitido: {emitido}</p>
        </div>
      </header>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-mv-line bg-mv-surface-2 px-6 py-3">
        <h2 className="text-base font-bold uppercase tracking-wide">{titulo}</h2>
        {estado}
      </div>
      <div className="space-y-5 px-6 py-5">{children}</div>
      <footer className="border-t border-mv-line px-6 py-3 text-[10.5px] text-mv-muted">
        Documento generado por el SGMR a partir de los registros de la orden de trabajo. Prototipo académico con datos simulados.
      </footer>
    </article>
  );
}

export function DocSection({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 border-b border-mv-line pb-1 text-[11px] font-bold uppercase tracking-[0.08em] text-mv-green-800">{titulo}</h3>
      {children}
    </section>
  );
}

export function DocGrid({ items, cols = 3 }: { items: [string, React.ReactNode][]; cols?: 2 | 3 | 4 }) {
  return (
    <dl className={cx("grid gap-x-5 gap-y-2.5", cols === 2 ? "sm:grid-cols-2" : cols === 4 ? "sm:grid-cols-4" : "sm:grid-cols-3")}>
      {items.map(([k, v]) => (
        <div key={k} className="min-w-0">
          <dt className="text-[10.5px] font-semibold uppercase tracking-wide text-mv-muted">{k}</dt>
          <dd className="mt-0.5 break-words">{v || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

export function DocFirmas({ firmas }: { firmas: { rol: string; nombre?: string; firmado?: boolean }[] }) {
  return (
    <div className={cx("grid gap-5 pt-4", firmas.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
      {firmas.map((f) => (
        <div key={f.rol} className="text-center">
          <div className="flex h-14 items-end justify-center border-b border-mv-ink/60 pb-1">
            {f.firmado && <span className="font-serif text-lg italic text-mv-ink-2">{f.nombre?.split("(")[0]}</span>}
          </div>
          <p className="mt-1 text-[11px] font-semibold">{f.nombre || "Nombre y firma"}</p>
          <p className="text-[10.5px] text-mv-muted">{f.rol}</p>
        </div>
      ))}
    </div>
  );
}

export function SinDocumento({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[860px] rounded-lg border border-dashed border-mv-line-2 bg-mv-surface-2 px-6 py-12 text-center text-sm text-mv-ink-2">
      {children}
    </div>
  );
}
