import React from 'react';
import { Box, Typography } from '@mui/material';
import StepNavigation from './StepNavigation';
import SaveButton from './SaveButton';

interface SidebarContainerProps {
  agentName: string;
  activeStep: number;
  steps: {
    id: number;
    title: string;
    isRequired: boolean;
    isComplete: boolean;
    isOptional?: boolean;
    status: string | null;
  }[];
  onStepChange: (step: number) => void;
  onSave: () => void;
  canSave: boolean;
  collapsed?: boolean; // 新增折叠状态属性
}

const SidebarContainer: React.FC<SidebarContainerProps> = ({
  agentName,
  activeStep,
  steps,
  onStepChange,
  onSave,
  canSave,
  collapsed = false // 默认不折叠
}) => {
  return (
    <Box 
      sx={{ 
        width: collapsed ? 60 : 220,
        bgcolor: 'transparent',
        borderRight: '1px solid',
        borderColor: '#e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'width 0.3s ease'
      }}
    >
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid #e0e0e0', 
        display: 'flex',
        justifyContent: collapsed ? 'center' : 'flex-start',
        alignItems: 'center',
        height: '48px'
      }}>
        {!collapsed && (
          <Typography 
            variant="subtitle2" 
            noWrap 
            sx={{ 
              color: '#1e293b',
              fontWeight: 600,
              fontSize: '14px'
            }}
          >
            {agentName || '未命名智能体'}
          </Typography>
        )}
        {collapsed && (
          <Typography 
            variant="subtitle2" 
            sx={{ 
              color: '#3b82f6',
              fontWeight: 600,
              fontSize: '18px',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(59, 130, 246, 0.1)'
            }}
          >
            {agentName?.charAt(0)?.toUpperCase() || '?'}
          </Typography>
        )}
      </Box>
      
      <StepNavigation 
        activeStep={activeStep}
        steps={steps}
        onStepChange={onStepChange}
      />
      
      <SaveButton onSave={onSave} disabled={!canSave} />
    </Box>
  );
};

export default SidebarContainer;
