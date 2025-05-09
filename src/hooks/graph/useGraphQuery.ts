import { useState, useCallback, useMemo } from 'react';
import { useAPI } from '../common/useAPI';
import { message } from 'antd';
import { GraphNode } from './useGraphData';
import { GraphRelation } from './useGraphRelation';

// 定义查询结果类型
export interface GraphQueryResult {
  nodes: GraphNode[];
  relations: GraphRelation[];
  executionTime: number; // 毫秒
  query: string;
  timestamp: string;
}

// 定义查询历史记录类型
export interface QueryHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  executionTime: number;
  resultSummary: string;
}

// 定义查询参数
export interface QueryParams {
  query: string;
  limit?: number;
  parameters?: Record<string, any>;
}

// 定义查询模板类型
export interface QueryTemplate {
  id: string;
  name: string;
  description: string;
  query: string;
  parameters: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean' | 'date';
    description: string;
    defaultValue?: any;
  }>;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// 模拟执行查询的API函数
const executeQueryAPI = async (params: QueryParams): Promise<GraphQueryResult> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));
  
  // 模拟执行失败的情况
  if (params.query.toLowerCase().includes('error')) {
    throw new Error('查询语法错误: 无效的表达式');
  }
  
  // 随机生成结果数据
  const nodeCount = Math.floor(Math.random() * 5) + 1;
  const nodes: GraphNode[] = [];
  
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      id: `result-${i}`,
      label: `查询结果 ${i + 1}`,
      type: ['Person', 'Organization', 'Product', 'Event', 'Location'][Math.floor(Math.random() * 5)],
      properties: { 
        name: `结果名称 ${i + 1}`, 
        value: Math.floor(Math.random() * 100) 
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  // 随机生成关系
  const relationCount = Math.floor(Math.random() * 3);
  const relations: GraphRelation[] = [];
  
  for (let i = 0; i < relationCount; i++) {
    const sourceIndex = Math.floor(Math.random() * nodes.length);
    let targetIndex = Math.floor(Math.random() * nodes.length);
    
    // 确保关系的两端不是同一个节点
    while (targetIndex === sourceIndex && nodes.length > 1) {
      targetIndex = Math.floor(Math.random() * nodes.length);
    }
    
    relations.push({
      id: `relation-${i}`,
      type: ['拥有', '包含', '关联', '参与', '位于'][Math.floor(Math.random() * 5)],
      sourceId: nodes[sourceIndex].id,
      targetId: nodes[targetIndex].id,
      properties: {
        strength: Math.floor(Math.random() * 100),
        since: new Date().toISOString().split('T')[0]
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  return {
    nodes,
    relations,
    executionTime: Math.floor(Math.random() * 200) + 50,
    query: params.query,
    timestamp: new Date().toISOString()
  };
};

// 模拟获取查询历史的API函数
const fetchQueryHistoryAPI = async (): Promise<QueryHistoryItem[]> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return [
    {
      id: '1',
      query: 'MATCH (n:Person) RETURN n LIMIT 10',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      executionTime: 120,
      resultSummary: '返回 5 个节点, 0 个关系'
    },
    {
      id: '2',
      query: 'MATCH (n:Organization)-[r]->(p:Product) RETURN n, r, p',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      executionTime: 250,
      resultSummary: '返回 8 个节点, 12 个关系'
    },
    {
      id: '3',
      query: 'MATCH path = shortestPath((a:Person)-[*]-(b:Person)) WHERE a.name = "张三" AND b.name = "李四" RETURN path',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      executionTime: 380,
      resultSummary: '返回 1 条路径, 4 个节点, 3 个关系'
    }
  ];
};

// 模拟获取查询模板的API函数
const fetchQueryTemplatesAPI = async (): Promise<QueryTemplate[]> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return [
    {
      id: '1',
      name: '获取人物关系网络',
      description: '查询特定人物及其直接关联的所有实体',
      query: 'MATCH (p:Person {name: $personName})-[r]-(n) RETURN p, r, n LIMIT $limit',
      parameters: [
        {
          name: 'personName',
          type: 'string',
          description: '人物名称',
          defaultValue: '张三'
        },
        {
          name: 'limit',
          type: 'number',
          description: '结果数量限制',
          defaultValue: 20
        }
      ],
      tags: ['人物关系', '基础查询'],
      createdAt: '2023-09-01T10:00:00Z',
      updatedAt: '2023-09-01T10:00:00Z'
    },
    {
      id: '2',
      name: '组织与产品关系',
      description: '查询组织及其拥有的所有产品',
      query: 'MATCH (o:Organization {name: $orgName})-[r:拥有]->(p:Product) RETURN o, r, p',
      parameters: [
        {
          name: 'orgName',
          type: 'string',
          description: '组织名称',
          defaultValue: '科技有限公司'
        }
      ],
      tags: ['组织分析', '产品管理'],
      createdAt: '2023-09-02T14:30:00Z',
      updatedAt: '2023-09-05T11:20:00Z'
    },
    {
      id: '3',
      name: '最短路径分析',
      description: '查找两个节点之间的最短路径',
      query: 'MATCH path = shortestPath((a)-[*..6]-(b)) WHERE id(a) = $startNodeId AND id(b) = $endNodeId RETURN path',
      parameters: [
        {
          name: 'startNodeId',
          type: 'string',
          description: '起始节点ID'
        },
        {
          name: 'endNodeId',
          type: 'string',
          description: '目标节点ID'
        }
      ],
      tags: ['路径分析', '高级查询'],
      createdAt: '2023-09-10T09:15:00Z',
      updatedAt: '2023-09-10T09:15:00Z'
    }
  ];
};

/**
 * 图查询管理Hook
 * 
 * 负责图数据库查询执行、历史记录和模板管理
 * 
 * @returns {object} 包含图查询功能和状态的对象
 */
export const useGraphQuery = () => {
  // 查询结果状态
  const [queryResults, setQueryResults] = useState<GraphQueryResult | null>(null);
  
  // 查询历史
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([]);
  
  // 查询模板
  const [queryTemplates, setQueryTemplates] = useState<QueryTemplate[]>([]);
  
  // 当前查询
  const [currentQuery, setCurrentQuery] = useState<string>('');
  
  // 查询参数
  const [queryParameters, setQueryParameters] = useState<Record<string, any>>({});
  
  // 使用通用API hook处理数据获取
  const {
    loading: isExecuting,
    error: queryError,
    execute: executeQueryRequest
  } = useAPI(executeQueryAPI);
  
  const {
    loading: isLoadingHistory,
    error: historyError,
    execute: fetchHistory,
    data: historyData
  } = useAPI<void, QueryHistoryItem[]>(fetchQueryHistoryAPI);
  
  const {
    loading: isLoadingTemplates,
    error: templatesError,
    execute: fetchTemplates,
    data: templatesData
  } = useAPI<void, QueryTemplate[]>(fetchQueryTemplatesAPI);
  
  // 当历史数据加载完成时，更新状态
  useState(() => {
    if (historyData) {
      setQueryHistory(historyData);
    }
  });
  
  // 当模板数据加载完成时，更新状态
  useState(() => {
    if (templatesData) {
      setQueryTemplates(templatesData);
    }
  });
  
  // 执行查询
  const executeQuery = useCallback(async (query: string, parameters: Record<string, any> = {}, limit?: number) => {
    try {
      // 更新当前查询
      setCurrentQuery(query);
      setQueryParameters(parameters);
      
      // 执行查询
      const result = await executeQueryRequest({
        query,
        parameters,
        limit
      });
      
      // 更新结果
      setQueryResults(result);
      
      // 添加到查询历史
      const historyItem: QueryHistoryItem = {
        id: Date.now().toString(),
        query,
        timestamp: new Date().toISOString(),
        executionTime: result.executionTime,
        resultSummary: `返回 ${result.nodes.length} 个节点, ${result.relations.length} 个关系`
      };
      
      setQueryHistory(prev => [historyItem, ...prev]);
      
      message.success('查询执行成功');
      return result;
    } catch (error) {
      console.error('查询执行失败:', error);
      message.error(`查询执行失败: ${error instanceof Error ? error.message : '未知错误'}`);
      return null;
    }
  }, [executeQueryRequest]);
  
  // 从模板创建查询
  const executeQueryFromTemplate = useCallback(async (templateId: string, parameters: Record<string, any> = {}) => {
    const template = queryTemplates.find(t => t.id === templateId);
    
    if (!template) {
      message.error('未找到查询模板');
      return null;
    }
    
    // 填充默认参数
    const filledParams: Record<string, any> = {};
    template.parameters.forEach(param => {
      filledParams[param.name] = parameters[param.name] !== undefined 
        ? parameters[param.name] 
        : param.defaultValue;
    });
    
    return executeQuery(template.query, filledParams);
  }, [queryTemplates, executeQuery]);
  
  // 加载查询历史
  const loadQueryHistory = useCallback(async () => {
    try {
      const history = await fetchHistory();
      return history;
    } catch (error) {
      console.error('加载查询历史失败:', error);
      message.error('加载查询历史失败');
      return null;
    }
  }, [fetchHistory]);
  
  // 加载查询模板
  const loadQueryTemplates = useCallback(async () => {
    try {
      const templates = await fetchTemplates();
      return templates;
    } catch (error) {
      console.error('加载查询模板失败:', error);
      message.error('加载查询模板失败');
      return null;
    }
  }, [fetchTemplates]);
  
  // 重新执行历史查询
  const reExecuteHistoryQuery = useCallback(async (historyItemId: string) => {
    const item = queryHistory.find(h => h.id === historyItemId);
    
    if (!item) {
      message.error('未找到历史查询记录');
      return null;
    }
    
    return executeQuery(item.query);
  }, [queryHistory, executeQuery]);
  
  // 根据结果计算节点间关系统计
  const nodeRelationStats = useMemo(() => {
    if (!queryResults) return null;
    
    const { nodes, relations } = queryResults;
    const stats: Record<string, { incoming: number, outgoing: number, total: number }> = {};
    
    // 初始化所有节点的统计数据
    nodes.forEach(node => {
      stats[node.id] = { incoming: 0, outgoing: 0, total: 0 };
    });
    
    // 计算每个节点的关系数量
    relations.forEach(relation => {
      if (stats[relation.sourceId]) {
        stats[relation.sourceId].outgoing += 1;
        stats[relation.sourceId].total += 1;
      }
      
      if (stats[relation.targetId]) {
        stats[relation.targetId].incoming += 1;
        stats[relation.targetId].total += 1;
      }
    });
    
    return stats;
  }, [queryResults]);
  
  // 获取节点的关联节点
  const getConnectedNodes = useCallback((nodeId: string) => {
    if (!queryResults) return [];
    
    const connectedNodeIds = new Set<string>();
    
    queryResults.relations.forEach(relation => {
      if (relation.sourceId === nodeId) {
        connectedNodeIds.add(relation.targetId);
      } else if (relation.targetId === nodeId) {
        connectedNodeIds.add(relation.sourceId);
      }
    });
    
    return queryResults.nodes.filter(node => connectedNodeIds.has(node.id));
  }, [queryResults]);
  
  // 获取两个节点之间的关系
  const getRelationsBetweenNodes = useCallback((nodeId1: string, nodeId2: string) => {
    if (!queryResults) return [];
    
    return queryResults.relations.filter(relation => 
      (relation.sourceId === nodeId1 && relation.targetId === nodeId2) ||
      (relation.sourceId === nodeId2 && relation.targetId === nodeId1)
    );
  }, [queryResults]);
  
  return {
    // 查询状态和结果
    queryResults,
    currentQuery,
    queryParameters,
    isExecuting,
    queryError,
    
    // 历史和模板
    queryHistory,
    queryTemplates,
    isLoadingHistory,
    isLoadingTemplates,
    historyError,
    templatesError,
    
    // 执行查询
    executeQuery,
    executeQueryFromTemplate,
    reExecuteHistoryQuery,
    
    // 加载相关数据
    loadQueryHistory,
    loadQueryTemplates,
    
    // 结果分析
    nodeRelationStats,
    getConnectedNodes,
    getRelationsBetweenNodes,
    
    // 查询操作
    setCurrentQuery,
    setQueryParameters
  };
};
