import React from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SaveOutlined, MenuOutlined } from '@ant-design/icons';
import { useAppContext } from '../../../context/AppContext';

interface BuilderHeaderProps {
  title: string;
  agentName?: string; // 变为可选参数
  canSave: boolean;
  onSave: () => void;
  pageName?: string; // 当前页面名称
  currentStep: number;
  totalSteps: number;
  isMainHeader?: boolean; // 是否为主要灵动岛（区分主页面和侧边栏）
}

// 样式化组件
const HeaderContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isMain',
})<{ isMain?: boolean }>(({ isMain }) => ({
  padding: '0',
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  position: isMain ? 'sticky' : 'relative',
  top: isMain ? '12px' : 'auto',
  zIndex: isMain ? 10 : 1,
  height: isMain ? '44px' : '36px',
  marginBottom: isMain ? '16px' : '0'
}));

const DynamicIsland = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isMain',
})<{ isMain?: boolean }>(({ isMain }) => ({
  backgroundColor: isMain ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
  backdropFilter: isMain ? 'blur(12px)' : 'none',
  WebkitBackdropFilter: isMain ? 'blur(12px)' : 'none',
  borderRadius: isMain ? '16px' : '0',
  padding: isMain ? '0 20px' : '0 12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxShadow: isMain ? '0 4px 12px rgba(0, 0, 0, 0.08)' : 'none',
  width: isMain ? '680px' : '100%',
  maxWidth: isMain ? '90%' : '100%',
  height: '100%',
  border: isMain ? '1px solid rgba(226, 232, 240, 0.8)' : 'none'
}));

const StepDot = styled(Box)(() => ({
  width: '4px',
  height: '4px',
  borderRadius: '50%',
  margin: '0 3px',
  display: 'inline-block'
}));

const ActionButton = styled(Button)(() => ({
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 500,
  boxShadow: 'none',
  padding: '4px 12px',
  fontSize: '13px',
  height: '30px',
  minWidth: 'auto',
  lineHeight: 1,
  '&.save-button': {
    backgroundColor: '#3b82f6',
    color: 'white',
    '&:hover': {
      backgroundColor: '#2563eb'
    },
    '&:disabled': {
      backgroundColor: '#e2e8f0',
      color: '#94a3b8'
    }
  },
  '&.back-button': {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    marginRight: '12px',
    '&:hover': {
      backgroundColor: '#e2e8f0'
    }
  }
}));

const BuilderHeader: React.FC<BuilderHeaderProps> = ({ 
  title, 
  agentName, 
  canSave, 
  onSave, 
  pageName = '智能体构建', // 默认页面名称
  currentStep, 
  totalSteps,
  isMainHeader = true // 默认为主要灵动岛
}) => {
  // 使用全局上下文中的toggleSidebar方法
  const { toggleSidebar, state } = useAppContext();
  return (
    <HeaderContainer isMain={isMainHeader}>
      <DynamicIsland isMain={isMainHeader}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isMainHeader ? (
            <IconButton 
              onClick={toggleSidebar}
              size="small"
              sx={{ 
                color: '#64748b', 
                mr: 1.5,
                bgcolor: 'rgba(255, 255, 255, 0.65)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.85)'
                },
                width: '32px',
                height: '32px',
                borderRadius: '8px'
              }}
              title={state.sidebarExpanded ? '收起侧边栏' : '展开侧边栏'}
            >
              <MenuOutlined style={{ fontSize: 16 }} />
            </IconButton>
          ) : null}
          
          {isMainHeader && (
            <Typography sx={{ 
              fontWeight: 500, 
              fontSize: '13px', 
              color: '#64748b',
              marginRight: '8px'
            }}>
              {pageName}
            </Typography>
          )}
          
          <Typography sx={{ 
            fontWeight: 600, 
            fontSize: isMainHeader ? '14px' : '13px', 
            color: '#1e293b',
            marginLeft: isMainHeader ? '2px' : '0'
          }}>
            {title}
          </Typography>
          
          {/* 步骤指示器 */}
          <Box sx={{ display: 'flex', marginLeft: '16px', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '12px', color: '#64748b', marginRight: '8px' }}>
              步骤 {currentStep + 1}/{totalSteps}
            </Typography>
            {Array.from({ length: totalSteps }, (_, i) => (
              <StepDot 
                key={i}
                sx={{ 
                  backgroundColor: i <= currentStep 
                    ? '#3b82f6' 
                    : '#cbd5e1',
                  width: i === currentStep ? '6px' : '4px',
                  height: i === currentStep ? '6px' : '4px'
                }}
              />
            ))}
          </Box>
        </Box>
        
        <ActionButton 
          className="save-button"
          startIcon={<SaveOutlined style={{ fontSize: 10 }} />}
          onClick={onSave}
          disabled={!canSave}
          size="small"
        >
          保存
        </ActionButton>
      </DynamicIsland>
    </HeaderContainer>
  );
};

export default BuilderHeader;
