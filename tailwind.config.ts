import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#FFFFFF",
        "ink-raised": "#F7FBFD",
        line: "#D8E7EF",
        paper: "#02047B",
        slate: {
          DEFAULT: "#53627A",
          light: "#53627A",
        },
        signal: {
          DEFAULT: "#33D6FF",
          dim: "#16B8DD",
          bright: "#7BE8FF",
        },
        amber: {
          DEFAULT: "#EDA630",
        },
        coral: {
          DEFAULT: "#D92332",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        "pulse-bar": {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        ring: {
          "0%": { transform: "scale(0.8)", opacity: "0.8" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
      },
      animation: {
        "pulse-bar": "pulse-bar 1.2s ease-in-out infinite",
        "fade-up": "fade-up 0.5s ease-out both",
        "fade-in": "fade-in 0.4s ease-out both",
        ring: "ring 1.6s cubic-bezier(0.2, 0.6, 0.4, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
