import type { Metadata, Viewport } from "next";
import "@fontsource-variable/figtree";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import { SgmrProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "SGMR Movistar | Sistema de Mantenimiento de Redes",
  description:
    "Sistema de Mantenimiento de Redes de Movistar: gestión gerencial y operativa del mantenimiento preventivo y correctivo.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#5BC500",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white text-mv-ink antialiased selection:bg-mv-green-100 selection:text-mv-ink">
        <SgmrProvider>{children}</SgmrProvider>
      </body>
    </html>
  );
}
