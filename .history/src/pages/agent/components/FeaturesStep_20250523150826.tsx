import React from 'react';
import { Box, Tabs, Tab, Button, alpha, useTheme } from '@mui/material';
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

/**
 * 功能设置步骤组件
 * 包含工具组件、知识库和高级功能三个标签页
 */
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
  onComplete,
}) => {
  const theme = useTheme();
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    onTabChange(newValue);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%',
      position: 'relative', 
      width: '100%'
    }}>
      {/* 顶部标签栏 - 固定在顶部 */}
      <Box sx={{ 
        backgroundColor: alpha(theme.palette.background.paper, 0.95),
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.04)}`,
        zIndex: 10
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
      
      {/* 中间内容区域 - 可滚动 */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        p: 3,
        pb: 10 // 给底部按钮留出空间
      }}>
        {/* 标签页内容 */}
        {tabValue === 0 && (
          <ToolsCard 
            selectedTools={selectedTools} 
            toggleToolSelection={toggleToolSelection} 
            renderToolChips={renderToolChips} 
          />
        )}
        
        {tabValue === 1 && (
          <KnowledgeBaseCard 
            selectedKnowledgeBases={selectedKnowledgeBases}
            toggleKnowledgeBaseSelection={toggleKnowledgeBaseSelection}
          />
        )}
        
        {tabValue === 2 && (
          <AdvancedSettingsCard 
            settings={advancedSettings}
            onChange={onAdvancedSettingsChange}
          />
        )}
      </Box>

      {/* 底部操作按钮区域 - 固定在底部 */}
      <Box sx={{ 
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        backgroundColor: alpha(theme.palette.background.default, 0.95),
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        zIndex: 5,
        boxShadow: `0 -4px 16px ${alpha(theme.palette.common.black, 0.08)}`
      }}>
        {/* 左侧：上一步按钮 */}
        <Box>
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
              py: 0.7,
              '&:hover': {
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.04)
              }
            }}
          >
            上一步
          </Button>
        </Box>

        {/* 右侧：完成按钮 */}
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
            py: 1.2,
            fontSize: '0.9rem',
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
          完成选择
        </Button>
      </Box>
    </Box>
  );
};

export default FeaturesStep;
