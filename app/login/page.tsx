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
  Wifi,
  Radio,
  Lock,
} from "lucide-react";

const quickProfiles = [
  {
    id: "supervisor",
    name: "Ing. Carlos Mendoza",
    role: "Supervisor NOC · Turno A",
    password: "noc2026",
    icon: ShieldCheck,
    color: "text-[#019DF4]",
    bg: "bg-[#EBF5FF]",
    border: "border-[#019DF4]/30",
  },
  {
    id: "tecnico",
    name: "Téc. Diego Quispe",
    role: "Técnico Campo · Cuadrilla Alfa 01",
    password: "campo2026",
    icon: HardHat,
    color: "text-[#00A86B]",
    bg: "bg-[#E6F6F0]",
    border: "border-[#00A86B]/30",
  },
  {
    id: "auditor",
    name: "Lic. Ana Torres",
    role: "Auditora Batch · Control Calidad",
    password: "audit2026",
    icon: Layers,
    color: "text-[#FF6A13]",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
];

const quickLinks = [
  { href: "/dashboard", label: "Dashboard NOC", icon: LayoutDashboard, color: "text-[#019DF4]" },
  { href: "/ots", label: "Gestión OTs", icon: ClipboardList, color: "text-slate-600" },
  { href: "/mobile", label: "App de Campo", icon: Smartphone, color: "text-[#00A86B]" },
  { href: "/batch", label: "Módulo Batch", icon: Layers, color: "text-[#FF6A13]" },
];

export default function LoginPage() {
  const router = useRouter();
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSelectProfile = (profile: typeof quickProfiles[0]) => {
    setSelectedProfile(profile.id);
    setUsername(profile.name);
    setPassword(profile.password);
    setError("");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Por favor ingresa tu usuario.");
      return;
    }
    setIsLoading(true);
    setError("");
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 900);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">

          {/* Header — Navy brand bar */}
          <div className="bg-[#0B2742] px-8 py-7">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#019DF4] flex items-center justify-center font-bold text-white text-lg shadow-sm">
                M
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Movistar Perú
                </h1>
                <p className="text-[11px] text-[#019DF4] font-mono">
                  Sistema de Gestión y Mantenimiento de Redes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[#00A86B] bg-[#00A86B]/15 px-2.5 py-0.5 rounded-full border border-[#00A86B]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A86B] animate-ping" />
                NOC ONLINE
              </span>
              <span className="text-[11px] font-mono text-slate-400 bg-[#061625] px-2 py-0.5 rounded border border-white/10">
                SGMR v2.4
              </span>
            </div>
          </div>

          {/* Form body */}
          <div className="px-8 py-7 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                Control de Acceso
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Selecciona tu perfil o ingresa tus credenciales
              </p>
            </div>

            {/* Quick Profile Selector */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Acceso Rápido por Perfil
              </p>
              <div className="space-y-2">
                {quickProfiles.map((profile) => {
                  const Icon = profile.icon;
                  const isSelected = selectedProfile === profile.id;
                  return (
                    <button
                      key={profile.id}
                      type="button"
                      onClick={() => handleSelectProfile(profile)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                        isSelected
                          ? `${profile.bg} ${profile.border} shadow-sm`
                          : "bg-slate-50 border-slate-200 hover:bg-sky-50 hover:border-sky-200"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? profile.bg : "bg-white border border-slate-200"
                      }`}>
                        <Icon className={`w-4 h-4 ${isSelected ? profile.color : "text-slate-400"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold truncate ${isSelected ? "text-slate-800" : "text-slate-700"}`}>
                          {profile.name}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">{profile.role}</p>
                      </div>
                      {isSelected && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${profile.bg} ${profile.color} border ${profile.border}`}>
                          Activo
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-slate-400 font-medium">o ingresa manualmente</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Usuario / Nombre
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setSelectedProfile(null); }}
                  placeholder="Ej: Ing. Carlos Mendoza"
                  className="w-full p-3 border border-slate-300 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-400 bg-white transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Contraseña</span>
                  <span className="text-[11px] text-slate-400 font-normal font-mono">
                    Demo: noc2026 / campo2026
                  </span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-3 border border-slate-300 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-400 bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#019DF4] hover:bg-sky-600 active:scale-[0.98] text-white font-semibold py-3 rounded-xl shadow-md shadow-[#019DF4]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verificando acceso...</span>
                  </>
                ) : (
                  <>
                    <span>Ingresar al Sistema</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer — Quick module links */}
          <div className="px-8 py-5 bg-slate-50 border-t border-slate-200">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Acceso directo a módulos
            </p>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#019DF4]/40 hover:shadow-sm text-xs font-medium text-slate-600 hover:text-slate-900 transition-all"
                  >
                    <Icon className={`w-3.5 h-3.5 ${link.color} shrink-0`} />
                    <span className="truncate">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom caption */}
        <p className="text-center text-[11px] text-slate-400 mt-5 font-mono">
          © 2026 Movistar Perú · SGMR v2.4 · Acceso restringido a personal autorizado
        </p>
      </div>
    </div>
  );
}
