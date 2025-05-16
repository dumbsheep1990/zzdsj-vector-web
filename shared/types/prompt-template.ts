// 提示词模板相关类型定义
export interface PromptTemplate {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isBound: boolean;
  assistantIds?: string[];
  author?: string;
  description?: string;
  version?: string;
  isPublic?: boolean;
  variables?: PromptVariable[];
  examples?: PromptExample[];
  usageCount?: number;
}

export interface PromptVariable {
  name: string;
  description: string;
  defaultValue?: string;
  required: boolean;
  placeholder?: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  options?: string[];
}

export interface PromptExample {
  name: string;
  description?: string;
  userInput: string;
  assistantResponse: string;
}

export interface PromptCategory {
  id: string;
  name: string;
  description?: string;
  count: number;
}

export interface PromptAssistantBinding {
  promptId: string;
  assistantId: string;
  createdAt: string;
  createdBy?: string;
  isActive: boolean;
}

export interface PromptSearchParams {
  query?: string;
  category?: string;
  tags?: string[];
  isBound?: boolean;
  assistantId?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'usageCount';
  sortOrder?: 'asc' | 'desc';
}
