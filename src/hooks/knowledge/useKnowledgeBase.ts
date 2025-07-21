import { useState, useEffect, useCallback } from 'react';
import { KnowledgeBaseItem } from '../../utils/types';
import { useAPI } from '../common/useAPI';
import { useList } from '../common/useList';
import { message } from 'antd';
import { knowledgeServiceApi, KnowledgeBaseCreateRequest, KnowledgeBaseUpdateRequest } from '../../utils/api/knowledge';

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
  // 添加后端需要的字段
  embedding_provider?: string;
  embedding_model?: string;
  embedding_dimension?: number;
  vector_store_type?: string;
  chunk_size?: number;
  chunk_overlap?: number;
  similarity_threshold?: number;
  enable_hybrid_search?: boolean;
  enable_agno_integration?: boolean;
  agno_search_type?: string;
  settings?: Record<string, any>;
}

// 定义知识库更新参数接口
export interface KnowledgeBaseUpdateParams {
  name?: string;
  description?: string;
  category?: KnowledgeBaseCategory;
  status?: KnowledgeBaseStatus;
  tags?: string[];
  similarity_threshold?: number;
  enable_hybrid_search?: boolean;
  enable_agno_integration?: boolean;
  settings?: Record<string, any>;
}

// 转换后端数据为前端需要的格式
const convertBackendToFrontend = (backendKb: any): KnowledgeBaseItem => {
  return {
    id: backendKb.id,
    name: backendKb.name,
    description: backendKb.description,
    fileCount: backendKb.document_count || 0,
    vectorCount: backendKb.vector_count || 0,
    lastUpdated: backendKb.updated_at || backendKb.created_at,
    category: '文档', // 默认分类
    size: backendKb.size || '0KB',
    status: backendKb.status === 'active' ? '活跃' : 
            backendKb.status === 'maintenance' ? '维护中' : '未启用',
    vectorized: backendKb.vectorized_percentage || 0,
    pendingFiles: backendKb.pending_documents || 0,
    tags: backendKb.tags || [],
    recentKeywords: backendKb.recent_keywords || []
  };
};

// 获取知识库列表的API函数
const fetchKnowledgeBasesAPI = async (): Promise<KnowledgeBaseItem[]> => {
  try {
    const response = await knowledgeServiceApi.getKnowledgeBases();
    
    if (response.success) {
      return response.data.knowledge_bases.map(convertBackendToFrontend);
    } else {
      throw new Error(response.message || '获取知识库列表失败');
    }
  } catch (error: any) {
    console.error('获取知识库列表失败:', error);
    throw error;
  }
};

// 创建知识库的API函数
const createKnowledgeBaseAPI = async (params: KnowledgeBaseCreateParams): Promise<KnowledgeBaseItem> => {
  try {
    // 将前端参数转换为后端需要的格式
    const createRequest: KnowledgeBaseCreateRequest = {
      name: params.name,
      description: params.description,
      embedding_provider: params.embedding_provider || 'siliconflow',
      embedding_model: params.embedding_model || 'Qwen/Qwen3-Embedding-8B',
      embedding_dimension: params.embedding_dimension || 8192,
      vector_store_type: params.vector_store_type || 'milvus',
      chunk_size: params.chunk_size || 1024,
      chunk_overlap: params.chunk_overlap || 128,
      similarity_threshold: params.similarity_threshold || 0.7,
      enable_hybrid_search: params.enable_hybrid_search ?? false,
      enable_agno_integration: params.enable_agno_integration ?? false,
      agno_search_type: params.agno_search_type || 'vector',
      settings: params.settings || {}
    };
    
    const response = await knowledgeServiceApi.createKnowledgeBase(createRequest);
    
    if (response.success) {
      // 转换后端返回的数据为前端需要的格式
      const newKb = convertBackendToFrontend(response.data);
      // 设置前端特有的属性
      newKb.category = params.category || '文档';
      newKb.tags = params.tags || [];
      
      return newKb;
    } else {
      throw new Error(response.message || '创建知识库失败');
    }
  } catch (error: any) {
    console.error('创建知识库失败:', error);
    throw error;
  }
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
