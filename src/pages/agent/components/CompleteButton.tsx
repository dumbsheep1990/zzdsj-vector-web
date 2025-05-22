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
          bgcolor: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          color: '#64748b',
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 1.5,
          px: 3,
          py: 1,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)'
          }
        }}
      >
        完成配置
      </Button>
    </Box>
  );
};

export default CompleteButton;
