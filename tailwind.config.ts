import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-montserrat)"],
      },
      colors: {
        primary: "#E6003A",
        secondary : "#EA0061"
      },
    },
  },
  plugins: [],
} satisfies Config;
