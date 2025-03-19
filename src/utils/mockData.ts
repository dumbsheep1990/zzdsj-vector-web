import { FileItem, KnowledgeBaseItem, SearchRecordItem, ModelItem, VectorItem, MetadataItem, KeywordItem } from "./types";

// 文件数据
export const fileData: FileItem[] = [
  {
    id: '1',
    name: '城市规划白皮书.pdf',
    type: 'pdf',
    size: '2.4MB',
    date: '2023-03-15',
    category: '政策文档',
    status: '已向量化',
    isFolder: false,
    parentId: '101',
    path: '/政策文档/城市规划',
    keywords: [
      { keyword: '城市规划', relevance: 0.92 },
      { keyword: '白皮书', relevance: 0.85 },
      { keyword: '可持续发展', relevance: 0.78 },
    ]
  },
  {
    id: '2',
    name: '政策解读报告.docx',
    type: 'docx',
    size: '1.8MB',
    date: '2023-03-14',
    category: '政策文档',
    status: '已向量化',
    isFolder: false,
    parentId: '101',
    path: '/政策文档/城市规划',
    keywords: [
      { keyword: '政策解读', relevance: 0.95 },
      { keyword: '报告', relevance: 0.82 },
      { keyword: '政府工作', relevance: 0.76 },
    ]
  },
  {
    id: '3',
    name: '经济发展数据集.xlsx',
    type: 'xlsx',
    size: '4.2MB',
    date: '2023-03-10',
    category: '数据分析',
    status: '处理中',
    isFolder: false,
    parentId: '102',
    path: '/数据分析/经济数据',
    keywords: [
      { keyword: '经济发展', relevance: 0.91 },
      { keyword: '数据集', relevance: 0.88 },
      { keyword: '统计分析', relevance: 0.79 },
    ]
  },
  {
    id: '4',
    name: '智慧城市建设方案.pptx',
    type: 'pptx',
    size: '5.6MB',
    date: '2023-03-05',
    category: '方案设计',
    status: '已向量化',
    isFolder: false,
    parentId: '103',
    path: '/方案设计/智慧城市',
    keywords: [
      { keyword: '智慧城市', relevance: 0.94 },
      { keyword: '建设方案', relevance: 0.87 },
      { keyword: '城市管理', relevance: 0.81 },
    ]
  },
  {
    id: '5',
    name: '政府AI应用白皮书.pdf',
    type: 'pdf',
    size: '3.7MB',
    date: '2023-02-28',
    category: '研究报告',
    status: '未处理',
    isFolder: false,
    parentId: '104',
    path: '/研究报告/AI应用',
    keywords: [
      { keyword: '政府', relevance: 0.89 },
      { keyword: 'AI应用', relevance: 0.93 },
      { keyword: '白皮书', relevance: 0.84 },
    ]
  },
  // 文件夹
  {
    id: '100',
    name: '根目录',
    type: 'folder',
    size: '-',
    date: '2023-01-01',
    category: '文件夹',
    status: '-',
    isFolder: true,
    parentId: null,
    path: '/',
    children: []
  },
  {
    id: '101',
    name: '政策文档',
    type: 'folder',
    size: '-',
    date: '2023-01-15',
    category: '文件夹',
    status: '-',
    isFolder: true,
    parentId: '100',
    path: '/政策文档',
    children: []
  },
  {
    id: '102',
    name: '数据分析',
    type: 'folder',
    size: '-',
    date: '2023-01-20',
    category: '文件夹',
    status: '-',
    isFolder: true,
    parentId: '100',
    path: '/数据分析',
    children: []
  },
  {
    id: '103',
    name: '方案设计',
    type: 'folder',
    size: '-',
    date: '2023-02-05',
    category: '文件夹',
    status: '-',
    isFolder: true,
    parentId: '100',
    path: '/方案设计',
    children: []
  },
  {
    id: '104',
    name: '研究报告',
    type: 'folder',
    size: '-',
    date: '2023-02-10',
    category: '文件夹',
    status: '-',
    isFolder: true,
    parentId: '100',
    path: '/研究报告',
    children: []
  },
  {
    id: '105',
    name: '城市规划',
    type: 'folder',
    size: '-',
    date: '2023-02-15',
    category: '文件夹',
    status: '-',
    isFolder: true,
    parentId: '101',
    path: '/政策文档/城市规划',
    children: []
  },
  {
    id: '106',
    name: '经济数据',
    type: 'folder',
    size: '-',
    date: '2023-02-18',
    category: '文件夹',
    status: '-',
    isFolder: true,
    parentId: '102',
    path: '/数据分析/经济数据',
    children: []
  },
  {
    id: '107',
    name: '智慧城市',
    type: 'folder',
    size: '-',
    date: '2023-02-20',
    category: '文件夹',
    status: '-',
    isFolder: true,
    parentId: '103',
    path: '/方案设计/智慧城市',
    children: []
  },
  {
    id: '108',
    name: 'AI应用',
    type: 'folder',
    size: '-',
    date: '2023-02-25',
    category: '文件夹',
    status: '-',
    isFolder: true,
    parentId: '104',
    path: '/研究报告/AI应用',
    children: []
  }
];

// Helper function to build folder hierarchy
export const buildFileHierarchy = () => {
  const fileMap = new Map<string, FileItem>();
  const rootItems: FileItem[] = [];

  // First pass: create a map of all items by ID
  fileData.forEach(item => {
    if (item.id !== null) {
      fileMap.set(item.id, {...item, children: []});
    }
  });

  // Second pass: build the hierarchy
  fileData.forEach(item => {
    if (item.id === null) return; // Skip items with null id
    
    if (item.parentId === null) {
      rootItems.push(fileMap.get(item.id)!);
    } else {
      const parent = fileMap.get(item.parentId);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(fileMap.get(item.id)!);
      }
    }
  });

  return rootItems;
};

// 知识库数据
export const knowledgeBaseData: KnowledgeBaseItem[] = [
  {
    id: '1',
    name: '城市规划知识库',
    description: '包含城市规划相关的政策文件、规划方案和研究报告',
    fileCount: 128,
    vectorCount: 25600,
    lastUpdated: '2023-03-15',
    category: '文档',
    size: '128MB',
    status: '正常',
    vectorized: 98,
    pendingFiles: 30,
    tags: ['城市规划', '政策文档', '研究报告'],
    recentKeywords: ['可持续发展', '城市规划', '政策解读']
  },
  {
    id: '2',
    name: '政府工作报告库',
    description: '历年政府工作报告及解读文件',
    fileCount: 86,
    vectorCount: 17200,
    lastUpdated: '2023-03-10',
    category: '会议记录',
    size: '86MB',
    status: '正常',
    vectorized: 76,
    pendingFiles: 10,
    tags: ['政府工作', '工作报告', '政策解读'],
    recentKeywords: ['政府工作', '工作报告', '政策解读']
  },
  {
    id: '3',
    name: '经济数据分析库',
    description: '经济发展数据及分析报告',
    fileCount: 156,
    vectorCount: 31200,
    lastUpdated: '2023-03-08',
    category: '数据分析',
    size: '156MB',
    status: '正常',
    vectorized: 120,
    pendingFiles: 36,
    tags: ['经济数据', '数据分析', '统计分析'],
    recentKeywords: ['经济发展', '数据分析', '统计分析']
  },
  {
    id: '4',
    name: '智慧城市建设库',
    description: '智慧城市建设方案和实施案例',
    fileCount: 92,
    vectorCount: 18400,
    lastUpdated: '2023-03-05',
    category: '配置',
    size: '92MB',
    status: '正常',
    vectorized: 82,
    pendingFiles: 10,
    tags: ['智慧城市', '建设方案', '实施案例'],
    recentKeywords: ['智慧城市', '建设方案', '实施案例']
  },
  {
    id: '5',
    name: '政策法规库',
    description: '各类政策法规文件及解读',
    fileCount: 210,
    vectorCount: 42000,
    lastUpdated: '2023-03-01',
    category: '标准',
    size: '210MB',
    status: '正常',
    vectorized: 180,
    pendingFiles: 30,
    tags: ['政策法规', '政策解读', '法规标准'],
    recentKeywords: ['政策法规', '政策解读', '法规标准']
  }
];

// 搜索记录数据
export const searchRecordsData: SearchRecordItem[] = [
  {
    id: 1,
    query: '城市规划 可持续发展',
    timestamp: '2023-03-15 14:30',
    results: 24,
    duration: '0.8s',
    user: '管理员',
    source: '网页界面'
  },
  {
    id: 2,
    query: '政府工作报告 2023',
    timestamp: '2023-03-14 10:15',
    results: 5,
    duration: '0.6s',
    user: '管理员',
    source: '网页界面'
  },
  {
    id: 3,
    query: '经济发展 数据分析',
    timestamp: '2023-03-12 16:45',
    results: 18,
    duration: '1.2s',
    user: '用户1',
    source: '应用程序接口'
  },
  {
    id: 4,
    query: '智慧城市 建设方案',
    timestamp: '2023-03-10 09:20',
    results: 12,
    duration: '0.9s',
    user: '用户2',
    source: '网页界面'
  },
  {
    id: 5,
    query: '政策法规 最新',
    timestamp: '2023-03-08 11:30',
    results: 32,
    duration: '1.5s',
    user: '用户3',
    source: '应用程序接口'
  }
];

// 模型数据
export const modelsData: ModelItem[] = [
  {
    id: 1,
    name: 'GPT-4',
    type: '大型语言模型',
    status: '已部署',
    lastUsed: '2023-03-15',
    provider: 'OpenAI',
    version: '4.0',
    usageCount: 145,
    parameters: 1750000000000
  },
  {
    id: 2,
    name: 'BERT-Large',
    type: '编码器模型',
    status: '已部署',
    lastUsed: '2023-03-14',
    provider: 'Hugging Face',
    version: '1.2',
    usageCount: 87,
    parameters: 340000000
  },
  {
    id: 3,
    name: 'T5-Large',
    type: '编码器-解码器模型',
    status: '训练中',
    lastUsed: '2023-03-10',
    provider: 'Hugging Face',
    version: '1.1',
    usageCount: 42,
    parameters: 770000000
  },
  {
    id: 4,
    name: 'RoBERTa',
    type: '编码器模型',
    status: '已部署',
    lastUsed: '2023-03-08',
    provider: 'Hugging Face',
    version: '1.0',
    usageCount: 32,
    parameters: 355000000
  },
  {
    id: 5,
    name: 'LLaMA-13B',
    type: '大型语言模型',
    status: '微调中',
    lastUsed: '2023-03-05',
    provider: 'Meta AI',
    version: '1.0',
    usageCount: 21,
    parameters: 13000000000
  }
];

// 向量数据
export const vectorData: VectorItem[] = [
  {
    id: 1,
    name: '政策文档向量库',
    fileCount: 126,
    lastUpdated: '2023-03-16',
    size: '458MB',
    status: '活跃'
  },
  {
    id: 2,
    name: '法规条例向量库',
    fileCount: 84,
    lastUpdated: '2023-03-14',
    size: '312MB',
    status: '活跃'
  },
  {
    id: 3,
    name: '历史会议记录',
    fileCount: 53,
    lastUpdated: '2023-03-10',
    size: '215MB',
    status: '活跃'
  },
  {
    id: 4,
    name: '经济数据分析',
    fileCount: 37,
    lastUpdated: '2023-03-05',
    size: '178MB',
    status: '维护中'
  }
];

// 关键词数据
export const keywordsData: KeywordItem[] = [
  {
    id: 1,
    keyword: '智慧城市建设',
    frequency: 156,
    lastUsed: '2023-03-16',
    category: '城市建设方案',
    importance: 'high',
    relatedKeywords: [6, 2, 5]
  },
  {
    id: 2,
    keyword: '数字经济发展',
    frequency: 124,
    lastUsed: '2023-03-15',
    category: '经济发展数据',
    importance: 'high',
    relatedKeywords: [1, 4, 5]
  },
  {
    id: 3,
    keyword: '政策解读',
    frequency: 98,
    lastUsed: '2023-03-14',
    category: '政策文档',
    importance: 'medium',
    relatedKeywords: [7, 5]
  },
  {
    id: 4,
    keyword: '数据分析',
    frequency: 87,
    lastUsed: '2023-03-12',
    category: '数据分析',
    importance: 'medium',
    relatedKeywords: [2, 5]
  },
  {
    id: 5,
    keyword: '人工智能',
    frequency: 76,
    lastUsed: '2023-03-10',
    category: '人工智能研究',
    importance: 'medium',
    relatedKeywords: [1, 2, 3, 4]
  },
  {
    id: 6,
    keyword: '城市规划',
    frequency: 65,
    lastUsed: '2023-03-08',
    category: '城市规划方案',
    importance: 'high',
    relatedKeywords: [1]
  },
  {
    id: 7,
    keyword: '法规标准',
    frequency: 54,
    lastUsed: '2023-03-05',
    category: '法规标准',
    importance: 'low',
    relatedKeywords: [3]
  },
  {
    id: 8,
    keyword: '历史会议',
    frequency: 43,
    lastUsed: '2023-03-02',
    category: '历史会议记录',
    importance: 'low',
    relatedKeywords: []
  }
];

// 元数据模板数据
export const metadataTemplates: MetadataItem[] = [
  {
    id: 1,
    name: '政策文档模板',
    fields: 12,
    lastUpdated: '2023-03-15',
    usage: '广泛使用'
  },
  {
    id: 2,
    name: '会议记录模板',
    fields: 8,
    lastUpdated: '2023-03-10',
    usage: '部分使用'
  },
  {
    id: 3,
    name: '法规标准模板',
    fields: 15,
    lastUpdated: '2023-03-05',
    usage: '广泛使用'
  },
  {
    id: 4,
    name: '研究报告模板',
    fields: 10,
    lastUpdated: '2023-02-28',
    usage: '部分使用'
  }
];

// 导航菜单数据
export const navigationItems = [
  {
    id: 'files',
    label: '知识库管理',
    iconType: 'FileText',
    children: [
      {
        id: 'knowledge-base',
        label: '知识库',
        iconType: 'Library'
      },
      {
        id: 'vectors',
        label: '向量化管理',
        iconType: 'Grid'
      },
      {
        id: 'metadata',
        label: '元数据管理',
        iconType: 'Database'
      }
    ]
  },
  {
    id: 'models',
    label: '模型管理',
    iconType: 'Code'
  },
  {
    id: 'settings',
    label: '系统设置',
    iconType: 'Settings'
  }
];

interface GraphNode {
  id: string;
  label: string;
  type: string;
}

interface GraphLink {
  source: string;
  target: string;
  value: number;
}

// 生成知识图谱数据的辅助函数
export const generateKnowledgeGraphData = () => {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  // 添加关键词节点
  keywordsData.forEach(keyword => {
    nodes.push({
      id: `keyword-${keyword.id}`,
      label: keyword.keyword,
      type: 'keyword'
    });

    // 添加关联关系
    keyword.relatedKeywords.forEach((relatedId: number) => {
      links.push({
        source: `keyword-${keyword.id}`,
        target: `keyword-${relatedId}`,
        value: 1
      });
    });
  });

  return { nodes, links };
};

// 关键词相关性
export interface KeywordRelevance {
  keyword: string;
  relevance: number;
}