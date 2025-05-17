import React from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { SectionCard } from './StyledComponents';

interface SystemPromptCardProps {
  systemPrompt: string;
  setSystemPrompt: (prompt: string) => void;
}

const PROMPT_EXAMPLES = [
  '你是一个专业的AI助手，善于解答用户的各类问题。',
  '你是一个擅长编程的AI助手，可以帮助用户解决代码相关问题。',
  '你是一个幽默风趣的会话 AI，喜欢在回答中加入有趣的元素。'
];

const SystemPromptCard: React.FC<SystemPromptCardProps> = ({
  systemPrompt,
  setSystemPrompt
}) => {
  const handleUseExample = (example: string) => {
    setSystemPrompt(example);
  };
  
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(systemPrompt);
  };
  
  const handleResetPrompt = () => {
    setSystemPrompt('');
  };
  
  return (
    <SectionCard sx={{
      height: '100%',
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: '14px',
      border: '1px solid rgba(59, 130, 246, 0.15)',
      backgroundImage: 'linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(255, 255, 255, 0) 100%)',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.04)',
      overflow: 'hidden'
    }}>
      {/* 卡片头部 */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(59, 130, 246, 0.15)',
          backgroundImage: 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)',
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PsychologyIcon sx={{ mr: 1.5, fontSize: '1.3rem' }} /> 
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            提示词设置
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="复制提示">
            <IconButton 
              size="small" 
              onClick={handleCopyPrompt}
              sx={{ 
                color: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.25)' } 
              }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="重置提示">
            <IconButton 
              size="small" 
              onClick={handleResetPrompt}
              sx={{ 
                color: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.25)' } 
              }}
            >
              <RestartAltIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* 卡片内容 */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2, 
        p: 2.5,
        height: '100%',
        overflow: 'hidden'
      }}>
        {/* 提示说明 */}
        <Box sx={{ 
          p: 2, 
          borderRadius: '10px', 
          backgroundColor: 'rgba(59, 130, 246, 0.05)', 
          border: '1px solid rgba(59, 130, 246, 0.1)'
        }}>
          <Typography variant="body2" sx={{ color: '#3b82f6', display: 'flex', alignItems: 'center' }}>
            <PsychologyIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#3b82f6' }} />
            系统提示定义了助手的行为和能力，就像给智能体的行为指南。
            你可以自定义系统提示来控制助手的行为方式。
          </Typography>
        </Box>
        
        {/* 提示词输入区域 */}
        <Box sx={{ 
          flex: 1, 
          minHeight: '180px', 
          maxHeight: '250px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <TextField
            fullWidth
            multiline
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="在这里输入系统提示词..."
            variant="outlined"
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                height: '100%',
                borderRadius: '10px',
                backgroundColor: 'white',
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#3b82f6',
                  borderWidth: '1px',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#3b82f6',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                }
              },
              '& .MuiInputBase-input': {
                height: '100% !important',
                padding: '16px !important',
                overflowY: 'auto !important',
                lineHeight: '1.5',
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              },
            }}
            InputProps={{
              sx: { 
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                minHeight: '100%',
              },
            }}
          />
        </Box>
        
        {/* 提示示例区域 */}
        <Box sx={{ pt: 1.5, borderTop: '1px solid rgba(59, 130, 246, 0.15)' }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 500, color: '#3b82f6', display: 'flex', alignItems: 'center' }}>
            <AutoAwesomeIcon fontSize="small" sx={{ mr: 1 }} />
            提示示例:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {PROMPT_EXAMPLES.map((example, index) => (
              <Button 
                key={index} 
                variant="outlined" 
                size="small" 
                onClick={() => handleUseExample(example)}
                sx={{ 
                  textTransform: 'none', 
                  borderRadius: '8px',
                  borderColor: 'rgba(59, 130, 246, 0.3)',
                  color: '#3b82f6',
                  backgroundColor: 'rgba(59, 130, 246, 0.02)',
                  '&:hover': {
                    backgroundColor: 'rgba(59, 130, 246, 0.08)',
                    borderColor: '#3b82f6'
                  }
                }}
              >
                示例 {index + 1}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>
    </SectionCard>
  );
};
export default SystemPromptCard;
