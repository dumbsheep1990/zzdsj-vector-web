import React from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Divider, 
  alpha,
  useTheme
} from '@mui/material';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Fade } from '@mui/material';

interface BasicInfoStepProps {
  name: string;
  description: string;
  onNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  name,
  description,
  onNameChange,
  onDescriptionChange
}) => {
  const theme = useTheme();
  
  return (
    <Fade in={true}>
      <Box sx={{ height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          基本信息设置
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Box sx={{ mb: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              智能体名称 *
            </Typography>
            <TextField
              fullWidth
              placeholder="输入智能体名称"
              value={name}
              onChange={onNameChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              描述
            </Typography>
            <TextField
              fullWidth
              placeholder="描述这个智能体的功能和用途"
              value={description}
              onChange={onDescriptionChange}
              variant="outlined"
              multiline
              rows={4}
            />
          </Box>
        </Box>
        
        <Box sx={{ 
          bgcolor: alpha(theme.palette.primary.main, 0.05), 
          p: 2, 
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'flex-start' 
        }}>
          <InfoCircleOutlined style={{ marginRight: 8, marginTop: 4, color: '#3f51b5' }} />
          <Typography variant="body2" color="text.secondary">
            基本信息用于标识和描述你的智能体。一个好的名称和描述可以帮助用户更好地理解这个智能体的功能和用途。
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
};

export default BasicInfoStep;
