import { Assistant } from './types';

/**
 * 生成随机渐变色
 * @returns 渐变色CSS样式字符串
 */
export const getRandomGradient = () => {
  const colorPairs = [
    ['#1890ff', '#36cbcb'], // 蓝青
    ['#7265e6', '#6bc4ff'], // 紫蓝
    ['#ffbf00', '#ff9500'], // 橙黄
    ['#00c161', '#00e3ae'], // 翠绿
    ['#f56565', '#fc8181'], // 红粉
    ['#6b46c1', '#9f7aea'], // 紫色
    ['#4c51bf', '#667eea'], // 靛蓝
    ['#38b2ac', '#4fd1c5'], // 青绿
    ['#ed8936', '#f6ad55'], // 橘色
    ['#9f7aea', '#c3dafe']  // 淡紫
  ];
  
  const colorIndex = Math.floor(Math.random() * colorPairs.length);
  const [color1, color2] = colorPairs[colorIndex];
  
  return `linear-gradient(120deg, ${color1} 0%, ${color2} 100%)`;
};

/**
 * 根据筛选和排序条件获取过滤后的助手列表
 * @param assistants 原始助手列表
 * @param filterStatus 状态过滤条件
 * @param sortOrder 排序方式
 * @param searchText 搜索关键词
 * @returns 过滤与排序后的助手列表
 */
export const getFilteredAssistants = (
  assistants: Assistant[],
  filterStatus: string | null,
  sortOrder: 'newest' | 'oldest' | 'alphabetical',
  searchText?: string
): Assistant[] => {
  let filtered = [...assistants];
  
  // 应用状态过滤
  if (filterStatus) {
    filtered = filtered.filter(assistant => assistant.status === filterStatus);
  }
  
  // 应用搜索过滤
  if (searchText) {
    const lowerCaseSearch = searchText.toLowerCase();
    filtered = filtered.filter(assistant => 
      assistant.name.toLowerCase().includes(lowerCaseSearch) || 
      assistant.description.toLowerCase().includes(lowerCaseSearch)
    );
  }
  
  // 应用排序
  filtered.sort((a, b) => {
    switch (sortOrder) {
      case 'newest':
        return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
      case 'oldest':
        return new Date(a.createTime).getTime() - new Date(b.createTime).getTime();
      case 'alphabetical':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });
  
  return filtered;
};
