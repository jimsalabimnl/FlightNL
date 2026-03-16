/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        glow: {
          'from': { filter: 'drop-shadow(0 0 2px rgba(34, 211, 238, 0.4))' },
          'to': { filter: 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.8))' }
        }
      },
      animation: {
        glow: 'glow 1.5s ease-in-out infinite alternate'
      }
    },
  },
  plugins: [],
}
