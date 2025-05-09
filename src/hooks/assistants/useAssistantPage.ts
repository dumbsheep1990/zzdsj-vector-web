import { useState, useCallback, useMemo } from 'react';
import { FormInstance, message } from 'antd';
import { AssistantType } from '../../components/modules/assistants/AssistantTypeSelector';
import { ModifiedAssistant as Assistant } from '../../components/modules/assistants';
import { useAssistantsList } from './useAssistantsList';
import { useAssistantFilter } from './useAssistantFilter';
import { useAssistantForm } from './useAssistantForm';

/**
 * 助手页面管理Hook
 * 
 * 负责助手页面的状态管理，整合了助手列表、筛选和表单等功能
 * 
 * @returns 助手页面状态和方法
 */
export const useAssistantPage = () => {
  // 模态框显示状态
  const [isTypeSelectModalVisible, setIsTypeSelectModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedAssistantType, setSelectedAssistantType] = useState<AssistantType | null>(null);
  const [currentAssistant, setCurrentAssistant] = useState<Assistant | null>(null);

  // 使用助手列表Hook
  const {
    assistants,
    isLoading,
    isDeleting,
    error,
    refreshAssistants,
    deleteAssistant,
    searchByName
  } = useAssistantsList();

  // 构建扩展后的助手列表数据
  const extendedAssistants = useMemo(() => {
    return assistants.map(item => ({
      ...item,
      status: 'online', // 默认状态设为在线
      model: 'default-model', // 默认模型
      createTime: new Date().toISOString() // 默认创建时间
    })) as Assistant[];
  }, [assistants]);

  // 使用助手筛选Hook
  const {
    filterOptions,
    filteredAssistants,
    setSearchText,
    toggleCapabilityFilter,
    clearCapabilityFilters,
    setSorting,
    resetFilters
  } = useAssistantFilter(extendedAssistants);

  // 使用助手表单Hook
  const {
    formData,
    errors,
    isDirty,
    isSubmitting,
    submitForm,
    resetForm
  } = useAssistantForm(currentAssistant || undefined, assistant => {
    message.success(
      isEditModalVisible 
        ? `助手 "${assistant.name}" 已更新` 
        : `助手 "${assistant.name}" 已创建`
    );
    handleFormCancel();
    refreshAssistants();
  });

  // 创建助手处理函数
  const handleCreate = useCallback(() => {
    setIsTypeSelectModalVisible(true);
  }, []);

  // 助手类型选择处理
  const handleTypeSelect = useCallback((type: AssistantType) => {
    setSelectedAssistantType(type);
    setIsTypeSelectModalVisible(false);
    setIsCreateModalVisible(true);
  }, []);

  // 删除助手处理
  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteAssistant(id);
      message.success('助手已删除');
    } catch (error) {
      console.error('删除助手失败:', error);
      message.error('删除失败，请重试');
    }
  }, [deleteAssistant]);

  // 状态变更处理
  const handleStatusChange = useCallback((id: string, status: 'online' | 'offline') => {
    // 实际项目中应调用API更新状态
    message.success(`${status === 'online' ? '已启用' : '已停用'}助手服务`);
    refreshAssistants();
  }, [refreshAssistants]);

  // 编辑助手处理
  const handleEdit = useCallback((assistant: Assistant) => {
    setCurrentAssistant(assistant);
    setIsEditModalVisible(true);
    // 注意：表单设置将在组件中进行
  }, []);
  
  // 用于内部使用的扩展编辑方法，包含表单设置逻辑
  const _setFormValues = useCallback((assistant: Assistant, form: FormInstance) => {
    form.setFieldsValue(assistant);
  }, []);

  // 表单提交处理
  const handleFormSubmit = useCallback(async () => {
    try {
      await submitForm();
    } catch (error) {
      console.error('提交助手表单失败:', error);
      message.error('操作失败，请重试');
    }
  }, [submitForm]);

  // 模态框关闭处理
  const handleFormCancel = useCallback(() => {
    setIsTypeSelectModalVisible(false);
    setIsCreateModalVisible(false);
    setIsEditModalVisible(false);
    setSelectedAssistantType(null);
    setCurrentAssistant(null);
    resetForm();
  }, [resetForm]);

  // 筛选状态变更处理
  const handleFilterStatusChange = useCallback((status: string | null) => {
    resetFilters();
    if (status) {
      toggleCapabilityFilter(status);
    }
  }, [resetFilters, toggleCapabilityFilter]);

  // 排序变更处理
  const handleSortOrderChange = useCallback((sortOrder: 'newest' | 'oldest' | 'alphabetical') => {
    if (sortOrder === 'alphabetical') {
      setSorting('name');
    } else if (sortOrder === 'newest') {
      setSorting('capabilities'); // 实际应使用createTime
    } else {
      setSorting('capabilities'); 
    }
  }, [setSorting]);

  // 获取助手类型标题
  const getAssistantTypeTitle = useCallback((type: AssistantType | null): string => {
    switch (type) {
      case 'regular': return '普通问答助手';
      case 'knowledge': return '知识问答助手';
      case 'planning': return '自主规划助手';
      default: return '新建助手';
    }
  }, []);

  // 遵循SOLID原则，只返回真正需要对外暴露的状态和方法
  return {
    // 数据状态
    assistants,
    filteredAssistants,
    isLoading,
    isDeleting,
    isSubmitting,
    error,
    errors,
    filterOptions,
    currentAssistant,
    
    // 模态框状态
    isTypeSelectModalVisible,
    isCreateModalVisible, 
    isEditModalVisible,
    selectedAssistantType,
    
    // 方法 - 用户交互
    handleCreate,
    handleTypeSelect,
    handleDelete,
    handleStatusChange,
    handleEdit,
    handleFormSubmit,
    handleFormCancel,
    handleFilterStatusChange,
    handleSortOrderChange,
    getAssistantTypeTitle,
    
    // 表单相关
    _setFormValues,
    
    // 搜索相关
    setSearchText
  };
};
