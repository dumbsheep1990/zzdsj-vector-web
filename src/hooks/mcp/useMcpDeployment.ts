import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAPI } from '../common/useAPI';
import { message } from 'antd';

// 部署环境类型
export type DeploymentEnvironment = 'development' | 'staging' | 'production';

// 部署状态类型
export type DeploymentStatus = 
  | 'queued'       // 等待部署
  | 'preparing'    // 准备部署环境
  | 'deploying'    // 正在部署
  | 'testing'      // 部署后测试
  | 'succeeded'    // 部署成功
  | 'failed'       // 部署失败
  | 'cancelling'   // 正在取消
  | 'cancelled'    // 已取消
  | 'rollback'     // 正在回滚
  | 'rolledback';  // 已回滚

// 部署类型
export interface Deployment {
  id: string;
  name: string;
  resourceId: string;
  resourceType: string;
  environment: DeploymentEnvironment;
  status: DeploymentStatus;
  version: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  serverId: string;
  url?: string;
  config: Record<string, any>;
  tags: string[];
  description?: string;
  isAutomatic: boolean;
  lastSuccessfulDeployment?: string; // 上一次成功部署的ID
}

// 部署详情类型
export interface DeploymentDetails extends Deployment {
  logs: Array<{
    timestamp: string;
    level: 'info' | 'warning' | 'error';
    message: string;
  }>;
  metrics?: {
    deploymentTime: number;  // 毫秒
    resourceUsage: {
      cpu: number;           // 百分比
      memory: number;        // MB
      network: number;       // MB
    };
    status: {
      uptime: number;        // 秒
      requestsServed: number;
      errorRate: number;     // 百分比
      averageResponseTime: number; // 毫秒
    };
  };
  config: {
    scaling: {
      minInstances: number;
      maxInstances: number;
      targetCpuUtilization: number; // 百分比
    };
    resources: {
      cpuLimit: string;      // 例如 "500m"
      memoryLimit: string;   // 例如 "1Gi"
    };
    network: {
      ingressEnabled: boolean;
      tlsEnabled: boolean;
      customDomain?: string;
    };
    envVariables: Record<string, string>;
    dependencies: string[];
    [key: string]: any;
  };
  history: Array<{
    id: string;
    version: string;
    timestamp: string;
    status: DeploymentStatus;
    changedBy: string;
    changeDescription: string;
  }>;
}

// 部署筛选选项
export interface DeploymentFilterOptions {
  searchQuery: string;
  environments: DeploymentEnvironment[];
  statuses: DeploymentStatus[];
  resourceTypes: string[];
  dateRange?: [string, string]; // ISO日期字符串
  tags: string[];
  createdBy: string[];
}

// 创建部署参数
export interface CreateDeploymentParams {
  serverId: string;
  name: string;
  resourceId: string;
  environment: DeploymentEnvironment;
  config: Record<string, any>;
  tags: string[];
  description?: string;
  isAutomatic?: boolean;
}

// 更新部署参数
export interface UpdateDeploymentParams {
  serverId: string;
  deploymentId: string;
  updates: Partial<{
    name: string;
    config: Record<string, any>;
    tags: string[];
    description: string;
    isAutomatic: boolean;
  }>;
}

// 获取部署列表参数
export interface FetchDeploymentsParams {
  serverId: string;
  filter?: Partial<DeploymentFilterOptions>;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 获取部署列表响应
export interface FetchDeploymentsResponse {
  deployments: Deployment[];
  total: number;
  page?: number;
  pageSize?: number;
}

// 模拟获取部署列表的API
const fetchDeploymentsAPI = async (params: FetchDeploymentsParams): Promise<FetchDeploymentsResponse> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 生成模拟部署数据
  const generateDeployments = (count: number, serverId: string): Deployment[] => {
    const deployments: Deployment[] = [];
    const environments: DeploymentEnvironment[] = ['development', 'staging', 'production'];
    const statuses: DeploymentStatus[] = [
      'queued', 'preparing', 'deploying', 'testing', 
      'succeeded', 'failed', 'cancelling', 'cancelled', 
      'rollback', 'rolledback'
    ];
    const resourceTypes = ['model', 'function', 'app', 'dataset'];
    
    for (let i = 0; i < count; i++) {
      const envIndex = Math.floor(Math.random() * environments.length);
      const statusIndex = Math.floor(Math.random() * statuses.length);
      const resourceTypeIndex = Math.floor(Math.random() * resourceTypes.length);
      
      const createdDate = new Date();
      createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));
      
      const updatedDate = new Date(createdDate);
      updatedDate.setHours(updatedDate.getHours() + Math.floor(Math.random() * 48));
      
      const completedDate = ['succeeded', 'failed', 'cancelled', 'rolledback'].includes(statuses[statusIndex])
        ? new Date(updatedDate)
        : undefined;
      
      if (completedDate) {
        completedDate.setMinutes(completedDate.getMinutes() + Math.floor(Math.random() * 120));
      }
      
      deployments.push({
        id: `dep${i + 1}`,
        name: `部署 ${i + 1}`,
        resourceId: `res${Math.floor(Math.random() * 20) + 1}`,
        resourceType: resourceTypes[resourceTypeIndex],
        environment: environments[envIndex],
        status: statuses[statusIndex],
        version: `v1.${i % 10}.${Math.floor(i / 10)}`,
        createdBy: i % 3 === 0 ? '系统' : `用户${i % 5}`,
        createdAt: createdDate.toISOString(),
        updatedAt: updatedDate.toISOString(),
        completedAt: completedDate?.toISOString(),
        serverId,
        url: ['succeeded', 'testing'].includes(statuses[statusIndex]) 
          ? `https://${environments[envIndex]}-${i}.example.com` 
          : undefined,
        config: {
          scaling: {
            minInstances: 1,
            maxInstances: 5,
            targetCpuUtilization: 80
          },
          envVariables: {
            NODE_ENV: environments[envIndex],
            LOG_LEVEL: 'info'
          }
        },
        tags: [`环境-${environments[envIndex]}`, `版本-v1.${i % 10}`],
        description: `这是一个${resourceTypes[resourceTypeIndex]}类型资源的部署`,
        isAutomatic: i % 4 === 0
      });
    }
    
    return deployments;
  };
  
  // 模拟部署列表
  const allDeployments = generateDeployments(30, params.serverId);
  
  // 应用筛选
  let filteredDeployments = [...allDeployments];
  
  if (params.filter) {
    const filter = params.filter;
    
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      filteredDeployments = filteredDeployments.filter(deployment => 
        deployment.name.toLowerCase().includes(query) || 
        (deployment.description && deployment.description.toLowerCase().includes(query))
      );
    }
    
        if (filter.environments && filter.environments.length > 0) {
      filteredDeployments = filteredDeployments.filter(deployment => 
        filter.environments!.includes(deployment.environment)
      );
    }
    
    if (filter.statuses && filter.statuses.length > 0) {
      filteredDeployments = filteredDeployments.filter(deployment => 
        filter.statuses!.includes(deployment.status)
      );
    }
    
    if (filter.resourceTypes && filter.resourceTypes.length > 0) {
      filteredDeployments = filteredDeployments.filter(deployment => 
        filter.resourceTypes!.includes(deployment.resourceType)
      );
    }
    
    if (filter.tags && filter.tags.length > 0) {
      filteredDeployments = filteredDeployments.filter(deployment => 
        filter.tags!.some(tag => deployment.tags.includes(tag))
      );
    }
    
    if (filter.createdBy && filter.createdBy.length > 0) {
      filteredDeployments = filteredDeployments.filter(deployment => 
        filter.createdBy!.includes(deployment.createdBy)
      );
    }
    
    if (filter.dateRange) {
      const [startDate, endDate] = filter.dateRange;
      
      if (startDate) {
        const start = new Date(startDate).getTime();
        filteredDeployments = filteredDeployments.filter(deployment => 
          new Date(deployment.createdAt).getTime() >= start
        );
      }
      
      if (endDate) {
        const end = new Date(endDate).getTime();
        filteredDeployments = filteredDeployments.filter(deployment => 
          new Date(deployment.createdAt).getTime() <= end
        );
      }
    }
  }
  
  // 应用排序
  if (params.sortBy) {
    const sortBy = params.sortBy as keyof Deployment;
    const sortOrder = params.sortOrder || 'asc';
    
    filteredDeployments.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortOrder === 'asc' 
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }
      
      return 0;
    });
  }
  
  // 应用分页
  const pageSize = params.pageSize || 10;
  const page = params.page || 1;
  const startIndex = (page - 1) * pageSize;
  const paginatedDeployments = filteredDeployments.slice(startIndex, startIndex + pageSize);
  
  // 返回结果
  return {
    deployments: paginatedDeployments,
    total: filteredDeployments.length,
    page,
    pageSize
  };
};

// 模拟获取部署详情的API
const fetchDeploymentDetailsAPI = async ([serverId, deploymentId]: [string, string]): Promise<DeploymentDetails> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 生成随机日志条目
  const generateLogs = (count: number) => {
    const logs = [];
    const levels: Array<'info' | 'warning' | 'error'> = ['info', 'warning', 'error'];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
      const levelIndex = Math.floor(Math.random() * levels.length);
      const timestamp = new Date(now);
      timestamp.setMinutes(timestamp.getMinutes() - (count - i));
      
      logs.push({
        timestamp: timestamp.toISOString(),
        level: levels[levelIndex],
        message: getLogMessage(levels[levelIndex], i)
      });
    }
    
    return logs;
  };
  
  const getLogMessage = (level: 'info' | 'warning' | 'error', index: number) => {
    const infoMessages = [
      '初始化部署环境',
      '下载资源文件',
      '配置环境变量',
      '启动服务',
      '运行健康检查',
      '注册服务发现',
      '配置网络路由',
      '部署完成'
    ];
    
    const warningMessages = [
      '资源使用率较高',
      '响应时间超过阈值',
      '依赖包版本过旧',
      '配置文件存在潜在问题',
      '服务运行不稳定'
    ];
    
    const errorMessages = [
      '部署脚本执行失败',
      '无法连接到依赖服务',
      '资源配置错误',
      '健康检查未通过',
      '服务启动失败'
    ];
    
    switch (level) {
      case 'info':
        return infoMessages[index % infoMessages.length];
      case 'warning':
        return warningMessages[index % warningMessages.length];
      case 'error':
        return errorMessages[index % errorMessages.length];
    }
  };
  
  // 生成随机部署历史记录
  const generateHistory = (count: number) => {
    const history = [];
    const statuses: DeploymentStatus[] = ['succeeded', 'failed', 'rolledback'];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
      const statusIndex = Math.floor(Math.random() * statuses.length);
      const timestamp = new Date(now);
      timestamp.setDate(timestamp.getDate() - i);
      
      history.push({
        id: `hist${i + 1}`,
        version: `v1.${count - i}`,
        timestamp: timestamp.toISOString(),
        status: statuses[statusIndex],
        changedBy: i % 3 === 0 ? '系统' : `用户${i % 5}`,
        changeDescription: `部署版本 v1.${count - i} ${statusIndex === 0 ? '成功' : statusIndex === 1 ? '失败' : '已回滚'}`
      });
    }
    
    return history;
  };
  
  // 返回模拟数据
  return {
    id: deploymentId,
    name: `部署 ${deploymentId}`,
    resourceId: `res${Math.floor(Math.random() * 20) + 1}`,
    resourceType: 'model',
    environment: 'production',
    status: 'succeeded',
    version: 'v1.2.5',
    createdBy: '系统',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: new Date(Date.now() - 3500000).toISOString(),
    serverId,
    url: 'https://prod-model-xyz.example.com',
    config: {
      scaling: {
        minInstances: 2,
        maxInstances: 10,
        targetCpuUtilization: 70
      },
      resources: {
        cpuLimit: '1000m',
        memoryLimit: '2Gi'
      },
      network: {
        ingressEnabled: true,
        tlsEnabled: true,
        customDomain: 'api.example.com'
      },
      envVariables: {
        NODE_ENV: 'production',
        LOG_LEVEL: 'info',
        MODEL_VERSION: 'v1.2.5'
      },
      dependencies: ['redis', 'elasticsearch', 'minio']
    },
    tags: ['环境-production', '版本-v1.2', '重要'],
    description: '生产环境的模型部署',
    isAutomatic: false,
    lastSuccessfulDeployment: 'dep5',
    logs: generateLogs(15),
    metrics: {
      deploymentTime: 125000,  // 125秒
      resourceUsage: {
        cpu: 68,           // 68%
        memory: 1240,      // 1240MB
        network: 85        // 85MB
      },
      status: {
        uptime: 7200,          // 2小时
        requestsServed: 15420,
        errorRate: 0.2,        // 0.2%
        averageResponseTime: 78 // 78ms
      }
    },
    history: generateHistory(5)
  };
};

// 模拟创建部署的API
const createDeploymentAPI = async (params: CreateDeploymentParams): Promise<Deployment> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const now = new Date().toISOString();
  
  // 返回创建的部署
  return {
    id: Math.random().toString(36).substring(2, 9),
    name: params.name,
    resourceId: params.resourceId,
    resourceType: 'model', // 假设当前只能部署模型
    environment: params.environment,
    status: 'queued',
    version: `v${new Date().toISOString().split('T')[0].replace(/-/g, '.')}`,
    createdBy: '当前用户',
    createdAt: now,
    updatedAt: now,
    serverId: params.serverId,
    config: params.config,
    tags: params.tags,
    description: params.description,
    isAutomatic: params.isAutomatic !== undefined ? params.isAutomatic : false
  };
};

// 模拟更新部署的API
const updateDeploymentAPI = async (params: UpdateDeploymentParams): Promise<Deployment> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 返回更新后的部署
  return {
    id: params.deploymentId,
    name: params.updates.name || '未命名部署',
    resourceId: 'res1', // 模拟值
    resourceType: 'model',
    environment: 'production',
    status: 'succeeded',
    version: 'v1.0.0',
    createdBy: '当前用户',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
    serverId: params.serverId,
    config: params.updates.config || {},
    tags: params.updates.tags || [],
    description: params.updates.description,
    isAutomatic: params.updates.isAutomatic !== undefined ? params.updates.isAutomatic : false
  };
};

// 模拟删除部署的API
const deleteDeploymentAPI = async ([serverId, deploymentId]: [string, string]): Promise<boolean> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // 在真实实现中，会使用这些参数发送删除请求
  if (!serverId || !deploymentId) {
    console.error('服务器ID或部署ID不能为空');
    return false;
  }
  
  console.log(`正在删除服务器 ${serverId} 上的部署 ${deploymentId}`);
  
  // 模拟请求判断逻辑
  const isSystemDeployment = deploymentId.startsWith('sys-');
  if (isSystemDeployment) {
    console.warn(`系统部署 ${deploymentId} 不能被删除`);
    return false;
  }
  
  // 假设删除成功
  return true;
};

// 模拟操作部署的API
const controlDeploymentAPI = async (
  [serverId, deploymentId, action]: [string, string, 'start' | 'stop' | 'restart' | 'pause' | 'resume' | 'rollback']
): Promise<{ success: boolean; status: DeploymentStatus; message: string }> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const getNewStatus = (): DeploymentStatus => {
    switch (action) {
      case 'start':
        return 'deploying';
      case 'stop':
        return 'cancelled';
      case 'restart':
        return 'preparing';
      case 'pause':
        return 'cancelled';
      case 'resume':
        return 'queued';
      case 'rollback':
        return 'rollback';
      default:
        return 'succeeded';
    }
  };
  
  // 随机模拟成功或失败
  const success = Math.random() > 0.1;
  
  if (success) {
    return {
      success: true,
      status: getNewStatus(),
      message: `成功${action === 'start' ? '启动' : 
                action === 'stop' ? '停止' : 
                action === 'restart' ? '重启' : 
                action === 'pause' ? '暂停' : 
                action === 'resume' ? '恢复' : '回滚'}部署`
    };
  } else {
    return {
      success: false,
      status: 'failed',
      message: `无法${action === 'start' ? '启动' : 
                action === 'stop' ? '停止' : 
                action === 'restart' ? '重启' : 
                action === 'pause' ? '暂停' : 
                action === 'resume' ? '恢复' : '回滚'}部署：操作失败`
    };
  }
};

/**
 * MCP部署管理Hook
 * 
 * 管理MCP服务器上的部署，包括获取部署列表、创建、更新和删除部署
 * 
 * @returns {object} 包含MCP部署管理功能的对象
 */
export const useMcpDeployment = () => {
  // 部署列表
  const {
    data: deploymentsResponse,
    loading: isLoadingDeployments,
    error: deploymentsError,
    execute: executeDeploymentsFetch
  } = useAPI<FetchDeploymentsParams, FetchDeploymentsResponse>(fetchDeploymentsAPI);
  
  // 部署详情
  const {
    data: deploymentDetails,
    loading: isLoadingDetails,
    error: detailsError,
    execute: executeDetailsFetch
  } = useAPI<[string, string], DeploymentDetails>(
    (params) => fetchDeploymentDetailsAPI(params)
  );
  
  // 创建部署
  const {
    loading: isCreatingDeployment,
    error: createError,
    execute: executeDeploymentCreate
  } = useAPI(createDeploymentAPI);
  
  // 更新部署
  const {
    loading: isUpdatingDeployment,
    error: updateError,
    execute: executeDeploymentUpdate
  } = useAPI(updateDeploymentAPI);
  
  // 删除部署
  const {
    loading: isDeletingDeployment,
    error: deleteError,
    execute: executeDeploymentDelete
  } = useAPI<[string, string], boolean>(
    (params) => deleteDeploymentAPI(params)
  );
  
  // 操作部署
  const {
    loading: isControllingDeployment,
    error: controlError,
    execute: executeDeploymentControl
  } = useAPI<[string, string, 'start' | 'stop' | 'restart' | 'pause' | 'resume' | 'rollback'], { success: boolean; status: DeploymentStatus; message: string }>(
    (params) => controlDeploymentAPI(params)
  );
  
  // 当前选择的部署ID
  const [selectedDeploymentId, setSelectedDeploymentId] = useState<string | null>(null);
  
  // 部署筛选选项
  const [filterOptions, setFilterOptions] = useState<Partial<DeploymentFilterOptions>>({});
  
  // 分页信息
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  
  // 排序信息
  const [sortInfo, setSortInfo] = useState<{
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }>({});
  
  // 从响应中获取部署列表
  const deployments = useMemo(() => 
    deploymentsResponse?.deployments || [], 
    [deploymentsResponse]
  );
  
  // 从响应中获取总数
  useEffect(() => {
    if (deploymentsResponse) {
      setPagination(prev => ({
        ...prev,
        total: deploymentsResponse.total
      }));
    }
  }, [deploymentsResponse]);
  
  // 获取选中的部署
  const selectedDeployment = useMemo(() => 
    deployments.find(deployment => deployment.id === selectedDeploymentId) || null,
    [deployments, selectedDeploymentId]
  );
  
  // 获取部署列表
  const fetchDeployments = useCallback((serverId: string, options: {
    filter?: Partial<DeploymentFilterOptions>;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}) => {
    const { filter, page, pageSize, sortBy, sortOrder } = options;
    
    // 更新筛选、分页和排序状态
    if (filter) {
      setFilterOptions(filter);
    }
    
    if (page !== undefined || pageSize !== undefined) {
      setPagination(prev => ({
        current: page !== undefined ? page : prev.current,
        pageSize: pageSize !== undefined ? pageSize : prev.pageSize,
        total: prev.total
      }));
    }
    
    if (sortBy !== undefined || sortOrder !== undefined) {
      setSortInfo({
        sortBy: sortBy !== undefined ? sortBy : sortInfo.sortBy,
        sortOrder: sortOrder !== undefined ? sortOrder : sortInfo.sortOrder
      });
    }
    
    // 构建请求参数
    const params: FetchDeploymentsParams = {
      serverId,
      filter: filter || filterOptions,
      page: page !== undefined ? page : pagination.current,
      pageSize: pageSize !== undefined ? pageSize : pagination.pageSize,
      sortBy: sortBy !== undefined ? sortBy : sortInfo.sortBy,
      sortOrder: sortOrder !== undefined ? sortOrder : sortInfo.sortOrder
    };
    
    return executeDeploymentsFetch(params);
  }, [executeDeploymentsFetch, filterOptions, pagination, sortInfo]);
  
  // 获取部署详情
  const fetchDeploymentDetails = useCallback((serverId: string, deploymentId: string) => {
    return executeDetailsFetch([serverId, deploymentId]);
  }, [executeDetailsFetch]);
  
  // 创建部署
  const createDeployment = useCallback(async (params: CreateDeploymentParams) => {
    try {
      const newDeployment = await executeDeploymentCreate(params);
      message.success('创建部署成功');
      return newDeployment;
    } catch (error) {
      console.error('创建部署失败:', error);
      message.error('创建部署失败');
      return null;
    }
  }, [executeDeploymentCreate]);
  
  // 更新部署
  const updateDeployment = useCallback(async (params: UpdateDeploymentParams) => {
    try {
      const updatedDeployment = await executeDeploymentUpdate(params);
      message.success('更新部署成功');
      return updatedDeployment;
    } catch (error) {
      console.error('更新部署失败:', error);
      message.error('更新部署失败');
      return null;
    }
  }, [executeDeploymentUpdate]);
  
  // 删除部署
  const deleteDeployment = useCallback(async (serverId: string, deploymentId: string) => {
    try {
      const success = await executeDeploymentDelete([serverId, deploymentId]);
      if (success) {
        // 如果删除的是当前选中的部署，清除选择
        if (deploymentId === selectedDeploymentId) {
          setSelectedDeploymentId(null);
        }
        
        message.success('删除部署成功');
        return true;
      }
      message.error('删除部署失败');
      return false;
    } catch (error) {
      console.error('删除部署失败:', error);
      message.error('删除部署失败');
      return false;
    }
  }, [executeDeploymentDelete, selectedDeploymentId]);
  
  // 操作部署（启动、停止、重启等）
  const controlDeployment = useCallback(async (serverId: string, deploymentId: string, action: 'start' | 'stop' | 'restart' | 'pause' | 'resume' | 'rollback') => {
    try {
      const result = await executeDeploymentControl([serverId, deploymentId, action]);
      if (result.success) {
        message.success(result.message);
      } else {
        message.error(result.message);
      }
      return result;
    } catch (error) {
      console.error('操作部署失败:', error);
      message.error(`操作部署失败: ${error instanceof Error ? error.message : '未知错误'}`);
      return {
        success: false,
        status: 'failed' as DeploymentStatus,
        message: '操作失败'
      };
    }
  }, [executeDeploymentControl]);
  
  // 选择部署
  const selectDeployment = useCallback((deploymentId: string | null) => {
    setSelectedDeploymentId(deploymentId);
  }, []);
  
  // 更新筛选选项
  const updateFilterOptions = useCallback((newOptions: Partial<DeploymentFilterOptions>) => {
    setFilterOptions(prev => ({
      ...prev,
      ...newOptions
    }));
  }, []);
  
  // 清除筛选选项
  const clearFilterOptions = useCallback(() => {
    setFilterOptions({});
  }, []);
  
  // 更新分页
  const updatePagination = useCallback((current: number, pageSize?: number) => {
    setPagination(prev => ({
      ...prev,
      current,
      pageSize: pageSize !== undefined ? pageSize : prev.pageSize
    }));
  }, []);
  
  // 更新排序
  const updateSorting = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    setSortInfo({ sortBy, sortOrder });
  }, []);
  
  // 清除排序
  const clearSorting = useCallback(() => {
    setSortInfo({});
  }, []);
  
  // 根据环境获取部署
  const getDeploymentsByEnvironment = useCallback((environment: DeploymentEnvironment) => {
    return deployments.filter(deployment => deployment.environment === environment);
  }, [deployments]);
  
  // 根据状态获取部署
  const getDeploymentsByStatus = useCallback((status: DeploymentStatus) => {
    return deployments.filter(deployment => deployment.status === status);
  }, [deployments]);
  
  // 获取所有部署环境
  const getAllEnvironments = useMemo(() => {
    const envSet = new Set<DeploymentEnvironment>();
    deployments.forEach(deployment => {
      envSet.add(deployment.environment);
    });
    return Array.from(envSet);
  }, [deployments]);
  
  // 获取所有标签
  const getAllTags = useMemo(() => {
    const tagSet = new Set<string>();
    deployments.forEach(deployment => {
      deployment.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [deployments]);
  
  // 获取环境部署统计
  const environmentStats = useMemo(() => {
    const stats: Record<DeploymentEnvironment, number> = {
      development: 0,
      staging: 0,
      production: 0
    };
    
    deployments.forEach(deployment => {
      stats[deployment.environment] = (stats[deployment.environment] || 0) + 1;
    });
    
    return stats;
  }, [deployments]);
  
  // 获取状态统计
  const statusStats = useMemo(() => {
    const stats: Partial<Record<DeploymentStatus, number>> = {};
    
    deployments.forEach(deployment => {
      stats[deployment.status] = (stats[deployment.status] || 0) + 1;
    });
    
    return stats;
  }, [deployments]);
  
  return {
    // 数据
    deployments,
    deploymentDetails,
    selectedDeployment,
    selectedDeploymentId,
    filterOptions,
    pagination,
    sortInfo,
    environmentStats,
    statusStats,
    allEnvironments: getAllEnvironments,
    allTags: getAllTags,
    
    // 加载状态
    isLoadingDeployments,
    isLoadingDetails,
    isCreatingDeployment,
    isUpdatingDeployment,
    isDeletingDeployment,
    isControllingDeployment,
    
    // 错误状态
    deploymentsError,
    detailsError,
    createError,
    updateError,
    deleteError,
    controlError,
    
    // 操作方法
    fetchDeployments,
    fetchDeploymentDetails,
    createDeployment,
    updateDeployment,
    deleteDeployment,
    controlDeployment,
    selectDeployment,
    updateFilterOptions,
    clearFilterOptions,
    updatePagination,
    updateSorting,
    clearSorting,
    getDeploymentsByEnvironment,
    getDeploymentsByStatus
  };
};
