# NiagaraDataAnalyst MCP Server

通过 Model Context Protocol 暴露个人作品集数据的 MCP 服务器。

## 安装

```bash
cd mcp-server
npm install
npm run build
```

## Claude Desktop 配置

在 `~/.claude/claude_desktop_config.json` 中添加：

```json
{
  "mcpServers": {
    "niagaradataanalyst": {
      "command": "node",
      "args": ["/path/to/mcp-server/dist/index.js"]
    }
  }
}
```

## 可用资源 (Resources)

| URI | 描述 |
|-----|------|
| `portfolio://profile` | 个人简介：姓名、头衔、位置、简介 |
| `portfolio://skills` | 按分类组织的技术技能 |
| `portfolio://projects` | 项目列表及详情 |
| `portfolio://experience` | 工作经验 |
| `portfolio://contact` | 联系方式 |

## 可用工具 (Tools)

| 工具名 | 描述 |
|--------|------|
| `search_skills(keyword)` | 按关键词搜索技能 |
| `match_job(description)` | 分析职位描述并匹配能力 |
| `get_project_detail(name)` | 获取项目详情 |
