export interface KnowledgeBase {
  id: string;
  name: string;
  documentCount: number;
}

export interface UsageStats {
  totalChats: number;
  satisfactionRate: number;
}

export interface Assistant {
  id: string;
  name: string;
  description: string;
  model: string;
  status: 'online' | 'offline';
  createTime: string;
  capabilities: string[];
  knowledgeBases?: KnowledgeBase[];
  usageStats?: UsageStats;
}
