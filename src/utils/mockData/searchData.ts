import { SearchRecordItem } from "../types";

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
