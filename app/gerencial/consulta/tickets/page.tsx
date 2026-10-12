"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Clock,
  MapPin,
  CheckCircle2,
  HardHat,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  Layers,
  Radio,
  FileText,
  Truck,
  Wrench,
  Lock,
  X,
  Copy,
  Kanban,
  LayoutList,
  Activity,
  Check,
  Flame,
  Globe,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import initialOts from "@/mock-data/ots.json";

// Ciclo de vida formal de 7 etapas arquitectónicas (Ruta operativa)
const cicloVidaEtapas = [
  { id: "Detectado", label: "Detectado", icon: Radio, stepNumber: 1, color: "text-amber-700 bg-amber-50 border-amber-300" },
  { id: "Registrado", label: "Registrado", icon: FileText, stepNumber: 2, color: "text-blue-700 bg-blue-50 border-blue-300" },
  { id: "Asignado", label: "Asignado", icon: HardHat, stepNumber: 3, color: "text-indigo-700 bg-indigo-50 border-indigo-300" },
  { id: "En ruta", label: "En ruta", icon: Truck, stepNumber: 4, color: "text-sky-700 bg-sky-50 border-sky-300" },
  { id: "En atención", label: "En atención", icon: Wrench, stepNumber: 5, color: "text-orange-700 bg-orange-50 border-orange-300" },
  { id: "Solucionado", label: "Solucionado", icon: CheckCircle2, stepNumber: 6, color: "text-emerald-700 bg-emerald-50 border-emerald-300" },
  { id: "Cerrado", label: "Cerrado", icon: Lock, stepNumber: 7, color: "text-slate-700 bg-slate-100 border-slate-300" },
];

export default function TicketsConsultaPage() {
  const [tickets] = useState(initialOts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterZona, setFilterZona] = useState("TODAS");
  const [filterTipo, setFilterTipo] = useState("TODOS");
  const [filterCriticidad, setFilterCriticidad] = useState("TODAS");
  const [filterEtapa, setFilterEtapa] = useState("TODAS");
  const [viewMode, setViewMode] = useState<"table" | "pipeline">("table");
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showRutas, setShowRutas] = useState(false);

  // Mapeo seguro de estados al índice 0..6
  const getStepIndex = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("cerrad")) return 6;
    if (s.includes("solucion") || (s.includes("pend") && s.includes("cierre"))) return 5;
    if (s.includes("atenci") || s.includes("ejecu")) return 4;
    if (s.includes("ruta")) return 3;
    if (s.includes("asigna")) return 2;
    if (s.includes("regist")) return 1;
    return 0; // Detectado por defecto
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 450);
  };

  const handleCopyId = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Conteo de tickets por etapa
  const etapaCounts = useMemo(() => {
    const counts: Record<string, number> = { TODAS: tickets.length };
    cicloVidaEtapas.forEach((et) => {
      counts[et.id] = 0;
    });
    tickets.forEach((t) => {
      const idx = getStepIndex(t.status);
      const etapaKey = cicloVidaEtapas[idx]?.id;
      if (etapaKey) {
        counts[etapaKey] = (counts[etapaKey] || 0) + 1;
      }
    });
    return counts;
  }, [tickets]);

  // Cuadros informativos de resumen
  const stats = useMemo(() => {
    const total = tickets.length;
    const criticos = tickets.filter(
      (t) => t.criticality === "CRÍTICA" || t.criticality === "ALTA"
    ).length;
    const enCampo = tickets.filter((t) => {
      const idx = getStepIndex(t.status);
      return idx === 3 || idx === 4; // En ruta o En atención
    }).length;
    const cerrados = tickets.filter((t) => {
      const idx = getStepIndex(t.status);
      return idx === 5 || idx === 6; // Solucionado o Cerrado
    }).length;

    return { total, criticos, enCampo, cerrados };
  }, [tickets]);

  // Filtrado reactivo
  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.activo.toLowerCase().includes(q) ||
        t.infra.toLowerCase().includes(q) ||
        t.crew.toLowerCase().includes(q) ||
        (t.ubicacion && t.ubicacion.toLowerCase().includes(q));

      const matchZona = filterZona === "TODAS" || t.zona === filterZona;
      const matchTipo = filterTipo === "TODOS" || t.tipo === filterTipo;
      const matchCrit = filterCriticidad === "TODAS" || t.criticality === filterCriticidad;

      const stepIdx = getStepIndex(t.status);
      const etapaActual = cicloVidaEtapas[stepIdx]?.id;
      const matchEtapa = filterEtapa === "TODAS" || etapaActual === filterEtapa;

      return matchSearch && matchZona && matchTipo && matchCrit && matchEtapa;
    });
  }, [tickets, searchTerm, filterZona, filterTipo, filterCriticidad, filterEtapa]);

  const hasActiveFilters =
    searchTerm !== "" ||
    filterZona !== "TODAS" ||
    filterTipo !== "TODOS" ||
    filterCriticidad !== "TODAS" ||
    filterEtapa !== "TODAS";

  const clearFilters = () => {
    setSearchTerm("");
    setFilterZona("TODAS");
    setFilterTipo("TODOS");
    setFilterCriticidad("TODAS");
    setFilterEtapa("TODAS");
  };

  return (
    <div className="w-full space-y-4 font-sans min-w-0">
      {/* ==================== 1. ENCABEZADO ==================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold font-grotesk tracking-tight text-slate-900">
            Estado de Tickets e Incidencias en Red
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-normal mt-0.5">
            Supervisión integral de ciclo de vida, cumplimiento SLA y despliegue de cuadrillas Movistar
          </p>
        </div>

        {/* Acciones y Desplegables: Botones para 4 Cuadros y Ruta, Switch Vista Tabla/Rutas, Refrescar */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
          {/* Botón 1: Desplegar 4 Cuadros (Métricas) */}
          <button
            type="button"
            onClick={() => setShowStats(!showStats)}
            title={showStats ? "Ocultar 4 cuadros de métricas" : "Desplegar 4 cuadros de métricas"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-2xs active:scale-95 ${
              showStats
                ? "bg-[#019DF4] text-white border-[#019DF4] shadow-xs"
                : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200 hover:border-slate-300"
            }`}
          >
            <Layers className={`w-3.5 h-3.5 ${showStats ? "text-white" : "text-[#019DF4]"}`} />
            <span>Ver 4 Cuadros</span>
            {showStats ? (
              <ChevronUp className="w-3.5 h-3.5 opacity-80" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            )}
          </button>

          {/* Botón 2: Desplegar Ruta (7 Etapas) */}
          <button
            type="button"
            onClick={() => setShowRutas(!showRutas)}
            title={showRutas ? "Ocultar ruta de 7 etapas" : "Desplegar ruta de 7 etapas"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-2xs active:scale-95 ${
              showRutas
                ? "bg-[#019DF4] text-white border-[#019DF4] shadow-xs"
                : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200 hover:border-slate-300"
            }`}
          >
            <Activity className={`w-3.5 h-3.5 ${showRutas ? "text-white" : "text-[#5BC500]"}`} />
            <span>Ver Ruta</span>
            {filterEtapa !== "TODAS" && (
              <span className="w-2 h-2 rounded-full bg-amber-400 ring-2 ring-white" title={`Filtro activo: ${filterEtapa}`} />
            )}
            {showRutas ? (
              <ChevronUp className="w-3.5 h-3.5 opacity-80" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            )}
          </button>

          {/* Switch Vista Tabla / Vista Ruta */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-white text-[#0B2742] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Tabla</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("pipeline")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "pipeline"
                  ? "bg-white text-[#019DF4] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Rutas (7 Etapas)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            title="Sincronizar telemetría"
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <RefreshCw
              className={`w-4 h-4 text-[#019DF4] ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* ==================== 2. CUADROS DE INFORMACIÓN (MÉTRICAS RESUMEN - DESPLEGABLE) ==================== */}
      {showStats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 transition-all">
          {/* Total */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-shadow flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Tickets
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl sm:text-2xl font-extrabold font-grotesk text-slate-900">
                  {stats.total}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">activos</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#E5F4FD] flex items-center justify-center text-[#019DF4] shrink-0">
              <Layers className="w-4 h-4" />
            </div>
          </div>

          {/* Críticos */}
          <div className="bg-white border border-rose-200 rounded-xl p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-shadow flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">
                Urgentes (P1/P2)
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl sm:text-2xl font-extrabold font-grotesk text-rose-600">
                  {stats.criticos}
                </span>
                <span className="text-[11px] text-rose-500 font-semibold">SLA Prioritario</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
              <Flame className="w-4 h-4" />
            </div>
          </div>

          {/* En Ruta / Campo */}
          <div className="bg-white border border-orange-200 rounded-xl p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-shadow flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-orange-700 uppercase tracking-wider block">
                En Ruta / Campo
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl sm:text-2xl font-extrabold font-grotesk text-slate-900">
                  {stats.enCampo}
                </span>
                <span className="text-[11px] text-orange-600 font-semibold">desplegados</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
              <Truck className="w-4 h-4" />
            </div>
          </div>

          {/* Solucionados */}
          <div className="bg-white border border-emerald-200 rounded-xl p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-shadow flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                Resueltos / Cerrados
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl sm:text-2xl font-extrabold font-grotesk text-slate-900">
                  {stats.cerrados}
                </span>
                <span className="text-[11px] text-emerald-600 font-bold">
                  ({Math.round((stats.cerrados / (stats.total || 1)) * 100)}%)
                </span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-[#5BC500] shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* ==================== 3. RUTAS OPERATIVAS (7 ETAPAS DEL CICLO DE VIDA - DESPLEGABLE) ==================== */}
      {showRutas && (
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs space-y-2.5 transition-all">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#019DF4]" />
              <span className="font-grotesk font-bold text-slate-800 text-xs">
                Ruta del Ciclo de Vida Operacional (7 Etapas)
              </span>
            </div>
            {filterEtapa !== "TODAS" && (
              <button
                onClick={() => setFilterEtapa("TODAS")}
                className="text-[11px] text-[#019DF4] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Ver todas las etapas</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Stepper interactivo de etapas (compacto y ajustado horizontalmente) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {/* Todas */}
            <button
              type="button"
              onClick={() => setFilterEtapa("TODAS")}
              className={`px-2.5 py-1.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                filterEtapa === "TODAS"
                  ? "bg-[#0B2742] text-white border-[#0B2742] shadow-xs"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              <span className="text-xs font-bold truncate">Todas</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  filterEtapa === "TODAS" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-800"
                }`}
              >
                {etapaCounts["TODAS"]}
              </span>
            </button>

            {/* 7 Etapas */}
            {cicloVidaEtapas.map((et) => {
              const Icon = et.icon;
              const count = etapaCounts[et.id] || 0;
              const isSelected = filterEtapa === et.id;

              return (
                <button
                  key={et.id}
                  type="button"
                  onClick={() => setFilterEtapa(isSelected ? "TODAS" : et.id)}
                  className={`px-2 py-1.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? "bg-[#019DF4] text-white border-[#019DF4] shadow-xs"
                      : "bg-white hover:bg-slate-50 text-slate-800 border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-white" : "text-[#019DF4]"}`} />
                    <span className="text-xs font-bold truncate">{et.label}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ml-1 ${
                      isSelected
                        ? "bg-white/25 text-white"
                        : count > 0
                        ? "bg-[#E5F4FD] text-[#0070B8]"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== 4. BUSCADOR Y FILTROS LLAMATIVOS E INTUITIVOS ==================== */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs space-y-3">
        {/* Barra superior: Buscador + Filtros de Tipo, Zona y Prioridad */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Input Buscador */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por ID (OT-...), nodo, dirección, cuadrilla..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#019DF4] rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Grupo de Filtros Llamativos */}
          <div className="flex flex-wrap items-center gap-2">
            {/* FILTRO TIPO: Muy llamativo con iconos y colores distintivos */}
            <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase px-1.5">Tipo:</span>
              <button
                type="button"
                onClick={() => setFilterTipo("TODOS")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterTipo === "TODOS"
                    ? "bg-[#0B2742] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setFilterTipo("CORRECTIVO")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  filterTipo === "CORRECTIVO"
                    ? "bg-amber-500 text-white shadow-sm ring-2 ring-amber-300"
                    : "text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200"
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                <span>Correctivo</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterTipo("PREVENTIVO")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  filterTipo === "PREVENTIVO"
                    ? "bg-[#5BC500] text-white shadow-sm ring-2 ring-emerald-300"
                    : "text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
                }`}
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Preventivo</span>
              </button>
            </div>

            {/* FILTRO ZONA: Llamativo con pines geográficos */}
            <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase px-1.5 flex items-center gap-0.5">
                <Globe className="w-3 h-3 text-slate-400" />
                <span>Zona:</span>
              </span>
              {["TODAS", "Norte", "Centro", "Sur", "Este"].map((z) => {
                const isSelected = filterZona === z;
                return (
                  <button
                    key={z}
                    type="button"
                    onClick={() => setFilterZona(z)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#019DF4] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                    }`}
                  >
                    {z}
                  </button>
                );
              })}
            </div>

            {/* FILTRO PRIORIDAD / CRITICIDAD: Semáforo llamativo e intuitivo */}
            <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase px-1.5">SLA:</span>
              <button
                type="button"
                onClick={() => setFilterCriticidad("TODAS")}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterCriticidad === "TODAS"
                    ? "bg-[#0B2742] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Todas
              </button>
              <button
                type="button"
                onClick={() => setFilterCriticidad("CRÍTICA")}
                title="P1 - Prioridad Crítica"
                className={`px-2 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-0.5 ${
                  filterCriticidad === "CRÍTICA"
                    ? "bg-rose-600 text-white shadow-sm ring-2 ring-rose-300"
                    : "text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200"
                }`}
              >
                <Flame className="w-3 h-3" />
                <span>Crítica (P1)</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterCriticidad("ALTA")}
                title="P2 - Prioridad Alta"
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterCriticidad === "ALTA"
                    ? "bg-orange-500 text-white shadow-sm ring-2 ring-orange-300"
                    : "text-orange-800 bg-orange-50 hover:bg-orange-100 border border-orange-200"
                }`}
              >
                Alta (P2)
              </button>
              <button
                type="button"
                onClick={() => setFilterCriticidad("MEDIA")}
                title="P3 - Prioridad Media"
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterCriticidad === "MEDIA"
                    ? "bg-sky-600 text-white shadow-sm"
                    : "text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200"
                }`}
              >
                Media (P3)
              </button>
              <button
                type="button"
                onClick={() => setFilterCriticidad("BAJA")}
                title="P4 - Prioridad Baja"
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterCriticidad === "BAJA"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
                }`}
              >
                Baja (P4)
              </button>
            </div>
          </div>
        </div>

        {/* Resumen de estado de filtros */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-150">
          <span className="text-slate-600">
            Mostrando <strong className="text-slate-900 font-bold">{filtered.length}</strong> de{" "}
            <strong className="text-slate-900 font-bold">{tickets.length}</strong> tickets
            {filterEtapa !== "TODAS" && (
              <span className="ml-1 text-slate-500">
                · Etapa: <strong className="text-[#019DF4]">{filterEtapa}</strong>
              </span>
            )}
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* ==================== 5. VISTA TABLA / VISTA TABLERO (AJUSTE AL 100% DE VISTA) ==================== */}
      {viewMode === "table" ? (
        /* VISTA TABLA: Perfectamente ajustada para pantalla al 100% */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs w-full">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Search className="w-9 h-9 text-slate-300 mx-auto" />
              <p className="font-grotesk font-bold text-sm text-slate-800">
                No hay tickets que coincidan con los filtros seleccionados
              </p>
              <Button variant="outline" size="sm" onClick={clearFilters} className="mt-1">
                Restablecer filtros
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold font-grotesk uppercase text-slate-600">
                    <th className="py-3 px-4 w-[130px]">Ticket / Tipo</th>
                    <th className="py-3 px-4 min-w-[220px]">Activo & Infraestructura</th>
                    <th className="py-3 px-4 w-[100px]">Zona</th>
                    <th className="py-3 px-4 w-[135px]">SLA & Prioridad</th>
                    <th className="py-3 px-4 min-w-[190px]">Cuadrilla Asignada</th>
                    <th className="py-3 px-4 min-w-[200px]">Ruta del Ciclo (7 Etapas)</th>
                    <th className="py-3 px-4 w-[95px] text-right">Detalle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((t) => {
                    const isPreventivo = t.tipo === "PREVENTIVO";
                    const isCritica = t.criticality === "CRÍTICA";
                    const stepIdx = getStepIndex(t.status);
                    const etapaInfo = cicloVidaEtapas[stepIdx];

                    return (
                      <tr
                        key={t.id}
                        onClick={() => setSelectedTicket(t)}
                        className="hover:bg-slate-50/90 transition-colors cursor-pointer group"
                      >
                        {/* 1. Ticket / Tipo */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-extrabold text-xs text-slate-900 group-hover:text-[#019DF4] transition-colors">
                              {t.id}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleCopyId(t.id, e)}
                              title="Copiar código"
                              className="text-slate-300 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                            >
                              {copiedId === t.id ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          <div className="mt-1">
                            <span
                              className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                                isPreventivo
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  : "bg-amber-100 text-amber-800 border border-amber-200"
                              }`}
                            >
                              {t.tipo}
                            </span>
                          </div>
                        </td>

                        {/* 2. Activo & Infraestructura */}
                        <td className="py-3 px-4">
                          <strong className="text-slate-900 font-bold text-xs block group-hover:text-[#0070B8] transition-colors leading-snug">
                            {t.activo}
                          </strong>
                          <span className="text-[11px] text-slate-500 block mt-0.5 leading-tight">
                            {t.infra}
                          </span>
                        </td>

                        {/* 3. Zona */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 inline-block">
                            Zona {t.zona}
                          </span>
                        </td>

                        {/* 4. SLA & Prioridad */}
                        <td className="py-3 px-4 whitespace-nowrap font-mono">
                          <div className="flex items-center gap-1 text-slate-800">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span className="font-bold text-xs">{t.slaHours}</span>
                          </div>
                          <div className="mt-1">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                isCritica
                                  ? "bg-rose-100 text-rose-700 border border-rose-300 font-extrabold"
                                  : t.criticality === "ALTA"
                                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {t.criticality}
                            </span>
                          </div>
                        </td>

                        {/* 5. Cuadrilla */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <HardHat className="w-3.5 h-3.5 text-[#019DF4] shrink-0" />
                            <span className="text-xs font-semibold text-slate-800">
                              {t.crew}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono block pl-5 mt-0.5">
                            {t.coordinates}
                          </span>
                        </td>

                        {/* 6. Ruta del Ciclo de Vida */}
                        <td className="py-3 px-4 min-w-[200px]">
                          <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                            <span className="text-slate-500 font-mono">Paso {stepIdx + 1}/7</span>
                            <span
                              className={`px-1.5 py-0.2 rounded font-bold text-[10px] border ${
                                etapaInfo ? etapaInfo.color : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {etapaInfo?.label || t.status}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                            <div
                              className="bg-[#019DF4] h-full rounded-full transition-all"
                              style={{ width: `${((stepIdx + 1) / 7) * 100}%` }}
                            />
                          </div>
                        </td>

                        {/* 7. Acción */}
                        <td className="py-3 px-4 whitespace-nowrap text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTicket(t);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#E5F4FD] hover:bg-[#019DF4] text-[#0070B8] hover:text-white rounded-lg font-bold text-xs transition-all cursor-pointer shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Auditar</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* VISTA PIPELINE (Tablero de Rutas Operativas) */
        <div className="space-y-2">
          <p className="text-xs text-slate-500">
            Vista secuencial de las 7 rutas operacionales. Haz clic en cualquier tarjeta para abrir la auditoría técnica.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2.5 overflow-x-auto pb-4">
            {cicloVidaEtapas.map((et, idx) => {
              const Icon = et.icon;
              const columnTickets = filtered.filter(
                (t) => getStepIndex(t.status) === idx
              );

              return (
                <div
                  key={et.id}
                  className="bg-slate-50/90 border border-slate-200 rounded-xl p-2.5 flex flex-col min-w-[210px] shadow-2xs"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-700">
                        {idx + 1}
                      </span>
                      <Icon className="w-3.5 h-3.5 text-slate-700" />
                      <span className="font-grotesk font-bold text-xs text-slate-900 truncate">
                        {et.label}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-white border border-slate-200 text-slate-800">
                      {columnTickets.length}
                    </span>
                  </div>

                  <div className="space-y-2 flex-1 overflow-y-auto max-h-[500px] pr-0.5">
                    {columnTickets.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs italic">
                        Sin tickets
                      </div>
                    ) : (
                      columnTickets.map((t) => {
                        const isCrit = t.criticality === "CRÍTICA";
                        const isPrev = t.tipo === "PREVENTIVO";

                        return (
                          <div
                            key={t.id}
                            onClick={() => setSelectedTicket(t)}
                            className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#019DF4]/60 rounded-lg p-2.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer group space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-xs text-slate-900 group-hover:text-[#019DF4] transition-colors">
                                {t.id}
                              </span>
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                  isCrit
                                    ? "bg-rose-100 text-rose-700"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {t.criticality}
                              </span>
                            </div>

                            <div>
                              <strong className="text-xs text-slate-900 font-bold block truncate">
                                {t.activo}
                              </strong>
                              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                {t.infra}
                              </p>
                            </div>

                            <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-600 font-medium">
                              <span
                                className={`px-1.5 py-0.2 rounded font-bold ${
                                  isPrev
                                    ? "bg-emerald-50 text-emerald-800"
                                    : "bg-amber-50 text-amber-800"
                                }`}
                              >
                                {t.tipo}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {t.slaHours}
                              </span>
                            </div>

                            <p className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                              <HardHat className="w-3 h-3 text-[#019DF4] shrink-0" />
                              <span className="truncate">{t.crew}</span>
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== 6. MODAL DE AUDITORÍA ==================== */}
      {selectedTicket && (
        <Modal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          title={`Auditoría Técnica: ${selectedTicket.id}`}
          subtitle={`Activo: ${selectedTicket.activo} · ${selectedTicket.infra}`}
          maxWidth="2xl"
          footer={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedTicket(null)}
              className="px-4 py-1.5 font-bold cursor-pointer"
            >
              Cerrar Consulta
            </Button>
          }
        >
          <div className="space-y-3.5 text-xs font-sans">
            {/* Header del Ticket */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-2">
                <Badge
                  variant={selectedTicket.tipo === "PREVENTIVO" ? "movistar" : "yellow"}
                  size="sm"
                >
                  {selectedTicket.tipo}
                </Badge>
                <Badge
                  variant={selectedTicket.criticality === "CRÍTICA" ? "red" : "blue"}
                  size="sm"
                >
                  {selectedTicket.criticality} · {selectedTicket.prioridad}
                </Badge>
                <span className="font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs">
                  Zona {selectedTicket.zona}
                </span>
              </div>

              <div className="flex items-center gap-1 text-slate-700 font-mono text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>SLA Máximo: <strong>{selectedTicket.slaHours}</strong></span>
              </div>
            </div>

            {/* Stepper de 7 Etapas */}
            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 font-grotesk text-xs">
                  Ruta del Ciclo de Vida (7 Etapas)
                </h4>
                <span className="text-[11px] font-bold text-[#0070B8] bg-[#E5F4FD] px-2 py-0.5 rounded-full border border-[#B8E2FB]">
                  Paso {getStepIndex(selectedTicket.status) + 1} de 7:{" "}
                  {cicloVidaEtapas[getStepIndex(selectedTicket.status)]?.label}
                </span>
              </div>

              <div className="flex items-center justify-between text-center overflow-x-auto py-1">
                {cicloVidaEtapas.map((etapa, idx) => {
                  const currentIdx = getStepIndex(selectedTicket.status);
                  const isDone = idx < currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={etapa.id} className="flex flex-col items-center min-w-[70px]">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] transition-all ${
                          isDone
                            ? "bg-[#5BC500] text-white"
                            : isCurrent
                            ? "bg-[#019DF4] text-white ring-2 ring-[#019DF4]/30 shadow-xs"
                            : "bg-slate-100 text-slate-400 border border-slate-200"
                        }`}
                      >
                        {isDone ? "✓" : idx + 1}
                      </div>
                      <span
                        className={`text-[10px] mt-1 font-bold leading-tight ${
                          isCurrent
                            ? "text-[#0B2742]"
                            : isDone
                            ? "text-slate-700"
                            : "text-slate-400"
                        }`}
                      >
                        {etapa.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ficha técnica del ticket */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
                <span className="text-slate-500 block text-[10px]">Infraestructura / Nodo:</span>
                <strong className="text-slate-900 block">{selectedTicket.infra}</strong>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
                <span className="text-slate-500 block text-[10px]">Ubicación & Coordenadas:</span>
                <span className="text-slate-900 font-medium block">{selectedTicket.ubicacion}</span>
                <span className="text-slate-500 font-mono text-[10px] block">({selectedTicket.coordinates})</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
                <span className="text-slate-500 block text-[10px]">Cuadrilla Asignada:</span>
                <strong className="text-slate-900 block">{selectedTicket.crew}</strong>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
                <span className="text-slate-500 block text-[10px]">Fecha Programada:</span>
                <span className="text-slate-800 font-medium block">{selectedTicket.fechaProgramada}</span>
              </div>
              <div className="col-span-1 sm:col-span-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
                <span className="text-slate-500 block text-[10px]">Materiales Asignados:</span>
                <span className="text-slate-800 font-medium block">
                  {selectedTicket.materials || "Material estándar de cuadrilla."}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
