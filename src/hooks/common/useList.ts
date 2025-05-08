import { useState, useCallback, useMemo } from 'react';

type SortDirection = 'asc' | 'desc';

interface SortOptions<T> {
  key: keyof T;
  direction: SortDirection;
}

interface FilterOptions<T> {
  key: keyof T;
  value: any;
}

/**
 * 列表管理Hook
 * 
 * 管理列表数据及操作，提供排序、筛选等通用功能
 * 
 * @param initialItems 初始列表项
 * @returns {object} 包含列表操作方法的对象
 */
export function useList<T extends object>(initialItems: T[] = []) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [sortOptions, setSortOptions] = useState<SortOptions<T> | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions<T>[]>([]);
  
  // 添加项目
  const addItem = useCallback((item: T) => {
    setItems(prev => [...prev, item]);
  }, []);
  
  // 添加多个项目
  const addItems = useCallback((newItems: T[]) => {
    setItems(prev => [...prev, ...newItems]);
  }, []);
  
  // 更新项目
  const updateItem = useCallback((predicate: (item: T) => boolean, updates: Partial<T>) => {
    setItems(prev => prev.map(item => predicate(item) ? { ...item, ...updates } : item));
  }, []);
  
  // 删除项目
  const removeItem = useCallback((predicate: (item: T) => boolean) => {
    setItems(prev => prev.filter(item => !predicate(item)));
  }, []);
  
  // 设置排序
  const setSort = useCallback((key: keyof T, direction: SortDirection = 'asc') => {
    setSortOptions({ key, direction });
  }, []);
  
  // 清除排序
  const clearSort = useCallback(() => {
    setSortOptions(null);
  }, []);
  
  // 添加过滤条件
  const addFilter = useCallback((key: keyof T, value: any) => {
    setFilterOptions(prev => [...prev, { key, value }]);
  }, []);
  
  // 移除过滤条件
  const removeFilter = useCallback((key: keyof T) => {
    setFilterOptions(prev => prev.filter(filter => filter.key !== key));
  }, []);
  
  // 清除所有过滤条件
  const clearFilters = useCallback(() => {
    setFilterOptions([]);
  }, []);
  
  // 计算显示的项目（应用过滤和排序）
  const displayedItems = useMemo(() => {
    let result = [...items];
    
    // 应用过滤
    if (filterOptions.length > 0) {
      result = result.filter(item => 
        filterOptions.every(filter => {
          const itemValue = item[filter.key];
          return itemValue === filter.value || 
            (typeof itemValue === 'string' && 
             typeof filter.value === 'string' && 
             itemValue.toLowerCase().includes(filter.value.toLowerCase()));
        })
      );
    }
    
    // 应用排序
    if (sortOptions) {
      result.sort((a, b) => {
        const aValue = a[sortOptions.key];
        const bValue = b[sortOptions.key];
        
        if (aValue < bValue) return sortOptions.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOptions.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return result;
  }, [items, filterOptions, sortOptions]);
  
  return {
    items: displayedItems,
    totalItems: items.length,
    displayedCount: displayedItems.length,
    addItem,
    addItems,
    updateItem,
    removeItem,
    setSort,
    clearSort,
    addFilter,
    removeFilter,
    clearFilters,
    setItems
  };
}
