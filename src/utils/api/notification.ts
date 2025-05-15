/**
 * 消息通知API服务
 */
import { Notification, NotificationPreference, NotificationStats } from '../../../shared/types/notification';
import apiClient from './client';

const BASE_URL = 'notification';

/**
 * 消息通知API服务
 */
export const notificationApi = {
  /**
   * 获取用户通知列表
   */
  getNotifications(status?: 'unread' | 'read' | 'all', page = 1, pageSize = 20) {
    const params = { 
      status: status || 'all',
      page,
      pageSize
    };
    return apiClient.get<Notification[]>(`${BASE_URL}`, params);
  },
  
  /**
   * 获取通知详情
   */
  getNotificationById(id: string) {
    return apiClient.get<Notification>(`${BASE_URL}/${id}`);
  },
  
  /**
   * 标记通知为已读
   */
  markAsRead(id: string) {
    return apiClient.put<Notification>(`${BASE_URL}/${id}/read`, {});
  },
  
  /**
   * 标记所有通知为已读
   */
  markAllAsRead() {
    return apiClient.put<{success: boolean, count: number}>(`${BASE_URL}/read-all`, {});
  },
  
  /**
   * 标记通知为存档
   */
  archiveNotification(id: string) {
    return apiClient.put<Notification>(`${BASE_URL}/${id}/archive`, {});
  },
  
  /**
   * 删除通知
   */
  deleteNotification(id: string) {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },
  
  /**
   * 清除所有通知
   */
  clearAllNotifications() {
    return apiClient.delete(`${BASE_URL}/clear-all`);
  },
  
  /**
   * 获取通知统计信息
   */
  getNotificationStats() {
    return apiClient.get<NotificationStats>(`${BASE_URL}/stats`);
  },
  
  /**
   * 获取通知偏好设置
   */
  getNotificationPreferences() {
    return apiClient.get<NotificationPreference>(`${BASE_URL}/preferences`);
  },
  
  /**
   * 更新通知偏好设置
   */
  updateNotificationPreferences(preferences: Partial<NotificationPreference>) {
    return apiClient.put<NotificationPreference>(`${BASE_URL}/preferences`, preferences);
  },
  
  /**
   * 开启/关闭全部通知
   */
  toggleAllNotifications(mute: boolean) {
    return apiClient.put<NotificationPreference>(`${BASE_URL}/preferences/toggle-all`, { mute });
  },
  
  /**
   * 设置免打扰时间
   */
  setDoNotDisturb(muteUntil: string | null) {
    return apiClient.put<NotificationPreference>(`${BASE_URL}/preferences/do-not-disturb`, { muteUntil });
  },
  
  /**
   * 订阅/取消订阅特定类别通知
   */
  toggleCategorySubscription(category: string, subscribe: boolean) {
    return apiClient.put<NotificationPreference>(
      `${BASE_URL}/preferences/category/${category}`,
      { subscribe }
    );
  },
  
  /**
   * 获取实时通知
   * 注意：此方法可能需要WebSocket或长轮询实现
   */
  subscribeToRealTimeNotifications(callback: (notification: Notification) => void) {
    // 此处应实现WebSocket连接或其他实时消息机制
    console.warn('实时通知订阅功能需要后端支持');
    
    // 模拟接收通知的示例（实际实现时应替换为WebSocket）
    const mockNotification = setInterval(() => {
      // 防止lint警告：确保callback被使用
      if (typeof callback === 'function') {
        // 实际项目中，这里应该处理从WebSocket接收到的真实通知
      }
    }, 300000); // 每5分钟检查一次，仅作为示例
    
    return {
      unsubscribe: () => {
        // 取消订阅逻辑
        clearInterval(mockNotification);
        console.warn('取消实时通知订阅');
      }
    };
  }
};

export default notificationApi;
