// 知识库相关类型定义

import { BaseEntity, PaginationResponse, FileUploadInfo, SearchResult } from './common';

export interface KnowledgeBase extends BaseEntity {
  name: string;
  description?: string;
  category?: string;
  status: 'active' | 'inactive' | 'maintenance';
  owner_id: number;
  is_public: boolean;
  tags: string[];
  
  // 配置信息
  chunking_strategy: string;
  chunk_size: number;
  chunk_overlap: number;
  language: string;
  embedding_model: string;
  vector_store: string;
  
  // 统计信息
  document_count: number;
  chunk_count: number;
  size_bytes: number;
  last_updated?: string;
  
  // 进度信息
  progress_percentage: number;
  processing_status: 'idle' | 'processing' | 'completed' | 'failed';
  
  // Agno配置
  agno_config?: Record<string, any>;
  
  // 权限设置
  public_read: boolean;
  public_write: boolean;
}

export interface KnowledgeBaseCreateRequest {
  name: string;
  description?: string;
  category?: string;
  chunking_strategy?: string;
  chunk_size?: number;
  chunk_overlap?: number;
  language?: string;
  embedding_model?: string;
  vector_store?: string;
  is_public?: boolean;
  tags?: string[];
  agno_config?: Record<string, any>;
  public_read?: boolean;
  public_write?: boolean;
}

export interface KnowledgeBaseUpdateRequest {
  name?: string;
  description?: string;
  category?: string;
  chunking_strategy?: string;
  chunk_size?: number;
  chunk_overlap?: number;
  language?: string;
  embedding_model?: string;
  is_public?: boolean;
  tags?: string[];
  agno_config?: Record<string, any>;
}

export interface Document extends BaseEntity {
  title: string;
  content: string;
  knowledge_base_id: string;
  file_url?: string;
  file_type?: string;
  file_size?: number;
  metadata: Record<string, any>;
  
  // 处理状态
  status: 'pending' | 'processing' | 'completed' | 'failed';
  chunk_count: number;
  processing_error?: string;
  
  // 向量化信息
  embedding_status: 'pending' | 'processing' | 'completed' | 'failed';
  vector_count: number;
}

export interface DocumentCreateRequest {
  title: string;
  content: string;
  metadata?: Record<string, any>;
  auto_chunk?: boolean;
  auto_vectorize?: boolean;
  auto_index?: boolean;
}

export interface DocumentUploadRequest {
  title: string;
  file: FileUploadInfo;
  metadata?: Record<string, any>;
  auto_chunk?: boolean;
  auto_vectorize?: boolean;
  auto_index?: boolean;
}

export interface DocumentChunk extends BaseEntity {
  document_id: string;
  content: string;
  chunk_index: number;
  metadata: Record<string, any>;
  
  // 向量信息
  embedding?: number[];
  embedding_model?: string;
  similarity_score?: number;
}

export interface DocumentSearchRequest {
  query: string;
  knowledge_base_id?: string;
  top_k?: number;
  filter_criteria?: Record<string, any>;
  include_metadata?: boolean;
  include_content?: boolean;
  similarity_threshold?: number;
}

export interface DocumentSearchResult {
  documents: Document[];
  chunks: DocumentChunk[];
  total: number;
  query: string;
  took_ms: number;
}

// 知识图谱相关
export interface KnowledgeGraph {
  id: string;
  knowledge_base_id: string;
  name: string;
  description?: string;
  
  // 图谱配置
  entity_types: string[];
  relation_types: string[];
  extraction_model: string;
  
  // 统计信息
  entity_count: number;
  relation_count: number;
  last_updated?: string;
  
  // 处理状态
  status: 'building' | 'ready' | 'updating' | 'failed';
  progress?: number;
}

export interface GraphEntity {
  id: string;
  type: string;
  label: string;
  properties: Record<string, any>;
  source_documents: string[];
}

export interface GraphRelation {
  id: string;
  type: string;
  source_entity_id: string;
  target_entity_id: string;
  properties: Record<string, any>;
  confidence: number;
  source_documents: string[];
}

export interface GraphSearchRequest {
  query: string;
  entity_types?: string[];
  relation_types?: string[];
  max_depth?: number;
  max_nodes?: number;
}

export interface GraphSearchResult {
  entities: GraphEntity[];
  relations: GraphRelation[];
  query: string;
  subgraph_id?: string;
}

// 向量模板相关
export interface VectorTemplate {
  id: string;
  name: string;
  description?: string;
  template_type: string;
  config: Record<string, any>;
  is_system: boolean;
  created_by: number;
}

export interface ChunkingStrategy {
  name: string;
  description: string;
  parameters: {
    chunk_size: {
      default: number;
      min: number;
      max: number;
      description: string;
    };
    chunk_overlap: {
      default: number;
      min: number;
      max: number;
      description: string;
    };
    [key: string]: any;
  };
}

export interface EmbeddingModel {
  name: string;
  provider: string;
  dimensions: number;
  max_tokens: number;
  cost_per_token?: number;
  description?: string;
  supported_languages?: string[];
}

export interface VectorStore {
  name: string;
  type: string;
  description?: string;
  capabilities: string[];
  config_schema?: Record<string, any>;
} 