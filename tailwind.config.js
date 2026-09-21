/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        movistar: {
          green: '#5BC500',        // Verde Movistar clásico
          'green-dark': '#489E00',   // Hover verde
          'green-light': '#F0F9E8',  // Fondo sutil verde
          'green-border': '#C6EE94',
          blue: '#019DF4',         // Azul corporativo Movistar
          'blue-dark': '#0070B8',
          'blue-light': '#E5F4FD',
          'blue-border': '#B8E2FB',
          navy: '#0B2742',         // Azul marino para topbar/contraste
          'navy-dark': '#061625',
          'navy-light': '#123960',
          text: '#1E293B',         // Gris oscuro para textos principales
          'text-secondary': '#64748B', // Gris medio para textos secundarios
          border: '#E2E8F0',       // Gris claro para bordes y separadores
          'border-light': '#F1F5F9',
          bg: '#F8FAFC',           // Fondo predominante limpio
          card: '#FFFFFF',         // Fondo tarjetas blanco
          white: '#FFFFFF',
          light: '#F4F6F9',
        },
        brand: {
          blue: '#0B2742',
          'blue-dark': '#061625',
          'blue-light': '#123960',
          cyan: '#019DF4',
          'cyan-muted': '#019DF41A',
          orange: '#FF6A13',
          'orange-muted': '#FF6A131A',
          green: '#00A86B',
          dark: '#0B2742',
          'dark-card': '#FFFFFF',
          'dark-card-hover': '#F8FAFC',
          'dark-border': '#E2E8F0',
          'dark-border-light': '#CBD5E1',
          white: '#FFFFFF',
          'gray-muted': '#64748B',
          'gray-light': '#F1F5F9',
        },
        status: {
          ok: '#16A34A',
          'ok-light': '#DCFCE7',
          'ok-border': '#86EFAC',
          warning: '#D97706',
          'warning-light': '#FEF3C7',
          'warning-border': '#FDE68A',
          danger: '#DC2626',
          'danger-light': '#FEE2E2',
          'danger-border': '#FCA5A5',
          info: '#0284C7',
          'info-light': '#E0F2FE',
          'info-border': '#BAE6FD',
        }
      },
      fontFamily: {
        grotesk: ['var(--font-space-grotesk)', 'sans-serif'],
        sans: ['var(--font-public-sans)', 'sans-serif'],
        mono: ['var(--font-ibm-plex-mono)', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 15px rgba(1, 157, 244, 0.35)',
        'glow-blue': '0 0 15px rgba(1, 157, 244, 0.35)',
        'glow-green': '0 0 15px rgba(0, 168, 107, 0.35)',
        'glow-orange': '0 0 15px rgba(255, 106, 19, 0.35)',
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'card-clean': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 12px -2px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'movistar-green': '0 2px 10px rgba(91, 197, 0, 0.25)',
      }
    },
  },
  plugins: [],
}
