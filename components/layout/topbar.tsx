"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Radio,
  Smartphone,
  Layers,
  LayoutDashboard,
  ClipboardList,
  LogOut,
  Bell,
  ShieldCheck,
  ChevronDown,
  UserCheck,
  Wrench,
  FileSpreadsheet,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { useUserProfile, UserRole } from "./user-context";

export function Topbar() {
  const pathname = usePathname();
  const { profile, setRole } = useUserProfile();
  const [time, setTime] = useState<string>("22:15:00");
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toTimeString().split(" ")[0] ||
          now.toLocaleTimeString("es-PE", { hour12: false })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const isGerencial = pathname.startsWith("/gerencial") || pathname === "/dashboard";
  const isOperativo = pathname.startsWith("/operativo") || pathname === "/ots" || pathname === "/mobile";
  const isBatch = pathname.startsWith("/batch");

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B2742] border-b border-[#071828] text-white shadow-md">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo & System Title */}
        <div className="flex items-center gap-4">
          <Link href="/gerencial/consulta/disponibilidad" className="flex items-center gap-2.5 group">
            {/* Movistar Green icon badge */}
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5BC500] text-white shadow-movistar-green group-hover:scale-105 transition-transform">
              <Radio className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-grotesk text-lg font-extrabold tracking-tight text-white flex items-center gap-1">
                  movistar <span className="text-[#5BC500] text-base font-bold">SGMR</span>
                </span>
                <span className="text-[10px] font-mono bg-[#5BC500]/20 text-[#C6EE94] px-1.5 py-0.2 rounded border border-[#5BC500]/30 hidden sm:inline-block">
                  v3.0-ONLINE
                </span>
              </div>
              <p className="text-[10px] text-slate-300 font-sans hidden md:block">
                Sistema de Mantenimiento de Redes
              </p>
            </div>
          </Link>

          <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-white/15">
            <Badge variant="movistar" size="sm" pulse>
              NOC MOVISTAR ACTIVO
            </Badge>
            <span className="text-xs font-mono text-slate-300 bg-white/10 px-2 py-0.5 rounded border border-white/10">
              {time} UTC-5
            </span>
          </div>
        </div>

        {/* Main Navigation Modules: GERENCIAL / OPERATIVO / BATCH */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          {/* Módulo GERENCIAL */}
          <Link
            href="/gerencial/consulta/disponibilidad"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              isGerencial
                ? "bg-white text-[#0B2742] shadow-sm"
                : "text-slate-200 hover:text-white hover:bg-white/10"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#5BC500]" />
            <span>GERENCIAL</span>
          </Link>

          {/* Módulo OPERATIVO */}
          <Link
            href="/operativo/ots"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              isOperativo
                ? "bg-white text-[#0B2742] shadow-sm"
                : profile.role === "FIELD"
                ? "bg-[#5BC500] text-white hover:bg-[#489E00]"
                : "text-slate-200 hover:text-white hover:bg-white/10"
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-[#019DF4]" />
            <span>OPERATIVO</span>
            {profile.role === "FIELD" && (
              <span className="w-2 h-2 rounded-full bg-white animate-ping ml-0.5" />
            )}
          </Link>

          {/* Módulo BATCH */}
          <Link
            href="/batch"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              isBatch
                ? "bg-white text-[#0B2742] shadow-sm"
                : "text-slate-200 hover:text-white hover:bg-white/10"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">BATCH</span>
          </Link>

          {/* App Móvil Técnica rápida */}
          <Link
            href="/operativo/mobile"
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
              pathname.includes("/mobile")
                ? "bg-[#5BC500] text-white border-[#5BC500]"
                : "bg-white/10 text-white border-white/20 hover:bg-white/20"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-[#5BC500]" />
            <span>App Móvil</span>
          </Link>
        </nav>

        {/* Right Section: Alert Bell & Profile Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Notifications Alert Bell */}
          <Link
            href="/gerencial/consulta/disponibilidad#alertas"
            className="relative p-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Alertas de Red"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
          </Link>

          {/* Profile Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-xs transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-[#5BC500] text-white font-bold flex items-center justify-center text-xs">
                {profile.role === "NOC" ? "NOC" : profile.role === "SUPERVISOR" ? "SUP" : "TEC"}
              </div>
              <div className="text-left hidden md:block">
                <p className="font-semibold text-white leading-tight">{profile.name}</p>
                <p className="text-[10px] text-slate-300 font-mono leading-none">
                  {profile.roleLabel}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 text-slate-800 rounded-xl shadow-2xl p-2.5 z-50 animate-in fade-in">
                <div className="px-3 py-2 border-b border-slate-100 mb-2">
                  <p className="text-xs font-bold text-slate-900">{profile.name}</p>
                  <p className="text-[11px] text-slate-500">{profile.roleLabel}</p>
                  <p className="text-[10px] font-mono text-[#0070B8] mt-0.5">{profile.organization}</p>
                </div>

                <div className="space-y-1 mb-2">
                  <p className="text-[10px] uppercase font-mono font-bold text-slate-400 px-3">
                    Cambiar Perfil Activo:
                  </p>
                  <button
                    onClick={() => {
                      setRole("NOC");
                      setProfileOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      profile.role === "NOC" ? "bg-[#F0F9E8] text-[#3F8500] font-bold" : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span>Ingeniero NOC</span>
                    {profile.role === "NOC" && <span className="text-xs text-[#5BC500]">✓</span>}
                  </button>

                  <button
                    onClick={() => {
                      setRole("SUPERVISOR");
                      setProfileOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      profile.role === "SUPERVISOR" ? "bg-[#F0F9E8] text-[#3F8500] font-bold" : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span>Supervisor</span>
                    {profile.role === "SUPERVISOR" && <span className="text-xs text-[#5BC500]">✓</span>}
                  </button>

                  <button
                    onClick={() => {
                      setRole("FIELD");
                      setProfileOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      profile.role === "FIELD" ? "bg-[#F0F9E8] text-[#3F8500] font-bold" : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span>Técnico de Campo (Lari)</span>
                    {profile.role === "FIELD" && <span className="text-xs text-[#5BC500]">✓</span>}
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href="/login"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 px-3 py-1 rounded hover:bg-rose-50 w-full"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Cerrar Sesión</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
