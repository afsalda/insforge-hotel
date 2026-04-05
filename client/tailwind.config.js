/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A2E1A',
          light: '#2A422A',
          dark: '#0F1D0F',
        },
        gold: {
          DEFAULT: '#C9A96E',
          bright: '#DBBF8A',
          dim: '#A08550',
        }
      }
    },
  },
  plugins: [],
}
