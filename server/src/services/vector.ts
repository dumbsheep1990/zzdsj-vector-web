import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { VectorItem, VectorSearchParams } from '../../../shared/types/vector';
import { logger } from '../utils/logger';

// 模拟数据
const mockVectors: VectorItem[] = [
  {
    id: '1',
    name: '产品文档向量库',
    source: 'product_docs',
    dimensions: 1536,
    count: 1250,
    lastUpdated: '2025-05-10T14:30:00Z',
    metadata: {
      engine: 'FAISS',
      description: '包含产品文档的向量表示'
    }
  },
  {
    id: '2',
    name: '用户问题向量库',
    source: 'user_questions',
    dimensions: 768,
    count: 5430,
    lastUpdated: '2025-05-12T09:15:00Z',
    metadata: {
      engine: 'Pinecone',
      description: '用户常见问题的向量表示'
    }
  },
  {
    id: '3',
    name: '技术文档向量库',
    source: 'tech_docs',
    dimensions: 1024,
    count: 3275,
    lastUpdated: '2025-05-11T16:45:00Z',
    metadata: {
      engine: 'Milvus',
      description: '技术文档和API参考的向量表示'
    }
  }
];

class VectorService {
  private apiUrl: string;
  private useMock: boolean;
  
  constructor() {
    this.apiUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';
    this.useMock = process.env.USE_MOCK_DATA === 'true';
  }
  
  async getVectors(): Promise<VectorItem[]> {
    if (this.useMock) {
      logger.info('使用模拟数据获取向量列表');
      return [...mockVectors];
    }
    
    try {
      logger.info('从后端API获取向量列表');
      const response = await axios.get<VectorItem[]>(`${this.apiUrl}/api/vectors`);
      return response.data;
    } catch (error) {
      logger.error('获取向量列表失败:', error);
      throw new Error('获取向量列表失败');
    }
  }
  
  async getVectorById(id: string): Promise<VectorItem | null> {
    if (this.useMock) {
      logger.info(`使用模拟数据获取向量详情, ID: ${id}`);
      const vector = mockVectors.find(v => v.id === id);
      return vector || null;
    }
    
    try {
      logger.info(`从后端API获取向量详情, ID: ${id}`);
      const response = await axios.get<VectorItem>(`${this.apiUrl}/api/vectors/${id}`);
      return response.data;
    } catch (error) {
      logger.error(`获取向量详情失败, ID: ${id}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error(`获取向量详情失败: ${error}`);
    }
  }
  
  async searchVectors(searchParams: VectorSearchParams): Promise<any[]> {
    if (this.useMock) {
      logger.info(`使用模拟数据搜索向量, 查询: ${searchParams.query}`);
      return [
        {
          id: 'result1',
          content: '这是一个相关的搜索结果示例',
          score: 0.92,
          metadata: { source: 'document1.pdf', page: 5 }
        },
        {
          id: 'result2',
          content: '另一个相关但相似度较低的结果',
          score: 0.78,
          metadata: { source: 'document2.pdf', page: 12 }
        }
      ];
    }
    
    try {
      logger.info(`向后端API搜索向量, 查询: ${searchParams.query}`);
      const response = await axios.post(`${this.apiUrl}/api/vectors/search`, searchParams);
      return response.data;
    } catch (error) {
      logger.error('向量搜索失败:', error);
      throw new Error('向量搜索失败');
    }
  }
  
  async createVector(vector: Omit<VectorItem, 'id'>): Promise<VectorItem> {
    if (this.useMock) {
      logger.info('使用模拟数据创建向量');
      const newVector: VectorItem = {
        id: uuidv4(),
        ...vector,
        lastUpdated: new Date().toISOString()
      };
      
      mockVectors.push(newVector);
      return newVector;
    }
    
    try {
      logger.info('向后端API创建向量');
      const response = await axios.post<VectorItem>(`${this.apiUrl}/api/vectors`, vector);
      return response.data;
    } catch (error) {
      logger.error('创建向量失败:', error);
      throw new Error('创建向量失败');
    }
  }
  
  async updateVector(id: string, vector: Partial<VectorItem>): Promise<VectorItem | null> {
    if (this.useMock) {
      logger.info(`使用模拟数据更新向量, ID: ${id}`);
      const index = mockVectors.findIndex(v => v.id === id);
      
      if (index === -1) {
        return null;
      }
      
      const updatedVector = {
        ...mockVectors[index],
        ...vector,
        lastUpdated: new Date().toISOString()
      };
      
      mockVectors[index] = updatedVector;
      return updatedVector;
    }
    
    try {
      logger.info(`向后端API更新向量, ID: ${id}`);
      const response = await axios.put<VectorItem>(`${this.apiUrl}/api/vectors/${id}`, vector);
      return response.data;
    } catch (error) {
      logger.error(`更新向量失败, ID: ${id}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error(`更新向量失败: ${error}`);
    }
  }
  
  async deleteVector(id: string): Promise<boolean> {
    if (this.useMock) {
      logger.info(`使用模拟数据删除向量, ID: ${id}`);
      const index = mockVectors.findIndex(v => v.id === id);
      
      if (index === -1) {
        return false;
      }
      
      mockVectors.splice(index, 1);
      return true;
    }
    
    try {
      logger.info(`向后端API删除向量, ID: ${id}`);
      await axios.delete(`${this.apiUrl}/api/vectors/${id}`);
      return true;
    } catch (error) {
      logger.error(`删除向量失败, ID: ${id}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false;
      }
      throw new Error(`删除向量失败: ${error}`);
    }
  }
}

export const vectorService = new VectorService();
