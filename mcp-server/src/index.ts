#!/usr/bin/env node

/**
 * NiagaraDataAnalyst MCP服务器
 * 通过Model Context Protocol暴露作品集数据
 * 允许AI助手（如Claude Desktop）查询个人信息、技能、项目经验
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { portfolioData } from './data.js';

/** 创建MCP服务器实例 */
const server = new Server(
  {
    name: 'niagaradataanalyst-portfolio',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  },
);

// ==================== Resources ====================

/** 列出所有可用资源 */
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: 'portfolio://profile',
      name: 'Profile',
      description: 'Personal profile: name, title, location, summary',
      mimeType: 'application/json',
    },
    {
      uri: 'portfolio://skills',
      name: 'Skills',
      description: 'Technical skills organized by category',
      mimeType: 'application/json',
    },
    {
      uri: 'portfolio://projects',
      name: 'Projects',
      description: 'Project portfolio with details and highlights',
      mimeType: 'application/json',
    },
    {
      uri: 'portfolio://experience',
      name: 'Experience',
      description: 'Work experience and career highlights',
      mimeType: 'application/json',
    },
    {
      uri: 'portfolio://contact',
      name: 'Contact',
      description: 'Contact information',
      mimeType: 'application/json',
    },
  ],
}));

/** 读取资源内容 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;

  const resourceMap: Record<string, unknown> = {
    'portfolio://profile': portfolioData.profile,
    'portfolio://skills': portfolioData.skills,
    'portfolio://projects': portfolioData.projects,
    'portfolio://experience': portfolioData.experience,
    'portfolio://contact': portfolioData.contact,
  };

  const data = resourceMap[uri];
  if (!data) {
    throw new Error(`Resource not found: ${uri}`);
  }

  return {
    contents: [
      {
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
});

// ==================== Tools ====================

/** 列出所有可用工具 */
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'search_skills',
      description: 'Search skills by keyword. Returns matching skill categories and skills.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          keyword: {
            type: 'string',
            description: 'Keyword to search for in skills (e.g., "AI", "Python", "serverless")',
          },
        },
        required: ['keyword'],
      },
    },
    {
      name: 'match_job',
      description: 'Analyze a job description and match it against portfolio skills. Returns skill matching analysis.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          description: {
            type: 'string',
            description: 'Job description text to analyze',
          },
        },
        required: ['description'],
      },
    },
    {
      name: 'get_project_detail',
      description: 'Get detailed information about a specific project.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          name: {
            type: 'string',
            description: 'Project name (e.g., "InterviewPass", "NiagaraDataAnalyst Portfolio")',
          },
        },
        required: ['name'],
      },
    },
  ],
}));

/** 执行工具 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'search_skills': {
      const keyword = (args?.keyword as string || '').toLowerCase();
      const matches = portfolioData.skills
        .map((cat) => ({
          category: cat.category,
          matchedSkills: cat.skills.filter((s) => s.toLowerCase().includes(keyword)),
        }))
        .filter((cat) => cat.matchedSkills.length > 0);

      return {
        content: [
          {
            type: 'text' as const,
            text: matches.length > 0
              ? JSON.stringify({ keyword, results: matches }, null, 2)
              : `No skills found matching "${keyword}". Try broader terms like "AI", "data", "architecture", etc.`,
          },
        ],
      };
    }

    case 'match_job': {
      const jd = (args?.description as string || '').toLowerCase();
      const allSkills = portfolioData.skills.flatMap((cat) =>
        cat.skills.map((s) => ({ category: cat.category, skill: s })),
      );

      const matched = allSkills.filter((s) =>
        jd.includes(s.skill.toLowerCase()) ||
        s.skill.toLowerCase().split(/[\s/()]+/).some((word) => word.length > 2 && jd.includes(word)),
      );

      const matchPercentage = Math.min(100, Math.round((matched.length / Math.max(1, allSkills.length)) * 100 * 3));

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              matchedSkills: matched,
              totalSkillsMatched: matched.length,
              estimatedMatchPercentage: matchPercentage,
              profile: portfolioData.profile,
              recommendation: matchPercentage > 60
                ? 'Strong match — this candidate has extensive relevant experience.'
                : matchPercentage > 30
                  ? 'Moderate match — core skills align but some areas may need development.'
                  : 'Partial match — transferable skills exist but specific experience may differ.',
            }, null, 2),
          },
        ],
      };
    }

    case 'get_project_detail': {
      const projectName = (args?.name as string || '').toLowerCase();
      const project = portfolioData.projects.find((p) =>
        p.name.toLowerCase().includes(projectName),
      );

      if (!project) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Project "${args?.name}" not found. Available projects: ${portfolioData.projects.map((p) => p.name).join(', ')}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(project, null, 2),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// ==================== 启动服务器 ====================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('NiagaraDataAnalyst MCP Server started');
}

main().catch(console.error);
