/**
 * Workflow v2 数据验证工具
 * 确保前后端数据一致性和类型安全
 */

import {
  WorkflowV2Config,
  WorkflowV2AgentConfig,
  WorkflowV2Step,
  WorkflowStepType,
  ValidationResult,
  ValidationRule,
  ValidationSchema,
  WorkflowComponentType
} from '../types/workflow-v2';

// ================ 验证规则定义 ================

export const WORKFLOW_V2_VALIDATION_SCHEMA: ValidationSchema = {
  'name': {
    required: true,
    min_length: 1,
    max_length: 100,
    pattern: '^[a-zA-Z0-9\\u4e00-\\u9fa5_\\-\\s]+$'
  },
  'description': {
    max_length: 500
  },
  'agent.model_name': {
    required: true,
    pattern: '^[a-zA-Z0-9/\\-_]+$'
  },
  'agent.instructions': {
    required: true,
    min_length: 10,
    max_length: 2000
  },
  'agent.temperature': {
    custom: (value: number) => {
      if (value < 0 || value > 2) {
        return '温度值必须在0-2之间';
      }
      return null;
    }
  },
  'agent.max_tokens': {
    custom: (value: number) => {
      if (value <= 0 || value > 32768) {
        return 'Token数必须在1-32768之间';
      }
      return null;
    }
  },
  'step.name': {
    required: true,
    min_length: 1,
    max_length: 50
  },
  'step.component_ref': {
    required: true
  }
};

// ================ 基础验证函数 ================

export function validateField(value: any, rule: ValidationRule): string[] {
  const errors: string[] = [];

  // 必填验证
  if (rule.required && (value === undefined || value === null || value === '')) {
    errors.push('该字段为必填项');
    return errors;
  }

  // 如果值为空且非必填，则跳过其他验证
  if (!rule.required && (value === undefined || value === null || value === '')) {
    return errors;
  }

  // 最小长度验证
  if (rule.min_length && typeof value === 'string' && value.length < rule.min_length) {
    errors.push(`最小长度为${rule.min_length}个字符`);
  }

  // 最大长度验证
  if (rule.max_length && typeof value === 'string' && value.length > rule.max_length) {
    errors.push(`最大长度为${rule.max_length}个字符`);
  }

  // 正则表达式验证
  if (rule.pattern && typeof value === 'string' && !new RegExp(rule.pattern).test(value)) {
    errors.push('格式不正确');
  }

  // 自定义验证
  if (rule.custom) {
    const customError = rule.custom(value);
    if (customError) {
      errors.push(customError);
    }
  }

  return errors;
}

// ================ 组件验证函数 ================

export function validateAgent(agent: WorkflowV2AgentConfig): ValidationResult {
  const errors: Record<string, string[]> = {};
  const warnings: Record<string, string[]> = {};

  // 验证ID
  if (!agent.id || agent.id.trim() === '') {
    errors['id'] = ['智能体ID不能为空'];
  } else if (!/^[a-zA-Z0-9_-]+$/.test(agent.id)) {
    errors['id'] = ['智能体ID只能包含字母、数字、下划线和连字符'];
  }

  // 验证名称
  const nameErrors = validateField(agent.name, WORKFLOW_V2_VALIDATION_SCHEMA['name']);
  if (nameErrors.length > 0) {
    errors['name'] = nameErrors;
  }

  // 验证模型名称
  const modelErrors = validateField(agent.model_name, WORKFLOW_V2_VALIDATION_SCHEMA['agent.model_name']);
  if (modelErrors.length > 0) {
    errors['model_name'] = modelErrors;
  }

  // 验证指令
  const instructionsErrors = validateField(agent.instructions, WORKFLOW_V2_VALIDATION_SCHEMA['agent.instructions']);
  if (instructionsErrors.length > 0) {
    errors['instructions'] = instructionsErrors;
  }

  // 验证温度参数
  if (agent.temperature !== undefined) {
    const tempErrors = validateField(agent.temperature, WORKFLOW_V2_VALIDATION_SCHEMA['agent.temperature']);
    if (tempErrors.length > 0) {
      errors['temperature'] = tempErrors;
    }
  }

  // 验证Token数
  if (agent.max_tokens !== undefined) {
    const tokenErrors = validateField(agent.max_tokens, WORKFLOW_V2_VALIDATION_SCHEMA['agent.max_tokens']);
    if (tokenErrors.length > 0) {
      errors['max_tokens'] = tokenErrors;
    }
  }

  // 验证工具列表
  if (agent.tools && agent.tools.length > 0) {
    const validTools = ['reasoning', 'search', 'calculator', 'file', 'web_search'];
    const invalidTools = agent.tools.filter(tool => !validTools.includes(tool));
    if (invalidTools.length > 0) {
      errors['tools'] = [`无效的工具: ${invalidTools.join(', ')}`];
    }
  }

  // 警告检查
  if (agent.instructions && agent.instructions.length < 50) {
    warnings['instructions'] = ['建议指令内容更加详细，以获得更好的效果'];
  }

  if (agent.tools && agent.tools.length === 0) {
    warnings['tools'] = ['未配置任何工具，智能体功能可能受限'];
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    warnings
  };
}

export function validateStep(step: WorkflowV2Step, availableComponents: string[]): ValidationResult {
  const errors: Record<string, string[]> = {};
  const warnings: Record<string, string[]> = {};

  // 验证ID
  if (!step.id || step.id.trim() === '') {
    errors['id'] = ['步骤ID不能为空'];
  } else if (!/^[a-zA-Z0-9_-]+$/.test(step.id)) {
    errors['id'] = ['步骤ID只能包含字母、数字、下划线和连字符'];
  }

  // 验证名称
  const nameErrors = validateField(step.name, WORKFLOW_V2_VALIDATION_SCHEMA['step.name']);
  if (nameErrors.length > 0) {
    errors['name'] = nameErrors;
  }

  // 验证组件引用
  if (step.type === WorkflowStepType.AGENT_RUN) {
    if (!step.component_ref) {
      errors['component_ref'] = ['智能体运行步骤必须指定组件引用'];
    } else if (!availableComponents.includes(step.component_ref)) {
      errors['component_ref'] = ['引用的组件不存在'];
    }
  }

  // 验证依赖关系
  if (step.dependencies && step.dependencies.length > 0) {
    if (step.dependencies.includes(step.id)) {
      errors['dependencies'] = ['步骤不能依赖自身'];
    }
  }

  // 警告检查
  if (step.dependencies && step.dependencies.length > 3) {
    warnings['dependencies'] = ['依赖过多可能影响执行效率'];
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    warnings
  };
}

// ================ 工作流验证函数 ================

export function validateWorkflowV2Config(config: WorkflowV2Config): ValidationResult {
  const errors: Record<string, string[]> = {};
  const warnings: Record<string, string[]> = {};

  // 验证基本信息
  const nameErrors = validateField(config.name, WORKFLOW_V2_VALIDATION_SCHEMA['name']);
  if (nameErrors.length > 0) {
    errors['name'] = nameErrors;
  }

  if (config.description) {
    const descErrors = validateField(config.description, WORKFLOW_V2_VALIDATION_SCHEMA['description']);
    if (descErrors.length > 0) {
      errors['description'] = descErrors;
    }
  }

  // 验证组件
  const agentIds = new Set<string>();
  config.components.agents.forEach((agent, index) => {
    const agentResult = validateAgent(agent);
    if (!agentResult.valid) {
      Object.keys(agentResult.errors).forEach(field => {
        errors[`agents.${index}.${field}`] = agentResult.errors[field];
      });
    }
    
    // 检查ID重复
    if (agentIds.has(agent.id)) {
      errors[`agents.${index}.id`] = ['智能体ID重复'];
    } else {
      agentIds.add(agent.id);
    }
    
    // 合并警告
    Object.keys(agentResult.warnings).forEach(field => {
      warnings[`agents.${index}.${field}`] = agentResult.warnings[field];
    });
  });

  // 验证步骤
  const stepIds = new Set<string>();
  const availableComponentRefs = config.components.agents.map(a => a.id);
  
  config.logic.steps.forEach((step, index) => {
    const stepResult = validateStep(step, availableComponentRefs);
    if (!stepResult.valid) {
      Object.keys(stepResult.errors).forEach(field => {
        errors[`steps.${index}.${field}`] = stepResult.errors[field];
      });
    }
    
    // 检查ID重复
    if (stepIds.has(step.id)) {
      errors[`steps.${index}.id`] = ['步骤ID重复'];
    } else {
      stepIds.add(step.id);
    }
    
    // 合并警告
    Object.keys(stepResult.warnings).forEach(field => {
      warnings[`steps.${index}.${field}`] = stepResult.warnings[field];
    });
  });

  // 验证步骤依赖关系
  const dependencyErrors = validateStepDependencies(config.logic.steps);
  if (dependencyErrors.length > 0) {
    errors['dependencies'] = dependencyErrors;
  }

  // 结构验证
  if (config.components.agents.length === 0) {
    errors['components'] = ['工作流必须包含至少一个智能体'];
  }

  if (config.logic.steps.length === 0) {
    warnings['logic'] = ['工作流没有配置任何步骤'];
  }

  // 复杂度警告
  if (config.logic.steps.length > 10) {
    warnings['complexity'] = ['步骤过多可能影响维护性，建议拆分工作流'];
  }

  if (config.components.agents.length > 5) {
    warnings['complexity'] = ['智能体过多可能影响性能，建议优化配置'];
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    warnings
  };
}

// ================ 依赖关系验证 ================

export function validateStepDependencies(steps: WorkflowV2Step[]): string[] {
  const errors: string[] = [];
  const stepIds = new Set(steps.map(s => s.id));

  // 检查依赖引用的有效性
  steps.forEach(step => {
    if (step.dependencies) {
      step.dependencies.forEach(depId => {
        if (!stepIds.has(depId)) {
          errors.push(`步骤 '${step.id}' 依赖不存在的步骤 '${depId}'`);
        }
      });
    }
  });

  // 检查循环依赖
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function hasCircularDependency(stepId: string): boolean {
    if (recursionStack.has(stepId)) {
      return true;
    }
    if (visited.has(stepId)) {
      return false;
    }

    visited.add(stepId);
    recursionStack.add(stepId);

    const step = steps.find(s => s.id === stepId);
    if (step && step.dependencies) {
      for (const depId of step.dependencies) {
        if (hasCircularDependency(depId)) {
          return true;
        }
      }
    }

    recursionStack.delete(stepId);
    return false;
  }

  steps.forEach(step => {
    if (hasCircularDependency(step.id)) {
      errors.push(`检测到循环依赖，涉及步骤 '${step.id}'`);
    }
  });

  return errors;
}

// ================ 数据完整性检查 ================

export function checkDataIntegrity(config: WorkflowV2Config): ValidationResult {
  const errors: Record<string, string[]> = {};
  const warnings: Record<string, string[]> = {};

  // 检查组件引用完整性
  const agentIds = config.components.agents.map(a => a.id);
  const referencedAgents = config.logic.steps
    .filter(s => s.type === WorkflowStepType.AGENT_RUN && s.component_ref)
    .map(s => s.component_ref!);

  // 检查未使用的智能体
  const unusedAgents = agentIds.filter(id => !referencedAgents.includes(id));
  if (unusedAgents.length > 0) {
    warnings['unused_components'] = [`未使用的智能体: ${unusedAgents.join(', ')}`];
  }

  // 检查引用的智能体是否存在
  const missingAgents = referencedAgents.filter(id => !agentIds.includes(id));
  if (missingAgents.length > 0) {
    errors['missing_components'] = [`引用的智能体不存在: ${missingAgents.join(', ')}`];
  }

  // 检查工作流可执行性
  if (config.logic.steps.length > 0) {
    const entrySteps = config.logic.steps.filter(s => !s.dependencies || s.dependencies.length === 0);
    if (entrySteps.length === 0) {
      errors['execution'] = ['没有入口步骤，工作流无法执行'];
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    warnings
  };
}

// ================ 性能建议 ================

export function getPerformanceSuggestions(config: WorkflowV2Config): string[] {
  const suggestions: string[] = [];

  // 并发执行建议
  const parallelizableSteps = config.logic.steps.filter(step => 
    !step.dependencies || step.dependencies.length === 0
  );
  
  if (parallelizableSteps.length > 1) {
    suggestions.push(`可以并行执行的步骤: ${parallelizableSteps.map(s => s.name).join(', ')}`);
  }

  // 资源使用建议
  const highTokenAgents = config.components.agents.filter(a => 
    a.max_tokens && a.max_tokens > 8192
  );
  
  if (highTokenAgents.length > 0) {
    suggestions.push(`高Token消耗智能体: ${highTokenAgents.map(a => a.name).join(', ')}，建议优化指令长度`);
  }

  // 复杂度建议
  if (config.logic.steps.length > 5) {
    suggestions.push('考虑将复杂工作流拆分为多个子工作流，提高可维护性');
  }

  // 工具使用建议
  const toolUsage = config.components.agents.reduce((acc, agent) => {
    if (agent.tools) {
      agent.tools.forEach(tool => {
        acc[tool] = (acc[tool] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);

  const unusedCommonTools = ['reasoning', 'search'].filter(tool => !toolUsage[tool]);
  if (unusedCommonTools.length > 0) {
    suggestions.push(`考虑为智能体添加常用工具: ${unusedCommonTools.join(', ')}`);
  }

  return suggestions;
}

// ================ 验证工具函数 ================

export function isValidWorkflowV2Config(config: any): config is WorkflowV2Config {
  try {
    // 基本结构检查
    if (!config || typeof config !== 'object') return false;
    if (!config.name || typeof config.name !== 'string') return false;
    if (!config.components || typeof config.components !== 'object') return false;
    if (!config.logic || typeof config.logic !== 'object') return false;
    
    // 组件检查
    if (!Array.isArray(config.components.agents)) return false;
    if (!Array.isArray(config.logic.steps)) return false;
    
    return true;
  } catch {
    return false;
  }
}

export function sanitizeWorkflowV2Config(config: WorkflowV2Config): WorkflowV2Config {
  // 深拷贝配置
  const sanitized = JSON.parse(JSON.stringify(config));
  
  // 清理空值和无效值
  sanitized.name = sanitized.name?.trim() || '';
  sanitized.description = sanitized.description?.trim() || '';
  
  // 确保数组存在
  sanitized.components.agents = sanitized.components.agents || [];
  sanitized.components.models = sanitized.components.models || [];
  sanitized.components.tools = sanitized.components.tools || [];
  sanitized.components.knowledge_bases = sanitized.components.knowledge_bases || [];
  
  sanitized.logic.steps = sanitized.logic.steps || [];
  sanitized.logic.conditions = sanitized.logic.conditions || [];
  sanitized.logic.variables = sanitized.logic.variables || {};
  
  // 清理智能体配置
  sanitized.components.agents.forEach((agent: WorkflowV2AgentConfig) => {
    agent.id = agent.id?.trim() || '';
    agent.name = agent.name?.trim() || '';
    agent.description = agent.description?.trim() || '';
    agent.instructions = agent.instructions?.trim() || '';
    agent.tools = agent.tools || [];
  });
  
  // 清理步骤配置
  sanitized.logic.steps.forEach((step: WorkflowV2Step) => {
    step.id = step.id?.trim() || '';
    step.name = step.name?.trim() || '';
    step.dependencies = step.dependencies || [];
    step.config = step.config || {};
  });
  
  return sanitized;
}

// ================ 导出验证摘要 ================

export function getValidationSummary(config: WorkflowV2Config): {
  isValid: boolean;
  errorCount: number;
  warningCount: number;
  suggestions: string[];
  criticalIssues: string[];
} {
  const validationResult = validateWorkflowV2Config(config);
  const integrityResult = checkDataIntegrity(config);
  const suggestions = getPerformanceSuggestions(config);
  
  const allErrors = { ...validationResult.errors, ...integrityResult.errors };
  const allWarnings = { ...validationResult.warnings, ...integrityResult.warnings };
  
  const criticalIssues = Object.keys(allErrors).filter(key => 
    key.includes('name') || key.includes('component_ref') || key.includes('dependencies')
  );
  
  return {
    isValid: validationResult.valid && integrityResult.valid,
    errorCount: Object.keys(allErrors).length,
    warningCount: Object.keys(allWarnings).length,
    suggestions,
    criticalIssues
  };
} 