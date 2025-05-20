import { useState, useMemo, useCallback } from 'react';
import { Question } from './useQuestionManagement';

// 定义时间范围类型
export type TimeRange = 'today' | 'week' | 'month' | 'custom';

// 定义排序字段类型
export type SortField = 'title' | 'createdAt' | 'updatedAt' | 'usage' | 'feedback';

// 定义排序方向类型
export type SortDirection = 'asc' | 'desc';

// 定义筛选器参数接口
export interface QaFilterOptions {
  searchText: string;
  tags: string[];
  status: ('active' | 'archived' | 'pending')[];
  source: ('manual' | 'auto')[];
  timeRange: TimeRange;
  customTimeRange: [Date, Date] | null;
  sortField: SortField;
  sortDirection: SortDirection;
}

// 定义统计数据接口
export interface QaStatistics {
  totalQuestions: number;
  activeQuestions: number;
  archivedQuestions: number;
  pendingQuestions: number;
  manualQuestions: number;
  autoQuestions: number;
  topTags: { tag: string; count: number }[];
  usageTrend: { date: string; count: number }[];
  feedbackAverage: number;
}

/**
 * 问答筛选管理Hook
 * 
 * 提供高级筛选、排序、统计和分析功能
 * 
 * @param questions 问题列表数据
 * @returns {object} 包含筛选逻辑和筛选后数据的对象
 */
export const useQaFilter = (questions: Question[]) => {
  // 初始化筛选参数
  const [filterOptions, setFilterOptions] = useState<QaFilterOptions>({
    searchText: '',
    tags: [],
    status: [],
    source: [],
    timeRange: 'month',
    customTimeRange: null,
    sortField: 'updatedAt',
    sortDirection: 'desc'
  });
  
  // 根据时间范围获取日期范围
  const getDateRangeFromTimeRange = useCallback((timeRange: TimeRange, customRange: [Date, Date] | null): [Date, Date] => {
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'custom':
        if (customRange) {
          return customRange;
        }
        // 如果没有自定义范围，默认使用近一个月
        startDate.setMonth(startDate.getMonth() - 1);
        break;
    }
    
    return [startDate, endDate];
  }, []);
  
  // 应用筛选和排序，返回过滤后的列表
  const filteredQuestions = useMemo(() => {
    const {
      searchText,
      tags,
      status,
      source,
      timeRange,
      customTimeRange,
      sortField,
      sortDirection
    } = filterOptions;
    
    // 获取日期范围
    const [startDate, endDate] = getDateRangeFromTimeRange(timeRange, customTimeRange);
    
    // 应用筛选条件
    const result = questions.filter(question => {
      const lowerSearchText = searchText.toLowerCase();
      
      // 搜索文本匹配
      const matchesSearch = !searchText || 
        question.title.toLowerCase().includes(lowerSearchText) ||
        question.content.toLowerCase().includes(lowerSearchText) ||
        question.answer.toLowerCase().includes(lowerSearchText) ||
        question.tags.some(tag => tag.toLowerCase().includes(lowerSearchText));
      
      // 标签匹配
      const matchesTags = tags.length === 0 || 
        tags.some(tag => question.tags.includes(tag));
      
      // 状态匹配
      const matchesStatus = status.length === 0 || 
        status.includes(question.status);
      
      // 来源匹配
      const matchesSource = source.length === 0 || 
        (question.source && source.includes(question.source));
      
      // 时间范围匹配
      const questionDate = new Date(question.updatedAt);
      const matchesTimeRange = questionDate >= startDate && questionDate <= endDate;
      
      return matchesSearch && matchesTags && matchesStatus && matchesSource && matchesTimeRange;
    });
    
    // 应用排序
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'usage':
          comparison = (a.usage || 0) - (b.usage || 0);
          break;
        case 'feedback':
          comparison = (a.feedback || 0) - (b.feedback || 0);
          break;
      }
      
      // 应用排序方向
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [questions, filterOptions, getDateRangeFromTimeRange]);
  
  // 更新搜索文本
  const setSearchText = useCallback((text: string) => {
    setFilterOptions(prev => ({ ...prev, searchText: text }));
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
  
  // 切换状态筛选
  const toggleStatusFilter = useCallback((status: 'active' | 'archived' | 'pending') => {
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
  
  // 切换来源筛选
  const toggleSourceFilter = useCallback((source: 'manual' | 'auto') => {
    setFilterOptions(prev => {
      const sourceExists = prev.source.includes(source);
      return {
        ...prev,
        source: sourceExists
          ? prev.source.filter(s => s !== source)
          : [...prev.source, source]
      };
    });
  }, []);
  
  // 设置时间范围
  const setTimeRange = useCallback((range: TimeRange, customRange?: [Date, Date]) => {
    setFilterOptions(prev => ({
      ...prev,
      timeRange: range,
      customTimeRange: range === 'custom' ? customRange || null : null
    }));
  }, []);
  
  // 设置排序
  const setSorting = useCallback((field: SortField) => {
    setFilterOptions(prev => {
      // 如果点击了当前排序字段，切换排序方向
      if (prev.sortField === field) {
        return { ...prev, sortDirection: prev.sortDirection === 'asc' ? 'desc' : 'asc' };
      }
      // 否则，设置新的排序字段，并默认为降序
      return { ...prev, sortField: field, sortDirection: 'desc' };
    });
  }, []);
  
  // 重置所有筛选选项
  const resetFilters = useCallback(() => {
    setFilterOptions({
      searchText: '',
      tags: [],
      status: [],
      source: [],
      timeRange: 'month',
      customTimeRange: null,
      sortField: 'updatedAt',
      sortDirection: 'desc'
    });
  }, []);
  
  // 获取所有可用标签
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    questions.forEach(q => q.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [questions]);
  
  // 生成统计数据
  const statistics = useMemo((): QaStatistics => {
    // 基础计数
    const totalQuestions = questions.length;
    const activeQuestions = questions.filter(q => q.status === 'active').length;
    const archivedQuestions = questions.filter(q => q.status === 'archived').length;
    const pendingQuestions = questions.filter(q => q.status === 'pending').length;
    const manualQuestions = questions.filter(q => q.source === 'manual').length;
    const autoQuestions = questions.filter(q => q.source === 'auto').length;
    
    // 标签统计
    const tagCounts: {[key: string]: number} = {};
    questions.forEach(q => {
      q.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    const topTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // 使用趋势 - 过去7天的使用情况
    const usageDates: {[key: string]: number} = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      usageDates[dateString] = 0;
    }
    
    // 过滤出最近7天的问题，按日期计数
    questions.forEach(q => {
      const date = new Date(q.updatedAt);
      const dateString = date.toISOString().split('T')[0];
      if (usageDates[dateString] !== undefined) {
        usageDates[dateString] += 1;
      }
    });
    
    const usageTrend = Object.entries(usageDates)
      .map(([date, count]) => ({ date, count }));
    
    // 平均反馈评分
    const feedbackQuestions = questions.filter(q => q.feedback !== undefined);
    const feedbackAverage = feedbackQuestions.length
      ? feedbackQuestions.reduce((sum, q) => sum + (q.feedback || 0), 0) / feedbackQuestions.length
      : 0;
    
    return {
      totalQuestions,
      activeQuestions,
      archivedQuestions,
      pendingQuestions,
      manualQuestions,
      autoQuestions,
      topTags,
      usageTrend,
      feedbackAverage
    };
  }, [questions]);
  
  return {
    // 筛选状态
    filterOptions,
    filteredQuestions,
    availableTags,
    statistics,
    
    // 筛选操作方法
    setSearchText,
    toggleTagFilter,
    toggleStatusFilter,
    toggleSourceFilter,
    setTimeRange,
    setSorting,
    resetFilters
  };
};
