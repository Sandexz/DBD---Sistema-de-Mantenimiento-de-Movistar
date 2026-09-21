"use client";

// Índice de módulo (Gerencial / Operativo): muestra sus submódulos y funciones,
// filtrados por el perfil activo, con el estado resumido de cada función.
import React from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { AppShell } from "./shell";
import { ARQUITECTURA, MODULOS, gruposPorModulo, type ModuloId } from "@/lib/navigation";
import { useSgmr } from "@/lib/store";
import { Pill } from "./ui";

export function ModuloIndex({ modulo, resumen }: { modulo: ModuloId; resumen: (id: string) => React.ReactNode }) {
  const { sesion } = useSgmr();
  const m = MODULOS.find((x) => x.id === modulo)!;
  const grupos = gruposPorModulo(modulo, sesion?.rol);
  const roles = modulo === "GERENCIAL" ? (["NOC", "SUPERVISOR"] as const) : (["NOC", "SUPERVISOR", "TECNICO"] as const);

  return (
    <AppShell titulo={`Módulo ${m.nombre}`} descripcion={m.descripcion} migas={[ARQUITECTURA, modulo]} roles={[...roles]}>
      {grupos.map((g) => (
        <section key={g.submodulo} className="space-y-2.5">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.1em] text-mv-ink-2">
            {modulo} › {g.submodulo}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {g.funciones.map((f) => {
              const Icon = f.icon;
              return (
                <Link
                  key={f.id}
                  href={f.ruta}
                  className="group flex flex-col gap-2 rounded-lg border border-mv-line bg-white p-4 transition-colors hover:border-mv-green/60 hover:bg-mv-surface-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-mv-green-50 text-mv-green-700">
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <div className="flex flex-wrap justify-end gap-1">
                      {f.prioritaria && (
                        <Pill tone="warn">
                          <Star className="h-3 w-3 fill-current" /> Prioritaria
                        </Pill>
                      )}
                      {f.complementaria && <Pill tone="neutral">Existente</Pill>}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-mv-ink">{f.nombre}</h3>
                    <p className="mt-0.5 text-xs text-mv-ink-2">{f.descripcion}</p>
                  </div>
                  <div className="mt-auto flex items-end justify-between gap-2 pt-1">
                    <span className="text-[11px] text-mv-ink-2">{resumen(f.id)}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-mv-muted transition-transform group-hover:translate-x-0.5 group-hover:text-mv-green-700" />
                  </div>
                  <span className="font-mono text-[10px] text-mv-muted">
                    {f.interfaz} · {f.ruta}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </AppShell>
  );
}
