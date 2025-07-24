/**
 * 环境配置工具
 * 用于管理所有环境变量和API地址
 */

// API服务地址配置
export const API_CONFIG = {
  // 网关服务（推荐使用）
  GATEWAY_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  
  // 微服务直连地址
  KNOWLEDGE_SERVICE: import.meta.env.VITE_KNOWLEDGE_SERVICE_URL || 'http://localhost:8082/api/v1',
  AGENT_SERVICE: import.meta.env.VITE_AGENT_SERVICE_URL || 'http://localhost:8081/api/v1',
  MODEL_SERVICE: import.meta.env.VITE_MODEL_SERVICE_URL || 'http://localhost:8088/api/v1',
  GRAPH_SERVICE: import.meta.env.VITE_GRAPH_SERVICE_URL || 'http://localhost:8087/api/v1/graphs',
  KAIBAN_SERVICE: import.meta.env.VITE_KAIBAN_SERVICE_URL || 'http://localhost:8092/api/v1',
  REPORTS_SERVICE: import.meta.env.VITE_REPORTS_SERVICE_URL || 'http://localhost:8091/api/v1',
  
  // 特殊服务
  AGENT_ORCHESTRATION: import.meta.env.VITE_AGENT_ORCHESTRATION_URL || 'http://localhost:8000',
  AGENT_ORCHESTRATION_IFRAME: import.meta.env.VITE_AGENT_ORCHESTRATION_IFRAME_URL || 'http://localhost:3000',
};

// 获取服务基础地址（去掉/api/v1后缀）
export const getServiceBaseUrl = (serviceUrl: string): string => {
  return serviceUrl.replace('/api/v1', '');
};

// 环境检测
export const ENV = {
  isDevelopment: import.meta.env.NODE_ENV === 'development',
  isProduction: import.meta.env.NODE_ENV === 'production',
  useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true',
};

// 调试信息（仅开发环境）
if (ENV.isDevelopment) {
  console.log('🔧 API配置:', API_CONFIG);
  console.log('🌍 环境信息:', ENV);
}

export default API_CONFIG;
