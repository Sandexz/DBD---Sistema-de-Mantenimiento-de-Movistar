"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HardHat,
  ShieldCheck,
  Smartphone,
  Layers,
  ClipboardList,
  LayoutDashboard,
  Eye,
  EyeOff,
  ArrowRight,
  Radio,
  Lock,
  User,
  CheckCircle2,
  Loader2,
  BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUserProfile, UserRole } from "@/components/layout/user-context";

const quickProfiles: {
  id: UserRole;
  name: string;
  roleTitle: string;
  password: string;
  icon: any;
  color: string;
  bg: string;
  border: string;
  defaultRoute: string;
}[] = [
  {
    id: "NOC",
    name: "Ing. Carlos Mendoza",
    roleTitle: "Ingeniero NOC Central",
    password: "noc2026",
    icon: ShieldCheck,
    color: "text-[#019DF4]",
    bg: "bg-[#E5F4FD]",
    border: "border-[#B8E2FB]",
    defaultRoute: "/gerencial/consulta/disponibilidad",
  },
  {
    id: "SUPERVISOR",
    name: "Ing. Luis Valdivia",
    roleTitle: "Supervisor de Red / Parámetros",
    password: "sup2026",
    icon: ShieldCheck,
    color: "text-[#019DF4]",
    bg: "bg-[#E5F4FD]",
    border: "border-[#B8E2FB]",
    defaultRoute: "/gerencial/parametros/activos",
  },
  {
    id: "FIELD",
    name: "Téc. Diego Quispe",
    roleTitle: "Técnico de Campo · Cuadrilla Alfa 01",
    password: "campo2026",
    icon: HardHat,
    color: "text-[#5BC500]",
    bg: "bg-[#F0F9E8]",
    border: "border-[#C6EE94]",
    defaultRoute: "/mobile",
  },
];

const quickLinks = [
  { href: "/dashboard", label: "Dashboard NOC", icon: LayoutDashboard, color: "text-[#019DF4]" },
  { href: "/gerencial/consulta/disponibilidad", label: "Módulo Gerencial", icon: BarChart3, color: "text-[#5BC500]" },
  { href: "/operativo/ots", label: "Gestión OTs Operativas", icon: ClipboardList, color: "text-slate-600" },
  { href: "/batch", label: "Módulo Batch", icon: Layers, color: "text-amber-500" },
  { href: "/mobile", label: "App de Campo", icon: Smartphone, color: "text-[#5BC500]" },
];

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useUserProfile();
  const [selectedRole, setSelectedRole] = useState<UserRole>("NOC");
  const [username, setUsername] = useState("Ing. Carlos Mendoza");
  const [password, setPassword] = useState("noc2026");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleSelectProfile = (p: typeof quickProfiles[0]) => {
    setSelectedRole(p.id);
    setUsername(p.name);
    setPassword(p.password);
    setError("");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Por favor ingresa tu usuario.");
      return;
    }
    setIsLoading(true);
    setStatusMessage("Autenticando credenciales en directorio activo Movistar...");
    setError("");

    // Persistir rol en UserContext global
    setRole(selectedRole);

    setTimeout(() => {
      setStatusMessage("Perfil verificado. Redirigiendo...");
      setTimeout(() => {
        const found = quickProfiles.find((p) => p.id === selectedRole);
        router.push(found ? found.defaultRoute : "/dashboard");
      }, 500);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Background radial dots */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      {/* Top Header */}
      <header className="flex items-center justify-between z-10 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B2742] text-[#019DF4] border border-[#019DF4]/30 shadow-sm flex items-center justify-center font-grotesk font-extrabold text-lg">
            M
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-grotesk font-extrabold text-xl tracking-tight text-slate-900">
                Movistar Perú <span className="text-[#019DF4] text-base font-bold">SGMR</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans leading-none">
              Sistema de Gestión y Mantenimiento de Redes
            </p>
          </div>
        </div>

        <Badge variant="movistar" size="sm" pulse>
          PLATAFORMA MOVISTAR ONLINE
        </Badge>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center z-10 py-8">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden relative">
          {/* Brand header */}
          <div className="bg-[#0B2742] px-7 py-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold font-grotesk">Control de Acceso</h1>
                <p className="text-xs text-slate-300 font-sans mt-0.5">
                  Ingreso a Supervisión Gerencial y Despacho Operativo
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[#5BC500] bg-[#5BC500]/15 px-2.5 py-0.5 rounded-full border border-[#5BC500]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5BC500] animate-ping" />
                NOC ONLINE
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-7 space-y-5">
            {/* Quick Profile Selector */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Acceso Rápido por Perfil:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {quickProfiles.map((p) => {
                  const Icon = p.icon;
                  const isSelected = selectedRole === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectProfile(p)}
                      className={`p-2.5 rounded-xl border transition-all text-center flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? `${p.bg} ${p.border} ring-1 ring-[#019DF4] shadow-sm`
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? p.color : "text-slate-400"}`} />
                      <span className={`text-[11px] font-bold ${isSelected ? "text-slate-900" : "text-slate-600"}`}>
                        {p.id === "NOC" ? "Ing. NOC" : p.id === "SUPERVISOR" ? "Supervisor" : "Téc. Campo"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div className="space-y-1 text-xs">
                <label className="text-slate-700 font-semibold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#019DF4]" />
                  <span>Usuario (ID / Matrícula)</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Ej: Ing. Carlos Mendoza"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#019DF4] focus:ring-1 focus:ring-[#019DF4]"
                />
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-slate-700 font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#019DF4]" />
                    <span>Contraseña</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Demo: {password}</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-9 py-2 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#019DF4] focus:ring-1 focus:ring-[#019DF4]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-1.5">
                  {error}
                </p>
              )}

              {statusMessage && (
                <div className="p-2.5 bg-[#F0F9E8] border border-[#C6EE94] rounded-xl flex items-center gap-2 text-[#3F8500] text-xs font-mono">
                  {isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5BC500] shrink-0" />
                  )}
                  <span>{statusMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#019DF4] hover:bg-[#0081CB] active:scale-[0.98] text-white font-bold text-xs py-2.5 rounded-xl shadow-md shadow-[#019DF4]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verificando acceso...</span>
                  </>
                ) : (
                  <>
                    <span>Ingresar al Sistema SGMR</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Direct module navigation links */}
            <div className="pt-3 border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Accesos directos:
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-[#019DF4]/40 hover:bg-white text-[11px] font-medium text-slate-700 transition-all truncate"
                    >
                      <Icon className={`w-3.5 h-3.5 ${link.color} shrink-0`} />
                      <span className="truncate">{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer System Info */}
      <footer className="text-center text-xs text-slate-400 font-mono z-10 max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© 2026 Telefónica del Perú S.A.A. · SGMR v3.0</span>
        <span>Supervisión Gerencial & Despacho Operativo NOC</span>
      </footer>
    </div>
  );
}
