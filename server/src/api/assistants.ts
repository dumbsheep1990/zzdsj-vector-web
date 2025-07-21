// 助手API路由

import { Router } from 'express';
import { assistantService } from '../services/assistants';
import { logger } from '../utils/logger';
import {
  AssistantCreateRequest,
  AssistantUpdateRequest,
  AssistantTestRequest,
  AssistantFromTemplateRequest,
  AgentExecutionRequest,
  QASearchRequest
} from '../types/assistants';

const router = Router();

// 助手管理
router.get('/', async (req, res, next) => {
  try {
    const {
      category,
      capabilities,
      is_public,
      search,
      tags,
      page = 1,
      page_size = 20
    } = req.query;

    const params = {
      category: category as string,
      capabilities: capabilities ? (Array.isArray(capabilities) ? capabilities as string[] : [capabilities as string]) : undefined,
      is_public: is_public ? is_public === 'true' : undefined,
      search: search as string,
      tags: tags ? (Array.isArray(tags) ? tags as string[] : [tags as string]) : undefined,
      page: parseInt(page as string),
      page_size: parseInt(page_size as string)
    };

    const result = await assistantService.getAssistants(params);

    res.json({
      success: true,
      data: result,
      message: '获取助手列表成功'
    });
  } catch (error) {
    logger.error('Get assistants API error:', error);
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { include_config, include_knowledge_bases } = req.query;

    const options = {
      include_config: include_config === 'true',
      include_knowledge_bases: include_knowledge_bases === 'true'
    };

    const assistant = await assistantService.getAssistantById(parseInt(id), options);

    res.json({
      success: true,
      data: assistant,
      message: '获取助手信息成功'
    });
  } catch (error) {
    logger.error('Get assistant by ID API error:', error);
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const assistantData: AssistantCreateRequest = req.body;

    // 基础验证
    if (!assistantData.name || !assistantData.model) {
      return res.status(400).json({
        success: false,
        error: '助手名称和模型不能为空'
      });
    }

    const result = await assistantService.createAssistant(assistantData);

    res.status(201).json({
      success: true,
      data: result,
      message: '创建助手成功'
    });
  } catch (error) {
    logger.error('Create assistant API error:', error);
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const assistantData: AssistantUpdateRequest = req.body;

    const result = await assistantService.updateAssistant(parseInt(id), assistantData);

    res.json({
      success: true,
      data: result,
      message: '更新助手成功'
    });
  } catch (error) {
    logger.error('Update assistant API error:', error);
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    await assistantService.deleteAssistant(parseInt(id));

    res.json({
      success: true,
      message: '删除助手成功'
    });
  } catch (error) {
    logger.error('Delete assistant API error:', error);
    next(error);
  }
});

// 助手测试
router.post('/:id/test', async (req, res, next) => {
  try {
    const { id } = req.params;
    const testData: AssistantTestRequest = req.body;

    if (!testData.message) {
      return res.status(400).json({
        success: false,
        error: '测试消息不能为空'
      });
    }

    const result = await assistantService.testAssistant(parseInt(id), testData);

    res.json({
      success: true,
      data: result,
      message: '助手测试成功'
    });
  } catch (error) {
    logger.error('Test assistant API error:', error);
    next(error);
  }
});

export default router; 