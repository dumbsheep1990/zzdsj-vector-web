import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
import { 
  PromptTemplate, 
  PromptCategory, 
  PromptAssistantBinding, 
  PromptVariable,
  PromptExample
} from '../../../shared/types/prompt-template';

// 内部使用的服务端类型扩展
interface ServerPromptTemplate {
  id: string;
  name: string;                // 对应前端的 title
  content: string;
  description?: string;
  category_id: string;         // 对应前端的 category
  tags: string[];
  created_at: string;          // 对应前端的 createdAt
  updated_at: string;          // 对应前端的 updatedAt
  is_public?: boolean;         // 对应前端的 isPublic
  created_by?: string;         // 对应前端的 author
  version?: string;
  usage_count?: number;        // 对应前端的 usageCount
  variables?: PromptVariable[];
  examples?: PromptExample[];
}

interface ServerPromptCategory {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;          // 服务端特有
  created_at: string;          // 对应前端的 createdAt
  updated_at: string;          // 对应前端的 updatedAt
  template_count: number;      // 对应前端的 count
}

interface ServerPromptBinding {
  id: string;                  // 服务端特有
  prompt_id: string;           // 对应前端的 promptId
  assistant_id: string;        // 对应前端的 assistantId
  created_by?: string;         // 对应前端的 createdBy
  position: 'system' | 'user' | 'assistant';  // 服务端特有
  order: number;               // 服务端特有
  created_at: string;          // 对应前端的 createdAt
  updated_at: string;          // 服务端特有
  is_active?: boolean;         // 对应前端的 isActive
}

// 类型转换函数 - 服务端到前端共享类型
function toSharedPromptTemplate(template: ServerPromptTemplate): PromptTemplate {
  return {
    id: template.id,
    title: template.name,
    content: template.content,
    category: template.category_id,
    tags: template.tags || [],
    createdAt: template.created_at,
    updatedAt: template.updated_at,
    isBound: false, // 默认值，需要在调用时设置
    description: template.description,
    isPublic: template.is_public,
    author: template.created_by,
    version: template.version,
    variables: template.variables,
    examples: template.examples,
    usageCount: template.usage_count
  };
}

// 类型转换函数 - 前端共享类型到服务端
function toServerPromptTemplate(template: PromptTemplate): ServerPromptTemplate {
  return {
    id: template.id,
    name: template.title,
    content: template.content,
    category_id: template.category,
    tags: template.tags,
    created_at: template.createdAt,
    updated_at: template.updatedAt,
    is_public: template.isPublic,
    created_by: template.author,
    version: template.version,
    usage_count: template.usageCount,
    variables: template.variables,
    examples: template.examples,
    description: template.description
  };
}

// 类型转换函数 - 服务端到前端共享类型
function toSharedPromptCategory(category: ServerPromptCategory): PromptCategory {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    count: category.template_count
    // 移除 createdAt 和 updatedAt，因为 PromptCategory 类型中不存在这些字段
  };
}

// 类型转换函数 - 前端共享类型到服务端
function toServerPromptCategory(category: PromptCategory): ServerPromptCategory {
  const now = new Date().toISOString();
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    template_count: category.count,
    created_at: now,
    updated_at: now
  };
}

// 类型转换函数 - 服务端到前端共享类型
function toSharedPromptBinding(binding: ServerPromptBinding): PromptAssistantBinding {
  return {
    promptId: binding.prompt_id,
    assistantId: binding.assistant_id,
    createdAt: binding.created_at,
    createdBy: binding.created_by,
    isActive: binding.is_active || true
  };
}

// 类型转换函数 - 前端共享类型到服务端
function toServerPromptBinding(binding: PromptAssistantBinding): ServerPromptBinding {
  return {
    id: uuidv4(), // 新建绑定时生成ID
    prompt_id: binding.promptId,
    assistant_id: binding.assistantId,
    created_at: binding.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: binding.createdBy,
    is_active: binding.isActive,
    position: 'system', // 默认值
    order: 0 // 默认值
  };
}

// 模拟服务端提示模板分类数据
const mockServerPromptCategories: ServerPromptCategory[] = [
  {
    id: '1',
    name: '通用',
    description: '适用于各种场景的通用提示模板',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    template_count: 3
  },
  {
    id: '2',
    name: '写作',
    description: '辅助写作的提示模板',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    template_count: 2
  },
  {
    id: '3',
    name: '编程',
    description: '编程和代码相关的提示模板',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    template_count: 2
  }
];

// 前端可用的模拟提示模板分类数据
const mockPromptCategories: PromptCategory[] = mockServerPromptCategories.map(category => toSharedPromptCategory(category));

// 模拟服务端提示模板数据
const mockServerPromptTemplates: ServerPromptTemplate[] = [
  {
    id: '1',
    name: '通用知识问答',
    description: '用于一般知识问答的提示模板',
    content: '请回答以下问题，尽可能提供准确、全面且简洁的回答：\n\n{{question}}',
    category_id: '1',
    tags: ['知识问答', '通用'],
    is_public: true,
    created_by: '1',
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z',
    usage_count: 145
  },
  {
    id: '2',
    name: '内容摘要',
    description: '将长文本内容转化为简洁的摘要',
    content: '请将以下内容概括为简洁、清晰、完整的摘要，保留关键信息：\n\n{{content}}',
    category_id: '1',
    tags: ['摘要', '压缩信息'],
    is_public: true,
    created_by: '1',
    created_at: '2024-01-06T00:00:00Z',
    updated_at: '2024-01-06T00:00:00Z',
    usage_count: 89
  },
  {
    id: '3',
    name: '多角度分析',
    description: '从不同角度分析问题或话题',
    content: '请从以下几个不同角度分析这个话题/问题：\n\n{{topic}}\n\n分析角度：\n1. 历史背景\n2. 现代意义\n3. 争议之处\n4. 未来发展\n5. 个人见解',
    category_id: '1',
    tags: ['分析', '多角度'],
    is_public: true,
    created_by: '1',
    created_at: '2024-01-07T00:00:00Z',
    updated_at: '2024-01-07T00:00:00Z',
    usage_count: 56
  },
  {
    id: '4',
    name: '文章结构优化',
    description: '重组文章结构使其更加清晰、逻辑',
    content: '请帮我改进以下文章的结构和逻辑，使其更加清晰、连贯，但保留原始内容的主要观点：\n\n{{article}}',
    category_id: '2',
    tags: ['写作', '结构优化'],
    is_public: true,
    created_by: '1',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
    usage_count: 37
  },
  {
    id: '5',
    name: '学术写作',
    description: '学术论文写作辅助模板',
    content: '请以学术论文的风格和结构，详细阐述以下主题：\n\n{{topic}}\n\n要求：\n1. 包含引言、方法、结果、讨论、结论等部分\n2. 使用学术性语言\n3. 提供合理的论据和证据\n4. 避免情感化表达',
    category_id: '2',
    tags: ['学术', '论文'],
    is_public: true,
    created_by: '1',
    created_at: '2024-01-12T00:00:00Z',
    updated_at: '2024-01-12T00:00:00Z',
    usage_count: 42
  },
  {
    id: '6',
    name: '代码解释',
    description: '解释复杂代码的功能和实现原理',
    content: '请详细解释以下代码的功能、实现原理和执行过程，如有优化建议也请指出：\n\n```\n{{code}}\n```',
    category_id: '3',
    tags: ['编程', '代码解释'],
    is_public: true,
    created_by: '1',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    usage_count: 78
  },
  {
    id: '7',
    name: '算法设计',
    description: '设计算法解决特定问题',
    content: '请设计一个高效的算法来解决以下问题，并分析其时间和空间复杂度：\n\n{{problem}}',
    category_id: '3',
    tags: ['编程', '算法'],
    is_public: true,
    created_by: '1',
    created_at: '2024-01-18T00:00:00Z',
    updated_at: '2024-01-18T00:00:00Z',
    usage_count: 63
  }
];

// 前端可用的模拟提示模板数据
const mockPromptTemplates: PromptTemplate[] = mockServerPromptTemplates.map(template => toSharedPromptTemplate(template));

// 模拟服务端提示模板绑定数据
const mockServerPromptBindings: ServerPromptBinding[] = [
  {
    id: '1',
    prompt_id: '1',
    assistant_id: 'ast1',
    position: 'system',
    order: 0,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
    is_active: true
  },
  {
    id: '2',
    prompt_id: '3',
    assistant_id: 'ast1',
    position: 'user',
    order: 1,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
    is_active: true
  }
];

// 前端可用的模拟提示模板绑定数据
const mockPromptBindings: PromptAssistantBinding[] = mockServerPromptBindings.map(binding => toSharedPromptBinding(binding));

class PromptTemplateService {
  private apiUrl: string;
  private useMock: boolean;
  
  constructor() {
    this.apiUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';
    this.useMock = process.env.USE_MOCK_DATA === 'true';
  }
  
  /**
   * 获取提示模板列表
   */
  async getPromptTemplates(
    filters: {
      categoryId?: string;
      createdBy?: string;
      isPublic?: boolean;
      tags?: string[];
      search?: string;
    } = {}
  ): Promise<PromptTemplate[]> {
    if (this.useMock) {
      logger.info('使用模拟数据获取提示模板列表');
      
      // 使用服务端模拟数据
      let filteredTemplates = [...mockServerPromptTemplates];
      
      // 应用过滤条件
      if (filters.categoryId) {
        filteredTemplates = filteredTemplates.filter(t => t.category_id === filters.categoryId);
      }
      
      if (filters.createdBy) {
        filteredTemplates = filteredTemplates.filter(t => t.created_by === filters.createdBy);
      }
      
      if (filters.isPublic !== undefined) {
        filteredTemplates = filteredTemplates.filter(t => t.is_public === filters.isPublic);
      }
      
      if (filters.tags && filters.tags.length > 0) {
        filteredTemplates = filteredTemplates.filter(t => 
          filters.tags!.some(tag => t.tags.includes(tag))
        );
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredTemplates = filteredTemplates.filter(t => 
          t.name.toLowerCase().includes(searchLower) || 
          (t.description && t.description.toLowerCase().includes(searchLower)) ||
          t.content.toLowerCase().includes(searchLower)
        );
      }
      
      // 检查每个模板是否已绑定，并转换为前端共享类型
      return filteredTemplates.map(template => {
        const bindings = mockServerPromptBindings.filter(b => b.prompt_id === template.id);
        const sharedTemplate = toSharedPromptTemplate(template);
        
        return {
          ...sharedTemplate,
          isBound: bindings.length > 0,
          assistantIds: bindings.map(b => b.assistant_id)
        };
      });
    }
    
    try {
      logger.info('从后端API获取提示模板列表');
      
      // 构建查询参数
      const params = new URLSearchParams();
      if (filters.categoryId) params.append('category_id', filters.categoryId);
      if (filters.createdBy) params.append('created_by', filters.createdBy);
      if (filters.isPublic !== undefined) params.append('is_public', String(filters.isPublic));
      if (filters.tags && filters.tags.length > 0) {
        filters.tags.forEach(tag => params.append('tags', tag));
      }
      if (filters.search) params.append('search', filters.search);
      
      const response = await axios.get<ServerPromptTemplate[]>(
        `${this.apiUrl}/api/prompt-templates?${params.toString()}`
      );
      
      // 将服务端类型转换为前端共享类型
      return response.data.map(template => {
        const sharedTemplate = toSharedPromptTemplate(template);
        // 在这里我们不知道是否绑定，需要单独查询或从后端获取该信息
        return {
          ...sharedTemplate,
          isBound: false // 默认值，可能需要单独查询
        };
      });
    } catch (error) {
      logger.error('获取提示模板列表失败:', error);
      throw new Error('获取提示模板列表失败');
    }
  }
  
  /**
   * 获取提示模板详情
   */
  async getPromptTemplateById(id: string): Promise<PromptTemplate | null> {
    if (this.useMock) {
      logger.info(`使用模拟数据获取提示模板详情, ID: ${id}`);
      
      const template = mockServerPromptTemplates.find(t => t.id === id);
      if (!template) {
        return null;
      }
      
      // 转换为前端共享类型
      const sharedTemplate = toSharedPromptTemplate(template);
      
      // 检查是否已绑定
      const bindings = mockServerPromptBindings.filter(b => b.prompt_id === id);
      
      return {
        ...sharedTemplate,
        isBound: bindings.length > 0,
        assistantIds: bindings.map(b => b.assistant_id)
      };
    }
    
    try {
      logger.info(`从后端API获取提示模板详情, ID: ${id}`);
      const response = await axios.get<ServerPromptTemplate>(`${this.apiUrl}/api/prompt-templates/${id}`);
      
      // 转换为前端共享类型
      const sharedTemplate = toSharedPromptTemplate(response.data);
      
      // 需要单独获取绑定信息或从响应中解析
      return {
        ...sharedTemplate,
        isBound: false // 默认值，也可能需要单独查询
      };
    } catch (error) {
      logger.error(`获取提示模板详情失败, ID: ${id}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error(`获取提示模板详情失败: ${error}`);
    }
  }

  /**
   * 创建提示模板
   */
  async createPromptTemplate(
    template: Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'isBound' | 'assistantIds'>
  ): Promise<PromptTemplate> {
    if (this.useMock) {
      logger.info(`使用模拟数据创建提示模板, 名称: ${template.title}`);
      
      const now = new Date().toISOString();
      
      // 转换为服务端类型
      const serverTemplate: ServerPromptTemplate = toServerPromptTemplate({
        ...template,
        id: '',  // 会被后面生成的ID覆盖
        createdAt: '',
        updatedAt: '',
        usageCount: 0,
        isBound: false,
        assistantIds: []
      });
      
      // 创建新的服务端模板
      const newServerTemplate: ServerPromptTemplate = {
        ...serverTemplate,
        id: uuidv4(),
        created_at: now,
        updated_at: now,
        usage_count: 0
      };
      
      mockServerPromptTemplates.push(newServerTemplate);
      
      // 更新分类的模板计数
      const categoryIndex = mockServerPromptCategories.findIndex(c => c.id === newServerTemplate.category_id);
      if (categoryIndex !== -1) {
        mockServerPromptCategories[categoryIndex].template_count += 1;
      }
      
      // 转换回前端类型返回
      return toSharedPromptTemplate(newServerTemplate);
    }
    
    try {
      logger.info(`向后端API创建提示模板, 名称: ${template.title}`);
      
      // 转换为服务端类型
      const serverTemplate = toServerPromptTemplate({
        ...template,
        id: '',
        createdAt: '',
        updatedAt: '',
        usageCount: 0,
        isBound: false,
        assistantIds: []
      });
      
      const response = await axios.post<ServerPromptTemplate>(`${this.apiUrl}/api/prompt-templates`, serverTemplate);
      
      // 将服务端响应转换为前端类型
      return toSharedPromptTemplate(response.data);
    } catch (error) {
      logger.error(`创建提示模板失败:`, error);
      throw new Error(`创建提示模板失败: ${error}`);
    }
  }
  
  /**
   * 更新提示模板
   */
  async updatePromptTemplate(
    id: string, 
    template: Partial<PromptTemplate>
  ): Promise<PromptTemplate | null> {
    if (this.useMock) {
      logger.info(`使用模拟数据更新提示模板, ID: ${id}`);
      
      const index = mockServerPromptTemplates.findIndex(t => t.id === id);
      if (index === -1) {
        return null;
      }
      
      const now = new Date().toISOString();
      
      // 获取当前服务端模板
      const currentServerTemplate = mockServerPromptTemplates[index];
      
      // 检查是否更改了分类
      const oldCategoryId = currentServerTemplate.category_id;
      const newCategoryId = template.category ? template.category : oldCategoryId;
      
      // 创建新的前端模板，包含原有数据和更新
      const updatedSharedTemplate = {
        ...toSharedPromptTemplate(currentServerTemplate),
        ...template,
        updatedAt: now
      };
      
      // 转换回服务端模型
      const updatedServerTemplate = toServerPromptTemplate(updatedSharedTemplate);
      
      // 确俚ID和创建时间不变
      updatedServerTemplate.id = id;
      updatedServerTemplate.created_at = currentServerTemplate.created_at;
      
      // 更新模板
      mockServerPromptTemplates[index] = updatedServerTemplate;
      
      // 如果分类发生变化，更新计数
      if (newCategoryId !== oldCategoryId) {
        // 从旧分类中减去1
        const oldCategoryIndex = mockServerPromptCategories.findIndex(c => c.id === oldCategoryId);
        if (oldCategoryIndex !== -1) {
          mockServerPromptCategories[oldCategoryIndex].template_count -= 1;
        }
        
        // 为新分类添加1
        const newCategoryIndex = mockServerPromptCategories.findIndex(c => c.id === newCategoryId);
        if (newCategoryIndex !== -1) {
          mockServerPromptCategories[newCategoryIndex].template_count += 1;
        }
      }
      
      // 检查是否已绑定
      const bindings = mockServerPromptBindings.filter(b => b.prompt_id === id);
      
      // 返回转换后的前端类型
      const resultTemplate = toSharedPromptTemplate(mockServerPromptTemplates[index]);
      return {
        ...resultTemplate,
        isBound: bindings.length > 0,
        assistantIds: bindings.map(b => b.assistant_id)
      };
    }
    
    try {
      logger.info(`向后端API更新提示模板, ID: ${id}`);
      
      // 首先获取现有模板
      const currentResponse = await axios.get<ServerPromptTemplate>(`${this.apiUrl}/api/prompt-templates/${id}`);
      const currentServerTemplate = currentResponse.data;
      
      // 创建一个完整的前端模板对象
      const currentSharedTemplate = toSharedPromptTemplate(currentServerTemplate);
      const updatedSharedTemplate = {
        ...currentSharedTemplate,
        ...template
      };
      
      // 转换为服务端模型
      const serverTemplate = toServerPromptTemplate(updatedSharedTemplate);
      
      // 发送更新请求
      const response = await axios.put<ServerPromptTemplate>(
        `${this.apiUrl}/api/prompt-templates/${id}`, 
        serverTemplate
      );
      
      // 将响应转换为前端类型
      return toSharedPromptTemplate(response.data);
    } catch (error) {
      logger.error(`更新提示模板失败, ID: ${id}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error(`更新提示模板失败: ${error}`);
    }
  }
  
  /**
   * 删除提示模板
   */
  async deletePromptTemplate(id: string): Promise<boolean> {
    if (this.useMock) {
      logger.info(`使用模拟数据删除提示模板, ID: ${id}`);
      
      const index = mockServerPromptTemplates.findIndex(t => t.id === id);
      if (index === -1) {
        return false;
      }
      
      // 保存分类ID，以便更新计数
      const categoryId = mockServerPromptTemplates[index].category_id;
      
      // 删除提示模板
      mockServerPromptTemplates.splice(index, 1);
      
      // 更新分类的模板计数
      const categoryIndex = mockServerPromptCategories.findIndex(c => c.id === categoryId);
      if (categoryIndex !== -1) {
        mockServerPromptCategories[categoryIndex].template_count -= 1;
      }
      
      // 删除相关的绑定
      const bindingIndexes = mockServerPromptBindings
        .filter(binding => binding.prompt_id === id)
        .map(binding => mockServerPromptBindings.indexOf(binding));
      
      // 从后往前删除，避免索引问题
      for (let i = bindingIndexes.length - 1; i >= 0; i--) {
        mockServerPromptBindings.splice(bindingIndexes[i], 1);
      }
      
      return true;
    }
    
    try {
      logger.info(`向后端API删除提示模板, ID: ${id}`);
      await axios.delete(`${this.apiUrl}/api/prompt-templates/${id}`);
      return true;
    } catch (error) {
      logger.error(`删除提示模板失败, ID: ${id}:`, error);
      throw new Error(`删除提示模板失败: ${error}`);
    }
  }
  
  /**
   * 获取提示模板分类列表
   */
  async getPromptCategories(): Promise<PromptCategory[]> {
    if (this.useMock) {
      logger.info('使用模拟数据获取提示模板分类列表');
      // 将服务端模型转换为前端共享模型
      return mockServerPromptCategories.map(category => toSharedPromptCategory(category));
    }
    
    try {
      logger.info('从后端API获取提示模板分类列表');
      const response = await axios.get<PromptCategory[]>(`${this.apiUrl}/api/prompt-categories`);
      return response.data;
    } catch (error) {
      logger.error('获取提示模板分类列表失败:', error);
      throw new Error('获取提示模板分类列表失败');
    }
  }
  
  /**
   * 创建提示模板分类
   */
  async createPromptCategory(
    category: Omit<PromptCategory, 'id' | 'count'>
  ): Promise<PromptCategory> {
    if (this.useMock) {
      logger.info(`使用模拟数据创建提示模板分类, 名称: ${category.name}`);
      
      const now = new Date().toISOString();
      const id = uuidv4();
      
      // 创建服务端类型的分类对象
      const newServerCategory: ServerPromptCategory = {
        id: id,
        name: category.name,
        description: category.description,
        template_count: 0,
        created_at: now,
        updated_at: now
      };
      
      // 添加到服务端模型数组
      mockServerPromptCategories.push(newServerCategory);
      
      // 转换为前端共享类型并返回
      return toSharedPromptCategory(newServerCategory);
    }
    
    try {
      logger.info(`向后端API创建提示模板分类, 名称: ${category.name}`);
      const response = await axios.post<PromptCategory>(`${this.apiUrl}/api/prompt-categories`, category);
      return response.data;
    } catch (error) {
      logger.error(`创建提示模板分类失败:`, error);
      throw new Error(`创建提示模板分类失败: ${error}`);
    }
  }
  
  /**
   * 更新提示模板分类
   */
  async updatePromptCategory(
    id: string, 
    category: Partial<PromptCategory>
  ): Promise<PromptCategory | null> {
    if (this.useMock) {
      logger.info(`使用模拟数据更新提示模板分类, ID: ${id}`);
      
      // 使用服务端模型数组
      const index = mockServerPromptCategories.findIndex(c => c.id === id);
      if (index === -1) {
        return null;
      }
      
      const now = new Date().toISOString();
      const serverCategory = mockServerPromptCategories[index];
      
      // 先将前端属性转换为服务端属性
      const updatedServerCategory: ServerPromptCategory = {
        ...serverCategory,
        name: category.name || serverCategory.name,
        description: category.description !== undefined ? category.description : serverCategory.description,
        template_count: serverCategory.template_count, // 保持计数不变
        updated_at: now
      };
      
      // 更新服务端模型数组
      mockServerPromptCategories[index] = updatedServerCategory;
      
      // 转换为前端共享类型并返回
      return toSharedPromptCategory(updatedServerCategory);
    }
    
    try {
      logger.info(`向后端API更新提示模板分类, ID: ${id}`);
      const response = await axios.put<PromptCategory>(`${this.apiUrl}/api/prompt-categories/${id}`, category);
      return response.data;
    } catch (error) {
      logger.error(`更新提示模板分类失败, ID: ${id}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error(`更新提示模板分类失败: ${error}`);
    }
  }
  
  /**
   * 删除提示模板分类
   */
  async deletePromptCategory(id: string): Promise<boolean> {
    if (this.useMock) {
      logger.info(`使用模拟数据删除提示模板分类, ID: ${id}`);
      
      // 检查是否有模板使用此分类
      if (mockServerPromptTemplates.some(t => t.category_id === id)) {
        throw new Error('无法删除，此分类下存在提示模板');
      }
      
      // 使用服务端模型数组
      const index = mockServerPromptCategories.findIndex(c => c.id === id);
      if (index === -1) {
        return false;
      }
      
      mockServerPromptCategories.splice(index, 1);
      return true;
    }
    
    try {
      logger.info(`向后端API删除提示模板分类, ID: ${id}`);
      await axios.delete(`${this.apiUrl}/api/prompt-categories/${id}`);
      return true;
    } catch (error) {
      logger.error(`删除提示模板分类失败, ID: ${id}:`, error);
      throw new Error(`删除提示模板分类失败: ${error}`);
    }
  }
  
  /**
   * 获取助手的提示模板绑定
   */
  async getAssistantPromptBindings(assistantId: string): Promise<PromptAssistantBinding[]> {
    if (this.useMock) {
      logger.info(`使用模拟数据获取助手的提示模板绑定, 助手ID: ${assistantId}`);
      
      // 使用服务端模型过滤
      const serverBindings = mockServerPromptBindings.filter(b => b.assistant_id === assistantId);
      
      // 转换为前端共享类型
      return serverBindings.map(binding => toSharedPromptBinding(binding));
    }
    
    try {
      logger.info(`从后端API获取助手的提示模板绑定, 助手ID: ${assistantId}`);
      const response = await axios.get<ServerPromptBinding[]>(
        `${this.apiUrl}/api/assistants/${assistantId}/prompts`
      );
      
      // 转换为前端共享类型
      return response.data.map(binding => toSharedPromptBinding(binding));
    } catch (error) {
      logger.error(`获取助手的提示模板绑定失败, 助手ID: ${assistantId}:`, error);
      throw new Error('获取助手的提示模板绑定失败');
    }
  }
  
  /**
   * 创建提示模板绑定
   */
  async createPromptBinding(
    binding: Omit<PromptAssistantBinding, 'id' | 'createdAt'>
  ): Promise<PromptAssistantBinding> {
    if (this.useMock) {
      logger.info(`使用模拟数据创建提示模板绑定, 提示ID: ${binding.promptId}, 助手ID: ${binding.assistantId}`);
      
      // 转换为服务端类型
      const serverBinding = toServerPromptBinding({
        ...binding,
        // 移除不在PromptAssistantBinding类型中的id属性
        // id将在toServerPromptBinding函数内部通过uuidv4()生成
        createdAt: new Date().toISOString()
      });
      
      // 创建有新ID的服务端绑定
      const now = new Date().toISOString();
      const newServerBinding: ServerPromptBinding = {
        ...serverBinding,
        id: uuidv4(),
        created_at: now,
        updated_at: now
      };
      
      // 检查提示模板是否存在
      const template = mockServerPromptTemplates.find(t => t.id === newServerBinding.prompt_id);
      if (!template) {
        throw new Error('提示模板不存在');
      }
      
      mockServerPromptBindings.push(newServerBinding);
      
      // 增加提示模板的使用计数
      const templateIndex = mockServerPromptTemplates.findIndex(t => t.id === newServerBinding.prompt_id);
      if (templateIndex !== -1) {
        const template = mockServerPromptTemplates[templateIndex];
        if (template && typeof template.usage_count === 'number') {
          template.usage_count += 1;
        } else if (template) {
          // 如果 usage_count 不存在或不是数字，初始化它
          template.usage_count = 1;
        }
      }
      
      // 转换为前端共享类型返回
      return toSharedPromptBinding(newServerBinding);
    }
    
    try {
      logger.info(`向后端API创建提示模板绑定, 提示ID: ${binding.promptId}, 助手ID: ${binding.assistantId}`);
      
      // 转换为服务端类型
      const serverBinding = toServerPromptBinding({
        ...binding,
        // 移除id属性，因为它不在PromptAssistantBinding类型中
        // 而且在toServerPromptBinding函数内会生成
        createdAt: new Date().toISOString()
      });
      
      const response = await axios.post<ServerPromptBinding>(
        `${this.apiUrl}/api/assistants/${binding.assistantId}/prompts`,
        serverBinding
      );
      
      // 转换响应为前端共享类型
      return toSharedPromptBinding(response.data);
    } catch (error) {
      logger.error(`创建提示模板绑定失败:`, error);
      throw new Error(`创建提示模板绑定失败: ${error}`);
    }
  }
  
  /**
   * 更新提示模板绑定
   */
  async updatePromptBinding(
    id: string, 
    binding: Partial<PromptAssistantBinding>
  ): Promise<PromptAssistantBinding | null> {
    if (this.useMock) {
      logger.info(`使用模拟数据更新提示模板绑定, ID: ${id}`);
      
      const index = mockServerPromptBindings.findIndex(b => b.id === id);
      if (index === -1) {
        return null;
      }
      
      const now = new Date().toISOString();
      
      // 获取当前的服务端绑定
      const currentServerBinding = mockServerPromptBindings[index];
      
      // 前端类型处理
      // 首先将当前的服务端绑定转换为前端类型
      const currentSharedBinding = toSharedPromptBinding(currentServerBinding);
      
      // 合并前端更新
      const updatedSharedBinding = {
        ...currentSharedBinding,
        ...binding
      };
      
      // 转换回服务端类型
      let updatedServerBinding = toServerPromptBinding(updatedSharedBinding);
      
      // 确保ID不变，并更新时间
      updatedServerBinding = {
        ...updatedServerBinding,
        id,
        created_at: currentServerBinding.created_at,
        updated_at: now
      };
      
      // 更新到模拟数据
      mockServerPromptBindings[index] = updatedServerBinding;
      
      // 转换回前端类型返回
      return toSharedPromptBinding(updatedServerBinding);
    }
    
    try {
      logger.info(`向后端API更新提示模板绑定, ID: ${id}`);
      
      // 首先获取现有绑定
      const currentResponse = await axios.get<ServerPromptBinding>(`${this.apiUrl}/api/prompt-bindings/${id}`);
      const currentServerBinding = currentResponse.data;
      
      // 将当前服务端绑定转换为前端类型
      const currentSharedBinding = toSharedPromptBinding(currentServerBinding);
      
      // 合并更新
      const updatedSharedBinding = {
        ...currentSharedBinding,
        ...binding
      };
      
      // 将更新后的前端类型转换回服务端类型
      const updatedServerBinding = toServerPromptBinding(updatedSharedBinding);
      
      // 发送更新请求
      const response = await axios.put<ServerPromptBinding>(
        `${this.apiUrl}/api/prompt-bindings/${id}`,
        updatedServerBinding
      );
      
      // 转换响应为前端类型
      return toSharedPromptBinding(response.data);
    } catch (error) {
      logger.error(`更新提示模板绑定失败, ID: ${id}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error(`更新提示模板绑定失败: ${error}`);
    }
  }
  
  /**
   * 删除提示模板绑定
   */
  async deletePromptBinding(id: string): Promise<boolean> {
    if (this.useMock) {
      logger.info(`使用模拟数据删除提示模板绑定, ID: ${id}`);
      
      const index = mockServerPromptBindings.findIndex(b => b.id === id);
      if (index === -1) {
        return false;
      }
      
      // 在删除前获取绑定信息，以便更新模板使用计数
      const binding = mockServerPromptBindings[index];
      const promptId = binding.prompt_id;
      
      // 删除绑定
      mockServerPromptBindings.splice(index, 1);
      
      // 可选: 更新模板的使用计数
      const templateIndex = mockServerPromptTemplates.findIndex(t => t.id === promptId);
      if (templateIndex !== -1) {
        const template = mockServerPromptTemplates[templateIndex];
        if (template && typeof template.usage_count === 'number' && template.usage_count > 0) {
          template.usage_count -= 1;
        }
      }
      
      return true;
    }
    
    try {
      logger.info(`向后端API删除提示模板绑定, ID: ${id}`);
      await axios.delete(`${this.apiUrl}/api/prompt-bindings/${id}`);
      return true;
    } catch (error) {
      logger.error(`删除提示模板绑定失败, ID: ${id}:`, error);
      throw new Error(`删除提示模板绑定失败: ${error}`);
    }
  }
}

export const promptTemplateService = new PromptTemplateService();
