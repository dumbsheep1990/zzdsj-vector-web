import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Dialog,
  Chip
} from '@mui/material';

// 三种模板的配置接口
interface SimpleQAConfig {
  // 基础配置
  systemPrompt: string;
  responseStyle: 'concise' | 'detailed' | 'conversational';
  language: string;
  
  // 模型参数
  temperature: number;
  maxTokens: number;
  maxContextLength: number;
  
  // 性能配置
  responseSpeed: 'fast' | 'balanced' | 'accurate';
  enableCache: boolean;
  
  // 工具配置
  tools: string[];
  
  // 输出配置
  outputFormat: 'text' | 'markdown' | 'structured';
}

// 系统指令配置组件
export const SystemInstructionsConfig: React.FC<{
  config: SimpleQAConfig;
  onChange: (config: SimpleQAConfig) => void;
}> = ({ config, onChange }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [requirements, setRequirements] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  const updateConfig = (field: string, value: any) => {
    onChange({ ...config, [field]: value });
  };

  // 系统内置提示词模板
  const systemTemplates = [
    {
      id: 'general',
      name: '通用助手',
      description: '友好、专业的通用AI助手',
      category: '通用',
      prompt: `你是一个友好、专业的AI助手，致力于为用户提供有价值的帮助和信息。

核心职责：
• 回答用户问题时保持准确性和有用性
• 以友好、耐心的语气与用户交流
• 承认不确定或超出知识范围的内容
• 提供结构化、易于理解的回答

交流原则：
• 保持礼貌和专业态度
• 根据问题复杂度调整回答详细程度
• 在必要时主动询问澄清信息
• 优先提供实用的建议和解决方案`
    },
    {
      id: 'professional',
      name: '专业顾问',
      description: '提供深度分析和专业建议',
      category: '专业',
      prompt: `你是一位经验丰富的专业顾问，专门为用户提供深入的分析和专业建议。

专业能力：
• 运用专业知识进行深度分析
• 提供基于逻辑和数据的建议
• 识别问题的关键要素和潜在影响
• 制定系统性的解决方案

工作方式：
• 首先理解问题的全貌和背景
• 运用结构化思维进行分析
• 提供多角度的观点和选择
• 给出明确的行动建议和注意事项`
    },
    {
      id: 'creative',
      name: '创意伙伴',
      description: '激发创意思维，提供创新解决方案',
      category: '创意',
      prompt: `你是一个富有创造力和想象力的创意伙伴，擅长激发用户的创新思维。

创意特长：
• 从多元化角度思考问题
• 运用类比、联想等创意技法
• 鼓励实验性和创新性思维
• 将抽象概念具象化表达

工作理念：
• 没有标准答案，鼓励探索
• 重视过程中的思维碰撞
• 培养开放性和可能性思维
• 将创意与实用性相结合`
    },
    {
      id: 'educator',
      name: '教育导师',
      description: '循序渐进的教学和指导',
      category: '教育',
      prompt: `你是一位耐心细致的教育导师，擅长用易懂的方式解释复杂概念。

教学特色：
• 根据用户水平调整解释深度
• 采用循序渐进的教学方法
• 运用生动的例子和类比
• 鼓励主动思考和提问

教学原则：
• 确保用户真正理解而非死记硬背
• 培养批判性思维和解决问题的能力
• 营造积极、鼓励的学习氛围
• 根据反馈及时调整教学策略`
    },
    {
      id: 'technical',
      name: '技术专家',
      description: '专注于技术问题的解决',
      category: '技术',
      prompt: `你是一位技术专家，专门帮助用户解决各类技术问题和挑战。

技术能力：
• 深入理解技术原理和最佳实践
• 提供准确的技术解决方案
• 解释复杂的技术概念
• 推荐合适的工具和方法

服务方式：
• 提供清晰的步骤指导
• 包含必要的技术细节和注意事项
• 考虑不同技术水平的用户需求
• 持续跟进解决方案的有效性`
    }
  ];



  // 应用模板
  const applyTemplate = (template: any) => {
    updateConfig('systemPrompt', template.prompt);
    setTemplateDialogOpen(false);
    setSelectedTemplate(null);
  };

  return (
    <Box sx={{ 
      p: 2, 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: 'auto',
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      borderRadius: '12px'
    }}>


      {/* 现代科技风格编辑区域 */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(145deg, #1e293b 0%, #334155 100%)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.15), 0 4px 16px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)'
        }
      }}>
        {/* 现代化标题栏 */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
          backdropFilter: 'blur(20px)',
          p: 2,
          color: '#e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              width: 24, 
              height: 24, 
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
              boxShadow: '0 4px 8px rgba(59, 130, 246, 0.3)'
            }}>
              AI
            </Box>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              fontSize: '16px',
              color: '#f1f5f9',
              letterSpacing: '0.5px'
            }}>
              AI 提示词设计器
            </Typography>
          </Box>
          
          {/* 现代化操作按钮 */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setTemplateDialogOpen(true)}
              sx={{
                color: '#3b82f6',
                borderColor: 'rgba(59, 130, 246, 0.3)',
                fontSize: '11px',
                py: 0.5,
                px: 1.5,
                minWidth: 'auto',
                borderRadius: '6px',
                backgroundColor: 'rgba(59, 130, 246, 0.05)',
                '&:hover': {
                  borderColor: '#3b82f6',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
                }
              }}
            >
              模板
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => setGenerateDialogOpen(true)}
              sx={{
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                fontSize: '11px',
                py: 0.5,
                px: 1.5,
                minWidth: 'auto',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563eb, #5b21b6)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)'
                }
              }}
            >
              AI生成
            </Button>
          </Box>
        </Box>
        

        
        {/* 现代化编辑器 */}
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
          <TextField
            fullWidth
            multiline
            rows={12}
            value={config.systemPrompt}
            onChange={(e) => updateConfig('systemPrompt', e.target.value)}
            placeholder="定义你的 AI 助手角色和能力... 🚀"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(30, 41, 59, 0.8)',
                borderRadius: '12px',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                '& fieldset': {
                  border: 'none'
                },
                '&:hover': {
                  backgroundColor: 'rgba(30, 41, 59, 0.9)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  boxShadow: '0 4px 16px rgba(59, 130, 246, 0.1)'
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(30, 41, 59, 0.95)',
                  border: '1px solid #3b82f6',
                  boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2), 0 8px 24px rgba(59, 130, 246, 0.15)'
                }
              },
              '& .MuiInputBase-input': {
                color: '#e2e8f0',
                padding: '16px',
                fontSize: '14px',
                '&::placeholder': {
                  color: '#64748b',
                  opacity: 0.8
                }
              },
              '& .MuiInputBase-inputMultiline': {
                height: '100% !important'
              }
            }}
          />
          

        </Box>
      </Box>



      {/* 模板选择对话框 */}
      <Dialog 
        open={templateDialogOpen} 
        onClose={() => setTemplateDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 8px 16px rgba(59, 130, 246, 0.2)'
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ 
            mb: 3, 
            fontWeight: 700,
            color: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            选择系统内置模板
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 2
          }}>
            {systemTemplates.map((template) => (
              <Paper
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  cursor: 'pointer',
                  border: selectedTemplate === template.id ? '2px solid #667eea' : '2px solid #e5e7eb',
                  backgroundColor: selectedTemplate === template.id ? 'rgba(102, 126, 234, 0.05)' : '#ffffff',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    borderColor: '#667eea'
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                    {template.name}
                  </Typography>
                  <Chip 
                    label={template.category} 
                    size="small" 
                    sx={{ 
                      backgroundColor: '#f3f4f6',
                      color: '#6b7280',
                      fontWeight: 500
                    }} 
                  />
                </Box>
                <Typography variant="body2" sx={{ color: '#6b7280', mb: 2 }}>
                  {template.description}
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: '#9ca3af',
                  display: 'block',
                  lineHeight: 1.4
                }}>
                  {template.prompt.substring(0, 100)}...
                </Typography>
              </Paper>
            ))}
          </Box>
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button 
              onClick={() => setTemplateDialogOpen(false)}
              sx={{ 
                borderRadius: '10px',
                textTransform: 'none',
                color: '#6b7280'
              }}
            >
              取消
            </Button>
            <Button
              variant="contained"
              disabled={!selectedTemplate}
              onClick={() => {
                const template = systemTemplates.find(t => t.id === selectedTemplate);
                if (template) applyTemplate(template);
              }}
              sx={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563eb 0%, #5b21b6 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)'
                }
              }}
            >
              应用模板
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* AI生成对话框 */}
      <Dialog 
        open={generateDialogOpen} 
        onClose={() => setGenerateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 8px 16px rgba(59, 130, 246, 0.2)',
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ 
            mb: 2, 
            fontWeight: 600,
            color: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            AI智能生成提示词
          </Typography>
          <Typography variant="body2" sx={{ 
            mb: 3,
            color: '#94a3b8'
          }}>
            描述您希望智能体具备的能力和特点，AI将为您生成专业的提示词
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="例如：我需要一个专业的客服助手，能够友好地回答用户问题，具备产品知识..."
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(30, 41, 59, 0.8)',
                borderRadius: '12px',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                '& fieldset': {
                  border: 'none'
                },
                '&:hover': {
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  boxShadow: '0 4px 16px rgba(59, 130, 246, 0.1)'
                },
                '&.Mui-focused': {
                  border: '1px solid #3b82f6',
                  boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)'
                }
              },
              '& .MuiInputBase-input': {
                color: '#e2e8f0',
                '&::placeholder': {
                  color: '#64748b',
                  opacity: 0.8
                }
              }
            }}
          />
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => setGenerateDialogOpen(false)}
              sx={{ 
                borderRadius: '10px',
                color: '#94a3b8',
                borderColor: 'rgba(148, 163, 184, 0.3)',
                '&:hover': {
                  borderColor: '#94a3b8',
                  backgroundColor: 'rgba(148, 163, 184, 0.05)'
                }
              }}
            >
              取消
            </Button>
            <Button
              variant="contained"
              disabled={!requirements.trim() || isGenerating}
              onClick={async () => {
                setIsGenerating(true);
                try {
                  // 模拟AI生成
                  await new Promise(resolve => setTimeout(resolve, 2000));
                  const generatedPrompt = `你是一个专业的智能助手，具备以下特点：

基于用户需求：${requirements}

你的职责包括：
• 理解并准确回应用户的问题和需求
• 提供专业、准确的信息和建议
• 保持友好、耐心的服务态度
• 在不确定时诚实表达并建议获取更多信息

请始终遵循以上原则，为用户提供最佳的服务体验。`;
                  
                  updateConfig('systemPrompt', generatedPrompt);
                  setGenerateDialogOpen(false);
                  setRequirements('');
                } catch (error) {
                  console.error('生成失败:', error);
                } finally {
                  setIsGenerating(false);
                }
                             }}
               sx={{
                 background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                 borderRadius: '10px',
                 textTransform: 'none',
                 fontWeight: 600,
                 px: 3,
                 boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                 '&:hover': {
                   background: 'linear-gradient(135deg, #2563eb 0%, #5b21b6 100%)',
                   transform: 'translateY(-1px)',
                   boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)'
                 }
               }}
             >
               {isGenerating ? '生成中...' : '生成提示词'}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

// 默认配置
export const defaultSimpleQAConfig: SimpleQAConfig = {
  // 基础配置
  systemPrompt: '你是一个智能助手，请根据用户的问题提供准确、有用的回答。',
  responseStyle: 'detailed' as const,
  language: 'zh-CN',
  
  // 模型参数
  temperature: 0.7,
  maxTokens: 2000,
  maxContextLength: 4000,
  
  // 性能配置
  responseSpeed: 'balanced' as const,
  enableCache: true,
  
  // 工具配置
  tools: [],
  
  // 输出配置
  outputFormat: 'text' as const
};