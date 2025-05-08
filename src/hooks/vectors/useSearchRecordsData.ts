import { useState, useEffect } from 'react';
import { SearchRecordItem } from '../../utils/types';
import { searchRecordsData as mockSearchRecordsData } from '../../utils/mockData';

/**
 * 搜索记录数据管理Hook
 * 
 * 管理搜索记录数据的加载、选择和操作
 * 
 * @returns {object} 包含搜索记录数据及操作方法的对象
 */
export const useSearchRecordsData = () => {
  const [searchRecordsData, setSearchRecordsData] = useState<SearchRecordItem[]>([]);
  const [selectedSearchRecord, setSelectedSearchRecord] = useState<SearchRecordItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 加载数据
  const loadData = async () => {
    setIsLoading(true);
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSearchRecordsData(mockSearchRecordsData);
    } catch (error) {
      console.error('加载搜索记录数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadData();
  }, []);

  // 创建搜索记录
  const createSearchRecord = (newRecord: Omit<SearchRecordItem, 'id'>) => {
    const record = {
      ...newRecord,
      id: `record_${Date.now()}`
    } as SearchRecordItem;
    setSearchRecordsData(prev => [record, ...prev]);
    return record;
  };

  // 更新搜索记录
  const updateSearchRecord = (id: string, updates: Partial<SearchRecordItem>) => {
    setSearchRecordsData(prev => 
      prev.map(item => item.id === id ? { ...item, ...updates } : item)
    );
    
    if (selectedSearchRecord?.id === id) {
      setSelectedSearchRecord(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  // 删除搜索记录
  const deleteSearchRecord = (id: string) => {
    setSearchRecordsData(prev => prev.filter(item => item.id !== id));
    
    if (selectedSearchRecord?.id === id) {
      setSelectedSearchRecord(null);
    }
  };

  // 导出搜索记录
  const exportSearchRecords = () => {
    // 实际应用中这里会实现导出逻辑
    console.log('导出搜索记录', searchRecordsData);
    return searchRecordsData;
  };

  // 清空搜索记录
  const clearSearchRecords = () => {
    setSearchRecordsData([]);
    setSelectedSearchRecord(null);
  };

  // 刷新数据
  const refreshData = () => {
    loadData();
  };

  return {
    searchRecordsData,
    selectedSearchRecord,
    isLoading,
    setSelectedSearchRecord,
    createSearchRecord,
    updateSearchRecord,
    deleteSearchRecord,
    exportSearchRecords,
    clearSearchRecords,
    refreshData
  };
};
