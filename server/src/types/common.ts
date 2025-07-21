// 通用类型定义

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
}

export interface PaginationParams {
  page?: number;
  page_size?: number;
  limit?: number;
  offset?: number;
}

export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface SortParams {
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  status?: string;
  category?: string;
  tags?: string[];
}

export interface BaseEntity {
  id: string | number;
  created_at: string;
  updated_at: string;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  avatar_url?: string;
  role?: string;
}

export interface ErrorDetail {
  field?: string;
  message: string;
  code?: string;
}

export interface ValidationError {
  errors: ErrorDetail[];
}

export interface FileUploadInfo {
  filename: string;
  size: number;
  mimetype: string;
  url?: string;
}

export interface SearchResult<T> {
  results: T[];
  total: number;
  query: string;
  filters?: Record<string, any>;
  facets?: Record<string, any>;
}

// HTTP请求配置
export interface RequestConfig {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

// 操作结果
export interface OperationResult {
  success: boolean;
  message?: string;
  data?: any;
  errors?: ErrorDetail[];
} 