/**
 * 数据集管理API服务
 */
import { Dataset, DatasetItem, DatasetStats } from '../../../shared/types/dataset';
import apiClient from './client';

const BASE_URL = 'dataset';

/**
 * 数据集API服务
 */
export const datasetApi = {
  /**
   * 获取数据集列表
   */
  getDatasets() {
    return apiClient.get<Dataset[]>(BASE_URL);
  },
  
  /**
   * 获取数据集详情
   */
  getDatasetById(id: string) {
    return apiClient.get<Dataset>(`${BASE_URL}/${id}`);
  },
  
  /**
   * 创建数据集
   */
  createDataset(data: Omit<Dataset, 'id' | 'itemCount' | 'createdAt' | 'updatedAt'>) {
    return apiClient.post<Dataset>(BASE_URL, data);
  },
  
  /**
   * 更新数据集
   */
  updateDataset(id: string, data: Partial<Dataset>) {
    return apiClient.put<Dataset>(`${BASE_URL}/${id}`, data);
  },
  
  /**
   * 删除数据集
   */
  deleteDataset(id: string) {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },
  
  /**
   * 获取数据集统计信息
   */
  getDatasetStats(id: string) {
    return apiClient.get<DatasetStats>(`${BASE_URL}/${id}/stats`);
  },
  
  /**
   * 获取数据集项列表
   */
  getDatasetItems(datasetId: string, page = 1, pageSize = 20) {
    return apiClient.get<DatasetItem[]>(`${BASE_URL}/${datasetId}/items`, {
      page,
      pageSize
    });
  },
  
  /**
   * 创建数据集项
   */
  createDatasetItem(datasetId: string, data: Omit<DatasetItem, 'id' | 'datasetId' | 'createdAt'>) {
    return apiClient.post<DatasetItem>(`${BASE_URL}/${datasetId}/items`, data);
  },
  
  /**
   * 更新数据集项
   */
  updateDatasetItem(datasetId: string, itemId: string, data: Partial<Omit<DatasetItem, 'id' | 'datasetId'>>) {
    return apiClient.put<DatasetItem>(`${BASE_URL}/${datasetId}/items/${itemId}`, data);
  },
  
  /**
   * 删除数据集项
   */
  deleteDatasetItem(datasetId: string, itemId: string) {
    return apiClient.delete(`${BASE_URL}/${datasetId}/items/${itemId}`);
  },
  
  /**
   * 导入数据集（从文件）
   */
  importDataset(file: File, type: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    return apiClient.post<Dataset>(
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
   * 导出数据集
   */
  exportDataset(id: string, format: 'json' | 'csv' | 'jsonl') {
    return apiClient.get<Blob>(
      `${BASE_URL}/${id}/export`,
      { format },
      {
        headers: {
          'Accept': 'application/octet-stream'
        }
      }
    );
  },
  
  /**
   * 关联数据集到助手
   */
  linkDatasetToAssistants(datasetId: string, assistantIds: string[]) {
    return apiClient.put<{ success: boolean }>(`${BASE_URL}/${datasetId}/assistants`, { assistantIds });
  }
};

export default datasetApi;
