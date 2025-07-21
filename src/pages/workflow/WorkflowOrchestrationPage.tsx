import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stepper,
  Step,
  StepLabel,
  Tab,
  Tabs,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Avatar,
  AvatarGroup,
  LinearProgress,
  Container,
  Grid,
  alpha,
  useTheme
} from '@mui/material';
import {
  AddOutlined,
  SmartToyOutlined,
  BuildOutlined,
  SettingsOutlined,
  PlayArrowOutlined,
  PublishOutlined,
  CodeOutlined,
  ChatOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyAllOutlined,
  DashboardCustomizeOutlined,
  AutoAwesomeOutlined,
  IntegrationInstructionsOutlined,
  ApiOutlined,
  WebOutlined,
  VisibilityOutlined,
  TuneOutlined,
  AccountTreeOutlined,
  RocketLaunchOutlined,
  ShareOutlined
} from '@mui/icons-material';
import FlowDesigner from '../../components/workflow/FlowDesigner';

// 工作流状态类型
type WorkflowStatus = 'draft' | 'testing' | 'published' | 'archived';

// 工作流组件类型
interface WorkflowComponent {
  id: string;
  type: 'model' | 'tool' | 'agent';
  name: string;
  description: string;
  config: any;
  status: 'configured' | 'pending' | 'error';
}

// 工作流接口
interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  components: WorkflowComponent[];
  publishedAt?: string;
  apiEndpoint?: string;
  webChatUrl?: string;
  usage: {
    apiCalls: number;
    chatSessions: number;
  };
}

const WorkflowOrchestrationPage: React.FC = () => {
  const theme = useTheme();
  
  // 状态管理
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  // 编排步骤
  const orchestrationSteps = [
    '基础配置',
    '组件选择', 
    '流程编排',
    '测试验证',
    '发布部署'
  ];

  // 可用组件库
  const availableComponents = {
    models: [
      { id: 'gpt-4', name: 'GPT-4', description: '强大的通用语言模型', provider: 'OpenAI' },
      { id: 'claude-3', name: 'Claude-3', description: '高效的对话模型', provider: 'Anthropic' },
      { id: 'qwen-max', name: '通义千问', description: '国产大语言模型', provider: '阿里云' }
    ],
    tools: [
      { id: 'web-search', name: '网页搜索', description: '搜索实时网络信息' },
      { id: 'file-processor', name: '文件处理', description: '处理各种格式文件' },
      { id: 'api-caller', name: 'API调用', description: '调用外部API接口' }
    ],
    agents: [
      { id: 'analyst', name: '数据分析师', description: '专业数据分析Agent' },
      { id: 'writer', name: '内容创作者', description: '专业写作Agent' },
      { id: 'customer-service', name: '客服助手', description: '智能客服Agent' }
    ]
  };

  // 模拟数据加载
  useEffect(() => {
    const mockWorkflows: Workflow[] = [
      {
        id: 'wf-001',
        name: '智能客服助手',
        description: '结合知识库检索和多轮对话的客服解决方案',
        status: 'published',
        components: [
          { id: 'comp-1', type: 'model', name: 'GPT-4', description: '', config: {}, status: 'configured' },
          { id: 'comp-2', type: 'tool', name: '知识库检索', description: '', config: {}, status: 'configured' },
          { id: 'comp-3', type: 'agent', name: '客服Agent', description: '', config: {}, status: 'configured' }
        ],
        publishedAt: '2024-01-15',
        apiEndpoint: '/api/v1/chat/customer-service',
        webChatUrl: '/chat/customer-service',
        usage: { apiCalls: 1250, chatSessions: 89 }
      },
      {
        id: 'wf-002', 
        name: '内容创作流水线',
        description: '自动化内容生成、审核、发布的完整流程',
        status: 'testing',
        components: [
          { id: 'comp-4', type: 'model', name: 'Claude-3', description: '', config: {}, status: 'configured' },
          { id: 'comp-5', type: 'tool', name: '内容审核', description: '', config: {}, status: 'configured' },
          { id: 'comp-6', type: 'agent', name: '创作Agent', description: '', config: {}, status: 'pending' }
        ],
        usage: { apiCalls: 45, chatSessions: 12 }
      },
      {
        id: 'wf-003',
        name: '数据分析助手',
        description: '智能数据分析和报告生成系统',
        status: 'draft',
        components: [
          { id: 'comp-7', type: 'model', name: '通义千问', description: '', config: {}, status: 'configured' },
          { id: 'comp-8', type: 'tool', name: '数据处理', description: '', config: {}, status: 'error' }
        ],
        usage: { apiCalls: 0, chatSessions: 0 }
      }
    ];
    
    setWorkflows(mockWorkflows);
  }, []);

  // 获取状态颜色和文本
  const getStatusInfo = (status: WorkflowStatus) => {
    const statusMap = {
      draft: { color: '#64748b', text: '草稿', bgColor: alpha('#64748b', 0.1) },
      testing: { color: '#f59e0b', text: '测试中', bgColor: alpha('#f59e0b', 0.1) },
      published: { color: '#10b981', text: '已发布', bgColor: alpha('#10b981', 0.1) },
      archived: { color: '#6b7280', text: '已归档', bgColor: alpha('#6b7280', 0.1) }
    };
    return statusMap[status];
  };

  // 工作流卡片组件
  const WorkflowCard: React.FC<{ workflow: Workflow }> = ({ workflow }) => {
    const statusInfo = getStatusInfo(workflow.status);
    
    return (
      <Card sx={{
        mb: 3,
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)'
        }
      }}>
        <CardContent sx={{ p: 3 }}>
          {/* 头部信息 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mr: 2 }}>
                  {workflow.name}
                </Typography>
                <Chip
                  label={statusInfo.text}
                  size="small"
                  sx={{
                    backgroundColor: statusInfo.bgColor,
                    color: statusInfo.color,
                    border: `1px solid ${alpha(statusInfo.color, 0.3)}`,
                    fontWeight: 600
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                {workflow.description}
              </Typography>
            </Box>
            
            <IconButton size="small">
              <SettingsOutlined />
            </IconButton>
          </Box>

          {/* 组件展示 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ color: '#64748b', mb: 1, display: 'block' }}>
              编排组件 ({workflow.components.length})
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {workflow.components.map((comp) => (
                <Chip
                  key={comp.id}
                  label={comp.name}
                  size="small"
                  icon={
                    comp.type === 'model' ? <AutoAwesomeOutlined sx={{ fontSize: '14px !important' }} /> :
                    comp.type === 'tool' ? <BuildOutlined sx={{ fontSize: '14px !important' }} /> :
                    <SmartToyOutlined sx={{ fontSize: '14px !important' }} />
                  }
                  variant="outlined"
                  sx={{
                    borderColor: comp.status === 'configured' ? '#10b981' : 
                                comp.status === 'pending' ? '#f59e0b' : '#ef4444',
                    color: comp.status === 'configured' ? '#10b981' : 
                           comp.status === 'pending' ? '#f59e0b' : '#ef4444'
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* 使用统计 */}
          {workflow.status === 'published' && (
            <Box sx={{ mb: 3, p: 2, borderRadius: '12px', backgroundColor: alpha('#6366f1', 0.05) }}>
              <Typography variant="caption" sx={{ color: '#64748b', mb: 1, display: 'block' }}>
                使用统计
              </Typography>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#6366f1' }}>
                    {workflow.usage.apiCalls}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    API调用
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#8b5cf6' }}>
                    {workflow.usage.chatSessions}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    对话会话
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* 操作按钮 */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<DashboardCustomizeOutlined />}
              onClick={() => {
                setSelectedWorkflow(workflow);
                setIsConfigDialogOpen(true);
              }}
              sx={{
                backgroundColor: '#6366f1',
                borderRadius: '8px',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#4f46e5' }
              }}
            >
              编排配置
            </Button>
            
            {workflow.status === 'draft' && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<PlayArrowOutlined />}
                sx={{ borderRadius: '8px', textTransform: 'none' }}
              >
                开始测试
              </Button>
            )}
            
            {workflow.status === 'testing' && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<RocketLaunchOutlined />}
                sx={{ borderRadius: '8px', textTransform: 'none' }}
              >
                发布上线
              </Button>
            )}
            
            {workflow.status === 'published' && (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ApiOutlined />}
                  sx={{ borderRadius: '8px', textTransform: 'none' }}
                >
                  API文档
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ChatOutlined />}
                  sx={{ borderRadius: '8px', textTransform: 'none' }}
                >
                  Web对话
                </Button>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  // 组件选择面板
  const ComponentSelector: React.FC = () => (
    <Box>
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
        <Tab label="模型" />
        <Tab label="工具" />
        <Tab label="Agent" />
      </Tabs>
      
      <Box sx={{ mt: 2 }}>
        {activeTab === 0 && (
          <List>
            {availableComponents.models.map((model) => (
              <ListItem key={model.id}>
                <ListItemButton sx={{ borderRadius: '8px' }}>
                  <ListItemIcon>
                    <AutoAwesomeOutlined />
                  </ListItemIcon>
                  <ListItemText
                    primary={model.name}
                    secondary={`${model.description} - ${model.provider}`}
                  />
                  <Button size="small" variant="outlined">
                    添加
                  </Button>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
        
        {activeTab === 1 && (
          <List>
            {availableComponents.tools.map((tool) => (
              <ListItem key={tool.id}>
                <ListItemButton sx={{ borderRadius: '8px' }}>
                  <ListItemIcon>
                    <BuildOutlined />
                  </ListItemIcon>
                  <ListItemText
                    primary={tool.name}
                    secondary={tool.description}
                  />
                  <Button size="small" variant="outlined">
                    添加
                  </Button>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
        
        {activeTab === 2 && (
          <List>
            {availableComponents.agents.map((agent) => (
              <ListItem key={agent.id}>
                <ListItemButton sx={{ borderRadius: '8px' }}>
                  <ListItemIcon>
                    <SmartToyOutlined />
                  </ListItemIcon>
                  <ListItemText
                    primary={agent.name}
                    secondary={agent.description}
                  />
                  <Button size="small" variant="outlined">
                    添加
                  </Button>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)'
    }}>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* 页面头部 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
              工作流编排中心
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              设计、配置、测试和发布您的AI工作流，创建智能助手和API服务
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            onClick={() => setIsCreateDialogOpen(true)}
            sx={{
              backgroundColor: '#6366f1',
              borderRadius: '12px',
              px: 3,
              py: 1.5,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              '&:hover': { backgroundColor: '#4f46e5' }
            }}
          >
            创建工作流
          </Button>
        </Box>

        {/* 快速统计 */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: '16px', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#6366f1', mb: 1 }}>
                  {workflows.length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  总工作流
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: '16px', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#10b981', mb: 1 }}>
                  {workflows.filter(w => w.status === 'published').length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  已发布
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: '16px', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#8b5cf6', mb: 1 }}>
                  {workflows.reduce((sum, w) => sum + w.usage.apiCalls, 0)}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  API调用总数
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: '16px', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#f59e0b', mb: 1 }}>
                  {workflows.reduce((sum, w) => sum + w.usage.chatSessions, 0)}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  对话会话
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 工作流列表 */}
        <Box>
          {workflows.map((workflow) => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </Box>

        {/* 编排配置对话框 */}
        <Dialog
          open={isConfigDialogOpen}
          onClose={() => setIsConfigDialogOpen(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: { borderRadius: '16px', minHeight: '80vh' }
          }}
        >
          <DialogTitle sx={{ p: 3, pb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              工作流编排 - {selectedWorkflow?.name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
              配置模型、工具和Agent，设计执行流程
            </Typography>
          </DialogTitle>
          
          <DialogContent sx={{ p: 3, pt: 1 }}>
            <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
              {orchestrationSteps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {currentStep === 1 && <ComponentSelector />}
            
            {currentStep === 2 && (
              <>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  可视化流程编排
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                  拖拽节点，连接组件，设计您的AI工作流执行路径
                </Typography>
                <FlowDesigner />
              </>
            )}
          </DialogContent>
          
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(prev => prev - 1)}
            >
              上一步
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                if (currentStep < orchestrationSteps.length - 1) {
                  setCurrentStep(prev => prev + 1);
                } else {
                  setIsConfigDialogOpen(false);
                }
              }}
              sx={{ backgroundColor: '#6366f1', '&:hover': { backgroundColor: '#4f46e5' } }}
            >
              {currentStep === orchestrationSteps.length - 1 ? '完成' : '下一步'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default WorkflowOrchestrationPage; 