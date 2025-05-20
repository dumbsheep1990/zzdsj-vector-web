import { useState, useCallback, useMemo } from 'react';
import { ModifiedAssistant } from '../../components/modules/assistants';

// 定义筛选条件接口
export interface AssistantFilterOptions {
  searchText: string;
  capabilities: string[];
  sortBy: 'name' | 'capabilities' | null;
  sortDirection: 'asc' | 'desc';
}

/**
 * 助手筛选管理Hook
 * 
 * 管理助手列表的筛选、排序和搜索功能
 * 
 * @param assistants 完整的助手列表
 * @returns {object} 包含筛选状态和方法的对象
 */
export const useAssistantFilter = (assistants: ModifiedAssistant[]) => {
  // 初始化筛选选项
  const [filterOptions, setFilterOptions] = useState<AssistantFilterOptions>({
    searchText: '',
    capabilities: [],
    sortBy: null,
    sortDirection: 'asc'
  });
  
  // 更新搜索文本
  const setSearchText = useCallback((text: string) => {
    setFilterOptions(prev => ({ ...prev, searchText: text }));
  }, []);
  
  // 更新能力筛选
  const toggleCapabilityFilter = useCallback((capability: string) => {
    setFilterOptions(prev => {
      const isSelected = prev.capabilities.includes(capability);
      return {
        ...prev,
        capabilities: isSelected
          ? prev.capabilities.filter(c => c !== capability)
          : [...prev.capabilities, capability]
      };
    });
  }, []);
  
  // 清除所有能力筛选
  const clearCapabilityFilters = useCallback(() => {
    setFilterOptions(prev => ({ ...prev, capabilities: [] }));
  }, []);
  
  // 设置排序方式
  const setSorting = useCallback((sortBy: 'name' | 'capabilities' | null) => {
    setFilterOptions(prev => {
      // 如果点击了当前排序字段，切换排序方向
      if (prev.sortBy === sortBy) {
        return { ...prev, sortDirection: prev.sortDirection === 'asc' ? 'desc' : 'asc' };
      }
      // 否则，设置新的排序字段，并默认为升序
      return { ...prev, sortBy, sortDirection: 'asc' };
    });
  }, []);
  
  // 重置所有筛选选项
  const resetFilters = useCallback(() => {
    setFilterOptions({
      searchText: '',
      capabilities: [],
      sortBy: null,
      sortDirection: 'asc'
    });
  }, []);
  
  // 提取所有可用的能力标签
  const availableCapabilities = useMemo(() => {
    const capabilitiesSet = new Set<string>();
    
    assistants.forEach(assistant => {
      assistant.capabilities?.forEach(capability => {
        capabilitiesSet.add(capability);
      });
    });
    
    return Array.from(capabilitiesSet).sort();
  }, [assistants]);
  
  // 应用筛选和排序逻辑，返回过滤后的列表
  const filteredAssistants = useMemo(() => {
    const { searchText, capabilities, sortBy, sortDirection } = filterOptions;
    
    // 首先应用搜索文本和能力筛选
    const result = assistants.filter(assistant => {
      // 搜索文本匹配
      const matchesSearch = !searchText || 
        assistant.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (assistant.description && assistant.description.toLowerCase().includes(searchText.toLowerCase()));
        
      // 能力筛选匹配
      const matchesCapabilities = capabilities.length === 0 || 
        capabilities.every(cap => assistant.capabilities?.includes(cap));
        
      return matchesSearch && matchesCapabilities;
    });
    
    // 然后应用排序
    if (sortBy) {
      result.sort((a, b) => {
        let comparison = 0;
        
        if (sortBy === 'name') {
          comparison = a.name.localeCompare(b.name);
        } else if (sortBy === 'capabilities') {
          // 按能力数量排序
          const aCapCount = a.capabilities?.length || 0;
          const bCapCount = b.capabilities?.length || 0;
          comparison = aCapCount - bCapCount;
        }
        
        // 应用排序方向
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }
    
    return result;
  }, [assistants, filterOptions]);
  
  return {
    // 筛选状态
    filterOptions,
    availableCapabilities,
    filteredAssistants,
    
    // 筛选操作方法
    setSearchText,
    toggleCapabilityFilter,
    clearCapabilityFilters,
    setSorting,
    resetFilters
  };
};
