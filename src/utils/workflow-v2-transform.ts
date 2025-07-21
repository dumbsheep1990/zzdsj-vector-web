/**
 * Workflow v2 数据转换工具
 * 处理前后端数据格式转换，确保一致性
 */

import {
  WorkflowV2Config,
  WorkflowV2AgentConfig,
  WorkflowV2Step,
  WorkflowV2Components,
  WorkflowV2Logic,
  ModelProviderType,
  WorkflowStepType,
  WorkflowExecutionMode,
  DEFAULT_WORKFLOW_V2_CONFIG,
  DEFAULT_AGENT_CONFIG
} from '../types/workflow-v2';

// ================ 前后端字段映射 ================

interface BackendWorkflowConfig {
  id?: string;
  name: string;
  description?: string;
  version?: string;
  components: {
    agents: BackendAgentConfig[];
    models: any[];
    tools: any[];
    knowledge_bases: string[];
  };
  logic: {
    steps: BackendStepConfig[];
    conditions?: any[];
    variables?: Record<string, any>;
    max_concurrent_steps?: number;
    timeout?: number;
  };
  metadata?: Record<string, any>;
  tags?: string[];
  category?: string;
  execution_mode?: string;
  created_at?: string;
  updated_at?: string;
}

interface BackendAgentConfig {
  id: string;
  name: string;
  description?: string;
  model_name: string;
  instructions: string;
  tools?: string[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
}

interface BackendStepConfig {
  id: string;
  name: string;
  type: string;
  component_ref?: string;
  config?: Record<string, any>;
  dependencies?: string[];
  enabled?: boolean;
}

// ================ 前端到后端转换 ================

export function toBackendConfig(frontendConfig: WorkflowV2Config): BackendWorkflowConfig {
  return {
    id: frontendConfig.id,
    name: frontendConfig.name,
    description: frontendConfig.description || '',
    version: frontendConfig.version || '1.0',
    components: {
      agents: frontendConfig.components.agents.map(toBackendAgent),
      models: frontendConfig.components.models || [],
      tools: frontendConfig.components.tools || [],
      knowledge_bases: frontendConfig.components.knowledge_bases || []
    },
    logic: {
      steps: frontendConfig.logic.steps.map(toBackendStep),
      conditions: frontendConfig.logic.conditions || [],
      variables: frontendConfig.logic.variables || {},
      max_concurrent_steps: frontendConfig.logic.max_concurrent_steps || 5,
      timeout: frontendConfig.logic.timeout || 300
    },
    metadata: frontendConfig.metadata || {},
    tags: frontendConfig.tags || [],
    category: frontendConfig.category || 'custom',
    execution_mode: frontendConfig.execution_mode || WorkflowExecutionMode.ASYNC,
    created_at: frontendConfig.created_at,
    updated_at: frontendConfig.updated_at
  };
}

export function toBackendAgent(frontendAgent: WorkflowV2AgentConfig): BackendAgentConfig {
  return {
    id: frontendAgent.id,
    name: frontendAgent.name,
    description: frontendAgent.description || '',
    model_name: frontendAgent.model_name,
    instructions: frontendAgent.instructions,
    tools: frontendAgent.tools || [],
    temperature: frontendAgent.temperature ?? 0.7,
    max_tokens: frontendAgent.max_tokens ?? 4096,
    top_p: frontendAgent.top_p ?? 0.9
  };
}

export function toBackendStep(frontendStep: WorkflowV2Step): BackendStepConfig {
  return {
    id: frontendStep.id,
    name: frontendStep.name,
    type: frontendStep.type,
    component_ref: frontendStep.component_ref,
    config: frontendStep.config || {},
    dependencies: frontendStep.dependencies || [],
    enabled: frontendStep.enabled ?? true
  };
}

// ================ 后端到前端转换 ================

export function fromBackendConfig(backendConfig: BackendWorkflowConfig): WorkflowV2Config {
  return {
    id: backendConfig.id,
    name: backendConfig.name,
    description: backendConfig.description || '',
    version: backendConfig.version || '1.0',
    components: {
      agents: (backendConfig.components.agents || []).map(fromBackendAgent),
      models: backendConfig.components.models || [],
      tools: backendConfig.components.tools || [],
      knowledge_bases: backendConfig.components.knowledge_bases || []
    },
    logic: {
      steps: (backendConfig.logic.steps || []).map(fromBackendStep),
      conditions: backendConfig.logic.conditions || [],
      variables: backendConfig.logic.variables || {},
      max_concurrent_steps: backendConfig.logic.max_concurrent_steps || 5,
      timeout: backendConfig.logic.timeout || 300
    },
    metadata: backendConfig.metadata || {},
    tags: backendConfig.tags || [],
    category: backendConfig.category || 'custom',
    execution_mode: (backendConfig.execution_mode as WorkflowExecutionMode) || WorkflowExecutionMode.ASYNC,
    created_at: backendConfig.created_at,
    updated_at: backendConfig.updated_at,
    // 添加默认UI状态
    ui_state: {
      canvas_position: { x: 0, y: 0, zoom: 1 },
      sidebar_collapsed: false,
      active_tab: "config",
      preview_mode: false
    }
  };
}

export function fromBackendAgent(backendAgent: BackendAgentConfig): WorkflowV2AgentConfig {
  return {
    id: backendAgent.id,
    name: backendAgent.name,
    description: backendAgent.description || '',
    model_name: backendAgent.model_name,
    instructions: backendAgent.instructions,
    tools: backendAgent.tools || [],
    temperature: backendAgent.temperature ?? 0.7,
    max_tokens: backendAgent.max_tokens ?? 4096,
    top_p: backendAgent.top_p ?? 0.9,
    // 添加前端UI属性
    expanded: true,
    position: { x: 0, y: 0 }
  };
}

export function fromBackendStep(backendStep: BackendStepConfig): WorkflowV2Step {
  return {
    id: backendStep.id,
    name: backendStep.name,
    type: backendStep.type as WorkflowStepType,
    component_ref: backendStep.component_ref,
    config: backendStep.config || {},
    dependencies: backendStep.dependencies || [],
    // 添加前端UI属性
    enabled: backendStep.enabled ?? true,
    expanded: true,
    position: { x: 0, y: 0 }
  };
}

// ================ 数据规范化 ================

export function normalizeWorkflowConfig(config: Partial<WorkflowV2Config>): WorkflowV2Config {
  const normalized: WorkflowV2Config = {
    ...DEFAULT_WORKFLOW_V2_CONFIG,
    ...config,
    components: {
      agents: [],
      models: [],
      tools: [],
      knowledge_bases: [],
      ...config.components
    },
    logic: {
      steps: [],
      conditions: [],
      variables: {},
      max_concurrent_steps: 5,
      timeout: 300,
      ...config.logic
    }
  } as WorkflowV2Config;

  // 确保必填字段
  if (!normalized.name) {
    normalized.name = '未命名工作流';
  }

  // 规范化智能体配置
  normalized.components.agents = normalized.components.agents.map(agent => ({
    ...DEFAULT_AGENT_CONFIG,
    ...agent,
    id: agent.id || generateId('agent'),
    tools: agent.tools || []
  })) as WorkflowV2AgentConfig[];

  // 规范化步骤配置
  normalized.logic.steps = normalized.logic.steps.map(step => ({
    ...step,
    id: step.id || generateId('step'),
    dependencies: step.dependencies || [],
    config: step.config || {},
    enabled: step.enabled ?? true
  }));

  return normalized;
}

export function normalizeAgentConfig(agent: Partial<WorkflowV2AgentConfig>): WorkflowV2AgentConfig {
  return {
    ...DEFAULT_AGENT_CONFIG,
    ...agent,
    id: agent.id || generateId('agent'),
    name: agent.name || '新智能体',
    model_name: agent.model_name || 'Qwen/Qwen3-32B',
    instructions: agent.instructions || '你是一个有用的助手。',
    tools: agent.tools || [],
    temperature: agent.temperature ?? 0.7,
    max_tokens: agent.max_tokens ?? 4096,
    top_p: agent.top_p ?? 0.9
  } as WorkflowV2AgentConfig;
}

export function normalizeStepConfig(step: Partial<WorkflowV2Step>): WorkflowV2Step {
  return {
    id: step.id || generateId('step'),
    name: step.name || '新步骤',
    type: step.type || WorkflowStepType.AGENT_RUN,
    component_ref: step.component_ref,
    config: step.config || {},
    dependencies: step.dependencies || [],
    enabled: step.enabled ?? true,
    expanded: step.expanded ?? true
  };
}

// ================ ID生成工具 ================

export function generateId(prefix: string = 'item'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}_${timestamp}_${random}`;
}

export function generateUniqueId(existingIds: string[], prefix: string = 'item'): string {
  let id = generateId(prefix);
  let counter = 1;
  
  while (existingIds.includes(id)) {
    id = `${generateId(prefix)}_${counter}`;
    counter++;
  }
  
  return id;
}

// ================ 数据克隆工具 ================

export function cloneWorkflowConfig(config: WorkflowV2Config): WorkflowV2Config {
  return JSON.parse(JSON.stringify(config));
}

export function cloneAgent(agent: WorkflowV2AgentConfig, newId?: string): WorkflowV2AgentConfig {
  const cloned = JSON.parse(JSON.stringify(agent));
  if (newId) {
    cloned.id = newId;
    cloned.name = `${cloned.name} (副本)`;
  }
  return cloned;
}

export function cloneStep(step: WorkflowV2Step, newId?: string): WorkflowV2Step {
  const cloned = JSON.parse(JSON.stringify(step));
  if (newId) {
    cloned.id = newId;
    cloned.name = `${cloned.name} (副本)`;
    cloned.dependencies = []; // 清空依赖关系
  }
  return cloned;
}

// ================ 数据合并工具 ================

export function mergeWorkflowConfig(
  base: WorkflowV2Config, 
  updates: Partial<WorkflowV2Config>
): WorkflowV2Config {
  const merged = cloneWorkflowConfig(base);
  
  // 合并基本字段
  Object.keys(updates).forEach(key => {
    if (key !== 'components' && key !== 'logic') {
      (merged as any)[key] = (updates as any)[key];
    }
  });
  
  // 合并组件
  if (updates.components) {
    if (updates.components.agents) {
      merged.components.agents = updates.components.agents;
    }
    if (updates.components.models) {
      merged.components.models = updates.components.models;
    }
    if (updates.components.tools) {
      merged.components.tools = updates.components.tools;
    }
    if (updates.components.knowledge_bases) {
      merged.components.knowledge_bases = updates.components.knowledge_bases;
    }
  }
  
  // 合并逻辑
  if (updates.logic) {
    merged.logic = {
      ...merged.logic,
      ...updates.logic
    };
  }
  
  return merged;
}

// ================ 数据导出工具 ================

export function exportToJson(config: WorkflowV2Config): string {
  const exportData = {
    ...toBackendConfig(config),
    export_version: '1.0',
    export_time: new Date().toISOString()
  };
  
  return JSON.stringify(exportData, null, 2);
}

export function importFromJson(jsonString: string): WorkflowV2Config {
  try {
    const data = JSON.parse(jsonString);
    
    // 移除导出特有字段
    delete data.export_version;
    delete data.export_time;
    
    return normalizeWorkflowConfig(fromBackendConfig(data));
  } catch (error) {
    throw new Error(`JSON解析失败: ${error}`);
  }
}

// ================ 数据比较工具 ================

export function compareWorkflowConfigs(
  config1: WorkflowV2Config, 
  config2: WorkflowV2Config
): {
  identical: boolean;
  differences: string[];
  changes: Record<string, { old: any; new: any }>;
} {
  const differences: string[] = [];
  const changes: Record<string, { old: any; new: any }> = {};
  
  // 比较基本字段
  const basicFields = ['name', 'description', 'version', 'category'];
  basicFields.forEach(field => {
    if ((config1 as any)[field] !== (config2 as any)[field]) {
      differences.push(`${field}字段不同`);
      changes[field] = {
        old: (config1 as any)[field],
        new: (config2 as any)[field]
      };
    }
  });
  
  // 比较智能体数量
  if (config1.components.agents.length !== config2.components.agents.length) {
    differences.push('智能体数量不同');
    changes.agent_count = {
      old: config1.components.agents.length,
      new: config2.components.agents.length
    };
  }
  
  // 比较步骤数量
  if (config1.logic.steps.length !== config2.logic.steps.length) {
    differences.push('步骤数量不同');
    changes.step_count = {
      old: config1.logic.steps.length,
      new: config2.logic.steps.length
    };
  }
  
  // 比较标签
  const tags1 = new Set(config1.tags || []);
  const tags2 = new Set(config2.tags || []);
  const tagsEqual = tags1.size === tags2.size && [...tags1].every(tag => tags2.has(tag));
  
  if (!tagsEqual) {
    differences.push('标签不同');
    changes.tags = {
      old: config1.tags,
      new: config2.tags
    };
  }
  
  return {
    identical: differences.length === 0,
    differences,
    changes
  };
}

// ================ 数据优化工具 ================

export function optimizeWorkflowConfig(config: WorkflowV2Config): WorkflowV2Config {
  const optimized = cloneWorkflowConfig(config);
  
  // 移除未使用的智能体
  const usedAgentIds = new Set(
    optimized.logic.steps
      .filter(step => step.component_ref)
      .map(step => step.component_ref!)
  );
  
  optimized.components.agents = optimized.components.agents.filter(agent => 
    usedAgentIds.has(agent.id)
  );
  
  // 移除无效的步骤依赖
  const validStepIds = new Set(optimized.logic.steps.map(step => step.id));
  optimized.logic.steps.forEach(step => {
    if (step.dependencies) {
      step.dependencies = step.dependencies.filter(dep => validStepIds.has(dep));
    }
  });
  
  // 清理空的配置对象
  optimized.logic.steps.forEach(step => {
    if (step.config && Object.keys(step.config).length === 0) {
      step.config = {};
    }
  });
  
  // 清理元数据
  if (optimized.metadata && Object.keys(optimized.metadata).length === 0) {
    optimized.metadata = {};
  }
  
  return optimized;
}

// ================ 数据版本管理 ================

export interface WorkflowVersion {
  version: string;
  config: WorkflowV2Config;
  timestamp: string;
  changes: string[];
}

export function createVersion(
  config: WorkflowV2Config, 
  previousConfig?: WorkflowV2Config
): WorkflowVersion {
  const version = generateVersionNumber();
  const changes: string[] = [];
  
  if (previousConfig) {
    const comparison = compareWorkflowConfigs(previousConfig, config);
    changes.push(...comparison.differences);
  } else {
    changes.push('初始版本');
  }
  
  return {
    version,
    config: cloneWorkflowConfig(config),
    timestamp: new Date().toISOString(),
    changes
  };
}

function generateVersionNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  
  return `${year}.${month}.${day}.${hour}${minute}`;
}

// ================ 数据统计工具 ================

export function getWorkflowStats(config: WorkflowV2Config): {
  agentCount: number;
  stepCount: number;
  dependencyCount: number;
  toolUsage: Record<string, number>;
  modelUsage: Record<string, number>;
  complexity: 'low' | 'medium' | 'high';
  estimatedExecutionTime: number;
} {
  const agentCount = config.components.agents.length;
  const stepCount = config.logic.steps.length;
  const dependencyCount = config.logic.steps.reduce(
    (sum, step) => sum + (step.dependencies?.length || 0), 
    0
  );
  
  // 工具使用统计
  const toolUsage: Record<string, number> = {};
  config.components.agents.forEach(agent => {
    if (agent.tools) {
      agent.tools.forEach(tool => {
        toolUsage[tool] = (toolUsage[tool] || 0) + 1;
      });
    }
  });
  
  // 模型使用统计
  const modelUsage: Record<string, number> = {};
  config.components.agents.forEach(agent => {
    modelUsage[agent.model_name] = (modelUsage[agent.model_name] || 0) + 1;
  });
  
  // 复杂度评估
  let complexity: 'low' | 'medium' | 'high' = 'low';
  if (stepCount > 10 || agentCount > 5 || dependencyCount > 10) {
    complexity = 'high';
  } else if (stepCount > 5 || agentCount > 2 || dependencyCount > 5) {
    complexity = 'medium';
  }
  
  // 估算执行时间（秒）
  const estimatedExecutionTime = stepCount * 2 + agentCount * 5;
  
  return {
    agentCount,
    stepCount,
    dependencyCount,
    toolUsage,
    modelUsage,
    complexity,
    estimatedExecutionTime
  };
} 