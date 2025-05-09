import { useState, useCallback, useEffect } from 'react';
import { AssistantItem } from '../../utils/qaTypes';
import { useAPI } from '../common/useAPI';

// 定义助手表单数据接口
export interface AssistantFormData {
  id?: string;
  name: string;
  description: string;
  avatar: string;
  capabilities: string[];
}

// 定义验证错误接口
export interface ValidationErrors {
  name?: string;
  description?: string;
  capabilities?: string;
}

// 模拟创建助手的API函数
const createAssistantAPI = async (data: AssistantFormData): Promise<AssistantItem> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 返回模拟创建后的助手数据
  return {
    id: data.id || Math.random().toString(36).substr(2, 9),
    name: data.name,
    description: data.description,
    avatar: data.avatar,
    capabilities: data.capabilities
  };
};

// 模拟更新助手的API函数
const updateAssistantAPI = async (data: AssistantFormData): Promise<AssistantItem> => {
  if (!data.id) {
    throw new Error('更新助手时必须提供ID');
  }
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    avatar: data.avatar,
    capabilities: data.capabilities
  };
};

/**
 * 助手表单管理Hook
 * 
 * 管理助手创建和编辑表单的状态、验证和提交
 * 
 * @param initialData 初始表单数据，用于编辑模式
 * @param onSuccess 提交成功回调
 * @returns {object} 包含表单状态和操作方法的对象
 */
export const useAssistantForm = (
  initialData?: AssistantItem,
  onSuccess?: (assistant: AssistantItem) => void
) => {
  // 设置初始表单数据
  const defaultFormData: AssistantFormData = {
    name: '',
    description: '',
    avatar: '/assets/default-avatar.png',
    capabilities: []
  };
  
  // 状态定义
  const [formData, setFormData] = useState<AssistantFormData>(initialData ? {
    id: initialData.id,
    name: initialData.name,
    description: initialData.description || '',
    avatar: initialData.avatar || defaultFormData.avatar,
    capabilities: initialData.capabilities || []
  } : defaultFormData);
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isDirty, setIsDirty] = useState<boolean>(false);
  
  // 使用API hooks处理创建和更新
  const {
    loading: isCreating,
    error: createError,
    execute: executeCreate
  } = useAPI(createAssistantAPI, {
    onSuccess
  });
  
  const {
    loading: isUpdating,
    error: updateError,
    execute: executeUpdate
  } = useAPI(updateAssistantAPI, {
    onSuccess
  });
  
  // 组合状态
  const isSubmitting = isCreating || isUpdating;
  const error = createError || updateError;
  
  // 处理表单字段变更
  const handleChange = useCallback((field: keyof AssistantFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    
    // 清除对应字段的错误
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);
  
  // 表单验证
  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '助手名称不能为空';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = '请提供助手的简要描述';
    }
    
    if (formData.capabilities.length === 0) {
      newErrors.capabilities = '请至少选择一个助手能力';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);
  
  // 重置表单
  const resetForm = useCallback(() => {
    setFormData(initialData ? {
      id: initialData.id,
      name: initialData.name,
      description: initialData.description || '',
      avatar: initialData.avatar || defaultFormData.avatar,
      capabilities: initialData.capabilities || []
    } : defaultFormData);
    setErrors({});
    setIsDirty(false);
  }, [initialData, defaultFormData]);
  
  // 提交表单
  const submitForm = useCallback(async () => {
    if (!validateForm()) {
      return null;
    }
    
    try {
      if (formData.id) {
        // 更新现有助手
        return await executeUpdate(formData);
      } else {
        // 创建新助手
        return await executeCreate(formData);
      }
    } catch (error) {
      console.error('提交助手表单失败:', error);
      return null;
    }
  }, [formData, validateForm, executeCreate, executeUpdate]);
  
  // 当initialData变化时重置表单
  useEffect(() => {
    resetForm();
  }, [initialData, resetForm]);
  
  return {
    formData,
    errors,
    isDirty,
    isSubmitting,
    error,
    handleChange,
    validateForm,
    resetForm,
    submitForm
  };
};
