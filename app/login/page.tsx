"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Radio,
  Lock,
  User,
  ShieldCheck,
  Smartphone,
  Cpu,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("NOC-ADMIN-99");
  const [password, setPassword] = useState("••••••••••••");
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<"NOC" | "SUPERVISOR" | "FIELD">("NOC");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setStatusMessage("Autenticando perfil...");

    // Simulated 1 second visual authentication delay
    setTimeout(() => {
      setStatusMessage("Perfil verificado. Redirigiendo a Dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 400);
    }, 1000);
  };

  const handleQuickRole = (role: "NOC" | "SUPERVISOR" | "FIELD", user: string) => {
    setSelectedRole(role);
    setUsername(user);
    setPassword("telecom@2026");
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background network glow effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#0A2E5C]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#00AEEF]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="flex items-center justify-between z-10 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#0A2E5C] border border-[#00AEEF]/40 flex items-center justify-center text-[#00AEEF] shadow-lg">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="font-grotesk font-extrabold text-xl tracking-tight text-white">
              SGMR
            </span>
            <p className="text-[11px] text-slate-400 font-sans leading-none">
              Sistema de Gestión de Mantenimiento de Redes
            </p>
          </div>
        </div>

        <Badge variant="cyan" size="sm" pulse>
          NOC PLATFORM ONLINE
        </Badge>
      </header>

      {/* Main Login Card Container */}
      <main className="flex-1 flex items-center justify-center z-10 py-8">
        <div className="w-full max-w-md bg-[#121418] border border-[#1E232B] rounded-2xl p-6 sm:p-8 shadow-card-dark relative overflow-hidden">
          {/* Top Brand Stripe */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0A2E5C] via-[#00AEEF] to-[#0A2E5C]" />

          {/* Title and Intro */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-white font-grotesk">
              Control de Acceso
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Ingreso seguro para supervisión NOC y cuadrillas de campo
            </p>
          </div>

          {/* Quick Profile Selector Tabs */}
          <div className="mb-5">
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2 text-center">
              Seleccionar Perfil de Demostración
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickRole("NOC", "NOC-ADMIN-99")}
                className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all ${
                  selectedRole === "NOC"
                    ? "bg-[#0A2E5C] border-[#00AEEF] text-white shadow-sm"
                    : "bg-[#0B0C0E] border-[#1E232B] text-slate-400 hover:text-white"
                }`}
              >
                <Cpu className="w-4 h-4 mx-auto mb-1 text-[#00AEEF]" />
                <span>Ing. NOC</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole("SUPERVISOR", "SUP-PLANTA-04")}
                className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all ${
                  selectedRole === "SUPERVISOR"
                    ? "bg-[#0A2E5C] border-[#00AEEF] text-white shadow-sm"
                    : "bg-[#0B0C0E] border-[#1E232B] text-slate-400 hover:text-white"
                }`}
              >
                <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-[#00AEEF]" />
                <span>Supervisor</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole("FIELD", "TEC-CAMPO-ALFA")}
                className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all ${
                  selectedRole === "FIELD"
                    ? "bg-[#0A2E5C] border-[#00AEEF] text-white shadow-sm"
                    : "bg-[#0B0C0E] border-[#1E232B] text-slate-400 hover:text-white"
                }`}
              >
                <Smartphone className="w-4 h-4 mx-auto mb-1 text-[#FF6A13]" />
                <span>Téc. Campo</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Campo Usuario */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#00AEEF]" />
                Usuario (ID / DNI)
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Ingrese su ID de operador"
                className="w-full bg-[#0B0C0E] border border-[#1E232B] rounded-lg px-3.5 py-2.5 text-slate-100 font-mono text-xs focus:outline-none focus:border-[#00AEEF] focus:ring-1 focus:ring-[#00AEEF] transition-all"
              />
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#00AEEF]" />
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full bg-[#0B0C0E] border border-[#1E232B] rounded-lg px-3.5 py-2.5 text-slate-100 font-mono text-xs focus:outline-none focus:border-[#00AEEF] focus:ring-1 focus:ring-[#00AEEF] transition-all"
              />
            </div>

            {/* Checkbox "Recordar usuario" (Marcado por defecto) */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#0B0C0E] border-[#1E232B] text-[#00AEEF] focus:ring-[#00AEEF] focus:ring-offset-0"
                />
                <span>Recordar usuario</span>
              </label>
              <span className="text-[11px] text-[#00AEEF] hover:underline cursor-pointer">
                ¿Olvidó su clave?
              </span>
            </div>

            {/* Live Visual Status Message */}
            {statusMessage && (
              <div className="p-3 bg-[#0A2E5C]/50 border border-[#00AEEF]/40 rounded-lg flex items-center gap-2 text-[#00AEEF] text-xs font-mono animate-in fade-in">
                {isAuthenticating ? (
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isAuthenticating}
              className="w-full bg-[#0A2E5C] hover:bg-[#144585] text-white font-bold py-3 mt-2 shadow-lg"
            >
              <span>Ingresar al sistema</span>
              <ArrowRight className="w-4 h-4 ml-2 text-[#00AEEF]" />
            </Button>
          </form>

          {/* Footer Note */}
          <div className="mt-6 pt-4 border-t border-[#1E232B] text-center">
            <p className="text-[11px] text-slate-500 font-mono">
              Skeleton Visual SGMR · Sin lógica de backend ni credenciales reales
            </p>
          </div>
        </div>
      </main>

      {/* Footer System Info */}
      <footer className="text-center text-xs text-slate-500 font-mono z-10 max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© 2026 Sistema de Gestión de Mantenimiento de Redes</span>
        <span>Módulo NOC Central · Versión Visual de Demostración</span>
      </footer>
    </div>
  );
}
