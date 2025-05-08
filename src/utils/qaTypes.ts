// 问答系统相关类型定义

// 问答对类型
export interface QaPair {
  id: string;
  question: string;
  answer: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  sourceType?: 'manual' | 'auto';
  parentId?: string;
}

// 数据集类型
export interface QaDataset {
  id: string;
  name: string;
  description: string;
  pairsCount: number;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'processing' | 'inactive';
  linkedAssistants: AssistantItem[];
  qaPairs?: QaPair[];
  questionCount?: number;
}

// 助手类型
export interface AssistantItem {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  capabilities?: string[];
}
