"use client";

// Barra superior común (Gerencial, Operativo y Batch).
// Se mantiene la firma <Topbar /> sin props para no alterar app/batch/page.tsx.
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Radio,
  LayoutDashboard,
  Briefcase,
  HardHat,
  Layers,
  Bell,
  ChevronDown,
  LogOut,
  UserCog,
  GitBranch,
  RotateCcw,
  Menu,
  X,
  Clock,
} from "lucide-react";
import { useSgmr } from "@/lib/store";
import { ROLES, inicioPorRol, moduloVisible, BATCH } from "@/lib/navigation";
import { ALERTAS } from "@/lib/data";
import { fmtFecha } from "@/lib/fechas";
import { SidebarNav } from "./sidebar";

export function Topbar() {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const { sesion, ahora, cerrarSesion, restablecer } = useSgmr();
  const [perfilAbierto, setPerfilAbierto] = useState(false);
  const [menuMovil, setMenuMovil] = useState(false);
  const perfilRef = useRef<HTMLDivElement>(null);
  const rol = sesion?.rol ?? null;

  useEffect(() => {
    const cerrar = (e: MouseEvent) => {
      if (perfilRef.current && !perfilRef.current.contains(e.target as Node)) setPerfilAbierto(false);
    };
    document.addEventListener("mousedown", cerrar);
    return () => document.removeEventListener("mousedown", cerrar);
  }, []);

  useEffect(() => {
    setMenuMovil(false);
  }, [pathname]);

  const items = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, visible: moduloVisible(rol, "GERENCIAL") },
    { label: "Gerencial", href: "/gerencial", icon: Briefcase, visible: moduloVisible(rol, "GERENCIAL") },
    { label: "Operativo", href: "/operativo", icon: HardHat, visible: moduloVisible(rol, "OPERATIVO") },
    { label: "Batch", href: BATCH.ruta, icon: Layers, visible: !!rol && BATCH.roles.includes(rol) },
  ].filter((i) => i.visible);

  const criticas = ALERTAS.filter((a) => a.severity === "CRITICAL").length;
  const iniciales = sesion
    ? sesion.usuario
        .replace(/^Ing\.\s*/, "")
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
    : "—";

  return (
    <>
      <header className="no-print sticky top-0 z-40 w-full border-b border-mv-line bg-white">
        <div className="h-[3px] w-full bg-mv-green" />
        <div className="flex h-[53px] items-center justify-between gap-3 px-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setMenuMovil(true)}
              className="rounded-md p-2 text-mv-ink-2 hover:bg-mv-surface lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href={rol ? inicioPorRol(rol) : "/login"} className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-mv-green text-white">
                <Radio className="h-[18px] w-[18px]" />
              </span>
              <span className="min-w-0 leading-tight">
                <span className="flex items-baseline gap-1.5">
                  <span className="text-[15px] font-bold tracking-tight text-mv-ink">SGMR</span>
                  <span className="text-[13px] font-semibold text-mv-green-700">Movistar</span>
                </span>
                <span className="hidden truncate text-[11px] text-mv-muted sm:block">
                  Sistema de Mantenimiento de Redes
                </span>
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-0.5 md:flex" aria-label="Módulos">
            {items.map((it) => {
              const Icon = it.icon;
              const activo =
                pathname === it.href ||
                pathname.startsWith(it.href + "/") ||
                (it.href === "/operativo" && pathname.startsWith("/operativo"));
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className={`relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                    activo ? "text-mv-ink" : "text-mv-ink-2 hover:bg-mv-surface hover:text-mv-ink"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${activo ? "text-mv-green-700" : ""}`} />
                  {it.label}
                  {activo && <span className="absolute -bottom-[11px] left-2 right-2 h-[3px] rounded-t bg-mv-green" />}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <span
              className="hidden items-center gap-1.5 rounded-md bg-mv-surface px-2 py-1 font-mono text-[11px] text-mv-ink-2 xl:flex"
              title="Hora del sistema (fecha de referencia del prototipo)"
            >
              <Clock className="h-3.5 w-3.5" />
              {fmtFecha(ahora)} {ahora.slice(11, 16)}
            </span>
            {rol && rol !== "TECNICO" && (
              <Link
                href="/dashboard#alertas"
                className="relative rounded-md p-2 text-mv-ink-2 hover:bg-mv-surface hover:text-mv-ink"
                title={`${criticas} alertas críticas activas`}
              >
                <Bell className="h-[18px] w-[18px]" />
                {criticas > 0 && (
                  <span className="num absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-st-crit px-1 text-[10px] font-bold text-white">
                    {criticas}
                  </span>
                )}
              </Link>
            )}

            <div className="relative" ref={perfilRef}>
              <button
                onClick={() => setPerfilAbierto((v) => !v)}
                className="flex items-center gap-2 rounded-md border border-mv-line px-1.5 py-1 text-left hover:bg-mv-surface"
                aria-expanded={perfilAbierto}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mv-green-50 text-[11px] font-bold text-mv-green-800">
                  {iniciales}
                </span>
                <span className="hidden leading-tight sm:block">
                  <span className="block text-xs font-semibold text-mv-ink">{sesion?.usuario ?? "Sin sesión"}</span>
                  <span className="block text-[10px] text-mv-muted">{rol ? ROLES[rol].nombre : "Seleccione un perfil"}</span>
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-mv-muted" />
              </button>

              {perfilAbierto && (
                <div className="absolute right-0 z-50 mt-2 w-64 rounded-lg border border-mv-line bg-white p-1.5 text-[13px] shadow-pop">
                  {sesion && (
                    <div className="mb-1 border-b border-mv-line px-3 py-2">
                      <p className="font-semibold text-mv-ink">{sesion.usuario}</p>
                      <p className="text-xs text-mv-ink-2">{sesion.cargo}</p>
                      <p className="mt-1 font-mono text-[10px] text-mv-muted">ID: {sesion.codigo}</p>
                    </div>
                  )}
                  <Link
                    href="/login"
                    onClick={() => setPerfilAbierto(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-mv-ink-2 hover:bg-mv-surface hover:text-mv-ink"
                  >
                    <UserCog className="h-4 w-4" /> Cambiar de perfil
                  </Link>
                  <Link
                    href="/trazabilidad"
                    onClick={() => setPerfilAbierto(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-mv-ink-2 hover:bg-mv-surface hover:text-mv-ink"
                  >
                    <GitBranch className="h-4 w-4" /> Mapa de trazabilidad
                  </Link>
                  <button
                    onClick={() => {
                      restablecer();
                      setPerfilAbierto(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-mv-ink-2 hover:bg-mv-surface hover:text-mv-ink"
                  >
                    <RotateCcw className="h-4 w-4" /> Restablecer datos de demostración
                  </button>
                  <button
                    onClick={() => {
                      cerrarSesion();
                      setPerfilAbierto(false);
                      router.push("/login");
                    }}
                    className="mt-1 flex w-full items-center gap-2 rounded-md border-t border-mv-line px-3 py-2 text-left text-st-crit-fg hover:bg-st-crit-bg"
                  >
                    <LogOut className="h-4 w-4" /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {menuMovil && (
        <div className="no-print fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-mv-ink/40" onClick={() => setMenuMovil(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[84%] max-w-xs flex-col bg-white shadow-pop">
            <div className="flex items-center justify-between border-b border-mv-line px-4 py-3">
              <span className="text-sm font-bold text-mv-ink">
                SGMR <span className="text-mv-green-700">Movistar</span>
              </span>
              <button onClick={() => setMenuMovil(false)} className="rounded-md p-1.5 text-mv-muted hover:bg-mv-surface" aria-label="Cerrar menú">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              {items.length > 0 && (
                <div className="mb-4 grid grid-cols-2 gap-1.5 md:hidden">
                  {items.map((it) => (
                    <Link key={it.href} href={it.href} className="rounded-md border border-mv-line px-2.5 py-2 text-xs font-semibold text-mv-ink">
                      {it.label}
                    </Link>
                  ))}
                </div>
              )}
              <SidebarNav onNavigate={() => setMenuMovil(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
