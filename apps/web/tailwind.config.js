/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#14452F', // TaskTender Forest Green
          dark: '#0B291C',
          light: '#1E6B49',
          accent: '#2E7D32',
          canvas: '#F8F9FA'
        }
      }
    },
  },
  plugins: [],
}