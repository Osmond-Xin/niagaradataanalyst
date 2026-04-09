import type { Config } from "tailwindcss";

// 设计系统 token — 来源：docs/DESIGN.md（Claude 风格，暖色系编辑风）
// 更新时请同步修改 docs/DESIGN.md 与 src/app/globals.css 中的 CSS 变量
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // 默认浅色模式；暗色通过 <html class="dark"> 触发
  darkMode: "class",
  theme: {
    extend: {
      // ── 色彩 token ──────────────────────────────────────────────────────
      colors: {
        // 主色调
        terracotta: "#c96442",
        coral: "#d97757",
        "near-black": "#141413",

        // 表面与背景
        parchment: "#f5f4ed",
        ivory: "#faf9f5",
        "warm-sand": "#e8e6dc",
        "dark-surface": "#30302e",

        // 文字
        "text-primary": "#141413",
        "text-secondary": "#5e5d59",
        "text-muted": "#87867f",
        "text-dark-link": "#3d3d3a",
        "text-on-dark": "#b0aea5",
        "text-heading-dark": "#faf9f5",

        // 边框
        "border-cream": "#f0eee6",
        "border-warm": "#e8e6dc",
        "border-dark": "#30302e",

        // 交互状态
        "ring-warm": "#d1cfc5",
        "ring-deep": "#c2c0b6",
        "focus-blue": "#3898ec",
        error: "#b53333",

        // 图表调色板（5 色暖色集，供 Recharts / ReactFlow 使用）
        chart: {
          1: "#c96442", // terracotta — 主系列
          2: "#8b5a3c", // clay — 次系列
          3: "#c9a46a", // ochre — 第三系列
          4: "#d4b896", // sand — 第四系列
          5: "#4d4c48", // ink — 第五系列
        },
      },

      // ── 字体家族 ─────────────────────────────────────────────────────────
      fontFamily: {
        // display: Fraunces (类 Anthropic Serif，500 权重)
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        // sans: Inter (类 Anthropic Sans)
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        // mono: JetBrains Mono
        mono: ["var(--font-jetbrains)", "'JetBrains Mono'", "'Fira Code'", "monospace"],
      },

      // ── 字号（含行高）──────────────────────────────────────────────────────
      fontSize: {
        // display / 标题层
        display: ["4rem", { lineHeight: "1.10", fontWeight: "500" }],       // 64px
        section: ["3.25rem", { lineHeight: "1.20", fontWeight: "500" }],    // 52px
        "subhead-lg": ["2.25rem", { lineHeight: "1.30", fontWeight: "500" }], // 36px
        subhead: ["2rem", { lineHeight: "1.10", fontWeight: "500" }],       // 32px
        "subhead-sm": ["1.625rem", { lineHeight: "1.20", fontWeight: "500" }], // 26px
        feature: ["1.3125rem", { lineHeight: "1.20", fontWeight: "500" }],  // 21px
        // body 层
        "body-serif": ["1.0625rem", { lineHeight: "1.60" }],                // 17px serif
        "body-lg": ["1.25rem", { lineHeight: "1.60" }],                     // 20px
        body: ["1.0625rem", { lineHeight: "1.60" }],                        // 17px
        "body-sm": ["0.9375rem", { lineHeight: "1.60" }],                   // 15px
        caption: ["0.875rem", { lineHeight: "1.43" }],                      // 14px
        label: ["0.75rem", { lineHeight: "1.50", letterSpacing: "0.12px" }], // 12px
        code: ["0.9375rem", { lineHeight: "1.60", letterSpacing: "-0.32px" }], // 15px
      },

      // ── 阴影（elevation 系统）────────────────────────────────────────────
      boxShadow: {
        // Level 1: ring border (interactive elements)
        "ring-warm": "0px 0px 0px 1px #d1cfc5",
        "ring-terracotta": "0px 0px 0px 1px #c96442",
        "ring-deep": "0px 0px 0px 1px #c2c0b6",
        "ring-dark": "0px 0px 0px 1px #30302e",
        // Level 3: whisper elevation (feature cards)
        whisper: "rgba(0,0,0,0.05) 0px 4px 24px",
        // 组合：按钮标准 ring
        "btn-sand": "0px 0px 0px 0px #e8e6dc, 0px 0px 0px 1px #d1cfc5",
        "btn-terracotta": "0px 0px 0px 0px #c96442, 0px 0px 0px 1px #c96442",
      },

      // ── 圆角 ──────────────────────────────────────────────────────────────
      borderRadius: {
        // 延用默认 + 扩展大圆角
        "2xl": "1rem",    // 16px — 功能卡片
        "3xl": "1.5rem",  // 24px — 高亮容器
        "4xl": "2rem",    // 32px — Hero 容器、大媒体卡片
      },

      // ── 容器最大宽度 ──────────────────────────────────────────────────────
      maxWidth: {
        container: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
