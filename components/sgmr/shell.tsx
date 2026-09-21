"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Lock, Star, LogIn, Cpu, ShieldCheck, Smartphone, Loader2 } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Sidebar } from "@/components/layout/sidebar";
import { ARQUITECTURA, ROLES, getFuncion, inicioPorRol, type FuncionNav } from "@/lib/navigation";
import { useSgmr } from "@/lib/store";
import type { Rol } from "@/lib/types";
import { Btn, Pill } from "./ui";

interface AppShellProps {
  /** id de la función en lib/navigation.ts */
  fn?: string;
  /** para páginas que no son una función (módulos, trazabilidad) */
  titulo?: string;
  descripcion?: string;
  migas?: string[];
  roles?: Rol[];
  acciones?: React.ReactNode;
  children: React.ReactNode;
}

export function AppShell({ fn, titulo, descripcion, migas, roles, acciones, children }: AppShellProps) {
  const { hydrated, sesion } = useSgmr();
  const f: FuncionNav | undefined = fn ? getFuncion(fn) : undefined;
  const rolesPermitidos = f ? f.roles : roles ?? (["NOC", "SUPERVISOR", "TECNICO"] as Rol[]);
  const permitido = !!sesion && rolesPermitidos.includes(sesion.rol);

  const crumbs = f
    ? [ARQUITECTURA, f.modulo, f.submodulo, f.nombre]
    : migas ?? [ARQUITECTURA, titulo ?? ""];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Topbar />
      <div className="flex flex-1">
        {sesion && <Sidebar />}
        <main className="min-w-0 flex-1">
          {!hydrated ? (
            <div className="flex h-[60vh] items-center justify-center text-mv-muted">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : !sesion ? (
            <SinSesion />
          ) : !permitido ? (
            <AccesoRestringido rol={sesion.rol} nombre={f?.nombre ?? titulo ?? ""} roles={rolesPermitidos} />
          ) : (
            <div className="mx-auto w-full max-w-[1400px] px-4 pb-16 pt-5 sm:px-6 lg:px-8">
              <PageHeader
                crumbs={crumbs}
                titulo={f?.nombre ?? titulo ?? ""}
                descripcion={f?.descripcion ?? descripcion}
                f={f}
                acciones={acciones}
              />
              <div className="mt-5 space-y-5">{children}</div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function PageHeader({
  crumbs,
  titulo,
  descripcion,
  f,
  acciones,
}: {
  crumbs: string[];
  titulo: string;
  descripcion?: string;
  f?: FuncionNav;
  acciones?: React.ReactNode;
}) {
  return (
    <div className="no-print border-b border-mv-line pb-4">
      <ol className="flex flex-wrap items-center gap-1 text-[11px] font-medium text-mv-muted" aria-label="Trazabilidad">
        {crumbs.map((c, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3 w-3" />}
            <span className={i === crumbs.length - 1 ? "text-mv-ink-2" : ""}>{c}</span>
          </li>
        ))}
      </ol>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="flex flex-wrap items-center gap-2 text-xl font-bold tracking-tight text-mv-ink sm:text-[22px]">
            {titulo}
            {f?.prioritaria && (
              <Pill tone="warn">
                <Star className="h-3 w-3 fill-current" /> Prioritaria
              </Pill>
            )}
          </h1>
          {descripcion && <p className="mt-1 max-w-3xl text-[13px] text-mv-ink-2">{descripcion}</p>}
          {f && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <Pill tone={f.modulo === "GERENCIAL" ? "brand" : "teal"}>Interfaz: {f.interfaz}</Pill>
              <Pill tone="neutral">Mantenimiento {f.alcance.toLowerCase()}</Pill>
              {f.complementaria && <Pill tone="neutral">Pantalla complementaria (existente)</Pill>}
            </div>
          )}
        </div>
        {acciones && <div className="flex flex-wrap items-center gap-2">{acciones}</div>}
      </div>
    </div>
  );
}

function SinSesion() {
  const { iniciarSesion } = useSgmr();
  const opciones: { rol: Rol; Icon: typeof Cpu }[] = [
    { rol: "NOC", Icon: Cpu },
    { rol: "SUPERVISOR", Icon: ShieldCheck },
    { rol: "TECNICO", Icon: Smartphone },
  ];
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <LogIn className="mx-auto h-8 w-8 text-mv-green-700" />
      <h1 className="mt-3 text-lg font-bold text-mv-ink">Seleccione un perfil para continuar</h1>
      <p className="mt-1 text-sm text-mv-ink-2">
        Cada perfil ve solo las funciones que le corresponden según la arquitectura.
      </p>
      <div className="mt-6 grid gap-2 sm:grid-cols-3">
        {opciones.map(({ rol, Icon }) => (
          <button
            key={rol}
            onClick={() => iniciarSesion(rol)}
            className="flex flex-col items-center gap-1.5 rounded-lg border border-mv-line bg-white px-3 py-4 text-sm font-semibold text-mv-ink hover:border-mv-green-700 hover:bg-mv-green-50"
          >
            <Icon className="h-5 w-5 text-mv-green-700" />
            {ROLES[rol].nombre}
          </button>
        ))}
      </div>
      <p className="mt-6 text-xs text-mv-muted">
        También puede ingresar desde la <Link href="/login" className="font-semibold text-mv-green-700 underline">pantalla de acceso</Link>.
      </p>
    </div>
  );
}

function AccesoRestringido({ rol, nombre, roles }: { rol: Rol; nombre: string; roles: Rol[] }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-st-crit-bg text-st-crit-fg">
        <Lock className="h-5 w-5" />
      </span>
      <h1 className="mt-3 text-lg font-bold text-mv-ink">Acceso restringido</h1>
      <p className="mt-1 text-sm text-mv-ink-2">
        El perfil <strong>{ROLES[rol].nombre}</strong> no tiene acceso a <strong>{nombre}</strong>.
        Disponible para: {roles.map((r) => ROLES[r].nombre).join(", ")}.
      </p>
      <div className="mt-5 flex justify-center gap-2">
        <Link href={inicioPorRol(rol)}>
          <Btn variant="primary">Ir a mi inicio</Btn>
        </Link>
        <Link href="/login">
          <Btn>Cambiar de perfil</Btn>
        </Link>
      </div>
    </div>
  );
}
