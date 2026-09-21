"use client";

import { ModuloIndex } from "@/components/sgmr/modulo-index";
import { useSgmr } from "@/lib/store";

export default function OperativoPage() {
  const { datos, sesion } = useSgmr();
  const mias = datos.ots.filter((o) => sesion?.rol !== "TECNICO" || o.cuadrillaId === sesion.cuadrillaId);
  const resumen = (id: string) => {
    switch (id) {
      case "registro-tickets":
        return `${datos.tickets.filter((t) => t.estado === "Detectado" || (t.estado === "Registrado" && !t.otId)).length} incidencias por atender`;
      case "ots":
        return `${datos.ots.filter((o) => o.status !== "CERRADA").length} OT activas · ${datos.ots.filter((o) => o.status === "PENDIENTE").length} sin asignar`;
      case "checkin":
        return `${mias.filter((o) => ["ASIGNADA", "EN RUTA", "EN EJECUCIÓN"].includes(o.status)).length} OT listas para campo`;
      case "repuestos":
        return `${datos.consumos.length} líneas de consumo registradas`;
      case "cierre":
        return `${mias.filter((o) => o.status === "PENDIENTE DE CIERRE").length} OT pendientes de cierre`;
      case "rep-asignacion":
        return `${mias.filter((o) => o.cuadrillaId).length} papeletas disponibles`;
      case "rep-conformidad":
        return `${mias.filter((o) => o.status === "CERRADA").length} OT cerradas`;
      case "rep-vale":
        return `${new Set(datos.consumos.map((c) => c.otId)).size} OT con vale`;
      case "rep-ats":
        return `${datos.ejecuciones.filter((e) => e.ats).length} ATS registrados`;
      default:
        return null;
    }
  };
  return <ModuloIndex modulo="OPERATIVO" resumen={resumen} />;
}
