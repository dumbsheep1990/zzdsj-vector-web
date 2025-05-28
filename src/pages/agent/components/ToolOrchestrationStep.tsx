import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  alpha,
  useTheme,
  Avatar,
  IconButton,
  Tooltip,
  Divider,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { 
  RobotOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  OrderedListOutlined,
  PartitionOutlined,
  BranchesOutlined
} from '@ant-design/icons';
import { Tool, KnowledgeBase } from './types';
import { ExtensionToolsConfig } from './extensionConfig';
import NestedCardOrchestration from './NestedCardOrchestration';

// 执行模式类型
type ExecutionMode = 'sequential' | 'parallel' | 'conditional';

// 组件属性
interface ToolOrchestrationStepProps {
  selectedTools: Tool[];
  selectedKnowledgeBases: KnowledgeBase[];
  extensionToolsConfig: ExtensionToolsConfig;
  orchestrationItems: any[];
  onOrchestrationItemsChange: (items: any[]) => void;
  onBack?: () => void;
  onComplete?: () => void;
  canContinue?: boolean;
}

const ToolOrchestrationStep: React.FC<ToolOrchestrationStepProps> = ({
  selectedTools,
  selectedKnowledgeBases,
  extensionToolsConfig,
  orchestrationItems,
  onOrchestrationItemsChange,
  onBack,
  onComplete,
  canContinue = true
}) => {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 状态管理
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [executionMode, setExecutionMode] = useState<ExecutionMode>('sequential');
  
  // 全屏相关函数
  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      document.exitFullscreen?.();
    } else {
      containerRef.current?.requestFullscreen?.();
    }
  }, [isFullscreen]);
  
  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  // 处理执行模式变更
  const handleExecutionModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: ExecutionMode | null
  ) => {
    if (newMode !== null) {
      setExecutionMode(newMode);
    }
  };

  return (
    <Box 
      ref={containerRef}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        ...(isFullscreen && {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          backgroundColor: theme.palette.background.default
        })
      }}
    >
      {/* 顶部标题栏 */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          m: 2,
          mb: 1,
          borderRadius: isFullscreen ? 0 : '20px',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.secondary.main, 0.06)})`,
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})` }}>
              <RobotOutlined style={{ fontSize: 20 }} />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                智能工作流编排
              </Typography>
              <Typography variant="body2" color="text.secondary">
                组件化功能模块编排
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {/* 执行模式选择器 */}
            <ToggleButtonGroup
              value={executionMode}
              exclusive
              onChange={handleExecutionModeChange}
              size="small"
              aria-label="执行模式"
              sx={{ 
                mr: 2,
                '& .MuiToggleButton-root': {
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '6px !important',
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                  '&.Mui-selected': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.15)
                    }
                  }
                }
              }}
            >
              <ToggleButton value="sequential">
                <OrderedListOutlined style={{ marginRight: 4 }} />
                串行
              </ToggleButton>
              <ToggleButton value="parallel">
                <PartitionOutlined style={{ marginRight: 4 }} />
                并行
              </ToggleButton>
              <ToggleButton value="conditional">
                <BranchesOutlined style={{ marginRight: 4 }} />
                条件
              </ToggleButton>
            </ToggleButtonGroup>
            
            <Tooltip title={isFullscreen ? '退出全屏' : '进入全屏'}>
              <IconButton
                onClick={toggleFullscreen}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  borderRadius: '10px'
                }}
              >
                {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* 嵌套卡片布局 */}
      <Box sx={{ flex: 1 }}>
        <NestedCardOrchestration 
          selectedTools={selectedTools}
          selectedKnowledgeBases={selectedKnowledgeBases}
          onOrchestrationChange={onOrchestrationItemsChange}
          onBack={onBack}
          onComplete={onComplete}
          executionMode={executionMode}
        />
      </Box>
    </Box>
  );
};

export default ToolOrchestrationStep;