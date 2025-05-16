// 助手相关类型定义
export interface Assistant {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  status: 'active' | 'inactive';
  model: string;
  knowledgeBases: string[]; // 关联的知识库ID
  createdAt: string;
  updatedAt: string;
  capabilities?: string[];
  settings?: Record<string, any>;
}

export interface AssistantSetting {
  id: string;
  assistantId: string;
  key: string;
  value: any;
  type: 'system' | 'user';
}

export interface Conversation {
  id: string;
  assistantId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: string;
  metadata?: {
    sources?: Array<{
      title: string;
      url: string;
    }>;
    tokens?: {
      prompt: number;
      completion: number;
      total: number;
    };
  };
}
