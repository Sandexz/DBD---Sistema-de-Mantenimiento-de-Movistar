/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Identidad corporativa Movistar (Gerencial / Operativo)
        mv: {
          green: "#5BC500", // identidad: marca, indicador activo, acentos
          "green-600": "#4AA300",
          "green-700": "#3B8500", // acciones primarias y texto verde sobre blanco (AA)
          "green-800": "#2F6A00",
          "green-50": "#F2FAEA",
          "green-100": "#E2F3D0",
          teal: "#00A3B4", // complementario moderado (módulo Operativo)
          "teal-700": "#007A87",
          "teal-50": "#E6F6F8",
          ink: "#1F2A30", // texto principal (gris oscuro)
          "ink-2": "#4A5760", // texto secundario
          muted: "#7C8891",
          line: "#E3E7EA",
          "line-2": "#CFD6DB",
          surface: "#F4F6F7", // gris claro: fondos secundarios
          "surface-2": "#FAFBFB",
        },
        // Colores semánticos (estados funcionales, distintos de la identidad)
        st: {
          "ok-fg": "#0F7A55",
          "ok-bg": "#E6F4EE",
          ok: "#16A36F",
          "warn-fg": "#8A5A00",
          "warn-bg": "#FFF4D6",
          warn: "#E9A800",
          "crit-fg": "#B42318",
          "crit-bg": "#FDECEA",
          crit: "#E0362B",
          "info-fg": "#1B5FC1",
          "info-bg": "#EAF1FD",
          info: "#2F7BEA",
        },
        // Paleta anterior: se conserva porque el módulo Batch la utiliza
        brand: {
          blue: "#0A2E5C",
          "blue-dark": "#061D3A",
          "blue-light": "#144585",
          cyan: "#00AEEF",
          "cyan-muted": "#00AEEF1A",
          orange: "#FF6A13",
          "orange-muted": "#FF6A131A",
          dark: "#0B0C0E",
          "dark-card": "#121418",
          "dark-card-hover": "#181B21",
          "dark-border": "#1E232B",
          "dark-border-light": "#2A313C",
          white: "#FFFFFF",
          "gray-muted": "#8A99AD",
          "gray-light": "#D2D9E2",
        },
      },
      fontFamily: {
        sans: ["Figtree Variable", "Figtree", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
        // alias heredado: Batch usa `font-grotesk` en sus títulos
        grotesk: ["Figtree Variable", "Figtree", "Segoe UI", "Arial", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        pop: "0 12px 32px -8px rgba(31, 42, 48, 0.22)",
        "glow-cyan": "0 0 15px rgba(0, 174, 239, 0.35)",
        "glow-orange": "0 0 15px rgba(255, 106, 19, 0.35)",
        "card-dark": "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};
