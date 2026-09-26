/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F5F6F2",
        ink: "#12161D",
        navy: {
          DEFAULT: "#132A3C",
          dark: "#0C1B28",
        },
        green: {
          DEFAULT: "#229A3B",
          dark: "#186E2A",
          light: "#6FCB82",
        },
        bronze: {
          DEFAULT: "#B98A2E",
          light: "#E0BD73",
        },
        line: "#DADFD6",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose: "68ch",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in": "fade-in 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};
