/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        app: {
          black: '#0B0B0B',
          dark: '#121212',
          card: '#1C1C1C',
          gold: '#D4AF37',
          orange: '#FF8C00',
          text: '#F5F5F5',
          muted: '#888888',
        }
      }
    },
  },

  plugins: [],
}
