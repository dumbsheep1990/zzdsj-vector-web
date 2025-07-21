import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Alert,
  alpha,
  Chip,
  Divider,
  Paper,
  Avatar,
  AvatarGroup,
  LinearProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  PlayArrowOutlined,
  PauseOutlined,
  StopOutlined,
  AddOutlined,
  DeleteOutlined,
  EditOutlined,
  VisibilityOutlined,
  AccountTreeOutlined,
  PsychologyOutlined,
  GroupsOutlined,
  FunctionsOutlined,
  SettingsOutlined,
  SaveOutlined,
  PublishOutlined,
  BarChart,
  Science,
  CheckCircle
} from '@mui/icons-material';



// 工作流步骤类型
const WORKFLOW_STEP_TYPES = {
  AGENT: 'agent',
  TEAM: 'team', 
  FUNCTION: 'function',
  PARALLEL: 'parallel',
  CONDITION: 'condition',
  LOOP: 'loop'
};

// 执行器卡片样式
const ExecutorCard = styled(Card)(({ theme }) => ({
  background: '#ffffff',
  border: '1px solid #f1f5f9',
  borderRadius: 8,
  boxShadow: 'none',
  transition: 'all 0.2s ease',
  height: '100%',
  '&:hover': {
    borderColor: '#e2e8f0',
    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.08)',
  }
}));

const ApplicationOrchestrationPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [workflowConfig, setWorkflowConfig] = useState({
    name: '',
    description: '',
    category: 'custom',
    execution_mode: 'sequential',
    input_type: 'string'
  });

  const [workflowSteps, setWorkflowSteps] = useState<any[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const steps = [
    { label: '基础配置', icon: <SettingsOutlined /> },
    { label: '智能体选择', icon: <PsychologyOutlined /> },
    { label: '流程编排', icon: <AccountTreeOutlined /> },
    { label: '预览测试', icon: <VisibilityOutlined /> }
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const updateConfig = (field: string, value: any) => {
    setWorkflowConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 渲染智能体图标
  const renderAgentIcon = (iconName: string, size: number = 24, color: string = '#64748b') => {
    const iconProps = { sx: { color: color, fontSize: size } };
    switch (iconName) {
      case 'BarChart': return <BarChart {...iconProps} />;
      case 'Edit': return <EditOutlined {...iconProps} />;
      case 'Science': return <Science {...iconProps} />;
      case 'CheckCircle': return <CheckCircle {...iconProps} />;
      default: return <PsychologyOutlined {...iconProps} />;
    }
  };

  // 模拟智能体数据
  const mockAgents = [
    { id: '1', name: '数据分析师', type: 'agent', description: '专业的数据分析和处理', icon: 'BarChart', color: '#3b82f6' },
    { id: '2', name: '内容创作者', type: 'agent', description: '创作高质量内容', icon: 'Edit', color: '#8b5cf6' },
    { id: '3', name: '研究团队', type: 'team', description: '深度研究和分析团队', icon: 'Science', color: '#06b6d4' },
    { id: '4', name: '审核专家', type: 'agent', description: '内容质量审核', icon: 'CheckCircle', color: '#10b981' }
  ];

  const renderStepContent = (step: number) => {
    switch (step) {
              case 0:
          return (
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ 
                color: '#1e293b', 
                fontWeight: 600,
                mb: 3
              }}>
                基础配置
              </Typography>
            
            <Grid container spacing={4}>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="工作流名称"
                  value={workflowConfig.name}
                  onChange={(e) => updateConfig('name', e.target.value)}
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.8)',
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#667eea',
                    },
                  }}
                />
              </Grid>
              
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="工作流描述"
                  value={workflowConfig.description}
                  onChange={(e) => updateConfig('description', e.target.value)}
                  multiline
                  rows={4}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.8)',
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#667eea',
                    },
                  }}
                />
              </Grid>

              <Grid size={6}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: '#64748b', fontWeight: 500 }}>
                    工作流分类
                  </Typography>
                  <select
                    value={workflowConfig.category}
                    onChange={(e) => updateConfig('category', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: '#ffffff',
                      color: '#374151',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="custom">自定义</option>
                    <option value="customer-service">客户服务</option>
                    <option value="data-analysis">数据分析</option>
                    <option value="content-generation">内容生成</option>
                    <option value="automation">自动化</option>
                  </select>
                </Box>
              </Grid>

              <Grid size={6}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: '#64748b', fontWeight: 500 }}>
                    执行模式
                  </Typography>
                  <select
                    value={workflowConfig.execution_mode}
                    onChange={(e) => updateConfig('execution_mode', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: '#ffffff',
                      color: '#374151',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="sequential">顺序执行</option>
                    <option value="parallel">并行执行</option>
                    <option value="conditional">条件执行</option>
                    <option value="loop">循环执行</option>
                  </select>
                </Box>
              </Grid>

              <Grid size={12}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: '#64748b', fontWeight: 500 }}>
                    输入类型
                  </Typography>
                  <select
                    value={workflowConfig.input_type}
                    onChange={(e) => updateConfig('input_type', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: '#ffffff',
                      color: '#374151',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="string">String - 简单文本提示</option>
                    <option value="pydantic">Pydantic Model - 类型安全的结构化输入</option>
                    <option value="list">List - 多项目处理</option>
                    <option value="dictionary">Dictionary - 键值对</option>
                  </select>
                </Box>
              </Grid>
            </Grid>
          </Box>
        );

              case 1:
          return (
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ 
                color: '#1e293b', 
                fontWeight: 600,
                mb: 3
              }}>
                智能体选择
              </Typography>
            
                          <Alert 
                severity="info" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  backgroundColor: alpha('#00d4aa', 0.08),
                  border: '1px solid rgba(0, 212, 170, 0.2)'
                }}
              >
                选择要在工作流中使用的智能体或团队。每个执行器都有特定的能力和指令。
              </Alert>

                        <Grid container spacing={3}>
              {mockAgents.map((agent) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={agent.id}>
                  <ExecutorCard>
                    <CardContent sx={{ p: 3 }}>
                      {/* 头部信息 */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ 
                          width: 48, 
                          height: 48,
                          borderRadius: 2,
                          background: '#f8fafc',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                          border: '1px solid #f1f5f9'
                        }}>
                          {renderAgentIcon(agent.icon, 24, agent.color)}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="h6" sx={{ 
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#0f172a',
                            mb: 0.5,
                            lineHeight: 1.2
                          }}>
                            {agent.name}
                          </Typography>
                          <Typography variant="caption" sx={{ 
                            color: '#64748b',
                            fontSize: '12px',
                            fontWeight: 500
                          }}>
                            {agent.type === 'agent' ? '智能体' : '团队'}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* 描述 */}
                      <Typography variant="body2" sx={{ 
                        color: '#64748b',
                        fontSize: '14px',
                        lineHeight: 1.5,
                        mb: 3,
                        minHeight: '42px'
                      }}>
                        {agent.description}
                      </Typography>
                      
                      {/* 操作按钮 */}
                      <Button 
                        variant={selectedAgents.includes(agent.id) ? "contained" : "outlined"}
                        fullWidth
                        onClick={() => {
                          if (selectedAgents.includes(agent.id)) {
                            setSelectedAgents(prev => prev.filter(id => id !== agent.id));
                          } else {
                            setSelectedAgents(prev => [...prev, agent.id]);
                          }
                        }}
                        sx={{ 
                          borderRadius: 2,
                          height: 36,
                          fontSize: '14px',
                          fontWeight: 500,
                          textTransform: 'none',
                          ...(selectedAgents.includes(agent.id) ? {
                            background: '#00d4aa',
                            color: 'white',
                            border: '1px solid #00d4aa',
                            '&:hover': {
                              background: '#00c4a7',
                              border: '1px solid #00c4a7'
                            }
                          } : {
                            background: 'transparent',
                            color: '#475569',
                            border: '1px solid #e2e8f0',
                            '&:hover': {
                              background: '#f8fafc',
                              border: '1px solid #cbd5e1',
                              color: '#334155'
                            }
                          })
                        }}
                      >
                        {selectedAgents.includes(agent.id) ? '已添加到工作流' : '添加到工作流'}
                      </Button>
                    </CardContent>
                  </ExecutorCard>
                </Grid>
              ))}
            </Grid>

            {selectedAgents.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1e293b', fontWeight: 600 }}>
                  已选择的智能体 ({selectedAgents.length})
                </Typography>
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  background: 'rgba(0, 212, 170, 0.05)',
                  border: '1px solid rgba(0, 212, 170, 0.1)'
                }}>
                  <Grid container spacing={2}>
                    {selectedAgents.map(agentId => {
                      const agent = mockAgents.find(a => a.id === agentId);
                      if (!agent) return null;
                      return (
                        <Grid size={{ xs: 6, sm: 4, md: 3 }} key={agentId}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                                                         p: 2,
                             borderRadius: 2,
                             background: 'rgba(255, 255, 255, 0.8)',
                             border: '1px solid rgba(0, 212, 170, 0.1)'
                          }}>
                            <Avatar sx={{ 
                              background: `linear-gradient(135deg, ${agent.color} 0%, ${agent.color}dd 100%)`,
                              width: 32,
                              height: 32,
                              mr: 1.5
                            }}>
                              {renderAgentIcon(agent.icon, 16, 'white')}
                            </Avatar>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography variant="body2" sx={{ 
                                fontWeight: 600, 
                                color: '#1e293b',
                                fontSize: '13px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}>
                                {agent.name}
                              </Typography>
                              <Typography variant="caption" sx={{ 
                                color: '#64748b',
                                fontSize: '11px'
                              }}>
                                {agent.type === 'agent' ? '智能体' : '团队'}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Paper>
              </Box>
            )}
          </Box>
        );

              case 2:
          return (
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ 
                color: '#1e293b', 
                fontWeight: 600,
                mb: 3
              }}>
                流程编排
              </Typography>
            
                          <Alert 
                severity="info" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  backgroundColor: alpha('#00d4aa', 0.08),
                  border: '1px solid rgba(0, 212, 170, 0.2)'
                }}
              >
                定义工作流的执行逻辑和步骤顺序。支持顺序、并行、条件和循环执行模式。
              </Alert>

            <Grid container spacing={3}>
              <Grid size={6}>
                <ExecutorCard>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                                                <AccountTreeOutlined sx={{ fontSize: 48, color: '#00d4aa', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                    顺序执行
                  </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                      步骤按顺序依次执行，输出传递给下一步
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small"
                      sx={{ borderColor: '#00d4aa', color: '#00d4aa' }}
                    >
                      配置顺序流程
                    </Button>
                  </CardContent>
                </ExecutorCard>
              </Grid>

              <Grid size={6}>
                <ExecutorCard>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <GroupsOutlined sx={{ fontSize: 48, color: '#00d4aa', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                      并行执行
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                      多个步骤同时执行，输出合并处理
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small"
                      sx={{ borderColor: '#00d4aa', color: '#00d4aa' }}
                    >
                      配置并行流程
                    </Button>
                  </CardContent>
                </ExecutorCard>
              </Grid>

              <Grid size={6}>
                <ExecutorCard>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <FunctionsOutlined sx={{ fontSize: 48, color: '#f59e0b', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                      条件执行
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                      基于条件选择不同的执行分支
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small"
                      sx={{ borderColor: '#f59e0b', color: '#f59e0b' }}
                    >
                      配置条件逻辑
                    </Button>
                  </CardContent>
                </ExecutorCard>
              </Grid>

              <Grid size={6}>
                <ExecutorCard>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <PlayArrowOutlined sx={{ fontSize: 48, color: '#8b5cf6', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                      循环执行
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                      重复执行步骤直到满足退出条件
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small"
                      sx={{ borderColor: '#8b5cf6', color: '#8b5cf6' }}
                    >
                      配置循环逻辑
                    </Button>
                  </CardContent>
                </ExecutorCard>
              </Grid>
            </Grid>

            {/* 工作流预览图 */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#1e293b', fontWeight: 600 }}>
                工作流预览
              </Typography>
              <Paper sx={{ 
                p: 4, 
                borderRadius: 3,
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                border: '1px dashed #cbd5e1',
                textAlign: 'center',
                minHeight: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Box>
                  <AccountTreeOutlined sx={{ fontSize: 64, color: '#94a3b8', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                    工作流图表将在此显示
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    配置步骤后将自动生成可视化流程图
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Box>
        );

              case 3:
          return (
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ 
                color: '#1e293b', 
                fontWeight: 600,
                mb: 3
              }}>
                预览与测试
              </Typography>
            
                          <Alert 
                severity="success" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  backgroundColor: alpha('#00d4aa', 0.1),
                  border: '1px solid rgba(0, 212, 170, 0.25)'
                }}
              >
                配置完成！你可以预览工作流配置并进行测试运行。
              </Alert>

            <Grid container spacing={4}>
              <Grid size={8}>
                <ExecutorCard>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" sx={{ mb: 3, color: '#1e293b', fontWeight: 600 }}>
                      📋 工作流配置摘要
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                        <strong>名称:</strong> {workflowConfig.name || '未设置'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                        <strong>描述:</strong> {workflowConfig.description || '未设置'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                        <strong>分类:</strong> {workflowConfig.category}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                        <strong>执行模式:</strong> {workflowConfig.execution_mode}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                        <strong>输入类型:</strong> {workflowConfig.input_type}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        <strong>选择的执行器:</strong> {selectedAgents.length} 个
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" sx={{ mb: 2, color: '#1e293b', fontWeight: 600 }}>
                      🧪 测试执行
                    </Typography>
                    
                    <TextField
                      fullWidth
                      label="测试输入"
                      multiline
                      rows={3}
                      placeholder="输入测试数据..."
                      sx={{ mb: 3 }}
                    />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        startIcon={isExecuting ? <PauseOutlined /> : <PlayArrowOutlined />}
                        onClick={() => setIsExecuting(!isExecuting)}
                        sx={{
                          background: 'linear-gradient(135deg, #00d4aa 0%, #4ecdc4 100%)',
                          borderRadius: 2,
                          px: 3,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #00c4a7 0%, #3eb8ae 100%)'
                          }
                        }}
                      >
                        {isExecuting ? '暂停执行' : '开始测试'}
                      </Button>
                      
                      <Button
                        variant="outlined"
                        startIcon={<StopOutlined />}
                        disabled={!isExecuting}
                        sx={{ borderColor: '#ef4444', color: '#ef4444' }}
                      >
                        停止
                      </Button>
                    </Box>

                    {isExecuting && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                          执行进度
                        </Typography>
                        <LinearProgress 
                          sx={{ 
                            borderRadius: 1,
                            height: 8,
                            background: 'rgba(0, 212, 170, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(135deg, #00d4aa 0%, #4ecdc4 100%)'
                            }
                          }} 
                        />
                      </Box>
                    )}
                  </CardContent>
                </ExecutorCard>
              </Grid>

              <Grid size={4}>
                <ExecutorCard>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: '#1e293b', fontWeight: 600 }}>
                      ⚡ 快速操作
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<SaveOutlined />}
                        fullWidth
                        sx={{ 
                          borderColor: '#00d4aa', 
                          color: '#00d4aa',
                          borderRadius: 2
                        }}
                      >
                        保存配置
                      </Button>
                      
                      <Button
                        variant="outlined"
                        startIcon={<PublishOutlined />}
                        fullWidth
                        sx={{ 
                          borderColor: '#00d4aa', 
                          color: '#00d4aa',
                          borderRadius: 2
                        }}
                      >
                        发布工作流
                      </Button>
                      
                      <Button
                        variant="outlined"
                        startIcon={<EditOutlined />}
                        fullWidth
                        sx={{ 
                          borderColor: '#f59e0b', 
                          color: '#f59e0b',
                          borderRadius: 2
                        }}
                      >
                        编辑代码
                      </Button>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center' }}>
                      💡 基于 Agno Workflows v2 构建
                    </Typography>
                  </CardContent>
                </ExecutorCard>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 优化顶部栏 - 与左侧导航高度一致 */}
      <Box sx={{ 
        height: '56px', // 与左侧导航顶部高度一致
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        px: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#ffffff',
        zIndex: 1000
      }}>
        <Box>
          <Typography variant="h4" sx={{ 
            color: '#1e293b', 
            fontWeight: 600,
            fontSize: '20px',
            background: 'linear-gradient(135deg, #00d4aa 0%, #4ecdc4 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🚀 应用编排
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '13px' }}>
            基于 Agno Workflows v2 创建智能体工作流
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button 
              variant="outlined" 
              size="medium"
              startIcon={<SaveOutlined />}
              sx={{ 
                borderColor: '#00d4aa',
                color: '#00d4aa',
                borderRadius: 2,
                px: 3,
                '&:hover': {
                  borderColor: '#00c4a7',
                  backgroundColor: 'rgba(0, 212, 170, 0.05)'
                }
              }}
            >
              保存草稿
            </Button>
            <Button 
              variant="contained" 
              size="medium"
              startIcon={<PublishOutlined />}
              sx={{
                background: 'linear-gradient(135deg, #00d4aa 0%, #4ecdc4 100%)',
                borderRadius: 2,
                px: 3,
                boxShadow: '0 4px 12px rgba(0, 212, 170, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #00c4a7 0%, #3eb8ae 100%)',
                  boxShadow: '0 6px 20px rgba(0, 212, 170, 0.6)',
                }
              }}
            >
            发布工作流
          </Button>
        </Box>
      </Box>
      
      <Box sx={{ 
        flex: 1, 
        display: 'flex',
        background: '#f8fafc',
        minHeight: 0,
        overflow: 'hidden'
      }}>
        {/* 左侧纵向步骤条 */}
        <Box sx={{ 
          width: 280,
          background: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          p: 3,
          overflow: 'auto'
        }}>
          <Typography variant="h6" sx={{ 
            color: '#1e293b', 
            fontWeight: 600,
            mb: 3 
          }}>
            创建工作流
          </Typography>
          
          <Box sx={{ position: 'relative' }}>
            {/* 纵向连接线 */}
            <Box sx={{
              position: 'absolute',
              left: 17,
              top: 36,
              bottom: 20,
              width: 2,
              background: '#e2e8f0',
              zIndex: 0
            }} />
            
            {steps.map((step, index) => (
              <Box key={step.label} sx={{ 
                position: 'relative',
                mb: index === steps.length - 1 ? 0 : 3,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                '&:hover': {
                  opacity: 0.8
                }
              }}
              onClick={() => setActiveStep(index)}
              >
                {/* 步骤圆圈 */}
                <Box sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: index <= activeStep 
                    ? 'linear-gradient(135deg, #00d4aa 0%, #4ecdc4 100%)'
                    : '#e2e8f0',
                  color: index <= activeStep ? '#ffffff' : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 600,
                  zIndex: 1,
                  position: 'relative',
                  boxShadow: index <= activeStep ? '0 2px 8px rgba(0, 212, 170, 0.3)' : 'none',
                  flexShrink: 0
                }}>
                  {index === activeStep ? step.icon : (index + 1)}
                </Box>
                
                {/* 步骤标题和描述 */}
                <Box sx={{ ml: 3, flex: 1 }}>
                  <Typography variant="body1" sx={{ 
                    color: index <= activeStep ? '#1e293b' : '#64748b',
                    fontWeight: index === activeStep ? 600 : 500,
                    mb: 0.5,
                    fontSize: '15px'
                  }}>
                    {step.label}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: '#94a3b8',
                    display: 'block',
                    fontSize: '12px'
                  }}>
                    {index === 0 && '设置基本信息'}
                    {index === 1 && '选择智能体'}
                    {index === 2 && '配置执行流程'}
                    {index === 3 && '预览和测试'}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
          
          {/* 底部导航按钮 */}
          <Box sx={{ 
            mt: 4,
            pt: 3,
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: 2
          }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              size="small"
              sx={{
                flex: 1,
                borderColor: '#e2e8f0',
                color: '#64748b'
              }}
            >
              上一步
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button 
                onClick={handleReset}
                variant="outlined"
                size="small"
                sx={{
                  flex: 1,
                  borderColor: '#e2e8f0',
                  color: '#64748b'
                }}
              >
                重置
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={activeStep === 0 && !workflowConfig.name}
                size="small"
                sx={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #00d4aa 0%, #4ecdc4 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #00c4a7 0%, #3eb8ae 100%)',
                  }
                }}
              >
                下一步
              </Button>
            )}
          </Box>
        </Box>
        
        {/* 右侧内容区域 */}
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          overflow: 'hidden'
        }}>
          {/* 主要内容区 */}
          <Box sx={{ 
            flex: 1,
            overflow: 'auto',
            p: 4
          }}>
            <Card sx={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 3,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              height: '100%',
              minHeight: 600
            }}>
              <CardContent sx={{ p: 0, height: '100%' }}>
                {renderStepContent(activeStep)}
              </CardContent>
            </Card>
          </Box>
          
          {/* 右侧配置概览面板 */}
          <Box sx={{ 
            width: 300,
            background: '#ffffff',
            borderLeft: '1px solid #e2e8f0',
            p: 3,
            overflow: 'auto'
          }}>
            <Typography variant="h6" gutterBottom sx={{ 
              color: '#1e293b', 
              fontWeight: 600,
              mb: 2
            }}>
              配置概览
            </Typography>
            
            <Typography variant="body2" color="textSecondary" gutterBottom sx={{ 
              color: '#64748b',
              mb: 3 
            }}>
              当前工作流配置信息
            </Typography>
            
            <Box sx={{ 
              p: 3, 
              borderRadius: 2,
              background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.03) 0%, rgba(78, 205, 196, 0.05) 100%)',
              border: '1px solid rgba(0, 212, 170, 0.15)'
            }}>
              <Typography variant="body2" gutterBottom sx={{ color: '#1e2b2b' }}>
                <strong>名称:</strong> {workflowConfig.name || '未设置'}
              </Typography>
              <Typography variant="body2" gutterBottom sx={{ color: '#1e2b2b' }}>
                <strong>分类:</strong> {workflowConfig.category}
              </Typography>
              <Typography variant="body2" gutterBottom sx={{ color: '#1e2b2b' }}>
                <strong>执行模式:</strong> {workflowConfig.execution_mode}
              </Typography>
              <Typography variant="body2" gutterBottom sx={{ color: '#1e2b2b' }}>
                <strong>输入类型:</strong> {workflowConfig.input_type}
              </Typography>
              <Typography variant="body2" sx={{ color: '#1e2b2b' }}>
                <strong>执行器:</strong> {selectedAgents.length} 个
              </Typography>
            </Box>

            {/* 进度指示 */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                配置进度
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={(activeStep / (steps.length - 1)) * 100}
                sx={{ 
                  borderRadius: 1,
                  height: 6,
                  background: '#e2e8f0',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(135deg, #00d4aa 0%, #4ecdc4 100%)',
                    borderRadius: 1
                  }
                }} 
              />
              <Typography variant="caption" sx={{ color: '#94a3b8', mt: 1, display: 'block' }}>
                {Math.round((activeStep / (steps.length - 1)) * 100)}% 完成
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ApplicationOrchestrationPage;
