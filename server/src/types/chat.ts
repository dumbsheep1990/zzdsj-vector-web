// 聊天相关类型定义

import { BaseEntity, PaginationResponse, UserInfo } from './common';

export interface Conversation extends BaseEntity {
  title: string;
  assistant_id: number;
  user_id: number;
  metadata?: Record<string, any>;
  
  // 统计信息
  message_count: number;
  total_tokens: number;
  last_message_at?: string;
  
  // 关联数据
  assistant?: Assistant;
  messages?: ChatMessage[];
  
  // 状态
  is_archived: boolean;
  is_pinned: boolean;
}

export interface Assistant {
  id: number;
  name: string;
  description?: string;
  model: string;
  system_prompt?: string;
  avatar_url?: string;
  is_active: boolean;
}

export interface ChatMessage extends BaseEntity {
  conversation_id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  
  // 消息元数据
  metadata?: Record<string, any>;
  tokens?: number;
  
  // 多媒体支持
  attachments?: MessageAttachment[];
  voice_data?: VoiceData;
  
  // 状态
  is_edited: boolean;
  edit_history?: string[];
  
  // 评价
  rating?: number;
  feedback?: string;
}

export interface MessageAttachment {
  id: string;
  type: 'file' | 'image' | 'audio' | 'video';
  name: string;
  url: string;
  size: number;
  mimetype: string;
  metadata?: Record<string, any>;
}

export interface VoiceData {
  audio_url?: string;
  duration?: number;
  language?: string;
  transcript?: string;
  confidence?: number;
  voice_settings?: VoiceSettings;
}

export interface VoiceSettings {
  voice?: string;
  speed?: number;
  pitch?: number;
  volume?: number;
  language?: string;
}

// 请求/响应类型
export interface ConversationCreateRequest {
  title: string;
  assistant_id: number;
  metadata?: Record<string, any>;
}

export interface ConversationUpdateRequest {
  title?: string;
  metadata?: Record<string, any>;
  is_archived?: boolean;
  is_pinned?: boolean;
}

export interface ChatRequest {
  conversation_id?: number;
  assistant_id: number;
  message: string;
  
  // 对话配置
  stream?: boolean;
  include_context?: boolean;
  max_tokens?: number;
  temperature?: number;
  
  // 多媒体
  attachments?: File[];
  voice_input?: boolean;
  voice_output?: boolean;
  voice_settings?: VoiceSettings;
  
  // 上下文
  context_messages?: ChatMessage[];
  system_prompt_override?: string;
}

export interface ChatResponse {
  conversation_id: number;
  message: ChatMessage;
  
  // 统计信息
  tokens_used: number;
  response_time: number;
  
  // 语音响应
  audio_url?: string;
  voice_data?: VoiceData;
  
  // 上下文信息
  context_used: boolean;
  context_messages_count: number;
}

export interface VoiceChatRequest {
  assistant_id: number;
  conversation_id?: number;
  
  // 输入
  message?: string;
  audio_file?: File;
  
  // 配置
  enable_voice_input?: boolean;
  enable_voice_output?: boolean;
  transcribe_only?: boolean;
  
  // 语音设置
  voice_settings?: VoiceSettings;
}

export interface VoiceChatResponse {
  conversation_id: number;
  
  // 转录结果
  transcript?: string;
  confidence?: number;
  language?: string;
  
  // AI响应
  response_text?: string;
  response_audio_url?: string;
  
  // 消息信息
  user_message?: ChatMessage;
  assistant_message?: ChatMessage;
  
  // 处理信息
  processing_time: number;
  voice_processing_time?: number;
}

// 搜索和过滤
export interface ConversationSearchRequest {
  query?: string;
  assistant_id?: number;
  user_id?: number;
  date_from?: string;
  date_to?: string;
  is_archived?: boolean;
  is_pinned?: boolean;
  has_attachments?: boolean;
  min_messages?: number;
  tags?: string[];
}

export interface MessageSearchRequest {
  query: string;
  conversation_id?: number;
  assistant_id?: number;
  role?: 'user' | 'assistant' | 'system';
  date_from?: string;
  date_to?: string;
  has_attachments?: boolean;
  rating?: number;
}

export interface MessageSearchResult {
  messages: ChatMessage[];
  conversations: Conversation[];
  total: number;
  query: string;
  took_ms: number;
}

// 统计数据
export interface ConversationStats {
  total_conversations: number;
  total_messages: number;
  total_tokens: number;
  active_conversations: number;
  archived_conversations: number;
  favorite_assistants: Assistant[];
  daily_message_count: { date: string; count: number }[];
  weekly_token_usage: { week: string; tokens: number }[];
  response_time_avg: number;
}

// 导出配置
export interface ConversationExportRequest {
  conversation_ids?: number[];
  date_from?: string;
  date_to?: string;
  format: 'json' | 'csv' | 'pdf' | 'txt';
  include_metadata?: boolean;
  include_attachments?: boolean;
  include_voice_data?: boolean;
}

export interface ConversationExportResult {
  file_url: string;
  file_size: number;
  export_format: string;
  conversation_count: number;
  message_count: number;
  expires_at: string;
} 