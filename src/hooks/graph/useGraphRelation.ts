import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAPI } from '../common/useAPI';
import { useList } from '../common/useList';
import { message } from 'antd';
import { GraphNode } from './useGraphData';

// 定义图关系类型
export interface GraphRelation {
  id: string;
  type: string;
  sourceId: string;
  targetId: string;
  properties: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// 定义完整的图关系（带有节点信息）
export interface GraphRelationWithNodes extends GraphRelation {
  sourceNode: GraphNode;
  targetNode: GraphNode;
}

// 定义关系创建参数
export interface CreateRelationParams {
  type: string;
  sourceId: string;
  targetId: string;
  properties: Record<string, any>;
}

// 定义关系更新参数
export interface UpdateRelationParams {
  id: string;
  type?: string;
  properties?: Record<string, any>;
}

// 定义关系筛选选项
export interface GraphRelationFilterOptions {
  searchQuery: string;
  relationTypes: string[];
  nodeIds: string[];
  dateRange?: [Date, Date];
}

// 模拟获取图关系数据的API函数
const fetchRelationsAPI = async (): Promise<GraphRelation[]> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 返回模拟数据
  return [
    {
      id: 'r1',
      type: '就职于',
      sourceId: '1', // 张三
      targetId: '2', // 科技有限公司
      properties: { since: '2020-01-15', position: '高级工程师' },
      createdAt: '2023-09-10T10:00:00Z',
      updatedAt: '2023-09-10T10:00:00Z'
    },
    {
      id: 'r2',
      type: '开发',
      sourceId: '1', // 张三
      targetId: '3', // 智能助手
      properties: { role: '首席开发者', contribution: '核心架构' },
      createdAt: '2023-09-11T14:30:00Z',
      updatedAt: '2023-09-11T14:30:00Z'
    },
    {
      id: 'r3',
      type: '拥有',
      sourceId: '2', // 科技有限公司
      targetId: '3', // 智能助手
      properties: { ownership: '100%', investment: '1000万' },
      createdAt: '2023-09-12T09:15:00Z',
      updatedAt: '2023-09-12T15:45:00Z'
    }
  ];
};

// 模拟创建关系的API函数
const createRelationAPI = async (params: CreateRelationParams): Promise<GraphRelation> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const now = new Date().toISOString();
  
  // 返回创建的关系
  return {
    id: Math.random().toString(36).substring(2, 9),
    type: params.type,
    sourceId: params.sourceId,
    targetId: params.targetId,
    properties: params.properties,
    createdAt: now,
    updatedAt: now
  };
};

// 模拟更新关系的API函数
const updateRelationAPI = async (params: UpdateRelationParams): Promise<GraphRelation> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 假设这里会返回更新后的关系
  return {
    id: params.id,
    type: params.type || '默认关系',
    sourceId: '1', // 模拟
    targetId: '2', // 模拟
    properties: params.properties || {},
    createdAt: '2023-09-10T10:00:00Z',
    updatedAt: new Date().toISOString()
  };
};

// 模拟删除关系的API函数
const deleteRelationAPI = async (relationId: string): Promise<boolean> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 假设删除成功
  return true;
};

/**
 * 图关系管理Hook
 * 
 * 负责图节点间关系的加载、筛选、创建、更新和删除
 * 
 * @param nodes - 图节点数据
 * @returns {object} 包含图关系数据和操作方法的对象
 */
export const useGraphRelation = (nodes: GraphNode[]) => {
  // 使用通用API hook处理数据获取
  const {
    data: relationsData,
    loading: isLoading,
    error: fetchError,
    execute: fetchRelations
  } = useAPI<void, GraphRelation[]>(fetchRelationsAPI);
  
  // 使用通用列表hook管理关系数据
  const {
    items: relations,
    setItems: setRelations,
    addItem: addRelation,
    updateItem: updateRelationInList,
    removeItem: removeRelationFromList,
    setSort,
    clearSort,
    addFilter,
    removeFilter,
    clearFilters
  } = useList<GraphRelation>([]);
  
  // 关系选择状态
  const [selectedRelationId, setSelectedRelationId] = useState<string | null>(null);
  
  // 关系筛选选项
  const [filterOptions, setFilterOptions] = useState<GraphRelationFilterOptions>({
    searchQuery: '',
    relationTypes: [],
    nodeIds: []
  });
  
  // 创建关系
  const {
    loading: isCreating,
    error: createError,
    execute: executeCreate
  } = useAPI(createRelationAPI);
  
  // 更新关系
  const {
    loading: isUpdating,
    error: updateError,
    execute: executeUpdate
  } = useAPI(updateRelationAPI);
  
  // 删除关系
  const {
    loading: isDeleting,
    error: deleteError,
    execute: executeDelete
  } = useAPI(deleteRelationAPI);
  
  // 初始加载数据
  useEffect(() => {
    fetchRelations();
  }, [fetchRelations]);
  
  // 当API数据更新时，更新列表
  useEffect(() => {
    if (relationsData) {
      setRelations(relationsData);
    }
  }, [relationsData, setRelations]);
  
  // 获取选中的关系
  const selectedRelation = useMemo(() => 
    relations.find(relation => relation.id === selectedRelationId) || null, 
    [relations, selectedRelationId]
  );
  
  // 获取带有节点信息的完整关系列表
  const relationsWithNodes = useMemo<GraphRelationWithNodes[]>(() => {
    return relations.map(relation => {
      const sourceNode = nodes.find(node => node.id === relation.sourceId) || {
        id: relation.sourceId,
        label: '未知节点',
        type: '未知',
        properties: {},
        createdAt: '',
        updatedAt: ''
      };
      
      const targetNode = nodes.find(node => node.id === relation.targetId) || {
        id: relation.targetId,
        label: '未知节点',
        type: '未知',
        properties: {},
        createdAt: '',
        updatedAt: ''
      };
      
      return {
        ...relation,
        sourceNode,
        targetNode
      };
    });
  }, [relations, nodes]);
  
  // 创建关系
  const createRelation = useCallback(async (params: CreateRelationParams) => {
    try {
      const newRelation = await executeCreate(params);
      addRelation(newRelation);
      message.success('关系创建成功');
      return newRelation;
    } catch (error) {
      console.error('创建关系失败:', error);
      message.error('创建关系失败');
      return null;
    }
  }, [executeCreate, addRelation]);
  
  // 更新关系
  const updateRelation = useCallback(async (params: UpdateRelationParams) => {
    try {
      const updatedRelation = await executeUpdate(params);
      updateRelationInList(
        relation => relation.id === params.id,
        {
          type: params.type,
          properties: params.properties,
          updatedAt: new Date().toISOString()
        }
      );
      message.success('关系更新成功');
      return updatedRelation;
    } catch (error) {
      console.error('更新关系失败:', error);
      message.error('更新关系失败');
      return null;
    }
  }, [executeUpdate, updateRelationInList]);
  
  // 删除关系
  const deleteRelation = useCallback(async (relationId: string) => {
    try {
      const success = await executeDelete(relationId);
      if (success) {
        removeRelationFromList(relation => relation.id === relationId);
        
        // 如果删除的是当前选中的关系，取消选择
        if (relationId === selectedRelationId) {
          setSelectedRelationId(null);
        }
        
        message.success('关系删除成功');
        return true;
      }
      message.error('关系删除失败');
      return false;
    } catch (error) {
      console.error('删除关系失败:', error);
      message.error('删除关系失败');
      return false;
    }
  }, [executeDelete, removeRelationFromList, selectedRelationId]);
  
  // 选择关系
  const selectRelation = useCallback((relationId: string | null) => {
    setSelectedRelationId(relationId);
  }, []);
  
  // 设置搜索查询
  const setSearchQuery = useCallback((query: string) => {
    setFilterOptions(prev => ({
      ...prev,
      searchQuery: query
    }));
  }, []);
  
  // 设置关系类型筛选
  const setRelationTypeFilter = useCallback((relationTypes: string[]) => {
    setFilterOptions(prev => ({
      ...prev,
      relationTypes
    }));
  }, []);
  
  // 设置节点ID筛选
  const setNodeIdFilter = useCallback((nodeIds: string[]) => {
    setFilterOptions(prev => ({
      ...prev,
      nodeIds
    }));
  }, []);
  
  // 获取关系类型列表
  const relationTypes = useMemo(() => {
    const types = new Set<string>();
    relations.forEach(relation => {
      if (relation.type) {
        types.add(relation.type);
      }
    });
    return Array.from(types);
  }, [relations]);
  
  // 查找特定节点的所有关系
  const findRelationsByNode = useCallback((nodeId: string) => {
    return relations.filter(relation => 
      relation.sourceId === nodeId || relation.targetId === nodeId
    );
  }, [relations]);
  
  // 查找两个节点之间的所有关系
  const findRelationsBetweenNodes = useCallback((nodeId1: string, nodeId2: string) => {
    return relations.filter(relation => 
      (relation.sourceId === nodeId1 && relation.targetId === nodeId2) ||
      (relation.sourceId === nodeId2 && relation.targetId === nodeId1)
    );
  }, [relations]);
  
  // 应用筛选获取关系列表
  const filteredRelations = useMemo(() => {
    const { searchQuery, relationTypes, nodeIds } = filterOptions;
    
    return relations.filter(relation => {
      // 搜索查询匹配
      const matchesSearch = !searchQuery || 
        relation.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        JSON.stringify(relation.properties).toLowerCase().includes(searchQuery.toLowerCase());
      
      // 关系类型匹配
      const matchesType = relationTypes.length === 0 || relationTypes.includes(relation.type);
      
      // 节点ID匹配
      const matchesNode = nodeIds.length === 0 || 
        nodeIds.includes(relation.sourceId) || 
        nodeIds.includes(relation.targetId);
      
      return matchesSearch && matchesType && matchesNode;
    });
  }, [relations, filterOptions]);
  
  // 刷新关系列表
  const refreshRelations = useCallback(() => {
    return fetchRelations();
  }, [fetchRelations]);
  
  return {
    // 数据
    relations,
    relationsWithNodes,
    filteredRelations,
    selectedRelation,
    selectedRelationId,
    relationTypes,
    
    // 加载状态
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    
    // 错误状态
    fetchError,
    createError,
    updateError,
    deleteError,
    
    // 关系操作
    createRelation,
    updateRelation,
    deleteRelation,
    selectRelation,
    
    // 关系查询
    findRelationsByNode,
    findRelationsBetweenNodes,
    
    // 筛选和查询
    setSearchQuery,
    setRelationTypeFilter,
    setNodeIdFilter,
    
    // 其他操作
    refreshRelations
  };
};
