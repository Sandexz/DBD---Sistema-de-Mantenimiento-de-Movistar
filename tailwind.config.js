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
          navy: '#0B2742',
          'navy-dark': '#061625',
          'navy-light': '#123960',
          blue: '#019DF4',
          'blue-dark': '#0081CB',
          'blue-light': '#33B1F6',
          green: '#00A86B',
          'green-light': '#E6F6F0',
          light: '#F4F6F9',
          white: '#FFFFFF',
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
          dark: '#0B0C0E',
          'dark-card': '#121418',
          'dark-card-hover': '#181B21',
          'dark-border': '#1E232B',
          'dark-border-light': '#2A313C',
          white: '#FFFFFF',
          'gray-muted': '#8A99AD',
          'gray-light': '#F4F6F9',
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
      }
    },
  },
  plugins: [],
}
