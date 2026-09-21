"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FilePlus2,
  ClipboardList,
  Smartphone,
  FileCheck2,
  FileSpreadsheet,
  Receipt,
  ShieldAlert,
  HardHat,
} from "lucide-react";

export function SidebarOperativo() {
  const pathname = usePathname();

  const dataEntryNav = [
    {
      href: "/operativo/tickets",
      label: "Registro de Tickets e Incidencias",
      icon: FilePlus2,
      desc: "Captura con validación sin duplicados",
    },
    {
      href: "/operativo/ots",
      label: "Gestión de Órdenes de Trabajo",
      icon: ClipboardList,
      desc: "OT Preventiva / OT Correctiva",
    },
    {
      href: "/operativo/mobile",
      label: "Check-in y Ejecución Dinámica",
      icon: Smartphone,
      desc: "App Móvil de Campo (GPS y Cierre)",
    },
  ];

  const reportesNav = [
    {
      href: "/operativo/reportes?tab=asignacion",
      tab: "asignacion",
      label: "Papeleta de Asignación de OT",
      icon: FileCheck2,
      desc: "Comprobante digital para cuadrilla",
    },
    {
      href: "/operativo/reportes?tab=conformidad",
      tab: "conformidad",
      label: "Constancia de Conformidad",
      icon: FileSpreadsheet,
      desc: "Acta de conformidad con firma digital",
    },
    {
      href: "/operativo/reportes?tab=vale",
      tab: "vale",
      label: "Vale de Consumo de Materiales",
      icon: Receipt,
      desc: "Descuento en stock de camioneta",
    },
    {
      href: "/operativo/reportes?tab=ats",
      tab: "ats",
      label: "Papeleta ATS (Trabajo Seguro)",
      icon: ShieldAlert,
      desc: "Inspección de riesgos y arnés EPP",
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-3.5rem)] flex flex-col justify-between p-4 hidden md:flex">
      <div className="space-y-6">
        {/* Module Header */}
        <div className="pb-3 border-b border-slate-100">
          <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#0070B8] bg-[#E5F4FD] px-2 py-0.5 rounded border border-[#B8E2FB]">
            ON-LINE OPERATIVO
          </span>
          <h2 className="text-sm font-bold font-grotesk text-slate-900 mt-1.5">
            Ejecución Diaria en Red
          </h2>
        </div>

        {/* Sección 1: Data Entry */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 px-2.5 mb-1.5">
            Data Entry (Validaciones Activas)
          </p>

          {dataEntryNav.map((item) => {
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

        {/* Sección 2: Reportes Operativos */}
        <div className="space-y-1 pt-3 border-t border-slate-150">
          <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 px-2.5 mb-1.5">
            Reportes Operativos Inmediatos
          </p>

          {reportesNav.map((item) => {
            const Icon = item.icon;
            const isReportPage = pathname === "/operativo/reportes";
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-start gap-2.5 p-2 rounded-lg text-xs transition-all ${
                  isReportPage
                    ? "text-slate-700 hover:bg-slate-100"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-4 h-4 mt-0.5 shrink-0 text-[#019DF4]" />
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">{item.label}</div>
                  <div className="text-[10px] text-slate-400 truncate font-normal leading-tight">
                    {item.desc}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Field Support Box */}
      <div className="bg-[#E5F4FD] border border-[#B8E2FB] rounded-xl p-3 text-xs space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-[#0070B8]">
          <HardHat className="w-4 h-4 text-[#0070B8]" />
          <span>Soporte Técnico Movistar</span>
        </div>
        <p className="text-[11px] text-slate-600">
          Línea directa cuadrillas: <strong>*9912 (Canal NOC)</strong>
        </p>
      </div>
    </aside>
  );
}
