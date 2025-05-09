import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAPI } from '../common/useAPI';
import { useList } from '../common/useList';
import { message } from 'antd';

// 定义数据处理器类型
export interface DataProcessor {
  id: string;
  name: string;
  description: string;
  type: 'filter' | 'transformer' | 'aggregator' | 'validator' | 'extractor';
  category: string;
  icon?: string;
  config: {
    inputSchema?: Record<string, any>;
    outputSchema?: Record<string, any>;
    parameters?: Array<{
      name: string;
      type: string;
      description: string;
      required: boolean;
      defaultValue?: any;
    }>;
    script?: string;
    functionName?: string;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isBuiltIn: boolean;
  tags: string[];
}

// 定义处理器创建参数
export interface CreateProcessorParams {
  name: string;
  description: string;
  type: 'filter' | 'transformer' | 'aggregator' | 'validator' | 'extractor';
  category: string;
  icon?: string;
  config: {
    inputSchema?: Record<string, any>;
    outputSchema?: Record<string, any>;
    parameters?: Array<{
      name: string;
      type: string;
      description: string;
      required: boolean;
      defaultValue?: any;
    }>;
    script?: string;
    functionName?: string;
  };
  tags: string[];
}

// 定义处理器更新参数
export interface UpdateProcessorParams {
  id: string;
  name?: string;
  description?: string;
  category?: string;
  icon?: string;
  config?: Partial<{
    inputSchema?: Record<string, any>;
    outputSchema?: Record<string, any>;
    parameters?: Array<{
      name: string;
      type: string;
      description: string;
      required: boolean;
      defaultValue?: any;
    }>;
    script?: string;
    functionName?: string;
  }>;
  tags?: string[];
}

// 定义处理器执行参数
export interface ExecuteProcessorParams {
  processorId: string;
  inputData: any;
  parameters?: Record<string, any>;
}

// 定义处理器筛选选项
export interface ProcessorFilterOptions {
  searchQuery: string;
  types: Array<'filter' | 'transformer' | 'aggregator' | 'validator' | 'extractor'>;
  categories: string[];
  tags: string[];
  onlyBuiltIn: boolean;
}

// 模拟获取数据处理器的API函数
const fetchProcessorsAPI = async (): Promise<DataProcessor[]> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 返回模拟数据
  return [
    {
      id: '1',
      name: '数据清洗器',
      description: '清洗数据中的空值、异常值和重复项',
      type: 'filter',
      category: '数据预处理',
      icon: 'filter',
      config: {
        inputSchema: {
          type: 'array',
          items: { type: 'object' }
        },
        outputSchema: {
          type: 'array',
          items: { type: 'object' }
        },
        parameters: [
          {
            name: 'removeNulls',
            type: 'boolean',
            description: '是否移除空值',
            required: false,
            defaultValue: true
          },
          {
            name: 'removeDuplicates',
            type: 'boolean',
            description: '是否移除重复项',
            required: false,
            defaultValue: true
          }
        ],
        functionName: 'cleanData'
      },
      createdBy: '系统',
      createdAt: '2023-07-10T08:00:00Z',
      updatedAt: '2023-07-10T08:00:00Z',
      isBuiltIn: true,
      tags: ['清洗', '预处理', '数据质量']
    },
    {
      id: '2',
      name: '数据转换器',
      description: '转换数据格式和结构',
      type: 'transformer',
      category: '数据转换',
      icon: 'repeat',
      config: {
        inputSchema: {
          type: 'object'
        },
        outputSchema: {
          type: 'object'
        },
        parameters: [
          {
            name: 'format',
            type: 'string',
            description: '输出格式',
            required: true,
            defaultValue: 'json'
          },
          {
            name: 'includeFields',
            type: 'array',
            description: '需要包含的字段',
            required: false
          }
        ],
        functionName: 'transformData'
      },
      createdBy: '系统',
      createdAt: '2023-07-15T10:30:00Z',
      updatedAt: '2023-08-05T09:15:00Z',
      isBuiltIn: true,
      tags: ['转换', '格式化', '映射']
    },
    {
      id: '3',
      name: '数据验证器',
      description: '验证数据的格式和内容',
      type: 'validator',
      category: '数据质量',
      icon: 'check-circle',
      config: {
        inputSchema: {
          type: 'object'
        },
        parameters: [
          {
            name: 'rules',
            type: 'object',
            description: '验证规则',
            required: true
          }
        ],
        functionName: 'validateData'
      },
      createdBy: '系统',
      createdAt: '2023-08-20T16:45:00Z',
      updatedAt: '2023-08-20T16:45:00Z',
      isBuiltIn: true,
      tags: ['验证', '数据质量', '规则检查']
    }
  ];
};

// 模拟创建处理器的API函数
const createProcessorAPI = async (params: CreateProcessorParams): Promise<DataProcessor> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const now = new Date().toISOString();
  
  // 返回创建的处理器
  return {
    id: Math.random().toString(36).substring(2, 9),
    ...params,
    createdBy: '当前用户',
    createdAt: now,
    updatedAt: now,
    isBuiltIn: false
  };
};

// 模拟更新处理器的API函数
const updateProcessorAPI = async (params: UpdateProcessorParams): Promise<DataProcessor> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 假设这里会返回更新后的处理器
  return {
    id: params.id,
    name: params.name || '默认处理器',
    description: params.description || '默认描述',
    type: 'filter',
    category: params.category || '未分类',
    icon: params.icon,
    config: {
      inputSchema: params.config?.inputSchema,
      outputSchema: params.config?.outputSchema,
      parameters: params.config?.parameters,
      script: params.config?.script,
      functionName: params.config?.functionName
    },
    createdBy: '当前用户',
    createdAt: '2023-08-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
    isBuiltIn: false,
    tags: params.tags || []
  };
};

// 模拟删除处理器的API函数
const deleteProcessorAPI = async (processorId: string): Promise<boolean> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 假设删除成功
  return true;
};

// 模拟执行处理器的API函数
const executeProcessorAPI = async (params: ExecuteProcessorParams): Promise<any> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 根据处理器类型生成不同的示例结果
  const sampleResults = {
    filter: { filtered: true, count: 10, data: [] },
    transformer: { transformed: true, format: 'json', data: {} },
    aggregator: { aggregated: true, sum: 1000, avg: 100, count: 10 },
    validator: { valid: true, errors: [], warnings: [] },
    extractor: { extracted: true, fields: ['field1', 'field2'], data: {} }
  };
  
  // 随机模拟成功或失败
  const success = Math.random() > 0.2;
  
  if (success) {
    // 根据处理器ID确定类型
    const processorType: 'filter' | 'transformer' | 'aggregator' | 'validator' | 'extractor' = 
      ['1'].includes(params.processorId) ? 'filter' :
      ['2'].includes(params.processorId) ? 'transformer' :
      ['3'].includes(params.processorId) ? 'validator' :
      ['4'].includes(params.processorId) ? 'aggregator' : 'extractor';
    
    return {
      success: true,
      processorId: params.processorId,
      result: sampleResults[processorType],
      executionTime: Math.floor(Math.random() * 500),
      timestamp: new Date().toISOString()
    };
  } else {
    throw new Error('处理器执行失败: 输入数据格式不兼容');
  }
};

/**
 * 数据处理器管理Hook
 * 
 * 负责数据处理器的加载、筛选、创建、更新和执行
 * 
 * @returns {object} 包含数据处理器数据和操作方法的对象
 */
export const useDataProcessors = () => {
  // 使用通用API hook处理数据获取
  const {
    data: processorsData,
    loading: isLoading,
    error: fetchError,
    execute: fetchProcessors
  } = useAPI<void, DataProcessor[]>(fetchProcessorsAPI);
  
  // 使用通用列表hook管理处理器数据
  const {
    items: processors,
    setItems: setProcessors,
    addItem: addProcessor,
    updateItem: updateProcessorInList,
    removeItem: removeProcessorFromList,
    setSort,
    clearSort,
    addFilter,
    removeFilter,
    clearFilters
  } = useList<DataProcessor>([]);
  
  // 选中的处理器
  const [selectedProcessorId, setSelectedProcessorId] = useState<string | null>(null);
  
  // 处理器筛选选项
  const [filterOptions, setFilterOptions] = useState<ProcessorFilterOptions>({
    searchQuery: '',
    types: [],
    categories: [],
    tags: [],
    onlyBuiltIn: false
  });
  
  // 执行结果
  const [executionResult, setExecutionResult] = useState<any | null>(null);
  
  // 创建处理器
  const {
    loading: isCreating,
    error: createError,
    execute: executeCreate
  } = useAPI(createProcessorAPI);
  
  // 更新处理器
  const {
    loading: isUpdating,
    error: updateError,
    execute: executeUpdate
  } = useAPI(updateProcessorAPI);
  
  // 删除处理器
  const {
    loading: isDeleting,
    error: deleteError,
    execute: executeDelete
  } = useAPI(deleteProcessorAPI);
  
  // 执行处理器
  const {
    loading: isExecuting,
    error: executeError,
    execute: executeProcessorRequest
  } = useAPI(executeProcessorAPI);
  
  // 初始加载数据
  useEffect(() => {
    fetchProcessors();
  }, [fetchProcessors]);
  
  // 当API数据更新时，更新列表
  useEffect(() => {
    if (processorsData) {
      setProcessors(processorsData);
    }
  }, [processorsData, setProcessors]);
  
  // 获取选中的处理器
  const selectedProcessor = useMemo(() => 
    processors.find(processor => processor.id === selectedProcessorId) || null, 
    [processors, selectedProcessorId]
  );
  
  // 创建处理器
  const createProcessor = useCallback(async (params: CreateProcessorParams) => {
    try {
      const newProcessor = await executeCreate(params);
      addProcessor(newProcessor);
      message.success('处理器创建成功');
      return newProcessor;
    } catch (error) {
      console.error('创建处理器失败:', error);
      message.error('创建处理器失败');
      return null;
    }
  }, [executeCreate, addProcessor]);
  
  // 更新处理器
  const updateProcessor = useCallback(async (params: UpdateProcessorParams) => {
    try {
      const updatedProcessor = await executeUpdate(params);
      updateProcessorInList(
        processor => processor.id === params.id,
        {
          name: params.name,
          description: params.description,
          category: params.category,
          icon: params.icon,
          config: params.config ? {
            ...params.config
          } : undefined,
          tags: params.tags,
          updatedAt: new Date().toISOString()
        }
      );
      message.success('处理器更新成功');
      return updatedProcessor;
    } catch (error) {
      console.error('更新处理器失败:', error);
      message.error('更新处理器失败');
      return null;
    }
  }, [executeUpdate, updateProcessorInList]);
  
  // 删除处理器
  const deleteProcessor = useCallback(async (processorId: string) => {
    try {
      const success = await executeDelete(processorId);
      if (success) {
        removeProcessorFromList(processor => processor.id === processorId);
        
        // 如果删除的是当前选中的处理器，取消选择
        if (processorId === selectedProcessorId) {
          setSelectedProcessorId(null);
        }
        
        message.success('处理器删除成功');
        return true;
      }
      message.error('处理器删除失败');
      return false;
    } catch (error) {
      console.error('删除处理器失败:', error);
      message.error('删除处理器失败');
      return false;
    }
  }, [executeDelete, removeProcessorFromList, selectedProcessorId]);
  
  // 执行处理器
  const executeProcessor = useCallback(async (processorId: string, inputData: any, parameters?: Record<string, any>) => {
    try {
      const result = await executeProcessorRequest({
        processorId,
        inputData,
        parameters
      });
      
      setExecutionResult(result);
      message.success('处理器执行成功');
      return result;
    } catch (error) {
      console.error('执行处理器失败:', error);
      message.error(`执行处理器失败: ${error instanceof Error ? error.message : '未知错误'}`);
      setExecutionResult(null);
      return null;
    }
  }, [executeProcessorRequest]);
  
  // 选择处理器
  const selectProcessor = useCallback((processorId: string | null) => {
    setSelectedProcessorId(processorId);
  }, []);
  
  // 清除执行结果
  const clearExecutionResult = useCallback(() => {
    setExecutionResult(null);
  }, []);
  
  // 设置搜索查询
  const setSearchQuery = useCallback((query: string) => {
    setFilterOptions(prev => ({
      ...prev,
      searchQuery: query
    }));
  }, []);
  
  // 设置类型筛选
  const setTypeFilter = useCallback((types: Array<'filter' | 'transformer' | 'aggregator' | 'validator' | 'extractor'>) => {
    setFilterOptions(prev => ({
      ...prev,
      types
    }));
  }, []);
  
  // 设置分类筛选
  const setCategoryFilter = useCallback((categories: string[]) => {
    setFilterOptions(prev => ({
      ...prev,
      categories
    }));
  }, []);
  
  // 设置标签筛选
  const setTagFilter = useCallback((tags: string[]) => {
    setFilterOptions(prev => ({
      ...prev,
      tags
    }));
  }, []);
  
  // 设置内置筛选
  const setBuiltInFilter = useCallback((onlyBuiltIn: boolean) => {
    setFilterOptions(prev => ({
      ...prev,
      onlyBuiltIn
    }));
  }, []);
  
  // 获取分类列表
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    processors.forEach(processor => {
      if (processor.category) {
        categorySet.add(processor.category);
      }
    });
    return Array.from(categorySet);
  }, [processors]);
  
  // 获取标签列表
  const tags = useMemo(() => {
    const tagSet = new Set<string>();
    processors.forEach(processor => {
      processor.tags.forEach(tag => {
        tagSet.add(tag);
      });
    });
    return Array.from(tagSet);
  }, [processors]);
  
  // 应用筛选获取处理器列表
  const filteredProcessors = useMemo(() => {
    const { searchQuery, types, categories, tags, onlyBuiltIn } = filterOptions;
    
    return processors.filter(processor => {
      // 搜索查询匹配
      const matchesSearch = !searchQuery || 
        processor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        processor.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 类型匹配
      const matchesType = types.length === 0 || types.includes(processor.type);
      
      // 分类匹配
      const matchesCategory = categories.length === 0 || categories.includes(processor.category);
      
      // 标签匹配
      const matchesTags = tags.length === 0 || 
        tags.some(tag => processor.tags.includes(tag));
      
      // 内置匹配
      const matchesBuiltIn = !onlyBuiltIn || processor.isBuiltIn;
      
      return matchesSearch && matchesType && matchesCategory && matchesTags && matchesBuiltIn;
    });
  }, [processors, filterOptions]);
  
  // 刷新处理器列表
  const refreshProcessors = useCallback(() => {
    return fetchProcessors();
  }, [fetchProcessors]);
  
  // 按类型分组处理器
  const processorsByType = useMemo(() => {
    const result: Record<string, DataProcessor[]> = {
      filter: [],
      transformer: [],
      aggregator: [],
      validator: [],
      extractor: []
    };
    
    processors.forEach(processor => {
      if (processor.type in result) {
        result[processor.type].push(processor);
      }
    });
    
    return result;
  }, [processors]);
  
  return {
    // 数据
    processors,
    filteredProcessors,
    processorsByType,
    selectedProcessor,
    selectedProcessorId,
    categories,
    tags,
    executionResult,
    
    // 加载状态
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isExecuting,
    
    // 错误状态
    fetchError,
    createError,
    updateError,
    deleteError,
    executeError,
    
    // 处理器操作
    createProcessor,
    updateProcessor,
    deleteProcessor,
    selectProcessor,
    executeProcessor,
    clearExecutionResult,
    
    // 筛选和查询
    setSearchQuery,
    setTypeFilter,
    setCategoryFilter,
    setTagFilter,
    setBuiltInFilter,
    
    // 其他操作
    refreshProcessors
  };
};
