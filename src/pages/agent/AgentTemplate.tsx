import React, { useState, useEffect } from 'react';
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
  height: '100vh'
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  overflow: 'hidden',
  padding: '1.5rem',
}));

const MainContent = styled(Box)(({ theme }) => ({
  width: '100%',
  overflow: 'auto',
  backgroundColor: 'white',
  borderRadius: '0.5rem',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  padding: '1.25rem'
}));

const TemplateCard = styled(Card)(({ theme }) => ({
  height: '360px', // 固定卡片高度
  width: '100%', // 确保宽度填满Grid容器
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '8px',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  },
  border: '1px solid rgba(0, 0, 0, 0.08)',
  borderTop: '4px solid #00c9ff',
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

  // 过滤模板
  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 处理使用模板
  const handleUseTemplate = (templateId: string) => {
    navigate(`/agent-system/builder?template=${templateId}`);
  };
  
  // 创建新模板
  const handleCreateTemplate = () => {
    navigate('/agent-system/builder?action=create_template');
  };
  
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
          {/* 统一固定宽度的卡片容器 */}
          <Box sx={{ width: '100%' }}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
              width: '100%'
            }}>
              {filteredTemplates.map((template) => (
                <Box 
                  key={template.id} 
                  sx={{ 
                    width: '100%', // 强制每个盒子填满网格单元
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
                          background: 'linear-gradient(90deg, #00c9ff 0%, #92fe9d 100%)',
                          textTransform: 'none',
                          borderRadius: '8px',
                          height: '40px'
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
