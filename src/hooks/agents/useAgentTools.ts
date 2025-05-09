import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAPI } from '../common/useAPI';
import { useList } from '../common/useList';
import { message } from 'antd';

// 定义代理工具类型
export interface AgentTool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon?: string;
  type: 'api' | 'function' | 'script' | 'external';
  config: {
    endpoint?: string;
    method?: string;
    headers?: Record<string, string>;
    parameters?: Array<{
      name: string;
      type: string;
      description: string;
      required: boolean;
      defaultValue?: string;
    }>;
    timeout?: number;
    script?: string;
    functionName?: string;
    executionMode?: 'sync' | 'async';
  };
  status: 'active' | 'inactive' | 'deprecated';
  version: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  lastUsedAt?: string;
  usageCount: number;
  avgResponseTime?: number;
  isBuiltIn: boolean;
  tags: string[];
}

// 定义工具创建参数
export interface CreateToolParams {
  name: string;
  description: string;
  category: string;
  icon?: string;
  type: 'api' | 'function' | 'script' | 'external';
  config: {
    endpoint?: string;
    method?: string;
    headers?: Record<string, string>;
    parameters?: Array<{
      name: string;
      type: string;
      description: string;
      required: boolean;
      defaultValue?: string;
    }>;
    timeout?: number;
    script?: string;
    functionName?: string;
    executionMode?: 'sync' | 'async';
  };
  tags: string[];
}

// 定义工具更新参数
export interface UpdateToolParams {
  id: string;
  name?: string;
  description?: string;
  category?: string;
  icon?: string;
  config?: Partial<{
    endpoint?: string;
    method?: string;
    headers?: Record<string, string>;
    parameters?: Array<{
      name: string;
      type: string;
      description: string;
      required: boolean;
      defaultValue?: string;
    }>;
    timeout?: number;
    script?: string;
    functionName?: string;
    executionMode?: 'sync' | 'async';
  }>;
  status?: 'active' | 'inactive' | 'deprecated';
  tags?: string[];
}

// 定义工具筛选选项
export interface ToolFilterOptions {
  searchQuery: string;
  categories: string[];
  types: Array<'api' | 'function' | 'script' | 'external'>;
  status: Array<'active' | 'inactive' | 'deprecated'>;
  tags: string[];
  onlyBuiltIn: boolean;
}

// 模拟获取代理工具的API函数
const fetchToolsAPI = async (): Promise<AgentTool[]> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 返回模拟数据
  return [
    {
      id: '1',
      name: '搜索引擎',
      description: '使用搜索引擎查询网络信息',
      category: '信息检索',
      icon: 'search',
      type: 'api',
      config: {
        endpoint: 'https://api.search.example.com/v1/search',
        method: 'GET',
        parameters: [
          {
            name: 'query',
            type: 'string',
            description: '搜索查询',
            required: true
          },
          {
            name: 'limit',
            type: 'number',
            description: '结果数量',
            required: false,
            defaultValue: '10'
          }
        ],
        timeout: 5000,
        executionMode: 'sync'
      },
      status: 'active',
      version: '1.0.0',
      author: '系统',
      createdAt: '2023-07-10T08:00:00Z',
      updatedAt: '2023-07-10T08:00:00Z',
      lastUsedAt: '2023-09-15T14:30:00Z',
      usageCount: 156,
      avgResponseTime: 1200,
      isBuiltIn: true,
      tags: ['搜索', '信息检索', '网络']
    },
    {
      id: '2',
      name: '天气查询',
      description: '获取指定城市的天气信息',
      category: '信息检索',
      icon: 'cloud',
      type: 'api',
      config: {
        endpoint: 'https://api.weather.example.com/forecast',
        method: 'GET',
        parameters: [
          {
            name: 'city',
            type: 'string',
            description: '城市名称',
            required: true
          },
          {
            name: 'days',
            type: 'number',
            description: '预报天数',
            required: false,
            defaultValue: '3'
          }
        ],
        timeout: 3000,
        executionMode: 'sync'
      },
      status: 'active',
      version: '1.1.0',
      author: '系统',
      createdAt: '2023-07-15T10:30:00Z',
      updatedAt: '2023-08-05T09:15:00Z',
      lastUsedAt: '2023-09-20T11:45:00Z',
      usageCount: 89,
      avgResponseTime: 800,
      isBuiltIn: true,
      tags: ['天气', '预报', '地理']
    },
    {
      id: '3',
      name: '代码执行器',
      description: '执行提供的Python代码片段',
      category: '开发工具',
      icon: 'code',
      type: 'script',
      config: {
        parameters: [
          {
            name: 'code',
            type: 'string',
            description: 'Python代码',
            required: true
          },
          {
            name: 'timeout',
            type: 'number',
            description: '执行超时(秒)',
            required: false,
            defaultValue: '5'
          }
        ],
        script: 'def run_python_code(code, timeout=5):\n    # 执行代码的逻辑\n    return {"result": "执行结果"}',
        functionName: 'run_python_code',
        executionMode: 'sync',
        timeout: 10000
      },
      status: 'active',
      version: '1.0.0',
      author: '用户',
      createdAt: '2023-08-20T16:45:00Z',
      updatedAt: '2023-08-20T16:45:00Z',
      lastUsedAt: '2023-09-18T13:20:00Z',
      usageCount: 45,
      avgResponseTime: 2500,
      isBuiltIn: false,
      tags: ['代码', '执行', 'Python', '开发']
    }
  ];
};

// 模拟创建工具的API函数
const createToolAPI = async (params: CreateToolParams): Promise<AgentTool> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const now = new Date().toISOString();
  
  // 返回创建的工具
  return {
    id: Math.random().toString(36).substring(2, 9),
    ...params,
    status: 'active',
    version: '1.0.0',
    author: '当前用户',
    createdAt: now,
    updatedAt: now,
    usageCount: 0,
    isBuiltIn: false
  };
};

// 模拟更新工具的API函数
const updateToolAPI = async (params: UpdateToolParams): Promise<AgentTool> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 假设这里会返回更新后的工具
  return {
    id: params.id,
    name: params.name || '默认名称',
    description: params.description || '描述',
    category: params.category || '未分类',
    icon: params.icon,
    type: 'api', // 假设默认为API类型
    config: {
      endpoint: params.config?.endpoint,
      method: params.config?.method,
      parameters: params.config?.parameters,
      timeout: params.config?.timeout,
      script: params.config?.script,
      functionName: params.config?.functionName,
      executionMode: params.config?.executionMode
    },
    status: params.status || 'active',
    version: '1.0.0',
    author: '当前用户',
    createdAt: '2023-08-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
    usageCount: 0,
    isBuiltIn: false,
    tags: params.tags || []
  };
};

// 模拟删除工具的API函数
const deleteToolAPI = async (toolId: string): Promise<boolean> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 假设删除成功
  return true;
};

// 模拟修改工具状态的API函数
const changeToolStatusAPI = async (toolId: string, status: 'active' | 'inactive' | 'deprecated'): Promise<boolean> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 假设操作成功
  return true;
};

/**
 * 代理工具管理Hook
 * 
 * 负责代理工具的加载、筛选、创建、更新和删除
 * 
 * @returns {object} 包含代理工具数据和操作方法的对象
 */
export const useAgentTools = () => {
  // 使用通用API hook处理数据获取
  const {
    data: toolsData,
    loading: isLoading,
    error: fetchError,
    execute: fetchTools
  } = useAPI<void, AgentTool[]>(fetchToolsAPI);
  
  // 使用通用列表hook管理工具数据
  const {
    items: tools,
    setItems: setTools,
    addItem: addTool,
    updateItem: updateToolInList,
    removeItem: removeToolFromList,
    setSort,
    clearSort,
    addFilter,
    removeFilter,
    clearFilters
  } = useList<AgentTool>([]);
  
  // 工具选择状态
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  
  // 工具筛选选项
  const [filterOptions, setFilterOptions] = useState<ToolFilterOptions>({
    searchQuery: '',
    categories: [],
    types: [],
    status: ['active'],
    tags: [],
    onlyBuiltIn: false
  });
  
  // 创建工具
  const {
    loading: isCreating,
    error: createError,
    execute: executeCreate
  } = useAPI(createToolAPI);
  
  // 更新工具
  const {
    loading: isUpdating,
    error: updateError,
    execute: executeUpdate
  } = useAPI(updateToolAPI);
  
  // 删除工具
  const {
    loading: isDeleting,
    error: deleteError,
    execute: executeDelete
  } = useAPI(deleteToolAPI);
  
  // 修改工具状态
  const {
    loading: isChangingStatus,
    error: changeStatusError,
    execute: executeChangeStatus
  } = useAPI(changeToolStatusAPI);
  
  // 初始加载数据
  useEffect(() => {
    fetchTools();
  }, [fetchTools]);
  
  // 当API数据更新时，更新列表
  useEffect(() => {
    if (toolsData) {
      setTools(toolsData);
    }
  }, [toolsData, setTools]);
  
  // 获取选中的工具
  const selectedTool = useMemo(() => 
    tools.find(tool => tool.id === selectedToolId) || null, 
    [tools, selectedToolId]
  );
  
  // 创建工具
  const createTool = useCallback(async (params: CreateToolParams) => {
    try {
      const newTool = await executeCreate(params);
      addTool(newTool);
      message.success('工具创建成功');
      return newTool;
    } catch (error) {
      console.error('创建工具失败:', error);
      message.error('创建工具失败');
      return null;
    }
  }, [executeCreate, addTool]);
  
  // 更新工具
  const updateTool = useCallback(async (params: UpdateToolParams) => {
    try {
      const updatedTool = await executeUpdate(params);
      updateToolInList(
        tool => tool.id === params.id,
        {
          name: params.name,
          description: params.description,
          category: params.category,
          icon: params.icon,
          config: params.config ? {
            ...params.config
          } : undefined,
          status: params.status,
          tags: params.tags,
          updatedAt: new Date().toISOString()
        }
      );
      message.success('工具更新成功');
      return updatedTool;
    } catch (error) {
      console.error('更新工具失败:', error);
      message.error('更新工具失败');
      return null;
    }
  }, [executeUpdate, updateToolInList]);
  
  // 删除工具
  const deleteTool = useCallback(async (toolId: string) => {
    try {
      const success = await executeDelete(toolId);
      if (success) {
        removeToolFromList(tool => tool.id === toolId);
        
        // 如果删除的是当前选中的工具，取消选择
        if (toolId === selectedToolId) {
          setSelectedToolId(null);
        }
        
        message.success('工具删除成功');
        return true;
      }
      message.error('工具删除失败');
      return false;
    } catch (error) {
      console.error('删除工具失败:', error);
      message.error('删除工具失败');
      return false;
    }
  }, [executeDelete, removeToolFromList, selectedToolId]);
  
  // 更改工具状态
  const changeToolStatus = useCallback(async (toolId: string, status: 'active' | 'inactive' | 'deprecated') => {
    try {
      const success = await executeChangeStatus(toolId, status);
      if (success) {
        updateToolInList(
          tool => tool.id === toolId,
          { status, updatedAt: new Date().toISOString() }
        );
        
        const statusText = {
          active: '已激活',
          inactive: '已停用',
          deprecated: '已弃用'
        };
        
        message.success(`工具${statusText[status]}`);
        return true;
      }
      message.error('更改工具状态失败');
      return false;
    } catch (error) {
      console.error('更改工具状态失败:', error);
      message.error('更改工具状态失败');
      return false;
    }
  }, [executeChangeStatus, updateToolInList]);
  
  // 选择工具
  const selectTool = useCallback((toolId: string | null) => {
    setSelectedToolId(toolId);
  }, []);
  
  // 设置搜索查询
  const setSearchQuery = useCallback((query: string) => {
    setFilterOptions(prev => ({
      ...prev,
      searchQuery: query
    }));
  }, []);
  
  // 设置分类筛选
  const setCategoryFilter = useCallback((categories: string[]) => {
    setFilterOptions(prev => ({
      ...prev,
      categories
    }));
  }, []);
  
  // 设置类型筛选
  const setTypeFilter = useCallback((types: Array<'api' | 'function' | 'script' | 'external'>) => {
    setFilterOptions(prev => ({
      ...prev,
      types
    }));
  }, []);
  
  // 设置状态筛选
  const setStatusFilter = useCallback((status: Array<'active' | 'inactive' | 'deprecated'>) => {
    setFilterOptions(prev => ({
      ...prev,
      status
    }));
  }, []);
  
  // 设置标签筛选
  const setTagFilter = useCallback((tags: string[]) => {
    setFilterOptions(prev => ({
      ...prev,
      tags
    }));
  }, []);
  
  // 设置内置工具筛选
  const setBuiltInFilter = useCallback((onlyBuiltIn: boolean) => {
    setFilterOptions(prev => ({
      ...prev,
      onlyBuiltIn
    }));
  }, []);
  
  // 获取分类列表
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    tools.forEach(tool => {
      if (tool.category) {
        categorySet.add(tool.category);
      }
    });
    return Array.from(categorySet);
  }, [tools]);
  
  // 获取标签列表
  const tags = useMemo(() => {
    const tagSet = new Set<string>();
    tools.forEach(tool => {
      tool.tags.forEach(tag => {
        tagSet.add(tag);
      });
    });
    return Array.from(tagSet);
  }, [tools]);
  
  // 应用筛选获取工具列表
  const filteredTools = useMemo(() => {
    const { searchQuery, categories, types, status, tags, onlyBuiltIn } = filterOptions;
    
    return tools.filter(tool => {
      // 搜索查询匹配
      const matchesSearch = !searchQuery || 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 分类匹配
      const matchesCategory = categories.length === 0 || categories.includes(tool.category);
      
      // 类型匹配
      const matchesType = types.length === 0 || types.includes(tool.type);
      
      // 状态匹配
      const matchesStatus = status.length === 0 || status.includes(tool.status);
      
      // 标签匹配
      const matchesTags = tags.length === 0 || 
        tags.some(tag => tool.tags.includes(tag));
      
      // 内置工具匹配
      const matchesBuiltIn = !onlyBuiltIn || tool.isBuiltIn;
      
      return matchesSearch && matchesCategory && matchesType && matchesStatus && matchesTags && matchesBuiltIn;
    });
  }, [tools, filterOptions]);
  
  // 刷新工具列表
  const refreshTools = useCallback(() => {
    return fetchTools();
  }, [fetchTools]);
  
  // 按使用频率排序
  const sortByUsage = useCallback(() => {
    setSort((a, b) => b.usageCount - a.usageCount);
  }, [setSort]);
  
  // 按最近使用排序
  const sortByRecent = useCallback(() => {
    setSort((a, b) => {
      if (!a.lastUsedAt) return 1;
      if (!b.lastUsedAt) return -1;
      return new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime();
    });
  }, [setSort]);
  
  // 按名称排序
  const sortByName = useCallback(() => {
    setSort((a, b) => a.name.localeCompare(b.name));
  }, [setSort]);
  
  // 记录工具使用
  const logToolUsage = useCallback((toolId: string) => {
    updateToolInList(
      tool => tool.id === toolId,
      { 
        usageCount: (tool) => tool.usageCount + 1,
        lastUsedAt: new Date().toISOString()
      }
    );
    // 在实际应用中，这里应该调用API将使用记录发送到后端
  }, [updateToolInList]);
  
  return {
    // 数据
    tools,
    filteredTools,
    selectedTool,
    selectedToolId,
    categories,
    tags,
    
    // 加载状态
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isChangingStatus,
    
    // 错误状态
    fetchError,
    createError,
    updateError,
    deleteError,
    changeStatusError,
    
    // 工具操作
    createTool,
    updateTool,
    deleteTool,
    selectTool,
    changeToolStatus,
    logToolUsage,
    
    // 筛选和查询
    setSearchQuery,
    setCategoryFilter,
    setTypeFilter,
    setStatusFilter,
    setTagFilter,
    setBuiltInFilter,
    
    // 排序
    sortByUsage,
    sortByRecent,
    sortByName,
    
    // 其他操作
    refreshTools
  };
};
