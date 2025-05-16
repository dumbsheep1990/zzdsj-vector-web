/**
 * 向量管理API服务
 */
import { VectorItem, VectorSearchParams } from '../../../shared/types/vector';
import apiClient from './client';

const BASE_URL = 'vector';

/**
 * 向量API服务
 */
export const vectorApi = {
  /**
   * 获取向量列表
   */
  getVectors() {
    return apiClient.get<VectorItem[]>(BASE_URL);
  },
  
  /**
   * 获取向量详情
   */
  getVectorById(id: string) {
    return apiClient.get<VectorItem>(`${BASE_URL}/${id}`);
  },
  
  /**
   * 创建向量
   */
  createVector(data: Omit<VectorItem, 'id' | 'lastUpdated'>) {
    return apiClient.post<VectorItem>(BASE_URL, data);
  },
  
  /**
   * 更新向量
   */
  updateVector(id: string, data: Partial<VectorItem>) {
    return apiClient.put<VectorItem>(`${BASE_URL}/${id}`, data);
  },
  
  /**
   * 删除向量
   */
  deleteVector(id: string) {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },
  
  /**
   * 向量搜索
   */
  searchVectors(searchParams: VectorSearchParams) {
    return apiClient.post<any[]>(`${BASE_URL}/search`, searchParams);
  }
};

export default vectorApi;
