"use client";

// Estado compartido del prototipo (sin backend). Mantiene en memoria —y en sessionStorage
// para sobrevivir a recargas— los datos que las transacciones modifican, de modo que un
// ticket registrado pueda convertirse en OT, ejecutarse en campo, cerrarse y verse
// reflejado en consultas y reportes.
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { INICIAL, fmtCoord, prioridadPorCriticidad } from "./data";
import { FECHA_REFERENCIA, HORA_REFERENCIA, diffDays, sumarMinutos } from "./fechas";
import type {
  AtsRegistro,
  Consumo,
  Criticidad,
  Ejecucion,
  EstadoPlan,
  EstadoTicket,
  MantenimientoPeriodo,
  OrdenTrabajo,
  OrigenTicket,
  Rol,
  Ticket,
  TipoMantenimiento,
} from "./types";
import type { LineaDescargo } from "./validaciones";

export type Datos = typeof INICIAL;

export interface Sesion {
  rol: Rol;
  usuario: string;
  codigo: string;
  cargo: string;
  cuadrillaId?: string;
}

export const USUARIOS: Record<Rol, Sesion> = {
  NOC: { rol: "NOC", usuario: "Ing. Luis Valdivia", codigo: "NOC-ADMIN-99", cargo: "Ingeniero NOC · Turno día" },
  SUPERVISOR: {
    rol: "SUPERVISOR",
    usuario: "Ing. Carmen Rivas",
    codigo: "SUP-PLANTA-04",
    cargo: "Supervisora de Mantenimiento",
  },
  TECNICO: {
    rol: "TECNICO",
    usuario: "Luis Ramos",
    codigo: "TEC-CAMPO-ALFA",
    cargo: "Técnico de Campo · Cuadrilla C-01 Alfa",
    cuadrillaId: "C-01",
  },
};

export interface Evento {
  id: number;
  hora: string;
  usuario: string;
  accion: string;
  ref: string;
}

export type Tono = "ok" | "warn" | "crit" | "info";
interface Toast {
  id: number;
  msg: string;
  tono: Tono;
}

export interface NuevoTicket {
  tipo: string;
  activoId: string;
  severidad: Criticidad;
  origen: OrigenTicket;
  descripcion: string;
  cliente: string;
  clientesAfectados: number;
}

export interface NuevaOt {
  tipo: TipoMantenimiento;
  ticketId: string | null;
  planId: string | null;
  activoId: string;
  origin: string;
  criticality: Criticidad;
  slaHours: string;
  cuadrillaId: string | null;
  actividad: string;
  materials?: string;
  cliente?: string;
  fechaProgramada?: string;
  despachar: boolean;
}

interface Ctx {
  hydrated: boolean;
  datos: Datos;
  sesion: Sesion | null;
  ahora: string;
  bitacora: Evento[];
  iniciarSesion: (rol: Rol) => void;
  cerrarSesion: () => void;
  notificar: (msg: string, tono?: Tono) => void;
  mutar: (fn: (d: Datos) => Datos, evento?: { accion: string; ref: string }) => void;
  registrarTicket: (t: NuevoTicket) => Ticket;
  vincularReporte: (ticketId: string) => void;
  crearOt: (o: NuevaOt) => OrdenTrabajo;
  asignarOt: (otId: string, cuadrillaId: string) => void;
  despacharOt: (otId: string) => void;
  registrarCheckIn: (otId: string, c: NonNullable<Ejecucion["checkIn"]>) => void;
  registrarAts: (otId: string, ats: AtsRegistro, valido: boolean) => void;
  guardarEjecucion: (otId: string, patch: Partial<Ejecucion>) => void;
  finalizarEjecucion: (otId: string) => void;
  descargarRepuestos: (otId: string, lineas: LineaDescargo[]) => Consumo[];
  cerrarOt: (otId: string) => string[];
  restablecer: () => void;
}

const SgmrContext = createContext<Ctx | null>(null);

const CLAVE = "sgmr-movistar:v1";
const INICIO_TXT = `${FECHA_REFERENCIA} ${HORA_REFERENCIA}`;

function siguiente(ids: string[], prefijo: string, ancho: number): string {
  const n = ids
    .filter((i) => i.startsWith(prefijo))
    .map((i) => parseInt(i.slice(prefijo.length), 10))
    .filter((x) => !Number.isNaN(x));
  const max = n.length ? Math.max(...n) : 0;
  return `${prefijo}${String(max + 1).padStart(ancho, "0")}`;
}

function etiquetaCuadrilla(d: Datos, id: string | null): string {
  if (!id) return "Sin asignar";
  const c = d.cuadrillas.find((x) => x.id === id);
  if (!c) return id;
  const [nombre, ...ap] = c.lider.split(" ");
  return `${c.id} ${c.nombre} (${nombre.charAt(0)}. ${ap.join(" ")})`;
}

/** Aplica un cambio de estado al ticket registrando la hora en su historial. */
function avanzarTicket(t: Ticket, estado: EstadoTicket, hora: string): Ticket {
  const orden: EstadoTicket[] = ["Detectado", "Registrado", "Asignado", "En ruta", "En atención", "Solucionado", "Cerrado"];
  if (orden.indexOf(estado) <= orden.indexOf(t.estado)) return t;
  const historial = { ...t.historial };
  // completa estados intermedios omitidos para mantener el ciclo de vida íntegro
  for (let i = orden.indexOf(t.estado) + 1; i <= orden.indexOf(estado); i++) {
    if (!historial[orden[i]]) historial[orden[i]] = hora.replace(" ", "T");
  }
  return { ...t, estado, historial };
}

/** Estado de un plan según su fecha programada y la tolerancia (días). */
export function estadoPlanCalculado(fecha: string, toleranciaDias = 7): EstadoPlan {
  const d = diffDays(FECHA_REFERENCIA, fecha);
  if (d > 7) return "Programado";
  if (d > 0) return "Próximo";
  if (-d <= toleranciaDias) return "Pendiente";
  return "Incumplido";
}

/** Seguimiento del período actualizado con los cambios hechos en la sesión. */
export function seguimientoActual(d: Datos): MantenimientoPeriodo[] {
  const base = d.seguimiento.map((m) => {
    if (!m.planId) return m;
    const plan = d.planes.find((p) => p.id === m.planId);
    if (plan?.estado === "Ejecutado" && m.estado !== "Ejecutado") {
      const ot = d.ots.find((o) => o.id === plan.otId);
      return { ...m, estado: "Ejecutado" as const, fechaEjecucion: (ot?.cerradaEn ?? FECHA_REFERENCIA).slice(0, 10) };
    }
    return m;
  });
  // planes registrados en la sesión con fecha dentro del período (jul–sep 2026)
  const nuevos = d.planes
    .filter(
      (p) =>
        p.fechaProgramada >= "2026-07-01" &&
        p.fechaProgramada <= "2026-09-30" &&
        !base.some((m) => m.planId === p.id)
    )
    .map((p): MantenimientoPeriodo => {
      const a = d.activos.find((x) => x.codigo === p.activoId);
      const c = d.cuadrillas.find((x) => x.id === p.cuadrillaId);
      return {
        id: `MNT-${p.id}`,
        planId: p.id,
        activoId: p.activoId,
        centralId: a?.centralId ?? "",
        zonaId: a?.zonaId ?? "",
        contratistaId: c?.contratistaId ?? "",
        cuadrillaId: p.cuadrillaId,
        tipo: p.tipo,
        actividad: p.actividad,
        fechaProgramada: p.fechaProgramada,
        fechaEjecucion: p.estado === "Ejecutado" ? FECHA_REFERENCIA : null,
        estado: p.estado === "Ejecutado" ? "Ejecutado" : p.estado === "Incumplido" ? "Incumplido" : "Pendiente",
      };
    });
  return [...base, ...nuevos];
}

export function SgmrProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [datos, setDatos] = useState<Datos>(INICIAL);
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [bitacora, setBitacora] = useState<Evento[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [ahora, setAhora] = useState(INICIO_TXT);
  const inicioReal = useRef<number>(0);
  const datosRef = useRef(datos);
  datosRef.current = datos;
  const ahoraRef = useRef(ahora);
  ahoraRef.current = ahora;
  const sesionRef = useRef(sesion);
  sesionRef.current = sesion;

  // Hidratación desde sessionStorage (solo en el navegador)
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(CLAVE);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.datos) setDatos({ ...INICIAL, ...s.datos });
        if (s.sesion) setSesion(s.sesion);
        if (Array.isArray(s.bitacora)) setBitacora(s.bitacora);
        inicioReal.current = typeof s.inicioReal === "number" ? s.inicioReal : Date.now();
      } else {
        inicioReal.current = Date.now();
      }
    } catch {
      inicioReal.current = Date.now();
    }
    setHydrated(true);
  }, []);

  // Reloj del sistema: parte de la fecha de referencia y avanza con el tiempo real
  useEffect(() => {
    if (!hydrated) return;
    const tick = () => {
      const min = Math.floor((Date.now() - inicioReal.current) / 60000);
      setAhora(sumarMinutos(INICIO_TXT, Math.max(0, min)));
    };
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, [hydrated]);

  // Persistencia
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.sessionStorage.setItem(
        CLAVE,
        JSON.stringify({ datos, sesion, bitacora, inicioReal: inicioReal.current })
      );
    } catch {
      /* almacenamiento no disponible: se mantiene solo en memoria */
    }
  }, [datos, sesion, bitacora, hydrated]);

  const notificar = useCallback((msg: string, tono: Tono = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-3), { id, msg, tono }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4800);
  }, []);

  const registrar = useCallback((accion: string, ref: string) => {
    setBitacora((b) =>
      [
        {
          id: Date.now() + Math.random(),
          hora: ahoraRef.current,
          usuario: sesionRef.current?.usuario ?? "Sistema",
          accion,
          ref,
        },
        ...b,
      ].slice(0, 60)
    );
  }, []);

  const mutar = useCallback<Ctx["mutar"]>(
    (fn, evento) => {
      const nuevo = fn(datosRef.current);
      datosRef.current = nuevo;
      setDatos(nuevo);
      if (evento) registrar(evento.accion, evento.ref);
    },
    [registrar]
  );

  const iniciarSesion = useCallback((rol: Rol) => {
    setSesion(USUARIOS[rol]);
  }, []);

  const cerrarSesion = useCallback(() => setSesion(null), []);

  // ───────────── Transacciones de dominio
  const registrarTicket = useCallback<Ctx["registrarTicket"]>(
    (t) => {
      const d = datosRef.current;
      const hora = ahoraRef.current;
      const activo = d.activos.find((a) => a.codigo === t.activoId);
      const nuevo: Ticket = {
        id: siguiente(
          d.tickets.map((x) => x.id),
          "TCK-2026-",
          4
        ),
        tipo: t.tipo,
        activoId: t.activoId,
        ubicacion: activo?.direccion ?? "",
        severidad: t.severidad,
        prioridad: prioridadPorCriticidad(t.severidad),
        origen: t.origen,
        descripcion: t.descripcion,
        cliente: t.cliente,
        clientesAfectados: t.clientesAfectados,
        estado: "Registrado",
        otId: null,
        reportesAdicionales: 0,
        historial: { Detectado: hora.replace(" ", "T"), Registrado: hora.replace(" ", "T") },
      };
      mutar((x) => ({ ...x, tickets: [nuevo, ...x.tickets] }), {
        accion: "Registro de ticket",
        ref: nuevo.id,
      });
      return nuevo;
    },
    [mutar]
  );

  const vincularReporte = useCallback<Ctx["vincularReporte"]>(
    (ticketId) => {
      mutar(
        (x) => ({
          ...x,
          tickets: x.tickets.map((t) =>
            t.id === ticketId ? { ...t, reportesAdicionales: t.reportesAdicionales + 1 } : t
          ),
        }),
        { accion: "Reporte vinculado a ticket existente (duplicado evitado)", ref: ticketId }
      );
    },
    [mutar]
  );

  const moverCuadrilla = (
    x: Datos,
    cuadrillaId: string | null,
    cambios: { estado: "Disponible" | "En ruta" | "En sitio" | "En ejecución" | "Finalizado"; otId?: string | null; lat?: number; lng?: number },
    hora: string
  ): Datos => {
    if (!cuadrillaId) return x;
    const existe = x.tracking.some((p) => p.cuadrillaId === cuadrillaId);
    if (existe) {
      return {
        ...x,
        tracking: x.tracking.map((p) =>
          p.cuadrillaId === cuadrillaId
            ? {
                ...p,
                estado: cambios.estado,
                otId: cambios.otId === undefined ? p.otId : cambios.otId,
                lat: cambios.lat ?? p.lat,
                lng: cambios.lng ?? p.lng,
                actualizado: hora.slice(11, 16),
              }
            : p
        ),
      };
    }
    const c = x.cuadrillas.find((q) => q.id === cuadrillaId);
    const central = x.centrales.find((ce) => ce.zonaId === c?.zonaId);
    return {
      ...x,
      tracking: [
        ...x.tracking,
        {
          cuadrillaId,
          tecnico: c?.lider ?? cuadrillaId,
          estado: cambios.estado,
          otId: cambios.otId ?? null,
          lat: cambios.lat ?? (central?.lat ?? -12.05) + 0.004,
          lng: cambios.lng ?? (central?.lng ?? -77.04) - 0.003,
          actualizado: hora.slice(11, 16),
        },
      ],
    };
  };

  const crearOt = useCallback<Ctx["crearOt"]>(
    (o) => {
      const d = datosRef.current;
      const hora = ahoraRef.current;
      const activo = d.activos.find((a) => a.codigo === o.activoId);
      const ticket = o.ticketId ? d.tickets.find((t) => t.id === o.ticketId) : undefined;
      const id = siguiente(
        d.ots.map((x) => x.id),
        "OT-2026-",
        4
      );
      const status: OrdenTrabajo["status"] = o.cuadrillaId ? (o.despachar ? "EN RUTA" : "ASIGNADA") : "PENDIENTE";
      const ot: OrdenTrabajo = {
        id,
        tipo: o.tipo,
        ticketId: o.ticketId,
        planId: o.planId,
        activoId: o.activoId,
        origin: o.origin,
        criticality: o.criticality,
        slaHours: o.slaHours,
        infra: activo ? `${activo.codigo} / ${activo.descripcion}` : o.activoId,
        cuadrillaId: o.cuadrillaId,
        crew: etiquetaCuadrilla(d, o.cuadrillaId),
        status,
        coordinates: activo ? fmtCoord(activo.lat, activo.lng) : "—",
        createdAt: hora,
        fechaProgramada: o.fechaProgramada ?? hora.slice(0, 10),
        actividad: o.actividad,
        materials: o.materials,
        cliente: ticket?.cliente ?? o.cliente ?? "Área usuaria Movistar",
        isNew: true,
      };
      mutar(
        (x) => {
          let y: Datos = { ...x, ots: [ot, ...x.ots] };
          if (ticket) {
            y = {
              ...y,
              tickets: y.tickets.map((t) =>
                t.id === ticket.id
                  ? { ...avanzarTicket(t, status === "EN RUTA" ? "En ruta" : status === "ASIGNADA" ? "Asignado" : "Registrado", hora), otId: id }
                  : t
              ),
            };
          }
          if (o.planId) {
            y = { ...y, planes: y.planes.map((p) => (p.id === o.planId ? { ...p, otId: id } : p)) };
          }
          if (status === "EN RUTA") y = moverCuadrilla(y, o.cuadrillaId, { estado: "En ruta", otId: id }, hora);
          return y;
        },
        { accion: status === "EN RUTA" ? "OT generada y despachada" : "OT generada", ref: id }
      );
      return ot;
    },
    [mutar]
  );

  const asignarOt = useCallback<Ctx["asignarOt"]>(
    (otId, cuadrillaId) => {
      const hora = ahoraRef.current;
      mutar(
        (x) => {
          const ot = x.ots.find((o) => o.id === otId);
          return {
            ...x,
            ots: x.ots.map((o) =>
              o.id === otId ? { ...o, cuadrillaId, crew: etiquetaCuadrilla(x, cuadrillaId), status: "ASIGNADA" } : o
            ),
            tickets: x.tickets.map((t) => (ot?.ticketId === t.id ? avanzarTicket(t, "Asignado", hora) : t)),
          };
        },
        { accion: `OT asignada a ${cuadrillaId}`, ref: otId }
      );
    },
    [mutar]
  );

  const despacharOt = useCallback<Ctx["despacharOt"]>(
    (otId) => {
      const hora = ahoraRef.current;
      mutar(
        (x) => {
          const ot = x.ots.find((o) => o.id === otId);
          let y: Datos = {
            ...x,
            ots: x.ots.map((o) => (o.id === otId ? { ...o, status: "EN RUTA" } : o)),
            tickets: x.tickets.map((t) => (ot?.ticketId === t.id ? avanzarTicket(t, "En ruta", hora) : t)),
          };
          y = moverCuadrilla(y, ot?.cuadrillaId ?? null, { estado: "En ruta", otId }, hora);
          return y;
        },
        { accion: "OT despachada (cuadrilla en ruta)", ref: otId }
      );
    },
    [mutar]
  );

  const upsertEjecucion = (x: Datos, otId: string, patch: Partial<Ejecucion>): Datos => {
    const existe = x.ejecuciones.some((e) => e.otId === otId);
    return {
      ...x,
      ejecuciones: existe
        ? x.ejecuciones.map((e) => (e.otId === otId ? { ...e, ...patch } : e))
        : [...x.ejecuciones, { otId, actividades: [], foto: false, firma: false, evidencia: "", ...patch }],
    };
  };

  const registrarCheckIn = useCallback<Ctx["registrarCheckIn"]>(
    (otId, c) => {
      const hora = ahoraRef.current;
      mutar(
        (x) => {
          const ot = x.ots.find((o) => o.id === otId);
          let y = upsertEjecucion(x, otId, { checkIn: c });
          if (!c.valido) return y;
          y = {
            ...y,
            ots: y.ots.map((o) => (o.id === otId ? { ...o, status: "EN EJECUCIÓN" } : o)),
            tickets: y.tickets.map((t) => (ot?.ticketId === t.id ? avanzarTicket(t, "En atención", hora) : t)),
          };
          return moverCuadrilla(y, ot?.cuadrillaId ?? null, { estado: "En sitio", otId, lat: c.lat, lng: c.lng }, hora);
        },
        { accion: c.valido ? "Check-in validado por GPS" : "Check-in rechazado (fuera de rango)", ref: otId }
      );
    },
    [mutar]
  );

  const registrarAts = useCallback<Ctx["registrarAts"]>(
    (otId, ats, valido) => {
      const hora = ahoraRef.current;
      mutar(
        (x) => {
          const ot = x.ots.find((o) => o.id === otId);
          let y = upsertEjecucion(x, otId, { ats: { ...ats, registradoEn: hora }, atsValido: valido });
          if (valido) y = moverCuadrilla(y, ot?.cuadrillaId ?? null, { estado: "En ejecución", otId }, hora);
          return y;
        },
        { accion: valido ? "ATS aprobado" : "ATS observado", ref: otId }
      );
    },
    [mutar]
  );

  const guardarEjecucion = useCallback<Ctx["guardarEjecucion"]>(
    (otId, patch) => {
      mutar((x) => upsertEjecucion(x, otId, patch));
    },
    [mutar]
  );

  const finalizarEjecucion = useCallback<Ctx["finalizarEjecucion"]>(
    (otId) => {
      const hora = ahoraRef.current;
      mutar(
        (x) => {
          const ot = x.ots.find((o) => o.id === otId);
          return {
            ...x,
            ots: x.ots.map((o) => (o.id === otId ? { ...o, status: "PENDIENTE DE CIERRE" } : o)),
            tickets: x.tickets.map((t) => (ot?.ticketId === t.id ? avanzarTicket(t, "Solucionado", hora) : t)),
          };
        },
        { accion: "Ejecución finalizada (pendiente de cierre)", ref: otId }
      );
    },
    [mutar]
  );

  const descargarRepuestos = useCallback<Ctx["descargarRepuestos"]>(
    (otId, lineas) => {
      const d = datosRef.current;
      const hora = ahoraRef.current;
      const ot = d.ots.find((o) => o.id === otId);
      const cuadrillaId = ot?.cuadrillaId ?? "";
      const tecnico = d.cuadrillas.find((c) => c.id === cuadrillaId)?.lider ?? "";
      const ids = d.consumos.map((c) => c.id);
      const nuevos: Consumo[] = lineas.map((l) => {
        const id = siguiente(ids, "VAL-2026-", 4);
        ids.push(id);
        return { id, otId, cuadrillaId, tecnico, codigo: l.codigo, cantidad: l.cantidad, fecha: hora };
      });
      mutar(
        (x) => {
          const stockC = { ...(x.stock[cuadrillaId] ?? {}) };
          lineas.forEach((l) => {
            stockC[l.codigo] = Math.max(0, (stockC[l.codigo] ?? 0) - l.cantidad);
          });
          return { ...x, consumos: [...x.consumos, ...nuevos], stock: { ...x.stock, [cuadrillaId]: stockC } };
        },
        { accion: `Descargo de ${lineas.length} material(es)`, ref: otId }
      );
      return nuevos;
    },
    [mutar]
  );

  const cerrarOt = useCallback<Ctx["cerrarOt"]>(
    (otId) => {
      const d = datosRef.current;
      const hora = ahoraRef.current;
      const ot = d.ots.find((o) => o.id === otId);
      if (!ot) return [];
      const cambios: string[] = [`Orden ${ot.id}: estado CERRADA (${hora.slice(11)})`];
      const ticket = ot.ticketId ? d.tickets.find((t) => t.id === ot.ticketId) : undefined;
      if (ticket) cambios.push(`Ticket ${ticket.id}: Solucionado → Cerrado`);
      const plan = ot.planId ? d.planes.find((p) => p.id === ot.planId) : undefined;
      if (plan) cambios.push(`Plan ${plan.id}: estado Ejecutado (Seguimiento de Mantenimientos actualizado)`);
      const activo = d.activos.find((a) => a.codigo === ot.activoId);
      const restituir = activo && activo.estado !== "Operativo";
      if (restituir) cambios.push(`Activo ${activo!.codigo}: ${activo!.estado} → Operativo`);
      if (ot.cuadrillaId) cambios.push(`Cuadrilla ${ot.cuadrillaId}: tracking Finalizado`);
      const nConsumos = d.consumos.filter((c) => c.otId === otId).length;
      cambios.push(`Materiales: ${nConsumos} línea(s) de consumo vinculadas al vale de la OT`);

      mutar(
        (x) => {
          let y: Datos = {
            ...x,
            ots: x.ots.map((o) => (o.id === otId ? { ...o, status: "CERRADA", cerradaEn: hora } : o)),
            tickets: x.tickets.map((t) => (t.id === ot.ticketId ? avanzarTicket(t, "Cerrado", hora) : t)),
            planes: x.planes.map((p) => (p.id === ot.planId ? { ...p, estado: "Ejecutado" } : p)),
            activos: x.activos.map((a) => (a.codigo === ot.activoId && restituir ? { ...a, estado: "Operativo" } : a)),
          };
          y = moverCuadrilla(y, ot.cuadrillaId, { estado: "Finalizado" }, hora);
          return y;
        },
        { accion: "Cierre transaccional de OT", ref: otId }
      );
      return cambios;
    },
    [mutar]
  );

  const restablecer = useCallback(() => {
    setDatos(INICIAL);
    datosRef.current = INICIAL;
    setBitacora([]);
    inicioReal.current = Date.now();
    setAhora(INICIO_TXT);
    notificar("Datos de demostración restablecidos.", "info");
  }, [notificar]);

  const valor = useMemo<Ctx>(
    () => ({
      hydrated,
      datos,
      sesion,
      ahora,
      bitacora,
      iniciarSesion,
      cerrarSesion,
      notificar,
      mutar,
      registrarTicket,
      vincularReporte,
      crearOt,
      asignarOt,
      despacharOt,
      registrarCheckIn,
      registrarAts,
      guardarEjecucion,
      finalizarEjecucion,
      descargarRepuestos,
      cerrarOt,
      restablecer,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hydrated, datos, sesion, ahora, bitacora]
  );

  return (
    <SgmrContext.Provider value={valor}>
      {children}
      <ToastStack toasts={toasts} onClose={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
    </SgmrContext.Provider>
  );
}

function ToastStack({ toasts, onClose }: { toasts: Toast[]; onClose: (id: number) => void }) {
  if (!toasts.length) return null;
  const estilos: Record<Tono, { cls: string; Icon: typeof Info }> = {
    ok: { cls: "border-st-ok/40 bg-st-ok-bg text-st-ok-fg", Icon: CheckCircle2 },
    warn: { cls: "border-st-warn/50 bg-st-warn-bg text-st-warn-fg", Icon: AlertTriangle },
    crit: { cls: "border-st-crit/40 bg-st-crit-bg text-st-crit-fg", Icon: XCircle },
    info: { cls: "border-st-info/40 bg-st-info-bg text-st-info-fg", Icon: Info },
  };
  return (
    <div className="no-print pointer-events-none fixed bottom-4 right-4 z-[80] flex w-[min(92vw,380px)] flex-col gap-2" aria-live="polite">
      {toasts.map((t) => {
        const { cls, Icon } = estilos[t.tono];
        return (
          <div key={t.id} className={`pointer-events-auto flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm shadow-pop ${cls}`}>
            <Icon className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="flex-1 leading-snug">{t.msg}</span>
            <button onClick={() => onClose(t.id)} className="opacity-70 hover:opacity-100" aria-label="Cerrar aviso">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export function useSgmr(): Ctx {
  const ctx = useContext(SgmrContext);
  if (!ctx) throw new Error("useSgmr debe usarse dentro de <SgmrProvider>");
  return ctx;
}

// Utilidades de lectura compartidas
export function useCatalogos() {
  const { datos } = useSgmr();
  return useMemo(() => {
    const activo = (id?: string | null) => datos.activos.find((a) => a.codigo === id);
    const central = (id?: string | null) => datos.centrales.find((c) => c.id === id);
    const zona = (id?: string | null) => datos.zonas.find((z) => z.id === id);
    const cuadrilla = (id?: string | null) => datos.cuadrillas.find((c) => c.id === id);
    const contratista = (id?: string | null) => datos.contratistas.find((c) => c.id === id);
    const ticket = (id?: string | null) => datos.tickets.find((t) => t.id === id);
    const ot = (id?: string | null) => datos.ots.find((o) => o.id === id);
    const plan = (id?: string | null) => datos.planes.find((p) => p.id === id);
    const ejecucion = (otId?: string | null) => datos.ejecuciones.find((e) => e.otId === otId);
    return { activo, central, zona, cuadrilla, contratista, ticket, ot, plan, ejecucion };
  }, [datos]);
}

