import { useState, useEffect, useCallback } from 'react';
import { useAPI } from '../common/useAPI';
import { useList } from '../common/useList';
import { message } from 'antd';

// 定义问题数据接口
export interface Question {
  id: string;
  assistantId: string;
  title: string;
  content: string;
  answer: string;
  status: 'active' | 'archived' | 'pending';
  createdAt: string;
  updatedAt: string;
  tags: string[];
  source?: 'manual' | 'auto';
  usage?: number;  // 使用次数
  feedback?: number;  // 正反馈比例，0-100
}

// 问题筛选选项
export interface QuestionFilterOptions {
  status?: 'active' | 'archived' | 'pending';
  tags?: string[];
  source?: 'manual' | 'auto';
  searchText?: string;
  timeRange?: [Date, Date];
}

// 新建问题表单数据
export interface QuestionFormData {
  title: string;
  content: string;
  answer: string;
  tags: string[];
  status?: 'active' | 'archived' | 'pending';
  source?: 'manual' | 'auto';
}

// 模拟获取问题列表的API函数
const fetchQuestionsAPI = async (assistantId: string): Promise<Question[]> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 返回模拟数据
  const currentTime = new Date().toISOString();
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
  
  return [
    {
      id: `q-${assistantId}-001`,
      assistantId,
      title: '如何使用向量搜索功能？',
      content: '我想了解如何在系统中使用向量搜索功能，有哪些参数可以调整？',
      answer: '向量搜索功能可以通过点击左侧导航栏的"向量搜索"按钮进入。您可以在搜索框中输入关键词，系统会自动转换为向量并在数据库中查找语义相似的内容。可调整的参数包括：相似度阈值、最大返回结果数、查询语义模型等。详细使用方法请参考用户手册第12章。',
      status: 'active',
      createdAt: twoHoursAgo,
      updatedAt: currentTime,
      tags: ['向量搜索', '功能使用', '基础教程'],
      source: 'manual',
      usage: 47,
      feedback: 92
    },
    {
      id: `q-${assistantId}-002`,
      assistantId,
      title: '如何导入数据集？',
      content: '我需要导入一个大型数据集到系统中，支持哪些格式，有没有大小限制？',
      answer: '系统支持导入多种格式的数据集，包括CSV、JSON、Excel(xlsx)和文本文件。单个文件大小限制为100MB，对于更大的数据集建议分批导入或使用API接口。导入步骤：\n1. 进入"数据管理"页面\n2. 点击"导入数据"\n3. 选择文件格式和导入方式\n4. 上传文件并设置匹配字段\n5. 确认导入',
      status: 'active',
      createdAt: oneDayAgo,
      updatedAt: oneDayAgo,
      tags: ['数据导入', '数据集', '文件处理'],
      source: 'manual',
      usage: 128,
      feedback: 88
    },
    {
      id: `q-${assistantId}-003`,
      assistantId,
      title: '系统支持哪些语言模型？',
      content: '我想了解系统集成了哪些AI语言模型，以及它们各自的特点和适用场景',
      answer: '当前系统集成了以下语言模型：\n1. GPT-3.5/4系列：通用理解和生成能力强，适合大多数问答场景\n2. Claude系列：推理和长文本处理能力突出，适合复杂决策\n3. LLaMA系列：开源可本地部署，适合数据敏感场景\n4. 百度文心：中文处理优秀，适合本地化需求\n\n每个模型可在"系统设置-AI模型"中进行配置和切换。',
      status: 'archived',
      createdAt: twoDaysAgo,
      updatedAt: oneDayAgo,
      tags: ['AI模型', '功能配置', '技术解析'],
      source: 'auto',
      usage: 94,
      feedback: 79
    }
  ];
};

// 模拟创建问题的API函数
const createQuestionAPI = async (assistantId: string, data: QuestionFormData): Promise<Question> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 生成模拟数据
  const now = new Date().toISOString();
  
  return {
    id: `q-${assistantId}-${Math.floor(Math.random() * 10000)}`,
    assistantId,
    title: data.title,
    content: data.content,
    answer: data.answer,
    status: data.status || 'active',
    createdAt: now,
    updatedAt: now,
    tags: data.tags || [],
    source: data.source || 'manual',
    usage: 0,
    feedback: 0
  };
};

// 模拟更新问题的API函数
const updateQuestionAPI = async (questionId: string, data: Partial<Question>): Promise<Question> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // 这里应返回完整的更新后对象，在实际实现中需要获取完整对象再更新
  return {
    ...data,
    id: questionId,
    updatedAt: new Date().toISOString()
  } as Question;
};

// 模拟删除问题的API函数
const deleteQuestionAPI = async (questionId: string): Promise<boolean> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // 模拟成功删除
  return true;
};

// 模拟获取问题详情的API函数
const getQuestionDetailAPI = async (questionId: string): Promise<Question> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 这里应返回完整的问题对象，目前简单返回一个固定结构
  const now = new Date().toISOString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  
  return {
    id: questionId,
    assistantId: questionId.split('-')[1], // 从问题ID提取助手ID
    title: '详细问题标题',
    content: '问题的详细内容描述，包含用户的具体疑问和上下文信息。',
    answer: '这是问题的标准答案，包含了详细的解释和指导步骤。根据需要，这里可以包含格式化文本、列表和重要提示等内容。',
    status: 'active',
    createdAt: yesterday,
    updatedAt: now,
    tags: ['示例标签', '详情演示'],
    source: 'manual',
    usage: 15,
    feedback: 90
  };
};

/**
 * 问题管理Hook
 * 
 * 管理问答对数据的获取、筛选、创建、更新和删除
 * 
 * @param assistantId 关联的助手ID
 * @returns {object} 包含问题数据和操作方法的对象
 */
export const useQuestionManagement = (assistantId: string | null) => {
  // 使用通用列表hook管理问题数据
  const {
    items: questions,
    setItems: setQuestions,
    addItem: addQuestion,
    updateItem: updateQuestionInList,
    removeItem: removeQuestionFromList,
    setSort,
    clearSort,
    addFilter,
    removeFilter,
    clearFilters
  } = useList<Question>([]);
  
  // 选中的问题ID
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  
  // 是否处于编辑模式
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  
  // 使用API hooks处理请求
  const {
    loading: isLoading,
    error: fetchError,
    execute: fetchQuestions
  } = useAPI(fetchQuestionsAPI);
  
  const {
    data: questionDetail,
    loading: isLoadingDetail,
    error: detailError,
    execute: fetchQuestionDetail
  } = useAPI(getQuestionDetailAPI);
  
  const {
    loading: isCreating,
    error: createError,
    execute: executeCreate
  } = useAPI((params: { assistantId: string, data: QuestionFormData }) => 
    createQuestionAPI(params.assistantId, params.data)
  );
  
  const {
    loading: isUpdating,
    error: updateError,
    execute: executeUpdate
  } = useAPI((params: { questionId: string, data: Partial<Question> }) => 
    updateQuestionAPI(params.questionId, params.data)
  );
  
  const {
    loading: isDeleting,
    error: deleteError,
    execute: executeDelete
  } = useAPI(deleteQuestionAPI);
  
  // 组合错误信息
  const error = fetchError || detailError || createError || updateError || deleteError;
  
  // 选中的问题
  const selectedQuestion = questions.find(q => q.id === selectedQuestionId) || questionDetail;
  
  // 当助手ID变化时加载问题列表
  useEffect(() => {
    if (assistantId) {
      fetchQuestions(assistantId);
      setSelectedQuestionId(null); // 重置选中的问题
    } else {
      setQuestions([]);
      setSelectedQuestionId(null);
    }
  }, [assistantId, fetchQuestions, setQuestions]);
  
  // 当选中问题ID变化时获取详细信息
  useEffect(() => {
    if (selectedQuestionId) {
      fetchQuestionDetail(selectedQuestionId);
    }
  }, [selectedQuestionId, fetchQuestionDetail]);
  
  // 选择问题
  const selectQuestion = useCallback((questionId: string | null) => {
    setSelectedQuestionId(questionId);
    setIsEditMode(false);
  }, []);
  
  // 切换编辑模式
  const toggleEditMode = useCallback((value?: boolean) => {
    setIsEditMode(prev => value !== undefined ? value : !prev);
  }, []);
  
  // 创建问题
  const createQuestion = useCallback(async (data: QuestionFormData) => {
    if (!assistantId) {
      message.error('请先选择一个助手');
      return null;
    }
    
    try {
      const newQuestion = await executeCreate({ assistantId, data });
      addQuestion(newQuestion);
      message.success('问题创建成功');
      return newQuestion;
    } catch (error) {
      console.error('创建问题失败:', error);
      message.error('创建问题失败，请重试');
      return null;
    }
  }, [assistantId, executeCreate, addQuestion]);
  
  // 更新问题
  const updateQuestion = useCallback(async (questionId: string, data: Partial<Question>) => {
    try {
      const updatedQuestion = await executeUpdate({ questionId, data });
      updateQuestionInList(
        question => question.id === questionId,
        updatedQuestion
      );
      message.success('问题更新成功');
      return updatedQuestion;
    } catch (error) {
      console.error('更新问题失败:', error);
      message.error('更新问题失败，请重试');
      return null;
    }
  }, [executeUpdate, updateQuestionInList]);
  
  // 删除问题
  const deleteQuestion = useCallback(async (questionId: string) => {
    try {
      const success = await executeDelete(questionId);
      if (success) {
        removeQuestionFromList(question => question.id === questionId);
        
        // 如果删除的是当前选中的问题，重置选择
        if (selectedQuestionId === questionId) {
          setSelectedQuestionId(null);
        }
        
        message.success('问题删除成功');
        return true;
      }
      message.error('删除问题失败，请重试');
      return false;
    } catch (error) {
      console.error('删除问题失败:', error);
      message.error('删除问题失败，请重试');
      return false;
    }
  }, [executeDelete, removeQuestionFromList, selectedQuestionId]);
  
  // 刷新问题列表
  const refreshQuestions = useCallback(() => {
    if (assistantId) {
      return fetchQuestions(assistantId);
    }
    return Promise.resolve(null);
  }, [assistantId, fetchQuestions]);
  
  // 按状态筛选问题
  const filterByStatus = useCallback((status: 'active' | 'archived' | 'pending' | null) => {
    if (status) {
      addFilter('status', status);
    } else {
      removeFilter('status');
    }
  }, [addFilter, removeFilter]);
  
  // 按标签筛选问题
  const filterByTags = useCallback((tags: string[]) => {
    clearFilters(); // 清除之前的所有筛选条件
    
    if (tags.length > 0) {
      // 使用自定义筛选逻辑
      const filteredQuestions = questions.filter(
        question => tags.some(tag => question.tags.includes(tag))
      );
      setQuestions(filteredQuestions);
    } else {
      // 如果没有标签筛选，刷新数据
      refreshQuestions();
    }
  }, [questions, setQuestions, clearFilters, refreshQuestions]);
  
  // 搜索问题
  const searchQuestions = useCallback((searchText: string) => {
    if (!assistantId) return;
    
    if (searchText) {
      // 本地搜索逻辑，在实际应用中可能需要调用后端API
      const lowerText = searchText.toLowerCase();
      const filteredQuestions = questions.filter(
        q => q.title.toLowerCase().includes(lowerText) || 
             q.content.toLowerCase().includes(lowerText) ||
             q.answer.toLowerCase().includes(lowerText) ||
             q.tags.some(tag => tag.toLowerCase().includes(lowerText))
      );
      setQuestions(filteredQuestions);
    } else {
      // 如果搜索文本为空，刷新列表
      refreshQuestions();
    }
  }, [assistantId, questions, setQuestions, refreshQuestions]);
  
  // 获取所有标签
  const getAllTags = useCallback(() => {
    const tagsSet = new Set<string>();
    questions.forEach(question => {
      question.tags.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [questions]);
  
  return {
    // 数据
    questions,
    selectedQuestion,
    selectedQuestionId,
    isEditMode,
    
    // 加载状态
    isLoading,
    isLoadingDetail,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    
    // 问题操作
    selectQuestion,
    toggleEditMode,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    refreshQuestions,
    
    // 筛选和排序
    filterByStatus,
    filterByTags,
    searchQuestions,
    getAllTags,
    setSort,
    clearSort,
    clearFilters
  };
};
