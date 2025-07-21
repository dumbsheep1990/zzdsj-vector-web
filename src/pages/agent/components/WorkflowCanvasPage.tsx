/**
 * 工作流画布页面
 * 使用与AgentBuilder相同的背景和顶部栏样式
 */

import React, { useState } from 'react';
import { Box, Button, Alert, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft as ArrowLeftIcon } from '@mui/icons-material';

// 导入现有的工作流画布组件
import WorkflowCanvas from './WorkflowCanvas';
import BuilderHeader from './BuilderHeader';

// 定义磨砂背景容器 - 与AgentBuilder相同
const GlassmorphismBackground = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
  zIndex: -1,
  background: `linear-gradient(135deg, ${theme.palette.primary.light}30, ${theme.palette.secondary.light}40, ${theme.palette.info.light}30)`,
  pointerEvents: 'none',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '400px',
    height: '400px',
    background: `radial-gradient(circle, ${theme.palette.primary.main}30 0%, transparent 70%)`,
    borderRadius: '50%',
    transform: 'translate(20%, -20%)',
    filter: 'blur(40px)',
    pointerEvents: 'none'
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '500px',
    height: '500px',
    background: `radial-gradient(circle, ${theme.palette.secondary.main}30 0%, transparent 70%)`,
    borderRadius: '50%',
    transform: 'translate(-20%, 20%)',
    filter: 'blur(40px)',
    pointerEvents: 'none'
  }
}));

// 内容容器组件 - 与AgentBuilder相同
const ContentWrapper = styled(Box)(() => ({
  position: 'relative',
  zIndex: 1,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
}));

interface WorkflowCanvasPageProps {
  agentId?: string;
  agentName?: string;
  onSave?: (workflow: any) => void;
  readOnly?: boolean;
}

const WorkflowCanvasPage: React.FC<WorkflowCanvasPageProps> = ({
  agentId,
  agentName = '智能体工作流',
  onSave,
  readOnly = false
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 处理保存操作
  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 这里可以添加保存逻辑
      if (onSave) {
        onSave({});
      }
      
      setSuccess('工作流保存成功！');
    } catch (error: any) {
      console.error('保存工作流失败:', error);
      setError(error.message || '保存工作流失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 返回上一页
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      {/* 固定底层背景 - 与AgentBuilder相同 */}
      <GlassmorphismBackground />
      
      {/* 内容容器 */}
      <ContentWrapper>
        {/* 顶部灵动岛 - 使用与AgentBuilder相同的样式 */}
        <BuilderHeader
          title="工作流设计"
          agentName={agentName}
          pageName="工作流构建"
          canSave={!readOnly}
          onSave={handleSave}
          currentStep={1}
          totalSteps={1}
          isMainHeader={true}
        />

        {/* 主容器 - 与AgentBuilder相同的样式 */}
        <Box 
          sx={{
            display: 'flex', 
            flexGrow: 1,
            background: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: '16px',
            margin: 2,
            marginTop: 4,
            marginBottom: 3,
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
            height: 'calc(100vh - 160px)',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 2
          }}
        >
          {/* 左侧工具栏 */}
          <Box sx={{
            width: '280px',
            borderRight: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            flexDirection: 'column',
            padding: 2
          }}>
            {/* 返回按钮 */}
            <Button
              startIcon={<ArrowLeftIcon />}
              onClick={handleBack}
              sx={{
                mb: 2,
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                color: '#64748b',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                }
              }}
            >
              返回
            </Button>

            {/* 工作流信息 */}
            <Box sx={{
              p: 2,
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              mb: 2
            }}>
              <Box sx={{ mb: 1, fontWeight: 600, color: '#334155' }}>
                工作流信息
              </Box>
              <Box sx={{ fontSize: '0.9rem', color: '#64748b' }}>
                智能体: {agentName}
              </Box>
              <Box sx={{ fontSize: '0.9rem', color: '#64748b' }}>
                状态: {readOnly ? '只读' : '编辑中'}
              </Box>
            </Box>

            {/* 工具说明 */}
            <Box sx={{
              p: 2,
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              flex: 1
            }}>
              <Box sx={{ mb: 1, fontWeight: 600, color: '#334155' }}>
                操作说明
              </Box>
              <Box sx={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                • 点击"添加工具"创建新节点<br/>
                • 拖拽节点边缘创建连接<br/>
                • 双击节点进行配置<br/>
                • 点击"保存工作流"保存设计
              </Box>
            </Box>
          </Box>

          {/* 右侧工作流画布区域 */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* 工作流画布 - 保持原有样式 */}
            <WorkflowCanvas
              agentId={agentId}
              onSave={onSave}
              readOnly={readOnly}
            />
          </Box>
        </Box>
      </ContentWrapper>
      
      {/* 消息提示 */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={!!success} 
        autoHideDuration={4000} 
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </>
  );
};

export default WorkflowCanvasPage;