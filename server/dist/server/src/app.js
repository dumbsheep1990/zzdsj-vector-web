"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("./utils/logger");
// 导入中间件
const auth_1 = require("./middleware/auth");
const errorHandler_1 = require("./middleware/errorHandler");
const rateLimit_1 = require("./middleware/rateLimit");
const cache_1 = require("./middleware/cache");
// 环境变量配置
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
// 导入API路由
const knowledge_1 = __importDefault(require("./api/knowledge"));
const vector_1 = __importDefault(require("./api/vector"));
const model_1 = __importDefault(require("./api/model"));
const qa_1 = __importDefault(require("./api/qa"));
const auth_2 = __importDefault(require("./api/auth"));
const assistants_1 = __importDefault(require("./api/assistants"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0'; // 明确指定IPv4地址
const isDev = process.env.NODE_ENV !== 'production';
// 基础中间件配置
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// 请求日志
app.use((req, res, next) => {
    logger_1.logger.info(`${req.method} ${req.originalUrl} ${req.ip}`);
    next();
});
// 速率限制 - 全局限制 (每分钟100个请求)
app.use((0, rateLimit_1.rateLimit)({
    windowMs: 60 * 1000,
    max: isDev ? 0 : 100, // 开发环境禁用限制
    message: '请求过于频繁，请稍后再试'
}));
// API认证
app.use('/api', auth_1.apiKeyAuth);
// 路由定义
// 健康检查端点 (无需认证)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '0.1.0',
        environment: process.env.NODE_ENV || 'development'
    });
});
// API路由 (使用缓存中间件)
app.use('/api/auth', auth_2.default); // 认证接口不使用缓存
app.use('/api/assistants', (0, cache_1.cacheMiddleware)({ ttl: 5 * 60 * 1000 }), assistants_1.default);
app.use('/api/knowledge', (0, cache_1.cacheMiddleware)({ ttl: 5 * 60 * 1000 }), knowledge_1.default);
app.use('/api/vector', (0, cache_1.cacheMiddleware)({ ttl: 5 * 60 * 1000 }), vector_1.default);
app.use('/api/model', (0, cache_1.cacheMiddleware)({ ttl: 10 * 60 * 1000 }), model_1.default);
app.use('/api/qa', (0, cache_1.cacheMiddleware)({ ttl: 2 * 60 * 1000 }), qa_1.default);
// 404处理 - 必须在所有路由之后
app.use(errorHandler_1.notFoundHandler);
// 错误处理中间件 - 必须在最后
app.use(errorHandler_1.errorHandler);
// 未捕获的异常处理
process.on('uncaughtException', (error) => {
    logger_1.logger.error('未捕获的异常:', error);
    if (process.env.NODE_ENV === 'production') {
        // 在生产环境中，优雅地关闭应用
        process.exit(1);
    }
});
process.on('unhandledRejection', (reason) => {
    logger_1.logger.error('未处理的Promise拒绝:', reason);
});
// 启动服务器
if (require.main === module) {
    const server = app.listen(PORT, HOST, () => {
        logger_1.logger.info(`服务运行在 http://${HOST}:${PORT}, 环境: ${process.env.NODE_ENV || 'development'}`);
        logger_1.logger.info(`监听地址: ${HOST} (IPv4), 端口: ${PORT}`);
    });
    // 优雅关闭
    const shutdown = () => {
        logger_1.logger.info('接收到关闭信号，优雅关闭中...');
        server.close(() => {
            logger_1.logger.info('HTTP服务器已关闭');
            process.exit(0);
        });
        // 如果10秒内没有关闭，则强制退出
        setTimeout(() => {
            logger_1.logger.error('强制关闭 - 无法在时间限制内完成优雅关闭');
            process.exit(1);
        }, 10000);
    };
    // 监听终止信号
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
}
exports.default = app;
