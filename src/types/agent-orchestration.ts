// 智能体编排相关类型定义

export interface AgentMetrics {
  activeAgents: number;
  totalTasks: number;
  completedTasks: number;
  errorCount: number;
  averageResponseTime: number;
}

export interface AgentStatus {
  status: 'idle' | 'running' | 'error' | 'paused';
  currentTask?: string;
  lastUpdate: string;
}

export interface IframeMessage {
  type: 'agent-orchestration';
  action: 'status-update' | 'navigation' | 'error' | 'theme-change' | 'user-action' | 'metrics-update';
  payload: {
    status?: AgentStatus;
    route?: string;
    error?: string;
    theme?: 'light' | 'dark';
    user?: any;
    metrics?: AgentMetrics;
    title?: string;
  };
  timestamp: number;
  source: 'main-app' | 'agent-orchestration';
}

export interface OrchestrationState {
  isServiceReady: boolean;
  metrics?: AgentMetrics;
  currentStatus?: AgentStatus;
  errors: string[];
  currentRoute?: string;
  lastUpdate?: string;
}