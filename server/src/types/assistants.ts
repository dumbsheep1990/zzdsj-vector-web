// 助手相关类型定义

import { BaseEntity, PaginationResponse, UserInfo } from './common';

export interface Assistant extends BaseEntity {
  name: string;
  description?: string;
  model: string;
  system_prompt?: string;
  capabilities: string[];
  knowledge_base_ids: number[];
  is_public: boolean;
  category?: string;
  tags: string[];
  avatar_url?: string;
  config: Record<string, any>;
  
  // 所有权信息
  owner_id: number;
  owner?: UserInfo;
  
  // 统计信息
  usage_count: number;
  rating: number;
  review_count: number;
  
  // 状态信息
  status: 'active' | 'inactive' | 'training' | 'maintenance';
  is_featured: boolean;
  is_verified: boolean;
  
  // 模板信息
  template_id?: string;
  is_template: boolean;
  
  // 版本信息
  version: string;
  changelog?: string;
}

export interface AssistantCreateRequest {
  name: string;
  description?: string;
  model: string;
  system_prompt?: string;
  capabilities?: string[];
  knowledge_base_ids?: number[];
  is_public?: boolean;
  category?: string;
  tags?: string[];
  avatar_url?: string;
  config?: Record<string, any>;
  template_id?: string;
}

export interface AssistantUpdateRequest {
  name?: string;
  description?: string;
  model?: string;
  system_prompt?: string;
  capabilities?: string[];
  knowledge_base_ids?: number[];
  is_public?: boolean;
  category?: string;
  tags?: string[];
  avatar_url?: string;
  config?: Record<string, any>;
}

export interface AssistantTestRequest {
  message: string;
  include_knowledge?: boolean;
  max_tokens?: number;
  temperature?: number;
  context?: Record<string, any>;
}

export interface AssistantTestResponse {
  response: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
  took_ms: number;
  context_used: boolean;
  knowledge_sources?: string[];
}

// 助手模板相关
export interface AssistantTemplate extends BaseEntity {
  name: string;
  description?: string;
  category: string;
  template_config: {
    model: string;
    system_prompt: string;
    capabilities: string[];
    default_config: Record<string, any>;
  };
  variables: TemplateVariable[];
  is_system: boolean;
  created_by: number;
  usage_count: number;
  rating: number;
  tags: string[];
  preview_url?: string;
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect' | 'text';
  label: string;
  description?: string;
  required: boolean;
  default_value?: any;
  options?: Array<{ label: string; value: any }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface AssistantFromTemplateRequest {
  template_id: string;
  name: string;
  variables: Record<string, any>;
  customizations?: {
    description?: string;
    avatar_url?: string;
    tags?: string[];
    is_public?: boolean;
  };
}

// 动态代理相关
export interface DynamicAgent {
  id: string;
  name: string;
  description?: string;
  type: 'simple' | 'composite' | 'workflow';
  
  // 代理配置
  model_config: {
    model: string;
    temperature: number;
    max_tokens: number;
    top_p?: number;
    frequency_penalty?: number;
  };
  
  // 提示模板
  prompt_template: {
    system: string;
    user?: string;
    variables: Record<string, any>;
  };
  
  // 工具配置
  tools: AgentTool[];
  knowledge_bases: string[];
  
  // 执行配置
  execution_config: {
    max_iterations: number;
    timeout_seconds: number;
    parallel_execution: boolean;
    error_handling: 'stop' | 'continue' | 'retry';
  };
  
  // 状态信息
  status: 'idle' | 'running' | 'paused' | 'stopped' | 'error';
  created_by: number;
  is_active: boolean;
}

export interface AgentTool {
  name: string;
  type: string;
  description?: string;
  config: Record<string, any>;
  required: boolean;
  enabled: boolean;
}

export interface AgentExecutionRequest {
  input: string;
  variables?: Record<string, any>;
  context?: Record<string, any>;
  stream?: boolean;
}

export interface AgentExecutionResponse {
  execution_id: string;
  result?: string;
  status: 'running' | 'completed' | 'failed';
  steps: AgentStep[];
  usage: {
    total_tokens: number;
    execution_time_ms: number;
    tool_calls: number;
  };
  error?: string;
}

export interface AgentStep {
  step_id: string;
  type: 'reasoning' | 'tool_call' | 'knowledge_query' | 'output';
  input: string;
  output: string;
  tool_name?: string;
  timestamp: string;
  duration_ms: number;
  success: boolean;
  error?: string;
}

// QA管理相关
export interface QASession extends BaseEntity {
  assistant_id: number;
  session_id: string;
  user_id: number;
  title?: string;
  
  // 会话配置
  config: {
    model: string;
    temperature: number;
    max_tokens: number;
    context_window: number;
  };
  
  // 状态信息
  status: 'active' | 'archived' | 'deleted';
  message_count: number;
  total_tokens: number;
  last_activity: string;
  
  // 评价信息
  rating?: number;
  feedback?: string;
}

export interface QAMessage extends BaseEntity {
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata: Record<string, any>;
  
  // 消息处理信息
  processing_time_ms?: number;
  token_count: number;
  model_used?: string;
  
  // 知识库相关
  knowledge_sources?: string[];
  citations?: Citation[];
  
  // 评价信息
  rating?: number;
  feedback?: string;
}

export interface Citation {
  source_id: string;
  source_type: 'document' | 'chunk' | 'knowledge_base';
  title: string;
  excerpt: string;
  confidence: number;
  metadata?: Record<string, any>;
}

export interface QASearchRequest {
  query: string;
  session_id?: string;
  assistant_id?: number;
  filters?: {
    date_range?: { start: string; end: string };
    rating_min?: number;
    has_feedback?: boolean;
  };
}

// 助手分析相关
export interface AssistantAnalytics {
  assistant_id: number;
  period: 'day' | 'week' | 'month' | 'year';
  metrics: {
    usage_count: number;
    unique_users: number;
    total_messages: number;
    avg_session_length: number;
    satisfaction_score: number;
    response_time_avg: number;
  };
  trends: {
    usage_trend: number; // 相比上期的变化百分比
    satisfaction_trend: number;
    performance_trend: number;
  };
  top_queries: Array<{
    query: string;
    count: number;
    avg_satisfaction: number;
  }>;
  error_stats: {
    total_errors: number;
    error_types: Record<string, number>;
  };
}

// 助手权限相关
export interface AssistantPermission {
  assistant_id: number;
  user_id?: number;
  role_id?: number;
  permissions: ('read' | 'write' | 'execute' | 'admin')[];
  granted_by: number;
  granted_at: string;
  expires_at?: string;
}

export interface AssistantSharing {
  assistant_id: number;
  share_type: 'public' | 'link' | 'user' | 'role';
  share_with?: string; // 用户ID、角色ID或分享链接
  permissions: string[];
  expires_at?: string;
  created_by: number;
} 