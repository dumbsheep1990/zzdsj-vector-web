// Tool类型定义
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon?: React.ReactNode;
  tags?: string[];
  // 新增属性
  isAdvanced?: boolean; // 是否为高级工具
  isPremium?: boolean; // 是否为付费工具
  complexity?: 'low' | 'medium' | 'high'; // 复杂度
  provider?: string; // 提供商
  version?: string; // 版本
  apiEndpoint?: string; // API端点
  documentation?: string; // 文档链接
  isEnabled?: boolean; // 是否启用
  // 配置参数
  config?: Record<string, unknown>;
  // 权限要求
  permissions?: string[];
  // 依赖关系
  dependencies?: string[];
}

// 工具类别 - 扩展为更多实际的工具类别
export enum ToolCategory {
  SEARCH = 'search', // 搜索工具
  RETRIEVAL = 'retrieval', // 检索工具  
  REASONING = 'reasoning', // 推理工具
  MULTIMODAL = 'multimodal', // 多模态工具
  INTEGRATION = 'integration', // 集成工具
  KNOWLEDGE = 'knowledge', // 知识处理工具
  WEB = 'web', // 网页工具
  DEVELOPMENT = 'development', // 开发工具
  DOCUMENT = 'document', // 文档工具
  MULTIMEDIA = 'multimedia' // 多媒体工具
}

// 知识库检索配置接口
export interface KnowledgeBaseRetrievalConfig {
  // 检索策略
  strategy: 'vector' | 'keyword' | 'hybrid'; // 向量检索、关键词检索、混合检索
  
  // 向量检索参数
  vectorParams: {
    topK: number; // 返回结果数量，默认5
    scoreThreshold: number; // 相似度阈值，默认0.7
    includeMetadata: boolean; // 是否包含元数据
  };
  
  // 关键词检索参数
  keywordParams: {
    topK: number; // 返回结果数量，默认3
    boost: number; // 权重提升，默认1.0
  };
  
  // RRF (Reciprocal Rank Fusion) 参数
  rrfParams: {
    enabled: boolean; // 是否启用RRF
    k: number; // RRF参数k值，默认60
    vectorWeight: number; // 向量检索权重，默认0.6
    keywordWeight: number; // 关键词检索权重，默认0.4
  };
  
  // 索引配置
  indexConfig: {
    type: 'IVF_PQ' | 'HNSW' | 'IVF_FLAT' | 'FLAT'; // 索引类型
    dimension: number; // 向量维度
    metric: 'cosine' | 'euclidean' | 'dot_product'; // 距离度量
    // IVF_PQ 特有参数
    ivfPqParams?: {
      nlist: number; // 聚类中心数量，默认100
      nprobe: number; // 搜索的聚类数量，默认10
      m: number; // PQ编码的子向量数量，默认8
      nbits: number; // 每个子向量的bit数，默认8
    };
    // HNSW 特有参数
    hnswParams?: {
      M: number; // 每个节点的最大连接数，默认16
      efConstruction: number; // 构建时的动态列表大小，默认200
      efSearch: number; // 搜索时的动态列表大小，默认64
    };
  };
}

// 知识库类型
export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  documentCount: number;
  category?: string; // 知识库分类
  tags?: string[]; // 标签
  lastUpdated?: string; // 最后更新时间
  size?: number; // 知识库大小(MB)
  status?: 'active' | 'indexing' | 'error' | 'inactive'; // 状态
  
  // 检索配置
  retrievalConfig?: KnowledgeBaseRetrievalConfig;
  
  // 元数据
  metadata?: {
    creator: string; // 创建者
    createdAt: string; // 创建时间
    version: string; // 版本
    description: string; // 详细描述
  };
}

// 智能体配置类型
export interface AgentConfig {
  id?: string;
  name: string;
  description: string;
  // 新增基础信息字段
  agentType: string; // 智能体类型（chat、knowledge、code等）
  icon: string; // 图标类型
  tags: string[]; // 标签列表
  language: string; // 主要语言
  isPublic: boolean; // 可见性设置
  // 系统提示词、工具和知识库设置
  systemPrompt: string;
  selectedTools: Tool[];
  selectedKnowledgeBases: KnowledgeBase[];
  advanced: {
    temperature: number;
    maxTokens: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
    contextCompression: boolean;
  };
}

// 提示词模板类别枚举
export enum PromptCategory {
  GENERAL = 'general',
  CODING = 'coding',
  ANALYSIS = 'analysis',
  WRITING = 'writing',
  ROLEPLAY = 'roleplay'
}

// 提示词变量接口
export interface PromptVariable {
  name: string;
  description: string;
  defaultValue?: string;
  required: boolean;
}

// 提示词模板接口
export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  category: PromptCategory;
  content: string;
  isSystem: boolean;
  variables?: PromptVariable[];
}
