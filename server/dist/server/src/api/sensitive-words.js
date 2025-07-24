"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sensitive_words_1 = require("../services/sensitive-words");
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const sensitiveWordService = new sensitive_words_1.SensitiveWordService();
// 配置文件上传
const upload = (0, multer_1.default)({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        }
        else {
            cb(new Error('只支持CSV文件格式'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});
// 所有路由都需要用户认证
router.use(auth_1.userAuth);
/**
 * 获取敏感词列表
 */
router.get('/', async (req, res, next) => {
    try {
        const { page = 1, limit = 10, category, level, keyword, isActive } = req.query;
        const filters = {
            page: parseInt(page),
            limit: parseInt(limit),
            category: category,
            level: level,
            keyword: keyword,
            isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined
        };
        const result = await sensitiveWordService.getSensitiveWords(filters);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * 添加敏感词
 */
router.post('/', async (req, res, next) => {
    try {
        const wordData = req.body;
        wordData.createdBy = req.user?.id;
        const result = await sensitiveWordService.addSensitiveWord(wordData);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * 更新敏感词
 */
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const result = await sensitiveWordService.updateSensitiveWord(id, updateData);
        if (!result) {
            throw new errorHandler_1.ApiError(404, '敏感词不存在');
        }
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * 删除敏感词
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await sensitiveWordService.deleteSensitiveWord(id);
        if (!result) {
            throw new errorHandler_1.ApiError(404, '敏感词不存在');
        }
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
});
/**
 * 批量导入敏感词
 */
router.post('/import', upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file) {
            throw new errorHandler_1.ApiError(400, '请选择要导入的文件');
        }
        const { category, level = 'medium' } = req.body;
        const result = await sensitiveWordService.importSensitiveWords(req.file.path, {
            category,
            level: level,
            createdBy: req.user?.id
        });
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * 导出敏感词
 */
router.get('/export', async (req, res, next) => {
    try {
        const { category, level } = req.query;
        const filters = {
            category: category,
            level: level
        };
        const csvData = await sensitiveWordService.exportSensitiveWords(filters);
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="sensitive-words.csv"');
        res.send(csvData);
    }
    catch (error) {
        next(error);
    }
});
/**
 * 清除敏感词缓存
 */
router.post('/clear-cache', async (req, res, next) => {
    try {
        await sensitiveWordService.clearCache();
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
});
/**
 * 检测文本中的敏感词
 */
router.post('/check', async (req, res, next) => {
    try {
        const { text } = req.body;
        if (!text) {
            throw new errorHandler_1.ApiError(400, '请提供要检测的文本');
        }
        const result = await sensitiveWordService.checkText(text);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * 获取敏感词分类
 */
router.get('/categories', async (req, res, next) => {
    try {
        const categories = await sensitiveWordService.getCategories();
        res.json(categories);
    }
    catch (error) {
        next(error);
    }
});
/**
 * 添加敏感词分类
 */
router.post('/categories', async (req, res, next) => {
    try {
        const categoryData = req.body;
        categoryData.createdBy = req.user?.id;
        const result = await sensitiveWordService.addCategory(categoryData);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * 更新敏感词分类
 */
router.put('/categories/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const result = await sensitiveWordService.updateCategory(id, updateData);
        if (!result) {
            throw new errorHandler_1.ApiError(404, '分类不存在');
        }
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * 删除敏感词分类
 */
router.delete('/categories/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await sensitiveWordService.deleteCategory(id);
        if (!result) {
            throw new errorHandler_1.ApiError(404, '分类不存在');
        }
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
});
/**
 * 获取敏感词库列表
 */
router.get('/libraries', async (req, res, next) => {
    try {
        const { page = 1, limit = 10, keyword, level, mode } = req.query;
        const filters = {
            page: parseInt(page),
            limit: parseInt(limit),
            keyword: keyword,
            level: level,
            mode: mode
        };
        const result = await sensitiveWordService.getLibraries(filters);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * 上传敏感词库
 */
router.post('/libraries', upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file) {
            throw new errorHandler_1.ApiError(400, '请选择要上传的文件');
        }
        const libraryData = req.body;
        libraryData.uploadUser = req.user?.id;
        libraryData.createdBy = req.user?.id;
        const result = await sensitiveWordService.uploadLibrary(req.file, libraryData);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * 更新敏感词库
 */
router.put('/libraries/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const result = await sensitiveWordService.updateLibrary(id, updateData);
        if (!result) {
            throw new errorHandler_1.ApiError(404, '词库不存在');
        }
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * 删除敏感词库
 */
router.delete('/libraries/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await sensitiveWordService.deleteLibrary(id);
        if (!result) {
            throw new errorHandler_1.ApiError(404, '词库不存在');
        }
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
});
/**
 * 获取敏感词配置
 */
router.get('/config', async (req, res, next) => {
    try {
        const config = await sensitiveWordService.getConfig();
        res.json(config);
    }
    catch (error) {
        next(error);
    }
});
/**
 * 更新敏感词配置
 */
router.put('/config', async (req, res, next) => {
    try {
        const configData = req.body;
        const result = await sensitiveWordService.updateConfig(configData);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * 获取检测日志
 */
router.get('/detection-logs', async (req, res, next) => {
    try {
        const { page = 1, limit = 10, userId, startDate, endDate, action } = req.query;
        const filters = {
            page: parseInt(page),
            limit: parseInt(limit),
            userId: userId,
            startDate: startDate,
            endDate: endDate,
            action: action
        };
        const result = await sensitiveWordService.getDetectionLogs(filters);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
