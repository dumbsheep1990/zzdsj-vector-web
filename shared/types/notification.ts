// 消息通知相关类型定义
export interface Notification {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  status: 'unread' | 'read' | 'archived';
  createdAt: string;
  expiresAt?: string;
  readAt?: string;
  link?: string;
  sender?: string;
  icon?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category?: 'system' | 'user' | 'task' | 'security' | 'update';
  metadata?: Record<string, any>;
}

export interface NotificationPreference {
  userId: string;
  email: boolean;
  browser: boolean;
  desktop: boolean;
  mobile: boolean;
  mute: boolean;
  muteUntil?: string;
  categories: {
    system: boolean;
    user: boolean;
    task: boolean;
    security: boolean;
    update: boolean;
  };
}

export interface NotificationStats {
  total: number;
  unread: number;
  today: number;
  categories: {
    [key: string]: {
      total: number;
      unread: number;
    };
  };
}
