import React from 'react';
import { Box, Typography } from '@mui/material';
import { CheckCircleOutlined } from '@ant-design/icons';

interface StepNavigationProps {
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
}

const StepNavigation: React.FC<StepNavigationProps> = ({ 
  activeStep, 
  steps, 
  onStepChange 
}) => {
  return (
    <Box sx={{ flexGrow: 1, pt: 4, px: 2 }}>
      <Box sx={{ 
        width: '100%',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 20,
          bottom: 20,
          left: 16,
          width: 2,
background: 'linear-gradient(to bottom, #ff0000 10%, #00ff00 50%, #0000ff 90%)',
          zIndex: 0,
          borderRadius: '4px',
          boxShadow: '0 0 4px rgba(0,0,0,0.05)',
          opacity: 0.8
        }
      }}>
        {steps.map((step) => (
          <Box 
            key={step.id}
            onClick={() => onStepChange(step.id)}
            sx={{
              position: 'relative',
              pl: 5,
              pr: 1.5,
              py: 2,
              mb: 2.5,
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              borderRadius: 1.5,
              bgcolor: activeStep === step.id ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: activeStep === step.id ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
              transform: 'translateY(0)',
              '&:hover': {
                bgcolor: activeStep === step.id ? 'rgba(59, 130, 246, 0.12)' : 'rgba(203, 213, 225, 0.2)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                transform: 'translateY(-1px)',
                '& .step-title': {
                  color: activeStep === step.id ? '#1e40af' : '#475569'
                }
              }
            }}
          >
            <Box 
              className="step-indicator"
              sx={{ 
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1
              }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: activeStep === step.id ? '#3b82f6' : step.isComplete ? '#10b981' : 'white',
                  border: '2px solid',
                  borderColor: activeStep === step.id ? '#3b82f6' : step.isComplete ? '#10b981' : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: activeStep === step.id || step.isComplete ? 'white' : '#64748b',
                  fontSize: '12px',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  boxShadow: activeStep === step.id ? '0 0 0 4px rgba(59, 130, 246, 0.25)' : 'none',
                  transform: 'scale(1)',
                  '&:hover': {
                    transform: activeStep !== step.id && !step.isComplete ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: activeStep !== step.id && !step.isComplete ? '0 0 0 3px rgba(148, 163, 184, 0.15)' : activeStep === step.id ? '0 0 0 4px rgba(59, 130, 246, 0.25)' : 'none'
                  }
                }}
              >
                {step.isComplete ? (
                  <CheckCircleOutlined style={{ fontSize: 14 }} />
                ) : (
                  step.id + 1
                )}
              </Box>
            </Box>
            
            <Box sx={{ pl: 0.5 }}>
              <Typography 
                className="step-title"
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 600, 
                  color: activeStep === step.id ? '#1e40af' : '#334155',
                  mb: 0.5,
                  fontSize: '0.9rem',
                  transition: 'color 0.2s'
                }}
              >
                {step.title}
              </Typography>
              
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  mt: 0.5
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: step.isRequired && !step.isComplete ? '#f59e0b' : 
                            step.isComplete ? '#10b981' : '#64748b',
                    mr: 1,
                    boxShadow: `0 0 0 2px ${
                      step.isRequired && !step.isComplete ? 'rgba(245, 158, 11, 0.15)' : 
                      step.isComplete ? 'rgba(16, 185, 129, 0.15)' : 'rgba(100, 116, 139, 0.15)'
                    }`,
                    transition: 'all 0.3s ease'
                  }}
                />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: step.isRequired && !step.isComplete ? '#f59e0b' : 
                          step.isComplete ? '#10b981' : '#64748b',
                    fontSize: '0.75rem',
                    fontWeight: 500
                  }}
                >
                  {step.isComplete ? '已填写' : 
                   step.isRequired ? '必填' : '可选'}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default StepNavigation;
