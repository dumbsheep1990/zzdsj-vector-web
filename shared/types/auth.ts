// 认证与权限相关类型定义
import { User } from './user';

// 认证相关
export interface LoginCredentials {
  username: string;
  password: string;
  remember?: boolean;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface TokenInfo {
  id: string;
  user_id: string;
  expires_at: string;
  created_at: string;
  scope?: string[];
  device_info?: string;
}

// API密钥
export interface ApiKey {
  id: string;
  name: string;
  key?: string; // 创建时返回完整密钥，查询时仅返回部分
  masked_key?: string; // 掩码处理的密钥(如 sk-****)
  user_id: string;
  scopes: string[];
  expires_at?: string;
  created_at: string;
  last_used_at?: string;
}

export interface CreateApiKeyRequest {
  name: string;
  scopes: string[];
  expires_at?: string;
}

// 角色与权限
export interface Role {
  id: string;
  name: string;
  description?: string;
  is_default: boolean;
  created_at: string;
  permissions?: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  code: string;
  description?: string;
  created_at: string;
}

export interface UserRoleAssignment {
  user_id: string;
  role_id: string;
  assigned_at: string;
  assigned_by?: string;
}

// 资源权限
export enum ResourceType {
  KNOWLEDGE_BASE = 'knowledge_base',
  ASSISTANT = 'assistant',
  DATASET = 'dataset',
  MCP_CONFIG = 'mcp_config',
  VECTOR = 'vector',
  TOOL = 'tool',
  GRAPH = 'graph'
}

export enum AccessLevel {
  READ = 'read',
  WRITE = 'write',
  ADMIN = 'admin',
  OWNER = 'owner'
}

export interface ResourcePermission {
  id: string;
  user_id: string;
  resource_type: ResourceType;
  resource_id: string;
  access_level: AccessLevel;
  created_at: string;
  updated_at: string;
}

export interface ResourceAccessDetail {
  can_read: boolean;
  can_write: boolean;
  can_delete: boolean;
  can_share: boolean;
  is_admin: boolean;
}

export interface KnowledgeBaseAccess extends ResourceAccessDetail {
  id: string;
  user_id: string;
  knowledge_base_id: string;
}

export interface AssistantAccess extends ResourceAccessDetail {
  id: string;
  user_id: string;
  assistant_id: string;
  usage_quota?: number;
  priority_level?: number;
}

// 用户资源配额
export interface UserResourceQuota {
  id: string;
  user_id: string;
  max_knowledge_bases: number;
  max_assistants: number;
  max_storage_mb: number;
  max_tokens_per_month: number;
  max_model_calls_per_day: number;
  created_at: string;
  updated_at: string;
}

export interface QuotaUsage {
  user_id: string;
  knowledge_bases: {
    current: number;
    max: number;
  };
  assistants: {
    current: number;
    max: number;
  };
  storage: {
    current_mb: number;
    max_mb: number;
  };
  tokens: {
    current_month: number;
    max_per_month: number;
  };
  model_calls: {
    today: number;
    max_per_day: number;
  };
}

// 审计日志
export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type?: ResourceType;
  resource_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
}

// 权限检查结果
export interface PermissionCheckResult {
  has_permission: boolean;
  missing_permissions?: string[];
  reason?: string;
}
