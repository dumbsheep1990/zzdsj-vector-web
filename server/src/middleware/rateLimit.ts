import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// 简单的内存存储实现
// 注意：在生产环境中应该使用Redis等分布式存储
class MemoryStore {
  private store: Record<string, { count: number; resetTime: number }> = {};
  
  increment(key: string, windowMs: number): number {
    const now = Date.now();
    
    if (!this.store[key] || now > this.store[key].resetTime) {
      this.store[key] = {
        count: 1,
        resetTime: now + windowMs
      };
      return 1;
    }
    
    this.store[key].count += 1;
    return this.store[key].count;
  }
  
  // 定期清理过期数据
  startCleanup(interval: number) {
    setInterval(() => {
      const now = Date.now();
      for (const key in this.store) {
        if (this.store[key].resetTime < now) {
          delete this.store[key];
        }
      }
    }, interval);
  }
}

// 速率限制选项
interface RateLimitOptions {
  windowMs?: number;      // 时间窗口（毫秒）
  max?: number;           // 最大请求数
  message?: string;       // 限制消息
  statusCode?: number;    // 响应状态码
  keyGenerator?: (req: Request) => string; // 密钥生成器
}

// 速率限制中间件
export const rateLimit = (options: RateLimitOptions = {}) => {
  const {
    windowMs = 60 * 1000, // 默认1分钟
    max = 60,             // 默认每分钟60次请求
    message = '请求过于频繁，请稍后再试',
    statusCode = 429,     // 默认429 Too Many Requests
    keyGenerator = (req) => req.ip || 'unknown' // 默认使用IP作为键
  } = options;
  
  const store = new MemoryStore();
  store.startCleanup(windowMs);
  
  return (req: Request, res: Response, next: NextFunction) => {
    // 跳过开发环境的速率限制
    if (process.env.NODE_ENV === 'development') {
      return next();
    }
    
    const key = keyGenerator(req);
    const requests = store.increment(key, windowMs);
    
    if (requests > max) {
      logger.warn(`API速率限制超出: ${key}, ${req.method} ${req.originalUrl}`);
      return res.status(statusCode).json({
        error: true,
        message,
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
    
    next();
  };
};
