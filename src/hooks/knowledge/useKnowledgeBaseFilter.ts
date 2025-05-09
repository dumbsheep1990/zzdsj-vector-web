import { useState, useMemo, useCallback } from 'react';
import { KnowledgeBaseItem } from '../../utils/types';
import { KnowledgeBaseCategory, KnowledgeBaseStatus } from './useKnowledgeBase';

// 定义筛选选项接口
export interface KnowledgeBaseFilterOptions {
  searchText: string;
  categories: KnowledgeBaseCategory[];
  status: KnowledgeBaseStatus[];
  tags: string[];
  sortBy: 'name' | 'lastUpdated' | 'fileCount' | 'vectorCount' | 'size';
  sortDirection: 'asc' | 'desc';
  hasMinimumVectorization?: number; // 最小向量化百分比
}

/**
 * 知识库筛选管理Hook
 * 
 * 提供知识库列表的筛选、排序和搜索功能
 * 
 * @param knowledgeBases 知识库列表数据
 * @returns {object} 包含筛选逻辑和筛选后数据的对象
 */
export const useKnowledgeBaseFilter = (knowledgeBases: KnowledgeBaseItem[]) => {
  // 初始化筛选参数
  const [filterOptions, setFilterOptions] = useState<KnowledgeBaseFilterOptions>({
    searchText: '',
    categories: [],
    status: [],
    tags: [],
    sortBy: 'lastUpdated',
    sortDirection: 'desc'
  });

  // 更新搜索文本
  const setSearchText = useCallback((text: string) => {
    setFilterOptions(prev => ({ ...prev, searchText: text }));
  }, []);

  // 切换分类筛选
  const toggleCategoryFilter = useCallback((category: KnowledgeBaseCategory) => {
    setFilterOptions(prev => {
      const categoryExists = prev.categories.includes(category);
      return {
        ...prev,
        categories: categoryExists
          ? prev.categories.filter(c => c !== category)
          : [...prev.categories, category]
      };
    });
  }, []);

  // 切换状态筛选
  const toggleStatusFilter = useCallback((status: KnowledgeBaseStatus) => {
    setFilterOptions(prev => {
      const statusExists = prev.status.includes(status);
      return {
        ...prev,
        status: statusExists
          ? prev.status.filter(s => s !== status)
          : [...prev.status, status]
      };
    });
  }, []);

  // 切换标签筛选
  const toggleTagFilter = useCallback((tag: string) => {
    setFilterOptions(prev => {
      const tagExists = prev.tags.includes(tag);
      return {
        ...prev,
        tags: tagExists
          ? prev.tags.filter(t => t !== tag)
          : [...prev.tags, tag]
      };
    });
  }, []);

  // 设置向量化百分比筛选
  const setMinVectorization = useCallback((percentage: number | undefined) => {
    setFilterOptions(prev => ({
      ...prev,
      hasMinimumVectorization: percentage
    }));
  }, []);

  // 设置排序
  const setSorting = useCallback((sortBy: KnowledgeBaseFilterOptions['sortBy']) => {
    setFilterOptions(prev => {
      // 如果点击了当前排序字段，切换排序方向
      if (prev.sortBy === sortBy) {
        return { ...prev, sortDirection: prev.sortDirection === 'asc' ? 'desc' : 'asc' };
      }
      // 否则，设置新的排序字段，并默认为降序
      return { ...prev, sortBy, sortDirection: 'desc' };
    });
  }, []);

  // 重置所有筛选选项
  const resetFilters = useCallback(() => {
    setFilterOptions({
      searchText: '',
      categories: [],
      status: [],
      tags: [],
      sortBy: 'lastUpdated',
      sortDirection: 'desc',
      hasMinimumVectorization: undefined
    });
  }, []);

  // 获取所有可用的分类
  const availableCategories = useMemo(() => {
    const categories = new Set<KnowledgeBaseCategory>();
    
    knowledgeBases.forEach(kb => {
      if (kb.category) {
        categories.add(kb.category as KnowledgeBaseCategory);
      }
    });
    
    return Array.from(categories).sort();
  }, [knowledgeBases]);

  // 获取所有可用的标签
  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    
    knowledgeBases.forEach(kb => {
      kb.tags?.forEach(tag => {
        tagsSet.add(tag);
      });
    });
    
    return Array.from(tagsSet).sort();
  }, [knowledgeBases]);

  // 应用筛选和排序，返回过滤后的列表
  const filteredKnowledgeBases = useMemo(() => {
    const {
      searchText,
      categories,
      status,
      tags,
      sortBy,
      sortDirection,
      hasMinimumVectorization
    } = filterOptions;

    // 首先应用所有筛选条件
    let result = knowledgeBases.filter(kb => {
      // 搜索文本匹配
      const matchesSearch = !searchText || 
        kb.name.toLowerCase().includes(searchText.toLowerCase()) ||
        kb.description.toLowerCase().includes(searchText.toLowerCase()) ||
        (kb.category && kb.category.toLowerCase().includes(searchText.toLowerCase())) ||
        kb.tags?.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));

      // 分类匹配
      const matchesCategory = categories.length === 0 || 
        (kb.category && categories.includes(kb.category as KnowledgeBaseCategory));

      // 状态匹配
      const matchesStatus = status.length === 0 || 
        (kb.status && status.includes(kb.status as KnowledgeBaseStatus));

      // 标签匹配 - 任何一个标签匹配即可
      const matchesTags = tags.length === 0 || 
        (kb.tags && kb.tags.some(tag => tags.includes(tag)));

      // 向量化百分比匹配
      const matchesVectorization = 
        hasMinimumVectorization === undefined || 
        (kb.vectorized !== undefined && kb.vectorized >= hasMinimumVectorization);

      return matchesSearch && matchesCategory && matchesStatus && matchesTags && matchesVectorization;
    });

    // 然后应用排序
    result.sort((a, b) => {
      let comparison = 0;

      // 根据排序字段比较
      switch (sortBy) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'lastUpdated':
          comparison = new Date(a.lastUpdated || 0).getTime() - new Date(b.lastUpdated || 0).getTime();
          break;
        case 'fileCount':
          comparison = (a.fileCount || 0) - (b.fileCount || 0);
          break;
        case 'vectorCount':
          comparison = (a.vectorCount || 0) - (b.vectorCount || 0);
          break;
        case 'size':
          // 将大小转换为数字进行比较
          const getSizeValue = (size: string | undefined) => {
            if (!size) return 0;
            const match = size.match(/(\d+(?:\.\d+)?)\s*([KMGT]?B)/i);
            if (!match) return 0;
            
            const value = parseFloat(match[1]);
            const unit = match[2].toUpperCase();
            
            const multipliers: {[key: string]: number} = {
              'B': 1,
              'KB': 1024,
              'MB': 1024 * 1024,
              'GB': 1024 * 1024 * 1024,
              'TB': 1024 * 1024 * 1024 * 1024
            };
            
            return value * (multipliers[unit] || 1);
          };
          
          comparison = getSizeValue(a.size) - getSizeValue(b.size);
          break;
      }

      // 应用排序方向
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [knowledgeBases, filterOptions]);

  // 获取常用标签（基于出现频率）
  const popularTags = useMemo(() => {
    const tagCounts: {[key: string]: number} = {};
    
    knowledgeBases.forEach(kb => {
      kb.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);
  }, [knowledgeBases]);

  // 按分类对知识库进行分组
  const knowledgeBasesByCategory = useMemo(() => {
    const grouped: {[key in KnowledgeBaseCategory]?: KnowledgeBaseItem[]} = {};
    
    knowledgeBases.forEach(kb => {
      if (kb.category) {
        const category = kb.category as KnowledgeBaseCategory;
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category]?.push(kb);
      }
    });
    
    return grouped;
  }, [knowledgeBases]);

  return {
    // 筛选状态
    filterOptions,
    filteredKnowledgeBases,
    availableCategories,
    availableTags,
    popularTags,
    knowledgeBasesByCategory,
    
    // 筛选操作方法
    setSearchText,
    toggleCategoryFilter,
    toggleStatusFilter,
    toggleTagFilter,
    setMinVectorization,
    setSorting,
    resetFilters
  };
};
