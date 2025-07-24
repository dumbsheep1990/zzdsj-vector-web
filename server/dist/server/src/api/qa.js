"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const qa_1 = require("../services/qa");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
// 获取问题列表（可按助手ID筛选）
router.get('/questions', async (req, res, next) => {
    try {
        const { assistantId } = req.query;
        const data = await qa_1.qaService.getQuestions(assistantId);
        res.json(data);
    }
    catch (error) {
        logger_1.logger.error('获取问题列表失败:', error);
        next(error);
    }
});
// 获取单个问题详情及答案
router.get('/questions/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await qa_1.qaService.getQuestionById(id);
        if (!data) {
            return res.status(404).json({ error: '未找到指定问题' });
        }
        res.json(data);
    }
    catch (error) {
        logger_1.logger.error(`获取问题详情失败 ID: ${req.params.id}:`, error);
        next(error);
    }
});
// 创建新问题
router.post('/questions', async (req, res, next) => {
    try {
        const newQuestion = req.body;
        const data = await qa_1.qaService.createQuestion(newQuestion);
        res.status(201).json(data);
    }
    catch (error) {
        logger_1.logger.error('创建问题失败:', error);
        next(error);
    }
});
// 更新问题
router.put('/questions/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const question = req.body;
        const data = await qa_1.qaService.updateQuestion(id, question);
        if (!data) {
            return res.status(404).json({ error: '未找到指定问题' });
        }
        res.json(data);
    }
    catch (error) {
        logger_1.logger.error(`更新问题失败 ID: ${req.params.id}:`, error);
        next(error);
    }
});
// 删除问题
router.delete('/questions/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const success = await qa_1.qaService.deleteQuestion(id);
        if (!success) {
            return res.status(404).json({ error: '未找到指定问题' });
        }
        res.status(204).end();
    }
    catch (error) {
        logger_1.logger.error(`删除问题失败 ID: ${req.params.id}:`, error);
        next(error);
    }
});
// 获取数据集问答对列表
router.get('/datasets/:datasetId/qa-pairs', async (req, res, next) => {
    try {
        const { datasetId } = req.params;
        const data = await qa_1.qaService.getQaPairsByDatasetId(datasetId);
        res.json(data);
    }
    catch (error) {
        logger_1.logger.error(`获取数据集问答对失败 DatasetID: ${req.params.datasetId}:`, error);
        next(error);
    }
});
// 创建数据集问答对
router.post('/datasets/:datasetId/qa-pairs', async (req, res, next) => {
    try {
        const { datasetId } = req.params;
        const qaPair = req.body;
        const data = await qa_1.qaService.createQaPair(datasetId, qaPair);
        res.status(201).json(data);
    }
    catch (error) {
        logger_1.logger.error(`创建数据集问答对失败 DatasetID: ${req.params.datasetId}:`, error);
        next(error);
    }
});
// 批量保存拆分的问答对
router.post('/datasets/:datasetId/split-qa-pairs', async (req, res, next) => {
    try {
        const { datasetId } = req.params;
        const qaPairs = req.body;
        const data = await qa_1.qaService.saveSplitQaPairs(datasetId, qaPairs);
        res.status(201).json(data);
    }
    catch (error) {
        logger_1.logger.error(`批量保存拆分问答对失败 DatasetID: ${req.params.datasetId}:`, error);
        next(error);
    }
});
exports.default = router;
