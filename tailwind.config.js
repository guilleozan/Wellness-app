/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background-rgb) / <alpha-value>)",
        primary: "rgb(var(--primary-rgb) / <alpha-value>)",
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}