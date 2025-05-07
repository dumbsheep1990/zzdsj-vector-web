import { QaDataset, QaPair, AssistantItem } from './types';

// 模拟助手数据
export const mockAssistants: AssistantItem[] = [
  {
    id: 'assistant-1',
    name: '客服助手',
    avatar: '/assets/avatars/assistant1.png'
  },
  {
    id: 'assistant-2',
    name: '技术支持助手',
    avatar: '/assets/avatars/assistant2.png'
  },
  {
    id: 'assistant-3',
    name: '销售顾问',
    avatar: '/assets/avatars/assistant3.png'
  }
];

// 模拟数据集
export const mockDatasets: QaDataset[] = [
  {
    id: 'dataset-1',
    name: '产品常见问题',
    description: '包含关于产品功能、价格和使用方法的常见问题',
    pairsCount: 68,
    createdAt: '2025-03-15T08:30:00Z',
    updatedAt: '2025-05-01T14:45:00Z',
    status: 'active',
    linkedAssistants: [mockAssistants[0]]
  },
  {
    id: 'dataset-2',
    name: '技术支持问答',
    description: '技术支持相关的问题和解决方案',
    pairsCount: 124,
    createdAt: '2025-02-10T09:15:00Z',
    updatedAt: '2025-04-28T11:20:00Z',
    status: 'active',
    linkedAssistants: [mockAssistants[1], mockAssistants[2]]
  },
  {
    id: 'dataset-3',
    name: '新功能说明',
    description: '关于系统最新功能的问答集合',
    pairsCount: 45,
    createdAt: '2025-04-01T10:00:00Z',
    updatedAt: '2025-04-25T16:30:00Z',
    status: 'processing',
    linkedAssistants: []
  }
];

// 模拟问答对
export const mockQaPairs: QaPair[] = [
  // 一级问题
  {
    id: 'qa-1',
    question: '如何创建新的向量库？',
    answer: '在向量管理页面，点击右上角的"创建向量库"按钮，填写名称和描述后提交即可创建新的向量库。创建后，您可以上传文档进行向量化。',
    tags: ['向量库', '入门指南'],
    createdAt: '2025-03-15T09:30:00Z',
    updatedAt: '2025-03-15T09:30:00Z',
    sourceType: 'manual'
  },
  // 子问题
  {
    id: 'qa-1-1',
    question: '向量库支持哪些类型的文件？',
    answer: '向量库支持多种文档格式，包括TXT、PDF、DOCX、XLSX、PPT、MD等。上传后系统会自动处理并向量化文本内容。',
    tags: ['向量库', '文件格式'],
    createdAt: '2025-03-15T09:35:00Z',
    updatedAt: '2025-03-15T09:35:00Z',
    sourceType: 'auto',
    parentId: 'qa-1'
  },
  {
    id: 'qa-1-2',
    question: '向量库的大小有限制吗？',
    answer: '标准版本的向量库容量为10GB，企业版可扩展至100GB。如果您需要更大的存储空间，请联系我们的销售团队定制解决方案。',
    tags: ['向量库', '容量限制'],
    createdAt: '2025-03-15T09:40:00Z',
    updatedAt: '2025-03-15T09:40:00Z',
    sourceType: 'auto',
    parentId: 'qa-1'
  },
  // 另一个独立问题
  {
    id: 'qa-2',
    question: '如何训练自定义模型？',
    answer: '训练自定义模型需要进入模型管理页面，选择"创建自定义模型"，上传您的训练数据，设置参数后启动训练。系统会自动处理训练过程并通知您训练完成。',
    tags: ['模型训练', '高级功能'],
    createdAt: '2025-03-20T14:20:00Z',
    updatedAt: '2025-03-20T14:20:00Z',
    sourceType: 'manual'
  },
  // 更多问答数据...
  {
    id: 'qa-3',
    question: '如何将问答数据集绑定到助手？',
    answer: '在数据集管理页面，选择目标数据集，点击"绑定助手"按钮，从列表中选择需要绑定的助手，确认后即可完成绑定。绑定后的助手可以使用数据集中的问答内容回答用户问题。',
    tags: ['数据集', '助手绑定'],
    createdAt: '2025-04-05T11:15:00Z',
    updatedAt: '2025-04-05T11:15:00Z',
    sourceType: 'manual'
  }
];

// 组装数据集和问答对关系
export const datasetQaPairs = {
  'dataset-1': ['qa-1', 'qa-1-1', 'qa-1-2', 'qa-3'],
  'dataset-2': ['qa-2'],
  'dataset-3': []
};

// 获取数据集的问答对列表
export const getDatasetQaPairs = (datasetId: string): QaPair[] => {
  const pairIds = datasetQaPairs[datasetId as keyof typeof datasetQaPairs] || [];
  return mockQaPairs.filter(pair => pairIds.includes(pair.id));
};
