import { useState, useEffect, useRef, useCallback } from 'react';

// SSE消息类型定义
export interface SSEMessage {
  id: string;
  timestamp: string;
  type: 'progress' | 'status' | 'error' | 'success' | 'connection';
  service: string;
  source: string;
  data: {
    task_id?: string;
    progress?: number;
    stage?: string;
    message?: string;
    details?: Record<string, any>;
    error_message?: string;
    result?: Record<string, any>;
    status?: string;
  };
}

// 连接状态枚举
export enum SSEConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error'
}

// Hook配置选项
export interface UseSSEConnectionOptions {
  userId: string;
  messageServiceUrl?: string;
  autoConnect?: boolean;
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
  onMessage?: (message: SSEMessage) => void;
  onConnectionChange?: (status: SSEConnectionStatus) => void;
  onError?: (error: Event) => void;
}

// Hook返回值
export interface UseSSEConnectionReturn {
  connectionStatus: SSEConnectionStatus;
  connectionId: string;
  messages: SSEMessage[];
  lastMessageTime: Date | null;
  reconnectAttempts: number;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (messageData: any) => Promise<boolean>;
  clearMessages: () => void;
  isConnected: boolean;
}

/**
 * SSE连接管理Hook
 * 提供SSE连接的完整生命周期管理
 */
export const useSSEConnection = (options: UseSSEConnectionOptions): UseSSEConnectionReturn => {
  const {
    userId,
    messageServiceUrl = 'http://localhost:8089',
    autoConnect = true,
    maxReconnectAttempts = 5,
    reconnectDelay = 1000,
    onMessage,
    onConnectionChange,
    onError
  } = options;

  // 状态管理
  const [connectionStatus, setConnectionStatus] = useState<SSEConnectionStatus>(SSEConnectionStatus.DISCONNECTED);
  const [connectionId, setConnectionId] = useState<string>('');
  const [messages, setMessages] = useState<SSEMessage[]>([]);
  const [lastMessageTime, setLastMessageTime] = useState<Date | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  // 引用
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 处理消息
  const handleMessage = useCallback((message: SSEMessage) => {
    setMessages(prev => [message, ...prev.slice(0, 99)]); // 保持最新100条消息
    setLastMessageTime(new Date());
    onMessage?.(message);
  }, [onMessage]);

  // 更新连接状态
  const updateConnectionStatus = useCallback((status: SSEConnectionStatus) => {
    setConnectionStatus(status);
    onConnectionChange?.(status);
  }, [onConnectionChange]);

  // 建立连接
  const connect = useCallback(() => {
    // 如果已经有连接，先关闭
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    updateConnectionStatus(SSEConnectionStatus.CONNECTING);

    try {
      const eventSource = new EventSource(`${messageServiceUrl}/sse/user/${userId}`);
      eventSourceRef.current = eventSource;

      eventSource.onopen = (event) => {
        console.log('SSE连接已建立', event);
        updateConnectionStatus(SSEConnectionStatus.CONNECTED);
        setReconnectAttempts(0);
        
        // 生成连接ID（浏览器EventSource无法获取响应头）
        setConnectionId(`conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
      };

      eventSource.onmessage = (event) => {
        try {
          const message: SSEMessage = JSON.parse(event.data);
          handleMessage(message);
        } catch (error) {
          console.error('解析SSE消息失败:', error, event.data);
        }
      };

      eventSource.onerror = (event) => {
        console.error('SSE连接错误:', event);
        updateConnectionStatus(SSEConnectionStatus.ERROR);
        onError?.(event);
        
        // 重连逻辑
        if (reconnectAttempts < maxReconnectAttempts) {
          updateConnectionStatus(SSEConnectionStatus.RECONNECTING);
          
          const delay = reconnectDelay * Math.pow(2, reconnectAttempts); // 指数退避
          
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connect();
          }, delay);
          
          console.log(`将在 ${delay}ms 后重连 (第 ${reconnectAttempts + 1}/${maxReconnectAttempts} 次)`);
        } else {
          console.error('达到最大重连次数，停止重连');
          updateConnectionStatus(SSEConnectionStatus.ERROR);
        }
      };

    } catch (error) {
      console.error('创建SSE连接失败:', error);
      updateConnectionStatus(SSEConnectionStatus.ERROR);
      onError?.(error as Event);
    }
  }, [
    userId, 
    messageServiceUrl, 
    reconnectAttempts, 
    maxReconnectAttempts, 
    reconnectDelay,
    handleMessage,
    updateConnectionStatus,
    onError
  ]);

  // 断开连接
  const disconnect = useCallback(() => {
    // 关闭EventSource连接
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    // 清除重连定时器
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // 重置状态
    setReconnectAttempts(0);
    setConnectionId('');
    updateConnectionStatus(SSEConnectionStatus.DISCONNECTED);
    
    console.log('SSE连接已断开');
  }, [updateConnectionStatus]);

  // 发送消息（通过HTTP API）
  const sendMessage = useCallback(async (messageData: any): Promise<boolean> => {
    try {
      const response = await fetch(`${messageServiceUrl}/sse/api/v1/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...messageData,
          target: {
            user_id: userId,
            ...messageData.target
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('消息发送成功:', result);
        return true;
      } else {
        console.error('消息发送失败:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('发送消息时出错:', error);
      return false;
    }
  }, [messageServiceUrl, userId]);

  // 清除消息历史
  const clearMessages = useCallback(() => {
    setMessages([]);
    setLastMessageTime(null);
  }, []);

  // 自动连接
  useEffect(() => {
    if (autoConnect && userId) {
      connect();
    }

    // 清理函数
    return () => {
      disconnect();
    };
  }, [userId, autoConnect]); // 注意：不包含connect和disconnect，避免无限循环

  // 页面可见性变化时重连
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && 
          connectionStatus === SSEConnectionStatus.ERROR &&
          autoConnect) {
        console.log('页面变为可见，尝试重连SSE');
        connect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [connectionStatus, autoConnect, connect]);

  // 网络状态变化时重连
  useEffect(() => {
    const handleOnline = () => {
      if (connectionStatus !== SSEConnectionStatus.CONNECTED && autoConnect) {
        console.log('网络恢复，尝试重连SSE');
        connect();
      }
    };

    const handleOffline = () => {
      console.log('网络断开，断开SSE连接');
      disconnect();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [connectionStatus, autoConnect, connect, disconnect]);

  return {
    connectionStatus,
    connectionId,
    messages,
    lastMessageTime,
    reconnectAttempts,
    connect,
    disconnect,
    sendMessage,
    clearMessages,
    isConnected: connectionStatus === SSEConnectionStatus.CONNECTED
  };
};