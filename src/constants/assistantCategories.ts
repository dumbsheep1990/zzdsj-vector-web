import { MessageCircle, BookOpen, Brain } from 'lucide-react';
import { AssistantCategory, CategoryConfig } from '../types/assistant';

export const ASSISTANT_CATEGORIES: CategoryConfig[] = [
  {
    id: AssistantCategory.BASIC_CHAT,
    name: '基础对话',
    icon: MessageCircle,
    description: '通用对话助手，适用于日常交流和基础问答',
    emptyStateMessage: '暂无基础对话助手，点击创建您的第一个助手'
  },
  {
    id: AssistantCategory.KNOWLEDGE_QA,
    name: '知识库问答',
    icon: BookOpen,
    description: '基于知识库的专业问答助手',
    emptyStateMessage: '暂无知识库问答助手，创建助手来回答专业问题'
  },
  {
    id: AssistantCategory.AUTONOMOUS_PLANNING,
    name: '自主规划智能体',
    icon: Brain,
    description: '具备自主规划和决策能力的高级智能体',
    emptyStateMessage: '暂无自主规划智能体，创建智能体来处理复杂任务'
  }
];

export const getCategoryConfig = (category: AssistantCategory): CategoryConfig | undefined => {
  return ASSISTANT_CATEGORIES.find(config => config.id === category);
};

export const getCategoryName = (category: AssistantCategory): string => {
  const config = getCategoryConfig(category);
  return config?.name || category;
};

export const getCategoryIcon = (category: AssistantCategory) => {
  const config = getCategoryConfig(category);
  return config?.icon || MessageCircle;
};