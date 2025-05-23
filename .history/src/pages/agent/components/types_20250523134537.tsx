// Tool类型定义
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon?: React.ReactNode;
  tags?: string[];
  // 新增属性
  isAdvanced?: boolean; // 是否为高级工具
  isPremium?: boolean; // 是否为付费工具
  complexity?: 'low' | 'medium' | 'high'; // 复杂度
  provider?: string; // 提供商
  version?: string; // 版本
  apiEndpoint?: string; // API端点
  documentation?: string; // 文档链接
  isEnabled?: boolean; // 是否启用
  // 配置参数
  config?: {
    [key: string]: any;
  };
  // 权限要求
  permissions?: string[];
  // 依赖关系
  dependencies?: string[];
}

// 工具类别 - 扩展为更多实际的工具类别
export enum ToolCategory {
  SEARCH = 'search', // 搜索工具
  RETRIEVAL = 'retrieval', // 检索工具  
  REASONING = 'reasoning', // 推理工具
  MULTIMODAL = 'multimodal', // 多模态工具
  INTEGRATION = 'integration', // 集成工具
  KNOWLEDGE = 'knowledge', // 知识处理工具
  WEB = 'web', // 网页工具
  DEVELOPMENT = 'development', // 开发工具
  DOCUMENT = 'document', // 文档工具
  MULTIMEDIA = 'multimedia' // 多媒体工具
}

// 知识库类型
export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  documentCount: number;
}

// 智能体配置类型
export interface AgentConfig {
  id?: string;
  name: string;
  description: string;
  // 新增基础信息字段
  agentType: string; // 智能体类型（chat、knowledge、code等）
  icon: string; // 图标类型
  tags: string[]; // 标签列表
  language: string; // 主要语言
  isPublic: boolean; // 可见性设置
  // 系统提示词、工具和知识库设置
  systemPrompt: string;
  selectedTools: Tool[];
  selectedKnowledgeBases: KnowledgeBase[];
  advanced: {
    temperature: number;
    maxTokens: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
    contextCompression: boolean;
  };
}

// 提示词模板类别枚举
export enum PromptCategory {
  GENERAL = 'general',
  CODING = 'coding',
  ANALYSIS = 'analysis',
  WRITING = 'writing',
  ROLEPLAY = 'roleplay'
}

// 提示词变量接口
export interface PromptVariable {
  name: string;
  description: string;
  defaultValue?: string;
  required: boolean;
}

// 提示词模板接口
export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  category: PromptCategory;
  content: string;
  isSystem: boolean;
  variables?: PromptVariable[];
}
