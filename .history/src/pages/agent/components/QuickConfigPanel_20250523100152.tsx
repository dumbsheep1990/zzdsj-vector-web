import React from 'react';
import { 
  Box, 
  Typography, 
  FormControl, 
  Slider, 
  FormControlLabel,
  Switch,
  RadioGroup,
  Radio,
  Tooltip,
  alpha,
  useTheme
} from '@mui/material';
import { 
  SettingOutlined, 
  QuestionCircleOutlined, 
  SaveOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { GradientButton, ColorCard } from './AgentBuilderStyles';

// 模型参数配置接口
export interface QuickConfigOptions {
  autoSave: boolean;
  responseTimeout: number;
  responseLength: 'short' | 'medium' | 'long';
  creativityLevel: 'low' | 'balanced' | 'high';
  maxTokens: number;
  memoryOption: 'none' | 'short' | 'long';
  useCustomTokens?: boolean; // 是否使用自定义token值
  contextCompression?: boolean; // 是否启用上下文压缩
}

interface QuickConfigPanelProps {
  config: QuickConfigOptions;
  onConfigChange: (config: QuickConfigOptions) => void;
  onSaveTemplate?: () => void;
}

// 默认模型参数配置
export const defaultQuickConfig: QuickConfigOptions = {
  autoSave: true,
  responseTimeout: 30,
  responseLength: 'medium',
  creativityLevel: 'balanced',
  maxTokens: 4096,
  memoryOption: 'short',
  useCustomTokens: false
};

// 响应长度选项
const responseLengthOptions = [
  { value: 'short', label: '简短', description: '回复简洁明了，适合快速问答' },
  { value: 'medium', label: '适中', description: '回复内容详实，兼顾效率和信息量' },
  { value: 'long', label: '详细', description: '回复全面深入，包含更多细节和解释' }
];

// 记忆选项
const memoryOptions = [
  { value: 'none', label: '无记忆', description: '智能体不会记住对话历史' },
  { value: 'short', label: '短期记忆', description: '智能体记住当前会话的对话历史' },
  { value: 'long', label: '长期记忆', description: '智能体可以在不同会话之间记住信息' }
];

// 创造力级别选项
const creativityLevelOptions = [
  { value: 'low', label: '保守', description: '生成的内容更加精确、可预测、严谨' },
  { value: 'balanced', label: '平衡', description: '在准确性和创造力之间保持平衡' },
  { value: 'high', label: '创造', description: '生成更多样化、独特和有想象力的内容' }
];

const QuickConfigPanel: React.FC<QuickConfigPanelProps> = ({
  config,
  onConfigChange,
  onSaveTemplate
}) => {
  const theme = useTheme();
  
  // 处理配置变更
  const handleConfigChange = (key: keyof QuickConfigOptions, value: any) => {
    onConfigChange({
      ...config,
      [key]: value
    });
  };
  
  // 处理开关变更
  const handleSwitchChange = (key: keyof QuickConfigOptions) => (e: React.ChangeEvent<HTMLInputElement>) => {
    handleConfigChange(key, e.target.checked);
  };
  
  // 处理滑块变更
  const handleSliderChange = (key: keyof QuickConfigOptions) => (_event: Event, newValue: number | number[]) => {
    handleConfigChange(key, newValue);
  };
  
  // 处理记忆选项变更
  const handleMemoryOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleConfigChange('memoryOption', event.target.value);
  };
  
  
  // 处理最大token数变更
  const handleMaxTokensChange = (_event: Event, newValue: number | number[]) => {
    handleConfigChange('maxTokens', newValue as number);
    // 如果用户手动调整了滑动条，标记为使用自定义值
    handleConfigChange('useCustomTokens', true);
  };
  
  // 处理预设token值点击
  const handlePresetTokenClick = (tokenValue: number) => {
    handleConfigChange('maxTokens', tokenValue);
    handleConfigChange('useCustomTokens', false);
  };

  return (
    <ColorCard color="warning" sx={{ 
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      borderRadius: '16px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)', 
      overflow: 'hidden',
      border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
      position: 'relative',
      background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.03)} 0%, ${alpha(theme.palette.warning.light, 0.07)} 100%)`,
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      mb: 3, // 添加底部外边距，与左侧卡片保持一致
    }}>
      {/* 配置选项标题 */}
      <Box sx={{ 
        bgcolor: alpha(theme.palette.warning.main, 0.1),
        px: 2,
        py: 1.5,
        borderBottom: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.warning.dark }}>
          <SettingOutlined style={{ marginRight: 8, fontSize: '16px' }} />
          模型参数配置
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={config.autoSave}
              onChange={handleSwitchChange('autoSave')}
              color="warning"
              size="small"
              sx={{
                '& .MuiSwitch-thumb': {
                  boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)'
                }
              }}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ mr: 0.5, color: theme.palette.text.secondary }}>
                自动保存
              </Typography>
              <Tooltip title="启用后，系统将定期自动保存智能体配置">
                <QuestionCircleOutlined style={{ color: theme.palette.text.secondary, fontSize: '12px' }} />
              </Tooltip>
            </Box>
          }
          sx={{ ml: 1, mb: 0 }}
        />
      </Box>
      
      <Box sx={{ p: 2.5 }}>
        {/* 响应超时设置 */}
        <Box sx={{ 
          mb: 3,
          p: 2,
          border: `1px solid ${alpha(theme.palette.warning.main, 0.15)}`,
          borderRadius: '12px',
          backgroundColor: alpha(theme.palette.warning.main, 0.03)
        }}>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: 600, 
            mb: 1.5, 
            display: 'flex', 
            alignItems: 'center',
            color: theme.palette.warning.dark
          }}>
            <Box component="span" sx={{ 
              width: 24, 
              height: 24, 
              borderRadius: '50%', 
              backgroundColor: alpha(theme.palette.warning.main, 0.1),
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1
            }}>
              <ClockCircleOutlined style={{ fontSize: '14px' }} />
            </Box>
            响应超时
            <Tooltip title="设置智能体响应的最长等待时间">
              <QuestionCircleOutlined style={{ marginLeft: '4px', color: theme.palette.text.secondary, fontSize: '14px' }} />
            </Tooltip>
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Slider
              value={config.responseTimeout}
              onChange={handleSliderChange('responseTimeout')}
              step={5}
              marks={[
                { value: 10, label: '10s' },
                { value: 30, label: '30s' },
                { value: 60, label: '60s' },
              ]}
              min={10}
              max={60}
              sx={{ 
                color: theme.palette.warning.main,
                flex: 1,
                mr: 2,
                '& .MuiSlider-thumb': {
                  width: 16,
                  height: 16,
                  boxShadow: `0 0 0 4px ${alpha(theme.palette.warning.main, 0.2)}`
                },
                '& .MuiSlider-rail': {
                  opacity: 0.3
                }
              }}
            />
            <Box sx={{ 
              minWidth: 50, 
              textAlign: 'center',
              bgcolor: alpha(theme.palette.warning.main, 0.1),
              borderRadius: 1,
              p: 0.5,
              fontWeight: 'bold'
            }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {config.responseTimeout}s
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* 记忆选项设置 */}
        <Box sx={{ 
          mb: 3,
          p: 2,
          border: `1px solid ${alpha(theme.palette.warning.main, 0.15)}`,
          borderRadius: '12px',
          backgroundColor: alpha(theme.palette.warning.main, 0.03)
        }}>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: 600, 
            mb: 1.5, 
            display: 'flex', 
            alignItems: 'center',
            color: theme.palette.warning.dark
          }}>
            <Box component="span" sx={{ 
              width: 24, 
              height: 24, 
              borderRadius: '50%', 
              backgroundColor: alpha(theme.palette.warning.main, 0.1),
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1
            }}>
              <span style={{ fontSize: '14px' }}>M</span>
            </Box>
            记忆选项
            <Tooltip title="设置智能体如何记住过去的交互信息">
              <QuestionCircleOutlined style={{ marginLeft: '4px', color: theme.palette.text.secondary, fontSize: '14px' }} />
            </Tooltip>
          </Typography>
          
          <FormControl component="fieldset" fullWidth sx={{ width: '100%' }}>
            <RadioGroup
              value={config.memoryOption}
              onChange={handleMemoryOptionChange}
              sx={{ 
                mt: 1,
                width: '100%', // 确保 RadioGroup 占满容器宽度
                '& .MuiFormControlLabel-root': {
                  margin: 0, // 移除默认边距
                  width: '100%' // 确保选项占满容器宽度
                }
              }}
            >
              {memoryOptions.map(option => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={
                    <Radio 
                      size="small" 
                      color="warning" 
                      sx={{
                        '&.Mui-checked': {
                          color: theme.palette.warning.main
                        }
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {option.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.description}
                      </Typography>
                    </Box>
                  }
                  sx={{ 
                    mb: 1,
                    p: 1,
                    borderRadius: '8px',
                    width: '100%', // 使宽度占满容器
                    mr: 0, // 移除右侧默认外边距
                    '& .MuiFormControlLabel-label': {
                      width: '100%' // 标签文字占满内容区域
                    },
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.warning.main, 0.05)
                    },
                    ...(option.value === config.memoryOption && {
                      backgroundColor: alpha(theme.palette.warning.main, 0.08),
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
                    })
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>
        
        {/* 响应长度设置 */}
        <Box sx={{ 
          mb: 3,
          p: 2,
          border: `1px solid ${alpha(theme.palette.warning.main, 0.15)}`,
          borderRadius: '12px',
          backgroundColor: alpha(theme.palette.warning.main, 0.03)
        }}>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: 600, 
            mb: 1.5, 
            display: 'flex', 
            alignItems: 'center',
            color: theme.palette.warning.dark
          }}>
            <Box component="span" sx={{ 
              width: 24, 
              height: 24, 
              borderRadius: '50%', 
              backgroundColor: alpha(theme.palette.warning.main, 0.1),
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1
            }}>
              <span style={{ fontSize: '14px' }}>Ω</span>
            </Box>
            响应长度
            <Tooltip title="控制智能体回复的详细程度">
              <QuestionCircleOutlined style={{ marginLeft: '4px', color: theme.palette.text.secondary, fontSize: '14px' }} />
            </Tooltip>
          </Typography>
          
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'row',
            mt: 1,
            justifyContent: 'space-between',
            gap: 1
          }}>
            {responseLengthOptions.map(option => (
              <Box 
                key={option.value}
                sx={{
                  flex: 1,
                  p: 1.5,
                  border: `1px solid ${option.value === config.responseLength ? 
                    alpha(theme.palette.warning.main, 0.5) : 
                    alpha(theme.palette.warning.main, 0.1)}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  backgroundColor: option.value === config.responseLength ? 
                    alpha(theme.palette.warning.main, 0.1) : 
                    'transparent',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.warning.main, 0.05),
                    boxShadow: `0 2px 8px ${alpha(theme.palette.warning.main, 0.1)}`
                  },
                  transition: 'all 0.2s ease'
                }}
                onClick={() => handleConfigChange('responseLength', option.value)}
              >
                <Typography variant="body2" sx={{ 
                  fontWeight: option.value === config.responseLength ? 600 : 500,
                  color: option.value === config.responseLength ? 
                    theme.palette.warning.dark : 
                    theme.palette.text.primary
                }}>
                  {option.label}
                </Typography>
                <Typography variant="caption" sx={{
                  display: 'block',
                  mt: 0.5,
                  color: theme.palette.text.secondary
                }}>
                  {option.description.split('，')[0]}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        
        {/* 创造力级别设置 */}
        <Box sx={{ 
          mb: 3,
          p: 2,
          border: `1px solid ${alpha(theme.palette.warning.main, 0.15)}`,
          borderRadius: '12px',
          backgroundColor: alpha(theme.palette.warning.main, 0.03)
        }}>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: 600, 
            mb: 1.5, 
            display: 'flex', 
            alignItems: 'center',
            color: theme.palette.warning.dark
          }}>
            <Box component="span" sx={{ 
              width: 24, 
              height: 24, 
              borderRadius: '50%', 
              backgroundColor: alpha(theme.palette.warning.main, 0.1),
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1
            }}>
              <span style={{ fontSize: '14px' }}>✨</span>
            </Box>
            创造力级别
            <Tooltip title="选择智能体生成内容的创造力程度">
              <QuestionCircleOutlined style={{ marginLeft: '4px', color: theme.palette.text.secondary, fontSize: '14px' }} />
            </Tooltip>
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}>
            <Slider
              value={['low', 'balanced', 'high'].indexOf(config.creativityLevel)}
              onChange={(_, newValue) => {
                const values = ['low', 'balanced', 'high'];
                handleConfigChange('creativityLevel', values[newValue as number]);
              }}
              step={null}
              marks={[
                { value: 0, label: '保守' },
                { value: 1, label: '平衡' },
                { value: 2, label: '创造' }
              ]}
              min={0}
              max={2}
              sx={{ 
                color: theme.palette.warning.main,
                mt: 3,
                mb: 1,
                '& .MuiSlider-thumb': {
                  width: 16,
                  height: 16,
                  boxShadow: `0 0 0 4px ${alpha(theme.palette.warning.main, 0.2)}`
                },
                '& .MuiSlider-rail': {
                  opacity: 0.3
                },
                '& .MuiSlider-markLabel': {
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  marginTop: '5px'
                }
              }}
            />
            
            <Typography variant="caption" sx={{ 
              mt: 2, 
              textAlign: 'center', 
              color: theme.palette.text.secondary,
              display: 'block',
              backgroundColor: alpha(theme.palette.warning.main, 0.08),
              p: 1,
              borderRadius: '8px'
            }}>
              {creativityLevelOptions.find(opt => opt.value === config.creativityLevel)?.description}
            </Typography>
          </Box>
        </Box>
        
        {/* 最大Token设置 */}
        <Box sx={{ 
          mb: 3,
          p: 2,
          border: `1px solid ${alpha(theme.palette.warning.main, 0.15)}`,
          borderRadius: '12px',
          backgroundColor: alpha(theme.palette.warning.main, 0.03)
        }}>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: 600, 
            mb: 1.5, 
            display: 'flex', 
            alignItems: 'center',
            color: theme.palette.warning.dark
          }}>
            <Box component="span" sx={{ 
              width: 24, 
              height: 24, 
              borderRadius: '50%', 
              backgroundColor: alpha(theme.palette.warning.main, 0.1),
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1
            }}>
              <span style={{ fontSize: '14px' }}>T</span>
            </Box>
            最大输出长度
            <Tooltip title="设置智能体单次生成内容的最大长度">
              <QuestionCircleOutlined style={{ marginLeft: '4px', color: theme.palette.text.secondary, fontSize: '14px' }} />
            </Tooltip>
          </Typography>
          
          {/* 预设值按钮组 */}
          <Box sx={{ display: 'flex', mb: 2, gap: 1 }}>
            {[4, 16, 32, 64].map(k => (
              <Box
                key={k}
                onClick={() => handlePresetTokenClick(k * 1024)}
                sx={{
                  padding: '8px 0',
                  flex: 1,
                  textAlign: 'center',
                  border: `1px solid ${config.maxTokens === k * 1024 && !config.useCustomTokens ? 
                    theme.palette.warning.main : 
                    alpha(theme.palette.warning.main, 0.2)}`,
                  borderRadius: '8px',
                  backgroundColor: config.maxTokens === k * 1024 && !config.useCustomTokens ? 
                    alpha(theme.palette.warning.main, 0.1) : 
                    'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: config.maxTokens === k * 1024 && !config.useCustomTokens ? 600 : 400,
                  color: config.maxTokens === k * 1024 && !config.useCustomTokens ? 
                    theme.palette.warning.dark : 
                    theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.warning.main, 0.05),
                    borderColor: alpha(theme.palette.warning.main, 0.4)
                  }
                }}
              >
                {k}K
              </Box>
            ))}
          </Box>
          
          {/* 自定义滑动条 */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Slider
              value={config.maxTokens}
              onChange={handleMaxTokensChange}
              step={1024}
              min={1024}
              max={128 * 1024} // 支持最大128K tokens
              marks={[
                { value: 4 * 1024, label: '4K' },
                { value: 16 * 1024, label: '16K' },
                { value: 64 * 1024, label: '64K' },
                { value: 128 * 1024, label: '128K' }
              ]}
              disabled={!config.useCustomTokens}
              sx={{ 
                color: theme.palette.warning.main,
                flex: 1,
                mr: 2,
                opacity: config.useCustomTokens ? 1 : 0.5,
                '& .MuiSlider-thumb': {
                  width: 16,
                  height: 16,
                  boxShadow: `0 0 0 4px ${alpha(theme.palette.warning.main, 0.2)}`
                },
                '& .MuiSlider-rail': {
                  opacity: 0.3
                }
              }}
            />
            <Box sx={{ 
              minWidth: 60, 
              textAlign: 'center',
              bgcolor: alpha(theme.palette.warning.main, 0.1),
              borderRadius: 1,
              p: 0.5,
              fontWeight: 'bold'
            }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {config.maxTokens >= 1000 ? `${(config.maxTokens/1024).toFixed(0)}K` : config.maxTokens}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* 保存为模板按钮 */}
        {onSaveTemplate && (
          <Box sx={{ mt: 3 }}>
            <GradientButton
              fullWidth
              color="warning"
              startIcon={<SaveOutlined />}
              onClick={onSaveTemplate}
              sx={{
                borderRadius: '10px',
                py: 1,
                boxShadow: `0 4px 12px ${alpha(theme.palette.warning.main, 0.2)}`
              }}
            >
              保存为模板
            </GradientButton>
          </Box>
        )}
      </Box>
    </ColorCard>
  );
};

export default QuickConfigPanel;
