import React, { useState } from 'react';

import AgentTemplateSelector, { AgentTemplateType } from './AgentTemplateSelector';
import AdvancedAgentSettings, { AdvancedAgentSettings as AdvancedSettings, defaultAdvancedAgentSettings } from './AdvancedAgentSettings';
import QuickConfigPanel, { QuickConfigOptions, defaultQuickConfig } from './QuickConfigPanel';
import { ColorCard, ColorAvatar, BorderTextField, ColorDivider, TypeCard } from './AgentBuilderStyles';
import { 
  Box, 
  Typography, 
  TextField, 
  Divider, 
  alpha,
  useTheme,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Chip,
  Button,
  Autocomplete,
  Avatar,
  InputAdornment,
  Tooltip,
  Alert,
  MenuItem,
  Select,
  styled,
  Paper
} from '@mui/material';
import { 
  InfoCircleOutlined, 
  QuestionCircleOutlined, 
  RobotOutlined,
  ApiOutlined,
  CodeOutlined,
  DatabaseOutlined,
  SearchOutlined,
  UserOutlined,
  TagsOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  GlobalOutlined,
  ImportOutlined
} from '@ant-design/icons';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// 自定义样式组件
const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 72,
  height: 72,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  backgroundColor: theme.palette.primary.main,
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)'
  }
}));

// 模型配置接口
interface ModelConfig {
  modelId: string;     // 模型标识符
  provider: string;    // 模型提供商
  temperature?: number; // 温度
  topP?: number;       // 采样参数
  maxTokens?: number;  // 最大token数
}

// 接口定义
interface BasicInfoStepProps {
  name: string;
  description: string;
  onNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  // 新增属性
  agentType?: string;
  onAgentTypeChange?: (value: string) => void;
  icon?: string;
  onIconChange?: (icon: string) => void;
  tags?: string[];
  onTagsChange?: (tags: string[]) => void;
  language?: string;
  onLanguageChange?: (language: string) => void;
  isPublic?: boolean;
  onVisibilityChange?: (isPublic: boolean) => void;
  // 智能体类别
  agentCategory?: string;
  onAgentCategoryChange?: (category: string) => void;
  // 模型配置
  modelConfig?: ModelConfig;
  onModelConfigChange?: (config: ModelConfig) => void;
  // 高级设置属性
  advancedSettings?: AdvancedSettings;
  onAdvancedSettingsChange?: (settings: AdvancedSettings) => void;
  // 快速配置属性
  quickConfig?: QuickConfigOptions;
  onQuickConfigChange?: (config: QuickConfigOptions) => void;
  onSaveTemplate?: () => void;
}

// 智能体类型选项
const agentTypeOptions = [
  { 
    value: 'chat', 
    label: '聊天助手', 
    icon: <UserOutlined />, 
    color: '#4096ff',
    description: '通用型智能对话系统，适合多轮对话和日常沟通场景' 
  },
  { 
    value: 'knowledge', 
    label: '知识库助手', 
    icon: <DatabaseOutlined />,
    color: '#722ed1', 
    description: '擅长检索和分析大量文档，回答专业领域问题' 
  },
  { 
    value: 'code', 
    label: '编程助手', 
    icon: <CodeOutlined />,
    color: '#ee4f88', 
    description: '专注于代码生成、调试和解释的智能编程辅助工具' 
  },
  { 
    value: 'web', 
    label: '网络助手', 
    icon: <GlobalOutlined />,
    color: '#13c2c2', 
    description: '能够搜索和整合网络信息，获取实时数据和资讯' 
  },
  { 
    value: 'api', 
    label: 'API集成助手', 
    icon: <ApiOutlined />,
    color: '#fa8c16', 
    description: '可调用外部API服务，执行特定任务和功能' 
  }
];

// 图标选项
const iconOptions = [
  { value: 'robot', label: '机器人', icon: <RobotOutlined style={{ fontSize: '22px' }} /> },
  { value: 'code', label: '代码', icon: <CodeOutlined style={{ fontSize: '22px' }} /> },
  { value: 'database', label: '数据库', icon: <DatabaseOutlined style={{ fontSize: '22px' }} /> },
  { value: 'search', label: '搜索', icon: <SearchOutlined style={{ fontSize: '22px' }} /> },
  { value: 'user', label: '用户', icon: <UserOutlined style={{ fontSize: '22px' }} /> },
  { value: 'api', label: 'API', icon: <ApiOutlined style={{ fontSize: '22px' }} /> },
  { value: 'global', label: '全球', icon: <GlobalOutlined style={{ fontSize: '22px' }} /> }
];

// 语言选项
const languageOptions = [
  { value: 'zh-CN', label: '中文' },
  { value: 'en-US', label: '英文' },
  { value: 'ja-JP', label: '日文' },
  { value: 'ko-KR', label: '韩文' },
  { value: 'multilingual', label: '多语言' }
];

// 智能体类别选项
const agentCategoryOptions = [
  { 
    value: 'base', 
    label: '系统基础Agent', 
    description: '可被其他Agent继承，也可独立使用的基础智能体'
  },
  { 
    value: 'application', 
    label: '场景应用Agent', 
    description: '针对固定场景下的智能体，一般独立使用'
  }
];

// 模型选项
const modelOptions = [
  { 
    id: 'gpt-4-turbo', 
    name: 'GPT-4 Turbo', 
    description: '强大的多功能模型，擅长复杂任务和多轮对话',
    provider: 'OpenAI',
    maxContext: 128000,
    icon: '🤖' // 机器人表情符号
  },
  { 
    id: 'gpt-4', 
    name: 'GPT-4', 
    description: '高级理解和推理能力，适合复杂任务',
    provider: 'OpenAI',
    maxContext: 8192,
    icon: '💬' // 对话气泡表情符号
  },
  { 
    id: 'gpt-3.5-turbo-16k', 
    name: 'GPT-3.5 Turbo (16K)', 
    description: '快速高效，具备更长的上下文窗口',
    provider: 'OpenAI',
    maxContext: 16384,
    icon: '🚀' // 火箭表情符号
  },
  { 
    id: 'claude-3-opus', 
    name: 'Claude 3 Opus', 
    description: '人类级别的智能和理解力，处理复杂任务',
    provider: 'Anthropic',
    maxContext: 200000,
    icon: '🌎' // 地球表情符号
  },
  { 
    id: 'claude-3-sonnet', 
    name: 'Claude 3 Sonnet', 
    description: '高效平衡型模型，价格优势明显',
    provider: 'Anthropic',
    maxContext: 180000,
    icon: '🎤' // 麦克风表情符号
  },
  { 
    id: 'gemini-pro', 
    name: 'Gemini Pro', 
    description: '谷歌的多模态通用智能模型',
    provider: 'Google',
    maxContext: 32000,
    icon: '🔍' // 放大镜表情符号
  }
];

// 默认模型配置
const defaultModelConfig: ModelConfig = {
  modelId: 'gpt-4-turbo',
  provider: 'OpenAI',
  temperature: 0.7,
  topP: 0.95,
  maxTokens: 4096
};

// 预定义标签
const predefinedTags = [
  '生产力', '创意', '专业', '学习', '娱乐', 
  '效率', '工作', '研究', '数据分析', '编程', 
  '文档处理', '信息检索', '知识管理', '客户服务'
];

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  name,
  description,
  onNameChange,
  onDescriptionChange,
  // 新增属性默认值
  agentType = 'chat',
  onAgentTypeChange = () => {},
  icon = 'robot',
  onIconChange = () => {},
  tags = [],
  onTagsChange = () => {},
  language = 'zh-CN',
  onLanguageChange = () => {},
  isPublic = false,
  onVisibilityChange = () => {},
  // 智能体类别默认值
  agentCategory = 'application',
  onAgentCategoryChange = () => {},
  // 模型配置默认值
  modelConfig = defaultModelConfig,
  onModelConfigChange = () => {},
  // 高级设置默认值
  advancedSettings = defaultAdvancedAgentSettings,
  onAdvancedSettingsChange = () => {},
  // 快速配置默认值
  quickConfig = defaultQuickConfig,
  onQuickConfigChange = () => {},
  onSaveTemplate
}) => {
  const theme = useTheme();
  
  // 为不同部分设置不同的颜色主题
  const sectionColors = {
    basic: 'primary',
    type: 'secondary', 
    settings: 'info',
    advanced: 'warning',
    visibility: 'success'
  };
  
  // 获取对应类型的颜色
  const getTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      'chat': 'primary',
      'knowledge': 'secondary', 
      'code': 'error',
      'web': 'info',
      'api': 'warning'
    };
    return colorMap[type] || 'primary';
  };
  
  // 状态管理
  const [tagInput, setTagInput] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  
  
  // 输入验证
  const [nameError, setNameError] = useState('');
  
  // 处理名称变更及验证
  const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onNameChange(e);
    
    if (!value.trim()) {
      setNameError('智能体名称不能为空');
    } else if (value.length > 50) {
      setNameError('名称不能超过50个字符');
    } else {
      setNameError('');
    }
  };
  
  // 添加标签
  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      const newTags = [...tags, tag];
      if (newTags.length <= 10) { // 限制最多10个标签
        onTagsChange(newTags);
        setTagInput('');
      }
    }
  };
  
  // 删除标签
  const handleDeleteTag = (tagToDelete: string) => {
    const newTags = tags.filter(tag => tag !== tagToDelete);
    onTagsChange(newTags);
  };
  
  // 打开模板选择对话框
  const openTemplateDialog = () => {
    setTemplateDialogOpen(true);
  };
  
  // 关闭模板选择对话框
  const closeTemplateDialog = () => {
    setTemplateDialogOpen(false);
  };
  
  // 处理模板选择
  const handleSelectTemplate = (template: AgentTemplateType) => {
    // 导入模板数据
    if (onNameChange) {
      const event = { target: { value: template.name } } as React.ChangeEvent<HTMLInputElement>;
      onNameChange(event);
    }
    
    if (onDescriptionChange) {
      const event = { target: { value: template.description } } as React.ChangeEvent<HTMLInputElement>;
      onDescriptionChange(event);
    }
    
    if (onAgentTypeChange) {
      onAgentTypeChange(template.agentType);
    }
    
    if (onIconChange) {
      onIconChange(template.icon);
    }
    
    if (onTagsChange) {
      onTagsChange(template.tags);
    }
    
    if (onLanguageChange) {
      onLanguageChange(template.language);
    }
    
    if (onVisibilityChange) {
      onVisibilityChange(template.isPublic);
    }
    
    // 处理智能体类别
    if (onAgentCategoryChange && template.agentCategory) {
      onAgentCategoryChange(template.agentCategory);
    }
    
    // 处理模型配置
    if (onModelConfigChange && template.modelConfig) {
      onModelConfigChange({
        ...defaultModelConfig,
        ...template.modelConfig
      });
    }
  };
  
  // 获取当前选中图标
  const getSelectedIconComponent = () => {
    const selectedIcon = iconOptions.find(opt => opt.value === icon);
    return selectedIcon?.icon || <RobotOutlined style={{ fontSize: '22px' }} />;
  };

  return (
    <Box id="basic-info-fullscreen-container" sx={{ height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ 
        fontWeight: 600, 
        fontSize: '1.1rem',
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.primary.main
      }}>
        <SettingOutlined style={{ marginRight: 8 }} />
        基本信息设置
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      {/* 主要内容区 - 基础信息和快速配置 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3, mb: 3 }}>
        {/* 左侧 - 基础信息内容区 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <ColorCard color={sectionColors.basic as any} sx={{ 
            mb: 2, 
            flex: 1, 
            borderRadius: '16px', 
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)', 
            overflow: 'visible',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            position: 'relative',
            background: alpha(theme.palette.primary.main, 0.08),
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 0, 
                    fontSize: '1.1rem',
                    color: theme.palette.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: alpha(theme.palette.primary.main, 0.1),
                    }}
                  >
                    <InfoCircleOutlined style={{ fontSize: '14px', color: theme.palette.primary.main }} />
                  </Box>
                  智能体基础信息
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<ImportOutlined style={{ color: theme.palette.primary.main }} />}
                  onClick={openTemplateDialog}
                  sx={{
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    fontWeight: 500,
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    color: theme.palette.primary.main,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                      transform: 'translateY(-2px)',
                      border: `1px solid ${theme.palette.primary.main}`
                    }
                  }}
                >
                  导入模板
                </Button>
              </Box>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '3fr 9fr' }, gap: 3 }}>
                {/* 图标选择 */}
                <Box>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: { xs: 2, sm: 0 }
                  }}>
                    <ColorAvatar 
                      color={getTypeColor(agentType) as any}
                      sx={{
                        width: 86,
                        height: 86,
                        borderRadius: '20px',
                        background: `linear-gradient(135deg, ${theme.palette[getTypeColor(agentType)].light}, ${theme.palette[getTypeColor(agentType)].main})`,
                        boxShadow: `0 8px 24px ${alpha(theme.palette[getTypeColor(agentType)].main, 0.25)}`,
                        border: `2px solid ${alpha(theme.palette[getTypeColor(agentType)].light, 0.5)}`
                      }}
                    >
                      {getSelectedIconComponent()}
                    </ColorAvatar>
                    
                    <FormControl size="small" sx={{ mt: 2, minWidth: 120 }}>
                      <Select
                        value={icon}
                        onChange={(e) => onIconChange(e.target.value as string)}
                        size="small"
                        sx={{
                          '.MuiOutlinedInput-notchedOutline': {
                            borderColor: alpha(theme.palette[getTypeColor(agentType)].main, 0.3),
                            borderRadius: '8px',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette[getTypeColor(agentType)].main,
                            borderWidth: '2px',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette[getTypeColor(agentType)].main,
                          },
                        }}
                      >
                        {iconOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ mr: 1 }}>{option.icon}</Box>
                              <Typography variant="body2">{option.label}</Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
                
                {/* 名称和描述 */}
                <Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      fontSize: '0.9rem',
                      mb: 1.5
                    }}>
                      智能体名称 *
                      <Tooltip title="智能体名称将显示在智能体列表和聊天界面，建议使用简洁明确的名称">
                        <QuestionCircleOutlined style={{ fontSize: '14px', marginLeft: '4px', color: theme.palette.text.secondary }} />
                      </Tooltip>
                    </Typography>
                    <BorderTextField
                      fullWidth
                      placeholder="输入智能体名称"
                      value={name}
                      onChange={handleNameInputChange}
                      variant="outlined"
                      size="small"
                      error={!!nameError}
                      helperText={nameError}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`
                          },
                          '&.Mui-focused': {
                            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                          }
                        }
                      }}
                      InputProps={{
                        endAdornment: name ? (
                          <InputAdornment position="end">
                            <CheckCircleOutlined style={{ color: theme.palette.success.main }} />
                          </InputAdornment>
                        ) : undefined
                      }}
                    />
                  </Box>
                
                  <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{
                      display: 'flex', 
                      alignItems: 'center',
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      fontSize: '0.9rem',
                      mb: 1.5,
                      mt: 2
                    }}>
                      描述
                      <Tooltip title="详细描述这个智能体的功能、能力和适用场景，帮助用户了解其用途">
                        <QuestionCircleOutlined style={{ fontSize: '14px', marginLeft: '4px', color: theme.palette.text.secondary }} />
                      </Tooltip>
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="描述这个智能体的功能和用途"
                      value={description}
                      onChange={onDescriptionChange}
                      variant="outlined"
                      size="small"
                      multiline
                      rows={3}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`
                          },
                          '&.Mui-focused': {
                            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                          }
                        }
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </ColorCard>
          
          {/* 智能体类型选择卡片 */}
          <ColorCard color={sectionColors.type as any} sx={{ 
            mb: 3,
            borderRadius: '16px', 
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)', 
            overflow: 'visible',
            border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
            position: 'relative',
            background: alpha(theme.palette.secondary.main, 0.08),
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.secondary.main }}>
                  智能体类型
                </Typography>
                <Tooltip title="选择智能体的类型，不同类型适用于不同的使用场景">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <QuestionCircleOutlined style={{ color: theme.palette.secondary.main, opacity: 0.7 }} />
                  </Box>
                </Tooltip>
              </Box>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Select
                  value={agentType}
                  onChange={(e) => onAgentTypeChange(e.target.value as string)}
                  sx={{ 
                    borderRadius: '10px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.secondary.main, 0.3),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.secondary.main,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.secondary.main,
                    }
                  }}
                  renderValue={(selected) => {
                    const option = agentTypeOptions.find(opt => opt.value === selected);
                    if (!option) return '';
                    return (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                          sx={{ 
                            width: 28, 
                            height: 28,
                            bgcolor: option.color,
                            fontSize: '0.875rem'
                          }}
                        >
                          {option.icon}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {option.label}
                        </Typography>
                      </Box>
                    );
                  }}
                >
                  {agentTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              mr: 2,
                              bgcolor: option.color
                            }}
                          >
                            {option.icon}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {option.label}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {option.description}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.secondary.main }}>
                  当前类型信息
                </Typography>
              </Box>
              
              {/* 显示当前选中类型的详细信息 */}
              {(() => {
                const selectedType = agentTypeOptions.find(opt => opt.value === agentType);
                if (!selectedType) return null;
                
                return (
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2, 
                      mb: 2,
                      border: `1px solid ${alpha(selectedType.color, 0.3)}`,
                      backgroundColor: alpha(selectedType.color, 0.05),
                      borderRadius: '10px'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar 
                        sx={{ 
                          width: 36, 
                          height: 36, 
                          mr: 2,
                          bgcolor: selectedType.color
                        }}
                      >
                        {selectedType.icon}
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: selectedType.color }}>
                        {selectedType.label}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                      {selectedType.description}
                    </Typography>
                  </Paper>
                );
              })()}
            </CardContent>
          </ColorCard>
          
          {/* 模型选择卡片 */}
          <ColorCard color="info" sx={{ 
            mb: 3,
            borderRadius: '16px', 
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)', 
            overflow: 'visible',
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            position: 'relative',
            background: alpha(theme.palette.info.main, 0.08),
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.info.main }}>
                  大语言模型
                </Typography>
                <Tooltip title="选择智能体使用的大语言模型，不同模型有不同的能力和特点">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <QuestionCircleOutlined style={{ color: theme.palette.info.main, opacity: 0.7 }} />
                  </Box>
                </Tooltip>
              </Box>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Select
                  value={modelConfig.modelId}
                  onChange={(e) => {
                    const selectedModel = modelOptions.find(m => m.id === e.target.value);
                    if (selectedModel) {
                      onModelConfigChange({
                        ...modelConfig,
                        modelId: selectedModel.id,
                        provider: selectedModel.provider
                      });
                    }
                  }}
                  sx={{ 
                    borderRadius: '10px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.info.main, 0.3),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.info.main,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.info.main,
                    }
                  }}
                  renderValue={(selected) => {
                    const model = modelOptions.find(m => m.id === selected);
                    if (!model) return '';
                    return (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ fontSize: '18px' }}>{model.icon}</Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {model.name}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={model.provider} 
                          sx={{ 
                            ml: 'auto',
                            height: 20, 
                            fontSize: '0.65rem',
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                            color: theme.palette.info.main,
                            fontWeight: 600
                          }} 
                        />
                      </Box>
                    );
                  }}
                >
                  {modelOptions.map((model) => (
                    <MenuItem key={model.id} value={model.id}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ fontSize: '18px', mr: 1 }}>{model.icon}</Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {model.name}
                            </Typography>
                          </Box>
                          <Chip 
                            size="small" 
                            label={model.provider} 
                            sx={{ 
                              height: 20, 
                              fontSize: '0.65rem',
                              bgcolor: alpha(theme.palette.info.main, 0.1),
                              color: theme.palette.info.main,
                              fontWeight: 600
                            }} 
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                          {model.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                            上下文窗口：
                          </Typography>
                          <Chip 
                            size="small" 
                            label={`${model.maxContext.toLocaleString()} tokens`} 
                            sx={{ 
                              height: 18, 
                              fontSize: '0.625rem',
                              bgcolor: alpha(theme.palette.success.main, 0.1),
                              color: theme.palette.success.main
                            }} 
                          />
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.info.main }}>
                  当前模型信息
                </Typography>
              </Box>
              
              {/* 显示当前选中模型的详细信息 */}
              {(() => {
                const selectedModel = modelOptions.find(m => m.id === modelConfig.modelId);
                if (!selectedModel) return null;
                
                return (
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2, 
                      mb: 2,
                      border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                      backgroundColor: alpha(theme.palette.info.main, 0.05),
                      borderRadius: '10px'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ fontSize: '20px', mr: 1.5 }}>{selectedModel.icon}</Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {selectedModel.name}
                      </Typography>
                      <Chip 
                        size="small" 
                        label={selectedModel.provider} 
                        sx={{ 
                          ml: 'auto',
                          height: 20, 
                          fontSize: '0.65rem',
                          bgcolor: alpha(theme.palette.info.main, 0.1),
                          color: theme.palette.info.main,
                          fontWeight: 600
                        }} 
                      />
                    </Box>
                    
                    <Typography variant="caption" sx={{ display: 'block', mb: 1, color: theme.palette.text.secondary }}>
                      {selectedModel.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip 
                        size="small" 
                        label={`上下文窗口: ${selectedModel.maxContext.toLocaleString()} tokens`} 
                        sx={{ 
                          height: 20, 
                          fontSize: '0.7rem',
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          color: theme.palette.success.main,
                          mr: 1
                        }} 
                      />
                    </Box>
                  </Paper>
                );
              })()}
              
              {/* 模型参数设置 */}
              <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: theme.palette.info.main }}>
                  模型参数设置
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  {/* 温度设置 */}
                  <Box>
                    <Typography variant="caption" sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <span>温度</span>
                      <span>{modelConfig.temperature}</span>
                    </Typography>
                    <Box sx={{ px: 1 }}>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01" 
                        value={modelConfig.temperature} 
                        onChange={(e) => onModelConfigChange({
                          ...modelConfig,
                          temperature: parseFloat(e.target.value)
                        })}
                        style={{ width: '100%' }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">精确</Typography>
                      <Typography variant="caption" color="text.secondary">创意</Typography>
                    </Box>
                  </Box>
                  
                  {/* 采样参数 */}
                  <Box>
                    <Typography variant="caption" sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <span>Top P</span>
                      <span>{modelConfig.topP}</span>
                    </Typography>
                    <Box sx={{ px: 1 }}>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01" 
                        value={modelConfig.topP} 
                        onChange={(e) => onModelConfigChange({
                          ...modelConfig,
                          topP: parseFloat(e.target.value)
                        })}
                        style={{ width: '100%' }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </ColorCard>
        </Box>
        
        {/* 右侧模型参数配置区域 */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <QuickConfigPanel
            config={quickConfig}
            onConfigChange={onQuickConfigChange}
            onSaveTemplate={onSaveTemplate}
          />
        </Box>
      </Box>
      

      {/* 高级设置按钮 */}
      <Box sx={{ width: '100%', mb: 3, mt: 2 }}>
        <Button 
          startIcon={showAdvanced ? null : <SettingOutlined />}
          endIcon={showAdvanced ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          onClick={() => setShowAdvanced(!showAdvanced)}
          variant="outlined"
          size="medium"
          disableElevation
          sx={{
            width: '100%',
            mb: 3,
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.8), rgba(248, 250, 252, 0.7))',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            color: '#64748b',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            borderBottom: '1px solid rgba(220, 220, 220, 0.9)',
            borderRight: '1px solid rgba(220, 220, 220, 0.9)',
            borderRadius: '12px',
            padding: '8px 16px',
            fontWeight: 500,
            letterSpacing: '0.3px',
            transform: 'translateY(-1px)',
            transition: 'all 0.2s ease',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
              transform: 'translateY(-2px)'
            },
            '&:active': {
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              transform: 'translateY(0)'
            }
          }}
        >
          {showAdvanced ? '收起高级配置' : '展开高级配置'}
        </Button>
      </Box>
      
      {/* 高级设置区域 */}
      {showAdvanced && (
        <Box sx={{ mb: 4 }}>
          {/* 高级设置卡片区域 */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3, mb: 3 }}>
            {/* 多功能配置卡片 - 标签和语言等 */}
            <ColorCard color="info" sx={{ 
              borderRadius: '16px', 
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)', 
              overflow: 'visible',
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
              background: alpha(theme.palette.info.main, 0.08),
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: theme.palette.info.main }}>
                  拓展设置
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                  {/* 左侧 - 标签设置 */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: theme.palette.info.main }}>
                      智能体标签
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Autocomplete
                        freeSolo
                        options={predefinedTags.filter(tag => !tags.includes(tag))}
                        inputValue={tagInput}
                        onInputChange={(event, value) => setTagInput(value)}
                        onChange={(event, value) => {
                          if (value && typeof value === 'string') {
                            handleAddTag(value);
                          }
                        }}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            variant="outlined" 
                            size="small"
                            placeholder="添加标签"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && tagInput) {
                                e.preventDefault();
                                handleAddTag(tagInput);
                              }
                            }}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <React.Fragment>
                                  {params.InputProps.endAdornment}
                                  <InputAdornment position="end">
                                    <TagsOutlined />
                                  </InputAdornment>
                                </React.Fragment>
                              )
                            }}
                          />
                        )}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          onDelete={() => handleDeleteTag(tag)}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      ))}
                      {tags.length === 0 && (
                        <Typography variant="caption" color="text.secondary">
                          添加标签以更好地分类和检索智能体
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  
                  {/* 右侧 - 其他设置 */}
                  <Box>
                    {/* 语言设置 */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: theme.palette.info.main }}>
                        主要语言
                      </Typography>
                      
                      <FormControl fullWidth size="small">
                        <Select
                          value={language}
                          onChange={(e) => onLanguageChange(e.target.value as string)}
                          size="small"
                        >
                          {languageOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    
                    {/* 可见性设置已移除 */}
                  </Box>
                </Box>
              </CardContent>
            </ColorCard>
            
            {/* 智能体类别设置 */}
            <ColorCard color="success" sx={{ 
              borderRadius: '16px', 
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)', 
              overflow: 'visible',
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
              background: alpha(theme.palette.success.main, 0.08),
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: theme.palette.success.main }}>
                  智能体类别
                </Typography>
                
                <FormControl component="fieldset" sx={{ width: '100%' }}>
                  <RadioGroup 
                    value={agentCategory}
                    onChange={(e) => onAgentCategoryChange(e.target.value)}
                  >
                    {agentCategoryOptions.map((option) => (
                      <Box key={option.value} sx={{ mb: 1 }}>
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            p: 1.5, 
                            backgroundColor: agentCategory === option.value ? alpha(theme.palette.success.light, 0.2) : 'transparent',
                            border: `1px solid ${agentCategory === option.value ? theme.palette.success.main : alpha(theme.palette.divider, 0.1)}`,
                            borderRadius: '10px',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <FormControlLabel 
                            value={option.value} 
                            control={<Radio size="small" />} 
                            label={
                              <Box>
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {option.label}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                  {option.description}
                                </Typography>
                              </Box>
                            }
                            sx={{ width: '100%', m: 0 }}
                          />
                        </Paper>
                      </Box>
                    ))}
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </ColorCard>
          </Box>
          
          {/* 高级设置组件 */}
          <Box sx={{ mb: 3 }}>
            <AdvancedAgentSettings
              settings={advancedSettings}
              onSettingsChange={onAdvancedSettingsChange}
            />
          </Box>
        </Box>
      )}
      
      {/* 智能体模板选择对话框 */}
      <AgentTemplateSelector
        open={templateDialogOpen}
        onClose={closeTemplateDialog}
        onSelectTemplate={handleSelectTemplate}
      />
    </Box>
  );
};

export default BasicInfoStep;
