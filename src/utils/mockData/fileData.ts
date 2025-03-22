import { FileItem } from "../types";

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
      { keyword: '统计分析', relevance: 0.75 },
    ]
  },
  {
    id: '101',
    name: '城市规划',
    type: 'folder',
    size: '-',
    date: '2023-03-15',
    category: '文件夹',
    status: '-',
    isFolder: true,
    parentId: null,
    path: '/政策文档',
    children: []
  },
  {
    id: '102',
    name: '经济数据',
    type: 'folder',
    size: '-',
    date: '2023-03-12',
    category: '文件夹',
    status: '-',
    isFolder: true,
    parentId: null,
    path: '/数据分析',
    children: []
  },
  {
    id: '103',
    name: '会议记录',
    type: 'folder',
    size: '-',
    date: '2023-03-08',
    category: '文件夹',
    status: '-',
    isFolder: true,
    parentId: null,
    path: '/会议记录',
    children: []
  },
  {
    id: '104',
    name: '研究报告',
    type: 'folder',
    size: '-',
    date: '2023-03-05',
    category: '文件夹',
    status: '-',
    isFolder: true,
    parentId: null,
    path: '/研究报告',
    children: []
  },
  {
    id: '105',
    name: 'AI应用',
    type: 'folder',
    size: '-',
    date: '2023-03-01',
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
