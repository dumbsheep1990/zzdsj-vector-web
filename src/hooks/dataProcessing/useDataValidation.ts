import { useState, useCallback, useMemo } from 'react';
import { useAPI } from '../common/useAPI';
import { message } from 'antd';

// 验证规则类型
export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  type: 'schema' | 'regex' | 'custom' | 'predefined';
  targetType: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'any';
  config: {
    schema?: Record<string, any>; // 用于schema类型验证
    pattern?: string;            // 用于regex类型验证
    function?: string;           // 用于custom类型验证的函数代码
    predefinedRule?: string;     // 用于predefined类型验证
    options?: Record<string, any>; // 配置选项
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isBuiltIn: boolean;
  category: string;
  tags: string[];
}

// 验证集类型
export interface ValidationSet {
  id: string;
  name: string;
  description: string;
  rules: Array<{
    ruleId: string;
    priority: number;
    config?: Record<string, any>; // 覆盖规则默认配置
  }>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// 验证结果类型
export interface ValidationResult {
  valid: boolean;
  errors: Array<{
    path: string;
    rule: string;
    message: string;
    level: 'error' | 'warning';
  }>;
  warnings: Array<{
    path: string;
    rule: string;
    message: string;
  }>;
  details?: Record<string, any>;
  timestamp: string;
  duration: number;
}

// 创建验证规则参数
export interface CreateRuleParams {
  name: string;
  description: string;
  type: 'schema' | 'regex' | 'custom' | 'predefined';
  targetType: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'any';
  config: {
    schema?: Record<string, any>; 
    pattern?: string;          
    function?: string;         
    predefinedRule?: string;    
    options?: Record<string, any>;
  };
  category: string;
  tags: string[];
}

// 更新验证规则参数
export interface UpdateRuleParams {
  id: string;
  name?: string;
  description?: string;
  config?: Partial<{
    schema?: Record<string, any>; 
    pattern?: string;          
    function?: string;         
    predefinedRule?: string;    
    options?: Record<string, any>;
  }>;
  category?: string;
  tags?: string[];
}

// 创建验证集参数
export interface CreateValidationSetParams {
  name: string;
  description: string;
  rules: Array<{
    ruleId: string;
    priority: number;
    config?: Record<string, any>;
  }>;
}

// 更新验证集参数
export interface UpdateValidationSetParams {
  id: string;
  name?: string;
  description?: string;
  rules?: Array<{
    ruleId: string;
    priority: number;
    config?: Record<string, any>;
  }>;
  isActive?: boolean;
}

// 执行验证参数
export interface ValidateDataParams {
  data: any;
  validationSetId?: string; // 验证集ID，如果提供则使用验证集中的规则
  rules?: Array<{
    ruleId: string;
    priority: number;
    config?: Record<string, any>;
  }>;  // 单独的规则列表，如果不提供验证集ID则使用这个
}

// 模拟获取验证规则API
const fetchValidationRulesAPI = async (): Promise<ValidationRule[]> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 返回模拟数据
  return [
    {
      id: 'rule1',
      name: '非空字符串',
      description: '验证字符串是否非空',
      type: 'predefined',
      targetType: 'string',
      config: {
        predefinedRule: 'notEmpty',
        options: {
          trim: true
        }
      },
      createdBy: '系统',
      createdAt: '2023-07-10T08:00:00Z',
      updatedAt: '2023-07-10T08:00:00Z',
      isBuiltIn: true,
      category: '基础验证',
      tags: ['字符串', '必填']
    },
    {
      id: 'rule2',
      name: '邮箱格式',
      description: '验证是否为有效的电子邮箱格式',
      type: 'regex',
      targetType: 'string',
      config: {
        pattern: '^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$',
        options: {
          ignoreCase: true
        }
      },
      createdBy: '系统',
      createdAt: '2023-07-15T10:30:00Z',
      updatedAt: '2023-07-15T10:30:00Z',
      isBuiltIn: true,
      category: '格式验证',
      tags: ['字符串', '邮箱', '格式']
    },
    {
      id: 'rule3',
      name: '用户信息模式',
      description: '验证用户信息对象的结构',
      type: 'schema',
      targetType: 'object',
      config: {
        schema: {
          type: 'object',
          required: ['username', 'email'],
          properties: {
            username: { type: 'string', minLength: 3 },
            email: { type: 'string', format: 'email' },
            age: { type: 'number', minimum: 0 }
          }
        }
      },
      createdBy: '系统',
      createdAt: '2023-08-20T16:45:00Z',
      updatedAt: '2023-08-20T16:45:00Z',
      isBuiltIn: true,
      category: '对象验证',
      tags: ['对象', '用户', '模式']
    },
    {
      id: 'rule4',
      name: '数字范围',
      description: '验证数字是否在指定范围内',
      type: 'predefined',
      targetType: 'number',
      config: {
        predefinedRule: 'range',
        options: {
          min: 0,
          max: 100,
          inclusive: true
        }
      },
      createdBy: '系统',
      createdAt: '2023-09-05T14:20:00Z',
      updatedAt: '2023-09-05T14:20:00Z',
      isBuiltIn: true,
      category: '数值验证',
      tags: ['数字', '范围']
    },
    {
      id: 'rule5',
      name: '自定义数据验证',
      description: '使用自定义函数验证数据',
      type: 'custom',
      targetType: 'any',
      config: {
        function: 'function validate(data) { return data && typeof data === "object" && Object.keys(data).length > 0; }',
        options: {
          errorMessage: '数据必须是非空对象'
        }
      },
      createdBy: '用户1',
      createdAt: '2023-09-10T09:15:00Z',
      updatedAt: '2023-09-10T09:15:00Z',
      isBuiltIn: false,
      category: '自定义验证',
      tags: ['自定义', '对象']
    }
  ];
};

// 模拟获取验证集API
const fetchValidationSetsAPI = async (): Promise<ValidationSet[]> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 返回模拟数据
  return [
    {
      id: 'vset1',
      name: '用户表单验证',
      description: '验证用户提交的表单数据',
      rules: [
        {
          ruleId: 'rule1',
          priority: 1
        },
        {
          ruleId: 'rule2',
          priority: 2
        },
        {
          ruleId: 'rule3',
          priority: 3
        }
      ],
      createdBy: '系统',
      createdAt: '2023-08-15T11:20:00Z',
      updatedAt: '2023-08-15T11:20:00Z',
      isActive: true
    },
    {
      id: 'vset2',
      name: '产品数据验证',
      description: '验证产品数据格式和有效性',
      rules: [
        {
          ruleId: 'rule1',
          priority: 1,
          config: {
            options: {
              trim: false
            }
          }
        },
        {
          ruleId: 'rule4',
          priority: 2,
          config: {
            options: {
              min: 1,
              max: 9999
            }
          }
        },
        {
          ruleId: 'rule5',
          priority: 3
        }
      ],
      createdBy: '用户1',
      createdAt: '2023-09-20T15:45:00Z',
      updatedAt: '2023-09-22T10:30:00Z',
      isActive: true
    }
  ];
};

// 模拟创建验证规则API
const createValidationRuleAPI = async (params: CreateRuleParams): Promise<ValidationRule> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const now = new Date().toISOString();
  
  // 返回创建的规则
  return {
    id: Math.random().toString(36).substring(2, 9),
    ...params,
    createdBy: '当前用户',
    createdAt: now,
    updatedAt: now,
    isBuiltIn: false
  };
};

// 模拟更新验证规则API
const updateValidationRuleAPI = async (params: UpdateRuleParams): Promise<ValidationRule> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 假设这里会返回更新后的规则
  return {
    id: params.id,
    name: params.name || '默认规则',
    description: params.description || '默认描述',
    type: 'schema',
    targetType: 'object',
    config: {
      schema: params.config?.schema,
      pattern: params.config?.pattern,
      function: params.config?.function,
      predefinedRule: params.config?.predefinedRule,
      options: params.config?.options
    },
    createdBy: '当前用户',
    createdAt: '2023-08-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
    isBuiltIn: false,
    category: params.category || '未分类',
    tags: params.tags || []
  };
};

// 模拟删除验证规则API
const deleteValidationRuleAPI = async (ruleId: string): Promise<boolean> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 假设删除成功
  return true;
};

// 模拟创建验证集API
const createValidationSetAPI = async (params: CreateValidationSetParams): Promise<ValidationSet> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const now = new Date().toISOString();
  
  // 返回创建的验证集
  return {
    id: Math.random().toString(36).substring(2, 9),
    ...params,
    createdBy: '当前用户',
    createdAt: now,
    updatedAt: now,
    isActive: true
  };
};

// 模拟更新验证集API
const updateValidationSetAPI = async (params: UpdateValidationSetParams): Promise<ValidationSet> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 假设这里会返回更新后的验证集
  return {
    id: params.id,
    name: params.name || '默认验证集',
    description: params.description || '默认描述',
    rules: params.rules || [],
    createdBy: '当前用户',
    createdAt: '2023-08-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
    isActive: params.isActive !== undefined ? params.isActive : true
  };
};

// 模拟删除验证集API
const deleteValidationSetAPI = async (setId: string): Promise<boolean> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 假设删除成功
  return true;
};

// 模拟执行验证API
const validateDataAPI = async (params: ValidateDataParams): Promise<ValidationResult> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 随机模拟成功或失败
  const isFullyValid = Math.random() > 0.3;
  const hasWarnings = Math.random() > 0.5;
  
  // 创建随机验证结果
  const result: ValidationResult = {
    valid: isFullyValid,
    errors: [],
    warnings: [],
    details: {},
    timestamp: new Date().toISOString(),
    duration: Math.floor(Math.random() * 300)
  };
  
  // 如果不完全有效，添加一些错误
  if (!isFullyValid) {
    result.errors = [
      {
        path: 'email',
        rule: 'rule2',
        message: '电子邮箱格式无效',
        level: 'error'
      },
      {
        path: 'username',
        rule: 'rule1',
        message: '用户名不能为空',
        level: 'error'
      }
    ];
  }
  
  // 如果有警告，添加一些警告
  if (hasWarnings) {
    result.warnings = [
      {
        path: 'age',
        rule: 'rule4',
        message: '年龄值接近上限'
      }
    ];
  }
  
  // 添加详细信息
  result.details = {
    validatedFields: ['username', 'email', 'age'],
    rulesApplied: params.validationSetId ? 'validationSet' : 'explicitRules',
    validationSetId: params.validationSetId,
    schemaVersion: '1.0'
  };
  
  return result;
};

/**
 * 数据验证Hook
 * 
 * 负责管理数据验证规则、验证集和执行数据验证
 * 
 * @returns {object} 包含数据验证功能的对象
 */
export const useDataValidation = () => {
  // 验证规则列表
  const {
    data: rules,
    loading: isLoadingRules,
    error: rulesError,
    execute: fetchRules
  } = useAPI<void, ValidationRule[]>(fetchValidationRulesAPI);
  
  // 验证集列表
  const {
    data: validationSets,
    loading: isLoadingSets,
    error: setsError,
    execute: fetchSets
  } = useAPI<void, ValidationSet[]>(fetchValidationSetsAPI);
  
  // 当前选中的规则和验证集
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);
  
  // 最近的验证结果
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  
  // 创建规则
  const {
    loading: isCreatingRule,
    error: createRuleError,
    execute: executeCreateRule
  } = useAPI(createValidationRuleAPI);
  
  // 更新规则
  const {
    loading: isUpdatingRule,
    error: updateRuleError,
    execute: executeUpdateRule
  } = useAPI(updateValidationRuleAPI);
  
  // 删除规则
  const {
    loading: isDeletingRule,
    error: deleteRuleError,
    execute: executeDeleteRule
  } = useAPI(deleteValidationRuleAPI);
  
  // 创建验证集
  const {
    loading: isCreatingSet,
    error: createSetError,
    execute: executeCreateSet
  } = useAPI(createValidationSetAPI);
  
  // 更新验证集
  const {
    loading: isUpdatingSet,
    error: updateSetError,
    execute: executeUpdateSet
  } = useAPI(updateValidationSetAPI);
  
  // 删除验证集
  const {
    loading: isDeletingSet,
    error: deleteSetError,
    execute: executeDeleteSet
  } = useAPI(deleteValidationSetAPI);
  
  // 执行验证
  const {
    loading: isValidating,
    error: validateError,
    execute: executeValidate
  } = useAPI(validateDataAPI);
  
  // 获取选中的规则
  const selectedRule = useMemo(() => 
    rules?.find(rule => rule.id === selectedRuleId) || null, 
    [rules, selectedRuleId]
  );
  
  // 获取选中的验证集
  const selectedSet = useMemo(() => 
    validationSets?.find(set => set.id === selectedSetId) || null, 
    [validationSets, selectedSetId]
  );
  
  // 按类别分组规则
  const rulesByCategory = useMemo(() => {
    if (!rules) return {};
    
    const result: Record<string, ValidationRule[]> = {};
    
    rules.forEach(rule => {
      if (!result[rule.category]) {
        result[rule.category] = [];
      }
      result[rule.category].push(rule);
    });
    
    return result;
  }, [rules]);
  
  // 获取所有规则类别
  const categories = useMemo(() => 
    rules ? Array.from(new Set(rules.map(rule => rule.category))) : [],
    [rules]
  );
  
  // 获取所有标签
  const tags = useMemo(() => {
    if (!rules) return [];
    
    const tagSet = new Set<string>();
    rules.forEach(rule => {
      rule.tags.forEach(tag => tagSet.add(tag));
    });
    
    return Array.from(tagSet);
  }, [rules]);
  
  // 创建验证规则
  const createRule = useCallback(async (params: CreateRuleParams) => {
    try {
      const newRule = await executeCreateRule(params);
      message.success('验证规则创建成功');
      // 刷新规则列表
      fetchRules();
      return newRule;
    } catch (error) {
      console.error('创建验证规则失败:', error);
      message.error('创建验证规则失败');
      return null;
    }
  }, [executeCreateRule, fetchRules]);
  
  // 更新验证规则
  const updateRule = useCallback(async (params: UpdateRuleParams) => {
    try {
      const updatedRule = await executeUpdateRule(params);
      message.success('验证规则更新成功');
      // 刷新规则列表
      fetchRules();
      return updatedRule;
    } catch (error) {
      console.error('更新验证规则失败:', error);
      message.error('更新验证规则失败');
      return null;
    }
  }, [executeUpdateRule, fetchRules]);
  
  // 删除验证规则
  const deleteRule = useCallback(async (ruleId: string) => {
    try {
      const success = await executeDeleteRule(ruleId);
      if (success) {
        // 如果删除的是当前选中的规则，取消选择
        if (ruleId === selectedRuleId) {
          setSelectedRuleId(null);
        }
        
        message.success('验证规则删除成功');
        // 刷新规则列表
        fetchRules();
        return true;
      }
      message.error('验证规则删除失败');
      return false;
    } catch (error) {
      console.error('删除验证规则失败:', error);
      message.error('删除验证规则失败');
      return false;
    }
  }, [executeDeleteRule, selectedRuleId, fetchRules]);
  
  // 创建验证集
  const createValidationSet = useCallback(async (params: CreateValidationSetParams) => {
    try {
      const newSet = await executeCreateSet(params);
      message.success('验证集创建成功');
      // 刷新验证集列表
      fetchSets();
      return newSet;
    } catch (error) {
      console.error('创建验证集失败:', error);
      message.error('创建验证集失败');
      return null;
    }
  }, [executeCreateSet, fetchSets]);
  
  // 更新验证集
  const updateValidationSet = useCallback(async (params: UpdateValidationSetParams) => {
    try {
      const updatedSet = await executeUpdateSet(params);
      message.success('验证集更新成功');
      // 刷新验证集列表
      fetchSets();
      return updatedSet;
    } catch (error) {
      console.error('更新验证集失败:', error);
      message.error('更新验证集失败');
      return null;
    }
  }, [executeUpdateSet, fetchSets]);
  
  // 删除验证集
  const deleteValidationSet = useCallback(async (setId: string) => {
    try {
      const success = await executeDeleteSet(setId);
      if (success) {
        // 如果删除的是当前选中的验证集，取消选择
        if (setId === selectedSetId) {
          setSelectedSetId(null);
        }
        
        message.success('验证集删除成功');
        // 刷新验证集列表
        fetchSets();
        return true;
      }
      message.error('验证集删除失败');
      return false;
    } catch (error) {
      console.error('删除验证集失败:', error);
      message.error('删除验证集失败');
      return false;
    }
  }, [executeDeleteSet, selectedSetId, fetchSets]);
  
  // 执行数据验证
  const validateData = useCallback(async (data: any, validationSetId?: string, explicitRules?: Array<{ ruleId: string; priority: number; config?: Record<string, any> }>) => {
    try {
      // 构建验证参数
      const validateParams: ValidateDataParams = {
        data,
        validationSetId,
        rules: explicitRules
      };
      
      const result = await executeValidate(validateParams);
      setValidationResult(result);
      
      if (result.valid) {
        message.success('数据验证通过');
      } else {
        message.error(`数据验证失败: 发现 ${result.errors.length} 个错误`);
      }
      
      return result;
    } catch (error) {
      console.error('执行数据验证失败:', error);
      message.error(`执行数据验证失败: ${error instanceof Error ? error.message : '未知错误'}`);
      return null;
    }
  }, [executeValidate]);
  
  // 选择规则
  const selectRule = useCallback((ruleId: string | null) => {
    setSelectedRuleId(ruleId);
  }, []);
  
  // 选择验证集
  const selectValidationSet = useCallback((setId: string | null) => {
    setSelectedSetId(setId);
  }, []);
  
  // 清除验证结果
  const clearValidationResult = useCallback(() => {
    setValidationResult(null);
  }, []);
  
  // 根据ID获取规则
  const getRuleById = useCallback((ruleId: string) => {
    return rules?.find(rule => rule.id === ruleId) || null;
  }, [rules]);
  
  // 验证集中是否包含规则
  const setContainsRule = useCallback((setId: string, ruleId: string) => {
    const set = validationSets?.find(s => s.id === setId);
    return set ? set.rules.some(r => r.ruleId === ruleId) : false;
  }, [validationSets]);
  
  // 验证集是否有效
  const isValidationSetValid = useCallback((set: Partial<ValidationSet>) => {
    // 验证集必须包含至少一个规则
    if (!set.rules || set.rules.length === 0) {
      return { valid: false, error: '验证集必须包含至少一个规则' };
    }
    
    // 检查规则ID是否有效
    for (const ruleRef of set.rules) {
      const rule = getRuleById(ruleRef.ruleId);
      if (!rule) {
        return { valid: false, error: `ID为"${ruleRef.ruleId}"的规则不存在` };
      }
    }
    
    return { valid: true };
  }, [getRuleById]);
  
  // 获取验证错误详情
  const getValidationErrorDetails = useCallback((result: ValidationResult) => {
    if (!result || !result.errors || result.errors.length === 0) {
      return '数据验证通过，没有错误';
    }
    
    return result.errors.map(error => {
      const rule = rules?.find(r => error.rule === r.id);
      return `${error.path}: ${error.message} (规则: ${rule?.name || error.rule})`;
    }).join('\n');
  }, [rules]);
  
  return {
    // 数据
    rules,
    rulesByCategory,
    categories,
    tags,
    validationSets,
    selectedRule,
    selectedSet,
    validationResult,
    
    // 加载状态
    isLoadingRules,
    isLoadingSets,
    isCreatingRule,
    isUpdatingRule,
    isDeletingRule,
    isCreatingSet,
    isUpdatingSet,
    isDeletingSet,
    isValidating,
    
    // 错误状态
    rulesError,
    setsError,
    createRuleError,
    updateRuleError,
    deleteRuleError,
    createSetError,
    updateSetError,
    deleteSetError,
    validateError,
    
    // 操作方法
    fetchRules,
    fetchSets,
    createRule,
    updateRule,
    deleteRule,
    createValidationSet,
    updateValidationSet,
    deleteValidationSet,
    validateData,
    selectRule,
    selectValidationSet,
    clearValidationResult,
    getRuleById,
    setContainsRule,
    isValidationSetValid,
    getValidationErrorDetails
  };
};
