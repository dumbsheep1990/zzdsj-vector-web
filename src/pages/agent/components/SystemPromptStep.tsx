import React from 'react';
import { Box, Fade } from '@mui/material';
import SystemPromptCard from './SystemPromptCard';

interface SystemPromptStepProps {
  value: string;
  onChange: (value: string) => void;
  onReset: () => void;
}

const SystemPromptStep: React.FC<SystemPromptStepProps> = ({
  value,
  onChange,
  onReset
}) => {
  return (
    <Fade in={true}>
      <Box id="system-prompt-fullscreen-container" className="prompt-card-container" sx={{ 
        position: 'relative',
        '& textarea': {
          overflow: 'hidden !important'
        },
        '& .MuiInputBase-root': {
          overflow: 'hidden !important'
        },
        '& *::-webkit-scrollbar': {
          width: '0px !important',
          display: 'none !important'
        },
        '& .header-button:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.3) !important',
          color: '#ffffff !important'
        }
      }}>
        <SystemPromptCard 
          value={value}
          onChange={onChange}
          onReset={onReset}
        />
      </Box>
    </Fade>
  );
};

export default SystemPromptStep;
