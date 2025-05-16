/**
 * 用户资源配额API服务
 */
import {
  UserResourceQuota,
  QuotaUsage
} from '../../../shared/types/auth';
import apiClient from './client';

const BASE_URL = 'quotas';

/**
 * 用户资源配额API服务
 */
export const quotaApi = {
  /**
   * 获取用户资源配额
   */
  getUserQuota(userId?: string) {
    const params = userId ? { userId } : undefined;
    return apiClient.get<UserResourceQuota>(`${BASE_URL}`, params);
  },

  /**
   * 获取用户资源使用情况
   */
  getUserQuotaUsage(userId?: string) {
    const params = userId ? { userId } : undefined;
    return apiClient.get<QuotaUsage>(`${BASE_URL}/usage`, params);
  },

  /**
   * 更新用户资源配额(仅管理员)
   */
  updateUserQuota(userId: string, quota: Partial<Omit<UserResourceQuota, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) {
    return apiClient.put<UserResourceQuota>(`${BASE_URL}/users/${userId}`, quota);
  },

  /**
   * 批量更新用户资源配额(仅管理员)
   */
  bulkUpdateQuotas(updates: Array<{
    user_id: string;
    quota: Partial<Omit<UserResourceQuota, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
  }>) {
    return apiClient.put<{ success: boolean, updated: number }>(`${BASE_URL}/bulk`, { updates });
  },

  /**
   * 重置用户资源配额至默认值(仅管理员)
   */
  resetUserQuota(userId: string) {
    return apiClient.post<UserResourceQuota>(`${BASE_URL}/users/${userId}/reset`, {});
  },

  /**
   * 检查用户是否有足够配额进行操作
   */
  checkQuotaAvailable(quotaType: 'knowledge_base' | 'assistant' | 'storage' | 'token' | 'model_call', amount: number = 1) {
    return apiClient.get<{ available: boolean, current: number, limit: number, remaining: number }>(
      `${BASE_URL}/check`,
      { quota_type: quotaType, amount }
    );
  },

  /**
   * 获取系统配额设置
   */
  getQuotaSettings() {
    return apiClient.get<{
      default_quotas: Record<string, UserResourceQuota>;
      quota_rules: Record<string, any>;
    }>(`${BASE_URL}/settings`);
  },

  /**
   * 更新系统配额设置(仅超级管理员)
   */
  updateQuotaSettings(settings: {
    default_quotas?: Record<string, Partial<UserResourceQuota>>;
    quota_rules?: Record<string, any>;
  }) {
    return apiClient.put<{ success: boolean }>(`${BASE_URL}/settings`, settings);
  },
  
  /**
   * 获取配额使用历史
   */
  getQuotaHistory(userId: string, quotaType: string, timeRange: 'day' | 'week' | 'month' = 'month') {
    return apiClient.get<Array<{ timestamp: string, value: number }>>(
      `${BASE_URL}/users/${userId}/history`,
      { quota_type: quotaType, time_range: timeRange }
    );
  },
  
  /**
   * 获取所有用户配额摘要(仅管理员)
   */
  getAllUsersQuotaSummary(page: number = 1, pageSize: number = 20) {
    return apiClient.get<{
      total: number,
      users: Array<{
        user_id: string,
        username: string,
        quota: UserResourceQuota,
        usage_percentage: {
          knowledge_bases: number,
          assistants: number,
          storage: number,
          tokens: number,
          model_calls: number
        }
      }>
    }>(`${BASE_URL}/summary`, { page, pageSize });
  }
};

export default quotaApi;
