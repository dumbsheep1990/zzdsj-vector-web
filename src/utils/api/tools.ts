/**
 * 数据处理工具API服务
 */
import { Tool, ToolExecution } from '../../../shared/types/tools';
import apiClient from './client';

const BASE_URL = 'tools';

/**
 * 工具API服务
 */
export const toolsApi = {
  /**
   * 获取工具列表
   */
  getTools(category?: string) {
    const params = category ? { category } : undefined;
    return apiClient.get<Tool[]>(BASE_URL, params);
  },
  
  /**
   * 获取工具详情
   */
  getToolById(id: string) {
    return apiClient.get<Tool>(`${BASE_URL}/${id}`);
  },
  
  /**
   * 创建工具
   */
  createTool(data: Omit<Tool, 'id' | 'createdAt' | 'updatedAt' | 'usage'>) {
    return apiClient.post<Tool>(BASE_URL, data);
  },
  
  /**
   * 更新工具
   */
  updateTool(id: string, data: Partial<Tool>) {
    return apiClient.put<Tool>(`${BASE_URL}/${id}`, data);
  },
  
  /**
   * 删除工具
   */
  deleteTool(id: string) {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },
  
  /**
   * 执行工具
   */
  executeTool(id: string, input: Record<string, any>) {
    return apiClient.post<ToolExecution>(`${BASE_URL}/${id}/execute`, input);
  },
  
  /**
   * 获取工具执行状态
   */
  getToolExecutionStatus(executionId: string) {
    return apiClient.get<ToolExecution>(`${BASE_URL}/executions/${executionId}`);
  },
  
  /**
   * 获取工具执行历史
   */
  getToolExecutionHistory(toolId: string) {
    return apiClient.get<ToolExecution[]>(`${BASE_URL}/${toolId}/executions`);
  },
  
  /**
   * 导入工具
   */
  importTool(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.post<Tool>(
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
   * 导出工具
   */
  exportTool(id: string) {
    return apiClient.get<Blob>(
      `${BASE_URL}/${id}/export`,
      {},
      {
        headers: {
          'Accept': 'application/octet-stream'
        }
      }
    );
  },
  
  /**
   * 收藏/取消收藏工具
   */
  toggleFavoriteTool(id: string, favorite: boolean) {
    return apiClient.put<Tool>(`${BASE_URL}/${id}/favorite`, { favorite });
  }
};

export default toolsApi;
