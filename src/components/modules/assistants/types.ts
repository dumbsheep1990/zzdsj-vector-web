// 重新导出所需的类型以供助手组件使用
export interface KnowledgeBase {
  id: string;
  name: string;
  documentCount: number;
}

export interface UsageStats {
  totalChats: number;
  satisfactionRate: number; // 保留但不使用
  tokenUsage: number; // 改为必需字段
  apiCalls: number; // 修改为必需字段
}

export interface ModelInfo {
  type: '推理模型' | '向量模型' | '重排模型';
  name: string;
}

export interface Assistant {
  id: string;
  name: string;
  avatar?: string; // Add avatar property to match AssistantCard.tsx
  description: string;
  model: string; // 保留旧字段以兼容
  models?: ModelInfo[]; // 新增模型详情字段
  status: 'online' | 'offline';
  createTime: string;
  capabilities: string[];
  knowledgeBases?: KnowledgeBase[];
  usageStats?: UsageStats;
}
