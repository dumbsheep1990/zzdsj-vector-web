import { useMemo, useCallback } from 'react';
import { KnowledgeBaseItem } from '../../utils/types';
import { KnowledgeBaseCategory } from './useKnowledgeBase';

// 定义常用文件类型
interface FileTypeDistribution {
  pdf: number;
  doc: number;
  txt: number;
  md: number;
  csv: number;
  xls: number;
  other: number;
}

// 定义统计数据接口
export interface KnowledgeBaseStats {
  totalKnowledgeBases: number;
  totalFiles: number;
  totalVectors: number;
  totalSize: string;
  averageVectorizationPercentage: number;
  categoryCounts: Record<string, number>;
  categoryFileDistribution: Record<string, number>;
  categoryVectorDistribution: Record<string, number>;
  statusDistribution: Record<string, number>;
  fileTypeDistribution: FileTypeDistribution;
  updatedOverTime: Array<{ date: string; count: number }>;
  vectorizationProgress: Array<{ id: string; name: string; percentage: number }>;
}

/**
 * 知识库统计数据Hook
 * 
 * 提供知识库数据的统计分析功能
 * 
 * @param knowledgeBases 知识库列表数据
 * @returns {object} 包含统计数据和分析方法的对象
 */
export const useKnowledgeBaseStats = (knowledgeBases: KnowledgeBaseItem[]) => {
  // 计算知识库的总体统计数据
  const stats = useMemo<KnowledgeBaseStats>(() => {
    // 基础计数
    const totalKnowledgeBases = knowledgeBases.length;
    const totalFiles = knowledgeBases.reduce((sum, kb) => sum + (kb.fileCount || 0), 0);
    const totalVectors = knowledgeBases.reduce((sum, kb) => sum + (kb.vectorCount || 0), 0);
    
    // 计算总大小并转换为人类可读格式
    const calculateTotalSize = () => {
      let totalBytes = 0;
      
      knowledgeBases.forEach(kb => {
        if (kb.size) {
          const match = kb.size.match(/(\d+(?:\.\d+)?)\s*([KMGT]?B)/i);
          if (match) {
            const value = parseFloat(match[1]);
            const unit = match[2].toUpperCase();
            
            const multipliers: {[key: string]: number} = {
              'B': 1,
              'KB': 1024,
              'MB': 1024 * 1024,
              'GB': 1024 * 1024 * 1024,
              'TB': 1024 * 1024 * 1024 * 1024
            };
            
            totalBytes += value * (multipliers[unit] || 1);
          }
        }
      });
      
      // 转换回人类可读格式
      const units = ['B', 'KB', 'MB', 'GB', 'TB'];
      let unitIndex = 0;
      let size = totalBytes;
      
      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }
      
      return `${size.toFixed(2)} ${units[unitIndex]}`;
    };
    
    const totalSize = calculateTotalSize();
    
    // 向量化百分比
    const vectorizationPercentages = knowledgeBases
      .filter(kb => kb.vectorized !== undefined)
      .map(kb => kb.vectorized || 0);
      
    const averageVectorizationPercentage = vectorizationPercentages.length
      ? vectorizationPercentages.reduce((sum, percentage) => sum + percentage, 0) / vectorizationPercentages.length
      : 0;
    
    // 分类统计
    const categoryCounts: Record<string, number> = {};
    const categoryFileDistribution: Record<string, number> = {};
    const categoryVectorDistribution: Record<string, number> = {};
    
    knowledgeBases.forEach(kb => {
      const category = kb.category || '未分类';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      categoryFileDistribution[category] = (categoryFileDistribution[category] || 0) + (kb.fileCount || 0);
      categoryVectorDistribution[category] = (categoryVectorDistribution[category] || 0) + (kb.vectorCount || 0);
    });
    
    // 状态分布
    const statusDistribution: Record<string, number> = {};
    
    knowledgeBases.forEach(kb => {
      const status = kb.status || '未知';
      statusDistribution[status] = (statusDistribution[status] || 0) + 1;
    });
    
    // 文件类型分布（模拟数据，实际应从API获取）
    const fileTypeDistribution: FileTypeDistribution = {
      pdf: Math.floor(totalFiles * 0.45),
      doc: Math.floor(totalFiles * 0.15),
      txt: Math.floor(totalFiles * 0.10),
      md: Math.floor(totalFiles * 0.08),
      csv: Math.floor(totalFiles * 0.07),
      xls: Math.floor(totalFiles * 0.05),
      other: 0
    };
    
    // 计算"其他"类别的文件数
    const countedFiles = Object.values(fileTypeDistribution).reduce((sum, count) => sum + count, 0);
    fileTypeDistribution.other = totalFiles - countedFiles;
    
    // 更新时间分布（过去7天）
    const updatedOverTime: Array<{ date: string; count: number }> = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const count = knowledgeBases.filter(kb => {
        const kbDate = new Date(kb.lastUpdated);
        return kbDate.toISOString().split('T')[0] === dateString;
      }).length;
      
      updatedOverTime.push({ date: dateString, count });
    }
    
    // 向量化进度
    const vectorizationProgress = knowledgeBases
      .map(kb => ({
        id: kb.id,
        name: kb.name,
        percentage: kb.vectorized || 0
      }))
      .sort((a, b) => b.percentage - a.percentage);
    
    return {
      totalKnowledgeBases,
      totalFiles,
      totalVectors,
      totalSize,
      averageVectorizationPercentage,
      categoryCounts,
      categoryFileDistribution,
      categoryVectorDistribution,
      statusDistribution,
      fileTypeDistribution,
      updatedOverTime,
      vectorizationProgress
    };
  }, [knowledgeBases]);
  
  // 根据不同类别筛选获取数据
  const getKnowledgeBasesByCategory = useCallback((category: KnowledgeBaseCategory) => {
    return knowledgeBases.filter(kb => kb.category === category);
  }, [knowledgeBases]);
  
  // 计算特定标签的知识库统计
  const getStatsForTag = useCallback((tag: string) => {
    const filteredKbs = knowledgeBases.filter(kb => kb.tags?.includes(tag));
    return {
      count: filteredKbs.length,
      fileCount: filteredKbs.reduce((sum, kb) => sum + (kb.fileCount || 0), 0),
      vectorCount: filteredKbs.reduce((sum, kb) => sum + (kb.vectorCount || 0), 0)
    };
  }, [knowledgeBases]);
  
  // 获取最近更新的知识库
  const getRecentlyUpdatedKnowledgeBases = useCallback((count: number = 5) => {
    return [...knowledgeBases]
      .sort((a, b) => 
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      )
      .slice(0, count);
  }, [knowledgeBases]);
  
  // 获取文件数量最多的知识库
  const getLargestKnowledgeBases = useCallback((count: number = 5) => {
    return [...knowledgeBases]
      .sort((a, b) => (b.fileCount || 0) - (a.fileCount || 0))
      .slice(0, count);
  }, [knowledgeBases]);
  
  // 获取向量化比例最低的知识库（需要优先处理的）
  const getLeastVectorizedKnowledgeBases = useCallback((count: number = 5) => {
    return [...knowledgeBases]
      .filter(kb => (kb.vectorized || 0) < 100 && kb.fileCount > 0)
      .sort((a, b) => (a.vectorized || 0) - (b.vectorized || 0))
      .slice(0, count);
  }, [knowledgeBases]);
  
  // 获取特定状态的知识库
  const getKnowledgeBasesByStatus = useCallback((status: string) => {
    return knowledgeBases.filter(kb => kb.status === status);
  }, [knowledgeBases]);
  
  return {
    // 统计数据
    stats,
    
    // 分析方法
    getKnowledgeBasesByCategory,
    getStatsForTag,
    getRecentlyUpdatedKnowledgeBases,
    getLargestKnowledgeBases,
    getLeastVectorizedKnowledgeBases,
    getKnowledgeBasesByStatus
  };
};
