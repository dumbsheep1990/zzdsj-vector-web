import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grow,
  Chip,
} from '@mui/material';
import {
  PolicyOutlined,
  BusinessCenterOutlined,
  HeadsetMicOutlined,
  SchoolOutlined,
  BarChartOutlined,
  SettingsOutlined,
} from '@mui/icons-material';
import { GradientCard } from '../../../components/ui/gradient-card';

// 应用场景类型定义
export interface ScenarioConfig {
  id: string;
  name: string;
  description: string;
  detailedDescription: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  useCases: string[];
  targetAudience: string[];
  tags: string[];
  estimatedCost: 'low' | 'medium' | 'high';
  complexity: 'simple' | 'medium' | 'complex';
  teamSize: number;
  recommendedTemplates: string[];
}

// 六种核心应用场景
const SCENARIO_CONFIGS: ScenarioConfig[] = [
  {
    id: 'policy_qa',
    name: '政策问答',
    description: '专业政策解读与咨询服务',
    detailedDescription: '专为政策文件解读、法规咨询和合规检查设计的专业服务。由政策分析师、法律顾问和文档处理专家组成的团队，提供准确的政策解读和合规建议。',
    icon: <PolicyOutlined style={{ fontSize: '32px' }} />,
    color: '#059669',
    gradient: 'linear-gradient(135deg, #047857 0%, #059669 50%, #10b981 100%)',
    useCases: [
      '政策文件解读',
      '法规合规咨询', 
      '政策影响分析',
      '合规风险评估'
    ],
    targetAudience: [
      '政府机构',
      '法律咨询',
      '合规部门',
      '企业法务'
    ],
    tags: ['政策解读', '法律咨询', '合规检查'],
    estimatedCost: 'medium',
    complexity: 'medium',
    teamSize: 3,
    recommendedTemplates: ['policy_expert_team', 'legal_advisory_team']
  },
  {
    id: 'business_assistant',
    name: '企业助手',
    description: '全方位企业运营支持助手',
    detailedDescription: '为企业提供全面运营支持的智能助手团队。包含商务顾问、数据分析师和项目经理，专注于商务决策、数据洞察和项目管理，助力企业高效运营。',
    icon: <BusinessCenterOutlined style={{ fontSize: '32px' }} />,
    color: '#dc2626',
    gradient: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 50%, #ef4444 100%)',
    useCases: [
      '商务决策支持',
      '数据分析洞察',
      '项目管理协调',
      '市场调研分析'
    ],
    targetAudience: [
      '中小企业',
      '初创公司', 
      '业务管理',
      '项目团队'
    ],
    tags: ['商务咨询', '数据分析', '项目管理'],
    estimatedCost: 'high',
    complexity: 'complex',
    teamSize: 3,
    recommendedTemplates: ['business_team', 'management_suite']
  },
  {
    id: 'intelligent_customer_service',
    name: '智能客服',
    description: '24/7智能客户服务系统',
    detailedDescription: '全天候智能客户服务解决方案。由客服专员、技术专家和情感分析师组成，提供快速响应、准确解答和贴心服务，显著提升客户满意度。',
    icon: <HeadsetMicOutlined style={{ fontSize: '32px' }} />,
    color: '#7c3aed',
    gradient: 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 50%, #8b5cf6 100%)',
    useCases: [
      '客户咨询响应',
      '问题快速解答',
      '投诉处理协调',
      '技术支持服务'
    ],
    targetAudience: [
      '电商平台',
      '服务行业',
      '技术支持',
      '客服中心'
    ],
    tags: ['客户服务', '快速响应', '情感识别'],
    estimatedCost: 'low',
    complexity: 'simple',
    teamSize: 3,
    recommendedTemplates: ['customer_service_team', 'support_assistant']
  },
  {
    id: 'education_assistant',
    name: '教学辅助',
    description: '个性化教学与学习辅导',
    detailedDescription: '专业教育辅助系统，由学科专家、教学设计师和学习分析师组成。提供个性化教学方案、学习进度跟踪和智能辅导，全面提升教学效果。',
    icon: <SchoolOutlined style={{ fontSize: '32px' }} />,
    color: '#ea580c',
    gradient: 'linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #f97316 100%)',
    useCases: [
      '个性化教学',
      '学习进度跟踪',
      '作业智能批改',
      '知识点精准解析'
    ],
    targetAudience: [
      '在线教育',
      '培训机构',
      '学习平台',
      '教育工作者'
    ],
    tags: ['个性化学习', '智能辅导', '教学设计'],
    estimatedCost: 'medium',
    complexity: 'medium',
    teamSize: 3,
    recommendedTemplates: ['education_team', 'tutoring_assistant']
  },
  {
    id: 'research_report',
    name: '调研报告',
    description: '专业市场调研与报告生成',
    detailedDescription: '专业调研分析团队，由市场分析师、数据科学家和报告撰写专家组成。提供深度市场洞察、数据可视化分析和专业报告撰写服务。',
    icon: <BarChartOutlined style={{ fontSize: '32px' }} />,
    color: '#0891b2',
    gradient: 'linear-gradient(135deg, #0e7490 0%, #0891b2 50%, #06b6d4 100%)',
    useCases: [
      '市场调研分析',
      '数据深度挖掘',
      '专业报告撰写',
      '趋势预测分析'
    ],
    targetAudience: [
      '咨询公司',
      '投资机构',
      '市场部门',
      '研究机构'
    ],
    tags: ['市场调研', '数据分析', '报告撰写'],
    estimatedCost: 'high',
    complexity: 'complex',
    teamSize: 3,
    recommendedTemplates: ['research_team', 'analytics_suite']
  },
  {
    id: 'general_purpose',
    name: '通用场景',
    description: '灵活配置的通用智能助手',
    detailedDescription: '高度灵活的通用智能助手配置。支持自定义团队结构和功能组合，适应各种特殊需求和创新应用场景，提供最大的配置自由度。',
    icon: <SettingsOutlined style={{ fontSize: '32px' }} />,
    color: '#6b7280',
    gradient: 'linear-gradient(135deg, #4b5563 0%, #6b7280 50%, #9ca3af 100%)',
    useCases: [
      '自定义任务处理',
      '多领域知识整合',
      '特殊需求适配',
      '创新应用探索'
    ],
    targetAudience: [
      '个人用户',
      '特殊需求',
      '创新团队',
      '研发部门'
    ],
    tags: ['灵活配置', '自定义', '多用途'],
    estimatedCost: 'medium',
    complexity: 'medium',
    teamSize: 1-5,
    recommendedTemplates: ['general_agent', 'custom_team']
  }
];

interface ScenarioSelectionStepProps {
  onScenarioSelect: (scenario: ScenarioConfig) => void;
  selectedScenario?: string;
  onNext?: () => void;
}

const ScenarioSelectionStep: React.FC<ScenarioSelectionStepProps> = ({
  onScenarioSelect,
  selectedScenario,
  onNext
}) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleScenarioSelect = (scenario: ScenarioConfig) => {
    onScenarioSelect(scenario);
    // 自动进入下一步
    if (onNext) {
      setTimeout(() => {
        onNext();
      }, 300);
    }
  };

  const selectedScenarioData = SCENARIO_CONFIGS.find(s => s.id === selectedScenario);

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
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
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
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(220, 38, 38, 0.05) 50%, rgba(234, 88, 12, 0.05) 100%)',
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
              步骤 1：选择应用场景
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
          选择最符合您需求的应用场景，我们将为您配置专业的智能体团队
        </Typography>
        
        {/* 功能标签 */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1.5,
          mb: 1,
          flexWrap: 'wrap'
        }}>
          {[
            { icon: '📋', text: '政策问答', color: '#059669', tier: '政府合规' },
            { icon: '🏢', text: '企业助手', color: '#dc2626', tier: '商务管理' },
            { icon: '🎧', text: '智能客服', color: '#7c3aed', tier: '服务支持' },
            { icon: '🎓', text: '教学辅助', color: '#ea580c', tier: '教育培训' },
            { icon: '📊', text: '调研报告', color: '#0891b2', tier: '数据分析' },
            { icon: '⚙️', text: '通用场景', color: '#6b7280', tier: '自定义' }
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
              minWidth: '80px',
              maxWidth: '100px'
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

      {/* 已选择场景提示 */}
      {selectedScenarioData && (
        <Box sx={{ 
          mb: 2, 
          textAlign: 'center',
          flexShrink: 0 
        }}>
          <Chip
            label={`已选择：${selectedScenarioData.name}`}
            color="primary"
            variant="filled"
            sx={{
              background: selectedScenarioData.gradient,
              color: 'white',
              fontWeight: 600,
              '& .MuiChip-label': {
                px: 2
              }
            }}
          />
        </Box>
      )}

      {/* 场景卡片网格 */}
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
          {SCENARIO_CONFIGS.map((scenario, index) => {
            const isSelected = selectedScenario === scenario.id;

            return (
              <Box key={scenario.id}>
                <Grow in timeout={300 + index * 100}>
                  <div>
                    <GradientCard
                      title={scenario.name}
                      description={scenario.description}
                      detailedDescription={scenario.detailedDescription}
                      icon={scenario.icon}
                      color={scenario.color}
                      gradient={scenario.gradient}
                      features={scenario.useCases}
                      useCases={scenario.targetAudience}
                      isSelected={isSelected}
                      onSelect={() => handleScenarioSelect(scenario)}
                      onMouseEnter={() => setHoveredCard(scenario.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      // 添加额外信息
                      extraInfo={
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              预估成本
                            </Typography>
                            <Chip
                              label={scenario.estimatedCost === 'low' ? '低' : scenario.estimatedCost === 'medium' ? '中' : '高'}
                              size="small"
                              color={scenario.estimatedCost === 'low' ? 'success' : scenario.estimatedCost === 'medium' ? 'warning' : 'error'}
                              sx={{ height: '18px', fontSize: '0.7rem' }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              复杂度
                            </Typography>
                            <Chip
                              label={scenario.complexity === 'simple' ? '简单' : scenario.complexity === 'medium' ? '中等' : '复杂'}
                              size="small"
                              color={scenario.complexity === 'simple' ? 'info' : scenario.complexity === 'medium' ? 'warning' : 'secondary'}
                              sx={{ height: '18px', fontSize: '0.7rem' }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              团队规模
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                              {typeof scenario.teamSize === 'number' ? `${scenario.teamSize} 个智能体` : `${scenario.teamSize} 智能体`}
                            </Typography>
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
          background: 'linear-gradient(90deg, transparent 0%, #059669 20%, #dc2626 40%, #7c3aed 60%, #0891b2 80%, transparent 100%)'
        }} />
        
        {/* 提示文字 */}
        <Typography variant="caption" sx={{
          color: '#6b7280',
          fontSize: '0.7rem',
          fontWeight: 400,
          letterSpacing: '0.02em',
          textAlign: 'center'
        }}>
          {selectedScenario ? '场景已选择，系统将为您配置专业团队' : '请选择一个应用场景开始构建您的智能体团队'}
        </Typography>
      </Box>
    </Box>
  );
};

export default ScenarioSelectionStep;
export { SCENARIO_CONFIGS };
export type { ScenarioConfig }; 