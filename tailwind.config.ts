import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d5dae2',
          300: '#b0bac9',
          400: '#8494ab',
          500: '#647691',
          600: '#4f5f78',
          700: '#414d61',
          800: '#384252',
          900: '#323946',
          950: '#21262e',
        },
        // La palette del marchio arriva da variabili CSS, così l'amministratore
        // può cambiare il colore principale a runtime (src/lib/branding.ts).
        // La forma `rgb(var(--x) / <alpha-value>)` mantiene funzionanti le
        // utility di opacità, es. bg-brand-600/20.
        brand: {
          50: 'rgb(var(--brand-50) / <alpha-value>)',
          100: 'rgb(var(--brand-100) / <alpha-value>)',
          200: 'rgb(var(--brand-200) / <alpha-value>)',
          300: 'rgb(var(--brand-300) / <alpha-value>)',
          400: 'rgb(var(--brand-400) / <alpha-value>)',
          500: 'rgb(var(--brand-500) / <alpha-value>)',
          600: 'rgb(var(--brand-600) / <alpha-value>)',
          700: 'rgb(var(--brand-700) / <alpha-value>)',
          800: 'rgb(var(--brand-800) / <alpha-value>)',
          900: 'rgb(var(--brand-900) / <alpha-value>)',
          950: 'rgb(var(--brand-950) / <alpha-value>)',
        },
        // Colori delle 4 macro-aree Gallup
        executing: '#7c3aed',
        influencing: '#ea580c',
        relationship: '#0891b2',
        strategic: '#16a34a',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 240ms ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
