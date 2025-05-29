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
  

  

  


  // 我们现在通过DOM直接操作全屏，不再需要这个函数
  
  // 监听全屏状态变化并实现一个直接的DOM按钮绑定
  useEffect(() => {
    // 创建一个直接的DOM按钮绑定到页面上
    const createDirectFullscreenButton = () => {
      // 首先移除已存在的按钮（如果有）
      const existingButton = document.getElementById('direct-fullscreen-button');
      if (existingButton) {
        existingButton.remove();
      }
      
      // 创建新按钮
      const button = document.createElement('button');
      button.id = 'direct-fullscreen-button';
      button.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path></svg>';
      button.style.position = 'fixed';
      button.style.top = '16px';
      button.style.right = '16px';
      button.style.zIndex = '10001';
      button.style.width = '36px';
      button.style.height = '36px';
      button.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
      button.style.border = 'none';
      button.style.borderRadius = '8px';
      button.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      button.style.cursor = 'pointer';
      button.style.display = 'flex';
      button.style.alignItems = 'center';
      button.style.justifyContent = 'center';
      button.style.color = '#1976d2'; // 主色调
      
      // 添加悬停效果
      button.onmouseover = () => {
        button.style.backgroundColor = 'rgba(255, 255, 255, 1)';
        button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      };
      
      button.onmouseout = () => {
        button.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        button.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      };
      
      // 直接绑定点击事件
      button.onclick = () => {
        console.log('直接DOM按钮被点击');
        
        // 找到要全屏显示的内容区容器
        const contentContainer = document.getElementById('agent-builder-fullscreen-container');
        
        if (!contentContainer) {
          console.error('找不到内容区容器');
          return;
        }
        
        // 尝试进入全屏
        if (!document.fullscreenElement) {
          // 只将内容区设置为全屏，而不是整个页面
          contentContainer.requestFullscreen().catch(err => {
            console.error('进入全屏失败:', err);
          });
        } else {
          // 退出全屏
          document.exitFullscreen().catch(err => {
            console.error('退出全屏失败:', err);
          });
        }
      };
      
      // 添加到文档中
      document.body.appendChild(button);
      
      // 更新全屏状态图标
      const updateButtonIcon = () => {
        if (document.fullscreenElement) {
          button.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"></path></svg>';
        } else {
          button.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path></svg>';
        }
      };
      
      // 初始化图标
      updateButtonIcon();
      
      return updateButtonIcon;
    };
    
    // 创建按钮并获取更新图标的函数
    const updateButtonIcon = createDirectFullscreenButton();
    
    // 监听全屏状态变化
    const handleFullscreenChange = () => {
      // 只需更新按钮图标，不再更新React组件状态
      updateButtonIcon();
    };
    
    // 监听全屏变化事件
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange); // Firefox
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange); // Chrome, Safari, Opera
    document.addEventListener('MSFullscreenChange', handleFullscreenChange); // IE/Edge
    
    // 添加键盘快捷键监听 - F11键
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        document.getElementById('direct-fullscreen-button')?.click();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      // 清理所有事件监听
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
      
      // 移除按钮
      const button = document.getElementById('direct-fullscreen-button');
      if (button) {
        button.remove();
      }
    };
  }, []);  // 不依赖外部状态
  
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