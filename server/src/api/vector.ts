import { Router } from 'express';
import { vectorService } from '../services/vector';
import { logger } from '../utils/logger';

const router = Router();

// 获取向量列表
router.get('/', async (req, res, next) => {
  try {
    const data = await vectorService.getVectors();
    res.json(data);
  } catch (error) {
    logger.error('获取向量列表失败:', error);
    next(error);
  }
});

// 获取单个向量详情
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await vectorService.getVectorById(id);
    
    if (!data) {
      return res.status(404).json({ error: '未找到指定向量' });
    }
    
    res.json(data);
  } catch (error) {
    logger.error(`获取向量详情失败 ID: ${req.params.id}:`, error);
    next(error);
  }
});

// 向量搜索
router.post('/search', async (req, res, next) => {
  try {
    const searchParams = req.body;
    const results = await vectorService.searchVectors(searchParams);
    res.json(results);
  } catch (error) {
    logger.error('向量搜索失败:', error);
    next(error);
  }
});

// 创建新向量
router.post('/', async (req, res, next) => {
  try {
    const newVector = req.body;
    const data = await vectorService.createVector(newVector);
    res.status(201).json(data);
  } catch (error) {
    logger.error('创建向量失败:', error);
    next(error);
  }
});

// 更新向量
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const vector = req.body;
    const data = await vectorService.updateVector(id, vector);
    
    if (!data) {
      return res.status(404).json({ error: '未找到指定向量' });
    }
    
    res.json(data);
  } catch (error) {
    logger.error(`更新向量失败 ID: ${req.params.id}:`, error);
    next(error);
  }
});

// 删除向量
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const success = await vectorService.deleteVector(id);
    
    if (!success) {
      return res.status(404).json({ error: '未找到指定向量' });
    }
    
    res.status(204).end();
  } catch (error) {
    logger.error(`删除向量失败 ID: ${req.params.id}:`, error);
    next(error);
  }
});

export default router;
