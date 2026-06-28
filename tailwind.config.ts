import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand — blue accent. (Token is still keyed "lime" so existing
        // bg-lime-*/text-lime-* classes recolor app-wide from one place.)
        lime: {
          100: "#DBEAFE",
          500: "#2563EB",
          600: "#1D4ED8",
          DEFAULT: "#2563EB",
        },
        // Surfaces
        ink: {
          700: "#2A2A2A",
          900: "#141414",
          DEFAULT: "#141414",
        },
        canvas: "#F5F6F1",
        card: "#FFFFFF",
        line: "#ECECEC",
        muted: "#8A8F98",
        // Status semantics
        ok: "#22C55E",
        warn: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6",
        // Soft stat-tile tints
        "tint-blue": "#E6F0FF",
        "tint-orange": "#FFEEDD",
        "tint-red": "#FFE2E2",
        "tint-green": "#E3F8E8",
        "tint-violet": "#EFEAFE",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
        "3xl": "24px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.04)",
        card: "0 1px 3px rgba(0,0,0,0.05)",
        lift: "0 10px 30px rgba(0,0,0,0.08)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "pulse-dot": "pulse-dot 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
