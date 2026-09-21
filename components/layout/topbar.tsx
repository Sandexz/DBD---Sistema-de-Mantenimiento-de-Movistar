"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronDown,
  LogOut,
  Smartphone,
  Layers,
  ClipboardList,
  ShieldCheck,
  HardHat,
  User,
  Radio,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { MovistarLogo } from "../ui/movistar-logo";
import { useUserProfile, UserRole } from "./user-context";

export function Topbar() {
  const pathname = usePathname();
  const { profile, setRole } = useUserProfile();
  const [time, setTime] = useState<string>("09:45:00");
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

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B2742] border-b border-[#019DF4]/30 shadow-md font-sans text-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-8">
        {/* Left Section: Official Movistar Logo & System Badge */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-3 group transition-opacity hover:opacity-95">
            {/* Movistar Logo Asset */}
            <div className="bg-white/10 hover:bg-white/15 px-2.5 py-1.5 rounded-xl border border-white/10 flex items-center justify-center transition-colors">
              <MovistarLogo className="h-7 w-auto object-contain" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-grotesk text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-[#019DF4] transition-colors">
                  Movistar Perú
                </span>
                <span className="text-[10px] font-mono bg-[#019DF4]/25 text-[#019DF4] px-2 py-0.5 rounded-full border border-[#019DF4]/40 font-bold">
                  SGMR v3.0
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans hidden sm:block">
                Sistema de Mantenimiento e Infraestructura de Redes
              </p>
            </div>
          </Link>
        </div>

        {/* Center Section: Clean NOC Live Telemetry Status */}
        <div className="hidden md:flex items-center gap-3 bg-[#061625]/80 px-4 py-1.5 rounded-full border border-white/10 shadow-inner">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#00A86B] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#00A86B] animate-ping" />
            NOC CENTRAL ONLINE
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-xs font-mono text-slate-300" suppressHydrationWarning>
            {time} UTC-5
          </span>
        </div>

        {/* Right Section: Alerts Notification Bell & User Profile Menu */}
        <div className="flex items-center gap-3">
          {/* Notifications Alert Bell */}
          <Link
            href="/dashboard#alertas"
            className="relative p-2.5 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors border border-transparent hover:border-white/10"
            title="Alertas Activas NOC"
          >
            <Bell className="w-4 h-4 text-slate-200" />
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
          </Link>

          {/* Profile Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-[#061625] hover:bg-[#081d33] border border-white/15 text-xs transition-colors cursor-pointer shadow-sm"
            >
              <div className="w-7 h-7 rounded-xl bg-[#019DF4] text-[#0B2742] font-bold flex items-center justify-center text-xs shadow-inner">
                {profile.role === "NOC" ? "NOC" : profile.role === "SUPERVISOR" ? "SUP" : "TEC"}
              </div>
              <div className="text-left hidden sm:block">
                <p className="font-semibold text-white leading-tight text-xs">{profile.name}</p>
                <p className="text-[10px] text-[#019DF4] font-mono leading-none">
                  {profile.roleLabel}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 text-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in">
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
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      profile.role === "NOC" ? "bg-[#E5F4FD] text-[#0070B8] font-bold" : "hover:bg-slate-50 text-slate-700"
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
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      profile.role === "SUPERVISOR" ? "bg-[#E5F4FD] text-[#0070B8] font-bold" : "hover:bg-slate-50 text-slate-700"
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
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      profile.role === "FIELD" ? "bg-[#F0F9E8] text-[#3F8500] font-bold" : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span>Técnico de Campo (Lari)</span>
                    {profile.role === "FIELD" && <span className="text-xs text-[#5BC500]">✓</span>}
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-1">
                  <Link
                    href="/login"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-1.5 text-xs text-[#FF6A13] hover:bg-orange-50 px-3 py-1.5 rounded-xl w-full font-medium transition-colors"
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
