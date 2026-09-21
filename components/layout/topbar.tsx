"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Smartphone,
  Layers,
  LayoutDashboard,
  ClipboardList,
  LogOut,
  Bell,
  ChevronDown,
  Wrench,
  BarChart3,
  Radio,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { useUserProfile, UserRole } from "./user-context";

export function Topbar() {
  const pathname = usePathname();
  const { profile, setRole } = useUserProfile();
  const [time, setTime] = useState<string>("03:00:00");
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

  const isGerencial = pathname.startsWith("/gerencial");
  const isOperativo = pathname.startsWith("/operativo");
  const isBatch = pathname.startsWith("/batch");
  const isMobile = pathname.startsWith("/mobile") || pathname === "/operativo/mobile";
  const isOts = pathname.startsWith("/ots") || pathname === "/operativo/ots";
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B2742] border-b border-[#019DF4]/30 shadow-lg font-sans text-white">
      <div className="flex h-14 items-center justify-between px-3 sm:px-6">
        {/* Brand Logo & Movistar Info */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#061625] border border-[#019DF4]/40 text-[#019DF4] shadow-sm font-grotesk font-extrabold text-base group-hover:scale-105 transition-transform">
              M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-grotesk text-sm sm:text-base font-bold tracking-tight text-white group-hover:text-[#019DF4] transition-colors">
                  Movistar Perú
                </span>
                <span className="text-[10px] font-mono bg-[#019DF4]/20 text-[#019DF4] px-1.5 py-0.5 rounded border border-[#019DF4]/40 font-bold">
                  SGMR
                </span>
              </div>
              <p className="text-[10px] font-sans text-slate-300 hidden md:block">
                Mantenimiento e Infraestructura de Redes
              </p>
            </div>
          </Link>

          <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-white/15">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#5BC500] bg-[#5BC500]/15 px-2.5 py-0.5 rounded-full border border-[#5BC500]/30 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5BC500] animate-ping" />
              NOC ONLINE
            </span>
            <span className="text-xs font-mono text-slate-300 bg-[#061625] px-2 py-0.5 rounded border border-white/10">
              {time} UTC-5
            </span>
          </div>
        </div>

        {/* Navigation Modules & Quick Links */}
        <nav className="flex items-center gap-1 sm:gap-1.5">
          <Link
            href="/dashboard"
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              isDashboard
                ? "bg-[#061625] text-[#019DF4] border border-[#019DF4]/50 shadow-inner font-bold"
                : "text-slate-200 hover:text-white hover:bg-[#123960]"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <Link
            href="/gerencial/consulta/disponibilidad"
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              isGerencial
                ? "bg-[#061625] text-[#5BC500] border border-[#5BC500]/50 shadow-inner font-bold"
                : "text-slate-200 hover:text-white hover:bg-[#123960]"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#5BC500]" />
            <span className="hidden sm:inline">Gerencial</span>
          </Link>

          <Link
            href="/operativo/ots"
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              isOperativo || (isOts && !pathname.startsWith("/gerencial"))
                ? "bg-[#061625] text-[#019DF4] border border-[#019DF4]/50 shadow-inner font-bold"
                : "text-slate-200 hover:text-white hover:bg-[#123960]"
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-[#019DF4]" />
            <span className="hidden sm:inline">Operativo (OTs)</span>
          </Link>

          <Link
            href="/batch"
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              isBatch
                ? "bg-[#061625] text-amber-400 border border-amber-400/50 shadow-inner font-bold"
                : "bg-white/10 text-white hover:bg-white/20 border border-white/15"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Batch</span>
          </Link>

          <Link
            href="/mobile"
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              isMobile
                ? "bg-[#5BC500] text-white font-bold shadow-movistar-green"
                : "bg-[#5BC500]/20 text-[#C6EE94] hover:bg-[#5BC500]/30 border border-[#5BC500]/40 font-medium"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-[#5BC500]" />
            <span className="hidden xs:inline">App Móvil</span>
          </Link>
        </nav>

        {/* Right Section: Alert Bell & Profile Switcher */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Notifications Alert Bell */}
          <Link
            href="/dashboard#alertas"
            className="relative p-2 text-slate-200 hover:text-white hover:bg-[#123960] rounded-xl transition-colors"
            title="Alertas Activas NOC"
          >
            <Bell className="w-4 h-4 text-slate-200" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
          </Link>

          {/* Profile Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl bg-[#061625] hover:bg-[#061625]/80 border border-white/15 text-xs transition-colors cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-[#019DF4] text-[#0B2742] font-bold flex items-center justify-center text-[10px]">
                {profile.role === "NOC" ? "NOC" : profile.role === "SUPERVISOR" ? "SUP" : "TEC"}
              </div>
              <div className="text-left hidden md:block">
                <p className="font-semibold text-white leading-tight">{profile.name}</p>
                <p className="text-[10px] text-[#019DF4] font-mono leading-none">
                  {profile.roleLabel}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 text-slate-800 rounded-2xl shadow-xl p-2.5 z-50 animate-in fade-in">
                <div className="px-3 py-2 border-b border-slate-100 mb-2">
                  <p className="text-xs font-bold text-slate-900">{profile.name}</p>
                  <p className="text-[11px] text-slate-500">{profile.roleLabel}</p>
                  <p className="text-[10px] font-mono text-[#019DF4] mt-0.5">{profile.organization}</p>
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
                      profile.role === "NOC" ? "bg-[#E5F4FD] text-[#0070B8] font-bold" : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span>Ingeniero NOC</span>
                    {profile.role === "NOC" && <span className="text-xs text-[#019DF4]">✓</span>}
                  </button>

                  <button
                    onClick={() => {
                      setRole("SUPERVISOR");
                      setProfileOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      profile.role === "SUPERVISOR" ? "bg-[#E5F4FD] text-[#0070B8] font-bold" : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span>Supervisor de Red</span>
                    {profile.role === "SUPERVISOR" && <span className="text-xs text-[#019DF4]">✓</span>}
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

                <div className="border-t border-slate-100 pt-2 space-y-1">
                  <p className="text-[10px] uppercase font-mono font-bold text-slate-400 px-3">
                    Accesos Directos:
                  </p>
                  <Link
                    href="/mobile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-[#5BC500]" />
                    <span>1. App Móvil Campo (/mobile)</span>
                  </Link>
                  <Link
                    href="/batch"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#019DF4]" />
                    <span>2. Módulo Batch (/batch)</span>
                  </Link>
                  <Link
                    href="/ots"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <ClipboardList className="w-3.5 h-3.5 text-slate-500" />
                    <span>3. Gestión OTs (/ots)</span>
                  </Link>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-1">
                  <Link
                    href="/login"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-1.5 text-xs text-[#FF6A13] hover:bg-orange-50 px-3 py-1.5 rounded-xl w-full font-medium"
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
