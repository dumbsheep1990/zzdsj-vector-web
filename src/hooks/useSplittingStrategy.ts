import { useState, useEffect } from 'react';
import { message } from 'antd';
import { knowledgeServiceApi, SplittingStrategyRequest, SplittingStrategyResponse } from '../utils/api/knowledge';

interface UseSplittingStrategyResult {
  strategies: SplittingStrategyResponse[];
  systemStrategies: SplittingStrategyResponse[];
  customStrategies: SplittingStrategyResponse[];
  loading: boolean;
  error: string | null;
  createStrategy: (strategy: SplittingStrategyRequest) => Promise<boolean>;
  updateStrategy: (id: string, strategy: Partial<SplittingStrategyRequest>) => Promise<boolean>;
  deleteStrategy: (id: string) => Promise<boolean>;
  copyStrategy: (id: string, newName?: string) => Promise<boolean>;
  testStrategy: (id: string, content: string) => Promise<any>;
  refreshStrategies: () => Promise<void>;
}

export const useSplittingStrategy = (): UseSplittingStrategyResult => {
  const [strategies, setStrategies] = useState<SplittingStrategyResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取策略列表
  const loadStrategies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await knowledgeServiceApi.getSplittingStrategies({ type: 'all' });
      if (result.success) {
        setStrategies(result.data || []);
      } else {
        setError(result.message || '获取策略列表失败');
      }
    } catch (err: any) {
      setError(err.message || '网络错误');
      console.error('Failed to load splitting strategies:', err);
    } finally {
      setLoading(false);
    }
  };

  // 创建策略
  const createStrategy = async (strategy: SplittingStrategyRequest): Promise<boolean> => {
    try {
      const result = await knowledgeServiceApi.createSplittingStrategy(strategy);
      if (result.success) {
        await loadStrategies(); // 重新加载列表
        message.success('策略创建成功');
        return true;
      } else {
        message.error(result.message || '创建失败');
        return false;
      }
    } catch (err: any) {
      message.error(err.message || '创建失败');
      return false;
    }
  };

  // 更新策略
  const updateStrategy = async (id: string, strategy: Partial<SplittingStrategyRequest>): Promise<boolean> => {
    try {
      const result = await knowledgeServiceApi.updateSplittingStrategy(id, strategy);
      if (result.success) {
        await loadStrategies(); // 重新加载列表
        message.success('策略更新成功');
        return true;
      } else {
        message.error(result.message || '更新失败');
        return false;
      }
    } catch (err: any) {
      message.error(err.message || '更新失败');
      return false;
    }
  };

  // 删除策略
  const deleteStrategy = async (id: string): Promise<boolean> => {
    try {
      const result = await knowledgeServiceApi.deleteSplittingStrategy(id);
      if (result.success) {
        await loadStrategies(); // 重新加载列表
        message.success('策略删除成功');
        return true;
      } else {
        message.error(result.message || '删除失败');
        return false;
      }
    } catch (err: any) {
      message.error(err.message || '删除失败');
      return false;
    }
  };

  // 复制策略
  const copyStrategy = async (id: string, newName?: string): Promise<boolean> => {
    try {
      const result = await knowledgeServiceApi.copySplittingStrategy(id, newName);
      if (result.success) {
        await loadStrategies(); // 重新加载列表
        message.success('策略复制成功');
        return true;
      } else {
        message.error(result.message || '复制失败');
        return false;
      }
    } catch (err: any) {
      message.error(err.message || '复制失败');
      return false;
    }
  };

  // 测试策略
  const testStrategy = async (id: string, content: string): Promise<any> => {
    try {
      const result = await knowledgeServiceApi.testSplittingStrategy(id, content);
      if (result.success) {
        return result.data;
      } else {
        message.error(result.message || '测试失败');
        return null;
      }
    } catch (err: any) {
      message.error(err.message || '测试失败');
      return null;
    }
  };

  // 刷新策略列表
  const refreshStrategies = async () => {
    await loadStrategies();
  };

  // 初始化加载
  useEffect(() => {
    loadStrategies();
  }, []);

  // 计算衍生数据
  const systemStrategies = strategies.filter(s => s.type === 'system');
  const customStrategies = strategies.filter(s => s.type === 'custom');

  return {
    strategies,
    systemStrategies,
    customStrategies,
    loading,
    error,
    createStrategy,
    updateStrategy,
    deleteStrategy,
    copyStrategy,
    testStrategy,
    refreshStrategies
  };
}; 