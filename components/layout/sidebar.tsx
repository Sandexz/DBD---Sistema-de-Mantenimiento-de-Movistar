"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sliders,
  Search,
  History,
  LayoutDashboard,
  ClipboardList,
  Layers,
  Smartphone,
} from "lucide-react";

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Sidebar({ activeTab = "general", onTabChange }: SidebarProps) {
  const pathname = usePathname();

  const sections = [
    {
      id: "general",
      label: "Monitoreo General",
      icon: LayoutDashboard,
      desc: "Topología y alarmas activas",
    },
    {
      id: "parametros",
      label: "Parámetros de Red",
      icon: Sliders,
      desc: "Umbrales dBm y SLAs",
    },
    {
      id: "consultas",
      label: "Consultas & Nodos",
      icon: Search,
      desc: "Búsqueda de NAP/ODF",
    },
    {
      id: "historico",
      label: "Histórico de Fallas",
      icon: History,
      desc: "Bitácora de eventos 24/7",
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-3.5rem)] flex flex-col justify-between p-5 hidden md:flex shadow-sm">
      <div className="space-y-6">
        {/* Module Title */}
        <div>
          <p className="text-[11px] uppercase tracking-wider font-mono text-[#019DF4] font-semibold">
            Vistas del NOC
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Control de Supervisión</p>
        </div>

        {/* Dynamic Section Tabs */}
        <div className="space-y-1">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isSelected = activeTab === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => onTabChange?.(sec.id)}
                className={`w-full text-left flex items-start gap-3 p-2.5 rounded-xl text-xs transition-all ${
                  isSelected
                    ? "bg-[#EBF5FF] text-[#0B2742] border border-[#019DF4]/30 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Icon
                  className={`w-4 h-4 mt-0.5 shrink-0 ${
                    isSelected ? "text-[#019DF4]" : "text-slate-400"
                  }`}
                />
                <div>
                  <div className={`font-semibold ${isSelected ? "text-[#0B2742]" : "text-slate-700"}`}>
                    {sec.label}
                  </div>
                  <div className="text-[11px] text-slate-400 leading-tight">
                    {sec.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Modules Quick Links */}
        <div className="pt-4 border-t border-slate-200">
          <p className="text-[11px] uppercase tracking-wider font-mono text-slate-400 font-semibold mb-2">
            Módulos del Sistema
          </p>
          <div className="space-y-1">
            <Link
              href="/ots"
              className={`flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl transition-colors ${
                pathname === "/ots"
                  ? "bg-[#EBF5FF] text-[#0B2742] border border-[#019DF4]/30 font-semibold"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <ClipboardList className="w-4 h-4 text-[#019DF4]" />
              <span>Despacho de OTs</span>
            </Link>

            <Link
              href="/mobile"
              className={`flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl transition-colors ${
                pathname === "/mobile"
                  ? "bg-orange-50 text-orange-700 border border-orange-200 font-semibold"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Smartphone className="w-4 h-4 text-[#FF6A13]" />
              <span>App Técnico en Campo</span>
            </Link>

            <Link
              href="/batch"
              className={`flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl transition-colors ${
                pathname === "/batch"
                  ? "bg-[#EBF5FF] text-[#0B2742] border border-[#019DF4]/30 font-semibold"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Layers className="w-4 h-4 text-[#019DF4]" />
              <span>Batch & Liquidaciones</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Network telemetry quick pill */}
      <div className="bg-[#F4F6F9] border border-slate-200 rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500 font-sans">Capacidad Nodos</span>
          <span className="font-mono text-[#019DF4] font-bold">142/142 OK</span>
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#019DF4] h-full rounded-full w-[94%]" />
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>Latencia: 3.8ms</span>
          <span>Buffer: 0%</span>
        </div>
      </div>
    </aside>
  );
}
