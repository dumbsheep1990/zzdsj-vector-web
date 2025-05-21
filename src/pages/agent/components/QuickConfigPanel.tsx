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
  modelVersion: string;
  customModelParams?: string;
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
  modelVersion: 'latest'
};

// 响应长度选项
const responseLengthOptions = [
  { value: 'short', label: '简短', description: '回复简洁明了，适合快速问答' },
  { value: 'medium', label: '适中', description: '回复内容详实，兼顾效率和信息量' },
  { value: 'long', label: '详细', description: '回复全面深入，包含更多细节和解释' }
];

// 模型版本选项
const modelVersionOptions = [
  { value: 'latest', label: '最新版本' },
  { value: 'stable', label: '稳定版本' },
  { value: 'legacy', label: '传统版本' },
  { value: 'custom', label: '自定义参数' }
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
  
  // 处理模型版本变更
  const handleModelVersionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleConfigChange('modelVersion', event.target.value);
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
        
        {/* 模型版本设置 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
            模型版本
            <Tooltip title="选择使用的模型版本">
              <QuestionCircleOutlined style={{ marginLeft: '4px', color: theme.palette.text.secondary, fontSize: '14px' }} />
            </Tooltip>
          </Typography>
          
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              value={config.modelVersion}
              onChange={handleModelVersionChange}
            >
              {modelVersionOptions.map(option => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio size="small" color="warning" />}
                  label={option.label}
                  sx={{ mb: 0.5 }}
                />
              ))}
            </RadioGroup>
          </FormControl>
          
          {config.modelVersion === 'custom' && (
            <TextField
              fullWidth
              placeholder="输入自定义模型参数"
              size="small"
              value={config.customModelParams || ''}
              onChange={(e) => handleConfigChange('customModelParams', e.target.value)}
              sx={{ mt: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ClockCircleOutlined style={{ color: theme.palette.text.secondary, fontSize: '14px' }} />
                  </InputAdornment>
                )
              }}
            />
          )}
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
