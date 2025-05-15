import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ModelProvider, Model } from '../../../shared/types/models';
import { logger } from '../utils/logger';

// 模拟数据
const mockProviders: ModelProvider[] = [
  {
    id: '1',
    name: 'OpenAI',
    description: 'OpenAI提供的GPT系列模型',
    apiKey: '',
    apiBase: 'https://api.openai.com/v1',
    isEnabled: true,
    models: [
      {
        id: '101',
        name: 'gpt-4-turbo',
        providerId: '1',
        isEnabled: true,
        contextSize: 128000,
        maxTokens: 4096,
        temperature: 0.7,
        capabilities: ['chat', 'instruction-following', 'reasoning']
      },
      {
        id: '102',
        name: 'gpt-3.5-turbo',
        providerId: '1',
        isEnabled: true,
        contextSize: 16000,
        maxTokens: 4096,
        temperature: 0.7,
        capabilities: ['chat', 'instruction-following']
      }
    ]
  },
  {
    id: '2',
    name: '智谱AI',
    description: '智谱提供的GLM系列模型',
    apiKey: '',
    apiBase: 'https://open.bigmodel.cn/api/paas/v4',
    isEnabled: false,
    models: [
      {
        id: '201',
        name: 'glm-4',
        providerId: '2',
        isEnabled: false,
        contextSize: 128000,
        maxTokens: 4096,
        temperature: 0.7,
        capabilities: ['chat', 'instruction-following', 'reasoning']
      },
      {
        id: '202',
        name: 'glm-3-turbo',
        providerId: '2',
        isEnabled: false,
        contextSize: 32000,
        maxTokens: 4096,
        temperature: 0.7,
        capabilities: ['chat', 'instruction-following']
      }
    ]
  }
];

class ModelService {
  private apiUrl: string;
  private useMock: boolean;
  
  constructor() {
    this.apiUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';
    this.useMock = process.env.USE_MOCK_DATA === 'true';
  }
  
  async getModelProviders(): Promise<ModelProvider[]> {
    if (this.useMock) {
      logger.info('使用模拟数据获取模型提供商列表');
      return JSON.parse(JSON.stringify(mockProviders)); // 深拷贝避免修改原始数据
    }
    
    try {
      logger.info('从后端API获取模型提供商列表');
      const response = await axios.get<ModelProvider[]>(`${this.apiUrl}/api/model/providers`);
      return response.data;
    } catch (error) {
      logger.error('获取模型提供商列表失败:', error);
      throw new Error('获取模型提供商列表失败');
    }
  }
  
  async getModelProviderById(id: string): Promise<ModelProvider | null> {
    if (this.useMock) {
      logger.info(`使用模拟数据获取模型提供商详情, ID: ${id}`);
      const provider = mockProviders.find(p => p.id === id);
      return provider ? JSON.parse(JSON.stringify(provider)) : null;
    }
    
    try {
      logger.info(`从后端API获取模型提供商详情, ID: ${id}`);
      const response = await axios.get<ModelProvider>(`${this.apiUrl}/api/model/providers/${id}`);
      return response.data;
    } catch (error) {
      logger.error(`获取模型提供商详情失败, ID: ${id}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error(`获取模型提供商详情失败: ${error}`);
    }
  }
  
  async updateModelProvider(id: string, provider: Partial<ModelProvider>): Promise<ModelProvider | null> {
    if (this.useMock) {
      logger.info(`使用模拟数据更新模型提供商, ID: ${id}`);
      const index = mockProviders.findIndex(p => p.id === id);
      
      if (index === -1) {
        return null;
      }
      
      // 保护敏感信息不被泄露
      let apiKey = provider.apiKey;
      if (apiKey === undefined) {
        apiKey = mockProviders[index].apiKey;
      }
      
      const updatedProvider = {
        ...mockProviders[index],
        ...provider,
        apiKey
      };
      
      mockProviders[index] = updatedProvider;
      const result = JSON.parse(JSON.stringify(updatedProvider));
      return result;
    }
    
    try {
      logger.info(`向后端API更新模型提供商, ID: ${id}`);
      const response = await axios.put<ModelProvider>(`${this.apiUrl}/api/model/providers/${id}`, provider);
      return response.data;
    } catch (error) {
      logger.error(`更新模型提供商失败, ID: ${id}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error(`更新模型提供商失败: ${error}`);
    }
  }
  
  async getModels(): Promise<Model[]> {
    if (this.useMock) {
      logger.info('使用模拟数据获取模型列表');
      let allModels: Model[] = [];
      mockProviders.forEach(provider => {
        allModels = allModels.concat(provider.models);
      });
      return JSON.parse(JSON.stringify(allModels));
    }
    
    try {
      logger.info('从后端API获取模型列表');
      const response = await axios.get<Model[]>(`${this.apiUrl}/api/model`);
      return response.data;
    } catch (error) {
      logger.error('获取模型列表失败:', error);
      throw new Error('获取模型列表失败');
    }
  }
  
  async getModelById(id: string): Promise<Model | null> {
    if (this.useMock) {
      logger.info(`使用模拟数据获取模型详情, ID: ${id}`);
      let targetModel: Model | null = null;
      
      mockProviders.forEach(provider => {
        const model = provider.models.find(m => m.id === id);
        if (model) {
          targetModel = model;
        }
      });
      
      return targetModel ? JSON.parse(JSON.stringify(targetModel)) : null;
    }
    
    try {
      logger.info(`从后端API获取模型详情, ID: ${id}`);
      const response = await axios.get<Model>(`${this.apiUrl}/api/model/${id}`);
      return response.data;
    } catch (error) {
      logger.error(`获取模型详情失败, ID: ${id}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error(`获取模型详情失败: ${error}`);
    }
  }
  
  async updateModel(id: string, model: Partial<Model>): Promise<Model | null> {
    if (this.useMock) {
      logger.info(`使用模拟数据更新模型, ID: ${id}`);
      let updated = false;
      
      for (let i = 0; i < mockProviders.length; i++) {
        const modelIndex = mockProviders[i].models.findIndex(m => m.id === id);
        
        if (modelIndex !== -1) {
          mockProviders[i].models[modelIndex] = {
            ...mockProviders[i].models[modelIndex],
            ...model
          };
          updated = true;
          return JSON.parse(JSON.stringify(mockProviders[i].models[modelIndex]));
        }
      }
      
      return null;
    }
    
    try {
      logger.info(`向后端API更新模型, ID: ${id}`);
      const response = await axios.put<Model>(`${this.apiUrl}/api/model/${id}`, model);
      return response.data;
    } catch (error) {
      logger.error(`更新模型失败, ID: ${id}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error(`更新模型失败: ${error}`);
    }
  }
  
  async testModel(modelId: string, prompt: string): Promise<any> {
    if (this.useMock) {
      logger.info(`使用模拟数据测试模型, ModelID: ${modelId}, Prompt: ${prompt}`);
      return {
        id: uuidv4(),
        model: modelId,
        created: new Date().toISOString(),
        content: `这是模型 ${modelId} 对提示 "${prompt}" 的模拟回复。在实际环境中，这将是一个真实的模型回应。`,
        usage: {
          prompt_tokens: prompt.length,
          completion_tokens: 50,
          total_tokens: prompt.length + 50
        }
      };
    }
    
    try {
      logger.info(`向后端API测试模型, ModelID: ${modelId}, Prompt: ${prompt}`);
      const response = await axios.post(`${this.apiUrl}/api/model/test`, { modelId, prompt });
      return response.data;
    } catch (error) {
      logger.error(`测试模型失败, ModelID: ${modelId}:`, error);
      throw new Error(`测试模型失败: ${error}`);
    }
  }
}

export const modelService = new ModelService();
