import { useState, useCallback } from 'react';

interface APIOptions<R> {
  onSuccess?: (data: R) => void;
  onError?: (error: Error) => void;
  loadingDelay?: number;
}

/**
 * 通用API请求Hook
 * 
 * 封装API请求逻辑，处理加载状态、错误处理等通用逻辑
 * 
 * @param apiFunction API请求函数
 * @param options 配置选项
 * @returns {object} 包含数据、加载状态、错误信息和执行函数的对象
 */
export function useAPI<P, R>(
  apiFunction: (params: P) => Promise<R>,
  options: APIOptions<R> = {}
) {
  const [data, setData] = useState<R | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const { onSuccess, onError, loadingDelay = 0 } = options;

  const execute = useCallback(async (params: P) => {
    // 延迟显示loading状态，避免短时间内loading闪烁
    const loadingTimer = setTimeout(() => {
      setLoading(true);
    }, loadingDelay);
    
    setError(null);
    
    try {
      const result = await apiFunction(params);
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      clearTimeout(loadingTimer);
      setLoading(false);
    }
  }, [apiFunction, onSuccess, onError, loadingDelay]);

  return {
    data,
    loading,
    error,
    execute,
    reset: () => {
      setData(null);
      setError(null);
    }
  };
}
