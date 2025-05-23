import React, { useState } from 'react';
import { Tool, ToolCategory } from './types';
import { getToolCountByCategory, getToolsByCategory, toolCategoryLabels } from './advancedTools';
import { 
  Card, 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Switch, 
  Paper,
  Tooltip,
  alpha,
  useTheme,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  CrownOutlined, 
  ThunderboltOutlined, 
  CheckCircleOutlined,
  StarOutlined,
  RocketOutlined
} from '@ant-design/icons';

// Styled components
const ComplexityIndicator = styled(Box)<{ isAdvanced: boolean }>(
  ({ theme, isAdvanced }) => {
    return {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 8px',
      borderRadius: '8px',
      backgroundColor: isAdvanced 
        ? alpha(theme.palette.primary.main, 0.15) 
        : alpha(theme.palette.success.main, 0.15),
      border: `1px solid ${isAdvanced 
        ? alpha(theme.palette.primary.main, 0.3) 
        : alpha(theme.palette.success.main, 0.3)}`,
      fontSize: '0.7rem',
      fontWeight: 600,
      color: isAdvanced ? theme.palette.primary.main : theme.palette.success.main
    };
  }
);

const ToolCardContainer = styled(Paper)<{ isSelected: boolean; isAdvanced?: boolean }>(
  ({ theme, isSelected, isAdvanced }) => ({
    cursor: 'pointer',
    border: '1px solid',
    borderColor: isSelected ? theme.palette.primary.main : alpha(theme.palette.divider, 0.3),
    borderRadius: '16px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    // 根据是否为高级工具设置不同的背景
    background: isAdvanced
      ? `linear-gradient(135deg, 
          ${alpha(theme.palette.primary.main, 0.03)}, 
          ${alpha(theme.palette.secondary.main, 0.02)}, 
          ${alpha(theme.palette.info.main, 0.02)})`
      : `linear-gradient(135deg, 
          ${alpha(theme.palette.success.main, 0.03)}, 
          ${alpha(theme.palette.background.paper, 0.95)})`,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: isSelected 
      ? `0 8px 32px ${alpha(theme.palette.primary.main, 0.15)}` 
      : isAdvanced
        ? `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`
        : '0 2px 12px rgba(0,0,0,0.06)',
    '&:hover': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
      transform: 'translateY(-4px)',
      background: isAdvanced
        ? `linear-gradient(135deg, 
            ${alpha(theme.palette.primary.main, 0.06)}, 
            ${alpha(theme.palette.secondary.main, 0.04)}, 
            ${alpha(theme.palette.info.main, 0.04)})`
        : `linear-gradient(135deg, 
            ${alpha(theme.palette.success.main, 0.06)}, 
            ${alpha(theme.palette.background.paper, 0.98)})`
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

  // 判断工具是否为高级工具（将medium归类为advanced）
  const isAdvancedTool = (tool: Tool) => {
    return tool.isAdvanced || tool.complexity === 'high' || tool.complexity === 'medium';
  };

  // 复杂度标签映射（简化为两种）
  const getComplexityLabel = (tool: Tool) => {
    return isAdvancedTool(tool) ? '高级工具' : '基础工具';
  };

  // 复杂度图标映射（使用更合适的图标）
  const getComplexityIcon = (tool: Tool) => {
    return isAdvancedTool(tool) 
      ? <RocketOutlined style={{ fontSize: '10px', marginRight: '4px' }} />
      : <StarOutlined style={{ fontSize: '10px', marginRight: '4px' }} />;
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
        bgcolor: alpha(theme.palette.background.paper, 0.8),
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
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.primary.main, 0.04)})`,
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
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.8)})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
              }}
            >
              <ThunderboltOutlined style={{ fontSize: '16px', color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                fontSize: '1rem',
                color: theme.palette.text.primary,
                mb: 0.2
              }}>
                智能工具库
              </Typography>
              <Typography variant="body2" sx={{ 
                color: alpha(theme.palette.text.secondary, 0.8),
                fontSize: '0.75rem'
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
                height: '24px'
              }}
            />
          </Box>
        </Box>
      </Box>
      
      {/* 类别标签页 - 固定在顶部，位于头部下方 */}
      <Box sx={{ 
        px: 2, 
        pt: 1, 
        pb: 1, 
        bgcolor: 'transparent',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
        position: 'sticky',
        top: '66px', // 顶部区域的高度，确保其下方固定
        zIndex: 9
      }}>
        <Tabs
          value={currentCategory}
          onChange={(_, newValue) => setCurrentCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{ style: { display: 'none' } }} // 隐藏底部指示器，使用胶囊样式代替
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
              gap: '6px' // 标签之间的间距加大，突出胶囊效果
            },
            '& .MuiTab-root': {
              minHeight: '28px',
              fontSize: '0.7rem',
              textTransform: 'none',
              fontWeight: 400,
              color: alpha(theme.palette.text.secondary, 0.8),
              transition: 'all 0.2s ease',
              borderRadius: '14px', // 胶囊形状
              mx: 0.2,
              px: 1.2,
              py: 0.2,
              minWidth: 0,
              border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                fontWeight: 600,
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                boxShadow: `0 1px 2px ${alpha(theme.palette.primary.main, 0.1)}`
              },
              '&:hover': {
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                color: theme.palette.primary.main
              }
            }
          }}
        >
          {Object.entries(toolCategoryLabels).map(([key, label]) => {
            const count = getToolCountByCategory(key as ToolCategory | 'all');
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
      
      {/* 工具网格区域 - 可滚动内容区 */}
      <Box sx={{ 
        py: 2,
        px: 2,
        overflow: 'auto', // 只允许内容区域滚动
        flex: 1 // 占据剩余空间
      }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: 2.5,
          alignContent: 'start',
          minHeight: filteredTools.length > 0 ? 'auto' : '300px'
        }}>
          {filteredTools.length > 0 ? filteredTools.map((tool) => (
            <ToolCardContainer
              key={tool.id}
              isSelected={isToolSelected(tool.id)}
              isAdvanced={isAdvancedTool(tool)}
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
                        backgroundColor: isAdvancedTool(tool) 
                          ? alpha(theme.palette.primary.main, 0.15)
                          : alpha(theme.palette.success.main, 0.15),
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
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" sx={{ 
                          color: alpha(theme.palette.text.secondary, 0.7),
                          fontSize: '0.7rem'
                        }}>
                          {tool.provider} • v{tool.version}
                        </Typography>
                        <ComplexityIndicator isAdvanced={isAdvancedTool(tool)}>
                          {getComplexityIcon(tool)}
                          {getComplexityLabel(tool)}
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
                  {tool.tags?.slice(0, 3).map((tag) => (
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
