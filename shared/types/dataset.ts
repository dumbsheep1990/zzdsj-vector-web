// 数据集相关类型定义
export interface Dataset {
  id: string;
  name: string;
  description: string;
  type: 'qa' | 'text' | 'structured';
  itemCount: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  assistantIds?: string[]; // 关联的助手ID
  metadata?: Record<string, any>;
}

export interface DatasetItem {
  id: string;
  datasetId: string;
  content: any; // 泛型内容，可以是问答对、文本等
  type: string; // 数据项类型
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface DatasetStats {
  id: string;
  datasetId: string;
  totalItems: number;
  distribution: Record<string, number>; // 数据分布统计
  lastUpdated: string;
}
