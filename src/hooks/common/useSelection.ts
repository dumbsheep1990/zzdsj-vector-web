import { useState, useCallback } from 'react';

/**
 * 列表选择管理Hook
 * 
 * 管理列表选择状态，提供选择、取消选择等通用方法
 * 
 * @param initialSelection 初始选中项
 * @returns {object} 包含selected状态和select、deselect、isSelected方法的对象
 */
export function useSelection<T extends { id: string }>(initialSelection: T | null = null) {
  const [selected, setSelected] = useState<T | null>(initialSelection);
  
  const select = useCallback((item: T) => {
    setSelected(item);
  }, []);
  
  const deselect = useCallback(() => {
    setSelected(null);
  }, []);
  
  const isSelected = useCallback((id: string) => {
    return selected?.id === id;
  }, [selected]);
  
  return {
    selected,
    select,
    deselect,
    isSelected
  };
}
