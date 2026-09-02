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
        brand: {
          50: '#eef6ff',
          100: '#d9ebff',
          200: '#bcdcff',
          300: '#8ec6ff',
          400: '#59a5ff',
          500: '#3382fc',
          600: '#1d63f1',
          700: '#164ede',
          800: '#1840b4',
          900: '#1a3b8e',
          950: '#152556',
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
