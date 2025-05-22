import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  InputAdornment,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  alpha,
  useTheme
} from '@mui/material';
import {
  SearchOutlined,
  RobotOutlined,
  CodeOutlined,
  DatabaseOutlined,
  ApiOutlined,
  UserOutlined,
  GlobalOutlined,
  ImportOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import SearchIcon from '@mui/icons-material/Search';

// 定义智能体模板接口
export interface AgentTemplateType {
  id: string;
  name: string;
  description: string;
  agentType: string;
  icon: string;
  tags: string[];
  language: string;
  isPublic: boolean;
  agentCategory?: string; // 智能体类别: 'base' | 'application'
  systemPrompt: string;
  selectedTools: any[];
  selectedKnowledgeBases: any[];
  advanced: {
    temperature: number;
    maxTokens: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface AgentTemplateSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelectTemplate: (template: AgentTemplateType) => void;
}

// 获取对应的图标组件
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'robot':
      return <RobotOutlined style={{ fontSize: '24px' }} />;
    case 'code':
      return <CodeOutlined style={{ fontSize: '24px' }} />;
    case 'database':
      return <DatabaseOutlined style={{ fontSize: '24px' }} />;
    case 'api':
      return <ApiOutlined style={{ fontSize: '24px' }} />;
    case 'user':
      return <UserOutlined style={{ fontSize: '24px' }} />;
    case 'global':
      return <GlobalOutlined style={{ fontSize: '24px' }} />;
    default:
      return <RobotOutlined style={{ fontSize: '24px' }} />;
  }
};

// 获取对应的类型名称
const getAgentTypeName = (type: string) => {
  const typeMap: Record<string, string> = {
    'chat': '聊天助手',
    'knowledge': '知识库助手',
    'code': '编程助手',
    'web': '网络助手',
    'api': 'API集成助手'
  };
  return typeMap[type] || '未知类型';
};

// 模拟的智能体数据
const mockAgents: AgentTemplateType[] = [
  {
    id: 'agent-1',
    name: '通用文档助手',
    description: '帮助用户处理各类文档，解析内容并提供相关建议',
    agentType: 'knowledge',
    icon: 'database',
    tags: ['文档处理', '内容分析', '知识管理'],
    language: 'zh-CN',
    isPublic: true,
    systemPrompt: '你是一个专注于文档处理的智能助手，擅长分析各类文档内容...',
    selectedTools: [],
    selectedKnowledgeBases: [],
    advanced: {
      temperature: 0.7,
      maxTokens: 2048,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0
    },
    createdAt: '2023-05-15T08:30:00Z',
    updatedAt: '2023-05-15T08:30:00Z',
    createdBy: '系统'
  },
  {
    id: 'agent-2',
    name: '代码解析助手',
    description: '帮助分析代码，提供代码优化建议和解决方案',
    agentType: 'code',
    icon: 'code',
    tags: ['编程', '代码分析', '技术支持'],
    language: 'zh-CN',
    isPublic: true,
    systemPrompt: '你是一个专业的代码分析助手，擅长理解各种编程语言的代码...',
    selectedTools: [],
    selectedKnowledgeBases: [],
    advanced: {
      temperature: 0.5,
      maxTokens: 4096,
      topP: 0.95,
      frequencyPenalty: 0.1,
      presencePenalty: 0.1
    },
    createdAt: '2023-06-20T14:15:00Z',
    updatedAt: '2023-06-20T14:15:00Z',
    createdBy: '系统'
  },
  {
    id: 'agent-3',
    name: '客服机器人',
    description: '自动回答用户问题，提供产品信息和售后支持',
    agentType: 'chat',
    icon: 'user',
    tags: ['客户服务', '自动回复', '售后支持'],
    language: 'zh-CN',
    isPublic: true,
    systemPrompt: '你是一个专业的客服助手，负责解答用户关于产品的各类问题...',
    selectedTools: [],
    selectedKnowledgeBases: [],
    advanced: {
      temperature: 0.6,
      maxTokens: 1024,
      topP: 0.9,
      frequencyPenalty: 0.2,
      presencePenalty: 0
    },
    createdAt: '2023-07-10T09:45:00Z',
    updatedAt: '2023-07-10T09:45:00Z',
    createdBy: '系统'
  },
  {
    id: 'agent-4',
    name: 'API调用助手',
    description: '帮助用户连接和调用各种API服务，处理数据交互',
    agentType: 'api',
    icon: 'api',
    tags: ['API', '数据集成', '系统连接'],
    language: 'zh-CN',
    isPublic: true,
    systemPrompt: '你是一个API集成助手，可以帮助用户连接和使用各种外部服务...',
    selectedTools: [],
    selectedKnowledgeBases: [],
    advanced: {
      temperature: 0.4,
      maxTokens: 2048,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0
    },
    createdAt: '2023-08-05T16:20:00Z',
    updatedAt: '2023-08-05T16:20:00Z',
    createdBy: '系统'
  }
];

const AgentTemplateSelector: React.FC<AgentTemplateSelectorProps> = ({
  open,
  onClose,
  onSelectTemplate
}) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [agents, setAgents] = useState<AgentTemplateType[]>(mockAgents);
  const [selectedAgent, setSelectedAgent] = useState<AgentTemplateType | null>(null);

  // 过滤智能体
  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 处理选择智能体
  const handleSelectAgent = (agent: AgentTemplateType) => {
    setSelectedAgent(agent);
  };

  // 处理确认选择
  const handleConfirmSelection = () => {
    if (selectedAgent) {
      onSelectTemplate(selectedAgent);
      onClose();
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ImportOutlined style={{ marginRight: '8px', fontSize: '20px', color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            选择智能体模板
          </Typography>
        </Box>
        <TextField
          placeholder="搜索智能体..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 220 }}
        />
      </DialogTitle>
      
      <DialogContent dividers sx={{ p: 3 }}>
        <Grid container spacing={2}>
          {/* 智能体列表 */}
          <Grid item xs={12} md={7}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              可用智能体列表
            </Typography>
            
            <List sx={{ 
              maxHeight: '400px', 
              overflow: 'auto',
              bgcolor: 'background.paper',
              borderRadius: '8px',
              border: `1px solid ${theme.palette.divider}`
            }}>
              {filteredAgents.length > 0 ? filteredAgents.map((agent, index) => (
                <React.Fragment key={agent.id}>
                  <ListItem 
                    button 
                    selected={selectedAgent?.id === agent.id}
                    onClick={() => handleSelectAgent(agent)}
                    sx={{
                      px: 2,
                      py: 1.5,
                      transition: 'all 0.2s',
                      '&.Mui-selected': {
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.12)
                        }
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        sx={{ 
                          bgcolor: selectedAgent?.id === agent.id 
                            ? theme.palette.primary.main
                            : alpha(theme.palette.primary.main, 0.1)
                        }}
                      >
                        {getIconComponent(agent.icon)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {agent.name}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            类型：{getAgentTypeName(agent.agentType)}
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                            {agent.tags.slice(0, 2).map((tag, tagIndex) => (
                              <Chip 
                                key={tagIndex} 
                                label={tag} 
                                size="small" 
                                variant="outlined"
                                sx={{ height: 20, '& .MuiChip-label': { px: 1, py: 0 } }}
                              />
                            ))}
                            {agent.tags.length > 2 && (
                              <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                                +{agent.tags.length - 2}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      {selectedAgent?.id === agent.id && (
                        <CheckCircleOutlined style={{ color: theme.palette.primary.main }} />
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < filteredAgents.length - 1 && <Divider component="li" />}
                </React.Fragment>
              )) : (
                <ListItem>
                  <ListItemText 
                    primary="没有找到匹配的智能体" 
                    secondary="请尝试其他搜索关键词"
                    primaryTypographyProps={{ align: 'center', color: 'text.secondary' }}
                    secondaryTypographyProps={{ align: 'center' }}
                  />
                </ListItem>
              )}
            </List>
          </Grid>
          
          {/* 智能体预览 */}
          <Grid item xs={12} md={5}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              智能体详情预览
            </Typography>
            
            <Card sx={{ 
              height: '400px', 
              overflow: 'auto',
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: 'none'
            }}>
              {selectedAgent ? (
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <Avatar 
                      sx={{ 
                        width: 64, 
                        height: 64, 
                        bgcolor: theme.palette.primary.main,
                        mb: 1
                      }}
                    >
                      {getIconComponent(selectedAgent.icon)}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {selectedAgent.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      创建于: {formatDate(selectedAgent.createdAt)}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    描述
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {selectedAgent.description}
                  </Typography>
                  
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    智能体类型
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {getAgentTypeName(selectedAgent.agentType)}
                  </Typography>
                  
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    标签
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {selectedAgent.tags.map((tag, index) => (
                      <Chip 
                        key={index} 
                        label={tag} 
                        size="small" 
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    语言
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {selectedAgent.language === 'zh-CN' ? '中文' : 
                     selectedAgent.language === 'en-US' ? '英文' : 
                     selectedAgent.language === 'multilingual' ? '多语言' : 
                     selectedAgent.language}
                  </Typography>
                  
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    可见性
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {selectedAgent.isPublic ? '公开' : '私有'}
                  </Typography>
                </CardContent>
              ) : (
                <CardContent sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '100%'
                }}>
                  <Typography variant="body1" color="text.secondary">
                    请在左侧选择一个智能体以查看详情
                  </Typography>
                </CardContent>
              )}
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined">
          取消
        </Button>
        <Button 
          onClick={handleConfirmSelection} 
          variant="contained" 
          color="primary"
          disabled={!selectedAgent}
          startIcon={<ImportOutlined />}
        >
          导入模板
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AgentTemplateSelector;
