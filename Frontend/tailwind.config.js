// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5",
        secondary: "#0ea5e9",
        accent: "#f97316",
        neutral: "#374151",
        "base-100": "#ffffff",
        info: "#3abff8",
        success: "#16a34a",
        warning: "#fbbd23",
        error: "#ef4444",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#4f46e5",
          secondary: "#0ea5e9",
          accent: "#f97316",
          neutral: "#374151",
          "base-100": "#ffffff",
        },
      },
    ],
  },
};