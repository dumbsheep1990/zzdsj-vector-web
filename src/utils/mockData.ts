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
