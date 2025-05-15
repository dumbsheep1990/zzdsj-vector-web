/**
 * API服务索引文件
 * 提供统一的API服务导出
 */
import { API_BASE_URL, USE_MOCK_DATA } from './config';
import apiClient, { ApiError } from './client';
import knowledgeApi from './knowledge';
import vectorApi from './vector';
import modelApi from './model';
import qaApi from './qa';
import assistantApi from './assistant';
import datasetApi from './dataset';
import toolsApi from './tools';
import graphApi from './graph';
import userApi from './user';
import settingsApi from './settings';
import navigationApi from './navigation';
import notificationApi from './notification';
import systemStatusApi from './system-status';
import mcpApi from './mcp';
import promptTemplateApi from './prompt-template';

// 导出所有API服务
export {
  apiClient,
  ApiError,
  
  // API配置
  API_BASE_URL,
  USE_MOCK_DATA,
  
  // 业务API服务
  knowledgeApi,
  vectorApi,
  modelApi,
  qaApi,
  assistantApi,
  datasetApi,
  toolsApi,
  graphApi,
  userApi,
  settingsApi,
  navigationApi,
  notificationApi,
  systemStatusApi,
  mcpApi,
  promptTemplateApi
};

// 默认导出所有API服务的集合
const api = {
  client: apiClient,
  knowledge: knowledgeApi,
  vector: vectorApi,
  model: modelApi,
  qa: qaApi,
  assistant: assistantApi,
  dataset: datasetApi,
  tools: toolsApi,
  graph: graphApi,
  user: userApi,
  settings: settingsApi,
  navigation: navigationApi,
  notification: notificationApi,
  systemStatus: systemStatusApi,
  mcp: mcpApi,
  promptTemplate: promptTemplateApi
};

export default api;
