import { useState } from 'react';
import { VectorItem, KeywordItem, SearchRecordItem } from '../../utils/types';

export type VectorModuleType = 'vectors' | 'keywords' | 'searchRecords';
export type VectorModuleItem = VectorItem | KeywordItem | SearchRecordItem;

/**
 * 向量模块管理Hook
 * 
 * 管理向量页面的模块切换状态，提供标题和描述信息
 * 
 * @returns {object} 包含模块状态及操作方法的对象
 */
export const useVectorModules = () => {
  const [activeModule, setActiveModule] = useState<VectorModuleType>('vectors');
  
  // 获取当前模块的标题
  const getModuleTitle = (): string => {
    switch (activeModule) {
      case 'vectors':
        return '向量数据库';
      case 'keywords':
        return '关键词管理';
      case 'searchRecords':
        return '搜索记录';
      default:
        return '';
    }
  };

  // 获取当前模块的描述
  const getModuleDescription = (): string => {
    switch (activeModule) {
      case 'vectors':
        return '管理向量数据库，支持向量数据的创建、导入和查看';
      case 'keywords':
        return '管理向量检索的关键词，提高检索精度和效率';
      case 'searchRecords':
        return '查看历史搜索记录，分析热门检索需求';
      default:
        return '';
    }
  };

  // 切换模块
  const switchModule = (module: VectorModuleType) => {
    setActiveModule(module);
  };

  return {
    activeModule,
    switchModule,
    getModuleTitle,
    getModuleDescription
  };
};
