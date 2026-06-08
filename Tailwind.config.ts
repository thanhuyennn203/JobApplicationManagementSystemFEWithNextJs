/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-be-vietnam)", "ui-sans-serif", "system-ui"],
      },
      colors: {
        primary: "#00b14f",
        "primary-dark": "#009640",
        "primary-deeper": "#007a40",
      },
    },
  },
  plugins: [],
};