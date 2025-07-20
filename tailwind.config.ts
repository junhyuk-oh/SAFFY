import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 배경 색상
        background: "var(--background)",
        "background-secondary": "var(--background-secondary)",
        "background-hover": "var(--background-hover)",
        "background-selected": "var(--background-selected)",
        
        // 전경 색상
        foreground: "var(--foreground)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-tertiary": "var(--text-tertiary)",
        "text-inverse": "var(--text-inverse)",
        
        // 주요 색상
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        "primary-light": "var(--primary-light)",
        
        // 테두리
        border: "var(--border)",
        "border-hover": "var(--border-hover)",
        "border-focus": "var(--border-focus)",
        
        // 상태 색상
        success: "var(--success)",
        "success-bg": "var(--success-bg)",
        "success-text": "var(--success-text)",
        warning: "var(--warning)",
        "warning-bg": "var(--warning-bg)",
        "warning-text": "var(--warning-text)",
        error: "var(--error)",
        "error-bg": "var(--error-bg)",
        "error-text": "var(--error-text)",
      },
      boxShadow: {
        'notion-sm': 'var(--shadow-sm)',
        'notion-md': 'var(--shadow-md)',
        'notion-lg': 'var(--shadow-lg)',
      },
      borderRadius: {
        'notion-sm': 'var(--radius-sm)',
        'notion-md': 'var(--radius-md)',
        'notion-lg': 'var(--radius-lg)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;