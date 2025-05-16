/**
 * MCP服务API
 */
import { 
  McpService, 
  McpTool, 
  McpServiceCategory, 
  McpAuthConfig,
  McpServiceStats 
} from '../../../shared/types/mcp';
import apiClient from './client';

const BASE_URL = 'mcp';

/**
 * MCP服务API
 */
export const mcpApi = {
  /**
   * 获取所有MCP服务
   */
  getServices() {
    return apiClient.get<McpService[]>(`${BASE_URL}/services`);
  },
  
  /**
   * 获取服务详情
   */
  getServiceById(id: string) {
    return apiClient.get<McpService>(`${BASE_URL}/services/${id}`);
  },
  
  /**
   * 获取服务分类
   */
  getServiceCategories() {
    return apiClient.get<McpServiceCategory[]>(`${BASE_URL}/categories`);
  },
  
  /**
   * 添加新服务
   */
  addService(serviceUrl: string) {
    return apiClient.post<McpService>(`${BASE_URL}/services`, { serviceUrl });
  },
  
  /**
   * 移除服务
   */
  removeService(id: string) {
    return apiClient.delete(`${BASE_URL}/services/${id}`);
  },
  
  /**
   * 获取服务工具列表
   */
  getServiceTools(serviceId: string) {
    return apiClient.get<McpTool[]>(`${BASE_URL}/services/${serviceId}/tools`);
  },
  
  /**
   * 更新工具启用状态
   */
  updateToolStatus(serviceId: string, toolId: string, enabled: boolean) {
    return apiClient.put<McpTool>(`${BASE_URL}/services/${serviceId}/tools/${toolId}`, { enabled });
  },
  
  /**
   * 批量更新工具状态
   */
  batchUpdateToolStatus(serviceId: string, updates: { toolId: string, enabled: boolean }[]) {
    return apiClient.put<{success: boolean}>(`${BASE_URL}/services/${serviceId}/tools/batch`, { updates });
  },
  
  /**
   * 获取服务授权状态
   */
  getServiceAuthStatus(serviceId: string) {
    return apiClient.get<McpAuthConfig>(`${BASE_URL}/services/${serviceId}/auth`);
  },
  
  /**
   * 设置服务授权配置
   */
  setServiceAuth(serviceId: string, authConfig: Partial<McpAuthConfig>) {
    return apiClient.put<McpAuthConfig>(`${BASE_URL}/services/${serviceId}/auth`, authConfig);
  },
  
  /**
   * 获取服务使用统计
   */
  getServiceStats(serviceId: string, timeRange?: 'day' | 'week' | 'month' | 'year') {
    const params = timeRange ? { timeRange } : undefined;
    return apiClient.get<McpServiceStats>(`${BASE_URL}/services/${serviceId}/stats`, params);
  },
  
  /**
   * 测试服务连接
   */
  testServiceConnection(serviceId: string) {
    return apiClient.post<{success: boolean, message?: string}>(`${BASE_URL}/services/${serviceId}/test`);
  },
  
  /**
   * 执行MCP工具
   */
  executeTool(serviceId: string, toolId: string, parameters: Record<string, any>) {
    return apiClient.post<any>(`${BASE_URL}/exec/${serviceId}/${toolId}`, { parameters });
  },
  
  /**
   * 搜索MCP服务
   */
  searchServices(query: string, category?: string) {
    const params: Record<string, any> = { query };
    if (category) {
      params.category = category;
    }
    return apiClient.get<McpService[]>(`${BASE_URL}/services/search`, params);
  },
  
  /**
   * 获取特定类型的服务
   */
  getServicesByType(type: string) {
    return apiClient.get<McpService[]>(`${BASE_URL}/services/type/${type}`);
  },
  
  /**
   * 获取推荐服务
   */
  getRecommendedServices() {
    return apiClient.get<McpService[]>(`${BASE_URL}/services/recommended`);
  },
  
  /**
   * 获取常用服务
   */
  getFrequentlyUsedServices() {
    return apiClient.get<McpService[]>(`${BASE_URL}/services/frequently-used`);
  }
};

export default mcpApi;
