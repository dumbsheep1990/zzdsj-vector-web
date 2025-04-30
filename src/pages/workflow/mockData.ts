import { AgentConfig, ToolConfig, ApplicationConfig } from './types';

// 创建应用类型示例
export const mockApplications: ApplicationConfig[] = [
  {
    id: 'app1',
    name: '数据可视化仪表板',
    type: 'application',
    description: '展示数据分析结果的交互式仪表板',
    features: [
      '实时数据更新',
      '多种图表类型',
      '数据筛选功能',
      '导出报告'
    ],
    integrations: ['API', 'CSV导入', '数据库连接'],
    icon: '📈'
  },
  {
    id: 'app2',
    name: '文档管理系统',
    type: 'application',
    description: '智能文档存储和检索系统',
    features: [
      '全文搜索',
      '版本控制',
      '协作编辑',
      '自动标签'
    ],
    integrations: ['云存储', '权限系统', '第三方编辑器'],
    icon: '📄'
  }
];

// 初始节点
export const initialNodes = [
  {
    id: '1',
    type: 'agent',
    data: { 
      label: '智能体 1', 
      type: 'Agent',
      config: {
        id: 'agent1',
        name: '智能体 1',
        description: '处理初始输入的智能体',
        type: 'agent',
        model: 'gpt-4',
        temperature: 0.7,
        knowledgeBase: true,
        webSearch: false,
        icon: '🤖'
      }
    },
    position: { x: 100, y: 100 },
  },
  {
    id: '2',
    type: 'agent',
    data: { 
      label: '智能体 2', 
      type: 'Agent',
      config: {
        id: 'agent2',
        name: '智能体 2',
        description: '处理后续任务的智能体',
        type: 'agent',
        model: 'gpt-3.5-turbo',
        temperature: 0.5,
        knowledgeBase: false,
        webSearch: true,
        icon: '🧠'
      }
    },
    position: { x: 500, y: 100 },
  },
  {
    id: '3',
    type: 'application',
    data: { 
      label: '数据可视化仪表板', 
      type: 'Application',
      config: mockApplications[0]
    },
    position: { x: 800, y: 250 },
  },
];

// 初始边
export const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, label: '处理结果' },
];

// Mock数据：可用的智能体列表
export const mockAgents: AgentConfig[] = [
  {
    id: 'agent1',
    name: '通用问答智能体',
    description: '处理一般性问题的智能体',
    type: 'agent',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 4096,
    systemPrompt: '你是一个助手，帮助用户回答问题。',
    knowledgeBase: true,
    webSearch: true,
    imageSupport: true,
    voiceSupport: false,
    // 新增字段
    steps: [
      { id: 'step1', name: '理解问题', description: '解析用户问题', type: 'reasoning' },
      { id: 'step2', name: '搜索知识库', description: '在知识库中查找相关信息', type: 'action' },
      { id: 'step3', name: '生成回答', description: '基于知识库结果生成回答', type: 'reasoning' }
    ],
    tools: [
      { 
        id: 'tool1', 
        name: '搜索工具', 
        type: 'search',
        description: '在互联网上搜索信息',
        parameters: [
          { name: 'query', type: 'string', required: true }
        ],
        usage_examples: ['搜索最新的AI发展趋势']
      },
      { 
        id: 'tool2', 
        name: '计算器', 
        type: 'calculator',
        description: '执行数学计算',
        parameters: [
          { name: 'expression', type: 'string', required: true }
        ]
      }
    ],
    capabilities: ['文本处理', '问答', '搜索', '计算'],
    limitations: ['无法处理过于复杂的数学问题'],
    executionOrder: 'sequential',
    color: '#667eea',
    icon: '🤖'
  },
  {
    id: 'agent2',
    name: '数据分析智能体',
    description: '专门处理数据分析任务',
    type: 'agent',
    model: 'gpt-4',
    temperature: 0.2,
    maxTokens: 8192,
    systemPrompt: '你是一个数据分析专家，帮助用户分析数据。',
    knowledgeBase: true,
    webSearch: false,
    imageSupport: true,
    voiceSupport: false,
    // 新增字段
    steps: [
      { id: 'step1', name: '数据导入', description: '导入用户数据', type: 'action' },
      { id: 'step2', name: '数据清洗', description: '清洗和准备数据', type: 'action' },
      { id: 'step3', name: '数据分析', description: '执行统计分析', type: 'api_call' },
      { id: 'step4', name: '结果可视化', description: '将结果转换为图表', type: 'action' },
      { id: 'step5', name: '解释结果', description: '解释数据分析结果', type: 'reasoning' }
    ],
    tools: [
      { 
        id: 'tool3', 
        name: '数据可视化', 
        type: 'visualization',
        description: '将数据转换为图表',
        parameters: [
          { name: 'data', type: 'array', required: true },
          { name: 'chart_type', type: 'string', required: true }
        ]
      },
      { 
        id: 'tool4', 
        name: '统计分析', 
        type: 'statistics',
        description: '执行统计分析',
        parameters: [
          { name: 'data', type: 'array', required: true },
          { name: 'analysis_type', type: 'string', required: true }
        ]
      }
    ],
    capabilities: ['数据清洗', '数据分析', '可视化', '统计'],
    limitations: ['不支持超大规模数据集'],
    executionOrder: 'sequential',
    color: '#4facfe',
    icon: '📊'
  },
  {
    id: 'agent3',
    name: '代码助手',
    description: '帮助编写和修改代码',
    type: 'agent',
    model: 'gpt-4',
    temperature: 0.3,
    maxTokens: 8192,
    systemPrompt: '你是一个编程助手，帮助用户解决代码问题。',
    knowledgeBase: false,
    webSearch: true,
    imageSupport: false,
    voiceSupport: false,
    // 新增字段
    steps: [
      { id: 'step1', name: '理解需求', description: '理解编程需求', type: 'reasoning' },
      { id: 'step2', name: '代码生成', description: '生成代码', type: 'reasoning' },
      { id: 'step3', name: '代码测试', description: '测试生成的代码', type: 'action' },
      { id: 'step4', name: '代码优化', description: '优化代码性能和可读性', type: 'reflection' }
    ],
    tools: [
      { 
        id: 'tool5', 
        name: '代码补全', 
        type: 'code-completion',
        description: '提供代码补全建议',
        parameters: [
          { name: 'code_prefix', type: 'string', required: true },
          { name: 'language', type: 'string', required: true }
        ]
      },
      { 
        id: 'tool6', 
        name: '代码审查', 
        type: 'code-review',
        description: '检查和审查代码质量',
        parameters: [
          { name: 'code', type: 'string', required: true },
          { name: 'language', type: 'string', required: true }
        ]
      },
      {
        id: 'tool7',
        name: '执行代码',
        type: 'code-execution',
        description: '在安全环境中执行代码',
        parameters: [
          { name: 'code', type: 'string', required: true },
          { name: 'language', type: 'string', required: true }
        ]
      }
    ],
    capabilities: ['代码生成', '代码补全', '代码审查', '代码执行'],
    limitations: ['可能无法生成完美的大型代码项目'],
    executionOrder: 'sequential',
    color: '#8a5cf6',
    icon: '💻'
  }
];

// Mock数据：可用的工具
export const mockTools: ToolConfig[] = [
  { 
    id: 'tool1', 
    name: '搜索工具', 
    type: 'search', 
    description: '在互联网上搜索信息',
    parameters: [
      { name: 'query', type: 'string', required: true },
      { name: 'limit', type: 'number', required: false }
    ],
    usage_examples: ['搜索最新的AI发展趋势', '查询特定技术文档'],
    icon: '🔍'
  },
  { 
    id: 'tool2', 
    name: '计算器', 
    type: 'calculator', 
    description: '执行数学计算',
    parameters: [
      { name: 'expression', type: 'string', required: true }
    ],
    usage_examples: ['计算复杂数学表达式', '执行单位转换'],
    icon: '🧮'
  },
  { 
    id: 'tool3', 
    name: '数据可视化', 
    type: 'visualization', 
    description: '将数据转换为图表',
    parameters: [
      { name: 'data', type: 'array', required: true },
      { name: 'chart_type', type: 'string', required: true },
      { name: 'options', type: 'object', required: false }
    ],
    usage_examples: ['生成销售数据柱状图', '创建用户增长曲线图'],
    icon: '📊'
  }
]; 