/**
 * 知识库API服务 - 基于微服务端接口
 * 对接 knowledge-service 微服务的完整API
 */
import { KnowledgeBaseItem, FileItem } from '../types';
import apiClient from './client';

// 知识库微服务基础URL（通过网关）
const KNOWLEDGE_SERVICE_URL = import.meta.env.VITE_KNOWLEDGE_SERVICE_URL || 'http://localhost:8082/api/v1';

// 请求参数类型定义
export interface KnowledgeBaseCreateRequest {
  name: string;
  description: string;
  embedding_provider: string;
  embedding_model: string;
  embedding_dimension: number;
  vector_store_type: string;
  chunk_size?: number;
  chunk_overlap?: number;
  similarity_threshold?: number;
  enable_hybrid_search?: boolean;
  enable_agno_integration?: boolean;
  agno_search_type?: string;
  settings?: Record<string, any>;
}

export interface KnowledgeBaseUpdateRequest {
  name?: string;
  description?: string;
  similarity_threshold?: number;
  enable_hybrid_search?: boolean;
  enable_agno_integration?: boolean;
  settings?: Record<string, any>;
}

export interface KnowledgeBaseListParams {
  page?: number;
  page_size?: number;
  status?: string;
  search?: string;
  embedding_model?: string;
}

export interface SearchRequest {
  query: string;
  search_mode: 'vector' | 'keyword' | 'hybrid';
  top_k?: number;
  similarity_threshold?: number;
  enable_reranking?: boolean;
  vector_weight?: number;
  text_weight?: number;
  agno_confidence_threshold?: number;
}

export interface DocumentUploadRequest {
  kb_id: string;
  files: File[];
  chunk_size?: number;
  chunk_overlap?: number;
  chunk_strategy?: string;
  preserve_structure?: boolean;
}

export interface SplittingStrategyRequest {
  name: string;
  description: string;
  parameters: {
    chunk_size: number;
    chunk_overlap: number;
    separator?: string;
    preserve_structure?: boolean;
    enable_semantic_splitting?: boolean;
  };
  tags?: string[];
}

export interface SplittingStrategyResponse {
  id: string;
  name: string;
  description: string;
  type: 'system' | 'custom';
  parameters: {
    chunk_size: number;
    chunk_overlap: number;
    separator?: string;
    preserve_structure?: boolean;
    enable_semantic_splitting?: boolean;
  };
  created_at: string;
  updated_at: string;
  usage_count: number;
  tags: string[];
}

/**
 * 知识库微服务API客户端
 */
export const knowledgeServiceApi = {
  /**
   * 获取知识库列表
   * @param params 查询参数
   */
  async getKnowledgeBases(params: KnowledgeBaseListParams = {}) {
    const response = await fetch(`${KNOWLEDGE_SERVICE_URL}/knowledge-bases?${new URLSearchParams(params as any)}`);
    return response.json();
  },
  
  /**
   * 获取知识库详情
   * @param kbId 知识库ID
   */
  async getKnowledgeBaseById(kbId: string) {
    const response = await fetch(`${KNOWLEDGE_SERVICE_URL}/knowledge-bases/${kbId}`);
    return response.json();
  },
  
  /**
   * 创建知识库
   * @param data 知识库创建请求
   */
  async createKnowledgeBase(data: KnowledgeBaseCreateRequest) {
    const response = await fetch(`${KNOWLEDGE_SERVICE_URL}/knowledge-bases/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  /**
   * 更新知识库
   * @param kbId 知识库ID
   * @param data 更新数据
   */
  async updateKnowledgeBase(kbId: string, data: KnowledgeBaseUpdateRequest) {
    const response = await fetch(`${KNOWLEDGE_SERVICE_URL}/knowledge-bases/${kbId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  /**
   * 删除知识库
   * @param kbId 知识库ID
   */
  async deleteKnowledgeBase(kbId: string) {
    const response = await fetch(`${KNOWLEDGE_SERVICE_URL}/knowledge-bases/${kbId}`, {
      method: 'DELETE'
    });
    return response.json();
  },
  
  /**
   * 获取知识库文档列表
   * @param kbId 知识库ID
   * @param params 查询参数
   */
  async getKnowledgeBaseDocuments(kbId: string, params: { page?: number; page_size?: number; status?: string } = {}) {
    const response = await fetch(`${KNOWLEDGE_SERVICE_URL}/knowledge-bases/${kbId}/documents?${new URLSearchParams(params as any)}`);
    return response.json();
  },
  
  /**
   * 上传文档到知识库
   * @param kbId 知识库ID
   * @param files 文件列表
   * @param options 上传选项
   */
  async uploadDocuments(kbId: string, files: File[], options: {
    chunk_size?: number;
    chunk_overlap?: number;
    chunk_strategy?: string;
    preserve_structure?: boolean;
  } = {}) {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    
    const response = await fetch(`${KNOWLEDGE_SERVICE_URL}/knowledge-bases/${kbId}/documents`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  },
  
  /**
   * 删除知识库文档
   * @param kbId 知识库ID
   * @param docId 文档ID
   */
  async deleteDocument(kbId: string, docId: string) {
    const response = await fetch(`${KNOWLEDGE_SERVICE_URL}/knowledge-bases/${kbId}/documents/${docId}`, {
      method: 'DELETE'
    });
    return response.json();
  },
  
  /**
   * 搜索知识库
   * @param kbId 知识库ID
   * @param searchRequest 搜索请求
   */
  async searchKnowledgeBase(kbId: string, searchRequest: SearchRequest) {
    const response = await fetch(`${KNOWLEDGE_SERVICE_URL}/knowledge-bases/${kbId}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(searchRequest)
    });
    return response.json();
  },
  
  /**
   * 获取可用的嵌入模型列表
   */
  async getEmbeddingModels() {
    const response = await fetch(`${KNOWLEDGE_SERVICE_URL}/knowledge-bases/models/embedding`);
    return response.json();
  },
  
  /**
   * 获取知识库统计信息
   */
  async getKnowledgeBaseStatistics() {
    const response = await fetch(`${KNOWLEDGE_SERVICE_URL}/knowledge-bases/statistics`);
    return response.json();
  },
  
  /**
   * 测试知识库搜索
   * @param kbId 知识库ID
   * @param testRequest 测试请求
   */
  async testKnowledgeBaseSearch(kbId: string, testRequest: {
    query: string;
    search_modes: string[];
    top_k?: number;
    similarity_threshold?: number;
  }) {
    const response = await fetch(`${KNOWLEDGE_SERVICE_URL}/knowledge-bases/${kbId}/search/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testRequest)
    });
    return response.json();
  },
  
  /**
   * 全局搜索测试
   * @param testRequest 全局搜索测试请求
   */
  async globalSearchTest(testRequest: {
    query: string;
    kb_ids: string[];
    search_mode: string;
    top_k?: number;
    similarity_threshold?: number;
  }) {
    const response = await fetch(`${KNOWLEDGE_SERVICE_URL}/knowledge-bases/search/global-test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testRequest)
    });
    return response.json();
  },
  
  /**
   * 批量创建知识库
   * @param knowledgeBases 知识库列表
   */
  async batchCreateKnowledgeBases(knowledgeBases: KnowledgeBaseCreateRequest[]) {
    const response = await fetch(`${KNOWLEDGE_SERVICE_URL}/knowledge-bases/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ knowledge_bases: knowledgeBases })
    });
    return response.json();
  },
  
  /**
   * 批量上传文档
   * @param uploadRequests 批量上传请求
   */
  async batchUploadDocuments(uploadRequests: DocumentUploadRequest[]) {
    const formData = new FormData();
    
    uploadRequests.forEach((request, index) => {
      formData.append(`requests[${index}][kb_id]`, request.kb_id);
      request.files.forEach(file => {
        formData.append(`requests[${index}][files]`, file);
      });
      if (request.chunk_size) formData.append(`requests[${index}][chunk_size]`, request.chunk_size.toString());
      if (request.chunk_overlap) formData.append(`requests[${index}][chunk_overlap]`, request.chunk_overlap.toString());
      if (request.chunk_strategy) formData.append(`requests[${index}][chunk_strategy]`, request.chunk_strategy);
      if (request.preserve_structure !== undefined) formData.append(`requests[${index}][preserve_structure]`, request.preserve_structure.toString());
    });
    
    const response = await fetch(`${KNOWLEDGE_SERVICE_URL}/knowledge-bases/batch/upload`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  },
  
  /**
   * 获取处理任务状态
   * @param taskId 任务ID
   */
  async getTaskStatus(taskId: string) {
    const response = await fetch(`${KNOWLEDGE_SERVICE_URL}/tasks/${taskId}`);
    return response.json();
  },
  
  /**
   * 健康检查
   */
  async healthCheck() {
    const response = await fetch(`${KNOWLEDGE_SERVICE_URL.replace('/api/v1', '')}/health`);
    return response.json();
  },

  /**
   * 获取切分策略列表
   */
  async getSplittingStrategies(params?: {
    type?: 'system' | 'custom' | 'all';
    search?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.search) queryParams.append('search', params.search);
    
    const response = await fetch(`${KNOWLEDGE_SERVICE_URL}/splitting-strategies?${queryParams}`);
    return response.json();
  },

  /**
   * 获取切分策略详情
   */
  async getSplittingStrategy(strategyId: string) {
    const response = await fetch(`${KNOWLEDGE_SERVICE_URL}/splitting-strategies/${strategyId}`);
    return response.json();
  },

  /**
   * 创建切分策略
   */
  async createSplittingStrategy(strategy: SplittingStrategyRequest) {
    const response = await fetch(`${KNOWLEDGE_SERVICE_URL}/splitting-strategies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(strategy)
    });
    return response.json();
  },

  /**
   * 更新切分策略
   */
  async updateSplittingStrategy(strategyId: string, strategy: Partial<SplittingStrategyRequest>) {
    const response = await fetch(`${KNOWLEDGE_SERVICE_URL}/splitting-strategies/${strategyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(strategy)
    });
    return response.json();
  },

  /**
   * 删除切分策略
   */
  async deleteSplittingStrategy(strategyId: string) {
    const response = await fetch(`${KNOWLEDGE_SERVICE_URL}/splitting-strategies/${strategyId}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  /**
   * 复制切分策略
   */
  async copySplittingStrategy(strategyId: string, newName?: string) {
    const response = await fetch(`${KNOWLEDGE_SERVICE_URL}/splitting-strategies/${strategyId}/copy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: newName })
    });
    return response.json();
  },

  /**
   * 测试切分策略
   */
  async testSplittingStrategy(strategyId: string, content: string) {
    const response = await fetch(`${KNOWLEDGE_SERVICE_URL}/splitting-strategies/${strategyId}/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    });
    return response.json();
  }
};

// 保持兼容性的旧API
export const knowledgeApi = {
  /**
   * 获取知识库列表
   */
  getKnowledgeBases() {
    return knowledgeServiceApi.getKnowledgeBases();
  },
  
  /**
   * 获取知识库详情
   */
  getKnowledgeBaseById(id: string) {
    return knowledgeServiceApi.getKnowledgeBaseById(id);
  },
  
  /**
   * 创建知识库
   */
  createKnowledgeBase(data: any) {
    return knowledgeServiceApi.createKnowledgeBase({
      name: data.name,
      description: data.description,
      embedding_provider: data.embedding_provider || 'siliconflow',
      embedding_model: data.embedding_model || 'Qwen/Qwen3-Embedding-8B',
      embedding_dimension: data.embedding_dimension || 8192,
      vector_store_type: data.vector_store_type || 'milvus',
      chunk_size: data.chunk_size || 1024,
      chunk_overlap: data.chunk_overlap || 128,
      similarity_threshold: data.similarity_threshold || 0.7,
      enable_hybrid_search: data.enable_hybrid_search ?? false,
      enable_agno_integration: data.enable_agno_integration ?? false,
      agno_search_type: data.agno_search_type || 'vector',
      settings: data.settings || {}
    });
  },
  
  /**
   * 更新知识库
   */
  updateKnowledgeBase(id: string, data: any) {
    return knowledgeServiceApi.updateKnowledgeBase(id, data);
  },
  
  /**
   * 删除知识库
   */
  deleteKnowledgeBase(id: string) {
    return knowledgeServiceApi.deleteKnowledgeBase(id);
  },
  
  /**
   * 获取知识库文件列表
   */
  getKnowledgeBaseFiles(knowledgeBaseId: string) {
    return knowledgeServiceApi.getKnowledgeBaseDocuments(knowledgeBaseId);
  },
  
  /**
   * 上传文件到知识库
   */
  uploadFile(knowledgeBaseId: string, file: File) {
    return knowledgeServiceApi.uploadDocuments(knowledgeBaseId, [file]);
  },
  
  /**
   * 删除知识库文件
   */
  deleteFile(knowledgeBaseId: string, fileId: string) {
    return knowledgeServiceApi.deleteDocument(knowledgeBaseId, fileId);
  }
};

export default knowledgeApi;
