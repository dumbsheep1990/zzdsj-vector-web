// 系统状态相关类型定义
export interface SystemStatusInfo {
  version: string;
  uptime: number; // 以秒为单位
  serverTime: string;
  environment: 'development' | 'testing' | 'production';
  resources: {
    cpu: {
      usage: number; // 百分比
      cores: number;
      temperature?: number;
    };
    memory: {
      total: number; // 字节
      used: number; // 字节
      free: number; // 字节
      usage: number; // 百分比
    };
    disk: {
      total: number; // 字节
      used: number; // 字节
      free: number; // 字节
      usage: number; // 百分比
    };
    network: {
      incoming: number; // 字节/秒
      outgoing: number; // 字节/秒
    };
  };
  services: {
    [key: string]: {
      status: 'healthy' | 'degraded' | 'down';
      latency: number; // 毫秒
      lastChecked: string;
      message?: string;
    };
  };
  activeUsers: {
    total: number;
    activeNow: number;
    last24Hours: number;
  };
  jobs: {
    running: number;
    queued: number;
    completed: number;
    failed: number;
  };
  alerts: SystemAlert[];
  maintenance?: {
    scheduled: boolean;
    startTime?: string;
    endTime?: string;
    message?: string;
  };
}

export interface SystemAlert {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: string;
  acknowledged: boolean;
  resource?: string;
  details?: Record<string, any>;
}

export interface SystemStatusHistory {
  timeRange: string; // 例如 "1h", "24h", "7d", "30d"
  intervals: Array<{
    timestamp: string;
    cpu: number;
    memory: number;
    activeUsers: number;
    responseTime: number;
  }>;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  source: string;
  message: string;
  metadata?: Record<string, any>;
}
