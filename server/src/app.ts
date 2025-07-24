import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import { logger } from './utils/logger';

// 导入中间件
import { apiKeyAuth, userAuth } from './middleware/auth';
import { errorHandler, notFoundHandler, ApiError } from './middleware/errorHandler';
import { rateLimit } from './middleware/rateLimit';
import { cacheMiddleware } from './middleware/cache';

// 环境变量配置
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// 导入API路由
import knowledgeRoutes from './api/knowledge';
import vectorRoutes from './api/vector';
import modelRoutes from './api/model';
import qaRoutes from './api/qa';
import authRoutes from './api/auth';
import assistantRoutes from './api/assistants';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = process.env.HOST || '0.0.0.0'; // 明确指定IPv4地址
const isDev = process.env.NODE_ENV !== 'production';

// 基础中间件配置
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 请求日志
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl} ${req.ip}`);
  next();
});

// 速率限制 - 全局限制 (每分钟100个请求)
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: isDev ? 0 : 100, // 开发环境禁用限制
  message: '请求过于频繁，请稍后再试'
}));

// API认证
app.use('/api', apiKeyAuth);

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
app.use('/api/auth', authRoutes); // 认证接口不使用缓存
app.use('/api/assistants', cacheMiddleware({ ttl: 5 * 60 * 1000 }), assistantRoutes);
app.use('/api/knowledge', cacheMiddleware({ ttl: 5 * 60 * 1000 }), knowledgeRoutes);
app.use('/api/vector', cacheMiddleware({ ttl: 5 * 60 * 1000 }), vectorRoutes);
app.use('/api/model', cacheMiddleware({ ttl: 10 * 60 * 1000 }), modelRoutes);
app.use('/api/qa', cacheMiddleware({ ttl: 2 * 60 * 1000 }), qaRoutes);

// 404处理 - 必须在所有路由之后
app.use(notFoundHandler);

// 错误处理中间件 - 必须在最后
app.use(errorHandler);

// 未捕获的异常处理
process.on('uncaughtException', (error) => {
  logger.error('未捕获的异常:', error);
  if (process.env.NODE_ENV === 'production') {
    // 在生产环境中，优雅地关闭应用
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason) => {
  logger.error('未处理的Promise拒绝:', reason);
});

// 启动服务器
if (require.main === module) {
  const server = app.listen(PORT, HOST, () => {
    logger.info(`服务运行在 http://${HOST}:${PORT}, 环境: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`监听地址: ${HOST} (IPv4), 端口: ${PORT}`);
  });

  // 优雅关闭
  const shutdown = () => {
    logger.info('接收到关闭信号，优雅关闭中...');
    server.close(() => {
      logger.info('HTTP服务器已关闭');
      process.exit(0);
    });
    
    // 如果10秒内没有关闭，则强制退出
    setTimeout(() => {
      logger.error('强制关闭 - 无法在时间限制内完成优雅关闭');
      process.exit(1);
    }, 10000);
  };

  // 监听终止信号
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

export default app;
