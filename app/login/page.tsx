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
  HardHat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserProfile, UserRole } from "@/components/layout/user-context";

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useUserProfile();
  const [username, setUsername] = useState("NOC-ADMIN-99");
  const [password, setPassword] = useState("••••••••••••");
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>("NOC");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setStatusMessage("Autenticando credenciales en directorio activo Movistar...");

    // Persistir rol en el context global
    setRole(selectedRole);

    setTimeout(() => {
      setStatusMessage("Perfil verificado. Accediendo al sistema...");
      setTimeout(() => {
        if (selectedRole === "FIELD") {
          router.push("/operativo/mobile");
        } else if (selectedRole === "SUPERVISOR") {
          router.push("/gerencial/parametros/activos");
        } else {
          router.push("/gerencial/consulta/disponibilidad");
        }
      }, 400);
    }, 800);
  };

  const handleQuickRole = (role: UserRole, user: string) => {
    setSelectedRole(role);
    setUsername(user);
    setPassword("telecom@2026");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Background brand accents */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-[#5BC500]" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#5BC500]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#019DF4]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="flex items-center justify-between z-10 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#5BC500] text-white shadow-movistar-green flex items-center justify-center">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-grotesk font-extrabold text-xl tracking-tight text-slate-900">
                movistar <span className="text-[#5BC500]">SGMR</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans leading-none">
              Sistema de Mantenimiento de Redes · Telecom Perú
            </p>
          </div>
        </div>

        <Badge variant="movistar" size="sm" pulse>
          PLATAFORMA MOVISTAR ONLINE
        </Badge>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center z-10 py-8">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card-clean relative overflow-hidden">
          {/* Top Brand Stripe */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0B2742] via-[#5BC500] to-[#019DF4]" />

          {/* Title and Intro */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-slate-900 font-grotesk">
              Control de Acceso
            </h1>
            <p className="text-xs text-slate-500 font-sans mt-1">
              Ingreso al Sistema de Supervisión Gerencial y Despacho Operativo
            </p>
          </div>

          {/* Quick Profile Selector Tabs */}
          <div className="mb-5">
            <label className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-2 text-center">
              Seleccionar Perfil de Demostración:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickRole("NOC", "NOC-ADMIN-99")}
                className={`py-2.5 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                  selectedRole === "NOC"
                    ? "bg-[#F0F9E8] border-[#5BC500] text-[#3F8500] shadow-sm ring-1 ring-[#5BC500]"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Cpu className="w-4 h-4 mx-auto mb-1 text-[#5BC500]" />
                <span>Ing. NOC</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole("SUPERVISOR", "SUP-PLANTA-04")}
                className={`py-2.5 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                  selectedRole === "SUPERVISOR"
                    ? "bg-[#E5F4FD] border-[#019DF4] text-[#0070B8] shadow-sm ring-1 ring-[#019DF4]"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-[#019DF4]" />
                <span>Supervisor</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole("FIELD", "TEC-CAMPO-ALFA")}
                className={`py-2.5 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                  selectedRole === "FIELD"
                    ? "bg-[#F0F9E8] border-[#5BC500] text-[#3F8500] shadow-sm ring-1 ring-[#5BC500]"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <HardHat className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                <span>Téc. Campo</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Campo Usuario */}
            <div className="space-y-1 text-xs">
              <label className="text-slate-700 font-semibold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#5BC500]" />
                <span>Usuario (ID / Matrícula Movistar)</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Ingrese su ID de operador"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#5BC500] focus:ring-1 focus:ring-[#5BC500]"
              />
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-1 text-xs">
              <label className="text-slate-700 font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#5BC500]" />
                <span>Contraseña</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#5BC500] focus:ring-1 focus:ring-[#5BC500]"
              />
            </div>

            {/* Checkbox "Recordar usuario" */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#5BC500] focus:ring-[#5BC500]"
                />
                <span>Recordar usuario</span>
              </label>
              <span className="text-[11px] text-[#0070B8] hover:underline cursor-pointer">
                ¿Olvidó su clave?
              </span>
            </div>

            {/* Status message */}
            {statusMessage && (
              <div className="p-3 bg-[#F0F9E8] border border-[#C6EE94] rounded-lg flex items-center gap-2 text-[#3F8500] text-xs font-mono animate-in fade-in">
                {isAuthenticating ? (
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-[#5BC500] shrink-0" />
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
              className="w-full py-2.5 mt-2"
            >
              <span>Ingresar al Sistema SGMR</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {/* Footer Note */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 font-mono">
              Prototipo de Diseño Externo · Mantenimiento Preventivo y Correctivo Movistar
            </p>
          </div>
        </div>
      </main>

      {/* Footer System Info */}
      <footer className="text-center text-xs text-slate-400 font-mono z-10 max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© 2026 Telefónica del Perú S.A.A. · SGMR</span>
        <span>Módulos On-Line Gerencial & On-Line Operativo</span>
      </footer>
    </div>
  );
}
