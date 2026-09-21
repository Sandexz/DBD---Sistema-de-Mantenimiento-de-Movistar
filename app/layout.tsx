import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/components/layout/user-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SGMR — Sistema de Mantenimiento e Infraestructura de Redes | Movistar Perú",
  description: "Plataforma Integral NOC, Supervisión Gerencial, Gestión Operativa de OTs, Auditoría Batch y App Móvil de Campo para Movistar Perú",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${ibmPlexMono.variable}`}
    >
      <body className="min-h-screen bg-[#F8FAFC] text-slate-800 antialiased selection:bg-[#019DF4]/20 selection:text-[#0B2742]">
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}

