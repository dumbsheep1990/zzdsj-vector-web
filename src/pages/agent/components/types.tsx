import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CodeIcon from '@mui/icons-material/Code';
import BuildIcon from '@mui/icons-material/Build';
import ImageIcon from '@mui/icons-material/Image';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import StorageIcon from '@mui/icons-material/Storage';
import DescriptionIcon from '@mui/icons-material/Description';
import TranslateIcon from '@mui/icons-material/Translate';

// 智能体基础类型
export const baseAgentTypes = [
  { value: 'assistant', label: '通用助手' },
  { value: 'coder', label: '代码专家' },
  { value: 'researcher', label: '研究员' },
  { value: 'customized', label: '自定义' }
];

// 工具接口定义
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon?: React.ReactNode;
}

// 工具类别颜色类型
export type CategoryColorType = {
  bg: string;
  text: string;
  border: string;
};

export type CategoryColorsType = {
  [key: string]: CategoryColorType;
};

// 工具类别颜色
export const categoryColors: CategoryColorsType = {
  research: { bg: '#e3f2fd', text: '#1565c0', border: '#90caf9' },
  coding: { bg: '#e8f5e9', text: '#2e7d32', border: '#a5d6a7' },
  utility: { bg: '#e8eaf6', text: '#3949ab', border: '#9fa8da' },
  data: { bg: '#e0f7fa', text: '#00838f', border: '#80deea' },
  creative: { bg: '#f3e5f5', text: '#7b1fa2', border: '#ce93d8' },
  analysis: { bg: '#f1f8e9', text: '#558b2f', border: '#c5e1a5' },
  document: { bg: '#ffebee', text: '#c62828', border: '#ef9a9a' },
  language: { bg: '#e0f2f1', text: '#00695c', border: '#80cbc4' }
};

// 类别标签
export const categoryLabels: Record<string, string> = {
  research: '搜索研究',
  coding: '编程开发',
  data: '数据处理',
  utility: '实用工具',
  creative: '创意生成',
  analysis: '分析工具',
  document: '文档处理',
  language: '语言处理'
};

// 可用工具定义
export const availableTools: Tool[] = [
  { 
    id: 'web_search', 
    name: '网络搜索', 
    description: '在互联网上搜索信息', 
    category: 'research',
    icon: <SearchIcon />
  },
  { 
    id: 'code_interpreter', 
    name: '代码解释器', 
    description: '运行和解释代码', 
    category: 'coding',
    icon: <CodeIcon />
  },
  { 
    id: 'file_browser', 
    name: '文件浏览器', 
    description: '浏览和操作文件系统', 
    category: 'utility',
    icon: <BuildIcon />
  },
  { 
    id: 'image_generator', 
    name: '图像生成器', 
    description: '创建和编辑图像', 
    category: 'creative',
    icon: <ImageIcon />
  },
  { 
    id: 'text_analyzer', 
    name: '文本分析器', 
    description: '分析文本内容', 
    category: 'analysis',
    icon: <AutoFixHighIcon />
  },
  { 
    id: 'database_connector', 
    name: '数据库连接器', 
    description: '连接和查询数据库', 
    category: 'data',
    icon: <StorageIcon />
  },
  { 
    id: 'pdf_reader', 
    name: 'PDF阅读器', 
    description: '读取和解析PDF文件', 
    category: 'document',
    icon: <DescriptionIcon />
  },
  { 
    id: 'translation', 
    name: '翻译工具', 
    description: '在不同语言间翻译文本', 
    category: 'language',
    icon: <TranslateIcon />
  },
];
