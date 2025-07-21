/**
 * Workflow v2 数据结构定义
 * 与后端Schema保持一致的TypeScript接口
 * 支持Agno Workflow v2配置式界面
 */

// ================ 枚举定义 ================

export enum ModelProviderType {
  SILICONFLOW = "siliconflow",
  OPENAI = "openai",
  ANTHROPIC = "anthropic",
  CUSTOM = "custom"
}

export enum WorkflowComponentType {
  AGENT = "agent",
  MODEL = "model",
  TOOL = "tool",
  KNOWLEDGE_BASE = "knowledge_base"
}

export enum WorkflowStepType {
  AGENT_RUN = "agent_run",
  CONDITION_CHECK = "condition_check",
  DATA_TRANSFORM = "data_transform",
  PARALLEL_EXECUTION = "parallel_execution",
  LOOP = "loop",
  DELAY = "delay"
}

export enum WorkflowExecutionMode {
  SYNC = "sync",
  ASYNC = "async",
  STREAM = "stream"
}

export enum ExecutionStatus {
  PENDING = "pending",
  RUNNING = "running",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled"
}

// ================ 基础响应类型 ================

export interface BaseResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

export interface BaseDataResponse<T = any> extends BaseResponse {
  data: T;
}

// ================ 组件定义 ================

export interface WorkflowV2AgentConfig {
  id: string;
  name: string;
  description?: string;
  model_name: string;
  instructions: string;
  tools?: string[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  
  // 前端UI相关属性
  position?: { x: number; y: number };
  color?: string;
  icon?: string;
  expanded?: boolean;
}

export interface WorkflowV2ModelConfig {
  id: string;
  name: string;
  provider: ModelProviderType;
  model_id: string;
  config?: Record<string, any>;
  
  // 前端UI相关属性
  is_default?: boolean;
  pricing?: {
    input: number;
    output: number;
  };
}

export interface WorkflowV2ToolConfig {
  id: string;
  name: string;
  type: string;
  config?: Record<string, any>;
  
  // 前端UI相关属性
  description?: string;
  icon?: string;
  enabled?: boolean;
}

export interface WorkflowV2Components {
  agents: WorkflowV2AgentConfig[];
  models: WorkflowV2ModelConfig[];
  tools: WorkflowV2ToolConfig[];
  knowledge_bases: string[];
}

// ================ 逻辑定义 ================

export interface WorkflowV2Step {
  id: string;
  name: string;
  type: WorkflowStepType;
  component_ref?: string;
  config?: Record<string, any>;
  dependencies?: string[];
  
  // 前端UI相关属性
  position?: { x: number; y: number };
  enabled?: boolean;
  expanded?: boolean;
  error_message?: string;
}

export interface WorkflowV2ConditionalBranch {
  id: string;
  condition: string;
  true_path: string[];
  false_path: string[];
  description?: string;
  
  // 前端UI相关属性
  position?: { x: number; y: number };
}

export interface WorkflowV2Logic {
  steps: WorkflowV2Step[];
  conditions?: WorkflowV2ConditionalBranch[];
  variables?: Record<string, any>;
  
  // 执行配置
  max_concurrent_steps?: number;
  timeout?: number;
}

// ================ 工作流配置 ================

export interface WorkflowV2Config {
  id?: string;
  name: string;
  description?: string;
  version?: string;
  
  // 核心组件
  components: WorkflowV2Components;
  logic: WorkflowV2Logic;
  
  // 元数据
  metadata?: Record<string, any>;
  tags?: string[];
  category?: string;
  
  // 执行配置
  execution_mode?: WorkflowExecutionMode;
  
  // 时间戳
  created_at?: string;
  updated_at?: string;
  
  // 前端UI状态
  ui_state?: {
    canvas_position?: { x: number; y: number; zoom: number };
    sidebar_collapsed?: boolean;
    active_tab?: string;
    selected_step?: string;
    preview_mode?: boolean;
  };
}

// ================ 执行相关 ================

export interface WorkflowV2ExecutionRequest {
  input_data: Record<string, any>;
  execution_mode?: WorkflowExecutionMode;
  stream?: boolean;
  timeout?: number;
  callback_url?: string;
}

export interface WorkflowV2ExecutionResult {
  execution_id: string;
  workflow_id: string;
  status: ExecutionStatus;
  result?: any;
  error?: string;
  
  // 时间信息
  start_time?: string;
  end_time?: string;
  duration?: number;
  
  // 执行详情
  steps_results?: Record<string, any>;
  execution_log?: string[];
  
  // 元数据
  metadata?: Record<string, any>;
}

export interface WorkflowV2StreamingResponse {
  event_type: string;
  step_id?: string;
  content?: any;
  metadata?: Record<string, any>;
  timestamp: string;
}

// ================ 代码生成相关 ================

export interface WorkflowV2CodeGenerationRequest {
  include_comments?: boolean;
  include_validation?: boolean;
  format_style?: string;
}

export interface WorkflowV2CodeGenerationResult {
  workflow_id: string;
  generated_code: string;
  validation_result: {
    syntax_valid: boolean;
    siliconflow_compliant: boolean;
    warnings: string[];
    errors: string[];
  };
  file_path?: string;
  generated_at: string;
}

// ================ 管理相关 ================

export interface WorkflowV2ListRequest {
  page?: number;
  size?: number;
  category?: string;
  tags?: string[];
  search?: string;
  sort_by?: string;
  sort_order?: string;
}

export interface WorkflowV2Summary {
  id: string;
  name: string;
  description?: string;
  version: string;
  category: string;
  tags: string[];
  
  // 统计信息
  agent_count: number;
  step_count: number;
  
  // 状态信息
  status: string;
  last_execution_time?: string;
  
  // 时间戳
  created_at?: string;
  updated_at?: string;
}

export interface WorkflowV2ListResponse {
  workflows: WorkflowV2Summary[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// ================ 前端专用类型 ================

export interface WorkflowV2ConfigFormData {
  // 基本信息
  name: string;
  description: string;
  category: string;
  tags: string[];
  
  // 当前编辑状态
  current_step?: string;
  dirty?: boolean;
  validation_errors?: Record<string, string[]>;
}

export interface WorkflowV2UIState {
  // 界面状态
  active_tab: 'config' | 'components' | 'logic' | 'code' | 'test';
  sidebar_collapsed: boolean;
  preview_mode: boolean;
  
  // 选择状态
  selected_agent?: string;
  selected_step?: string;
  selected_tool?: string;
  
  // 编辑状态
  editing_component?: string;
  dragging_component?: string;
  
  // 代码预览
  code_preview_visible: boolean;
  code_generation_loading: boolean;
  
  // 测试执行
  test_input_data?: Record<string, any>;
  test_execution_id?: string;
  test_execution_status?: ExecutionStatus;
}

// ================ 可用资源类型 ================

export interface AvailableModel {
  model_id: string;
  model_name: string;
  model_type: string;
  description: string;
  max_tokens: number;
  context_window: number;
  supports_streaming: boolean;
  supports_function_calling: boolean;
  pricing: {
    input: number;
    output: number;
  };
}

export interface AvailableTool {
  id: string;
  name: string;
  description: string;
  type: string;
  icon?: string;
}

export interface AvailableModelsResponse {
  models: AvailableModel[];
  default_chat_model: string;
  default_embedding_model: string;
  default_rerank_model: string;
}

export interface AvailableToolsResponse {
  tools: AvailableTool[];
}

// ================ 表单验证类型 ================

export interface ValidationRule {
  required?: boolean;
  min_length?: number;
  max_length?: number;
  pattern?: string;
  custom?: (value: any) => string | null;
}

export interface ValidationSchema {
  [field: string]: ValidationRule;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string[]>;
  warnings: Record<string, string[]>;
}

// ================ 步骤配置类型 ================

export interface StepConfigProps {
  step: WorkflowV2Step;
  available_components: WorkflowV2Components;
  onChange: (step: WorkflowV2Step) => void;
  onDelete: () => void;
}

export interface AgentConfigProps {
  agent: WorkflowV2AgentConfig;
  available_models: AvailableModel[];
  available_tools: AvailableTool[];
  onChange: (agent: WorkflowV2AgentConfig) => void;
  onDelete: () => void;
}

// ================ 导出配置类型 ================

export interface WorkflowV2ExportOptions {
  include_dependencies?: boolean;
  format: 'json' | 'yaml' | 'python';
  compression?: 'none' | 'zip' | 'gzip';
}

export interface WorkflowV2ImportOptions {
  override_existing?: boolean;
  validate_dependencies?: boolean;
  auto_fix_errors?: boolean;
}

// ================ 模板类型 ================

export interface WorkflowV2Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  config: WorkflowV2Config;
  
  // 模板信息
  author?: string;
  version: string;
  created_at: string;
  usage_count?: number;
  rating?: number;
  
  // 前端显示
  thumbnail?: string;
  featured?: boolean;
}

export interface WorkflowV2TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  templates: WorkflowV2Template[];
}

// ================ API客户端类型 ================

export interface WorkflowV2ApiClient {
  // 工作流管理
  createWorkflow: (config: WorkflowV2Config) => Promise<BaseDataResponse<{ workflow_id: string }>>;
  getWorkflow: (id: string) => Promise<BaseDataResponse<WorkflowV2Config>>;
  updateWorkflow: (id: string, updates: Partial<WorkflowV2Config>) => Promise<BaseDataResponse<WorkflowV2Config>>;
  deleteWorkflow: (id: string) => Promise<BaseDataResponse<{ workflow_id: string }>>;
  listWorkflows: (request?: WorkflowV2ListRequest) => Promise<BaseDataResponse<WorkflowV2ListResponse>>;
  
  // 执行管理
  executeWorkflow: (id: string, request: WorkflowV2ExecutionRequest) => Promise<BaseDataResponse<WorkflowV2ExecutionResult>>;
  getExecutionResult: (workflowId: string, executionId: string) => Promise<BaseDataResponse<WorkflowV2ExecutionResult>>;
  streamExecution: (workflowId: string, executionId: string) => AsyncGenerator<WorkflowV2StreamingResponse>;
  
  // 代码生成
  getWorkflowCode: (id: string, includeComments?: boolean) => Promise<BaseDataResponse<WorkflowV2CodeGenerationResult>>;
  regenerateWorkflowCode: (id: string, request?: WorkflowV2CodeGenerationRequest) => Promise<BaseDataResponse<WorkflowV2CodeGenerationResult>>;
  
  // 资源管理
  getAvailableModels: () => Promise<BaseDataResponse<AvailableModelsResponse>>;
  getAvailableTools: () => Promise<BaseDataResponse<AvailableToolsResponse>>;
}

// ================ 默认值配置 ================

export const DEFAULT_WORKFLOW_V2_CONFIG: Partial<WorkflowV2Config> = {
  version: "1.0",
  category: "custom",
  tags: [],
  execution_mode: WorkflowExecutionMode.ASYNC,
  components: {
    agents: [],
    models: [],
    tools: [],
    knowledge_bases: []
  },
  logic: {
    steps: [],
    conditions: [],
    variables: {},
    max_concurrent_steps: 5,
    timeout: 300
  },
  metadata: {},
  ui_state: {
    canvas_position: { x: 0, y: 0, zoom: 1 },
    sidebar_collapsed: false,
    active_tab: "config",
    preview_mode: false
  }
};

export const DEFAULT_AGENT_CONFIG: Partial<WorkflowV2AgentConfig> = {
  temperature: 0.7,
  max_tokens: 4096,
  top_p: 0.9,
  tools: [],
  expanded: true
};

export const DEFAULT_UI_STATE: WorkflowV2UIState = {
  active_tab: 'config',
  sidebar_collapsed: false,
  preview_mode: false,
  code_preview_visible: false,
  code_generation_loading: false
};

// ================ 工具函数类型 ================

export type WorkflowV2ConfigValidator = (config: WorkflowV2Config) => ValidationResult;
export type WorkflowV2Transformer = (config: WorkflowV2Config) => WorkflowV2Config;
export type WorkflowV2CodeGenerator = (config: WorkflowV2Config) => Promise<string>;

// ================ 事件类型 ================

export interface WorkflowV2Events {
  'config_changed': WorkflowV2Config;
  'component_added': { type: WorkflowComponentType; component: any };
  'component_removed': { type: WorkflowComponentType; id: string };
  'step_added': WorkflowV2Step;
  'step_removed': string;
  'execution_started': { workflow_id: string; execution_id: string };
  'execution_completed': WorkflowV2ExecutionResult;
  'code_generated': WorkflowV2CodeGenerationResult;
  'validation_error': ValidationResult;
}

export type WorkflowV2EventListener<T extends keyof WorkflowV2Events> = (data: WorkflowV2Events[T]) => void; 