import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#07111f",
          900: "#0b1626",
          800: "#11233a"
        },
        moss: {
          400: "#69d2b0",
          500: "#35c28f"
        },
        gold: {
          400: "#f6c768",
          500: "#f2b237"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(105, 210, 176, 0.2), 0 24px 60px rgba(0, 0, 0, 0.45)"
      },
      backgroundImage: {
        "hero-radial": "radial-gradient(circle at top, rgba(105,210,176,0.18), transparent 44%), radial-gradient(circle at 20% 20%, rgba(242,178,55,0.18), transparent 26%), linear-gradient(180deg, #07111f 0%, #050b14 100%)"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"]
      }
    }
  },
  plugins: []
};

export default config;