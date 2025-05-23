import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button,
  TextField,
  Divider,
  Chip,
  Fade,
  useTheme,
  alpha,
  Tabs,
  Tab
} from '@mui/material';
import { 
  SaveOutlined, 
  InfoCircleOutlined,
  CheckCircleOutlined,
  RightOutlined,
  LeftOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';

// 导入组件
import SystemPromptCard from './components/SystemPromptCard';
import ToolsCard from './components/ToolsCard';
import KnowledgeBaseCard from './components/KnowledgeBaseCard';
import AdvancedSettingsCard from './components/AdvancedSettingsCard';
import { Tool, KnowledgeBase, AgentConfig } from './components/types';

// 高级设置接口
interface AdvancedSettings {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

// 生成默认高级设置
const defaultAdvancedSettings: AdvancedSettings = {
  temperature: 0.7,
  maxTokens: 2048,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0
};

const AgentBuilder: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  // 活动步骤状态
  const [activeStep, setActiveStep] = useState(0);
  
  // 已完成步骤的状态
  const [completed, setCompleted] = useState<{[k: number]: boolean}>({});
  
  // 功能配置子标签页状态
  const [featureTabValue, setFeatureTabValue] = useState(0);
  
  // 智能体配置状态
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    name: '',
    description: '',
    systemPrompt: '你是一个由向量数据库支持的智能助手，拥有以下能力：\n1. 可以回答用户关于向量数据库的问题\n2. 可以进行代码解释和分析\n3. 可以连接网络搜索和获取最新信息\n4. 可以处理各种文档和数据',
    selectedTools: [],
    selectedKnowledgeBases: [],
    advanced: {
      temperature: 0.7,
      maxTokens: 2048,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0
    }
  });
  
  // 处理名称变更
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAgentConfig({
      ...agentConfig,
      name: event.target.value
    });
  };
  
  // 处理描述变更
  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAgentConfig({
      ...agentConfig,
      description: event.target.value
    });
  };
  
  // 处理系统提示词变更
  const handleSystemPromptChange = (value: string) => {
    setAgentConfig({
      ...agentConfig,
      systemPrompt: value
    });
  };
  
  // 重置系统提示词
  const handleResetSystemPrompt = () => {
    setAgentConfig({
      ...agentConfig,
      systemPrompt: '你是一个由向量数据库支持的智能助手，拥有以下能力：\n1. 可以回答用户关于向量数据库的问题\n2. 可以进行代码解释和分析\n3. 可以连接网络搜索和获取最新信息\n4. 可以处理各种文档和数据'
    });
  };
  
  // 处理工具选择
  const toggleToolSelection = (tool: Tool) => {
    const isSelected = agentConfig.selectedTools.some(t => t.id === tool.id);
    
    if (isSelected) {
      setAgentConfig({
        ...agentConfig,
        selectedTools: agentConfig.selectedTools.filter(t => t.id !== tool.id)
      });
    } else {
      setAgentConfig({
        ...agentConfig,
        selectedTools: [...agentConfig.selectedTools, tool]
      });
    }
  };
  
  // 处理知识库选择
  const toggleKnowledgeBaseSelection = (knowledgeBase: KnowledgeBase) => {
    const isSelected = agentConfig.selectedKnowledgeBases.some(kb => kb.id === knowledgeBase.id);
    
    if (isSelected) {
      setAgentConfig({
        ...agentConfig,
        selectedKnowledgeBases: agentConfig.selectedKnowledgeBases.filter(kb => kb.id !== knowledgeBase.id)
      });
    } else {
      setAgentConfig({
        ...agentConfig,
        selectedKnowledgeBases: [...agentConfig.selectedKnowledgeBases, knowledgeBase]
      });
    }
  };
  
  // 处理高级设置变更
  const handleAdvancedSettingsChange = (settings: AdvancedSettings) => {
    setAgentConfig({
      ...agentConfig,
      advanced: settings
    });
  };
  
  // 处理步骤变化
  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  // 完成当前步骤
  const completeStep = () => {
    const newCompleted = { ...completed };
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  // 跳到下一步
  const handleNext = () => {
    const newActiveStep = activeStep + 1;
    setActiveStep(newActiveStep);
  };

  // 跳到上一步
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // 检查步骤是否已完成
  const isStepComplete = (step: number) => {
    return completed[step];
  };

  // 检查当前步骤是否可以继续
  const canContinue = (step: number) => {
    switch (step) {
      case 0: // 基本信息
        return agentConfig.name.trim() !== '';
      case 1: // 系统提示词
        return agentConfig.systemPrompt.trim() !== '';
      case 2: // 功能配置
        return true; // 功能配置是可选的
      default:
        return false;
    }
  };
  
  // 保存智能体配置
  const handleSave = () => {
    console.log('Saving agent configuration:', agentConfig);
    // 这里添加保存逻辑，例如发送到API
    alert('智能体配置已保存！');
  };
  
  // 渲染工具标签
  const renderToolChips = () => {
    return agentConfig.selectedTools.map(tool => (
      <Chip
        key={tool.id}
        label={tool.name}
        onDelete={() => toggleToolSelection(tool)}
        size="small"
        sx={{
          m: 0.5,
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
        }}
      />
    ));
  };
  
  // 检查是否可以保存（基本必填项是否已填）
  const canSave = agentConfig.name.trim() !== '' && agentConfig.systemPrompt.trim() !== '';
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* 顶部页面头部 */}
      <PageHeader
        title="创建智能体"
        parentTitle="智能体管理"
        secondaryActions={[
          {
            icon: <LeftOutlined />,
            label: '返回列表',
            onClick: () => navigate('/agent-list')
          }
        ]}
        primaryActions={[
          {
            icon: <SaveOutlined />,
            label: '保存智能体',
            onClick: handleSave,
            disabled: !canSave
          }
        ]}
      />
      
      {/* 主体内容 */}
      <Box sx={{ 
        display: 'flex', 
        flexGrow: 1, 
        overflow: 'hidden',
        bgcolor: '#f0f2f5'
      }}>
        {/* 左侧步骤导航 */}
        <Box 
          sx={{ 
            width: 220,
            bgcolor: 'white',
            borderRight: '1px solid',
            borderColor: '#e0e0e0',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}
        >
          <Box sx={{ 
            py: 2.5,
            px: 3,
            borderBottom: '1px solid',
            borderColor: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Box 
              sx={{
                px: 2,
                py: 0.75,
                borderRadius: 1,
                bgcolor: '#f1f5f9',
                width: '100%',
                textAlign: 'center'
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600,
                  color: '#334155',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap'
                }}
              >
                {agentConfig.name || '未命名智能体'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1, pt: 4, px: 2 }}>
            <Box sx={{ 
              width: '100%',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 20,
                bottom: 20,
                left: 16,
                width: 2,
                background: 'linear-gradient(to bottom, #e2e8f0 10%, #cbd5e1 50%, #e2e8f0 90%)',
                zIndex: 0,
                borderRadius: '4px',
                boxShadow: '0 0 4px rgba(0,0,0,0.05)',
                opacity: 0.8
              }
            }}>
              {/* 基本信息 */}
              <Box 
                onClick={() => handleStepChange(0)}
                sx={{
                  position: 'relative',
                  pl: 5,
                  pr: 1.5,
                  py: 2,
                  mb: 2.5,
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  borderRadius: 1.5,
                  bgcolor: activeStep === 0 ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: activeStep === 0 ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                  transform: 'translateY(0)',
                  '&:hover': {
                    bgcolor: activeStep === 0 ? 'rgba(59, 130, 246, 0.12)' : 'rgba(203, 213, 225, 0.2)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    transform: 'translateY(-1px)',
                    '& .step-title': {
                      color: activeStep === 0 ? '#1e40af' : '#475569'
                    }
                  }
                }}
              >
                <Box 
                  className="step-indicator"
                  sx={{ 
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: activeStep === 0 ? '#3b82f6' : isStepComplete(0) ? '#10b981' : 'white',
                      border: '2px solid',
                      borderColor: activeStep === 0 ? '#3b82f6' : isStepComplete(0) ? '#10b981' : '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: activeStep === 0 || isStepComplete(0) ? 'white' : '#64748b',
                      fontSize: '12px',
                      fontWeight: 600,
                      transition: 'all 0.2s ease',
                      boxShadow: activeStep === 0 ? '0 0 0 4px rgba(59, 130, 246, 0.25)' : 'none',
                      transform: 'scale(1)',
                      '&:hover': {
                        transform: activeStep !== 0 && !isStepComplete(0) ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: activeStep !== 0 && !isStepComplete(0) ? '0 0 0 3px rgba(148, 163, 184, 0.15)' : activeStep === 0 ? '0 0 0 4px rgba(59, 130, 246, 0.25)' : 'none'
                      }
                    }}
                  >
                    {isStepComplete(0) ? (
                      <CheckCircleOutlined style={{ fontSize: 14 }} />
                    ) : (
                      1
                    )}
                  </Box>
                </Box>

                <Box sx={{ pl: 0.5 }}>
                  <Typography 
                    className="step-title"
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 600, 
                      color: activeStep === 0 ? '#1e40af' : '#334155',
                      mb: 0.5,
                      fontSize: '0.9rem',
                      transition: 'color 0.2s'
                    }}
                  >
                    基本信息
                  </Typography>
                  
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      mt: 0.5
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: agentConfig.name ? '#10b981' : '#f59e0b',
                        mr: 1,
                        boxShadow: `0 0 0 2px ${agentConfig.name ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)'}`,
                        transition: 'all 0.3s ease'
                      }}
                    />
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: agentConfig.name ? '#10b981' : '#f59e0b',
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}
                    >
                      {agentConfig.name ? '已填写' : '必填'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* 系统提示词 */}
              <Box 
                onClick={() => handleStepChange(1)}
                sx={{
                  position: 'relative',
                  pl: 5,
                  pr: 1.5,
                  py: 2,
                  mb: 2.5,
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  borderRadius: 1.5,
                  bgcolor: activeStep === 1 ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: activeStep === 1 ? 'rgba(59, 130, 246, 0.12)' : 'rgba(203, 213, 225, 0.2)',
                    '& .step-title': {
                      color: activeStep === 1 ? '#1e40af' : '#475569'
                    }
                  }
                }}
              >
                <Box 
                  className="step-indicator"
                  sx={{ 
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1
                  }}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: activeStep === 1 ? '#3b82f6' : isStepComplete(1) ? '#10b981' : 'white',
                      border: '2px solid',
                      borderColor: activeStep === 1 ? '#3b82f6' : isStepComplete(1) ? '#10b981' : '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: activeStep === 1 || isStepComplete(1) ? 'white' : '#64748b',
                      fontSize: '12px',
                      fontWeight: 600,
                      transition: 'all 0.2s ease',
                      boxShadow: activeStep === 1 ? '0 0 0 4px rgba(59, 130, 246, 0.25)' : 'none',
                      transform: 'scale(1)',
                      '&:hover': {
                        transform: activeStep !== 1 && !isStepComplete(1) ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: activeStep !== 1 && !isStepComplete(1) ? '0 0 0 3px rgba(148, 163, 184, 0.15)' : activeStep === 1 ? '0 0 0 4px rgba(59, 130, 246, 0.25)' : 'none'
                      }
                    }}
                  >
                    {isStepComplete(1) ? (
                      <CheckCircleOutlined style={{ fontSize: 14 }} />
                    ) : (
                      2
                    )}
                  </Box>
                </Box>
                
                <Box sx={{ pl: 0.5 }}>
                  <Typography 
                    className="step-title"
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 600, 
                      color: activeStep === 1 ? '#1e40af' : '#334155',
                      mb: 0.5,
                      fontSize: '0.9rem',
                      transition: 'color 0.2s'
                    }}
                  >
                    系统提示词
                  </Typography>
                  
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      mt: 0.5
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: agentConfig.systemPrompt ? '#10b981' : '#64748b',
                        mr: 1,
                        boxShadow: `0 0 0 2px ${agentConfig.systemPrompt ? 'rgba(16, 185, 129, 0.15)' : 'rgba(100, 116, 139, 0.15)'}`,
                        transition: 'all 0.3s ease'
                      }}
                    />
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: agentConfig.systemPrompt ? '#10b981' : '#64748b',
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}
                    >
                      {agentConfig.systemPrompt ? '已填写' : '可选'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* 功能配置 */}
              <Box 
                onClick={() => handleStepChange(2)}
                sx={{
                  position: 'relative',
                  pl: 5,
                  pr: 1.5,
                  py: 2,
                  mb: 2.5,
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  borderRadius: 1.5,
                  bgcolor: activeStep === 2 ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: activeStep === 2 ? 'rgba(59, 130, 246, 0.12)' : 'rgba(203, 213, 225, 0.2)',
                    '& .step-title': {
                      color: activeStep === 2 ? '#1e40af' : '#475569'
                    }
                  }
                }}
              >
                <Box 
                  className="step-indicator"
                  sx={{ 
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1
                  }}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: activeStep === 2 ? '#3b82f6' : isStepComplete(2) ? '#10b981' : 'white',
                      border: '2px solid',
                      borderColor: activeStep === 2 ? '#3b82f6' : isStepComplete(2) ? '#10b981' : '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: activeStep === 2 || isStepComplete(2) ? 'white' : '#64748b',
                      fontSize: '12px',
                      fontWeight: 600,
                      transition: 'all 0.2s ease',
                      boxShadow: activeStep === 2 ? '0 0 0 4px rgba(59, 130, 246, 0.25)' : 'none',
                      transform: 'scale(1)',
                      '&:hover': {
                        transform: activeStep !== 2 && !isStepComplete(2) ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: activeStep !== 2 && !isStepComplete(2) ? '0 0 0 3px rgba(148, 163, 184, 0.15)' : activeStep === 2 ? '0 0 0 4px rgba(59, 130, 246, 0.25)' : 'none'
                      }
                    }}
                  >
                    {isStepComplete(2) ? (
                      <CheckCircleOutlined style={{ fontSize: 14 }} />
                    ) : (
                      3
                    )}
                  </Box>
                </Box>
                
                <Box sx={{ pl: 0.5 }}>
                  <Typography 
                    className="step-title"
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 600, 
                      color: activeStep === 2 ? '#1e40af' : '#334155',
                      mb: 0.5,
                      fontSize: '0.9rem',
                      transition: 'color 0.2s'
                    }}
                  >
                    功能配置
                  </Typography>
                  
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      mt: 0.5
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: '#64748b',
                        mr: 1,
                        boxShadow: '0 0 0 2px rgba(100, 116, 139, 0.15)',
                        transition: 'all 0.3s ease'
                      }}
                    />
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#64748b',
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}
                    >
                      可选
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box sx={{ p: 3, mt: 'auto', borderTop: '1px solid', borderColor: '#e0e0e0' }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<SaveOutlined />}
                onClick={handleSave}
                disabled={!canSave}
                sx={{
                bgcolor: '#3b82f6',
                '&:hover': {
                  bgcolor: '#2563eb',
                },
                '&:disabled': {
                  bgcolor: '#e2e8f0',
                  color: '#94a3b8'
                },
                color: 'white',
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                py: 1,
                borderRadius: 1
              }}
            >
              保存智能体
            </Button>
          </Box>
        </Box>
        
        {/* 右侧内容区域 */}
        <Box sx={{ 
          flexGrow: 1, 
          overflow: 'auto',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          width: 'calc(100% - 240px)', // 固定宽度，减去左侧导航的宽度
          minWidth: 0 // 确保内部元素可以正常收缩
        }}>
          <Paper 
            elevation={0} 
            sx={{ 
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'white',
              borderRadius: 1.5,
              overflow: 'hidden',
              boxShadow: '0 1px 8px rgba(0, 0, 0, 0.05)',
              border: '1px solid',
              borderColor: '#e0e0e0'
            }}
          >
            <Box sx={{ 
              borderBottom: '1px solid',
              borderColor: '#e0e0e0',
              p: 2.5,
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#f8f9fa',
            }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#424242'
                }}
              >
                {activeStep === 0 && '基本信息设置'}
                {activeStep === 1 && '系统提示词设置'}
                {activeStep === 2 && '功能配置'}
              </Typography>
              <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                {activeStep > 0 && (
                  <Button 
                    size="small" 
                    startIcon={<LeftOutlined />} 
                    onClick={handleBack}
                    sx={{
                      color: '#5c6bc0',
                      borderColor: '#e0e0e0',
                      bgcolor: 'white',
                      border: '1px solid',
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        bgcolor: '#f5f5f5',
                        borderColor: '#bdbdbd'
                      }
                    }}
                  >
                    上一步
                  </Button>
                )}
                {activeStep < 2 && (
                  <Button 
                    size="small"
                    variant="contained"
                    endIcon={<RightOutlined />}
                    onClick={handleNext}
                    disabled={!canContinue(activeStep)}
                    sx={{
                      bgcolor: '#5c6bc0',
                      color: 'white',
                      textTransform: 'none',
                      fontWeight: 500,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      '&:hover': {
                        bgcolor: '#3f51b5'
                      }
                    }}
                  >
                    下一步
                  </Button>
                )}
              </Box>
            </Box>
            
            <Box sx={{ px: 3, py: 4, flexGrow: 1, overflow: 'auto' }}>
              {/* 基本信息页 */}
              {activeStep === 0 && (
                <Fade in={activeStep === 0}>
                  <Box sx={{ height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      基本信息设置
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Box sx={{ mb: 4 }}>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          智能体名称 *
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="输入智能体名称"
                          value={agentConfig.name}
                          onChange={handleNameChange}
                          variant="outlined"
                          sx={{ mb: 2 }}
                        />
                      </Box>
                      
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          描述
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="描述这个智能体的功能和用途"
                          value={agentConfig.description}
                          onChange={handleDescriptionChange}
                          variant="outlined"
                          multiline
                          rows={4}
                        />
                      </Box>
                    </Box>
                    
                    <Box sx={{ 
                      bgcolor: alpha(theme.palette.primary.main, 0.05), 
                      p: 2, 
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'flex-start' 
                    }}>
                      <InfoCircleOutlined style={{ marginRight: 8, marginTop: 4, color: '#3f51b5' }} />
                      <Typography variant="body2" color="text.secondary">
                        基本信息用于标识和描述你的智能体。一个好的名称和描述可以帮助用户更好地理解这个智能体的功能和用途。
                      </Typography>
                    </Box>
                  </Box>
                </Fade>
              )}

              {/* 系统提示词页 */}
              {activeStep === 1 && (
                <Fade in={activeStep === 1}>
                  <Box>
                    <SystemPromptCard 
                      value={agentConfig.systemPrompt}
                      onChange={handleSystemPromptChange}
                      onReset={handleResetSystemPrompt}
                    />
                  </Box>
                </Fade>
              )}

              {/* 功能配置页 */}
              {activeStep === 2 && (
                <Fade in={activeStep === 2}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {/* 功能配置子标签 */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'white', mb: 3 }}>
                      <Tabs 
                        value={featureTabValue} 
                        onChange={(_, newValue) => setFeatureTabValue(newValue)}
                      >
                        <Tab label="工具组件" />
                        <Tab label="知识库" />
                        <Tab label="高级功能" />
                      </Tabs>
                    </Box>
                    
                    {/* 功能配置子标签内容 */}
                    <Box>
                      {/* 工具组件标签页 */}
                      {featureTabValue === 0 && (
                        <Box>
                          <ToolsCard 
                            selectedTools={agentConfig.selectedTools}
                            toggleToolSelection={toggleToolSelection}
                            renderToolChips={renderToolChips}
                          />
                        </Box>
                      )}
                      
                      {/* 知识库标签页 */}
                      {featureTabValue === 1 && (
                        <Box>
                          <KnowledgeBaseCard 
                            selectedKnowledgeBases={agentConfig.selectedKnowledgeBases}
                            toggleKnowledgeBaseSelection={toggleKnowledgeBaseSelection}
                          />
                        </Box>
                      )}
                      
                      {/* 高级功能标签页 */}
                      {featureTabValue === 2 && (
                        <Box>
                          <AdvancedSettingsCard 
                            settings={{
                              temperature: agentConfig.advanced?.temperature ?? defaultAdvancedSettings.temperature,
                              maxTokens: agentConfig.advanced?.maxTokens ?? defaultAdvancedSettings.maxTokens,
                              topP: agentConfig.advanced?.topP ?? defaultAdvancedSettings.topP,
                              frequencyPenalty: agentConfig.advanced?.frequencyPenalty ?? defaultAdvancedSettings.frequencyPenalty,
                              presencePenalty: agentConfig.advanced?.presencePenalty ?? defaultAdvancedSettings.presencePenalty
                            }}
                            onChange={handleAdvancedSettingsChange}
                          />
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Fade>
              )}

              {/* 完成按钮 */}
              {activeStep === 2 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Button 
                    variant="contained" 
                    onClick={completeStep}
                    disabled={!canContinue(activeStep)}
                    endIcon={<CheckCircleOutlined />}
                    sx={{
                      bgcolor: '#5c6bc0',
                      color: 'white',
                      textTransform: 'none',
                      fontWeight: 500,
                      borderRadius: 1.5,
                      px: 3,
                      py: 1,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      '&:hover': {
                        bgcolor: '#3f51b5',
                      }
                    }}
                  >
                    完成配置
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AgentBuilder;
