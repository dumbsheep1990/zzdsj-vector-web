/**
 * 提示词模板API服务
 */
import { 
  PromptTemplate, 
  PromptCategory, 
  PromptAssistantBinding,
  PromptSearchParams
} from '../../../shared/types/prompt-template';
import apiClient from './client';

const BASE_URL = 'prompt-templates';

/**
 * 提示词模板API服务
 */
export const promptTemplateApi = {
  /**
   * 获取模板列表
   */
  getTemplates(params?: PromptSearchParams) {
    return apiClient.get<PromptTemplate[]>(BASE_URL, params);
  },
  
  /**
   * 获取模板详情
   */
  getTemplateById(id: string) {
    return apiClient.get<PromptTemplate>(`${BASE_URL}/${id}`);
  },
  
  /**
   * 创建模板
   */
  createTemplate(template: Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt' | 'isBound'>) {
    return apiClient.post<PromptTemplate>(BASE_URL, template);
  },
  
  /**
   * 更新模板
   */
  updateTemplate(id: string, template: Partial<Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt'>>) {
    return apiClient.put<PromptTemplate>(`${BASE_URL}/${id}`, template);
  },
  
  /**
   * 删除模板
   */
  deleteTemplate(id: string) {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },
  
  /**
   * 获取模板分类
   */
  getCategories() {
    return apiClient.get<PromptCategory[]>(`${BASE_URL}/categories`);
  },
  
  /**
   * 创建分类
   */
  createCategory(category: Omit<PromptCategory, 'id' | 'count'>) {
    return apiClient.post<PromptCategory>(`${BASE_URL}/categories`, category);
  },
  
  /**
   * 更新分类
   */
  updateCategory(id: string, category: Partial<Omit<PromptCategory, 'id' | 'count'>>) {
    return apiClient.put<PromptCategory>(`${BASE_URL}/categories/${id}`, category);
  },
  
  /**
   * 删除分类
   */
  deleteCategory(id: string) {
    return apiClient.delete(`${BASE_URL}/categories/${id}`);
  },
  
  /**
   * 绑定模板到助手
   */
  bindToAssistants(templateId: string, assistantIds: string[]) {
    return apiClient.post<PromptAssistantBinding[]>(
      `${BASE_URL}/${templateId}/assistants`, 
      { assistantIds }
    );
  },
  
  /**
   * 解绑模板从助手
   */
  unbindFromAssistants(templateId: string, assistantIds: string[]) {
    // 使用查询参数传递助手IDs
    return apiClient.delete(
      `${BASE_URL}/${templateId}/assistants?ids=${assistantIds.join(',')}`
    );
  },
  
  /**
   * 获取绑定到模板的助手
   */
  getTemplateAssistants(templateId: string) {
    return apiClient.get<{id: string, name: string}[]>(`${BASE_URL}/${templateId}/assistants`);
  },
  
  /**
   * 获取助手绑定的所有模板
   */
  getAssistantTemplates(assistantId: string) {
    return apiClient.get<PromptTemplate[]>(`${BASE_URL}/assistant/${assistantId}`);
  },
  
  /**
   * 批量导入模板
   */
  importTemplates(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.post<{success: boolean, imported: number, errors?: string[]}>(
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
   * 导出模板
   */
  exportTemplates(ids?: string[]) {
    const params = ids?.length ? { ids: ids.join(',') } : undefined;
    
    return apiClient.get<Blob>(
      `${BASE_URL}/export`,
      params,
      {
        headers: {
          'Accept': 'application/octet-stream'
        }
      }
    );
  },
  
  /**
   * 测试模板
   */
  testTemplate(templateId: string, variables?: Record<string, any>) {
    return apiClient.post<{result: string}>(`${BASE_URL}/${templateId}/test`, { variables });
  },
  
  /**
   * 获取模板变量
   */
  extractTemplateVariables(content: string) {
    return apiClient.post<{variables: string[]}>(`${BASE_URL}/extract-variables`, { content });
  }
};

export default promptTemplateApi;
