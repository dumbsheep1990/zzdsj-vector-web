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
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Alert
} from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ComputerIcon from '@mui/icons-material/Computer';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ShareIcon from '@mui/icons-material/Share';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import { useAppContext } from '../../context/AppContext';

// 样式化组件
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

const DeploymentCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '8px',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  },
  border: '1px solid rgba(0, 0, 0, 0.08)',
  borderTop: '4px solid #00c9ff',
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  '.MuiLinearProgress-bar': {
    background: 'linear-gradient(90deg, #00c9ff 0%, #92fe9d 100%)',
  }
}));

// 部署信息接口
interface AgentDeployment {
  id: string;
  name: string;
  agentType: string;
  status: 'online' | 'offline' | 'deploying' | 'error';
  deploymentTarget: 'cloud' | 'local' | 'edge';
  lastDeployed: string; // ISO日期字符串
  usageStatistics: {
    requests: number;
    successRate: number;
    averageResponseTime: number; // 毫秒
  };
  version: string;
  description: string;
}

// 模拟数据
const mockDeployments: AgentDeployment[] = [
  {
    id: 'deploy-1',
    name: '文档助手-生产版',
    agentType: '文档解析助手',
    status: 'online',
    deploymentTarget: 'cloud',
    lastDeployed: '2025-05-10T08:30:00Z',
    usageStatistics: {
      requests: 1256,
      successRate: 98.5,
      averageResponseTime: 420
    },
    version: 'v1.2.0',
    description: '生产环境的文档解析助手，经过全面测试和优化'
  },
  {
    id: 'deploy-2',
    name: '数据分析助手-测试版',
    agentType: '数据分析助手',
    status: 'deploying',
    deploymentTarget: 'cloud',
    lastDeployed: '2025-05-14T15:45:00Z',
    usageStatistics: {
      requests: 86,
      successRate: 91.2,
      averageResponseTime: 630
    },
    version: 'v0.9.1',
    description: '用于内部测试的数据分析助手，新增了图表生成功能'
  },
  {
    id: 'deploy-3',
    name: '本地客服机器人',
    agentType: '客服机器人',
    status: 'offline',
    deploymentTarget: 'local',
    lastDeployed: '2025-05-08T10:20:00Z',
    usageStatistics: {
      requests: 532,
      successRate: 95.8,
      averageResponseTime: 380
    },
    version: 'v1.0.0',
    description: '本地部署的客服机器人，用于内部服务台辅助'
  }
];

const AgentDeployment: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [deployments, setDeployments] = useState<AgentDeployment[]>(mockDeployments);
  const { state } = useAppContext();
  
  // 页面标题及操作
  const primaryActions = [
    {
      icon: <CloudUploadIcon />,
      label: '新建部署',
      onClick: () => navigate('/agent-system/builder?action=deploy')
    }
  ];
  
  // 搜索组件
  const searchComponent = (
    <TextField
      placeholder="搜索部署..."
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

  // 过滤部署
  const filteredDeployments = deployments.filter(deployment =>
    deployment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deployment.agentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deployment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 处理新部署
  const handleNewDeployment = () => {
    navigate('/agent-system/builder?action=deploy');
  };

  // 处理部署控制
  const handleDeploymentControl = (deploymentId: string, action: 'start' | 'stop' | 'update' | 'share') => {
    console.log(`执行操作: ${action} 于部署 ${deploymentId}`);
    
    // 模拟状态改变
    if (action === 'start' || action === 'stop') {
      setDeployments(prevDeployments => 
        prevDeployments.map(dep => 
          dep.id === deploymentId 
            ? { ...dep, status: action === 'start' ? 'online' : 'offline' }
            : dep
        )
      );
    }
  };

  // 渲染状态标签
  const renderStatusChip = (status: AgentDeployment['status']) => {
    let color: 'success' | 'error' | 'warning' | 'default' = 'default';
    let label = '';

    switch (status) {
      case 'online':
        color = 'success';
        label = '运行中';
        break;
      case 'offline':
        color = 'default';
        label = '已停止';
        break;
      case 'deploying':
        color = 'warning';
        label = '部署中';
        break;
      case 'error':
        color = 'error';
        label = '异常';
        break;
    }

    return <Chip size="small" color={color} label={label} />;
  };

  // 渲染部署目标标签
  const renderTargetChip = (target: AgentDeployment['deploymentTarget']) => {
    let icon = <ComputerIcon fontSize="small" />;
    let label = '本地';
    let color: 'info' | 'success' | 'warning' = 'info';

    switch (target) {
      case 'cloud':
        icon = <CloudUploadIcon fontSize="small" />;
        label = '云端';
        color = 'info';
        break;
      case 'local':
        icon = <ComputerIcon fontSize="small" />;
        label = '本地';
        color = 'success';
        break;
      case 'edge':
        icon = <SettingsIcon fontSize="small" />;
        label = '边缘';
        color = 'warning';
        break;
    }

    return (
      <Chip 
        size="small" 
        icon={icon} 
        label={label} 
        color={color}
        variant="outlined"
      />
    );
  };

  return (
    <PageContainer>
      <PageHeader
        parentTitle="智能体系统"
        title="智能体部署"
        description="管理智能体的部署和运行状态"
        primaryActions={primaryActions}
        searchComponent={searchComponent}
        username={state.username}
      />

      <ContentContainer>
        <MainContent>
          {/* 部署列表 */}
          <TableContainer component={Paper} sx={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', mb: 4 }}>
            <Table>
              <TableHead sx={{ bgcolor: 'rgba(0, 201, 255, 0.05)' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>名称</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>基础智能体</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>状态</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>部署目标</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>最近部署时间</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>请求量</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>成功率</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDeployments.map((deployment) => {
                  // 格式化日期
                  const lastDeployedDate = new Date(deployment.lastDeployed);
                  const formattedDate = `${lastDeployedDate.toLocaleDateString()} ${lastDeployedDate.toLocaleTimeString()}`;
                  
                  return (
                    <TableRow key={deployment.id} sx={{ '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.02)' } }}>
                      <TableCell>
                        <Typography variant="subtitle2">{deployment.name}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {deployment.version}
                        </Typography>
                      </TableCell>
                      <TableCell>{deployment.agentType}</TableCell>
                      <TableCell>{renderStatusChip(deployment.status)}</TableCell>
                      <TableCell>{renderTargetChip(deployment.deploymentTarget)}</TableCell>
                      <TableCell>{formattedDate}</TableCell>
                      <TableCell>{deployment.usageStatistics.requests}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <StyledLinearProgress 
                            variant="determinate" 
                            value={deployment.usageStatistics.successRate} 
                            sx={{ width: 60 }}
                          />
                          <Typography variant="body2">
                            {deployment.usageStatistics.successRate}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {deployment.status !== 'deploying' && (
                            <IconButton 
                              size="small" 
                              color={deployment.status === 'online' ? 'default' : 'primary'}
                              onClick={() => handleDeploymentControl(
                                deployment.id, 
                                deployment.status === 'online' ? 'stop' : 'start'
                              )}
                            >
                              {deployment.status === 'online' ? <PauseIcon /> : <PlayArrowIcon />}
                            </IconButton>
                          )}
                          <IconButton 
                            size="small" 
                            color="primary"
                            disabled={deployment.status === 'deploying'}
                            onClick={() => handleDeploymentControl(deployment.id, 'share')}
                          >
                            <ShareIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* 详细信息卡片 */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>部署详情</Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {filteredDeployments.map((deployment) => (
                <Grid item xs={12} sm={6} md={4} key={`detail-${deployment.id}`}>
                  <DeploymentCard>
                    <CardContent>
                      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="h6" component="h2" gutterBottom>
                            {deployment.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {deployment.agentType} · {deployment.version}
                          </Typography>
                        </Box>
                        {renderStatusChip(deployment.status)}
                      </Box>
                      
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {deployment.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          目标: {renderTargetChip(deployment.deploymentTarget)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          响应时间: {deployment.usageStatistics.averageResponseTime}ms
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          成功率
                        </Typography>
                        <StyledLinearProgress 
                          variant="determinate" 
                          value={deployment.usageStatistics.successRate} 
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                          <Typography variant="caption">
                            {deployment.usageStatistics.successRate}%
                          </Typography>
                          <Typography variant="caption">
                            {deployment.usageStatistics.requests} 请求
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </DeploymentCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        </MainContent>
      </ContentContainer>
    </PageContainer>
  );
};

export default AgentDeployment;
