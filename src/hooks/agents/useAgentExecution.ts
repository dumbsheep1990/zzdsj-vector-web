import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAPI } from '../common/useAPI';
import { message } from 'antd';
import { AgentTool } from './useAgentTools';

// 定义执行参数类型
export interface ExecutionParams {
  toolId: string;
  parameters: Record<string, any>;
  context?: string;
}

// 定义执行结果类型
export interface ExecutionResult {
  id: string;
  toolId: string;
  toolName: string;
  status: 'success' | 'failure' | 'pending' | 'timeout';
  startTime: string;
  endTime?: string;
  duration?: number;
  parameters: Record<string, any>;
  result?: any;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  logs?: string[];
}

// 定义执行历史记录类型
export interface ExecutionHistoryItem extends ExecutionResult {
  context?: string;
  user: string;
}

// 模拟执行工具的API函数
const executeToolAPI = async (params: ExecutionParams): Promise<ExecutionResult> => {
  // 模拟网络请求延迟
  const delay = Math.floor(Math.random() * 2000) + 500;
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // 随机模拟成功或失败
  const success = Math.random() > 0.2;
  const now = new Date().toISOString();
  const startTime = now;
  const endTime = new Date(Date.now() + delay).toISOString();
  
  // 随机生成一些示例结果
  const sampleResults = [
    { temperature: 25, weather: '晴朗', humidity: '45%' },
    { results: ['结果1', '结果2', '结果3'], total: 3 },
    { answer: '这是一个示例回答', confidence: 0.92 },
    { data: { key1: 'value1', key2: 'value2' } }
  ];
  
  const sampleErrors = [
    { code: 'INVALID_PARAMS', message: '参数无效' },
    { code: 'SERVICE_UNAVAILABLE', message: '服务不可用' },
    { code: 'RATE_LIMIT_EXCEEDED', message: '超出调用频率限制' },
    { code: 'TIMEOUT', message: '请求超时' }
  ];
  
  if (success) {
    return {
      id: Math.random().toString(36).substring(2, 15),
      toolId: params.toolId,
      toolName: '示例工具', // 在实际应用中应该返回真实的工具名称
      status: 'success',
      startTime,
      endTime,
      duration: delay,
      parameters: params.parameters,
      result: sampleResults[Math.floor(Math.random() * sampleResults.length)],
      logs: ['开始执行工具', '处理输入参数', '调用外部API', '处理返回结果', '执行完成']
    };
  } else {
    const error = sampleErrors[Math.floor(Math.random() * sampleErrors.length)];
    return {
      id: Math.random().toString(36).substring(2, 15),
      toolId: params.toolId,
      toolName: '示例工具', // 在实际应用中应该返回真实的工具名称
      status: 'failure',
      startTime,
      endTime,
      duration: delay,
      parameters: params.parameters,
      error,
      logs: ['开始执行工具', '处理输入参数', '尝试调用外部API', `发生错误: ${error.message}`]
    };
  }
};

// 模拟获取执行历史的API函数
const fetchExecutionHistoryAPI = async (): Promise<ExecutionHistoryItem[]> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 返回模拟数据
  return [
    {
      id: '1',
      toolId: '1',
      toolName: '搜索引擎',
      status: 'success',
      startTime: '2023-09-20T15:30:00Z',
      endTime: '2023-09-20T15:30:02Z',
      duration: 2000,
      parameters: { query: '机器学习算法' },
      result: {
        results: [
          { title: '机器学习算法概述', url: 'https://example.com/1' },
          { title: '常见机器学习算法比较', url: 'https://example.com/2' }
        ],
        total: 2
      },
      context: '用户询问关于机器学习算法的信息',
      user: '张三',
      logs: ['开始执行搜索', '搜索完成', '返回2条结果']
    },
    {
      id: '2',
      toolId: '2',
      toolName: '天气查询',
      status: 'success',
      startTime: '2023-09-19T10:15:00Z',
      endTime: '2023-09-19T10:15:01Z',
      duration: 1000,
      parameters: { city: '北京' },
      result: {
        temperature: 22,
        weather: '多云',
        humidity: '65%',
        forecast: [
          { date: '2023-09-20', weather: '晴', temp: '20-28' },
          { date: '2023-09-21', weather: '雨', temp: '18-24' }
        ]
      },
      context: '用户询问北京天气',
      user: '李四',
      logs: ['查询北京天气', '获取预报数据', '返回天气信息']
    },
    {
      id: '3',
      toolId: '3',
      toolName: '代码执行器',
      status: 'failure',
      startTime: '2023-09-18T16:45:00Z',
      endTime: '2023-09-18T16:45:03Z',
      duration: 3000,
      parameters: { code: 'print("Hello, World!")\\n1/0' },
      error: {
        code: 'EXECUTION_ERROR',
        message: '执行代码时发生错误: 除以零',
        details: 'ZeroDivisionError: division by zero'
      },
      context: '用户请求执行Python代码',
      user: '张三',
      logs: ['准备执行环境', '执行代码', '发生错误: ZeroDivisionError']
    }
  ];
};

/**
 * 代理工具执行Hook
 * 
 * 负责代理工具的执行、结果管理和历史记录
 * 
 * @param availableTools 可用的代理工具列表
 * @returns {object} 包含工具执行功能和状态的对象
 */
export const useAgentExecution = (availableTools: AgentTool[] = []) => {
  // 执行结果状态
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  
  // 执行历史
  const [executionHistory, setExecutionHistory] = useState<ExecutionHistoryItem[]>([]);
  
  // 当前执行状态
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  
  // 使用通用API hook处理数据获取
  const {
    loading: isLoadingHistory,
    error: historyError,
    execute: executeHistoryFetch,
    data: historyData
  } = useAPI<void, ExecutionHistoryItem[]>(fetchExecutionHistoryAPI);
  
  // 工具执行API
  const {
    loading: isExecutingTool,
    error: executionError,
    execute: executeToolRequest
  } = useAPI(executeToolAPI);
  
  // 当历史数据加载完成时，更新状态
  useEffect(() => {
    if (historyData) {
      setExecutionHistory(historyData);
    }
  }, [historyData]);
  
  // 工具映射表，用于快速查找
  const toolsMap = useMemo(() => {
    const map = new Map<string, AgentTool>();
    availableTools.forEach(tool => {
      map.set(tool.id, tool);
    });
    return map;
  }, [availableTools]);
  
  // 执行工具
  const executeTool = useCallback(async (toolId: string, parameters: Record<string, any>, context?: string) => {
    const tool = toolsMap.get(toolId);
    
    if (!tool) {
      message.error('工具不存在');
      return null;
    }
    
    if (tool.status !== 'active') {
      message.error(`工具 ${tool.name} 当前不可用`);
      return null;
    }
    
    try {
      setIsExecuting(true);
      
      // 验证必填参数
      if (tool.config.parameters) {
        const missingParams = tool.config.parameters
          .filter(param => param.required && !parameters[param.name])
          .map(param => param.name);
        
        if (missingParams.length > 0) {
          message.error(`缺少必填参数: ${missingParams.join(', ')}`);
          setIsExecuting(false);
          return null;
        }
      }
      
      // 执行工具
      const result = await executeToolRequest({
        toolId,
        parameters,
        context
      });
      
      // 更新结果
      setExecutionResult(result);
      
      // 添加到历史记录
      const historyItem: ExecutionHistoryItem = {
        ...result,
        context,
        user: '当前用户' // 在实际应用中应取当前登录用户
      };
      
      setExecutionHistory(prev => [historyItem, ...prev]);
      
      // 显示结果通知
      if (result.status === 'success') {
        message.success(`工具 ${tool.name} 执行成功`);
      } else {
        message.error(`工具 ${tool.name} 执行失败: ${result.error?.message}`);
      }
      
      return result;
    } catch (error) {
      console.error('执行工具失败:', error);
      message.error('执行工具失败');
      return null;
    } finally {
      setIsExecuting(false);
    }
  }, [toolsMap, executeToolRequest]);
  
  // 加载执行历史
  const loadExecutionHistory = useCallback(async () => {
    try {
      const history = await executeHistoryFetch();
      return history;
    } catch (error) {
      console.error('加载执行历史失败:', error);
      message.error('加载执行历史失败');
      return null;
    }
  }, [executeHistoryFetch]);
  
  // 清除当前执行结果
  const clearExecutionResult = useCallback(() => {
    setExecutionResult(null);
  }, []);
  
  // 重新执行历史记录
  const reExecuteFromHistory = useCallback(async (historyItemId: string) => {
    const item = executionHistory.find(h => h.id === historyItemId);
    
    if (!item) {
      message.error('未找到历史记录');
      return null;
    }
    
    return executeTool(item.toolId, item.parameters, item.context);
  }, [executionHistory, executeTool]);
  
  // 格式化执行结果为可读文本（用于显示）
  const formatExecutionResult = useCallback((result: ExecutionResult | null): string => {
    if (!result) return '';
    
    try {
      if (result.status === 'success' && result.result) {
        return JSON.stringify(result.result, null, 2);
      } else if (result.error) {
        return `错误: ${result.error.message}\n${result.error.details || ''}`;
      } else {
        return '无结果数据';
      }
    } catch (e) {
      return '无法格式化结果';
    }
  }, []);
  
  // 获取工具参数定义
  const getToolParameters = useCallback((toolId: string) => {
    const tool = toolsMap.get(toolId);
    return tool?.config.parameters || [];
  }, [toolsMap]);
  
  // 获取参数默认值
  const getParameterDefaultValues = useCallback((toolId: string): Record<string, any> => {
    const params = getToolParameters(toolId);
    const defaults: Record<string, any> = {};
    
    params.forEach(param => {
      if (param.defaultValue !== undefined) {
        defaults[param.name] = param.defaultValue;
      }
    });
    
    return defaults;
  }, [getToolParameters]);
  
  // 验证参数
  const validateParameters = useCallback((toolId: string, parameters: Record<string, any>): { valid: boolean; errors: string[] } => {
    const params = getToolParameters(toolId);
    const errors: string[] = [];
    
    params.forEach(param => {
      if (param.required && (parameters[param.name] === undefined || parameters[param.name] === '')) {
        errors.push(`参数 "${param.name}" 不能为空`);
      }
    });
    
    return {
      valid: errors.length === 0,
      errors
    };
  }, [getToolParameters]);
  
  return {
    // 执行状态和结果
    executionResult,
    isExecuting: isExecuting || isExecutingTool,
    executionError,
    
    // 历史记录
    executionHistory,
    isLoadingHistory,
    historyError,
    
    // 执行操作
    executeTool,
    clearExecutionResult,
    reExecuteFromHistory,
    loadExecutionHistory,
    
    // 工具参数
    getToolParameters,
    getParameterDefaultValues,
    validateParameters,
    
    // 结果处理
    formatExecutionResult
  };
};
