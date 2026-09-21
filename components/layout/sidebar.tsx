"use client";

// Navegación lateral jerárquica: ARQUITECTURA → MÓDULO → SUBMÓDULO → FUNCIÓN.
// Se genera desde lib/navigation.ts y muestra solo lo permitido para el perfil activo.
// Las props heredadas (activeTab / onTabChange) se mantienen opcionales por compatibilidad.
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, GitBranch, Star, ExternalLink } from "lucide-react";
import { ARQUITECTURA, BATCH, MODULOS, gruposPorModulo, moduloVisible } from "@/lib/navigation";
import { useSgmr } from "@/lib/store";

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() ?? "";
  const { sesion } = useSgmr();
  const rol = sesion?.rol ?? null;

  return (
    <nav className="flex flex-col gap-5 text-[13px]" aria-label="Arquitectura del sistema">
      <div className="px-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-mv-muted">Arquitectura</p>
        <p className="mt-0.5 font-semibold text-mv-ink">{ARQUITECTURA}</p>
      </div>

      {MODULOS.filter((m) => moduloVisible(rol, m.id)).map((m) => (
        <div key={m.id} className="space-y-3">
          <Link
            href={m.ruta}
            onClick={onNavigate}
            className={`flex items-center justify-between rounded-md px-2 py-1 text-[11px] font-bold uppercase tracking-[0.1em] ${
              pathname === m.ruta ? "bg-mv-green-50 text-mv-green-800" : "text-mv-ink hover:bg-mv-surface"
            }`}
          >
            <span>Módulo {m.nombre}</span>
            <span className={`h-1.5 w-1.5 rounded-full ${m.id === "GERENCIAL" ? "bg-mv-green" : "bg-mv-teal"}`} />
          </Link>
          {gruposPorModulo(m.id, rol).map((g) => (
            <div key={g.submodulo} className="space-y-0.5">
              <p className="px-2 pb-1 text-[11px] font-semibold text-mv-muted">{g.submodulo}</p>
              {g.funciones.map((f) => {
                const Icon = f.icon;
                const activo = pathname === f.ruta || pathname.startsWith(f.ruta + "/");
                return (
                  <Link
                    key={f.id}
                    href={f.ruta}
                    onClick={onNavigate}
                    aria-current={activo ? "page" : undefined}
                    className={`group relative flex items-center gap-2.5 rounded-md py-1.5 pl-3 pr-2 transition-colors ${
                      activo ? "bg-mv-green-50 font-semibold text-mv-ink" : "text-mv-ink-2 hover:bg-mv-surface hover:text-mv-ink"
                    }`}
                  >
                    {activo && <span className="absolute bottom-1.5 left-0 top-1.5 w-[3px] rounded-r bg-mv-green" />}
                    <Icon className={`h-4 w-4 shrink-0 ${activo ? "text-mv-green-700" : "text-mv-muted group-hover:text-mv-ink-2"}`} />
                    <span className="leading-tight">{f.nombre}</span>
                    {f.prioritaria && <Star className="ml-auto h-3 w-3 shrink-0 fill-st-warn text-st-warn" aria-label="Prioritaria" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      ))}

      <div className="space-y-0.5 border-t border-mv-line pt-4">
        <Link
          href="/trazabilidad"
          onClick={onNavigate}
          className={`flex items-center gap-2.5 rounded-md px-3 py-1.5 ${
            pathname === "/trazabilidad" ? "bg-mv-green-50 font-semibold text-mv-ink" : "text-mv-ink-2 hover:bg-mv-surface"
          }`}
        >
          <GitBranch className="h-4 w-4 text-mv-muted" />
          Mapa de trazabilidad
        </Link>
        {rol && BATCH.roles.includes(rol) && (
          <Link
            href={BATCH.ruta}
            onClick={onNavigate}
            className="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-mv-ink-2 hover:bg-mv-surface"
            title="Módulo del equipo Batch (fuera del alcance ON-LINE)"
          >
            <Layers className="h-4 w-4 text-mv-muted" />
            <span>Batch</span>
            <ExternalLink className="ml-auto h-3 w-3 text-mv-muted" />
          </Link>
        )}
      </div>
    </nav>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Sidebar(_props: SidebarProps = {}) {
  return (
    <aside className="no-print sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-mv-line bg-mv-surface-2 px-3 py-5 lg:block">
      <SidebarNav />
    </aside>
  );
}
