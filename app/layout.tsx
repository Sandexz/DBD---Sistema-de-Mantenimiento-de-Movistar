import type { Metadata } from "next";
import { Space_Grotesk, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Movistar Perú — Sistema de Mantenimiento e Infraestructura de Redes",
  description: "Plataforma Integral NOC, Gestión de OTs, Auditoría Batch de Contratistas y App Móvil de Campo para Movistar Perú",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${publicSans.variable} ${ibmPlexMono.variable}`}
    >
      <body className="min-h-screen bg-[#F4F6F9] text-slate-800 antialiased selection:bg-[#019DF4]/20 selection:text-[#0B2742]">
        {children}
      </body>
    </html>
  );
}
