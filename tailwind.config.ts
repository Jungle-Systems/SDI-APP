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
        // Brand tokens
        teal: {
          DEFAULT: "#178395",
          light: "#E8F4F6",
          dark: "#0F6070",
        },
        vermilion: {
          DEFAULT: "#E14A2D",
          light: "#FDEEE9",
          dark: "#B83820",
        },
        ground: "#FDFDFC",
        // Severity
        severity: {
          high: "#E14A2D",
          medium: "#D97706",
          low: "#178395",
          pass: "#059669",
        },
        // Neutral
        ink: {
          DEFAULT: "#111827",
          muted: "#6B7280",
          faint: "#9CA3AF",
        },
        border: "#E5E7EB",
        surface: "#FFFFFF",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        "2xs": ["0.65rem", { lineHeight: "1rem", letterSpacing: "0.08em" }],
      },
    },
  },
  plugins: [],
};

export default config;
