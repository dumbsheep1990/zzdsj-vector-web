"use strict";
// 统一的API客户端
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiClient = exports.apiClient = exports.ApiClient = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("./logger");
class ApiClient {
    constructor(baseURL, config) {
        this.defaultTimeout = 30000;
        this.defaultRetries = 3;
        this.baseURL = baseURL || process.env.BACKEND_API_URL || 'http://localhost:8000';
        this.client = axios_1.default.create({
            baseURL: this.baseURL,
            timeout: config?.timeout || this.defaultTimeout,
            headers: {
                'Content-Type': 'application/json',
                ...config?.headers
            }
        });
        this.setupInterceptors();
    }
    setupInterceptors() {
        // 请求拦截器
        this.client.interceptors.request.use((config) => {
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
            logger_1.logger.info(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
                params: config.params,
                data: config.data
            });
            return config;
        }, (error) => {
            logger_1.logger.error('API Request Error:', error);
            return Promise.reject(error);
        });
        // 响应拦截器
        this.client.interceptors.response.use((response) => {
            // 响应日志
            logger_1.logger.info(`API Response: ${response.status} ${response.config.url}`, {
                status: response.status,
                data: response.data
            });
            return response;
        }, async (error) => {
            const originalRequest = error.config;
            // 处理401错误（token过期）
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    await this.refreshToken();
                    return this.client(originalRequest);
                }
                catch (refreshError) {
                    logger_1.logger.error('Token refresh failed:', refreshError);
                    this.clearAuthToken();
                    // 可以触发登录重定向
                    return Promise.reject(refreshError);
                }
            }
            // 处理网络错误
            if (!error.response) {
                logger_1.logger.error('Network Error:', error.message);
                return Promise.reject(new Error('网络连接失败，请检查网络设置'));
            }
            // 处理其他HTTP错误
            const errorMessage = this.extractErrorMessage(error.response);
            logger_1.logger.error(`API Error: ${error.response.status}`, {
                url: error.config?.url,
                message: errorMessage,
                data: error.response.data
            });
            return Promise.reject(new Error(errorMessage));
        });
    }
    extractErrorMessage(response) {
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
    getAuthToken() {
        // 从环境变量、内存或存储中获取token
        return process.env.AUTH_TOKEN || null;
    }
    async refreshToken() {
        const refreshToken = process.env.REFRESH_TOKEN;
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }
        const response = await axios_1.default.post(`${this.baseURL}/api/frontend/user/auth/refresh`, {
            refresh_token: refreshToken
        });
        const { access_token } = response.data.data;
        process.env.AUTH_TOKEN = access_token;
    }
    clearAuthToken() {
        delete process.env.AUTH_TOKEN;
        delete process.env.REFRESH_TOKEN;
    }
    // 基础HTTP方法
    async get(url, config) {
        const response = await this.client.get(url, config);
        return response.data;
    }
    async post(url, data, config) {
        const response = await this.client.post(url, data, config);
        return response.data;
    }
    async put(url, data, config) {
        const response = await this.client.put(url, data, config);
        return response.data;
    }
    async patch(url, data, config) {
        const response = await this.client.patch(url, data, config);
        return response.data;
    }
    async delete(url, config) {
        const response = await this.client.delete(url, config);
        return response.data;
    }
    // 文件上传
    async upload(url, file, filename, additionalFields) {
        const formData = new FormData();
        if (file instanceof File) {
            formData.append('file', file);
        }
        else {
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
    async stream(url, data, onData) {
        const response = await this.client.post(url, data, {
            responseType: 'stream'
        });
        return new Promise((resolve, reject) => {
            response.data.on('data', (chunk) => {
                const text = chunk.toString();
                if (onData) {
                    onData(text);
                }
            });
            response.data.on('end', () => {
                resolve();
            });
            response.data.on('error', (error) => {
                reject(error);
            });
        });
    }
    // 批量请求
    async batch(requests) {
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
    async withRetry(operation, retries = this.defaultRetries, delay = 1000) {
        try {
            return await operation();
        }
        catch (error) {
            if (retries > 0) {
                logger_1.logger.warn(`Operation failed, retrying... (${retries} retries left)`, error);
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.withRetry(operation, retries - 1, delay * 2);
            }
            throw error;
        }
    }
    // 设置认证token
    setAuthToken(token) {
        process.env.AUTH_TOKEN = token;
    }
    // 设置刷新token
    setRefreshToken(token) {
        process.env.REFRESH_TOKEN = token;
    }
    // 获取客户端实例（用于特殊需求）
    getInstance() {
        return this.client;
    }
}
exports.ApiClient = ApiClient;
// 创建默认实例
exports.apiClient = new ApiClient();
// 导出工厂函数
const createApiClient = (baseURL, config) => {
    return new ApiClient(baseURL, config);
};
exports.createApiClient = createApiClient;
