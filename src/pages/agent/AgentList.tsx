import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  Chip, 
  TextField, 
  InputAdornment,
  CircularProgress,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import { useAppContext } from '../../context/AppContext';

// 后续会导入智能体卡片组件
// import AgentCard from '../../components/agent/AgentCard';
// import EmptyAgentState from '../../components/agent/EmptyAgentState';

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

const AgentList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { state } = useAppContext();
  
  // 实际开发中，这会从 API 获取
  const [agents, setAgents] = useState<any[]>([]);

  useEffect(() => {
    // 模拟 API 加载
    setTimeout(() => {
      setAgents([]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCreateAgent = () => {
    navigate('/agent-system/flow-builder');
  };
  
  // 页面标题及操作
  const primaryActions = [
    {
      icon: <AddIcon />,
      label: '创建智能体',
      onClick: handleCreateAgent
    }
  ];
  
  // 搜索组件
  const searchComponent = (
    <TextField
      placeholder="搜索智能体..."
      variant="outlined"
      size="small"
      value={searchTerm}
      onChange={handleSearchChange}
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
  
  // 过滤组件
  const filterComponent = (
    <Tabs value={tabValue} onChange={handleTabChange}>
      <Tab label="全部智能体" />
      <Tab label="系统智能体" />
      <Tab label="我的智能体" />
    </Tabs>
  );

  return (
    <PageContainer>
      <PageHeader
        parentTitle="智能体系统"
        title="智能体管理"
        description="创建、管理和编辑您的自定义智能体"
        primaryActions={primaryActions}
        searchComponent={searchComponent}
        filterComponent={filterComponent}
        username={state.username}
      />
      
      <ContentContainer>
        <MainContent>
          {/* 加载状态 */}
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* 智能体列表区 */}
              {agents.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" gutterBottom>暂无智能体</Typography>
                  <Typography color="text.secondary" sx={{ mb: 4 }}>
                    点击“创建智能体”按钮开始构建您的第一个智能体
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    onClick={handleCreateAgent}
                    sx={{ 
                      background: 'linear-gradient(90deg, #00c9ff 0%, #92fe9d 100%)',
                      textTransform: 'none'
                    }}
                  >
                    创建智能体
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {/* 这里将渲染智能体卡片组件 */}
                  {/* agents.map(agent => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={agent.id}>
                      <AgentCard agent={agent} />
                    </Grid>
                  )) */}
                </Grid>
              )}
            </>
          )}
        </MainContent>
      </ContentContainer>
    </PageContainer>
  );
};

export default AgentList;
