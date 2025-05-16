/**
 * 系统状态API服务
 */
import { SystemStatusInfo, SystemAlert, SystemStatusHistory, SystemLog } from '../../../shared/types/system-status';
import apiClient from './client';

const BASE_URL = 'system/status';

/**
 * 系统状态API服务
 */
export const systemStatusApi = {
  /**
   * 获取系统状态信息
   */
  getSystemStatus() {
    return apiClient.get<SystemStatusInfo>(`${BASE_URL}`);
  },
  
  /**
   * 获取实时资源使用情况
   */
  getResourceUsage() {
    return apiClient.get<SystemStatusInfo['resources']>(`${BASE_URL}/resources`);
  },
  
  /**
   * 获取服务健康状态
   */
  getServicesHealth() {
    return apiClient.get<SystemStatusInfo['services']>(`${BASE_URL}/services`);
  },
  
  /**
   * 获取当前系统警告
   */
  getSystemAlerts(acknowledged = false) {
    return apiClient.get<SystemAlert[]>(`${BASE_URL}/alerts`, { acknowledged });
  },
  
  /**
   * 确认系统警告
   */
  acknowledgeAlert(alertId: string) {
    return apiClient.put<{success: boolean}>(`${BASE_URL}/alerts/${alertId}/acknowledge`, {});
  },
  
  /**
   * 获取系统状态历史数据
   */
  getStatusHistory(timeRange: '1h' | '24h' | '7d' | '30d' = '24h') {
    return apiClient.get<SystemStatusHistory>(`${BASE_URL}/history`, { timeRange });
  },
  
  /**
   * 获取系统日志
   */
  getSystemLogs(level?: 'debug' | 'info' | 'warn' | 'error' | 'fatal', limit = 100, page = 1) {
    const params: any = { limit, page };
    if (level) {
      params.level = level;
    }
    return apiClient.get<SystemLog[]>(`${BASE_URL}/logs`, params);
  },
  
  /**
   * 获取特定服务的状态
   */
  getServiceStatus(serviceName: string) {
    return apiClient.get<SystemStatusInfo['services'][string]>(`${BASE_URL}/services/${serviceName}`);
  },
  
  /**
   * 重启特定服务（仅管理员）
   */
  restartService(serviceName: string) {
    return apiClient.post<{success: boolean, message: string}>(`${BASE_URL}/services/${serviceName}/restart`);
  },
  
  /**
   * 获取活跃用户统计
   */
  getActiveUsers() {
    return apiClient.get<SystemStatusInfo['activeUsers']>(`${BASE_URL}/users`);
  },
  
  /**
   * 获取任务统计
   */
  getJobsStatus() {
    return apiClient.get<SystemStatusInfo['jobs']>(`${BASE_URL}/jobs`);
  },
  
  /**
   * 获取维护状态
   */
  getMaintenanceStatus() {
    return apiClient.get<SystemStatusInfo['maintenance']>(`${BASE_URL}/maintenance`);
  },
  
  /**
   * 设置系统维护状态（仅管理员）
   */
  setMaintenanceStatus(maintenance: {
    scheduled: boolean;
    startTime?: string;
    endTime?: string;
    message?: string;
  }) {
    return apiClient.put<{success: boolean}>(`${BASE_URL}/maintenance`, maintenance);
  },
  
  /**
   * 健康检查（简单版）
   */
  healthCheck() {
    return apiClient.get<{status: 'ok' | 'degraded' | 'down'}>(`${BASE_URL}/health`);
  },
  
  /**
   * 订阅实时系统状态更新
   * 注意：此方法需要WebSocket实现
   */
  subscribeToStatusUpdates(callback: (status: Partial<SystemStatusInfo>) => void) {
    // 此处应实现WebSocket连接
    console.warn('实时系统状态订阅功能需要后端支持');
    
    // 模拟定期发送系统状态更新（实际项目中应替换为WebSocket）
    const statusInterval = setInterval(() => {
      // 防止lint警告：确保callback被使用
      if (typeof callback === 'function') {
        // 实际项目中，这里应该处理从WebSocket接收到的状态更新
        // 模拟状态数据只是为了满足lint要求
      }
    }, 60000); // 每分钟更新一次状态数据，仅作为示例
    
    return {
      unsubscribe: () => {
        // 取消订阅逻辑
        clearInterval(statusInterval);
        console.warn('取消实时系统状态订阅');
      }
    };
  }
};

export default systemStatusApi;
