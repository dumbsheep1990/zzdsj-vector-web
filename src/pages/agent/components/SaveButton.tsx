import React from 'react';
import { Box, Button } from '@mui/material';
import { SaveOutlined } from '@ant-design/icons';

interface SaveButtonProps {
  onSave: () => void;
  disabled: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onSave, disabled }) => {
  return (
    <Box sx={{ p: 3, mt: 'auto', borderTop: '1px solid', borderColor: '#e0e0e0' }}>
      <Button
        fullWidth
        variant="contained"
        startIcon={<SaveOutlined />}
        onClick={onSave}
        disabled={disabled}
        sx={{
          bgcolor: '#3b82f6',
          '&:hover': {
            bgcolor: '#2563eb',
          },
          '&:disabled': {
            bgcolor: '#e2e8f0',
            color: '#94a3b8'
          },
          color: 'white',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          py: 1,
          borderRadius: 1
        }}
      >
        保存智能体
      </Button>
    </Box>
  );
};

export default SaveButton;
