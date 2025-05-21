import React, { useState } from 'react';
import AgentTemplateSelector, { AgentTemplateType } from './AgentTemplateSelector';
import AdvancedAgentSettings, { AdvancedAgentSettings as AdvancedSettings, defaultAdvancedAgentSettings } from './AdvancedAgentSettings';
import QuickConfigPanel, { QuickConfigOptions, defaultQuickConfig } from './QuickConfigPanel';
import { ColorCard, ColorAvatar, GradientButton, BorderTextField, ColorDivider, AnimatedContentBox, TypeCard } from './AgentBuilderStyles';
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
  };
  
  // 获取当前选中图标
  const getSelectedIconComponent = () => {
    const selectedIcon = iconOptions.find(opt => opt.value === icon);
    return selectedIcon?.icon || <RobotOutlined style={{ fontSize: '22px' }} />;
  };

  return (
    <Box sx={{ height: '100%' }}>
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
      
      {/* 主要内容区 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '8fr 4fr' }, gap: 3 }}>
        {/* 左侧主要信息 */}
        <Box>
          <ColorCard color={sectionColors.basic as any} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0, color: theme.palette.primary.main }}>
                  智能体基础信息
                </Typography>
                <GradientButton
                  size="small"
                  color="primary"
                  startIcon={<ImportOutlined />}
                  onClick={openTemplateDialog}
                >
                  导入模板
                </GradientButton>
              </Box>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '3fr 9fr' }, gap: 2 }}>
                {/* 图标选择 */}
                <Box>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: { xs: 2, sm: 0 }
                  }}>
                    <ColorAvatar color={getTypeColor(agentType) as any}>
                      {getSelectedIconComponent()}
                    </ColorAvatar>
                    
                    <FormControl size="small" sx={{ mt: 2, minWidth: 120 }}>
                      <Select
                        value={icon}
                        onChange={(e) => onIconChange(e.target.value as string)}
                        size="small"
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
                      fontWeight: 600,
                      color: theme.palette.text.primary
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
                      fontWeight: 600,
                      color: theme.palette.text.primary
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
                    />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </ColorCard>
          
          {/* 智能体类型选择 */}
          <ColorCard color={sectionColors.type as any} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3, color: theme.palette.secondary.main }}>
                智能体类型
              </Typography>
              
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <RadioGroup 
                  aria-label="agent-type" 
                  name="agent-type-group" 
                  value={agentType} 
                  onChange={(e) => onAgentTypeChange(e.target.value)}
                >
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                    {agentTypeOptions.map((option) => (
                      <Box key={option.value}>
                        <TypeCard 
                          selected={agentType === option.value}
                          color={option.color}
                          onClick={() => onAgentTypeChange(option.value)}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <FormControlLabel 
                              value={option.value} 
                              control={<Radio />} 
                              sx={{ width: '100%', m: 0 }}
                              label={
                                <Box sx={{ ml: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar 
                                      sx={{ 
                                        width: 32, 
                                        height: 32, 
                                        mr: 1, 
                                        bgcolor: agentType === option.value ? 
                                          theme.palette.primary.main : 
                                          alpha(theme.palette.text.secondary, 0.1)
                                      }}
                                    >
                                      {option.icon}
                                    </Avatar>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                      {option.label}
                                    </Typography>
                                  </Box>
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                    {option.description}
                                  </Typography>
                                </Box>
                              } 
                            />
                          </CardContent>
                        </TypeCard>
                      </Box>
                    ))}
                  </Box>
                </RadioGroup>
              </FormControl>
            </CardContent>
          </ColorCard>
          
          {/* 高级设置区域 */}
          <Box>
            <GradientButton 
              startIcon={showAdvanced ? null : <SettingOutlined />}
              endIcon={showAdvanced ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              onClick={() => setShowAdvanced(!showAdvanced)}
              variant="outlined"
              size="small"
              color="warning"
              sx={{ mb: 1 }}
            >
              {showAdvanced ? '收起高级设置' : '展开高级设置'}
            </GradientButton>
            
            {showAdvanced && (
              <AnimatedContentBox>
                <ColorCard color={sectionColors.settings as any} sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3, color: theme.palette.info.main }}>
                      通用设置
                    </Typography>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                    {/* 标签设置 */}
                    <Box>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
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
                    
                    {/* 语言设置 */}
                    <Box>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
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
                      
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                          可见性
                        </Typography>
                        
                        <FormControl component="fieldset">
                          <RadioGroup 
                            value={isPublic ? 'public' : 'private'}
                            onChange={(e) => onVisibilityChange(e.target.value === 'public')}
                          >
                            <FormControlLabel 
                              value="private" 
                              control={<Radio size="small" />} 
                              label="私有（仅自己可见）" 
                            />
                            <FormControlLabel 
                              value="public" 
                              control={<Radio size="small" />} 
                              label="公开（所有人可见）" 
                            />
                          </RadioGroup>
                        </FormControl>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </ColorCard>
                
                {/* 新增高级设置组件 */}
                <AdvancedAgentSettings
                  settings={advancedSettings}
                  onSettingsChange={onAdvancedSettingsChange}
                />
              </AnimatedContentBox>
            )}
          </Box>
        </Box>
        
        {/* 右侧快速配置区域 */}
        <Box>
          <QuickConfigPanel
            config={quickConfig}
            onConfigChange={onQuickConfigChange}
            onSaveTemplate={onSaveTemplate}
          />
        </Box>
      </Box>
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
