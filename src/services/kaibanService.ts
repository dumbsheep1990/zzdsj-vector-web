import { useState, useEffect } from 'react';

// Kaiban Service API配置
const KAIBAN_SERVICE_URL = 'http://localhost:8003';

// 数据类型定义
export interface Workflow {
  id: string;
  name: string;
  description: string;
  version: string;
  trigger_type: 'manual' | 'scheduled' | 'event';
  status: 'draft' | 'active' | 'paused' | 'archived';
  config: Record<string, any>;
  created_at: string;
  updated_at: string;
  meta_data?: Record<string, any>;
}

export interface Board {
  id: string;
  name: string;
  description: string;
  workflow_id?: string;
  columns: string[];
  created_at: string;
  updated_at: string;
  meta_data?: Record<string, any>;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  board_id?: string;
  assignee?: string;
  tags?: string[];
  due_date?: string;
  created_at: string;
  updated_at: string;
  meta_data?: Record<string, any>;
}

export interface Event {
  id: string;
  event_type: string;
  data: Record<string, any>;
  timestamp: string;
  meta_data?: Record<string, any>;
}

export interface EventSubscription {
  id: string;
  event_type: string;
  callback_url: string;
  filters?: Record<string, any>;
  active: boolean;
  created_at: string;
}

// API错误处理
class KaibanAPIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'KaibanAPIError';
  }
}

// HTTP客户端
class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new KaibanAPIError(
        response.status, 
        `API request failed: ${response.statusText}`
      );
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Kaiban Service API客户端
class KaibanService {
  private client: APIClient;

  constructor() {
    this.client = new APIClient(KAIBAN_SERVICE_URL);
  }

  // 服务信息
  async getServiceInfo() {
    return this.client.get('/info');
  }

  async getHealthStatus() {
    return this.client.get('/health');
  }

  // 工作流管理
  async getWorkflows(): Promise<Workflow[]> {
    return this.client.get('/api/v1/workflows');
  }

  async getWorkflow(id: string): Promise<Workflow> {
    return this.client.get(`/api/v1/workflows/${id}`);
  }

  async createWorkflow(workflow: Omit<Workflow, 'id' | 'created_at' | 'updated_at'>): Promise<Workflow> {
    return this.client.post('/api/v1/workflows', workflow);
  }

  async updateWorkflow(id: string, workflow: Partial<Workflow>): Promise<Workflow> {
    return this.client.put(`/api/v1/workflows/${id}`, workflow);
  }

  async deleteWorkflow(id: string): Promise<void> {
    return this.client.delete(`/api/v1/workflows/${id}`);
  }

  // 看板管理
  async getBoards(): Promise<Board[]> {
    return this.client.get('/api/v1/boards');
  }

  async getBoard(id: string): Promise<Board> {
    return this.client.get(`/api/v1/boards/${id}`);
  }

  async createBoard(board: Omit<Board, 'id' | 'created_at' | 'updated_at'>): Promise<Board> {
    return this.client.post('/api/v1/boards', board);
  }

  async updateBoard(id: string, board: Partial<Board>): Promise<Board> {
    return this.client.put(`/api/v1/boards/${id}`, board);
  }

  async deleteBoard(id: string): Promise<void> {
    return this.client.delete(`/api/v1/boards/${id}`);
  }

  // 任务管理
  async getTasks(): Promise<Task[]> {
    return this.client.get('/api/v1/tasks');
  }

  async getTask(id: string): Promise<Task> {
    return this.client.get(`/api/v1/tasks/${id}`);
  }

  async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    return this.client.post('/api/v1/tasks', task);
  }

  async updateTask(id: string, task: Partial<Task>): Promise<Task> {
    return this.client.put(`/api/v1/tasks/${id}`, task);
  }

  async deleteTask(id: string): Promise<void> {
    return this.client.delete(`/api/v1/tasks/${id}`);
  }

  // 事件系统
  async getEvents(): Promise<Event[]> {
    return this.client.get('/api/v1/events');
  }

  async subscribeToEvent(subscription: Omit<EventSubscription, 'id' | 'created_at'>): Promise<EventSubscription> {
    return this.client.post('/api/v1/events/subscribe', subscription);
  }

  // 工作流执行
  async executeWorkflow(workflowId: string, inputData?: any): Promise<any> {
    return this.client.post(`/api/v1/workflows/${workflowId}/execute`, { input_data: inputData });
  }

  // 任务移动（拖拽操作）
  async moveTask(taskId: string, newStatus: Task['status'], boardId?: string): Promise<Task> {
    return this.client.put(`/api/v1/tasks/${taskId}`, { 
      status: newStatus,
      board_id: boardId 
    });
  }
}

// 单例实例
export const kaibanService = new KaibanService();

// React Hook for Workflows
export const useWorkflows = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      const data = await kaibanService.getWorkflows();
      setWorkflows(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workflows');
    } finally {
      setLoading(false);
    }
  };

  const createWorkflow = async (workflow: Omit<Workflow, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newWorkflow = await kaibanService.createWorkflow(workflow);
      setWorkflows(prev => [...prev, newWorkflow]);
      return newWorkflow;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create workflow');
      throw err;
    }
  };

  const updateWorkflow = async (id: string, updates: Partial<Workflow>) => {
    try {
      const updatedWorkflow = await kaibanService.updateWorkflow(id, updates);
      setWorkflows(prev => prev.map(w => w.id === id ? updatedWorkflow : w));
      return updatedWorkflow;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update workflow');
      throw err;
    }
  };

  const deleteWorkflow = async (id: string) => {
    try {
      await kaibanService.deleteWorkflow(id);
      setWorkflows(prev => prev.filter(w => w.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete workflow');
      throw err;
    }
  };

  return {
    workflows,
    loading,
    error,
    refresh: loadWorkflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow
  };
};

// React Hook for Boards
export const useBoards = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      setLoading(true);
      const data = await kaibanService.getBoards();
      setBoards(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load boards');
    } finally {
      setLoading(false);
    }
  };

  const createBoard = async (board: Omit<Board, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newBoard = await kaibanService.createBoard(board);
      setBoards(prev => [...prev, newBoard]);
      return newBoard;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create board');
      throw err;
    }
  };

  return {
    boards,
    loading,
    error,
    refresh: loadBoards,
    createBoard
  };
};

// React Hook for Tasks
export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await kaibanService.getTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newTask = await kaibanService.createTask(task);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await kaibanService.updateTask(id, updates);
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    }
  };

  const moveTask = async (taskId: string, newStatus: Task['status'], boardId?: string) => {
    try {
      const updatedTask = await kaibanService.moveTask(taskId, newStatus, boardId);
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to move task');
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    refresh: loadTasks,
    createTask,
    updateTask,
    moveTask
  };
};

export default kaibanService; 