import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  Divider,
  Button,
} from '@mui/material';
import {
  Refresh, 
  Person, 
  Code, 
  Language,
  AutoAwesome,
  Clear,
  Psychology,
  School,
  Work,
  Create,
  Support
} from '@mui/icons-material';

// 基础配置接口 - 实用简化版
export interface BasicConfiguration {
  agent_name: string;
  agent_description: string;
  system_prompt: string;
  language: string;
  response_style: 'concise' | 'balanced' | 'detailed';
  max_context_length: number;
}

interface BasicConfigurationStepProps {
  config: BasicConfiguration;
  onConfigChange: (config: BasicConfiguration) => void;
}

const BasicConfigurationStep: React.FC<BasicConfigurationStepProps> = ({
  config,
  onConfigChange
}) => {
  const handleChange = (field: keyof BasicConfiguration) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const value = event.target.value;
    onConfigChange({
      ...config,
      [field]: value
    });
  };

  // 重置为默认系统提示词
  const resetSystemPrompt = () => {
    onConfigChange({
      ...config,
      system_prompt: '你是一个友好、专业的AI助手。请根据用户的问题提供准确、有帮助的回答。保持礼貌和耐心，如果不确定答案，请坦诚说明。'
    });
  };

  // 清空提示词
  const clearSystemPrompt = () => {
    onConfigChange({
      ...config,
      system_prompt: ''
    });
  };

  // 自动生成提示词（基于名称和描述）
  const generateSystemPrompt = () => {
    const name = config.agent_name || '智能助手';
    const description = config.agent_description || '通用智能助手';
    
    const generatedPrompt = `你是${name}，一个专业的AI助手。你的主要功能是${description}。

请遵循以下原则：
1. 提供准确、有帮助的信息和建议
2. 保持专业、友好的沟通风格
3. 承认知识的局限性，诚实表达不确定性
4. 根据用户需求调整回答的详细程度
5. 主动提供相关的补充信息

如果遇到超出能力范围的问题，请诚实说明并建议用户寻求专业帮助。`;

    onConfigChange({
      ...config,
      system_prompt: generatedPrompt
    });
  };

  // 快速选择标签
  const quickTags = [
    { 
      label: '专业顾问', 
      icon: <Work sx={{ fontSize: 14 }} />,
      prompt: '你是一位资深的专业顾问，拥有丰富的知识和经验。请提供深入、专业的分析和建议，确保回答的准确性和权威性。' 
    },
    { 
      label: '教学导师', 
      icon: <School sx={{ fontSize: 14 }} />,
      prompt: '你是一位耐心的教学导师。请用易懂的语言解释复杂概念，循序渐进地引导学习，鼓励提问并提供实用的学习建议。' 
    },
    { 
      label: '创意伙伴', 
      icon: <Create sx={{ fontSize: 14 }} />,
      prompt: '你是一个富有创意和想象力的伙伴。请发挥创造性思维，提供新颖的想法和解决方案，用生动有趣的方式表达观点。' 
    },
    { 
      label: '心理支持', 
      icon: <Psychology sx={{ fontSize: 14 }} />,
      prompt: '你是一位温暖、理解力强的心理支持助手。请倾听用户的情感需求，提供同理心和积极的建议，帮助用户缓解压力和困扰。' 
    },
    { 
      label: '技术支持', 
      icon: <Support sx={{ fontSize: 14 }} />,
      prompt: '你是一位专业的技术支持专家。请提供准确的技术解决方案，用简明的语言解释复杂的技术概念，并提供具体的操作步骤。' 
    }
  ];

  const applyQuickTag = (prompt: string) => {
    onConfigChange({
      ...config,
      system_prompt: prompt
    });
  };

  return (
    <Box sx={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #faf8ff 0%, #f3f4f6 50%, #fef7f0 100%)',
      overflow: 'hidden',
      p: 2
    }}>
      {/* 基本信息卡片 - 占用30%高度 */}
      <Box sx={{ 
        flex: '0 0 calc(30% - 12px)',
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(25px)',
        border: '1px solid rgba(147, 197, 253, 0.2)',
        boxShadow: '0 4px 6px rgba(59, 130, 246, 0.05), 0 10px 15px rgba(59, 130, 246, 0.1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        mb: 1.5
      }}>
        {/* 卡片头部 */}
        <Box sx={{
          background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
          backdropFilter: 'blur(15px)',
          p: 1.5,
          color: '#1e40af',
          borderBottom: '1px solid rgba(147, 197, 253, 0.2)',
          flex: '0 0 auto'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              p: 0.8,
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(147, 197, 253, 0.3)',
              boxShadow: '0 2px 4px rgba(59, 130, 246, 0.1)'
            }}>
              <Person sx={{ fontSize: 18, color: '#3b82f6' }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.3, color: '#1e40af' }}>
                基本信息
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.75rem', color: '#3b82f6' }}>
                定义智能体的名称和功能描述
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* 卡片内容 */}
        <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5, minHeight: 0 }}>
          <TextField
            fullWidth
            label="智能体名称"
            value={config.agent_name}
            onChange={handleChange('agent_name')}
            placeholder="给您的智能体取个名字"
            variant="outlined"
            required
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(147, 197, 253, 0.2)',
                boxShadow: 'inset 0 1px 2px rgba(59, 130, 246, 0.05)',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                },
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.95)',
                  boxShadow: 'inset 0 1px 2px rgba(59, 130, 246, 0.05), 0 0 0 1px rgba(59, 130, 246, 0.3)'
                },
                '&.Mui-focused': {
                  background: 'rgba(255, 255, 255, 0.98)',
                  boxShadow: 'inset 0 1px 2px rgba(59, 130, 246, 0.05), 0 0 0 2px rgba(59, 130, 246, 0.2)'
                }
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#3b82f6'
              }
            }}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="功能描述"
            value={config.agent_description}
            onChange={handleChange('agent_description')}
            placeholder="描述这个智能体的主要功能和擅长领域"
            variant="outlined"
            required
            sx={{
              flex: 1,
              minHeight: 0,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(147, 197, 253, 0.2)',
                boxShadow: 'inset 0 1px 2px rgba(59, 130, 246, 0.05)',
                height: '100%',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                },
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.95)',
                  boxShadow: 'inset 0 1px 2px rgba(59, 130, 246, 0.05), 0 0 0 1px rgba(59, 130, 246, 0.3)'
                },
                '&.Mui-focused': {
                  background: 'rgba(255, 255, 255, 0.98)',
                  boxShadow: 'inset 0 1px 2px rgba(59, 130, 246, 0.05), 0 0 0 2px rgba(59, 130, 246, 0.2)'
                }
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#3b82f6'
              },
              '& .MuiInputBase-root': {
                height: '100%'
              },
              '& .MuiInputBase-inputMultiline': {
                height: '100% !important',
                overflow: 'auto !important'
              }
            }}
          />
        </Box>
      </Box>

      {/* 提示词设置卡片 - 占用70%高度 */}
      <Box sx={{ 
        flex: '0 0 calc(70% - 12px)',
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(25px)',
        border: '1px solid rgba(147, 197, 253, 0.3)',
        boxShadow: '0 4px 6px rgba(59, 130, 246, 0.05), 0 10px 15px rgba(59, 130, 246, 0.1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* 卡片头部 */}
        <Box sx={{
          background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
          backdropFilter: 'blur(15px)',
          p: 1.5,
          color: '#1e40af',
          borderBottom: '1px solid rgba(147, 197, 253, 0.3)',
          flex: '0 0 auto'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                p: 0.8,
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(147, 197, 253, 0.4)',
                boxShadow: '0 2px 4px rgba(59, 130, 246, 0.1)'
              }}>
                <Code sx={{ fontSize: 18, color: '#3b82f6' }} />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.3, color: '#1e40af' }}>
                  提示词设置
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.75rem', color: '#3b82f6' }}>
                  定义智能体的核心行为和回答风格
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="自动生成">
                <IconButton 
                  onClick={generateSystemPrompt}
                  size="small"
                  sx={{ 
                    color: '#10b981',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    boxShadow: '0 2px 4px rgba(16, 185, 129, 0.1)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.9)',
                      color: '#059669'
                    }
                  }}
                >
                  <AutoAwesome fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="清空">
                <IconButton 
                  onClick={clearSystemPrompt}
                  size="small"
                  sx={{ 
                    color: '#ef4444',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.1)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.9)',
                      color: '#dc2626'
                    }
                  }}
                >
                  <Clear fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="重置为通用助手">
                <IconButton 
                  onClick={resetSystemPrompt}
                  size="small"
                  sx={{ 
                    color: '#3b82f6',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(147, 197, 253, 0.4)',
                    boxShadow: '0 2px 4px rgba(59, 130, 246, 0.1)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.9)',
                      color: '#1e40af'
                    }
                  }}
                >
                  <Refresh fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        {/* 卡片内容 */}
        <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5, minHeight: 0, overflow: 'hidden' }}>
          {/* 快速选择标签 */}
          <Box sx={{ flex: '0 0 auto' }}>
            <Typography variant="caption" sx={{ color: '#6b7280', mb: 1, display: 'block', fontWeight: 500 }}>
              快速选择模板：
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {quickTags.map((tag, index) => (
                <Chip
                  key={index}
                  icon={tag.icon}
                  label={tag.label}
                  variant="outlined"
                  size="small"
                  onClick={() => applyQuickTag(tag.prompt)}
                  sx={{
                    borderRadius: '8px',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    color: '#3b82f6',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderColor: '#3b82f6',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)'
                    },
                    '& .MuiChip-icon': {
                      color: 'inherit'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* 提示词输入框 */}
          <TextField
            fullWidth
            multiline
            label="系统提示词"
            value={config.system_prompt}
            onChange={handleChange('system_prompt')}
            placeholder="定义智能体的角色、专业领域和回答风格..."
            variant="outlined"
            helperText="系统提示词是智能体的大脑，决定了它的专业能力和回答风格"
            sx={{
              flex: 1,
              minHeight: 0,
              '& .MuiInputBase-input': {
                fontFamily: 'Monaco, "SF Mono", Consolas, monospace',
                fontSize: '0.85rem',
                lineHeight: 1.5
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(147, 197, 253, 0.3)',
                boxShadow: 'inset 0 1px 2px rgba(59, 130, 246, 0.05)',
                height: '100%',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                },
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.95)',
                  boxShadow: 'inset 0 1px 2px rgba(59, 130, 246, 0.05), 0 0 0 1px rgba(59, 130, 246, 0.3)'
                },
                '&.Mui-focused': {
                  background: 'rgba(255, 255, 255, 0.98)',
                  boxShadow: 'inset 0 1px 2px rgba(59, 130, 246, 0.05), 0 0 0 2px rgba(59, 130, 246, 0.2)'
                }
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#3b82f6'
              },
              '& .MuiInputBase-root': {
                height: '100%'
              },
              '& .MuiInputBase-inputMultiline': {
                height: '100% !important',
                overflow: 'auto !important'
              }
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default BasicConfigurationStep; 