import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// 简单的API密钥认证中间件
export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  // 开发环境或模拟数据模式下跳过认证
  if (process.env.NODE_ENV === 'development' || process.env.USE_MOCK_DATA === 'true') {
    return next();
  }

  const apiKey = req.headers['x-api-key'] as string;
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    logger.warn(`API密钥认证失败: ${req.ip}, ${req.originalUrl}`);
    return res.status(401).json({ error: '无效的API密钥' });
  }
  
  next();
};

// 模拟基本用户认证（实际项目中可以使用JWT等更安全的方式）
export const userAuth = (req: Request, res: Response, next: NextFunction) => {
  // 开发环境或模拟数据模式下模拟用户
  if (process.env.NODE_ENV === 'development' || process.env.USE_MOCK_DATA === 'true') {
    req.user = { id: 'dev-user', name: '开发用户', role: 'admin' };
    return next();
  }

  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn(`用户认证失败, 缺少令牌: ${req.ip}, ${req.originalUrl}`);
    return res.status(401).json({ error: '未提供认证令牌' });
  }
  
  // 这里应该有真正的token验证逻辑
  // 模拟成功认证
  req.user = { id: 'user-1', name: '用户1', role: 'user' };
  next();
};

// 类型扩展
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        role: string;
      };
    }
  }
}
