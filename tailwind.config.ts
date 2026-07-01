import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3B49DF",
          dark: "#2A35B0",
        },
        accent: {
          cyan: "#06B6D4",
        },
        surface: "#F8FAFF",
        background: "#F8FAFF",
        card: "#FFFFFF",
        sidebar: {
          dark: "#0F172A",
          item: "#1E293B",
        },
        border: "#E2E8F0",
        text: {
          primary: "#0F172A",
          secondary: "#64748B",
          muted: "#94A3B8",
        },
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ["Outfit", "sans-serif"],
        chat: ["Inter", "sans-serif"],
      },
      borderRadius: {
        input: "8px",
        card: "10px",
        panel: "12px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        panel: "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04)",
      },
      animation: {
        "score-ring": "scoreRing 1s ease-out forwards",
        "progress-bar": "progressBar 1s ease-out forwards",
        "slide-in-right": "slideInRight 0.25s ease-out forwards",
        "slide-in-up": "slideInUp 0.25s ease-out forwards",
        "fade-scale-in": "fadeScaleIn 0.2s ease-out forwards",
        "toast-in": "toastIn 0.3s ease-out forwards",
        spin: "spin 1s linear infinite",
      },
      keyframes: {
        scoreRing: {
          from: { strokeDashoffset: "283" },
          to: { strokeDashoffset: "var(--target-offset)" },
        },
        progressBar: {
          from: { width: "0%" },
          to: { width: "var(--target-width)" },
        },
        slideInRight: {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        slideInUp: {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        fadeScaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        toastIn: {
          from: { opacity: "0", transform: "translateY(20px) translateX(20px)" },
          to: { opacity: "1", transform: "translateY(0) translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
