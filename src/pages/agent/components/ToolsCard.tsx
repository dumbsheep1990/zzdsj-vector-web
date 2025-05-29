import React, { useState, useMemo } from 'react';
import { Tool, ToolCategory } from './types';
import { getToolCountByCategory, getToolsByCategory, toolCategoryLabels } from './advancedTools';
import { ModuleType } from './types/orchestration';
import { 
  Card, 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Switch, 
  alpha,
  useTheme,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  ThunderboltOutlined, 
  CheckCircleOutlined,
  StarOutlined,
  SearchOutlined,
  FileTextOutlined,
  BulbOutlined,
  ApiOutlined,
  ToolOutlined
} from '@ant-design/icons';

// Styled components
const ComplexityIndicator = styled(Box)<{ isAdvanced: boolean }>(
  ({ theme, isAdvanced }) => {
    return {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 8px',
      borderRadius: '6px',
      backgroundColor: isAdvanced 
        ? alpha(theme.palette.primary.main, 0.12) 
        : alpha(theme.palette.success.main, 0.12),
      border: `1px solid ${isAdvanced 
        ? alpha(theme.palette.primary.main, 0.25) 
        : alpha(theme.palette.success.main, 0.25)}`,
      fontSize: '0.7rem',
      fontWeight: 600,
      color: isAdvanced ? theme.palette.primary.main : theme.palette.success.main,
      backdropFilter: 'blur(4px)',
      letterSpacing: '0.02em',
      boxShadow: isAdvanced 
        ? `0 1px 3px ${alpha(theme.palette.primary.main, 0.1)}` 
        : `0 1px 3px ${alpha(theme.palette.success.main, 0.1)}`
    };
  }
);

interface ToolsCardProps {
  selectedTools: Tool[];
  toggleToolSelection: (tool: Tool) => void;
  renderToolChips?: () => React.ReactNode;
}

// 定义功能模块大类
interface ModuleCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  toolTypes: ToolCategory[];
  moduleType: ModuleType;
}

const ToolsCard: React.FC<ToolsCardProps> = ({ 
  selectedTools, 
  toggleToolSelection,
  renderToolChips 
}) => {
  const theme = useTheme();
  const [currentCategory, setCurrentCategory] = useState<ToolCategory | 'all'>('all');
  const [activeModuleType, setActiveModuleType] = useState<string>('all');
  
  // 模块大类定义
  const moduleCategories = useMemo<ModuleCategory[]>(() => [
    {
      id: 'perception',
      name: '感知模块',
      description: '负责收集和获取各类信息与数据',
      icon: <SearchOutlined />,
      color: theme.palette.info.main,
      toolTypes: [ToolCategory.SEARCH, ToolCategory.RETRIEVAL, ToolCategory.MULTIMODAL, ToolCategory.WEB],
      moduleType: ModuleType.INFORMATION_RETRIEVAL
    },
    {
      id: 'cognition',
      name: '认知模块',
      description: '负责分析、推理和解释数据',
      icon: <BulbOutlined />,
      color: theme.palette.success.main,
      toolTypes: [ToolCategory.REASONING, ToolCategory.KNOWLEDGE, ToolCategory.DOCUMENT],
      moduleType: ModuleType.DATA_ANALYSIS
    },
    {
      id: 'processing',
      name: '处理模块',
      description: '负责转换、格式化和处理内容',
      icon: <FileTextOutlined />,
      color: theme.palette.warning.main,
      toolTypes: [ToolCategory.DOCUMENT, ToolCategory.MULTIMEDIA],
      moduleType: ModuleType.CONTENT_PROCESSING
    },
    {
      id: 'action',
      name: '行动模块',
      description: '负责生成输出和执行具体操作',
      icon: <ApiOutlined />,
      color: theme.palette.error.main,
      toolTypes: [ToolCategory.INTEGRATION, ToolCategory.DEVELOPMENT],
      moduleType: ModuleType.OUTPUT_GENERATION
    }
  ], [theme]);
  
  // 筛选工具逻辑
  const filteredTools = useMemo(() => {
    if (activeModuleType === 'all') {
      // 如果模块选择的是"全部"，则使用分类筛选
      return getToolsByCategory(currentCategory);
    } else {
      // 否则根据选中的模块进行筛选
      const moduleCategory = moduleCategories.find(m => m.id === activeModuleType);
      if (!moduleCategory) return getToolsByCategory(currentCategory);
      
      // 获取该模块的工具
      let tools = getToolsByCategory('all').filter(tool => 
        moduleCategory.toolTypes.includes(tool.category)
      );
      
      // 再应用当前类别筛选
      if (currentCategory !== 'all') {
        tools = tools.filter(tool => tool.category === currentCategory);
      }
      
      return tools;
    }
  }, [currentCategory, activeModuleType, moduleCategories]);

  // 检查工具是否被选中
  const isToolSelected = (id: string) => {
    return selectedTools.some(tool => tool.id === id);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          智能工具
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          选择需要使用的智能工具，可以增强智能体的能力
        </Typography>
        {renderToolChips && renderToolChips()}
      </Box>
      
      {/* 模块大类选择器 */}
      <Box sx={{ px: 2, pt: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
            功能模块
          </Typography>
          <Box 
            sx={{ 
              ml: 1.5, 
              height: '1px', 
              flex: 1, 
              background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.divider, 0.05)})` 
            }} 
          />
        </Box>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 1, 
          mb: 2 
        }}>
          <Chip 
            icon={<ToolOutlined style={{ fontSize: '14px' }} />}
            label="全部模块"
            onClick={() => setActiveModuleType('all')}
            color={activeModuleType === 'all' ? 'primary' : 'default'}
            variant={activeModuleType === 'all' ? 'filled' : 'outlined'}
            sx={{
              fontWeight: 500,
              px: 0.5,
              '&.MuiChip-filled': {
                boxShadow: `0 2px 5px ${alpha(theme.palette.primary.main, 0.15)}`
              }
            }}
          />
          {moduleCategories.map(module => (
            <Chip
              key={module.id}
              icon={React.cloneElement(module.icon as React.ReactElement, { style: { fontSize: '14px' } })}
              label={module.name}
              onClick={() => setActiveModuleType(module.id)}
              color={activeModuleType === module.id ? 'primary' : 'default'}
              variant={activeModuleType === module.id ? 'filled' : 'outlined'}
              sx={{
                fontWeight: 500,
                px: 0.5,
                borderColor: alpha(module.color, 0.5),
                '&.MuiChip-outlined': {
                  color: module.color,
                  backgroundColor: alpha(module.color, 0.05)
                },
                '&.MuiChip-filled': {
                  backgroundColor: module.color,
                  boxShadow: `0 2px 5px ${alpha(module.color, 0.2)}`
                }
              }}
            />
          ))}
        </Box>
        
        {/* 当前选中模块的描述 */}
        {activeModuleType !== 'all' && (
          <Box sx={{ 
            p: 1.5, 
            mb: 2, 
            borderRadius: '10px',
            backgroundColor: alpha(
              moduleCategories.find(m => m.id === activeModuleType)?.color || theme.palette.primary.main, 
              0.05
            ),
            border: '1px solid',
            borderColor: alpha(
              moduleCategories.find(m => m.id === activeModuleType)?.color || theme.palette.primary.main, 
              0.2
            ),
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.5
          }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 26,
                height: 26,
                borderRadius: '50%',
                backgroundColor: alpha(
                  moduleCategories.find(m => m.id === activeModuleType)?.color || theme.palette.primary.main, 
                  0.15
                ),
                color: moduleCategories.find(m => m.id === activeModuleType)?.color || theme.palette.primary.main,
                mt: 0.5,
                flexShrink: 0
              }}
            >
              {React.cloneElement(
                moduleCategories.find(m => m.id === activeModuleType)?.icon as React.ReactElement, 
                { style: { fontSize: '14px' } }
              )}
            </Box>
            <Box>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  mb: 0.5, 
                  fontWeight: 600,
                  color: moduleCategories.find(m => m.id === activeModuleType)?.color || theme.palette.primary.main
                }}
              >
                {moduleCategories.find(m => m.id === activeModuleType)?.name} 功能
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                {moduleCategories.find(m => m.id === activeModuleType)?.description}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
      
      <Box sx={{ px: 2, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
            工具类别
          </Typography>
          <Box 
            sx={{ 
              ml: 1.5, 
              height: '1px', 
              flex: 1, 
              background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.divider, 0.05)})` 
            }} 
          />
        </Box>
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
              py: 0.5,
              px: 1.5,
              borderRadius: '18px',
              fontSize: '0.75rem',
              fontWeight: 500,
              textTransform: 'none',
              color: theme.palette.text.secondary,
              bgcolor: alpha(theme.palette.background.default, 0.7),
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                fontWeight: 600,
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }
            }
          }}
        >
          <Tab 
            label={`全部 (${getToolCountByCategory('all')})`} 
            value="all" 
          />
          {Object.entries(ToolCategory).map(([key, value]) => (
            <Tab
              key={key}
              label={`${toolCategoryLabels[value] || key} (${getToolCountByCategory(value)})`}
              value={value}
            />
          ))}
        </Tabs>
      </Box>

      {/* 统计信息 - 已选工具数量 */}
      <Box sx={{ 
        px: 2, 
        py: 1.5, 
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: alpha(theme.palette.background.default, 0.5)
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            borderRadius: '6px', 
            px: 1, 
            py: 0.5, 
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
          }}>
            <Typography variant="caption" sx={{ fontWeight: 500, color: theme.palette.primary.main }}>
              筛选结果: {filteredTools.length} 工具
            </Typography>
          </Box>
          <Chip 
            size="small" 
            label={`已选: ${selectedTools.length}`}
            color={selectedTools.length > 0 ? "primary" : "default"}
            variant={selectedTools.length > 0 ? "filled" : "outlined"}
            sx={{
              fontWeight: 600,
              fontSize: '0.75rem',
              height: '24px',
              backgroundColor: selectedTools.length > 0 
                ? alpha(theme.palette.primary.main, 0.9)
                : 'transparent',
              color: selectedTools.length > 0 
                ? '#fff'
                : theme.palette.text.secondary,
              border: `1px solid ${selectedTools.length > 0 
                ? 'transparent'
                : alpha(theme.palette.text.secondary, 0.2)}`,
              boxShadow: selectedTools.length > 0 
                ? `0 2px 4px ${alpha(theme.palette.primary.main, 0.2)}` 
                : 'none'
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            高级工具
          </Typography>
          <Switch 
            size="small" 
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: alpha(theme.palette.primary.main, 0.5),
              },
            }}
          />
        </Box>
      </Box>

      {/* 工具列表 - 使用Grid布局 */}
      <Box sx={{ 
        flex: 1, 
        p: 2, 
        pt: 2,
        overflowY: 'auto',
        bgcolor: alpha(theme.palette.background.default, 0.5),
        backgroundImage: activeModuleType !== 'all' ? 
          `radial-gradient(circle at 50% 0%, ${alpha(
            moduleCategories.find(m => m.id === activeModuleType)?.color || theme.palette.primary.main,
            0.03
          )}, transparent 25%)` : 'none'
      }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 2
        }}>
          {filteredTools.map((tool) => (
            <Card
              key={tool.id}
              sx={{
                p: 1.75,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                position: 'relative',
                borderRadius: '12px',
                transition: 'all 0.2s',
                bgcolor: isToolSelected(tool.id) 
                  ? alpha(theme.palette.primary.main, 0.07)
                  : alpha(theme.palette.background.paper, 0.95),
                border: '1px solid',
                borderColor: isToolSelected(tool.id)
                  ? alpha(theme.palette.primary.main, 0.35)
                  : alpha(theme.palette.divider, 0.12),
                backdropFilter: 'blur(8px)',
                boxShadow: isToolSelected(tool.id)
                  ? `0 4px 10px ${alpha(theme.palette.primary.main, 0.12)}`
                  : '0 2px 6px rgba(0,0,0,0.02)',
                '&:hover': {
                  boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.15)}`,
                  borderColor: alpha(theme.palette.primary.main, 0.4),
                  transform: 'translateY(-3px)',
                  bgcolor: isToolSelected(tool.id) 
                    ? alpha(theme.palette.primary.main, 0.08)
                    : alpha(theme.palette.background.paper, 1)
                }
              }}
              onClick={() => toggleToolSelection(tool)}
            >
              {/* 选中状态指示器 */}
              {isToolSelected(tool.id) && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    bgcolor: theme.palette.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: `0 2px 6px ${alpha(theme.palette.primary.main, 0.3)}`,
                    border: '1.5px solid white',
                    zIndex: 2
                  }}
                >
                  <CheckCircleOutlined style={{ fontSize: '12px' }} />
                </Box>
              )}
              
              {/* 工具图标 */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Box
                  sx={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.primary.main, 0.05)})`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1.5,
                    boxShadow: `0 2px 6px ${alpha(theme.palette.primary.main, 0.05)}`,
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  {moduleCategories.some(m => m.toolTypes.includes(tool.category)) ? (
                    <Box sx={{ 
                      fontSize: '18px', 
                      color: moduleCategories.find(m => m.toolTypes.includes(tool.category))?.color || theme.palette.primary.main 
                    }}>
                      {React.cloneElement(
                        moduleCategories.find(m => m.toolTypes.includes(tool.category))?.icon as React.ReactElement, 
                        { style: { fontSize: '18px' } }
                      )}
                    </Box>
                  ) : (
                    tool.icon || (
                      tool.category === ToolCategory.REASONING ? (
                        <BulbOutlined style={{ fontSize: '18px', color: theme.palette.primary.main }} />
                      ) : tool.category === ToolCategory.SEARCH ? (
                        <SearchOutlined style={{ fontSize: '18px', color: theme.palette.primary.main }} />
                      ) : (
                        <StarOutlined style={{ fontSize: '18px', color: theme.palette.primary.main }} />
                      )
                    )
                  )}
                </Box>
                <Box>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 600, 
                      lineHeight: 1.2,
                      color: isToolSelected(tool.id) ? theme.palette.primary.main : theme.palette.text.primary
                    }}
                  >
                    {tool.name}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.secondary',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      mt: 0.3
                    }}
                  >
                    <Box 
                      component="span" 
                      sx={{ 
                        width: 6, 
                        height: 6, 
                        borderRadius: '50%', 
                        bgcolor: moduleCategories.find(m => m.toolTypes.includes(tool.category))?.color || theme.palette.primary.main,
                        display: 'inline-block'
                      }} 
                    />
                    {toolCategoryLabels[tool.category] || tool.category}
                  </Typography>
                </Box>
              </Box>
              
              {/* 工具描述 */}
              <Box sx={{
                mb: 1.5,
                p: 1.2,
                borderRadius: '8px',
                bgcolor: alpha(theme.palette.background.default, isToolSelected(tool.id) ? 0.3 : 0.5),
                border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                boxShadow: isToolSelected(tool.id) ? `inset 0 1px 4px ${alpha(theme.palette.primary.main, 0.08)}` : 'none',
              }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: alpha(theme.palette.text.primary, 0.85),
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: 1.4,
                    fontWeight: isToolSelected(tool.id) ? 500 : 400
                  }}
                >
                  {tool.description}
                </Typography>
              </Box>
              
              {/* 工具标签 */}
              <Box sx={{ mt: 'auto', display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                {/* 模块标签 */}
                {moduleCategories.some(m => m.toolTypes.includes(tool.category)) && (
                  <Box sx={{ 
                    display: 'inline-flex',
                    alignItems: 'center', 
                    borderRadius: '4px',
                    py: 0.3,
                    px: 0.6,
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    color: moduleCategories.find(m => m.toolTypes.includes(tool.category))?.color || theme.palette.primary.main,
                    bgcolor: alpha(moduleCategories.find(m => m.toolTypes.includes(tool.category))?.color || theme.palette.primary.main, 0.08),
                    border: `1px solid ${alpha(moduleCategories.find(m => m.toolTypes.includes(tool.category))?.color || theme.palette.primary.main, 0.2)}`,
                  }}>
                    {React.cloneElement(
                      moduleCategories.find(m => m.toolTypes.includes(tool.category))?.icon as React.ReactElement, 
                      { style: { fontSize: '10px', marginRight: '4px' } }
                    )}
                    {moduleCategories.find(m => m.toolTypes.includes(tool.category))?.name.replace('模块', '')}
                  </Box>
                )}

                {tool.isAdvanced && (
                  <ComplexityIndicator isAdvanced={true}>
                    <ThunderboltOutlined style={{ fontSize: '10px', marginRight: '3px' }} />
                    高级
                  </ComplexityIndicator>
                )}
                {tool.isPremium && (
                  <ComplexityIndicator isAdvanced={false}>
                    <StarOutlined style={{ fontSize: '10px', marginRight: '3px' }} />
                    高级功能
                  </ComplexityIndicator>
                )}
              </Box>
            </Card>
          ))}
        </Box>
      </Box>
    </Card>
  );
};

export default ToolsCard;
