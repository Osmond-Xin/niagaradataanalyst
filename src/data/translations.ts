/**
 * 翻译数据
 * 包含中英文完整翻译，覆盖所有页面和组件
 * 所有UI文本通过t()函数从此文件获取
 */

export const translations = {
  zh: {
    nav: {
      home: '首页',
      caseStudy: 'InterviewPass案例',
      dataAnalysis: '数据分析',
      architecture: '架构',
      about: '关于',
      logo: 'NiagaraDataAnalyst',
    },
    hero: {
      title: 'AI时代一人军团',
      subtitle: '产品 × 架构 × 数据',
      description: '18年软件架构经验，专注于无服务器架构、AI集成和数据工程。从0到1打造InterviewPass——一个AI驱动的技术面试平台。',
      cta: '查看案例研究',
    },
    capabilities: {
      sectionTitle: '能力证明',
      engineering: {
        title: '工程能力',
        description: '100% 无服务器架构',
        details: '基于AWS Lambda和Kinesis视频流构建的高可用、零运维架构，支撑实时视频处理和AI分析管道。',
        tech: 'AWS Lambda, Kinesis, API Gateway, DynamoDB',
      },
      ai: {
        title: 'AI与视觉',
        description: 'AI集成与计算机视觉',
        details: '集成Amazon Rekognition实现面部表情分析，LLM驱动的面试评估引擎，Vertex AI聊天助手。',
        tech: 'Rekognition, LLM, Vertex AI, Prompt Engineering',
      },
      data: {
        title: '数据循环',
        description: '数据管道与分析',
        details: '使用Airbyte构建数据同步管道，Snowflake数据仓库实现多维分析，完整的数据驱动决策循环。',
        tech: 'Airbyte, Snowflake, Python, SQL',
      },
    },
    caseStudy: {
      title: 'InterviewPass: 技术面试AI助手',
      description: '端到端的技术面试解决方案，集成视频流处理、AI分析和数据管道',
      pageTitle: 'InterviewPass 案例研究',
      pageDescription: '深入了解InterviewPass项目的架构设计、技术实现和数据工程',
      simulation: {
        title: '实时处理模拟',
        subtitle: '数据管道可视化',
        videoProcessing: '视频流处理中...',
        aiAnalysis: 'AI分析进行中...',
        confidenceScore: '置信度分数',
        startSimulation: '开始模拟',
        resetSimulation: '重置',
      },
      architecture: {
        title: '系统架构',
        subtitle: '点击节点查看详细信息',
        closePanel: '关闭',
        technologies: '技术栈',
        specifications: '技术规格',
      },
    },
    aiInsight: {
      sectionTitle: 'AI技术理解与应用',
      sectionDescription: '展示对前沿AI技术的深度理解和实际应用能力',
      promptEngineering: {
        title: 'Prompt Engineering',
        description: '系统提示词设计、Few-shot学习、Chain-of-Thought推理。在InterviewPass中设计了面试评估提示词系统，实现结构化面试反馈生成。',
      },
      rag: {
        title: 'RAG架构',
        description: '检索增强生成架构设计。理解向量数据库、文档分块、语义搜索和上下文注入的完整流程。',
      },
      agent: {
        title: 'Agent架构',
        description: '基于LLM的自主Agent设计。理解工具调用、规划-执行循环、多Agent协作架构。本网站的AI助手即为Agent实践。',
      },
      mcp: {
        title: 'MCP协议',
        description: 'Model Context Protocol实现。本网站配套MCP服务器，允许AI助手通过标准协议获取作品集数据，展示对前沿AI协议的掌握。',
      },
      vertexAi: {
        title: 'Vertex AI集成',
        description: '使用Google Cloud Vertex AI (Gemini) 驱动本网站的AI聊天助手。实现流式响应、系统提示词注入、上下文管理。',
      },
    },
    dataAnalysis: {
      pageTitle: '数据分析方法论',
      pageDescription: '展示数据分析全流程：数据探索、技术指标计算、统计建模、可视化分析',
      overview: '方法论概述',
      overviewDescription: '使用合成股票数据展示完整的数据分析流程，重点展示方法论和技术能力而非具体交易策略。',
      step1: {
        title: '第一步：数据探索与清洗',
        description: '对原始数据进行统计描述和质量检查',
        stats: '统计摘要',
        mean: '均值',
        std: '标准差',
        min: '最小值',
        max: '最大值',
        skewness: '偏度',
        kurtosis: '峰度',
      },
      step2: {
        title: '第二步：技术指标计算与可视化',
        description: '计算并可视化常用技术分析指标',
        ma: '移动平均线 (MA)',
        ema: '指数移动平均 (EMA)',
        rsi: '相对强弱指标 (RSI)',
        macd: 'MACD指标',
        bollinger: '布林带',
        overbought: '超买区域',
        oversold: '超卖区域',
        price: '价格',
        volume: '成交量',
      },
      step3: {
        title: '第三步：统计建模',
        description: '运用统计方法进行深度分析',
        returnDistribution: '收益率分布',
        correlationMatrix: '相关性矩阵',
        regression: '线性回归',
        hypothesisTest: '假设检验',
        normalFit: '正态分布拟合',
        frequency: '频率',
        returns: '收益率',
      },
      step4: {
        title: '第四步：分析结论与决策框架',
        description: '综合多指标信号形成分析结论',
        signalSummary: '信号汇总',
        methodology: '方法论总结',
        bullish: '看多',
        bearish: '看空',
        neutral: '中性',
      },
    },
    architecture: {
      pageTitle: '架构设计哲学',
      pageDescription: '基于创业小团队的务实架构方法论',
      hero: {
        title: '架构设计哲学',
        subtitle: '基于创业小团队的务实架构方法论',
        description: '20年经验沉淀的10条实战原则。不是教科书理论，是踩过坑后的选择。',
      },
      principles: {
        sectionTitle: '设计哲学',
        groupA: {
          title: '选型决策',
          p1: {
            title: '稳定方案优先',
            description: '选用产品化、稳定的解决方案（如云服务）。小团队人力有限，不能在方案稳定性上消耗时间。',
          },
          p2: {
            title: '站在巨人肩上',
            description: '参考行业先进案例。你不是第一个遇到这个问题的人，借助前人经验才能走得更远。',
          },
          p3: {
            title: '性价比先行',
            description: '昂贵方案是收益的大敌。MVP阶段用按需付费的无服务器架构，有可预期流量后再切到固定服务。',
          },
        },
        groupB: {
          title: '工程纪律',
          p4: {
            title: '文档先行，规范先行',
            description: '写代码时应该已把一切情况考虑完成，而不是边写边研究。',
          },
          p5: {
            title: '测试一票否决',
            description: '没有测试的产品不可上线。任何变动，哪怕是依赖的小版本变化，都需要测试。',
          },
          p6: {
            title: '新技术要有针对性',
            description: '新技术一定解决某个具体问题，全量替换基本不可能。研究和上线必须有明确目标。',
          },
        },
        groupC: {
          title: '运维保障',
          p7: {
            title: '多套监控冗余',
            description: '监控通知不能只有一套，自动打电话+自动发消息。生产事故比想象中多，确保减少影响。',
          },
          p8: {
            title: '高可用性是功能',
            description: '高可用不能停留在理论上，要让非技术人员理解，明显地成为功能的一部分。',
          },
        },
        groupD: {
          title: '团队文化',
          p9: {
            title: '出事主动沟通',
            description: '没准备好的事总会发生。出事主动沟通，不掩盖不粉饰，做好复盘。',
          },
          p10: {
            title: '复盘是最后一步',
            description: '没有反思和总结的开发不是开发，没有反思和总结的项目不是项目。',
          },
        },
      },
      showcase: {
        sectionTitle: '项目架构案例',
        sectionSubtitle: '不是纸上谈兵——用实际项目证明设计哲学',
        relatedPrinciples: '关联原则',
        viewCaseStudy: '查看案例研究',
        interviewpass: {
          title: 'InterviewPass',
          subtitle: '100% 无服务器架构',
          point1: '按需付费零闲置成本',
          point2: 'AWS 托管服务免运维',
          point3: 'Kinesis+Lambda 事件驱动',
        },
        iqidao: {
          title: '爱棋道',
          subtitle: 'AWS 官方案例 · 从巨石到微服务的完整演进',
          yearsLabel: '7年架构演进',
          phase1: {
            title: '阶段一：巨石应用',
            description: '创业初期，单体应用 + 自建视频分发网络，快速上线验证业务',
          },
          phase2: {
            title: '阶段二：分布式拆分',
            description: '业务增长后购买专业视频分发服务，巨石应用拆分为分布式架构',
          },
          phase3: {
            title: '阶段三：服务化架构',
            description: '最终演进为以服务为核心的架构，99.9% 可用性，入选 AWS 官方案例',
          },
          summary: '对巨石、分布式、服务化三种常见架构形态都有实战经验',
        },
      },
    },
    about: {
      pageTitle: '关于我',
      pageDescription: '产品 × 技术双栖 | 20年经验的复合型人才',
      // ProfileHero
      hero: {
        name: 'Yi Xin',
        title: '产品经理 & 技术总监 & 数据分析师',
        location: 'Niagara Falls, Ontario, Canada',
        positioning: '不只是技术的纵深，更是技术+产品的稀缺组合',
        downloadResume: '下载简历',
      },
      // DualIdentity
      dual: {
        sectionTitle: '双栖身份',
        sectionSubtitle: '稀缺的产品×技术复合型人才',
        product: {
          title: '产品思维',
          items: {
            strategy: '产品战略规划',
            strategyDesc: '从0到1定义产品方向，把控产品生命周期',
            crossTeam: '跨团队协调',
            crossTeamDesc: '协调5+团队，推动跨职能协作',
            dataDecision: '数据驱动决策',
            dataDecisionDesc: '用数据验证假设，指导产品迭代',
            userExperience: '用户体验设计',
            userExperienceDesc: '以用户为中心的需求分析与体验优化',
            platformArch: '平台产品架构',
            platformArchDesc: 'SaaS平台产品设计，40%采用率提升',
          },
        },
        tech: {
          title: '技术纵深',
          items: {
            awsCert: 'AWS双认证',
            awsCertDesc: 'SAA + SAP，云架构专业能力认证',
            fullStack: '全栈开发',
            fullStackDesc: '前端到后端，从Lambda到DynamoDB的端到端交付',
            teamLead: '10+人团队管理',
            teamLeadDesc: '带领技术团队，100% KPI达成率',
            availability: '99.9%可用性',
            availabilityDesc: '企业级系统稳定性保障，AWS官方案例',
            globalDelivery: '跨国交付',
            globalDeliveryDesc: '日本野村证券现场交付，跨文化协作经验',
          },
        },
        crossValue: {
          title: '交叉价值',
          subtitle: '当产品思维遇上技术能力',
          item1: '从0到1独立交付',
          item1Desc: '独立完成InterviewPass全栈项目——从需求分析、产品设计到架构实现、部署上线',
          item2: '需求-架构-交付闭环',
          item2Desc: '能同时用产品语言与技术团队对话，也能用技术方案说服产品决策者',
        },
      },
      // CareerTimeline
      timeline: {
        sectionTitle: '职业历程',
        sectionSubtitle: '20年产品与技术的交织成长',
        tagProduct: '产品',
        tagTech: '技术',
        tagBoth: '产品+技术',
        entries: {
          unfc: {
            period: '2025 - 至今',
            title: '数据分析研究生',
            company: 'University of Niagara Falls Canada',
            description: 'GPA 4.11，专注数据分析方法论、机器学习和AI应用研究',
          },
          freelancer: {
            period: '2022 - 2024',
            title: '产品经理 & 软件工程师',
            company: '自由职业（北京）',
            description: '处理时间减少40%，客户满意度92%，独立交付多个全栈项目',
          },
          bailongma: {
            period: '2021 - 2022',
            title: '平台产品经理',
            company: '白龙马（网约车SaaS）',
            description: '车队效率提升25%，成本降低30%，推动CRM/资产/财务系统建设，平台采用率提升40%',
          },
          iqidao: {
            period: '2014 - 2021',
            title: '技术总监',
            company: '奇道科技（7年）',
            description: '管理10+人团队，开发成本降低35%，系统可用性99.9%，入选AWS官方案例，100% KPI达成',
          },
          trends: {
            period: '2013 - 2014',
            title: 'App开发总监',
            company: '趋势集团',
            description: 'LoveFashions App，10,000+ DAU，管理10+名工程师',
          },
          pangu: {
            period: '2013',
            title: '技术合作经理',
            company: '盘古文化',
            description: '协调10+团队的技术合作与项目管理',
          },
          startup: {
            period: '2012 - 2013',
            title: '开发经理',
            company: '创业项目',
            description: '20+ Microsoft Store应用，4+星评分，独立创业经历',
          },
          izp: {
            period: '2009 - 2012',
            title: 'Java开发经理',
            company: 'IZP',
            description: 'ZBOOS系统，J2EE+Oracle架构，业务增长200%',
          },
          yisiteng: {
            period: '2008 - 2009',
            title: '高级软件工程师',
            company: '亿思腾',
            description: '佳能中国官网(canon.com.cn)开发，99.9%运行时间',
          },
          zhongxun: {
            period: '2005 - 2007',
            title: '软件工程师',
            company: '中讯',
            description: '野村证券交易系统开发，赴日现场交付',
          },
        },
      },
      // Certifications
      certs: {
        sectionTitle: '认证与教育',
        certifications: '专业认证',
        education: '教育背景',
        pmp: { name: 'PMP', issuer: '项目管理协会 (PMI)', year: '2014' },
        awsSaa: { name: 'AWS SAA', issuer: 'Amazon Web Services', year: '2021' },
        awsSap: { name: 'AWS SAP', issuer: 'Amazon Web Services', year: '2021' },
        bupt: { name: '计算机科学 学士', issuer: '北京邮电大学', year: '2005' },
        unfc: { name: '数据分析 在读', issuer: 'University of Niagara Falls Canada', year: '2025' },
      },
      // SkillRadar
      radar: {
        sectionTitle: '能力雷达图',
        sectionSubtitle: '六维能力评估',
        productStrategy: '产品战略',
        techLeadership: '技术领导力',
        cloudArch: '云架构',
        fullStackDev: '全栈开发',
        dataAnalysis: '数据分析',
        crossFunc: '跨职能协作',
      },
      // KeyMetrics
      metrics: {
        sectionTitle: '关键数字',
        years: { value: '20+', label: '年经验' },
        team: { value: '10+', label: '人团队管理' },
        availability: { value: '99.9%', label: '系统可用性' },
        certs: { value: '3', label: '项专业认证' },
        satisfaction: { value: '92%', label: '客户满意度' },
        costReduction: { value: '35%', label: '成本降低' },
      },
    },
    ai: {
      widgetTitle: 'AI助手',
      chatTab: '聊天',
      jobMatchTab: '工作匹配',
      placeholder: '输入消息...',
      send: '发送',
      greeting: '你好！我是NiagaraDataAnalyst的AI助手。有什么我可以帮助你了解的吗？',
      jobMatchGreeting: '请粘贴职位描述，我会分析与NiagaraDataAnalyst技能的匹配程度。',
      thinking: '思考中...',
      error: '抱歉，出现了错误。请稍后再试。',
    },
    footer: {
      copyright: '© 2024 NiagaraDataAnalyst. 保留所有权利。',
    },
  },
  en: {
    nav: {
      home: 'Home',
      caseStudy: 'InterviewPass Case',
      dataAnalysis: 'Data Analysis',
      architecture: 'Architecture',
      about: 'About',
      logo: 'NiagaraDataAnalyst',
    },
    hero: {
      title: 'AI-Era One-Person Army',
      subtitle: 'Product × Architecture × Data',
      description: '18 years of software architecture experience, specializing in serverless architecture, AI integration, and data engineering. Built InterviewPass from 0 to 1 — an AI-powered technical interview platform.',
      cta: 'View Case Study',
    },
    capabilities: {
      sectionTitle: 'Proof of Capabilities',
      engineering: {
        title: 'Engineering',
        description: '100% Serverless Architecture',
        details: 'High-availability, zero-ops architecture built with AWS Lambda and Kinesis Video Streams, powering real-time video processing and AI analysis pipelines.',
        tech: 'AWS Lambda, Kinesis, API Gateway, DynamoDB',
      },
      ai: {
        title: 'AI & Vision',
        description: 'AI Integration & Computer Vision',
        details: 'Integrated Amazon Rekognition for facial expression analysis, LLM-powered interview evaluation engine, Vertex AI chat assistant.',
        tech: 'Rekognition, LLM, Vertex AI, Prompt Engineering',
      },
      data: {
        title: 'Data Loop',
        description: 'Data Pipeline & Analytics',
        details: 'Built data sync pipelines with Airbyte, Snowflake data warehouse for multi-dimensional analytics, complete data-driven decision loop.',
        tech: 'Airbyte, Snowflake, Python, SQL',
      },
    },
    caseStudy: {
      title: 'InterviewPass: AI-Powered Technical Interview Assistant',
      description: 'End-to-end technical interview solution integrating video stream processing, AI analysis, and data pipelines',
      pageTitle: 'InterviewPass Case Study',
      pageDescription: 'Deep dive into InterviewPass project architecture, technical implementation, and data engineering',
      simulation: {
        title: 'Real-time Processing Simulation',
        subtitle: 'Data Pipeline Visualization',
        videoProcessing: 'Processing video stream...',
        aiAnalysis: 'AI analysis in progress...',
        confidenceScore: 'Confidence Score',
        startSimulation: 'Start Simulation',
        resetSimulation: 'Reset',
      },
      architecture: {
        title: 'System Architecture',
        subtitle: 'Click nodes for details',
        closePanel: 'Close',
        technologies: 'Tech Stack',
        specifications: 'Specifications',
      },
    },
    aiInsight: {
      sectionTitle: 'AI Technology Understanding & Application',
      sectionDescription: 'Demonstrating deep understanding and practical application of cutting-edge AI technologies',
      promptEngineering: {
        title: 'Prompt Engineering',
        description: 'System prompt design, few-shot learning, chain-of-thought reasoning. Designed interview evaluation prompt system in InterviewPass for structured interview feedback generation.',
      },
      rag: {
        title: 'RAG Architecture',
        description: 'Retrieval-Augmented Generation architecture design. Understanding the complete flow of vector databases, document chunking, semantic search, and context injection.',
      },
      agent: {
        title: 'Agent Architecture',
        description: 'LLM-based autonomous agent design. Understanding tool calling, plan-execute loops, multi-agent collaboration. This website\'s AI assistant is an Agent in practice.',
      },
      mcp: {
        title: 'MCP Protocol',
        description: 'Model Context Protocol implementation. This website includes an MCP server allowing AI assistants to query portfolio data via standard protocol.',
      },
      vertexAi: {
        title: 'Vertex AI Integration',
        description: 'Powering this website\'s AI chat assistant with Google Cloud Vertex AI (Gemini). Implemented streaming responses, system prompt injection, and context management.',
      },
    },
    dataAnalysis: {
      pageTitle: 'Data Analysis Methodology',
      pageDescription: 'Full data analysis workflow: data exploration, technical indicator calculation, statistical modeling, visualization',
      overview: 'Methodology Overview',
      overviewDescription: 'Using synthetic stock data to demonstrate a complete data analysis workflow, focusing on methodology and technical skills rather than specific trading strategies.',
      step1: {
        title: 'Step 1: Data Exploration & Cleaning',
        description: 'Statistical description and quality check of raw data',
        stats: 'Statistical Summary',
        mean: 'Mean',
        std: 'Std Dev',
        min: 'Min',
        max: 'Max',
        skewness: 'Skewness',
        kurtosis: 'Kurtosis',
      },
      step2: {
        title: 'Step 2: Technical Indicator Calculation & Visualization',
        description: 'Calculate and visualize common technical analysis indicators',
        ma: 'Moving Average (MA)',
        ema: 'Exponential Moving Average (EMA)',
        rsi: 'Relative Strength Index (RSI)',
        macd: 'MACD Indicator',
        bollinger: 'Bollinger Bands',
        overbought: 'Overbought Zone',
        oversold: 'Oversold Zone',
        price: 'Price',
        volume: 'Volume',
      },
      step3: {
        title: 'Step 3: Statistical Modeling',
        description: 'Apply statistical methods for in-depth analysis',
        returnDistribution: 'Return Distribution',
        correlationMatrix: 'Correlation Matrix',
        regression: 'Linear Regression',
        hypothesisTest: 'Hypothesis Testing',
        normalFit: 'Normal Distribution Fit',
        frequency: 'Frequency',
        returns: 'Returns',
      },
      step4: {
        title: 'Step 4: Analysis Conclusions & Decision Framework',
        description: 'Synthesize multi-indicator signals into analysis conclusions',
        signalSummary: 'Signal Summary',
        methodology: 'Methodology Summary',
        bullish: 'Bullish',
        bearish: 'Bearish',
        neutral: 'Neutral',
      },
    },
    architecture: {
      pageTitle: 'Architecture Design Philosophy',
      pageDescription: 'A pragmatic architecture methodology for lean startup teams',
      hero: {
        title: 'Architecture Design Philosophy',
        subtitle: 'A pragmatic architecture methodology for lean startup teams',
        description: '10 battle-tested principles distilled from 20 years of experience. Not textbook theory — lessons learned from real-world challenges.',
      },
      principles: {
        sectionTitle: 'Design Philosophy',
        groupA: {
          title: 'Technology Selection',
          p1: {
            title: 'Stability First',
            description: 'Choose production-ready, stable solutions (e.g., managed cloud services). Small teams cannot afford to spend time on solution stability issues.',
          },
          p2: {
            title: 'Stand on Giants\' Shoulders',
            description: 'Reference industry best practices. You\'re not the first to face this problem — leverage others\' experience to go further.',
          },
          p3: {
            title: 'Cost-Effectiveness First',
            description: 'Expensive solutions are the enemy of ROI. Use pay-per-use serverless in MVP phase, switch to fixed services when traffic is predictable.',
          },
        },
        groupB: {
          title: 'Engineering Discipline',
          p4: {
            title: 'Documentation First, Standards First',
            description: 'All scenarios should be considered before coding begins, not researched on the fly.',
          },
          p5: {
            title: 'Testing Has Veto Power',
            description: 'No product ships without tests. Every change, even minor dependency updates, requires testing.',
          },
          p6: {
            title: 'New Tech Must Be Targeted',
            description: 'New technology must solve a specific problem. Full replacement is nearly impossible. Research and deployment must have clear goals.',
          },
        },
        groupC: {
          title: 'Operations & Reliability',
          p7: {
            title: 'Redundant Monitoring',
            description: 'Never rely on a single monitoring channel — auto-call + auto-message. Production incidents happen more than expected; ensure minimal impact.',
          },
          p8: {
            title: 'High Availability Is a Feature',
            description: 'HA cannot stay theoretical. Make it understandable to non-technical stakeholders and visibly part of the product.',
          },
        },
        groupD: {
          title: 'Team Culture',
          p9: {
            title: 'Proactive Communication When Issues Arise',
            description: 'Unexpected things will happen. Communicate proactively — don\'t hide or sugarcoat. Conduct proper post-mortems.',
          },
          p10: {
            title: 'Post-Mortem Is the Final Step',
            description: 'Development without reflection isn\'t development. A project without retrospective isn\'t a project.',
          },
        },
      },
      showcase: {
        sectionTitle: 'Project Architecture Cases',
        sectionSubtitle: 'Not just theory — real projects proving the design philosophy',
        relatedPrinciples: 'Related Principles',
        viewCaseStudy: 'View Case Study',
        interviewpass: {
          title: 'InterviewPass',
          subtitle: '100% Serverless Architecture',
          point1: 'Pay-per-use, zero idle cost',
          point2: 'AWS managed services, zero ops',
          point3: 'Kinesis+Lambda event-driven',
        },
        iqidao: {
          title: 'Iqidao',
          subtitle: 'AWS Official Case Study · Complete Monolith-to-Microservices Evolution',
          yearsLabel: '7-Year Architecture Evolution',
          phase1: {
            title: 'Phase 1: Monolith',
            description: 'Early startup stage — monolithic app + self-built video CDN, rapid launch to validate business',
          },
          phase2: {
            title: 'Phase 2: Distributed',
            description: 'After business growth, purchased professional video CDN, split monolith into distributed architecture',
          },
          phase3: {
            title: 'Phase 3: Service-Oriented',
            description: 'Evolved to service-oriented architecture, 99.9% availability, featured as AWS official case study',
          },
          summary: 'Hands-on experience with all three common architecture patterns: monolith, distributed, and service-oriented',
        },
      },
    },
    about: {
      pageTitle: 'About Me',
      pageDescription: 'Product × Tech Dual Identity | 20 Years of Compound Expertise',
      // ProfileHero
      hero: {
        name: 'Yi Xin',
        title: 'Product Manager & Tech Director & Data Analyst',
        location: 'Niagara Falls, Ontario, Canada',
        positioning: 'Not just technical depth — a rare combination of Product + Technology',
        downloadResume: 'Download Resume',
      },
      // DualIdentity
      dual: {
        sectionTitle: 'Dual Identity',
        sectionSubtitle: 'A rare Product × Tech compound talent',
        product: {
          title: 'Product Thinking',
          items: {
            strategy: 'Product Strategy',
            strategyDesc: 'Define product direction from 0 to 1, manage full product lifecycle',
            crossTeam: 'Cross-Team Coordination',
            crossTeamDesc: 'Coordinate 5+ teams, drive cross-functional collaboration',
            dataDecision: 'Data-Driven Decisions',
            dataDecisionDesc: 'Validate hypotheses with data, guide product iterations',
            userExperience: 'User Experience Design',
            userExperienceDesc: 'User-centric requirements analysis and experience optimization',
            platformArch: 'Platform Product Architecture',
            platformArchDesc: 'SaaS platform product design, 40% adoption increase',
          },
        },
        tech: {
          title: 'Technical Depth',
          items: {
            awsCert: 'AWS Dual Certified',
            awsCertDesc: 'SAA + SAP, professional cloud architecture certification',
            fullStack: 'Full-Stack Development',
            fullStackDesc: 'Front-end to back-end, end-to-end delivery from Lambda to DynamoDB',
            teamLead: '10+ Member Team',
            teamLeadDesc: 'Leading technical teams with 100% KPI achievement',
            availability: '99.9% Availability',
            availabilityDesc: 'Enterprise-grade system reliability, featured in AWS official case study',
            globalDelivery: 'Global Delivery',
            globalDeliveryDesc: 'On-site delivery at Nomura Securities Japan, cross-cultural collaboration',
          },
        },
        crossValue: {
          title: 'Cross-Over Value',
          subtitle: 'When Product Thinking Meets Technical Capability',
          item1: '0-to-1 Independent Delivery',
          item1Desc: 'Independently delivered InterviewPass full-stack project — from requirements analysis, product design to architecture implementation and deployment',
          item2: 'Requirements-Architecture-Delivery Loop',
          item2Desc: 'Can speak both product language to tech teams and use technical solutions to convince product decision makers',
        },
      },
      // CareerTimeline
      timeline: {
        sectionTitle: 'Career Journey',
        sectionSubtitle: '20 years of intertwined product and tech growth',
        tagProduct: 'Product',
        tagTech: 'Tech',
        tagBoth: 'Product+Tech',
        entries: {
          unfc: {
            period: '2025 - Present',
            title: 'Data Analytics Graduate Student',
            company: 'University of Niagara Falls Canada',
            description: 'GPA 4.11, focused on data analytics methodology, machine learning, and AI applications',
          },
          freelancer: {
            period: '2022 - 2024',
            title: 'Product Manager & Software Engineer',
            company: 'Freelancer (Beijing)',
            description: '40% processing time reduction, 92% client satisfaction, independently delivered multiple full-stack projects',
          },
          bailongma: {
            period: '2021 - 2022',
            title: 'Platform Product Manager',
            company: 'Bailongma (Ride-hailing SaaS)',
            description: 'Fleet efficiency +25%, cost -30%, built CRM/asset/financial systems, platform adoption +40%',
          },
          iqidao: {
            period: '2014 - 2021',
            title: 'Technical Director',
            company: 'Iqidao Technology (7 years)',
            description: 'Managed 10+ member team, 35% dev cost reduction, 99.9% availability, featured in AWS official case study, 100% KPI delivery',
          },
          trends: {
            period: '2013 - 2014',
            title: 'App Development Director',
            company: 'Trends Group',
            description: 'LoveFashions App, 10,000+ DAU, managed 10+ engineers',
          },
          pangu: {
            period: '2013',
            title: 'Technical Cooperation Manager',
            company: 'Pangu Cultural',
            description: 'Coordinated 10+ teams for technical cooperation and project management',
          },
          startup: {
            period: '2012 - 2013',
            title: 'Development Manager',
            company: 'Entrepreneurship',
            description: '20+ Microsoft Store apps, 4+ star ratings, independent entrepreneurship',
          },
          izp: {
            period: '2009 - 2012',
            title: 'Java Development Manager',
            company: 'IZP',
            description: 'ZBOOS system, J2EE+Oracle architecture, 200% business growth',
          },
          yisiteng: {
            period: '2008 - 2009',
            title: 'Senior Software Engineer',
            company: 'Yisiteng',
            description: 'Canon China website (canon.com.cn), 99.9% uptime',
          },
          zhongxun: {
            period: '2005 - 2007',
            title: 'Software Engineer',
            company: 'Zhongxun',
            description: 'Nomura Securities trading system, on-site delivery in Japan',
          },
        },
      },
      // Certifications
      certs: {
        sectionTitle: 'Certifications & Education',
        certifications: 'Professional Certifications',
        education: 'Education',
        pmp: { name: 'PMP', issuer: 'Project Management Institute (PMI)', year: '2014' },
        awsSaa: { name: 'AWS SAA', issuer: 'Amazon Web Services', year: '2021' },
        awsSap: { name: 'AWS SAP', issuer: 'Amazon Web Services', year: '2021' },
        bupt: { name: 'B.S. Computer Science', issuer: 'Beijing University of Posts and Telecommunications', year: '2005' },
        unfc: { name: 'Data Analytics (In Progress)', issuer: 'University of Niagara Falls Canada', year: '2025' },
      },
      // SkillRadar
      radar: {
        sectionTitle: 'Skill Radar',
        sectionSubtitle: 'Six-Dimensional Capability Assessment',
        productStrategy: 'Product Strategy',
        techLeadership: 'Tech Leadership',
        cloudArch: 'Cloud Architecture',
        fullStackDev: 'Full-Stack Dev',
        dataAnalysis: 'Data Analytics',
        crossFunc: 'Cross-functional',
      },
      // KeyMetrics
      metrics: {
        sectionTitle: 'Key Numbers',
        years: { value: '20+', label: 'Years Experience' },
        team: { value: '10+', label: 'Team Members' },
        availability: { value: '99.9%', label: 'System Availability' },
        certs: { value: '3', label: 'Certifications' },
        satisfaction: { value: '92%', label: 'Client Satisfaction' },
        costReduction: { value: '35%', label: 'Cost Reduction' },
      },
    },
    ai: {
      widgetTitle: 'AI Assistant',
      chatTab: 'Chat',
      jobMatchTab: 'Job Match',
      placeholder: 'Type a message...',
      send: 'Send',
      greeting: 'Hello! I\'m the NiagaraDataAnalyst AI assistant. How can I help you?',
      jobMatchGreeting: 'Paste a job description and I\'ll analyze the skill match with NiagaraDataAnalyst.',
      thinking: 'Thinking...',
      error: 'Sorry, an error occurred. Please try again later.',
    },
    footer: {
      copyright: '© 2024 NiagaraDataAnalyst. All rights reserved.',
    },
  },
} as const;

/** 翻译数据类型 */
export type TranslationData = typeof translations;
