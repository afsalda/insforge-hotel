/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'deep-green': '#162118',
        'cream': '#F5F0E8',
        'off-white': '#FAF9F6',
        'accent-gold': '#C9A96E',
        'accent-gold-bright': '#D8BD8A',
        'accent-gold-dim': '#A68B5B',
        'charcoal': '#2C2C2C',
        'muted': '#666666',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        arabic: ['var(--font-aref)', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
