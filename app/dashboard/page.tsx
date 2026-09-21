import { redirect } from "next/navigation";

export default function DashboardRedirect() {
  redirect("/gerencial/consulta/disponibilidad");
}
