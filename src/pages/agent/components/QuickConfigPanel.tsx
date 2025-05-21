import React from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  TextField,
  Slider,
  Radio,
  RadioGroup,
  FormControl,
  InputAdornment,
  Button,
  Tooltip,
  Divider,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import {
  SaveOutlined,
  ReloadOutlined,
  SettingOutlined,
  ClockCircleOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { GradientButton, ColorCard } from './AgentBuilderStyles';

// 快速配置接口
export interface QuickConfigOptions {
  autoSave: boolean;
  responseTimeout: number;
  responseLength: 'short' | 'medium' | 'long';
  temperature: number;
  creativityLevel: 'low' | 'balanced' | 'high';
  maxTokens: number;
}

interface QuickConfigPanelProps {
  config: QuickConfigOptions;
  onConfigChange: (config: QuickConfigOptions) => void;
  onSaveTemplate?: () => void;
}

// 默认快速配置
export const defaultQuickConfig: QuickConfigOptions = {
  autoSave: true,
  responseTimeout: 30,
  responseLength: 'medium',
  temperature: 0.7,
  creativityLevel: 'balanced',
  maxTokens: 2048
};

// 响应长度选项
const responseLengthOptions = [
  { value: 'short', label: '简短', description: '回复简洁明了，适合快速问答' },
  { value: 'medium', label: '适中', description: '回复内容详实，兼顾效率和信息量' },
  { value: 'long', label: '详细', description: '回复全面深入，包含更多细节和解释' }
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
  const handleSwitchChange = (key: keyof QuickConfigOptions) => (event: React.ChangeEvent<HTMLInputElement>) => {
    handleConfigChange(key, event.target.checked);
  };
  
  // 处理滑块变更
  const handleSliderChange = (key: keyof QuickConfigOptions) => (event: Event, newValue: number | number[]) => {
    handleConfigChange(key, newValue);
  };
  
  // 处理响应长度变更
  const handleResponseLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleConfigChange('responseLength', event.target.value);
  };
  
  // 处理创造力级别变更
  const handleCreativityLevelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleConfigChange('creativityLevel', event.target.value);
  };
  
  // 处理温度变更
  const handleTemperatureChange = (_event: Event, newValue: number | number[]) => {
    handleConfigChange('temperature', newValue);
  };
  
  // 处理最大Token变更
  const handleMaxTokensChange = (_event: Event, newValue: number | number[]) => {
    handleConfigChange('maxTokens', newValue);
  };

  return (
    <ColorCard color="warning" sx={{ height: '100%' }}>
      <Box sx={{ p: 2 }}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            fontWeight: 600,
            color: theme.palette.warning.main,
            mb: 2
          }}
        >
          <SettingOutlined style={{ marginRight: 8 }} />
          快速配置
        </Typography>
        
        <Divider sx={{ mb: 2 }} />
        
        {/* 自动保存设置 */}
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={config.autoSave}
                onChange={handleSwitchChange('autoSave')}
                color="warning"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ mr: 0.5 }}>
                  自动保存草稿
                </Typography>
                <Tooltip title="启用后，系统将定期自动保存智能体配置">
                  <QuestionCircleOutlined style={{ color: theme.palette.text.secondary, fontSize: '14px' }} />
                </Tooltip>
              </Box>
            }
          />
        </Box>
        
        {/* 响应超时设置 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
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
                mr: 2
              }}
            />
            <Box sx={{ 
              minWidth: 50, 
              textAlign: 'center',
              bgcolor: alpha(theme.palette.warning.main, 0.1),
              borderRadius: 1,
              p: 0.5
            }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {config.responseTimeout}s
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* 响应长度设置 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
            响应详细程度
            <Tooltip title="设置智能体回复的详细程度">
              <QuestionCircleOutlined style={{ marginLeft: '4px', color: theme.palette.text.secondary, fontSize: '14px' }} />
            </Tooltip>
          </Typography>
          
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              value={config.responseLength}
              onChange={handleResponseLengthChange}
            >
              {responseLengthOptions.map(option => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio size="small" color="warning" />}
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
                  sx={{ mb: 0.5 }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>
        
        {/* 创造力级别设置 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
            创造力级别
            <Tooltip title="选择智能体生成内容的创造力程度">
              <QuestionCircleOutlined style={{ marginLeft: '4px', color: theme.palette.text.secondary, fontSize: '14px' }} />
            </Tooltip>
          </Typography>
          
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              value={config.creativityLevel}
              onChange={handleCreativityLevelChange}
            >
              {creativityLevelOptions.map(option => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio size="small" color="warning" />}
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
                  sx={{ mb: 0.5 }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>
        
        {/* 温度设置 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
            模型温度
            <Tooltip title="控制生成内容的多样性。较低的值生成更可预测的结果，较高的值产生更多样化的输出">
              <QuestionCircleOutlined style={{ marginLeft: '4px', color: theme.palette.text.secondary, fontSize: '14px' }} />
            </Tooltip>
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Slider
              value={config.temperature}
              onChange={handleTemperatureChange}
              step={0.1}
              min={0}
              max={1}
              marks={[
                { value: 0, label: '0' },
                { value: 0.5, label: '0.5' },
                { value: 1, label: '1' }
              ]}
              valueLabelDisplay="auto"
              sx={{ 
                color: theme.palette.warning.main,
                flex: 1,
                mr: 2
              }}
            />
            <Box sx={{ 
              minWidth: 50, 
              textAlign: 'center',
              bgcolor: alpha(theme.palette.warning.main, 0.1),
              borderRadius: 1,
              p: 0.5
            }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {config.temperature.toFixed(1)}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* 最大Token设置 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
            最大输出长度
            <Tooltip title="设置智能体单次生成内容的最大长度">
              <QuestionCircleOutlined style={{ marginLeft: '4px', color: theme.palette.text.secondary, fontSize: '14px' }} />
            </Tooltip>
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Slider
              value={config.maxTokens}
              onChange={handleMaxTokensChange}
              step={512}
              min={512}
              max={8192}
              marks={[
                { value: 1024, label: '1K' },
                { value: 4096, label: '4K' },
                { value: 8192, label: '8K' }
              ]}
              valueLabelDisplay="auto"
              sx={{ 
                color: theme.palette.warning.main,
                flex: 1,
                mr: 2
              }}
            />
            <Box sx={{ 
              minWidth: 60, 
              textAlign: 'center',
              bgcolor: alpha(theme.palette.warning.main, 0.1),
              borderRadius: 1,
              p: 0.5
            }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {Math.floor(config.maxTokens / 1024)}K
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* 保存为模板按钮 */}
        {onSaveTemplate && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <GradientButton
              fullWidth
              color="warning"
              startIcon={<SaveOutlined />}
              onClick={onSaveTemplate}
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
