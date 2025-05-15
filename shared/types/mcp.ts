// MCP服务相关类型定义
export interface McpService {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: string;
  usageCount: number;
  version: string;
  tags: string[];
  toolsCount: number;
  isConnected?: boolean;
  authStatus?: 'unauthorized' | 'authorized' | 'expired';
  authUrl?: string;
  provider?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface McpTool {
  id: string;
  serviceId: string;
  name: string;
  description: string;
  enabled: boolean;
  parameters?: McpToolParameter[];
  usage?: {
    count: number;
    lastUsed?: string;
  };
  examples?: string[];
  category?: string;
  apiEndpoint?: string;
}

export interface McpToolParameter {
  name: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  default?: any;
  enum?: any[];
  format?: string;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
}

export interface McpServiceCategory {
  id: string;
  name: string;
  count: number;
  description?: string;
  color?: string;
}

export interface McpAuthConfig {
  serviceId: string;
  authType: 'oauth' | 'api_key' | 'basic' | 'custom';
  credentials?: Record<string, any>;
  expiresAt?: string;
  scopes?: string[];
  status: 'valid' | 'invalid' | 'expired';
}

export interface McpServiceStats {
  totalCalls: number;
  successRate: number;
  avgResponseTime: number;
  lastCalled?: string;
  errorRate: number;
  dailyUsage: {
    date: string;
    count: number;
  }[];
}
