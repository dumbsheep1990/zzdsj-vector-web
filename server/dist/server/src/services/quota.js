"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quotaService = void 0;
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const logger_1 = require("../utils/logger");
// 模拟配额数据
const mockQuotas = [
    {
        id: '1',
        user_id: '1', // admin
        max_knowledge_bases: 100,
        max_assistants: 50,
        max_storage_mb: 10240, // 10GB
        max_tokens_per_month: 10000000, // 1000万tokens
        max_model_calls_per_day: 10000,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        id: '2',
        user_id: '2', // user
        max_knowledge_bases: 5,
        max_assistants: 3,
        max_storage_mb: 1024, // 1GB
        max_tokens_per_month: 100000, // 10万tokens
        max_model_calls_per_day: 100,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    }
];
// 模拟使用数据
const mockQuotaUsages = {
    '1': {
        user_id: '1',
        knowledge_bases: {
            current: 10,
            max: 100
        },
        assistants: {
            current: 5,
            max: 50
        },
        storage: {
            current_mb: 2048,
            max_mb: 10240
        },
        tokens: {
            current_month: 1500000,
            max_per_month: 10000000
        },
        model_calls: {
            today: 200,
            max_per_day: 10000
        }
    },
    '2': {
        user_id: '2',
        knowledge_bases: {
            current: 2,
            max: 5
        },
        assistants: {
            current: 1,
            max: 3
        },
        storage: {
            current_mb: 300,
            max_mb: 1024
        },
        tokens: {
            current_month: 25000,
            max_per_month: 100000
        },
        model_calls: {
            today: 15,
            max_per_day: 100
        }
    }
};
class QuotaService {
    constructor() {
        this.apiUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';
        this.useMock = process.env.USE_MOCK_DATA === 'true';
    }
    /**
     * 获取用户资源配额
     */
    async getUserQuota(userId) {
        if (this.useMock) {
            logger_1.logger.info(`使用模拟数据获取用户资源配额, 用户ID: ${userId}`);
            const quota = mockQuotas.find(q => q.user_id === userId);
            return quota ? JSON.parse(JSON.stringify(quota)) : null;
        }
        try {
            logger_1.logger.info(`从后端API获取用户资源配额, 用户ID: ${userId}`);
            const response = await axios_1.default.get(`${this.apiUrl}/api/quota/${userId}`);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error(`获取用户资源配额失败, 用户ID: ${userId}:`, error);
            if (axios_1.default.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            throw new Error(`获取用户资源配额失败: ${error}`);
        }
    }
    /**
     * 更新用户资源配额
     */
    async updateUserQuota(userId, quota) {
        if (this.useMock) {
            logger_1.logger.info(`使用模拟数据更新用户资源配额, 用户ID: ${userId}`);
            const index = mockQuotas.findIndex(q => q.user_id === userId);
            if (index === -1) {
                return null;
            }
            const now = new Date().toISOString();
            mockQuotas[index] = {
                ...mockQuotas[index],
                ...quota,
                updated_at: now
            };
            return JSON.parse(JSON.stringify(mockQuotas[index]));
        }
        try {
            logger_1.logger.info(`向后端API更新用户资源配额, 用户ID: ${userId}`);
            const response = await axios_1.default.put(`${this.apiUrl}/api/quota/${userId}`, quota);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error(`更新用户资源配额失败, 用户ID: ${userId}:`, error);
            if (axios_1.default.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            throw new Error(`更新用户资源配额失败: ${error}`);
        }
    }
    /**
     * 创建用户资源配额
     */
    async createUserQuota(quota) {
        if (this.useMock) {
            logger_1.logger.info(`使用模拟数据创建用户资源配额, 用户ID: ${quota.user_id}`);
            // 检查是否已存在
            if (mockQuotas.some(q => q.user_id === quota.user_id)) {
                throw new Error('用户配额已存在');
            }
            const now = new Date().toISOString();
            const newQuota = {
                id: (0, uuid_1.v4)(),
                ...quota,
                created_at: now,
                updated_at: now
            };
            mockQuotas.push(newQuota);
            return JSON.parse(JSON.stringify(newQuota));
        }
        try {
            logger_1.logger.info(`向后端API创建用户资源配额, 用户ID: ${quota.user_id}`);
            const response = await axios_1.default.post(`${this.apiUrl}/api/quota`, quota);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error(`创建用户资源配额失败, 用户ID: ${quota.user_id}:`, error);
            throw new Error(`创建用户资源配额失败: ${error}`);
        }
    }
    /**
     * 获取用户资源使用情况
     */
    async getUserQuotaUsage(userId) {
        if (this.useMock) {
            logger_1.logger.info(`使用模拟数据获取用户资源使用情况, 用户ID: ${userId}`);
            const usage = mockQuotaUsages[userId];
            return usage ? JSON.parse(JSON.stringify(usage)) : null;
        }
        try {
            logger_1.logger.info(`从后端API获取用户资源使用情况, 用户ID: ${userId}`);
            const response = await axios_1.default.get(`${this.apiUrl}/api/quota/${userId}/usage`);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error(`获取用户资源使用情况失败, 用户ID: ${userId}:`, error);
            if (axios_1.default.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            throw new Error(`获取用户资源使用情况失败: ${error}`);
        }
    }
    /**
     * 检查配额是否可用
     */
    async checkQuotaAvailable(userId, resourceType, amount = 1) {
        if (this.useMock) {
            logger_1.logger.info(`使用模拟数据检查配额是否可用, 用户ID: ${userId}, 资源类型: ${resourceType}, 数量: ${amount}`);
            const usage = mockQuotaUsages[userId];
            if (!usage) {
                throw new Error('用户使用情况不存在');
            }
            let current = 0;
            let max = 0;
            switch (resourceType) {
                case 'knowledge_base':
                    current = usage.knowledge_bases.current;
                    max = usage.knowledge_bases.max;
                    break;
                case 'assistant':
                    current = usage.assistants.current;
                    max = usage.assistants.max;
                    break;
                case 'storage':
                    current = usage.storage.current_mb;
                    max = usage.storage.max_mb;
                    break;
                case 'tokens':
                    current = usage.tokens.current_month;
                    max = usage.tokens.max_per_month;
                    break;
                case 'model_calls':
                    current = usage.model_calls.today;
                    max = usage.model_calls.max_per_day;
                    break;
            }
            const remaining = max - current;
            const available = remaining >= amount;
            return {
                available,
                current,
                max,
                remaining
            };
        }
        try {
            logger_1.logger.info(`向后端API检查配额是否可用, 用户ID: ${userId}, 资源类型: ${resourceType}, 数量: ${amount}`);
            const response = await axios_1.default.get(`${this.apiUrl}/api/quota/${userId}/check?type=${resourceType}&amount=${amount}`);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error(`检查配额是否可用失败, 用户ID: ${userId}, 资源类型: ${resourceType}:`, error);
            throw new Error(`检查配额是否可用失败: ${error}`);
        }
    }
    /**
     * 记录资源使用情况
     */
    async recordResourceUsage(userId, resourceType, amount) {
        if (this.useMock) {
            logger_1.logger.info(`使用模拟数据记录资源使用情况, 用户ID: ${userId}, 资源类型: ${resourceType}, 数量: ${amount}`);
            const usage = mockQuotaUsages[userId];
            if (!usage) {
                throw new Error('用户使用情况不存在');
            }
            switch (resourceType) {
                case 'knowledge_base':
                    usage.knowledge_bases.current += amount;
                    break;
                case 'assistant':
                    usage.assistants.current += amount;
                    break;
                case 'storage':
                    usage.storage.current_mb += amount;
                    break;
                case 'tokens':
                    usage.tokens.current_month += amount;
                    break;
                case 'model_calls':
                    usage.model_calls.today += amount;
                    break;
            }
            return true;
        }
        try {
            logger_1.logger.info(`向后端API记录资源使用情况, 用户ID: ${userId}, 资源类型: ${resourceType}, 数量: ${amount}`);
            await axios_1.default.post(`${this.apiUrl}/api/quota/${userId}/usage`, {
                resource_type: resourceType,
                amount
            });
            return true;
        }
        catch (error) {
            logger_1.logger.error(`记录资源使用情况失败, 用户ID: ${userId}, 资源类型: ${resourceType}:`, error);
            throw new Error(`记录资源使用情况失败: ${error}`);
        }
    }
    /**
     * 重置特定资源的使用计数
     */
    async resetResourceUsage(userId, resourceType) {
        if (this.useMock) {
            logger_1.logger.info(`使用模拟数据重置资源使用计数, 用户ID: ${userId}, 资源类型: ${resourceType}`);
            const usage = mockQuotaUsages[userId];
            if (!usage) {
                throw new Error('用户使用情况不存在');
            }
            switch (resourceType) {
                case 'tokens':
                    usage.tokens.current_month = 0;
                    break;
                case 'model_calls':
                    usage.model_calls.today = 0;
                    break;
            }
            return true;
        }
        try {
            logger_1.logger.info(`向后端API重置资源使用计数, 用户ID: ${userId}, 资源类型: ${resourceType}`);
            await axios_1.default.post(`${this.apiUrl}/api/quota/${userId}/reset`, {
                resource_type: resourceType
            });
            return true;
        }
        catch (error) {
            logger_1.logger.error(`重置资源使用计数失败, 用户ID: ${userId}, 资源类型: ${resourceType}:`, error);
            throw new Error(`重置资源使用计数失败: ${error}`);
        }
    }
}
exports.quotaService = new QuotaService();
