"use client";

import { ModuloIndex } from "@/components/sgmr/modulo-index";
import { seguimientoActual, useSgmr } from "@/lib/store";
import { vidaUtil } from "@/lib/data";

export default function GerencialPage() {
  const { datos } = useSgmr();
  const seg = seguimientoActual(datos);
  const ej = seg.filter((m) => m.estado === "Ejecutado").length;
  const resumen = (id: string) => {
    switch (id) {
      case "dashboard":
        return `${datos.activos.filter((a) => a.estado !== "Operativo").length} activos con incidencia`;
      case "activos":
        return `${datos.activos.length} activos · ${datos.activos.filter((a) => vidaUtil(a).estado === "Vida útil excedida").length} con vida útil excedida`;
      case "sla":
        return `${datos.sla.filter((s) => s.estado === "Vigente").length} SLA vigentes · ${datos.tiemposBase.length} tiempos base`;
      case "zonas":
        return `${datos.regiones.length} regiones · ${datos.zonas.length} zonas · ${datos.centrales.length} centrales`;
      case "contratistas":
        return `${datos.contratistas.length} contratistas · ${datos.cuadrillas.length} cuadrillas`;
      case "planificacion":
        return `${datos.planes.length} planes · ${datos.planes.filter((p) => p.estado === "Próximo").length} próximos · ${datos.planes.filter((p) => p.estado === "Incumplido").length} incumplidos`;
      case "tracking":
        return `${datos.tracking.filter((t) => t.estado === "En ruta").length} cuadrillas en ruta`;
      case "estado-tickets":
        return `${datos.tickets.filter((t) => t.estado !== "Cerrado").length} tickets no cerrados`;
      case "disponibilidad":
        return `${datos.activos.filter((a) => a.estado === "Fuera de servicio").length} activos fuera de servicio`;
      case "seguimiento":
        return `${ej}/${seg.length} ejecutados · ${seg.length ? ((ej / seg.length) * 100).toFixed(1) : "0"} %`;
      default:
        return null;
    }
  };
  return <ModuloIndex modulo="GERENCIAL" resumen={resumen} />;
}
