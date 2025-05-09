import { useState, useEffect, useCallback } from 'react';
import { AssistantItem } from '../../utils/qaTypes';
import { useAPI } from '../common/useAPI';
import { useList } from '../common/useList';

// 模拟获取助手列表的API函数
const fetchAssistantsAPI = async (): Promise<AssistantItem[]> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 返回模拟数据
  return [
    {
      id: '1',
      name: '通用知识助手',
      description: '擅长回答各类基础知识问题',
      avatar: '/assets/assistant1.png',
      capabilities: ['知识问答', '信息检索']
    },
    {
      id: '2',
      name: '代码专家',
      description: '专注于编程和技术问题的解答',
      avatar: '/assets/assistant2.png',
      capabilities: ['代码生成', '编程讲解', '调试帮助']
    },
    {
      id: '3',
      name: '数据分析助手',
      description: '协助数据分析和可视化',
      avatar: '/assets/assistant3.png',
      capabilities: ['数据处理', '图表生成']
    }
  ];
};

// 模拟删除助手的API函数
const deleteAssistantAPI = async (id: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return true;
};

/**
 * 助手列表管理Hook
 * 
 * 管理助手列表数据的获取、过滤、排序等操作
 * 
 * @returns {object} 包含助手列表数据和操作方法的对象
 */
export const useAssistantsList = () => {
  // 使用通用API hook处理数据获取
  const {
    data: assistantsData,
    loading: isLoading,
    error: loadError,
    execute: fetchAssistants
  } = useAPI(fetchAssistantsAPI);

  // 使用通用列表hook管理助手列表
  const {
    items: assistants,
    setItems: setAssistants,
    addItem: addAssistant,
    updateItem: updateAssistant,
    removeItem: removeAssistantFromList,
    setSort,
    clearSort,
    addFilter,
    removeFilter,
    clearFilters
  } = useList<AssistantItem>([]);

  // 删除助手的API调用
  const {
    loading: isDeleting,
    error: deleteError,
    execute: executeDelete
  } = useAPI(deleteAssistantAPI);

  // 组合错误信息
  const error = loadError || deleteError;

  // 初始加载数据
  useEffect(() => {
    fetchAssistants();
  }, [fetchAssistants]);

  // 当API数据更新时，更新列表
  useEffect(() => {
    if (assistantsData) {
      setAssistants(assistantsData);
    }
  }, [assistantsData, setAssistants]);

  // 删除助手
  const deleteAssistant = useCallback(async (id: string) => {
    try {
      const success = await executeDelete(id);
      if (success) {
        removeAssistantFromList(assistant => assistant.id === id);
        return true;
      }
      return false;
    } catch (error) {
      console.error('删除助手失败:', error);
      return false;
    }
  }, [executeDelete, removeAssistantFromList]);

  // 刷新助手列表
  const refreshAssistants = useCallback(() => {
    return fetchAssistants();
  }, [fetchAssistants]);

  // 按名称搜索助手
  const searchByName = useCallback((name: string) => {
    if (name) {
      addFilter('name', name);
    } else {
      removeFilter('name');
    }
  }, [addFilter, removeFilter]);

  // 按能力筛选助手
  const filterByCapability = useCallback((capability: string) => {
    addFilter('capabilities', capability);
  }, [addFilter]);

  return {
    assistants,
    isLoading,
    isDeleting,
    error,
    refreshAssistants,
    deleteAssistant,
    searchByName,
    filterByCapability,
    setSort,
    clearSort,
    clearFilters
  };
};
