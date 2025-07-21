/**
 * API配置文件，用于配置API请求的基础信息
 */

// 获取环境变量或使用默认值
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// 请求超时时间（毫秒）
export const REQUEST_TIMEOUT = 30000;

// 通用请求头
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// API版本
export const API_VERSION = 'v1';

// 是否启用模拟数据（开发环境）
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// 是否启用API请求日志（开发环境）
export const ENABLE_API_LOGS = import.meta.env.NODE_ENV === 'development';

// localStorage中存储的令牌键名
export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

// 公开API端点（无需验证）
export const PUBLIC_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/validate',
  '/graph',  // 知识图谱接口无需认证
  'graph'    // 兼容不同路径格式
];

// API错误消息
export const API_ERROR_MESSAGES = {
  DEFAULT: '请求失败，请稍后再试',
  NETWORK: '网络连接异常，请检查您的网络连接',
  TIMEOUT: '请求超时，请稍后再试',
  UNAUTHORIZED: '会话已过期，请重新登录',
  FORBIDDEN: '没有权限执行此操作',
  NOT_FOUND: '请求的资源不存在',
  SERVER_ERROR: '服务器内部错误，请稍后再试',
};
