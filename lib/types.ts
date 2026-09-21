// Tipos de las entidades del Sistema de Mantenimiento de Redes (datos mock).
// Cada interfaz corresponde a una "tabla" de mock-data/ y se relaciona por código.

export type Rol = "NOC" | "SUPERVISOR" | "TECNICO";

export type TipoMantenimiento = "PREVENTIVO" | "CORRECTIVO";
export type Criticidad = "CRÍTICA" | "ALTA" | "MEDIA" | "BAJA";
export type Segmento = "Core" | "Planta Externa" | "Última Milla";

export interface Region {
  id: string;
  nombre: string;
}

export interface Zona {
  id: string;
  nombre: string;
  regionId: string;
  jefeZona: string;
}

export type EstadoCentral = "Operativa" | "Con alerta" | "Degradada";

export interface Central {
  id: string;
  nombre: string;
  zonaId: string;
  tipo: string;
  direccion: string;
  lat: number;
  lng: number;
  clientes: number;
}

export type EstadoActivo = "Operativo" | "En alerta" | "Fuera de servicio" | "En mantenimiento";

export interface Activo {
  codigo: string;
  tipo: string;
  descripcion: string;
  modelo: string;
  direccion: string;
  zonaId: string;
  centralId: string;
  segmento: Segmento;
  estado: EstadoActivo;
  fechaInstalacion: string; // ISO yyyy-mm-dd
  vidaUtilAnios: number;
  criticidad: Criticidad;
  lat: number;
  lng: number;
  clientes: number;
}

export type EstadoParametro = "Vigente" | "En revisión" | "Inactivo";

export interface SlaParametro {
  id: string;
  severidad: Criticidad;
  prioridad: "P1" | "P2" | "P3" | "P4";
  alcance: string;
  atencionMin: number; // tiempo máximo de atención (minutos)
  solucionMin: number; // tiempo objetivo de solución (minutos)
  estado: EstadoParametro;
}

export interface TiempoBase {
  id: string;
  actividad: string;
  tipoActivo: string;
  periodicidad: Periodicidad;
  duracionMin: number;
  toleranciaDias: number;
}

export interface UmbralRed {
  id: string;
  parametro: string;
  valor: string;
  accion: string;
}

export type EstadoContratista = "Activo" | "En homologación" | "Suspendido";

export interface Contratista {
  id: string;
  empresa: string;
  ruc: string;
  contacto: string;
  telefono: string;
  correo: string;
  especialidad: string;
  tarifaHora: number; // S/ por hora-cuadrilla
  estado: EstadoContratista;
}

export interface Cuadrilla {
  id: string;
  nombre: string;
  lider: string;
  contratistaId: string;
  zonaId: string;
  integrantes: number;
  especialidad: string;
}

export type Periodicidad = "Mensual" | "Trimestral" | "Semestral" | "Anual" | "Única";
export type EstadoPlan = "Programado" | "Próximo" | "Ejecutado" | "Pendiente" | "Incumplido";

export interface PlanMantenimiento {
  id: string;
  activoId: string;
  tipo: TipoMantenimiento;
  actividad: string;
  periodicidad: Periodicidad;
  fechaProgramada: string;
  responsable: string;
  cuadrillaId: string;
  estado: EstadoPlan;
  otId: string | null; // OT generada por el proceso Batch (solo lectura aquí)
  observacion?: string;
}

export type OrigenTicket = "Call Center" | "NOC" | "Detección automática";
export type EstadoTicket =
  | "Detectado"
  | "Registrado"
  | "Asignado"
  | "En ruta"
  | "En atención"
  | "Solucionado"
  | "Cerrado";

export interface Ticket {
  id: string;
  tipo: string;
  activoId: string;
  ubicacion: string;
  severidad: Criticidad;
  prioridad: "P1" | "P2" | "P3" | "P4";
  origen: OrigenTicket;
  descripcion: string;
  cliente: string;
  clientesAfectados: number;
  estado: EstadoTicket;
  otId: string | null;
  reportesAdicionales: number;
  historial: Partial<Record<EstadoTicket, string>>; // estado -> fecha-hora ISO
}

export type EstadoOt =
  | "PENDIENTE"
  | "ASIGNADA"
  | "EN RUTA"
  | "EN EJECUCIÓN"
  | "PENDIENTE DE CIERRE"
  | "CERRADA";

export interface OrdenTrabajo {
  id: string;
  tipo: TipoMantenimiento;
  ticketId: string | null;
  planId: string | null;
  activoId: string;
  origin: string;
  criticality: Criticidad;
  slaHours: string;
  infra: string; // descripción visible del activo (campo heredado de /ots)
  cuadrillaId: string | null;
  crew: string; // etiqueta visible de la cuadrilla (campo heredado de /ots)
  status: EstadoOt;
  coordinates: string;
  createdAt: string; // "yyyy-mm-dd hh:mm"
  fechaProgramada: string;
  actividad: string;
  materials?: string;
  cliente: string;
  cerradaEn?: string;
  isNew?: boolean;
}

export type EstadoTracking = "Disponible" | "En ruta" | "En sitio" | "En ejecución" | "Finalizado";

export interface PosicionCuadrilla {
  cuadrillaId: string;
  tecnico: string;
  estado: EstadoTracking;
  otId: string | null;
  lat: number;
  lng: number;
  actualizado: string; // hh:mm
}

export interface Material {
  codigo: string;
  nombre: string;
  unidad: string;
}

export interface Consumo {
  id: string;
  otId: string;
  cuadrillaId: string;
  tecnico: string;
  codigo: string;
  cantidad: number;
  fecha: string; // "yyyy-mm-dd hh:mm"
}

export interface MantenimientoPeriodo {
  id: string;
  planId: string | null;
  activoId: string;
  centralId: string;
  zonaId: string;
  contratistaId: string;
  cuadrillaId: string;
  tipo: TipoMantenimiento;
  actividad: string;
  fechaProgramada: string;
  fechaEjecucion: string | null;
  estado: "Ejecutado" | "Pendiente" | "Incumplido";
}

export interface Alerta {
  id: string;
  timestamp: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  severityColor?: string;
  title: string;
  location: string;
  impact: string;
  status: string;
  slaRemaining: string;
  activoId?: string;
}

// Registro de ejecución en campo por OT (Check-in → ATS → Ejecución → Repuestos → Cierre)
export interface AtsRegistro {
  riesgos: string[];
  clima: string;
  arnes: "Sí" | "No" | "No aplica" | "";
  epp: string[];
  autorizadoPor: string;
  autorizado: boolean;
  registradoEn?: string;
}

export interface Ejecucion {
  otId: string;
  checkIn?: { lat: number; lng: number; distanciaM: number; valido: boolean; hora: string };
  ats?: AtsRegistro;
  atsValido?: boolean;
  actividades: string[]; // actividades completadas
  foto: boolean;
  firma: boolean;
  firmante?: string;
  evidencia: string; // medición / resultado técnico registrado
  conformidad?: "Conforme" | "Conforme con observaciones";
  observacion?: string;
  // Ejecución dinámica: campos según el tipo de OT
  causa?: string; // correctivo: causa de la falla
  accion?: string; // correctivo: acción correctiva aplicada
  hallazgos?: string; // preventivo: hallazgos de la inspección
  requiereCorrectivo?: boolean; // preventivo: se detectó falla que requiere OT correctiva
  sinConsumo?: boolean; // descargo: se declaró que no se usaron materiales
}
