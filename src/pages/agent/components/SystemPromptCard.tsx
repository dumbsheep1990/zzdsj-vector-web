import React, { useState } from 'react';
import { 
  Card, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  IconButton, 
  Divider,
  Tooltip
} from '@mui/material';
import { CopyOutlined, ReloadOutlined, QuestionCircleOutlined } from '@ant-design/icons';

interface SystemPromptCardProps {
  value: string;
  onChange: (value: string) => void;
  onReset?: () => void;
}

const SystemPromptCard: React.FC<SystemPromptCardProps> = ({ 
  value, 
  onChange,
  onReset 
}) => {
  const [copied, setCopied] = useState(false);

  // 复制系统提示词到剪贴板
  const copySystemPrompt = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 默认系统提示词示例
  const defaultPromptExample = `你是一个由向量数据库支持的智能助手，拥有以下能力：
1. 可以回答用户关于向量数据库的问题
2. 可以进行代码解释和分析
3. 可以连接网络搜索和获取最新信息
4. 可以处理各种文档和数据`;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        borderRadius: '12px',
      }}
    >
      <Box
        sx={{
          p: 2,
          background: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" component="h2">系统提示词</Typography>
        <Box>
          <Tooltip title={copied ? "已复制!" : "复制提示词"}>
            <IconButton 
              size="small" 
              onClick={copySystemPrompt}
              sx={{ color: 'white', mr: 1 }}
            >
              <CopyOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="重置为默认提示词">
            <IconButton 
              size="small" 
              onClick={onReset}
              sx={{ color: 'white' }}
            >
              <ReloadOutlined />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Box sx={{ 
        p: 2, 
        bgcolor: 'background.paper',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
          <QuestionCircleOutlined style={{ marginRight: 8 }} />
          系统提示词定义了智能体的基本行为和能力，它将影响智能体如何理解和回应用户的输入。
        </Typography>
      </Box>
      
      <Divider />
      
      <Box sx={{ 
        flexGrow: 1, 
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default'
      }}>
        <TextField
          multiline
          fullWidth
          variant="outlined"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="输入系统提示词..."
          minRows={12}
          maxRows={12}
          InputProps={{
            sx: {
              bgcolor: 'background.paper',
              height: '100%',
              '& .MuiOutlinedInput-input': {
                overflow: 'auto',
                height: '100% !important',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  borderRadius: '4px',
                },
              }
            }
          }}
          sx={{ 
            flexGrow: 1,
            '& .MuiOutlinedInput-root': {
              height: '100%',
              '&.Mui-focused': {
                boxShadow: '0 0 0 2px rgba(63, 81, 181, 0.2)',
              }
            }
          }}
        />
      </Box>
      
      <Divider />
      
      <Box sx={{ 
        p: 2, 
        bgcolor: 'rgba(63, 81, 181, 0.05)', 
        borderTop: '1px solid rgba(0, 0, 0, 0.12)'
      }}>
        <Typography variant="subtitle2" gutterBottom>
          示例提示词:
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            p: 1.5, 
            bgcolor: 'background.paper', 
            borderRadius: 1, 
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            maxHeight: '100px',
            overflow: 'auto',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '4px',
            }
          }}
        >
          {defaultPromptExample}
        </Typography>
        <Button 
          size="small" 
          variant="outlined" 
          sx={{ mt: 1 }}
          onClick={() => onChange(defaultPromptExample)}
        >
          使用此示例
        </Button>
      </Box>
    </Card>
  );
};

export default SystemPromptCard;
