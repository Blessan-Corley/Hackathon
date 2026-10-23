/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#07080C',
          900: '#0C0E14',
          850: '#12151E',
          800: '#181D2A',
          750: '#202636',
          700: '#2A3346',
          600: '#3D4860',
          500: '#5A6680',
          400: '#8593AD',
          300: '#B0BCDB',
          200: '#D5DCF0',
          100: '#EEF2FC'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      }
    },
  },
  plugins: [],
}
