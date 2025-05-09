import { useState, useCallback, useMemo } from 'react';
import { message } from 'antd';
import { PromptTemplate } from './usePromptTemplates';

// 定义变量定义类型
export interface PromptVariable {
  name: string;
  description: string;
  defaultValue?: string;
  required: boolean;
}

// 定义编辑器状态
export interface EditorState {
  title: string;
  content: string;
  description: string;
  category: string;
  tags: string[];
  variables: PromptVariable[];
  isPublic: boolean;
}

// 变量提取模式
const VARIABLE_PATTERN = /{{([^{}]+)}}/g;

/**
 * 提示词编辑器Hook
 * 
 * 负责提示词模板的编辑、预览和变量管理
 * 
 * @param initialTemplate 可选的初始模板
 * @returns {object} 包含编辑器状态和方法的对象
 */
export const usePromptEditor = (initialTemplate?: PromptTemplate) => {
  // 编辑器状态
  const [editorState, setEditorState] = useState<EditorState>(() => {
    if (initialTemplate) {
      return {
        title: initialTemplate.title,
        content: initialTemplate.content,
        description: initialTemplate.description,
        category: initialTemplate.category,
        tags: [...initialTemplate.tags],
        variables: [...initialTemplate.variables],
        isPublic: initialTemplate.isPublic
      };
    }
    
    return {
      title: '',
      content: '',
      description: '',
      category: '',
      tags: [],
      variables: [],
      isPublic: true
    };
  });
  
  // 预览数据
  const [previewData, setPreviewData] = useState<Record<string, string>>({});
  
  // 是否有未保存的更改
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // 当前激活的标签页
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'variables'>('editor');
  
  // 标记变更状态
  const markAsChanged = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);
  
  // 重置状态
  const resetEditor = useCallback((template?: PromptTemplate) => {
    if (template) {
      setEditorState({
        title: template.title,
        content: template.content,
        description: template.description,
        category: template.category,
        tags: [...template.tags],
        variables: [...template.variables],
        isPublic: template.isPublic
      });
    } else {
      setEditorState({
        title: '',
        content: '',
        description: '',
        category: '',
        tags: [],
        variables: [],
        isPublic: true
      });
    }
    
    setPreviewData({});
    setHasUnsavedChanges(false);
  }, []);
  
  // 更新标题
  const updateTitle = useCallback((title: string) => {
    setEditorState(prev => ({
      ...prev,
      title
    }));
    markAsChanged();
  }, [markAsChanged]);
  
  // 更新内容
  const updateContent = useCallback((content: string) => {
    setEditorState(prev => ({
      ...prev,
      content
    }));
    markAsChanged();
  }, [markAsChanged]);
  
  // 更新描述
  const updateDescription = useCallback((description: string) => {
    setEditorState(prev => ({
      ...prev,
      description
    }));
    markAsChanged();
  }, [markAsChanged]);
  
  // 更新分类
  const updateCategory = useCallback((category: string) => {
    setEditorState(prev => ({
      ...prev,
      category
    }));
    markAsChanged();
  }, [markAsChanged]);
  
  // 更新标签
  const updateTags = useCallback((tags: string[]) => {
    setEditorState(prev => ({
      ...prev,
      tags
    }));
    markAsChanged();
  }, [markAsChanged]);
  
  // 添加标签
  const addTag = useCallback((tag: string) => {
    setEditorState(prev => {
      // 避免添加重复标签
      if (prev.tags.includes(tag)) {
        return prev;
      }
      
      return {
        ...prev,
        tags: [...prev.tags, tag]
      };
    });
    markAsChanged();
  }, [markAsChanged]);
  
  // 移除标签
  const removeTag = useCallback((tagToRemove: string) => {
    setEditorState(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
    markAsChanged();
  }, [markAsChanged]);
  
  // 更新公开状态
  const updatePublicStatus = useCallback((isPublic: boolean) => {
    setEditorState(prev => ({
      ...prev,
      isPublic
    }));
    markAsChanged();
  }, [markAsChanged]);
  
  // 解析内容中的变量
  const parseVariables = useCallback(() => {
    const content = editorState.content;
    const existingVariables = new Set(editorState.variables.map(v => v.name));
    const variableMatches = content.matchAll(VARIABLE_PATTERN);
    const newVariables: string[] = [];
    
    // 找出内容中的所有变量
    for (const match of variableMatches) {
      const varName = match[1].trim();
      if (!existingVariables.has(varName) && !newVariables.includes(varName)) {
        newVariables.push(varName);
      }
    }
    
    // 添加新变量
    if (newVariables.length > 0) {
      setEditorState(prev => ({
        ...prev,
        variables: [
          ...prev.variables,
          ...newVariables.map(name => ({
            name,
            description: '',
            required: true
          }))
        ]
      }));
      
      message.success(`已添加 ${newVariables.length} 个变量`);
      markAsChanged();
      return true;
    }
    
    message.info('未找到新的变量');
    return false;
  }, [editorState.content, editorState.variables, markAsChanged]);
  
  // 添加变量
  const addVariable = useCallback((variable: PromptVariable) => {
    setEditorState(prev => {
      // 避免添加重复变量
      if (prev.variables.some(v => v.name === variable.name)) {
        message.warning(`变量 ${variable.name} 已存在`);
        return prev;
      }
      
      return {
        ...prev,
        variables: [...prev.variables, variable]
      };
    });
    markAsChanged();
  }, [markAsChanged]);
  
  // 更新变量
  const updateVariable = useCallback((index: number, variable: Partial<PromptVariable>) => {
    setEditorState(prev => {
      if (index < 0 || index >= prev.variables.length) {
        return prev;
      }
      
      const newVariables = [...prev.variables];
      newVariables[index] = {
        ...newVariables[index],
        ...variable
      };
      
      return {
        ...prev,
        variables: newVariables
      };
    });
    markAsChanged();
  }, [markAsChanged]);
  
  // 移除变量
  const removeVariable = useCallback((index: number) => {
    setEditorState(prev => {
      if (index < 0 || index >= prev.variables.length) {
        return prev;
      }
      
      const newVariables = [...prev.variables];
      const removedVar = newVariables[index];
      newVariables.splice(index, 1);
      
      // 检查变量是否在内容中使用，如果是则提醒用户
      if (prev.content.includes(`{{${removedVar.name}}}`)) {
        message.warning(`变量 ${removedVar.name} 在内容中被使用，请确保更新内容`);
      }
      
      return {
        ...prev,
        variables: newVariables
      };
    });
    markAsChanged();
  }, [markAsChanged]);
  
  // 设置预览数据
  const setVariablePreviewData = useCallback((data: Record<string, string>) => {
    setPreviewData(data);
  }, []);
  
  // 更新单个变量的预览值
  const updateVariablePreviewValue = useCallback((variableName: string, value: string) => {
    setPreviewData(prev => ({
      ...prev,
      [variableName]: value
    }));
  }, []);
  
  // 生成预览内容
  const previewContent = useMemo(() => {
    let content = editorState.content;
    
    // 替换变量
    editorState.variables.forEach(variable => {
      const value = previewData[variable.name] || variable.defaultValue || `[${variable.name}]`;
      const pattern = new RegExp(`{{${variable.name}}}`, 'g');
      content = content.replace(pattern, value);
    });
    
    return content;
  }, [editorState.content, editorState.variables, previewData]);
  
  // 验证所有必填字段
  const validatePrompt = useCallback((): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!editorState.title.trim()) {
      errors.push('标题不能为空');
    }
    
    if (!editorState.content.trim()) {
      errors.push('内容不能为空');
    }
    
    if (!editorState.category.trim()) {
      errors.push('分类不能为空');
    }
    
    // 检查是否有未被定义的变量
    const contentVariables = Array.from(editorState.content.matchAll(VARIABLE_PATTERN))
      .map(match => match[1].trim());
    
    const definedVariables = new Set(editorState.variables.map(v => v.name));
    const undefinedVariables = contentVariables.filter(v => !definedVariables.has(v));
    
    if (undefinedVariables.length > 0) {
      errors.push(`发现未定义的变量: ${undefinedVariables.join(', ')}`);
    }
    
    // 检查是否有定义但未使用的变量
    const unusedVariables = editorState.variables
      .filter(v => !contentVariables.includes(v.name))
      .map(v => v.name);
    
    if (unusedVariables.length > 0) {
      errors.push(`发现未使用的变量: ${unusedVariables.join(', ')}`);
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }, [editorState]);
  
  // 获取当前编辑器数据（用于提交）
  const getFormData = useCallback(() => {
    return {
      title: editorState.title,
      content: editorState.content,
      description: editorState.description,
      category: editorState.category,
      tags: editorState.tags,
      variables: editorState.variables,
      isPublic: editorState.isPublic
    };
  }, [editorState]);
  
  // 插入变量
  const insertVariable = useCallback((variableName: string, cursorPosition: number) => {
    const content = editorState.content;
    const newContent = 
      content.substring(0, cursorPosition) + 
      `{{${variableName}}}` + 
      content.substring(cursorPosition);
    
    updateContent(newContent);
    return cursorPosition + variableName.length + 4; // 返回新的光标位置（+4是因为{{}}）
  }, [editorState.content, updateContent]);
  
  // 导入模板
  const importTemplate = useCallback((template: PromptTemplate) => {
    resetEditor(template);
    message.success('模板已导入');
  }, [resetEditor]);
  
  // 检查是否有未定义的变量
  const checkUndefinedVariables = useCallback((): string[] => {
    const contentVariables = Array.from(editorState.content.matchAll(VARIABLE_PATTERN))
      .map(match => match[1].trim());
    
    const definedVariables = new Set(editorState.variables.map(v => v.name));
    return contentVariables.filter(v => !definedVariables.has(v));
  }, [editorState.content, editorState.variables]);
  
  return {
    // 编辑器状态
    editorState,
    hasUnsavedChanges,
    activeTab,
    previewData,
    previewContent,
    
    // 基本编辑方法
    updateTitle,
    updateContent,
    updateDescription,
    updateCategory,
    updateTags,
    addTag,
    removeTag,
    updatePublicStatus,
    
    // 变量管理
    parseVariables,
    addVariable,
    updateVariable,
    removeVariable,
    setVariablePreviewData,
    updateVariablePreviewValue,
    insertVariable,
    checkUndefinedVariables,
    
    // 表单管理
    validatePrompt,
    getFormData,
    resetEditor,
    importTemplate,
    
    // UI状态管理
    setActiveTab
  };
};
