import { redirect } from "next/navigation";

// Ruta heredada: la gestión de OT vive ahora en OPERATIVO › DATA ENTRY.
// Se verificó la paridad funcional antes de redirigir (ver docs/ANALISIS_Y_PLAN.md).
export default function OtsLegacyPage() {
  redirect("/operativo/ots");
}
