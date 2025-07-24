"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const chat_1 = require("../services/chat");
const logger_1 = require("../utils/logger");
const router = express_1.default.Router();
// 配置文件上传
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
    },
    fileFilter: (req, file, cb) => {
        // 允许音频文件
        if (file.mimetype.startsWith('audio/')) {
            cb(null, true);
        }
        else {
            cb(new Error('只允许上传音频文件'));
        }
    },
});
// ================ 对话管理 ================
/**
 * 获取对话列表
 */
router.get('/conversations', async (req, res) => {
    try {
        const params = {
            page: parseInt(req.query.page) || 1,
            page_size: parseInt(req.query.page_size) || 20,
            assistant_id: req.query.assistant_id ? parseInt(req.query.assistant_id) : undefined,
            search: req.query.search,
            is_archived: req.query.is_archived === 'true' ? true : req.query.is_archived === 'false' ? false : undefined,
            is_pinned: req.query.is_pinned === 'true' ? true : req.query.is_pinned === 'false' ? false : undefined,
            date_from: req.query.date_from,
            date_to: req.query.date_to,
        };
        const result = await chat_1.chatService.getConversations(params);
        res.json({
            success: true,
            data: result,
            message: '获取对话列表成功'
        });
    }
    catch (error) {
        logger_1.logger.error('获取对话列表失败:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : '获取对话列表失败'
        });
    }
});
/**
 * 根据ID获取对话详情
 */
router.get('/conversations/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: '无效的对话ID'
            });
        }
        const conversation = await chat_1.chatService.getConversationById(id);
        res.json({
            success: true,
            data: conversation,
            message: '获取对话详情成功'
        });
    }
    catch (error) {
        logger_1.logger.error('获取对话详情失败:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : '获取对话详情失败'
        });
    }
});
/**
 * 创建新对话
 */
router.post('/conversations', async (req, res) => {
    try {
        const data = req.body;
        // 基本验证
        if (!data.title || !data.assistant_id) {
            return res.status(400).json({
                success: false,
                message: '缺少必需的参数：title 和 assistant_id'
            });
        }
        const conversation = await chat_1.chatService.createConversation(data);
        res.status(201).json({
            success: true,
            data: conversation,
            message: '创建对话成功'
        });
    }
    catch (error) {
        logger_1.logger.error('创建对话失败:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : '创建对话失败'
        });
    }
});
/**
 * 更新对话
 */
router.put('/conversations/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: '无效的对话ID'
            });
        }
        const data = req.body;
        const conversation = await chat_1.chatService.updateConversation(id, data);
        res.json({
            success: true,
            data: conversation,
            message: '更新对话成功'
        });
    }
    catch (error) {
        logger_1.logger.error('更新对话失败:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : '更新对话失败'
        });
    }
});
/**
 * 删除对话
 */
router.delete('/conversations/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: '无效的对话ID'
            });
        }
        await chat_1.chatService.deleteConversation(id);
        res.json({
            success: true,
            message: '删除对话成功'
        });
    }
    catch (error) {
        logger_1.logger.error('删除对话失败:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : '删除对话失败'
        });
    }
});
/**
 * 归档对话
 */
router.post('/conversations/:id/archive', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: '无效的对话ID'
            });
        }
        const conversation = await chat_1.chatService.archiveConversation(id);
        res.json({
            success: true,
            data: conversation,
            message: '归档对话成功'
        });
    }
    catch (error) {
        logger_1.logger.error('归档对话失败:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : '归档对话失败'
        });
    }
});
/**
 * 恢复对话
 */
router.post('/conversations/:id/restore', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: '无效的对话ID'
            });
        }
        const conversation = await chat_1.chatService.restoreConversation(id);
        res.json({
            success: true,
            data: conversation,
            message: '恢复对话成功'
        });
    }
    catch (error) {
        logger_1.logger.error('恢复对话失败:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : '恢复对话失败'
        });
    }
});
// ================ 消息管理 ================
/**
 * 获取对话消息列表
 */
router.get('/conversations/:id/messages', async (req, res) => {
    try {
        const conversationId = parseInt(req.params.id);
        if (isNaN(conversationId)) {
            return res.status(400).json({
                success: false,
                message: '无效的对话ID'
            });
        }
        const params = {
            page: parseInt(req.query.page) || 1,
            page_size: parseInt(req.query.page_size) || 50,
            order: req.query.order || 'asc',
            role: req.query.role,
            include_metadata: req.query.include_metadata === 'true',
        };
        const result = await chat_1.chatService.getMessages(conversationId, params);
        res.json({
            success: true,
            data: result,
            message: '获取消息列表成功'
        });
    }
    catch (error) {
        logger_1.logger.error('获取消息列表失败:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : '获取消息列表失败'
        });
    }
});
/**
 * 发送聊天消息
 */
router.post('/chat', async (req, res) => {
    try {
        const request = req.body;
        // 基本验证
        if (!request.message || !request.assistant_id) {
            return res.status(400).json({
                success: false,
                message: '缺少必需的参数：message 和 assistant_id'
            });
        }
        // 判断是否为流式请求
        if (request.stream) {
            // 设置SSE响应头
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.setHeader('Access-Control-Allow-Origin', '*');
            await chat_1.chatService.sendMessageStream(request, (chunk) => {
                res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
            });
            res.write('data: [DONE]\n\n');
            res.end();
        }
        else {
            const result = await chat_1.chatService.sendMessage(request);
            res.json({
                success: true,
                data: result,
                message: '发送消息成功'
            });
        }
    }
    catch (error) {
        logger_1.logger.error('发送消息失败:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : '发送消息失败'
        });
    }
});
/**
 * 语音聊天
 */
router.post('/chat/voice', upload.single('audio_file'), async (req, res) => {
    try {
        const request = {
            assistant_id: parseInt(req.body.assistant_id),
            conversation_id: req.body.conversation_id ? parseInt(req.body.conversation_id) : undefined,
            message: req.body.message,
            audio_file: req.file ? new File([req.file.buffer], req.file.originalname || 'audio.wav', {
                type: req.file.mimetype
            }) : undefined,
            enable_voice_input: req.body.enable_voice_input === 'true',
            enable_voice_output: req.body.enable_voice_output === 'true',
            transcribe_only: req.body.transcribe_only === 'true',
            voice_settings: {
                voice: req.body.voice,
                speed: req.body.speed ? parseFloat(req.body.speed) : undefined,
                pitch: req.body.pitch ? parseFloat(req.body.pitch) : undefined,
                volume: req.body.volume ? parseFloat(req.body.volume) : undefined,
                language: req.body.language,
            }
        };
        // 基本验证
        if (!request.assistant_id) {
            return res.status(400).json({
                success: false,
                message: '缺少必需的参数：assistant_id'
            });
        }
        if (!request.audio_file && !request.message) {
            return res.status(400).json({
                success: false,
                message: '必须提供音频文件或文本消息'
            });
        }
        const result = await chat_1.chatService.voiceChat(request);
        res.json({
            success: true,
            data: result,
            message: '语音聊天成功'
        });
    }
    catch (error) {
        logger_1.logger.error('语音聊天失败:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : '语音聊天失败'
        });
    }
});
/**
 * 编辑消息
 */
router.put('/messages/:id', async (req, res) => {
    try {
        const messageId = parseInt(req.params.id);
        if (isNaN(messageId)) {
            return res.status(400).json({
                success: false,
                message: '无效的消息ID'
            });
        }
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({
                success: false,
                message: '缺少必需的参数：content'
            });
        }
        const message = await chat_1.chatService.editMessage(messageId, content);
        res.json({
            success: true,
            data: message,
            message: '编辑消息成功'
        });
    }
    catch (error) {
        logger_1.logger.error('编辑消息失败:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : '编辑消息失败'
        });
    }
});
/**
 * 删除消息
 */
router.delete('/messages/:id', async (req, res) => {
    try {
        const messageId = parseInt(req.params.id);
        if (isNaN(messageId)) {
            return res.status(400).json({
                success: false,
                message: '无效的消息ID'
            });
        }
        await chat_1.chatService.deleteMessage(messageId);
        res.json({
            success: true,
            message: '删除消息成功'
        });
    }
    catch (error) {
        logger_1.logger.error('删除消息失败:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : '删除消息失败'
        });
    }
});
/**
 * 评价消息
 */
router.post('/messages/:id/rate', async (req, res) => {
    try {
        const messageId = parseInt(req.params.id);
        if (isNaN(messageId)) {
            return res.status(400).json({
                success: false,
                message: '无效的消息ID'
            });
        }
        const { rating, feedback } = req.body;
        if (rating === undefined || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: '评分必须是1-5的整数'
            });
        }
        const message = await chat_1.chatService.rateMessage(messageId, rating, feedback);
        res.json({
            success: true,
            data: message,
            message: '评价消息成功'
        });
    }
    catch (error) {
        logger_1.logger.error('评价消息失败:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : '评价消息失败'
        });
    }
});
// ================ 搜索功能 ================
/**
 * 搜索消息
 */
router.post('/search/messages', async (req, res) => {
    try {
        const request = req.body;
        if (!request.query) {
            return res.status(400).json({
                success: false,
                message: '缺少必需的参数：query'
            });
        }
        const result = await chat_1.chatService.searchMessages(request);
        res.json({
            success: true,
            data: result,
            message: '搜索消息成功'
        });
    }
    catch (error) {
        logger_1.logger.error('搜索消息失败:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : '搜索消息失败'
        });
    }
});
// ================ 语音功能 ================
/**
 * 文本转语音
 */
router.post('/voice/speech', async (req, res) => {
    try {
        const { text, voice, speed } = req.body;
        if (!text) {
            return res.status(400).json({
                success: false,
                message: '缺少必需的参数：text'
            });
        }
        const audioBlob = await chat_1.chatService.textToSpeech(text, voice, speed);
        // 设置响应头
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Disposition', 'attachment; filename=speech.mp3');
        // 发送音频数据
        const buffer = await audioBlob.arrayBuffer();
        res.send(Buffer.from(buffer));
    }
    catch (error) {
        logger_1.logger.error('文本转语音失败:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : '文本转语音失败'
        });
    }
});
// ================ 统计和分析 ================
/**
 * 获取对话统计
 */
router.get('/stats', async (req, res) => {
    try {
        const dateFrom = req.query.date_from;
        const dateTo = req.query.date_to;
        const stats = await chat_1.chatService.getConversationStats(dateFrom, dateTo);
        res.json({
            success: true,
            data: stats,
            message: '获取统计信息成功'
        });
    }
    catch (error) {
        logger_1.logger.error('获取统计信息失败:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : '获取统计信息失败'
        });
    }
});
// ================ 导出功能 ================
/**
 * 导出对话
 */
router.post('/export', async (req, res) => {
    try {
        const request = req.body;
        if (!request.format || !['json', 'csv', 'pdf', 'txt'].includes(request.format)) {
            return res.status(400).json({
                success: false,
                message: '无效的导出格式，支持：json, csv, pdf, txt'
            });
        }
        const result = await chat_1.chatService.exportConversations(request);
        res.json({
            success: true,
            data: result,
            message: '导出对话成功'
        });
    }
    catch (error) {
        logger_1.logger.error('导出对话失败:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : '导出对话失败'
        });
    }
});
/**
 * 批量操作对话
 */
router.post('/conversations/batch', async (req, res) => {
    try {
        const { conversation_ids, operation, metadata } = req.body;
        if (!conversation_ids || !Array.isArray(conversation_ids) || conversation_ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: '缺少对话ID列表'
            });
        }
        if (!operation || !['archive', 'restore', 'delete'].includes(operation)) {
            return res.status(400).json({
                success: false,
                message: '无效的操作类型，支持：archive, restore, delete'
            });
        }
        const result = await chat_1.chatService.batchOperateConversations(conversation_ids, operation, metadata);
        res.json({
            success: true,
            data: result,
            message: `批量${operation}操作完成`
        });
    }
    catch (error) {
        logger_1.logger.error('批量操作失败:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : '批量操作失败'
        });
    }
});
exports.default = router;
