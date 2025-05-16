import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// 自定义API错误类
export class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

// 统一错误处理中间件
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = (err as ApiError).statusCode || 500;
  const message = err.message || '服务器内部错误';
  
  // 记录错误信息
  logger.error(`[${statusCode}] ${req.method} ${req.path}: ${message}`);
  
  if (err.stack && process.env.NODE_ENV !== 'production') {
    logger.error(err.stack);
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

// 未找到路由处理中间件
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  logger.warn(`未找到路由: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: true,
    message: '未找到请求的资源',
    path: req.originalUrl
  });
};
