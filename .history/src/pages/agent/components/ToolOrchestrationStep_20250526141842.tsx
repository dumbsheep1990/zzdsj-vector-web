import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent,
  CardHeader,
  IconButton,
  Chip,
  Button,
  alpha,
  useTheme,
  Avatar,
  Paper,
  Collapse
} from '@mui/material';
import { 
  DragOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  ToolOutlined,
  DatabaseOutlined,
  ThunderboltOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { 
  ExpandMore as ExpandMoreOutlined,
  ExpandLess as ExpandLessOutlined
} from '@mui/icons-material';
import { Tool, KnowledgeBase } from './types';
import { ExtensionToolsConfig } from './extensionConfig';

// 工具编排项接口
interface OrchestrationItem {
  id: string;
  type: 'tool' | 'knowledgeBase' | 'extension';
  name: string;
  description: string;
  config?: Record<string, unknown>;
  enabled: boolean;
  order: number;
}



interface ToolOrchestrationStepProps {
  selectedTools: Tool[];
  selectedKnowledgeBases: KnowledgeBase[];
  extensionToolsConfig: ExtensionToolsConfig;
  orchestrationItems: OrchestrationItem[];
  onOrchestrationItemsChange: (items: OrchestrationItem[]) => void;
  onBack?: () => void;
  onComplete?: () => void;
  canContinue?: boolean;
}

const ToolOrchestrationStep: React.FC<ToolOrchestrationStepProps> = ({
  selectedTools,
  selectedKnowledgeBases,
  extensionToolsConfig,
  orchestrationItems,
  onOrchestrationItemsChange,
  onBack,
  onComplete,
  canContinue = true
}) => {
  const theme = useTheme();
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    tools: true,
    knowledgeBases: true,
    extensions: true
  });

  // 切换展开状态
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // 移动项目顺序
  const moveItem = (id: string, direction: 'up' | 'down') => {
    const currentIndex = orchestrationItems.findIndex(item => item.id === id);
    if (currentIndex === -1) return;

    const newItems = [...orchestrationItems];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex >= 0 && targetIndex < newItems.length) {
      [newItems[currentIndex], newItems[targetIndex]] = [newItems[targetIndex], newItems[currentIndex]];
      // 更新order字段
      newItems.forEach((item, index) => {
        item.order = index + 1;
      });
      onOrchestrationItemsChange(newItems);
    }
  };

  // 切换项目启用状态
  const toggleItemEnabled = (id: string) => {
    const newItems = orchestrationItems.map(item =>
      item.id === id ? { ...item, enabled: !item.enabled } : item
    );
    onOrchestrationItemsChange(newItems);
  };

  // 删除项目
  const removeItem = (id: string) => {
    const newItems = orchestrationItems.filter(item => item.id !== id);
    // 重新排序
    newItems.forEach((item, index) => {
      item.order = index + 1;
    });
    onOrchestrationItemsChange(newItems);
  };

  // 生成工具编排项
  const generateToolItems = (): OrchestrationItem[] => {
    return selectedTools.map((tool, index) => ({
      id: `tool-${tool.id}`,
      type: 'tool' as const,
      name: tool.name,
      description: tool.description,
      config: tool.config,
      enabled: true,
      order: index + 1
    }));
  };

  // 生成知识库编排项
  const generateKnowledgeBaseItems = (): OrchestrationItem[] => {
    return selectedKnowledgeBases.map((kb, index) => ({
      id: `kb-${kb.id}`,
      type: 'knowledgeBase' as const,
      name: kb.name,
      description: kb.description,
      config: kb as Record<string, unknown>,
      enabled: true,
      order: selectedTools.length + index + 1
    }));
  };

  // 生成扩展工具编排项
  const generateExtensionItems = (): OrchestrationItem[] => {
    const items: OrchestrationItem[] = [];
    let orderStart = selectedTools.length + selectedKnowledgeBases.length + 1;

    // 语音支持
    if (extensionToolsConfig.voiceSupport.enabled) {
      const enabledFeatures = [];
      if (extensionToolsConfig.voiceSupport.speechToText) enabledFeatures.push('语音转文字');
      if (extensionToolsConfig.voiceSupport.textToSpeech) enabledFeatures.push('文字转语音');
      
      items.push({
        id: 'extension-voice',
        type: 'extension',
        name: '语音支持',
        description: `包含: ${enabledFeatures.join(', ')}`,
        config: extensionToolsConfig.voiceSupport,
        enabled: true,
        order: orderStart++
      });
    }

    // 多模态支持
    if (extensionToolsConfig.multimodal.enabled) {
      const enabledFeatures = [];
      if (extensionToolsConfig.multimodal.imageAnalysis) enabledFeatures.push('图像分析');
      if (extensionToolsConfig.multimodal.videoProcessing) enabledFeatures.push('视频处理');
      if (extensionToolsConfig.multimodal.chartGeneration) enabledFeatures.push('图表生成');
      
      items.push({
        id: 'extension-multimodal',
        type: 'extension',
        name: '多模态支持',
        description: `包含: ${enabledFeatures.join(', ')}`,
        config: extensionToolsConfig.multimodal,
        enabled: true,
        order: orderStart++
      });
    }

    // 文件分析
    if (extensionToolsConfig.fileAnalysis.enabled) {
      const enabledFeatures = [];
      if (extensionToolsConfig.fileAnalysis.realtimeProcessing) enabledFeatures.push('实时处理');
      if (extensionToolsConfig.fileAnalysis.batchProcessing) enabledFeatures.push('批量处理');
      if (extensionToolsConfig.fileAnalysis.intelligentExtraction) enabledFeatures.push('智能提取');
      
      items.push({
        id: 'extension-fileanalysis',
        type: 'extension',
        name: '文件分析',
        description: `包含: ${enabledFeatures.join(', ')}`,
        config: extensionToolsConfig.fileAnalysis,
        enabled: true,
        order: orderStart++
      });
    }

    return items;
  };

  // 初始化编排项（如果为空）
  React.useEffect(() => {
    if (orchestrationItems.length === 0) {
      const allItems = [
        ...generateToolItems(),
        ...generateKnowledgeBaseItems(),
        ...generateExtensionItems()
      ];
      onOrchestrationItemsChange(allItems);
    }
  }, [selectedTools, selectedKnowledgeBases, extensionToolsConfig]);

  // 渲染编排项
  const renderOrchestrationItem = (item: OrchestrationItem, index: number) => {
    const getIcon = () => {
      switch (item.type) {
        case 'tool':
          return <ToolOutlined style={{ fontSize: 18 }} />;
        case 'knowledgeBase':
          return <DatabaseOutlined style={{ fontSize: 18 }} />;
        case 'extension':
          return <ThunderboltOutlined style={{ fontSize: 18 }} />;
        default:
          return <SettingOutlined style={{ fontSize: 18 }} />;
      }
    };

    const getTypeColor = () => {
      switch (item.type) {
        case 'tool':
          return theme.palette.primary.main;
        case 'knowledgeBase':
          return theme.palette.success.main;
        case 'extension':
          return theme.palette.warning.main;
        default:
          return theme.palette.grey[500];
      }
    };

    return (
      <Card
        key={item.id}
        sx={{
          mb: 2,
          border: `2px solid ${item.enabled ? alpha(getTypeColor(), 0.3) : alpha(theme.palette.grey[300], 0.3)}`,
          borderRadius: '12px',
          backgroundColor: item.enabled 
            ? alpha(getTypeColor(), 0.05)
            : alpha(theme.palette.grey[100], 0.5),
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: `0 4px 20px ${alpha(getTypeColor(), 0.15)}`,
            transform: 'translateY(-1px)'
          }
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* 左侧信息 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
              {/* 顺序号 */}
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  bgcolor: getTypeColor(),
                  color: 'white'
                }}
              >
                {item.order}
              </Avatar>

              {/* 图标 */}
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: alpha(getTypeColor(), 0.1),
                  color: getTypeColor()
                }}
              >
                {getIcon()}
              </Avatar>

              {/* 名称和描述 */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </Box>

              {/* 类型标签 */}
              <Chip
                label={item.type === 'tool' ? '工具' : item.type === 'knowledgeBase' ? '知识库' : '扩展'}
                size="small"
                sx={{
                  bgcolor: alpha(getTypeColor(), 0.1),
                  color: getTypeColor(),
                  fontWeight: 600
                }}
              />
            </Box>

            {/* 右侧操作按钮 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* 启用/禁用切换 */}
              <IconButton
                size="small"
                onClick={() => toggleItemEnabled(item.id)}
                sx={{
                  color: item.enabled ? theme.palette.success.main : theme.palette.grey[400],
                  '&:hover': {
                    bgcolor: alpha(item.enabled ? theme.palette.success.main : theme.palette.grey[400], 0.1)
                  }
                }}
              >
                <CheckCircleOutlined />
              </IconButton>

              {/* 向上移动 */}
              <IconButton
                size="small"
                onClick={() => moveItem(item.id, 'up')}
                disabled={index === 0}
                sx={{ color: theme.palette.text.secondary }}
              >
                <ArrowUpOutlined />
              </IconButton>

              {/* 向下移动 */}
              <IconButton
                size="small"
                onClick={() => moveItem(item.id, 'down')}
                disabled={index === orchestrationItems.length - 1}
                sx={{ color: theme.palette.text.secondary }}
              >
                <ArrowDownOutlined />
              </IconButton>

              {/* 编辑 */}
              <IconButton
                size="small"
                sx={{ color: theme.palette.info.main }}
              >
                <EditOutlined />
              </IconButton>

              {/* 删除 */}
              <IconButton
                size="small"
                onClick={() => removeItem(item.id)}
                sx={{ color: theme.palette.error.main }}
              >
                <DeleteOutlined />
              </IconButton>

              {/* 拖拽手柄 */}
              <IconButton
                size="small"
                sx={{ 
                  color: theme.palette.text.disabled,
                  cursor: 'grab',
                  '&:active': { cursor: 'grabbing' }
                }}
              >
                <DragOutlined />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  // 按类型分组的项目
  const groupedItems = {
    tools: orchestrationItems.filter(item => item.type === 'tool'),
    knowledgeBases: orchestrationItems.filter(item => item.type === 'knowledgeBase'),
    extensions: orchestrationItems.filter(item => item.type === 'extension')
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 头部信息 */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.secondary.main, 0.06)})`,
          borderRadius: '16px',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              width: 48,
              height: 48
            }}
          >
            <PlayCircleOutlined style={{ fontSize: 24 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
              工具编排
            </Typography>
            <Typography variant="body2" color="text.secondary">
              配置工具和服务的调用顺序，优化智能体的执行流程
            </Typography>
          </Box>
        </Box>

        {/* 统计信息 */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Chip
            icon={<PlayCircleOutlined />}
            label={`${orchestrationItems.filter(item => item.enabled).length} 个已启用`}
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
          <Chip
            icon={<ToolOutlined />}
            label={`${groupedItems.tools.length} 个工具`}
            variant="outlined"
            color="primary"
            sx={{ fontWeight: 500 }}
          />
          <Chip
            icon={<DatabaseOutlined />}
            label={`${groupedItems.knowledgeBases.length} 个知识库`}
            variant="outlined"
            color="success"
            sx={{ fontWeight: 500 }}
          />
          <Chip
            icon={<ThunderboltOutlined />}
            label={`${groupedItems.extensions.length} 个扩展`}
            variant="outlined"
            color="warning"
            sx={{ fontWeight: 500 }}
          />
        </Box>
      </Paper>

      {/* 编排列表 */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {/* 工具模块 */}
        {groupedItems.tools.length > 0 && (
          <Card sx={{ mb: 3, borderRadius: '12px' }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32 }}>
                    <ToolOutlined style={{ fontSize: 16 }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    工具模块 ({groupedItems.tools.length})
                  </Typography>
                </Box>
              }
              action={
                <IconButton onClick={() => toggleSection('tools')}>
                  {expandedSections.tools ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
                </IconButton>
              }
              sx={{ pb: 1 }}
            />
                         <Collapse in={expandedSections.tools}>
               <CardContent sx={{ pt: 0 }}>
                 {groupedItems.tools.map((item) => 
                   renderOrchestrationItem(item, orchestrationItems.indexOf(item))
                 )}
               </CardContent>
             </Collapse>
          </Card>
        )}

        {/* 知识库模块 */}
        {groupedItems.knowledgeBases.length > 0 && (
          <Card sx={{ mb: 3, borderRadius: '12px' }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.success.main, width: 32, height: 32 }}>
                    <DatabaseOutlined style={{ fontSize: 16 }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    知识库模块 ({groupedItems.knowledgeBases.length})
                  </Typography>
                </Box>
              }
              action={
                <IconButton onClick={() => toggleSection('knowledgeBases')}>
                  {expandedSections.knowledgeBases ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
                </IconButton>
              }
              sx={{ pb: 1 }}
            />
                         <Collapse in={expandedSections.knowledgeBases}>
               <CardContent sx={{ pt: 0 }}>
                 {groupedItems.knowledgeBases.map((item) => 
                   renderOrchestrationItem(item, orchestrationItems.indexOf(item))
                 )}
               </CardContent>
             </Collapse>
           </Card>
         )}

         {/* 扩展工具模块 */}
         {groupedItems.extensions.length > 0 && (
           <Card sx={{ mb: 3, borderRadius: '12px' }}>
             <CardHeader
               title={
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                   <Avatar sx={{ bgcolor: theme.palette.warning.main, width: 32, height: 32 }}>
                     <ThunderboltOutlined style={{ fontSize: 16 }} />
                   </Avatar>
                   <Typography variant="h6" sx={{ fontWeight: 600 }}>
                     扩展工具模块 ({groupedItems.extensions.length})
                   </Typography>
                 </Box>
               }
               action={
                 <IconButton onClick={() => toggleSection('extensions')}>
                   {expandedSections.extensions ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
                 </IconButton>
               }
               sx={{ pb: 1 }}
             />
             <Collapse in={expandedSections.extensions}>
               <CardContent sx={{ pt: 0 }}>
                 {groupedItems.extensions.map((item) => 
                   renderOrchestrationItem(item, orchestrationItems.indexOf(item))
                 )}
               </CardContent>
             </Collapse>
          </Card>
        )}

        {/* 空状态 */}
        {orchestrationItems.length === 0 && (
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              backgroundColor: alpha(theme.palette.grey[100], 0.5),
              borderRadius: '12px'
            }}
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                mx: 'auto',
                mb: 2
              }}
            >
              <PlusOutlined style={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h6" sx={{ mb: 1, color: theme.palette.text.secondary }}>
              暂无可编排的项目
            </Typography>
            <Typography variant="body2" color="text.secondary">
              请先在前面的步骤中选择工具、知识库或扩展功能
            </Typography>
          </Paper>
        )}
      </Box>

      {/* 底部操作按钮 */}
      <Box
        sx={{
          mt: 3,
          p: 3,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.95),
          borderRadius: '0 0 16px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Button
          variant="outlined"
          onClick={onBack}
          startIcon={<ArrowUpOutlined style={{ transform: 'rotate(-90deg)' }} />}
          sx={{
            borderColor: alpha(theme.palette.divider, 0.3),
            color: theme.palette.text.secondary
          }}
        >
          上一步
        </Button>

        <Button
          variant="contained"
          onClick={onComplete}
          disabled={!canContinue}
          endIcon={<CheckCircleOutlined />}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.success.main}, ${alpha(theme.palette.success.main, 0.85)})`,
            boxShadow: `0 2px 8px ${alpha(theme.palette.success.main, 0.25)}`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.success.dark}, ${theme.palette.success.main})`,
              boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.3)}`,
            }
          }}
        >
          完成创建
        </Button>
      </Box>
    </Box>
  );
};

export default ToolOrchestrationStep; 