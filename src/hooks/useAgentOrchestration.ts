import { useState, useCallback, useEffect } from 'react';
import { AgentMetrics, AgentStatus, OrchestrationState } from '../types/agent-orchestration';

export const useAgentOrchestration = () => {
  const [state, setState] = useState<OrchestrationState>({
    isServiceReady: false,
    errors: []
  });

  // 检查服务状态
  const checkServiceHealth = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/health');
      const isReady = response.ok;
      
      setState(prev => ({
        ...prev,
        isServiceReady: isReady,
        lastUpdate: new Date().toISOString()
      }));
      
      return isReady;
    } catch (error) {
      console.error('Agent orchestration service not available:', error);
      setState(prev => ({
        ...prev,
        isServiceReady: false,
        errors: [...prev.errors.slice(-4), `连接失败: ${error instanceof Error ? error.message : '未知错误'}`]
      }));
      return false;
    }
  }, []);

  // 更新状态
  const updateStatus = useCallback((status: AgentStatus) => {
    setState(prev => ({
      ...prev,
      currentStatus: status,
      lastUpdate: new Date().toISOString()
    }));
  }, []);

  // 更新指标
  const updateMetrics = useCallback((metrics: AgentMetrics) => {
    setState(prev => ({
      ...prev,
      metrics,
      lastUpdate: new Date().toISOString()
    }));
    
    // 更新页面标题
    document.title = `智能体编排 (${metrics.activeAgents}个活跃) - NextAgent`;
  }, []);

  // 更新路由
  const updateRoute = useCallback((route: string, title?: string) => {
    setState(prev => ({
      ...prev,
      currentRoute: route,
      lastUpdate: new Date().toISOString()
    }));
    
    if (title) {
      document.title = `${title} - 智能体编排 - NextAgent`;
    }
  }, []);

  // 添加错误
  const addError = useCallback((error: string) => {
    setState(prev => ({
      ...prev,
      errors: [...prev.errors.slice(-4), error],
      lastUpdate: new Date().toISOString()
    }));
  }, []);

  // 清除错误
  const clearErrors = useCallback(() => {
    setState(prev => ({
      ...prev,
      errors: [],
      lastUpdate: new Date().toISOString()
    }));
  }, []);

  // 定期健康检查
  useEffect(() => {
    checkServiceHealth();
    const interval = setInterval(checkServiceHealth, 5000);
    return () => clearInterval(interval);
  }, [checkServiceHealth]);

  return {
    ...state,
    updateStatus,
    updateMetrics,
    updateRoute,
    addError,
    clearErrors,
    checkServiceHealth
  };
};