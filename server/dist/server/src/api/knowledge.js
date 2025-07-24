"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const knowledge_1 = require("../services/knowledge");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
// 获取知识库列表
router.get('/', async (req, res, next) => {
    try {
        const data = await knowledge_1.knowledgeService.getKnowledgeBases();
        res.json(data);
    }
    catch (error) {
        logger_1.logger.error('获取知识库列表失败:', error);
        next(error);
    }
});
// 获取单个知识库详情
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await knowledge_1.knowledgeService.getKnowledgeBaseById(id);
        if (!data) {
            return res.status(404).json({ error: '未找到指定知识库' });
        }
        res.json(data);
    }
    catch (error) {
        logger_1.logger.error(`获取知识库详情失败 ID: ${req.params.id}:`, error);
        next(error);
    }
});
// 创建新知识库
router.post('/', async (req, res, next) => {
    try {
        const newKnowledgeBase = req.body;
        const data = await knowledge_1.knowledgeService.createKnowledgeBase(newKnowledgeBase);
        res.status(201).json(data);
    }
    catch (error) {
        logger_1.logger.error('创建知识库失败:', error);
        next(error);
    }
});
// 更新知识库
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const knowledgeBase = req.body;
        const data = await knowledge_1.knowledgeService.updateKnowledgeBase(id, knowledgeBase);
        if (!data) {
            return res.status(404).json({ error: '未找到指定知识库' });
        }
        res.json(data);
    }
    catch (error) {
        logger_1.logger.error(`更新知识库失败 ID: ${req.params.id}:`, error);
        next(error);
    }
});
// 删除知识库
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const success = await knowledge_1.knowledgeService.deleteKnowledgeBase(id);
        if (!success) {
            return res.status(404).json({ error: '未找到指定知识库' });
        }
        res.status(204).end();
    }
    catch (error) {
        logger_1.logger.error(`删除知识库失败 ID: ${req.params.id}:`, error);
        next(error);
    }
});
// 获取知识库中的文件列表
router.get('/:id/files', async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await knowledge_1.knowledgeService.getKnowledgeBaseFiles(id);
        res.json(data);
    }
    catch (error) {
        logger_1.logger.error(`获取知识库文件列表失败 ID: ${req.params.id}:`, error);
        next(error);
    }
});
exports.default = router;
