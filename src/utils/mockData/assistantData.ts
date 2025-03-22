import { Assistant } from '../../components/modules/assistants/types';

export const mockAssistants: Assistant[] = [
  {
    id: 'assistant-1',
    name: '知识库问答助手',
    description: '基于企业内部知识库的智能问答助手，可以回答关于公司政策、产品信息和操作指南等方面的问题。',
    model: 'GPT-4',
    models: [
      { type: '推理模型', name: 'GPT-4' },
      { type: '向量模型', name: 'text-embedding-3-large' },
      { type: '重排模型', name: 'bge-reranker-v2' }
    ],
    capabilities: ['知识问答', '信息检索', '文档分析'],
    status: 'online',
    createTime: '2025-02-18 09:30:00',
    knowledgeBases: [
      { id: 'kb-1', name: '企业政策库', documentCount: 124 },
      { id: 'kb-2', name: '产品手册', documentCount: 56 }
    ],
    usageStats: {
      totalChats: 1245,
      satisfactionRate: 92,
      tokenUsage: 3267891,
      apiCalls: 4562
    }
  },
  {
    id: 'assistant-2',
    name: '数据分析助手',
    description: '专注于数据分析的AI助手，可以帮助用户分析数据趋势，生成报表，并提供数据可视化建议。',
    model: 'GPT-4-32k',
    models: [
      { type: '推理模型', name: 'GPT-4-32k' },
      { type: '向量模型', name: 'text-embedding-3-small' }
    ],
    capabilities: ['数据分析', '统计建模', '内容总结'],
    status: 'online',
    createTime: '2025-02-10 14:15:00',
    knowledgeBases: [
      { id: 'kb-3', name: '数据分析指南', documentCount: 78 }
    ],
    usageStats: {
      totalChats: 867,
      satisfactionRate: 88,
      tokenUsage: 2589312,
      apiCalls: 3123
    }
  },
  {
    id: 'assistant-3',
    name: '通用知识助手',
    description: '提供广泛知识领域的问答服务，包括科学、历史、文化等各个方面的信息。',
    model: 'GPT-3.5',
    models: [
      { type: '推理模型', name: 'GPT-3.5' }
    ],
    capabilities: ['知识问答', '内容总结', '信息检索'],
    status: 'offline',
    createTime: '2025-02-05 16:45:00',
    knowledgeBases: [],
    usageStats: {
      totalChats: 3452,
      satisfactionRate: 95,
      tokenUsage: 8762145,
      apiCalls: 9784
    }
  },
  {
    id: 'assistant-4',
    name: '文档处理助手',
    description: '专门处理文档的AI助手，提供文档摘要、关键信息提取和内容分类等功能。',
    model: 'GPT-4',
    models: [
      { type: '推理模型', name: 'GPT-4' },
      { type: '向量模型', name: 'text-embedding-3-large' },
      { type: '重排模型', name: 'bge-reranker-v2' }
    ],
    capabilities: ['文档分析', '内容总结', '信息检索'],
    status: 'online',
    createTime: '2025-01-28 11:20:00',
    knowledgeBases: [
      { id: 'kb-4', name: '技术文档库', documentCount: 215 },
      { id: 'kb-5', name: '研究论文集', documentCount: 143 }
    ],
    usageStats: {
      totalChats: 967,
      satisfactionRate: 90,
      tokenUsage: 4315920,
      apiCalls: 5142
    }
  },
  {
    id: 'assistant-5',
    name: '知识库管理助手',
    description: '专注于帮助管理和优化知识库内容，提供文档组织、向量化建议和元数据管理的智能支持。',
    model: '文心一言',
    models: [
      { type: '推理模型', name: '文心一言' },
      { type: '向量模型', name: 'bge-large-zh-v1.5' }
    ],
    capabilities: ['知识库管理', '向量化管理', '元数据管理'],
    status: 'online',
    createTime: '2025-03-01 10:25:00',
    knowledgeBases: [
      { id: 'kb-6', name: '知识库最佳实践', documentCount: 86 },
      { id: 'kb-7', name: '向量化指南', documentCount: 42 },
      { id: 'kb-8', name: '元数据标准规范', documentCount: 65 }
    ],
    usageStats: {
      totalChats: 548,
      satisfactionRate: 94,
      tokenUsage: 1645832,
      apiCalls: 2367
    }
  }
];
