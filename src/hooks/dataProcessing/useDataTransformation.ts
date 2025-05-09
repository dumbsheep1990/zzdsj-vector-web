import { useState, useCallback, useMemo } from 'react';
import { useAPI } from '../common/useAPI';
import { message } from 'antd';

// 定义转换操作类型
export interface TransformationOperation {
  id: string;
  name: string;
  description: string;
  inputType: string;
  outputType: string;
  parameters: Array<{
    name: string;
    type: string;
    description: string;
    required: boolean;
    defaultValue?: any;
  }>;
  icon?: string;
  category: string;
}

// 定义转换配置类型
export interface TransformationConfig {
  id: string;
  name: string;
  description: string;
  operations: Array<{
    operationId: string;
    parameters: Record<string, any>;
    order: number;
  }>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// 定义转换历史记录类型
export interface TransformationHistory {
  id: string;
  configId: string;
  timestamp: string;
  inputDataSnapshot: {
    type: string;
    size: number;
    sample?: any;
  };
  outputDataSnapshot: {
    type: string;
    size: number;
    sample?: any;
  };
  duration: number;
  status: 'success' | 'failed';
  error?: string;
}

// 定义转换执行参数
export interface ExecuteTransformationParams {
  configId: string;
  inputData: any;
}

// 定义创建转换配置参数
export interface CreateTransformationConfigParams {
  name: string;
  description: string;
  operations: Array<{
    operationId: string;
    parameters: Record<string, any>;
    order: number;
  }>;
}

// 定义更新转换配置参数
export interface UpdateTransformationConfigParams {
  id: string;
  name?: string;
  description?: string;
  operations?: Array<{
    operationId: string;
    parameters: Record<string, any>;
    order: number;
  }>;
  isActive?: boolean;
}

// 模拟获取转换操作列表API
const fetchTransformOperationsAPI = async (): Promise<TransformationOperation[]> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 返回模拟数据
  return [
    {
      id: 'op1',
      name: 'JSON格式化',
      description: '将数据格式化为标准JSON',
      inputType: 'any',
      outputType: 'json',
      parameters: [
        {
          name: 'indent',
          type: 'number',
          description: '缩进空格数',
          required: false,
          defaultValue: 2
        },
        {
          name: 'sortKeys',
          type: 'boolean',
          description: '是否对键进行排序',
          required: false,
          defaultValue: false
        }
      ],
      icon: 'code',
      category: '格式转换'
    },
    {
      id: 'op2',
      name: '字段映射',
      description: '将输入字段映射到输出字段',
      inputType: 'object',
      outputType: 'object',
      parameters: [
        {
          name: 'mapping',
          type: 'object',
          description: '字段映射配置',
          required: true
        },
        {
          name: 'retainUnmapped',
          type: 'boolean',
          description: '是否保留未映射的字段',
          required: false,
          defaultValue: false
        }
      ],
      icon: 'swap',
      category: '数据映射'
    },
    {
      id: 'op3',
      name: '数据筛选',
      description: '根据条件筛选数据',
      inputType: 'array',
      outputType: 'array',
      parameters: [
        {
          name: 'conditions',
          type: 'array',
          description: '筛选条件',
          required: true
        }
      ],
      icon: 'filter',
      category: '数据筛选'
    },
    {
      id: 'op4',
      name: 'CSV转JSON',
      description: '将CSV数据转换为JSON格式',
      inputType: 'string',
      outputType: 'array',
      parameters: [
        {
          name: 'delimiter',
          type: 'string',
          description: '分隔符',
          required: false,
          defaultValue: ','
        },
        {
          name: 'hasHeader',
          type: 'boolean',
          description: '是否包含表头',
          required: false,
          defaultValue: true
        }
      ],
      icon: 'file',
      category: '格式转换'
    },
    {
      id: 'op5',
      name: '排序',
      description: '对数据进行排序',
      inputType: 'array',
      outputType: 'array',
      parameters: [
        {
          name: 'key',
          type: 'string',
          description: '排序字段',
          required: true
        },
        {
          name: 'ascending',
          type: 'boolean',
          description: '是否升序',
          required: false,
          defaultValue: true
        }
      ],
      icon: 'sort-ascending',
      category: '数据排序'
    }
  ];
};

// 模拟获取转换配置列表API
const fetchTransformConfigsAPI = async (): Promise<TransformationConfig[]> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 返回模拟数据
  return [
    {
      id: 'config1',
      name: 'CSV导入处理流程',
      description: '导入CSV数据并转换为标准化JSON格式',
      operations: [
        {
          operationId: 'op4',
          parameters: {
            delimiter: ',',
            hasHeader: true
          },
          order: 1
        },
        {
          operationId: 'op2',
          parameters: {
            mapping: {
              '名称': 'name',
              '年龄': 'age',
              '电子邮件': 'email'
            },
            retainUnmapped: false
          },
          order: 2
        },
        {
          operationId: 'op5',
          parameters: {
            key: 'name',
            ascending: true
          },
          order: 3
        }
      ],
      createdBy: '系统',
      createdAt: '2023-07-15T08:00:00Z',
      updatedAt: '2023-07-15T08:00:00Z',
      isActive: true
    },
    {
      id: 'config2',
      name: '客户数据标准化',
      description: '标准化客户数据格式并筛选有效客户',
      operations: [
        {
          operationId: 'op2',
          parameters: {
            mapping: {
              'customer_id': 'id',
              'customer_name': 'name',
              'customer_email': 'email',
              'customer_phone': 'phone'
            },
            retainUnmapped: false
          },
          order: 1
        },
        {
          operationId: 'op3',
          parameters: {
            conditions: [
              { field: 'email', operator: 'exists' },
              { field: 'name', operator: 'exists' }
            ]
          },
          order: 2
        },
        {
          operationId: 'op1',
          parameters: {
            indent: 2,
            sortKeys: true
          },
          order: 3
        }
      ],
      createdBy: '系统',
      createdAt: '2023-08-10T14:30:00Z',
      updatedAt: '2023-08-12T09:15:00Z',
      isActive: true
    }
  ];
};

// 模拟创建转换配置API
const createTransformConfigAPI = async (params: CreateTransformationConfigParams): Promise<TransformationConfig> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const now = new Date().toISOString();
  
  // 返回创建的配置
  return {
    id: Math.random().toString(36).substring(2, 9),
    ...params,
    createdBy: '当前用户',
    createdAt: now,
    updatedAt: now,
    isActive: true
  };
};

// 模拟更新转换配置API
const updateTransformConfigAPI = async (params: UpdateTransformationConfigParams): Promise<TransformationConfig> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 假设这里会返回更新后的配置
  return {
    id: params.id,
    name: params.name || '默认配置',
    description: params.description || '默认描述',
    operations: params.operations || [],
    createdBy: '当前用户',
    createdAt: '2023-08-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
    isActive: params.isActive !== undefined ? params.isActive : true
  };
};

// 模拟删除转换配置API
const deleteTransformConfigAPI = async (configId: string): Promise<boolean> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 假设删除成功
  return true;
};

// 模拟执行转换API
const executeTransformationAPI = async (params: ExecuteTransformationParams): Promise<any> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 随机模拟成功或失败
  const success = Math.random() > 0.2;
  
  if (success) {
    return {
      success: true,
      configId: params.configId,
      result: {
        transformedData: Array.isArray(params.inputData) 
          ? params.inputData.map(item => ({ ...item, transformed: true }))
          : { ...(typeof params.inputData === 'object' ? params.inputData : {}), transformed: true },
        operations: 3,
        timestamp: new Date().toISOString(),
        duration: Math.floor(Math.random() * 500)
      },
      history: {
        id: Math.random().toString(36).substring(2, 9),
        configId: params.configId,
        timestamp: new Date().toISOString(),
        inputDataSnapshot: {
          type: Array.isArray(params.inputData) ? 'array' : typeof params.inputData,
          size: JSON.stringify(params.inputData).length,
          sample: Array.isArray(params.inputData) ? params.inputData.slice(0, 2) : params.inputData
        },
        outputDataSnapshot: {
          type: 'object',
          size: 1024,
          sample: { transformed: true }
        },
        duration: Math.floor(Math.random() * 500),
        status: 'success'
      }
    };
  } else {
    throw new Error('转换执行失败: 无法完成所有操作步骤');
  }
};

// 模拟获取转换历史记录API
const fetchTransformHistoryAPI = async (configId?: string): Promise<TransformationHistory[]> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 生成模拟历史记录
  const histories: TransformationHistory[] = [
    {
      id: 'hist1',
      configId: 'config1',
      timestamp: '2023-09-10T08:45:00Z',
      inputDataSnapshot: {
        type: 'string',
        size: 2048,
        sample: 'name,age,email\nJohn Doe,30,john@example.com'
      },
      outputDataSnapshot: {
        type: 'array',
        size: 1536,
        sample: [{ name: 'John Doe', age: 30, email: 'john@example.com' }]
      },
      duration: 352,
      status: 'success'
    },
    {
      id: 'hist2',
      configId: 'config1',
      timestamp: '2023-09-11T14:20:00Z',
      inputDataSnapshot: {
        type: 'string',
        size: 4096,
        sample: 'name,age,email\nJane Smith,25,jane@example.com'
      },
      outputDataSnapshot: {
        type: 'array',
        size: 3072,
        sample: [{ name: 'Jane Smith', age: 25, email: 'jane@example.com' }]
      },
      duration: 475,
      status: 'success'
    },
    {
      id: 'hist3',
      configId: 'config2',
      timestamp: '2023-09-12T10:15:00Z',
      inputDataSnapshot: {
        type: 'object',
        size: 1024,
        sample: { customer_id: '001', customer_name: 'Alice' }
      },
      outputDataSnapshot: {
        type: 'object',
        size: 768,
        sample: { id: '001', name: 'Alice' }
      },
      duration: 210,
      status: 'success'
    },
    {
      id: 'hist4',
      configId: 'config2',
      timestamp: '2023-09-13T16:30:00Z',
      inputDataSnapshot: {
        type: 'object',
        size: 1280,
        sample: { customer_id: '002' }
      },
      outputDataSnapshot: {
        type: 'null',
        size: 0
      },
      duration: 185,
      status: 'failed',
      error: '缺少必要字段: name'
    }
  ];
  
  // 如果指定了configId，筛选相关历史记录
  if (configId) {
    return histories.filter(history => history.configId === configId);
  }
  
  return histories;
};

/**
 * 数据转换管理Hook
 * 
 * 负责数据转换操作、配置和执行历史的管理
 * 
 * @returns {object} 包含数据转换功能的对象
 */
export const useDataTransformation = () => {
  // 转换操作列表
  const {
    data: operations,
    loading: isLoadingOperations,
    error: operationsError,
    execute: fetchOperations
  } = useAPI<void, TransformationOperation[]>(fetchTransformOperationsAPI);
  
  // 转换配置列表
  const {
    data: configs,
    loading: isLoadingConfigs,
    error: configsError,
    execute: fetchConfigs
  } = useAPI<void, TransformationConfig[]>(fetchTransformConfigsAPI);
  
  // 转换历史记录
  const {
    data: history,
    loading: isLoadingHistory,
    error: historyError,
    execute: executeHistoryFetch
  } = useAPI<string | undefined, TransformationHistory[]>(fetchTransformHistoryAPI);
  
  // 当前选中的配置
  const [selectedConfigId, setSelectedConfigId] = useState<string | null>(null);
  
  // 执行结果
  const [transformResult, setTransformResult] = useState<any | null>(null);
  
  // 创建配置
  const {
    loading: isCreating,
    error: createError,
    execute: executeCreate
  } = useAPI(createTransformConfigAPI);
  
  // 更新配置
  const {
    loading: isUpdating,
    error: updateError,
    execute: executeUpdate
  } = useAPI(updateTransformConfigAPI);
  
  // 删除配置
  const {
    loading: isDeleting,
    error: deleteError,
    execute: executeDelete
  } = useAPI(deleteTransformConfigAPI);
  
  // 执行转换
  const {
    loading: isExecuting,
    error: executeError,
    execute: executeTransformation
  } = useAPI(executeTransformationAPI);
  
  // 获取选中的配置
  const selectedConfig = useMemo(() => 
    configs?.find(config => config.id === selectedConfigId) || null, 
    [configs, selectedConfigId]
  );
  
  // 按类别分组操作
  const operationsByCategory = useMemo(() => {
    if (!operations) return {};
    
    const result: Record<string, TransformationOperation[]> = {};
    
    operations.forEach(operation => {
      if (!result[operation.category]) {
        result[operation.category] = [];
      }
      result[operation.category].push(operation);
    });
    
    return result;
  }, [operations]);
  
  // 获取所有操作类别
  const categories = useMemo(() => 
    operations ? Array.from(new Set(operations.map(op => op.category))) : [],
    [operations]
  );
  
  // 创建转换配置
  const createTransformationConfig = useCallback(async (params: CreateTransformationConfigParams) => {
    try {
      const newConfig = await executeCreate(params);
      message.success('转换配置创建成功');
      // 刷新配置列表
      fetchConfigs();
      return newConfig;
    } catch (error) {
      console.error('创建转换配置失败:', error);
      message.error('创建转换配置失败');
      return null;
    }
  }, [executeCreate, fetchConfigs]);
  
  // 更新转换配置
  const updateTransformationConfig = useCallback(async (params: UpdateTransformationConfigParams) => {
    try {
      const updatedConfig = await executeUpdate(params);
      message.success('转换配置更新成功');
      // 刷新配置列表
      fetchConfigs();
      return updatedConfig;
    } catch (error) {
      console.error('更新转换配置失败:', error);
      message.error('更新转换配置失败');
      return null;
    }
  }, [executeUpdate, fetchConfigs]);
  
  // 删除转换配置
  const deleteTransformationConfig = useCallback(async (configId: string) => {
    try {
      const success = await executeDelete(configId);
      if (success) {
        // 如果删除的是当前选中的配置，取消选择
        if (configId === selectedConfigId) {
          setSelectedConfigId(null);
        }
        
        message.success('转换配置删除成功');
        // 刷新配置列表
        fetchConfigs();
        return true;
      }
      message.error('转换配置删除失败');
      return false;
    } catch (error) {
      console.error('删除转换配置失败:', error);
      message.error('删除转换配置失败');
      return false;
    }
  }, [executeDelete, selectedConfigId, fetchConfigs]);
  
  // 执行数据转换
  const runTransformation = useCallback(async (configId: string, inputData: any) => {
    try {
      const result = await executeTransformation({
        configId,
        inputData
      });
      
      setTransformResult(result);
      message.success('数据转换成功');
      
      // 刷新该配置的历史记录
      executeHistoryFetch(configId);
      
      return result;
    } catch (error) {
      console.error('数据转换失败:', error);
      message.error(`数据转换失败: ${error instanceof Error ? error.message : '未知错误'}`);
      setTransformResult(null);
      return null;
    }
  }, [executeTransformation, executeHistoryFetch]);
  
  // 获取转换历史记录
  const getTransformationHistory = useCallback((configId?: string) => {
    return executeHistoryFetch(configId);
  }, [executeHistoryFetch]);
  
  // 选择转换配置
  const selectConfig = useCallback((configId: string | null) => {
    setSelectedConfigId(configId);
    
    // 如果选择了配置，获取该配置的历史记录
    if (configId) {
      executeHistoryFetch(configId);
    }
  }, [executeHistoryFetch]);
  
  // 清除转换结果
  const clearTransformResult = useCallback(() => {
    setTransformResult(null);
  }, []);
  
  // 根据ID获取操作
  const getOperationById = useCallback((operationId: string) => {
    return operations?.find(op => op.id === operationId) || null;
  }, [operations]);
  
  // 验证转换配置是否有效
  const validateConfig = useCallback((config: Partial<TransformationConfig>) => {
    if (!config.operations || config.operations.length === 0) {
      return { valid: false, error: '配置必须包含至少一个操作' };
    }
    
    // 检查操作的有效性
    for (const op of config.operations) {
      const operation = getOperationById(op.operationId);
      if (!operation) {
        return { valid: false, error: `ID为"${op.operationId}"的操作不存在` };
      }
      
      // 检查必需参数
      const missingParams = operation.parameters
        .filter(param => param.required)
        .filter(param => !(op.parameters && param.name in op.parameters));
      
      if (missingParams.length > 0) {
        return {
          valid: false,
          error: `操作"${operation.name}"缺少必需参数: ${missingParams.map(p => p.name).join(', ')}`
        };
      }
    }
    
    // 检查操作链的类型兼容性
    if (config.operations.length > 1) {
      for (let i = 1; i < config.operations.length; i++) {
        const prevOp = getOperationById(config.operations[i - 1].operationId);
        const currOp = getOperationById(config.operations[i].operationId);
        
        if (prevOp && currOp && prevOp.outputType !== currOp.inputType && 
            currOp.inputType !== 'any' && prevOp.outputType !== 'any') {
          return {
            valid: false,
            error: `操作 "${prevOp.name}" 的输出类型 "${prevOp.outputType}" 与操作 "${currOp.name}" 的输入类型 "${currOp.inputType}" 不兼容`
          };
        }
      }
    }
    
    return { valid: true };
  }, [getOperationById]);
  
  return {
    // 数据
    operations,
    operationsByCategory,
    categories,
    configs,
    selectedConfig,
    history,
    transformResult,
    
    // 加载状态
    isLoadingOperations,
    isLoadingConfigs,
    isLoadingHistory,
    isCreating,
    isUpdating,
    isDeleting,
    isExecuting,
    
    // 错误状态
    operationsError,
    configsError,
    historyError,
    createError,
    updateError,
    deleteError,
    executeError,
    
    // 操作方法
    fetchOperations,
    fetchConfigs,
    createTransformationConfig,
    updateTransformationConfig,
    deleteTransformationConfig,
    selectConfig,
    runTransformation,
    getTransformationHistory,
    clearTransformResult,
    getOperationById,
    validateConfig
  };
};
