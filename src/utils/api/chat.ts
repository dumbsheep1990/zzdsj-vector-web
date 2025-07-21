/**
 * Chat API - 聊天服务接口
 * 与chat-service微服务通信，支持用户认证和会话管理
 */

import apiClient from './client';
import { useAuth } from '../../context/AuthContext';

// ================================
// 类型定义
// ================================

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  status?: 'sending' | 'sent' | 'error';
  message_type?: 'text' | 'image' | 'file' | 'voice';
}

export interface ChatSession {
  session_id: string;
  user_id: string;
  agent_id?: string;
  created_at: string;
  last_activity: string;
  message_count: number;
  status: 'active' | 'paused' | 'ended';
  config?: Record<string, any>;
}

export interface CreateSessionRequest {
  agent_id?: string;
  session_config?: Record<string, any>;
  user_preferences?: Record<string, any>;
}

export interface CreateSessionResponse {
  success: boolean;
  session_id: string;
  session_info: ChatSession;
  agent_id?: string;
  user_preferences?: Record<string, any>;
}

export interface SendMessageRequest {
  session_id: string;
  message: string;
  message_type?: 'text' | 'image' | 'file' | 'voice';
  stream?: boolean;
  voice_config?: Record<string, any>;
}

export interface SendMessageResponse {
  success: boolean;
  message_id: string;
  response: string;
  session_id: string;
  timestamp: string;
  agent_id?: string;
  metadata?: Record<string, any>;
}

export interface SessionHistoryResponse {
  success: boolean;
  messages: ChatMessage[];
  session_info: ChatSession;
  total_messages: number;
  page?: number;
  page_size?: number;
}

export interface AgentInstance {
  instance_id: string;
  agent_id: string;
  user_id: string;
  session_id: string;
  status: 'creating' | 'active' | 'paused' | 'stopped';
  created_at: string;
  last_activity: string;
}

// ================================
// API接口实现
// ================================

/**
 * 获取认证头信息
 */
function getAuthHeaders(): Record<string, string> {
  const authState = JSON.parse(localStorage.getItem('authState') || '{}');
  const headers: Record<string, string> = {};
  
  if (authState.accessToken) {
    headers['Authorization'] = `Bearer ${authState.accessToken}`;
  }
  
  if (authState.user?.id) {
    headers['X-User-ID'] = authState.user.id;
  }
  
  return headers;
}

/**
 * Chat API类
 */
export class ChatAPI {
  private static readonly BASE_URL = '/api/chat';
  
  /**
   * 创建聊天会话
   */
  static async createSession(request: CreateSessionRequest): Promise<CreateSessionResponse> {
    const headers = getAuthHeaders();
    
    const response = await apiClient.post<CreateSessionResponse>(
      `${this.BASE_URL}/session`,
      request,
      { headers }
    );
    
    return response;
  }
  
  /**
   * 发送消息（非流式）
   */
  static async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    const headers = getAuthHeaders();
    
    // 添加会话ID到头部
    if (request.session_id) {
      headers['X-Session-ID'] = request.session_id;
    }
    
    const response = await apiClient.post<SendMessageResponse>(
      `${this.BASE_URL}/message`,
      request,
      { headers }
    );
    
    return response;
  }
  
  /**
   * 发送流式消息
   */
  static createStreamingMessage(request: SendMessageRequest): EventSource {
    const headers = getAuthHeaders();
    
    // 构建查询参数
    const params = new URLSearchParams({
      session_id: request.session_id,
      message: request.message,
      message_type: request.message_type || 'text'
    });
    
    if (request.voice_config) {
      params.append('voice_config', JSON.stringify(request.voice_config));
    }
    
    // 构建完整URL
    const url = `${this.BASE_URL}/message/stream?${params.toString()}`;
    
    // 创建EventSource，注意：EventSource不支持自定义headers
    // 需要通过查询参数传递认证信息或使用其他方式
    const eventSource = new EventSource(url);
    
    return eventSource;
  }
  
  /**
   * 获取会话历史
   */
  static async getSessionHistory(
    sessionId: string, 
    page: number = 1, 
    pageSize: number = 50
  ): Promise<SessionHistoryResponse> {
    const headers = getAuthHeaders();
    headers['X-Session-ID'] = sessionId;
    
    const response = await apiClient.get<SessionHistoryResponse>(
      `${this.BASE_URL}/session/${sessionId}/history`,
      { page, page_size: pageSize },
      { headers }
    );
    
    return response;
  }
  
  /**
   * 获取会话信息
   */
  static async getSession(sessionId: string): Promise<{ success: boolean; session: ChatSession }> {
    const headers = getAuthHeaders();
    headers['X-Session-ID'] = sessionId;
    
    const response = await apiClient.get<{ success: boolean; session: ChatSession }>(
      `${this.BASE_URL}/session/${sessionId}`,
      {},
      { headers }
    );
    
    return response;
  }
  
  /**
   * 删除会话
   */
  static async deleteSession(sessionId: string): Promise<{ success: boolean; message: string }> {
    const headers = getAuthHeaders();
    headers['X-Session-ID'] = sessionId;
    
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `${this.BASE_URL}/session/${sessionId}`,
      { headers }
    );
    
    return response;
  }
  
  /**
   * 获取用户的所有会话
   */
  static async getUserSessions(
    page: number = 1, 
    pageSize: number = 20
  ): Promise<{ success: boolean; sessions: ChatSession[]; total: number }> {
    const headers = getAuthHeaders();
    
    const response = await apiClient.get<{ success: boolean; sessions: ChatSession[]; total: number }>(
      `${this.BASE_URL}/sessions`,
      { page, page_size: pageSize },
      { headers }
    );
    
    return response;
  }
}

// ================================
// 智能体实例管理API
// ================================

export class AgentInstanceAPI {
  private static readonly BASE_URL = '/api/agent-instances';
  
  /**
   * 创建智能体实例
   */
  static async createInstance(agentId: string): Promise<AgentInstance> {
    const headers = getAuthHeaders();
    
    const response = await apiClient.post<AgentInstance>(
      `${this.BASE_URL}`,
      { agent_id: agentId },
      { headers }
    );
    
    return response;
  }
  
  /**
   * 获取智能体实例
   */
  static async getInstance(instanceId: string): Promise<AgentInstance> {
    const headers = getAuthHeaders();
    
    const response = await apiClient.get<AgentInstance>(
      `${this.BASE_URL}/${instanceId}`,
      {},
      { headers }
    );
    
    return response;
  }
  
  /**
   * 销毁智能体实例
   */
  static async destroyInstance(instanceId: string): Promise<{ success: boolean; message: string }> {
    const headers = getAuthHeaders();
    
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `${this.BASE_URL}/${instanceId}`,
      { headers }
    );
    
    return response;
  }
  
  /**
   * 获取用户的智能体实例列表
   */
  static async getUserInstances(): Promise<{ success: boolean; instances: AgentInstance[] }> {
    const headers = getAuthHeaders();
    
    const response = await apiClient.get<{ success: boolean; instances: AgentInstance[] }>(
      `${this.BASE_URL}`,
      {},
      { headers }
    );
    
    return response;
  }
}

// 导出默认API实例
export default {
  chat: ChatAPI,
  agentInstance: AgentInstanceAPI
};
