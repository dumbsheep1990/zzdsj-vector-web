import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grow,
  Chip,
} from '@mui/material';
import {
  MessageOutlined,
  BulbOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import { GradientCard } from '../../../components/ui/gradient-card';

// 智能体模板类型定义（基于后端的TemplateType）
export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  detailedDescription: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  features: string[];
  useCases: string[];
  tags: string[];
  agentType: string;
  // 后端配置信息
  defaultTools: string[];
  recommendedModels: string[];
  costTier: 'low' | 'medium' | 'high';
  complexity: 'low' | 'medium' | 'high';
  executionGraph?: any; // 执行图配置
}

// 三种内置智能体模板（对应后端的三种模版）
const AGENT_TEMPLATES: AgentTemplate[] = [
  {
    id: 'basic_conversation',
    name: '基础对话模版',
    description: '提供流畅的多轮对话体验，支持上下文理解和个性化响应',
    detailedDescription: '专为日常对话和客户服务设计的轻量级智能体。具备优秀的上下文理解能力，能够进行自然流畅的多轮对话，同时支持基础的信息检索和计算功能。',
    icon: <MessageOutlined style={{ fontSize: '32px' }} />,
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #8b5cf6 100%)',
    features: [
      '多轮对话上下文理解',
      '个性化响应生成',
      '基础信息检索',
      '实时计算支持',
      '天气信息查询'
    ],
    useCases: [
      '客户服务',
      '日常聊天',
      '简单咨询'
    ],
    tags: ['对话', '客服', '轻量级'],
    agentType: 'basic_conversation',
    defaultTools: ['search', 'calculator', 'datetime', 'weather'],
    recommendedModels: ['gpt-4o-mini', 'claude-3-haiku'],
    costTier: 'low',
    complexity: 'low'
  },
  {
    id: 'knowledge_base',
    name: '知识库问答模版',
    description: '基于组织知识库提供准确、可信的问答服务，支持引用和溯源',
    detailedDescription: '专业的知识库问答智能体，能够基于企业内部文档和知识库提供精准答案。具备强大的文档检索、内容分析和引用生成能力，确保回答的准确性和可追溯性。',
    icon: <BulbOutlined style={{ fontSize: '32px' }} />,
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #38bdf8 100%)',
    features: [
      '智能文档检索',
      '内容深度分析',
      '自动引用生成',
      '答案可信度评估',
      '多格式文档支持'
    ],
    useCases: [
      '技术支持',
      '产品咨询',
      '政策解读',
      '文档查询'
    ],
    tags: ['知识库', '问答', '专业'],
    agentType: 'knowledge_base',
    defaultTools: ['knowledge_search', 'document_analyzer', 'citation_generator', 'fact_checker'],
    recommendedModels: ['gpt-4', 'claude-3-opus'],
    costTier: 'medium',
    complexity: 'medium'
  },
  {
    id: 'deep_thinking',
    name: '深度思考模版',
    description: '处理复杂分析任务，支持多步推理、协作团队和决策支持',
    detailedDescription: '高级分析智能体，专门处理复杂的思考和决策任务。支持多步骤推理、任务分解、团队协作等高级功能，能够为复杂业务场景提供深度洞察和决策支持。',
    icon: <ProjectOutlined style={{ fontSize: '32px' }} />,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)',
    features: [
      '多步骤推理链',
      '复杂任务分解',
      '数据深度分析',
      '团队协作支持',
      '决策路径规划'
    ],
    useCases: [
      '战略分析',
      '研究报告',
      '决策支持',
      '复杂问题解决'
    ],
    tags: ['深度思考', '分析', '决策'],
    agentType: 'deep_thinking',
    defaultTools: ['reasoning', 'research', 'data_analysis', 'collaboration', 'planning'],
    recommendedModels: ['gpt-4', 'claude-3-opus'],
    costTier: 'high',
    complexity: 'high'
  }
];

interface TemplateSelectionStepProps {
  onTemplateSelect: (template: AgentTemplate) => void;
  selectedTemplate?: string;
  onNext?: () => void;
}

const TemplateSelectionStep: React.FC<TemplateSelectionStepProps> = ({
  onTemplateSelect,
  selectedTemplate,
  onNext
}) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleTemplateSelect = (template: AgentTemplate) => {
    onTemplateSelect(template);
    // 自动进入下一步
    if (onNext) {
      setTimeout(() => {
        onNext();
      }, 300);
    }
  };

  const selectedTemplateData = AGENT_TEMPLATES.find(t => t.id === selectedTemplate);

  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        p: 2,
        position: 'relative',
      }}
    >
      {/* 步骤标题 */}
      <Box sx={{ textAlign: 'center', mb: 2, flexShrink: 0 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          mb: 2
        }}>
          {/* 标题徽章 */}
          <Box sx={{
            px: 3,
            py: 1.5,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* 背景装饰渐变 */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(14, 165, 233, 0.05) 50%, rgba(245, 158, 11, 0.05) 100%)',
              zIndex: -1
            }} />
            
            {/* 标题文字 */}
            <Typography sx={{
              fontSize: '1.2rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.02em',
              lineHeight: 1
            }}>
              步骤 1：选择智能体模版
            </Typography>
          </Box>
        </Box>
        
        {/* 副标题描述 */}
        <Typography variant="body2" color="text.secondary" sx={{ 
          mb: 1.5,
          fontWeight: 400,
          maxWidth: '600px',
          mx: 'auto',
          lineHeight: 1.6,
          fontSize: '0.9rem',
          opacity: 0.8
        }}>
          选择最适合您业务场景的智能体模版，每种模版都经过专业优化
        </Typography>
        
        {/* 功能标签 */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1.5,
          mb: 1
        }}>
          {[
            { icon: '💬', text: '基础对话', color: '#6366f1', tier: '低成本' },
            { icon: '🧠', text: '知识问答', color: '#0ea5e9', tier: '中成本' },
            { icon: '🔧', text: '深度思考', color: '#f59e0b', tier: '高级版' }
          ].map((item, index) => (
            <Box key={index} sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 2,
              py: 0.5,
              background: `linear-gradient(135deg, ${item.color}15 0%, ${item.color}08 100%)`,
              borderRadius: '12px',
              border: `1px solid ${item.color}20`,
              fontSize: '0.75rem',
              fontWeight: 600,
              color: item.color,
              backdropFilter: 'blur(10px)',
              flexDirection: 'column',
              minWidth: '80px'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <span style={{ fontSize: '12px' }}>{item.icon}</span>
                <span>{item.text}</span>
              </Box>
              <Typography variant="caption" sx={{ 
                fontSize: '0.6rem', 
                opacity: 0.7,
                color: 'inherit'
              }}>
                {item.tier}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* 已选择模版提示 */}
      {selectedTemplateData && (
        <Box sx={{ 
          mb: 2, 
          textAlign: 'center',
          flexShrink: 0 
        }}>
          <Chip
            label={`已选择：${selectedTemplateData.name}`}
            color="primary"
            variant="filled"
            sx={{
              background: selectedTemplateData.gradient,
              color: 'white',
              fontWeight: 600,
              '& .MuiChip-label': {
                px: 2
              }
            }}
          />
        </Box>
      )}

      {/* 模板卡片网格 */}
      <Box sx={{ 
        flex: 1,
        overflow: 'auto',
        display: 'flex',
        justifyContent: 'center',
        pt: 2,
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden'
      }}>
        <Box sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 3,
          maxWidth: '1400px',
          width: '100%',
          alignContent: 'flex-start',
          padding: '24px 16px 80px',
          '& > div': {
            flexBasis: 'calc(33.333% - 16px)',
            minWidth: '350px',
            maxWidth: '420px',
            '@media (max-width: 1200px)': {
              flexBasis: 'calc(50% - 12px)',
            },
            '@media (max-width: 768px)': {
              flexBasis: '100%',
              maxWidth: '100%'
            }
          }
        }}>
          {AGENT_TEMPLATES.map((template, index) => {
            const isSelected = selectedTemplate === template.id;

            return (
              <Box key={template.id}>
                <Grow in timeout={300 + index * 100}>
                  <div>
                    <GradientCard
                      title={template.name}
                      description={template.description}
                      detailedDescription={template.detailedDescription}
                      icon={template.icon}
                      color={template.color}
                      gradient={template.gradient}
                      features={template.features}
                      useCases={template.useCases}
                      isSelected={isSelected}
                      onSelect={() => handleTemplateSelect(template)}
                      onMouseEnter={() => setHoveredCard(template.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      // 添加额外信息
                      extraInfo={
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              成本等级
                            </Typography>
                            <Chip
                              label={template.costTier === 'low' ? '低' : template.costTier === 'medium' ? '中' : '高'}
                              size="small"
                              color={template.costTier === 'low' ? 'success' : template.costTier === 'medium' ? 'warning' : 'error'}
                              sx={{ height: '18px', fontSize: '0.7rem' }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              复杂度
                            </Typography>
                            <Chip
                              label={template.complexity === 'low' ? '简单' : template.complexity === 'medium' ? '中等' : '复杂'}
                              size="small"
                              color={template.complexity === 'low' ? 'info' : template.complexity === 'medium' ? 'warning' : 'secondary'}
                              sx={{ height: '18px', fontSize: '0.7rem' }}
                            />
                          </Box>
                        </Box>
                      }
                    />
                  </div>
                </Grow>
              </Box>
            );
          })}
        </Box>
      </Box>
      
      {/* 底部提示 */}
      <Box sx={{ 
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        py: 2,
        gap: 1.5
      }}>
        {/* 渐变分割线 */}
        <Box sx={{
          width: '300px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, #6366f1 25%, #0ea5e9 50%, #f59e0b 75%, transparent 100%)'
        }} />
        
        {/* 提示文字 */}
        <Typography variant="caption" sx={{
          color: '#6b7280',
          fontSize: '0.7rem',
          fontWeight: 400,
          letterSpacing: '0.02em',
          textAlign: 'center'
        }}>
          {selectedTemplate ? '模版已选择，系统将自动进入下一步' : '请选择一个模版开始配置您的智能体'}
        </Typography>
      </Box>
    </Box>
  );
};

export default TemplateSelectionStep; 