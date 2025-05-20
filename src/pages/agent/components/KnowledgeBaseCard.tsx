import React, { useState } from 'react';
import { 
  Card, 
  Box, 
  Typography, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  TextField,
  InputAdornment,
  IconButton,
  Grid,
  Chip,
  Paper
} from '@mui/material';
import { SearchOutlined, FolderOutlined } from '@ant-design/icons';
import { KnowledgeBase } from './types';

interface KnowledgeBaseCardProps {
  selectedKnowledgeBases: KnowledgeBase[];
  toggleKnowledgeBaseSelection: (knowledgeBase: KnowledgeBase) => void;
}

const KnowledgeBaseCard: React.FC<KnowledgeBaseCardProps> = ({
  selectedKnowledgeBases,
  toggleKnowledgeBaseSelection
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // 示例知识库数据
  const availableKnowledgeBases: KnowledgeBase[] = [
    {
      id: '1',
      name: '向量数据库文档',
      description: '包含向量数据库的基本概念、架构和使用方法',
      documentCount: 24
    },
    {
      id: '2',
      name: '机器学习资料库',
      description: '机器学习和深度学习的理论知识和实践案例',
      documentCount: 56
    },
    {
      id: '3',
      name: '编程语言指南',
      description: '各种编程语言的语法、特性和最佳实践',
      documentCount: 78
    },
    {
      id: '4',
      name: '项目文档集合',
      description: '企业内部项目的技术文档和需求规格',
      documentCount: 43
    },
    {
      id: '5',
      name: '学术研究论文',
      description: '人工智能和自然语言处理领域的学术论文',
      documentCount: 35
    }
  ];

  // 搜索过滤
  const filteredKnowledgeBases = availableKnowledgeBases.filter(kb => 
    kb.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    kb.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 检查知识库是否被选中
  const isKnowledgeBaseSelected = (id: string) => {
    return selectedKnowledgeBases.some(kb => kb.id === id);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        borderRadius: '12px'
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
        <Typography variant="h6" component="h2">知识库</Typography>
      </Box>
      
      <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
        <TextField
          fullWidth
          placeholder="搜索知识库..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      <Divider />
      
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto', 
        bgcolor: 'background.default',
        p: 0
      }}>
        <List disablePadding>
          {filteredKnowledgeBases.map((kb) => (
            <React.Fragment key={kb.id}>
              <ListItem 
                button 
                onClick={() => toggleKnowledgeBaseSelection(kb)}
                sx={{
                  py: 1.5,
                  bgcolor: isKnowledgeBaseSelected(kb.id) 
                    ? 'rgba(63, 81, 181, 0.08)' 
                    : 'transparent',
                  '&:hover': {
                    bgcolor: isKnowledgeBaseSelected(kb.id) 
                      ? 'rgba(63, 81, 181, 0.12)' 
                      : 'rgba(0, 0, 0, 0.04)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  <FolderOutlined style={{ fontSize: 20, color: '#3f51b5' }} />
                </Box>
                <ListItemText
                  primary={kb.name}
                  secondary={
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {kb.description}
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <Box display="flex" alignItems="center">
                    <Chip 
                      label={`${kb.documentCount} 文档`} 
                      size="small" 
                      variant="outlined"
                      sx={{ mr: 1, fontSize: '0.7rem' }}
                    />
                    <Checkbox
                      edge="end"
                      checked={isKnowledgeBaseSelected(kb.id)}
                      onChange={() => toggleKnowledgeBaseSelection(kb)}
                      color="primary"
                    />
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      </Box>
      
      {selectedKnowledgeBases.length > 0 && (
        <>
          <Divider />
          <Box sx={{ 
            p: 2, 
            bgcolor: 'rgba(63, 81, 181, 0.05)', 
            borderTop: '1px solid rgba(0, 0, 0, 0.12)'
          }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              已选择 {selectedKnowledgeBases.length} 个知识库:
            </Typography>
            <Grid container spacing={1}>
              {selectedKnowledgeBases.map(kb => (
                <Grid item key={kb.id}>
                  <Chip
                    label={kb.name}
                    onDelete={() => toggleKnowledgeBaseSelection(kb)}
                    sx={{
                      backgroundColor: 'rgba(63, 81, 181, 0.1)',
                      '&:hover': { backgroundColor: 'rgba(63, 81, 181, 0.2)' }
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}
    </Card>
  );
};

export default KnowledgeBaseCard;
