// 向量管理相关类型定义
export interface VectorItem {
  id: string;
  name: string;
  source: string;
  dimensions: number;
  count: number;
  lastUpdated: string;
  metadata?: Record<string, any>;
}

export interface VectorSearchParams {
  query: string;
  filter?: Record<string, any>;
  limit?: number;
  includeMetadata?: boolean;
}
