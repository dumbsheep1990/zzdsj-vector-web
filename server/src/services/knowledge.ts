import { createApiClient } from '../utils/apiClient';
import { logger } from '../utils/logger';
import { 
  KnowledgeBase, 
  KnowledgeBaseCreateRequest, 
  KnowledgeBaseUpdateRequest,
  Document, 
  DocumentCreateRequest, 
  DocumentUploadRequest,
  DocumentSearchRequest,
  DocumentSearchResult,
  DocumentChunk,
  KnowledgeGraph,
  GraphSearchRequest,
  GraphSearchResult,
  VectorTemplate,
  ChunkingStrategy,
  EmbeddingModel,
  VectorStore
} from '../types/knowledge';
import { ApiResponse, PaginationParams, PaginationResponse } from '../types/common';

export class KnowledgeService {
  private apiClient = createApiClient();
  private readonly baseUrl = '/api/frontend/knowledge';

    // ================ 知识库管理 ================

    private embeddingModelConfig = {
      embedding_model_name: 'Qwen/Qwen3-Embedding-8B',
      rerank_model_name: 'Qwen/Qwen3-Reranker-8B',
      chat_models: ['Qwen/Qwen3-32B', 'moonshotai/Kimi-K2-Instruct'],
      api_key: 'sk-mnennlifdngjififromhljflqsblutyfgfvwerkfhsxummcn'
    };

  /**
   * 获取知识库列表
   */
  async getKnowledgeBases(params?: PaginationParams & {
    search?: string;
    category?: string;
    status?: string;
    owner_id?: number;
  }): Promise<PaginationResponse<KnowledgeBase>> {
    try {
      logger.info('获取知识库列表', { params });
      const response = await this.apiClient.get<PaginationResponse<KnowledgeBase>>(
        `${this.baseUrl}/bases`,
        { params }
      );
      if (!response.data) {
        throw new Error('获取知识库列表失败：服务器返回空数据');
      }
      return response.data;
    } catch (error) {
      logger.error('获取知识库列表失败:', error);
      throw new Error('获取知识库列表失败');
    }
  }

  /**
   * 根据ID获取知识库详情
   */
  async getKnowledgeBaseById(id: string): Promise<KnowledgeBase> {
    try {
      logger.info(`获取知识库详情, ID: ${id}`);
      const response = await this.apiClient.get<KnowledgeBase>(`${this.baseUrl}/bases/${id}`);
      if (!response.data) {
        throw new Error('获取知识库详情失败：服务器返回空数据');
      }
      return response.data;
    } catch (error) {
      logger.error(`获取知识库详情失败, ID: ${id}:`, error);
      throw new Error(`获取知识库详情失败: ${error}`);
    }
  }

  /**
   * 创建知识库
   */
  async createKnowledgeBase(data: KnowledgeBaseCreateRequest): Promise<KnowledgeBase> {
    try {
      // 将embedding模型和API配置应用到创建请求中
      const enrichedData = {
        ...data,
        embedding_model: this.embeddingModelConfig.embedding_model_name,
        api_key: this.embeddingModelConfig.api_key
      };

      logger.info('创建知识库', { enrichedData });
      const response = await this.apiClient.post<KnowledgeBase>(`${this.baseUrl}/bases`, data);
      if (!response.data) {
        throw new Error('创建知识库失败：服务器返回空数据');
      }
      return response.data;
    } catch (error) {
      logger.error('创建知识库失败:', error);
      throw new Error('创建知识库失败');
    }
  }

  /**
   * 更新知识库
   */
  async updateKnowledgeBase(id: string, data: KnowledgeBaseUpdateRequest): Promise<KnowledgeBase> {
    try {
      logger.info(`更新知识库, ID: ${id}`, { data });
      const response = await this.apiClient.put<KnowledgeBase>(`${this.baseUrl}/bases/${id}`, data);
      if (!response.data) {
        throw new Error('更新知识库失败：服务器返回空数据');
      }
      return response.data;
    } catch (error) {
      logger.error(`更新知识库失败, ID: ${id}:`, error);
      throw new Error(`更新知识库失败: ${error}`);
    }
  }

  /**
   * 删除知识库
   */
  async deleteKnowledgeBase(id: string): Promise<void> {
    try {
      logger.info(`删除知识库, ID: ${id}`);
      await this.apiClient.delete(`${this.baseUrl}/bases/${id}`);
    } catch (error) {
      logger.error(`删除知识库失败, ID: ${id}:`, error);
      throw new Error(`删除知识库失败: ${error}`);
    }
  }

  /**
   * 获取知识库统计信息
   */
  async getKnowledgeBaseStats(id: string): Promise<{
    document_count: number;
    chunk_count: number;
    size_bytes: number;
    last_updated: string;
  }> {
    try {
      logger.info(`获取知识库统计信息, ID: ${id}`);
      const response = await this.apiClient.get(`${this.baseUrl}/bases/${id}/stats`);
      return response.data;
    } catch (error) {
      logger.error(`获取知识库统计信息失败, ID: ${id}:`, error);
      throw new Error(`获取知识库统计信息失败: ${error}`);
    }
  }

  // ================ 文档管理 ================

  /**
   * 获取知识库文档列表
   */
  async getDocuments(
    knowledgeBaseId: string, 
    params?: PaginationParams & {
      search?: string;
      status?: string;
      file_type?: string;
    }
  ): Promise<PaginationResponse<Document>> {
    try {
      logger.info(`获取知识库文档列表, 知识库ID: ${knowledgeBaseId}`, { params });
      const response = await this.apiClient.get<PaginationResponse<Document>>(
        `${this.baseUrl}/bases/${knowledgeBaseId}/documents`,
        { params }
      );
      return response.data;
    } catch (error) {
      logger.error(`获取知识库文档列表失败, 知识库ID: ${knowledgeBaseId}:`, error);
      throw new Error(`获取知识库文档列表失败: ${error}`);
    }
  }

  /**
   * 根据ID获取文档详情
   */
  async getDocumentById(id: string): Promise<Document> {
    try {
      logger.info(`获取文档详情, ID: ${id}`);
      const response = await this.apiClient.get<Document>(`${this.baseUrl}/documents/${id}`);
      return response.data;
    } catch (error) {
      logger.error(`获取文档详情失败, ID: ${id}:`, error);
      throw new Error(`获取文档详情失败: ${error}`);
    }
  }

  /**
   * 创建文档
   */
  async createDocument(knowledgeBaseId: string, data: DocumentCreateRequest): Promise<Document> {
    try {
      logger.info(`创建文档, 知识库ID: ${knowledgeBaseId}`, { data });
      const response = await this.apiClient.post<Document>(
        `${this.baseUrl}/bases/${knowledgeBaseId}/documents`,
        data
      );
      return response.data;
    } catch (error) {
      logger.error(`创建文档失败, 知识库ID: ${knowledgeBaseId}:`, error);
      throw new Error('创建文档失败');
    }
  }

  /**
   * 上传文档
   */
  async uploadDocument(
    knowledgeBaseId: string, 
    file: File | Buffer, 
    data: Omit<DocumentUploadRequest, 'file'>
  ): Promise<Document> {
    try {
      logger.info(`上传文档, 知识库ID: ${knowledgeBaseId}`, { title: data.title });
      const response = await this.apiClient.upload<Document>(
        `${this.baseUrl}/bases/${knowledgeBaseId}/documents/upload`,
        file,
        'file',
        data
      );
      return response.data;
    } catch (error) {
      logger.error(`上传文档失败, 知识库ID: ${knowledgeBaseId}:`, error);
      throw new Error('上传文档失败');
    }
  }

  /**
   * 删除文档
   */
  async deleteDocument(id: string): Promise<void> {
    try {
      logger.info(`删除文档, ID: ${id}`);
      await this.apiClient.delete(`${this.baseUrl}/documents/${id}`);
    } catch (error) {
      logger.error(`删除文档失败, ID: ${id}:`, error);
      throw new Error(`删除文档失败: ${error}`);
    }
  }

  /**
   * 重新处理文档
   */
  async reprocessDocument(id: string): Promise<Document> {
    try {
      logger.info(`重新处理文档, ID: ${id}`);
      const response = await this.apiClient.post<Document>(`${this.baseUrl}/documents/${id}/reprocess`);
      return response.data;
    } catch (error) {
      logger.error(`重新处理文档失败, ID: ${id}:`, error);
      throw new Error(`重新处理文档失败: ${error}`);
    }
  }

  // ================ 文档搜索 ================

  /**
   * 搜索文档
   */
  async searchDocuments(request: DocumentSearchRequest): Promise<DocumentSearchResult> {
    try {
      logger.info('搜索文档', { request });
      const response = await this.apiClient.post<DocumentSearchResult>(
        `${this.baseUrl}/search`,
        request
      );
      return response.data;
    } catch (error) {
      logger.error('搜索文档失败:', error);
      throw new Error('搜索文档失败');
    }
  }

  /**
   * 获取文档分片
   */
  async getDocumentChunks(
    documentId: string,
    params?: PaginationParams
  ): Promise<PaginationResponse<DocumentChunk>> {
    try {
      logger.info(`获取文档分片, 文档ID: ${documentId}`, { params });
      const response = await this.apiClient.get<PaginationResponse<DocumentChunk>>(
        `${this.baseUrl}/documents/${documentId}/chunks`,
        { params }
      );
      return response.data;
    } catch (error) {
      logger.error(`获取文档分片失败, 文档ID: ${documentId}:`, error);
      throw new Error(`获取文档分片失败: ${error}`);
    }
  }

  // ================ 知识图谱 ================

  /**
   * 获取知识库的知识图谱
   */
  async getKnowledgeGraph(knowledgeBaseId: string): Promise<KnowledgeGraph> {
    try {
      logger.info(`获取知识图谱, 知识库ID: ${knowledgeBaseId}`);
      const response = await this.apiClient.get<KnowledgeGraph>(
        `${this.baseUrl}/bases/${knowledgeBaseId}/graph`
      );
      return response.data;
    } catch (error) {
      logger.error(`获取知识图谱失败, 知识库ID: ${knowledgeBaseId}:`, error);
      throw new Error(`获取知识图谱失败: ${error}`);
    }
  }

  /**
   * 构建知识图谱
   */
  async buildKnowledgeGraph(
    knowledgeBaseId: string,
    config?: {
      entity_types?: string[];
      relation_types?: string[];
      extraction_model?: string;
    }
  ): Promise<KnowledgeGraph> {
    try {
      logger.info(`构建知识图谱, 知识库ID: ${knowledgeBaseId}`, { config });
      const response = await this.apiClient.post<KnowledgeGraph>(
        `${this.baseUrl}/bases/${knowledgeBaseId}/graph/build`,
        config
      );
      return response.data;
    } catch (error) {
      logger.error(`构建知识图谱失败, 知识库ID: ${knowledgeBaseId}:`, error);
      throw new Error(`构建知识图谱失败: ${error}`);
    }
  }

  /**
   * 搜索知识图谱
   */
  async searchGraph(
    knowledgeBaseId: string,
    request: GraphSearchRequest
  ): Promise<GraphSearchResult> {
    try {
      logger.info(`搜索知识图谱, 知识库ID: ${knowledgeBaseId}`, { request });
      const response = await this.apiClient.post<GraphSearchResult>(
        `${this.baseUrl}/bases/${knowledgeBaseId}/graph/search`,
        request
      );
      return response.data;
    } catch (error) {
      logger.error(`搜索知识图谱失败, 知识库ID: ${knowledgeBaseId}:`, error);
      throw new Error(`搜索知识图谱失败: ${error}`);
    }
  }

  // ================ 向量模板 ================

  /**
   * 获取向量模板列表
   */
  async getVectorTemplates(): Promise<VectorTemplate[]> {
    try {
      logger.info('获取向量模板列表');
      const response = await this.apiClient.get<VectorTemplate[]>(`${this.baseUrl}/templates`);
      return response.data;
    } catch (error) {
      logger.error('获取向量模板列表失败:', error);
      throw new Error('获取向量模板列表失败');
    }
  }

  /**
   * 获取分块策略列表
   */
  async getChunkingStrategies(): Promise<ChunkingStrategy[]> {
    try {
      logger.info('获取分块策略列表');
      const response = await this.apiClient.get<ChunkingStrategy[]>(`${this.baseUrl}/chunking-strategies`);
      return response.data;
    } catch (error) {
      logger.error('获取分块策略列表失败:', error);
      throw new Error('获取分块策略列表失败');
    }
  }

  /**
   * 获取嵌入模型列表
   */
  async getEmbeddingModels(): Promise<EmbeddingModel[]> {
    try {
      logger.info('获取嵌入模型列表');
      const response = await this.apiClient.get<EmbeddingModel[]>(`${this.baseUrl}/embedding-models`);
      return response.data;
    } catch (error) {
      logger.error('获取嵌入模型列表失败:', error);
      throw new Error('获取嵌入模型列表失败');
    }
  }

  /**
   * 获取向量存储列表
   */
  async getVectorStores(): Promise<VectorStore[]> {
    try {
      logger.info('获取向量存储列表');
      const response = await this.apiClient.get<VectorStore[]>(`${this.baseUrl}/vector-stores`);
      return response.data;
    } catch (error) {
      logger.error('获取向量存储列表失败:', error);
      throw new Error('获取向量存储列表失败');
    }
  }
}

export const knowledgeService = new KnowledgeService(); 