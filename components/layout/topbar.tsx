"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Smartphone,
  Layers,
  LayoutDashboard,
  ClipboardList,
  LogOut,
  Bell,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { Badge } from "../ui/badge";

export function Topbar() {
  const pathname = usePathname();
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

  const navItems = [
    { label: "App Móvil (Campo)", href: "/mobile", icon: Smartphone, highlight: true },
    { label: "Batch & Liquidación", href: "/batch", icon: Layers, highlight: true },
    { label: "Gestión OTs", href: "/ots", icon: ClipboardList },
    { label: "Dashboard NOC", href: "/dashboard", icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B2742] border-b border-[#019DF4]/30 shadow-lg font-sans">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo & Movistar Info */}
        <div className="flex items-center gap-4">
          <Link href="/batch" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#061625] border border-[#019DF4]/40 text-[#019DF4] shadow-sm font-grotesk font-extrabold text-base">
              M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-grotesk text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-[#019DF4] transition-colors">
                  Movistar Perú
                </span>
                <span className="text-[10px] font-mono bg-[#019DF4]/20 text-[#019DF4] px-1.5 py-0.5 rounded border border-[#019DF4]/40 font-bold">
                  SGMR
                </span>
              </div>
              <p className="text-[10px] font-sans text-slate-300 hidden sm:block">
                Mantenimiento e Infraestructura de Redes
              </p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-white/15">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#00A86B] bg-[#00A86B]/15 px-2.5 py-0.5 rounded-full border border-[#00A86B]/30 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A86B] animate-ping" />
              NOC ONLINE
            </span>
            <span className="text-xs font-mono text-slate-300 bg-[#061625] px-2 py-0.5 rounded border border-white/10">
              {time} UTC-5
            </span>
          </div>
        </div>

        {/* Navigation Quick Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl transition-all ${
                  isActive
                    ? "bg-[#061625] text-[#019DF4] border border-[#019DF4]/50 shadow-inner font-bold"
                    : item.highlight
                    ? "bg-white/10 text-white hover:bg-white/20 border border-white/15 font-semibold"
                    : "text-slate-200 hover:text-white hover:bg-[#123960]"
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
            className="relative p-2 text-slate-200 hover:text-white hover:bg-[#123960] rounded-xl transition-colors"
            title="Alertas Activas NOC"
          >
            <Bell className="w-4 h-4 text-slate-200" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6A13] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6A13]" />
            </span>
          </Link>

          {/* User Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl bg-[#061625] hover:bg-[#061625]/80 border border-white/15 text-xs transition-colors cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-[#019DF4] text-[#0B2742] font-bold flex items-center justify-center text-[10px]">
                DQ
              </div>
              <div className="text-left hidden sm:block">
                <p className="font-semibold text-white leading-tight">Diego Quispe</p>
                <p className="text-[10px] text-[#019DF4] font-mono leading-none">Téc. / Supervisor</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-semibold text-slate-900">Diego Quispe</p>
                  <p className="text-[11px] text-slate-500">Cuadrilla Alfa 01 & Auditoría</p>
                  <Badge variant="cyan" size="sm" className="mt-1 bg-[#019DF4]/10 text-[#019DF4] border-[#019DF4]/30">
                    Módulos Asignados
                  </Badge>
                </div>
                <Link
                  href="/mobile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <Smartphone className="w-4 h-4 text-[#00A86B]" />
                  <span>1. App Móvil Campo (/mobile)</span>
                </Link>
                <Link
                  href="/batch"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <Layers className="w-4 h-4 text-[#019DF4]" />
                  <span>2. Módulo Batch (/batch)</span>
                </Link>
                <Link
                  href="/ots"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <ClipboardList className="w-4 h-4 text-slate-500" />
                  <span>3. Gestión OTs (/ots)</span>
                </Link>
                <Link
                  href="/login"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-[#FF6A13] hover:bg-orange-50 rounded-xl transition-colors border-t border-slate-100 mt-1"
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
