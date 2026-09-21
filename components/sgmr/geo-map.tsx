"use client";

// Mapa esquemático de Lima y Callao (sin cartografía externa: el prototipo no usa servicios
// de mapas). Proyecta coordenadas reales de activos, centrales y cuadrillas sobre un lienzo SVG.
import React from "react";
import type { ToneName } from "./ui";

export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  label?: string;
  tone: ToneName;
  kind?: "activo" | "central" | "cuadrilla";
}

export interface MapLine {
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
  tone?: ToneName;
  dashed?: boolean;
}

const HEX: Record<ToneName, string> = {
  ok: "#16A36F",
  warn: "#E9A800",
  crit: "#E0362B",
  info: "#2F7BEA",
  neutral: "#7C8891",
  brand: "#5BC500",
  teal: "#00A3B4",
};

const B = { latN: -11.84, latS: -12.235, lngW: -77.175, lngE: -76.915 };
const W = 640;
const H = 520;

export function proyectar(lat: number, lng: number) {
  const x = ((lng - B.lngW) / (B.lngE - B.lngW)) * W;
  const y = ((B.latN - lat) / (B.latN - B.latS)) * H;
  return { x, y };
}

// Línea de costa aproximada (de norte a sur) para dar contexto geográfico.
const COSTA: [number, number][] = [
  [-11.84, -77.155],
  [-11.9, -77.15],
  [-11.96, -77.145],
  [-12.02, -77.14],
  [-12.05, -77.162],
  [-12.075, -77.17],
  [-12.07, -77.12],
  [-12.1, -77.058],
  [-12.13, -77.035],
  [-12.165, -77.03],
  [-12.19, -77.01],
  [-12.235, -76.975],
];

const ZONAS_ROTULO: { t: string; lat: number; lng: number }[] = [
  { t: "LIMA NORTE", lat: -11.9, lng: -77.04 },
  { t: "LIMA CENTRO", lat: -12.075, lng: -77.015 },
  { t: "LIMA ESTE", lat: -12.01, lng: -76.95 },
  { t: "LIMA SUR", lat: -12.19, lng: -76.965 },
  { t: "CALLAO", lat: -12.02, lng: -77.115 },
];

export function GeoMap({
  points,
  lines = [],
  selected,
  onSelect,
  height = 420,
  showLabels = "selected",
  leyenda,
}: {
  points: MapPoint[];
  lines?: MapLine[];
  selected?: string | null;
  onSelect?: (id: string) => void;
  height?: number;
  showLabels?: "all" | "selected" | "none";
  leyenda?: React.ReactNode;
}) {
  const costa = COSTA.map(([la, lo]) => proyectar(la, lo));
  const mar = `M0,0 L${costa.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L")} L0,${H} Z`;
  const orden = [...points].sort((a, b) => (a.id === selected ? 1 : b.id === selected ? -1 : 0));

  return (
    <div className="overflow-hidden rounded-lg border border-mv-line bg-[#FBFCFC]">
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" style={{ height }} preserveAspectRatio="xMidYMid meet" role="img" aria-label="Mapa esquemático de la red">
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#EDF0F2" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#grid)" />
        <path d={mar} fill="#EAF4F8" stroke="#CFE3EA" strokeWidth="1.5" />
        <text x={18} y={H - 24} fontSize="11" fill="#8FB3C1" fontStyle="italic">
          Océano Pacífico
        </text>
        {ZONAS_ROTULO.map((z) => {
          const p = proyectar(z.lat, z.lng);
          return (
            <text key={z.t} x={p.x} y={p.y} fontSize="10" fontWeight="700" letterSpacing="1.5" fill="#C3CBD1" textAnchor="middle">
              {z.t}
            </text>
          );
        })}
        {lines.map((l, i) => {
          const a = proyectar(l.from.lat, l.from.lng);
          const b = proyectar(l.to.lat, l.to.lng);
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={HEX[l.tone ?? "neutral"]}
              strokeWidth={1.6}
              strokeDasharray={l.dashed ? "5 4" : undefined}
              opacity={0.8}
            />
          );
        })}
        {orden.map((p) => {
          const { x, y } = proyectar(p.lat, p.lng);
          const sel = p.id === selected;
          const color = HEX[p.tone];
          const mostrarRotulo = showLabels === "all" || (showLabels === "selected" && sel);
          return (
            <g
              key={p.id}
              transform={`translate(${x.toFixed(1)},${y.toFixed(1)})`}
              onClick={() => onSelect?.(p.id)}
              className={onSelect ? "cursor-pointer" : undefined}
            >
              <title>{p.label ?? p.id}</title>
              {sel && <circle r={14} fill={color} opacity={0.18} />}
              {p.kind === "cuadrilla" ? (
                <rect x={-6} y={-6} width={12} height={12} rx={2.5} fill="#fff" stroke={color} strokeWidth={sel ? 3 : 2.2} transform="rotate(45)" />
              ) : p.kind === "central" ? (
                <rect x={-6.5} y={-6.5} width={13} height={13} rx={2} fill={color} stroke="#fff" strokeWidth={2} />
              ) : (
                <circle r={sel ? 6.5 : 5} fill={color} stroke="#fff" strokeWidth={2} />
              )}
              {mostrarRotulo && (
                <g>
                  <rect
                    x={10}
                    y={-10}
                    rx={3}
                    height={18}
                    width={Math.max(40, (p.label ?? p.id).length * 6.2 + 10)}
                    fill="#fff"
                    stroke="#CFD6DB"
                  />
                  <text x={15} y={3} fontSize="10.5" fontWeight={600} fill="#1F2A30">
                    {p.label ?? p.id}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-mv-line bg-white px-3 py-2 text-[11px] text-mv-ink-2">
        <div className="flex flex-wrap items-center gap-3">{leyenda}</div>
        <span className="text-mv-muted">Vista esquemática · coordenadas WGS-84</span>
      </div>
    </div>
  );
}

export function LeyendaItem({ tone, label, shape = "dot" }: { tone: ToneName; label: string; shape?: "dot" | "diamond" | "square" }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className={shape === "diamond" ? "h-2.5 w-2.5 rotate-45 rounded-[2px] border-2 bg-white" : shape === "square" ? "h-2.5 w-2.5 rounded-[2px]" : "h-2.5 w-2.5 rounded-full"}
        style={shape === "diamond" ? { borderColor: HEX[tone] } : { background: HEX[tone] }}
      />
      {label}
    </span>
  );
}
