import React from 'react';
import { 
  Card, 
  Box, 
  Typography, 
  Divider, 
  Slider, 
  TextField,
  Grid,
  Tooltip,
  IconButton,
  Switch,
  FormControlLabel
} from '@mui/material';
import { InfoCircleOutlined } from '@ant-design/icons';

interface AdvancedSettings {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  contextCompression: boolean;
}

interface AdvancedSettingsCardProps {
  settings: AdvancedSettings;
  onChange: (settings: AdvancedSettings) => void;
}

const AdvancedSettingsCard: React.FC<AdvancedSettingsCardProps> = ({
  settings,
  onChange
}) => {
  // 更新单个设置值的处理函数
  const handleChange = (setting: keyof AdvancedSettings, value: number) => {
    onChange({
      ...settings,
      [setting]: value
    });
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
        borderRadius: '16px',
        background: 'rgba(150, 150, 150, 0.08)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(150, 150, 150, 0.2)',
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid rgba(150, 150, 150, 0.1)',
          color: '#64748b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" component="h2" sx={{ fontWeight: 500 }}>高级设置</Typography>
      </Box>
      
      <Box sx={{ 
        p: 2, 
        bgcolor: 'background.paper',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Typography variant="body2" color="text.secondary">
          这些设置影响智能体的生成内容和行为特性，建议在有特定需求时调整，否则保持默认值。
        </Typography>
      </Box>
      
      <Divider />
      
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto', 
        bgcolor: 'background.default',
        p: 2
      }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2">温度 (Temperature)</Typography>
                <Tooltip title="控制生成的随机性。较高的值会使输出更随机和创造性，较低的值会使输出更确定和集中。">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <InfoCircleOutlined style={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </Box>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                  <Slider
                    value={settings.temperature}
                    min={0}
                    max={2}
                    step={0.1}
                    onChange={(_, value) => handleChange('temperature', value as number)}
                    sx={{
                      color: '#3f51b5',
                      '& .MuiSlider-thumb': {
                        '&:hover, &.Mui-focusVisible': {
                          boxShadow: '0px 0px 0px 8px rgba(63, 81, 181, 0.16)'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    value={settings.temperature}
                    size="small"
                    inputProps={{
                      step: 0.1,
                      min: 0,
                      max: 2,
                      type: 'number',
                      sx: { width: 65 }
                    }}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value) && value >= 0 && value <= 2) {
                        handleChange('temperature', value);
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2">最大令牌数 (Max Tokens)</Typography>
                <Tooltip title="生成文本的最大长度。较高的值允许更长的回复，但可能增加延迟。">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <InfoCircleOutlined style={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </Box>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                  <Slider
                    value={settings.maxTokens}
                    min={1}
                    max={4096}
                    step={1}
                    onChange={(_, value) => handleChange('maxTokens', value as number)}
                    sx={{ color: '#3f51b5' }}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    value={settings.maxTokens}
                    size="small"
                    inputProps={{
                      step: 1,
                      min: 1,
                      max: 4096,
                      type: 'number',
                      sx: { width: 65 }
                    }}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 1 && value <= 4096) {
                        handleChange('maxTokens', value);
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2">Top P</Typography>
                <Tooltip title="控制模型考虑的词汇范围。较低的值会使输出更集中和确定。">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <InfoCircleOutlined style={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </Box>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                  <Slider
                    value={settings.topP}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={(_, value) => handleChange('topP', value as number)}
                    sx={{ color: '#3f51b5' }}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    value={settings.topP}
                    size="small"
                    inputProps={{
                      step: 0.01,
                      min: 0,
                      max: 1,
                      type: 'number',
                      sx: { width: 65 }
                    }}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value) && value >= 0 && value <= 1) {
                        handleChange('topP', value);
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2">频率惩罚 (Frequency Penalty)</Typography>
                <Tooltip title="减少重复出现的词语。较高的值会使模型减少重复使用相同的词组。">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <InfoCircleOutlined style={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </Box>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                  <Slider
                    value={settings.frequencyPenalty}
                    min={0}
                    max={2}
                    step={0.1}
                    onChange={(_, value) => handleChange('frequencyPenalty', value as number)}
                    sx={{ color: '#3f51b5' }}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    value={settings.frequencyPenalty}
                    size="small"
                    inputProps={{
                      step: 0.1,
                      min: 0,
                      max: 2,
                      type: 'number',
                      sx: { width: 65 }
                    }}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value) && value >= 0 && value <= 2) {
                        handleChange('frequencyPenalty', value);
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2">存在惩罚 (Presence Penalty)</Typography>
                <Tooltip title="减少重复主题。较高的值会使模型倾向于引入新的主题。">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <InfoCircleOutlined style={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </Box>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                  <Slider
                    value={settings.presencePenalty}
                    min={0}
                    max={2}
                    step={0.1}
                    onChange={(_, value) => handleChange('presencePenalty', value as number)}
                    sx={{ color: '#3f51b5' }}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    value={settings.presencePenalty}
                    size="small"
                    inputProps={{
                      step: 0.1,
                      min: 0,
                      max: 2,
                      type: 'number',
                      sx: { width: 65 }
                    }}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value) && value >= 0 && value <= 2) {
                        handleChange('presencePenalty', value);
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

export default AdvancedSettingsCard;
