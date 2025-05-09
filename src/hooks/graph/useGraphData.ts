import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAPI } from '../common/useAPI';
import { useList } from '../common/useList';
import { message } from 'antd';

// 定义图节点类型
export interface GraphNode {
  id: string;
  label: string;
  type: string;
  properties: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// 定义节点创建参数
export interface CreateNodeParams {
  label: string;
  type: string;
  properties: Record<string, any>;
}

// 定义节点更新参数
export interface UpdateNodeParams {
  id: string;
  label?: string;
  type?: string;
  properties?: Record<string, any>;
}

// 定义节点筛选选项
export interface GraphNodeFilterOptions {
  searchQuery: string;
  nodeTypes: string[];
  dateRange?: [Date, Date];
  propertyFilters?: Record<string, any>;
}

// 模拟获取图节点数据的API函数
const fetchNodesAPI = async (): Promise<GraphNode[]> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 返回模拟数据
  return [
    {
      id: '1',
      label: '人物',
      type: 'Person',
      properties: { name: '张三', age: 30, occupation: '工程师' },
      createdAt: '2023-09-10T08:30:00Z',
      updatedAt: '2023-09-10T08:30:00Z'
    },
    {
      id: '2',
      label: '公司',
      type: 'Organization',
      properties: { name: '科技有限公司', industry: '信息技术', employees: 500 },
      createdAt: '2023-09-10T09:15:00Z',
      updatedAt: '2023-09-12T14:20:00Z'
    },
    {
      id: '3',
      label: '产品',
      type: 'Product',
      properties: { name: '智能助手', version: '1.0', price: 999 },
      createdAt: '2023-09-11T10:45:00Z',
      updatedAt: '2023-09-11T10:45:00Z'
    }
  ];
};

// 模拟创建节点的API函数
const createNodeAPI = async (params: CreateNodeParams): Promise<GraphNode> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const now = new Date().toISOString();
  
  // 返回创建的节点
  return {
    id: Math.random().toString(36).substring(2, 9),
    label: params.label,
    type: params.type,
    properties: params.properties,
    createdAt: now,
    updatedAt: now
  };
};

// 模拟更新节点的API函数
const updateNodeAPI = async (params: UpdateNodeParams): Promise<GraphNode> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 假设这里会返回更新后的节点
  return {
    id: params.id,
    label: params.label || '默认标签',
    type: params.type || '默认类型',
    properties: params.properties || {},
    createdAt: '2023-09-10T08:30:00Z',
    updatedAt: new Date().toISOString()
  };
};

// 模拟删除节点的API函数
const deleteNodeAPI = async (nodeId: string): Promise<boolean> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 假设删除成功
  return true;
};

/**
 * 图数据管理Hook
 * 
 * 负责图节点数据的加载、筛选、创建、更新和删除
 * 
 * @returns {object} 包含图节点数据和操作方法的对象
 */
export const useGraphData = () => {
  // 使用通用API hook处理数据获取
  const {
    data: nodesData,
    loading: isLoading,
    error: fetchError,
    execute: fetchNodes
  } = useAPI<void, GraphNode[]>(fetchNodesAPI);
  
  // 使用通用列表hook管理节点数据
  const {
    items: nodes,
    setItems: setNodes,
    addItem: addNode,
    updateItem: updateNodeInList,
    removeItem: removeNodeFromList,
    setSort,
    clearSort,
    addFilter,
    removeFilter,
    clearFilters
  } = useList<GraphNode>([]);
  
  // 节点选择状态
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  // 节点筛选选项
  const [filterOptions, setFilterOptions] = useState<GraphNodeFilterOptions>({
    searchQuery: '',
    nodeTypes: []
  });
  
  // 创建节点
  const {
    loading: isCreating,
    error: createError,
    execute: executeCreate
  } = useAPI(createNodeAPI);
  
  // 更新节点
  const {
    loading: isUpdating,
    error: updateError,
    execute: executeUpdate
  } = useAPI(updateNodeAPI);
  
  // 删除节点
  const {
    loading: isDeleting,
    error: deleteError,
    execute: executeDelete
  } = useAPI(deleteNodeAPI);
  
  // 初始加载数据
  useEffect(() => {
    fetchNodes();
  }, [fetchNodes]);
  
  // 当API数据更新时，更新列表
  useEffect(() => {
    if (nodesData) {
      setNodes(nodesData);
    }
  }, [nodesData, setNodes]);
  
  // 获取选中的节点
  const selectedNode = useMemo(() => 
    nodes.find(node => node.id === selectedNodeId) || null, 
    [nodes, selectedNodeId]
  );
  
  // 创建节点
  const createNode = useCallback(async (params: CreateNodeParams) => {
    try {
      const newNode = await executeCreate(params);
      addNode(newNode);
      message.success('节点创建成功');
      return newNode;
    } catch (error) {
      console.error('创建节点失败:', error);
      message.error('创建节点失败');
      return null;
    }
  }, [executeCreate, addNode]);
  
  // 更新节点
  const updateNode = useCallback(async (params: UpdateNodeParams) => {
    try {
      const updatedNode = await executeUpdate(params);
      updateNodeInList(
        node => node.id === params.id,
        {
          label: params.label,
          type: params.type,
          properties: params.properties,
          updatedAt: new Date().toISOString()
        }
      );
      message.success('节点更新成功');
      return updatedNode;
    } catch (error) {
      console.error('更新节点失败:', error);
      message.error('更新节点失败');
      return null;
    }
  }, [executeUpdate, updateNodeInList]);
  
  // 删除节点
  const deleteNode = useCallback(async (nodeId: string) => {
    try {
      const success = await executeDelete(nodeId);
      if (success) {
        removeNodeFromList(node => node.id === nodeId);
        
        // 如果删除的是当前选中的节点，取消选择
        if (nodeId === selectedNodeId) {
          setSelectedNodeId(null);
        }
        
        message.success('节点删除成功');
        return true;
      }
      message.error('节点删除失败');
      return false;
    } catch (error) {
      console.error('删除节点失败:', error);
      message.error('删除节点失败');
      return false;
    }
  }, [executeDelete, removeNodeFromList, selectedNodeId]);
  
  // 选择节点
  const selectNode = useCallback((nodeId: string | null) => {
    setSelectedNodeId(nodeId);
  }, []);
  
  // 设置搜索查询
  const setSearchQuery = useCallback((query: string) => {
    setFilterOptions(prev => ({
      ...prev,
      searchQuery: query
    }));
  }, []);
  
  // 设置节点类型筛选
  const setNodeTypeFilter = useCallback((nodeTypes: string[]) => {
    setFilterOptions(prev => ({
      ...prev,
      nodeTypes
    }));
  }, []);
  
  // 获取节点类型列表
  const nodeTypes = useMemo(() => {
    const types = new Set<string>();
    nodes.forEach(node => {
      if (node.type) {
        types.add(node.type);
      }
    });
    return Array.from(types);
  }, [nodes]);
  
  // 应用筛选获取节点列表
  const filteredNodes = useMemo(() => {
    const { searchQuery, nodeTypes } = filterOptions;
    
    return nodes.filter(node => {
      // 搜索查询匹配
      const matchesSearch = !searchQuery || 
        node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        JSON.stringify(node.properties).toLowerCase().includes(searchQuery.toLowerCase());
      
      // 节点类型匹配
      const matchesType = nodeTypes.length === 0 || nodeTypes.includes(node.type);
      
      return matchesSearch && matchesType;
    });
  }, [nodes, filterOptions]);
  
  // 刷新节点列表
  const refreshNodes = useCallback(() => {
    return fetchNodes();
  }, [fetchNodes]);
  
  return {
    // 数据
    nodes,
    filteredNodes,
    selectedNode,
    selectedNodeId,
    nodeTypes,
    
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
    
    // 节点操作
    createNode,
    updateNode,
    deleteNode,
    selectNode,
    
    // 筛选和查询
    setSearchQuery,
    setNodeTypeFilter,
    
    // 其他操作
    refreshNodes
  };
};
