import { KeywordItem } from "../types";

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

// 关键词相关性
export interface KeywordRelevance {
  keyword: string;
  relevance: number;
}
