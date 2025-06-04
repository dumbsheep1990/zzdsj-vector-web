import React, { useRef, useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  alpha,
  useTheme,
  Avatar,
  Button,
  Chip,
  Tooltip
} from '@mui/material';
import { 
  RobotOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  ToolOutlined,
  DatabaseOutlined,
  BranchesOutlined,
  NodeIndexOutlined,
  SearchOutlined,
  BulbOutlined,
  CodeSandboxOutlined,
  ApiOutlined,
  AppstoreOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { Tool, KnowledgeBase } from './types';
import { OrchestrationItem as BuilderOrchestrationItem } from '../AgentBuilder';

// 嵌套式编排数据接口
interface NestedOrchestrationData {
  type: 'nested'; // 定义为固定字符串类型
  modules: Array<{
    type: string;
    name: string;
    tools: Array<{
      id?: string;
      name: string;
      description?: string;
      category?: string; // 添加category字段以支持工具分类
    }>;
    knowledgeBases: Array<{
      id?: string;
      name: string;
      description?: string;
    }>;
    config?: {
      executionStrategy?: string;
      conditionalExecution?: {
        baseToolId?: string;
        baseToolName?: string;
        trueBranchTools?: Array<{id?: string; name: string}>;
        falseBranchTools?: Array<{id?: string; name: string}>;
      };
      useModelOutput?: boolean; // 添加输出生成模块的配置项
      useFormatting?: boolean;
      formatOptions?: string[];
    };
    moduleType?: string; // 添加模块类型字段
    order?: number; // 添加排序字段
  }>;
}

// 类型保护函数，用于检查是否为嵌套编排数据
function isNestedOrchestrationData(item: any): item is NestedOrchestrationData {
  return item && item.type === 'nested' && Array.isArray(item.modules);
}

// 将嵌套模块转换为流程编排项
function convertModuleToFlowItem(module: any): FlowOrchestrationItem {
  return {
    moduleType: module.moduleType || module.type,
    moduleName: module.name,
    tools: (module.tools || []).map((tool: any) => ({
      id: tool.id || `tool-${Math.random().toString(36).substr(2, 9)}`,
      name: tool.name,
      description: tool.description || '',
      category: tool.category || 'default'
    })),
    knowledgeBases: (module.knowledgeBases || []).map((kb: any) => ({
      id: kb.id || `kb-${Math.random().toString(36).substr(2, 9)}`,
      name: kb.name,
      description: kb.description || ''
    })),
    executionStrategy: module.config?.executionStrategy || '串行执行',
    order: module.order || 1,
    enabled: true,
    config: module.config
  };
}
import { FlowOrchestrationItem, adaptOrchestrationItems } from './adapters/orchestrationAdapter';

// 组件属性
interface FlowPreviewStepProps {
  selectedTools: Tool[];
  selectedKnowledgeBases: KnowledgeBase[];
  orchestrationItems: BuilderOrchestrationItem[];
  onBack?: () => void;
  onComplete?: () => void;
}

// 模块执行策略类型
type ExecutionStrategyType = '串行执行' | '并行执行' | '条件执行' | '循环执行';

// 模块可视化颜色映射 - 使用更加协调的色调
const moduleColors: Record<string, string> = {
  information_retrieval: '#2F80ED', // 深蓝色 - 信息获取
  content_processing: '#27AE60',    // 绿色 - 内容处理
  data_analysis_reasoning: '#9B51E0', // 紫色 - 数据分析与推理
  output_generation: '#F2994A',     // 橙色 - 输出生成
  workflow_control: '#EB5757'       // 红色 - 流程控制
};

// 模块类型图标映射 - 更有辨识度的图标
const moduleIcons: Record<string, React.ReactNode> = {
  information_retrieval: <SearchOutlined />,  // 信息获取
  content_processing: <FileTextOutlined />,   // 内容处理
  data_analysis_reasoning: <BulbOutlined />,  // 数据分析与推理
  output_generation: <CodeSandboxOutlined />, // 输出生成
  workflow_control: <BranchesOutlined />      // 流程控制
};

// 执行策略标签颜色映射
const strategyColors: Record<string, string> = {
  '串行执行': '#2F80ED', // 蓝色
  '并行执行': '#9B51E0', // 紫色
  '条件执行': '#F2994A', // 橙色
  '循环执行': '#27AE60'  // 绿色
};

// 工具类型图标映射 - 更丰富的图标集
const toolTypeIcons: Record<string, React.ReactNode> = {
  search: <SearchOutlined />,
  retrieval: <DatabaseOutlined />,
  reasoning: <BulbOutlined />,
  integration: <ApiOutlined />,
  knowledge: <NodeIndexOutlined />,
  development: <AppstoreOutlined />,
  format: <CodeSandboxOutlined />,
  default: <ToolOutlined />
};

const FlowPreviewStep: React.FC<FlowPreviewStepProps> = ({
  selectedTools,
  selectedKnowledgeBases,
  orchestrationItems,
  onBack,
  onComplete
}) => {
  const theme = useTheme();
  
  // 调试信息
  console.log('FlowPreviewStep 收到的数据:', {
    selectedTools,
    selectedKnowledgeBases,
    orchestrationItems
  });
  
  // 引用容器元素
  const flowContainerRef = useRef<HTMLDivElement>(null);
  
  // 使用适配器转换编排项
  const [flowItems, setFlowItems] = useState<FlowOrchestrationItem[]>([]);
  
  // 分析数据流并设置流程项
  const analyzeDataFlow = () => {
    if (!orchestrationItems || orchestrationItems.length === 0) {
      // 空数据时设置空流程项
      setFlowItems([]);
      return;
    }

    // 处理嵌套编排数据
    if (orchestrationItems.length === 1 && isNestedOrchestrationData(orchestrationItems[0])) {
      const nestedData = orchestrationItems[0] as NestedOrchestrationData;
      const modules = nestedData.modules;
      
      if (!modules || modules.length === 0) {
        setFlowItems([]);
        return;
      }
      
      // 将模块转换为流程项
      const convertedModules = modules.map(convertModuleToFlowItem);
      
      // 设置流程项以供渲染
      setFlowItems(convertedModules);
      return;
    }
    
    // 否则使用适配器处理常规编排数据
    const adaptedItems = adaptOrchestrationItems(orchestrationItems, selectedTools, selectedKnowledgeBases);
    setFlowItems(adaptedItems);
    return;
  };

  // 当编排数据或工具/知识库变化时重新分析数据流
  useEffect(() => {
    analyzeDataFlow();
  }, [orchestrationItems, selectedTools, selectedKnowledgeBases]);

  // 开发调试日志
  useEffect(() => {
    if (!orchestrationItems || !Array.isArray(orchestrationItems) || orchestrationItems.length === 0) {
      console.log('编排项数据无效:', orchestrationItems);
      return;
    }
    
    console.log('收到编排数据:', JSON.stringify(orchestrationItems, null, 2));
  }, [orchestrationItems]);

  // 渲染连接线和箭头
  const renderConnector = (color: string, isVertical: boolean = true) => {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: isVertical ? '28px' : 'auto',
        my: isVertical ? 1 : 0
      }}>
        {isVertical ? (
          // 垂直连接器
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
          }}>
            <Box sx={{
              height: '14px',
              width: '1.5px',
              background: `linear-gradient(to bottom, ${alpha(color, 0.6)}, ${alpha(color, 0.3)})`,
              mb: 0.5
            }} />
            <Box sx={{
              width: '18px',
              height: '18px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative'
            }}>
              {/* 箭头下转示意图 */}
              <Box sx={{
                position: 'absolute',
                width: '8px',
                height: '8px',
                borderRight: `1.5px solid ${alpha(color, 0.7)}`,
                borderBottom: `1.5px solid ${alpha(color, 0.7)}`,
                transform: 'rotate(45deg)',
                top: 0,
                zIndex: 2
              }} />
            </Box>
          </Box>
        ) : (
          // 水平连接器
          <Box sx={{
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            mx: 1,
            position: 'relative'
          }}>
            <Box sx={{
              width: '14px',
              height: '1.5px',
              background: `linear-gradient(to right, ${alpha(color, 0.6)}, ${alpha(color, 0.3)})`,
              mr: 0.5
            }} />
            <Box sx={{
              width: '18px',
              height: '18px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative'
            }}>
              {/* 箭头右转示意图 */}
              <Box sx={{
                position: 'absolute',
                width: '8px',
                height: '8px',
                borderTop: `1.5px solid ${alpha(color, 0.7)}`,
                borderRight: `1.5px solid ${alpha(color, 0.7)}`,
                transform: 'rotate(45deg)',
                left: 0,
                zIndex: 2
              }} />
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  // 渲染模块节点
  const renderModuleNode = (item: FlowOrchestrationItem, index: number) => {
    const moduleColor = moduleColors[item.moduleType] || theme.palette.primary.main;
    const moduleIcon = moduleIcons[item.moduleType] || <ToolOutlined />;
    // 使用执行策略颜色映射或默认使用模块颜色
    const strategyColor = strategyColors[item.executionStrategy] || moduleColor;
    
    return (
      <Box
        key={`module-${item.moduleType}-${index}`}
        sx={{
          position: 'relative',
          mb: 3,
          width: '100%'
        }}
      >
        {/* 简化的连接指示器 - 使用线条和箭头 */}
        {index > 0 && renderConnector(moduleColor)}
        
        {/* 模块标题区 - 使用更精致的设计 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            pl: 1
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: alpha(moduleColor, 0.1),
              color: moduleColor,
              mr: 2,
              boxShadow: `0 2px 8px ${alpha(moduleColor, 0.2)}`
            }}
          >
            {moduleIcon}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: moduleColor, lineHeight: 1.2 }}>
              {item.moduleName}
            </Typography>
            <Typography variant="caption" sx={{ color: alpha(theme.palette.text.secondary, 0.8) }}>
              {`模块 ${index + 1} · ${item.tools.length + item.knowledgeBases.length} 个组件`}
            </Typography>
          </Box>
          <Chip 
            size="small" 
            label={item.executionStrategy} 
            sx={{ 
              ml: 1, 
              bgcolor: alpha(strategyColor, 0.1), 
              color: strategyColor,
              fontWeight: 500,
              border: '1px solid',
              borderColor: alpha(strategyColor, 0.2)
            }}
          />
        </Box>
        
        {/* 模块内容区 - 使用更精致的设计 */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: '16px',
            border: '1px solid',
            borderColor: alpha(moduleColor, 0.2),
            bgcolor: alpha(theme.palette.background.paper, 0.95),
            position: 'relative',
            zIndex: 2,
            transition: 'all 0.2s',
            boxShadow: `0 4px 20px ${alpha(moduleColor, 0.08)}`,
            '&:hover': {
              boxShadow: `0 8px 30px ${alpha(moduleColor, 0.15)}`,
              borderColor: alpha(moduleColor, 0.3)
            }
          }}
        >
          {/* 工具列表 - 使用更精致的设计和流程指示器 */}
          {item.tools && item.tools.length > 0 && (
            <Box sx={{ mb: item.knowledgeBases && item.knowledgeBases.length > 0 ? 3 : 0 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1.5,
                pb: 1,
                borderBottom: `1px dashed ${alpha(moduleColor, 0.15)}`
              }}>
                <ToolOutlined style={{ color: moduleColor, marginRight: 8 }} />
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600, 
                    color: alpha(theme.palette.text.primary, 0.85),
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontSize: '0.75rem'
                  }}
                >
                  工具链 ({item.tools.length})
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {item.tools.map((tool, toolIndex) => {
                  const toolCategory = (tool.category as string) || 'default';
                  const iconComponent = toolTypeIcons[toolCategory] || toolTypeIcons.default;
                  const isLastTool = toolIndex === item.tools.length - 1;
                  
                  return (
                    <Box key={`tool-${tool.id}`}>
                      <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                        {/* 序号标识 */}
                        <Box sx={{ 
                          width: 28, 
                          height: 28, 
                          borderRadius: '50%', 
                          bgcolor: alpha(moduleColor, 0.1),
                          color: moduleColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 1.5,
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          border: `1px solid ${alpha(moduleColor, 0.2)}`,
                          boxShadow: `0 2px 4px ${alpha(moduleColor, 0.1)}`
                        }}>
                          {toolIndex + 1}
                        </Box>
                        
                        {/* 工具芯片 */}
                        <Tooltip title={tool.description || `工具: ${tool.name}`}>
                          <Chip
                            id={`tool-${tool.id}`}
                            icon={<Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>{iconComponent}</Box>}
                            label={tool.name}
                            size="small"
                            sx={{
                              flex: 1,
                              height: 32,
                              bgcolor: alpha(moduleColor, 0.05),
                              border: '1px solid',
                              borderColor: alpha(moduleColor, 0.2),
                              '&:hover': {
                                bgcolor: alpha(moduleColor, 0.1),
                                boxShadow: `0 2px 8px ${alpha(moduleColor, 0.2)}`
                              },
                              fontWeight: 500,
                              fontSize: '0.8125rem'
                            }}
                          />
                        </Tooltip>
                      </Box>
                      
                      {/* 流程连接线 - 除了最后一个工具 */}
                      {!isLastTool && (
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          pl: 1.75,
                          py: 0.5,
                          position: 'relative'
                        }}>
                          {renderConnector(moduleColor, false)}
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
          
          {/* 知识库列表 - 使用更精致的设计 */}
          {item.knowledgeBases && item.knowledgeBases.length > 0 && (
            <Box sx={{ mb: 0 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1.5,
                pb: 1,
                borderBottom: `1px dashed ${alpha(theme.palette.secondary.main, 0.15)}`
              }}>
                <DatabaseOutlined style={{ color: theme.palette.secondary.main, marginRight: 8 }} />
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600, 
                    color: alpha(theme.palette.text.primary, 0.85),
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontSize: '0.75rem'
                  }}
                >
                  知识源 ({item.knowledgeBases.length})
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {item.knowledgeBases.map((kb, kbIndex) => {
                  const isLastKb = kbIndex === item.knowledgeBases.length - 1;
                  
                  return (
                    <Box key={`kb-${kb.id}`}>
                      <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                        {/* 序号标识 */}
                        <Box sx={{ 
                          width: 28, 
                          height: 28, 
                          borderRadius: '50%', 
                          bgcolor: alpha(theme.palette.secondary.main, 0.1),
                          color: theme.palette.secondary.main,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 1.5,
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                          boxShadow: `0 2px 4px ${alpha(theme.palette.secondary.main, 0.1)}`
                        }}>
                          {kbIndex + 1}
                        </Box>
                        
                        {/* 知识库芯片 */}
                        <Tooltip title={kb.description || `知识库: ${kb.name}`}>
                          <Chip
                            id={`kb-${kb.id}`}
                            icon={<DatabaseOutlined />}
                            label={kb.name}
                            size="small"
                            sx={{
                              flex: 1,
                              height: 32,
                              bgcolor: alpha(theme.palette.secondary.main, 0.05),
                              border: '1px solid',
                              borderColor: alpha(theme.palette.secondary.main, 0.2),
                              '&:hover': {
                                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                boxShadow: `0 2px 8px ${alpha(theme.palette.secondary.main, 0.2)}`
                              },
                              fontWeight: 500,
                              fontSize: '0.8125rem'
                            }}
                          />
                        </Tooltip>
                      </Box>
                      
                      {/* 流程连接器 - 除了最后一个知识库 */}
                      {!isLastKb && (
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          pl: 1.75,
                          py: 0.5,
                          position: 'relative'
                        }}>
                          {renderConnector(theme.palette.secondary.main, false)}
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
          
          {/* 输出格式化配置 - 仅在输出生成模块显示 */}
          {item.moduleType === 'output_generation' && item.config && (
            <Box sx={{ mt: 2, pt: 2, borderTop: `1px dashed ${alpha(moduleColor, 0.3)}` }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: alpha(theme.palette.text.primary, 0.7) }}>
                输出配置
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Chip 
                  label={item.config.useModelOutput ? "使用模型输出" : "仅使用格式化工具"}
                  size="small"
                  color={item.config.useModelOutput ? "success" : "default"}
                  variant="outlined"
                />
                <Chip 
                  label={item.config.useFormatting ? "使用格式化工具" : "不使用格式化"}
                  size="small"
                  color={item.config.useFormatting ? "primary" : "default"}
                  variant="outlined"
                />
                {item.config.formatOptions && Array.isArray(item.config.formatOptions) && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {item.config.formatOptions.map((format, idx) => (
                      <Chip 
                        key={`format-${idx}`}
                        label={format}
                        size="small"
                        variant="outlined"
                        sx={{ bgcolor: alpha(moduleColor, 0.05) }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    );
  };

  // 渲染空状态 - 使用更精致的设计
  const renderEmptyState = (): React.ReactNode => (
    <Box sx={{ 
      textAlign: 'center', 
      py: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      minHeight: '400px'
    }}>
      <Box sx={{ 
        width: 80, 
        height: 80, 
        borderRadius: '50%',
        bgcolor: alpha(theme.palette.primary.main, 0.05),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 3,
        border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`
      }}>
        <BranchesOutlined style={{ fontSize: 32, color: alpha(theme.palette.primary.main, 0.6) }} />
      </Box>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: alpha(theme.palette.text.primary, 0.85) }}>
        暂无流程数据
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: '400px' }}>
        尚未配置任何工具或知识库编排，请返回上一步进行配置。
      </Typography>
      <Button
        variant="outlined"
        size="small"
        startIcon={<ArrowRightOutlined style={{ transform: 'rotate(180deg)' }} />}
        onClick={onBack}
        sx={{ 
          borderRadius: '20px',
          px: 2,
          py: 0.8,
          fontSize: '0.875rem',
          fontWeight: 500,
          boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}`,
          '&:hover': {
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`
          }
        }}
      >
        返回配置
      </Button>
    </Box>
  );

  // 渲染配置摘要
  const renderConfigSummary = () => {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: alpha(theme.palette.text.primary, 0.85) }}>
          智能体配置摘要
        </Typography>
        
        {/* 工具配置摘要 */}
        <Paper sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: '12px',
          bgcolor: alpha(theme.palette.background.paper, 0.7),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: 600, 
            mb: 1.5, 
            color: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <ToolOutlined /> 已选工具 ({selectedTools.length})
          </Typography>
          
          {selectedTools.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedTools.map(tool => (
                <Chip 
                  key={tool.id}
                  label={tool.name}
                  size="small"
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main
                  }}
                />
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">未选择任何工具</Typography>
          )}
        </Paper>
        
        {/* 知识库摘要 */}
        <Paper sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: '12px',
          bgcolor: alpha(theme.palette.background.paper, 0.7),
          border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`
        }}>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: 600, 
            mb: 1.5, 
            color: theme.palette.secondary.main,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <DatabaseOutlined /> 已选知识库 ({selectedKnowledgeBases.length})
          </Typography>
          
          {selectedKnowledgeBases.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedKnowledgeBases.map(kb => (
                <Chip 
                  key={kb.id}
                  label={kb.name}
                  size="small"
                  sx={{ 
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    color: theme.palette.secondary.main
                  }}
                />
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">未选择任何知识库</Typography>
          )}
        </Paper>
        
        {/* 执行策略摘要 */}
        <Paper sx={{ 
          p: 2, 
          borderRadius: '12px',
          bgcolor: alpha(theme.palette.background.paper, 0.7),
          border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
        }}>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: 600, 
            mb: 1.5, 
            color: theme.palette.info.main,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <BranchesOutlined /> 编排策略
          </Typography>
          
          {orchestrationItems && orchestrationItems.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {isNestedOrchestrationData(orchestrationItems[0]) ? (
                <Typography variant="body2">
                  已配置 {orchestrationItems[0].modules.length} 个模块，
                  包含 {orchestrationItems[0].modules.reduce((acc, m) => acc + (m.tools?.length || 0), 0)} 个工具和
                  {orchestrationItems[0].modules.reduce((acc, m) => acc + (m.knowledgeBases?.length || 0), 0)} 个知识库
                </Typography>
              ) : (
                <Typography variant="body2">已配置 {orchestrationItems.length} 个编排项</Typography>
              )}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">未配置编排策略</Typography>
          )}
        </Paper>
      </Box>
    );
  };

  return (
    <Box 
      id="flow-preview-fullscreen-container"
      sx={{ 
      p: 0, 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* 标题区 */}
      <Box sx={{ mb: 2 }}>
        {/* 流程可视化标题已移除 */}
      </Box>
      
      {/* 内容区 - 用flex-grow占满剩余空间 */}
      <Box sx={{
        display: 'flex',
        gap: 3,
        flexGrow: 1,
        minHeight: 0, // 关键属性，确保内容区可收缩
        mb: 2,
        overflow: 'hidden' // 防止出现整体滚动条
      }}>
        {/* 左侧流程预览区 */}
        <Box 
          ref={flowContainerRef}
          sx={{
            width: '65%',
            p: 3,
            borderRadius: '16px',
            bgcolor: alpha(theme.palette.background.paper, 0.95),
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
            border: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.12),
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflowY: 'auto',
            /* 渐变色边框已移除 */
          }}
        >
          {flowItems && flowItems.length > 0 ? (
            <>
              {/* 开始节点 - 使用更协调的设计 */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Paper
                  elevation={0}
                  sx={{
                    py: 1,
                    px: 2.5,
                    borderRadius: '20px',
                    bgcolor: alpha(theme.palette.success.main, 0.08),
                    border: '1px solid',
                    borderColor: alpha(theme.palette.success.main, 0.15),
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5
                  }}
                >
                  <Box
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      bgcolor: alpha(theme.palette.success.main, 0.12),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <RobotOutlined style={{ color: theme.palette.success.main, fontSize: 14 }} />
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: theme.palette.success.main, 
                      fontWeight: 600,
                      fontSize: '0.8125rem'
                    }}
                  >
                    流程开始
                  </Typography>
                </Paper>
              </Box>
              
              {/* 流程节点 */}
              {flowItems.map((item: FlowOrchestrationItem, index: number) => renderModuleNode(item, index))}
              
              {/* 结束节点 - 使用更协调的设计 */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Paper
                  elevation={0}
                  sx={{
                    py: 1,
                    px: 2.5,
                    borderRadius: '20px',
                    bgcolor: alpha(theme.palette.info.main, 0.08),
                    border: '1px solid',
                    borderColor: alpha(theme.palette.info.main, 0.15),
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5
                  }}
                >
                  <Box
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      bgcolor: alpha(theme.palette.info.main, 0.12),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <CheckCircleOutlined style={{ color: theme.palette.info.main, fontSize: 14 }} />
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: theme.palette.info.main, 
                      fontWeight: 600,
                      fontSize: '0.8125rem'
                    }}
                  >
                    流程结束
                  </Typography>
                </Paper>
              </Box>
            </>
          ) : (
            renderEmptyState()
          )}
        </Box>
        
        {/* 右侧配置摘要区 */}
        <Box sx={{
          width: '35%',
          borderRadius: '16px',
          bgcolor: alpha(theme.palette.background.paper, 0.9),
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
          border: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.12),
          height: '100%',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {renderConfigSummary()}
        </Box>
      </Box>
      
      {/* 底部按钮区域 */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        mt: 'auto',
        pt: 2,
        flexShrink: 0
      }}>
        <Button 
          variant="outlined" 
          onClick={onBack}
          startIcon={<ArrowRightOutlined style={{ transform: 'rotate(180deg)' }} />}
        >
          上一步
        </Button>
        <Button 
          variant="contained" 
          onClick={onComplete}
          endIcon={<CheckCircleOutlined />}
        >
          完成配置
        </Button>
      </Box>
    </Box>
  );
};

export default FlowPreviewStep;
