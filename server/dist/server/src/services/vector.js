"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vectorService = void 0;
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const logger_1 = require("../utils/logger");
// 模拟数据
const mockVectors = [
    {
        id: '1',
        name: '产品文档向量库',
        source: 'product_docs',
        dimensions: 1536,
        count: 1250,
        lastUpdated: '2025-05-10T14:30:00Z',
        metadata: {
            engine: 'FAISS',
            description: '包含产品文档的向量表示'
        }
    },
    {
        id: '2',
        name: '用户问题向量库',
        source: 'user_questions',
        dimensions: 768,
        count: 5430,
        lastUpdated: '2025-05-12T09:15:00Z',
        metadata: {
            engine: 'Pinecone',
            description: '用户常见问题的向量表示'
        }
    },
    {
        id: '3',
        name: '技术文档向量库',
        source: 'tech_docs',
        dimensions: 1024,
        count: 3275,
        lastUpdated: '2025-05-11T16:45:00Z',
        metadata: {
            engine: 'Milvus',
            description: '技术文档和API参考的向量表示'
        }
    }
];
class VectorService {
    constructor() {
        this.apiUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';
        this.useMock = process.env.USE_MOCK_DATA === 'true';
    }
    async getVectors() {
        if (this.useMock) {
            logger_1.logger.info('使用模拟数据获取向量列表');
            return [...mockVectors];
        }
        try {
            logger_1.logger.info('从后端API获取向量列表');
            const response = await axios_1.default.get(`${this.apiUrl}/api/vectors`);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('获取向量列表失败:', error);
            throw new Error('获取向量列表失败');
        }
    }
    async getVectorById(id) {
        if (this.useMock) {
            logger_1.logger.info(`使用模拟数据获取向量详情, ID: ${id}`);
            const vector = mockVectors.find(v => v.id === id);
            return vector || null;
        }
        try {
            logger_1.logger.info(`从后端API获取向量详情, ID: ${id}`);
            const response = await axios_1.default.get(`${this.apiUrl}/api/vectors/${id}`);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error(`获取向量详情失败, ID: ${id}:`, error);
            if (axios_1.default.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            throw new Error(`获取向量详情失败: ${error}`);
        }
    }
    async searchVectors(searchParams) {
        if (this.useMock) {
            logger_1.logger.info(`使用模拟数据搜索向量, 查询: ${searchParams.query}`);
            return [
                {
                    id: 'result1',
                    content: '这是一个相关的搜索结果示例',
                    score: 0.92,
                    metadata: { source: 'document1.pdf', page: 5 }
                },
                {
                    id: 'result2',
                    content: '另一个相关但相似度较低的结果',
                    score: 0.78,
                    metadata: { source: 'document2.pdf', page: 12 }
                }
            ];
        }
        try {
            logger_1.logger.info(`向后端API搜索向量, 查询: ${searchParams.query}`);
            const response = await axios_1.default.post(`${this.apiUrl}/api/vectors/search`, searchParams);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('向量搜索失败:', error);
            throw new Error('向量搜索失败');
        }
    }
    async createVector(vector) {
        if (this.useMock) {
            logger_1.logger.info('使用模拟数据创建向量');
            const newVector = {
                id: (0, uuid_1.v4)(),
                ...vector,
                lastUpdated: new Date().toISOString()
            };
            mockVectors.push(newVector);
            return newVector;
        }
        try {
            logger_1.logger.info('向后端API创建向量');
            const response = await axios_1.default.post(`${this.apiUrl}/api/vectors`, vector);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('创建向量失败:', error);
            throw new Error('创建向量失败');
        }
    }
    async updateVector(id, vector) {
        if (this.useMock) {
            logger_1.logger.info(`使用模拟数据更新向量, ID: ${id}`);
            const index = mockVectors.findIndex(v => v.id === id);
            if (index === -1) {
                return null;
            }
            const updatedVector = {
                ...mockVectors[index],
                ...vector,
                lastUpdated: new Date().toISOString()
            };
            mockVectors[index] = updatedVector;
            return updatedVector;
        }
        try {
            logger_1.logger.info(`向后端API更新向量, ID: ${id}`);
            const response = await axios_1.default.put(`${this.apiUrl}/api/vectors/${id}`, vector);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error(`更新向量失败, ID: ${id}:`, error);
            if (axios_1.default.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            throw new Error(`更新向量失败: ${error}`);
        }
    }
    async deleteVector(id) {
        if (this.useMock) {
            logger_1.logger.info(`使用模拟数据删除向量, ID: ${id}`);
            const index = mockVectors.findIndex(v => v.id === id);
            if (index === -1) {
                return false;
            }
            mockVectors.splice(index, 1);
            return true;
        }
        try {
            logger_1.logger.info(`向后端API删除向量, ID: ${id}`);
            await axios_1.default.delete(`${this.apiUrl}/api/vectors/${id}`);
            return true;
        }
        catch (error) {
            logger_1.logger.error(`删除向量失败, ID: ${id}:`, error);
            if (axios_1.default.isAxiosError(error) && error.response?.status === 404) {
                return false;
            }
            throw new Error(`删除向量失败: ${error}`);
        }
    }
}
exports.vectorService = new VectorService();
