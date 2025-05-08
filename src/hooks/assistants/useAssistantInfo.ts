import { useState, useEffect } from 'react';
import { Assistant } from '../../utils/types';

// 模拟获取助手信息的函数
const fetchAssistantInfoAPI = async (assistantId: string): Promise<Assistant> => {
  // 模拟API请求
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    id: assistantId,
    name: `助手 ${assistantId.substring(0, 4)}`,
    avatar: '',
    description: '高级AI助手',
    status: 'online'
  };
};

/**
 * 助手信息管理Hook
 * 
 * 管理助手信息的加载和状态
 * 
 * @param assistantId 助手ID
 * @returns {object} 包含助手信息和加载状态的对象
 */
export const useAssistantInfo = (assistantId: string | undefined) => {
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!assistantId) return;

    const loadAssistantInfo = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const assistantInfo = await fetchAssistantInfoAPI(assistantId);
        setAssistant(assistantInfo);
      } catch (err) {
        console.error('获取助手信息失败:', err);
        setError(err instanceof Error ? err : new Error('获取助手信息失败'));
      } finally {
        setLoading(false);
      }
    };

    loadAssistantInfo();
  }, [assistantId]);

  // 刷新助手信息
  const refreshAssistantInfo = async () => {
    if (!assistantId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const assistantInfo = await fetchAssistantInfoAPI(assistantId);
      setAssistant(assistantInfo);
    } catch (err) {
      console.error('刷新助手信息失败:', err);
      setError(err instanceof Error ? err : new Error('刷新助手信息失败'));
    } finally {
      setLoading(false);
    }
  };

  return {
    assistant,
    loading,
    error,
    refreshAssistantInfo
  };
};
