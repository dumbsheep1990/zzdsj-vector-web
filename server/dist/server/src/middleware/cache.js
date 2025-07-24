"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheMiddleware = void 0;
const logger_1 = require("../utils/logger");
// 简单的内存缓存实现
// 注意：在生产环境中应该使用Redis等分布式缓存
class MemoryCache {
    constructor() {
        this.cache = {};
    }
    set(key, data, ttl) {
        this.cache[key] = {
            data,
            expiry: Date.now() + ttl
        };
    }
    get(key) {
        const item = this.cache[key];
        if (!item) {
            return null;
        }
        if (Date.now() > item.expiry) {
            delete this.cache[key];
            return null;
        }
        return item.data;
    }
    // 定期清理过期缓存
    startCleanup(interval) {
        setInterval(() => {
            const now = Date.now();
            for (const key in this.cache) {
                if (this.cache[key].expiry < now) {
                    delete this.cache[key];
                }
            }
        }, interval);
    }
}
// 创建缓存实例
const cache = new MemoryCache();
cache.startCleanup(60 * 1000); // 每分钟清理一次
// 缓存中间件
const cacheMiddleware = (options = {}) => {
    const { ttl = 5 * 60 * 1000, // 默认5分钟
    methods = ['GET'], // 默认只缓存GET请求
    keyGenerator = (req) => `${req.method}:${req.originalUrl}` // 默认使用方法+URL作为键
     } = options;
    return (req, res, next) => {
        // 只缓存指定的HTTP方法
        if (!methods.includes(req.method)) {
            return next();
        }
        // 生成缓存键
        const key = keyGenerator(req);
        // 检查缓存
        const cachedData = cache.get(key);
        if (cachedData) {
            logger_1.logger.debug(`缓存命中: ${key}`);
            return res.json(cachedData);
        }
        // 保存原始的JSON方法
        const originalJson = res.json;
        // 重写JSON方法以拦截响应
        res.json = function (data) {
            logger_1.logger.debug(`缓存数据: ${key}`);
            cache.set(key, data, ttl);
            // 恢复原始JSON方法的行为
            return originalJson.call(this, data);
        };
        next();
    };
};
exports.cacheMiddleware = cacheMiddleware;
