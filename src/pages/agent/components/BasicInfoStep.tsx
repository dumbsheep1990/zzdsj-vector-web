import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grow,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  MessageOutlined,
  BulbOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import { GradientCard } from '../../../components/ui/gradient-card';
import { agentService, TemplateResponse } from '../../../services/agentService';

// 智能体模板类型定义
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
}

// 三种核心智能体模板框架
const AGENT_TEMPLATES: AgentTemplate[] = [
  {
    id: 'simple-qa',
    name: '简单问答智能体',
    description: '快速响应的轻量级问答助手',
    detailedDescription: '轻量级快速响应智能体，专注简洁准确回答。优化推理引擎确保毫秒级响应，低资源消耗，完美适配日常咨询场景。',
    icon: <MessageOutlined style={{ fontSize: '32px' }} />,
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #8b5cf6 100%)',
    features: [
      '毫秒级响应速度',
      '直接准确回答',
      '轻量化架构',
      '高并发支持',
      '成本效益优化'
    ],
    useCases: [
      '日常咨询服务',
      '标准化问答',
      '信息快速检索'
    ],
    tags: ['快速问答', '轻量级', '高效率'],
    agentType: 'simple-qa'
  },
  {
    id: 'deep-thinking',
    name: '深度思考智能体',
    description: '具备复杂推理能力的分析专家',
    detailedDescription: '高级推理分析智能体，擅长复杂问题深度思考。多步骤逻辑链、多角度分析，为复杂决策提供专业洞察。',
    icon: <BulbOutlined style={{ fontSize: '32px' }} />,
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #38bdf8 100%)',
    features: [
      '多步骤推理链',
      '逻辑分析能力',
      '创新思维生成',
      '多角度思考',
      '深度洞察分析'
    ],
    useCases: [
      '深度分析研究',
      '战略规划制定',
      '创新解决方案'
    ],
    tags: ['深度分析', '逻辑推理', '专业咨询'],
    agentType: 'deep-thinking'
  },
  {
    id: 'intelligent-planning',
    name: '智能规划智能体',
    description: '自动化任务编排和执行管理专家',
    detailedDescription: '自动化规划智能体，专精任务分解与流程优化。智能拆解复杂目标，动态调整执行策略，助力企业效率提升。',
    icon: <ProjectOutlined style={{ fontSize: '32px' }} />,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)',
    features: [
      '智能任务分解',
      '动态流程规划',
      '执行进度监控',
      '异常自动处理',
      '资源优化配置'
    ],
    useCases: [
      '流程自动化管理',
      '任务智能调度',
      '系统集成协调'
    ],
    tags: ['任务规划', '流程管理', '自动化'],
    agentType: 'intelligent-planning'
  }
];

interface BasicInfoStepProps {
  onTemplateSelect: (template: AgentTemplate) => void;
  selectedTemplate?: string;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  onTemplateSelect,
  selectedTemplate
}) => {
  const [templates, setTemplates] = useState<TemplateResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载模板数据
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true);
        const templatesData = await agentService.getTemplates();
        setTemplates(templatesData);
      } catch (error) {
        console.error('加载模板失败:', error);
        // 使用默认模板作为回退
        console.log('使用默认mock模板进行测试');
        setTemplates([
          {
            template_id: 'simple-qa' as any,
            name: '简单问答智能体',
            description: '快速响应的轻量级问答助手',
            use_cases: ['日常咨询服务', '标准化问答', '信息快速检索'],
            estimated_cost: 'standard',
            capabilities: ['毫秒级响应速度', '直接准确回答', '轻量化架构', '高并发支持', '成本效益优化'],
            default_tools: ['text-analyzer'],
            level: 1
          },
          {
            template_id: 'deep-thinking' as any,
            name: '深度思考智能体',
            description: '具备复杂推理能力的分析专家',
            use_cases: ['深度分析研究', '战略规划制定', '创新解决方案'],
            estimated_cost: 'premium',
            capabilities: ['多步骤推理链', '逻辑分析能力', '创新思维生成', '多角度思考', '深度洞察分析'],
            default_tools: ['text-analyzer', 'data-analysis'],
            level: 2
          },
          {
            template_id: 'intelligent-planning' as any,
            name: '智能规划智能体',
            description: '自动化任务编排和执行管理专家',
            use_cases: ['流程自动化管理', '任务智能调度', '系统集成协调'],
            estimated_cost: 'enterprise',
            capabilities: ['智能任务分解', '动态流程规划', '执行进度监控', '异常自动处理', '资源优化配置'],
            default_tools: ['web-search', 'data-analysis', 'api-call'],
            level: 3
          }
        ]);
        setError(null); // 清除错误状态
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  // 转换API数据为本地格式
  const getIconForTemplate = (templateId: string) => {
    switch (templateId) {
      case 'simple-qa':
        return <MessageOutlined style={{ fontSize: '32px' }} />;
      case 'deep-thinking':
        return <BulbOutlined style={{ fontSize: '32px' }} />;
      case 'intelligent-planning':
        return <ProjectOutlined style={{ fontSize: '32px' }} />;
      default:
        return <MessageOutlined style={{ fontSize: '32px' }} />;
    }
  };

  const getColorForTemplate = (templateId: string) => {
    switch (templateId) {
      case 'simple-qa':
        return '#6366f1';
      case 'deep-thinking':
        return '#0ea5e9';
      case 'intelligent-planning':
        return '#f59e0b';
      default:
        return '#6366f1';
    }
  };

  const getGradientForTemplate = (templateId: string) => {
    switch (templateId) {
      case 'simple-qa':
        return 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #8b5cf6 100%)';
      case 'deep-thinking':
        return 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #38bdf8 100%)';
      case 'intelligent-planning':
        return 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)';
      default:
        return 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #8b5cf6 100%)';
    }
  };

  // 将API模板转换为本地格式
  const convertToAgentTemplate = (template: TemplateResponse): AgentTemplate => ({
    id: template.template_id,
    name: template.name,
    description: template.description,
    detailedDescription: template.description,
    icon: getIconForTemplate(template.template_id),
    color: getColorForTemplate(template.template_id),
    gradient: getGradientForTemplate(template.template_id),
    features: template.capabilities,
    useCases: template.use_cases,
    tags: [template.estimated_cost],
    agentType: template.template_id
  });

  // 处理模板选择
  const handleTemplateSelect = (template: AgentTemplate) => {
    onTemplateSelect(template);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
        gap: 2
      }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          正在加载智能体模板...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        height: '100%', // 使用100%高度而非min-h-screen
        overflow: 'hidden', // 防止内容溢出
        p: 2,
        position: 'relative', // 为绝对定位的底部装饰提供定位上下文
      }}
    >
      {/* 美化的页面标题 */}
      <Box sx={{ textAlign: 'center', mb: 2, flexShrink: 0 }}>
        {/* 简化的主标题 */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1.5,
          mb: 2
        }}>
          {/* 标题徽章 - 简洁现代风格 */}
          <Box sx={{
            px: 2.5,
            py: 1,
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.08)',
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
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(14, 165, 233, 0.03) 50%, rgba(245, 158, 11, 0.03) 100%)',
              zIndex: -1
            }} />
            
            {/* 标题文字 */}
            <Typography sx={{
              fontSize: '0.95rem',
              fontWeight: 500,
              color: '#374151',
              letterSpacing: '0.01em',
              lineHeight: 1.5
            }}>
              选择智能体模板
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
          根据您的具体需求选择合适的智能体类型，每种模板都针对特定场景进行了优化
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
            { icon: '💬', text: '简单问答', color: '#6366f1' },
            { icon: '🧠', text: '深度思考', color: '#0ea5e9' },
            { icon: '📋', text: '智能规划', color: '#f59e0b' }
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
              backdropFilter: 'blur(10px)'
            }}>
              <span style={{ fontSize: '12px' }}>{item.icon}</span>
              <span>{item.text}</span>
            </Box>
          ))}
        </Box>
      </Box>

      {/* 模板卡片网格 */}
      <Box sx={{ 
        flex: 1,
        overflow: 'auto', // 启用内部滚动
        display: 'flex',
        justifyContent: 'center',
        pt: 2, // 进一步增加顶部边距，为卡片hover和阴影预留空间
        // 优化滚动性能
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
          padding: '24px 16px 80px', // 增加底部padding为底部装饰留出空间
          // 响应式布局
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
          {templates.length > 0 ? templates.map((template, index) => {
            const agentTemplate = convertToAgentTemplate(template);
            const isSelected = selectedTemplate === agentTemplate.id;

            return (
              <Box key={agentTemplate.id}>
                <Grow in timeout={300 + index * 100}>
                  <div>
                    <GradientCard
                      title={agentTemplate.name}
                      description={agentTemplate.description}
                      detailedDescription={agentTemplate.detailedDescription}
                      icon={agentTemplate.icon}
                      color={agentTemplate.color}
                      gradient={agentTemplate.gradient}
                      features={agentTemplate.features}
                      useCases={agentTemplate.useCases}
                      isSelected={isSelected}
                      onSelect={() => handleTemplateSelect(agentTemplate)}
                    />
                  </div>
                </Grow>
              </Box>
            );
          }) : AGENT_TEMPLATES.map((template, index) => {
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
                    />
                  </div>
                </Grow>
              </Box>
            );
          })}
        </Box>
      </Box>
      
      {/* 简洁的底部装饰 */}
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
        
        {/* 简洁文字 */}
        <Typography variant="caption" sx={{
          color: '#6b7280',
          fontSize: '0.7rem',
          fontWeight: 400,
          letterSpacing: '0.02em',
          textAlign: 'center'
        }}>
          选择模板开始构建您的专属智能体
        </Typography>
      </Box>
    </Box>
  );
};

export default BasicInfoStep; 