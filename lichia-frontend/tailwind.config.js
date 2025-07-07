/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Adicione as cores customizadas aqui
      colors: {
        'lichia-from': '#da3a3f', // Sua cor base
        'lichia-to': '#f4a2a4',   // Um tom rosado mais claro para o gradiente
      }
    },
  },
  plugins: [],
}