import React from 'react';
import { Box, Button } from '@mui/material';
import { CheckCircleOutlined } from '@ant-design/icons';

interface CompleteButtonProps {
  onComplete: () => void;
  disabled: boolean;
}

const CompleteButton: React.FC<CompleteButtonProps> = ({ onComplete, disabled }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Button 
        variant="contained" 
        onClick={onComplete}
        disabled={disabled}
        endIcon={<CheckCircleOutlined />}
        sx={{
          bgcolor: '#5c6bc0',
          color: 'white',
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 1.5,
          px: 3,
          py: 1,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            bgcolor: '#3f51b5',
          }
        }}
      >
        完成配置
      </Button>
    </Box>
  );
};

export default CompleteButton;
