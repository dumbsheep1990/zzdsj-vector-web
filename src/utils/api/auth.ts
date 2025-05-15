/**
 * 认证服务API
 */
import {
  LoginCredentials,
  AuthResponse,
  RefreshTokenRequest,
  TokenInfo,
  ApiKey,
  CreateApiKeyRequest
} from '../../../shared/types/auth';
import apiClient from './client';

const BASE_URL = 'auth';

/**
 * 认证服务API
 */
export const authApi = {
  /**
   * 用户登录
   */
  login(credentials: LoginCredentials) {
    return apiClient.post<AuthResponse>(`${BASE_URL}/login`, credentials);
  },

  /**
   * 用户注销
   */
  logout() {
    return apiClient.post<{ success: boolean }>(`${BASE_URL}/logout`);
  },

  /**
   * 刷新访问令牌
   */
  refreshToken(request: RefreshTokenRequest) {
    return apiClient.post<Omit<AuthResponse, 'user'>>(`${BASE_URL}/refresh-token`, request);
  },

  /**
   * 获取当前活跃令牌
   */
  getActiveTokens() {
    return apiClient.get<TokenInfo[]>(`${BASE_URL}/tokens`);
  },

  /**
   * 撤销指定令牌
   */
  revokeToken(tokenId: string) {
    return apiClient.delete(`${BASE_URL}/tokens/${tokenId}`);
  },

  /**
   * 撤销所有令牌(除当前令牌外)
   */
  revokeAllTokens() {
    return apiClient.delete(`${BASE_URL}/tokens/all`);
  },

  /**
   * 验证访问令牌
   */
  validateToken() {
    return apiClient.get<{ valid: boolean, user_id?: string }>(`${BASE_URL}/validate`);
  },

  /**
   * 获取API密钥列表
   */
  getApiKeys() {
    return apiClient.get<ApiKey[]>(`${BASE_URL}/api-keys`);
  },

  /**
   * 创建API密钥
   */
  createApiKey(request: CreateApiKeyRequest) {
    return apiClient.post<ApiKey>(`${BASE_URL}/api-keys`, request);
  },

  /**
   * 获取API密钥详情
   */
  getApiKeyById(keyId: string) {
    return apiClient.get<ApiKey>(`${BASE_URL}/api-keys/${keyId}`);
  },

  /**
   * 更新API密钥
   */
  updateApiKey(keyId: string, data: { name?: string, scopes?: string[], expires_at?: string | null }) {
    return apiClient.put<ApiKey>(`${BASE_URL}/api-keys/${keyId}`, data);
  },

  /**
   * 删除API密钥
   */
  deleteApiKey(keyId: string) {
    return apiClient.delete(`${BASE_URL}/api-keys/${keyId}`);
  },
  
  /**
   * 获取当前会话用户信息
   */
  getCurrentUser() {
    return apiClient.get<AuthResponse['user']>(`${BASE_URL}/me`);
  },
  
  /**
   * 发送密码重置邮件
   */
  requestPasswordReset(email: string) {
    return apiClient.post<{ success: boolean }>(`${BASE_URL}/forgot-password`, { email });
  },
  
  /**
   * 重置密码
   */
  resetPassword(token: string, newPassword: string) {
    return apiClient.post<{ success: boolean }>(`${BASE_URL}/reset-password`, { 
      token, 
      new_password: newPassword 
    });
  },
  
  /**
   * 修改密码
   */
  changePassword(oldPassword: string, newPassword: string) {
    return apiClient.post<{ success: boolean }>(`${BASE_URL}/change-password`, {
      old_password: oldPassword,
      new_password: newPassword
    });
  }
};

export default authApi;
