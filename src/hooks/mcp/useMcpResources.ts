import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAPI } from '../common/useAPI';
import { message } from 'antd';

// MCP资源类型
export interface McpResource {
  id: string;
  name: string;
  type: 'model' | 'embedding' | 'dataset' | 'function' | 'template' | 'other';
  owner: string;
  createdAt: string;
  updatedAt: string;
  size?: number;
  description?: string;
  tags: string[];
  metadata: Record<string, any>;
  visibility: 'private' | 'shared' | 'public';
  serverId: string;
  uri: string;
  status: 'active' | 'inactive' | 'error';
}

// 资源过滤选项
export interface ResourceFilterOptions {
  searchQuery: string;
  types: string[];
  owners: string[];
  tags: string[];
  dateRange?: [string, string]; // ISO日期字符串
  visibility?: 'private' | 'shared' | 'public';
  status?: 'active' | 'inactive' | 'error';
}

// 资源详情
export interface ResourceDetails extends McpResource {
  contentType?: string;
  permissions: {
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canShare: boolean;
  };
  versions?: Array<{
    id: string;
    version: string;
    createdAt: string;
    createdBy: string;
    changes: string;
  }>;
  usageStats?: {
    lastUsed: string;
    totalUses: number;
    averageLatency: number;
    errorRate: number;
  };
  relatedResources?: string[]; // 相关资源ID列表
}

// 获取资源列表参数
export interface FetchResourcesParams {
  serverId: string;
  filter?: Partial<ResourceFilterOptions>;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  cursor?: string; // 用于分页
}

// 获取资源列表响应
export interface FetchResourcesResponse {
  resources: McpResource[];
  total: number;
  nextCursor?: string;
  page?: number;
  pageSize?: number;
}

// 创建资源参数
export interface CreateResourceParams {
  serverId: string;
  name: string;
  type: 'model' | 'embedding' | 'dataset' | 'function' | 'template' | 'other';
  description?: string;
  tags: string[];
  metadata: Record<string, any>;
  visibility: 'private' | 'shared' | 'public';
  content?: any; // 资源内容，可选
  contentType?: string; // 内容类型，可选
}

// 更新资源参数
export interface UpdateResourceParams {
  serverId: string;
  resourceId: string;
  updates: Partial<{
    name: string;
    description: string;
    tags: string[];
    metadata: Record<string, any>;
    visibility: 'private' | 'shared' | 'public';
    status: 'active' | 'inactive';
  }>;
}

// 模拟获取资源列表的API
const fetchResourcesAPI = async (params: FetchResourcesParams): Promise<FetchResourcesResponse> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 生成模拟资源数据
  const generateResources = (count: number, serverId: string): McpResource[] => {
    const resources: McpResource[] = [];
    const types: Array<'model' | 'embedding' | 'dataset' | 'function' | 'template' | 'other'> = 
      ['model', 'embedding', 'dataset', 'function', 'template', 'other'];
    const visibilities: Array<'private' | 'shared' | 'public'> = ['private', 'shared', 'public'];
    const statuses: Array<'active' | 'inactive' | 'error'> = ['active', 'inactive', 'error'];
    const owners = ['系统', '用户1', '用户2', '组织A'];
    
    for (let i = 0; i < count; i++) {
      const typeIndex = Math.floor(Math.random() * types.length);
      const visibilityIndex = Math.floor(Math.random() * visibilities.length);
      const statusIndex = Math.floor(Math.random() * statuses.length);
      const ownerIndex = Math.floor(Math.random() * owners.length);
      
      const createdDate = new Date();
      createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 100));
      
      const updatedDate = new Date(createdDate);
      updatedDate.setDate(updatedDate.getDate() + Math.floor(Math.random() * 10));
      
      resources.push({
        id: `res${i + 1}`,
        name: `资源 ${i + 1}`,
        type: types[typeIndex],
        owner: owners[ownerIndex],
        createdAt: createdDate.toISOString(),
        updatedAt: updatedDate.toISOString(),
        size: Math.floor(Math.random() * 1000000),
        description: `这是一个${types[typeIndex]}类型的资源`,
        tags: [`标签${i % 5}`, `类别${Math.floor(i / 3)}`],
        metadata: {
          version: `1.${i % 10}`,
          framework: i % 2 === 0 ? 'TensorFlow' : 'PyTorch',
          customField: `值${i}`
        },
        visibility: visibilities[visibilityIndex],
        serverId,
        uri: `mcp://${serverId}/resources/res${i + 1}`,
        status: statuses[statusIndex]
      });
    }
    
    return resources;
  };
  
  // 模拟资源列表
  const allResources = generateResources(50, params.serverId);
  
  // 应用筛选
  let filteredResources = [...allResources];
  
  if (params.filter) {
    const filter = params.filter;
    
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      filteredResources = filteredResources.filter(resource => 
        resource.name.toLowerCase().includes(query) || 
        (resource.description && resource.description.toLowerCase().includes(query))
      );
    }
    
    if (filter.types && filter.types.length > 0) {
      const resourceTypes = filter.types;
      filteredResources = filteredResources.filter(resource => 
        resourceTypes.includes(resource.type)
      );
    }
    
    if (filter.owners && filter.owners.length > 0) {
      const ownersList = filter.owners; // 创建局部变量确保类型安全
      filteredResources = filteredResources.filter(resource => 
        ownersList.includes(resource.owner)
      );
    }
    
    if (filter.tags && filter.tags.length > 0) {
      const tagsList = filter.tags; // 创建局部变量确保类型安全
      filteredResources = filteredResources.filter(resource => 
        tagsList.some(tag => resource.tags.includes(tag))
      );
    }
    
    if (filter.dateRange) {
      const [startDate, endDate] = filter.dateRange;
      
      if (startDate) {
        const start = new Date(startDate).getTime();
        filteredResources = filteredResources.filter(resource => 
          new Date(resource.createdAt).getTime() >= start
        );
      }
      
      if (endDate) {
        const end = new Date(endDate).getTime();
        filteredResources = filteredResources.filter(resource => 
          new Date(resource.createdAt).getTime() <= end
        );
      }
    }
    
    if (filter.visibility) {
      filteredResources = filteredResources.filter(resource => 
        resource.visibility === filter.visibility
      );
    }
    
    if (filter.status) {
      filteredResources = filteredResources.filter(resource => 
        resource.status === filter.status
      );
    }
  }
  
  // 应用排序
  if (params.sortBy) {
    const sortBy = params.sortBy as keyof McpResource;
    const sortOrder = params.sortOrder || 'asc';
    
    filteredResources.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }
      
      return 0;
    });
  }
  
  // 应用分页
  const pageSize = params.pageSize || 10;
  const page = params.page || 1;
  const startIndex = (page - 1) * pageSize;
  const paginatedResources = filteredResources.slice(startIndex, startIndex + pageSize);
  
  // 返回结果
  return {
    resources: paginatedResources,
    total: filteredResources.length,
    page,
    pageSize,
    nextCursor: startIndex + pageSize < filteredResources.length ? `page_${page + 1}` : undefined
  };
};

// 模拟获取资源详情的API
const fetchResourceDetailsAPI = async ([serverId, resourceId]: [string, string]): Promise<ResourceDetails> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 检查参数是否存在
  if (!serverId || !resourceId) {
    console.error('服务器ID和资源ID不能为空');
    throw new Error('获取资源详情需要有效的服务器ID和资源ID');
  }
  
  console.log(`正在从服务器 ${serverId} 获取资源 ${resourceId} 的详细信息`);
  
  // 基于资源ID模拟不同类型的资源详情
  let resourceType = 'other';
  if (resourceId.startsWith('model-')) {
    resourceType = 'model';
  } else if (resourceId.startsWith('fn-')) {
    resourceType = 'function';
  }
  
  // 返回资源详情
  return {
    id: resourceId,
    name: `资源 ${resourceId}`,
    type: ((['model', 'embedding', 'dataset', 'function', 'template'] as const)[Math.floor(Math.random() * 5)]),
    owner: '系统',
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    updatedAt: new Date().toISOString(),
    size: Math.floor(Math.random() * 1000000),
    description: `这是一个详细的资源描述，提供了关于资源${resourceId}的更多信息。`,
    tags: ['标签1', '标签2', '重要'],
    metadata: {
      version: '1.0',
      framework: 'TensorFlow',
      dimensions: 768,
      customField: '自定义值'
    },
    visibility: 'public',
    serverId,
    uri: `mcp://${serverId}/resources/${resourceId}`,
    status: 'active',
    contentType: 'application/json',
    permissions: {
      canView: true,
      canEdit: true,
      canDelete: true,
      canShare: true
    },
    versions: [
      {
        id: 'v3',
        version: '1.2',
        createdAt: new Date().toISOString(),
        createdBy: '系统',
        changes: '优化性能并修复错误'
      },
      {
        id: 'v2',
        version: '1.1',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        createdBy: '系统',
        changes: '添加新特性'
      },
      {
        id: 'v1',
        version: '1.0',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        createdBy: '系统',
        changes: '初始版本'
      }
    ],
    usageStats: {
      lastUsed: new Date(Date.now() - 3600000).toISOString(),
      totalUses: 256,
      averageLatency: 120,
      errorRate: 0.02
    },
    relatedResources: ['res4', 'res7', 'res12']
  };
};

// 模拟创建资源的API
const createResourceAPI = async (params: CreateResourceParams): Promise<McpResource> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const now = new Date().toISOString();
  
  // 返回创建的资源
  return {
    id: Math.random().toString(36).substring(2, 9),
    name: params.name,
    type: params.type,
    owner: '当前用户',
    createdAt: now,
    updatedAt: now,
    size: params.content ? JSON.stringify(params.content).length : 0,
    description: params.description,
    tags: params.tags,
    metadata: params.metadata,
    visibility: params.visibility,
    serverId: params.serverId,
    uri: `mcp://${params.serverId}/resources/${Math.random().toString(36).substring(2, 9)}`,
    status: 'active'
  };
};

// 模拟更新资源的API
const updateResourceAPI = async (params: UpdateResourceParams): Promise<McpResource> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 返回更新后的资源
  return {
    id: params.resourceId,
    name: params.updates.name || '未命名资源',
    type: 'model',
    owner: '当前用户',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
    size: 1024,
    description: params.updates.description,
    tags: params.updates.tags || [],
    metadata: params.updates.metadata || {},
    visibility: params.updates.visibility || 'private',
    serverId: params.serverId,
    uri: `mcp://${params.serverId}/resources/${params.resourceId}`,
    status: params.updates.status || 'active'
  };
};

// 模拟删除资源的API
const deleteResourceAPI = async ([serverId, resourceId]: [string, string]): Promise<boolean> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // 在实际实现中，将使用这些参数发送请求
  if (!serverId || !resourceId) {
    console.error('服务器ID和资源ID不能为空');
    return false;
  }
  
  console.log(`正在从服务器 ${serverId} 删除资源 ${resourceId}`);
  
  // 模拟特殊错误情况
  if (resourceId.startsWith('protected-')) {
    console.warn(`无法删除受保护的资源: ${resourceId}`);
    return false;
  }
  
  // 假设删除成功
  return true;
};

// 模拟获取资源内容的API
const getResourceContentAPI = async ([serverId, resourceId]: [string, string]): Promise<any> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 在实际实现中，将使用这些参数请求特定资源
  if (!serverId || !resourceId) {
    console.error('服务器ID和资源ID不能为空');
    throw new Error('缺少必要的参数');
  }
  
  console.log(`从服务器 ${serverId} 上获取资源 ${resourceId} 的内容`);
  
  // 基于资源ID确定类型(模拟实现)
  let type = 'other';
  if (resourceId.startsWith('model-')) {
    type = 'model';
  } else if (resourceId.startsWith('emb-')) {
    type = 'embedding';
  } else if (resourceId.startsWith('ds-')) {
    type = 'dataset';
  } else if (resourceId.startsWith('fn-')) {
    type = 'function';
  } else if (resourceId.startsWith('tpl-')) {
    type = 'template';
  } else {
    // 随机生成类型作为备选
    type = ['model', 'embedding', 'dataset', 'function', 'template', 'other'][Math.floor(Math.random() * 6)];
  }
  
  if (type === 'dataset') {
    return {
      type: 'dataset',
      format: 'json',
      records: [
        { id: 1, name: "示例1", value: 10 },
        { id: 2, name: "示例2", value: 20 },
        { id: 3, name: "示例3", value: 30 },
      ],
      schema: {
        fields: [
          { name: "id", type: "integer" },
          { name: "name", type: "string" },
          { name: "value", type: "integer" }
        ]
      }
    };
  } else if (type === 'function') {
    return {
      type: 'function',
      name: "exampleFunction",
      code: "function exampleFunction(input) {\n  return input * 2;\n}",
      language: "javascript",
      parameters: [
        { name: "input", type: "number", description: "输入值" }
      ],
      returns: { type: "number", description: "输入值的两倍" }
    };
  } else if (type === 'model') {
    return {
      type: 'model',
      framework: "tensorflow",
      version: "2.5.0",
      architecture: "transformer",
      params: 125000000,
      inputShape: [1, 128],
      outputShape: [1, 10],
      accuracy: 0.95,
      metadata: {
        trainingDataset: "example-dataset",
        epochs: 100,
        batchSize: 32
      }
    };
  } else {
    return {
      type: type,
      content: "示例内容",
      metadata: {
        createdAt: new Date().toISOString(),
        version: "1.0"
      }
    };
  }
};

/**
 * MCP资源管理Hook
 * 
 * 用于管理MCP服务器上的资源，包括列表、详情、创建、更新和删除
 * 
 * @returns {object} 包含MCP资源管理功能的对象
 */
export const useMcpResources = () => {
  // 资源列表
  const {
    data: resourcesResponse,
    loading: isLoadingResources,
    error: resourcesError,
    execute: executeResourcesFetch
  } = useAPI<FetchResourcesParams, FetchResourcesResponse>(fetchResourcesAPI);
  
  // 资源详情
  const {
    data: resourceDetails,
    loading: isLoadingDetails,
    error: detailsError,
    execute: executeDetailsFetch
  } = useAPI<[string, string], ResourceDetails>(
    (params) => fetchResourceDetailsAPI(params)
  );
  
  // 创建资源
  const {
    loading: isCreatingResource,
    error: createError,
    execute: executeResourceCreate
  } = useAPI(createResourceAPI);
  
  // 更新资源
  const {
    loading: isUpdatingResource,
    error: updateError,
    execute: executeResourceUpdate
  } = useAPI(updateResourceAPI);
  
  // 删除资源
  const {
    loading: isDeletingResource,
    error: deleteError,
    execute: executeResourceDelete
  } = useAPI<[string, string], boolean>(
    (params) => deleteResourceAPI(params)
  );
  
  // 获取资源内容
  const {
    data: resourceContent,
    loading: isLoadingContent,
    error: contentError,
    execute: executeContentFetch
  } = useAPI<[string, string], any>(
    (params) => getResourceContentAPI(params)
  );
  
  // 当前选择的资源ID
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  
  // 资源筛选选项
  const [filterOptions, setFilterOptions] = useState<Partial<ResourceFilterOptions>>({});
  
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
  
  // 从响应中获取资源列表
  const resources = useMemo(() => 
    resourcesResponse?.resources || [], 
    [resourcesResponse]
  );
  
  // 从响应中获取总数
  useEffect(() => {
    if (resourcesResponse) {
      setPagination(prev => ({
        ...prev,
        total: resourcesResponse.total
      }));
    }
  }, [resourcesResponse]);
  
  // 获取选中的资源
  const selectedResource = useMemo(() => 
    resources.find(resource => resource.id === selectedResourceId) || null,
    [resources, selectedResourceId]
  );
  
  // 获取资源列表
  const fetchResources = useCallback((
    serverId: string,
    options: {
      filter?: Partial<ResourceFilterOptions>;
      page?: number;
      pageSize?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}
  ) => {
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
    const params: FetchResourcesParams = {
      serverId,
      filter: filter || filterOptions,
      page: page !== undefined ? page : pagination.current,
      pageSize: pageSize !== undefined ? pageSize : pagination.pageSize,
      sortBy: sortBy !== undefined ? sortBy : sortInfo.sortBy,
      sortOrder: sortOrder !== undefined ? sortOrder : sortInfo.sortOrder
    };
    
    return executeResourcesFetch(params);
  }, [executeResourcesFetch, filterOptions, pagination, sortInfo]);
  
  // 获取资源详情
  const fetchResourceDetails = useCallback((serverId: string, resourceId: string) => {
    return executeDetailsFetch([serverId, resourceId]);
  }, [executeDetailsFetch]);
  
  // 创建资源
  const createResource = useCallback(async (params: CreateResourceParams) => {
    try {
      const newResource = await executeResourceCreate(params);
      message.success('创建资源成功');
      return newResource;
    } catch (error) {
      console.error('创建资源失败:', error);
      message.error('创建资源失败');
      return null;
    }
  }, [executeResourceCreate]);
  
  // 更新资源
  const updateResource = useCallback(async (params: UpdateResourceParams) => {
    try {
      const updatedResource = await executeResourceUpdate(params);
      message.success('更新资源成功');
      return updatedResource;
    } catch (error) {
      console.error('更新资源失败:', error);
      message.error('更新资源失败');
      return null;
    }
  }, [executeResourceUpdate]);
  
  // 删除资源
  const deleteResource = useCallback(async (serverId: string, resourceId: string) => {
    try {
      const success = await executeResourceDelete([serverId, resourceId]);
      if (success) {
        // 如果删除的是当前选择的资源，清除选择
        if (resourceId === selectedResourceId) {
          setSelectedResourceId(null);
        }
        
        message.success('删除资源成功');
        return true;
      }
      message.error('删除资源失败');
      return false;
    } catch (error) {
      console.error('删除资源失败:', error);
      message.error('删除资源失败');
      return false;
    }
  }, [executeResourceDelete, selectedResourceId]);
  
  // 获取资源内容
  const getResourceContent = useCallback((serverId: string, resourceId: string) => {
    return executeContentFetch([serverId, resourceId]);
  }, [executeContentFetch]);
  
  // 选择资源
  const selectResource = useCallback((resourceId: string | null) => {
    setSelectedResourceId(resourceId);
  }, []);
  
  // 更新筛选选项
  const updateFilterOptions = useCallback((newOptions: Partial<ResourceFilterOptions>) => {
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
  
  // 根据类型获取资源
  const getResourcesByType = useCallback((type: string) => {
    return resources.filter(resource => resource.type === type);
  }, [resources]);
  
  // 获取所有标签
  const getAllTags = useMemo(() => {
    const tagSet = new Set<string>();
    resources.forEach(resource => {
      resource.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [resources]);
  
  // 获取所有所有者
  const getAllOwners = useMemo(() => {
    const ownerSet = new Set<string>();
    resources.forEach(resource => {
      ownerSet.add(resource.owner);
    });
    return Array.from(ownerSet);
  }, [resources]);
  
  // 获取资源类型统计
  const resourceTypeStats = useMemo(() => {
    const stats: Record<string, number> = {};
    resources.forEach(resource => {
      stats[resource.type] = (stats[resource.type] || 0) + 1;
    });
    return stats;
  }, [resources]);
  
  return {
    // 数据
    resources,
    resourceDetails,
    selectedResource,
    resourceContent,
    filterOptions,
    pagination,
    sortInfo,
    resourceTypeStats,
    allTags: getAllTags,
    allOwners: getAllOwners,
    
    // 加载状态
    isLoadingResources,
    isLoadingDetails,
    isCreatingResource,
    isUpdatingResource,
    isDeletingResource,
    isLoadingContent,
    
    // 错误状态
    resourcesError,
    detailsError,
    createError,
    updateError,
    deleteError,
    contentError,
    
    // 操作方法
    fetchResources,
    fetchResourceDetails,
    createResource,
    updateResource,
    deleteResource,
    getResourceContent,
    selectResource,
    updateFilterOptions,
    clearFilterOptions,
    updatePagination,
    updateSorting,
    clearSorting,
    getResourcesByType
  };
};
