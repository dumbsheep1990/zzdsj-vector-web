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
  InputLabel,
  Autocomplete
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
  enableSensitiveWordFilter: boolean;
  sensitiveWordFilterLevel: 'low' | 'medium' | 'high';
  enableQuestionSplitting: boolean;
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
  canBeCalledByOtherAgents: false,
  enableSensitiveWordFilter: false,
  sensitiveWordFilterLevel: 'medium',
  enableQuestionSplitting: false
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
  
  // 敏感词过滤级别
  const sensitiveWordFilterLevels = [
    { value: 'low', label: '低', color: theme.palette.success.main, description: '仅过滤基本敏感词' },
    { value: 'medium', label: '中', color: theme.palette.warning.main, description: '过滤常见敏感词和不良内容' },
    { value: 'high', label: '高', color: theme.palette.error.main, description: '严格过滤所有潜在敏感内容' }
  ];

  return (
    <Box>
      {/* 两个卡片并排布局 */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr', md: '1fr 1fr' }, 
        gap: 3,
        mb: 3
      }}>
        {/* 工具调用设置卡片 */}
        <Card sx={{ 
          height: '100%',
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.2),
          borderRadius: '16px',
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.08)}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: `0 12px 28px ${alpha(theme.palette.primary.main, 0.12)}`,
            transform: 'translateY(-2px)'
          },
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}>
          <CardContent sx={{ p: 3 }}>
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
                    sx={{
                      '& .MuiSwitch-switchBase': {
                        '&.Mui-checked': {
                          '& + .MuiSwitch-track': {
                            backgroundColor: theme.palette.primary.main,
                            opacity: 0.8
                          }
                        }
                      },
                      '& .MuiSwitch-track': {
                        borderRadius: 10
                      },
                      '& .MuiSwitch-thumb': {
                        boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)'
                      }
                    }}
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
                        color: theme.palette.primary.main,
                        height: 8,
                        '& .MuiSlider-thumb': {
                          width: 20,
                          height: 20,
                          boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.3)}`,
                          '&:hover, &.Mui-focusVisible': {
                            boxShadow: `0 0 0 8px ${alpha(theme.palette.primary.main, 0.16)}`
                          }
                        },
                        '& .MuiSlider-valueLabel': {
                          backgroundColor: theme.palette.primary.main,
                          borderRadius: '8px',
                          padding: '4px 8px'
                        },
                        '& .MuiSlider-track': {
                          height: 8,
                          borderRadius: 4
                        },
                        '& .MuiSlider-rail': {
                          height: 8,
                          borderRadius: 4,
                          opacity: 0.3
                        },
                        '& .MuiSlider-mark': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.5),
                          width: 4,
                          height: 4,
                          borderRadius: '50%'
                        }
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
                    sx={{
                      '& .MuiSwitch-switchBase': {
                        '&.Mui-checked': {
                          '& + .MuiSwitch-track': {
                            backgroundColor: theme.palette.primary.main,
                            opacity: 0.8
                          }
                        }
                      },
                      '& .MuiSwitch-track': {
                        borderRadius: 10
                      },
                      '& .MuiSwitch-thumb': {
                        boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)'
                      }
                    }}
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
                  
                  <Autocomplete<string, true, undefined, true>
                    multiple
                    freeSolo
                    id="restricted-domains-tags"
                    options={[]}
                    value={settings.restrictedDomains}
                    renderTags={(value: string[], getTagProps) =>
                      value.map((domain: string, index: number) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={domain}
                          label={domain}
                          size="small"
                          onDelete={() => handleDeleteRestrictedDomain(domain)}
                          color="error"
                          variant="outlined"
                          sx={{
                            borderRadius: '8px',
                            transition: 'all 0.2s ease',
                            height: '28px',
                            margin: '2px',
                            '& .MuiChip-deleteIcon': {
                              color: alpha(theme.palette.error.main, 0.7),
                              '&:hover': {
                                color: theme.palette.error.main
                              }
                            }
                          }}
                        />
                      ))
                    }
                    onChange={(_: React.SyntheticEvent, newValue: string[]) => {
                      handleSettingChange('restrictedDomains', newValue);
                    }}
                    onKeyDown={(e: React.KeyboardEvent) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.currentTarget.querySelector('input') as HTMLInputElement;
                        if (input.value && !settings.restrictedDomains.includes(input.value)) {
                          handleAddRestrictedDomain(input.value);
                          input.value = '';
                        }
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={settings.restrictedDomains.length > 0 ? "" : "输入域名，如 example.com"}
                        size="small"
                        fullWidth
                        sx={{ 
                          width: '100%',
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            transition: 'all 0.2s ease',
                            paddingLeft: 1,
                            '&:hover': {
                              boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`
                            },
                            '&.Mui-focused': {
                              boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                            }
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: alpha(theme.palette.primary.main, 0.3)
                          }
                        }}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {params.InputProps.endAdornment}
                              <InputAdornment position="end">
                                <Box 
                                  component="button" 
                                  type="button"
                                  onClick={() => {
                                    const input = document.querySelector('#restricted-domains-tags input') as HTMLInputElement;
                                    if (input && input.value && !settings.restrictedDomains.includes(input.value)) {
                                      handleAddRestrictedDomain(input.value);
                                      input.value = '';
                                    }
                                  }}
                                  sx={{
                                    border: 'none',
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    color: theme.palette.primary.main,
                                    borderRadius: '8px',
                                    p: '4px 8px',
                                    cursor: 'pointer',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    marginRight: '8px',
                                    '&:hover': {
                                      bgcolor: alpha(theme.palette.primary.main, 0.2)
                                    }
                                  }}
                                >
                                  添加
                                </Box>
                              </InputAdornment>
                            </>
                          )
                        }}
                      />
                    )}
                  />
                  
                  {settings.restrictedDomains.length === 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ width: '100%', padding: '6px 0', display: 'block' }}>
                      未添加任何受限域名
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
            </FormGroup>
          </CardContent>
        </Card>
      
        {/* 安全与隐私设置卡片 */}
        <Card sx={{ 
          height: '100%',
          border: '1px solid',
          borderColor: alpha(theme.palette.error.main, 0.2),
          borderRadius: '16px',
          bgcolor: alpha(theme.palette.error.main, 0.03),
          boxShadow: `0 8px 32px ${alpha(theme.palette.error.main, 0.08)}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: `0 12px 28px ${alpha(theme.palette.error.main, 0.12)}`,
            transform: 'translateY(-2px)'
          },
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}>
          <CardContent sx={{ p: 3 }}>
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
              
              <FormControl size="small" fullWidth sx={{ width: '100%' }}>
                <Select
                  value={settings.safetyLevel}
                  onChange={handleSelectChange('safetyLevel') as any}
                  sx={{ 
                    borderRadius: '10px',
                    width: '100%',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.error.main, 0.3),
                      transition: 'all 0.2s ease'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.error.main,
                      boxShadow: `0 0 0 2px ${alpha(theme.palette.error.main, 0.1)}`
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.error.main,
                      boxShadow: `0 0 0 3px ${alpha(theme.palette.error.main, 0.2)}`
                    }
                  }}
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
              
              <Typography variant="caption" color="text.secondary" sx={{ 
                display: 'block', 
                mt: 0.5,
                width: '100%',
                bgcolor: alpha(theme.palette.info.main, 0.05),
                p: 1,
                borderRadius: '8px',
                border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                boxSizing: 'border-box'
              }}>
                {safetyLevels.find(l => l.value === settings.safetyLevel)?.description}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableSensitiveWordFilter}
                    onChange={handleSwitchChange('enableSensitiveWordFilter')}
                    color="primary"
                    sx={{
                      '& .MuiSwitch-switchBase': {
                        '&.Mui-checked': {
                          '& + .MuiSwitch-track': {
                            backgroundColor: theme.palette.info.main,
                            opacity: 0.7
                          }
                        }
                      },
                      '& .MuiSwitch-track': {
                        borderRadius: 10
                      },
                      '& .MuiSwitch-thumb': {
                        boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)'
                      }
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 0.5 }}>
                      开启敏感词前置过滤
                    </Typography>
                    <Tooltip title="启用后，系统会在模型响应前先过滤敏感词和不良内容">
                      <QuestionCircleOutlined style={{ color: theme.palette.text.secondary, fontSize: '14px' }} />
                    </Tooltip>
                  </Box>
                }
              />
              
              {settings.enableSensitiveWordFilter && (
                <Box sx={{ ml: 4, mt: 2 }}>
                  <Typography variant="body2" gutterBottom display="flex" alignItems="center">
                    过滤级别
                    <Tooltip title="设置敏感词过滤的严格程度，较高级别可能会过滤更多内容">
                      <QuestionCircleOutlined style={{ ml: 0.5, color: theme.palette.text.secondary, fontSize: '14px' }} />
                    </Tooltip>
                  </Typography>
                  
                  <FormControl size="small" fullWidth sx={{ width: '100%' }}>
                    <Select
                      value={settings.sensitiveWordFilterLevel}
                      onChange={handleSelectChange('sensitiveWordFilterLevel') as any}
                      sx={{ 
                        borderRadius: '10px',
                        width: '100%',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(theme.palette.error.main, 0.3),
                          transition: 'all 0.2s ease'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.error.main,
                          boxShadow: `0 0 0 2px ${alpha(theme.palette.error.main, 0.1)}`
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.error.main,
                          boxShadow: `0 0 0 3px ${alpha(theme.palette.error.main, 0.2)}`
                        }
                      }}
                    >
                      {sensitiveWordFilterLevels.map(level => (
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
                  
                  <Typography variant="caption" color="text.secondary" sx={{ 
                    display: 'block', 
                    mt: 0.5,
                    width: '100%',
                    bgcolor: alpha(theme.palette.info.main, 0.05),
                    p: 1,
                    borderRadius: '8px',
                    border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                    boxSizing: 'border-box'
                  }}>
                    {sensitiveWordFilterLevels.find(l => l.value === settings.sensitiveWordFilterLevel)?.description}
                  </Typography>
                </Box>
              )}
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableQuestionSplitting}
                    onChange={handleSwitchChange('enableQuestionSplitting')}
                    color="primary"
                    sx={{
                      '& .MuiSwitch-switchBase': {
                        '&.Mui-checked': {
                          '& + .MuiSwitch-track': {
                            backgroundColor: theme.palette.info.main,
                            opacity: 0.7
                          }
                        }
                      },
                      '& .MuiSwitch-track': {
                        borderRadius: 10
                      },
                      '& .MuiSwitch-thumb': {
                        boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)'
                      }
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 0.5 }}>
                      启用问答拆分
                    </Typography>
                    <Tooltip title="启用后，复杂问题会被拆分为多个子问题分步解决">
                      <QuestionCircleOutlined style={{ color: theme.palette.text.secondary, fontSize: '14px' }} />
                    </Tooltip>
                  </Box>
                }
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.canBeCalledByOtherAgents}
                    onChange={handleSwitchChange('canBeCalledByOtherAgents')}
                    color="primary"
                    sx={{
                      '& .MuiSwitch-switchBase': {
                        '&.Mui-checked': {
                          '& + .MuiSwitch-track': {
                            backgroundColor: theme.palette.info.main,
                            opacity: 0.7
                          }
                        }
                      },
                      '& .MuiSwitch-track': {
                        borderRadius: 10
                      },
                      '& .MuiSwitch-thumb': {
                        boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)'
                      }
                    }}
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
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.allowUserFeedback}
                    onChange={handleSwitchChange('allowUserFeedback')}
                    color="primary"
                    sx={{
                      '& .MuiSwitch-switchBase': {
                        '&.Mui-checked': {
                          '& + .MuiSwitch-track': {
                            backgroundColor: theme.palette.info.main,
                            opacity: 0.7
                          }
                        }
                      },
                      '& .MuiSwitch-track': {
                        borderRadius: 10
                      },
                      '& .MuiSwitch-thumb': {
                        boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)'
                      }
                    }}
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
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AdvancedAgentSettings;
