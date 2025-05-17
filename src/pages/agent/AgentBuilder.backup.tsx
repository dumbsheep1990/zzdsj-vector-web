import React, { useState } from 'react';
import { 
  Box,
  Button, 
  Chip,
  Avatar,
  Paper,
  Typography,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PaletteIcon from '@mui/icons-material/Palette';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import BuildIcon from '@mui/icons-material/Build';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';
import CalculateIcon from '@mui/icons-material/Calculate';
import CloudIcon from '@mui/icons-material/Cloud';
import GitHubIcon from '@mui/icons-material/GitHub';
import TerminalIcon from '@mui/icons-material/Terminal';
import StorageIcon from '@mui/icons-material/Storage';
import ImageIcon from '@mui/icons-material/Image';
import { PageContainer, ContentArea } from './components/StyledComponents';
import { Tool, categoryColors } from './components/types.tsx';
import BasicInfoCard from './components/BasicInfoCard';
import SystemPromptCard from './components/SystemPromptCard';
import ToolsCard from './components/ToolsCard';

// 定义Agent模板类型
interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  baseAgentType: string;
  systemPrompt: string;
  suggestedTools: string[];
}

// 预定义Agent模板
const AGENT_TEMPLATES: AgentTemplate[] = [
  {
    id: 'general',
    name: '通用助手',
    description: '全能型智能助手，适用于各种日常查询和任务',
    icon: <SmartToyIcon />,
    baseAgentType: 'assistant',
    systemPrompt: '你是一个友好、有帮助的AI助手。根据用户的需求提供准确、有用的信息和建议。',
    suggestedTools: ['search', 'calculator', 'weather']
  },
  {
    id: 'code',
    name: '代码助手',
    description: '专注于编程和软件开发的智能助手',
    icon: <CodeIcon />,
    baseAgentType: 'coder',
    systemPrompt: '你是一个专业的编程助手。帮助用户解决代码问题，提供编程建议，并协助完成软件开发任务。',
    suggestedTools: ['code_interpreter', 'github', 'terminal']
  },
  {
    id: 'education',
    name: '学习助手',
    description: '帮助学习和教育指导的智能助手',
    icon: <SchoolIcon />,
    baseAgentType: 'tutor',
    systemPrompt: '你是一个有耐心、善于解释的教育助手。帮助用户理解复杂概念，回答学习问题，并提供高质量的教育指导。',
    suggestedTools: ['knowledge_base', 'calculator', 'diagram']
  },
  {
    id: 'creative',
    name: '创意助手',
    description: '专注于创意和内容创作的智能助手',
    icon: <PaletteIcon />,
    baseAgentType: 'creative',
    systemPrompt: '你是一个富有创意和想象力的助手。帮助用户发展创意，提供内容创作建议，并激发灵感。',
    suggestedTools: ['image_generator', 'text_editor', 'brainstorm']
  },
  {
    id: 'support',
    name: '客服助手',
    description: '专注于客户支持和服务的智能助手',
    icon: <SupportAgentIcon />,
    baseAgentType: 'support',
    systemPrompt: '你是一个专业、有礼貌的客户服务助手。帮助解决用户问题，回答咨询，并提供优质的客户服务体验。',
    suggestedTools: ['knowledge_base', 'ticket_system', 'faq']
  }
];



// 智能体构建器组件
const AgentBuilder = () => {
  // 组件状态
  const navigate = useNavigate();
  const [agentName, setAgentName] = useState('');
  const [description, setDescription] = useState('');
  const [baseAgentType, setBaseAgentType] = useState('assistant');
  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
  const [systemPrompt, setSystemPrompt] = useState('');
  
  // 模板选择对话框
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  // 处理模板菜单
  const handleTemplateMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleTemplateMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const openTemplateDialog = () => {
    handleTemplateMenuClose();
    setTemplateDialogOpen(true);
  };
  
  // 预定义可用的工具
  const availableTools: Tool[] = [
    {
      id: 'search',
      name: '搜索',
      description: '在网上搜索信息',
      category: 'utility',
      icon: <SearchIcon />
    },
    {
      id: 'calculator',
      name: '计算器',
      description: '执行复杂的数学计算',
      category: 'utility',
      icon: <CalculateIcon />
    },
    {
      id: 'weather',
      name: '天气',
      description: '获取天气信息',
      category: 'utility',
      icon: <CloudIcon />
    },
    {
      id: 'code_interpreter',
      name: '代码解释器',
      description: '解析和执行代码',
      category: 'development',
      icon: <CodeIcon />
    },
    {
      id: 'github',
      name: 'GitHub',
      description: '操作GitHub仓库',
      category: 'development',
      icon: <GitHubIcon />
    },
    {
      id: 'terminal',
      name: '终端',
      description: '执行命令行操作',
      category: 'development',
      icon: <TerminalIcon />
    },
    {
      id: 'knowledge_base',
      name: '知识库',
      description: '查询结构化知识',
      category: 'data',
      icon: <StorageIcon />
    },
    {
      id: 'image_generator',
      name: '图像生成',
      description: '生成图像和图形',
      category: 'creative',
      icon: <ImageIcon />
    }
  ];
  
  // 应用选择的模板
  const applyTemplate = (template: AgentTemplate) => {
    setAgentName(template.name);
    setDescription(template.description);
    setBaseAgentType(template.baseAgentType);
    setSystemPrompt(template.systemPrompt);
    
    // 根据模板建议选择工具
    const availableToolsById = availableTools.reduce<Record<string, Tool>>((acc: Record<string, Tool>, tool: Tool) => {
      acc[tool.id] = tool;
      return acc;
    }, {});
    
    const suggestedToolObjects = template.suggestedTools
      .map(toolId => availableToolsById[toolId])
      .filter((tool): tool is Tool => Boolean(tool)); // 过滤掉不存在的工具
    
    setSelectedTools(suggestedToolObjects);
    setTemplateDialogOpen(false);
  };
  
  // 处理工具选择状态
  const toggleToolSelection = (tool: Tool) => {
    setSelectedTools(prev => {
      const isSelected = prev.some(t => t.id === tool.id);
      if (isSelected) {
        return prev.filter(t => t.id !== tool.id);
      } else {
        return [...prev, tool];
      }
    });
  };

  // 工具标签的渲染
  const renderToolChips = () => {
    if (selectedTools.length === 0) {
      return (
        <Box sx={{ mt: 1, color: 'text.secondary', fontSize: '0.9rem' }}>
          还没有选择工具
        </Box>
      );
    }
    
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
        {selectedTools.map(tool => {
          const category = tool.category;
          const color = categoryColors[category] || categoryColors.utility;
          
          return (
            <Chip
              key={tool.id}
              label={tool.name}
              size="small"
              avatar={tool.icon ? <Avatar sx={{ bgcolor: 'transparent' }}>{tool.icon}</Avatar> : undefined}
              onDelete={() => toggleToolSelection(tool)}
              sx={{
                bgcolor: color.bg,
                color: color.text,
                borderColor: color.border,
                '& .MuiChip-deleteIcon': {
                  color: color.text,
                  '&:hover': {
                    color: color.text
                  }
                }
              }}
            />
          );
        })}
      </Box>
    );
  };
  
  // 处理保存
  const handleSave = () => {
    console.log('保存智能体:', { 
      agentName, 
      description, 
      baseAgentType,
      systemPrompt,
      selectedTools: selectedTools.map(t => t.id) 
    });
    
    // 保存成功后返回列表页
    navigate('/agent');
  };

  // 预定义可用的工具
  const availableTools: Tool[] = [
    {
      id: 'search',
      name: '搜索',
      description: '在网上搜索信息',
      category: 'utility',
      icon: <SearchIcon />
    },
    {
      id: 'calculator',
      name: '计算器',
      description: '执行复杂的数学计算',
      category: 'utility',
      icon: <CalculateIcon />
    },
    {
      id: 'weather',
      name: '天气',
      description: '获取天气信息',
      category: 'utility',
      icon: <CloudIcon />
    },
    {
      id: 'code_interpreter',
      name: '代码解释器',
      description: '解析和执行代码',
      category: 'development',
      icon: <CodeIcon />
    },
    {
      id: 'github',
      name: 'GitHub',
      description: '操作GitHub仓库',
      category: 'development',
      icon: <GitHubIcon />
    },
    {
      id: 'terminal',
      name: '终端',
      description: '执行命令行操作',
      category: 'development',
      icon: <TerminalIcon />
    },
    {
      id: 'knowledge_base',
      name: '知识库',
      description: '查询结构化知识',
      category: 'data',
      icon: <StorageIcon />
    },
    {
      id: 'image_generator',
      name: '图像生成',
      description: '生成图像和图形',
      category: 'creative',
      icon: <ImageIcon />
    }
  ];
  
  // 应用选择的模板
  const applyTemplate = (template: AgentTemplate) => {
    setAgentName(template.name);
    setDescription(template.description);
    setBaseAgentType(template.baseAgentType);
    setSystemPrompt(template.systemPrompt);
    
    // 根据模板建议选择工具
    const availableToolsById = availableTools.reduce<Record<string, Tool>>((acc: Record<string, Tool>, tool: Tool) => {
      acc[tool.id] = tool;
      return acc;
    }, {});
    
    const suggestedToolObjects = template.suggestedTools
      .map(toolId => availableToolsById[toolId])
      .filter((tool): tool is Tool => Boolean(tool)); // 过滤掉不存在的工具
    
    setSelectedTools(suggestedToolObjects);
    setTemplateDialogOpen(false);
  };
  
  // 主要UI渲染
  return (
    <PageContainer>
      <ContentArea>
        {/* 左右等分的主容器 */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, height: '100%' }}>
          {/* 左侧区域 - Agent功能配置 */}
          <Box sx={{ flex: 1, width: { xs: '100%', md: '50%' } }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: '12px', 
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#ffffff',
                backgroundImage: 'linear-gradient(120deg, rgba(99, 102, 241, 0.03) 0%, rgba(255, 255, 255, 0) 100%)',
                borderLeft: '4px solid #6366f1'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#6366f1', display: 'flex', alignItems: 'center' }}>
                  <SmartToyIcon sx={{ mr: 1 }} />
                  智能助手配置
                </Typography>
                
                <Box>
                  <Tooltip title="使用模板">
                    <IconButton 
                      color="primary"
                      onClick={handleTemplateMenuOpen} 
                      sx={{ 
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.2)' } 
                      }}
                    >
                      <ImportExportIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                
                <Menu
                  anchorEl={menuAnchorEl}
                  open={Boolean(menuAnchorEl)}
                  onClose={handleTemplateMenuClose}
                >
                  <MenuItem onClick={openTemplateDialog}>
                    <ListItemIcon><AutoAwesomeIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="浏览模板库" />
                  </MenuItem>
                </Menu>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 4, overflowY: 'auto' }}>
                <BasicInfoCard
                  agentName={agentName}
                  setAgentName={setAgentName}
                  description={description}
                  setDescription={setDescription}
                  baseAgentType={baseAgentType}
                  setBaseAgentType={setBaseAgentType}
                  selectedTools={selectedTools}
                  renderToolChips={renderToolChips}
                />
              </Box>
              
              <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/agent')} 
                  size="large"
                  sx={{ borderRadius: '8px' }}
                >
                  取消
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleSave} 
                  color="primary" 
                  size="large"
                  sx={{ 
                    borderRadius: '8px',
                    backgroundImage: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                    '&:hover': { boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)' }
                  }}
                >
                  保存智能助手
                </Button>
              </Box>
            </Paper>
          </Box>
          
          {/* 右侧区域 - 上下分区 */}
          <Box sx={{ flex: 1, width: { xs: '100%', md: '50%' }, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* 右侧上部 - 提示词设置 */}
            <Box sx={{ height: '45%', minHeight: '300px' }}>
              <SystemPromptCard
                systemPrompt={systemPrompt}
                setSystemPrompt={setSystemPrompt}
              />
            </Box>
            
            {/* 右侧下部 - 工具选择区域 */}
            <Box sx={{ flex: 1 }}>
              <ToolsCard
                selectedTools={selectedTools}
                toggleToolSelection={toggleToolSelection}
                renderToolChips={renderToolChips}
              />
            </Box>
          </Box>
        </Box>
      </ContentArea>
      
      {/* 模板选择对话框 */}
      <Dialog
        open={templateDialogOpen}
        onClose={() => setTemplateDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '12px' }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)', py: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <AutoAwesomeIcon sx={{ mr: 1, color: '#6366f1' }} /> 
            选择助手模板
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={2.5}>
            {AGENT_TEMPLATES.map(template => (
              <Grid item xs={12} sm={6} md={4} key={template.id}>
                <Card 
                  elevation={0} 
                  onClick={() => applyTemplate(template)}
                  sx={{ 
                    cursor: 'pointer', 
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '10px',
                    transition: 'all 0.2s',
                    '&:hover': { 
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)' 
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar 
                        sx={{ 
                          mr: 1.5, 
                          bgcolor: 'rgba(99, 102, 241, 0.1)', 
                          color: '#6366f1' 
                        }}
                      >
                        {template.icon}
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {template.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                      {template.description}
                    </Typography>
                    
                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {template.suggestedTools.map(toolId => (
                        <Chip 
                          key={toolId} 
                          label={toolId}
                          size="small"
                          sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', fontSize: '0.7rem' }}
                        />
                      ))}  
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)', px: 3, py: 2 }}>
          <Button onClick={() => setTemplateDialogOpen(false)}>取消</Button>
        </DialogActions>
      </Dialog>
      
      {/* 在移动端显示底部按钮栏 */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Box sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          width: '100%', 
          p: 2, 
          backgroundColor: '#fff',
          borderTop: '1px solid rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          zIndex: 10
        }}>
          <Button variant="outlined" onClick={() => navigate('/agent')}>
            取消
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSave} 
            color="primary"
          >
            保存智能助手
          </Button>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default AgentBuilder;
