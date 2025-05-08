import { useState, useEffect } from 'react';
import { QaDataset } from '../../utils/types';
import { mockDatasets } from '../../utils/mockQaData';

/**
 * 数据集数据管理Hook
 * 
 * 管理数据集数据的加载、选择和CRUD操作
 * 
 * @returns {object} 包含数据集数据及操作方法的对象
 */
export const useDatasetsData = () => {
  const [datasetsData, setDatasetsData] = useState<QaDataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<QaDataset | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 加载数据
  const loadData = async () => {
    setIsLoading(true);
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1500));
      setDatasetsData(mockDatasets);
    } catch (error) {
      console.error('加载数据集数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadData();
  }, []);

  // 创建数据集
  const createDataset = (name: string, description: string) => {
    const newDataset: QaDataset = {
      id: `dataset_${Date.now()}`,
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      questionCount: 0,
      qaPairs: []
    };
    
    setDatasetsData(prev => [newDataset, ...prev]);
    return newDataset;
  };

  // 更新数据集
  const updateDataset = (id: string, updates: Partial<QaDataset>) => {
    setDatasetsData(prev => 
      prev.map(item => item.id === id ? { ...item, ...updates, updatedAt: new Date() } : item)
    );
    
    if (selectedDataset?.id === id) {
      setSelectedDataset(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
    }
  };

  // 删除数据集
  const deleteDataset = (id: string) => {
    setDatasetsData(prev => prev.filter(item => item.id !== id));
    
    if (selectedDataset?.id === id) {
      setSelectedDataset(null);
    }
  };

  // 刷新数据
  const refreshData = () => {
    loadData();
  };

  return {
    datasetsData,
    selectedDataset,
    isLoading,
    setSelectedDataset,
    createDataset,
    updateDataset,
    deleteDataset,
    refreshData
  };
};
