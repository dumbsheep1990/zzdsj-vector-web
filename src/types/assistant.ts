export interface KnowledgeBase {
  id: string;
  name: string;
  documentCount: number;
}

export interface UsageStats {
  totalChats: number;
  satisfactionRate: number;
}

export enum AssistantCategory {
  BASIC_CHAT = 'basic_chat',
  KNOWLEDGE_QA = 'knowledge_qa',
  AUTONOMOUS_PLANNING = 'autonomous_planning'
}

export interface ModelConfig {
  provider: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  [key: string]: any;
}

export interface Assistant {
  id: string;
  name: string;
  description: string;
  model: string;
  status: 'online' | 'offline';
  createTime: string;
  capabilities: string[];
  knowledgeBases?: KnowledgeBase[];
  usageStats?: UsageStats;
  // Enhanced fields for categorization
  category: AssistantCategory;
  agent_type?: string; // For backward compatibility
  avatar?: string;
  model_config?: ModelConfig;
  tools?: string[];
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

export interface CategoryConfig {
  id: AssistantCategory;
  name: string;
  icon: any; // LucideIcon type
  description: string;
  emptyStateMessage: string;
}

export interface AssistantCategoryTabsProps {
  activeCategory: AssistantCategory;
  onCategoryChange: (category: AssistantCategory) => void;
  className?: string;
}

export interface AssistantCardProps {
  assistant: Assistant;
  category: AssistantCategory;
  onSelect: (assistant: Assistant) => void;
  showCategoryBadge?: boolean;
}

export interface AssistantGridProps {
  assistants: Assistant[];
  category: AssistantCategory;
  loading: boolean;
  onAssistantSelect: (assistant: Assistant) => void;
}

export interface ErrorState {
  type: 'network' | 'empty' | 'invalid_category';
  message: string;
  retryAction?: () => void;
}
