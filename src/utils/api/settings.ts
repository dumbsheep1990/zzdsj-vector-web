/**
 * 系统设置API服务
 */
import { 
  SystemSetting, 
  UiConfig, 
  SecurityConfig, 
  StorageConfig,
  ApiConfig,
  SystemStatus,
  SensitiveWord
} from '../../../shared/types/settings';
import { Model } from '../../../shared/types/models';
import apiClient from './client';

const BASE_URL = 'settings';

/**
 * 系统设置API服务
 */
export const settingsApi = {
  /**
   * 获取所有系统设置
   */
  getAllSettings() {
    return apiClient.get<SystemSetting[]>(`${BASE_URL}`);
  },
  
  /**
   * 按类别获取系统设置
   */
  getSettingsByCategory(category: SystemSetting['category']) {
    return apiClient.get<SystemSetting[]>(`${BASE_URL}/category/${category}`);
  },
  
  /**
   * 获取单个设置项
   */
  getSettingByKey(key: string) {
    return apiClient.get<SystemSetting>(`${BASE_URL}/key/${key}`);
  },
  
  /**
   * 更新系统设置
   */
  updateSetting(key: string, value: any) {
    return apiClient.put<SystemSetting>(`${BASE_URL}/key/${key}`, { value });
  },
  
  /**
   * 批量更新系统设置
   */
  updateMultipleSettings(settings: Array<{ key: string, value: any }>) {
    return apiClient.put<{ success: boolean, updated: string[] }>(`${BASE_URL}/batch`, { settings });
  },
  
  /**
   * 重置系统设置到默认值
   */
  resetSettings(category?: SystemSetting['category']) {
    const params = category ? { category } : undefined;
    return apiClient.post<{ success: boolean }>(`${BASE_URL}/reset`, params);
  },
  
  /**
   * 获取UI配置
   */
  getUiConfig() {
    return apiClient.get<UiConfig>(`${BASE_URL}/ui`);
  },
  
  /**
   * 更新UI配置
   */
  updateUiConfig(config: Partial<UiConfig>) {
    return apiClient.put<UiConfig>(`${BASE_URL}/ui`, config);
  },
  
  /**
   * 获取安全配置
   */
  getSecurityConfig() {
    return apiClient.get<SecurityConfig>(`${BASE_URL}/security`);
  },
  
  /**
   * 更新安全配置
   */
  updateSecurityConfig(config: Partial<SecurityConfig>) {
    return apiClient.put<SecurityConfig>(`${BASE_URL}/security`, config);
  },
  
  /**
   * 获取存储配置
   */
  getStorageConfig() {
    return apiClient.get<StorageConfig>(`${BASE_URL}/storage`);
  },
  
  /**
   * 更新存储配置
   */
  updateStorageConfig(config: Partial<StorageConfig>) {
    return apiClient.put<StorageConfig>(`${BASE_URL}/storage`, config);
  },
  
  /**
   * 获取API配置
   */
  getApiConfig() {
    return apiClient.get<ApiConfig>(`${BASE_URL}/api`);
  },
  
  /**
   * 更新API配置
   */
  updateApiConfig(config: Partial<ApiConfig>) {
    return apiClient.put<ApiConfig>(`${BASE_URL}/api`, config);
  },
  
  /**
   * 获取系统状态
   */
  getSystemStatus() {
    return apiClient.get<SystemStatus>(`${BASE_URL}/status`);
  },
  
  /**
   * 导出系统设置
   */
  exportSettings(categories?: SystemSetting['category'][]) {
    return apiClient.get<Blob>(
      `${BASE_URL}/export`,
      { categories: categories?.join(',') },
      {
        headers: {
          'Accept': 'application/octet-stream'
        }
      }
    );
  },
  
  /**
   * 导入系统设置
   */
  importSettings(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.post<{success: boolean, imported: number}>(
      `${BASE_URL}/import`,
      formData,
      {
        headers: {
          'Content-Type': undefined as any
        }
      }
    );
  },
  
  /**
   * 模型设置部分
   */
  
  /**
   * 获取模型设置
   */
  getModelSettings() {
    return apiClient.get<{models: Model[], defaultModelId?: string}>(`${BASE_URL}/models`);
  },
  
  /**
   * 更新默认模型
   */
  updateDefaultModel(modelId: string) {
    return apiClient.put<{success: boolean}>(`${BASE_URL}/models/default`, { modelId });
  },
  
  /**
   * 更新模型配置
   */
  updateModelConfig(modelId: string, config: Record<string, any>) {
    return apiClient.put<Model>(`${BASE_URL}/models/${modelId}/config`, config);
  },
  
  /**
   * 测试模型连接
   */
  testModelConnection(modelId: string) {
    return apiClient.post<{success: boolean, latency?: number, message?: string}>(
      `${BASE_URL}/models/${modelId}/test`
    );
  },
  
  /**
   * 系统维护
   */
  
  /**
   * 创建系统备份
   */
  createBackup() {
    return apiClient.post<{success: boolean, backupId: string, url?: string}>(
      `${BASE_URL}/backup`
    );
  },
  
  /**
   * 恢复系统备份
   */
  restoreBackup(backupId: string) {
    return apiClient.post<{success: boolean}>(
      `${BASE_URL}/restore`,
      { backupId }
    );
  },
  
  /**
   * 清理系统缓存
   */
  clearCache(type?: 'api' | 'storage' | 'all') {
    const params = type ? { type } : undefined;
    return apiClient.post<{success: boolean, cleared: string[]}>(`${BASE_URL}/clear-cache`, params);
  },
  
  /**
   * 敏感词管理
   */
  
  /**
   * 获取敏感词列表
   */
  getSensitiveWords() {
    return apiClient.get<{words: SensitiveWord[], total: number}>(`${BASE_URL}/sensitive-words`);
  },
  
  /**
   * 添加敏感词
   */
  addSensitiveWord(word: Omit<SensitiveWord, 'id' | 'createTime' | 'updateTime'>) {
    return apiClient.post<SensitiveWord>(`${BASE_URL}/sensitive-words`, word);
  },
  
  /**
   * 更新敏感词
   */
  updateSensitiveWord(id: string, word: Partial<SensitiveWord>) {
    return apiClient.put<SensitiveWord>(`${BASE_URL}/sensitive-words/${id}`, word);
  },
  
  /**
   * 删除敏感词
   */
  deleteSensitiveWord(id: string) {
    return apiClient.delete<{success: boolean}>(`${BASE_URL}/sensitive-words/${id}`);
  },
  
  /**
   * 批量导入敏感词
   */
  importSensitiveWords(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.post<{success: boolean, imported: number, failed: number}>(
      `${BASE_URL}/sensitive-words/import`,
      formData,
      {
        headers: {
          'Content-Type': undefined as any
        }
      }
    );
  },
  
  /**
   * 导出敏感词
   */
  exportSensitiveWords() {
    return apiClient.get<Blob>(
      `${BASE_URL}/sensitive-words/export`,
      undefined,
      {
        headers: {
          'Accept': 'application/octet-stream'
        }
      }
    );
  },
  
  /**
   * 清除敏感词缓存
   */
  clearSensitiveWordCache() {
    return apiClient.post<{success: boolean}>(`${BASE_URL}/sensitive-words/clear-cache`);
  },
  
  /**
   * 检测文本是否包含敏感词
   */
  checkSensitiveWords(text: string) {
    return apiClient.post<{
      isSensitive: boolean;
      words: string[];
      suggestion: string;
    }>(`${BASE_URL}/sensitive-words/check`, { text });
  }
};

export default settingsApi;
