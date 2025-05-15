/**
 * 知识库API服务
 */
import { KnowledgeBaseItem, KnowledgeFileItem } from '../../../shared/types/knowledge';
import apiClient from './client';

const BASE_URL = 'knowledge';

/**
 * 知识库API服务
 */
export const knowledgeApi = {
  /**
   * 获取知识库列表
   */
  getKnowledgeBases() {
    return apiClient.get<KnowledgeBaseItem[]>(BASE_URL);
  },
  
  /**
   * 获取知识库详情
   */
  getKnowledgeBaseById(id: string) {
    return apiClient.get<KnowledgeBaseItem>(`${BASE_URL}/${id}`);
  },
  
  /**
   * 创建知识库
   */
  createKnowledgeBase(data: Omit<KnowledgeBaseItem, 'id' | 'fileCount' | 'lastUpdated'>) {
    return apiClient.post<KnowledgeBaseItem>(BASE_URL, data);
  },
  
  /**
   * 更新知识库
   */
  updateKnowledgeBase(id: string, data: Partial<KnowledgeBaseItem>) {
    return apiClient.put<KnowledgeBaseItem>(`${BASE_URL}/${id}`, data);
  },
  
  /**
   * 删除知识库
   */
  deleteKnowledgeBase(id: string) {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },
  
  /**
   * 获取知识库文件列表
   */
  getKnowledgeBaseFiles(knowledgeBaseId: string) {
    return apiClient.get<KnowledgeFileItem[]>(`${BASE_URL}/${knowledgeBaseId}/files`);
  },
  
  /**
   * 上传文件到知识库
   */
  uploadFile(knowledgeBaseId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.post<KnowledgeFileItem>(
      `${BASE_URL}/${knowledgeBaseId}/files`,
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
   * 删除知识库文件
   */
  deleteFile(knowledgeBaseId: string, fileId: string) {
    return apiClient.delete(`${BASE_URL}/${knowledgeBaseId}/files/${fileId}`);
  }
};

export default knowledgeApi;
