import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  TextField, 
  InputAdornment,
  Chip,
  CardActions,
  Paper
} from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import { useAppContext } from '../../context/AppContext';

const PageContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  backgroundColor: '#f3f4f6',
  height: '100vh',
  // 启用硬件加速
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden'
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  overflow: 'hidden',
  padding: '1.5rem',
}));

const MainContent = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%', // 使用100%避免auto计算
  overflow: 'hidden', // 移除滚动条，改用内部滚动
  backgroundColor: 'white',
  borderRadius: '0.5rem',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  padding: '1.25rem',
  display: 'flex',
  flexDirection: 'column'
}));

// 优化卡片样式，减少重排重绘
const TemplateCard = styled(Card)(({ theme }) => ({
  height: '360px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '8px',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  borderTop: '4px solid #00c9ff',
  // 优化过渡动画，只使用transform和opacity
  transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  willChange: 'transform', // 告知浏览器该元素会发生变换
  // 启用硬件加速
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px) translateZ(0)', // 减少移动距离，保持硬件加速
    boxShadow: '0 6px 20px rgba(0,0,0,0.08)', // 减少阴影复杂度
  },
}));

// 模板数据接口
interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  baseAgentType: string;
  category: string;
  tools: string[];
  usageCount: number;
}

// 模拟数据
const mockTemplates: AgentTemplate[] = [
  {
    id: 'template-1',
    name: '文档解析助手',
    description: '能够解析多种格式的文档，提取关键信息并回答相关问题',
    baseAgentType: '问答型智能体',
    category: '文档处理',
    tools: ['PDF解析', '文本分析', '向量检索'],
    usageCount: 128
  },
  {
    id: 'template-2',
    name: '数据分析助手',
    description: '专注于结构化数据的分析和可视化',
    baseAgentType: '工具型智能体',
    category: '数据分析',
    tools: ['数据加载', '数据清洗', '图表生成'],
    usageCount: 76
  },
  {
    id: 'template-3',
    name: '客服机器人',
    description: '自动回复客户问题，处理常见查询',
    baseAgentType: '对话型智能体',
    category: '客户服务',
    tools: ['知识库检索', '问题分类', '情感分析'],
    usageCount: 215
  }
];

const AgentTemplate: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [templates, setTemplates] = useState<AgentTemplate[]>(mockTemplates);
  const { state } = useAppContext();

  // 使用useMemo优化过滤性能
  const filteredTemplates = useMemo(() => {
    if (!searchTerm.trim()) return templates;
    
    const lowercaseSearch = searchTerm.toLowerCase();
    return templates.filter(template =>
      template.name.toLowerCase().includes(lowercaseSearch) ||
      template.description.toLowerCase().includes(lowercaseSearch) ||
      template.category.toLowerCase().includes(lowercaseSearch)
    );
  }, [templates, searchTerm]);

  // 使用useCallback优化事件处理函数
  const handleUseTemplate = useCallback((templateId: string) => {
    navigate(`/agent-system/flow-builder?template=${templateId}`);
  }, [navigate]);
  
  const handleCreateTemplate = useCallback(() => {
    navigate('/agent-system/flow-builder');
  }, [navigate]);
  
  // 页面标题及操作
  const primaryActions = [
    {
      icon: <AddCircleOutlineIcon />,
      label: '创建模板',
      onClick: handleCreateTemplate
    }
  ];
  
  // 搜索组件
  const searchComponent = (
    <TextField
      placeholder="搜索模板..."
      variant="outlined"
      size="small"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      sx={{ width: 250 }}
    />
  );

  return (
    <PageContainer>
      <PageHeader
        parentTitle="智能体系统"
        title="智能体模板"
        description="选择预置模板快速创建不同类型的智能体"
        primaryActions={primaryActions}
        searchComponent={searchComponent}
        username={state.username}
      />
      
      <ContentContainer>
        <MainContent>
          {/* 优化的卡片容器 - 使用flex布局避免grid计算性能问题 */}
          <Box sx={{ 
            width: '100%', 
            height: '100%',
            overflow: 'auto', // 内部滚动
            // 启用硬件加速
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}>
            <Box sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px',
              width: '100%',
              // 确保每行3个卡片，响应式调整
              '& > div': {
                flexBasis: 'calc(33.333% - 16px)',
                minWidth: '300px',
                '@media (max-width: 1200px)': {
                  flexBasis: 'calc(50% - 12px)',
                },
                '@media (max-width: 768px)': {
                  flexBasis: '100%',
                }
              }
            }}>
              {filteredTemplates.map((template) => (
                <Box 
                  key={template.id} 
                  sx={{ 
                    // 避免不必要的宽度设置，由父容器控制
                  }}
                >
                  <TemplateCard>
                    <CardContent sx={{ 
                      flexGrow: 1, 
                      display: 'flex', 
                      flexDirection: 'column',
                      height: '280px', // 固定内容区域高度
                      p: 2.5 // 统一内边距
                    }}>
                      {/* 标题区域 - 固定高度 */}
                      <Box sx={{ mb: 2, height: '32px' }}>
                        <Typography variant="h6" component="h2" sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {template.name}
                        </Typography>
                      </Box>
                      
                      {/* 副标题区域 - 固定高度 */}
                      <Box sx={{ mb: 2, height: '24px' }}>
                        <Typography variant="body2" color="text.secondary">
                          {template.baseAgentType} · {template.category}
                        </Typography>
                      </Box>
                      
                      {/* 描述区域 - 固定高度，超出显示省略号 */}
                      <Box sx={{ mb: 2, height: '80px', overflow: 'hidden' }}>
                        <Typography variant="body2" sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {template.description}
                        </Typography>
                      </Box>
                      
                      {/* 工具标签区域 - 固定高度 */}
                      <Box sx={{ mb: 2, height: '80px', overflow: 'auto' }}>
                        {template.tools.map((tool, index) => (
                          <Chip
                            key={index}
                            label={tool}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5, fontSize: '0.7rem' }}
                          />
                        ))}
                      </Box>
                      
                      {/* 底部信息区域 */}
                      <Box sx={{ mt: 'auto', pt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          已使用 {template.usageCount} 次
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ p: 2.5, pt: 0 }}>
                      <Button 
                        startIcon={<ContentCopyIcon />}
                        onClick={() => handleUseTemplate(template.id)}
                        fullWidth
                        variant="contained"
                        sx={{ 
                          // 简化渐变，使用更高性能的solid color
                          backgroundColor: '#00c9ff',
                          '&:hover': {
                            backgroundColor: '#0099cc',
                          },
                          textTransform: 'none',
                          borderRadius: '8px',
                          height: '40px',
                          // 避免不必要的重绘
                          willChange: 'background-color',
                          transition: 'background-color 0.2s ease'
                        }}
                      >
                        使用此模板
                      </Button>
                    </CardActions>
                  </TemplateCard>
                </Box>
              ))}
            </Box>
          </Box>
        </MainContent>
      </ContentContainer>
    </PageContainer>
  );
};

export default AgentTemplate;
