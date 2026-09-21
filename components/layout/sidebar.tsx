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
  PlusCircle,
  RefreshCw,
  BarChart3,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "../ui/button";

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function Sidebar({
  activeTab = "general",
  onTabChange,
  onRefresh,
  isRefreshing = false,
}: SidebarProps) {
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
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-3.5rem)] flex flex-col justify-between p-4 hidden md:flex shadow-sm">
      <div className="space-y-5">
        {/* Quick Action Dashboard Buttons on Left Sidebar */}
        <div className="space-y-2 pb-3 border-b border-slate-150">
          <p className="text-[10px] uppercase tracking-wider font-mono text-slate-400 font-bold px-1">
            Acciones Rápidas
          </p>
          <div className="space-y-1.5">
            <Link href="/ots" className="block w-full">
              <Button
                variant="orange"
                size="sm"
                className="w-full justify-center shadow-sm font-semibold text-xs py-2"
              >
                <PlusCircle className="w-4 h-4 mr-1.5" />
                Despachar Nueva OT
              </Button>
            </Link>

            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                isLoading={isRefreshing}
                className="w-full justify-center font-mono text-xs text-slate-700 hover:text-[#019DF4] hover:border-[#019DF4]/40 py-2"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Actualizar Telemetría
              </Button>
            )}
          </div>
        </div>

        {/* Dynamic Section Tabs (Vistas del Dashboard) */}
        <div>
          <div className="flex items-center justify-between mb-1.5 px-1">
            <p className="text-[10px] uppercase tracking-wider font-mono text-[#019DF4] font-bold">
              Vistas del Dashboard
            </p>
            <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
              NOC
            </span>
          </div>

          <div className="space-y-1">
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isSelected = activeTab === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => onTabChange?.(sec.id)}
                  className={`w-full text-left flex items-start gap-2.5 p-2 rounded-xl text-xs transition-all ${
                    isSelected
                      ? "bg-[#EBF5FF] text-[#0B2742] border border-[#019DF4]/40 font-semibold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      isSelected ? "text-[#019DF4]" : "text-slate-400"
                    }`}
                  />
                  <div className="min-w-0">
                    <div className={isSelected ? "text-[#0B2742] font-semibold" : "text-slate-700"}>
                      {sec.label}
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight truncate">
                      {sec.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Modules Quick Links */}
        <div className="pt-3 border-t border-slate-150">
          <p className="text-[10px] uppercase tracking-wider font-mono text-slate-400 font-bold mb-1.5 px-1">
            Módulos del Sistema
          </p>
          <div className="space-y-1">
            <Link
              href="/gerencial/consulta/disponibilidad"
              className={`flex items-center gap-2.5 px-2.5 py-2 text-xs rounded-xl transition-colors ${
                pathname.startsWith("/gerencial")
                  ? "bg-[#F0F9E8] text-[#3F8500] font-semibold border border-[#C6EE94]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <BarChart3 className="w-4 h-4 text-[#5BC500]" />
              <div className="truncate">
                <span className="block font-medium">Módulo Gerencial</span>
                <span className="text-[10px] text-slate-400 block font-normal leading-none">
                  SLA, Activos y Zonas
                </span>
              </div>
            </Link>

            <Link
              href="/operativo/tickets"
              className={`flex items-center gap-2.5 px-2.5 py-2 text-xs rounded-xl transition-colors ${
                pathname.startsWith("/operativo")
                  ? "bg-[#E5F4FD] text-[#0070B8] font-semibold border border-[#B8E2FB]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-[#019DF4]" />
              <div className="truncate">
                <span className="block font-medium">Módulo Operativo</span>
                <span className="text-[10px] text-slate-400 block font-normal leading-none">
                  Tickets y Reportes
                </span>
              </div>
            </Link>

            <Link
              href="/mobile"
              className={`flex items-center gap-2.5 px-2.5 py-2 text-xs rounded-xl transition-colors ${
                pathname === "/mobile"
                  ? "bg-orange-50 text-orange-700 border border-orange-200 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Smartphone className="w-4 h-4 text-[#FF6A13]" />
              <div className="truncate">
                <span className="block font-medium">App Móvil de Campo</span>
                <span className="text-[10px] text-slate-400 block font-normal leading-none">
                  Simulador Cuadrilla
                </span>
              </div>
            </Link>

            <Link
              href="/batch"
              className={`flex items-center gap-2.5 px-2.5 py-2 text-xs rounded-xl transition-colors ${
                pathname === "/batch"
                  ? "bg-[#EBF5FF] text-[#0B2742] border border-[#019DF4]/30 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Layers className="w-4 h-4 text-[#019DF4]" />
              <div className="truncate">
                <span className="block font-medium">Batch & Liquidaciones</span>
                <span className="text-[10px] text-slate-400 block font-normal leading-none">
                  Auditoría Nocturna
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Network telemetry quick pill */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 space-y-2 mt-4">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500 font-medium">Capacidad Nodos</span>
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

