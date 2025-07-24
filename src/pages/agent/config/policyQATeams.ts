import { AgentTeam, PolicyQATeamConfigs } from '../types/agentTeam';

// 政策问答场景 - 简单问答智能体团队配置
const POLICY_QA_SIMPLE_TEAM: AgentTeam = {
  id: 'policy_qa_simple',
  name: '政策问答 - 简单问答模式',
  description: '适用于常见政策咨询的快速响应团队，包含意图识别、联网检索和问答总结三个智能体',
  scenarioId: 'policy_qa',
  templateId: 'simple-qa',
  
  members: [
    {
      id: 'intent_agent',
      name: '意图识别智能体',
      description: '分析政策问题的意图和关键信息，识别问题类型',
      role: '问题分析',
      type: 'intent_recognition',
      
      modelConfig: {
        useUnifiedModel: true,
        temperature: 0.3,
        maxTokens: 1000,
        topP: 0.9
      },
      
      toolsConfig: {
        enabledTools: ['text_analysis', 'entity_extraction', 'intent_classifier'],
        toolSettings: {
          'intent_classifier': {
            categories: ['政策解读', '法规咨询', '合规检查', '申请流程', '政策变更'],
            confidence_threshold: 0.7
          }
        }
      },
      
      knowledgeConfig: {
        enabledKnowledgeBases: [],
        searchSettings: {
          topK: 5,
          threshold: 0.8,
          searchMode: 'semantic'
        }
      },
      
      systemPrompt: `你是一个专业的政策问题意图识别智能体。你的任务是：
1. 分析用户的政策相关问题
2. 识别问题的核心意图和类型
3. 提取关键的政策术语和实体
4. 判断问题的紧急程度和复杂度

请以JSON格式输出分析结果，包括：
- intent: 问题意图类型
- entities: 提取的关键实体
- keywords: 关键词列表
- urgency: 紧急程度(low/medium/high)
- complexity: 复杂度(simple/medium/complex)`
    },
    
    {
      id: 'web_search_agent',
      name: '联网检索智能体',
      description: '通过网络搜索获取最新的政策信息和官方文件',
      role: '信息获取',
      type: 'web_search',
      
      modelConfig: {
        useUnifiedModel: true,
        temperature: 0.2,
        maxTokens: 1500,
        topP: 0.8
      },
      
      toolsConfig: {
        enabledTools: ['web_search', 'government_site_crawler', 'policy_database_search'],
        toolSettings: {
          'web_search': {
            preferred_sources: ['gov.cn', '政府官网', '法律法规数据库'],
            max_results: 10,
            date_range: '1year'
          },
          'government_site_crawler': {
            target_sites: ['中国政府网', '国务院', '各部委官网'],
            crawl_depth: 2
          }
        }
      },
      
      knowledgeConfig: {
        enabledKnowledgeBases: [],
        searchSettings: {
          topK: 3,
          threshold: 0.75,
          searchMode: 'hybrid'
        }
      },
      
      systemPrompt: `你是一个专业的政策信息检索智能体。你的任务是：
1. 根据意图识别结果搜索相关政策信息
2. 优先检索官方政府网站和权威法规数据库
3. 筛选最新、最准确的政策文件和解读
4. 验证信息来源的权威性和时效性

检索时请注意：
- 优先使用官方渠道信息
- 关注政策的生效时间和适用范围
- 收集政策的背景和实施细则
- 注意政策的层级和管辖范围`
    },
    
    {
      id: 'qa_summary_agent',
      name: '问答总结及回答智能体',
      description: '整合检索到的信息，生成准确的政策问答回复',
      role: '答案生成',
      type: 'qa_summary',
      
      modelConfig: {
        useUnifiedModel: true,
        temperature: 0.4,
        maxTokens: 2000,
        topP: 0.9
      },
      
      toolsConfig: {
        enabledTools: ['text_summarization', 'answer_generation', 'fact_verification'],
        toolSettings: {
          'answer_generation': {
            format: 'structured',
            include_sources: true,
            confidence_level: 'high'
          },
          'fact_verification': {
            check_consistency: true,
            verify_dates: true,
            check_authority: true
          }
        }
      },
      
      knowledgeConfig: {
        enabledKnowledgeBases: [],
        searchSettings: {
          topK: 5,
          threshold: 0.8,
          searchMode: 'semantic'
        }
      },
      
      systemPrompt: `你是一个专业的政策问答总结智能体。你的任务是：
1. 整合意图识别和检索到的政策信息
2. 生成准确、权威的政策问答回复
3. 确保回答的合规性和时效性
4. 提供清晰的政策解读和操作指导

回答格式要求：
- 直接回答用户问题
- 提供具体的政策依据
- 说明适用条件和范围
- 包含相关的办事流程
- 标注信息来源和更新时间
- 如有不确定性，明确说明`
    }
  ],
  
  teamConfig: {
    executionMode: 'sequential',
    coordinationStrategy: 'chain',
    
    unifiedModelConfig: {
      providerId: 'zhipu',
      modelId: 'glm-4',
      temperature: 0.3,
      maxTokens: 2000,
      topP: 0.9,
      frequencyPenalty: 0.1,
      presencePenalty: 0.1
    },
    
    teamKnowledgeBases: ['policy_regulations', 'government_announcements'],
    teamTools: ['policy_search_engine', 'regulation_database']
  },
  
  workflow: {
    steps: [
      {
        stepId: 'step_1',
        agentId: 'intent_agent',
        nextSteps: ['step_2']
      },
      {
        stepId: 'step_2',
        agentId: 'web_search_agent',
        nextSteps: ['step_3']
      },
      {
        stepId: 'step_3',
        agentId: 'qa_summary_agent',
        nextSteps: []
      }
    ]
  }
};

// 政策问答场景 - 知识库问答智能体团队配置
const POLICY_QA_KNOWLEDGE_TEAM: AgentTeam = {
  id: 'policy_qa_knowledge',
  name: '政策问答 - 知识库问答模式',
  description: '结合本地知识库和联网搜索的综合政策问答团队，适用于复杂政策咨询',
  scenarioId: 'policy_qa',
  templateId: 'deep-thinking',
  
  members: [
    {
      id: 'question_decomp_agent',
      name: '意图识别及问答拆分智能体',
      description: '分析复杂政策问题并拆分为多个子问题进行处理',
      role: '问题分析与拆分',
      type: 'question_decomposition',
      
      modelConfig: {
        useUnifiedModel: true,
        temperature: 0.2,
        maxTokens: 1500,
        topP: 0.8
      },
      
      toolsConfig: {
        enabledTools: ['question_parser', 'intent_analyzer', 'task_decomposer'],
        toolSettings: {
          'question_parser': {
            max_sub_questions: 5,
            complexity_threshold: 'medium'
          },
          'task_decomposer': {
            decomposition_strategy: 'hierarchical',
            dependency_analysis: true
          }
        }
      },
      
      knowledgeConfig: {
        enabledKnowledgeBases: ['policy_taxonomy', 'question_patterns'],
        searchSettings: {
          topK: 3,
          threshold: 0.8,
          searchMode: 'semantic'
        }
      },
      
      systemPrompt: `你是专业的政策问题分析与拆分智能体。你需要：
1. 深度理解用户的复杂政策问题
2. 识别问题涉及的政策领域和层级
3. 将复杂问题拆分为具体的子问题
4. 分析各子问题之间的依赖关系
5. 制定问题处理的优先级和顺序

输出格式：
- main_intent: 主要问题意图
- sub_questions: 拆分的子问题列表
- dependencies: 问题依赖关系
- priority_order: 处理优先级
- required_info: 需要的信息类型`
    },
    
    {
      id: 'knowledge_retrieval_agent',
      name: '知识库检索智能体',
      description: '从本地政策知识库中检索相关文档和法规信息',
      role: '知识库检索',
      type: 'knowledge_retrieval',
      
      modelConfig: {
        useUnifiedModel: true,
        temperature: 0.1,
        maxTokens: 1000,
        topP: 0.7
      },
      
      toolsConfig: {
        enabledTools: ['vector_search', 'semantic_retrieval', 'policy_indexer'],
        toolSettings: {
          'vector_search': {
            similarity_threshold: 0.8,
            max_results: 15,
            rerank: true
          },
          'semantic_retrieval': {
            embedding_model: 'text-embedding-ada-002',
            chunk_size: 512,
            overlap: 50
          }
        }
      },
      
      knowledgeConfig: {
        enabledKnowledgeBases: ['policy_documents', 'regulations_db', 'legal_interpretations'],
        searchSettings: {
          topK: 10,
          threshold: 0.75,
          searchMode: 'semantic'
        }
      },
      
      systemPrompt: `你是专业的政策知识库检索智能体。你的职责：
1. 基于子问题在知识库中精确检索
2. 匹配最相关的政策文档和法规条文
3. 提取关键的政策条款和解释
4. 评估检索结果的相关性和准确性

检索策略：
- 优先检索官方政策原文
- 关注政策的适用性和时效性
- 提供多角度的政策解读
- 标注信息的权威级别和来源`
    },
    
    {
      id: 'web_search_knowledge_agent',
      name: '联网搜索智能体',
      description: '补充检索最新的政策信息和实时政策动态',
      role: '实时信息补充',
      type: 'web_search',
      
      modelConfig: {
        useUnifiedModel: true,
        temperature: 0.2,
        maxTokens: 1200,
        topP: 0.8
      },
      
      toolsConfig: {
        enabledTools: ['realtime_search', 'policy_news_crawler', 'official_updates'],
        toolSettings: {
          'realtime_search': {
            focus_recent: true,
            time_range: '6months',
            authority_sites_only: true
          },
          'policy_news_crawler': {
            sources: ['政策解读', '官方通知', '实施细则'],
            update_frequency: 'daily'
          }
        }
      },
      
      knowledgeConfig: {
        enabledKnowledgeBases: [],
        searchSettings: {
          topK: 5,
          threshold: 0.8,
          searchMode: 'hybrid'
        }
      },
      
      systemPrompt: `你是政策实时信息检索智能体。任务包括：
1. 检索最新的政策更新和变化
2. 获取政策实施的最新进展
3. 搜索相关的政策解读和案例
4. 验证知识库信息的时效性

重点关注：
- 政策的最新修订和更新
- 实施细则和操作指南
- 相关部门的最新通知
- 政策执行中的常见问题和解答`
    },
    
    {
      id: 'metadata_search_agent',
      name: '文档元数据检索智能体',
      description: '基于文档属性和元数据进行精确的政策文档检索',
      role: '精确文档定位',
      type: 'metadata_search',
      
      modelConfig: {
        useUnifiedModel: true,
        temperature: 0.1,
        maxTokens: 800,
        topP: 0.7
      },
      
      toolsConfig: {
        enabledTools: ['metadata_indexer', 'document_classifier', 'attribute_search'],
        toolSettings: {
          'metadata_indexer': {
            index_fields: ['document_type', 'issuing_authority', 'effective_date', 'policy_level'],
            boost_official: true
          },
          'document_classifier': {
            categories: ['法律', '法规', '规章', '政策', '通知', '解读'],
            classification_model: 'bert-policy-classifier'
          }
        }
      },
      
      knowledgeConfig: {
        enabledKnowledgeBases: ['document_metadata', 'policy_hierarchy'],
        searchSettings: {
          topK: 8,
          threshold: 0.85,
          searchMode: 'metadata'
        }
      },
      
      systemPrompt: `你是文档元数据检索专家。专门负责：
1. 基于文档属性精确定位政策文件
2. 识别文档的层级和权威性
3. 匹配特定类型的政策文档
4. 提供文档的详细属性信息

检索维度：
- 发布机关和级别
- 文档类型和分类
- 生效时间和适用范围
- 政策领域和主题标签
- 文档状态（现行/废止/修订）`
    },
    
    {
      id: 'comprehensive_summary_agent',
      name: '总结与回答智能体',
      description: '综合多源信息生成全面准确的政策问答回复',
      role: '综合回答生成',
      type: 'qa_summary',
      
      modelConfig: {
        useUnifiedModel: true,
        temperature: 0.3,
        maxTokens: 2500,
        topP: 0.9
      },
      
      toolsConfig: {
        enabledTools: ['multi_source_synthesis', 'answer_structuring', 'quality_check'],
        toolSettings: {
          'multi_source_synthesis': {
            weight_knowledge_base: 0.4,
            weight_web_search: 0.3,
            weight_metadata: 0.3,
            conflict_resolution: 'authority_priority'
          }
        }
      },
      
      knowledgeConfig: {
        enabledKnowledgeBases: ['answer_templates', 'quality_standards'],
        searchSettings: {
          topK: 3,
          threshold: 0.9,
          searchMode: 'template_match'
        }
      },
      
      systemPrompt: `你是综合政策问答专家。负责：
1. 整合来自多个智能体的信息
2. 生成结构化的完整答案
3. 确保答案的准确性和权威性
4. 提供实用的操作指导

答案结构：
- 直接回答：简明扼要的核心答案
- 政策依据：相关法规和政策条文
- 适用条件：明确的适用范围和条件
- 操作流程：具体的办事步骤和要求
- 注意事项：重要提醒和风险点
- 参考资料：权威来源和更新时间`
    }
  ],
  
  teamConfig: {
    executionMode: 'sequential',
    coordinationStrategy: 'tree',
    
    unifiedModelConfig: {
      providerId: 'zhipu',
      modelId: 'glm-4',
      temperature: 0.2,
      maxTokens: 2500,
      topP: 0.8,
      frequencyPenalty: 0.2,
      presencePenalty: 0.1
    },
    
    teamKnowledgeBases: ['comprehensive_policy_db', 'legal_documents', 'policy_interpretations'],
    teamTools: ['advanced_search_suite', 'policy_analyzer']
  },
  
  workflow: {
    steps: [
      {
        stepId: 'decomposition',
        agentId: 'question_decomp_agent',
        nextSteps: ['knowledge_search', 'web_search', 'metadata_search']
      },
      {
        stepId: 'knowledge_search',
        agentId: 'knowledge_retrieval_agent',
        nextSteps: ['final_summary']
      },
      {
        stepId: 'web_search',
        agentId: 'web_search_knowledge_agent',
        nextSteps: ['final_summary']
      },
      {
        stepId: 'metadata_search',
        agentId: 'metadata_search_agent',
        nextSteps: ['final_summary']
      },
      {
        stepId: 'final_summary',
        agentId: 'comprehensive_summary_agent',
        nextSteps: []
      }
    ]
  }
};

// 政策问答场景 - 深度思考智能体团队配置
const POLICY_QA_DEEP_THINKING_TEAM: AgentTeam = {
  id: 'policy_qa_deep_thinking',
  name: '政策问答 - 深度思考模式',
  description: '具备深度分析和验证能力的高级政策问答团队，适用于复杂政策分析和决策支持',
  scenarioId: 'policy_qa',
  templateId: 'intelligent-planning',
  
  members: [
    // 继承知识库问答团队的所有智能体
    ...POLICY_QA_KNOWLEDGE_TEAM.members,
    
    // 新增数据校验智能体
    {
      id: 'data_verification_agent',
      name: '数据校验智能体',
      description: '验证政策信息的准确性、一致性和权威性',
      role: '信息验证',
      type: 'data_verification',
      
      modelConfig: {
        useUnifiedModel: true,
        temperature: 0.1,
        maxTokens: 1200,
        topP: 0.7
      },
      
      toolsConfig: {
        enabledTools: ['fact_checker', 'source_validator', 'consistency_analyzer', 'authority_verifier'],
        toolSettings: {
          'fact_checker': {
            cross_reference_sources: 3,
            confidence_threshold: 0.9,
            flag_inconsistencies: true
          },
          'authority_verifier': {
            government_sources_only: true,
            check_document_authenticity: true,
            verify_publication_status: true
          }
        }
      },
      
      knowledgeConfig: {
        enabledKnowledgeBases: ['authoritative_sources', 'fact_check_database'],
        searchSettings: {
          topK: 5,
          threshold: 0.9,
          searchMode: 'exact_match'
        }
      },
      
      systemPrompt: `你是专业的政策信息验证智能体。核心职责：
1. 验证政策信息的真实性和准确性
2. 检查信息来源的权威性和可靠性
3. 识别信息中的矛盾和不一致之处
4. 标注信息的可信度和风险等级

验证标准：
- 来源权威性：官方发布 > 权威媒体 > 一般来源
- 时效性检查：当前有效 > 历史版本 > 已废止
- 一致性验证：跨源对比，识别冲突
- 完整性评估：信息的完整度和准确度

输出格式：
- verification_result: 验证结果(通过/警告/失败)
- confidence_score: 可信度评分(0-100)
- risk_flags: 风险标记列表
- source_quality: 来源质量评级`
    },
    
    // 新增结果优化智能体
    {
      id: 'result_optimization_agent',
      name: '结果优化智能体',
      description: '优化最终回答的质量、结构和用户体验',
      role: '结果优化',
      type: 'result_optimization',
      
      modelConfig: {
        useUnifiedModel: true,
        temperature: 0.4,
        maxTokens: 2000,
        topP: 0.9
      },
      
      toolsConfig: {
        enabledTools: ['content_optimizer', 'structure_enhancer', 'readability_improver', 'format_beautifier'],
        toolSettings: {
          'content_optimizer': {
            target_audience: 'general_public',
            complexity_level: 'moderate',
            include_examples: true
          },
          'structure_enhancer': {
            use_bullet_points: true,
            add_headers: true,
            logical_flow: true
          },
          'readability_improver': {
            target_reading_level: 'high_school',
            use_plain_language: true,
            explain_jargon: true
          }
        }
      },
      
      knowledgeConfig: {
        enabledKnowledgeBases: ['writing_standards', 'user_experience_patterns'],
        searchSettings: {
          topK: 3,
          threshold: 0.8,
          searchMode: 'template_based'
        }
      },
      
      systemPrompt: `你是专业的政策问答结果优化专家。负责：
1. 优化回答的结构和逻辑性
2. 提升内容的可读性和易理解性
3. 完善回答的完整性和实用性
4. 确保回答符合用户体验标准

优化重点：
- 结构清晰：层次分明，逻辑清楚
- 语言通俗：避免过度专业化，适合大众理解
- 内容完整：涵盖核心要点，提供实用指导
- 格式美观：合理排版，突出重点
- 操作性强：提供具体的行动建议

最终输出应包括：
- 优化后的完整回答
- 回答质量评分
- 改进说明和建议
- 用户友好度评级`
    }
  ],
  
  teamConfig: {
    executionMode: 'conditional',
    coordinationStrategy: 'graph',
    
    unifiedModelConfig: {
      providerId: 'zhipu',
      modelId: 'glm-4-plus',
      temperature: 0.2,
      maxTokens: 3000,
      topP: 0.8,
      frequencyPenalty: 0.3,
      presencePenalty: 0.2
    },
    
    teamKnowledgeBases: ['premium_policy_db', 'expert_interpretations', 'case_studies'],
    teamTools: ['advanced_analysis_suite', 'quality_assurance_tools']
  },
  
  workflow: {
    steps: [
      {
        stepId: 'decomposition',
        agentId: 'question_decomp_agent',
        nextSteps: ['knowledge_search', 'web_search', 'metadata_search']
      },
      {
        stepId: 'knowledge_search',
        agentId: 'knowledge_retrieval_agent',
        nextSteps: ['verification']
      },
      {
        stepId: 'web_search',
        agentId: 'web_search_knowledge_agent',
        nextSteps: ['verification']
      },
      {
        stepId: 'metadata_search',
        agentId: 'metadata_search_agent',
        nextSteps: ['verification']
      },
      {
        stepId: 'verification',
        agentId: 'data_verification_agent',
        nextSteps: ['summary'],
        conditions: [
          {
            condition: 'verification_passed',
            nextStep: 'summary'
          },
          {
            condition: 'verification_failed',
            nextStep: 'additional_search'
          }
        ]
      },
      {
        stepId: 'summary',
        agentId: 'comprehensive_summary_agent',
        nextSteps: ['optimization']
      },
      {
        stepId: 'optimization',
        agentId: 'result_optimization_agent',
        nextSteps: []
      }
    ]
  }
};

// 导出政策问答团队配置
export const POLICY_QA_TEAM_CONFIGS: PolicyQATeamConfigs = {
  simpleQA: POLICY_QA_SIMPLE_TEAM,
  knowledgeQA: POLICY_QA_KNOWLEDGE_TEAM,
  deepThinking: POLICY_QA_DEEP_THINKING_TEAM
}; 