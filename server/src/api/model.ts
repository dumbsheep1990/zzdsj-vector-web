import { Router } from 'express';
import { modelService } from '../services/model';
import { logger } from '../utils/logger';

const router = Router();

// 获取所有模型提供商列表
router.get('/providers', async (req, res, next) => {
  try {
    const data = await modelService.getModelProviders();
    res.json(data);
  } catch (error) {
    logger.error('获取模型提供商列表失败:', error);
    next(error);
  }
});

// 获取特定提供商的详情
router.get('/providers/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await modelService.getModelProviderById(id);
    
    if (!data) {
      return res.status(404).json({ error: '未找到指定模型提供商' });
    }
    
    res.json(data);
  } catch (error) {
    logger.error(`获取模型提供商详情失败 ID: ${req.params.id}:`, error);
    next(error);
  }
});

// 更新模型提供商配置
router.put('/providers/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const provider = req.body;
    const data = await modelService.updateModelProvider(id, provider);
    
    if (!data) {
      return res.status(404).json({ error: '未找到指定模型提供商' });
    }
    
    res.json(data);
  } catch (error) {
    logger.error(`更新模型提供商失败 ID: ${req.params.id}:`, error);
    next(error);
  }
});

// 获取所有模型列表
router.get('/', async (req, res, next) => {
  try {
    const data = await modelService.getModels();
    res.json(data);
  } catch (error) {
    logger.error('获取模型列表失败:', error);
    next(error);
  }
});

// 获取特定模型详情
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await modelService.getModelById(id);
    
    if (!data) {
      return res.status(404).json({ error: '未找到指定模型' });
    }
    
    res.json(data);
  } catch (error) {
    logger.error(`获取模型详情失败 ID: ${req.params.id}:`, error);
    next(error);
  }
});

// 更新模型配置
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const model = req.body;
    const data = await modelService.updateModel(id, model);
    
    if (!data) {
      return res.status(404).json({ error: '未找到指定模型' });
    }
    
    res.json(data);
  } catch (error) {
    logger.error(`更新模型失败 ID: ${req.params.id}:`, error);
    next(error);
  }
});

// 模型测试接口
router.post('/test', async (req, res, next) => {
  try {
    const { modelId, prompt } = req.body;
    const result = await modelService.testModel(modelId, prompt);
    res.json(result);
  } catch (error) {
    logger.error('模型测试失败:', error);
    next(error);
  }
});

export default router;
