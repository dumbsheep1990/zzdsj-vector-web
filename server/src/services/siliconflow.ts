import axios, { AxiosInstance } from 'axios';
import { logger } from '../utils/logger';

export interface EmbeddingRequest {
  model: string;
  input: string | string[];
  encoding_format?: 'float' | 'base64';
  dimensions?: number;
}

export interface EmbeddingResponse {
  object: 'list';
  data: Array<{
    object: 'embedding';
    index: number;
    embedding: number[];
  }>;
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

export interface RerankRequest {
  model: string;
  query: string;
  documents: string[] | Array<{ text: string; title?: string }>;
  top_n?: number;
  return_documents?: boolean;
}

export interface RerankResponse {
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
  results: Array<{
    index: number;
    document?: {
      text: string;
      title?: string;
    };
    relevance_score: number;
  }>;
}

export interface ChatRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  repetition_penalty?: number;
}

export interface ChatResponse {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class SiliconFlowService {
  private client: AxiosInstance;
  private readonly apiKey: string;
  private readonly baseUrl: string = 'https://api.siliconflow.cn/v1';

  constructor(apiKey: string = 'sk-mnennlifdngjififromhljflqsblutyfgfvwerkfhsxummcn') {
    this.apiKey = apiKey;
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000, // 60秒超时
    });

    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        logger.info('SiliconFlow API Request', {
          method: config.method,
          url: config.url,
          data: config.data ? JSON.stringify(config.data).substring(0, 200) + '...' : undefined,
        });
        return config;
      },
      (error) => {
        logger.error('SiliconFlow API Request Error', error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => {
        logger.info('SiliconFlow API Response', {
          status: response.status,
          statusText: response.statusText,
          data: response.data ? JSON.stringify(response.data).substring(0, 200) + '...' : undefined,
        });
        return response;
      },
      (error) => {
        logger.error('SiliconFlow API Response Error', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * 创建文本嵌入向量
   */
  async createEmbedding(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    try {
      const response = await this.client.post<EmbeddingResponse>('/embeddings', request);
      return response.data;
    } catch (error) {
      logger.error('创建嵌入向量失败:', error);
      throw new Error(`创建嵌入向量失败: ${error}`);
    }
  }

  /**
   * 批量创建嵌入向量
   */
  async createBatchEmbeddings(
    texts: string[], 
    model: string = 'Qwen/Qwen3-Embedding-8B',
    batchSize: number = 10
  ): Promise<number[][]> {
    try {
      const allEmbeddings: number[][] = [];
      
      // 分批处理，避免请求过大
      for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        const response = await this.createEmbedding({
          model,
          input: batch,
          encoding_format: 'float'
        });
        
        // 按顺序添加嵌入向量
        response.data.forEach((item, index) => {
          allEmbeddings[i + index] = item.embedding;
        });
        
        // 添加延迟，避免请求过快
        if (i + batchSize < texts.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      return allEmbeddings;
    } catch (error) {
      logger.error('批量创建嵌入向量失败:', error);
      throw new Error(`批量创建嵌入向量失败: ${error}`);
    }
  }

  /**
   * 重排序文档
   */
  async rerank(request: RerankRequest): Promise<RerankResponse> {
    try {
      const response = await this.client.post<RerankResponse>('/rerank', request);
      return response.data;
    } catch (error) {
      logger.error('重排序失败:', error);
      throw new Error(`重排序失败: ${error}`);
    }
  }

  /**
   * 聊天对话
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await this.client.post<ChatResponse>('/chat/completions', request);
      return response.data;
    } catch (error) {
      logger.error('聊天对话失败:', error);
      throw new Error(`聊天对话失败: ${error}`);
    }
  }

  /**
   * 获取可用模型列表
   */
  async getModels(): Promise<any> {
    try {
      const response = await this.client.get('/models');
      return response.data;
    } catch (error) {
      logger.error('获取模型列表失败:', error);
      throw new Error(`获取模型列表失败: ${error}`);
    }
  }

  /**
   * 计算文本相似度
   */
  async calculateSimilarity(text1: string, text2: string): Promise<number> {
    try {
      const response = await this.createEmbedding({
        model: 'Qwen/Qwen3-Embedding-8B',
        input: [text1, text2],
        encoding_format: 'float'
      });

      const embedding1 = response.data[0].embedding;
      const embedding2 = response.data[1].embedding;

      // 计算余弦相似度
      const dotProduct = embedding1.reduce((sum, a, i) => sum + a * embedding2[i], 0);
      const magnitude1 = Math.sqrt(embedding1.reduce((sum, a) => sum + a * a, 0));
      const magnitude2 = Math.sqrt(embedding2.reduce((sum, a) => sum + a * a, 0));
      
      return dotProduct / (magnitude1 * magnitude2);
    } catch (error) {
      logger.error('计算文本相似度失败:', error);
      throw new Error(`计算文本相似度失败: ${error}`);
    }
  }
}

export const siliconFlowService = new SiliconFlowService();
