/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0A2E5C',
          'blue-dark': '#061D3A',
          'blue-light': '#144585',
          cyan: '#00AEEF',
          'cyan-muted': '#00AEEF1A',
          orange: '#FF6A13',
          'orange-muted': '#FF6A131A',
          dark: '#0B0C0E',
          'dark-card': '#121418',
          'dark-card-hover': '#181B21',
          'dark-border': '#1E232B',
          'dark-border-light': '#2A313C',
          white: '#FFFFFF',
          'gray-muted': '#8A99AD',
          'gray-light': '#D2D9E2',
        }
      },
      fontFamily: {
        grotesk: ['var(--font-space-grotesk)', 'sans-serif'],
        sans: ['var(--font-public-sans)', 'sans-serif'],
        mono: ['var(--font-ibm-plex-mono)', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 15px rgba(0, 174, 239, 0.35)',
        'glow-orange': '0 0 15px rgba(255, 106, 19, 0.35)',
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
