"use client";

// Acceso al sistema (pantalla existente, conservada y rediseñada con la identidad Movistar).
// Se mantienen: selección rápida de perfil, ID de operador, contraseña, "recordar sesión",
// estado de autenticación y mensaje de validación. Ahora el perfil elegido controla el
// acceso real a los módulos (Gerencial / Operativo) y define la pantalla de inicio.
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Radio, Cpu, ShieldCheck, Smartphone, User, Lock, LogIn, Loader2, CheckCircle2 } from "lucide-react";
import { useSgmr } from "@/lib/store";
import { ROLES, inicioPorRol, gruposPorModulo } from "@/lib/navigation";
import type { Rol } from "@/lib/types";
import { cx } from "@/components/sgmr/ui";

const PERFILES: { rol: Rol; usuario: string; Icon: typeof Cpu }[] = [
  { rol: "NOC", usuario: "NOC-ADMIN-99", Icon: Cpu },
  { rol: "SUPERVISOR", usuario: "SUP-PLANTA-04", Icon: ShieldCheck },
  { rol: "TECNICO", usuario: "TEC-CAMPO-ALFA", Icon: Smartphone },
];

export default function LoginPage() {
  const router = useRouter();
  const { iniciarSesion } = useSgmr();
  const [username, setUsername] = useState("NOC-ADMIN-99");
  const [password, setPassword] = useState("••••••••••••");
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Rol>("NOC");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleQuickRole = (rol: Rol, user: string) => {
    setSelectedRole(rol);
    setUsername(user);
    setError(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 4 || password.length < 4) {
      setError("Ingrese su ID de operador y contraseña.");
      return;
    }
    setError(null);
    setIsAuthenticating(true);
    setStatusMessage("Verificando credenciales…");
    window.setTimeout(() => {
      setStatusMessage(`Acceso concedido · perfil ${ROLES[selectedRole].nombre}`);
      iniciarSesion(selectedRole);
      window.setTimeout(() => router.push(inicioPorRol(selectedRole)), 350);
    }, 700);
  };

  const modulos = (["GERENCIAL", "OPERATIVO"] as const).filter((m) => gruposPorModulo(m, selectedRole).length > 0);

  return (
    <div className="flex min-h-screen flex-col bg-mv-surface-2">
      <div className="h-1 w-full bg-mv-green" />
      <header className="mx-auto flex w-full max-w-5xl items-center gap-2.5 px-5 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-mv-green text-white">
          <Radio className="h-5 w-5" />
        </span>
        <div className="leading-tight">
          <p className="text-base font-bold text-mv-ink">
            SGMR <span className="font-semibold text-mv-green-700">Movistar</span>
          </p>
          <p className="text-[11px] text-mv-muted">Sistema de Mantenimiento de Redes</p>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md rounded-xl border border-mv-line bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-xl font-bold text-mv-ink">Acceso al sistema</h1>
          <p className="mt-1 text-[13px] text-mv-ink-2">Seleccione su perfil e ingrese sus credenciales de operador.</p>

          <form onSubmit={handleLogin} className="mt-6 space-y-5">
            <div>
              <p className="mb-2 text-xs font-semibold text-mv-ink">Perfil de acceso</p>
              <div className="grid grid-cols-3 gap-2">
                {PERFILES.map(({ rol, usuario, Icon }) => {
                  const sel = selectedRole === rol;
                  return (
                    <button
                      type="button"
                      key={rol}
                      onClick={() => handleQuickRole(rol, usuario)}
                      aria-pressed={sel}
                      className={cx(
                        "flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-center text-[11px] font-semibold transition-colors",
                        sel ? "border-mv-green-700 bg-mv-green-50 text-mv-ink ring-1 ring-mv-green-700" : "border-mv-line text-mv-ink-2 hover:bg-mv-surface"
                      )}
                    >
                      <Icon className={cx("h-5 w-5", sel ? "text-mv-green-700" : "text-mv-muted")} />
                      {ROLES[rol].nombre}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-[11px] text-mv-ink-2">
                {ROLES[selectedRole].descripcion} Módulos: {modulos.map((m) => (m === "GERENCIAL" ? "Gerencial" : "Operativo")).join(" y ")}.
              </p>
            </div>

            <div className="space-y-1">
              <label htmlFor="usuario" className="flex items-center gap-1.5 text-xs font-semibold text-mv-ink">
                <User className="h-3.5 w-3.5 text-mv-muted" /> ID de operador
              </label>
              <input
                id="usuario"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingrese su ID de operador"
                className="h-10 w-full rounded-md border border-mv-line-2 px-3 font-mono text-sm text-mv-ink focus:border-mv-green-700 focus:outline-none focus:ring-2 focus:ring-mv-green/25"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="clave" className="flex items-center gap-1.5 text-xs font-semibold text-mv-ink">
                <Lock className="h-3.5 w-3.5 text-mv-muted" /> Contraseña
              </label>
              <input
                id="clave"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="h-10 w-full rounded-md border border-mv-line-2 px-3 text-sm text-mv-ink focus:border-mv-green-700 focus:outline-none focus:ring-2 focus:ring-mv-green/25"
              />
            </div>

            <label className="flex cursor-pointer select-none items-center gap-2 text-xs text-mv-ink-2">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 accent-[#3B8500]" />
              Recordar sesión en este equipo
            </label>

            {error && <p className="rounded-md bg-st-crit-bg px-3 py-2 text-xs font-medium text-st-crit-fg">{error}</p>}
            {statusMessage && !error && (
              <p className="flex items-center gap-2 rounded-md bg-st-ok-bg px-3 py-2 text-xs font-medium text-st-ok-fg">
                {isAuthenticating && statusMessage.startsWith("Verificando") ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                {statusMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isAuthenticating}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-mv-green-700 text-sm font-semibold text-white hover:bg-mv-green-800 disabled:opacity-60"
            >
              {isAuthenticating ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              Ingresar
            </button>
          </form>
        </div>
      </main>

      <footer className="pb-6 text-center text-[11px] text-mv-muted">
        Prototipo académico · SI-505 Diseño de Base de Datos · datos simulados
      </footer>
    </div>
  );
}
