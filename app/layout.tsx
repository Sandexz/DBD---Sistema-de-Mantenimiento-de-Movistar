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
  title: "SGMR — Sistema de Gestión de Mantenimiento de Redes",
  description: "Plataforma Integral de Monitoreo NOC, Gestión de OTs y Despacho de Cuadrillas en Campo",
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
      <body className="min-h-screen bg-[#0B0C0E] text-slate-100 antialiased selection:bg-[#00AEEF]/20 selection:text-[#00AEEF]">
        {children}
      </body>
    </html>
  );
}
