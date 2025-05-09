import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAPI } from '../common/useAPI';
import { useList } from '../common/useList';
import { message } from 'antd';

// 定义提示词分类类型
export interface PromptCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon?: string;
  templateCount: number;
  createdAt: string;
  updatedAt: string;
  parentId?: string;
}

// 定义分类创建参数
export interface CreateCategoryParams {
  name: string;
  description: string;
  color: string;
  icon?: string;
  parentId?: string;
}

// 定义分类更新参数
export interface UpdateCategoryParams {
  id: string;
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  parentId?: string;
}

// 模拟获取分类数据的API函数
const fetchCategoriesAPI = async (): Promise<PromptCategory[]> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // 返回模拟数据
  return [
    {
      id: '1',
      name: '客户服务',
      description: '与客户交互和支持相关的提示词模板',
      color: '#1890ff',
      icon: 'CustomerServiceOutlined',
      templateCount: 12,
      createdAt: '2023-07-15T10:00:00Z',
      updatedAt: '2023-09-01T08:30:00Z'
    },
    {
      id: '2',
      name: '市场营销',
      description: '用于市场分析、产品推广和品牌建设的模板',
      color: '#52c41a',
      icon: 'RiseOutlined',
      templateCount: 8,
      createdAt: '2023-07-16T14:20:00Z',
      updatedAt: '2023-08-25T11:15:00Z'
    },
    {
      id: '3',
      name: '开发工具',
      description: '软件开发、代码审查和技术文档相关的模板',
      color: '#722ed1',
      icon: 'CodeOutlined',
      templateCount: 15,
      createdAt: '2023-07-18T09:45:00Z',
      updatedAt: '2023-09-10T16:40:00Z',
    },
    {
      id: '4',
      name: '内容创作',
      description: '用于写作、编辑和内容策划的提示词模板',
      color: '#fa8c16',
      icon: 'FileTextOutlined',
      templateCount: 10,
      createdAt: '2023-08-02T13:10:00Z',
      updatedAt: '2023-09-05T09:20:00Z'
    },
    {
      id: '5',
      name: '产品反馈',
      description: '收集和分析产品反馈的模板',
      color: '#eb2f96',
      icon: 'CommentOutlined',
      templateCount: 5,
      createdAt: '2023-08-10T11:30:00Z',
      updatedAt: '2023-08-30T15:45:00Z',
      parentId: '1'
    }
  ];
};

// 模拟创建分类的API函数
const createCategoryAPI = async (params: CreateCategoryParams): Promise<PromptCategory> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const now = new Date().toISOString();
  
  // 返回创建的分类
  return {
    id: Math.random().toString(36).substring(2, 9),
    ...params,
    templateCount: 0,
    createdAt: now,
    updatedAt: now
  };
};

// 模拟更新分类的API函数
const updateCategoryAPI = async (params: UpdateCategoryParams): Promise<PromptCategory> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 假设这里会返回更新后的分类
  return {
    id: params.id,
    name: params.name || '默认分类',
    description: params.description || '',
    color: params.color || '#1890ff',
    icon: params.icon,
    templateCount: 5, // 假设的模板数量
    createdAt: '2023-08-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
    parentId: params.parentId
  };
};

// 模拟删除分类的API函数
const deleteCategoryAPI = async (categoryId: string): Promise<boolean> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 假设删除成功
  return true;
};

/**
 * 提示词分类管理Hook
 * 
 * 负责分类的加载、创建、更新和删除
 * 
 * @returns {object} 包含提示词分类数据和操作方法的对象
 */
export const usePromptCategories = () => {
  // 使用通用API hook处理数据获取
  const {
    data: categoriesData,
    loading: isLoading,
    error: fetchError,
    execute: fetchCategories
  } = useAPI<void, PromptCategory[]>(fetchCategoriesAPI);
  
  // 使用通用列表hook管理分类数据
  const {
    items: categories,
    setItems: setCategories,
    addItem: addCategory,
    updateItem: updateCategoryInList,
    removeItem: removeCategoryFromList
  } = useList<PromptCategory>([]);
  
  // 分类选择状态
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  // 创建分类
  const {
    loading: isCreating,
    error: createError,
    execute: executeCreate
  } = useAPI(createCategoryAPI);
  
  // 更新分类
  const {
    loading: isUpdating,
    error: updateError,
    execute: executeUpdate
  } = useAPI(updateCategoryAPI);
  
  // 删除分类
  const {
    loading: isDeleting,
    error: deleteError,
    execute: executeDelete
  } = useAPI(deleteCategoryAPI);
  
  // 初始加载数据
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  
  // 当API数据更新时，更新列表
  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, [categoriesData, setCategories]);
  
  // 获取选中的分类
  const selectedCategory = useMemo(() => 
    categories.find(category => category.id === selectedCategoryId) || null, 
    [categories, selectedCategoryId]
  );
  
  // 创建分类
  const createCategory = useCallback(async (params: CreateCategoryParams) => {
    try {
      const newCategory = await executeCreate(params);
      addCategory(newCategory);
      message.success('分类创建成功');
      return newCategory;
    } catch (error) {
      console.error('创建分类失败:', error);
      message.error('创建分类失败');
      return null;
    }
  }, [executeCreate, addCategory]);
  
  // 更新分类
  const updateCategory = useCallback(async (params: UpdateCategoryParams) => {
    try {
      const updatedCategory = await executeUpdate(params);
      updateCategoryInList(
        category => category.id === params.id,
        {
          name: params.name,
          description: params.description,
          color: params.color,
          icon: params.icon,
          parentId: params.parentId,
          updatedAt: new Date().toISOString()
        }
      );
      message.success('分类更新成功');
      return updatedCategory;
    } catch (error) {
      console.error('更新分类失败:', error);
      message.error('更新分类失败');
      return null;
    }
  }, [executeUpdate, updateCategoryInList]);
  
  // 删除分类
  const deleteCategory = useCallback(async (categoryId: string) => {
    try {
      const success = await executeDelete(categoryId);
      if (success) {
        removeCategoryFromList(category => category.id === categoryId);
        
        // 如果删除的是当前选中的分类，取消选择
        if (categoryId === selectedCategoryId) {
          setSelectedCategoryId(null);
        }
        
        message.success('分类删除成功');
        return true;
      }
      message.error('分类删除失败');
      return false;
    } catch (error) {
      console.error('删除分类失败:', error);
      message.error('删除分类失败');
      return false;
    }
  }, [executeDelete, removeCategoryFromList, selectedCategoryId]);
  
  // 选择分类
  const selectCategory = useCallback((categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
  }, []);
  
  // 构建分类树结构
  const categoryTree = useMemo(() => {
    const rootCategories: (PromptCategory & { children: PromptCategory[] })[] = [];
    const categoryMap = new Map<string, PromptCategory & { children: PromptCategory[] }>();
    
    // 首先创建所有分类的映射
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });
    
    // 构建树结构
    categories.forEach(category => {
      const categoryWithChildren = categoryMap.get(category.id)!;
      
      if (category.parentId && categoryMap.has(category.parentId)) {
        // 如果有父分类，添加到父分类的子列表
        categoryMap.get(category.parentId)!.children.push(categoryWithChildren);
      } else {
        // 否则作为根分类
        rootCategories.push(categoryWithChildren);
      }
    });
    
    return rootCategories;
  }, [categories]);
  
  // 获取父分类选项（用于创建/编辑分类时选择父分类）
  const parentCategoryOptions = useMemo(() => {
    return categories.map(category => ({
      value: category.id,
      label: category.name
    }));
  }, [categories]);
  
  // 更新分类中的模板计数
  const updateCategoryTemplateCount = useCallback((categoryId: string, count: number) => {
    updateCategoryInList(
      category => category.id === categoryId,
      { templateCount: count }
    );
  }, [updateCategoryInList]);
  
  // 刷新分类列表
  const refreshCategories = useCallback(() => {
    return fetchCategories();
  }, [fetchCategories]);
  
  // 获取分类颜色选项
  const colorOptions = useMemo(() => {
    return [
      { value: '#1890ff', name: '蓝色' },
      { value: '#52c41a', name: '绿色' },
      { value: '#722ed1', name: '紫色' },
      { value: '#fa8c16', name: '橙色' },
      { value: '#eb2f96', name: '粉色' },
      { value: '#f5222d', name: '红色' },
      { value: '#faad14', name: '黄色' },
      { value: '#13c2c2', name: '青色' },
      { value: '#2f54eb', name: '深蓝色' },
      { value: '#712b22', name: '棕色' }
    ];
  }, []);
  
  // 获取图标选项
  const iconOptions = useMemo(() => {
    return [
      'CustomerServiceOutlined',
      'RiseOutlined',
      'CodeOutlined',
      'FileTextOutlined',
      'CommentOutlined',
      'BulbOutlined',
      'RocketOutlined',
      'SettingOutlined',
      'UserOutlined',
      'TeamOutlined',
      'ShopOutlined',
      'BookOutlined'
    ];
  }, []);
  
  return {
    // 数据
    categories,
    categoryTree,
    selectedCategory,
    selectedCategoryId,
    parentCategoryOptions,
    colorOptions,
    iconOptions,
    
    // 加载状态
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    
    // 错误状态
    fetchError,
    createError,
    updateError,
    deleteError,
    
    // 分类操作
    createCategory,
    updateCategory,
    deleteCategory,
    selectCategory,
    updateCategoryTemplateCount,
    
    // 其他操作
    refreshCategories
  };
};
