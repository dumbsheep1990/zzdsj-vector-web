import React, { useState } from 'react';
import { 
  Card, 
  Box, 
  Typography, 
  Switch,
  alpha,
  useTheme,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Divider,
  Alert,
  Tooltip
} from '@mui/material';
import { 
  SearchOutlined, 
  FolderOutlined,
  SettingOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
  ExpandMoreOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { KnowledgeBase, KnowledgeBaseRetrievalConfig } from './types';

interface KnowledgeBaseCardProps {
  selectedKnowledgeBases: KnowledgeBase[];
  toggleKnowledgeBaseSelection: (knowledgeBase: KnowledgeBase) => void;
}

const KnowledgeBaseCard: React.FC<KnowledgeBaseCardProps> = ({
  selectedKnowledgeBases,
  toggleKnowledgeBaseSelection
}) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [currentKnowledgeBase, setCurrentKnowledgeBase] = useState<KnowledgeBase | null>(null);
  const [retrievalConfig, setRetrievalConfig] = useState<KnowledgeBaseRetrievalConfig | null>(null);
  
  // 示例知识库数据
  const availableKnowledgeBases: KnowledgeBase[] = [
    {
      id: '1',
      name: '向量数据库文档',
      description: '包含向量数据库的基本概念、架构和使用方法',
      documentCount: 24,
      category: 'document',
      tags: ['数据库', '向量', '文档'],
      status: 'active',
      size: 15.2,
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      name: '机器学习资料库',
      description: '机器学习和深度学习的理论知识和实践案例',
      documentCount: 56,
      category: 'document',
      tags: ['机器学习', '深度学习', '算法'],
      status: 'active',
      size: 28.5,
      lastUpdated: '2024-01-20'
    },
    {
      id: '3',
      name: '编程语言指南',
      description: '各种编程语言的语法、特性和最佳实践',
      documentCount: 78,
      category: 'document',
      tags: ['编程', '语法', '实践'],
      status: 'active',
      size: 42.1,
      lastUpdated: '2024-01-18'
    },
    {
      id: '4',
      name: '项目文档集合',
      description: '企业内部项目的技术文档和需求规格',
      documentCount: 43,
      category: 'document',
      tags: ['项目', '技术文档', '需求'],
      status: 'active',
      size: 19.8,
      lastUpdated: '2024-01-22'
    },
    {
      id: '5',
      name: '学术研究论文',
      description: '人工智能和自然语言处理领域的学术论文',
      documentCount: 35,
      category: 'document',
      tags: ['学术', '研究', 'AI'],
      status: 'active',
      size: 22.3,
      lastUpdated: '2024-01-16'
    }
  ];

  // 根据搜索条件筛选知识库
  const filteredKnowledgeBases = availableKnowledgeBases.filter(kb => 
    kb.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    kb.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 检查知识库是否被选中
  const isKnowledgeBaseSelected = (id: string) => {
    return selectedKnowledgeBases.some(kb => kb.id === id);
  };

  // 状态标签颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.3)', color: '#22c55e' };
      case 'indexing': return { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.3)', color: '#f59e0b' };
      case 'error': return { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)', color: '#ef4444' };
      case 'inactive': return { bg: 'rgba(100, 116, 139, 0.15)', border: 'rgba(100, 116, 139, 0.3)', color: '#64748b' };
      default: return { bg: 'rgba(100, 116, 139, 0.15)', border: 'rgba(100, 116, 139, 0.3)', color: '#64748b' };
    }
  };

  // 打开配置对话框
  const openConfigDialog = (kb: KnowledgeBase, event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentKnowledgeBase(kb);
    setConfigDialogOpen(true);
  };

  // 默认检索配置
  const getDefaultRetrievalConfig = (): KnowledgeBaseRetrievalConfig => ({
    strategy: 'hybrid',
    vectorParams: {
      topK: 5,
      scoreThreshold: 0.7,
      includeMetadata: true
    },
    keywordParams: {
      topK: 3,
      boost: 1.0
    },
    rrfParams: {
      enabled: true,
      k: 60,
      vectorWeight: 0.6,
      keywordWeight: 0.4
    },
    indexConfig: {
      type: 'HNSW',
      dimension: 1536,
      metric: 'cosine',
      hnswParams: {
        M: 16,
        efConstruction: 200,
        efSearch: 64
      }
    }
  });

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'none',
        border: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.1),
        borderRadius: '16px',
        background: 'transparent',
        backdropFilter: 'blur(20px)',
        height: '100%'
      }}
    >
      {/* 头部区域 */}
      <Box sx={{ p: 2, background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.08)}, ${alpha(theme.palette.info.main, 0.04)})` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ 
              width: 32, height: 32, borderRadius: '10px',
              background: `linear-gradient(135deg, ${theme.palette.info.main}, ${alpha(theme.palette.info.main, 0.8)})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 4px 12px ${alpha(theme.palette.info.main, 0.3)}`
            }}>
              <DatabaseOutlined style={{ fontSize: '16px', color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', mb: 0.2 }}>知识库</Typography>
              <Typography variant="body2" sx={{ color: alpha(theme.palette.text.secondary, 0.8), fontSize: '0.75rem' }}>
                高效检索的智能知识库
              </Typography>
            </Box>
          </Box>
          <Chip
            size="small"
            icon={selectedKnowledgeBases.length > 0 ? <CheckCircleOutlined /> : undefined}
            label={selectedKnowledgeBases.length > 0 ? `已选择 ${selectedKnowledgeBases.length}` : '0 个知识库'}
            sx={{
              bgcolor: selectedKnowledgeBases.length > 0 ? alpha(theme.palette.success.main, 0.15) : alpha(theme.palette.text.secondary, 0.08),
              color: selectedKnowledgeBases.length > 0 ? theme.palette.success.main : theme.palette.text.secondary,
              fontWeight: 600, fontSize: '0.75rem', height: '24px'
            }}
          />
        </Box>
      </Box>
      
      {/* 搜索框 */}
      <Box sx={{ px: 2, py: 1 }}>
        <TextField
          fullWidth placeholder="搜索知识库..." variant="outlined" size="small"
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlined /></InputAdornment> }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: alpha(theme.palette.background.paper, 0.6) } }}
        />
      </Box>
      
      {/* 知识库网格 */}
      <Box sx={{ py: 2, px: 2, overflow: 'auto', flex: 1 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 300px)', gap: 2.5, justifyContent: 'center' }}>
          {filteredKnowledgeBases.map((kb) => {
            const statusColor = getStatusColor(kb.status || 'active');
            const categoryColor = 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.08))';
            
            return (
              <Box
                key={kb.id}
                onClick={() => toggleKnowledgeBaseSelection(kb)}
                sx={{
                  cursor: 'pointer', border: '1px solid',
                  borderColor: isKnowledgeBaseSelected(kb.id) ? '#3b82f6' : alpha(theme.palette.divider, 0.15),
                  borderRadius: '16px', background: categoryColor,
                  transition: 'all 0.3s ease', backdropFilter: 'blur(8px)',
                  '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.18)' }
                }}
              >
                <Box sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                      <Box sx={{ width: 32, height: 32, borderRadius: '8px', backgroundColor: alpha(theme.palette.info.main, 0.15), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FolderOutlined style={{ fontSize: '16px', color: theme.palette.info.main }} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {kb.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Chip size="small" label={`${kb.documentCount} 文档`} sx={{ height: '18px', fontSize: '0.65rem' }} />
                          <Chip size="small" label={kb.status || 'active'} sx={{ height: '18px', fontSize: '0.65rem', backgroundColor: statusColor.bg, color: statusColor.color }} />
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box onClick={(e) => openConfigDialog(kb, e)} sx={{ p: 0.5, borderRadius: '6px', cursor: 'pointer', backgroundColor: alpha(theme.palette.text.secondary, 0.08), '&:hover': { backgroundColor: alpha(theme.palette.text.secondary, 0.15) } }}>
                        <SettingOutlined style={{ fontSize: '14px' }} />
                      </Box>
                      <Switch size="small" checked={isKnowledgeBaseSelected(kb.id)} onChange={(e) => { e.stopPropagation(); toggleKnowledgeBaseSelection(kb); }} />
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ color: alpha(theme.palette.text.secondary, 0.9), fontSize: '0.8rem', mb: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {kb.description}
                  </Typography>
                  {kb.tags && kb.tags.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                      {kb.tags.slice(0, 3).map((tag, index) => (
                        <Chip key={index} size="small" label={tag} sx={{ height: '20px', fontSize: '0.65rem' }} />
                      ))}
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                    <Typography variant="caption">{kb.size}MB</Typography>
                    <Typography variant="caption">{kb.lastUpdated}</Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* 参数配置对话框 */}
      <Dialog open={configDialogOpen} onClose={() => setConfigDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>知识库参数配置 - {currentKnowledgeBase?.name}</DialogTitle>
        <DialogContent>
          <Typography>检索参数配置功能将在下个版本中完善</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigDialogOpen(false)}>关闭</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default KnowledgeBaseCard;
