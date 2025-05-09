import { useState, useEffect, useCallback } from 'react';
import { useQaAssistants } from './useQaAssistants';
import { useQuestionManagement } from './useQuestionManagement';
import { useQaFilter } from './useQaFilter';
import { message } from 'antd';

/**
 * 问答管理页面Hook
 * 
 * 整合问答管理页面所需的全部状态和逻辑，提供统一的接口
 * 负责：
 * - 问答助手数据管理
 * - 问题数据管理
 * - 筛选与搜索
 * - 页面状态管理
 * 
 * @returns 问答管理页面所需的状态和方法
 */
export const useQaPage = () => {
  // 标签页状态
  const [activeTab, setActiveTab] = useState<'questions' | 'settings'>('questions');
  
  // 创建问题的弹窗状态
  const [isAddQuestionModalVisible, setIsAddQuestionModalVisible] = useState(false);
  
  // 搜索状态
  const [searchText, setSearchText] = useState('');
  const [hasSearchResults, setHasSearchResults] = useState(true);
  
  // 使用助手管理Hook
  const {
    assistants,
    selectedAssistant,
    selectedAssistantId,
    isLoading: assistantsLoading,
    selectAssistant,
    createAssistant,
    updateAssistant,
    deleteAssistant,
    refreshAssistants
  } = useQaAssistants();
  
  // 使用问题管理Hook，传入选中的助手ID
  const {
    questions,
    selectedQuestion,
    selectedQuestionId,
    isLoading: questionsLoading,
    selectQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    refreshQuestions,
    getAllTags
  } = useQuestionManagement(selectedAssistantId);
  
  // 使用筛选Hook
  const {
    filterOptions,
    filteredQuestions,
    statistics,
    setSearchText: setFilterSearchText,
    toggleTagFilter,
    toggleStatusFilter,
    resetFilters
  } = useQaFilter(questions);
  
  // 加载状态合并
  const isLoading = assistantsLoading || questionsLoading;
  
  // 处理标签页切换
  const handleTabChange = useCallback((tab: 'questions' | 'settings') => {
    setActiveTab(tab);
  }, []);
  
  // 处理助手选择
  const handleAssistantSelect = useCallback((assistantId: string) => {
    selectAssistant(assistantId);
  }, [selectAssistant]);
  
  // 处理问题选择
  const handleQuestionSelect = useCallback((questionId: string) => {
    selectQuestion(questionId);
    setActiveTab('settings');
  }, [selectQuestion]);
  
  // 处理新增问题
  const handleAddQuestion = useCallback((values: {
    question: string;
    answer: string;
    mode: 'manual' | 'smart';
  }) => {
    if (!selectedAssistantId) {
      message.error('请先选择一个助手');
      return null;
    }
    
    // 准备问题数据
    const questionData = {
      title: values.question.substring(0, 50), // 使用问题前50个字符作为标题
      content: values.question,
      answer: values.answer,
      tags: [],
      status: 'active' as const,
      source: values.mode === 'manual' ? 'manual' as const : 'auto' as const
    };
    
    // 创建问题
    createQuestion(questionData);
    setIsAddQuestionModalVisible(false);
    
    return questionData;
  }, [selectedAssistantId, createQuestion]);
  
  // 处理搜索
  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
    setFilterSearchText(value);
    
    // 判断是否有搜索结果
    if (value) {
      // 延迟设置，给筛选操作留出时间
      setTimeout(() => {
        setHasSearchResults(filteredQuestions.length > 0);
      }, 100);
    } else {
      setHasSearchResults(true);
    }
  }, [filteredQuestions, setFilterSearchText]);
  
  // 处理创建助手
  const handleCreateAssistant = useCallback(() => {
    message.info('正在开发中，敬请期待');
    // TODO: 实现创建助手的逻辑
  }, []);
  
  // 获取助手状态标签颜色
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'online':
        return 'success';
      case 'offline':
        return 'default';
      case 'training':
        return 'processing';
      default:
        return 'default';
    }
  }, []);
  
  // 打开添加问题弹窗
  const showAddQuestionModal = useCallback(() => {
    setIsAddQuestionModalVisible(true);
  }, []);
  
  // 关闭添加问题弹窗
  const hideAddQuestionModal = useCallback(() => {
    setIsAddQuestionModalVisible(false);
  }, []);
  
  // 清除搜索并恢复结果
  const clearSearchAndRestoreResults = useCallback(() => {
    setSearchText('');
    setHasSearchResults(true);
    resetFilters();
  }, [resetFilters]);
  
  return {
    // 数据状态
    assistants,
    selectedAssistant,
    selectedAssistantId,
    questions: filteredQuestions,
    selectedQuestion,
    selectedQuestionId,
    activeTab,
    isLoading,
    isAddQuestionModalVisible,
    searchText,
    hasSearchResults,
    statistics,
    
    // 操作方法
    handleAssistantSelect,
    handleQuestionSelect,
    handleTabChange,
    handleAddQuestion,
    handleSearch,
    handleCreateAssistant,
    getStatusColor,
    showAddQuestionModal,
    hideAddQuestionModal,
    clearSearchAndRestoreResults,
    
    // 助手操作
    createAssistant,
    updateAssistant,
    deleteAssistant,
    refreshAssistants,
    
    // 问题操作
    createQuestion,
    updateQuestion,
    deleteQuestion,
    refreshQuestions,
    
    // 筛选操作
    toggleTagFilter,
    toggleStatusFilter,
    resetFilters,
    getAllTags
  };
};
