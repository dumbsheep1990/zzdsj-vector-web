import React, { useState } from 'react';
import { 
  Card, 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
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
  AccordionDetails
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  SearchOutlined, 
  FolderOutlined,
  SettingOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
  ExpandMoreOutlined
} from '@ant-design/icons';
import { KnowledgeBase } from './types';

interface KnowledgeBaseCardProps {
  selectedKnowledgeBases: KnowledgeBase[];
  toggleKnowledgeBaseSelection: (knowledgeBase: KnowledgeBase) => void;
  renderKnowledgeBaseChips?: () => React.ReactNode;
}

type KnowledgeBaseCategory = 'all' | 'document' | 'database' | 'api' | 'web';

const knowledgeBaseCategoryLabels: Record<KnowledgeBaseCategory, string> = {
  all: '全部',
  document: '文档',
  database: '数据库', 
  api: 'API',
  web: '网页'
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

const KnowledgeBaseCard: React.FC<KnowledgeBaseCardProps> = ({
  selectedKnowledgeBases,
  toggleKnowledgeBaseSelection,
  renderKnowledgeBaseChips
}) => {
  const theme = useTheme();
  const [currentCategory, setCurrentCategory] = useState<KnowledgeBaseCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [currentKnowledgeBase, setCurrentKnowledgeBase] = useState<KnowledgeBase | null>(null);
  
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
      lastUpdated: '2024-01-15',
      retrievalConfig: getDefaultRetrievalConfig()
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
      lastUpdated: '2024-01-20',
      retrievalConfig: getDefaultRetrievalConfig()
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
      lastUpdated: '2024-01-18',
      retrievalConfig: getDefaultRetrievalConfig()
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
      lastUpdated: '2024-01-22',
      retrievalConfig: getDefaultRetrievalConfig()
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
      lastUpdated: '2024-01-16',
      retrievalConfig: getDefaultRetrievalConfig()
    }
  ];

  // 根据当前类别和搜索条件筛选知识库
  const filteredKnowledgeBases = availableKnowledgeBases.filter(kb => {
    const matchesCategory = currentCategory === 'all' || kb.category === currentCategory;
    const matchesSearch = kb.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      kb.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 检查知识库是否被选中
  const isKnowledgeBaseSelected = (id: string) => {
    return selectedKnowledgeBases.some(kb => kb.id === id);
  };

  // 获取类别计数
  const getCategoryCount = (category: KnowledgeBaseCategory) => {
    if (category === 'all') return availableKnowledgeBases.length;
    return availableKnowledgeBases.filter(kb => kb.category === category).length;
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

  // 更新检索配置
  const updateRetrievalConfig = (config: KnowledgeBaseRetrievalConfig) => {
    if (currentKnowledgeBase) {
      const updatedKb = { ...currentKnowledgeBase, retrievalConfig: config };
      // 这里应该调用更新接口
      console.log('Updated retrieval config:', updatedKb);
    }
  };

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
        bgcolor: 'transparent',
        backgroundColor: 'transparent',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden',
        height: '100%'
      }}
    >
      {/* 头部区域 - 固定在顶部 */}
      <Box
        sx={{
          p: 2,
          background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.08)}, ${alpha(theme.palette.info.main, 0.04)})`,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '10px',
                background: `linear-gradient(135deg, ${theme.palette.info.main}, ${alpha(theme.palette.info.main, 0.8)})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 12px ${alpha(theme.palette.info.main, 0.3)}`
              }}
            >
              <DatabaseOutlined style={{ fontSize: '16px', color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                fontSize: '1rem',
                color: theme.palette.text.primary,
                mb: 0.2
              }}>
                知识库
              </Typography>
              <Typography variant="body2" sx={{ 
                color: alpha(theme.palette.text.secondary, 0.8),
                fontSize: '0.75rem'
              }}>
                高效检索的智能知识库
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              size="small"
              icon={selectedKnowledgeBases.length > 0 ? <CheckCircleOutlined /> : undefined}
              label={selectedKnowledgeBases.length > 0 ? `已选择 ${selectedKnowledgeBases.length}` : '0 个知识库'}
              sx={{
                bgcolor: selectedKnowledgeBases.length > 0 
                  ? alpha(theme.palette.success.main, 0.15) 
                  : alpha(theme.palette.text.secondary, 0.08),
                color: selectedKnowledgeBases.length > 0 
                  ? theme.palette.success.main 
                  : theme.palette.text.secondary,
                border: `1px solid ${selectedKnowledgeBases.length > 0 
                  ? alpha(theme.palette.success.main, 0.3)
                  : alpha(theme.palette.text.secondary, 0.2)}`,
                fontWeight: 600,
                fontSize: '0.75rem',
                height: '24px'
              }}
            />
          </Box>
        </Box>
      </Box>
      
      {/* 搜索框 */}
      <Box sx={{ px: 2, pt: 1, pb: 1 }}>
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
                <SearchOutlined style={{ color: alpha(theme.palette.text.secondary, 0.5) }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: alpha(theme.palette.background.paper, 0.6),
              '& fieldset': {
                borderColor: alpha(theme.palette.divider, 0.1),
              }
            }
          }}
        />
      </Box>
      
      {/* 类别标签页 - 固定在顶部，位于搜索框下方 */}
      <Box sx={{ 
        px: 2, 
        pt: 1, 
        pb: 1, 
        bgcolor: 'transparent',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
        position: 'sticky',
        top: '102px',
        zIndex: 9
      }}>
        <Tabs
          value={currentCategory}
          onChange={(_, newValue) => setCurrentCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{ style: { display: 'none' } }}
          sx={{ 
            minHeight: '36px',
            '& .MuiTabs-scrollButtons': {
              color: alpha(theme.palette.text.secondary, 0.5),
              width: '20px',
              '&.Mui-disabled': {
                opacity: 0.2
              }
            },
            '& .MuiTabs-flexContainer': {
              gap: '6px'
            },
            '& .MuiTab-root': {
              minHeight: '28px',
              fontSize: '0.7rem',
              textTransform: 'none',
              fontWeight: 400,
              color: alpha(theme.palette.text.secondary, 0.8),
              transition: 'all 0.2s ease',
              borderRadius: '14px',
              mx: 0.2,
              px: 1.2,
              py: 0.2,
              minWidth: 0,
              border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              '&.Mui-selected': {
                color: theme.palette.info.main,
                fontWeight: 600,
                backgroundColor: alpha(theme.palette.info.main, 0.08),
                border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
                boxShadow: `0 1px 2px ${alpha(theme.palette.info.main, 0.1)}`
              },
              '&:hover': {
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                color: theme.palette.info.main
              }
            }
          }}
        >
          {Object.entries(knowledgeBaseCategoryLabels).map(([key, label]) => {
            const count = getCategoryCount(key as KnowledgeBaseCategory);
            return (
              <Tab 
                key={key}
                label={
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: 0.5 
                  }}>
                    <span>{label}</span>
                    {count > 0 && (
                      <Box component="span" sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '14px',
                        height: '14px',
                        fontSize: '0.6rem',
                        fontWeight: 500,
                        lineHeight: 1,
                        borderRadius: '7px',
                        padding: '0 3px',
                        backgroundColor: '#3b82f6',
                        color: 'white'
                      }}>
                        {count}
                      </Box>
                    )}
                  </Box>
                } 
                value={key} 
                disableRipple 
              />
            );
          })}
        </Tabs>
      </Box>
      
      {/* 知识库网格区域 - 可滚动内容区 */}
      <Box sx={{ 
        py: 2,
        px: 2, 
        overflow: 'auto',
        flex: 1,
        backgroundColor: 'transparent'
      }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, 300px)',
          gap: 2.5,
          alignContent: 'start',
          justifyContent: 'center',
          minHeight: filteredKnowledgeBases.length > 0 ? 'auto' : '300px',
          width: '100%',
          maxWidth: '100%'
        }}>
          {filteredKnowledgeBases.length > 0 ? filteredKnowledgeBases.map((kb) => {
            const statusColor = getStatusColor(kb.status || 'active');
            const categoryColor = 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.08))';
            
            return (
              <Box
                key={kb.id}
                onClick={() => toggleKnowledgeBaseSelection(kb)}
                sx={{
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: isKnowledgeBaseSelected(kb.id) 
                    ? '#3b82f6'
                    : alpha(theme.palette.divider, 0.15),
                  borderRadius: '16px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  background: categoryColor,
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  boxShadow: isKnowledgeBaseSelected(kb.id)
                    ? `0 8px 20px ${alpha('#3b82f6', 0.15)}`
                    : `0 4px 14px ${alpha(theme.palette.common.black, 0.03)}`,
                  '&:hover': {
                    borderColor: alpha('#3b82f6', 0.5),
                    boxShadow: `0 10px 25px ${alpha('#3b82f6', 0.18)}`,
                    transform: 'translateY(-3px)'
                  }
                }}
              >
                <Box sx={{ p: 2.5, backgroundColor: 'transparent' }}>
                  {/* 知识库头部信息 */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    mb: 1.5
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '8px',
                          backgroundColor: alpha(theme.palette.info.main, 0.15),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <FolderOutlined style={{ fontSize: '16px', color: theme.palette.info.main }} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: 700, 
                              color: theme.palette.text.primary,
                              fontSize: '0.9rem',
                              lineHeight: 1.2,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {kb.name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Chip
                            size="small"
                            label={`${kb.documentCount} 文档`}
                            sx={{
                              height: '18px',
                              fontSize: '0.65rem',
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                            }}
                          />
                          <Chip
                            size="small"
                            label={kb.status || 'active'}
                            sx={{
                              height: '18px',
                              fontSize: '0.65rem',
                              backgroundColor: statusColor.bg,
                              color: statusColor.color,
                              border: `1px solid ${statusColor.border}`
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box
                        onClick={(e) => openConfigDialog(kb, e)}
                        sx={{
                          p: 0.5,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          backgroundColor: alpha(theme.palette.text.secondary, 0.08),
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.text.secondary, 0.15)
                          }
                        }}
                      >
                        <SettingOutlined style={{ fontSize: '14px', color: theme.palette.text.secondary }} />
                      </Box>
                      <Switch 
                        size="small" 
                        checked={isKnowledgeBaseSelected(kb.id)} 
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleKnowledgeBaseSelection(kb);
                        }}
                        sx={{
                          flexShrink: 0,
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: theme.palette.info.main,
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: theme.palette.info.main,
                          },
                        }}
                      />
                    </Box>
                  </Box>
                  
                  {/* 知识库描述 */}
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: alpha(theme.palette.text.secondary, 0.9),
                      fontSize: '0.8rem',
                      lineHeight: 1.4,
                      mb: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {kb.description}
                  </Typography>

                  {/* 标签 */}
                  {kb.tags && kb.tags.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                      {kb.tags.slice(0, 3).map((tag, index) => (
                        <Chip
                          key={index}
                          size="small"
                          label={tag}
                          sx={{
                            height: '20px',
                            fontSize: '0.65rem',
                            backgroundColor: alpha(theme.palette.text.secondary, 0.08),
                            color: theme.palette.text.secondary,
                            border: `1px solid ${alpha(theme.palette.text.secondary, 0.15)}`
                          }}
                        />
                      ))}
                    </Box>
                  )}

                  {/* 底部信息 */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    pt: 1,
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                  }}>
                    <Typography variant="caption" sx={{ color: alpha(theme.palette.text.secondary, 0.7) }}>
                      {kb.size}MB
                    </Typography>
                    <Typography variant="caption" sx={{ color: alpha(theme.palette.text.secondary, 0.7) }}>
                      {kb.lastUpdated}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          }) : (
            <Box sx={{ 
              gridColumn: '1 / -1',
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              py: 6,
              color: alpha(theme.palette.text.secondary, 0.6)
            }}>
              <DatabaseOutlined style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }} />
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                该类别暂无知识库
              </Typography>
              <Typography variant="body2">
                请选择其他类别或创建新的知识库
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      
      {/* 选中知识库的芯片展示区域 */}
      {renderKnowledgeBaseChips && (
        <Box sx={{ 
          p: 2, 
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          bgcolor: alpha(theme.palette.background.paper, 0.8)
        }}>
          {renderKnowledgeBaseChips()}
        </Box>
      )}

      {/* 参数配置对话框 */}
      <Dialog 
        open={configDialogOpen} 
        onClose={() => setConfigDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            backgroundColor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(20px)'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: `linear-gradient(135deg, ${theme.palette.info.main}, ${alpha(theme.palette.info.main, 0.8)})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <SettingOutlined style={{ fontSize: '20px', color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                检索参数配置
              </Typography>
              <Typography variant="body2" sx={{ color: alpha(theme.palette.text.secondary, 0.8) }}>
                {currentKnowledgeBase?.name}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers sx={{ p: 3 }}>
          {currentKnowledgeBase?.retrievalConfig && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* 检索策略 */}
              <FormControl fullWidth>
                <InputLabel>检索策略</InputLabel>
                <Select
                  value={currentKnowledgeBase.retrievalConfig.strategy}
                  label="检索策略"
                  onChange={(e) => {
                    const newConfig = {
                      ...currentKnowledgeBase.retrievalConfig!,
                      strategy: e.target.value as 'vector' | 'keyword' | 'hybrid'
                    };
                    updateRetrievalConfig(newConfig);
                  }}
                >
                  <MenuItem value="vector">向量检索</MenuItem>
                  <MenuItem value="keyword">关键词检索</MenuItem>
                  <MenuItem value="hybrid">混合检索</MenuItem>
                </Select>
              </FormControl>

              {/* 向量检索参数 */}
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>向量检索参数</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography gutterBottom>TopK: {currentKnowledgeBase.retrievalConfig.vectorParams.topK}</Typography>
                      <Slider
                        value={currentKnowledgeBase.retrievalConfig.vectorParams.topK}
                        min={1}
                        max={20}
                        marks
                        valueLabelDisplay="auto"
                        onChange={(_, value) => {
                          const newConfig = {
                            ...currentKnowledgeBase.retrievalConfig!,
                            vectorParams: {
                              ...currentKnowledgeBase.retrievalConfig!.vectorParams,
                              topK: value as number
                            }
                          };
                          updateRetrievalConfig(newConfig);
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography gutterBottom>相似度阈值: {currentKnowledgeBase.retrievalConfig.vectorParams.scoreThreshold}</Typography>
                      <Slider
                        value={currentKnowledgeBase.retrievalConfig.vectorParams.scoreThreshold}
                        min={0}
                        max={1}
                        step={0.1}
                        marks
                        valueLabelDisplay="auto"
                        onChange={(_, value) => {
                          const newConfig = {
                            ...currentKnowledgeBase.retrievalConfig!,
                            vectorParams: {
                              ...currentKnowledgeBase.retrievalConfig!.vectorParams,
                              scoreThreshold: value as number
                            }
                          };
                          updateRetrievalConfig(newConfig);
                        }}
                      />
                    </Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={currentKnowledgeBase.retrievalConfig.vectorParams.includeMetadata}
                          onChange={(e) => {
                            const newConfig = {
                              ...currentKnowledgeBase.retrievalConfig!,
                              vectorParams: {
                                ...currentKnowledgeBase.retrievalConfig!.vectorParams,
                                includeMetadata: e.target.checked
                              }
                            };
                            updateRetrievalConfig(newConfig);
                          }}
                        />
                      }
                      label="包含元数据"
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* RRF参数 */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>RRF混合检索参数</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={currentKnowledgeBase.retrievalConfig.rrfParams.enabled}
                          onChange={(e) => {
                            const newConfig = {
                              ...currentKnowledgeBase.retrievalConfig!,
                              rrfParams: {
                                ...currentKnowledgeBase.retrievalConfig!.rrfParams,
                                enabled: e.target.checked
                              }
                            };
                            updateRetrievalConfig(newConfig);
                          }}
                        />
                      }
                      label="启用RRF"
                    />
                    {currentKnowledgeBase.retrievalConfig.rrfParams.enabled && (
                      <>
                        <Box>
                          <Typography gutterBottom>RRF K值: {currentKnowledgeBase.retrievalConfig.rrfParams.k}</Typography>
                          <Slider
                            value={currentKnowledgeBase.retrievalConfig.rrfParams.k}
                            min={1}
                            max={100}
                            marks
                            valueLabelDisplay="auto"
                            onChange={(_, value) => {
                              const newConfig = {
                                ...currentKnowledgeBase.retrievalConfig!,
                                rrfParams: {
                                  ...currentKnowledgeBase.retrievalConfig!.rrfParams,
                                  k: value as number
                                }
                              };
                              updateRetrievalConfig(newConfig);
                            }}
                          />
                        </Box>
                        <Box>
                          <Typography gutterBottom>向量权重: {currentKnowledgeBase.retrievalConfig.rrfParams.vectorWeight}</Typography>
                          <Slider
                            value={currentKnowledgeBase.retrievalConfig.rrfParams.vectorWeight}
                            min={0}
                            max={1}
                            step={0.1}
                            marks
                            valueLabelDisplay="auto"
                            onChange={(_, value) => {
                              const newConfig = {
                                ...currentKnowledgeBase.retrievalConfig!,
                                rrfParams: {
                                  ...currentKnowledgeBase.retrievalConfig!.rrfParams,
                                  vectorWeight: value as number,
                                  keywordWeight: 1 - (value as number)
                                }
                              };
                              updateRetrievalConfig(newConfig);
                            }}
                          />
                        </Box>
                      </>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* 索引配置 */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>索引配置</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel>索引类型</InputLabel>
                      <Select
                        value={currentKnowledgeBase.retrievalConfig.indexConfig.type}
                        label="索引类型"
                        onChange={(e) => {
                          const newConfig = {
                            ...currentKnowledgeBase.retrievalConfig!,
                            indexConfig: {
                              ...currentKnowledgeBase.retrievalConfig!.indexConfig,
                              type: e.target.value as 'IVF_PQ' | 'HNSW' | 'IVF_FLAT' | 'FLAT'
                            }
                          };
                          updateRetrievalConfig(newConfig);
                        }}
                      >
                        <MenuItem value="HNSW">HNSW (推荐)</MenuItem>
                        <MenuItem value="IVF_PQ">IVF_PQ</MenuItem>
                        <MenuItem value="IVF_FLAT">IVF_FLAT</MenuItem>
                        <MenuItem value="FLAT">FLAT</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <FormControl fullWidth>
                      <InputLabel>距离度量</InputLabel>
                      <Select
                        value={currentKnowledgeBase.retrievalConfig.indexConfig.metric}
                        label="距离度量"
                        onChange={(e) => {
                          const newConfig = {
                            ...currentKnowledgeBase.retrievalConfig!,
                            indexConfig: {
                              ...currentKnowledgeBase.retrievalConfig!.indexConfig,
                              metric: e.target.value as 'cosine' | 'euclidean' | 'dot_product'
                            }
                          };
                          updateRetrievalConfig(newConfig);
                        }}
                      >
                        <MenuItem value="cosine">余弦相似度</MenuItem>
                        <MenuItem value="euclidean">欧几里得距离</MenuItem>
                        <MenuItem value="dot_product">点积</MenuItem>
                      </Select>
                    </FormControl>
                    
                    {/* HNSW特有参数 */}
                    {currentKnowledgeBase.retrievalConfig.indexConfig.type === 'HNSW' && 
                     currentKnowledgeBase.retrievalConfig.indexConfig.hnswParams && (
                      <>
                        <Box>
                          <Typography gutterBottom>M (连接数): {currentKnowledgeBase.retrievalConfig.indexConfig.hnswParams.M}</Typography>
                          <Slider
                            value={currentKnowledgeBase.retrievalConfig.indexConfig.hnswParams.M}
                            min={4}
                            max={64}
                            marks
                            valueLabelDisplay="auto"
                            onChange={(_, value) => {
                              const newConfig = {
                                ...currentKnowledgeBase.retrievalConfig!,
                                indexConfig: {
                                  ...currentKnowledgeBase.retrievalConfig!.indexConfig,
                                  hnswParams: {
                                    ...currentKnowledgeBase.retrievalConfig!.indexConfig.hnswParams!,
                                    M: value as number
                                  }
                                }
                              };
                              updateRetrievalConfig(newConfig);
                            }}
                          />
                        </Box>
                        <Box>
                          <Typography gutterBottom>efSearch: {currentKnowledgeBase.retrievalConfig.indexConfig.hnswParams.efSearch}</Typography>
                          <Slider
                            value={currentKnowledgeBase.retrievalConfig.indexConfig.hnswParams.efSearch}
                            min={16}
                            max={512}
                            marks
                            valueLabelDisplay="auto"
                            onChange={(_, value) => {
                              const newConfig = {
                                ...currentKnowledgeBase.retrievalConfig!,
                                indexConfig: {
                                  ...currentKnowledgeBase.retrievalConfig!.indexConfig,
                                  hnswParams: {
                                    ...currentKnowledgeBase.retrievalConfig!.indexConfig.hnswParams!,
                                    efSearch: value as number
                                  }
                                }
                              };
                              updateRetrievalConfig(newConfig);
                            }}
                          />
                        </Box>
                      </>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={() => setConfigDialogOpen(false)}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              px: 3
            }}
          >
            取消
          </Button>
          <Button 
            variant="contained" 
            onClick={() => setConfigDialogOpen(false)}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              background: `linear-gradient(135deg, ${theme.palette.info.main}, ${alpha(theme.palette.info.main, 0.8)})`,
              px: 3
            }}
          >
            保存配置
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default KnowledgeBaseCard;
