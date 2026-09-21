"use client";

// Mapa de trazabilidad: ARQUITECTURA → MÓDULO → SUBMÓDULO → FUNCIÓN → INTERFAZ EXTERNA.
// Se genera desde lib/navigation.ts, la misma fuente que alimenta menús y permisos.
import React from "react";
import Link from "next/link";
import { Check, Minus, Star, Layers } from "lucide-react";
import { AppShell } from "@/components/sgmr/shell";
import { Callout, Panel, Pill } from "@/components/sgmr/ui";
import { ARQUITECTURA, BATCH, FUNCIONES, MODULOS, ROLES } from "@/lib/navigation";
import type { Rol } from "@/lib/types";

const PERFILES: Rol[] = ["NOC", "SUPERVISOR", "TECNICO"];

const VALIDACIONES = [
  { v: "Tickets duplicados", donde: "Registro de Tickets e Incidencias · Gestión de Órdenes de Trabajo", ruta: "/operativo/data-entry/tickets" },
  { v: "Proximidad GPS (≤ 50 m)", donde: "Check-in y Ejecución Dinámica (paso 1)", ruta: "/operativo/campo/checkin" },
  { v: "Stock de repuestos", donde: "Descargo de Repuestos (paso 4)", ruta: "/operativo/campo/repuestos" },
  { v: "Evidencia para cierre", donde: "Cierre Transaccional (paso 5)", ruta: "/operativo/campo/cierre" },
  { v: "ATS previo a la ejecución", donde: "Check-in y Ejecución Dinámica (paso 2)", ruta: "/operativo/campo/checkin" },
];

export default function TrazabilidadPage() {
  return (
    <AppShell
      titulo="Mapa de trazabilidad"
      descripcion="Correspondencia entre la arquitectura de referencia, las funciones implementadas y sus interfaces externas."
      migas={[ARQUITECTURA, "Trazabilidad"]}
    >
      <Callout tone="info">
        Alcance de este equipo: arquitectura <strong>ON-LINE</strong>, módulos <strong>Gerencial</strong> y <strong>Operativo</strong>. El
        módulo <Link href={BATCH.ruta}>Batch</Link> pertenece a otro equipo y solo se enlaza.
      </Callout>

      {MODULOS.map((m) => {
        const funciones = FUNCIONES.filter((f) => f.modulo === m.id);
        return (
          <Panel key={m.id} noPad title={`${ARQUITECTURA} › ${m.id}`} subtitle={m.descripcion}>
            <div className="overflow-x-auto">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Submódulo</th>
                    <th>Función</th>
                    <th>Interfaz externa (ruta)</th>
                    <th>Tipo de interfaz</th>
                    <th>Mantenimiento</th>
                    {PERFILES.map((p) => (
                      <th key={p} className="text-center">
                        {ROLES[p].nombre}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {funciones.map((f) => (
                    <tr key={f.id}>
                      <td className="whitespace-nowrap text-mv-ink-2">{f.submodulo}</td>
                      <td className="min-w-[220px] font-semibold">
                        <span className="flex items-center gap-1.5">
                          {f.nombre}
                          {f.prioritaria && <Star className="h-3 w-3 fill-st-warn text-st-warn" aria-label="Prioritaria" />}
                        </span>
                        {f.complementaria && <span className="block text-[11px] font-normal text-mv-muted">Pantalla existente, fuera de la arquitectura</span>}
                      </td>
                      <td className="whitespace-nowrap">
                        <Link href={f.ruta} className="font-mono text-xs font-semibold text-mv-green-700 hover:underline">
                          {f.ruta}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap text-xs">{f.interfaz}</td>
                      <td className="whitespace-nowrap">
                        <Pill tone={f.alcance === "Preventivo" ? "teal" : f.alcance === "Correctivo" ? "neutral" : "info"}>{f.alcance}</Pill>
                      </td>
                      {PERFILES.map((p) => (
                        <td key={p} className="text-center">
                          {f.roles.includes(p) ? <Check className="mx-auto h-4 w-4 text-st-ok" aria-label="Permitido" /> : <Minus className="mx-auto h-4 w-4 text-mv-line-2" aria-label="Sin acceso" />}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        );
      })}

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Validaciones visibles y dónde se aplican">
          <ul className="divide-y divide-mv-line text-[13px]">
            {VALIDACIONES.map((v) => (
              <li key={v.v} className="flex items-start justify-between gap-3 py-2">
                <div>
                  <p className="font-semibold text-mv-ink">{v.v}</p>
                  <p className="text-xs text-mv-ink-2">{v.donde}</p>
                </div>
                <Link href={v.ruta} className="shrink-0 font-mono text-[11px] text-mv-green-700 hover:underline">
                  {v.ruta}
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Rutas heredadas" subtitle="Se conservan para no romper enlaces existentes">
          <ul className="divide-y divide-mv-line text-[13px]">
            <li className="flex justify-between gap-3 py-2"><span className="font-mono">/ots</span><span className="text-mv-ink-2">redirige a /operativo/ots (paridad funcional verificada)</span></li>
            <li className="flex justify-between gap-3 py-2"><span className="font-mono">/mobile</span><span className="text-mv-ink-2">redirige a /operativo/campo/checkin</span></li>
            <li className="flex justify-between gap-3 py-2"><span className="font-mono">/dashboard</span><span className="text-mv-ink-2">Dashboard Gerencial (conservado)</span></li>
            <li className="flex justify-between gap-3 py-2"><span className="font-mono">/login · /</span><span className="text-mv-ink-2">acceso por perfil · / redirige a /login</span></li>
            <li className="flex justify-between gap-3 py-2">
              <span className="flex items-center gap-1.5 font-mono"><Layers className="h-3.5 w-3.5" /> /batch</span>
              <span className="text-mv-ink-2">sin cambios funcionales (equipo Batch)</span>
            </li>
          </ul>
        </Panel>
      </div>
    </AppShell>
  );
}
