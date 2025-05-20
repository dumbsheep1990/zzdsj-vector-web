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
