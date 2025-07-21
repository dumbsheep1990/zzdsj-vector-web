// 助手服务

import { apiClient } from '../utils/apiClient';
import { logger } from '../utils/logger';
import {
  Assistant,
  AssistantCreateRequest,
  AssistantUpdateRequest,
  AssistantTestRequest,
  AssistantTestResponse,
  AssistantTemplate,
  AssistantFromTemplateRequest,
  DynamicAgent,
  AgentExecutionRequest,
  AgentExecutionResponse,
  QASession,
  QAMessage,
  QASearchRequest,
  AssistantAnalytics
} from '../types/assistants';
import { ApiResponse, PaginationParams, PaginationResponse } from '../types/common';

export class AssistantService {
  private readonly baseUrl = '/api/frontend/assistants';

  // 助手管理
  async getAssistants(params?: {
    category?: string;
    capabilities?: string[];
    is_public?: boolean;
    search?: string;
    tags?: string[];
  } & PaginationParams): Promise<PaginationResponse<Assistant>> {
    try {
      logger.info('Fetching assistants list', params);
      
      const response = await apiClient.get<{
        assistants: Assistant[];
        total: number;
        limit: number;
        offset: number;
      }>('/assistants', { params });
      
      if (response.success && response.data) {
        return {
          items: response.data.assistants,
          total: response.data.total,
          page: Math.floor((response.data.offset || 0) / (response.data.limit || 20)) + 1,
          page_size: response.data.limit || 20,
          total_pages: Math.ceil(response.data.total / (response.data.limit || 20))
        };
      }
      
      throw new Error(response.message || '获取助手列表失败');
    } catch (error) {
      logger.error('Get assistants failed:', error);
      throw error;
    }
  }

  async getAssistantById(id: number, options?: {
    include_config?: boolean;
    include_knowledge_bases?: boolean;
  }): Promise<Assistant> {
    try {
      logger.info('Fetching assistant by ID', { id, ...options });
      
      const response = await apiClient.get<Assistant>(`/assistants/${id}`, {
        params: options
      });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || '获取助手信息失败');
    } catch (error) {
      logger.error('Get assistant by ID failed:', error);
      throw error;
    }
  }

  async createAssistant(assistantData: AssistantCreateRequest): Promise<Assistant> {
    try {
      logger.info('Creating new assistant', { name: assistantData.name });
      
      const response = await apiClient.post<Assistant>('/assistants', assistantData);
      
      if (response.success && response.data) {
        logger.info('Assistant created successfully', { id: response.data.id });
        return response.data;
      }
      
      throw new Error(response.message || '创建助手失败');
    } catch (error) {
      logger.error('Create assistant failed:', error);
      throw error;
    }
  }

  async updateAssistant(id: number, assistantData: AssistantUpdateRequest): Promise<Assistant> {
    try {
      logger.info('Updating assistant', { id });
      
      const response = await apiClient.put<Assistant>(`/assistants/${id}`, assistantData);
      
      if (response.success && response.data) {
        logger.info('Assistant updated successfully', { id });
        return response.data;
      }
      
      throw new Error(response.message || '更新助手失败');
    } catch (error) {
      logger.error('Update assistant failed:', error);
      throw error;
    }
  }

  async deleteAssistant(id: number): Promise<void> {
    try {
      logger.info('Deleting assistant', { id });
      
      const response = await apiClient.delete(`/assistants/${id}`);
      
      if (!response.success) {
        throw new Error(response.message || '删除助手失败');
      }
      
      logger.info('Assistant deleted successfully', { id });
    } catch (error) {
      logger.error('Delete assistant failed:', error);
      throw error;
    }
  }

  async testAssistant(id: number, testData: AssistantTestRequest): Promise<AssistantTestResponse> {
    try {
      logger.info('Testing assistant', { id, message: testData.message });
      
      const response = await apiClient.post<AssistantTestResponse>(
        `/assistants/${id}/test`,
        testData
      );
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || '测试助手失败');
    } catch (error) {
      logger.error('Test assistant failed:', error);
      throw error;
    }
  }

  // 助手分类
  async getAssistantCategories(): Promise<string[]> {
    try {
      const response = await apiClient.get<{ categories: string[] }>('/assistants/categories');
      
      if (response.success && response.data) {
        return response.data.categories;
      }
      
      return [];
    } catch (error) {
      logger.error('Get assistant categories failed:', error);
      return [];
    }
  }

  // 助手模板
  async getAssistantTemplates(params?: {
    category?: string;
    search?: string;
  } & PaginationParams): Promise<PaginationResponse<AssistantTemplate>> {
    try {
      const response = await apiClient.get<{
        templates: AssistantTemplate[];
        total: number;
        limit: number;
        offset: number;
      }>('/assistants/templates', { params });
      
      if (response.success && response.data) {
        return {
          items: response.data.templates,
          total: response.data.total,
          page: Math.floor((response.data.offset || 0) / (response.data.limit || 20)) + 1,
          page_size: response.data.limit || 20,
          total_pages: Math.ceil(response.data.total / (response.data.limit || 20))
        };
      }
      
      throw new Error(response.message || '获取助手模板失败');
    } catch (error) {
      logger.error('Get assistant templates failed:', error);
      throw error;
    }
  }

  async createAssistantFromTemplate(templateData: AssistantFromTemplateRequest): Promise<Assistant> {
    try {
      logger.info('Creating assistant from template', { template_id: templateData.template_id });
      
      const response = await apiClient.post<Assistant>(
        '/assistants/from-template',
        templateData
      );
      
      if (response.success && response.data) {
        logger.info('Assistant created from template successfully', { id: response.data.id });
        return response.data;
      }
      
      throw new Error(response.message || '从模板创建助手失败');
    } catch (error) {
      logger.error('Create assistant from template failed:', error);
      throw error;
    }
  }

  // 动态代理
  async getDynamicAgents(params?: PaginationParams): Promise<PaginationResponse<DynamicAgent>> {
    try {
      const response = await apiClient.get<{
        agents: DynamicAgent[];
        total: number;
        limit: number;
        offset: number;
      }>('/assistants/dynamic-agents', { params });
      
      if (response.success && response.data) {
        return {
          items: response.data.agents,
          total: response.data.total,
          page: Math.floor((response.data.offset || 0) / (response.data.limit || 20)) + 1,
          page_size: response.data.limit || 20,
          total_pages: Math.ceil(response.data.total / (response.data.limit || 20))
        };
      }
      
      throw new Error(response.message || '获取动态代理失败');
    } catch (error) {
      logger.error('Get dynamic agents failed:', error);
      throw error;
    }
  }

  async executeAgent(agentId: string, executionData: AgentExecutionRequest): Promise<AgentExecutionResponse> {
    try {
      logger.info('Executing dynamic agent', { agentId, input: executionData.input });
      
      const response = await apiClient.post<AgentExecutionResponse>(
        `/assistants/dynamic-agents/${agentId}/execute`,
        executionData
      );
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || '执行代理失败');
    } catch (error) {
      logger.error('Execute agent failed:', error);
      throw error;
    }
  }

  // QA会话管理
  async getQASessions(assistantId?: number, params?: PaginationParams): Promise<PaginationResponse<QASession>> {
    try {
      const queryParams = { ...params };
      if (assistantId) {
        (queryParams as any).assistant_id = assistantId;
      }
      
      const response = await apiClient.get<{
        sessions: QASession[];
        total: number;
        limit: number;
        offset: number;
      }>('/assistants/qa/sessions', { params: queryParams });
      
      if (response.success && response.data) {
        return {
          items: response.data.sessions,
          total: response.data.total,
          page: Math.floor((response.data.offset || 0) / (response.data.limit || 20)) + 1,
          page_size: response.data.limit || 20,
          total_pages: Math.ceil(response.data.total / (response.data.limit || 20))
        };
      }
      
      throw new Error(response.message || '获取QA会话失败');
    } catch (error) {
      logger.error('Get QA sessions failed:', error);
      throw error;
    }
  }

  async getQAMessages(sessionId: string, params?: PaginationParams): Promise<PaginationResponse<QAMessage>> {
    try {
      const response = await apiClient.get<{
        messages: QAMessage[];
        total: number;
        limit: number;
        offset: number;
      }>(`/assistants/qa/sessions/${sessionId}/messages`, { params });
      
      if (response.success && response.data) {
        return {
          items: response.data.messages,
          total: response.data.total,
          page: Math.floor((response.data.offset || 0) / (response.data.limit || 20)) + 1,
          page_size: response.data.limit || 20,
          total_pages: Math.ceil(response.data.total / (response.data.limit || 20))
        };
      }
      
      throw new Error(response.message || '获取QA消息失败');
    } catch (error) {
      logger.error('Get QA messages failed:', error);
      throw error;
    }
  }

  async searchQA(searchRequest: QASearchRequest): Promise<{
    sessions: QASession[];
    messages: QAMessage[];
    total: number;
  }> {
    try {
      const response = await apiClient.post<{
        sessions: QASession[];
        messages: QAMessage[];
        total: number;
      }>('/assistants/qa/search', searchRequest);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || '搜索QA失败');
    } catch (error) {
      logger.error('Search QA failed:', error);
      throw error;
    }
  }

  // 助手分析
  async getAssistantAnalytics(
    assistantId: number,
    period: 'day' | 'week' | 'month' | 'year' = 'week'
  ): Promise<AssistantAnalytics> {
    try {
      const response = await apiClient.get<AssistantAnalytics>(
        `/assistants/${assistantId}/analytics`,
        { params: { period } }
      );
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || '获取助手分析数据失败');
    } catch (error) {
      logger.error('Get assistant analytics failed:', error);
      throw error;
    }
  }

  // 助手复制/克隆
  async cloneAssistant(id: number, newName?: string): Promise<Assistant> {
    try {
      logger.info('Cloning assistant', { id, newName });
      
      const response = await apiClient.post<Assistant>(`/assistants/${id}/clone`, {
        name: newName
      });
      
      if (response.success && response.data) {
        logger.info('Assistant cloned successfully', { 
          originalId: id, 
          newId: response.data.id 
        });
        return response.data;
      }
      
      throw new Error(response.message || '克隆助手失败');
    } catch (error) {
      logger.error('Clone assistant failed:', error);
      throw error;
    }
  }

  // 助手导出/导入
  async exportAssistant(id: number): Promise<Blob> {
    try {
      const response = await apiClient.get(`/assistants/${id}/export`, {
        responseType: 'blob'
      });
      
      return response.data;
    } catch (error) {
      logger.error('Export assistant failed:', error);
      throw error;
    }
  }

  async importAssistant(file: File): Promise<Assistant> {
    try {
      const response = await apiClient.upload<Assistant>('/assistants/import', file);
      
      if (response.success && response.data) {
        logger.info('Assistant imported successfully', { id: response.data.id });
        return response.data;
      }
      
      throw new Error(response.message || '导入助手失败');
    } catch (error) {
      logger.error('Import assistant failed:', error);
      throw error;
    }
  }
}

export const assistantService = new AssistantService(); 