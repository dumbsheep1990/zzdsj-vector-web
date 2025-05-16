// 知识库相关类型定义
export interface KnowledgeBaseItem {
  id: string;
  name: string;
  description: string;
  fileCount: number;
  lastUpdated: string;
  tags: string[];
}

export interface KnowledgeFileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  metadata?: Record<string, any>;
}
