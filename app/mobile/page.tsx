import { redirect } from "next/navigation";

// Ruta heredada: la app de campo vive ahora en OPERATIVO › DATA ENTRY › Check-in y Ejecución Dinámica.
export default function MobileLegacyPage() {
  redirect("/operativo/campo/checkin");
}
