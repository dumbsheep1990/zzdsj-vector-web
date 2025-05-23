import React, { useState } from 'react';
import { Tool, ToolCategory } from './types';
import { advancedTools, getToolCountByCategory, getToolsByCategory, toolCategoryLabels } from './advancedTools';
import { 
  Card, 
  Badge, 
  Chip, 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Switch, 
  Divider, 
  Paper,
  Tooltip,
  alpha,
  useTheme,
  LinearProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  CrownOutlined, 
  ThunderboltOutlined, 
  CheckCircleOutlined,
  WarningOutlined 
} from '@ant-design/icons';

// Styled components
const CategoryBadge = styled(Badge)(() => ({
  '& .MuiBadge-badge': {
    right: -6,
    top: 6,
    padding: '0 4px',
    backgroundColor: '#3b82f6',
    color: 'white',
    fontSize: '0.65rem',
    minWidth: '16px',
    height: '16px',
  },
}));

const ComplexityIndicator = styled(Box)<{ complexity: 'low' | 'medium' | 'high' }>(
  ({ theme, complexity }) => {
    const colors = {
      low: theme.palette.success.main,
      medium: theme.palette.warning.main,
      high: theme.palette.error.main
    };
    
    return {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 6px',
      borderRadius: '6px',
      backgroundColor: alpha(colors[complexity], 0.1),
      border: `1px solid ${alpha(colors[complexity], 0.3)}`,
      fontSize: '0.7rem',
      fontWeight: 600,
      color: colors[complexity]
    };
  }
);

const ToolCardContainer = styled(Paper)<{ isSelected: boolean; isPremium?: boolean }>(
  ({ theme, isSelected, isPremium }) => ({
    cursor: 'pointer',
    border: '1px solid',
    borderColor: isSelected ? theme.palette.primary.main : alpha(theme.palette.divider, 0.5),
    borderRadius: '12px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.04) : 'white',
    boxShadow: isSelected 
      ? `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}` 
      : '0 2px 8px rgba(0,0,0,0.04)',
    position: 'relative',
    overflow: 'hidden',
    ...(isPremium && {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #FFD700, #FFA500)',
        zIndex: 1
      }
    }),
    '&:hover': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
      transform: 'translateY(-2px)',
      backgroundColor: alpha(theme.palette.primary.main, 0.02)
    }
  })
);

interface ToolsCardProps {
  selectedTools: Tool[];
  toggleToolSelection: (tool: Tool) => void;
  renderToolChips?: () => React.ReactNode;
}

const ToolsCard: React.FC<ToolsCardProps> = ({ 
  selectedTools, 
  toggleToolSelection,
  renderToolChips 
}) => {
  const theme = useTheme();
  const [currentCategory, setCurrentCategory] = useState<ToolCategory | 'all'>('all');
  
  // 根据当前类别筛选工具
  const filteredTools = getToolsByCategory(currentCategory);

  // 检查工具是否被选中
  const isToolSelected = (id: string) => {
    return selectedTools.some(tool => tool.id === id);
  };

  // 复杂度标签映射
  const complexityLabels = {
    low: '简单',
    medium: '中等', 
    high: '高级'
  };

  // 复杂度图标映射
  const complexityIcons = {
    low: <CheckCircleOutlined style={{ fontSize: '10px', marginRight: '2px' }} />,
    medium: <WarningOutlined style={{ fontSize: '10px', marginRight: '2px' }} />,
    high: <ThunderboltOutlined style={{ fontSize: '10px', marginRight: '2px' }} />
  };
  
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: 'none',
        border: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.1),
        borderRadius: '16px',
        bgcolor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(20px)'
      }}
    >
      {/* 头部区域 */}
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.primary.main, 0.04)})`,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.6)})`,
            borderRadius: '16px 16px 0 0'
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.8)})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
              }}
            >
              <ThunderboltOutlined style={{ fontSize: '18px', color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                fontSize: '1.1rem',
                color: theme.palette.text.primary,
                mb: 0.5
              }}>
                智能工具库
              </Typography>
              <Typography variant="body2" sx={{ 
                color: alpha(theme.palette.text.secondary, 0.8),
                fontSize: '0.8rem'
              }}>
                高级AI驱动的智能工具集合
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              size="small"
              icon={selectedTools.length > 0 ? <CheckCircleOutlined /> : undefined}
              label={selectedTools.length > 0 ? `已选择 ${selectedTools.length}` : '0 个工具'}
              sx={{
                bgcolor: selectedTools.length > 0 
                  ? alpha(theme.palette.success.main, 0.15) 
                  : alpha(theme.palette.text.secondary, 0.08),
                color: selectedTools.length > 0 
                  ? theme.palette.success.main 
                  : theme.palette.text.secondary,
                border: `1px solid ${selectedTools.length > 0 
                  ? alpha(theme.palette.success.main, 0.3)
                  : alpha(theme.palette.text.secondary, 0.2)}`,
                fontWeight: 600,
                fontSize: '0.75rem',
                height: '28px'
              }}
            />
          </Box>
        </Box>
      </Box>
      
      {/* 类别标签页 */}
      <Box sx={{ 
        px: 2, 
        pt: 2, 
        pb: 1, 
        bgcolor: alpha(theme.palette.background.paper, 0.6),
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`
      }}>
        <Tabs
          value={currentCategory}
          onChange={(_, newValue) => setCurrentCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            minHeight: '44px',
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.primary.main,
              height: '3px',
              borderRadius: '3px'
            },
            '& .MuiTabs-scrollButtons': {
              color: alpha(theme.palette.text.secondary, 0.6),
              '&.Mui-disabled': {
                opacity: 0.3
              }
            },
            '& .MuiTab-root': {
              minHeight: '44px',
              fontSize: '0.875rem',
              textTransform: 'none',
              fontWeight: 500,
              color: alpha(theme.palette.text.secondary, 0.8),
              transition: 'all 0.2s ease',
              borderRadius: '8px',
              mr: 0.5,
              px: 2,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                fontWeight: 700,
                backgroundColor: alpha(theme.palette.primary.main, 0.08)
              },
              '&:hover': {
                backgroundColor: alpha(theme.palette.text.secondary, 0.04),
                color: theme.palette.text.primary
              }
            }
          }}
        >
          {Object.entries(toolCategoryLabels).map(([key, label]) => (
            <Tab 
              key={key}
              label={
                <CategoryBadge badgeContent={getToolCountByCategory(key as ToolCategory | 'all')}>
                  <Box sx={{ pr: 2 }}>{label}</Box>
                </CategoryBadge>
              } 
              value={key} 
            />
          ))}
        </Tabs>
      </Box>
      
      {/* 工具网格区域 */}
      <Box sx={{ 
        py: 2,
        px: 2, 
        flexGrow: 1, 
        overflow: 'auto',
        bgcolor: alpha(theme.palette.background.default, 0.3)
      }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: 2.5,
          minHeight: filteredTools.length > 0 ? 'auto' : '200px',
          alignContent: 'start'
        }}>
          {filteredTools.length > 0 ? filteredTools.map((tool) => (
            <ToolCardContainer
              key={tool.id}
              isSelected={isToolSelected(tool.id)}
              isPremium={tool.isPremium}
              onClick={() => toggleToolSelection(tool)}
            >
              <Box sx={{ p: 2.5 }}>
                {/* 工具头部信息 */}
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
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {tool.icon}
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
                          {tool.name}
                        </Typography>
                        {tool.isPremium && (
                          <Tooltip title="高级付费功能">
                            <CrownOutlined 
                              style={{ 
                                fontSize: '12px', 
                                color: '#FFD700',
                                filter: 'drop-shadow(0 1px 2px rgba(255,215,0,0.3))'
                              }} 
                            />
                          </Tooltip>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" sx={{ 
                          color: alpha(theme.palette.text.secondary, 0.7),
                          fontSize: '0.7rem'
                        }}>
                          {tool.provider} • v{tool.version}
                        </Typography>
                        <ComplexityIndicator complexity={tool.complexity || 'medium'}>
                          {complexityIcons[tool.complexity || 'medium']}
                          {complexityLabels[tool.complexity || 'medium']}
                        </ComplexityIndicator>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Switch 
                    size="small" 
                    checked={isToolSelected(tool.id)} 
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleToolSelection(tool);
                    }}
                    sx={{
                      flexShrink: 0,
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: theme.palette.primary.main,
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: theme.palette.primary.main,
                      },
                    }}
                  />
                </Box>
                
                {/* 工具描述 */}
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
                  {tool.description}
                </Typography>
                
                {/* 标签区域 */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                  {tool.tags?.slice(0, 3).map((tag, index) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{ 
                        fontSize: '0.7rem',
                        height: '22px',
                        color: alpha(theme.palette.text.secondary, 0.8),
                        backgroundColor: alpha(theme.palette.text.secondary, 0.06),
                        border: `1px solid ${alpha(theme.palette.text.secondary, 0.1)}`,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.text.secondary, 0.1)
                        }
                      }}
                    />
                  ))}
                  {tool.tags && tool.tags.length > 3 && (
                    <Chip
                      label={`+${tool.tags.length - 3}`}
                      size="small"
                      sx={{ 
                        fontSize: '0.7rem',
                        height: '22px',
                        color: alpha(theme.palette.text.secondary, 0.6),
                        backgroundColor: alpha(theme.palette.text.secondary, 0.04),
                        border: `1px dashed ${alpha(theme.palette.text.secondary, 0.2)}`
                      }}
                    />
                  )}
                </Box>
              </Box>
            </ToolCardContainer>
          )) : (
            <Box sx={{ 
              gridColumn: '1 / -1',
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              py: 6,
              color: alpha(theme.palette.text.secondary, 0.6)
            }}>
              <ThunderboltOutlined style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }} />
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                该类别暂无工具
              </Typography>
              <Typography variant="body2">
                请选择其他类别或等待更多工具上线
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      
      {/* 选中工具的芯片展示区域 */}
      {renderToolChips && (
        <Box sx={{ 
          p: 2, 
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          bgcolor: alpha(theme.palette.background.paper, 0.8)
        }}>
          {renderToolChips()}
        </Box>
      )}
    </Card>
  );
};

export default ToolsCard;
