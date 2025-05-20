import React from 'react';
import { Box, Paper } from '@mui/material';
import ContentHeader from './ContentHeader';

interface ContentContainerProps {
  activeStep: number;
  canContinue: boolean;
  onBack: () => void;
  onNext: () => void;
  titles: string[];
  children: React.ReactNode;
}

const ContentContainer: React.FC<ContentContainerProps> = ({
  activeStep,
  canContinue,
  onBack,
  onNext,
  titles,
  children
}) => {
  return (
    <Box sx={{ 
      flexGrow: 1, 
      overflow: 'auto',
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      width: 'calc(100% - 240px)', // 固定宽度，减去左侧导航的宽度
      minWidth: 0 // 确保内部元素可以正常收缩
    }}>
      <Paper 
        elevation={0} 
        sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'white',
          borderRadius: 1.5,
          overflow: 'hidden',
          boxShadow: '0 1px 8px rgba(0, 0, 0, 0.05)',
          border: '1px solid',
          borderColor: '#e0e0e0'
        }}
      >
        <ContentHeader 
          activeStep={activeStep}
          canContinue={canContinue}
          onBack={onBack}
          onNext={onNext}
          titles={titles}
        />
        
        <Box sx={{ px: 3, py: 4, flexGrow: 1, overflow: 'auto' }}>
          {children}
        </Box>
      </Paper>
    </Box>
  );
};

export default ContentContainer;
