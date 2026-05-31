import type { Config } from "tailwindcss";

/**
 * Identidade visual do ComerziaHub.
 * - brand: violeta/índigo — confiança + tecnologia (comércio + hub social).
 * - accent: laranja — energia do delivery e CTAs.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        brand: {
          50: "#f4f2ff",
          100: "#ece7ff",
          200: "#d9ceff",
          300: "#bda5ff",
          400: "#9b72ff",
          500: "#7c4dff",
          600: "#6b2ff0",
          700: "#5a21cc",
          800: "#4a1ca6",
          900: "#3e1b85",
          950: "#260f57",
        },
        accent: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,.06), 0 1px 3px rgba(16,24,40,.1)",
        soft: "0 10px 30px -12px rgba(76,28,166,.25)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in .4s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
