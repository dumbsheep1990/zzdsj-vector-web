/**
 * 问答管理API服务
 */
import { Question, Answer, QaPair } from '../../../shared/types/qa';
import apiClient from './client';

const BASE_URL = 'qa';

/**
 * 问答API服务
 */
export const qaApi = {
  /**
   * 获取问题列表
   */
  getQuestions(assistantId?: string) {
    const params = assistantId ? { assistantId } : undefined;
    return apiClient.get<Question[]>(`${BASE_URL}/questions`, params);
  },
  
  /**
   * 获取问题详情及答案
   */
  getQuestionById(id: string) {
    return apiClient.get<{ question: Question, answer: Answer | null }>(`${BASE_URL}/questions/${id}`);
  },
  
  /**
   * 创建新问题
   */
  createQuestion(data: Omit<Question, 'id' | 'createdAt' | 'status'>) {
    return apiClient.post<Question>(`${BASE_URL}/questions`, data);
  },
  
  /**
   * 更新问题
   */
  updateQuestion(id: string, data: Partial<Question>) {
    return apiClient.put<Question>(`${BASE_URL}/questions/${id}`, data);
  },
  
  /**
   * 删除问题
   */
  deleteQuestion(id: string) {
    return apiClient.delete(`${BASE_URL}/questions/${id}`);
  },
  
  /**
   * 获取数据集问答对列表
   */
  getQaPairsByDatasetId(datasetId: string) {
    return apiClient.get<QaPair[]>(`${BASE_URL}/datasets/${datasetId}/qa-pairs`);
  },
  
  /**
   * 创建数据集问答对
   */
  createQaPair(datasetId: string, data: Omit<QaPair, 'id' | 'datasetId' | 'createdAt'>) {
    return apiClient.post<QaPair>(`${BASE_URL}/datasets/${datasetId}/qa-pairs`, data);
  },
  
  /**
   * 批量保存拆分的问答对
   */
  saveSplitQaPairs(datasetId: string, data: Omit<QaPair, 'id' | 'datasetId' | 'createdAt'>[]) {
    return apiClient.post<QaPair[]>(`${BASE_URL}/datasets/${datasetId}/split-qa-pairs`, data);
  }
};

export default qaApi;
