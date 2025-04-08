import { ToolOutlined, RobotOutlined, ApiOutlined, DatabaseOutlined } from '@ant-design/icons';

export type ToolCategory = 'all' | 'crawler' | 'cleaner' | 'formatter' | 'generator';

export interface Tool {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: ToolCategory;
  subCategory: string;
  tags: string[];
  usageCount: number;
  isFavorite: boolean;
  lastUsed?: string;
  version?: string;
}

export const tools: Tool[] = [
  {
    id: '1',
    name: '智能网页爬虫',
    icon: 'RobotOutlined',
    description: '基于AI的智能网页爬虫，支持动态内容抓取和智能解析',
    category: 'crawler',
    subCategory: '智能爬取',
    tags: ['AI爬虫', '动态内容', '智能解析', '反爬虫'],
    usageCount: 256,
    isFavorite: true,
    lastUsed: '2024-03-15',
    version: '2.1.0'
  },
  {
    id: '2',
    name: '语义爬虫',
    icon: 'ApiOutlined',
    description: '基于语义理解的智能爬虫，支持自然语言处理和内容分类',
    category: 'crawler',
    subCategory: '语义爬取',
    tags: ['NLP', '语义分析', '内容分类', '智能提取'],
    usageCount: 189,
    isFavorite: false,
    lastUsed: '2024-03-14',
    version: '1.5.0'
  },
  {
    id: '3',
    name: '数据清洗器',
    icon: 'ToolOutlined',
    description: '智能数据清洗工具，支持数据去重、格式转换和质量检测',
    category: 'cleaner',
    subCategory: '数据清洗',
    tags: ['数据清洗', '去重', '格式转换', '质量检测'],
    usageCount: 342,
    isFavorite: true,
    lastUsed: '2024-03-16',
    version: '3.0.0'
  },
  {
    id: '4',
    name: '智能数据清洗',
    icon: 'RobotOutlined',
    description: '基于机器学习的智能数据清洗系统，自动识别和修复数据问题',
    category: 'cleaner',
    subCategory: '智能清洗',
    tags: ['机器学习', '自动修复', '异常检测', '智能清洗'],
    usageCount: 178,
    isFavorite: false,
    lastUsed: '2024-03-13',
    version: '2.2.0'
  },
  {
    id: '5',
    name: 'JSON格式化',
    icon: 'ToolOutlined',
    description: '专业的JSON数据格式化工具，支持语法检查和美化',
    category: 'formatter',
    subCategory: '数据格式化',
    tags: ['JSON', '格式化', '语法检查', '美化'],
    usageCount: 421,
    isFavorite: false,
    lastUsed: '2024-03-12',
    version: '1.8.0'
  },
  {
    id: '6',
    name: '数据集生成器',
    icon: 'DatabaseOutlined',
    description: '智能数据集生成工具，支持多种数据类型的模拟生成',
    category: 'generator',
    subCategory: '数据集生成',
    tags: ['数据生成', '模拟数据', '测试数据', '智能生成'],
    usageCount: 156,
    isFavorite: false,
    lastUsed: '2024-03-11',
    version: '2.0.0'
  }
]; 