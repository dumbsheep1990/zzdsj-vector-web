/**
 * 图数据库API服务
 */
import { Graph, GraphNode, GraphEdge, GraphQuery } from '../../../shared/types/graph';
import apiClient from './client';

const BASE_URL = '';  // 空字符串，因为API_BASE_URL已经包含了graph路径

/**
 * 图数据库API服务
 */
export const graphApi = {
  /**
   * 获取图数据库列表
   */
  getGraphs() {
    return apiClient.get<Graph[]>(BASE_URL);
  },
  
  /**
   * 获取图数据库详情
   */
  getGraphById(id: string) {
    return apiClient.get<Graph>(`${BASE_URL}/${id}`);
  },
  
  /**
   * 创建图数据库
   */
  createGraph(data: Omit<Graph, 'id' | 'createdAt' | 'updatedAt' | 'nodeCount' | 'edgeCount'>) {
    return apiClient.post<Graph>(BASE_URL, data);
  },
  
  /**
   * 更新图数据库
   */
  updateGraph(id: string, data: Partial<Graph>) {
    return apiClient.put<Graph>(`${BASE_URL}/${id}`, data);
  },
  
  /**
   * 删除图数据库
   */
  deleteGraph(id: string) {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },
  
  /**
   * 获取图数据库节点
   */
  getGraphNodes(graphId: string) {
    return apiClient.get<GraphNode[]>(`${BASE_URL}/${graphId}/nodes`);
  },
  
  /**
   * 创建图数据库节点
   */
  createGraphNode(graphId: string, data: Omit<GraphNode, 'id' | 'graphId'>) {
    return apiClient.post<GraphNode>(`${BASE_URL}/${graphId}/nodes`, data);
  },
  
  /**
   * 更新图数据库节点
   */
  updateGraphNode(graphId: string, nodeId: string, data: Partial<Omit<GraphNode, 'id' | 'graphId'>>) {
    return apiClient.put<GraphNode>(`${BASE_URL}/${graphId}/nodes/${nodeId}`, data);
  },
  
  /**
   * 删除图数据库节点
   */
  deleteGraphNode(graphId: string, nodeId: string) {
    return apiClient.delete(`${BASE_URL}/${graphId}/nodes/${nodeId}`);
  },
  
  /**
   * 获取图数据库边
   */
  getGraphEdges(graphId: string) {
    return apiClient.get<GraphEdge[]>(`${BASE_URL}/${graphId}/edges`);
  },
  
  /**
   * 创建图数据库边
   */
  createGraphEdge(graphId: string, data: Omit<GraphEdge, 'id' | 'graphId'>) {
    return apiClient.post<GraphEdge>(`${BASE_URL}/${graphId}/edges`, data);
  },
  
  /**
   * 更新图数据库边
   */
  updateGraphEdge(graphId: string, edgeId: string, data: Partial<Omit<GraphEdge, 'id' | 'graphId'>>) {
    return apiClient.put<GraphEdge>(`${BASE_URL}/${graphId}/edges/${edgeId}`, data);
  },
  
  /**
   * 删除图数据库边
   */
  deleteGraphEdge(graphId: string, edgeId: string) {
    return apiClient.delete(`${BASE_URL}/${graphId}/edges/${edgeId}`);
  },
  
  /**
   * 执行图查询
   */
  queryGraph(graphId: string, query: GraphQuery) {
    return apiClient.post<any>(`${BASE_URL}/${graphId}/query`, query);
  },
  
  /**
   * 导入图数据
   */
  importGraph(file: File, format: 'json' | 'csv' | 'graphml') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);
    
    return apiClient.post<Graph>(
      `${BASE_URL}/import`,
      formData,
      {
        headers: {
          // 移除Content-Type以让浏览器自动设置multipart/form-data
          'Content-Type': undefined as any
        }
      }
    );
  },
  
  /**
   * 导出图数据
   */
  exportGraph(id: string, format: 'json' | 'csv' | 'graphml') {
    return apiClient.get<Blob>(
      `${BASE_URL}/${id}/export`,
      { format },
      {
        headers: {
          'Accept': 'application/octet-stream'
        }
      }
    );
  }
};

export default graphApi;
