// 模型相关类型定义
export interface ModelProvider {
  id: string;
  name: string;
  description?: string;
  apiKey?: string;
  apiBase?: string;
  isEnabled: boolean;
  models: Model[];
}

export interface Model {
  id: string;
  name: string;
  providerId: string;
  isEnabled: boolean;
  contextSize: number;
  maxTokens: number;
  temperature?: number;
  capabilities: string[];
}
