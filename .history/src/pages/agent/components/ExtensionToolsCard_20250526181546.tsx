import React from 'react';
import { 
  Card, 
  Box, 
  Typography, 
  Switch,
  Chip,
  Avatar,
  alpha,
  useTheme,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  AudioOutlined,
  CameraOutlined,
  FileSearchOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
  BulbOutlined,
  SearchOutlined,
  BarChartOutlined,
  ApartmentOutlined,
  FundOutlined
} from '@ant-design/icons';
import { ExtensionToolsConfig } from './extensionConfig';

interface ExtensionToolsCardProps {
  config: ExtensionToolsConfig;
  onChange: (config: ExtensionToolsConfig) => void;
}

const ExtensionToolsCard: React.FC<ExtensionToolsCardProps> = ({
  config,
  onChange
}) => {
  const theme = useTheme();

  // 处理主功能开关变更
  const handleMainToggle = (category: keyof ExtensionToolsConfig, enabled: boolean) => {
    onChange({
      ...config,
      [category]: {
        ...config[category],
        enabled
      }
    });
  };

  // 处理子功能变更
  const handleSubFeatureToggle = (
    category: keyof ExtensionToolsConfig,
    feature: string,
    value: boolean
  ) => {
    onChange({
      ...config,
      [category]: {
        ...config[category],
        [feature]: value
      }
    });
  };

  // 渲染功能卡片
  const renderFeatureCard = (
    title: string,
    description: string,
    icon: React.ReactNode,
    category: keyof ExtensionToolsConfig,
    features: Array<{ key: string; label: string; premium?: boolean }>,
    color: string,
    enabled: boolean
  ) => (
    <Card
      sx={{
        position: 'relative',
        overflow: 'visible',
        background: enabled 
          ? `linear-gradient(135deg, ${alpha(color, 0.08)}, ${alpha(color, 0.04)})`
          : alpha(theme.palette.grey[100], 0.3),
        border: `2px solid ${enabled ? alpha(color, 0.2) : alpha(theme.palette.grey[300], 0.3)}`,
        borderRadius: '16px',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: enabled 
            ? `0 8px 32px ${alpha(color, 0.15)}`
            : `0 8px 32px ${alpha(theme.palette.grey[400], 0.1)}`,
          borderColor: enabled ? alpha(color, 0.4) : alpha(theme.palette.grey[400], 0.4)
        }
      }}
    >
      {/* 卡片头部 */}
      <Box
        sx={{
          p: 2.5,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          background: enabled 
            ? `linear-gradient(135deg, ${alpha(color, 0.1)}, ${alpha(color, 0.05)})`
            : alpha(theme.palette.grey[50], 0.5)
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: enabled ? color : theme.palette.grey[400],
                width: 44,
                height: 44,
                boxShadow: enabled ? `0 4px 12px ${alpha(color, 0.3)}` : 'none'
              }}
            >
              {icon}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: enabled ? color : theme.palette.text.secondary }}>
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {description}
              </Typography>
            </Box>
          </Box>
          
          <Switch
            checked={enabled}
            onChange={(e) => handleMainToggle(category, e.target.checked)}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: color,
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: color,
              },
            }}
          />
        </Box>
      </Box>

                    {/* 功能列表 */}
       <Box sx={{ p: 2.5 }}>
         <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 1.5 }}>
           {features.map((feature) => (
             <Box key={feature.key}>
               <Box
                 sx={{
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'space-between',
                   p: 1.5,
                   borderRadius: '8px',
                   backgroundColor: enabled 
                     ? alpha(color, 0.04)
                     : alpha(theme.palette.grey[100], 0.5),
                   border: `1px solid ${enabled ? alpha(color, 0.1) : alpha(theme.palette.grey[300], 0.3)}`,
                   transition: 'all 0.2s ease',
                   '&:hover': {
                     backgroundColor: enabled ? alpha(color, 0.08) : alpha(theme.palette.grey[200], 0.5)
                   }
                 }}
               >
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                   <Typography 
                     variant="body2" 
                     sx={{ 
                       fontWeight: 500,
                       color: enabled ? theme.palette.text.primary : theme.palette.text.disabled
                     }}
                   >
                     {feature.label}
                   </Typography>
                   {feature.premium && (
                     <Chip
                       label="Pro"
                       size="small"
                       sx={{
                         height: 18,
                         fontSize: '0.7rem',
                         fontWeight: 600,
                         background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.light})`,
                         color: 'white'
                       }}
                     />
                   )}
                 </Box>
                 <Switch
                   size="small"
                   disabled={!enabled}
                   checked={enabled && Boolean((config[category] as Record<string, boolean>)[feature.key])}
                   onChange={(e) => handleSubFeatureToggle(category, feature.key, e.target.checked)}
                   sx={{
                     '& .MuiSwitch-switchBase.Mui-checked': {
                       color: color,
                     },
                     '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                       backgroundColor: color,
                     },
                   }}
                 />
               </Box>
             </Box>
           ))}
         </Box>
       </Box>

      {/* 状态指示器 */}
      {enabled && (
        <Box
          sx={{
            position: 'absolute',
            top: -8,
            right: -8,
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: theme.palette.success.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 2px 8px ${alpha(theme.palette.success.main, 0.3)}`
          }}
        >
          <CheckCircleOutlined style={{ fontSize: 12, color: 'white' }} />
        </Box>
      )}
    </Card>
  );

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* 头部信息 */}
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.secondary.main, 0.06)})`,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: '16px 16px 0 0'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                width: 48,
                height: 48
              }}
            >
              <ThunderboltOutlined style={{ fontSize: 24 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                扩展工具
              </Typography>
              <Typography variant="body2" color="text.secondary">
                为您的智能体添加强大的扩展功能
              </Typography>
            </Box>
          </Box>
          <Tooltip title="扩展工具配置说明">
            <IconButton>
              <InfoCircleOutlined />
            </IconButton>
          </Tooltip>
        </Box>

        {/* 统计信息 */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Chip
            icon={<CheckCircleOutlined />}
            label={`${Object.values(config).filter(category => category.enabled).length} 个已启用`}
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
          <Chip
            icon={<BulbOutlined />}
            label="智能推荐"
            variant="outlined"
            color="primary"
            sx={{ fontWeight: 500 }}
          />
        </Box>
      </Box>

             {/* 内容区域 */}
       <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3 }}>
         <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 3 }}>
           {/* 语音支持 */}
           <Box>
             {renderFeatureCard(
               '语音支持',
               '为智能体添加语音交互能力',
               <AudioOutlined style={{ fontSize: 20 }} />,
               'voiceSupport',
               [
                 { key: 'speechToText', label: '语音转文字' },
                 { key: 'textToSpeech', label: '文字转语音' }
               ],
               theme.palette.info.main,
               config.voiceSupport.enabled
             )}
           </Box>

           {/* 多模态支持 */}
           <Box>
             {renderFeatureCard(
               '多模态支持',
               '处理图像、视频等多媒体内容',
               <CameraOutlined style={{ fontSize: 20 }} />,
               'multimodal',
               [
                 { key: 'imageAnalysis', label: '图像分析' },
                 { key: 'videoProcessing', label: '视频处理' },
                 { key: 'chartGeneration', label: '图表生成' }
               ],
               theme.palette.success.main,
               config.multimodal.enabled
             )}
           </Box>

           {/* 实时文件分析 */}
           <Box>
             {renderFeatureCard(
               '实时文件分析',
               '智能分析各种格式的文件内容',
               <FileSearchOutlined style={{ fontSize: 20 }} />,
               'fileAnalysis',
               [
                 { key: 'realtimeProcessing', label: '实时处理' },
                 { key: 'batchProcessing', label: '批量处理' },
                 { key: 'intelligentExtraction', label: '智能提取' }
               ],
               theme.palette.warning.main,
               config.fileAnalysis.enabled
             )}
           </Box>

           {/* 智能搜索与连接 */}
           <Box>
             {renderFeatureCard(
               '智能搜索与连接',
               '连接外部数据源和API服务',
               <SearchOutlined style={{ fontSize: 20 }} />,
               'smartSearch',
               [
                 { key: 'webSearch', label: '网络搜索' },
                 { key: 'knowledgeBase', label: '知识库连接' },
                 { key: 'apiIntegration', label: 'API集成' },
                 { key: 'databaseQuery', label: '数据库查询' }
               ],
               '#9c27b0',
               config.smartSearch.enabled
             )}
           </Box>

           {/* 工作流自动化 */}
           <Box>
             {renderFeatureCard(
               '工作流自动化',
               '自动化任务调度和流程编排',
               <ApartmentOutlined style={{ fontSize: 20 }} />,
               'workflowAutomation',
               [
                 { key: 'taskScheduling', label: '任务调度' },
                 { key: 'triggerSettings', label: '触发器设置' },
                 { key: 'processOrchestration', label: '流程编排' },
                 { key: 'batchOperations', label: '批量操作' }
               ],
               '#ff9800',
               config.workflowAutomation.enabled
             )}
           </Box>

           {/* 数据分析与可视化 */}
           <Box>
             {renderFeatureCard(
               '数据分析与可视化',
               '深度数据挖掘和智能分析',
               <FundOutlined style={{ fontSize: 20 }} />,
               'dataAnalytics',
               [
                 { key: 'dataMining', label: '数据挖掘' },
                 { key: 'statisticalAnalysis', label: '统计分析' },
                 { key: 'reportGeneration', label: '报告生成' },
                 { key: 'predictiveAnalytics', label: '预测分析' }
               ],
               '#00bcd4',
               config.dataAnalytics.enabled
             )}
           </Box>
        </Box>

        {/* 底部操作区域 */}
        <Box
          sx={{
            mt: 4,
            p: 3,
            background: alpha(theme.palette.background.paper, 0.8),
            borderRadius: '12px',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                配置完成
              </Typography>
              <Typography variant="body2" color="text.secondary">
                您可以随时在智能体设置中修改这些扩展功能
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<SettingOutlined />}
                size="small"
              >
                高级设置
              </Button>
              <Button
                variant="contained"
                startIcon={<CheckCircleOutlined />}
                size="small"
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`
                  }
                }}
              >
                保存配置
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ExtensionToolsCard; 