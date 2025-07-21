// 系统设置相关类型定义
export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  category: 'general' | 'security' | 'api' | 'storage' | 'ui' | 'performance' | 'custom';
  dataType: 'string' | 'number' | 'boolean' | 'json' | 'array';
  description?: string;
  displayName: string;
  isSecret: boolean;
  isReadOnly: boolean;
  updatedAt: string;
  updatedBy?: string;
}

export interface UiConfig {
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;
  layoutType: 'default' | 'compact' | 'expanded';
  animationsEnabled: boolean;
  sidebarCollapsed: boolean;
  logoUrl?: string;
  customCss?: string;
  defaultRoute?: string;
}

export interface SecurityConfig {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
  sessionTimeout: number;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  maxLoginAttempts: number;
  twoFactorAuthEnabled: boolean;
  allowedIPs?: string[];
  // 敏感词过滤配置
  sensitiveWordEnabled: boolean;
  sensitiveWordFilterType: 'block' | 'replace' | 'warn';
  sensitiveWordReplaceChar: string;
  autoBlockEnabled: boolean;
  logSensitiveWords: boolean;
  whitelistEnabled: boolean;
  blacklistEnabled: boolean;
  customRulesEnabled: boolean;
}

export interface SensitiveWord {
  id: string;
  word: string;
  category: string;
  level: 'low' | 'medium' | 'high';
  createTime: string;
  updateTime: string;
  isActive: boolean;
}

export interface StorageConfig {
  maxUploadSize: number;
  allowedFileTypes: string[];
  storageProvider: 'local' | 's3' | 'gcs' | 'azure';
  storageCredentials?: Record<string, any>;
  storageRetentionDays?: number;
}

export interface ApiConfig {
  rateLimiting: {
    enabled: boolean;
    requestsPerMinute: number;
    burstLimit: number;
  };
  corsAllowedOrigins: string[];
  maxRequestSize: number;
  cacheEnabled: boolean;
  cacheTtl: number;
}

export interface SystemStatus {
  version: string;
  uptime: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  activeUsers: number;
  activeJobs: number;
  lastBackup?: string;
  components: {
    [key: string]: {
      status: 'healthy' | 'degraded' | 'down';
      message?: string;
    };
  };
}
