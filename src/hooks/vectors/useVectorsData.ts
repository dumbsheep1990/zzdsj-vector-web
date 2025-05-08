import { useState, useEffect } from 'react';
import { VectorItem } from '../../utils/types';
import { vectorData as mockVectorData } from '../../utils/mockData';

/**
 * 向量数据管理Hook
 * 
 * 管理向量数据的加载、选择和CRUD操作
 * 
 * @returns {object} 包含向量数据及操作方法的对象
 */
export const useVectorsData = () => {
  const [vectorData, setVectorData] = useState<VectorItem[]>([]);
  const [selectedVector, setSelectedVector] = useState<VectorItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 加载数据
  const loadData = async () => {
    setIsLoading(true);
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1500));
      setVectorData(mockVectorData);
    } catch (error) {
      console.error('加载向量数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadData();
  }, []);

  // 创建新向量
  const createVector = (newVector: Omit<VectorItem, 'id'>) => {
    const vector = {
      ...newVector,
      id: `vector_${Date.now()}`
    } as VectorItem;
    setVectorData(prev => [vector, ...prev]);
    return vector;
  };

  // 更新向量
  const updateVector = (id: string, updates: Partial<VectorItem>) => {
    setVectorData(prev => 
      prev.map(item => item.id === id ? { ...item, ...updates } : item)
    );
    
    // 如果选中的向量被更新，也更新选中状态
    if (selectedVector?.id === id) {
      setSelectedVector(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  // 删除向量
  const deleteVector = (id: string) => {
    setVectorData(prev => prev.filter(item => item.id !== id));
    
    // 如果删除的是当前选中的向量，清除选中状态
    if (selectedVector?.id === id) {
      setSelectedVector(null);
    }
  };

  // 刷新数据
  const refreshData = () => {
    loadData();
  };

  return {
    vectorData,
    selectedVector,
    isLoading,
    setSelectedVector,
    createVector,
    updateVector,
    deleteVector,
    refreshData
  };
};
