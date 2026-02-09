# NiagaraDataAnalyst — 个人作品集网站

> **AI时代一人军团** — 产品 × 架构 × 数据

双语（中/英）个人作品集网站，展示18年软件架构经验，以 InterviewPass 项目为核心案例研究，涵盖无服务器架构、AI集成与数据工程的综合能力。

**线上地址:** [https://niagaradataanalyst.com](https://niagaradataanalyst.com)

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 14 (App Router, `src/` 目录) |
| 语言 | TypeScript 5 |
| 样式 | Tailwind CSS 3.4 |
| 图表 | Recharts 3.7 |
| 流程图 | ReactFlow 11 |
| AI 后端 | Google Cloud Vertex AI (`@google-cloud/vertexai` 1.10) — Gemini 模型 |
| MCP | `@modelcontextprotocol/sdk` 1.0（独立子包） |
| SEO | Next.js Metadata API + JSON-LD (`schema-dts`) |
| 测试 | Jest 30 + `@testing-library/react` + `@fast-check/jest` |
| 部署 | Vercel |

---

## 项目结构

```
niagaradataanalyst/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 根布局 + 全局 Metadata + LanguageProvider + AiAgentWidget
│   │   ├── page.tsx                # 首页 (HeroSection + CapabilityCards + JSON-LD)
│   │   ├── robots.ts               # 动态 robots.txt
│   │   ├── sitemap.ts              # 动态 sitemap.xml
│   │   ├── globals.css             # 全局样式 + 暗色主题 + 自定义动画
│   │   ├── case-study/page.tsx     # 案例研究 (PipelineSimulator + InteractiveArch + AiInsight)
│   │   ├── data-analysis/page.tsx  # 数据分析方法论 (技术指标 + 统计建模)
│   │   ├── architecture/page.tsx   # 架构页（占位）
│   │   ├── about/page.tsx          # 关于页（占位）
│   │   └── api/chat/route.ts       # Vertex AI 聊天 API (流式响应)
│   ├── components/
│   │   ├── Navbar.tsx              # 全局导航 (5 链接 + 语言切换 + 移动端菜单)
│   │   ├── LanguageToggle.tsx      # 中/En 切换按钮
│   │   ├── HeroSection.tsx         # 英雄区块 (渐变文本 + 无限循环 SVG)
│   │   ├── CapabilityCards.tsx     # 3 张能力卡片 (工程/AI/数据)
│   │   ├── PipelineSimulator.tsx   # 终端控制台 + Recharts 置信度图表
│   │   ├── InteractiveArch.tsx     # ReactFlow 6 节点架构图
│   │   ├── AiInsightSection.tsx    # AI 技术理解展示 (Prompt/RAG/Agent/MCP/Vertex)
│   │   ├── AiAgentWidget.tsx       # 浮动 AI 聊天 (呼吸动画 + 流式回复 + 工作匹配)
│   │   ├── DataAnalysisShowcase.tsx    # 数据分析 4 步方法论主组件
│   │   ├── TechnicalIndicatorChart.tsx # MA/EMA/RSI/MACD/布林带 交互图表
│   │   └── StatisticalModelPanel.tsx   # 收益率分布/相关性/回归/假设检验
│   ├── contexts/
│   │   └── LanguageContext.tsx     # 语言状态 + t() 翻译函数 + localStorage 持久化
│   ├── data/
│   │   ├── translations.ts         # 中英文完整翻译 (所有页面/组件)
│   │   ├── ai-persona.ts           # AI 助手系统提示词 + 作品集知识库
│   │   └── synthetic-stock-data.ts # 合成股票数据 + 技术指标计算函数
│   └── types/
│       └── index.ts                # 全局 TypeScript 接口定义
├── mcp-server/                     # 独立 MCP 服务器包
│   ├── src/
│   │   ├── index.ts                # MCP 服务器入口 (Resources + Tools)
│   │   └── data.ts                 # 作品集数据
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── jest.config.ts
├── jest.setup.ts
├── next.config.mjs
├── postcss.config.mjs
├── .env.local.example              # 环境变量模板
├── CLAUDE.md                       # Claude Code 项目指引
├── requirements.md                 # 需求文档 (R1-R13)
├── design.md                       # 设计文档 (架构 + 9 个正确性属性)
└── tasks.md                        # 任务文档 (Task 0-17)
```

---

## 本地开发

### 前置条件

- **Node.js** >= 18
- **npm** >= 9
- （可选）Google Cloud 服务账号 — 仅 AI 聊天功能需要

### 安装与启动

```bash
# 1. 克隆仓库
git clone https://github.com/<your-org>/niagaradataanalyst.git
cd niagaradataanalyst

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local 填入实际值（见下方「环境变量」章节）

# 4. 启动开发服务器
npm run dev
# → http://localhost:3000
```

### 常用命令

| 命令 | 用途 |
|------|------|
| `npm run dev` | 启动开发服务器 (localhost:3000) |
| `npm run build` | 生产构建 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | ESLint 检查 |

> **注意:** 未配置 Vertex AI 凭证时，AI 聊天功能会自动回退到预设的离线回复，不影响其他功能。

---

## 环境变量

在项目根目录创建 `.env.local`，参考 `.env.local.example`：

```bash
# ============================
# Google Cloud Vertex AI 配置
# ============================
# GCP 项目 ID（在 GCP Console → 项目设置中获取）
GCP_PROJECT_ID=your-project-id

# Vertex AI 区域（推荐 us-central1，延迟低、模型全）
GCP_LOCATION=us-central1

# 服务账号密钥文件路径
# 本地开发：下载 JSON 密钥文件，填写绝对路径
# Vercel 部署：不需要此变量，改用 GOOGLE_APPLICATION_CREDENTIALS_JSON（见部署章节）
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json

# ============================
# 网站配置
# ============================
# 站点 URL（用于 sitemap、Open Graph 等）
NEXT_PUBLIC_SITE_URL=https://niagaradataanalyst.com

# ============================
# Google Search Console 验证
# ============================
# 在 Google Search Console 获取 HTML 标签验证码
# 只需填 content 值，例如：abc123xyz
GOOGLE_SITE_VERIFICATION=your-verification-code
```

### Vertex AI 服务账号配置

1. 打开 [GCP Console](https://console.cloud.google.com/)
2. 导航到 **IAM & Admin → Service Accounts**
3. 创建服务账号，授予角色 **Vertex AI User** (`roles/aiplatform.user`)
4. 创建 JSON 密钥并下载
5. 将密钥路径填入 `GOOGLE_APPLICATION_CREDENTIALS`

---

## Vercel 部署

### 方式一：通过 Vercel Dashboard（推荐）

1. 在 [vercel.com](https://vercel.com) 导入 Git 仓库
2. 框架自动识别为 **Next.js**
3. 在 **Settings → Environment Variables** 中添加以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `GCP_PROJECT_ID` | `your-project-id` | GCP 项目 ID |
| `GCP_LOCATION` | `us-central1` | Vertex AI 区域 |
| `GOOGLE_APPLICATION_CREDENTIALS_JSON` | `{ ... }` | 服务账号 JSON 密钥的**完整内容**（不是文件路径） |
| `NEXT_PUBLIC_SITE_URL` | `https://niagaradataanalyst.com` | 站点 URL |
| `GOOGLE_SITE_VERIFICATION` | `abc123xyz` | Search Console 验证码 |

> **重要:** Vercel 环境中不能使用文件路径。需要将 JSON 密钥文件的完整内容粘贴到 `GOOGLE_APPLICATION_CREDENTIALS_JSON` 变量中。如果 Vertex AI SDK 不直接支持此方式，可在 API Route 中通过 `JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)` 手动解析并传递凭证。

4. 点击 **Deploy** — Vercel 会自动执行 `npm run build`

### 方式二：通过 Vercel CLI

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 链接项目（首次）
vercel link

# 4. 设置环境变量
vercel env add GCP_PROJECT_ID
vercel env add GCP_LOCATION
vercel env add GOOGLE_APPLICATION_CREDENTIALS_JSON
vercel env add NEXT_PUBLIC_SITE_URL
vercel env add GOOGLE_SITE_VERIFICATION

# 5. 部署预览
vercel

# 6. 部署到生产
vercel --prod
```

### 自定义域名

1. 在 Vercel Dashboard → **Settings → Domains**
2. 添加 `niagaradataanalyst.com`
3. 按照提示在域名注册商处添加 DNS 记录：
   - **A 记录:** `76.76.21.21`
   - **CNAME:** `cname.vercel-dns.com`（用于 `www` 子域名）
4. 等待 DNS 生效（通常 < 10 分钟），Vercel 自动配置 HTTPS

### 部署后验证清单

- [ ] 首页正常加载，语言切换工作
- [ ] 所有 5 个导航链接可跳转
- [ ] `/robots.txt` 返回正确内容
- [ ] `/sitemap.xml` 列出所有页面
- [ ] 查看网页源代码确认 JSON-LD 存在
- [ ] AI 聊天按钮出现，点击可展开
- [ ] （配置 Vertex AI 后）AI 聊天返回流式回复
- [ ] 移动端响应式正常
- [ ] Open Graph 元数据正确（可用 [opengraph.xyz](https://www.opengraph.xyz/) 检查）

---

## MCP 服务器

独立的 Model Context Protocol 服务器，允许 AI 助手（如 Claude Desktop）通过标准协议查询作品集数据。

### 安装与构建

```bash
cd mcp-server
npm install
npm run build
```

### 在 Claude Desktop 中配置

编辑 `~/.claude/claude_desktop_config.json`：

```json
{
  "mcpServers": {
    "niagaradataanalyst": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server/dist/index.js"]
    }
  }
}
```

重启 Claude Desktop 后即可使用。

### 可用资源 (Resources)

| URI | 内容 |
|-----|------|
| `portfolio://profile` | 个人简介 — 姓名、头衔、经验、简介 |
| `portfolio://skills` | 技术技能 — 按分类组织（架构/AI/数据/前端/后端/云/产品） |
| `portfolio://projects` | 项目列表 — InterviewPass、作品集网站及详情 |
| `portfolio://experience` | 工作经验 — 18年架构经验及亮点 |
| `portfolio://contact` | 联系方式 — 网站、Twitter、位置 |

### 可用工具 (Tools)

| 工具 | 参数 | 用途 |
|------|------|------|
| `search_skills` | `keyword: string` | 按关键词搜索匹配的技能 |
| `match_job` | `description: string` | 分析职位描述与技能的匹配度 |
| `get_project_detail` | `name: string` | 获取指定项目的详细信息 |

---

## SEO 配置

网站内置完整的 SEO 基础设施：

| 功能 | 实现方式 | 文件 |
|------|----------|------|
| 页面元数据 | Next.js Metadata API (`export const metadata`) | 每个 `page.tsx` |
| 全局元数据 | title template、description、keywords、OG、Twitter | `layout.tsx` |
| robots.txt | 动态生成，允许爬取公开页面，禁止 `/api/` | `robots.ts` |
| sitemap.xml | 动态生成，包含所有 5 个公开页面 | `sitemap.ts` |
| JSON-LD | schema.org Person 结构化数据 | `page.tsx`（首页） |
| Google 验证 | HTML meta 标签 | `layout.tsx` 中的 `verification.google` |

### Google Search Console 接入

1. 访问 [search.google.com/search-console](https://search.google.com/search-console)
2. 添加资源 → 输入 `https://niagaradataanalyst.com`
3. 选择 **HTML 标签** 验证方式
4. 复制 `content` 值填入环境变量 `GOOGLE_SITE_VERIFICATION`
5. 部署后点击验证
6. 在 Search Console 中提交 Sitemap：`https://niagaradataanalyst.com/sitemap.xml`

### 关键词策略

覆盖 4 大领域：

- **AI:** AI Engineer, AI工程师, LLM Integration, Prompt Engineering, RAG, MCP
- **软件开发:** Software Architect, 软件架构师, Serverless, AWS Lambda
- **数据分析:** Data Analyst, 数据分析, Data Pipeline, Snowflake, Airbyte
- **产品设计:** Product Design, 产品设计, 0-to-1 Development

---

## 页面路由

| 路径 | 页面 | 关键组件 |
|------|------|----------|
| `/` | 首页 | HeroSection, CapabilityCards, JSON-LD |
| `/case-study` | InterviewPass 案例研究 | PipelineSimulator, InteractiveArch, AiInsightSection |
| `/data-analysis` | 数据分析方法论 | DataAnalysisShowcase (4步: 探索→指标→建模→结论) |
| `/architecture` | 系统架构设计 | 占位（待扩展） |
| `/about` | 关于 | 占位（待扩展） |
| `/api/chat` | AI 聊天 API | Vertex AI 流式响应 (POST) |

---

## 双语系统

- 所有 UI 文本通过 `useLanguage()` Hook 的 `t('key.path')` 函数获取
- 翻译数据集中在 `src/data/translations.ts`，结构化键值对
- 语言偏好通过 `localStorage` 持久化
- `<html lang>` 属性随语言切换动态更新
- 中文为主要语言，英文为辅助语言

---

## 编码规范

| 规范 | 要求 |
|------|------|
| 注释语言 | 中文 |
| 组件命名 | PascalCase (`HeroSection.tsx`) |
| 函数/变量 | camelCase (`setLanguage`) |
| 样式 | 仅 Tailwind CSS，禁止内联样式和 CSS Modules |
| UI 文本 | 必须通过 `t()` 函数，禁止硬编码 |
| 翻译键 | 点分隔路径 (`nav.home`, `hero.title`) |
| 重型库 | `next/dynamic` 懒加载 (ReactFlow) |
| API 安全 | Vertex AI 凭证仅服务端使用 |

---

## 许可证

私有项目，保留所有权利。

© 2024 NiagaraDataAnalyst
