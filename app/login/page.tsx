"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  User,
  ShieldCheck,
  Smartphone,
  Cpu,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Radio,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("noc.central@movistar.pe");
  const [password, setPassword] = useState("••••••••••••");
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<"NOC" | "SUPERVISOR" | "TECNICO">("NOC");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setStatusMessage("Validando credenciales en Directorio Movistar Perú...");

    setTimeout(() => {
      setStatusMessage("Perfil verificado con éxito. Redirigiendo a entorno...");
      setTimeout(() => {
        if (selectedRole === "TECNICO") {
          router.push("/mobile");
        } else if (selectedRole === "SUPERVISOR") {
          router.push("/batch");
        } else {
          router.push("/ots");
        }
      }, 500);
    }, 900);
  };

  const handleQuickRole = (
    role: "NOC" | "SUPERVISOR" | "TECNICO",
    user: string
  ) => {
    setSelectedRole(role);
    setUsername(user);
    setPassword("movistar@2026");
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Background network glow effects with Movistar Navy and Blue */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#0B2742]/70 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#019DF4]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="flex items-center justify-between z-10 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B2742] border border-[#019DF4]/40 flex items-center justify-center text-[#019DF4] shadow-lg">
            <span className="font-extrabold text-lg text-white font-grotesk">M</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-grotesk font-extrabold text-xl tracking-tight text-white">
                Movistar Perú
              </span>
              <span className="text-[10px] font-mono bg-[#019DF4]/20 text-[#019DF4] px-2 py-0.5 rounded-full border border-[#019DF4]/40 font-bold">
                SGMR
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans leading-none">
              Sistema de Mantenimiento e Infraestructura de Redes
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#00A86B] bg-[#00A86B]/15 px-3 py-1 rounded-full border border-[#00A86B]/30 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#00A86B] animate-ping" />
            CORE ONLINE
          </span>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="flex-1 flex items-center justify-center z-10 py-8">
        <div className="w-full max-w-md bg-[#121418] border border-[#1E232B] rounded-3xl p-6 sm:p-8 shadow-card-dark relative overflow-hidden">
          {/* Top Brand Stripe in Movistar Blue & Green */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0B2742] via-[#019DF4] to-[#00A86B]" />

          {/* Title and Intro */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-white font-grotesk">
              Control de Acceso
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Portal corporativo para supervisión NOC y cuadrillas de campo
            </p>
          </div>

          {/* Selector Rápido de 3 Perfiles (Requerimiento Prompt) */}
          <div className="mb-5">
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2 text-center font-bold">
              Seleccionar Perfil Rápido:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {/* Perfil 1: Ing. NOC */}
              <button
                type="button"
                onClick={() => handleQuickRole("NOC", "noc.central@movistar.pe")}
                className={`py-2.5 px-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  selectedRole === "NOC"
                    ? "bg-[#0B2742] border-[#019DF4] text-white shadow-md ring-1 ring-[#019DF4]"
                    : "bg-[#0B0C0E] border-[#1E232B] text-slate-400 hover:text-white"
                }`}
              >
                <Cpu className="w-4 h-4 mx-auto mb-1 text-[#019DF4]" />
                <span className="font-bold block text-xs">Ing. NOC</span>
                <span className="text-[9px] text-slate-400 font-mono block">/ots</span>
              </button>

              {/* Perfil 2: Supervisor */}
              <button
                type="button"
                onClick={() =>
                  handleQuickRole("SUPERVISOR", "supervisor.lima@movistar.pe")
                }
                className={`py-2.5 px-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  selectedRole === "SUPERVISOR"
                    ? "bg-[#0B2742] border-[#019DF4] text-white shadow-md ring-1 ring-[#019DF4]"
                    : "bg-[#0B0C0E] border-[#1E232B] text-slate-400 hover:text-white"
                }`}
              >
                <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-[#019DF4]" />
                <span className="font-bold block text-xs">Supervisor</span>
                <span className="text-[9px] text-slate-400 font-mono block">/batch</span>
              </button>

              {/* Perfil 3: Técnico */}
              <button
                type="button"
                onClick={() =>
                  handleQuickRole("TECNICO", "diego.quispe@movistar.pe")
                }
                className={`py-2.5 px-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  selectedRole === "TECNICO"
                    ? "bg-[#0B2742] border-[#00A86B] text-white shadow-md ring-1 ring-[#00A86B]"
                    : "bg-[#0B0C0E] border-[#1E232B] text-slate-400 hover:text-white"
                }`}
              >
                <Smartphone className="w-4 h-4 mx-auto mb-1 text-[#00A86B]" />
                <span className="font-bold block text-xs">Técnico</span>
                <span className="text-[9px] text-[#00A86B] font-mono block">/mobile</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Campo Usuario */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#019DF4]" />
                Usuario Corporativo
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="usuario@movistar.pe"
                className="w-full bg-[#0B0C0E] border border-[#1E232B] rounded-xl px-3.5 py-2.5 text-slate-100 font-mono text-xs focus:outline-none focus:border-[#019DF4] focus:ring-1 focus:ring-[#019DF4] transition-all"
              />
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#019DF4]" />
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full bg-[#0B0C0E] border border-[#1E232B] rounded-xl px-3.5 py-2.5 text-slate-100 font-mono text-xs focus:outline-none focus:border-[#019DF4] focus:ring-1 focus:ring-[#019DF4] transition-all"
              />
            </div>

            {/* Checkbox "Recordar usuario" */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#0B0C0E] border-[#1E232B] text-[#019DF4] focus:ring-[#019DF4]"
                />
                <span>Recordar credenciales</span>
              </label>
              <span className="text-[11px] text-[#019DF4] hover:underline cursor-pointer">
                ¿Olvidó su clave?
              </span>
            </div>

            {/* Live Visual Status Message */}
            {statusMessage && (
              <div className="p-3 bg-[#0B2742]/70 border border-[#019DF4]/50 rounded-xl flex items-center gap-2 text-[#019DF4] text-xs font-mono animate-in fade-in">
                {isAuthenticating ? (
                  <Loader2 className="w-4 h-4 animate-spin shrink-0 text-[#019DF4]" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-[#00A86B] shrink-0" />
                )}
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full bg-[#019DF4] hover:bg-[#0081CB] text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-[#019DF4]/20 flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {isAuthenticating ? (
                <span>Autenticando perfil...</span>
              ) : (
                <>
                  <span>Ingresar al Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Route Links Direct access */}
          <div className="mt-5 pt-4 border-t border-[#1E232B] text-center space-y-2 text-xs">
            <p className="text-[11px] font-mono text-slate-400">
              Acceso directo a pantallas principales:
            </p>
            <div className="flex justify-center items-center gap-3 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => router.push("/mobile")}
                className="text-[#00A86B] hover:underline font-bold"
              >
                /mobile (Campo)
              </button>
              <span className="text-slate-600">·</span>
              <button
                type="button"
                onClick={() => router.push("/batch")}
                className="text-[#019DF4] hover:underline font-bold"
              >
                /batch (Lotes)
              </button>
              <span className="text-slate-600">·</span>
              <button
                type="button"
                onClick={() => router.push("/ots")}
                className="text-slate-300 hover:underline font-bold"
              >
                /ots (Despacho)
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer System Info */}
      <footer className="text-center text-xs text-slate-500 font-mono z-10 max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© 2026 Telefónica del Perú / Movistar Perú · Infraestructura de Redes</span>
        <span>Módulo de Control de Acceso Unificado</span>
      </footer>
    </div>
  );
}
