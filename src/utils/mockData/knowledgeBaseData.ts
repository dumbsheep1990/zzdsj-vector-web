import { KnowledgeBaseItem } from "../types";

// 知识库数据
export const knowledgeBaseData: KnowledgeBaseItem[] = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
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
    id: '550e8400-e29b-41d4-a716-446655440000',
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
    id: 'c81d4e2e-bcf2-11e6-869b-7df92533d2db',
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
    id: '38400000-8cf0-11bd-b23e-10b96e4ef00d',
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
    id: 'a3dfe108-fb8c-4cf5-8461-152db119afe4',
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
