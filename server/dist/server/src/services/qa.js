"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.qaService = void 0;
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const logger_1 = require("../utils/logger");
// 模拟数据
const mockQuestions = {
    'assistant1': [
        {
            id: '1',
            assistantId: 'assistant1',
            content: '向量数据库如何处理大规模查询？',
            createdAt: '2025-05-10T14:30:00Z',
            status: 'answered'
        },
        {
            id: '2',
            assistantId: 'assistant1',
            content: '如何优化向量搜索的性能？',
            createdAt: '2025-05-11T09:15:00Z',
            status: 'answered'
        }
    ],
    'assistant2': [
        {
            id: '3',
            assistantId: 'assistant2',
            content: '怎样构建高质量的知识库？',
            createdAt: '2025-05-12T16:45:00Z',
            status: 'answered'
        }
    ]
};
const mockAnswers = {
    '1': {
        id: 'a1',
        questionId: '1',
        content: '向量数据库通过索引结构和分区技术处理大规模查询。常见的技术包括近似最近邻（ANN）算法、分片和分布式处理等。',
        createdAt: '2025-05-10T14:35:00Z',
        sources: [
            { title: '向量数据库白皮书', url: 'https://example.com/whitepaper' },
            { title: '高性能向量搜索指南', url: 'https://example.com/guide' }
        ]
    },
    '2': {
        id: 'a2',
        questionId: '2',
        content: '优化向量搜索性能的方法包括：选择适当的索引类型、降低向量维度、使用量化技术、调整相似度计算算法等。',
        createdAt: '2025-05-11T09:20:00Z',
        sources: [
            { title: '向量搜索优化指南', url: 'https://example.com/optimization' }
        ]
    },
    '3': {
        id: 'a3',
        questionId: '3',
        content: '构建高质量知识库需要注意数据的准确性、完整性、时效性和结构化程度。同时要建立良好的更新机制确保知识保持最新状态。',
        createdAt: '2025-05-12T16:50:00Z',
        sources: [
            { title: '知识管理最佳实践', url: 'https://example.com/knowledge-management' }
        ]
    }
};
const mockQaPairs = {
    'dataset1': [
        {
            id: 'qp1',
            question: '什么是向量数据库？',
            answer: '向量数据库是一种特殊类型的数据库，专门用于存储和检索向量嵌入，常用于机器学习和人工智能应用中进行相似性搜索。',
            datasetId: 'dataset1',
            createdAt: '2025-05-01T10:00:00Z'
        },
        {
            id: 'qp2',
            question: '向量数据库和传统数据库有什么区别？',
            answer: '传统数据库主要处理结构化数据并通过精确匹配进行查询，而向量数据库专注于高维向量的存储和基于相似度的近似查询。',
            datasetId: 'dataset1',
            createdAt: '2025-05-01T10:15:00Z'
        }
    ],
    'dataset2': [
        {
            id: 'qp3',
            question: '如何评估LLM的性能？',
            answer: '评估LLM性能可以使用多种指标，包括准确性、流畅度、相关性、无害性等。常用的评估框架包括MMLU、HELM和LMSys Chatbot Arena等。',
            datasetId: 'dataset2',
            createdAt: '2025-05-02T14:30:00Z'
        }
    ]
};
class QaService {
    constructor() {
        this.apiUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';
        this.useMock = process.env.USE_MOCK_DATA === 'true';
    }
    async getQuestions(assistantId) {
        if (this.useMock) {
            logger_1.logger.info(`使用模拟数据获取问题列表, 助手ID: ${assistantId || '所有'}`);
            if (assistantId) {
                return mockQuestions[assistantId] || [];
            }
            let allQuestions = [];
            Object.values(mockQuestions).forEach(questions => {
                allQuestions = allQuestions.concat(questions);
            });
            return allQuestions;
        }
        try {
            logger_1.logger.info(`从后端API获取问题列表, 助手ID: ${assistantId || '所有'}`);
            const url = assistantId
                ? `${this.apiUrl}/api/qa/questions?assistantId=${assistantId}`
                : `${this.apiUrl}/api/qa/questions`;
            const response = await axios_1.default.get(url);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('获取问题列表失败:', error);
            throw new Error('获取问题列表失败');
        }
    }
    async getQuestionById(id) {
        if (this.useMock) {
            logger_1.logger.info(`使用模拟数据获取问题详情, ID: ${id}`);
            let targetQuestion = null;
            Object.values(mockQuestions).forEach(questions => {
                const question = questions.find(q => q.id === id);
                if (question) {
                    targetQuestion = question;
                }
            });
            if (!targetQuestion) {
                return null;
            }
            const answer = mockAnswers[id] || null;
            return { question: targetQuestion, answer };
        }
        try {
            logger_1.logger.info(`从后端API获取问题详情, ID: ${id}`);
            const response = await axios_1.default.get(`${this.apiUrl}/api/qa/questions/${id}`);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error(`获取问题详情失败, ID: ${id}:`, error);
            if (axios_1.default.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            throw new Error(`获取问题详情失败: ${error}`);
        }
    }
    async createQuestion(question) {
        if (this.useMock) {
            logger_1.logger.info(`使用模拟数据创建问题, 助手ID: ${question.assistantId}`);
            const newQuestion = {
                id: (0, uuid_1.v4)(),
                ...question,
                createdAt: new Date().toISOString(),
                status: 'pending'
            };
            if (!mockQuestions[question.assistantId]) {
                mockQuestions[question.assistantId] = [];
            }
            mockQuestions[question.assistantId].push(newQuestion);
            return newQuestion;
        }
        try {
            logger_1.logger.info(`向后端API创建问题, 助手ID: ${question.assistantId}`);
            const response = await axios_1.default.post(`${this.apiUrl}/api/qa/questions`, question);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('创建问题失败:', error);
            throw new Error('创建问题失败');
        }
    }
    async updateQuestion(id, question) {
        if (this.useMock) {
            logger_1.logger.info(`使用模拟数据更新问题, ID: ${id}`);
            let updatedQuestion = null;
            Object.entries(mockQuestions).forEach(([assistantId, questions]) => {
                const questionIndex = questions.findIndex(q => q.id === id);
                if (questionIndex !== -1) {
                    mockQuestions[assistantId][questionIndex] = {
                        ...mockQuestions[assistantId][questionIndex],
                        ...question
                    };
                    updatedQuestion = mockQuestions[assistantId][questionIndex];
                }
            });
            return updatedQuestion;
        }
        try {
            logger_1.logger.info(`向后端API更新问题, ID: ${id}`);
            const response = await axios_1.default.put(`${this.apiUrl}/api/qa/questions/${id}`, question);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error(`更新问题失败, ID: ${id}:`, error);
            if (axios_1.default.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            throw new Error(`更新问题失败: ${error}`);
        }
    }
    async deleteQuestion(id) {
        if (this.useMock) {
            logger_1.logger.info(`使用模拟数据删除问题, ID: ${id}`);
            let deleted = false;
            Object.entries(mockQuestions).forEach(([assistantId, questions]) => {
                const questionIndex = questions.findIndex(q => q.id === id);
                if (questionIndex !== -1) {
                    mockQuestions[assistantId].splice(questionIndex, 1);
                    deleted = true;
                }
            });
            if (deleted && mockAnswers[id]) {
                delete mockAnswers[id];
            }
            return deleted;
        }
        try {
            logger_1.logger.info(`向后端API删除问题, ID: ${id}`);
            await axios_1.default.delete(`${this.apiUrl}/api/qa/questions/${id}`);
            return true;
        }
        catch (error) {
            logger_1.logger.error(`删除问题失败, ID: ${id}:`, error);
            if (axios_1.default.isAxiosError(error) && error.response?.status === 404) {
                return false;
            }
            throw new Error(`删除问题失败: ${error}`);
        }
    }
    async getQaPairsByDatasetId(datasetId) {
        if (this.useMock) {
            logger_1.logger.info(`使用模拟数据获取数据集问答对, 数据集ID: ${datasetId}`);
            return mockQaPairs[datasetId] || [];
        }
        try {
            logger_1.logger.info(`从后端API获取数据集问答对, 数据集ID: ${datasetId}`);
            const response = await axios_1.default.get(`${this.apiUrl}/api/qa/datasets/${datasetId}/qa-pairs`);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error(`获取数据集问答对失败, 数据集ID: ${datasetId}:`, error);
            throw new Error(`获取数据集问答对失败: ${error}`);
        }
    }
    async createQaPair(datasetId, qaPair) {
        if (this.useMock) {
            logger_1.logger.info(`使用模拟数据创建问答对, 数据集ID: ${datasetId}`);
            const newQaPair = {
                id: (0, uuid_1.v4)(),
                ...qaPair,
                datasetId,
                createdAt: new Date().toISOString()
            };
            if (!mockQaPairs[datasetId]) {
                mockQaPairs[datasetId] = [];
            }
            mockQaPairs[datasetId].push(newQaPair);
            return newQaPair;
        }
        try {
            logger_1.logger.info(`向后端API创建问答对, 数据集ID: ${datasetId}`);
            const response = await axios_1.default.post(`${this.apiUrl}/api/qa/datasets/${datasetId}/qa-pairs`, qaPair);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error(`创建问答对失败, 数据集ID: ${datasetId}:`, error);
            throw new Error(`创建问答对失败: ${error}`);
        }
    }
    async saveSplitQaPairs(datasetId, qaPairs) {
        if (this.useMock) {
            logger_1.logger.info(`使用模拟数据保存拆分问答对, 数据集ID: ${datasetId}`);
            const newQaPairs = qaPairs.map(qaPair => ({
                id: (0, uuid_1.v4)(),
                ...qaPair,
                datasetId,
                createdAt: new Date().toISOString()
            }));
            if (!mockQaPairs[datasetId]) {
                mockQaPairs[datasetId] = [];
            }
            mockQaPairs[datasetId] = mockQaPairs[datasetId].concat(newQaPairs);
            return newQaPairs;
        }
        try {
            logger_1.logger.info(`向后端API保存拆分问答对, 数据集ID: ${datasetId}`);
            const response = await axios_1.default.post(`${this.apiUrl}/api/qa/datasets/${datasetId}/split-qa-pairs`, qaPairs);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error(`保存拆分问答对失败, 数据集ID: ${datasetId}:`, error);
            throw new Error(`保存拆分问答对失败: ${error}`);
        }
    }
}
exports.qaService = new QaService();
