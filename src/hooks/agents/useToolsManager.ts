import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAPI } from '../common/useAPI';
import { message } from 'antd';
import { AgentTool } from './useAgentTools';

// 定义工具集类型
export interface ToolSet {
  id: string;
  name: string;
  description: string;
  toolIds: string[];
  isDefault: boolean;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

// 定义工具导出类型
export interface ToolExport {
  id: string;
  exportedAt: string;
  tools: AgentTool[];
  format: 'json' | 'yaml';
  version: string;
}

// 定义工具导入参数
export interface ImportToolsParams {
  content: string;
  format: 'json' | 'yaml';
  overwriteExisting?: boolean;
}

// 定义权限类型
export interface ToolPermission {
  toolId: string;
  userId: string;
  role: 'owner' | 'editor' | 'user';
  createdAt: string;
  updatedAt: string;
}

// 模拟获取工具集的API函数
const fetchToolSetsAPI = async (): Promise<ToolSet[]> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // 返回模拟数据
  return [
    {
      id: '1',
      name: '基础工具集',
      description: '包含常用的基础工具',
      toolIds: ['1', '2'],
      isDefault: true,
      isPublic: true,
      createdBy: '系统',
      createdAt: '2023-07-01T10:00:00Z',
      updatedAt: '2023-07-01T10:00:00Z',
      usageCount: 254
    },
    {
      id: '2',
      name: '开发工具集',
      description: '为开发人员提供的工具集合',
      toolIds: ['3'],
      isDefault: false,
      isPublic: true,
      createdBy: '管理员',
      createdAt: '2023-08-15T14:30:00Z',
      updatedAt: '2023-09-10T11:45:00Z',
      usageCount: 78
    },
    {
      id: '3',
      name: '个人工具集',
      description: '用户自定义工具集',
      toolIds: ['2', '3'],
      isDefault: false,
      isPublic: false,
      createdBy: '当前用户',
      createdAt: '2023-09-05T09:20:00Z',
      updatedAt: '2023-09-05T09:20:00Z',
      usageCount: 12
    }
  ];
};

// 模拟创建工具集的API函数
const createToolSetAPI = async (params: { name: string; description: string; toolIds: string[]; isPublic: boolean }): Promise<ToolSet> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const now = new Date().toISOString();
  
  // 返回创建的工具集
  return {
    id: Math.random().toString(36).substring(2, 9),
    ...params,
    isDefault: false,
    createdBy: '当前用户',
    createdAt: now,
    updatedAt: now,
    usageCount: 0
  };
};

// 模拟更新工具集的API函数
const updateToolSetAPI = async (params: { id: string; name?: string; description?: string; toolIds?: string[]; isPublic?: boolean }): Promise<ToolSet> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 假设这里会返回更新后的工具集
  return {
    id: params.id,
    name: params.name || '默认工具集',
    description: params.description || '',
    toolIds: params.toolIds || [],
    isDefault: false,
    isPublic: params.isPublic !== undefined ? params.isPublic : true,
    createdBy: '当前用户',
    createdAt: '2023-08-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
    usageCount: 5
  };
};

// 模拟删除工具集的API函数
const deleteToolSetAPI = async (toolSetId: string): Promise<boolean> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 假设删除成功
  return true;
};

// 模拟导出工具的API函数
const exportToolsAPI = async (toolIds: string[], format: 'json' | 'yaml'): Promise<ToolExport> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // 返回导出结果
  return {
    id: Math.random().toString(36).substring(2, 15),
    exportedAt: new Date().toISOString(),
    tools: [], // 在实际应用中，这里应包含完整的工具配置
    format,
    version: '1.0'
  };
};

// 模拟导入工具的API函数
const importToolsAPI = async (params: ImportToolsParams): Promise<{ success: boolean; imported: number; failed: number; errors?: string[] }> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 随机模拟成功或部分成功
  const success = Math.random() > 0.3;
  const partial = Math.random() > 0.5;
  
  if (success && !partial) {
    return {
      success: true,
      imported: 3,
      failed: 0
    };
  } else if (success && partial) {
    return {
      success: true,
      imported: 2,
      failed: 1,
      errors: ['工具 "示例工具" 格式无效']
    };
  } else {
    return {
      success: false,
      imported: 0,
      failed: 3,
      errors: ['导入格式无效', '缺少必要字段']
    };
  }
};

// 模拟获取工具权限的API函数
const fetchToolPermissionsAPI = async (toolId: string): Promise<ToolPermission[]> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 返回模拟数据
  return [
    {
      toolId,
      userId: 'user1',
      role: 'owner',
      createdAt: '2023-08-15T10:00:00Z',
      updatedAt: '2023-08-15T10:00:00Z'
    },
    {
      toolId,
      userId: 'user2',
      role: 'editor',
      createdAt: '2023-09-01T14:30:00Z',
      updatedAt: '2023-09-01T14:30:00Z'
    },
    {
      toolId,
      userId: 'user3',
      role: 'user',
      createdAt: '2023-09-10T09:15:00Z',
      updatedAt: '2023-09-10T09:15:00Z'
    }
  ];
};

// 模拟更新工具权限的API函数
const updateToolPermissionAPI = async (params: { toolId: string; userId: string; role: 'owner' | 'editor' | 'user' }): Promise<boolean> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // 假设更新成功
  return true;
};

/**
 * 工具集管理Hook
 * 
 * 负责工具集管理、导入导出和权限控制
 * 
 * @param allTools 所有可用工具列表
 * @returns {object} 包含工具集管理功能和状态的对象
 */
export const useToolsManager = (allTools: AgentTool[] = []) => {
  // 工具集状态
  const [toolSets, setToolSets] = useState<ToolSet[]>([]);
  
  // 选中的工具集
  const [selectedToolSetId, setSelectedToolSetId] = useState<string | null>(null);
  
  // 工具权限
  const [toolPermissions, setToolPermissions] = useState<Record<string, ToolPermission[]>>({});
  
  // 获取工具集
  const {
    loading: isLoadingToolSets,
    error: toolSetsError,
    execute: fetchToolSets,
    data: toolSetsData
  } = useAPI<void, ToolSet[]>(fetchToolSetsAPI);
  
  // 创建工具集
  const {
    loading: isCreatingToolSet,
    error: createToolSetError,
    execute: executeCreateToolSet
  } = useAPI(createToolSetAPI);
  
  // 更新工具集
  const {
    loading: isUpdatingToolSet,
    error: updateToolSetError,
    execute: executeUpdateToolSet
  } = useAPI(updateToolSetAPI);
  
  // 删除工具集
  const {
    loading: isDeletingToolSet,
    error: deleteToolSetError,
    execute: executeDeleteToolSet
  } = useAPI(deleteToolSetAPI);
  
  // 创建适配器函数，将双参数函数适配为单参数函数
  const adaptedExportToolsAPI = (params: [string[], ('json' | 'yaml')]) => 
    exportToolsAPI(params[0], params[1]);

  // 导出工具
  const {
    loading: isExporting,
    error: exportError,
    execute: executeExport
  } = useAPI(adaptedExportToolsAPI);
  
  // 导入工具
  const {
    loading: isImporting,
    error: importError,
    execute: executeImport
  } = useAPI(importToolsAPI);
  
  // 获取工具权限
  const {
    loading: isLoadingPermissions,
    error: permissionsError,
    execute: executePermissionsFetch
  } = useAPI(fetchToolPermissionsAPI);
  
  // 更新工具权限
  const {
    loading: isUpdatingPermission,
    error: updatePermissionError,
    execute: executeUpdatePermission
  } = useAPI(updateToolPermissionAPI);
  
  // 当工具集数据加载完成时，更新状态
  useEffect(() => {
    if (toolSetsData) {
      setToolSets(toolSetsData);
    }
  }, [toolSetsData]);
  
  // 初始加载数据
  useEffect(() => {
    fetchToolSets();
  }, [fetchToolSets]);
  
  // 工具映射表，用于快速查找
  const toolsMap = useMemo(() => {
    const map = new Map<string, AgentTool>();
    allTools.forEach(tool => {
      map.set(tool.id, tool);
    });
    return map;
  }, [allTools]);
  
  // 获取选中的工具集
  const selectedToolSet = useMemo(() => 
    toolSets.find(set => set.id === selectedToolSetId) || null, 
    [toolSets, selectedToolSetId]
  );
  
  // 获取工具集中的工具
  const getToolsInSet = useCallback((toolSetId: string): AgentTool[] => {
    const toolSet = toolSets.find(set => set.id === toolSetId);
    if (!toolSet) return [];
    
    return toolSet.toolIds
      .map(id => toolsMap.get(id))
      .filter(Boolean) as AgentTool[];
  }, [toolSets, toolsMap]);
  
  // 获取选中工具集中的工具
  const selectedToolSetTools = useMemo(() => 
    selectedToolSetId ? getToolsInSet(selectedToolSetId) : [], 
    [selectedToolSetId, getToolsInSet]
  );
  
  // 创建工具集
  const createToolSet = useCallback(async (name: string, description: string, toolIds: string[], isPublic: boolean = true) => {
    try {
      const newToolSet = await executeCreateToolSet({
        name,
        description,
        toolIds,
        isPublic
      });
      
      setToolSets(prev => [...prev, newToolSet]);
      message.success('工具集创建成功');
      return newToolSet;
    } catch (error) {
      console.error('创建工具集失败:', error);
      message.error('创建工具集失败');
      return null;
    }
  }, [executeCreateToolSet]);
  
  // 更新工具集
  const updateToolSet = useCallback(async (
    toolSetId: string, 
    updates: { name?: string; description?: string; toolIds?: string[]; isPublic?: boolean }
  ) => {
    try {
      const updatedToolSet = await executeUpdateToolSet({
        id: toolSetId,
        ...updates
      });
      
      setToolSets(prev => 
        prev.map(set => set.id === toolSetId ? updatedToolSet : set)
      );
      
      message.success('工具集更新成功');
      return updatedToolSet;
    } catch (error) {
      console.error('更新工具集失败:', error);
      message.error('更新工具集失败');
      return null;
    }
  }, [executeUpdateToolSet]);
  
  // 删除工具集
  const deleteToolSet = useCallback(async (toolSetId: string) => {
    try {
      const success = await executeDeleteToolSet(toolSetId);
      
      if (success) {
        setToolSets(prev => prev.filter(set => set.id !== toolSetId));
        
        // 如果删除的是当前选中的工具集，取消选择
        if (toolSetId === selectedToolSetId) {
          setSelectedToolSetId(null);
        }
        
        message.success('工具集删除成功');
        return true;
      }
      
      message.error('工具集删除失败');
      return false;
    } catch (error) {
      console.error('删除工具集失败:', error);
      message.error('删除工具集失败');
      return false;
    }
  }, [executeDeleteToolSet, selectedToolSetId]);
  
  // 选择工具集
  const selectToolSet = useCallback((toolSetId: string | null) => {
    setSelectedToolSetId(toolSetId);
  }, []);
  
  // 导出工具
  const exportTools = useCallback(async (toolIds: string[], format: 'json' | 'yaml' = 'json') => {
    try {
      const exportResult = await executeExport([toolIds, format]);
      message.success('工具导出成功');
      
      // 在实际应用中，这里应该处理下载导出的文件
      return exportResult;
    } catch (error) {
      console.error('导出工具失败:', error);
      message.error('导出工具失败');
      return null;
    }
  }, [executeExport]);
  
  // 导出工具集
  const exportToolSet = useCallback(async (toolSetId: string, format: 'json' | 'yaml' = 'json') => {
    const toolSet = toolSets.find(set => set.id === toolSetId);
    if (!toolSet) {
      message.error('工具集不存在');
      return null;
    }
    
    return exportTools(toolSet.toolIds, format);
  }, [toolSets, exportTools]);
  
  // 导入工具
  const importTools = useCallback(async (content: string, format: 'json' | 'yaml' = 'json', overwriteExisting: boolean = false) => {
    try {
      const result = await executeImport({
        content,
        format,
        overwriteExisting
      });
      
      if (result.success) {
        if (result.failed > 0) {
          message.warning(`部分工具导入成功: 导入${result.imported}个，失败${result.failed}个`);
          if (result.errors) {
            console.warn('导入错误:', result.errors);
          }
        } else {
          message.success(`成功导入${result.imported}个工具`);
        }
        
        // 在实际应用中，这里应该刷新工具列表
        return result;
      } else {
        message.error('导入工具失败');
        if (result.errors) {
          console.error('导入错误:', result.errors);
        }
        return result;
      }
    } catch (error) {
      console.error('导入工具失败:', error);
      message.error('导入工具失败');
      return null;
    }
  }, [executeImport]);
  
  // 添加工具到工具集
  const addToolToSet = useCallback(async (toolId: string, toolSetId: string) => {
    const toolSet = toolSets.find(set => set.id === toolSetId);
    if (!toolSet) {
      message.error('工具集不存在');
      return false;
    }
    
    if (toolSet.toolIds.includes(toolId)) {
      message.info('工具已在工具集中');
      return true;
    }
    
    try {
      const updatedToolSet = await updateToolSet(toolSetId, {
        toolIds: [...toolSet.toolIds, toolId]
      });
      
      return !!updatedToolSet;
    } catch (error) {
      console.error('添加工具到工具集失败:', error);
      message.error('添加工具到工具集失败');
      return false;
    }
  }, [toolSets, updateToolSet]);
  
  // 从工具集中移除工具
  const removeToolFromSet = useCallback(async (toolId: string, toolSetId: string) => {
    const toolSet = toolSets.find(set => set.id === toolSetId);
    if (!toolSet) {
      message.error('工具集不存在');
      return false;
    }
    
    if (!toolSet.toolIds.includes(toolId)) {
      message.info('工具不在工具集中');
      return true;
    }
    
    try {
      const updatedToolSet = await updateToolSet(toolSetId, {
        toolIds: toolSet.toolIds.filter(id => id !== toolId)
      });
      
      return !!updatedToolSet;
    } catch (error) {
      console.error('从工具集中移除工具失败:', error);
      message.error('从工具集中移除工具失败');
      return false;
    }
  }, [toolSets, updateToolSet]);
  
  // 获取工具权限
  const getToolPermissions = useCallback(async (toolId: string) => {
    try {
      // 如果已经有缓存，直接返回
      if (toolPermissions[toolId]) {
        return toolPermissions[toolId];
      }
      
      const permissions = await executePermissionsFetch(toolId);
      
      // 更新权限缓存
      setToolPermissions(prev => ({
        ...prev,
        [toolId]: permissions
      }));
      
      return permissions;
    } catch (error) {
      console.error('获取工具权限失败:', error);
      message.error('获取工具权限失败');
      return [];
    }
  }, [toolPermissions, executePermissionsFetch]);
  
  // 更新工具权限
  const updateToolPermission = useCallback(async (toolId: string, userId: string, role: 'owner' | 'editor' | 'user') => {
    try {
      const success = await executeUpdatePermission({
        toolId,
        userId,
        role
      });
      
      if (success) {
        // 更新权限缓存
        setToolPermissions(prev => {
          const permissions = [...(prev[toolId] || [])];
          const index = permissions.findIndex(p => p.userId === userId);
          
          if (index >= 0) {
            // 更新现有权限
            permissions[index] = {
              ...permissions[index],
              role,
              updatedAt: new Date().toISOString()
            };
          } else {
            // 添加新权限
            permissions.push({
              toolId,
              userId,
              role,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          }
          
          return {
            ...prev,
            [toolId]: permissions
          };
        });
        
        message.success('工具权限更新成功');
        return true;
      }
      
      message.error('工具权限更新失败');
      return false;
    } catch (error) {
      console.error('更新工具权限失败:', error);
      message.error('更新工具权限失败');
      return false;
    }
  }, [executeUpdatePermission]);
  
  // 刷新工具集
  const refreshToolSets = useCallback(() => {
    return fetchToolSets();
  }, [fetchToolSets]);
  
  return {
    // 工具集数据
    toolSets,
    selectedToolSet,
    selectedToolSetId,
    selectedToolSetTools,
    
    // 加载状态
    isLoadingToolSets,
    isCreatingToolSet,
    isUpdatingToolSet,
    isDeletingToolSet,
    isExporting,
    isImporting,
    isLoadingPermissions,
    isUpdatingPermission,
    
    // 错误状态
    toolSetsError,
    createToolSetError,
    updateToolSetError,
    deleteToolSetError,
    exportError,
    importError,
    permissionsError,
    updatePermissionError,
    
    // 工具集操作
    createToolSet,
    updateToolSet,
    deleteToolSet,
    selectToolSet,
    getToolsInSet,
    addToolToSet,
    removeToolFromSet,
    
    // 导入导出
    exportTools,
    exportToolSet,
    importTools,
    
    // 权限管理
    getToolPermissions,
    updateToolPermission,
    
    // 其他操作
    refreshToolSets
  };
};
