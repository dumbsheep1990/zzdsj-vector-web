import React from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Slider,
  TextField,
  InputAdornment,
  Tooltip,
  Divider,
  Card,
  CardContent,
  alpha,
  useTheme,
  Select,
  MenuItem,
  Chip,
  FormControl,
  FormGroup,
  InputLabel
} from '@mui/material';
import { 
  QuestionCircleOutlined,
  ToolOutlined,
  ApiOutlined,
  SafetyCertificateOutlined,
  RobotOutlined,
  SettingOutlined
} from '@ant-design/icons';

// 高级设置接口
export interface AdvancedAgentSettings {
  autonomousToolCalling: boolean;
  maxConsecutiveCalls: number;
  memoryOption: 'none' | 'short' | 'long';
  contextWindow: number;
  safetyLevel: 'low' | 'medium' | 'high';
  restrictedDomains: string[];
  allowUserFeedback: boolean;
  allowExternalResources: boolean;
  canBeCalledByOtherAgents: boolean;
}

interface AdvancedAgentSettingsProps {
  settings: AdvancedAgentSettings;
  onSettingsChange: (settings: AdvancedAgentSettings) => void;
}

// 默认设置
export const defaultAdvancedAgentSettings: AdvancedAgentSettings = {
  autonomousToolCalling: false,
  maxConsecutiveCalls: 3,
  memoryOption: 'short',
  contextWindow: 4096,
  safetyLevel: 'medium',
  restrictedDomains: [],
  allowUserFeedback: true,
  allowExternalResources: true,
  canBeCalledByOtherAgents: false
};

const AdvancedAgentSettings: React.FC<AdvancedAgentSettingsProps> = ({
  settings,
  onSettingsChange
}) => {
  const theme = useTheme();
  
  // 处理单个设置项更改
  const handleSettingChange = (key: keyof AdvancedAgentSettings, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };
  
  // 处理滑块变化
  const handleSliderChange = (key: keyof AdvancedAgentSettings) => (event: Event, newValue: number | number[]) => {
    handleSettingChange(key, newValue);
  };
  
  // 处理开关变化
  const handleSwitchChange = (key: keyof AdvancedAgentSettings) => (event: React.ChangeEvent<HTMLInputElement>) => {
    handleSettingChange(key, event.target.checked);
  };
  
  // 处理下拉选择变化
  const handleSelectChange = (key: keyof AdvancedAgentSettings) => (event: React.ChangeEvent<{ value: unknown }>) => {
    handleSettingChange(key, event.target.value);
  };
  
  // 处理受限域名添加
  const handleAddRestrictedDomain = (domain: string) => {
    if (domain && !settings.restrictedDomains.includes(domain)) {
      handleSettingChange('restrictedDomains', [...settings.restrictedDomains, domain]);
    }
  };
  
  // 处理受限域名删除
  const handleDeleteRestrictedDomain = (domain: string) => {
    handleSettingChange(
      'restrictedDomains', 
      settings.restrictedDomains.filter(d => d !== domain)
    );
  };
  
  // 记忆选项
  const memoryOptions = [
    { value: 'none', label: '无记忆', description: '智能体不会记住对话历史' },
    { value: 'short', label: '短期记忆', description: '智能体记住当前会话的对话历史' },
    { value: 'long', label: '长期记忆', description: '智能体可以在不同会话之间记住信息' }
  ];
  
  // 安全级别
  const safetyLevels = [
    { value: 'low', label: '低', color: theme.palette.success.main, description: '基础安全检查' },
    { value: 'medium', label: '中', color: theme.palette.warning.main, description: '标准安全措施' },
    { value: 'high', label: '高', color: theme.palette.error.main, description: '严格安全限制' }
  ];

  return (
    <Box>
      <Card sx={{ 
        mb: 3,
        border: '1px solid',
        borderColor: alpha(theme.palette.primary.main, 0.2),
        borderRadius: '12px',
        bgcolor: alpha(theme.palette.primary.main, 0.02)
      }}>
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            color: theme.palette.primary.main
          }}>
            <ToolOutlined style={{ marginRight: 8, fontSize: '18px' }} />
            <Typography variant="subtitle1" fontWeight={600}>
              工具调用设置
            </Typography>
          </Box>
          
          <FormGroup>
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autonomousToolCalling}
                    onChange={handleSwitchChange('autonomousToolCalling')}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 0.5 }}>
                      允许自主调用工具
                    </Typography>
                    <Tooltip title="启用后，智能体可以在适当的情况下自主决定使用哪些工具，无需明确指令">
                      <QuestionCircleOutlined style={{ color: theme.palette.text.secondary, fontSize: '14px' }} />
                    </Tooltip>
                  </Box>
                }
              />
              
              {settings.autonomousToolCalling && (
                <Box sx={{ ml: 4, mt: 1 }}>
                  <Typography variant="body2" gutterBottom>
                    最大连续调用次数
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Slider
                      value={settings.maxConsecutiveCalls}
                      onChange={handleSliderChange('maxConsecutiveCalls')}
                      step={1}
                      marks
                      min={1}
                      max={10}
                      valueLabelDisplay="auto"
                      sx={{ 
                        maxWidth: 300, 
                        mr: 2,
                        color: theme.palette.primary.main
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {settings.maxConsecutiveCalls} 次
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.allowExternalResources}
                    onChange={handleSwitchChange('allowExternalResources')}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 0.5 }}>
                      允许访问外部资源
                    </Typography>
                    <Tooltip title="启用后，智能体可以访问互联网、API等外部资源获取信息">
                      <QuestionCircleOutlined style={{ color: theme.palette.text.secondary, fontSize: '14px' }} />
                    </Tooltip>
                  </Box>
                }
              />
              
              {settings.allowExternalResources && (
                <Box sx={{ ml: 4, mt: 1 }}>
                  <Typography variant="body2" gutterBottom display="flex" alignItems="center">
                    受限域名
                    <Tooltip title="指定智能体不能访问的域名列表">
                      <QuestionCircleOutlined style={{ ml: 0.5, color: theme.palette.text.secondary, fontSize: '14px' }} />
                    </Tooltip>
                  </Typography>
                  
                  <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    const input = e.currentTarget.elements.namedItem('domain') as HTMLInputElement;
                    handleAddRestrictedDomain(input.value);
                    input.value = '';
                  }} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TextField
                      name="domain"
                      placeholder="输入域名，如 example.com"
                      size="small"
                      sx={{ maxWidth: 300, mr: 1 }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {settings.restrictedDomains.map((domain) => (
                      <Chip
                        key={domain}
                        label={domain}
                        size="small"
                        onDelete={() => handleDeleteRestrictedDomain(domain)}
                        color="error"
                        variant="outlined"
                      />
                    ))}
                    {settings.restrictedDomains.length === 0 && (
                      <Typography variant="caption" color="text.secondary">
                        未添加任何受限域名
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </FormGroup>
        </CardContent>
      </Card>
      
      <Card sx={{ 
        mb: 3,
        border: '1px solid',
        borderColor: alpha(theme.palette.secondary.main, 0.2),
        borderRadius: '12px',
        bgcolor: alpha(theme.palette.secondary.main, 0.02)
      }}>
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            color: theme.palette.secondary.main
          }}>
            <RobotOutlined style={{ marginRight: 8, fontSize: '18px' }} />
            <Typography variant="subtitle1" fontWeight={600}>
              记忆和上下文设置
            </Typography>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" gutterBottom display="flex" alignItems="center">
              记忆选项
              <Tooltip title="设置智能体如何记住过去的交互信息">
                <QuestionCircleOutlined style={{ ml: 0.5, color: theme.palette.text.secondary, fontSize: '14px' }} />
              </Tooltip>
            </Typography>
            
            <FormControl size="small" fullWidth sx={{ maxWidth: 300 }}>
              <Select
                value={settings.memoryOption}
                onChange={handleSelectChange('memoryOption') as any}
              >
                {memoryOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    <Typography variant="body2">
                      {option.label}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              {memoryOptions.find(o => o.value === settings.memoryOption)?.description}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" gutterBottom display="flex" alignItems="center">
              上下文窗口大小
              <Tooltip title="决定智能体能够参考的历史对话量，较大的窗口允许记住更多内容">
                <QuestionCircleOutlined style={{ ml: 0.5, color: theme.palette.text.secondary, fontSize: '14px' }} />
              </Tooltip>
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Slider
                value={settings.contextWindow}
                onChange={handleSliderChange('contextWindow')}
                step={1024}
                min={1024}
                max={16384}
                marks={[
                  { value: 1024, label: '1K' },
                  { value: 4096, label: '4K' },
                  { value: 8192, label: '8K' },
                  { value: 16384, label: '16K' }
                ]}
                valueLabelDisplay="auto"
                sx={{ 
                  maxWidth: 300, 
                  mr: 2,
                  color: theme.palette.secondary.main
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {(settings.contextWindow / 1024).toFixed(0)}K tokens
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      <Card sx={{ 
        mb: 3,
        border: '1px solid',
        borderColor: alpha(theme.palette.error.main, 0.2),
        borderRadius: '12px',
        bgcolor: alpha(theme.palette.error.main, 0.02)
      }}>
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            color: theme.palette.error.main
          }}>
            <SafetyCertificateOutlined style={{ marginRight: 8, fontSize: '18px' }} />
            <Typography variant="subtitle1" fontWeight={600}>
              安全与隐私设置
            </Typography>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" gutterBottom display="flex" alignItems="center">
              安全级别
              <Tooltip title="设置智能体的安全防护级别，较高级别可能会限制部分功能">
                <QuestionCircleOutlined style={{ ml: 0.5, color: theme.palette.text.secondary, fontSize: '14px' }} />
              </Tooltip>
            </Typography>
            
            <FormControl size="small" fullWidth sx={{ maxWidth: 300 }}>
              <Select
                value={settings.safetyLevel}
                onChange={handleSelectChange('safetyLevel') as any}
              >
                {safetyLevels.map(level => (
                  <MenuItem key={level.value} value={level.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          bgcolor: level.color,
                          mr: 1
                        }} 
                      />
                      <Typography variant="body2">
                        {level.label}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              {safetyLevels.find(l => l.value === settings.safetyLevel)?.description}
            </Typography>
          </Box>
          
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.canBeCalledByOtherAgents}
                  onChange={handleSwitchChange('canBeCalledByOtherAgents')}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ mr: 0.5 }}>
                    允许被其他智能体调用
                  </Typography>
                  <Tooltip title="启用后，允许其他智能体调用此智能体的能力和知识">
                    <QuestionCircleOutlined style={{ color: theme.palette.text.secondary, fontSize: '14px' }} />
                  </Tooltip>
                </Box>
              }
            />
          </FormGroup>
          
          <FormGroup sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.allowUserFeedback}
                  onChange={handleSwitchChange('allowUserFeedback')}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ mr: 0.5 }}>
                    允许用户反馈
                  </Typography>
                  <Tooltip title="启用后，用户可以对智能体的回答进行评价和反馈">
                    <QuestionCircleOutlined style={{ color: theme.palette.text.secondary, fontSize: '14px' }} />
                  </Tooltip>
                </Box>
              }
            />
          </FormGroup>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdvancedAgentSettings;
