/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0E1A",
        dusk: "#11152A",
        glass: "rgba(255,255,255,0.06)",
        glassLight: "rgba(255,255,255,0.65)",
        violet: {
          DEFAULT: "#7C5CFC",
          soft: "#A78BFA",
        },
        coral: "#FF7A59",
        mint: "#3DDC97",
        amber: "#FFC857",
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.25)",
        glow: "0 0 40px rgba(124,92,252,0.35)",
      },
      backgroundImage: {
        "flow-gradient":
          "radial-gradient(circle at 20% 0%, #1E1B4B 0%, #0B0E1A 45%, #0B0E1A 100%)",
        "flow-gradient-light":
          "radial-gradient(circle at 20% 0%, #EDE9FE 0%, #F4F3FF 45%, #FFFFFF 100%)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
