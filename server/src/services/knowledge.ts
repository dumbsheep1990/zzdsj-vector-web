import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { KnowledgeBaseItem, KnowledgeFileItem } from '../../../shared/types/knowledge';
import { logger } from '../utils/logger';

// 模拟数据
const mockKnowledgeBases: KnowledgeBaseItem[] = [
  {
    id: '1',
    name: '技术文档库',
    description: '包含各种技术文档和API参考',
    fileCount: 25,
    lastUpdated: '2025-05-10T14:30:00Z',
    tags: ['技术', '文档', 'API']
  },
  {
    id: '2',
    name: '产品资料库',
    description: '产品说明书和用户手册',
    fileCount: 18,
    lastUpdated: '2025-05-08T09:15:00Z',
    tags: ['产品', '手册', '说明书']
  },
  {
    id: '3',
    name: '学术论文库',
    description: '人工智能和机器学习相关论文',
    fileCount: 42,
    lastUpdated: '2025-05-12T16:45:00Z',
    tags: ['学术', '论文', 'AI', '机器学习']
  }
];

// 模拟文件数据
const mockFiles: Record<string, KnowledgeFileItem[]> = {
  '1': [
    {
      id: '101',
      name: 'API参考手册.pdf',
      size: 2456789,
      type: 'application/pdf',
      uploadDate: '2025-05-01T10:30:00Z',
      status: 'completed'
    },
    {
      id: '102',
      name: '系统架构图.png',
      size: 567890,
      type: 'image/png',
      uploadDate: '2025-05-02T14:20:00Z',
      status: 'completed'
    }
  ],
  '2': [
    {
      id: '201',
      name: '用户手册V2.0.docx',
      size: 1345678,
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      uploadDate: '2025-05-03T09:15:00Z',
      status: 'completed'
    }
  ]
};

class KnowledgeService {
  private apiUrl: string;
  private useMock: boolean;
  
  constructor() {
    this.apiUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';
    this.useMock = process.env.USE_MOCK_DATA === 'true';
  }
  
  async getKnowledgeBases(): Promise<KnowledgeBaseItem[]> {
    if (this.useMock) {
      logger.info('使用模拟数据获取知识库列表');
      return [...mockKnowledgeBases];
    }
    
    try {
      logger.info('从后端API获取知识库列表');
      const response = await axios.get<KnowledgeBaseItem[]>(`${this.apiUrl}/api/knowledge-bases`);
      return response.data;
    } catch (error) {
      logger.error('获取知识库列表失败:', error);
      throw new Error('获取知识库列表失败');
    }
  }
  
  async getKnowledgeBaseById(id: string): Promise<KnowledgeBaseItem | null> {
    if (this.useMock) {
      logger.info(`使用模拟数据获取知识库详情, ID: ${id}`);
      const knowledgeBase = mockKnowledgeBases.find(kb => kb.id === id);
      return knowledgeBase || null;
    }
    
    try {
      logger.info(`从后端API获取知识库详情, ID: ${id}`);
      const response = await axios.get<KnowledgeBaseItem>(`${this.apiUrl}/api/knowledge-bases/${id}`);
      return response.data;
    } catch (error) {
      logger.error(`获取知识库详情失败, ID: ${id}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error(`获取知识库详情失败: ${error}`);
    }
  }
  
  async createKnowledgeBase(knowledgeBase: Omit<KnowledgeBaseItem, 'id'>): Promise<KnowledgeBaseItem> {
    if (this.useMock) {
      logger.info('使用模拟数据创建知识库');
      const newKnowledgeBase: KnowledgeBaseItem = {
        id: uuidv4(),
        ...knowledgeBase,
        fileCount: 0,
        lastUpdated: new Date().toISOString()
      };
      
      mockKnowledgeBases.push(newKnowledgeBase);
      return newKnowledgeBase;
    }
    
    try {
      logger.info('向后端API创建知识库');
      const response = await axios.post<KnowledgeBaseItem>(`${this.apiUrl}/api/knowledge-bases`, knowledgeBase);
      return response.data;
    } catch (error) {
      logger.error('创建知识库失败:', error);
      throw new Error('创建知识库失败');
    }
  }
  
  async updateKnowledgeBase(id: string, knowledgeBase: Partial<KnowledgeBaseItem>): Promise<KnowledgeBaseItem | null> {
    if (this.useMock) {
      logger.info(`使用模拟数据更新知识库, ID: ${id}`);
      const index = mockKnowledgeBases.findIndex(kb => kb.id === id);
      
      if (index === -1) {
        return null;
      }
      
      const updatedKnowledgeBase = {
        ...mockKnowledgeBases[index],
        ...knowledgeBase,
        lastUpdated: new Date().toISOString()
      };
      
      mockKnowledgeBases[index] = updatedKnowledgeBase;
      return updatedKnowledgeBase;
    }
    
    try {
      logger.info(`向后端API更新知识库, ID: ${id}`);
      const response = await axios.put<KnowledgeBaseItem>(`${this.apiUrl}/api/knowledge-bases/${id}`, knowledgeBase);
      return response.data;
    } catch (error) {
      logger.error(`更新知识库失败, ID: ${id}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error(`更新知识库失败: ${error}`);
    }
  }
  
  async deleteKnowledgeBase(id: string): Promise<boolean> {
    if (this.useMock) {
      logger.info(`使用模拟数据删除知识库, ID: ${id}`);
      const index = mockKnowledgeBases.findIndex(kb => kb.id === id);
      
      if (index === -1) {
        return false;
      }
      
      mockKnowledgeBases.splice(index, 1);
      return true;
    }
    
    try {
      logger.info(`向后端API删除知识库, ID: ${id}`);
      await axios.delete(`${this.apiUrl}/api/knowledge-bases/${id}`);
      return true;
    } catch (error) {
      logger.error(`删除知识库失败, ID: ${id}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false;
      }
      throw new Error(`删除知识库失败: ${error}`);
    }
  }
  
  async getKnowledgeBaseFiles(knowledgeBaseId: string): Promise<KnowledgeFileItem[]> {
    if (this.useMock) {
      logger.info(`使用模拟数据获取知识库文件, 知识库ID: ${knowledgeBaseId}`);
      return mockFiles[knowledgeBaseId] || [];
    }
    
    try {
      logger.info(`从后端API获取知识库文件, 知识库ID: ${knowledgeBaseId}`);
      const response = await axios.get<KnowledgeFileItem[]>(`${this.apiUrl}/api/knowledge-bases/${knowledgeBaseId}/files`);
      return response.data;
    } catch (error) {
      logger.error(`获取知识库文件失败, 知识库ID: ${knowledgeBaseId}:`, error);
      throw new Error(`获取知识库文件失败: ${error}`);
    }
  }
}

export const knowledgeService = new KnowledgeService();
