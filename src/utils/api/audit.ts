/**
 * 审计日志API服务
 */
import {
  AuditLog,
  ResourceType
} from '../../../shared/types/auth';
import apiClient from './client';

const BASE_URL = 'audit';

/**
 * 审计日志API服务
 */
export const auditApi = {
  /**
   * 获取审计日志列表
   */
  getAuditLogs(params?: {
    userId?: string;
    action?: string;
    resourceType?: ResourceType;
    resourceId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
  }) {
    return apiClient.get<{
      total: number;
      logs: AuditLog[];
    }>(`${BASE_URL}/logs`, params);
  },

  /**
   * 获取审计日志详情
   */
  getAuditLogById(logId: string) {
    return apiClient.get<AuditLog>(`${BASE_URL}/logs/${logId}`);
  },

  /**
   * 获取用户活动历史
   */
  getUserActivityHistory(userId: string, limit: number = 10) {
    return apiClient.get<AuditLog[]>(`${BASE_URL}/users/${userId}/activity`, { limit });
  },

  /**
   * 获取资源活动历史
   */
  getResourceActivityHistory(resourceType: ResourceType, resourceId: string, limit: number = 10) {
    return apiClient.get<AuditLog[]>(
      `${BASE_URL}/resources/${resourceType}/${resourceId}/activity`,
      { limit }
    );
  },

  /**
   * 获取系统活动统计
   */
  getActivityStats(timeRange: 'day' | 'week' | 'month' = 'day') {
    return apiClient.get<{
      total_actions: number;
      actions_by_type: Record<string, number>;
      active_users: number;
      peak_hour: {
        hour: number;
        count: number;
      };
    }>(`${BASE_URL}/stats`, { timeRange });
  },

  /**
   * 导出审计日志
   */
  exportAuditLogs(params?: {
    userId?: string;
    action?: string;
    resourceType?: ResourceType;
    resourceId?: string;
    startDate?: string;
    endDate?: string;
    format?: 'csv' | 'json';
  }) {
    return apiClient.get<Blob>(
      `${BASE_URL}/export`,
      params,
      {
        headers: {
          'Accept': 'application/octet-stream'
        }
      }
    );
  },
  
  /**
   * 获取安全事件
   */
  getSecurityEvents(severity?: 'low' | 'medium' | 'high' | 'critical', limit: number = 10) {
    const params: any = { limit };
    if (severity) {
      params.severity = severity;
    }
    return apiClient.get<Array<AuditLog & { severity: string }>>(`${BASE_URL}/security-events`, params);
  },
  
  /**
   * 获取最近登录历史
   */
  getLoginHistory(userId?: string, limit: number = 10) {
    const params: any = { limit };
    if (userId) {
      params.userId = userId;
    }
    return apiClient.get<Array<{
      id: string;
      user_id: string;
      timestamp: string;
      ip_address: string;
      user_agent: string;
      location?: string;
      status: 'success' | 'failed';
      failure_reason?: string;
    }>>(`${BASE_URL}/login-history`, params);
  }
};

export default auditApi;
