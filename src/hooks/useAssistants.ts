import { useState, useEffect, useCallback, useMemo } from 'react';
import { Assistant, AssistantCategory, ErrorState } from '../types/assistant';

// Mock data for development - replace with actual API calls
const mockAssistants: Assistant[] = [
  {
    id: '1',
    name: '通用对话助手',
    description: '擅长日常对话和基础问答',
    model: 'gpt-3.5-turbo',
    status: 'online',
    createTime: '2024-01-15T10:00:00Z',
    capabilities: ['对话', '问答'],
    category: AssistantCategory.BASIC_CHAT,
    avatar: '/assets/assistant1.png',
    is_active: true
  },
  {
    id: '2',
    name: '技术文档助手',
    description: '基于技术文档的专业问答',
    model: 'gpt-4',
    status: 'online',
    createTime: '2024-01-16T14:30:00Z',
    capabilities: ['文档问答', '技术支持'],
    category: AssistantCategory.KNOWLEDGE_QA,
    knowledgeBases: [
      { id: 'kb1', name: '技术文档库', documentCount: 150 }
    ],
    avatar: '/assets/assistant2.png',
    is_active: true
  },
  {
    id: '3',
    name: '智能规划助手',
    description: '具备自主规划和任务分解能力',
    model: 'gpt-4',
    status: 'online',
    createTime: '2024-01-17T09:15:00Z',
    capabilities: ['任务规划', '自主决策', '工具调用'],
    category: AssistantCategory.AUTONOMOUS_PLANNING,
    tools: ['web_search', 'calculator', 'file_manager'],
    avatar: '/assets/assistant3.png',
    is_active: true
  },
  {
    id: '4',
    name: '客服助手',
    description: '专业的客户服务对话助手',
    model: 'gpt-3.5-turbo',
    status: 'online',
    createTime: '2024-01-18T16:45:00Z',
    capabilities: ['客服对话', '问题解答'],
    category: AssistantCategory.BASIC_CHAT,
    avatar: '/assets/assistant4.png',
    is_active: true
  },
  {
    id: '5',
    name: '法律知识助手',
    description: '基于法律知识库的专业咨询',
    model: 'gpt-4',
    status: 'offline',
    createTime: '2024-01-19T11:20:00Z',
    capabilities: ['法律咨询', '条文解释'],
    category: AssistantCategory.KNOWLEDGE_QA,
    knowledgeBases: [
      { id: 'kb2', name: '法律条文库', documentCount: 500 }
    ],
    avatar: '/assets/assistant5.png',
    is_active: false
  }
];

interface UseAssistantsOptions {
  category?: AssistantCategory;
  autoFetch?: boolean;
}

interface UseAssistantsReturn {
  assistants: Assistant[];
  filteredAssistants: Assistant[];
  loading: boolean;
  error: ErrorState | null;
  fetchAssistants: (category?: AssistantCategory) => Promise<void>;
  refreshAssistants: () => Promise<void>;
  getAssistantsByCategory: (category: AssistantCategory) => Assistant[];
  getCategoryStats: () => Record<AssistantCategory, number>;
}

export function useAssistants(options: UseAssistantsOptions = {}): UseAssistantsReturn {
  const { category, autoFetch = true } = options;
  
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);

  // Simulate API call
  const fetchAssistantsAPI = useCallback(async (filterCategory?: AssistantCategory): Promise<Assistant[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate potential network error (5% chance)
    if (Math.random() < 0.05) {
      throw new Error('网络连接失败，请稍后重试');
    }
    
    let result = [...mockAssistants];
    
    // Filter by category if specified
    if (filterCategory) {
      result = result.filter(assistant => assistant.category === filterCategory);
    }
    
    return result;
  }, []);

  // Fetch assistants
  const fetchAssistants = useCallback(async (filterCategory?: AssistantCategory) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchAssistantsAPI(filterCategory);
      setAssistants(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取助手列表失败';
      setError({
        type: 'network',
        message: errorMessage,
        retryAction: () => fetchAssistants(filterCategory)
      });
    } finally {
      setLoading(false);
    }
  }, [fetchAssistantsAPI]);

  // Refresh assistants
  const refreshAssistants = useCallback(() => {
    return fetchAssistants(category);
  }, [fetchAssistants, category]);

  // Get assistants by category
  const getAssistantsByCategory = useCallback((targetCategory: AssistantCategory) => {
    return assistants.filter(assistant => assistant.category === targetCategory);
  }, [assistants]);

  // Get category statistics
  const getCategoryStats = useCallback(() => {
    const stats: Record<AssistantCategory, number> = {
      [AssistantCategory.BASIC_CHAT]: 0,
      [AssistantCategory.KNOWLEDGE_QA]: 0,
      [AssistantCategory.AUTONOMOUS_PLANNING]: 0
    };

    assistants.forEach(assistant => {
      if (assistant.is_active !== false) { // Include active and undefined
        stats[assistant.category]++;
      }
    });

    return stats;
  }, [assistants]);

  // Filtered assistants based on current category
  const filteredAssistants = useMemo(() => {
    if (!category) return assistants;
    return assistants.filter(assistant => 
      assistant.category === category && assistant.is_active !== false
    );
  }, [assistants, category]);

  // Auto-fetch on mount or category change
  useEffect(() => {
    if (autoFetch) {
      fetchAssistants(category);
    }
  }, [autoFetch, category, fetchAssistants]);

  return {
    assistants,
    filteredAssistants,
    loading,
    error,
    fetchAssistants,
    refreshAssistants,
    getAssistantsByCategory,
    getCategoryStats
  };
}