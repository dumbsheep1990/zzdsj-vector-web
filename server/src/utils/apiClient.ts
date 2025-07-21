// 统一的API客户端

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { logger } from './logger';
import { ApiResponse, RequestConfig } from '../types/common';

export class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;
  private defaultTimeout: number = 30000;
  private defaultRetries: number = 3;

  constructor(baseURL?: string, config?: RequestConfig) {
    this.baseURL = baseURL || process.env.BACKEND_API_URL || 'http://localhost:8000';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: config?.timeout || this.defaultTimeout,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 请求拦截器
    this.client.interceptors.request.use(
      (config: any) => {
        // 添加认证头
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // 添加API密钥
        const apiKey = process.env.API_KEY;
        if (apiKey) {
          config.headers['X-API-Key'] = apiKey;
        }

        // 请求日志
        logger.info(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
          params: config.params,
          data: config.data
        });

        return config;
      },
      (error: any) => {
        logger.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // 响应日志
        logger.info(`API Response: ${response.status} ${response.config.url}`, {
          status: response.status,
          data: response.data
        });

        return response;
      },
      async (error: any) => {
        const originalRequest = error.config;

        // 处理401错误（token过期）
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            await this.refreshToken();
            return this.client(originalRequest);
          } catch (refreshError) {
            logger.error('Token refresh failed:', refreshError);
            this.clearAuthToken();
            // 可以触发登录重定向
            return Promise.reject(refreshError);
          }
        }

        // 处理网络错误
        if (!error.response) {
          logger.error('Network Error:', error.message);
          return Promise.reject(new Error('网络连接失败，请检查网络设置'));
        }

        // 处理其他HTTP错误
        const errorMessage = this.extractErrorMessage(error.response);
        logger.error(`API Error: ${error.response.status}`, {
          url: error.config?.url,
          message: errorMessage,
          data: error.response.data
        });

        return Promise.reject(new Error(errorMessage));
      }
    );
  }

  private extractErrorMessage(response: AxiosResponse): string {
    if (response.data?.message) {
      return response.data.message;
    }
    if (response.data?.error) {
      return response.data.error;
    }
    if (response.data?.detail) {
      return response.data.detail;
    }
    
    // 默认HTTP状态码消息
    switch (response.status) {
      case 400:
        return '请求参数错误';
      case 401:
        return '未授权访问';
      case 403:
        return '访问被拒绝';
      case 404:
        return '资源不存在';
      case 429:
        return '请求过于频繁';
      case 500:
        return '服务器内部错误';
      case 502:
        return '网关错误';
      case 503:
        return '服务暂不可用';
      default:
        return `请求失败 (${response.status})`;
    }
  }

  private getAuthToken(): string | null {
    // 从环境变量、内存或存储中获取token
    return process.env.AUTH_TOKEN || null;
  }

  private async refreshToken(): Promise<void> {
    const refreshToken = process.env.REFRESH_TOKEN;
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${this.baseURL}/api/frontend/user/auth/refresh`, {
      refresh_token: refreshToken
    });

    const { access_token } = response.data.data;
    process.env.AUTH_TOKEN = access_token;
  }

  private clearAuthToken(): void {
    delete process.env.AUTH_TOKEN;
    delete process.env.REFRESH_TOKEN;
  }

  // 基础HTTP方法
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete(url, config);
    return response.data;
  }

  // 文件上传
  async upload<T = any>(
    url: string, 
    file: File | Buffer, 
    filename?: string,
    additionalFields?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    
    if (file instanceof File) {
      formData.append('file', file);
    } else {
      const blob = new Blob([file]);
      formData.append('file', blob, filename || 'file');
    }

    // 添加其他字段
    if (additionalFields) {
      Object.entries(additionalFields).forEach(([key, value]) => {
        formData.append(key, typeof value === 'string' ? value : JSON.stringify(value));
      });
    }

    const response = await this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  }

  // 流式请求
  async stream(url: string, data?: any, onData?: (chunk: string) => void): Promise<void> {
    const response = await this.client.post(url, data, {
      responseType: 'stream'
    });

    return new Promise((resolve, reject) => {
      response.data.on('data', (chunk: Buffer) => {
        const text = chunk.toString();
        if (onData) {
          onData(text);
        }
      });

      response.data.on('end', () => {
        resolve();
      });

      response.data.on('error', (error: Error) => {
        reject(error);
      });
    });
  }

  // 批量请求
  async batch<T = any>(requests: Array<{
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    url: string;
    data?: any;
  }>): Promise<ApiResponse<T>[]> {
    const promises = requests.map(req => {
      switch (req.method) {
        case 'GET':
          return this.get(req.url);
        case 'POST':
          return this.post(req.url, req.data);
        case 'PUT':
          return this.put(req.url, req.data);
        case 'DELETE':
          return this.delete(req.url);
        default:
          throw new Error(`Unsupported method: ${req.method}`);
      }
    });

    return Promise.all(promises);
  }

  // 重试机制
  async withRetry<T>(
    operation: () => Promise<T>,
    retries: number = this.defaultRetries,
    delay: number = 1000
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0) {
        logger.warn(`Operation failed, retrying... (${retries} retries left)`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.withRetry(operation, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  // 设置认证token
  setAuthToken(token: string): void {
    process.env.AUTH_TOKEN = token;
  }

  // 设置刷新token
  setRefreshToken(token: string): void {
    process.env.REFRESH_TOKEN = token;
  }

  // 获取客户端实例（用于特殊需求）
  getInstance(): AxiosInstance {
    return this.client;
  }
}

// 创建默认实例
export const apiClient = new ApiClient();

// 导出工厂函数
export const createApiClient = (baseURL?: string, config?: RequestConfig): ApiClient => {
  return new ApiClient(baseURL, config);
}; 