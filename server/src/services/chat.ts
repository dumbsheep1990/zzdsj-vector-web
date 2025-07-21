import { createApiClient } from '../utils/apiClient';
import { logger } from '../utils/logger';
import { 
  Conversation,
  ConversationCreateRequest,
  ConversationUpdateRequest,
  ConversationSearchRequest,
  ChatRequest,
  ChatResponse,
  VoiceChatRequest,
  VoiceChatResponse,
  ChatMessage,
  MessageSearchRequest,
  MessageSearchResult,
  ConversationStats,
  ConversationExportRequest,
  ConversationExportResult
} from '../types/chat';
import { PaginationParams, PaginationResponse } from '../types/common';

export class ChatService {
  private apiClient = createApiClient();
  private readonly baseUrl = '/api/frontend/chat';

  // ================ 对话管理 ================

  /**
   * 获取对话列表
   */
  async getConversations(params?: PaginationParams & ConversationSearchRequest): Promise<PaginationResponse<Conversation>> {
    try {
      logger.info('获取对话列表', { params });
      const response = await this.apiClient.get<PaginationResponse<Conversation>>(
        `${this.baseUrl}/conversations`,
        { params }
      );
      if (!response.data) {
        throw new Error('获取对话列表失败：服务器返回空数据');
      }
      return response.data;
    } catch (error) {
      logger.error('获取对话列表失败:', error);
      throw new Error('获取对话列表失败');
    }
  }

  /**
   * 根据ID获取对话详情
   */
  async getConversationById(id: number): Promise<Conversation> {
    try {
      logger.info(`获取对话详情, ID: ${id}`);
      const response = await this.apiClient.get<Conversation>(`${this.baseUrl}/conversations/${id}`);
      if (!response.data) {
        throw new Error('获取对话详情失败：服务器返回空数据');
      }
      return response.data;
    } catch (error) {
      logger.error(`获取对话详情失败, ID: ${id}:`, error);
      throw new Error(`获取对话详情失败: ${error}`);
    }
  }

  /**
   * 创建新对话
   */
  async createConversation(data: ConversationCreateRequest): Promise<Conversation> {
    try {
      logger.info('创建对话', { data });
      const response = await this.apiClient.post<Conversation>(`${this.baseUrl}/conversations`, data);
      if (!response.data) {
        throw new Error('创建对话失败：服务器返回空数据');
      }
      return response.data;
    } catch (error) {
      logger.error('创建对话失败:', error);
      throw new Error('创建对话失败');
    }
  }

  /**
   * 更新对话
   */
  async updateConversation(id: number, data: ConversationUpdateRequest): Promise<Conversation> {
    try {
      logger.info(`更新对话, ID: ${id}`, { data });
      const response = await this.apiClient.put<Conversation>(`${this.baseUrl}/conversations/${id}`, data);
      if (!response.data) {
        throw new Error('更新对话失败：服务器返回空数据');
      }
      return response.data;
    } catch (error) {
      logger.error(`更新对话失败, ID: ${id}:`, error);
      throw new Error(`更新对话失败: ${error}`);
    }
  }

  /**
   * 删除对话
   */
  async deleteConversation(id: number): Promise<void> {
    try {
      logger.info(`删除对话, ID: ${id}`);
      await this.apiClient.delete(`${this.baseUrl}/conversations/${id}`);
    } catch (error) {
      logger.error(`删除对话失败, ID: ${id}:`, error);
      throw new Error(`删除对话失败: ${error}`);
    }
  }

  /**
   * 归档对话
   */
  async archiveConversation(id: number): Promise<Conversation> {
    try {
      logger.info(`归档对话, ID: ${id}`);
      const response = await this.apiClient.post<Conversation>(`${this.baseUrl}/conversations/${id}/archive`);
      if (!response.data) {
        throw new Error('归档对话失败：服务器返回空数据');
      }
      return response.data;
    } catch (error) {
      logger.error(`归档对话失败, ID: ${id}:`, error);
      throw new Error(`归档对话失败: ${error}`);
    }
  }

  /**
   * 恢复对话
   */
  async restoreConversation(id: number): Promise<Conversation> {
    try {
      logger.info(`恢复对话, ID: ${id}`);
      const response = await this.apiClient.post<Conversation>(`${this.baseUrl}/conversations/${id}/restore`);
      if (!response.data) {
        throw new Error('恢复对话失败：服务器返回空数据');
      }
      return response.data;
    } catch (error) {
      logger.error(`恢复对话失败, ID: ${id}:`, error);
      throw new Error(`恢复对话失败: ${error}`);
    }
  }

  // ================ 消息管理 ================

  /**
   * 获取对话消息列表
   */
  async getMessages(
    conversationId: number,
    params?: PaginationParams & {
      order?: 'asc' | 'desc';
      role?: string;
      include_metadata?: boolean;
    }
  ): Promise<PaginationResponse<ChatMessage>> {
    try {
      logger.info(`获取对话消息, 对话ID: ${conversationId}`, { params });
      const response = await this.apiClient.get<PaginationResponse<ChatMessage>>(
        `${this.baseUrl}/conversations/${conversationId}/messages`,
        { params }
      );
      if (!response.data) {
        throw new Error('获取消息列表失败：服务器返回空数据');
      }
      return response.data;
    } catch (error) {
      logger.error(`获取对话消息失败, 对话ID: ${conversationId}:`, error);
      throw new Error(`获取对话消息失败: ${error}`);
    }
  }

  /**
   * 发送聊天消息
   */
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      logger.info('发送聊天消息', { assistant_id: request.assistant_id });
      const response = await this.apiClient.post<ChatResponse>(`${this.baseUrl}/chat`, request);
      if (!response.data) {
        throw new Error('发送消息失败：服务器返回空数据');
      }
      return response.data;
    } catch (error) {
      logger.error('发送聊天消息失败:', error);
      throw new Error('发送聊天消息失败');
    }
  }

  /**
   * 流式聊天
   */
  async sendMessageStream(
    request: ChatRequest,
    onData: (chunk: string) => void
  ): Promise<void> {
    try {
      logger.info('发送流式聊天消息', { assistant_id: request.assistant_id });
      await this.apiClient.stream(
        `${this.baseUrl}/chat`,
        { ...request, stream: true },
        onData
      );
    } catch (error) {
      logger.error('流式聊天失败:', error);
      throw new Error('流式聊天失败');
    }
  }

  /**
   * 语音聊天
   */
  async voiceChat(request: VoiceChatRequest): Promise<VoiceChatResponse> {
    try {
      logger.info('语音聊天', { assistant_id: request.assistant_id });
      
      // 准备FormData
      const formData = new FormData();
      formData.append('assistant_id', request.assistant_id.toString());
      
      if (request.conversation_id) {
        formData.append('conversation_id', request.conversation_id.toString());
      }
      if (request.message) {
        formData.append('message', request.message);
      }
      if (request.audio_file) {
        formData.append('audio_file', request.audio_file);
      }
      if (request.enable_voice_input !== undefined) {
        formData.append('enable_voice_input', request.enable_voice_input.toString());
      }
      if (request.enable_voice_output !== undefined) {
        formData.append('enable_voice_output', request.enable_voice_output.toString());
      }
      if (request.transcribe_only !== undefined) {
        formData.append('transcribe_only', request.transcribe_only.toString());
      }
      if (request.voice_settings) {
        Object.entries(request.voice_settings).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });
      }

      const response = await this.apiClient.post<VoiceChatResponse>(
        `${this.baseUrl}/chat/voice`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (!response.data) {
        throw new Error('语音聊天失败：服务器返回空数据');
      }
      return response.data;
    } catch (error) {
      logger.error('语音聊天失败:', error);
      throw new Error('语音聊天失败');
    }
  }

  /**
   * 编辑消息
   */
  async editMessage(messageId: number, content: string): Promise<ChatMessage> {
    try {
      logger.info(`编辑消息, ID: ${messageId}`);
      const response = await this.apiClient.put<ChatMessage>(
        `${this.baseUrl}/messages/${messageId}`,
        { content }
      );
      if (!response.data) {
        throw new Error('编辑消息失败：服务器返回空数据');
      }
      return response.data;
    } catch (error) {
      logger.error(`编辑消息失败, ID: ${messageId}:`, error);
      throw new Error(`编辑消息失败: ${error}`);
    }
  }

  /**
   * 删除消息
   */
  async deleteMessage(messageId: number): Promise<void> {
    try {
      logger.info(`删除消息, ID: ${messageId}`);
      await this.apiClient.delete(`${this.baseUrl}/messages/${messageId}`);
    } catch (error) {
      logger.error(`删除消息失败, ID: ${messageId}:`, error);
      throw new Error(`删除消息失败: ${error}`);
    }
  }

  /**
   * 评价消息
   */
  async rateMessage(messageId: number, rating: number, feedback?: string): Promise<ChatMessage> {
    try {
      logger.info(`评价消息, ID: ${messageId}, 评分: ${rating}`);
      const response = await this.apiClient.post<ChatMessage>(
        `${this.baseUrl}/messages/${messageId}/rate`,
        { rating, feedback }
      );
      if (!response.data) {
        throw new Error('评价消息失败：服务器返回空数据');
      }
      return response.data;
    } catch (error) {
      logger.error(`评价消息失败, ID: ${messageId}:`, error);
      throw new Error(`评价消息失败: ${error}`);
    }
  }

  // ================ 搜索功能 ================

  /**
   * 搜索消息
   */
  async searchMessages(request: MessageSearchRequest): Promise<MessageSearchResult> {
    try {
      logger.info('搜索消息', { query: request.query });
      const response = await this.apiClient.post<MessageSearchResult>(
        `${this.baseUrl}/search/messages`,
        request
      );
      if (!response.data) {
        throw new Error('搜索消息失败：服务器返回空数据');
      }
      return response.data;
    } catch (error) {
      logger.error('搜索消息失败:', error);
      throw new Error('搜索消息失败');
    }
  }

  // ================ 语音功能 ================

  /**
   * 文本转语音
   */
  async textToSpeech(
    text: string,
    voice?: string,
    speed?: number
  ): Promise<Blob> {
    try {
      logger.info('文本转语音', { text_length: text.length });
      
      const formData = new FormData();
      formData.append('text', text);
      if (voice) formData.append('voice', voice);
      if (speed) formData.append('speed', speed.toString());

      const response = await this.apiClient.post(
        `${this.baseUrl}/voice/speech`,
        formData,
        {
          responseType: 'blob',
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      return response.data as Blob;
    } catch (error) {
      logger.error('文本转语音失败:', error);
      throw new Error('文本转语音失败');
    }
  }

  // ================ 统计和分析 ================

  /**
   * 获取对话统计
   */
  async getConversationStats(
    dateFrom?: string,
    dateTo?: string
  ): Promise<ConversationStats> {
    try {
      logger.info('获取对话统计');
      const params: any = {};
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;

      const response = await this.apiClient.get<ConversationStats>(
        `${this.baseUrl}/stats`,
        { params }
      );
      if (!response.data) {
        throw new Error('获取统计信息失败：服务器返回空数据');
      }
      return response.data;
    } catch (error) {
      logger.error('获取对话统计失败:', error);
      throw new Error('获取对话统计失败');
    }
  }

  // ================ 导出功能 ================

  /**
   * 导出对话
   */
  async exportConversations(request: ConversationExportRequest): Promise<ConversationExportResult> {
    try {
      logger.info('导出对话', { format: request.format });
      const response = await this.apiClient.post<ConversationExportResult>(
        `${this.baseUrl}/export`,
        request
      );
      if (!response.data) {
        throw new Error('导出对话失败：服务器返回空数据');
      }
      return response.data;
    } catch (error) {
      logger.error('导出对话失败:', error);
      throw new Error('导出对话失败');
    }
  }

  /**
   * 批量操作对话
   */
  async batchOperateConversations(
    conversationIds: number[],
    operation: 'archive' | 'restore' | 'delete',
    metadata?: Record<string, any>
  ): Promise<{
    success: number[];
    failed: number[];
    total: number;
  }> {
    try {
      logger.info(`批量${operation}对话`, { count: conversationIds.length });
      const response = await this.apiClient.post(
        `${this.baseUrl}/conversations/batch`,
        {
          conversation_ids: conversationIds,
          operation,
          metadata
        }
      );
      if (!response.data) {
        throw new Error('批量操作失败：服务器返回空数据');
      }
      return response.data;
    } catch (error) {
      logger.error(`批量${operation}对话失败:`, error);
      throw new Error(`批量${operation}对话失败`);
    }
  }
}

export const chatService = new ChatService(); 