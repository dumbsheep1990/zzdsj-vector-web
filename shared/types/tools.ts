// 工具相关类型定义
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'crawler' | 'cleaner' | 'formatter' | 'generator' | 'api' | 'custom';
  tags: string[];
  icon?: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive';
  author?: string;
  version?: string;
  usage?: {
    count: number;
    lastUsed?: string;
  };
  implementation?: string; // 工具实现代码
  settings?: ToolSetting[];
  favorite?: boolean;
}

export interface ToolSetting {
  id: string;
  name: string;
  description?: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  required: boolean;
  defaultValue?: any;
  options?: Array<{
    label: string;
    value: any;
  }>;
}

export interface ToolExecution {
  id: string;
  toolId: string;
  startTime: string;
  endTime?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  input: Record<string, any>;
  output?: any;
  error?: string;
}
