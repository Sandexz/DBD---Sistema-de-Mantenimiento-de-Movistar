"use client";

import React, { useState } from "react";
import {
  MapPin,
  Layers,
  Radio,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Compass,
  Wifi,
  Navigation,
} from "lucide-react";
import { Badge } from "./ui/badge";

interface MapNode {
  id: string;
  name: string;
  type: "POP" | "NAP" | "SUBESTACION" | "REPETIDOR";
  x: number;
  y: number;
  status: "OK" | "CRITICAL" | "WARNING";
  region: string;
  clients: number;
  dbm: string;
}

const mockNodes: MapNode[] = [
  { id: "POP-01", name: "POP Central Matriz", type: "POP", x: 280, y: 190, status: "OK", region: "Centro", clients: 12400, dbm: "-18.2 dBm" },
  { id: "POP-02", name: "POP Norte Industrial", type: "POP", x: 190, y: 80, status: "CRITICAL", region: "Norte", clients: 4200, dbm: "-29.8 dBm (Falla)" },
  { id: "POP-03", name: "POP Sur Metropolitano", type: "POP", x: 420, y: 260, status: "OK", region: "Sur", clients: 6800, dbm: "-19.1 dBm" },
  { id: "NAP-104", name: "Caja NAP San Isidro", type: "NAP", x: 330, y: 130, status: "OK", region: "Centro", clients: 64, dbm: "-20.4 dBm" },
  { id: "NAP-204", name: "Caja NAP Panamericana", type: "NAP", x: 140, y: 130, status: "WARNING", region: "Norte", clients: 32, dbm: "-27.1 dBm" },
  { id: "REP-09", name: "Repetidor Cerro San Cristóbal", type: "REPETIDOR", x: 480, y: 90, status: "OK", region: "Este", clients: 1800, dbm: "-17.5 dBm" },
  { id: "SUB-02", name: "Subestación Chorrillos", type: "SUBESTACION", x: 360, y: 310, status: "OK", region: "Sur", clients: 3100, dbm: "-19.0 dBm" },
];

export function MapPlaceholder() {
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(mockNodes[1]);
  const [layer, setLayer] = useState<"all" | "alerts">("all");

  return (
    <div className="relative w-full rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-card-clean">
      {/* Map Control Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-[#5BC500] animate-pulse" />
          <span className="font-grotesk font-bold text-slate-900">
            Topología Geo-Referenciada NOC Movistar
          </span>
          <span className="font-mono text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 hidden sm:inline-block">
            GPS WGS-84 / 12.0464° S, 77.0428° W
          </span>
        </div>

        {/* Layer selector */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setLayer("all")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors ${
              layer === "all"
                ? "bg-[#5BC500] text-white font-bold"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Todos los Nodos
          </button>
          <button
            onClick={() => setLayer("alerts")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors ${
              layer === "alerts"
                ? "bg-rose-600 text-white font-bold"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Solo Alertas
          </button>
        </div>
      </div>

      {/* SVG Canvas Map Container */}
      <div className="relative h-[340px] sm:h-[380px] w-full bg-[#071828] overflow-hidden flex items-center justify-center">
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#019DF4 1px, transparent 1px), linear-gradient(to right, #1E293B 1px, transparent 1px), linear-gradient(to bottom, #1E293B 1px, transparent 1px)`,
            backgroundSize: "24px 24px, 48px 48px, 48px 48px",
          }}
        />

        {/* Simulated Radar Scanner Effect */}
        <div className="absolute w-[600px] h-[600px] rounded-full border border-sky-500/10 pointer-events-none flex items-center justify-center">
          <div className="w-[400px] h-[400px] rounded-full border border-sky-500/15 flex items-center justify-center">
            <div className="w-[200px] h-[200px] rounded-full border border-sky-500/20" />
          </div>
          <div
            className="absolute inset-0 origin-center animate-radar pointer-events-none"
            style={{
              background:
                "conic-gradient(from 0deg at 50% 50%, rgba(91, 197, 0, 0.15) 0deg, transparent 60deg, transparent 360deg)",
            }}
          />
        </div>

        {/* SVG Fiber Lines and Topology Links */}
        <svg
          viewBox="0 0 600 380"
          className="w-full h-full absolute inset-0 select-none"
        >
          {/* Fiber trunk lines */}
          <line
            x1="280"
            y1="190"
            x2="190"
            y2="80"
            stroke="#EF4444"
            strokeWidth="3"
            strokeDasharray="6 4"
            className="animate-pulse"
          />
          <line
            x1="280"
            y1="190"
            x2="420"
            y2="260"
            stroke="#5BC500"
            strokeWidth="2.5"
            opacity="0.8"
          />
          <line
            x1="280"
            y1="190"
            x2="330"
            y2="130"
            stroke="#019DF4"
            strokeWidth="2"
            opacity="0.7"
          />
          <line
            x1="190"
            y1="80"
            x2="140"
            y2="130"
            stroke="#F59E0B"
            strokeWidth="2"
            opacity="0.6"
          />
          <line
            x1="280"
            y1="190"
            x2="480"
            y2="90"
            stroke="#5BC500"
            strokeWidth="2"
            opacity="0.7"
          />
          <line
            x1="420"
            y1="260"
            x2="360"
            y2="310"
            stroke="#019DF4"
            strokeWidth="2"
            opacity="0.8"
          />

          {/* Critical Fiber Cut Indicator */}
          <g transform="translate(235, 135)">
            <circle r="14" fill="#EF4444" fillOpacity="0.25" className="animate-ping" />
            <circle r="8" fill="#EF4444" fillOpacity="0.9" />
            <text
              x="12"
              y="4"
              fill="#F87171"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
            >
              CORTE 48FO (Km 18.5)
            </text>
          </g>

          {/* Interactive Node Anchors */}
          {mockNodes.map((node) => {
            if (layer === "alerts" && node.status === "OK") return null;

            const isSelected = selectedNode?.id === node.id;
            const isCrit = node.status === "CRITICAL";
            const isWarn = node.status === "WARNING";

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer group"
              >
                {/* Glow ring */}
                <circle
                  r={isSelected ? "14" : "10"}
                  fill={isCrit ? "#EF4444" : isWarn ? "#F59E0B" : "#5BC500"}
                  fillOpacity={isSelected ? "0.4" : "0.2"}
                  className="transition-all duration-200"
                />
                {/* Core node dot */}
                <circle
                  r={isSelected ? "6" : "5"}
                  fill={isCrit ? "#EF4444" : isWarn ? "#F59E0B" : "#5BC500"}
                  stroke="#071828"
                  strokeWidth="2"
                />
                {/* Node Label */}
                <text
                  x="10"
                  y="4"
                  fill={isSelected ? "#FFFFFF" : "#94A3B8"}
                  fontSize="10"
                  fontWeight={isSelected ? "bold" : "normal"}
                  fontFamily="monospace"
                  className="select-none group-hover:fill-white"
                >
                  {node.id}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Overlay Node Detail Card */}
        {selectedNode && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-80 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-3.5 shadow-xl z-20 text-xs text-slate-800">
            <div className="flex items-start justify-between gap-2 border-b border-slate-150 pb-2 mb-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 font-grotesk">
                    {selectedNode.name}
                  </span>
                  <Badge
                    variant={selectedNode.status === "CRITICAL" ? "red" : selectedNode.status === "WARNING" ? "yellow" : "green"}
                    size="sm"
                  >
                    {selectedNode.status}
                  </Badge>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  ID: {selectedNode.id} · Zona {selectedNode.region}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 block">Potencia Óptica:</span>
                <span
                  className={`font-mono font-bold ${
                    selectedNode.status === "CRITICAL"
                      ? "text-rose-600"
                      : "text-[#0070B8]"
                  }`}
                >
                  {selectedNode.dbm}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Clientes en Segmento:</span>
                <span className="font-mono text-slate-900 font-semibold">
                  {selectedNode.clients.toLocaleString()} activos
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Map Compass */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 pointer-events-none">
          <div className="bg-slate-900/80 border border-slate-700 px-2 py-1 rounded text-[10px] font-mono text-slate-300 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-[#5BC500]" />
            <span>N 0°00&apos;</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono text-slate-400">
            Escala: 1:50,000 OSP
          </div>
        </div>
      </div>

      {/* Legend Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-600">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#5BC500]" />
            Troncal Operativa
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            Corte FO / Alerta Crítica
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#019DF4]" />
            Nodo POP Principal
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Telemetría OTDR en vivo · Red Movistar
        </span>
      </div>
    </div>
  );
}
