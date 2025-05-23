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
  DownOutlined,
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
  
  // 新增布局模式状态
  const [layoutMode, setLayoutMode] = useState<'grid' | 'config'>('grid');
  const [configPanelKb, setConfigPanelKb] = useState<KnowledgeBase | null>(null);
  
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

  // 进入配置模式
  const enterConfigMode = (kb: KnowledgeBase, event: React.MouseEvent) => {
    event.stopPropagation();
    setConfigPanelKb(kb);
    setRetrievalConfig(kb.retrievalConfig || getDefaultRetrievalConfig());
    setLayoutMode('config');
  };

  // 退出配置模式
  const exitConfigMode = () => {
    setLayoutMode('grid');
    setConfigPanelKb(null);
    setRetrievalConfig(null);
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

  // 更新配置
  const updateConfig = (newConfig: KnowledgeBaseRetrievalConfig) => {
    setRetrievalConfig(newConfig);
  };

  // 保存配置并退出配置模式
  const saveConfig = () => {
    if (configPanelKb && retrievalConfig) {
      // 这里应该调用API保存配置
      console.log('保存知识库配置:', {
        knowledgeBaseId: configPanelKb.id,
        config: retrievalConfig
      });
      // 更新本地状态
      const updatedKb = { ...configPanelKb, retrievalConfig };
      // TODO: 更新availableKnowledgeBases数组
    }
    exitConfigMode();
  };

  // 渲染网格模式的卡片
  const renderGridCards = () => (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, 300px)', 
      gap: 2.5, 
      justifyContent: 'center' 
    }}>
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
                  <Box onClick={(e) => enterConfigMode(kb, e)} sx={{ p: 0.5, borderRadius: '6px', cursor: 'pointer', backgroundColor: alpha(theme.palette.text.secondary, 0.08), '&:hover': { backgroundColor: alpha(theme.palette.text.secondary, 0.15) } }}>
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
  );

  // 渲染列表模式的卡片
  const renderListCards = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {filteredKnowledgeBases.map((kb) => {
        const statusColor = getStatusColor(kb.status || 'active');
        const isSelected = isKnowledgeBaseSelected(kb.id);
        const isConfiguring = configPanelKb?.id === kb.id;
        
        return (
          <Box
            key={kb.id}
            onClick={() => toggleKnowledgeBaseSelection(kb)}
            sx={{
              cursor: 'pointer',
              border: '1px solid',
              borderColor: isConfiguring ? '#3b82f6' : isSelected ? alpha('#3b82f6', 0.5) : alpha(theme.palette.divider, 0.15),
              borderRadius: '12px',
              background: isConfiguring 
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1))' 
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(59, 130, 246, 0.04))',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(8px)',
              '&:hover': { 
                transform: isConfiguring ? 'none' : 'translateX(4px)',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)' 
              }
            }}
          >
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                width: 40, height: 40, borderRadius: '10px', 
                backgroundColor: alpha(theme.palette.info.main, 0.15), 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0 
              }}>
                <FolderOutlined style={{ fontSize: '18px', color: theme.palette.info.main }} />
              </Box>
              
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="subtitle2" sx={{ 
                    fontWeight: 700, fontSize: '0.95rem', 
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' 
                  }}>
                    {kb.name}
                  </Typography>
                  {isConfiguring && (
                    <Chip 
                      size="small" 
                      label="配置中" 
                      sx={{ 
                        height: '20px', fontSize: '0.65rem', 
                        backgroundColor: '#3b82f6', color: 'white' 
                      }} 
                    />
                  )}
                </Box>
                <Typography variant="body2" sx={{ 
                  color: alpha(theme.palette.text.secondary, 0.8), 
                  fontSize: '0.8rem', mb: 1,
                  display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' 
                }}>
                  {kb.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Chip size="small" label={`${kb.documentCount} 文档`} sx={{ height: '18px', fontSize: '0.65rem' }} />
                  <Chip size="small" label={kb.status || 'active'} sx={{ height: '18px', fontSize: '0.65rem', backgroundColor: statusColor.bg, color: statusColor.color }} />
                  <Typography variant="caption" sx={{ color: alpha(theme.palette.text.secondary, 0.6) }}>
                    {kb.size}MB · {kb.lastUpdated}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Switch 
                  size="small" 
                  checked={isSelected} 
                  onChange={(e) => { e.stopPropagation(); toggleKnowledgeBaseSelection(kb); }}
                  sx={{ flexShrink: 0 }}
                />
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );

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
        {layoutMode === 'grid' ? renderGridCards() : renderListCards()}
      </Box>

      {/* 参数配置对话框 */}
      <Dialog 
        open={layoutMode === 'config'} 
        onClose={exitConfigMode} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            backgroundColor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(20px)',
            minHeight: '600px'
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
                {configPanelKb?.name}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers sx={{ p: 3 }}>
          {retrievalConfig && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* 检索策略选择 */}
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  配置知识库的检索参数，这些设置将影响智能体的检索性能和准确性。
                </Typography>
              </Alert>

              <FormControl fullWidth>
                <InputLabel>检索策略</InputLabel>
                <Select
                  value={retrievalConfig.strategy}
                  label="检索策略"
                  onChange={(e) => updateConfig({
                    ...retrievalConfig,
                    strategy: e.target.value as 'vector' | 'keyword' | 'hybrid'
                  })}
                >
                  <MenuItem value="vector">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>向量检索</Typography>
                      <Tooltip title="基于语义相似度的向量检索，适合理解文档语义">
                        <InfoCircleOutlined style={{ fontSize: '14px', color: theme.palette.text.secondary }} />
                      </Tooltip>
                    </Box>
                  </MenuItem>
                  <MenuItem value="keyword">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>关键词检索</Typography>
                      <Tooltip title="基于关键词匹配的传统检索，适合精确匹配">
                        <InfoCircleOutlined style={{ fontSize: '14px', color: theme.palette.text.secondary }} />
                      </Tooltip>
                    </Box>
                  </MenuItem>
                  <MenuItem value="hybrid">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>混合检索 (推荐)</Typography>
                      <Tooltip title="结合向量检索和关键词检索的优势">
                        <InfoCircleOutlined style={{ fontSize: '14px', color: theme.palette.text.secondary }} />
                      </Tooltip>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              {/* 向量检索参数 */}
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<DownOutlined />}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    向量检索参数
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          向量检索 TopK: {retrievalConfig.vectorParams.topK}
                          <Tooltip title="返回最相似的K个文档片段">
                            <InfoCircleOutlined style={{ fontSize: '14px' }} />
                          </Tooltip>
                        </Typography>
                        <Slider
                          value={retrievalConfig.vectorParams.topK}
                          min={1}
                          max={20}
                          step={1}
                          marks={[
                            { value: 1, label: '1' },
                            { value: 5, label: '5' },
                            { value: 10, label: '10' },
                            { value: 20, label: '20' }
                          ]}
                          valueLabelDisplay="auto"
                          onChange={(_, value) => updateConfig({
                            ...retrievalConfig,
                            vectorParams: {
                              ...retrievalConfig.vectorParams,
                              topK: value as number
                            }
                          })}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          相似度阈值: {retrievalConfig.vectorParams.scoreThreshold}
                          <Tooltip title="只返回相似度分数高于此阈值的结果">
                            <InfoCircleOutlined style={{ fontSize: '14px' }} />
                          </Tooltip>
                        </Typography>
                        <Slider
                          value={retrievalConfig.vectorParams.scoreThreshold}
                          min={0}
                          max={1}
                          step={0.05}
                          marks={[
                            { value: 0, label: '0' },
                            { value: 0.5, label: '0.5' },
                            { value: 0.7, label: '0.7' },
                            { value: 1, label: '1' }
                          ]}
                          valueLabelDisplay="auto"
                          onChange={(_, value) => updateConfig({
                            ...retrievalConfig,
                            vectorParams: {
                              ...retrievalConfig.vectorParams,
                              scoreThreshold: value as number
                            }
                          })}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={retrievalConfig.vectorParams.includeMetadata}
                            onChange={(e) => updateConfig({
                              ...retrievalConfig,
                              vectorParams: {
                                ...retrievalConfig.vectorParams,
                                includeMetadata: e.target.checked
                              }
                            })}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography>包含文档元数据</Typography>
                            <Tooltip title="在检索结果中包含文档的元数据信息">
                              <InfoCircleOutlined style={{ fontSize: '14px' }} />
                            </Tooltip>
                          </Box>
                        }
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* 关键词检索参数 */}
              {(retrievalConfig.strategy === 'keyword' || retrievalConfig.strategy === 'hybrid') && (
                <Accordion>
                  <AccordionSummary expandIcon={<DownOutlined />}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      关键词检索参数
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Box>
                          <Typography gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            关键词检索 TopK: {retrievalConfig.keywordParams.topK}
                            <Tooltip title="关键词检索返回的文档数量">
                              <InfoCircleOutlined style={{ fontSize: '14px' }} />
                            </Tooltip>
                          </Typography>
                          <Slider
                            value={retrievalConfig.keywordParams.topK}
                            min={1}
                            max={10}
                            step={1}
                            marks={[
                              { value: 1, label: '1' },
                              { value: 3, label: '3' },
                              { value: 5, label: '5' },
                              { value: 10, label: '10' }
                            ]}
                            valueLabelDisplay="auto"
                            onChange={(_, value) => updateConfig({
                              ...retrievalConfig,
                              keywordParams: {
                                ...retrievalConfig.keywordParams,
                                topK: value as number
                              }
                            })}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box>
                          <Typography gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            权重提升: {retrievalConfig.keywordParams.boost}
                            <Tooltip title="提高关键词匹配结果的权重">
                              <InfoCircleOutlined style={{ fontSize: '14px' }} />
                            </Tooltip>
                          </Typography>
                          <Slider
                            value={retrievalConfig.keywordParams.boost}
                            min={0.1}
                            max={3.0}
                            step={0.1}
                            marks={[
                              { value: 0.5, label: '0.5' },
                              { value: 1.0, label: '1.0' },
                              { value: 2.0, label: '2.0' }
                            ]}
                            valueLabelDisplay="auto"
                            onChange={(_, value) => updateConfig({
                              ...retrievalConfig,
                              keywordParams: {
                                ...retrievalConfig.keywordParams,
                                boost: value as number
                              }
                            })}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              )}

              {/* RRF混合检索参数 */}
              {retrievalConfig.strategy === 'hybrid' && (
                <Accordion>
                  <AccordionSummary expandIcon={<DownOutlined />}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      RRF 混合检索参数
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={retrievalConfig.rrfParams.enabled}
                              onChange={(e) => updateConfig({
                                ...retrievalConfig,
                                rrfParams: {
                                  ...retrievalConfig.rrfParams,
                                  enabled: e.target.checked
                                }
                              })}
                            />
                          }
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography>启用 RRF (Reciprocal Rank Fusion)</Typography>
                              <Tooltip title="RRF算法用于融合向量检索和关键词检索的结果">
                                <InfoCircleOutlined style={{ fontSize: '14px' }} />
                              </Tooltip>
                            </Box>
                          }
                        />
                      </Grid>
                      
                      {retrievalConfig.rrfParams.enabled && (
                        <>
                          <Grid item xs={12} md={4}>
                            <Box>
                              <Typography gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                RRF K值: {retrievalConfig.rrfParams.k}
                                <Tooltip title="RRF算法的参数，影响结果融合的平滑程度">
                                  <InfoCircleOutlined style={{ fontSize: '14px' }} />
                                </Tooltip>
                              </Typography>
                              <Slider
                                value={retrievalConfig.rrfParams.k}
                                min={10}
                                max={100}
                                step={10}
                                marks={[
                                  { value: 20, label: '20' },
                                  { value: 60, label: '60' },
                                  { value: 100, label: '100' }
                                ]}
                                valueLabelDisplay="auto"
                                onChange={(_, value) => updateConfig({
                                  ...retrievalConfig,
                                  rrfParams: {
                                    ...retrievalConfig.rrfParams,
                                    k: value as number
                                  }
                                })}
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Box>
                              <Typography gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                向量检索权重: {retrievalConfig.rrfParams.vectorWeight}
                                <Tooltip title="向量检索在混合结果中的权重">
                                  <InfoCircleOutlined style={{ fontSize: '14px' }} />
                                </Tooltip>
                              </Typography>
                              <Slider
                                value={retrievalConfig.rrfParams.vectorWeight}
                                min={0.1}
                                max={0.9}
                                step={0.1}
                                marks={[
                                  { value: 0.3, label: '0.3' },
                                  { value: 0.6, label: '0.6' },
                                  { value: 0.9, label: '0.9' }
                                ]}
                                valueLabelDisplay="auto"
                                onChange={(_, value) => updateConfig({
                                  ...retrievalConfig,
                                  rrfParams: {
                                    ...retrievalConfig.rrfParams,
                                    vectorWeight: value as number,
                                    keywordWeight: 1 - (value as number)
                                  }
                                })}
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Box>
                              <Typography gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                关键词检索权重: {retrievalConfig.rrfParams.keywordWeight.toFixed(1)}
                                <Tooltip title="关键词检索在混合结果中的权重，自动根据向量权重计算">
                                  <InfoCircleOutlined style={{ fontSize: '14px' }} />
                                </Tooltip>
                              </Typography>
                              <Box sx={{ 
                                height: 40, 
                                display: 'flex', 
                                alignItems: 'center', 
                                px: 2, 
                                borderRadius: 1, 
                                bgcolor: alpha(theme.palette.text.secondary, 0.1),
                                color: theme.palette.text.secondary 
                              }}>
                                自动计算 (1 - 向量权重)
                              </Box>
                            </Box>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              )}

              {/* 索引配置 */}
              <Accordion>
                <AccordionSummary expandIcon={<DownOutlined />}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    索引配置
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>索引类型</InputLabel>
                        <Select
                          value={retrievalConfig.indexConfig.type}
                          label="索引类型"
                          onChange={(e) => updateConfig({
                            ...retrievalConfig,
                            indexConfig: {
                              ...retrievalConfig.indexConfig,
                              type: e.target.value as 'IVF_PQ' | 'HNSW' | 'IVF_FLAT' | 'FLAT'
                            }
                          })}
                        >
                          <MenuItem value="HNSW">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography>HNSW (推荐)</Typography>
                              <Tooltip title="高精度、高性能的索引类型，适合大多数场景">
                                <InfoCircleOutlined style={{ fontSize: '14px' }} />
                              </Tooltip>
                            </Box>
                          </MenuItem>
                          <MenuItem value="IVF_PQ">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography>IVF_PQ</Typography>
                              <Tooltip title="内存效率高的索引类型，适合大规模数据">
                                <InfoCircleOutlined style={{ fontSize: '14px' }} />
                              </Tooltip>
                            </Box>
                          </MenuItem>
                          <MenuItem value="IVF_FLAT">IVF_FLAT</MenuItem>
                          <MenuItem value="FLAT">FLAT</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>距离度量</InputLabel>
                        <Select
                          value={retrievalConfig.indexConfig.metric}
                          label="距离度量"
                          onChange={(e) => updateConfig({
                            ...retrievalConfig,
                            indexConfig: {
                              ...retrievalConfig.indexConfig,
                              metric: e.target.value as 'cosine' | 'euclidean' | 'dot_product'
                            }
                          })}
                        >
                          <MenuItem value="cosine">余弦相似度 (推荐)</MenuItem>
                          <MenuItem value="euclidean">欧几里得距离</MenuItem>
                          <MenuItem value="dot_product">点积</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    {/* HNSW特有参数 */}
                    {retrievalConfig.indexConfig.type === 'HNSW' && retrievalConfig.indexConfig.hnswParams && (
                      <>
                        <Grid item xs={12}>
                          <Divider sx={{ my: 2 }}>
                            <Typography variant="body2" color="text.secondary">HNSW 专用参数</Typography>
                          </Divider>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Box>
                            <Typography gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              M (连接数): {retrievalConfig.indexConfig.hnswParams.M}
                              <Tooltip title="每个节点的最大连接数，影响构建时间和查询精度">
                                <InfoCircleOutlined style={{ fontSize: '14px' }} />
                              </Tooltip>
                            </Typography>
                            <Slider
                              value={retrievalConfig.indexConfig.hnswParams.M}
                              min={4}
                              max={64}
                              step={4}
                              marks={[
                                { value: 8, label: '8' },
                                { value: 16, label: '16' },
                                { value: 32, label: '32' }
                              ]}
                              valueLabelDisplay="auto"
                              onChange={(_, value) => updateConfig({
                                ...retrievalConfig,
                                indexConfig: {
                                  ...retrievalConfig.indexConfig,
                                  hnswParams: {
                                    ...retrievalConfig.indexConfig.hnswParams!,
                                    M: value as number
                                  }
                                }
                              })}
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Box>
                            <Typography gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              efConstruction: {retrievalConfig.indexConfig.hnswParams.efConstruction}
                              <Tooltip title="构建时的动态列表大小，影响索引质量">
                                <InfoCircleOutlined style={{ fontSize: '14px' }} />
                              </Tooltip>
                            </Typography>
                            <Slider
                              value={retrievalConfig.indexConfig.hnswParams.efConstruction}
                              min={100}
                              max={400}
                              step={50}
                              marks={[
                                { value: 100, label: '100' },
                                { value: 200, label: '200' },
                                { value: 400, label: '400' }
                              ]}
                              valueLabelDisplay="auto"
                              onChange={(_, value) => updateConfig({
                                ...retrievalConfig,
                                indexConfig: {
                                  ...retrievalConfig.indexConfig,
                                  hnswParams: {
                                    ...retrievalConfig.indexConfig.hnswParams!,
                                    efConstruction: value as number
                                  }
                                }
                              })}
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Box>
                            <Typography gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              efSearch: {retrievalConfig.indexConfig.hnswParams.efSearch}
                              <Tooltip title="搜索时的动态列表大小，影响查询精度和速度">
                                <InfoCircleOutlined style={{ fontSize: '14px' }} />
                              </Tooltip>
                            </Typography>
                            <Slider
                              value={retrievalConfig.indexConfig.hnswParams.efSearch}
                              min={16}
                              max={256}
                              step={16}
                              marks={[
                                { value: 32, label: '32' },
                                { value: 64, label: '64' },
                                { value: 128, label: '128' }
                              ]}
                              valueLabelDisplay="auto"
                              onChange={(_, value) => updateConfig({
                                ...retrievalConfig,
                                indexConfig: {
                                  ...retrievalConfig.indexConfig,
                                  hnswParams: {
                                    ...retrievalConfig.indexConfig.hnswParams!,
                                    efSearch: value as number
                                  }
                                }
                              })}
                            />
                          </Box>
                        </Grid>
                      </>
                    )}

                    {/* IVF_PQ特有参数 */}
                    {retrievalConfig.indexConfig.type === 'IVF_PQ' && retrievalConfig.indexConfig.ivfPqParams && (
                      <>
                        <Grid item xs={12}>
                          <Divider sx={{ my: 2 }}>
                            <Typography variant="body2" color="text.secondary">IVF_PQ 专用参数</Typography>
                          </Divider>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Box>
                            <Typography gutterBottom>nlist: {retrievalConfig.indexConfig.ivfPqParams.nlist}</Typography>
                            <Slider
                              value={retrievalConfig.indexConfig.ivfPqParams.nlist}
                              min={50}
                              max={500}
                              step={50}
                              valueLabelDisplay="auto"
                              onChange={(_, value) => updateConfig({
                                ...retrievalConfig,
                                indexConfig: {
                                  ...retrievalConfig.indexConfig,
                                  ivfPqParams: {
                                    ...retrievalConfig.indexConfig.ivfPqParams!,
                                    nlist: value as number
                                  }
                                }
                              })}
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Box>
                            <Typography gutterBottom>nprobe: {retrievalConfig.indexConfig.ivfPqParams.nprobe}</Typography>
                            <Slider
                              value={retrievalConfig.indexConfig.ivfPqParams.nprobe}
                              min={1}
                              max={50}
                              step={1}
                              valueLabelDisplay="auto"
                              onChange={(_, value) => updateConfig({
                                ...retrievalConfig,
                                indexConfig: {
                                  ...retrievalConfig.indexConfig,
                                  ivfPqParams: {
                                    ...retrievalConfig.indexConfig.ivfPqParams!,
                                    nprobe: value as number
                                  }
                                }
                              })}
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Box>
                            <Typography gutterBottom>m: {retrievalConfig.indexConfig.ivfPqParams.m}</Typography>
                            <Slider
                              value={retrievalConfig.indexConfig.ivfPqParams.m}
                              min={4}
                              max={16}
                              step={4}
                              valueLabelDisplay="auto"
                              onChange={(_, value) => updateConfig({
                                ...retrievalConfig,
                                indexConfig: {
                                  ...retrievalConfig.indexConfig,
                                  ivfPqParams: {
                                    ...retrievalConfig.indexConfig.ivfPqParams!,
                                    m: value as number
                                  }
                                }
                              })}
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Box>
                            <Typography gutterBottom>nbits: {retrievalConfig.indexConfig.ivfPqParams.nbits}</Typography>
                            <Slider
                              value={retrievalConfig.indexConfig.ivfPqParams.nbits}
                              min={4}
                              max={16}
                              step={4}
                              valueLabelDisplay="auto"
                              onChange={(_, value) => updateConfig({
                                ...retrievalConfig,
                                indexConfig: {
                                  ...retrievalConfig.indexConfig,
                                  ivfPqParams: {
                                    ...retrievalConfig.indexConfig.ivfPqParams!,
                                    nbits: value as number
                                  }
                                }
                              })}
                            />
                          </Box>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* 预览配置 */}
              <Alert severity="success" sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  当前配置预览:
                </Typography>
                <Typography variant="body2" component="div">
                  策略: {retrievalConfig.strategy === 'hybrid' ? '混合检索' : retrievalConfig.strategy === 'vector' ? '向量检索' : '关键词检索'} | 
                  向量TopK: {retrievalConfig.vectorParams.topK} | 
                  相似度阈值: {retrievalConfig.vectorParams.scoreThreshold} | 
                  索引类型: {retrievalConfig.indexConfig.type}
                  {retrievalConfig.strategy === 'hybrid' && retrievalConfig.rrfParams.enabled && (
                    <>
                      <br />
                      RRF启用: K={retrievalConfig.rrfParams.k}, 向量权重={retrievalConfig.rrfParams.vectorWeight}
                    </>
                  )}
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={exitConfigMode}
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
            onClick={saveConfig}
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
