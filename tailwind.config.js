/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#222622",
        paper: "#f7f5ef",
        mist: "#e8ece7",
        sage: "#536b58",
        "sage-soft": "#dce6dc",
        clay: "#a55f49",
        "clay-soft": "#f1ded6",
        slateblue: "#4f6577",
        lavender: "#e7e2ed",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: [
          "Manrope",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        editorial: "5px 5px 0 0 rgba(34,38,34,.13)",
      },
    },
  },
  plugins: [],
};
