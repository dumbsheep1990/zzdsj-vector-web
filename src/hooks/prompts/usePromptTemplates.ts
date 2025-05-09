import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAPI } from '../common/useAPI';
import { useList } from '../common/useList';
import { message } from 'antd';

// 定义提示词模板类型
export interface PromptTemplate {
  id: string;
  title: string;
  content: string;
  description: string;
  category: string;
  tags: string[];
  variables: Array<{
    name: string;
    description: string;
    defaultValue?: string;
    required: boolean;
  }>;
  author: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  isPublic: boolean;
  isFavorite: boolean;
}

// 定义模板创建参数
export interface CreateTemplateParams {
  title: string;
  content: string;
  description: string;
  category: string;
  tags: string[];
  variables: Array<{
    name: string;
    description: string;
    defaultValue?: string;
    required: boolean;
  }>;
  isPublic: boolean;
}

// 定义模板更新参数
export interface UpdateTemplateParams {
  id: string;
  title?: string;
  content?: string;
  description?: string;
  category?: string;
  tags?: string[];
  variables?: Array<{
    name: string;
    description: string;
    defaultValue?: string;
    required: boolean;
  }>;
  isPublic?: boolean;
}

// 定义模板筛选选项
export interface PromptFilterOptions {
  searchQuery: string;
  categories: string[];
  tags: string[];
  author?: string;
  onlyFavorites: boolean;
  onlyPublic: boolean;
}

// 模拟获取提示词模板数据的API函数
const fetchTemplatesAPI = async (): Promise<PromptTemplate[]> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 返回模拟数据
  return [
    {
      id: '1',
      title: '客户问题分析',
      content: '请分析以下客户问题：\n{{问题内容}}\n\n1. 问题关键点\n2. 可能的原因\n3. 建议解决方案\n4. 需要收集的额外信息',
      description: '用于快速分析客户问题并提供解决方案',
      category: '客户服务',
      tags: ['问题分析', '解决方案', '客户支持'],
      variables: [
        {
          name: '问题内容',
          description: '客户描述的问题详情',
          required: true
        }
      ],
      author: '张三',
      createdAt: '2023-08-12T08:30:00Z',
      updatedAt: '2023-08-15T10:20:00Z',
      usageCount: 45,
      isPublic: true,
      isFavorite: true
    },
    {
      id: '2',
      title: '产品特性总结',
      content: '请针对产品"{{产品名称}}"总结以下几点：\n\n- 核心功能\n- 主要特点\n- 目标用户\n- 与竞品相比的优势\n- 潜在改进点',
      description: '快速生成产品特性总结报告',
      category: '市场营销',
      tags: ['产品', '市场分析', '竞品分析'],
      variables: [
        {
          name: '产品名称',
          description: '要分析的产品名称',
          required: true
        }
      ],
      author: '李四',
      createdAt: '2023-09-05T14:45:00Z',
      updatedAt: '2023-09-05T14:45:00Z',
      usageCount: 23,
      isPublic: true,
      isFavorite: false
    },
    {
      id: '3',
      title: '代码重构建议',
      content: '请分析以下{{编程语言}}代码并提供重构建议：\n\n```{{编程语言}}\n{{代码内容}}\n```\n\n请考虑：\n1. 代码可读性\n2. 性能优化\n3. 设计模式应用\n4. 错误处理\n5. 测试建议',
      description: '获取代码重构和优化建议',
      category: '开发工具',
      tags: ['代码优化', '重构', '编程', '技术'],
      variables: [
        {
          name: '编程语言',
          description: '代码使用的编程语言',
          defaultValue: 'JavaScript',
          required: true
        },
        {
          name: '代码内容',
          description: '需要分析的代码片段',
          required: true
        }
      ],
      author: '王五',
      createdAt: '2023-07-20T11:15:00Z',
      updatedAt: '2023-09-10T16:30:00Z',
      usageCount: 78,
      isPublic: false,
      isFavorite: true
    }
  ];
};

// 模拟创建模板的API函数
const createTemplateAPI = async (params: CreateTemplateParams): Promise<PromptTemplate> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const now = new Date().toISOString();
  
  // 返回创建的模板
  return {
    id: Math.random().toString(36).substring(2, 9),
    ...params,
    author: '当前用户',
    createdAt: now,
    updatedAt: now,
    usageCount: 0,
    isFavorite: false
  };
};

// 模拟更新模板的API函数
const updateTemplateAPI = async (params: UpdateTemplateParams): Promise<PromptTemplate> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 假设这里会返回更新后的模板
  return {
    id: params.id,
    title: params.title || '默认标题',
    content: params.content || '',
    description: params.description || '',
    category: params.category || '未分类',
    tags: params.tags || [],
    variables: params.variables || [],
    author: '当前用户',
    createdAt: '2023-08-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
    usageCount: 10,
    isPublic: params.isPublic !== undefined ? params.isPublic : true,
    isFavorite: false
  };
};

// 模拟删除模板的API函数
const deleteTemplateAPI = async (templateId: string): Promise<boolean> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 假设删除成功
  return true;
};

// 模拟切换收藏状态的API函数
const toggleFavoriteAPI = async (templateId: string, isFavorite: boolean): Promise<boolean> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 假设操作成功
  return true;
};

// 模拟增加使用次数的API函数
const incrementUsageAPI = async (templateId: string): Promise<number> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // 假设返回更新后的使用次数
  return Math.floor(Math.random() * 100);
};

/**
 * 提示词模板管理Hook
 * 
 * 负责模板的加载、筛选、创建、更新和删除
 * 
 * @returns {object} 包含提示词模板数据和操作方法的对象
 */
export const usePromptTemplates = () => {
  // 使用通用API hook处理数据获取
  const {
    data: templatesData,
    loading: isLoading,
    error: fetchError,
    execute: fetchTemplates
  } = useAPI<void, PromptTemplate[]>(fetchTemplatesAPI);
  
  // 使用通用列表hook管理模板数据
  const {
    items: templates,
    setItems: setTemplates,
    addItem: addTemplate,
    updateItem: updateTemplateInList,
    removeItem: removeTemplateFromList,
    setSort,
    clearSort,
    addFilter,
    removeFilter,
    clearFilters
  } = useList<PromptTemplate>([]);
  
  // 模板选择状态
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  
  // 模板筛选选项
  const [filterOptions, setFilterOptions] = useState<PromptFilterOptions>({
    searchQuery: '',
    categories: [],
    tags: [],
    onlyFavorites: false,
    onlyPublic: false
  });
  
  // 创建模板
  const {
    loading: isCreating,
    error: createError,
    execute: executeCreate
  } = useAPI(createTemplateAPI);
  
  // 更新模板
  const {
    loading: isUpdating,
    error: updateError,
    execute: executeUpdate
  } = useAPI(updateTemplateAPI);
  
  // 删除模板
  const {
    loading: isDeleting,
    error: deleteError,
    execute: executeDelete
  } = useAPI(deleteTemplateAPI);
  
  // 切换收藏状态
  const {
    loading: isTogglingFavorite,
    error: toggleFavoriteError,
    execute: executeToggleFavorite
  } = useAPI(toggleFavoriteAPI);
  
  // 增加使用次数
  const {
    loading: isIncrementingUsage,
    error: incrementUsageError,
    execute: executeIncrementUsage
  } = useAPI(incrementUsageAPI);
  
  // 初始加载数据
  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);
  
  // 当API数据更新时，更新列表
  useEffect(() => {
    if (templatesData) {
      setTemplates(templatesData);
    }
  }, [templatesData, setTemplates]);
  
  // 获取选中的模板
  const selectedTemplate = useMemo(() => 
    templates.find(template => template.id === selectedTemplateId) || null, 
    [templates, selectedTemplateId]
  );
  
  // 创建模板
  const createTemplate = useCallback(async (params: CreateTemplateParams) => {
    try {
      const newTemplate = await executeCreate(params);
      addTemplate(newTemplate);
      message.success('模板创建成功');
      return newTemplate;
    } catch (error) {
      console.error('创建模板失败:', error);
      message.error('创建模板失败');
      return null;
    }
  }, [executeCreate, addTemplate]);
  
  // 更新模板
  const updateTemplate = useCallback(async (params: UpdateTemplateParams) => {
    try {
      const updatedTemplate = await executeUpdate(params);
      updateTemplateInList(
        template => template.id === params.id,
        {
          title: params.title,
          content: params.content,
          description: params.description,
          category: params.category,
          tags: params.tags,
          variables: params.variables,
          isPublic: params.isPublic,
          updatedAt: new Date().toISOString()
        }
      );
      message.success('模板更新成功');
      return updatedTemplate;
    } catch (error) {
      console.error('更新模板失败:', error);
      message.error('更新模板失败');
      return null;
    }
  }, [executeUpdate, updateTemplateInList]);
  
  // 删除模板
  const deleteTemplate = useCallback(async (templateId: string) => {
    try {
      const success = await executeDelete(templateId);
      if (success) {
        removeTemplateFromList(template => template.id === templateId);
        
        // 如果删除的是当前选中的模板，取消选择
        if (templateId === selectedTemplateId) {
          setSelectedTemplateId(null);
        }
        
        message.success('模板删除成功');
        return true;
      }
      message.error('模板删除失败');
      return false;
    } catch (error) {
      console.error('删除模板失败:', error);
      message.error('删除模板失败');
      return false;
    }
  }, [executeDelete, removeTemplateFromList, selectedTemplateId]);
  
  // 切换模板收藏状态
  const toggleFavorite = useCallback(async (templateId: string, favorite: boolean) => {
    try {
      const success = await executeToggleFavorite(templateId, favorite);
      if (success) {
        updateTemplateInList(
          template => template.id === templateId,
          { isFavorite: favorite }
        );
        message.success(favorite ? '已添加到收藏' : '已从收藏中移除');
        return true;
      }
      message.error(favorite ? '添加收藏失败' : '移除收藏失败');
      return false;
    } catch (error) {
      console.error('切换收藏状态失败:', error);
      message.error('操作失败');
      return false;
    }
  }, [executeToggleFavorite, updateTemplateInList]);
  
  // 增加模板使用次数
  const incrementUsage = useCallback(async (templateId: string) => {
    try {
      const newUsageCount = await executeIncrementUsage(templateId);
      updateTemplateInList(
        template => template.id === templateId,
        { usageCount: newUsageCount }
      );
      return newUsageCount;
    } catch (error) {
      console.error('更新使用次数失败:', error);
      return null;
    }
  }, [executeIncrementUsage, updateTemplateInList]);
  
  // 选择模板
  const selectTemplate = useCallback((templateId: string | null) => {
    setSelectedTemplateId(templateId);
  }, []);
  
  // 设置搜索查询
  const setSearchQuery = useCallback((query: string) => {
    setFilterOptions(prev => ({
      ...prev,
      searchQuery: query
    }));
  }, []);
  
  // 设置分类筛选
  const setCategoryFilter = useCallback((categories: string[]) => {
    setFilterOptions(prev => ({
      ...prev,
      categories
    }));
  }, []);
  
  // 设置标签筛选
  const setTagFilter = useCallback((tags: string[]) => {
    setFilterOptions(prev => ({
      ...prev,
      tags
    }));
  }, []);
  
  // 设置收藏筛选
  const setFavoriteFilter = useCallback((onlyFavorites: boolean) => {
    setFilterOptions(prev => ({
      ...prev,
      onlyFavorites
    }));
  }, []);
  
  // 设置公开性筛选
  const setPublicFilter = useCallback((onlyPublic: boolean) => {
    setFilterOptions(prev => ({
      ...prev,
      onlyPublic
    }));
  }, []);
  
  // 获取分类列表
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    templates.forEach(template => {
      if (template.category) {
        categorySet.add(template.category);
      }
    });
    return Array.from(categorySet);
  }, [templates]);
  
  // 获取标签列表
  const tags = useMemo(() => {
    const tagSet = new Set<string>();
    templates.forEach(template => {
      template.tags.forEach(tag => {
        tagSet.add(tag);
      });
    });
    return Array.from(tagSet);
  }, [templates]);
  
  // 应用筛选获取模板列表
  const filteredTemplates = useMemo(() => {
    const { searchQuery, categories, tags, onlyFavorites, onlyPublic } = filterOptions;
    
    return templates.filter(template => {
      // 搜索查询匹配
      const matchesSearch = !searchQuery || 
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 分类匹配
      const matchesCategory = categories.length === 0 || categories.includes(template.category);
      
      // 标签匹配
      const matchesTags = tags.length === 0 || 
        tags.some(tag => template.tags.includes(tag));
      
      // 收藏匹配
      const matchesFavorite = !onlyFavorites || template.isFavorite;
      
      // 公开性匹配
      const matchesPublic = !onlyPublic || template.isPublic;
      
      return matchesSearch && matchesCategory && matchesTags && matchesFavorite && matchesPublic;
    });
  }, [templates, filterOptions]);
  
  // 刷新模板列表
  const refreshTemplates = useCallback(() => {
    return fetchTemplates();
  }, [fetchTemplates]);
  
  // 获取变量示例值
  const getVariableExamples = useCallback((templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return null;
    
    const examples: Record<string, string> = {};
    template.variables.forEach(variable => {
      examples[variable.name] = variable.defaultValue || `[${variable.name}]`;
    });
    
    return examples;
  }, [templates]);
  
  // 填充模板内容
  const fillTemplateContent = useCallback((templateId: string, variables: Record<string, string>) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return null;
    
    let filledContent = template.content;
    
    Object.entries(variables).forEach(([name, value]) => {
      filledContent = filledContent.replace(new RegExp(`{{${name}}}`, 'g'), value);
    });
    
    // 处理未填充的变量（可选）
    template.variables.forEach(variable => {
      if (!variables[variable.name]) {
        const placeholder = variable.defaultValue || `[${variable.name}]`;
        filledContent = filledContent.replace(new RegExp(`{{${variable.name}}}`, 'g'), placeholder);
      }
    });
    
    return filledContent;
  }, [templates]);
  
  return {
    // 数据
    templates,
    filteredTemplates,
    selectedTemplate,
    selectedTemplateId,
    categories,
    tags,
    
    // 加载状态
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isTogglingFavorite,
    isIncrementingUsage,
    
    // 错误状态
    fetchError,
    createError,
    updateError,
    deleteError,
    toggleFavoriteError,
    incrementUsageError,
    
    // 模板操作
    createTemplate,
    updateTemplate,
    deleteTemplate,
    selectTemplate,
    toggleFavorite,
    incrementUsage,
    
    // 筛选和查询
    setSearchQuery,
    setCategoryFilter,
    setTagFilter,
    setFavoriteFilter,
    setPublicFilter,
    
    // 模板内容处理
    getVariableExamples,
    fillTemplateContent,
    
    // 其他操作
    refreshTemplates
  };
};
