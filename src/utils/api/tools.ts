/**
 * 工具管理API服务
 */
import { Tool, ToolExecution } from '../../../shared/types/tools';
import apiClient from './client';

const BASE_URL = 'tools';

// 工具基础类型
export interface ToolRequest {
  tool_name: string;
  action: string;
  parameters: Record<string, any>;
}

export interface ToolResponse {
  success: boolean;
  data: any;
  message: string;
  execution_time?: number;
  metadata?: Record<string, any>;
}

export interface ToolInfo {
  name: string;
  version: string;
  description: string;
  available: boolean;
  actions: Record<string, any>;
  requirements?: Record<string, any>;
  configuration?: Record<string, any>;
}

export interface ToolStatus {
  tool_name: string;
  status: 'active' | 'inactive' | 'error';
  last_check: string;
  error_message?: string;
  metrics?: Record<string, any>;
}

/**
 * 原有工具API服务 (兼容性保留)
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

/**
 * 新工具管理API (WebSailor & Scraperr)
 */
export const newToolsAPI = {
  // 获取工具列表
  listTools: () => 
    apiClient.get<{
      success: boolean;
      tools: ToolInfo[];
      total: number;
    }>('/api/v1/tools/list'),

  // 获取工具模式
  getToolSchema: (toolName: string) =>
    apiClient.get<{
      success: boolean;
      schema: ToolInfo;
    }>(`/api/v1/tools/schema/${toolName}`),

  // 执行工具
  executeTool: (request: ToolRequest) =>
    apiClient.post<ToolResponse>('/api/v1/tools/execute', request),

  // 健康检查
  healthCheck: () =>
    apiClient.get<{
      success: boolean;
      status: string;
      tools: Record<string, ToolStatus>;
      timestamp: string;
    }>('/api/v1/tools/health'),

  // 获取工具指标
  getMetrics: () =>
    apiClient.get<{
      success: boolean;
      metrics: Record<string, any>;
    }>('/api/v1/tools/metrics'),

  // WebSailor API
  webSailor: {
    // 搜索
    search: (params: { query: string }) =>
      apiClient.post<ToolResponse>('/api/v1/tools/websailor/search', params),

    // 访问网页
    visit: (params: { url: string; goal?: string }) =>
      apiClient.post<ToolResponse>('/api/v1/tools/websailor/visit', params)
  },

  // Scraperr API  
  scraperr: {
    // 创建爬取任务
    scrape: (params: {
      url: string;
      elements: Array<{ name: string; xpath: string }>;
      spider_domain?: boolean;
      download_media?: boolean;
      custom_headers?: Record<string, string>;
    }) =>
      apiClient.post<ToolResponse>('/api/v1/tools/scraperr/scrape', params),

    // 获取任务列表
    listJobs: (params?: { user_email?: string; limit?: number }) =>
      apiClient.get<ToolResponse>('/api/v1/tools/scraperr/jobs', { params }),

    // 获取任务详情
    getJob: (jobId: string, userEmail?: string) =>
      apiClient.get<ToolResponse>(`/api/v1/tools/scraperr/jobs/${jobId}`, {
        params: userEmail ? { user_email: userEmail } : undefined
      }),

    // 删除任务
    deleteJobs: (jobIds: string[]) =>
      apiClient.delete<ToolResponse>('/api/v1/tools/scraperr/jobs', {
        data: { job_ids: jobIds }
      })
  }
};

// 工具配置API
export const toolConfigAPI = {
  // 获取工具配置
  getConfig: (toolName: string) =>
    apiClient.get<{
      success: boolean;
      config: Record<string, any>;
    }>(`/api/v1/tools/${toolName}/config`),

  // 更新工具配置
  updateConfig: (toolName: string, config: Record<string, any>) =>
    apiClient.post<{
      success: boolean;
      message: string;
    }>(`/api/v1/tools/${toolName}/config`, config),

  // 重置工具配置
  resetConfig: (toolName: string) =>
    apiClient.delete<{
      success: boolean;
      message: string;
    }>(`/api/v1/tools/${toolName}/config`)
};

export default toolsApi;
