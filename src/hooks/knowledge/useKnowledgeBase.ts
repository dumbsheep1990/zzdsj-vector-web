import { useState, useEffect, useCallback } from 'react';
import { KnowledgeBaseItem } from '../../utils/types';
import { useAPI } from '../common/useAPI';
import { useList } from '../common/useList';
import { message } from 'antd';

// 定义知识库状态类型
export type KnowledgeBaseStatus = '活跃' | '维护中' | '未启用';

// 定义知识库类别类型
export type KnowledgeBaseCategory = '文档' | '法规标准' | '历史会议记录' | '数据分析' | '配置' | '其他';

// 定义知识库创建参数接口
export interface KnowledgeBaseCreateParams {
  name: string;
  description: string;
  category?: KnowledgeBaseCategory;
  tags?: string[];
}

// 定义知识库更新参数接口
export interface KnowledgeBaseUpdateParams {
  name?: string;
  description?: string;
  category?: KnowledgeBaseCategory;
  status?: KnowledgeBaseStatus;
  tags?: string[];
}

// 模拟获取知识库列表的API函数
const fetchKnowledgeBasesAPI = async (): Promise<KnowledgeBaseItem[]> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 返回模拟数据
  return [
    {
      id: 'kb-001',
      name: '产品文档库',
      description: '包含产品手册、技术规格和使用指南的知识库',
      fileCount: 128,
      vectorCount: 2458,
      lastUpdated: '2025-04-29T14:20:30Z',
      category: '文档',
      size: '1.2GB',
      status: '活跃',
      vectorized: 85,
      pendingFiles: 12,
      tags: ['产品', '文档', 'API'],
      recentKeywords: ['安装', '配置', '故障排除']
    },
    {
      id: 'kb-002',
      name: '法规标准库',
      description: '各类行业标准、政策法规和合规要求的知识库',
      fileCount: 76,
      vectorCount: 1832,
      lastUpdated: '2025-05-01T09:15:45Z',
      category: '法规标准',
      size: '890MB',
      status: '活跃',
      vectorized: 100,
      pendingFiles: 0,
      tags: ['法规', '合规', '标准'],
      recentKeywords: ['ISO', '认证', '合规性']
    },
    {
      id: 'kb-003',
      name: '历史会议记录',
      description: '公司内部会议记录、决策和讨论纪要的知识库',
      fileCount: 215,
      vectorCount: 3210,
      lastUpdated: '2025-05-02T16:30:00Z',
      category: '历史会议记录',
      size: '1.8GB',
      status: '维护中',
      vectorized: 65,
      pendingFiles: 32,
      tags: ['会议', '决策', '内部'],
      recentKeywords: ['项目', '计划', '进展']
    }
  ];
};

// 模拟创建知识库的API函数
const createKnowledgeBaseAPI = async (params: KnowledgeBaseCreateParams): Promise<KnowledgeBaseItem> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 生成一个随机ID
  const id = `kb-${Math.floor(Math.random() * 1000)}`;
  const now = new Date().toISOString();
  
  // 返回模拟创建的知识库
  return {
    id,
    name: params.name,
    description: params.description,
    fileCount: 0,
    vectorCount: 0,
    lastUpdated: now,
    category: params.category || '其他',
    size: '0KB',
    status: '活跃',
    vectorized: 0,
    pendingFiles: 0,
    tags: params.tags || [],
    recentKeywords: []
  };
};

// 模拟更新知识库的API函数
const updateKnowledgeBaseAPI = async (id: string, params: KnowledgeBaseUpdateParams): Promise<KnowledgeBaseItem> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // 此处应当返回完整更新后的知识库对象
  // 实际生产环境中需要从服务器获取更新后的完整对象
  return {
    id,
    name: params.name || `知识库 ${id}`,
    description: params.description || '知识库描述',
    fileCount: 0,
    vectorCount: 0,
    lastUpdated: new Date().toISOString(),
    category: params.category || '其他',
    size: '0KB',
    status: params.status || '活跃',
    vectorized: 0,
    pendingFiles: 0,
    tags: params.tags || [],
    recentKeywords: []
  };
};

// 模拟删除知识库的API函数
const deleteKnowledgeBaseAPI = async (_id: string): Promise<boolean> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // 返回模拟删除结果
  return true;
};

/**
 * 知识库管理Hook
 * 
 * 负责知识库数据的加载、创建、更新和删除
 * 
 * @returns {object} 包含知识库数据和操作方法的对象
 */
export const useKnowledgeBase = () => {
  // 使用通用API hook处理数据获取
  const {
    data: knowledgeBasesData,
    loading: isLoading,
    error: fetchError,
    execute: fetchKnowledgeBases
  } = useAPI<undefined, KnowledgeBaseItem[]>(fetchKnowledgeBasesAPI);
  
  // 使用通用列表hook管理知识库数据
  const {
    items: knowledgeBases,
    setItems: setKnowledgeBases,
    addItem: addKnowledgeBase,
    updateItem: updateKnowledgeBaseInList,
    removeItem: removeKnowledgeBaseFromList,
    setSort,
    clearSort
  } = useList<KnowledgeBaseItem>([]);
  
  // 当前选中的知识库
  const [selectedKnowledgeBaseId, setSelectedKnowledgeBaseId] = useState<string | null>(null);
  
  // CRUD操作的API hooks
  const {
    loading: isCreating,
    error: createError,
    execute: executeCreate
  } = useAPI(createKnowledgeBaseAPI);
  
  const {
    loading: isUpdating,
    error: updateError,
    execute: executeUpdate
  } = useAPI((params: { id: string, data: KnowledgeBaseUpdateParams }) => 
    updateKnowledgeBaseAPI(params.id, params.data)
  );
  
  const {
    loading: isDeleting,
    error: deleteError,
    execute: executeDelete
  } = useAPI(deleteKnowledgeBaseAPI);
  
  // 组合错误信息
  const error = fetchError || createError || updateError || deleteError;
  
  // 初始加载数据
  useEffect(() => {
    fetchKnowledgeBases(undefined);
  }, [fetchKnowledgeBases]);
  
  // 当API数据更新时，更新列表
  useEffect(() => {
    if (knowledgeBasesData) {
      setKnowledgeBases(knowledgeBasesData);
    }
  }, [knowledgeBasesData, setKnowledgeBases]);
  
  // 获取选中的知识库
  const selectedKnowledgeBase = knowledgeBases.find(kb => kb.id === selectedKnowledgeBaseId) || null;
  
  // 选择知识库
  const selectKnowledgeBase = useCallback((knowledgeBaseId: string | null) => {
    setSelectedKnowledgeBaseId(knowledgeBaseId);
  }, []);
  
  // 创建知识库
  const createKnowledgeBase = useCallback(async (params: KnowledgeBaseCreateParams) => {
    try {
      const newKnowledgeBase = await executeCreate(params);
      addKnowledgeBase(newKnowledgeBase);
      message.success('知识库创建成功');
      return newKnowledgeBase;
    } catch (error) {
      console.error('创建知识库失败:', error);
      message.error('创建知识库失败，请重试');
      return null;
    }
  }, [executeCreate, addKnowledgeBase]);
  
  // 更新知识库
  const updateKnowledgeBase = useCallback(async (
    knowledgeBaseId: string, 
    params: KnowledgeBaseUpdateParams
  ) => {
    try {
      const updatedKnowledgeBase = await executeUpdate({ id: knowledgeBaseId, data: params });
      updateKnowledgeBaseInList(
        kb => kb.id === knowledgeBaseId,
        updatedKnowledgeBase
      );
      message.success('知识库更新成功');
      return updatedKnowledgeBase;
    } catch (error) {
      console.error('更新知识库失败:', error);
      message.error('更新知识库失败，请重试');
      return null;
    }
  }, [executeUpdate, updateKnowledgeBaseInList]);
  
  // 删除知识库
  const deleteKnowledgeBase = useCallback(async (knowledgeBaseId: string) => {
    try {
      const success = await executeDelete(knowledgeBaseId);
      if (success) {
        removeKnowledgeBaseFromList(kb => kb.id === knowledgeBaseId);
        
        // 如果删除的是当前选中的知识库，重置选择
        if (selectedKnowledgeBaseId === knowledgeBaseId) {
          setSelectedKnowledgeBaseId(null);
        }
        
        message.success('知识库删除成功');
        return true;
      }
      message.error('删除知识库失败，请重试');
      return false;
    } catch (error) {
      console.error('删除知识库失败:', error);
      message.error('删除知识库失败，请重试');
      return false;
    }
  }, [executeDelete, removeKnowledgeBaseFromList, selectedKnowledgeBaseId]);
  
  // 切换知识库状态
  const toggleKnowledgeBaseStatus = useCallback(async (
    knowledgeBaseId: string,
    currentStatus: KnowledgeBaseStatus
  ) => {
    // 确定下一个状态
    let nextStatus: KnowledgeBaseStatus;
    switch (currentStatus) {
      case '活跃':
        nextStatus = '维护中';
        break;
      case '维护中':
        nextStatus = '未启用';
        break;
      case '未启用':
      default:
        nextStatus = '活跃';
        break;
    }
    
    // 更新知识库状态
    return updateKnowledgeBase(knowledgeBaseId, { status: nextStatus });
  }, [updateKnowledgeBase]);
  
  // 刷新知识库列表
  const refreshKnowledgeBases = useCallback(() => {
    return fetchKnowledgeBases(undefined);
  }, [fetchKnowledgeBases]);
  
  return {
    // 数据
    knowledgeBases,
    selectedKnowledgeBase,
    selectedKnowledgeBaseId,
    
    // 加载状态
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    
    // 知识库操作
    selectKnowledgeBase,
    createKnowledgeBase,
    updateKnowledgeBase,
    deleteKnowledgeBase,
    toggleKnowledgeBaseStatus,
    refreshKnowledgeBases,
    
    // 排序操作
    setSort,
    clearSort
  };
};
