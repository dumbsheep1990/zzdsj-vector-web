// Re-export all mock data from individual files in the mockData directory
// This file is maintained for backward compatibility
export * from './mockData/fileData';
export * from './mockData/knowledgeBaseData';
export * from './mockData/searchData';
export * from './mockData/modelData';
export * from './mockData/vectorData';
export * from './mockData/keywordData';
export * from './mockData/metadataData';
export * from './mockData/navigationData';
export * from './mockData/graphData';
export * from './mockData/assistantData';
export * from './mockData/qaData';

export interface Assistant {
  id: string;
  name: string;
  avatar?: string;
  description: string;
  type: 'qa' | 'chat' | 'custom';
  status: 'online' | 'offline' | 'training';
  createTime: string;
  updateTime: string;
  questionCount: number;
  documentCount: number;
  config: {
    model: string;
    temperature: number;
    maxTokens: number;
  };
  capabilities: string[];
}

export const mockAssistants: Assistant[] = [
  {
    id: 'assistant-1',
    name: '产品文档助手',
    description: '专门解答产品相关问题的智能助手',
    type: 'qa',
    status: 'online',
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-03-10 15:30:00',
    questionCount: 128,
    documentCount: 15,
    capabilities: ['产品文档', '用户手册', 'FAQ'],
    config: {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2048
    }
  },
  {
    id: 'assistant-2',
    name: '技术支持助手',
    description: '提供技术文档查询和问题解答服务',
    type: 'qa',
    status: 'online',
    createTime: '2024-02-01 09:00:00',
    updateTime: '2024-03-12 14:20:00',
    questionCount: 256,
    documentCount: 30,
    capabilities: ['技术文档', 'API文档', '故障排除'],
    config: {
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      maxTokens: 4096
    }
  },
  {
    id: 'assistant-3',
    name: '新员工培训助手',
    description: '帮助新员工快速了解公司制度和流程',
    type: 'qa',
    status: 'training',
    createTime: '2024-03-01 11:00:00',
    updateTime: '2024-03-15 16:45:00',
    questionCount: 64,
    documentCount: 8,
    capabilities: ['入职培训', '公司制度', '工作流程'],
    config: {
      model: 'gpt-4',
      temperature: 0.3,
      maxTokens: 2048
    }
  },
  {
    id: 'assistant-4',
    name: '销售培训助手',
    description: '提供销售技巧和产品知识培训',
    type: 'qa',
    status: 'offline',
    createTime: '2024-02-15 13:00:00',
    updateTime: '2024-03-14 17:30:00',
    questionCount: 96,
    documentCount: 12,
    capabilities: ['销售技巧', '产品知识', '客户服务'],
    config: {
      model: 'gpt-3.5-turbo',
      temperature: 0.6,
      maxTokens: 2048
    }
  },
  {
    id: 'assistant-5',
    name: '客服知识库助手',
    description: '协助客服人员快速查找解决方案',
    type: 'qa',
    status: 'online',
    createTime: '2024-01-20 14:00:00',
    updateTime: '2024-03-13 11:20:00',
    questionCount: 320,
    documentCount: 25,
    capabilities: ['客户支持', '问题解答', '服务指南'],
    config: {
      model: 'gpt-4',
      temperature: 0.4,
      maxTokens: 4096
    }
  }
];

export const mockQAStats = {
  totalAssistants: 5,
  onlineAssistants: 3,
  totalDocuments: 90,
  totalQuestions: 864,
  totalSegments: 450,
  processingDocuments: 8,
  activeQuestions: 720,
  averageQuestionsPerDoc: 9.6,
  topTags: ['产品', '技术', '培训', '流程', '政策']
};

export const mockAnswers = [
  {
    id: '1',
    content: '向量数据库是一种专门用于存储和检索向量数据的数据库系统。它能够高效地进行相似度搜索，支持海量高维向量的存储和快速检索。',
    source: '向量数据库介绍.pdf',
    confidence: 0.95,
    rank: 1,
    feedback: null,
    isManual: false,
    createTime: '2024-03-15T10:00:00Z',
    documentInfo: {
      title: '向量数据库介绍.pdf',
      page: 1,
      segment: '第一章 基础概念',
      segmentId: 'seg_001',
      similarity: 0.95,
      relevanceScore: 0.92
    }
  },
  {
    id: '2',
    content: '向量数据库的主要应用场景包括：图像检索、文本语义搜索、推荐系统、人脸识别等领域。它通过将数据转换为高维向量，实现基于语义的相似度匹配。',
    source: '向量数据库介绍.pdf',
    confidence: 0.88,
    rank: 2,
    feedback: 'positive',
    isManual: false,
    createTime: '2024-03-15T10:01:00Z',
    documentInfo: {
      title: '向量数据库介绍.pdf',
      page: 2,
      segment: '第一章 应用场景',
      segmentId: 'seg_002',
      similarity: 0.88,
      relevanceScore: 0.85
    }
  },
  {
    id: '3',
    content: '向量数据库使用特殊的索引结构（如HNSW、IVF等）来加速向量检索过程，能够在毫秒级别内完成海量数据的相似度搜索。',
    source: '向量数据库技术原理.pdf',
    confidence: 0.82,
    rank: 3,
    feedback: null,
    isManual: false,
    createTime: '2024-03-15T10:02:00Z',
    documentInfo: {
      title: '向量数据库技术原理.pdf',
      page: 15,
      segment: '第三章 索引结构',
      segmentId: 'seg_003',
      similarity: 0.82,
      relevanceScore: 0.79
    }
  }
];

export const mockQuestions = [
  {
    id: '1',
    question: '什么是向量数据库？',
    answers: mockAnswers,
    status: 'active',
    documentId: 'doc_001',
    segmentId: 'seg_001',
    createTime: '2024-03-15T09:00:00Z',
    updateTime: '2024-03-15T10:00:00Z',
    tags: ['基础概念', '数据库']
  },
  {
    id: '2',
    question: '向量数据库有哪些优势？',
    answers: mockAnswers.slice(1),
    status: 'active',
    documentId: 'doc_002',
    segmentId: 'seg_002',
    createTime: '2024-03-15T09:30:00Z',
    updateTime: '2024-03-15T10:30:00Z',
    tags: ['性能', '特性']
  }
];
