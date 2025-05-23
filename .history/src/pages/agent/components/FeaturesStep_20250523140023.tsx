import React from 'react';
import { Box, Tabs, Tab, Fade, Button, alpha, useTheme } from '@mui/material';
import { RightOutlined, CheckCircleOutlined } from '@ant-design/icons';
import ToolsCard from './ToolsCard';
import KnowledgeBaseCard from './KnowledgeBaseCard';
import AdvancedSettingsCard from './AdvancedSettingsCard';
import { Tool, KnowledgeBase } from './types';
import { AdvancedSettings } from '../AgentBuilder';

interface FeaturesStepProps {
  tabValue: number;
  onTabChange: (newValue: number) => void;
  selectedTools: Tool[];
  toggleToolSelection: (tool: Tool) => void;
  renderToolChips: () => React.ReactNode;
  selectedKnowledgeBases: KnowledgeBase[];
  toggleKnowledgeBaseSelection: (kb: KnowledgeBase) => void;
  advancedSettings: AdvancedSettings;
  onAdvancedSettingsChange: (settings: AdvancedSettings) => void;
  canContinue?: boolean;
  onBack?: () => void;
  onNext?: () => void;
  onComplete?: () => void;
  activeStep?: number;
  totalSteps?: number;
}

const FeaturesStep: React.FC<FeaturesStepProps> = ({
  tabValue,
  onTabChange,
  selectedTools,
  toggleToolSelection,
  renderToolChips,
  selectedKnowledgeBases,
  toggleKnowledgeBaseSelection,
  advancedSettings,
  onAdvancedSettingsChange,
  canContinue = true,
  onBack,
  onNext,
  onComplete,
  activeStep = 2,
  totalSteps = 3
}) => {
  const theme = useTheme();
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    onTabChange(newValue);
  };

  const isLastStep = activeStep === totalSteps - 1;

  return (
    <Fade in={true}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%'
      }}>
        {/* 功能配置子标签 */}
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider', 
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          mb: 2,
          backdropFilter: 'blur(10px)'
        }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                minHeight: '48px',
                color: alpha(theme.palette.text.secondary, 0.8),
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                  fontWeight: 700
                },
                '&:hover': {
                  color: theme.palette.text.primary,
                  backgroundColor: alpha(theme.palette.primary.main, 0.04)
                }
              },
              '& .MuiTabs-indicator': {
                height: '3px',
                borderRadius: '3px'
              }
            }}
          >
            <Tab label="工具组件" />
            <Tab label="知识库" />
            <Tab label="高级功能" />
          </Tabs>
        </Box>
        
        {/* 功能配置子标签内容 - 可滚动区域 */}
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto',
          pr: 1,
          '&::-webkit-scrollbar': {
            width: '6px'
          },
          '&::-webkit-scrollbar-track': {
            background: alpha(theme.palette.divider, 0.1),
            borderRadius: '3px'
          },
          '&::-webkit-scrollbar-thumb': {
            background: alpha(theme.palette.primary.main, 0.3),
            borderRadius: '3px',
            '&:hover': {
              background: alpha(theme.palette.primary.main, 0.5)
            }
          }
        }}>
          {/* 工具组件标签页 */}
          {tabValue === 0 && (
            <Box sx={{ height: '100%' }}>
              <ToolsCard 
                selectedTools={selectedTools}
                toggleToolSelection={toggleToolSelection}
                renderToolChips={renderToolChips}
              />
            </Box>
          )}
          
          {/* 知识库标签页 */}
          {tabValue === 1 && (
            <Box sx={{ height: '100%' }}>
              <KnowledgeBaseCard 
                selectedKnowledgeBases={selectedKnowledgeBases}
                toggleKnowledgeBaseSelection={toggleKnowledgeBaseSelection}
              />
            </Box>
          )}
          
          {/* 高级功能标签页 */}
          {tabValue === 2 && (
            <Box sx={{ height: '100%' }}>
              <AdvancedSettingsCard 
                settings={advancedSettings}
                onChange={onAdvancedSettingsChange}
              />
            </Box>
          )}
        </Box>

        {/* 底部固定按钮区域 */}
        <Box sx={{ 
          position: 'sticky',
          bottom: 0,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.95),
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          p: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          borderRadius: '0 0 16px 16px'
        }}>
          {/* 左侧：上一步按钮 */}
          <Box>
            {onBack && (
              <Button 
                variant="outlined"
                onClick={onBack}
                startIcon={<RightOutlined style={{ transform: 'rotate(180deg)' }} />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: alpha(theme.palette.divider, 0.5),
                  color: theme.palette.text.secondary,
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.04)
                  }
                }}
              >
                上一步
              </Button>
            )}
          </Box>

          {/* 右侧：下一步或完成按钮 */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            {isLastStep ? (
              <Button 
                variant="contained"
                onClick={onComplete}
                disabled={!canContinue}
                endIcon={<CheckCircleOutlined />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${theme.palette.success.main}, ${alpha(theme.palette.success.main, 0.8)})`,
                  boxShadow: `0 4px 16px ${alpha(theme.palette.success.main, 0.3)}`,
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '0.95rem',
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.success.dark}, ${theme.palette.success.main})`,
                    boxShadow: `0 6px 20px ${alpha(theme.palette.success.main, 0.4)}`,
                    transform: 'translateY(-1px)'
                  },
                  '&:disabled': {
                    background: alpha(theme.palette.text.disabled, 0.12),
                    color: theme.palette.text.disabled,
                    boxShadow: 'none'
                  }
                }}
              >
                完成配置
              </Button>
            ) : (
              onNext && (
                <Button 
                  variant="contained"
                  onClick={onNext}
                  disabled={!canContinue}
                  endIcon={<RightOutlined />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.8)})`,
                    boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '0.95rem',
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                      boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                      transform: 'translateY(-1px)'
                    },
                    '&:disabled': {
                      background: alpha(theme.palette.text.disabled, 0.12),
                      color: theme.palette.text.disabled,
                      boxShadow: 'none'
                    }
                  }}
                >
                  下一步
                </Button>
              )
            )}
          </Box>
        </Box>
      </Box>
    </Fade>
  );
};

export default FeaturesStep;
