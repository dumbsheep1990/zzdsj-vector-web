import { Node, Edge, ReactFlowInstance } from '@xyflow/react';

// Agent数据结构定义
export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  type: 'agent' | 'tool' | 'application';
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  knowledgeBase?: boolean;
  webSearch?: boolean;
  imageSupport?: boolean;
  voiceSupport?: boolean;
  // 扩展字段 - 步骤和调用过程
  steps?: Array<{
    id: string;
    name: string;
    description: string;
    type: 'reasoning' | 'action' | 'api_call' | 'reflection';
  }>;
  // 扩展字段 - 工具使用详情
  tools?: Array<{
    id: string;
    name: string;
    type: string;
    description?: string;
    parameters?: Array<{
      name: string;
      type: string;
      required: boolean;
    }>;
    usage_examples?: string[];
  }>;
  // 扩展字段 - 能力和限制
  capabilities?: string[];
  limitations?: string[];
  // 扩展字段 - 执行顺序
  executionOrder?: 'sequential' | 'parallel' | 'conditional';
  // 扩展字段 - 视觉表现
  color?: string;
  icon?: string;
}

// 工具数据结构定义
export interface ToolConfig {
  id: string;
  name: string;
  type: string;
  description: string;
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
  }>;
  usage_examples?: string[];
  icon?: string;
}

// 应用数据结构定义
export interface ApplicationConfig {
  id: string;
  name: string;
  type: string;
  description: string;
  features?: string[];
  integrations?: string[];
  icon?: string;
}

// 节点数据类型定义
export interface NodeData {
  label: string;
  type: string;
  description?: string;
  config?: AgentConfig | ToolConfig | ApplicationConfig;
  nodeId?: string;
  showToolbar?: boolean;
}

// 工作流类型定义
export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: string;
  updatedAt: string;
}

// 工作流表单值类型
export interface WorkflowFormValues {
  name: string;
  description: string;
}

// 组件属性
export interface FlowEditorProps {
  workflow: Workflow | null;
  isCreateMode: boolean;
  onSave: (workflow: Workflow) => void;
  onCancel: () => void;
  renderHeaderTools?: (props: {
    handleSave: () => void;
    handleEdit: () => void;
    handleExport: () => void;
    handleImport: () => void;
    handlePublish: () => void;
    handleValidate: () => boolean;
    isValid: boolean;
    workflowName: string;
  }) => React.ReactNode;
  headerMode?: boolean; // 新增：是否为标题栏模式
}

// 节点工具条组件
export interface NodeToolbarProps {
  nodeId: string;
  onEdit: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onDuplicate: (nodeId: string) => void;
  onConnect: (nodeId: string) => void;
}

// 表单值类型
export interface FormValues {
  label: string;
  type: string;
  description: string;
}

// 添加工具引用接口
export interface ToolsRef {
  handleSave: () => void;
  handleEdit: () => void;
  handleExport: () => void;
  handleImport: () => void;
  handlePublish: () => void;
  handleValidate: () => boolean;
  isValid: boolean;
  workflowName: string;
}

// 底部工具栏接口
export interface FlowToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onLock: () => void;
  onUnlock: () => void;
  onDeleteNode: () => void;
  onClearAll: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onSave: () => void;
  onCancel: () => void;
  isLocked: boolean;
  hasSelectedNode: boolean;
  canUndo: boolean;
  canRedo: boolean;
}

// Window接口扩展
declare global {
  interface Window {
    editNode?: (nodeId: string) => void;
    deleteNode?: (nodeId: string) => void;
    duplicateNode?: (nodeId: string) => void;
    connectNode?: (nodeId: string) => void;
  }
} 