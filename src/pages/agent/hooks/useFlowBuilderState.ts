import { useState, useMemo } from 'react';
import { AgentTemplate } from '../components/BasicInfoStep';
import { ScenarioConfig } from '../components/ScenarioSelectionStep';
import { AgentTeam } from '../types/agentTeam';

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
  isScenarioStep: boolean;
  setIsScenarioStep: (value: boolean) => void;
  selectedScenario: ScenarioConfig | null;
  setSelectedScenario: (scenario: ScenarioConfig | null) => void;
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
  
  // 智能体团队配置
  isTeamConfigStep: boolean;
  setIsTeamConfigStep: (value: boolean) => void;
  agentTeamConfig: AgentTeam | null;
  setAgentTeamConfig: (config: AgentTeam | null) => void;
  
  // 模型配置状态
  isModelConfigStep: boolean;
  setIsModelConfigStep: (value: boolean) => void;
  modelConfig: any;
  setModelConfig: (config: any) => void;
}

/**
 * 智能体流程构建器状态管理钩子
 * 遵循单一职责原则，专注于管理流程构建器的状态
 */
export function useFlowBuilderState(): FlowBuilderState {
  // 场景选择步骤状态
  const [isScenarioStep, setIsScenarioStep] = useState<boolean>(true);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioConfig | null>(null);
  
  // 当前是否在模板选择步骤
  const [isTemplateStep, setIsTemplateStep] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null);
  
  // 当前活动步骤
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  
  // 配置面板状态
  const [configPanelOpen, setConfigPanelOpen] = useState(false);
  
  // 当前编辑的模块
  const [editingModule, setEditingModule] = useState<FlowModule | null>(null);
  
  // 智能体团队配置步骤状态
  const [isTeamConfigStep, setIsTeamConfigStep] = useState<boolean>(false);
  const [agentTeamConfig, setAgentTeamConfig] = useState<AgentTeam | null>(null);
  
  // 模型配置状态
  const [isModelConfigStep, setIsModelConfigStep] = useState<boolean>(false);
  const [modelConfig, setModelConfig] = useState<any>(null);
  
  // 根据模板类型生成流程步骤 - 重新设计为智能体配置导向
  const flowSteps = useMemo<FlowStep[]>(() => {
    if (!selectedTemplate) {
      // 默认通用流程
      return [
        { id: 'agent-overview', title: '智能体概览', description: '查看智能体团队配置', order: 1 },
        { id: 'agent-config', title: '智能体配置', description: '配置各智能体的详细参数', order: 2 },
        { id: 'workflow-preview', title: '工作流预览', description: '预览智能体协作流程', order: 3 },
        { id: 'deployment', title: '部署配置', description: '配置部署和发布选项', order: 4 }
      ];
    }

    // 基于Agno框架的Agent Team模式流程
    switch (selectedTemplate.agentType) {
      case 'simple-qa':
        // 简单问答智能体流程
        return [
          { id: 'agent-overview', title: '智能体概览', description: '查看已配置的3个智能体团队', order: 1 },
          { id: 'workflow-preview', title: '工作流预览', description: '预览问答流程和协作方式', order: 2 },
          { id: 'deployment', title: '部署配置', description: '配置发布和测试选项', order: 3 }
        ];
      
      case 'deep-thinking':
        // 深度思考智能体流程
        return [
          { id: 'agent-overview', title: '智能体概览', description: '查看已配置的5-7个智能体团队', order: 1 },
          { id: 'workflow-preview', title: '工作流预览', description: '预览深度思考和分析流程', order: 2 },
          { id: 'deployment', title: '部署配置', description: '配置高级部署选项', order: 3 }
        ];
      
      case 'intelligent-planning':
        // 智能规划智能体流程
        return [
          { id: 'agent-overview', title: '智能体概览', description: '查看已配置的规划智能体团队', order: 1 },
          { id: 'workflow-preview', title: '工作流预览', description: '预览任务规划和执行流程', order: 2 },
          { id: 'deployment', title: '部署配置', description: '配置企业级部署选项', order: 3 }
        ];
      
      default:
        return [
          { id: 'agent-overview', title: '智能体概览', description: '查看智能体团队配置', order: 1 },
          { id: 'agent-config', title: '智能体配置', description: '配置各智能体的详细参数', order: 2 },
          { id: 'workflow-preview', title: '工作流预览', description: '预览智能体协作流程', order: 3 },
          { id: 'deployment', title: '部署配置', description: '配置部署和发布选项', order: 4 }
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
        // 简单问答智能体模块配置 - 重新设计为智能体导向
        modules = [
          // 智能体概览
          {
            id: 'team-overview',
            title: '团队概览',
            description: '查看3个智能体的配置和协作关系',
            type: 'config',
            stepId: 'agent-overview',
            configurable: false,
            required: true,
            configured: true
          },

          // 工作流预览
          {
            id: 'workflow-preview',
            title: '工作流预览',
            description: '预览智能体协作流程',
            type: 'config',
            stepId: 'workflow-preview',
            configurable: false,
            required: true,
            configured: true
          },
          // 部署配置
          {
            id: 'deployment-config',
            title: '部署配置',
            description: '配置发布和测试选项',
            type: 'config',
            stepId: 'deployment',
            configurable: true,
            required: true,
            configured: false
          }
        ];
        break;

      case 'deep-thinking':
        // 深度思考智能体模块配置 - 重新设计为智能体导向
        modules = [
          // 智能体概览
          {
            id: 'team-overview',
            title: '团队概览',
            description: '查看5-7个智能体的配置和协作关系',
            type: 'config',
            stepId: 'agent-overview',
            configurable: false,
            required: true,
            configured: true
          },

          // 工作流预览
          {
            id: 'workflow-preview',
            title: '工作流预览',
            description: '预览深度思考和分析流程',
            type: 'config',
            stepId: 'workflow-preview',
            configurable: false,
            required: true,
            configured: true
          },
          // 部署配置
          {
            id: 'deployment-config',
            title: '部署配置',
            description: '配置高级部署选项',
            type: 'config',
            stepId: 'deployment',
            configurable: true,
            required: true,
            configured: false
          }
        ];
        break;

      case 'intelligent-planning':
        // 智能规划智能体模块配置 - 重新设计为智能体导向
        modules = [
          // 智能体概览
          {
            id: 'team-overview',
            title: '团队概览',
            description: '查看规划智能体团队配置',
            type: 'config',
            stepId: 'agent-overview',
            configurable: false,
            required: true,
            configured: true
          },

          // 工作流预览
          {
            id: 'workflow-preview',
            title: '工作流预览',
            description: '预览任务规划和执行流程',
            type: 'config',
            stepId: 'workflow-preview',
            configurable: false,
            required: true,
            configured: true
          },
          // 部署配置
          {
            id: 'deployment-config',
            title: '部署配置',
            description: '配置企业级部署选项',
            type: 'config',
            stepId: 'deployment',
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
    isScenarioStep,
    setIsScenarioStep,
    selectedScenario,
    setSelectedScenario,
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
    currentStepModules,
    
    // 智能体团队配置
    isTeamConfigStep,
    setIsTeamConfigStep,
    agentTeamConfig,
    setAgentTeamConfig,
    
    // 模型配置状态
    isModelConfigStep,
    setIsModelConfigStep,
    modelConfig,
    setModelConfig
  };
}
