import React from 'react';
import {
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Box
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import CategoryIcon from '@mui/icons-material/Category';
import BuildIcon from '@mui/icons-material/Build';
import { Tool, baseAgentTypes } from './types.tsx';

interface BasicInfoCardProps {
  agentName: string;
  setAgentName: (name: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  baseAgentType: string;
  setBaseAgentType: (type: string) => void;
  selectedTools: Tool[];
  renderToolChips: () => React.ReactNode;
}

const BasicInfoCard: React.FC<BasicInfoCardProps> = ({
  agentName,
  setAgentName,
  description,
  setDescription,
  baseAgentType,
  setBaseAgentType,
  renderToolChips
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* 助手名称输入框 */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500, color: '#4b5563', display: 'flex', alignItems: 'center' }}>
          <PersonIcon sx={{ mr: 1, color: '#6366f1', fontSize: '1.1rem' }} />
          助手名称
        </Typography>
        <TextField
          fullWidth
          value={agentName}
          onChange={(e) => setAgentName(e.target.value)}
          variant="outlined"
          placeholder="为你的助手起一个名字"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              bgcolor: 'white',
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6366f1',
                borderWidth: '1px',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6366f1',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 0, 0, 0.1)',
              }
            },
            '& .MuiInputBase-input': {
              fontSize: '0.95rem',
              padding: '12px 14px',
            }
          }}
          InputProps={{
            sx: { boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
          }}
        />
      </Box>
      
      {/* 描述输入框 */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500, color: '#4b5563', display: 'flex', alignItems: 'center' }}>
          <DescriptionIcon sx={{ mr: 1, color: '#6366f1', fontSize: '1.1rem' }} />
          描述
        </Typography>
        <TextField
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          variant="outlined"
          placeholder="描述这个助手的功能特点..."
          multiline
          rows={3}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              bgcolor: 'white',
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6366f1',
                borderWidth: '1px',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6366f1',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 0, 0, 0.1)',
              }
            }
          }}
          InputProps={{
            sx: { boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
          }}
        />
      </Box>
      
      {/* 助手类型选择 */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500, color: '#4b5563', display: 'flex', alignItems: 'center' }}>
          <CategoryIcon sx={{ mr: 1, color: '#6366f1', fontSize: '1.1rem' }} />
          助手类型
        </Typography>
        <FormControl fullWidth>
          <Select
            value={baseAgentType}
            onChange={(e) => setBaseAgentType(e.target.value)}
            displayEmpty
            sx={{
              borderRadius: '10px',
              bgcolor: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 0, 0, 0.1)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6366f1',
                borderWidth: '1px',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6366f1',
              },
              '& .MuiSelect-select': {
                padding: '12px 14px',
              }
            }}
          >
            {baseAgentTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      {/* 工具选择 */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500, color: '#4b5563', display: 'flex', alignItems: 'center' }}>
          <BuildIcon sx={{ mr: 1, color: '#6366f1', fontSize: '1.1rem' }} />
          选择的工具
        </Typography>
        <Box sx={{ 
          p: 1.5, 
          borderRadius: 1, 
          backgroundColor: 'rgba(0,0,0,0.01)', 
          minHeight: '60px',
          border: '1px dashed rgba(0,0,0,0.1)'
        }}>
          {renderToolChips()}
        </Box>
      </Box>
    </Box>
  );
};

export default BasicInfoCard;
