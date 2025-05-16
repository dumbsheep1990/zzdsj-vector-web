/**
 * API客户端主文件，提供HTTP请求方法
 */
import { 
  API_BASE_URL, 
  API_ERROR_MESSAGES, 
  DEFAULT_HEADERS, 
  ENABLE_API_LOGS, 
  REQUEST_TIMEOUT,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  PUBLIC_ENDPOINTS 
} from './config';

// 请求选项接口
export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  signal?: AbortSignal;
}

/**
 * 获取访问Token
 */
function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * 获取刷新Token
 */
function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * 判断是否公开端点
 */
function isPublicEndpoint(url: string): boolean {
  // 移除基础URL和前端斜杠
  const cleanUrl = url.replace(API_BASE_URL, '').replace(/^\/+/, '');
  // 移除URL参数
  const path = cleanUrl.split('?')[0];
  // 检查是否在公开端点列表中
  return PUBLIC_ENDPOINTS.some(endpoint => {
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    return path === cleanEndpoint || path.startsWith(`${cleanEndpoint}/`);
  });
}

// API响应接口
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp?: string;
}

// API错误接口
export class ApiError extends Error {
  status: number;
  data?: any;
  
  constructor(message: string, status: number = 500, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * 发送HTTP请求
 * @param url - 请求URL
 * @param method - HTTP方法
 * @param data - 请求数据
 * @param options - 请求选项
 * @returns Promise<T> - 响应数据
 */
async function request<T>(
  url: string,
  method: string,
  data?: any,
  options: RequestOptions = {}
): Promise<T> {
  const isAbsoluteUrl = url.startsWith('http');
  let fullUrl = isAbsoluteUrl ? url : `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
  
  // 创建AbortController用于超时处理
  const controller = new AbortController();
  const { signal = controller.signal } = options;
  
  // 设置超时
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, options.timeout || REQUEST_TIMEOUT);
  
  try {
    // 请求配置
    const headers: Record<string, string> = {
      ...DEFAULT_HEADERS,
      ...options.headers,
    };
    
    // 如果不是公开端点，添加JWT token验证
    if (!isPublicEndpoint(fullUrl)) {
      const token = getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        // 如果需要Token但没有Token，抛出未授权错误
        throw new ApiError(API_ERROR_MESSAGES.UNAUTHORIZED, 401);
      }
    }
    
    const config: RequestInit = {
      method,
      headers,
      signal,
    };
    
    // 添加请求体（如果有）
    if (data) {
      if (method !== 'GET' && method !== 'HEAD') {
        config.body = JSON.stringify(data);
      } else if (method === 'GET' && typeof data === 'object') {
        // 对于GET请求，将数据转换为URL参数
        const params = new URLSearchParams();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
        
        const queryString = params.toString();
        if (queryString) {
          fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryString;
        }
      }
    }
    
    // 记录请求日志（开发环境）
    if (ENABLE_API_LOGS) {
      console.group(`API Request: ${method} ${fullUrl}`);
      console.log('Request Headers:', config.headers);
      console.log('Request Data:', data);
      console.groupEnd();
    }
    
    // 发送请求
    const response = await fetch(fullUrl, config);
    
    // 清除超时
    clearTimeout(timeoutId);
    
    // 解析响应
    let responseData: any;
    
    // 检查Content-Type，决定如何解析响应
    const contentType = response.headers.get('Content-Type') || '';
    if (contentType.includes('application/json')) {
      responseData = await response.json();
    } else if (contentType.includes('text/')) {
      responseData = await response.text();
    } else {
      // 二进制数据
      responseData = await response.blob();
    }
    
    // 记录响应日志（开发环境）
    if (ENABLE_API_LOGS) {
      console.group(`API Response: ${method} ${fullUrl}`);
      console.log('Status:', response.status);
      console.log('Response Headers:', response.headers);
      console.log('Response Data:', responseData);
      console.groupEnd();
    }
    
    // 处理错误响应
    if (!response.ok) {
      throw new ApiError(
        responseData?.message || getErrorMessage(response.status),
        response.status,
        responseData
      );
    }
    
    // 处理包装的API响应格式
    if (responseData && typeof responseData === 'object' && 'success' in responseData) {
      const apiResponse = responseData as ApiResponse<T>;
      if (!apiResponse.success) {
        throw new ApiError(apiResponse.message || API_ERROR_MESSAGES.DEFAULT, response.status, apiResponse.data);
      }
      return apiResponse.data;
    }
    
    // 直接返回响应数据
    return responseData;
  } catch (error) {
    // 清除超时
    clearTimeout(timeoutId);
    
    // 处理错误
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(API_ERROR_MESSAGES.TIMEOUT, 408);
    }
    
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new ApiError(API_ERROR_MESSAGES.NETWORK, 0);
    }
    
    // 其他错误
    console.error('API request error:', error);
    throw new ApiError(API_ERROR_MESSAGES.DEFAULT, 500);
  }
}

/**
 * 根据HTTP状态码获取错误消息
 */
function getErrorMessage(status: number): string {
  switch (status) {
    case 401:
      return API_ERROR_MESSAGES.UNAUTHORIZED;
    case 403:
      return API_ERROR_MESSAGES.FORBIDDEN;
    case 404:
      return API_ERROR_MESSAGES.NOT_FOUND;
    case 408:
      return API_ERROR_MESSAGES.TIMEOUT;
    case 500:
    case 502:
    case 503:
    case 504:
      return API_ERROR_MESSAGES.SERVER_ERROR;
    default:
      return API_ERROR_MESSAGES.DEFAULT;
  }
}

/**
 * GET请求
 */
export function get<T>(url: string, params?: any, options?: RequestOptions): Promise<T> {
  return request<T>(url, 'GET', params, options);
}

/**
 * POST请求
 */
export function post<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
  return request<T>(url, 'POST', data, options);
}

/**
 * PUT请求
 */
export function put<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
  return request<T>(url, 'PUT', data, options);
}

/**
 * DELETE请求
 */
export function del<T>(url: string, options?: RequestOptions): Promise<T> {
  return request<T>(url, 'DELETE', undefined, options);
}

/**
 * PATCH请求
 */
export function patch<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
  return request<T>(url, 'PATCH', data, options);
}

/**
 * 保存令牌
 */
export function saveTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

/**
 * 清除令牌
 */
export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// 导出API客户端
const apiClient = {
  get,
  post,
  put,
  delete: del,
  patch,
  request,
  saveTokens,
  clearTokens
};

export default apiClient;
