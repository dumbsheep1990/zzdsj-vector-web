import { useState, useEffect, useCallback } from 'react';
import { useAPI } from '../common/useAPI';
import { useList } from '../common/useList';
import { message } from 'antd';

// 定义问答助手接口
export interface QaAssistant {
  id: string;
  name: string;
  description: string;
  status: 'online' | 'offline' | 'training';
  questionCount: number;
  documentCount: number;
  config: {
    model: string;
    temperature: number;
    maxTokens: number;
  };
  type: 'qa' | 'chat' | 'custom';
  createTime: string;
  updateTime: string;
  capabilities: string[];
}

// 定义筛选参数接口
export interface QaAssistantFilter {
  status?: 'online' | 'offline' | 'training';
  type?: 'qa' | 'chat' | 'custom';
  searchText?: string;
}

// 模拟获取助手列表的API函数
const fetchQaAssistantsAPI = async (): Promise<QaAssistant[]> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // 返回模拟数据
  return [
    {
      id: 'qa-001',
      name: '通用问答助手',
      description: '能够回答各类基础常识问题',
      status: 'online',
      questionCount: 230,
      documentCount: 45,
      config: {
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 2048
      },
      type: 'qa',
      createTime: '2025-01-15T08:30:00Z',
      updateTime: '2025-04-30T14:22:33Z',
      capabilities: ['知识库检索', '问答对生成']
    },
    {
      id: 'qa-002',
      name: '技术支持助手',
      description: '专注于技术问题的解答',
      status: 'training',
      questionCount: 142,
      documentCount: 38,
      config: {
        model: 'gpt-4',
        temperature: 0.5,
        maxTokens: 4096
      },
      type: 'qa',
      createTime: '2025-02-08T10:15:00Z',
      updateTime: '2025-05-02T09:11:27Z',
      capabilities: ['代码解释', '故障排查', '文档生成']
    },
    {
      id: 'qa-003',
      name: '客服助手',
      description: '处理客户服务相关问题',
      status: 'offline',
      questionCount: 315,
      documentCount: 62,
      config: {
        model: 'gpt-3.5-turbo',
        temperature: 0.8,
        maxTokens: 2048
      },
      type: 'chat',
      createTime: '2025-01-22T14:45:00Z',
      updateTime: '2025-04-28T16:33:19Z',
      capabilities: ['问题分类', '情感分析', '用户引导']
    }
  ];
};

// 模拟创建新助手的API函数
const createQaAssistantAPI = async (data: Omit<QaAssistant, 'id' | 'createTime' | 'updateTime'>): Promise<QaAssistant> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 生成随机ID和时间戳
  const now = new Date().toISOString();
  const id = `qa-${Math.floor(Math.random() * 1000)}`;
  
  return {
    ...data,
    id,
    createTime: now,
    updateTime: now,
  };
};

// 模拟更新助手的API函数
const updateQaAssistantAPI = async (assistantId: string, data: Partial<QaAssistant>): Promise<QaAssistant> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 这里应返回完整的更新后对象，在实际实现中需要先获取完整对象再更新
  return {
    ...data,
    id: assistantId,
    updateTime: new Date().toISOString(),
  } as QaAssistant;
};

// 模拟删除助手的API函数
const deleteQaAssistantAPI = async (assistantId: string): Promise<boolean> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // 模拟成功删除
  return true;
};

/**
 * 问答助手管理Hook
 * 
 * 负责问答助手数据的加载、筛选、创建、更新和删除
 * 
 * @returns {object} 包含助手数据和操作方法的对象
 */
export const useQaAssistants = () => {
  // 使用通用API hook处理数据获取
  const {
    data: assistantsData,
    loading: isLoading,
    error: fetchError,
    execute: fetchAssistants
  } = useAPI(fetchQaAssistantsAPI);
  
  // 使用通用列表hook管理助手数据
  const {
    items: assistants,
    setItems: setAssistants,
    addItem: addAssistant,
    updateItem: updateAssistantInList,
    removeItem: removeAssistantFromList,
    setSort,
    clearSort,
    addFilter,
    removeFilter,
    clearFilters
  } = useList<QaAssistant>([]);
  
  // 选中的助手状态
  const [selectedAssistantId, setSelectedAssistantId] = useState<string | null>(null);
  
  // 创建、更新和删除操作的API hooks
  const {
    loading: isCreating,
    error: createError,
    execute: executeCreate
  } = useAPI(createQaAssistantAPI);
  
  const {
    loading: isUpdating,
    error: updateError,
    execute: executeUpdate
  } = useAPI((params: { id: string, data: Partial<QaAssistant> }) => 
    updateQaAssistantAPI(params.id, params.data)
  );
  
  const {
    loading: isDeleting,
    error: deleteError,
    execute: executeDelete
  } = useAPI(deleteQaAssistantAPI);
  
  // 组合错误信息
  const error = fetchError || createError || updateError || deleteError;
  
  // 初始加载数据
  useEffect(() => {
    fetchAssistants();
  }, [fetchAssistants]);
  
  // 当API数据更新时，更新列表
  useEffect(() => {
    if (assistantsData) {
      setAssistants(assistantsData);
      
      // 如果有助手但没有选择，默认选择第一个
      if (assistantsData.length > 0 && !selectedAssistantId) {
        setSelectedAssistantId(assistantsData[0].id);
      }
    }
  }, [assistantsData, setAssistants, selectedAssistantId]);
  
  // 获取选中的助手
  const selectedAssistant = assistants.find(a => a.id === selectedAssistantId) || null;
  
  // 选择助手
  const selectAssistant = useCallback((assistantId: string) => {
    setSelectedAssistantId(assistantId);
  }, []);
  
  // 创建新助手
  const createAssistant = useCallback(async (data: Omit<QaAssistant, 'id' | 'createTime' | 'updateTime'>) => {
    try {
      const newAssistant = await executeCreate(data);
      addAssistant(newAssistant);
      message.success('助手创建成功');
      return newAssistant;
    } catch (error) {
      console.error('创建助手失败:', error);
      message.error('创建助手失败，请重试');
      return null;
    }
  }, [executeCreate, addAssistant]);
  
  // 更新助手
  const updateAssistant = useCallback(async (
    assistantId: string, 
    data: Partial<QaAssistant>
  ) => {
    try {
      const updatedAssistant = await executeUpdate({ id: assistantId, data });
      updateAssistantInList(
        assistant => assistant.id === assistantId,
        updatedAssistant
      );
      message.success('助手更新成功');
      return updatedAssistant;
    } catch (error) {
      console.error('更新助手失败:', error);
      message.error('更新助手失败，请重试');
      return null;
    }
  }, [executeUpdate, updateAssistantInList]);
  
  // 删除助手
  const deleteAssistant = useCallback(async (assistantId: string) => {
    try {
      const success = await executeDelete(assistantId);
      if (success) {
        removeAssistantFromList(assistant => assistant.id === assistantId);
        
        // 如果删除的是当前选中的助手，重置选择
        if (selectedAssistantId === assistantId) {
          const remainingAssistants = assistants.filter(a => a.id !== assistantId);
          if (remainingAssistants.length > 0) {
            setSelectedAssistantId(remainingAssistants[0].id);
          } else {
            setSelectedAssistantId(null);
          }
        }
        
        message.success('助手删除成功');
        return true;
      }
      message.error('删除助手失败，请重试');
      return false;
    } catch (error) {
      console.error('删除助手失败:', error);
      message.error('删除助手失败，请重试');
      return false;
    }
  }, [executeDelete, removeAssistantFromList, selectedAssistantId, assistants]);
  
  // 刷新助手列表
  const refreshAssistants = useCallback(() => {
    return fetchAssistants();
  }, [fetchAssistants]);
  
  // 按类型筛选助手
  const filterByType = useCallback((type: 'qa' | 'chat' | 'custom' | null) => {
    if (type) {
      addFilter('type', type);
    } else {
      removeFilter('type');
    }
  }, [addFilter, removeFilter]);
  
  // 按状态筛选助手
  const filterByStatus = useCallback((status: 'online' | 'offline' | 'training' | null) => {
    if (status) {
      addFilter('status', status);
    } else {
      removeFilter('status');
    }
  }, [addFilter, removeFilter]);
  
  // 按名称或描述搜索助手
  const searchAssistants = useCallback((text: string) => {
    if (text) {
      // 这里使用一个特殊的筛选逻辑，搜索名称或描述
      const searchFilter = (assistant: QaAssistant) => {
        const lowerText = text.toLowerCase();
        return (
          assistant.name.toLowerCase().includes(lowerText) ||
          (assistant.description && assistant.description.toLowerCase().includes(lowerText))
        );
      };
      
      // 自定义筛选函数
      setAssistants(prevAssistants => {
        // 保存原始数据
        const originalData = assistantsData || prevAssistants;
        // 应用筛选
        return originalData.filter(searchFilter);
      });
    } else {
      // 重置为原始数据
      setAssistants(assistantsData || []);
    }
  }, [assistantsData, setAssistants]);
  
  return {
    // 数据
    assistants,
    selectedAssistant,
    selectedAssistantId,
    
    // 加载状态
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    
    // 助手选择
    selectAssistant,
    
    // 助手操作
    createAssistant,
    updateAssistant,
    deleteAssistant,
    refreshAssistants,
    
    // 筛选和排序
    filterByType,
    filterByStatus,
    searchAssistants,
    setSort,
    clearSort,
    clearFilters
  };
};
