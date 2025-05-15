/**
 * 助手管理API服务
 */
import { Assistant, Conversation, Message } from '../../../shared/types/assistant';
import apiClient from './client';

const BASE_URL = 'assistant';

/**
 * 助手API服务
 */
export const assistantApi = {
  /**
   * 获取助手列表
   */
  getAssistants() {
    return apiClient.get<Assistant[]>(BASE_URL);
  },
  
  /**
   * 获取助手详情
   */
  getAssistantById(id: string) {
    return apiClient.get<Assistant>(`${BASE_URL}/${id}`);
  },
  
  /**
   * 创建助手
   */
  createAssistant(data: Omit<Assistant, 'id' | 'createdAt' | 'updatedAt'>) {
    return apiClient.post<Assistant>(BASE_URL, data);
  },
  
  /**
   * 更新助手
   */
  updateAssistant(id: string, data: Partial<Assistant>) {
    return apiClient.put<Assistant>(`${BASE_URL}/${id}`, data);
  },
  
  /**
   * 删除助手
   */
  deleteAssistant(id: string) {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },
  
  /**
   * 切换助手状态
   */
  toggleAssistantStatus(id: string, status: 'active' | 'inactive') {
    return apiClient.put<Assistant>(`${BASE_URL}/${id}/status`, { status });
  },
  
  /**
   * 获取助手关联的知识库
   */
  getAssistantKnowledgeBases(id: string) {
    return apiClient.get<string[]>(`${BASE_URL}/${id}/knowledge-bases`);
  },
  
  /**
   * 更新助手关联的知识库
   */
  updateAssistantKnowledgeBases(id: string, knowledgeBaseIds: string[]) {
    return apiClient.put<string[]>(`${BASE_URL}/${id}/knowledge-bases`, { knowledgeBaseIds });
  },
  
  /**
   * 获取助手会话列表
   */
  getConversations(assistantId: string) {
    return apiClient.get<Conversation[]>(`${BASE_URL}/${assistantId}/conversations`);
  },
  
  /**
   * 创建新会话
   */
  createConversation(assistantId: string, title: string) {
    return apiClient.post<Conversation>(`${BASE_URL}/${assistantId}/conversations`, { title });
  },
  
  /**
   * 获取会话消息
   */
  getConversationMessages(conversationId: string) {
    return apiClient.get<Message[]>(`${BASE_URL}/conversations/${conversationId}/messages`);
  },
  
  /**
   * 发送消息
   */
  sendMessage(conversationId: string, content: string) {
    return apiClient.post<Message>(`${BASE_URL}/conversations/${conversationId}/messages`, {
      content,
      role: 'user'
    });
  }
};

export default assistantApi;
