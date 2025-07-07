// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Garante que ele leia todos os arquivos necessários
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}