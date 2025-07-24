"use strict";
// 助手服务
Object.defineProperty(exports, "__esModule", { value: true });
exports.assistantService = exports.AssistantService = void 0;
const apiClient_1 = require("../utils/apiClient");
const logger_1 = require("../utils/logger");
class AssistantService {
    constructor() {
        this.baseUrl = '/api/frontend/assistants';
    }
    // 助手管理
    async getAssistants(params) {
        try {
            logger_1.logger.info('Fetching assistants list', params);
            const response = await apiClient_1.apiClient.get('/assistants', { params });
            if (response.success && response.data) {
                return {
                    items: response.data.assistants,
                    total: response.data.total,
                    page: Math.floor((response.data.offset || 0) / (response.data.limit || 20)) + 1,
                    page_size: response.data.limit || 20,
                    total_pages: Math.ceil(response.data.total / (response.data.limit || 20))
                };
            }
            throw new Error(response.message || '获取助手列表失败');
        }
        catch (error) {
            logger_1.logger.error('Get assistants failed:', error);
            throw error;
        }
    }
    async getAssistantById(id, options) {
        try {
            logger_1.logger.info('Fetching assistant by ID', { id, ...options });
            const response = await apiClient_1.apiClient.get(`/assistants/${id}`, {
                params: options
            });
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.message || '获取助手信息失败');
        }
        catch (error) {
            logger_1.logger.error('Get assistant by ID failed:', error);
            throw error;
        }
    }
    async createAssistant(assistantData) {
        try {
            logger_1.logger.info('Creating new assistant', { name: assistantData.name });
            const response = await apiClient_1.apiClient.post('/assistants', assistantData);
            if (response.success && response.data) {
                logger_1.logger.info('Assistant created successfully', { id: response.data.id });
                return response.data;
            }
            throw new Error(response.message || '创建助手失败');
        }
        catch (error) {
            logger_1.logger.error('Create assistant failed:', error);
            throw error;
        }
    }
    async updateAssistant(id, assistantData) {
        try {
            logger_1.logger.info('Updating assistant', { id });
            const response = await apiClient_1.apiClient.put(`/assistants/${id}`, assistantData);
            if (response.success && response.data) {
                logger_1.logger.info('Assistant updated successfully', { id });
                return response.data;
            }
            throw new Error(response.message || '更新助手失败');
        }
        catch (error) {
            logger_1.logger.error('Update assistant failed:', error);
            throw error;
        }
    }
    async deleteAssistant(id) {
        try {
            logger_1.logger.info('Deleting assistant', { id });
            const response = await apiClient_1.apiClient.delete(`/assistants/${id}`);
            if (!response.success) {
                throw new Error(response.message || '删除助手失败');
            }
            logger_1.logger.info('Assistant deleted successfully', { id });
        }
        catch (error) {
            logger_1.logger.error('Delete assistant failed:', error);
            throw error;
        }
    }
    async testAssistant(id, testData) {
        try {
            logger_1.logger.info('Testing assistant', { id, message: testData.message });
            const response = await apiClient_1.apiClient.post(`/assistants/${id}/test`, testData);
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.message || '测试助手失败');
        }
        catch (error) {
            logger_1.logger.error('Test assistant failed:', error);
            throw error;
        }
    }
    // 助手分类
    async getAssistantCategories() {
        try {
            const response = await apiClient_1.apiClient.get('/assistants/categories');
            if (response.success && response.data) {
                return response.data.categories;
            }
            return [];
        }
        catch (error) {
            logger_1.logger.error('Get assistant categories failed:', error);
            return [];
        }
    }
    // 助手模板
    async getAssistantTemplates(params) {
        try {
            const response = await apiClient_1.apiClient.get('/assistants/templates', { params });
            if (response.success && response.data) {
                return {
                    items: response.data.templates,
                    total: response.data.total,
                    page: Math.floor((response.data.offset || 0) / (response.data.limit || 20)) + 1,
                    page_size: response.data.limit || 20,
                    total_pages: Math.ceil(response.data.total / (response.data.limit || 20))
                };
            }
            throw new Error(response.message || '获取助手模板失败');
        }
        catch (error) {
            logger_1.logger.error('Get assistant templates failed:', error);
            throw error;
        }
    }
    async createAssistantFromTemplate(templateData) {
        try {
            logger_1.logger.info('Creating assistant from template', { template_id: templateData.template_id });
            const response = await apiClient_1.apiClient.post('/assistants/from-template', templateData);
            if (response.success && response.data) {
                logger_1.logger.info('Assistant created from template successfully', { id: response.data.id });
                return response.data;
            }
            throw new Error(response.message || '从模板创建助手失败');
        }
        catch (error) {
            logger_1.logger.error('Create assistant from template failed:', error);
            throw error;
        }
    }
    // 动态代理
    async getDynamicAgents(params) {
        try {
            const response = await apiClient_1.apiClient.get('/assistants/dynamic-agents', { params });
            if (response.success && response.data) {
                return {
                    items: response.data.agents,
                    total: response.data.total,
                    page: Math.floor((response.data.offset || 0) / (response.data.limit || 20)) + 1,
                    page_size: response.data.limit || 20,
                    total_pages: Math.ceil(response.data.total / (response.data.limit || 20))
                };
            }
            throw new Error(response.message || '获取动态代理失败');
        }
        catch (error) {
            logger_1.logger.error('Get dynamic agents failed:', error);
            throw error;
        }
    }
    async executeAgent(agentId, executionData) {
        try {
            logger_1.logger.info('Executing dynamic agent', { agentId, input: executionData.input });
            const response = await apiClient_1.apiClient.post(`/assistants/dynamic-agents/${agentId}/execute`, executionData);
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.message || '执行代理失败');
        }
        catch (error) {
            logger_1.logger.error('Execute agent failed:', error);
            throw error;
        }
    }
    // QA会话管理
    async getQASessions(assistantId, params) {
        try {
            const queryParams = { ...params };
            if (assistantId) {
                queryParams.assistant_id = assistantId;
            }
            const response = await apiClient_1.apiClient.get('/assistants/qa/sessions', { params: queryParams });
            if (response.success && response.data) {
                return {
                    items: response.data.sessions,
                    total: response.data.total,
                    page: Math.floor((response.data.offset || 0) / (response.data.limit || 20)) + 1,
                    page_size: response.data.limit || 20,
                    total_pages: Math.ceil(response.data.total / (response.data.limit || 20))
                };
            }
            throw new Error(response.message || '获取QA会话失败');
        }
        catch (error) {
            logger_1.logger.error('Get QA sessions failed:', error);
            throw error;
        }
    }
    async getQAMessages(sessionId, params) {
        try {
            const response = await apiClient_1.apiClient.get(`/assistants/qa/sessions/${sessionId}/messages`, { params });
            if (response.success && response.data) {
                return {
                    items: response.data.messages,
                    total: response.data.total,
                    page: Math.floor((response.data.offset || 0) / (response.data.limit || 20)) + 1,
                    page_size: response.data.limit || 20,
                    total_pages: Math.ceil(response.data.total / (response.data.limit || 20))
                };
            }
            throw new Error(response.message || '获取QA消息失败');
        }
        catch (error) {
            logger_1.logger.error('Get QA messages failed:', error);
            throw error;
        }
    }
    async searchQA(searchRequest) {
        try {
            const response = await apiClient_1.apiClient.post('/assistants/qa/search', searchRequest);
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.message || '搜索QA失败');
        }
        catch (error) {
            logger_1.logger.error('Search QA failed:', error);
            throw error;
        }
    }
    // 助手分析
    async getAssistantAnalytics(assistantId, period = 'week') {
        try {
            const response = await apiClient_1.apiClient.get(`/assistants/${assistantId}/analytics`, { params: { period } });
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.message || '获取助手分析数据失败');
        }
        catch (error) {
            logger_1.logger.error('Get assistant analytics failed:', error);
            throw error;
        }
    }
    // 助手复制/克隆
    async cloneAssistant(id, newName) {
        try {
            logger_1.logger.info('Cloning assistant', { id, newName });
            const response = await apiClient_1.apiClient.post(`/assistants/${id}/clone`, {
                name: newName
            });
            if (response.success && response.data) {
                logger_1.logger.info('Assistant cloned successfully', {
                    originalId: id,
                    newId: response.data.id
                });
                return response.data;
            }
            throw new Error(response.message || '克隆助手失败');
        }
        catch (error) {
            logger_1.logger.error('Clone assistant failed:', error);
            throw error;
        }
    }
    // 助手导出/导入
    async exportAssistant(id) {
        try {
            const response = await apiClient_1.apiClient.get(`/assistants/${id}/export`, {
                responseType: 'blob'
            });
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('Export assistant failed:', error);
            throw error;
        }
    }
    async importAssistant(file) {
        try {
            const response = await apiClient_1.apiClient.upload('/assistants/import', file);
            if (response.success && response.data) {
                logger_1.logger.info('Assistant imported successfully', { id: response.data.id });
                return response.data;
            }
            throw new Error(response.message || '导入助手失败');
        }
        catch (error) {
            logger_1.logger.error('Import assistant failed:', error);
            throw error;
        }
    }
}
exports.AssistantService = AssistantService;
exports.assistantService = new AssistantService();
