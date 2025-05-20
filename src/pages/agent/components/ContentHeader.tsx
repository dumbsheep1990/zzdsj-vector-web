import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

interface ContentHeaderProps {
  activeStep: number;
  canContinue: boolean;
  onBack: () => void;
  onNext: () => void;
  titles: string[];
}

const ContentHeader: React.FC<ContentHeaderProps> = ({
  activeStep,
  canContinue,
  onBack,
  onNext,
  titles
}) => {
  return (
    <Box sx={{ 
      borderBottom: '1px solid',
      borderColor: '#e0e0e0',
      p: 2.5,
      display: 'flex',
      alignItems: 'center',
      bgcolor: '#f8f9fa',
    }}>
      <Typography 
        variant="subtitle1" 
        sx={{ 
          fontWeight: 600, 
          color: '#424242'
        }}
      >
        {titles[activeStep]}
      </Typography>
      <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
        {activeStep > 0 && (
          <Button 
            size="small" 
            startIcon={<LeftOutlined />} 
            onClick={onBack}
            sx={{
              color: '#5c6bc0',
              borderColor: '#e0e0e0',
              bgcolor: 'white',
              border: '1px solid',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                bgcolor: '#f5f5f5',
                borderColor: '#bdbdbd'
              }
            }}
          >
            上一步
          </Button>
        )}
        {activeStep < titles.length - 1 && (
          <Button 
            size="small"
            variant="contained"
            endIcon={<RightOutlined />}
            onClick={onNext}
            disabled={!canContinue}
            sx={{
              bgcolor: '#5c6bc0',
              color: 'white',
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              '&:hover': {
                bgcolor: '#3f51b5'
              }
            }}
          >
            下一步
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ContentHeader;
