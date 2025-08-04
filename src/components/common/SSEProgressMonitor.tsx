import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Loader2, 
  Wifi, 
  WifiOff, 
  Activity,
  FileText,
  Database,
  Zap,
  Clock,
  X
} from 'lucide-react';

// SSE消息类型定义
interface SSEMessage {
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
enum ConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error'
}

// 任务进度状态
interface TaskProgress {
  taskId: string;
  progress: number;
  stage: string;
  message: string;
  status: 'processing' | 'completed' | 'error';
  details?: Record<string, any>;
  startTime: Date;
  lastUpdate: Date;
}

// 组件属性
interface SSEProgressMonitorProps {
  userId: string;
  messageServiceUrl?: string;
  onMessageReceived?: (message: SSEMessage) => void;
  onConnectionChange?: (status: ConnectionStatus) => void;
  className?: string;
  showMiniView?: boolean;
  onClose?: () => void;
}

/**
 * SSE进度监控组件
 * 提供实时SSE连接状态显示和进度追踪
 */
const SSEProgressMonitor: React.FC<SSEProgressMonitorProps> = ({
  userId,
  messageServiceUrl = 'http://localhost:8089',
  onMessageReceived,
  onConnectionChange,
  className = '',
  showMiniView = false,
  onClose
}) => {
  // 状态管理
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [connectionId, setConnectionId] = useState<string>('');
  const [tasks, setTasks] = useState<Map<string, TaskProgress>>(new Map());
  const [messages, setMessages] = useState<SSEMessage[]>([]);
  const [lastMessageTime, setLastMessageTime] = useState<Date | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  // 引用
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 1000; // 1秒

  // 建立SSE连接
  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setConnectionStatus(ConnectionStatus.CONNECTING);
    
    const eventSource = new EventSource(`${messageServiceUrl}/sse/user/${userId}`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = (event) => {
      console.log('SSE连接已建立', event);
      setConnectionStatus(ConnectionStatus.CONNECTED);
      setReconnectAttempts(0);
      
      // 获取连接ID
      const response = event.target as EventSource;
      // 注意：浏览器EventSource API无法直接获取响应头，这里使用时间戳作为标识
      setConnectionId(`conn_${Date.now()}`);
      
      onConnectionChange?.(ConnectionStatus.CONNECTED);
    };

    eventSource.onmessage = (event) => {
      try {
        const message: SSEMessage = JSON.parse(event.data);
        handleMessage(message);
      } catch (error) {
        console.error('解析SSE消息失败:', error);
      }
    };

    eventSource.onerror = (event) => {
      console.error('SSE连接错误:', event);
      setConnectionStatus(ConnectionStatus.ERROR);
      onConnectionChange?.(ConnectionStatus.ERROR);
      
      // 重连逻辑
      if (reconnectAttempts < maxReconnectAttempts) {
        setConnectionStatus(ConnectionStatus.RECONNECTING);
        reconnectTimeoutRef.current = setTimeout(() => {
          setReconnectAttempts(prev => prev + 1);
          connect();
        }, reconnectDelay * Math.pow(2, reconnectAttempts)); // 指数退避
      }
    };
  }, [userId, messageServiceUrl, onConnectionChange, reconnectAttempts]);

  // 处理收到的消息
  const handleMessage = (message: SSEMessage) => {
    setMessages(prev => [message, ...prev.slice(0, 49)]); // 保持最新50条消息
    setLastMessageTime(new Date());
    
    onMessageReceived?.(message);

    // 更新任务进度
    if (message.type === 'progress' && message.data.task_id) {
      setTasks(prev => {
        const newTasks = new Map(prev);
        const taskId = message.data.task_id!;
        const existing = newTasks.get(taskId);
        
        newTasks.set(taskId, {
          taskId,
          progress: message.data.progress || 0,
          stage: message.data.stage || '',
          message: message.data.message || '',
          status: 'processing',
          details: message.data.details,
          startTime: existing?.startTime || new Date(),
          lastUpdate: new Date()
        });
        
        return newTasks;
      });
    }

    // 处理任务完成
    if (message.type === 'success' && message.data.task_id) {
      setTasks(prev => {
        const newTasks = new Map(prev);
        const taskId = message.data.task_id!;
        const existing = newTasks.get(taskId);
        
        if (existing) {
          newTasks.set(taskId, {
            ...existing,
            progress: 100,
            status: 'completed',
            message: message.data.message || '处理完成',
            lastUpdate: new Date()
          });
        }
        
        return newTasks;
      });
    }

    // 处理任务错误
    if (message.type === 'error' && message.data.task_id) {
      setTasks(prev => {
        const newTasks = new Map(prev);
        const taskId = message.data.task_id!;
        const existing = newTasks.get(taskId);
        
        if (existing) {
          newTasks.set(taskId, {
            ...existing,
            status: 'error',
            message: message.data.error_message || '处理失败',
            lastUpdate: new Date()
          });
        }
        
        return newTasks;
      });
    }
  };

  // 断开连接
  const disconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    setConnectionStatus(ConnectionStatus.DISCONNECTED);
    onConnectionChange?.(ConnectionStatus.DISCONNECTED);
  };

  // 组件挂载时建立连接
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect]);

  // 获取连接状态图标和颜色
  const getConnectionStatusDisplay = () => {
    switch (connectionStatus) {
      case ConnectionStatus.CONNECTED:
        return { icon: Wifi, color: 'text-green-500', bg: 'bg-green-50', text: '已连接' };
      case ConnectionStatus.CONNECTING:
      case ConnectionStatus.RECONNECTING:
        return { icon: Loader2, color: 'text-blue-500', bg: 'bg-blue-50', text: '连接中' };
      case ConnectionStatus.ERROR:
        return { icon: WifiOff, color: 'text-red-500', bg: 'bg-red-50', text: '连接错误' };
      default:
        return { icon: WifiOff, color: 'text-gray-500', bg: 'bg-gray-50', text: '未连接' };
    }
  };

  // 获取阶段图标
  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'extract': return FileText;
      case 'chunk': return Activity;
      case 'embed': return Database;
      case 'store': return Zap;
      default: return Clock;
    }
  };

  // 格式化时间
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const statusDisplay = getConnectionStatusDisplay();
  const StatusIcon = statusDisplay.icon;
  const activeTasks = Array.from(tasks.values()).filter(task => 
    task.status === 'processing' || 
    (task.status === 'completed' && (Date.now() - task.lastUpdate.getTime()) < 10000) // 10秒内完成的任务
  );

  // 迷你视图
  if (showMiniView) {
    return (
      <div className={`fixed top-4 right-4 bg-white rounded-lg shadow-lg border p-3 z-50 ${className}`}>
        <div className="flex items-center space-x-2">
          <StatusIcon className={`w-4 h-4 ${statusDisplay.color} ${connectionStatus === ConnectionStatus.CONNECTING ? 'animate-spin' : ''}`} />
          <span className="text-sm font-medium">{statusDisplay.text}</span>
          {activeTasks.length > 0 && (
            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
              {activeTasks.length} 个任务
            </span>
          )}
          {onClose && (
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // 完整视图
  return (
    <div className={`bg-white rounded-lg shadow-lg border ${className}`}>
      {/* 头部 - 连接状态 */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${statusDisplay.bg}`}>
            <StatusIcon className={`w-5 h-5 ${statusDisplay.color} ${connectionStatus === ConnectionStatus.CONNECTING ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">实时进度监控</h3>
            <p className="text-sm text-gray-500">
              {statusDisplay.text}
              {connectionId && ` • ${connectionId.slice(-8)}`}
              {lastMessageTime && ` • 最后消息: ${formatTime(lastMessageTime)}`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {reconnectAttempts > 0 && (
            <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
              重连 {reconnectAttempts}/{maxReconnectAttempts}
            </span>
          )}
          <button
            onClick={connectionStatus === ConnectionStatus.CONNECTED ? disconnect : connect}
            className={`px-3 py-1 rounded text-sm font-medium ${
              connectionStatus === ConnectionStatus.CONNECTED
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-green-100 text-green-600 hover:bg-green-200'
            }`}
          >
            {connectionStatus === ConnectionStatus.CONNECTED ? '断开' : '连接'}
          </button>
          {onClose && (
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 活跃任务列表 */}
      {activeTasks.length > 0 && (
        <div className="p-4 border-b">
          <h4 className="font-medium text-gray-900 mb-3">活跃任务</h4>
          <div className="space-y-3">
            {activeTasks.map(task => {
              const StageIcon = getStageIcon(task.stage);
              return (
                <div key={task.taskId} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <StageIcon className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-700">
                        任务 {task.taskId.slice(-8)}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.status === 'completed' ? 'bg-green-100 text-green-600' :
                        task.status === 'error' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {task.stage || task.status}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {task.progress}%
                    </span>
                  </div>
                  
                  {/* 进度条 */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        task.status === 'completed' ? 'bg-green-500' :
                        task.status === 'error' ? 'bg-red-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                  
                  <p className="text-sm text-gray-600">{task.message}</p>
                  
                  {task.details && (
                    <div className="mt-2 text-xs text-gray-500">
                      {Object.entries(task.details).map(([key, value]) => (
                        <span key={key} className="mr-3">
                          {key}: {String(value)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 消息历史 */}
      <div className="p-4">
        <h4 className="font-medium text-gray-900 mb-3">消息历史</h4>
        <div className="max-h-64 overflow-y-auto space-y-2">
          {messages.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">暂无消息</p>
          ) : (
            messages.slice(0, 10).map((message, index) => {
              const Icon = message.type === 'progress' ? Activity :
                         message.type === 'success' ? CheckCircle :
                         message.type === 'error' ? XCircle :
                         AlertCircle;
              
              const iconColor = message.type === 'success' ? 'text-green-500' :
                              message.type === 'error' ? 'text-red-500' :
                              message.type === 'progress' ? 'text-blue-500' :
                              'text-gray-500';
              
              return (
                <div key={`${message.id}-${index}`} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                  <Icon className={`w-4 h-4 mt-0.5 ${iconColor}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-gray-600">
                        {message.type.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(message.timestamp).toLocaleTimeString('zh-CN')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 mt-1">
                      {message.data.message || message.data.error_message || '无消息内容'}
                    </p>
                    {message.data.progress !== undefined && (
                      <span className="text-xs text-blue-600">
                        进度: {message.data.progress}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default SSEProgressMonitor;