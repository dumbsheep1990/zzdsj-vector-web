import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  IconButton, 
  Divider,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade
} from '@mui/material';
import { 
  CopyOutlined, 
  ReloadOutlined, 
  QuestionCircleOutlined, 
  ImportOutlined,
  EditOutlined,
  TagsOutlined,
  RobotOutlined,
  CodeOutlined,
  BarChartOutlined,
  ReadOutlined,
  UserOutlined
} from '@ant-design/icons';
import { getAllPromptTemplates, fillPromptTemplate } from '../../../services/promptTemplateService';
import { PromptTemplate } from './types';

// 系统内置变量定义
const systemVariables = [
  { name: 'user_name', description: '用户名称', defaultValue: '用户' },
  { name: 'assistant_name', description: '助手名称', defaultValue: '智能助手' },
  { name: 'current_date', description: '当前日期', defaultValue: new Date().toLocaleDateString() },
  { name: 'company_name', description: '公司名称', defaultValue: '数字人科技' },
  { name: 'model_name', description: '模型名称', defaultValue: 'GPT-4' }
];

// 快速提示词分类标签
const promptCategories = [
  {
    id: 'general',
    name: '通用助手',
    icon: <RobotOutlined />,
    color: '#10b981',
    content: '你是一个功能全面的智能助手，可以回答用户的各类问题。始终以友好、专业的语气回应，并保持对话的连贯性和相关性。当不确定时，应该主动询问用户以获取更多信息。',
  },
  {
    id: 'coding',
    name: '代码助手',
    icon: <CodeOutlined />,
    color: '#3b82f6',
    content: '你是一个经验丰富的编程师和技术教练。当用户提出代码相关问题时，你会提供简洁且高效的代码示例和解释。你熟悉多种编程语言，并始终遵循最佳实践与设计模式。',
  },
  {
    id: 'data',
    name: '数据分析',
    icon: <BarChartOutlined />,
    color: '#8b5cf6',
    content: '你是一位专业的数据分析师。你擅长数据解释、统计分析和数据可视化。当用户提供数据或请求数据分析时，你会以清晰的方式解释观察到的模式和见解，并提供有效的分析方法建议。',
  },
  {
    id: 'creative',
    name: '创意写作',
    icon: <ReadOutlined />,
    color: '#ec4899',
    content: '你是一位具有创造力的写作助手。擅长各种写作风格，从故事、诗歌到文案和脚本。你能够根据用户的需求生成独特、引人入胜的内容，并能够建议如何改进用户自己的写作。',
  },
  {
    id: 'roleplay',
    name: '角色扮演',
    icon: <UserOutlined />,
    color: '#f59e0b',
    content: '你将扮演用户指定的角色，保持对该角色的背景、性格和专业知识的一致性。你将始终以该角色的语气和视角回应，并不会跳出角色。你的目标是创造沉浸式的互动体验。',
  },
];

interface SystemPromptCardProps {
  value: string;
  onChange: (value: string) => void;
  onReset?: () => void;
}

const SystemPromptCard: React.FC<SystemPromptCardProps> = ({ 
  value, 
  onChange,
  onReset 
}) => {
  const [copied, setCopied] = useState(false);
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [templateMenuAnchor, setTemplateMenuAnchor] = useState<null | HTMLElement>(null);
  const [variableDialogOpen, setVariableDialogOpen] = useState(false);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [variableMenuAnchor, setVariableMenuAnchor] = useState<null | HTMLElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [basicInfo, setBasicInfo] = useState<{description?: string}>({});
  const [knowledgeBaseDialogOpen, setKnowledgeBaseDialogOpen] = useState<boolean>(false);
  const [selectedKnowledgeBases, setSelectedKnowledgeBases] = useState<string[]>([]);
  // 添加文本域引用
  const textFieldRef = React.useRef<HTMLInputElement>(null);

  // 加载提示词模板
  useEffect(() => {
    const loadTemplates = async () => {
      const availableTemplates = getAllPromptTemplates();
      setTemplates(availableTemplates);
    };
    
    loadTemplates();
  }, []);
  
  // 尝试获取上一步的基础信息
  useEffect(() => {
    // 从本地存储或API获取基础信息
    // 这里模拟获取数据
    const getBasicInfo = async () => {
      try {
        // 实际实现时应该调用API或从全局状态获取
        const mockData = {
          description: '这是一个智能向量搜索助手，可以帮助用户快速检索和分析文档数据库。'
        };
        setBasicInfo(mockData);
      } catch (error) {
        console.error('获取基础信息失败', error);
      }
    };
    
    getBasicInfo();
  }, []);

  // 复制系统提示词到剪贴板
  const copySystemPrompt = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 打开模板选择菜单
  const handleTemplateMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setTemplateMenuAnchor(event.currentTarget);
  };

  // 关闭模板选择菜单
  const handleTemplateMenuClose = () => {
    setTemplateMenuAnchor(null);
  };

  // 选择模板
  const handleTemplateSelect = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    
    // 如果模板包含变量，打开变量编辑对话框
    if (template.variables && template.variables.length > 0) {
      // 初始化变量值为默认值
      const initialValues: Record<string, string> = {};
      template.variables.forEach(variable => {
        initialValues[variable.name] = variable.defaultValue || '';
      });
      setVariableValues(initialValues);
      setVariableDialogOpen(true);
    } else {
      // 直接应用模板内容
      onChange(template.content);
    }
    handleTemplateMenuClose();
  };

  // 应用带变量的模板
  const applyTemplateWithVariables = () => {
    if (selectedTemplate) {
      const filledContent = fillPromptTemplate(selectedTemplate, variableValues);
      onChange(filledContent);
      setVariableDialogOpen(false);
    }
  };

  // 打开变量插入菜单
  const handleVariableMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setVariableMenuAnchor(event.currentTarget);
  };

  // 关闭变量插入菜单
  const handleVariableMenuClose = () => {
    setVariableMenuAnchor(null);
  };

  // 获取文本框中的光标位置
  const handleTextFieldFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setCursorPosition(event.target.selectionStart);
  };

  const handleTextFieldClick = (event: React.MouseEvent<HTMLInputElement>) => {
    setCursorPosition((event.target as HTMLInputElement).selectionStart);
  };
  
  // 连续跟踪光标位置变化
  const handleSelectionChange = () => {
    if (textFieldRef.current) {
      const input = textFieldRef.current.querySelector('textarea');
      if (input) {
        setCursorPosition(input.selectionStart);
      }
    }
  };
  
  // 添加选择位置追踪
  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  // 插入变量到文本框中的光标位置
  const insertVariable = (variableName: string) => {
    if (cursorPosition !== null) {
      const newValue = value.substring(0, cursorPosition) + 
                      `{{${variableName}}}` + 
                      value.substring(cursorPosition);
      onChange(newValue);
    } else {
      onChange(value + `{{${variableName}}}`);
    }
    handleVariableMenuClose();
  };

  // 使用标签分类的提示词
  const handleCategorySelect = (content: string, id: string) => {
    onChange(content);
    setSelectedCategory(id);
  };
  
  // 使用AI生成提示词
  const handleAIGenerate = async (type: 'basic' | 'knowledge') => {
    setIsGenerating(true);
    
    try {
      if (type === 'basic') {
        // 基于上一步基础信息生成提示词
        if (basicInfo.description) {
          // 实际项目中应调用API生成
          // 这里模拟生成结果
          setTimeout(() => {
            const generatedPrompt = `你是一个专业的${basicInfo.description}

你的主要功能包括：
1. 支持向量数据库的快速搜索和查询
2. 理解用户提供的文档内容并提取关键信息
3. 生成符合用户需求的精准回答
4. 在不确定时详细说明信息来源和判断依据

你不能做的事情：
1. 生成虚假或不存在的内容
2. 回答与可用数据不相符的问题
3. 没有数据支持时做出断言

你应始终保持专业、客观和有帮助性的态度。`;            
            onChange(generatedPrompt);
            setIsGenerating(false);
          }, 1000);
        } else {
          alert('无法获取基础描述信息，请先完成基础信息设置');
          setIsGenerating(false);
        }
      } else if (type === 'knowledge') {
        // 打开知识库选择对话框
        setKnowledgeBaseDialogOpen(true);
        setIsGenerating(false);
      }
    } catch (error) {
      console.error('AI生成提示词失败', error);
      setIsGenerating(false);
    }
  };
  
  // 生成知识库提示词
  const generateKnowledgeBasePrompt = () => {
    if (selectedKnowledgeBases.length === 0) {
      alert('请至少选择一个知识库');
      return;
    }
    
    setIsGenerating(true);
    setKnowledgeBaseDialogOpen(false);
    
    // 实际项目中应调用API生成
    // 这里模拟生成结果
    setTimeout(() => {
      const kbNames = selectedKnowledgeBases.join('、');
      const generatedPrompt = `你是一个由向量知识库增强的智能助手，专门帮助用户查询和理解${kbNames}相关的信息。

你能够：
1. 帮助用户从知识库中检索相关信息
2. 理解并解释知识库中的复杂概念
3. 基于知识库中的数据生成精确的答案
4. 定期更新以确保提供最新信息

当回答用户问题时：
- 如果知识库中有相关信息，则专业地回答并引用来源
- 如果信息不足，正确说明信息的局限性
- 始终清晰地区分哪些是知识库中的事实，哪些是你自己的推理

请保持专业、客观和有帮助性的态度，但觉得友善和实用。`;            
      onChange(generatedPrompt);
      setIsGenerating(false);
    }, 1000);
  };
  
  // 处理格式化提示词
  const handleFormatPrompt = () => {
    try {
      if (!value.trim()) return; // 空文本不需要格式化
      
      // 格式化过程
      let formattedContent = value;
      
      // 1. 规范列表格式
      formattedContent = formattedContent.replace(/^(\d+)\.(?=\S)/gm, '$1. ');
      formattedContent = formattedContent.replace(/^-(?=\S)/gm, '- ');
      
      // 2. 处理过多的空行
      formattedContent = formattedContent.replace(/\n{3,}/g, '\n\n');
      
      // 3. 确保段落间空行
      const paragraphs = formattedContent.split('\n\n');
      const trimmedParagraphs = paragraphs.map(p => p.trim());
      formattedContent = trimmedParagraphs.join('\n\n');
      
      // 4. 去除行首行尾空格
      const lines = formattedContent.split('\n');
      const trimmedLines = lines.map(line => line.trim());
      formattedContent = trimmedLines.join('\n');
      
      // 5. 规范作用域格式
      // 例如：确保"你能够"后面的列表格式正确
      formattedContent = formattedContent.replace(/[\uff1a:](\s*)[\n\r]/g, ':\n');
      
      // 6. 确保标题格式化正确
      formattedContent = formattedContent.replace(/^(#+)(?=\S)/gm, '$1 ');
      
      onChange(formattedContent);
      
      // 格式化后聚焦回文本框
      setTimeout(() => {
        if (textFieldRef.current) {
          const input = textFieldRef.current.querySelector('textarea');
          if (input) {
            input.focus();
          }
        }
      }, 100);
    } catch (error) {
      console.error('格式化失败', error);
    }
  };
  
  // 编辑器工具栏功能
  const handleToolAction = (action: string) => {
    // 清除不需要光标位置的操作
    if (action === 'clear') {
      onChange('');
      return;
    }
    
    // 如果没有光标位置，则默认在文本最后添加
    const pos = cursorPosition !== null ? cursorPosition : value.length;
    const beforeCursor = value.substring(0, pos);
    const afterCursor = value.substring(pos);
    let newValue = value;
    
    switch (action) {
      case 'bold':
        newValue = beforeCursor + '**粗体文本**' + afterCursor;
        break;
      case 'list':
        newValue = beforeCursor + '\n1. 列表项目\n2. 列表项目\n' + afterCursor;
        break;
      case 'paragraph':
        newValue = beforeCursor + '\n\n' + afterCursor;
        break;
      default:
        return; // 不支持的操作直接返回
    }
    
    onChange(newValue);
    
    // 继续保持聚焦
    setTimeout(() => {
      if (textFieldRef.current) {
        const input = textFieldRef.current.querySelector('textarea');
        if (input) {
          input.focus();
          // 将光标位置移动到插入内容后面
          const newCursorPos = action === 'bold' ? pos + 6 : pos;
          input.setSelectionRange(newCursorPos, newCursorPos);
        }
      }
    }, 0);
  };

  return (
    <Card
      className="system-prompt-card"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(226, 232, 240, 0.8)',
      }}
    >
      <Box
        sx={{
          p: 2,
          background: 'linear-gradient(135deg, #4ade80 0%, #16a34a 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
        }}
      >
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600, letterSpacing: '0.3px' }}>
          系统提示词
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.8 }}>
          <Tooltip title="导入提示词模板" placement="top">
            <IconButton 
              size="small" 
              onClick={handleTemplateMenuOpen}
              className="header-button"
              sx={{ 
                color: 'white', 
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                transition: 'all 0.2s ease',
                '&:hover': { 
                  bgcolor: 'rgba(0, 0, 0, 0.3)', 
                  color: '#e2e8f0' 
                }
              }}
            >
              <ImportOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="插入变量" placement="top">
            <IconButton 
              size="small" 
              onClick={handleVariableMenuOpen}
              className="header-button"
              sx={{ 
                color: 'white', 
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                transition: 'all 0.2s ease',
                '&:hover': { 
                  bgcolor: 'rgba(0, 0, 0, 0.3)', 
                  color: '#e2e8f0' 
                }
              }}
            >
              <TagsOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title={copied ? "已复制!" : "复制提示词"} placement="top">
            <IconButton 
              size="small" 
              onClick={copySystemPrompt}
              className="header-button"
              sx={{ 
                color: 'white', 
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                transition: 'all 0.2s ease',
                '&:hover': { 
                  bgcolor: 'rgba(0, 0, 0, 0.3)', 
                  color: '#e2e8f0' 
                }
              }}
            >
              <CopyOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="重置提示词" placement="top">
            <IconButton 
              size="small" 
              onClick={onReset}
              className="header-button"
              sx={{ 
                color: 'white', 
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                transition: 'all 0.2s ease',
                '&:hover': { 
                  bgcolor: 'rgba(0, 0, 0, 0.3)', 
                  color: '#e2e8f0' 
                }
              }}
            >
              <ReloadOutlined />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Box sx={{ 
        py: 1.5,
        px: 2, 
        bgcolor: 'rgba(16, 185, 129, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)'
      }}>
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: '#047857', fontSize: '0.85rem' }}>
          <QuestionCircleOutlined style={{ marginRight: 8, color: '#059669' }} />
          定义智能体的基本行为和能力，支持<strong>变量{'{{'}变量名{'}}'}</strong>格式
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RobotOutlined />}
            onClick={() => handleAIGenerate('basic')}
            sx={{
              borderColor: 'rgba(16, 185, 129, 0.5)',
              color: '#059669',
              fontSize: '0.75rem',
              textTransform: 'none',
              '&:hover': {
                borderColor: '#059669',
                bgcolor: 'rgba(16, 185, 129, 0.05)'
              }
            }}
          >
            AI生成
          </Button>
          
          <Button
            variant="outlined"
            size="small"
            startIcon={<BarChartOutlined />}
            onClick={() => handleAIGenerate('knowledge')}
            sx={{
              borderColor: 'rgba(79, 70, 229, 0.5)',
              color: '#4f46e5',
              fontSize: '0.75rem',
              textTransform: 'none',
              '&:hover': {
                borderColor: '#4f46e5',
                bgcolor: 'rgba(79, 70, 229, 0.05)'
              }
            }}
          >
            知识库提示词
          </Button>
        </Box>
      </Box>

      {/* 快速提示词分类标签 */}
      <Box sx={{ 
        px: 2, 
        py: 1.5,
        display: 'flex',
        flexWrap: 'wrap', 
        gap: 1,
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        bgcolor: 'white'
      }}>
        <Typography variant="caption" sx={{ width: '100%', mb: 0.5, color: '#64748b', fontWeight: 500 }}>
          快速提示词模板：
        </Typography>
        {promptCategories.map(category => (
          <Chip
            key={category.id}
            icon={<Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>{category.icon}</Box>}
            label={category.name}
            onClick={() => handleCategorySelect(category.content, category.id)}
            variant={selectedCategory === category.id ? "filled" : "outlined"}
            sx={{
              borderRadius: '6px',
              height: '32px',
              fontWeight: 500,
              bgcolor: selectedCategory === category.id ? `${category.color}15` : 'transparent',
              color: category.color,
              borderColor: `${category.color}40`,
              '&:hover': {
                bgcolor: `${category.color}20`,
              },
              '& .MuiChip-icon': {
                color: category.color,
              }
            }}
          />
        ))}
      </Box>
      
      <Box sx={{ 
        flexGrow: 1, 
        p: 1.5, // 减少内边距
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f8fafc',
        height: 'calc(100% - 100px)', // 增加可用高度，减少因头部和标签去除的高度
        overflow: 'hidden', // 防止整个容器滚动
      }}>
        {/* 文本编辑器工具栏 */}
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1,
          px: 1,
          py: 0.5,
          borderRadius: '8px',
          bgcolor: 'white',
          border: '1px solid rgba(226, 232, 240, 0.8)',
        }}>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="加粗" placement="top">
              <IconButton 
                size="small" 
                onClick={() => handleToolAction('bold')}
                sx={{ color: '#64748b', padding: '4px' }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700 }}>B</Typography>
              </IconButton>
            </Tooltip>
            <Tooltip title="添加列表" placement="top">
              <IconButton 
                size="small" 
                onClick={() => handleToolAction('list')}
                sx={{ color: '#64748b', padding: '4px' }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>• 列表</Typography>
              </IconButton>
            </Tooltip>
            <Tooltip title="添加段落" placement="top">
              <IconButton 
                size="small" 
                onClick={() => handleToolAction('paragraph')}
                sx={{ color: '#64748b', padding: '4px' }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>¶</Typography>
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
            <Tooltip title="格式化" placement="top">
              <IconButton 
                size="small" 
                onClick={handleFormatPrompt}
                sx={{ color: '#64748b', padding: '4px' }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>格式化</Typography>
              </IconButton>
            </Tooltip>
          </Box>
          <Box>
            {isGenerating ? (
              <Chip 
                label="正在生成..." 
                size="small" 
                color="primary"
                sx={{ height: 24, borderRadius: '4px' }}
              />
            ) : (
              <Tooltip title="清空" placement="top">
                <IconButton 
                  size="small" 
                  onClick={() => handleToolAction('clear')}
                  sx={{ color: '#ef4444', padding: '4px' }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>清空</Typography>
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
        
        {/* 输入区域 */}
        <Box sx={{ 
          flexGrow: 1, 
          height: '450px', // 调整为合适的中间高度
          mb: 1,
          border: '1px solid rgba(226, 232, 240, 0.8)',
          borderRadius: '8px',
          bgcolor: 'white',
          boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.03)',
          '& .MuiInputBase-root': { overflow: 'hidden !important' },
          '& textarea': { overflow: 'hidden !important' },
          '& *::-webkit-scrollbar': { display: 'none' },
          '& *': { scrollbarWidth: 'none', msOverflowStyle: 'none' },
        }}>
          <TextField
            ref={textFieldRef}
            multiline
            fullWidth
            variant="outlined"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleTextFieldFocus}
            onClick={handleTextFieldClick}
            placeholder="输入系统提示词，支持{{变量名}}格式的变量..."
            InputProps={{
              disableUnderline: true,
              sx: {
                height: '100%',
                fontSize: '0.95rem',
                '& .MuiOutlinedInput-input': {
                  height: '100% !important',
                  padding: '12px',
                  lineHeight: '1.5',
                  overflow: 'hidden', // 完全禁用滚动
                  '&::-webkit-scrollbar': {
                    width: '0px', // 隐藏滚动条
                    display: 'none',
                  }
                }
              }
            }}
            sx={{ 
              height: '100%', 
              border: 'none',
              overflow: 'hidden',
              '& .MuiOutlinedInput-root': {
                height: '100%',
                overflow: 'hidden',
                '&.Mui-focused': {
                  '& fieldset': {
                    border: 'none'
                  }
                },
                '& fieldset': {
                  border: 'none'
                },
                '&:hover fieldset': {
                  border: 'none'
                }
              }
            }}
          />
        </Box>
        
        {/* 当前使用的变量标签显示区域 */}
        {value.match(/\{\{[^\}]+\}\}/g) && (
          <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
            <Typography variant="caption" sx={{ mr: 1, pt: 0.5, color: '#64748b', fontWeight: 500 }}>
              标记变量:
            </Typography>
            {Array.from(new Set((value.match(/\{\{([^\}]+)\}\}/g) || []).map(v => v.replace(/\{\{|\}\}/g, ''))))
              .map((variable) => (
                <Chip
                  key={variable}
                  label={variable}
                  size="small"
                  sx={{ 
                    borderRadius: '4px', 
                    height: '24px',
                    bgcolor: 'rgba(16, 185, 129, 0.08)',
                    color: '#047857',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    fontSize: '0.75rem',
                    fontWeight: 500
                  }}
                />
              ))}
          </Box>
        )}
      </Box>
      {/* 模板菜单 */}
      <Menu
        anchorEl={templateMenuAnchor}
        open={Boolean(templateMenuAnchor)}
        onClose={handleTemplateMenuClose}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            mt: 1,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            borderRadius: '8px',
            width: '320px',
            maxHeight: '400px',
            overflow: 'auto'
          }
        }}
      >
        <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: '#1e40af' }}>
          选择提示词模板
        </Typography>
        <Divider />
        {templates.map((template) => (
          <MenuItem 
            key={template.id} 
            onClick={() => handleTemplateSelect(template)}
            sx={{ 
              py: 1.5,
              '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.08)' }
            }}
          >
            <ListItemIcon sx={{ color: '#3b82f6' }}>
              <EditOutlined />
            </ListItemIcon>
            <ListItemText 
              primary={template.name} 
              secondary={template.description}
              primaryTypographyProps={{ fontWeight: 500 }}
              secondaryTypographyProps={{ 
                variant: 'caption',
                sx: { 
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }
              }}
            />
          </MenuItem>
        ))}
      </Menu>
      
      {/* 变量菜单 */}
      <Menu
        anchorEl={variableMenuAnchor}
        open={Boolean(variableMenuAnchor)}
        onClose={handleVariableMenuClose}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            mt: 1,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            borderRadius: '8px',
            width: '280px'
          }
        }}
      >
        <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: '#1e40af' }}>
          插入系统变量
        </Typography>
        <Divider />
        {systemVariables.map((variable) => (
          <MenuItem 
            key={variable.name} 
            onClick={() => insertVariable(variable.name)}
            sx={{ 
              py: 1.2,
              '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.08)' }
            }}
          >
            <ListItemText 
              primary={variable.name} 
              secondary={variable.description}
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </MenuItem>
        ))}
      </Menu>
      
      {/* 变量编辑对话框 */}
      <Dialog 
        open={variableDialogOpen} 
        onClose={() => setVariableDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'rgba(59, 130, 246, 0.08)', 
          borderBottom: '1px solid rgba(59, 130, 246, 0.15)',
          fontWeight: 600
        }}>
          编辑模板变量
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {selectedTemplate?.variables?.map((variable) => (
              <TextField
                key={variable.name}
                label={variable.name}
                fullWidth
                value={variableValues[variable.name] || ''}
                onChange={(e) => setVariableValues(prev => ({
                  ...prev,
                  [variable.name]: e.target.value
                }))}
                helperText={variable.description}
                required={variable.required}
                placeholder={variable.defaultValue}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused': {
                      borderColor: '#3b82f6'
                    }
                  }
                }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <Button onClick={() => setVariableDialogOpen(false)} sx={{ color: 'text.secondary' }}>
            取消
          </Button>
          <Button 
            onClick={applyTemplateWithVariables} 
            variant="contained"
            sx={{ 
              bgcolor: '#3b82f6', 
              '&:hover': { bgcolor: '#2563eb' }
            }}
          >
            应用模板
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 知识库选择对话框 */}
      <Dialog 
        open={knowledgeBaseDialogOpen} 
        onClose={() => setKnowledgeBaseDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'rgba(79, 70, 229, 0.08)', 
          borderBottom: '1px solid rgba(79, 70, 229, 0.15)',
          fontWeight: 600
        }}>
          选择知识库模型
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" sx={{ mb: 2, color: '#64748b' }}>
            请选择要为提示词添加的知识库，系统将自动生成相应的提示词指令。
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {/* 模拟知识库列表 */}
            {['产品文档库', '技术文档库', '营销资料库', '客户支持库'].map((kb) => (
              <Box 
                key={kb}
                sx={{
                  p: 1.5,
                  border: '1px solid',
                  borderColor: selectedKnowledgeBases.includes(kb) ? 'rgba(79, 70, 229, 0.5)' : 'rgba(226, 232, 240, 0.8)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  bgcolor: selectedKnowledgeBases.includes(kb) ? 'rgba(79, 70, 229, 0.05)' : 'white',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  '&:hover': {
                    borderColor: 'rgba(79, 70, 229, 0.5)',
                    bgcolor: 'rgba(79, 70, 229, 0.02)'
                  }
                }}
                onClick={() => {
                  if (selectedKnowledgeBases.includes(kb)) {
                    setSelectedKnowledgeBases(selectedKnowledgeBases.filter(k => k !== kb));
                  } else {
                    setSelectedKnowledgeBases([...selectedKnowledgeBases, kb]);
                  }
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{kb}</Typography>
                <Chip 
                  size="small" 
                  label={selectedKnowledgeBases.includes(kb) ? '已选择' : '点击选择'}
                  color={selectedKnowledgeBases.includes(kb) ? 'primary' : 'default'}
                  sx={{ height: '24px', borderRadius: '4px' }}
                />
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <Button 
            onClick={() => setKnowledgeBaseDialogOpen(false)} 
            sx={{ color: 'text.secondary' }}
          >
            取消
          </Button>
          <Button 
            onClick={generateKnowledgeBasePrompt} 
            variant="contained"
            disabled={selectedKnowledgeBases.length === 0}
            sx={{ 
              bgcolor: '#4f46e5', 
              '&:hover': { bgcolor: '#4338ca' }
            }}
          >
            生成提示词
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default SystemPromptCard;
