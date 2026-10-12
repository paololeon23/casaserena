/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#546C4C",
        turquoise: "#546C4C",
        coral: "#546C4C",
        paper: "#F7F7F7",
        line: "#E4E4E4",
      },
      fontFamily: {
        sans: ["Manrope", "Segoe UI", "sans-serif"],
        display: ["Cormorant Garamond", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -18px rgba(84, 108, 76, 0.35)",
        card: "0 18px 50px -28px rgba(84, 108, 76, 0.4)",
      },
    },
  },
  plugins: [],
};
