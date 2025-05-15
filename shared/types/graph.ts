// 图数据库相关类型定义
export interface Graph {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  nodeCount: number;
  edgeCount: number;
  type: 'knowledge' | 'semantic' | 'custom';
  tags: string[];
}

export interface GraphNode {
  id: string;
  graphId: string;
  label: string;
  properties: Record<string, any>;
  type: string;
  x?: number;
  y?: number;
  size?: number;
  color?: string;
}

export interface GraphEdge {
  id: string;
  graphId: string;
  source: string; // 源节点ID
  target: string; // 目标节点ID
  label: string;
  properties: Record<string, any>;
  type: string;
  weight?: number;
}

export interface GraphQuery {
  query: string;
  parameters?: Record<string, any>;
  limit?: number;
}
