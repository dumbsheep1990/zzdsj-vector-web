// 智能体团队配置类型定义

// 单个智能体配置
export interface AgentMember {
  id: string;
  name: string;
  description: string;
  role: string; // 智能体在团队中的角色
  type: 'intent_recognition' | 'web_search' | 'knowledge_retrieval' | 'qa_summary' | 
        'question_decomposition' | 'metadata_search' | 'data_verification' | 'result_optimization';
  
  // 模型配置
  modelConfig: {
    useUnifiedModel: boolean; // 是否使用统一模型
    providerId?: string; // 模型厂商ID
    modelId?: string; // 模型ID
    temperature?: number;
    maxTokens?: number;
    topP?: number;
  };
  
  // 工具挂载配置
  toolsConfig: {
    enabledTools: string[]; // 启用的工具列表
    toolSettings: { [toolId: string]: any }; // 工具特定设置
  };
  
  // 知识库挂载配置
  knowledgeConfig: {
    enabledKnowledgeBases: string[]; // 启用的知识库列表
    searchSettings?: {
      topK?: number;
      threshold?: number;
      searchMode?: 'semantic' | 'keyword' | 'hybrid';
    };
  };
  
  // 系统提示词
  systemPrompt: string;
  
  // 其他特定配置
  specificConfig?: any;
}

// 智能体团队配置
export interface AgentTeam {
  id: string;
  name: string;
  description: string;
  scenarioId: string; // 对应的场景ID
  templateId: string; // 对应的模板ID
  
  // 团队成员
  members: AgentMember[];
  
  // 团队级别配置
  teamConfig: {
    executionMode: 'sequential' | 'parallel' | 'conditional'; // 执行模式
    coordinationStrategy: 'chain' | 'tree' | 'graph'; // 协调策略
    
    // 统一模型配置（当useUnifiedModel为true时生效）
    unifiedModelConfig?: {
      providerId: string;
      modelId: string;
      temperature: number;
      maxTokens: number;
      topP: number;
      frequencyPenalty?: number;
      presencePenalty?: number;
    };
    
    // 团队级别的知识库配置
    teamKnowledgeBases?: string[];
    
    // 团队级别的工具配置
    teamTools?: string[];
  };
  
  // 执行流程配置
  workflow: {
    steps: Array<{
      stepId: string;
      agentId: string;
      nextSteps: string[]; // 下一步的步骤ID列表
      conditions?: Array<{ // 条件分支
        condition: string;
        nextStep: string;
      }>;
    }>;
  };
}

// 政策问答场景的智能体团队预设配置
export interface PolicyQATeamConfigs {
  simpleQA: AgentTeam;
  knowledgeQA: AgentTeam;
  deepThinking: AgentTeam;
}

// 智能体类型定义映射
export const AGENT_TYPE_DEFINITIONS = {
  intent_recognition: {
    name: '意图识别智能体',
    description: '分析用户问题意图，识别问题类型和关键信息',
    defaultTools: ['text_analysis', 'nlp_processor'],
    requiredCapabilities: ['intent_classification', 'entity_extraction']
  },
  web_search: {
    name: '联网检索智能体',
    description: '通过网络搜索获取最新信息和实时数据',
    defaultTools: ['web_search', 'url_crawler'],
    requiredCapabilities: ['search_optimization', 'content_filtering']
  },
  knowledge_retrieval: {
    name: '知识库检索智能体',
    description: '从本地知识库中检索相关文档和信息',
    defaultTools: ['vector_search', 'full_text_search'],
    requiredCapabilities: ['semantic_search', 'relevance_scoring']
  },
  qa_summary: {
    name: '问答总结及回答智能体',
    description: '整合信息并生成最终的问答回复',
    defaultTools: ['text_summarization', 'response_generation'],
    requiredCapabilities: ['information_synthesis', 'answer_generation']
  },
  question_decomposition: {
    name: '意图识别及问答拆分智能体',
    description: '分析复杂问题并拆分为子问题进行处理',
    defaultTools: ['question_analysis', 'task_decomposition'],
    requiredCapabilities: ['complex_reasoning', 'question_parsing']
  },
  metadata_search: {
    name: '文档元数据检索智能体',
    description: '基于文档元数据进行精确检索和筛选',
    defaultTools: ['metadata_search', 'document_indexing'],
    requiredCapabilities: ['metadata_analysis', 'structured_search']
  },
  data_verification: {
    name: '数据校验智能体',
    description: '验证信息准确性和一致性',
    defaultTools: ['fact_checker', 'source_validator'],
    requiredCapabilities: ['fact_verification', 'consistency_check']
  },
  result_optimization: {
    name: '结果优化智能体',
    description: '优化最终输出的质量和格式',
    defaultTools: ['content_optimizer', 'format_enhancer'],
    requiredCapabilities: ['content_enhancement', 'quality_optimization']
  }
} as const;

// 模型厂商配置
export interface ModelProvider {
  id: string;
  name: string;
  logo?: string;
  description: string;
  models: Array<{
    id: string;
    name: string;
    description: string;
    recommended?: boolean;
    capabilities: string[];
    maxTokens: number;
    supportedFeatures: string[];
  }>;
}

// 工具配置
export interface ToolConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  requiredParams?: { [key: string]: any };
  optional?: boolean;
}

// 知识库配置
export interface KnowledgeBaseConfig {
  id: string;
  name: string;
  description: string;
  type: 'vector' | 'graph' | 'relational';
  status: 'active' | 'inactive';
  documentCount?: number;
  lastUpdated?: string;
} 