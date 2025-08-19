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
        // ベースカラー
        background: "#FFFFFF",
        foreground: "#1B1B1B",
        
        // テキストカラー
        primary: {
          DEFAULT: "#2E5D50", // 深緑
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#4A4A4A",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#3A9BDC", // 空色
          foreground: "#FFFFFF",
        },
        
        // サーフェース
        surface: "#F5F7F8",
        border: "#E6EBEE",
        
        // セマンティックカラー
        success: "#16A34A",
        warning: "#F59E0B",
        danger: "#DC2626",
        
        // モノクローム
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
      },
      fontFamily: {
        sans: ["'Noto Sans JP'", "Inter", "sans-serif"],
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
      },
    },
  },
  plugins: [],
};

export default config;