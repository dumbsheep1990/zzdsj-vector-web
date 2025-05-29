// 编排系统类型定义
import { Tool, KnowledgeBase } from '../types';

// 执行模式类型
export type ExecutionMode = 'sequential' | 'parallel' | 'conditional';

// 模块类型
export enum ModuleType {
  INFORMATION_RETRIEVAL = 'information_retrieval',  // 信息获取 (原检索增强)
  CONTENT_PROCESSING = 'content_processing',        // 内容处理 (原文本处理)
  DATA_ANALYSIS = 'data_analysis_reasoning',        // 数据分析与推理 (原数据分析)
  OUTPUT_GENERATION = 'output_generation',          // 输出生成 (原内容生成)
  WORKFLOW_CONTROL = 'workflow_control'             // 流程控制 (保留)
}

// 模块配置接口
export interface ModuleConfig {
  tools: string[];
  knowledgeBases: string[];
  executionStrategy: string;
  order: number;
  enabled: boolean;
  // 并行执行配置
  parallelGroups?: string[][];
  // 条件执行配置
  conditionConfig?: {
    baseToolName?: string;     // 条件判断的基础工具
    condition?: string;        // 条件表达式
    trueBranchTools?: string[];  // 条件满足时执行的工具
    falseBranchTools?: string[]; // 条件不满足时执行的工具
  };
  // 输出生成配置
  config?: {
    useModelOutput?: boolean;  // 是否使用模型直接输出
    useFormatting?: boolean;   // 是否使用格式化工具
    formatOptions?: string[];  // 格式化选项
  };
}

// 编排数据接口
export interface OrchestrationData {
  executionMode: ExecutionMode;
  modules: {[key: string]: ModuleConfig};
}

// 编排项接口 - 用于传递给Flow Preview步骤
export interface OrchestrationItem {
  moduleType: string;
  moduleName: string;
  tools: Tool[];
  knowledgeBases: KnowledgeBase[];
  executionStrategy: string;
  order: number;
  enabled: boolean;
  config?: Record<string, unknown>;
}
