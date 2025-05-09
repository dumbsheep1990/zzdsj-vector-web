import { useState, useCallback, useEffect } from 'react';
import { useAPI } from '../common/useAPI';
import { message } from 'antd';

// MCP服务器配置类型
export interface McpServerConfig {
  id: string;
  name: string;
  url: string;
  apiKey?: string;
  isDefault: boolean;
  status: 'online' | 'offline' | 'unknown';
  lastConnected?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// 连接状态类型
export interface ConnectionStatus {
  connected: boolean;
  serverInfo?: {
    version: string;
    capabilities: string[];
    limits?: {
      maxRequestSize: number;
      maxResponseSize: number;
      maxConcurrentRequests: number;
    };
  };
  latency: number;
  lastChecked: string;
  error?: string;
}

// 获取服务器配置的API
const fetchServerConfigsAPI = async (): Promise<McpServerConfig[]> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 返回模拟数据
  return [
    {
      id: 'server1',
      name: '主要MCP服务器',
      url: 'https://mcp-main.example.com',
      isDefault: true,
      status: 'online',
      lastConnected: new Date().toISOString(),
      description: '主要的MCP服务器，用于生产环境',
      createdAt: '2023-05-15T08:00:00Z',
      updatedAt: '2023-10-20T09:30:00Z'
    },
    {
      id: 'server2',
      name: '开发MCP服务器',
      url: 'https://mcp-dev.example.com',
      isDefault: false,
      status: 'online',
      lastConnected: new Date().toISOString(),
      description: '用于开发和测试的MCP服务器',
      createdAt: '2023-06-10T10:15:00Z',
      updatedAt: '2023-09-18T14:20:00Z'
    },
    {
      id: 'server3',
      name: '备用MCP服务器',
      url: 'https://mcp-backup.example.com',
      isDefault: false,
      status: 'offline',
      lastConnected: '2023-10-10T11:45:00Z',
      description: '备用MCP服务器，用于灾难恢复',
      createdAt: '2023-07-05T16:30:00Z',
      updatedAt: '2023-10-12T08:45:00Z'
    }
  ];
};

// 添加服务器配置的API
const addServerConfigAPI = async (config: Omit<McpServerConfig, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<McpServerConfig> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const now = new Date().toISOString();
  
  // 返回新增的服务器配置
  return {
    id: Math.random().toString(36).substring(2, 9),
    ...config,
    status: 'unknown',
    createdAt: now,
    updatedAt: now
  };
};

// 更新服务器配置的API
const updateServerConfigAPI = async (
  id: string, 
  updates: Partial<Omit<McpServerConfig, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<McpServerConfig> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 返回更新后的服务器配置
  return {
    id,
    name: updates.name || '未命名服务器',
    url: updates.url || 'https://example.com',
    apiKey: updates.apiKey,
    isDefault: updates.isDefault !== undefined ? updates.isDefault : false,
    status: updates.status || 'unknown',
    lastConnected: updates.lastConnected,
    description: updates.description,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  };
};

// 删除服务器配置的API
const deleteServerConfigAPI = async (id: string): Promise<boolean> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 假设删除成功
  return true;
};

// 检查连接状态的API
const checkConnectionAPI = async (serverId: string): Promise<ConnectionStatus> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 随机模拟连接成功或失败
  const isConnected = Math.random() > 0.2;
  
  if (isConnected) {
    return {
      connected: true,
      serverInfo: {
        version: '1.5.2',
        capabilities: ['resource-management', 'deployment', 'monitoring'],
        limits: {
          maxRequestSize: 10 * 1024 * 1024, // 10MB
          maxResponseSize: 100 * 1024 * 1024, // 100MB
          maxConcurrentRequests: 20
        }
      },
      latency: Math.floor(Math.random() * 100), // 0-100ms
      lastChecked: new Date().toISOString()
    };
  } else {
    return {
      connected: false,
      latency: -1,
      lastChecked: new Date().toISOString(),
      error: '无法连接到服务器: 连接超时'
    };
  }
};

// 设置默认服务器的API
const setDefaultServerAPI = async (id: string): Promise<boolean> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 假设设置成功
  return true;
};

/**
 * MCP连接管理Hook
 * 
 * 管理MCP服务器的连接配置和状态
 * 
 * @returns {object} 包含MCP连接管理功能的对象
 */
export const useMcpConnection = () => {
  // 服务器配置列表
  const {
    data: serverConfigs,
    loading: isLoadingConfigs,
    error: configsError,
    execute: fetchConfigs
  } = useAPI<void, McpServerConfig[]>(fetchServerConfigsAPI);
  
  // 添加服务器配置
  const {
    loading: isAddingServer,
    error: addServerError,
    execute: executeAddServer
  } = useAPI(addServerConfigAPI);
  
  // 更新服务器配置
  const {
    loading: isUpdatingServer,
    error: updateServerError,
    execute: executeUpdateServer
  } = useAPI(updateServerConfigAPI);
  
  // 删除服务器配置
  const {
    loading: isDeletingServer,
    error: deleteServerError,
    execute: executeDeleteServer
  } = useAPI(deleteServerConfigAPI);
  
  // 检查连接状态
  const {
    data: connectionStatus,
    loading: isCheckingConnection,
    error: connectionError,
    execute: executeCheckConnection
  } = useAPI<string, ConnectionStatus>(checkConnectionAPI);
  
  // 设置默认服务器
  const {
    loading: isSettingDefault,
    error: setDefaultError,
    execute: executeSetDefault
  } = useAPI(setDefaultServerAPI);
  
  // 当前选择的服务器ID
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  
  // 连接状态缓存，用于存储不同服务器的连接状态
  const [connectionStatusCache, setConnectionStatusCache] = useState<Record<string, ConnectionStatus>>({});
  
  // 初始加载服务器配置
  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);
  
  // 当配置加载完成后，如果没有选择的服务器，自动选择默认服务器
  useEffect(() => {
    if (serverConfigs && !selectedServerId) {
      const defaultServer = serverConfigs.find(server => server.isDefault);
      if (defaultServer) {
        setSelectedServerId(defaultServer.id);
      } else if (serverConfigs.length > 0) {
        setSelectedServerId(serverConfigs[0].id);
      }
    }
  }, [serverConfigs, selectedServerId]);
  
  // 获取当前选择的服务器配置
  const selectedServer = serverConfigs?.find(server => server.id === selectedServerId) || null;
  
  // 获取默认服务器配置
  const defaultServer = serverConfigs?.find(server => server.isDefault) || null;
  
  // 添加服务器配置
  const addServerConfig = useCallback(async (config: Omit<McpServerConfig, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newConfig = await executeAddServer(config);
      message.success('添加服务器配置成功');
      // 刷新服务器配置列表
      fetchConfigs();
      return newConfig;
    } catch (error) {
      console.error('添加服务器配置失败:', error);
      message.error('添加服务器配置失败');
      return null;
    }
  }, [executeAddServer, fetchConfigs]);
  
  // 更新服务器配置
  const updateServerConfig = useCallback(async (id: string, updates: Partial<Omit<McpServerConfig, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const updatedConfig = await executeUpdateServer(id, updates);
      message.success('更新服务器配置成功');
      // 刷新服务器配置列表
      fetchConfigs();
      return updatedConfig;
    } catch (error) {
      console.error('更新服务器配置失败:', error);
      message.error('更新服务器配置失败');
      return null;
    }
  }, [executeUpdateServer, fetchConfigs]);
  
  // 删除服务器配置
  const deleteServerConfig = useCallback(async (id: string) => {
    try {
      const success = await executeDeleteServer(id);
      if (success) {
        // 如果删除的是当前选择的服务器，清除选择
        if (id === selectedServerId) {
          setSelectedServerId(null);
        }
        
        message.success('删除服务器配置成功');
        // 刷新服务器配置列表
        fetchConfigs();
        return true;
      }
      message.error('删除服务器配置失败');
      return false;
    } catch (error) {
      console.error('删除服务器配置失败:', error);
      message.error('删除服务器配置失败');
      return false;
    }
  }, [executeDeleteServer, selectedServerId, fetchConfigs]);
  
  // 检查服务器连接状态
  const checkConnection = useCallback(async (serverId: string) => {
    try {
      const status = await executeCheckConnection(serverId);
      
      // 更新连接状态缓存
      setConnectionStatusCache(prev => ({
        ...prev,
        [serverId]: status
      }));
      
      // 根据连接状态更新服务器配置中的状态
      const newStatus = status.connected ? 'online' : 'offline';
      executeUpdateServer(serverId, { 
        status: newStatus,
        lastConnected: status.connected ? new Date().toISOString() : undefined
      });
      
      if (status.connected) {
        message.success('连接成功');
      } else {
        message.error(`连接失败: ${status.error}`);
      }
      
      return status;
    } catch (error) {
      console.error('检查连接失败:', error);
      message.error('检查连接失败');
      
      // 更新连接状态缓存为失败状态
      const failedStatus: ConnectionStatus = {
        connected: false,
        latency: -1,
        lastChecked: new Date().toISOString(),
        error: error instanceof Error ? error.message : '未知错误'
      };
      
      setConnectionStatusCache(prev => ({
        ...prev,
        [serverId]: failedStatus
      }));
      
      // 更新服务器配置中的状态
      executeUpdateServer(serverId, { 
        status: 'offline'
      });
      
      return failedStatus;
    }
  }, [executeCheckConnection, executeUpdateServer]);
  
  // 设置默认服务器
  const setDefaultServer = useCallback(async (serverId: string) => {
    try {
      const success = await executeSetDefault(serverId);
      if (success) {
        // 更新所有服务器的默认状态
        for (const config of serverConfigs || []) {
          if (config.id === serverId) {
            executeUpdateServer(config.id, { isDefault: true });
          } else if (config.isDefault) {
            executeUpdateServer(config.id, { isDefault: false });
          }
        }
        
        message.success('设置默认服务器成功');
        // 刷新服务器配置列表
        fetchConfigs();
        return true;
      }
      message.error('设置默认服务器失败');
      return false;
    } catch (error) {
      console.error('设置默认服务器失败:', error);
      message.error('设置默认服务器失败');
      return false;
    }
  }, [executeSetDefault, executeUpdateServer, serverConfigs, fetchConfigs]);
  
  // 选择服务器
  const selectServer = useCallback((serverId: string | null) => {
    setSelectedServerId(serverId);
  }, []);
  
  // 获取服务器连接状态
  const getServerConnectionStatus = useCallback((serverId: string) => {
    return connectionStatusCache[serverId] || null;
  }, [connectionStatusCache]);
  
  // 获取在线服务器列表
  const onlineServers = serverConfigs?.filter(server => server.status === 'online') || [];
  
  // 检查所有服务器的连接状态
  const checkAllConnections = useCallback(async () => {
    if (!serverConfigs) return [];
    
    const results = [];
    for (const server of serverConfigs) {
      try {
        // 并行检查，但不等待
        results.push(checkConnection(server.id));
      } catch (error) {
        console.error(`检查服务器 ${server.name} 连接失败:`, error);
      }
    }
    
    // 等待所有检查完成
    const statuses = await Promise.all(results);
    return statuses;
  }, [serverConfigs, checkConnection]);
  
  return {
    // 数据
    serverConfigs,
    selectedServer,
    selectedServerId,
    defaultServer,
    connectionStatus,
    onlineServers,
    
    // 加载状态
    isLoadingConfigs,
    isAddingServer,
    isUpdatingServer,
    isDeletingServer,
    isCheckingConnection,
    isSettingDefault,
    
    // 错误状态
    configsError,
    addServerError,
    updateServerError,
    deleteServerError,
    connectionError,
    setDefaultError,
    
    // 操作方法
    fetchConfigs,
    addServerConfig,
    updateServerConfig,
    deleteServerConfig,
    checkConnection,
    checkAllConnections,
    setDefaultServer,
    selectServer,
    getServerConnectionStatus
  };
};
