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
        // 仕様書準拠のカラーパレット
        base: "#FFFFFF",
        ink: {
          50: "#F8FAFC",
          100: "#F1F5F9", 
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",  // サブテキスト
          600: "#475569",  // メインテキスト
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",  // 見出し
        },
        brand: {
          primary: "#2E5D50",    // 深緑、安心
          accent: "#3A9BDC",     // 空色、洗練
        },
        surface: "#F5F7F8",
        border: "#E6EBEE",
        
        // セマンティックカラー
        success: "#16A34A",
        warning: "#F59E0B", 
        danger: "#DC2626",
        
        // グラデーション用
        gradient: {
          from: "#F8FAFC",
          to: "#F1F5F9",
        },
      },
      fontFamily: {
        sans: ["'Noto Sans JP'", "Inter", "sans-serif"],
        display: ["'Noto Sans JP'", "Inter", "sans-serif"],
        body: ["'Noto Sans JP'", "Inter", "sans-serif"],
      },
      fontSize: {
        xs: "0.75rem",      // 12px
        sm: "0.875rem",     // 14px
        base: "1rem",       // 16px
        lg: "1.125rem",     // 18px
        xl: "1.25rem",      // 20px
        "2xl": "1.5rem",    // 24px
        "3xl": "1.875rem",  // 30px
        "4xl": "2.25rem",   // 36px
        "5xl": "3rem",      // 48px
        "6xl": "3.75rem",   // 60px
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.06)',
        'medium': '0 4px 12px 0 rgba(0, 0, 0, 0.08)',
        'strong': '0 8px 24px 0 rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;