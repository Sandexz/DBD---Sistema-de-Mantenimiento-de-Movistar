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
} from "lucide-react";
import { Badge } from "../ui/badge";

export function Topbar() {
  const pathname = usePathname();
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

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Gestión OTs", href: "/ots", icon: ClipboardList },
    { label: "App Móvil (Campo)", href: "/mobile", icon: Smartphone, highlight: true },
    { label: "Batch / Liquidación", href: "/batch", icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A2E5C] border-b border-[#144585] shadow-lg">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo & System Info */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#061D3A] border border-[#00AEEF]/40 text-[#00AEEF] shadow-sm">
              <Radio className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-grotesk text-lg font-bold tracking-tight text-white group-hover:text-[#00AEEF] transition-colors">
                  SGMR
                </span>
                <span className="text-[10px] font-mono bg-[#00AEEF]/20 text-[#00AEEF] px-1.5 py-0.2 rounded border border-[#00AEEF]/30">
                  v2.6-NOC
                </span>
              </div>
              <p className="text-[10px] font-sans text-slate-300 hidden sm:block">
                Gestión de Mantenimiento de Redes
              </p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-white/15">
            <Badge variant="cyan" size="sm" pulse>
              CORE TELECOM ONLINE
            </Badge>
            <span className="text-xs font-mono text-slate-300 bg-[#061D3A]/60 px-2 py-0.5 rounded border border-white/10">
              {time} UTC-5
            </span>
          </div>
        </div>

        {/* Navigation Quick Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  isActive
                    ? "bg-[#061D3A] text-[#00AEEF] border border-[#00AEEF]/40 shadow-inner"
                    : item.highlight
                    ? "bg-white/10 text-white hover:bg-white/20 border border-white/20 font-semibold"
                    : "text-slate-200 hover:text-white hover:bg-[#144585]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Alerts & Profile */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard#alertas"
            className="relative p-2 text-slate-200 hover:text-white hover:bg-[#144585] rounded-lg transition-colors"
            title="Alertas Activas NOC"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6A13] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6A13]" />
            </span>
          </Link>

          {/* User Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg bg-[#061D3A] hover:bg-[#061D3A]/80 border border-white/15 text-xs transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-[#00AEEF] text-[#0A2E5C] font-bold flex items-center justify-center text-[10px]">
                NO
              </div>
              <div className="text-left hidden sm:block">
                <p className="font-semibold text-white leading-tight">Ing. NOC Central</p>
                <p className="text-[10px] text-[#00AEEF] font-mono leading-none">ID: NOC-9912</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#121418] border border-[#1E232B] rounded-lg shadow-2xl p-2 z-50 animate-in fade-in">
                <div className="px-3 py-2 border-b border-[#1E232B] mb-1">
                  <p className="text-xs font-semibold text-white">Ing. Luis Valdivia</p>
                  <p className="text-[11px] text-slate-400">Supervisor NOC Nivel 3</p>
                  <Badge variant="cyan" size="sm" className="mt-1">
                    Turno Noche Activo
                  </Badge>
                </div>
                <Link
                  href="/mobile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-[#181B21] rounded-md transition-colors"
                >
                  <Smartphone className="w-4 h-4 text-[#00AEEF]" />
                  <span>Modo Técnico de Campo</span>
                </Link>
                <Link
                  href="/login"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-[#FF6A13] hover:bg-[#FF6A13]/10 rounded-md transition-colors border-t border-[#1E232B] mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
