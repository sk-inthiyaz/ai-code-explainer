/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // 🌙 enables dark mode via class (not media query)
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
