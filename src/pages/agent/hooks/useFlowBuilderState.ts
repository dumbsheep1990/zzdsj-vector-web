import { useState, useMemo } from 'react';
import { AgentTemplate } from '../components/BasicInfoStep';

/**
 * 流程步骤类型定义
 */
export interface FlowStep {
  id: string;
  title: string;
  description: string;
  order: number;
}

/**
 * 流程模块类型定义
 */
export interface FlowModule {
  id: string;
  title: string;
  description: string;
  type: 'input' | 'config' | 'function';
  stepId: string;
  configurable: boolean;
  required: boolean;
  configured: boolean;
  configuration?: Record<string, unknown>;
}

/**
 * FlowBuilder状态钩子返回类型
 */
export interface FlowBuilderState {
  // 流程步骤状态
  isTemplateStep: boolean;
  setIsTemplateStep: (value: boolean) => void;
  selectedTemplate: AgentTemplate | null;
  setSelectedTemplate: (template: AgentTemplate | null) => void;
  activeStepId: string | null;
  setActiveStepId: (id: string | null) => void;
  flowSteps: FlowStep[];
  
  // 配置面板状态
  configPanelOpen: boolean;
  setConfigPanelOpen: (open: boolean) => void;
  
  // 模块状态
  editingModule: FlowModule | null;
  setEditingModule: (module: FlowModule | null) => void;
  flowModules: FlowModule[];
  setFlowModules: React.Dispatch<React.SetStateAction<FlowModule[]>>;
  
  // 当前步骤的模块
  currentStepModules: FlowModule[];
}

/**
 * 智能体流程构建器状态管理钩子
 * 遵循单一职责原则，专注于管理流程构建器的状态
 */
export function useFlowBuilderState(): FlowBuilderState {
  // 当前是否在模板选择步骤
  const [isTemplateStep, setIsTemplateStep] = useState<boolean>(true);
  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null);
  
  // 当前活动步骤
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  
  // 配置面板状态
  const [configPanelOpen, setConfigPanelOpen] = useState(false);
  
  // 当前编辑的模块
  const [editingModule, setEditingModule] = useState<FlowModule | null>(null);
  
  // 根据模板类型生成流程步骤
  const flowSteps = useMemo<FlowStep[]>(() => {
    if (!selectedTemplate) {
      // 默认通用流程
      return [
        { id: 'model', title: '模型配置', description: '选择和配置AI模型参数', order: 1 },
        { id: 'capabilities', title: '能力配置', description: '配置智能体的核心能力', order: 2 },
        { id: 'tools', title: '工具集成', description: '添加和配置外部工具', order: 3 },
        { id: 'advanced', title: '高级设置', description: '配置高级参数和部署选项', order: 4 }
      ];
    }

    // 基于Agno框架的模板特定流程
    switch (selectedTemplate.agentType) {
      case 'simple-qa':
        // Level 1: Agents with tools and instructions (简化为3步)
        return [
          { id: 'model', title: '基础模型', description: '选择轻量级快速响应模型', order: 1 },
          { id: 'instructions', title: '指令设置', description: '配置系统提示词', order: 2 },
          { id: 'tools', title: '基础工具配置', description: '配置查询和信息检索工具', order: 3 }
        ];
      
      case 'deep-thinking':
        // Level 2-3: Agents with knowledge, storage, memory and reasoning
        return [
          { id: 'model', title: '推理模型', description: '选择支持复杂推理的模型', order: 1 },
          { id: 'reasoning', title: '推理配置', description: '配置思维链和分析策略', order: 2 },
          { id: 'knowledge', title: '知识系统', description: '配置知识库和检索增强', order: 3 },
          { id: 'memory', title: '记忆系统', description: '配置上下文记忆和学习能力', order: 4 },
          { id: 'tools', title: '分析工具', description: '配置数据分析和推理工具', order: 5 }
        ];
      
      case 'intelligent-planning':
        // Level 4-5: Agent Teams + Agentic Workflows
        return [
          { id: 'model', title: '规划模型', description: '选择任务规划和决策模型', order: 1 },
          { id: 'planning', title: '规划引擎', description: '配置任务分解和规划算法', order: 2 },
          { id: 'workflow', title: '工作流配置', description: '设计执行流程和状态管理', order: 3 },
          { id: 'tools', title: '执行工具', description: '配置任务执行和监控工具', order: 4 },
          { id: 'coordination', title: '协调机制', description: '配置多任务协调和资源调度', order: 5 }
        ];
      
      default:
        return [
          { id: 'model', title: '模型配置', description: '选择和配置AI模型参数', order: 1 },
          { id: 'capabilities', title: '能力配置', description: '配置智能体的核心能力', order: 2 },
          { id: 'tools', title: '工具集成', description: '添加和配置外部工具', order: 3 },
          { id: 'advanced', title: '高级设置', description: '配置高级参数和部署选项', order: 4 }
        ];
    }
  }, [selectedTemplate]);

  // 根据模板类型生成模块配置
  const [flowModules, setFlowModules] = useState<FlowModule[]>([]);
  
  // 当选择的模板发生变化时，更新模块配置
  useMemo(() => {
    if (!selectedTemplate) {
      setFlowModules([]);
      return;
    }

    let modules: FlowModule[] = [];

    switch (selectedTemplate.agentType) {
      case 'simple-qa':
        // 简单问答智能体模块配置
        modules = [
          // 基础模型配置
          {
            id: 'lightweight-model',
            title: '轻量级模型选择',
            description: '选择快速响应的轻量级模型',
            type: 'input',
            stepId: 'model',
            configurable: true,
            required: true,
            configured: false
          },
          {
            id: 'response-parameters',
            title: '响应参数',
            description: '配置温度、响应长度限制等',
            type: 'config',
            stepId: 'model',
            configurable: true,
            required: true,
            configured: false
          },
          // 指令配置
          {
            id: 'system-instructions',
            title: '系统指令',
            description: '设置简洁明确的系统提示词',
            type: 'config',
            stepId: 'instructions',
            configurable: true,
            required: true,
            configured: false
          },
          // 基础工具
          {
            id: 'query-tools',
            title: '查询工具',
            description: '配置信息查询和检索工具',
            type: 'function',
            stepId: 'tools',
            configurable: true,
            required: false,
            configured: false
          },
          // 性能优化
          {
            id: 'cache-config',
            title: '缓存配置',
            description: '配置响应缓存和优化策略',
            type: 'config',
            stepId: 'optimization',
            configurable: true,
            required: true,
            configured: false
          },
          {
            id: 'concurrency-limits',
            title: '并发限制',
            description: '设置并发处理和限流参数',
            type: 'config',
            stepId: 'optimization',
            configurable: true,
            required: true,
            configured: false
          }
        ];
        break;

      case 'deep-thinking':
        // 深度思考智能体模块配置
        modules = [
          // 模板专用流程配置
          {
            id: 'template-flow-config',
            title: '深度思考流程配置',
            description: '配置推理深度、协作模式和质量控制',
            type: 'config',
            stepId: 'reasoning',
            configurable: true,
            required: true,
            configured: false
          },
          // 推理模型
          {
            id: 'reasoning-model',
            title: '推理模型选择',
            description: '选择支持复杂推理的高级模型',
            type: 'input',
            stepId: 'model',
            configurable: true,
            required: true,
            configured: false
          },
          {
            id: 'model-reasoning-params',
            title: '推理参数',
            description: '配置推理深度和思维链参数',
            type: 'config',
            stepId: 'model',
            configurable: true,
            required: true,
            configured: false
          },
          // 推理配置
          {
            id: 'reasoning-strategy',
            title: '推理策略',
            description: '配置多步推理和思维链模式',
            type: 'config',
            stepId: 'reasoning',
            configurable: true,
            required: true,
            configured: false
          },
          {
            id: 'analysis-depth',
            title: '分析深度',
            description: '设置分析层次和推理步骤',
            type: 'config',
            stepId: 'reasoning',
            configurable: true,
            required: true,
            configured: false
          },
          // 知识系统
          {
            id: 'knowledge-base',
            title: '知识库配置',
            description: '配置领域知识和向量数据库',
            type: 'function',
            stepId: 'knowledge',
            configurable: true,
            required: true,
            configured: false
          },
          {
            id: 'rag-retrieval',
            title: 'RAG检索系统',
            description: '配置检索增强生成系统',
            type: 'function',
            stepId: 'knowledge',
            configurable: true,
            required: true,
            configured: false
          },
          // 记忆系统
          {
            id: 'context-memory',
            title: '上下文记忆',
            description: '配置会话记忆和上下文管理',
            type: 'config',
            stepId: 'memory',
            configurable: true,
            required: true,
            configured: false
          },
          {
            id: 'learning-system',
            title: '学习系统',
            description: '配置经验积累和学习机制',
            type: 'function',
            stepId: 'memory',
            configurable: true,
            required: false,
            configured: false
          },
          // 分析工具
          {
            id: 'analysis-tools',
            title: '分析工具集',
            description: '配置数据分析和可视化工具',
            type: 'function',
            stepId: 'tools',
            configurable: true,
            required: false,
            configured: false
          }
        ];
        break;

      case 'intelligent-planning':
        // 智能规划智能体模块配置
        modules = [
          // 模板专用流程配置
          {
            id: 'template-flow-config',
            title: '智能规划流程配置',
            description: '配置规划视野、资源分配和协调机制',
            type: 'config',
            stepId: 'planning',
            configurable: true,
            required: true,
            configured: false
          },
          // 规划模型
          {
            id: 'planning-model',
            title: '规划模型选择',
            description: '选择支持任务规划的决策模型',
            type: 'input',
            stepId: 'model',
            configurable: true,
            required: true,
            configured: false
          },
          {
            id: 'decision-parameters',
            title: '决策参数',
            description: '配置决策权重和优化目标',
            type: 'config',
            stepId: 'model',
            configurable: true,
            required: true,
            configured: false
          },
          // 规划引擎
          {
            id: 'task-decomposition',
            title: '任务分解',
            description: '配置任务拆解和依赖分析',
            type: 'function',
            stepId: 'planning',
            configurable: true,
            required: true,
            configured: false
          },
          {
            id: 'planning-algorithms',
            title: '规划算法',
            description: '选择和配置规划策略算法',
            type: 'config',
            stepId: 'planning',
            configurable: true,
            required: true,
            configured: false
          },
          // 工作流配置
          {
            id: 'workflow-design',
            title: '工作流设计',
            description: '设计执行流程和状态转换',
            type: 'function',
            stepId: 'workflow',
            configurable: true,
            required: true,
            configured: false
          },
          {
            id: 'state-management',
            title: '状态管理',
            description: '配置状态持久化和恢复机制',
            type: 'config',
            stepId: 'workflow',
            configurable: true,
            required: true,
            configured: false
          },
          // 执行工具
          {
            id: 'execution-tools',
            title: '执行工具集',
            description: '配置任务执行和API集成工具',
            type: 'function',
            stepId: 'tools',
            configurable: true,
            required: true,
            configured: false
          },
          {
            id: 'monitoring-tools',
            title: '监控工具',
            description: '配置执行监控和异常处理工具',
            type: 'function',
            stepId: 'tools',
            configurable: true,
            required: true,
            configured: false
          },
          // 协调机制
          {
            id: 'resource-scheduler',
            title: '资源调度',
            description: '配置资源分配和调度策略',
            type: 'config',
            stepId: 'coordination',
            configurable: true,
            required: true,
            configured: false
          },
          {
            id: 'error-handling',
            title: '错误处理',
            description: '配置异常处理和恢复机制',
            type: 'config',
            stepId: 'coordination',
            configurable: true,
            required: true,
            configured: false
          }
        ];
        break;

      default:
        // 默认通用模块
        modules = [
          {
            id: 'model-selection',
            title: '模型选择',
            description: '选择要使用的基础模型',
            type: 'input',
            stepId: 'model',
            configurable: true,
            required: true,
            configured: false
          },
          {
            id: 'model-parameters',
            title: '模型参数',
            description: '配置温度、最大token等参数',
            type: 'config',
            stepId: 'model',
            configurable: true,
            required: true,
            configured: false
          }
        ];
    }

    setFlowModules(modules);
  }, [selectedTemplate]);

  // 获取当前步骤的模块 - 使用缓存避免重复计算
  const currentStepModules = useMemo(() => {
    if (!activeStepId) return [];
    return flowModules.filter(module => module.stepId === activeStepId);
  }, [activeStepId, flowModules]);

  // 返回所有状态和操作方法，组织良好的API便于使用
  return {
    // 流程步骤状态
    isTemplateStep,
    setIsTemplateStep,
    selectedTemplate,
    setSelectedTemplate,
    activeStepId,
    setActiveStepId,
    flowSteps,
    
    // 配置面板状态
    configPanelOpen,
    setConfigPanelOpen,
    
    // 模块状态
    editingModule,
    setEditingModule,
    flowModules,
    setFlowModules,
    
    // 当前步骤的模块
    currentStepModules
  };
}
