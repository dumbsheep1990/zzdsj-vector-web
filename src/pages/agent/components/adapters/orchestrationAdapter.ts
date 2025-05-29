// 编排项适配器
import { OrchestrationItem as BuilderOrchestrationItem } from '../../AgentBuilder';
import { Tool, KnowledgeBase } from '../types';

/**
 * Flow预览使用的编排项接口
 */
export interface FlowOrchestrationItem {
  moduleType: string;
  moduleName: string;
  tools: Tool[];
  knowledgeBases: KnowledgeBase[];
  executionStrategy: string;
  order: number;
  enabled: boolean;
  config?: {
    useModelOutput?: boolean;
    useFormatting?: boolean;
    formatOptions?: string[];
  };
}

/**
 * 将构建器的编排项转换为流预览可用的格式
 * @param items AgentBuilder中的编排项数组
 * @param selectedTools 所有选中的工具
 * @param selectedKnowledgeBases 所有选中的知识库
 */
export const adaptOrchestrationItems = (
  items: BuilderOrchestrationItem[] | null | undefined, 
  selectedTools: Tool[], 
  selectedKnowledgeBases: KnowledgeBase[]
): FlowOrchestrationItem[] => {
  // 防御性编程：确保items是数组
  if (!items || !Array.isArray(items)) {
    console.warn('orchestrationItems is not an array:', items);
    return [];
  }
  // 按模块类型分组
  const moduleMap: Record<string, {
    tools: Tool[],
    knowledgeBases: KnowledgeBase[],
    config?: Record<string, unknown>,
    order: number
  }> = {};
  
  // 模块类型映射
  const moduleTypeMap: Record<string, string> = {
    'information_retrieval': '信息获取',
    'content_processing': '内容处理',
    'data_analysis_reasoning': '数据分析',
    'output_generation': '输出生成',
    'workflow_control': '流程控制'
  };
  
  // 处理每个编排项
  items.forEach(item => {
    let moduleType = 'content_processing';
    
    // 根据工具或知识库类型确定模块类型
    if (item.type === 'knowledgeBase') {
      moduleType = 'information_retrieval';
    } else if (item.type === 'tool') {
      // 查找工具详情确定类型
      const tool = selectedTools.find(t => t.id === item.id);
      if (tool) {
        if (tool.category === 'search' || tool.category === 'retrieval') {
          moduleType = 'information_retrieval';
        } else if (tool.category === 'reasoning') {
          moduleType = 'data_analysis_reasoning';
        } else if (tool.category === 'integration' && tool.id.includes('format')) {
          moduleType = 'output_generation';
        }
      }
    }
    
    // 初始化模块组
    if (!moduleMap[moduleType]) {
      moduleMap[moduleType] = {
        tools: [],
        knowledgeBases: [],
        order: Object.keys(moduleMap).length + 1,
        config: moduleType === 'output_generation' ? {
          useModelOutput: true,
          useFormatting: true,
          formatOptions: ['json', 'markdown']
        } : undefined
      };
    }
    
    // 添加到正确的分组
    if (item.type === 'tool') {
      const tool = selectedTools.find(t => t.id === item.id);
      if (tool) {
        moduleMap[moduleType].tools.push(tool);
      }
    } else if (item.type === 'knowledgeBase') {
      const kb = selectedKnowledgeBases.find(k => k.id === item.id);
      if (kb) {
        moduleMap[moduleType].knowledgeBases.push(kb);
      }
    }
  });
  
  // 转换为流程预览项
  return Object.entries(moduleMap).map(([moduleType, data], index) => ({
    moduleType,
    moduleName: moduleTypeMap[moduleType] || `模块 ${index + 1}`,
    tools: data.tools,
    knowledgeBases: data.knowledgeBases,
    executionStrategy: '串行执行',
    order: data.order,
    enabled: true,
    config: data.config as FlowOrchestrationItem['config']
  })).sort((a, b) => a.order - b.order);
};
