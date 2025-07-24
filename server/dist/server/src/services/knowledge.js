"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.knowledgeService = exports.KnowledgeService = void 0;
const apiClient_1 = require("../utils/apiClient");
const logger_1 = require("../utils/logger");
class KnowledgeService {
    constructor() {
        this.apiClient = (0, apiClient_1.createApiClient)();
        this.baseUrl = '/api/frontend/knowledge';
        // ================ 知识库管理 ================
        this.embeddingModelConfig = {
            embedding_model_name: 'Qwen/Qwen3-Embedding-8B',
            rerank_model_name: 'Qwen/Qwen3-Reranker-8B',
            chat_models: ['Qwen/Qwen3-32B', 'moonshotai/Kimi-K2-Instruct'],
            api_key: 'sk-mnennlifdngjififromhljflqsblutyfgfvwerkfhsxummcn'
        };
    }
    /**
     * 获取知识库列表
     */
    async getKnowledgeBases(params) {
        try {
            logger_1.logger.info('获取知识库列表', { params });
            const response = await this.apiClient.get(`${this.baseUrl}/bases`, { params });
            if (!response.data) {
                throw new Error('获取知识库列表失败：服务器返回空数据');
            }
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('获取知识库列表失败:', error);
            throw new Error('获取知识库列表失败');
        }
    }
    /**
     * 根据ID获取知识库详情
     */
    async getKnowledgeBaseById(id) {
        try {
            logger_1.logger.info(`获取知识库详情, ID: ${id}`);
            const response = await this.apiClient.get(`${this.baseUrl}/bases/${id}`);
            if (!response.data) {
                throw new Error('获取知识库详情失败：服务器返回空数据');
            }
            return response.data;
        }
        catch (error) {
            logger_1.logger.error(`获取知识库详情失败, ID: ${id}:`, error);
            throw new Error(`获取知识库详情失败: ${error}`);
        }
    }
    /**
     * 创建知识库
     */
    async createKnowledgeBase(data) {
        try {
            // 将embedding模型和API配置应用到创建请求中
            const enrichedData = {
                ...data,
                embedding_model: this.embeddingModelConfig.embedding_model_name,
                api_key: this.embeddingModelConfig.api_key
            };
            logger_1.logger.info('创建知识库', { enrichedData });
            const response = await this.apiClient.post(`${this.baseUrl}/bases`, data);
            if (!response.data) {
                throw new Error('创建知识库失败：服务器返回空数据');
            }
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('创建知识库失败:', error);
            throw new Error('创建知识库失败');
        }
    }
    /**
     * 更新知识库
     */
    async updateKnowledgeBase(id, data) {
        try {
            logger_1.logger.info(`更新知识库, ID: ${id}`, { data });
            const response = await this.apiClient.put(`${this.baseUrl}/bases/${id}`, data);
            if (!response.data) {
                throw new Error('更新知识库失败：服务器返回空数据');
            }
            return response.data;
        }
        catch (error) {
            logger_1.logger.error(`更新知识库失败, ID: ${id}:`, error);
            throw new Error(`更新知识库失败: ${error}`);
        }
    }
    /**
     * 删除知识库
     */
    async deleteKnowledgeBase(id) {
        try {
            logger_1.logger.info(`删除知识库, ID: ${id}`);
            await this.apiClient.delete(`${this.baseUrl}/bases/${id}`);
        }
        catch (error) {
            logger_1.logger.error(`删除知识库失败, ID: ${id}:`, error);
            throw new Error(`删除知识库失败: ${error}`);
        }
    }
    /**
     * 获取知识库统计信息
     */
    async getKnowledgeBaseStats(id) {
        try {
            logger_1.logger.info(`获取知识库统计信息, ID: ${id}`);
            const response = await this.apiClient.get(`${this.baseUrl}/bases/${id}/stats`);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error(`获取知识库统计信息失败, ID: ${id}:`, error);
            throw new Error(`获取知识库统计信息失败: ${error}`);
        }
    }
    // ================ 文档管理 ================
    /**
     * 获取知识库文档列表
     */
    async getDocuments(knowledgeBaseId, params) {
        try {
            logger_1.logger.info(`获取知识库文档列表, 知识库ID: ${knowledgeBaseId}`, { params });
            const response = await this.apiClient.get(`${this.baseUrl}/bases/${knowledgeBaseId}/documents`, { params });
            return response.data;
        }
        catch (error) {
            logger_1.logger.error(`获取知识库文档列表失败, 知识库ID: ${knowledgeBaseId}:`, error);
            throw new Error(`获取知识库文档列表失败: ${error}`);
        }
    }
    /**
     * 根据ID获取文档详情
     */
    async getDocumentById(id) {
        try {
            logger_1.logger.info(`获取文档详情, ID: ${id}`);
            const response = await this.apiClient.get(`${this.baseUrl}/documents/${id}`);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error(`获取文档详情失败, ID: ${id}:`, error);
            throw new Error(`获取文档详情失败: ${error}`);
        }
    }
    /**
     * 创建文档
     */
    async createDocument(knowledgeBaseId, data) {
        try {
            logger_1.logger.info(`创建文档, 知识库ID: ${knowledgeBaseId}`, { data });
            const response = await this.apiClient.post(`${this.baseUrl}/bases/${knowledgeBaseId}/documents`, data);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error(`创建文档失败, 知识库ID: ${knowledgeBaseId}:`, error);
            throw new Error('创建文档失败');
        }
    }
    /**
     * 上传文档
     */
    async uploadDocument(knowledgeBaseId, file, data) {
        try {
            logger_1.logger.info(`上传文档, 知识库ID: ${knowledgeBaseId}`, { title: data.title });
            const response = await this.apiClient.upload(`${this.baseUrl}/bases/${knowledgeBaseId}/documents/upload`, file, 'file', data);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error(`上传文档失败, 知识库ID: ${knowledgeBaseId}:`, error);
            throw new Error('上传文档失败');
        }
    }
    /**
     * 删除文档
     */
    async deleteDocument(id) {
        try {
            logger_1.logger.info(`删除文档, ID: ${id}`);
            await this.apiClient.delete(`${this.baseUrl}/documents/${id}`);
        }
        catch (error) {
            logger_1.logger.error(`删除文档失败, ID: ${id}:`, error);
            throw new Error(`删除文档失败: ${error}`);
        }
    }
    /**
     * 重新处理文档
     */
    async reprocessDocument(id) {
        try {
            logger_1.logger.info(`重新处理文档, ID: ${id}`);
            const response = await this.apiClient.post(`${this.baseUrl}/documents/${id}/reprocess`);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error(`重新处理文档失败, ID: ${id}:`, error);
            throw new Error(`重新处理文档失败: ${error}`);
        }
    }
    // ================ 文档搜索 ================
    /**
     * 搜索文档
     */
    async searchDocuments(request) {
        try {
            logger_1.logger.info('搜索文档', { request });
            const response = await this.apiClient.post(`${this.baseUrl}/search`, request);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('搜索文档失败:', error);
            throw new Error('搜索文档失败');
        }
    }
    /**
     * 获取文档分片
     */
    async getDocumentChunks(documentId, params) {
        try {
            logger_1.logger.info(`获取文档分片, 文档ID: ${documentId}`, { params });
            const response = await this.apiClient.get(`${this.baseUrl}/documents/${documentId}/chunks`, { params });
            return response.data;
        }
        catch (error) {
            logger_1.logger.error(`获取文档分片失败, 文档ID: ${documentId}:`, error);
            throw new Error(`获取文档分片失败: ${error}`);
        }
    }
    // ================ 知识图谱 ================
    /**
     * 获取知识库的知识图谱
     */
    async getKnowledgeGraph(knowledgeBaseId) {
        try {
            logger_1.logger.info(`获取知识图谱, 知识库ID: ${knowledgeBaseId}`);
            const response = await this.apiClient.get(`${this.baseUrl}/bases/${knowledgeBaseId}/graph`);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error(`获取知识图谱失败, 知识库ID: ${knowledgeBaseId}:`, error);
            throw new Error(`获取知识图谱失败: ${error}`);
        }
    }
    /**
     * 构建知识图谱
     */
    async buildKnowledgeGraph(knowledgeBaseId, config) {
        try {
            logger_1.logger.info(`构建知识图谱, 知识库ID: ${knowledgeBaseId}`, { config });
            const response = await this.apiClient.post(`${this.baseUrl}/bases/${knowledgeBaseId}/graph/build`, config);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error(`构建知识图谱失败, 知识库ID: ${knowledgeBaseId}:`, error);
            throw new Error(`构建知识图谱失败: ${error}`);
        }
    }
    /**
     * 搜索知识图谱
     */
    async searchGraph(knowledgeBaseId, request) {
        try {
            logger_1.logger.info(`搜索知识图谱, 知识库ID: ${knowledgeBaseId}`, { request });
            const response = await this.apiClient.post(`${this.baseUrl}/bases/${knowledgeBaseId}/graph/search`, request);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error(`搜索知识图谱失败, 知识库ID: ${knowledgeBaseId}:`, error);
            throw new Error(`搜索知识图谱失败: ${error}`);
        }
    }
    // ================ 向量模板 ================
    /**
     * 获取向量模板列表
     */
    async getVectorTemplates() {
        try {
            logger_1.logger.info('获取向量模板列表');
            const response = await this.apiClient.get(`${this.baseUrl}/templates`);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('获取向量模板列表失败:', error);
            throw new Error('获取向量模板列表失败');
        }
    }
    /**
     * 获取分块策略列表
     */
    async getChunkingStrategies() {
        try {
            logger_1.logger.info('获取分块策略列表');
            const response = await this.apiClient.get(`${this.baseUrl}/chunking-strategies`);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('获取分块策略列表失败:', error);
            throw new Error('获取分块策略列表失败');
        }
    }
    /**
     * 获取嵌入模型列表
     */
    async getEmbeddingModels() {
        try {
            logger_1.logger.info('获取嵌入模型列表');
            const response = await this.apiClient.get(`${this.baseUrl}/embedding-models`);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('获取嵌入模型列表失败:', error);
            throw new Error('获取嵌入模型列表失败');
        }
    }
    /**
     * 获取向量存储列表
     */
    async getVectorStores() {
        try {
            logger_1.logger.info('获取向量存储列表');
            const response = await this.apiClient.get(`${this.baseUrl}/vector-stores`);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('获取向量存储列表失败:', error);
            throw new Error('获取向量存储列表失败');
        }
    }
}
exports.KnowledgeService = KnowledgeService;
exports.knowledgeService = new KnowledgeService();
