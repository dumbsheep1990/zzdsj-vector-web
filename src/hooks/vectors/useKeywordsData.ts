import { useState, useEffect } from 'react';
import { KeywordItem } from '../../utils/types';
import { keywordsData as mockKeywordsData } from '../../utils/mockData';

/**
 * 关键词数据管理Hook
 * 
 * 管理关键词数据的加载、选择和CRUD操作
 * 
 * @returns {object} 包含关键词数据及操作方法的对象
 */
export const useKeywordsData = () => {
  const [keywordsData, setKeywordsData] = useState<KeywordItem[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<KeywordItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 加载数据
  const loadData = async () => {
    setIsLoading(true);
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1500));
      setKeywordsData(mockKeywordsData);
    } catch (error) {
      console.error('加载关键词数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadData();
  }, []);

  // 创建关键词
  const createKeyword = (newKeyword: Omit<KeywordItem, 'id'>) => {
    const keyword = {
      ...newKeyword,
      id: `keyword_${Date.now()}`
    } as KeywordItem;
    setKeywordsData(prev => [keyword, ...prev]);
    return keyword;
  };

  // 更新关键词
  const updateKeyword = (id: string, updates: Partial<KeywordItem>) => {
    setKeywordsData(prev => 
      prev.map(item => item.id === id ? { ...item, ...updates } : item)
    );
    
    if (selectedKeyword?.id === id) {
      setSelectedKeyword(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  // 删除关键词
  const deleteKeyword = (id: string) => {
    setKeywordsData(prev => prev.filter(item => item.id !== id));
    
    if (selectedKeyword?.id === id) {
      setSelectedKeyword(null);
    }
  };

  // 导入关键词
  const importKeywords = (keywords: KeywordItem[]) => {
    setKeywordsData(prev => [...keywords, ...prev]);
  };

  // 刷新数据
  const refreshData = () => {
    loadData();
  };

  return {
    keywordsData,
    selectedKeyword,
    isLoading,
    setSelectedKeyword,
    createKeyword,
    updateKeyword,
    deleteKeyword,
    importKeywords,
    refreshData
  };
};
