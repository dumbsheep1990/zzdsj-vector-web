"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditService = void 0;
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const auth_1 = require("../../../shared/types/auth");
const logger_1 = require("../utils/logger");
// 模拟审计日志数据
const mockAuditLogs = [
    {
        id: '1',
        user_id: '1',
        action: 'login',
        details: { ip: '192.168.1.1', device: 'Chrome/Windows' },
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        timestamp: '2025-05-15T10:00:00Z'
    },
    {
        id: '2',
        user_id: '1',
        action: 'knowledge_base.create',
        resource_type: auth_1.ResourceType.KNOWLEDGE_BASE,
        resource_id: 'kb1',
        details: { name: '机器学习知识库', size: '1.2MB' },
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        timestamp: '2025-05-15T10:05:00Z'
    },
    {
        id: '3',
        user_id: '2',
        action: 'login',
        details: { ip: '192.168.1.100', device: 'Safari/Mac' },
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
        timestamp: '2025-05-15T11:00:00Z'
    },
    {
        id: '4',
        user_id: '2',
        action: 'assistant.create',
        resource_type: auth_1.ResourceType.ASSISTANT,
        resource_id: 'ast1',
        details: { name: '数据分析助手', model: 'gpt-4-turbo' },
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
        timestamp: '2025-05-15T11:10:00Z'
    },
    {
        id: '5',
        user_id: '1',
        action: 'system.settings.update',
        details: { updated_fields: ['api_rate_limit', 'storage_quota'] },
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        timestamp: '2025-05-15T14:00:00Z'
    }
];
class AuditService {
    constructor() {
        this.apiUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';
        this.useMock = process.env.USE_MOCK_DATA === 'true';
    }
    /**
     * 获取审计日志列表
     */
    async getAuditLogs(filters = {}) {
        if (this.useMock) {
            logger_1.logger.info('使用模拟数据获取审计日志');
            // 过滤日志
            let filteredLogs = [...mockAuditLogs];
            if (filters.userId) {
                filteredLogs = filteredLogs.filter(log => log.user_id === filters.userId);
            }
            if (filters.action) {
                filteredLogs = filteredLogs.filter(log => log.action === filters.action);
            }
            if (filters.resourceType) {
                filteredLogs = filteredLogs.filter(log => log.resource_type === filters.resourceType);
            }
            if (filters.resourceId) {
                filteredLogs = filteredLogs.filter(log => log.resource_id === filters.resourceId);
            }
            if (filters.startDate) {
                const startDate = new Date(filters.startDate);
                filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= startDate);
            }
            if (filters.endDate) {
                const endDate = new Date(filters.endDate);
                filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= endDate);
            }
            // 按时间戳排序（从新到旧）
            filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            // 分页
            const page = filters.page || 1;
            const limit = filters.limit || 10;
            const offset = (page - 1) * limit;
            const paginatedLogs = filteredLogs.slice(offset, offset + limit);
            return {
                logs: JSON.parse(JSON.stringify(paginatedLogs)),
                total: filteredLogs.length
            };
        }
        try {
            logger_1.logger.info('从后端API获取审计日志');
            // 构建查询参数
            const params = new URLSearchParams();
            if (filters.userId)
                params.append('userId', filters.userId);
            if (filters.action)
                params.append('action', filters.action);
            if (filters.resourceType)
                params.append('resourceType', filters.resourceType);
            if (filters.resourceId)
                params.append('resourceId', filters.resourceId);
            if (filters.startDate)
                params.append('startDate', filters.startDate);
            if (filters.endDate)
                params.append('endDate', filters.endDate);
            if (filters.page)
                params.append('page', filters.page.toString());
            if (filters.limit)
                params.append('limit', filters.limit.toString());
            const response = await axios_1.default.get(`${this.apiUrl}/api/audit?${params.toString()}`);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('获取审计日志失败:', error);
            throw new Error('获取审计日志失败');
        }
    }
    /**
     * 获取审计日志详情
     */
    async getAuditLogById(id) {
        if (this.useMock) {
            logger_1.logger.info(`使用模拟数据获取审计日志详情, ID: ${id}`);
            const log = mockAuditLogs.find(log => log.id === id);
            return log ? JSON.parse(JSON.stringify(log)) : null;
        }
        try {
            logger_1.logger.info(`从后端API获取审计日志详情, ID: ${id}`);
            const response = await axios_1.default.get(`${this.apiUrl}/api/audit/${id}`);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error(`获取审计日志详情失败, ID: ${id}:`, error);
            if (axios_1.default.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            throw new Error(`获取审计日志详情失败: ${error}`);
        }
    }
    /**
     * 获取用户活动历史
     */
    async getUserActivityHistory(userId, limit = 10) {
        if (this.useMock) {
            logger_1.logger.info(`使用模拟数据获取用户活动历史, 用户ID: ${userId}`);
            // 过滤用户日志并按时间戳排序
            const userLogs = mockAuditLogs
                .filter(log => log.user_id === userId)
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, limit);
            return JSON.parse(JSON.stringify(userLogs));
        }
        try {
            logger_1.logger.info(`从后端API获取用户活动历史, 用户ID: ${userId}`);
            const response = await axios_1.default.get(`${this.apiUrl}/api/audit/users/${userId}/activity?limit=${limit}`);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error(`获取用户活动历史失败, 用户ID: ${userId}:`, error);
            throw new Error('获取用户活动历史失败');
        }
    }
    /**
     * 获取资源活动历史
     */
    async getResourceActivityHistory(resourceType, resourceId, limit = 10) {
        if (this.useMock) {
            logger_1.logger.info(`使用模拟数据获取资源活动历史, 资源类型: ${resourceType}, 资源ID: ${resourceId}`);
            // 过滤资源日志并按时间戳排序
            const resourceLogs = mockAuditLogs
                .filter(log => log.resource_type === resourceType && log.resource_id === resourceId)
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, limit);
            return JSON.parse(JSON.stringify(resourceLogs));
        }
        try {
            logger_1.logger.info(`从后端API获取资源活动历史, 资源类型: ${resourceType}, 资源ID: ${resourceId}`);
            const response = await axios_1.default.get(`${this.apiUrl}/api/audit/resources/${resourceType}/${resourceId}/activity?limit=${limit}`);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error(`获取资源活动历史失败, 资源类型: ${resourceType}, 资源ID: ${resourceId}:`, error);
            throw new Error('获取资源活动历史失败');
        }
    }
    /**
     * 获取登录历史
     */
    async getLoginHistory(userId, limit = 10) {
        if (this.useMock) {
            logger_1.logger.info(`使用模拟数据获取登录历史${userId ? `, 用户ID: ${userId}` : ''}`);
            // 过滤登录日志
            let loginLogs = mockAuditLogs.filter(log => log.action === 'login');
            if (userId) {
                loginLogs = loginLogs.filter(log => log.user_id === userId);
            }
            // 按时间戳排序
            loginLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            return JSON.parse(JSON.stringify(loginLogs.slice(0, limit)));
        }
        try {
            logger_1.logger.info(`从后端API获取登录历史${userId ? `, 用户ID: ${userId}` : ''}`);
            const params = new URLSearchParams();
            params.append('limit', limit.toString());
            if (userId)
                params.append('userId', userId);
            const response = await axios_1.default.get(`${this.apiUrl}/api/audit/login-history?${params.toString()}`);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('获取登录历史失败:', error);
            throw new Error('获取登录历史失败');
        }
    }
    /**
     * 获取系统操作历史
     */
    async getSystemActivityHistory(limit = 10) {
        if (this.useMock) {
            logger_1.logger.info('使用模拟数据获取系统操作历史');
            // 过滤系统相关日志
            const systemLogs = mockAuditLogs
                .filter(log => log.action.startsWith('system.'))
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, limit);
            return JSON.parse(JSON.stringify(systemLogs));
        }
        try {
            logger_1.logger.info('从后端API获取系统操作历史');
            const response = await axios_1.default.get(`${this.apiUrl}/api/audit/system-activity?limit=${limit}`);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('获取系统操作历史失败:', error);
            throw new Error('获取系统操作历史失败');
        }
    }
    /**
     * 创建审计日志
     */
    async createAuditLog(log) {
        if (this.useMock) {
            logger_1.logger.info(`使用模拟数据创建审计日志, 用户ID: ${log.user_id}, 操作: ${log.action}`);
            const newLog = {
                id: (0, uuid_1.v4)(),
                ...log,
                timestamp: new Date().toISOString()
            };
            mockAuditLogs.push(newLog);
            return JSON.parse(JSON.stringify(newLog));
        }
        try {
            logger_1.logger.info(`向后端API创建审计日志, 用户ID: ${log.user_id}, 操作: ${log.action}`);
            const response = await axios_1.default.post(`${this.apiUrl}/api/audit`, log);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('创建审计日志失败:', error);
            throw new Error('创建审计日志失败');
        }
    }
}
exports.auditService = new AuditService();
