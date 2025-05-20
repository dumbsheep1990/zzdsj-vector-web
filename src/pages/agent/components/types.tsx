// Tool类型定义
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon?: string;
  tags?: string[];
}

// 工具类别
export enum ToolCategory {
  WEB = 'web',
  DEVELOPMENT = 'development',
  DOCUMENT = 'document',
  MULTIMEDIA = 'multimedia'
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
  systemPrompt: string;
  selectedTools: Tool[];
  selectedKnowledgeBases: KnowledgeBase[];
  advanced?: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
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
