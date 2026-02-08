/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7C3AED",
        secondary: "#EFF6FF",
        danger: "#FEE2E2",
        success: "#D1FAE5",
        warning: "#FEF3C7",
      }
    },
  },
  plugins: [],
}