/**
 * 模型管理API服务
 */
import { ModelProvider, Model } from '../../../shared/types/models';
import apiClient from './client';

const BASE_URL = 'model';

/**
 * 模型API服务
 */
export const modelApi = {
  /**
   * 获取模型提供商列表
   */
  getModelProviders() {
    return apiClient.get<ModelProvider[]>(`${BASE_URL}/providers`);
  },
  
  /**
   * 获取模型提供商详情
   */
  getModelProviderById(id: string) {
    return apiClient.get<ModelProvider>(`${BASE_URL}/providers/${id}`);
  },
  
  /**
   * 更新模型提供商配置
   */
  updateModelProvider(id: string, data: Partial<ModelProvider>) {
    return apiClient.put<ModelProvider>(`${BASE_URL}/providers/${id}`, data);
  },
  
  /**
   * 获取模型列表
   */
  getModels() {
    return apiClient.get<Model[]>(BASE_URL);
  },
  
  /**
   * 获取模型详情
   */
  getModelById(id: string) {
    return apiClient.get<Model>(`${BASE_URL}/${id}`);
  },
  
  /**
   * 更新模型配置
   */
  updateModel(id: string, data: Partial<Model>) {
    return apiClient.put<Model>(`${BASE_URL}/${id}`, data);
  },
  
  /**
   * 测试模型
   */
  testModel(modelId: string, prompt: string) {
    return apiClient.post(`${BASE_URL}/test`, { modelId, prompt });
  }
};

export default modelApi;
