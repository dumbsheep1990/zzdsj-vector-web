import React from 'react';
import { Box } from '@mui/material';
import BuilderHeader from './BuilderHeader';
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
}

const SidebarContainer: React.FC<SidebarContainerProps> = ({
  agentName,
  activeStep,
  steps,
  onStepChange,
  onSave,
  canSave
}) => {
  return (
    <Box 
      sx={{ 
        width: 220,
        bgcolor: 'white',
        borderRight: '1px solid',
        borderColor: '#e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      <BuilderHeader agentName={agentName} />
      
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
