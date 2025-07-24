"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = exports.ApiError = void 0;
const logger_1 = require("../utils/logger");
// 自定义API错误类
class ApiError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
    }
}
exports.ApiError = ApiError;
// 统一错误处理中间件
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || '服务器内部错误';
    // 记录错误信息
    logger_1.logger.error(`[${statusCode}] ${req.method} ${req.path}: ${message}`);
    if (err.stack && process.env.NODE_ENV !== 'production') {
        logger_1.logger.error(err.stack);
    }
    // 在生产环境中隐藏详细错误信息
    const responseMessage = process.env.NODE_ENV === 'production' && statusCode === 500
        ? '服务器内部错误，请稍后再试'
        : message;
    res.status(statusCode).json({
        error: true,
        message: responseMessage,
        path: req.path,
        timestamp: new Date().toISOString(),
        // 在开发环境显示堆栈信息
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
};
exports.errorHandler = errorHandler;
// 未找到路由处理中间件
const notFoundHandler = (req, res, next) => {
    logger_1.logger.warn(`未找到路由: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        error: true,
        message: '未找到请求的资源',
        path: req.originalUrl
    });
};
exports.notFoundHandler = notFoundHandler;
