import React, { useMemo } from 'react';
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
  AppstoreOutlined
} from '@ant-design/icons';
import { Tool, KnowledgeBase } from './types';
import { OrchestrationItem as BuilderOrchestrationItem } from '../AgentBuilder';
import { FlowOrchestrationItem, adaptOrchestrationItems } from './adapters/orchestrationAdapter';

// 组件属性
interface FlowPreviewStepProps {
  selectedTools: Tool[];
  selectedKnowledgeBases: KnowledgeBase[];
  orchestrationItems: BuilderOrchestrationItem[];
  onBack?: () => void;
  onComplete?: () => void;
}

// 模块可视化颜色映射
const moduleColors: Record<string, string> = {
  information_retrieval: '#1890ff', // 蓝色 - 信息获取
  content_processing: '#52c41a',    // 绿色 - 内容处理
  data_analysis_reasoning: '#722ed1', // 紫色 - 数据分析与推理
  output_generation: '#fa8c16',     // 橙色 - 输出生成
  workflow_control: '#f5222d'       // 红色 - 流程控制
};

// 模块类型图标映射
const moduleIcons: Record<string, React.ReactNode> = {
  information_retrieval: <SearchOutlined />,  // 信息获取
  content_processing: <FileTextOutlined />,   // 内容处理
  data_analysis_reasoning: <BulbOutlined />,  // 数据分析与推理
  output_generation: <CodeSandboxOutlined />, // 输出生成
  workflow_control: <BranchesOutlined />      // 流程控制
};

// 工具类型图标映射
const toolTypeIcons: Record<string, React.ReactNode> = {
  search: <SearchOutlined />,
  retrieval: <DatabaseOutlined />,
  reasoning: <BulbOutlined />,
  integration: <ApiOutlined />,
  knowledge: <NodeIndexOutlined />,
  development: <AppstoreOutlined />,
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
  
  // 使用适配器转换编排项
  const flowItems = useMemo(() => {
    return adaptOrchestrationItems(orchestrationItems, selectedTools, selectedKnowledgeBases);
  }, [orchestrationItems, selectedTools, selectedKnowledgeBases]);

  // 渲染模块节点
  const renderModuleNode = (item: FlowOrchestrationItem, index: number) => {
    const moduleColor = moduleColors[item.moduleType] || theme.palette.primary.main;
    const moduleIcon = moduleIcons[item.moduleType] || <ToolOutlined />;
    
    return (
      <Box
        key={`module-${item.moduleType}-${index}`}
        sx={{
          position: 'relative',
          mb: 4,
          width: '100%'
        }}
      >
        {/* 节点连接线 */}
        {index < flowItems.length - 1 && (
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              bottom: '-30px',
              height: '30px',
              width: '2px',
              bgcolor: alpha(moduleColor, 0.5),
              zIndex: 1
            }}
          />
        )}
        
        {/* 模块标题 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2
          }}
        >
          <Avatar
            sx={{
              bgcolor: alpha(moduleColor, 0.1),
              color: moduleColor,
              mr: 2
            }}
          >
            {moduleIcon}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600, color: moduleColor }}>
            {item.moduleName}
          </Typography>
          <Chip 
            size="small" 
            label={item.executionStrategy} 
            sx={{ ml: 2, bgcolor: alpha(moduleColor, 0.1), color: moduleColor }}
          />
        </Box>
        
        {/* 模块内容 */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: '12px',
            border: '1px solid',
            borderColor: alpha(moduleColor, 0.3),
            bgcolor: alpha(theme.palette.background.paper, 0.9),
            position: 'relative',
            zIndex: 2,
            transition: 'all 0.2s',
            '&:hover': {
              boxShadow: `0 4px 20px ${alpha(moduleColor, 0.2)}`,
              borderColor: alpha(moduleColor, 0.5)
            }
          }}
        >
          {/* 工具列表 */}
          {item.tools && item.tools.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: alpha(theme.palette.text.primary, 0.7) }}>
                工具 ({item.tools.length})
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {item.tools.map((tool) => {
                  const toolCategory = (tool.category as string) || 'default';
                  const iconComponent = toolTypeIcons[toolCategory] || toolTypeIcons.default;
                  
                  return (
                    <Tooltip key={tool.id} title={tool.description}>
                      <Chip
                        icon={<Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>{iconComponent}</Box>}
                        label={tool.name}
                        size="small"
                        sx={{
                          bgcolor: alpha(moduleColor, 0.05),
                          border: '1px solid',
                          borderColor: alpha(moduleColor, 0.2),
                          '&:hover': {
                            bgcolor: alpha(moduleColor, 0.1)
                          }
                        }}
                      />
                    </Tooltip>
                  );
                })}
              </Box>
            </Box>
          )}
          
          {/* 知识库列表 */}
          {item.knowledgeBases && item.knowledgeBases.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: alpha(theme.palette.text.primary, 0.7) }}>
                知识库 ({item.knowledgeBases.length})
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {item.knowledgeBases.map((kb) => (
                  <Tooltip key={kb.id} title={kb.description}>
                    <Chip
                      icon={<DatabaseOutlined />}
                      label={kb.name}
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.secondary.main, 0.05),
                        border: '1px solid',
                        borderColor: alpha(theme.palette.secondary.main, 0.2),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.secondary.main, 0.1)
                        }
                      }}
                    />
                  </Tooltip>
                ))}
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

  // 渲染空状态
  const renderEmptyState = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
        尚未配置任何工具编排，请返回上一步进行配置。
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
        流程预览
      </Typography>
      
      <Box 
        sx={{
          maxWidth: '800px',
          mx: 'auto',
          p: 3,
          borderRadius: '16px',
          bgcolor: alpha(theme.palette.background.default, 0.7),
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
          border: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.1)
        }}
      >
        {flowItems.length > 0 ? (
          <>
            {/* 开始节点 */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  py: 1,
                  px: 3,
                  borderRadius: '20px',
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  border: '1px solid',
                  borderColor: alpha(theme.palette.success.main, 0.3),
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <RobotOutlined style={{ color: theme.palette.success.main }} />
                <Typography variant="body2" sx={{ color: theme.palette.success.main, fontWeight: 500 }}>
                  处理开始
                </Typography>
              </Paper>
            </Box>
            
            {/* 连接线 */}
            <Box 
              sx={{
                height: '20px',
                width: '2px',
                bgcolor: alpha(theme.palette.success.main, 0.3),
                mx: 'auto',
                mb: 1
              }}
            />
            
            {/* 流程节点 */}
            {flowItems.map((item, index) => renderModuleNode(item, index))}
            
            {/* 结束节点 */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  py: 1,
                  px: 3,
                  borderRadius: '20px',
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  border: '1px solid',
                  borderColor: alpha(theme.palette.info.main, 0.3),
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <CheckCircleOutlined style={{ color: theme.palette.info.main }} />
                <Typography variant="body2" sx={{ color: theme.palette.info.main, fontWeight: 500 }}>
                  处理完成
                </Typography>
              </Paper>
            </Box>
          </>
        ) : (
          renderEmptyState()
        )}
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
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
