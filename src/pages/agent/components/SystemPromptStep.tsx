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
      <Box>
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
