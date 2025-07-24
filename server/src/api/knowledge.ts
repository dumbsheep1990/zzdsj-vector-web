import { Router } from 'express';
import { knowledgeService } from '../services/knowledge';
import { logger } from '../utils/logger';

const router = Router();

// 获取知识库列表
router.get('/', async (req, res, next) => {
  try {
    const data = await knowledgeService.getKnowledgeBases();
    res.json(data);
  } catch (error) {
    logger.error('获取知识库列表失败:', error);
    next(error);
  }
});

// 获取单个知识库详情
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await knowledgeService.getKnowledgeBaseById(id);
    
    if (!data) {
      return res.status(404).json({ error: '未找到指定知识库' });
    }
    
    res.json(data);
  } catch (error) {
    logger.error(`获取知识库详情失败 ID: ${req.params.id}:`, error);
    next(error);
  }
});

// 创建新知识库
router.post('/', async (req, res, next) => {
  try {
    const newKnowledgeBase = req.body;
    const data = await knowledgeService.createKnowledgeBase(newKnowledgeBase);
    res.status(201).json(data);
  } catch (error) {
    logger.error('创建知识库失败:', error);
    next(error);
  }
});

// 更新知识库
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const knowledgeBase = req.body;
    const data = await knowledgeService.updateKnowledgeBase(id, knowledgeBase);
    
    if (!data) {
      return res.status(404).json({ error: '未找到指定知识库' });
    }
    
    res.json(data);
  } catch (error) {
    logger.error(`更新知识库失败 ID: ${req.params.id}:`, error);
    next(error);
  }
});

// 删除知识库
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await knowledgeService.deleteKnowledgeBase(id);
    res.status(204).end();
  } catch (error) {
    logger.error(`删除知识库失败 ID: ${req.params.id}:`, error);
    next(error);
  }
});

// 获取知识库中的文件列表
router.get('/:id/files', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await knowledgeService.getDocuments(id);
    res.json(data);
  } catch (error) {
    logger.error(`获取知识库文件列表失败 ID: ${req.params.id}:`, error);
    next(error);
  }
});

export default router;
