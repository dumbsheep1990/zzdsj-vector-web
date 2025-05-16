import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  IconButton,
  Tab,
  Tabs,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Stack
} from '@mui/material';
import { styled } from '@mui/system';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate, useLocation } from 'react-router-dom';
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

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
}));

const ToolCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: '8px',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  position: 'relative',
  overflow: 'visible',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
    background: 'linear-gradient(to bottom, #00c9ff, #92fe9d)',
    borderTopLeftRadius: '8px',
    borderBottomLeftRadius: '8px',
  },
}));

// 智能体构建器页面
const AgentBuilder: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useAppContext();
  const [activeStep, setActiveStep] = useState(0);
  const [agentName, setAgentName] = useState('');
  const [description, setDescription] = useState('');
  const [baseAgentType, setBaseAgentType] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  
  // 检查URL参数，判断是创建还是部署操作
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const templateId = params.get('template');
    const action = params.get('action');
    
    if (templateId) {
      // 从模板加载默认值
      console.log('使用模板创建:', templateId);
    }
    
    if (action === 'deploy') {
      // 如果是部署操作，设置到部署步骤
      setActiveStep(3);
    }
  }, [location]);

  const handleSave = () => {
    // 保存智能体定义的逻辑
    console.log('保存智能体:', { agentName, description, baseAgentType, isPublic });
    // 保存成功后返回列表页
    navigate('/agent-system/list');
  };

  const handleBack = () => {
    navigate('/agent-system/list');
  };
  
  const handleNextStep = () => {
    setActiveStep((prev) => prev < 3 ? prev + 1 : prev);
  };
  
  const handlePrevStep = () => {
    setActiveStep((prev) => prev > 0 ? prev - 1 : prev);
  };
  
  // 页面标题及操作
  const primaryActions = [
    {
      icon: <SaveIcon />,
      label: '保存智能体',
      onClick: handleSave
    }
  ];
  
  // 页面标题
  const getTitle = () => {
    if (activeStep === 3) return '部署智能体';
    return '创建智能体';
  };
  
  // 页面说明
  const getDescription = () => {
    if (activeStep === 3) return '配置智能体的部署参数和目标环境';
    return '选择基础类型并自定义智能体的工具链';
  };
  
  // 步骤标题
  const steps = [
    '基础信息',
    '系统配置',
    '工具链配置',
    '部署设置'
  ];

  return (
    <PageContainer>
      <PageHeader
        parentTitle="智能体系统"
        title={getTitle()}
        description={getDescription()}
        primaryActions={primaryActions}
        username={state.username}
      />
      
      <ContentContainer>
        <MainContent>
          {/* 步骤导航 */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  onClick={() => setActiveStep(index)}
                  sx={{ cursor: 'pointer' }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* 步骤内容 */}
          {activeStep === 0 && (
            <StyledCard>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>基本信息</Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label="智能体名称"
                      fullWidth
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      required
                      placeholder="输入智能体的名称"
                      helperText="请输入简洁明了的名称"
                      variant="outlined"
                      sx={{ 
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl 
                      fullWidth 
                      required
                      sx={{ 
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px'
                        }
                      }}
                    >
                      <InputLabel>基础智能体类型</InputLabel>
                      <Select
                        value={baseAgentType}
                        label="基础智能体类型"
                        onChange={(e) => setBaseAgentType(e.target.value)}
                      >
                        <MenuItem value="qa">问答型智能体</MenuItem>
                        <MenuItem value="chat">对话型智能体</MenuItem>
                        <MenuItem value="tool">工具型智能体</MenuItem>
                        <MenuItem value="autonomous">自主型智能体</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="描述"
                      fullWidth
                      multiline
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="描述该智能体的功能和用途"
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={handleNextStep}
                  sx={{ background: 'linear-gradient(90deg, #00c9ff 0%, #92fe9d 100%)', textTransform: 'none' }}
                >
                  下一步
                </Button>
              </Box>
            </StyledCard>
          )}
          
          {activeStep === 1 && (
            <StyledCard>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>系统配置</Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label="系统提示词"
                      fullWidth
                      multiline
                      rows={6}
                      placeholder="输入智能体的系统提示词，用于指导其行为和功能"
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={handlePrevStep}
                  startIcon={<ArrowBackIcon />}
                >
                  上一步
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleNextStep}
                  sx={{ background: 'linear-gradient(90deg, #00c9ff 0%, #92fe9d 100%)', textTransform: 'none' }}
                >
                  下一步
                </Button>
              </Box>
            </StyledCard>
          )}
          
          {activeStep === 2 && (
            <StyledCard>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>工具链配置</Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Paper variant="outlined" sx={{ p: 3, mb: 3, bgcolor: '#f8f9fa', borderRadius: '8px' }}>
                  <Typography variant="body1" gutterBottom>
                    工具链定义了智能体可以使用的工具及其调用项序
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    在此区域配置智能体的工具链。您可以添加、删除和排序工具，以及设置每个工具的参数和使用条件。
                  </Typography>
                </Paper>
                
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<AddIcon />}
                    onClick={() => console.log('添加工具')}
                    sx={{ textTransform: 'none' }}
                  >
                    添加工具
                  </Button>
                </Box>
                
                {/* 工具卡片样例 */}
                <ToolCard sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4} md={3}>
                      <Typography variant="subtitle1" fontWeight="bold">知识库检索</Typography>
                      <Typography variant="caption" color="text.secondary">工具类型: API</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                      <Typography variant="body2">从知识库中检索相关内容，并根据相关性返回结果</Typography>
                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton size="small" color="primary">
                          <SettingsIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </ToolCard>
              </CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={handlePrevStep}
                  startIcon={<ArrowBackIcon />}
                >
                  上一步
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleNextStep}
                  sx={{ background: 'linear-gradient(90deg, #00c9ff 0%, #92fe9d 100%)', textTransform: 'none' }}
                >
                  下一步
                </Button>
              </Box>
            </StyledCard>
          )}
          
          {activeStep === 3 && (
            <StyledCard>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>部署设置</Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>部署环境</InputLabel>
                      <Select
                        label="部署环境"
                        defaultValue="cloud"
                      >
                        <MenuItem value="cloud">云端部署</MenuItem>
                        <MenuItem value="local">本地部署</MenuItem>
                        <MenuItem value="edge">边缘部署</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>访问权限</InputLabel>
                      <Select
                        label="访问权限"
                        defaultValue="private"
                      >
                        <MenuItem value="public">公开</MenuItem>
                        <MenuItem value="private">私有</MenuItem>
                        <MenuItem value="shared">共享</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={handlePrevStep}
                  startIcon={<ArrowBackIcon />}
                >
                  上一步
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleSave}
                  startIcon={<CloudUploadIcon />}
                  sx={{ background: 'linear-gradient(90deg, #00c9ff 0%, #92fe9d 100%)', textTransform: 'none' }}
                >
                  部署智能体
                </Button>
              </Box>
            </StyledCard>
          )}
        </MainContent>
      </ContentContainer>
    </PageContainer>
  );
};

export default AgentBuilder;
