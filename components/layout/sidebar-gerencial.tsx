"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Database,
  Clock,
  MapPin,
  Users,
  CalendarDays,
  Navigation,
  FileSearch,
  Activity,
  BarChart3,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export function SidebarGerencial() {
  const pathname = usePathname();

  const parametrosNav = [
    {
      href: "/gerencial/parametros/activos",
      label: "Gestión de Activos y Vida Útil",
      icon: Database,
      desc: "Catálogo, vida útil y renovación",
    },
    {
      href: "/gerencial/parametros/sla",
      label: "SLA y Tiempos Base",
      icon: Clock,
      desc: "Umbrales y penalidades OSIPTEL",
    },
    {
      href: "/gerencial/parametros/zonas",
      label: "Zonas y Centrales",
      icon: MapPin,
      desc: "Estructura geográfica operativa",
    },
    {
      href: "/gerencial/parametros/contratistas",
      label: "Contratistas",
      icon: Users,
      desc: "Padrón de empresas y cuadrillas",
    },
    {
      href: "/gerencial/parametros/planificacion",
      label: "Planificación de Mantenimientos",
      icon: CalendarDays,
      desc: "Programación preventiva y correctiva",
    },
  ];

  const consultaNav = [
    {
      href: "/gerencial/consulta/tracking",
      label: "Tracking y Geolocalización",
      icon: Navigation,
      desc: "Cuadrillas y móviles en vivo",
    },
    {
      href: "/gerencial/consulta/tickets",
      label: "Estado de Tickets e Incidencias",
      icon: FileSearch,
      desc: "Ciclo de vida y auditoría",
    },
    {
      href: "/gerencial/consulta/disponibilidad",
      label: "Disponibilidad de Red",
      icon: Activity,
      desc: "Dashboard NOC y topología SVG",
    },
    {
      href: "/gerencial/consulta/seguimiento",
      label: "Seguimiento de Mantenimientos",
      icon: BarChart3,
      desc: "Programados vs Ejecutados (%)",
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-3.5rem)] flex flex-col justify-between p-4 hidden md:flex">
      <div className="space-y-6">
        {/* Module Header */}
        <div className="pb-3 border-b border-slate-100">
          <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#5BC500] bg-[#F0F9E8] px-2 py-0.5 rounded border border-[#C6EE94]">
            ON-LINE GERENCIAL
          </span>
          <h2 className="text-sm font-bold font-grotesk text-slate-900 mt-1.5">
            Supervisión & Parámetros
          </h2>
        </div>

        {/* Sección 1: Mantenimiento de Parámetros */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 px-2.5 mb-1.5 flex items-center justify-between">
            <span>Mantenimiento de Parámetros</span>
          </p>

          {parametrosNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-start gap-2.5 p-2 rounded-lg text-xs transition-all ${
                  isActive
                    ? "bg-[#F0F9E8] text-[#3F8500] font-bold border border-[#C6EE94]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon
                  className={`w-4 h-4 mt-0.5 shrink-0 ${
                    isActive ? "text-[#5BC500]" : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="truncate">{item.label}</div>
                  <div className="text-[10px] text-slate-400 truncate font-normal leading-tight">
                    {item.desc}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Sección 2: Consulta */}
        <div className="space-y-1 pt-3 border-t border-slate-150">
          <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 px-2.5 mb-1.5 flex items-center justify-between">
            <span>Consulta</span>
          </p>

          {consultaNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-start gap-2.5 p-2 rounded-lg text-xs transition-all ${
                  isActive
                    ? "bg-[#E5F4FD] text-[#0070B8] font-bold border border-[#B8E2FB]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon
                  className={`w-4 h-4 mt-0.5 shrink-0 ${
                    isActive ? "text-[#019DF4]" : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="truncate">{item.label}</div>
                  <div className="text-[10px] text-slate-400 truncate font-normal leading-tight">
                    {item.desc}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Network telemetry quick pill */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 space-y-2 text-xs">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500 font-medium">Capacidad Nodos</span>
          <span className="font-mono text-[#3F8500] font-bold">142/142 OK</span>
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#5BC500] h-full rounded-full w-[94%]" />
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>Latencia: 3.8ms</span>
          <span className="text-[#019DF4]">OSIPTEL Conforme</span>
        </div>
      </div>
    </aside>
  );
}
