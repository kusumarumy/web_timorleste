import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B1620",
        panel: "#101F2C",
        stroke: "#22394A",
        strokeSoft: "#1A2D3B",
        teal: "#2FA6A0",
        tealDim: "#1E6E6A",
        amber: "#E0A13A",
        ink: "#E7EFF3",
        muted: "#8FA6B4",
        muted2: "#5F7686",
        forest: "#3FB27A",
        paddy: "#D8B24A",
        river: "#4AA6E0",
        road: "#E7C46B",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
