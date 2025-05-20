import React from 'react';
import { Box, Typography } from '@mui/material';

interface BuilderHeaderProps {
  agentName: string;
}

const BuilderHeader: React.FC<BuilderHeaderProps> = ({ agentName }) => {
  return (
    <Box sx={{ 
      py: 2.5,
      px: 3,
      borderBottom: '1px solid',
      borderColor: '#e0e0e0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Box 
        sx={{
          px: 2,
          py: 0.75,
          borderRadius: 1,
          bgcolor: '#f1f5f9',
          width: '100%',
          textAlign: 'center'
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 600,
            color: '#334155',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap'
          }}
        >
          {agentName || '未命名智能体'}
        </Typography>
      </Box>
    </Box>
  );
};

export default BuilderHeader;
