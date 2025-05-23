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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  SearchOutlined, 
  FolderOutlined,
  SettingOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
  DownOutlined
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
  const [retrievalConfig, setRetrievalConfig] = useState<KnowledgeBaseRetrievalConfig | null>(null);
  
  // 新增布局模式状态
  const [layoutMode, setLayoutMode] = useState<'grid' | 'config'>('grid');
  const [configPanelKb, setConfigPanelKb] = useState<KnowledgeBase | null>(null);
  
  // 添加配置变更检测状态
  const [originalConfig, setOriginalConfig] = useState<KnowledgeBaseRetrievalConfig | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingKb, setPendingKb] = useState<KnowledgeBase | null>(null);
  
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

  // 检查配置是否有变更
  const checkConfigChanges = (current: KnowledgeBaseRetrievalConfig | null, original: KnowledgeBaseRetrievalConfig | null): boolean => {
    if (!current || !original) return false;
    return JSON.stringify(current) !== JSON.stringify(original);
  };

  // 进入配置模式
  const enterConfigMode = (kb: KnowledgeBase, event: React.MouseEvent) => {
    event.stopPropagation();
    
    // 检查是否有未保存的配置变更
    if (configPanelKb && retrievalConfig && originalConfig && checkConfigChanges(retrievalConfig, originalConfig)) {
      setPendingKb(kb);
      setShowConfirmDialog(true);
      return;
    }
    
    // 直接切换到新的知识库配置
    setConfigPanelKb(kb);
    const defaultConfig = getDefaultRetrievalConfig();
    const currentConfig = kb.retrievalConfig || defaultConfig;
    setRetrievalConfig(currentConfig);
    setLayoutMode('config');
    setOriginalConfig(currentConfig);
    setHasUnsavedChanges(false);
  };

  // 确认放弃变更并切换
  const confirmSwitchKb = () => {
    if (pendingKb) {
      setConfigPanelKb(pendingKb);
      const defaultConfig = getDefaultRetrievalConfig();
      const currentConfig = pendingKb.retrievalConfig || defaultConfig;
      setRetrievalConfig(currentConfig);
      setOriginalConfig(currentConfig);
      setHasUnsavedChanges(false);
      setPendingKb(null);
    }
    setShowConfirmDialog(false);
  };

  // 取消切换
  const cancelSwitchKb = () => {
    setPendingKb(null);
    setShowConfirmDialog(false);
  };

  // 退出配置模式
  const exitConfigMode = () => {
    setLayoutMode('grid');
    setConfigPanelKb(null);
    setRetrievalConfig(null);
    setOriginalConfig(null);
    setHasUnsavedChanges(false);
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
    const hasChanges = originalConfig ? checkConfigChanges(newConfig, originalConfig) : false;
    setHasUnsavedChanges(hasChanges);
  };

  // 保存配置并退出配置模式
  const saveConfig = () => {
    if (configPanelKb && retrievalConfig) {
      // 这里应该调用API保存配置
      console.log('保存知识库配置:', {
        knowledgeBaseId: configPanelKb.id,
        config: retrievalConfig
      });
      // TODO: 更新availableKnowledgeBases数组中的配置
    }
    exitConfigMode();
  };

  // 获取配置状态标签
  const getConfigStatusLabel = (kb: KnowledgeBase) => {
    return kb.retrievalConfig ? '自定义配置' : '默认设置';
  };

  // 获取配置状态颜色
  const getConfigStatusColor = (kb: KnowledgeBase) => {
    return kb.retrievalConfig 
      ? { bg: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }
      : { bg: 'rgba(100, 116, 139, 0.15)', color: '#64748b' };
  };

  // 渲染网格模式的卡片
  const renderGridCards = () => (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, 300px)', 
      gap: 2.5, 
      justifyContent: 'center',
      '& > *': {
        animation: 'fadeInScale 0.5s ease-out',
        animationFillMode: 'both'
      },
      '@keyframes fadeInScale': {
        '0%': {
          transform: 'scale(0.9) translateY(20px)',
          opacity: 0
        },
        '100%': {
          transform: 'scale(1) translateY(0)',
          opacity: 1
        }
      }
    }}>
      {filteredKnowledgeBases.map((kb, index) => {
        const statusColor = getStatusColor(kb.status || 'active');
        const categoryColor = 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.08))';
        
        return (
          <Box
            key={kb.id}
            onClick={() => toggleKnowledgeBaseSelection(kb)}
            sx={{
              cursor: 'pointer', 
              border: '1px solid',
              borderColor: isKnowledgeBaseSelected(kb.id) ? '#3b82f6' : alpha(theme.palette.divider, 0.15),
              borderRadius: '16px', 
              background: categoryColor,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              backdropFilter: 'blur(8px)',
              animationDelay: `${index * 0.1}s`,
              '&:hover': { 
                transform: 'translateY(-6px) scale(1.02)',
                boxShadow: '0 12px 30px rgba(59, 130, 246, 0.25)',
                borderColor: alpha('#3b82f6', 0.3)
              }
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                      <Chip size="small" label={`${kb.documentCount} 文档`} sx={{ height: '18px', fontSize: '0.65rem' }} />
                      <Chip size="small" label={kb.status || 'active'} sx={{ height: '18px', fontSize: '0.65rem', backgroundColor: statusColor.bg, color: statusColor.color }} />
                      <Chip 
                        size="small" 
                        label={getConfigStatusLabel(kb)} 
                        sx={{ 
                          height: '18px', 
                          fontSize: '0.65rem', 
                          backgroundColor: getConfigStatusColor(kb).bg, 
                          color: getConfigStatusColor(kb).color 
                        }} 
                      />
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box 
                    onClick={(e) => enterConfigMode(kb, e)} 
                    sx={{ 
                      p: 0.5, 
                      borderRadius: '6px', 
                      cursor: 'pointer', 
                      backgroundColor: alpha(theme.palette.text.secondary, 0.08), 
                      transition: 'all 0.2s ease',
                      '&:hover': { 
                        backgroundColor: alpha(theme.palette.text.secondary, 0.15),
                        transform: 'rotate(90deg) scale(1.1)'
                      },
                      '&:active': {
                        transform: 'rotate(90deg) scale(0.95)'
                      }
                    }}
                  >
                    <SettingOutlined style={{ fontSize: '14px' }} />
                  </Box>
                  <Switch 
                    size="small" 
                    checked={isKnowledgeBaseSelected(kb.id)} 
                    onChange={(e) => { e.stopPropagation(); toggleKnowledgeBaseSelection(kb); }}
                    sx={{
                      '& .MuiSwitch-track': {
                        transition: 'all 0.3s ease'
                      },
                      '& .MuiSwitch-thumb': {
                        transition: 'all 0.3s ease'
                      }
                    }}
                  />
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
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 1.5,
      '& > *': {
        animation: 'slideInLeft 0.4s ease-out',
        animationFillMode: 'both'
      },
      '@keyframes slideInLeft': {
        '0%': {
          transform: 'translateX(-30px)',
          opacity: 0
        },
        '100%': {
          transform: 'translateX(0)',
          opacity: 1
        }
      }
    }}>
      {filteredKnowledgeBases.map((kb, index) => {
        const statusColor = getStatusColor(kb.status || 'active');
        const isSelected = isKnowledgeBaseSelected(kb.id);
        const isConfiguring = configPanelKb?.id === kb.id;
        
        return (
          <Box
            key={kb.id}
            onClick={(e) => {
              // 在配置模式下，点击卡片切换到该知识库的配置
              if (layoutMode === 'config') {
                enterConfigMode(kb, e);
              } else {
                // 在网格模式下，点击卡片切换选择状态
                toggleKnowledgeBaseSelection(kb);
              }
            }}
            sx={{
              cursor: 'pointer',
              border: '1px solid',
              borderColor: isConfiguring ? '#3b82f6' : isSelected ? alpha('#3b82f6', 0.5) : alpha(theme.palette.divider, 0.15),
              borderRadius: '12px',
              background: isConfiguring 
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1))' 
                : isSelected 
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(59, 130, 246, 0.06))'
                  : 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(59, 130, 246, 0.04))',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              backdropFilter: 'blur(8px)',
              animationDelay: `${index * 0.08}s`,
              '&:hover': { 
                transform: isConfiguring ? 'none' : 'translateX(8px) scale(1.01)',
                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.2)',
                borderColor: isConfiguring ? '#3b82f6' : alpha('#3b82f6', 0.4)
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
                  <Chip 
                    size="small" 
                    label={getConfigStatusLabel(kb)} 
                    sx={{ 
                      height: '18px', 
                      fontSize: '0.65rem', 
                      backgroundColor: getConfigStatusColor(kb).bg, 
                      color: getConfigStatusColor(kb).color 
                    }} 
                  />
                  {isSelected && (
                    <Chip 
                      size="small" 
                      label="已选择" 
                      sx={{ 
                        height: '18px', 
                        fontSize: '0.65rem', 
                        backgroundColor: 'rgba(59, 130, 246, 0.15)', 
                        color: '#3b82f6',
                        fontWeight: 600
                      }} 
                    />
                  )}
                  <Typography variant="caption" sx={{ color: alpha(theme.palette.text.secondary, 0.6) }}>
                    {kb.size}MB · {kb.lastUpdated}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* 选择状态指示器，单独的点击事件 */}
                <Box 
                  onClick={(e) => {
                    e.stopPropagation(); // 阻止事件冒泡
                    toggleKnowledgeBaseSelection(kb);
                  }}
                  sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? '#3b82f6' : alpha(theme.palette.divider, 0.3)}`,
                    backgroundColor: isSelected ? '#3b82f6' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      borderColor: '#3b82f6'
                    }
                  }}
                >
                  {isSelected && (
                    <CheckCircleOutlined style={{ fontSize: '14px', color: 'white' }} />
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );

  // 渲染配置面板
  const renderConfigPanel = () => {
    if (!configPanelKb || !retrievalConfig) return null;

    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.9)})`,
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.4s ease-out',
          '@keyframes slideInRight': {
            '0%': {
              transform: 'translateX(100%)',
              opacity: 0
            },
            '100%': {
              transform: 'translateX(0)',
              opacity: 1
            }
          }
        }}
      >
        {/* 配置面板头部 */}
        <Box sx={{ 
          p: 2,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          animation: 'fadeInDown 0.5s ease-out 0.1s both',
          background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.03)}, ${alpha(theme.palette.info.main, 0.01)})`
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: `linear-gradient(135deg, ${theme.palette.info.main}, ${alpha(theme.palette.info.main, 0.8)})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 12px ${alpha(theme.palette.info.main, 0.25)}`
              }}
            >
              <SettingOutlined style={{ fontSize: '16px', color: 'white' }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 0.2 }}>
                检索参数配置
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 1,
                  py: 0.25,
                  borderRadius: '6px',
                  background: alpha(theme.palette.info.main, 0.08),
                  border: `1px solid ${alpha(theme.palette.info.main, 0.15)}`
                }}>
                  <DatabaseOutlined style={{ fontSize: '12px', color: theme.palette.info.main }} />
                  <Typography variant="caption" sx={{ 
                    color: theme.palette.info.main, 
                    fontWeight: 600,
                    fontSize: '0.7rem'
                  }}>
                    {configPanelKb.name}
                  </Typography>
                </Box>
                {hasUnsavedChanges && (
                  <Chip 
                    size="small" 
                    label="未保存" 
                    sx={{ 
                      height: '18px', 
                      fontSize: '0.6rem', 
                      backgroundColor: 'rgba(245, 158, 11, 0.15)', 
                      color: '#f59e0b',
                      fontWeight: 600,
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 1 },
                        '50%': { opacity: 0.7 }
                      }
                    }} 
                  />
                )}
              </Box>
            </Box>
            <Button 
              onClick={exitConfigMode}
              sx={{ 
                minWidth: 'auto',
                p: 0.75,
                borderRadius: '6px',
                color: alpha(theme.palette.text.secondary, 0.7),
                transition: 'all 0.2s ease',
                '&:hover': { 
                  backgroundColor: alpha(theme.palette.text.secondary, 0.08),
                  transform: 'rotate(90deg) scale(1.05)',
                  color: theme.palette.text.secondary
                },
                '&:active': {
                  transform: 'rotate(90deg) scale(0.95)'
                }
              }}
            >
              <Box sx={{ fontSize: '14px', fontWeight: 'bold' }}>✕</Box>
            </Button>
          </Box>
        </Box>

        {/* 配置面板内容 */}
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: 3,
          animation: 'fadeInUp 0.6s ease-out 0.2s both',
          '@keyframes fadeInUp': {
            '0%': {
              transform: 'translateY(20px)',
              opacity: 0
            },
            '100%': {
              transform: 'translateY(0)',
              opacity: 1
            }
          },
          '@keyframes fadeInDown': {
            '0%': {
              transform: 'translateY(-20px)',
              opacity: 0
            },
            '100%': {
              transform: 'translateY(0)',
              opacity: 1
            }
          }
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* 检索策略选择 */}
            <Alert severity="info" sx={{ mb: 1 }}>
              <Typography variant="body2">
                配置知识库的检索参数，这些设置将影响智能体的检索性能和准确性。
              </Typography>
            </Alert>

            <FormControl fullWidth size="small">
              <InputLabel>检索策略</InputLabel>
              <Select
                value={retrievalConfig.strategy}
                label="检索策略"
                onChange={(e) => updateConfig({
                  ...retrievalConfig,
                  strategy: e.target.value as 'vector' | 'keyword' | 'hybrid'
                })}
              >
                <MenuItem value="vector">向量检索</MenuItem>
                <MenuItem value="keyword">关键词检索</MenuItem>
                <MenuItem value="hybrid">混合检索 (推荐)</MenuItem>
              </Select>
            </FormControl>

            {/* 向量检索参数 */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<DownOutlined />}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  向量检索参数
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography gutterBottom variant="body2">
                      TopK: {retrievalConfig.vectorParams.topK}
                    </Typography>
                    <Slider
                      value={retrievalConfig.vectorParams.topK}
                      min={1}
                      max={20}
                      step={1}
                      size="small"
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
                  <Box>
                    <Typography gutterBottom variant="body2">
                      相似度阈值: {retrievalConfig.vectorParams.scoreThreshold}
                    </Typography>
                    <Slider
                      value={retrievalConfig.vectorParams.scoreThreshold}
                      min={0}
                      max={1}
                      step={0.05}
                      size="small"
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
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
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
                    label={<Typography variant="body2">包含文档元数据</Typography>}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* RRF参数 */}
            {retrievalConfig.strategy === 'hybrid' && (
              <Accordion>
                <AccordionSummary expandIcon={<DownOutlined />}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    RRF 混合检索参数
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
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
                      label={<Typography variant="body2">启用 RRF</Typography>}
                    />
                    
                    {retrievalConfig.rrfParams.enabled && (
                      <>
                        <Box>
                          <Typography gutterBottom variant="body2">
                            向量权重: {retrievalConfig.rrfParams.vectorWeight}
                          </Typography>
                          <Slider
                            value={retrievalConfig.rrfParams.vectorWeight}
                            min={0.1}
                            max={0.9}
                            step={0.1}
                            size="small"
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
                      </>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            )}

            {/* 索引配置 */}
            <Accordion>
              <AccordionSummary expandIcon={<DownOutlined />}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  索引配置
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControl fullWidth size="small">
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
                      <MenuItem value="HNSW">HNSW (推荐)</MenuItem>
                      <MenuItem value="IVF_PQ">IVF_PQ</MenuItem>
                      <MenuItem value="IVF_FLAT">IVF_FLAT</MenuItem>
                      <MenuItem value="FLAT">FLAT</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth size="small">
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
                      <MenuItem value="cosine">余弦相似度</MenuItem>
                      <MenuItem value="euclidean">欧几里得距离</MenuItem>
                      <MenuItem value="dot_product">点积</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* 配置预览 */}
            <Alert severity="success">
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                当前配置:
              </Typography>
              <Typography variant="body2">
                {retrievalConfig.strategy === 'hybrid' ? '混合检索' : 
                 retrievalConfig.strategy === 'vector' ? '向量检索' : '关键词检索'} · 
                TopK: {retrievalConfig.vectorParams.topK} · 
                阈值: {retrievalConfig.vectorParams.scoreThreshold} · 
                索引: {retrievalConfig.indexConfig.type}
              </Typography>
            </Alert>
          </Box>
        </Box>

        {/* 配置面板底部按钮 */}
        <Box sx={{ 
          p: 3, 
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          animation: 'fadeInUp 0.5s ease-out 0.3s both'
        }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              onClick={exitConfigMode}
              sx={{ 
                flex: 1,
                borderRadius: '8px',
                textTransform: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                },
                '&:active': {
                  transform: 'translateY(0)'
                }
              }}
            >
              取消
            </Button>
            <Button 
              variant="contained" 
              onClick={saveConfig}
              sx={{ 
                flex: 1,
                borderRadius: '8px',
                textTransform: 'none',
                background: `linear-gradient(135deg, ${theme.palette.info.main}, ${alpha(theme.palette.info.main, 0.8)})`,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: `0 6px 20px ${alpha(theme.palette.info.main, 0.4)}`,
                  background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`
                },
                '&:active': {
                  transform: 'translateY(0)'
                }
              }}
            >
              保存配置
            </Button>
          </Box>
        </Box>
      </Box>
    );
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
      {layoutMode === 'grid' && (
        <Box sx={{ px: 2, py: 1 }}>
          <TextField
            fullWidth placeholder="搜索知识库..." variant="outlined" size="small"
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlined /></InputAdornment> }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: alpha(theme.palette.background.paper, 0.6) } }}
          />
        </Box>
      )}
      
      {/* 主内容区域 */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* 左侧区域 - 知识库列表 */}
        <Box sx={{ 
          flex: layoutMode === 'config' ? '2' : '1',
          display: 'flex', 
          flexDirection: 'column',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden'
        }}>
          {/* 配置模式下的搜索框 */}
          {layoutMode === 'config' && (
            <Box sx={{ 
              px: 2, 
              py: 1, 
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              animation: 'slideInLeft 0.4s ease-out',
              '@keyframes slideInLeft': {
                '0%': {
                  transform: 'translateX(-20px)',
                  opacity: 0
                },
                '100%': {
                  transform: 'translateX(0)',
                  opacity: 1
                }
              }
            }}>
              <TextField
                fullWidth placeholder="搜索知识库..." variant="outlined" size="small"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlined /></InputAdornment> }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: alpha(theme.palette.background.paper, 0.6) } }}
              />
            </Box>
          )}
          
          {/* 知识库列表 */}
          <Box sx={{ 
            py: 2, 
            px: 2, 
            overflow: 'auto', 
            flex: 1,
            '& > *': {
              transition: 'all 0.3s ease-out'
            }
          }}>
            {layoutMode === 'grid' ? renderGridCards() : renderListCards()}
          </Box>
        </Box>
        
        {/* 右侧区域 - 配置面板 */}
        {layoutMode === 'config' && (
          <Box sx={{ 
            flex: '3',
            display: 'flex'
          }}>
            {renderConfigPanel()}
          </Box>
        )}
      </Box>
      
      {/* 确认对话框 */}
      <Dialog
        open={showConfirmDialog}
        onClose={cancelSwitchKb}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${alpha(theme.palette.warning.main, 0.8)})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ⚠️
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              放弃未保存的配置？
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            当前知识库 <strong>{configPanelKb?.name}</strong> 的配置尚未保存，切换到其他知识库将丢失这些更改。
          </Typography>
          <Typography variant="body2" sx={{ color: alpha(theme.palette.text.secondary, 0.8) }}>
            您可以选择保存当前配置，或者放弃更改并继续切换。
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={cancelSwitchKb}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none'
            }}
          >
            取消
          </Button>
          <Button 
            onClick={saveConfig}
            variant="outlined"
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none'
            }}
          >
            保存并切换
          </Button>
          <Button 
            onClick={confirmSwitchKb}
            variant="contained"
            color="warning"
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none'
            }}
          >
            放弃更改
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default KnowledgeBaseCard;
