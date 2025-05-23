import React from 'react';
import { 
  SearchOutlined, 
  ApiOutlined, 
  DatabaseOutlined, 
  BrainOutlined,
  DeepSearchOutlined,
  MultimediaOutlined,
  NodeIndexOutlined,
  ConnectOutlined,
  FunctionOutlined,
  ToolOutlined,
  CloudOutlined
} from '@ant-design/icons';
import { Tool, ToolCategory } from './types';

// 高级工具数据定义
export const advancedTools: Tool[] = [
  // 搜索工具类别
  {
    id: 'browser-search',
    name: '浏览器搜索',
    description: '智能网页浏览和搜索引擎，支持实时信息获取、网页内容抓取和结构化数据提取',
    category: ToolCategory.SEARCH,
    icon: <SearchOutlined style={{ fontSize: '18px', color: '#1890ff' }} />,
    tags: ['搜索', '浏览器', '实时信息', '网页抓取'],
    isAdvanced: true,
    complexity: 'medium',
    provider: 'System',
    version: '2.1.0',
    isEnabled: true,
    config: {
      maxResults: 10,
      timeout: 30000,
      enableJavaScript: true,
      userAgent: 'Mozilla/5.0 (compatible; AgentBot/1.0)'
    },
    permissions: ['web_access', 'external_api']
  },
  {
    id: 'deep-search',
    name: 'DeepSearch 深度搜索',
    description: '基于AI的深度语义搜索，能够理解用户意图并从多个数据源中检索最相关的信息',
    category: ToolCategory.SEARCH,
    icon: <DeepSearchOutlined style={{ fontSize: '18px', color: '#722ed1' }} />,
    tags: ['深度搜索', '语义理解', '多源检索', 'AI驱动'],
    isAdvanced: true,
    isPremium: true,
    complexity: 'high',
    provider: 'DeepMind Technologies',
    version: '3.2.1',
    isEnabled: true,
    config: {
      semanticDepth: 5,
      confidenceThreshold: 0.8,
      maxSearchTime: 60000
    },
    permissions: ['advanced_search', 'semantic_analysis']
  },

  // 检索工具类别
  {
    id: 'hybrid-retrieval',
    name: '混合检索排序',
    description: '结合向量检索、关键词匹配和语义排序的混合检索系统，提供更精确的信息检索',
    category: ToolCategory.RETRIEVAL,
    icon: <DatabaseOutlined style={{ fontSize: '18px', color: '#13c2c2' }} />,
    tags: ['混合检索', '向量搜索', '排序算法', '精确匹配'],
    isAdvanced: true,
    complexity: 'high',
    provider: 'VectorDB Inc.',
    version: '4.0.3',
    isEnabled: true,
    config: {
      vectorWeight: 0.7,
      keywordWeight: 0.3,
      reranking: true,
      topK: 20
    },
    permissions: ['vector_db_access', 'search_optimization']
  },
  {
    id: 'multimodal-retrieval',
    name: '多模态检索',
    description: '支持文本、图像、音频和视频的跨模态检索系统，实现多媒体内容的智能检索',
    category: ToolCategory.RETRIEVAL,
    icon: <MultimediaOutlined style={{ fontSize: '18px', color: '#fa8c16' }} />,
    tags: ['多模态', '跨媒体检索', '图文检索', '音视频分析'],
    isAdvanced: true,
    isPremium: true,
    complexity: 'high',
    provider: 'OpenAI',
    version: '2.0.0',
    isEnabled: true,
    config: {
      supportedFormats: ['text', 'image', 'audio', 'video'],
      embeddingModel: 'clip-large',
      similarityThreshold: 0.75
    },
    permissions: ['multimodal_access', 'media_processing']
  },

  // 推理工具类别
  {
    id: 'cot-reasoning',
    name: 'CoT 思维链',
    description: '基于思维链(Chain of Thought)的逐步推理系统，提供透明的推理过程和逻辑分析',
    category: ToolCategory.REASONING,
    icon: <BrainOutlined style={{ fontSize: '18px', color: '#eb2f96' }} />,
    tags: ['思维链', '逐步推理', '逻辑分析', '透明推理'],
    isAdvanced: true,
    complexity: 'high',
    provider: 'Google Research',
    version: '1.5.0',
    isEnabled: true,
    config: {
      maxReasoningSteps: 10,
      showIntermediateSteps: true,
      confidenceScoring: true
    },
    permissions: ['advanced_reasoning', 'step_analysis']
  },

  // 知识处理工具类别
  {
    id: 'knowledge-graph',
    name: '知识图谱检索',
    description: '基于知识图谱的实体关系检索系统，支持复杂查询和关联分析',
    category: ToolCategory.KNOWLEDGE,
    icon: <NodeIndexOutlined style={{ fontSize: '18px', color: '#52c41a' }} />,
    tags: ['知识图谱', '实体检索', '关系分析', '图数据库'],
    isAdvanced: true,
    complexity: 'high',
    provider: 'Neo4j Labs',
    version: '5.1.2',
    isEnabled: true,
    config: {
      maxHops: 3,
      relationshipTypes: ['all'],
      includeProperties: true,
      queryTimeout: 45000
    },
    permissions: ['graph_db_access', 'entity_analysis']
  },

  // 集成工具类别
  {
    id: 'mcp-integration',
    name: 'MCP工具调用',
    description: '模型上下文协议(Model Context Protocol)集成，支持与外部系统和API的无缝交互',
    category: ToolCategory.INTEGRATION,
    icon: <ConnectOutlined style={{ fontSize: '18px', color: '#f5222d' }} />,
    tags: ['MCP协议', 'API集成', '外部系统', '上下文共享'],
    isAdvanced: true,
    complexity: 'medium',
    provider: 'Anthropic',
    version: '1.0.0',
    isEnabled: true,
    config: {
      protocol: 'mcp-v1',
      maxConnections: 5,
      timeoutMs: 30000,
      retryAttempts: 3
    },
    permissions: ['external_api', 'protocol_access']
  },
  {
    id: 'api-orchestrator',
    name: 'API编排器',
    description: '智能API调用编排工具，支持复杂的多步API调用流程和数据转换',
    category: ToolCategory.INTEGRATION,
    icon: <ApiOutlined style={{ fontSize: '18px', color: '#2f54eb' }} />,
    tags: ['API编排', '流程自动化', '数据转换', '服务集成'],
    isAdvanced: true,
    complexity: 'high',
    provider: 'System',
    version: '3.0.1',
    isEnabled: true,
    config: {
      maxConcurrentCalls: 10,
      enableCaching: true,
      retryPolicy: 'exponential',
      dataTransformation: true
    },
    permissions: ['api_orchestration', 'data_transformation']
  },

  // 开发工具类别
  {
    id: 'code-interpreter',
    name: '代码解释器增强版',
    description: '支持多种编程语言的高级代码执行环境，具备安全沙箱和结果可视化功能',
    category: ToolCategory.DEVELOPMENT,
    icon: <FunctionOutlined style={{ fontSize: '18px', color: '#fa541c' }} />,
    tags: ['代码执行', '多语言支持', '安全沙箱', '可视化'],
    isAdvanced: true,
    complexity: 'high',
    provider: 'System',
    version: '2.3.0',
    isEnabled: true,
    config: {
      supportedLanguages: ['python', 'javascript', 'bash', 'sql'],
      executionTimeout: 300000,
      memoryLimit: '1GB',
      enableVisualization: true
    },
    permissions: ['code_execution', 'sandbox_access']
  },

  // 系统工具类别
  {
    id: 'workflow-automation',
    name: '工作流自动化',
    description: '基于规则的智能工作流引擎，支持复杂业务流程的自动化执行',
    category: ToolCategory.INTEGRATION,
    icon: <ToolOutlined style={{ fontSize: '18px', color: '#096dd9' }} />,
    tags: ['工作流', '自动化', '规则引擎', '流程管理'],
    isAdvanced: true,
    complexity: 'high',
    provider: 'System',
    version: '1.2.0',
    isEnabled: true,
    config: {
      maxWorkflowSteps: 50,
      enableConditionals: true,
      supportParallelism: true,
      errorHandling: 'graceful'
    },
    permissions: ['workflow_management', 'system_automation']
  },
  {
    id: 'cloud-connector',
    name: '云服务连接器',
    description: '统一的云服务接入平台，支持主流云平台的服务调用和资源管理',
    category: ToolCategory.INTEGRATION,
    icon: <CloudOutlined style={{ fontSize: '18px', color: '#1890ff' }} />,
    tags: ['云服务', '多云支持', '资源管理', '服务调用'],
    isAdvanced: true,
    isPremium: true,
    complexity: 'medium',
    provider: 'Cloud Native Foundation',
    version: '2.0.0',
    isEnabled: true,
    config: {
      supportedProviders: ['AWS', 'Azure', 'GCP', 'Alibaba Cloud'],
      authMethods: ['IAM', 'OAuth2', 'API Key'],
      regionSupport: true
    },
    permissions: ['cloud_access', 'resource_management']
  }
];

// 根据类别获取工具数量的辅助函数
export const getToolCountByCategory = (category: ToolCategory | 'all'): number => {
  if (category === 'all') return advancedTools.length;
  return advancedTools.filter(tool => tool.category === category).length;
};

// 根据类别筛选工具的辅助函数
export const getToolsByCategory = (category: ToolCategory | 'all'): Tool[] => {
  if (category === 'all') return advancedTools;
  return advancedTools.filter(tool => tool.category === category);
};

// 获取所有工具类别及其标签
export const toolCategoryLabels = {
  all: '全部工具',
  [ToolCategory.SEARCH]: '搜索引擎',
  [ToolCategory.RETRIEVAL]: '检索系统', 
  [ToolCategory.REASONING]: '推理分析',
  [ToolCategory.MULTIMODAL]: '多模态',
  [ToolCategory.INTEGRATION]: '系统集成',
  [ToolCategory.KNOWLEDGE]: '知识处理',
  [ToolCategory.WEB]: '网页工具',
  [ToolCategory.DEVELOPMENT]: '开发工具',
  [ToolCategory.DOCUMENT]: '文档处理',
  [ToolCategory.MULTIMEDIA]: '多媒体'
}; 