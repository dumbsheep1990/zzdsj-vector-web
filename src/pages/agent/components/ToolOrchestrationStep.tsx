import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  alpha,
  useTheme,
  Avatar,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { 
  RobotOutlined,
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
  onOrchestrationItemsChange,
  onBack,
  onComplete
}) => {
  const theme = useTheme();
  
  // 状态管理
  const [executionMode, setExecutionMode] = useState<ExecutionMode>('sequential');
  

  

  


  // 全屏功能已经移至useFullscreenButton钩子统一实现  // 不依赖外部状态
  
  // 处理执行模式变更
  const handleExecutionModeChange = (
    _: React.MouseEvent<HTMLElement>,
    newMode: ExecutionMode | null
  ) => {
    if (newMode !== null) {
      setExecutionMode(newMode);
    }
  };

  return (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* 不再渲染原来的React全屏按钮，我们现在使用直接DOM按钮 */}

      {/* 顶部标题栏 */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          m: 2,
          mb: 1,
          borderRadius: '20px',
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
          </Box>
        </Box>
      </Paper>


      
      {/* 渲染编排布局 */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
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