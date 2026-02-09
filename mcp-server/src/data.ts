/**
 * 作品集数据
 * 提供MCP服务器暴露的所有资源数据
 * 与网站翻译数据保持一致
 */

export const portfolioData = {
  profile: {
    name: 'NiagaraDataAnalyst (Xin)',
    title: 'AI & Data Architect | Software Architect',
    tagline: 'AI-Era One-Person Army: Product × Architecture × Data',
    location: 'Niagara, Canada',
    website: 'https://niagaradataanalyst.com',
    experience: '18 years of software architecture',
    summary: 'Full-stack engineer with 18 years of software architecture experience, specializing in AI integration, data engineering, and product design. Built InterviewPass from 0 to 1 — an AI-powered technical interview platform demonstrating the ability to single-handedly deliver product design, system architecture, and data engineering.',
  },

  skills: [
    {
      category: 'Software Architecture',
      skills: ['Microservices', 'Serverless (AWS Lambda)', 'Event-Driven Architecture', 'API Design', 'System Design'],
    },
    {
      category: 'AI & Machine Learning',
      skills: ['LLM Integration', 'Prompt Engineering', 'RAG Architecture', 'Vertex AI (Gemini)', 'Amazon Rekognition', 'MCP Protocol', 'Agent Architecture'],
    },
    {
      category: 'Data Engineering',
      skills: ['Snowflake', 'Airbyte', 'ETL/ELT', 'Data Pipeline', 'SQL', 'Python (Pandas, NumPy)', 'Data Warehouse Design'],
    },
    {
      category: 'Frontend',
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Responsive Design', 'Recharts', 'ReactFlow'],
    },
    {
      category: 'Backend',
      skills: ['Node.js', 'Python', 'AWS Lambda', 'API Gateway', 'DynamoDB', 'REST API'],
    },
    {
      category: 'Cloud & Infrastructure',
      skills: ['AWS (Lambda, Kinesis, API Gateway, DynamoDB, S3)', 'GCP (Vertex AI)', 'Vercel', 'CI/CD'],
    },
    {
      category: 'Product & Design',
      skills: ['0-to-1 Product Development', 'User Experience Design', 'Product Strategy', 'Agile Development'],
    },
  ],

  projects: [
    {
      name: 'InterviewPass',
      url: 'https://interviewpass.me',
      description: 'AI-powered technical interview assistant platform. End-to-end solution integrating video stream processing, facial expression analysis, LLM evaluation, and data analytics.',
      technologies: ['AWS Lambda', 'Kinesis Video Streams', 'Amazon Rekognition', 'DynamoDB', 'Airbyte', 'Snowflake', 'React', 'LLM'],
      highlights: [
        '100% Serverless architecture — zero ops, infinite scale',
        'Real-time video analysis with Rekognition facial expression detection',
        'LLM-powered interview evaluation with structured feedback',
        'Complete data pipeline: DynamoDB → Airbyte CDC → Snowflake → Analytics',
        'From 0 to 1: product design, architecture, development, data — all by one person',
      ],
      role: 'Sole Developer & Architect',
    },
    {
      name: 'NiagaraDataAnalyst Portfolio',
      url: 'https://niagaradataanalyst.com',
      description: 'Personal portfolio website with AI assistant and MCP server, demonstrating modern web development and AI integration capabilities.',
      technologies: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Vertex AI', 'MCP SDK', 'Recharts', 'ReactFlow'],
      highlights: [
        'Bilingual (Chinese/English) with React Context language system',
        'Vertex AI-powered chat assistant with job matching mode',
        'MCP server for AI-accessible portfolio data',
        'Interactive architecture diagram with ReactFlow',
        'Data analysis methodology showcase with synthetic data',
        'SEO optimized with JSON-LD, sitemap, robots.txt',
      ],
      role: 'Developer',
    },
  ],

  experience: [
    {
      role: 'Software Architect / Full-Stack Engineer',
      period: '18 years',
      description: 'Extensive experience in software architecture spanning frontend, backend, AI integration, data engineering, and product design. Specialized in serverless architectures, real-time data processing, and AI-powered applications.',
      highlights: [
        'Designed and implemented multiple production-scale serverless systems',
        'Integrated AI/ML services into production applications',
        'Built end-to-end data pipelines from ingestion to analytics',
        'Led product development from conception to deployment',
      ],
    },
  ],

  contact: {
    website: 'https://niagaradataanalyst.com',
    twitter: '@Osmond_Xin',
    location: 'Niagara, Canada',
  },
};
