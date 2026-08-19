import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#0A0B10",
          50: "#F5F6F8",
          100: "#E4E5EA",
          200: "#B8BAC6",
          300: "#8C8FA1",
          400: "#5F637C",
          500: "#333857",
          600: "#1E2133",
          700: "#15161F",
          800: "#0F1017",
          900: "#0A0B10",
          950: "#050509",
        },
        glass: {
          DEFAULT: "rgba(22, 24, 35, 0.7)",
          surface: "rgba(22, 24, 35, 0.7)",
          border: "rgba(255, 255, 255, 0.08)",
          highlight: "rgba(255, 255, 255, 0.04)",
        },
        love: {
          DEFAULT: "#FF2A5F",
          50: "#FFE5EC",
          100: "#FFCCDA",
          200: "#FF99B5",
          300: "#FF6690",
          400: "#FF4D7D",
          500: "#FF2A5F",
          600: "#E01249",
          700: "#B00E3A",
          800: "#800A2A",
          900: "#50061A",
        },
        energy: {
          DEFAULT: "#00F2FE",
          50: "#E5FDFF",
          100: "#CCFBFF",
          200: "#99F7FF",
          300: "#66F3FF",
          400: "#33F5FE",
          500: "#00F2FE",
          600: "#00C2CB",
          700: "#009198",
          800: "#006166",
          900: "#003033",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: [
          "var(--font-display)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      backdropBlur: {
        xs: "2px",
        "2xl": "40px",
        "3xl": "64px",
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 50% 0%, rgba(255,42,95,0.12) 0%, rgba(10,11,16,0) 60%)",
        "aurora":
          "radial-gradient(circle at 15% 20%, rgba(255,42,95,0.18) 0%, transparent 45%), radial-gradient(circle at 85% 15%, rgba(0,242,254,0.16) 0%, transparent 45%), radial-gradient(circle at 50% 100%, rgba(255,42,95,0.10) 0%, transparent 50%)",
        "love-energy-gradient": "linear-gradient(135deg, #FF2A5F 0%, #00F2FE 100%)",
        "noise": "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44NSIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNuKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')",
      },
      boxShadow: {
        "glow-love": "0 0 20px rgba(255, 42, 95, 0.35), 0 0 40px rgba(255, 42, 95, 0.15)",
        "glow-love-sm": "0 0 10px rgba(255, 42, 95, 0.4)",
        "glow-love-lg": "0 0 30px rgba(255, 42, 95, 0.45), 0 0 80px rgba(255, 42, 95, 0.2)",
        "glow-energy": "0 0 20px rgba(0, 242, 254, 0.35), 0 0 40px rgba(0, 242, 254, 0.15)",
        "glow-energy-sm": "0 0 10px rgba(0, 242, 254, 0.4)",
        "glow-energy-lg": "0 0 30px rgba(0, 242, 254, 0.45), 0 0 80px rgba(0, 242, 254, 0.2)",
        "glass": "0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
        "glass-lg": "0 16px 60px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "neon-glow": {
          "0%, 100%": {
            filter: "drop-shadow(0 0 6px rgba(255, 42, 95, 0.55)) drop-shadow(0 0 14px rgba(0, 242, 254, 0.25))",
          },
          "50%": {
            filter: "drop-shadow(0 0 16px rgba(255, 42, 95, 0.85)) drop-shadow(0 0 32px rgba(0, 242, 254, 0.45))",
          },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.04)" },
        },
        "border-glow": {
          "0%, 100%": { borderColor: "rgba(255, 42, 95, 0.4)" },
          "50%": { borderColor: "rgba(0, 242, 254, 0.4)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "neon-glow": "neon-glow 2.4s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2.2s ease-in-out infinite",
        "border-glow": "border-glow 3s ease-in-out infinite",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "scale-in": "scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-in-right": "slide-in-right 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-out-right": "slide-out-right 0.3s cubic-bezier(0.7, 0, 0.84, 0) forwards",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
