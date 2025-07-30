import React from 'react';
import { Box, Typography, Card, CardContent, Chip, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Brain, Users, ArrowRight, CheckCircle, Settings } from 'lucide-react';
import { AgentTeam } from '../types/agentTeam';

interface AgentOverviewStepProps {
  agentTeam: AgentTeam;
  selectedTemplate: any;
}

// 渐变卡片样式
const GradientCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
  borderRadius: 16,
  border: '1px solid rgba(0, 0, 0, 0.06)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  }
}));

// 智能体卡片样式
const AgentCard = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
  borderRadius: 12,
  padding: 16,
  border: '1px solid rgba(0, 0, 0, 0.06)',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  }
}));

const AgentOverviewStep: React.FC<AgentOverviewStepProps> = ({ agentTeam, selectedTemplate }) => {
  const getAgentTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'intent_recognition': '#3b82f6',
      'web_search': '#10b981',
      'knowledge_retrieval': '#f59e0b',
      'summary': '#8b5cf6',
      'validation': '#ef4444',
      'optimization': '#06b6d4',
      'planning': '#6366f1',
      'execution': '#059669',
      'coordination': '#dc2626',
      'monitoring': '#7c3aed'
    };
    return colors[type] || '#6b7280';
  };

  const getAgentTypeIcon = (type: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'intent_recognition': <Brain size={20} />,
      'web_search': <Settings size={20} />,
      'knowledge_retrieval': <Settings size={20} />,
      'summary': <Settings size={20} />,
      'validation': <CheckCircle size={20} />,
      'optimization': <Settings size={20} />,
      'planning': <Settings size={20} />,
      'execution': <Settings size={20} />,
      'coordination': <Users size={20} />,
      'monitoring': <Settings size={20} />
    };
    return icons[type] || <Settings size={20} />;
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* 标题区域 */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700,
          background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 2
        }}>
          智能体团队概览
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
          您的智能体团队已配置完成，共包含 {agentTeam.members.length} 个专业智能体
        </Typography>
        
        {/* 团队统计 */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700 }}>
              {agentTeam.members.length}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              智能体数量
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 700 }}>
              {agentTeam.members.filter(m => m.modelConfig.useUnifiedModel).length}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              统一模型
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: 'warning.main', fontWeight: 700 }}>
              {agentTeam.members.reduce((acc, m) => acc + m.toolsConfig.enabledTools.length, 0)}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              工具总数
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* 智能体团队展示 */}
      <GradientCard>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
            智能体团队成员
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
            {agentTeam.members.map((agent, index) => {
              const agentColor = getAgentTypeColor(agent.type);
              
              return (
                <AgentCard key={agent.id}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                    {/* 智能体图标 */}
                    <Avatar sx={{ 
                      width: 48, 
                      height: 48, 
                      bgcolor: `${agentColor}20`,
                      color: agentColor,
                      border: `2px solid ${agentColor}30`
                    }}>
                      {getAgentTypeIcon(agent.type)}
                    </Avatar>
                    
                    {/* 智能体信息 */}
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {agent.name}
                        </Typography>
                        <Chip 
                          label={`第${index + 1}步`}
                          size="small"
                          sx={{ 
                            bgcolor: `${agentColor}20`,
                            color: agentColor,
                            fontWeight: 600,
                            fontSize: '0.75rem'
                          }}
                        />
                      </Box>
                      
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.5 }}>
                        {agent.description}
                      </Typography>
                      
                      {/* 配置状态 */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Chip 
                          label="模型已配置"
                          size="small"
                          icon={<CheckCircle size={14} />}
                          sx={{ 
                            bgcolor: 'success.50',
                            color: 'success.main',
                            fontSize: '0.75rem'
                          }}
                        />
                        {agent.toolsConfig.enabledTools.length > 0 && (
                          <Chip 
                            label={`${agent.toolsConfig.enabledTools.length} 工具`}
                            size="small"
                            sx={{ 
                              bgcolor: 'info.50',
                              color: 'info.main',
                              fontSize: '0.75rem'
                            }}
                          />
                        )}
                        {agent.knowledgeConfig.enabledKnowledgeBases.length > 0 && (
                          <Chip 
                            label={`${agent.knowledgeConfig.enabledKnowledgeBases.length} 知识库`}
                            size="small"
                            sx={{ 
                              bgcolor: 'warning.50',
                              color: 'warning.main',
                              fontSize: '0.75rem'
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>
                </AgentCard>
              );
            })}
          </Box>
        </CardContent>
      </GradientCard>

      {/* 工作流预览 */}
      <GradientCard sx={{ mt: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
            工作流预览
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            {agentTeam.members.map((agent, index) => (
              <React.Fragment key={agent.id}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  border: '1px solid rgba(0, 0, 0, 0.08)'
                }}>
                  <Avatar sx={{ 
                    width: 24, 
                    height: 24, 
                    bgcolor: `${getAgentTypeColor(agent.type)}20`,
                    color: getAgentTypeColor(agent.type),
                    fontSize: '0.75rem'
                  }}>
                    {index + 1}
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                    {agent.name}
                  </Typography>
                </Box>
                {index < agentTeam.members.length - 1 && (
                  <ArrowRight size={16} color="#6b7280" />
                )}
              </React.Fragment>
            ))}
          </Box>
          
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2, textAlign: 'center' }}>
            智能体将按照上述顺序协作执行任务，每个智能体专注于自己的专业领域
          </Typography>
        </CardContent>
      </GradientCard>

      {/* 下一步提示 */}
      <Box sx={{ 
        mt: 4, 
        p: 3, 
        borderRadius: 2, 
        bgcolor: 'primary.50',
        border: '1px solid',
        borderColor: 'primary.200',
        textAlign: 'center'
      }}>
        <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 600, mb: 1 }}>
          🎉 智能体团队配置完成！
        </Typography>
        <Typography variant="body2" sx={{ color: 'primary.700' }}>
          接下来您可以进入下一步，配置各智能体的详细参数和个性化设置
        </Typography>
      </Box>
    </Box>
  );
};

export default AgentOverviewStep; 