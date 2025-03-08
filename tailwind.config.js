/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy': {
          800: '#1C2033',
          900: '#111827',
        }
      }
    },
  },
  plugins: [],
}