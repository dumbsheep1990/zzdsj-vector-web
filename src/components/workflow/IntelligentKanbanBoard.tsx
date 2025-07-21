import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Fab,
  Tooltip,
  LinearProgress,
  Grid,
  alpha,
  useTheme,
  Drawer,
  Menu,
  MenuItem
} from '@mui/material';
import {
  AddOutlined,
  SmartToyOutlined,
  DragIndicatorOutlined,
  MoreVertOutlined,
  PersonOutlined,
  ScheduleOutlined,
  FlagOutlined,
  ChatOutlined,
  AutoAwesomeOutlined,
  PlayArrowOutlined,
  EditOutlined,
  DeleteOutlined,
  AssignmentOutlined,
  TrendingUpOutlined,
  PsychologyOutlined,
  RefreshOutlined
} from '@mui/icons-material';

// 任务状态类型
type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

// 任务接口
interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  aiAgent?: {
    id: string;
    name: string;
    status: 'idle' | 'working' | 'waiting';
  };
  dueDate?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  progress: number;
  estimatedHours?: number;
  actualHours?: number;
}

// 列定义
interface Column {
  id: TaskStatus;
  title: string;
  color: string;
  limit?: number;
}

interface IntelligentKanbanBoardProps {
  workflowId: string;
  onTaskUpdate?: (task: Task) => void;
  onAIAssist?: (taskId: string, action: string) => void;
}

const IntelligentKanbanBoard: React.FC<IntelligentKanbanBoardProps> = ({
  workflowId,
  onTaskUpdate,
  onAIAssist
}) => {
  const theme = useTheme();
  
  // 状态管理
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    taskId: string;
  } | null>(null);

  // 列配置
  const columns: Column[] = [
    { id: 'todo', title: '待办', color: '#64748b' },
    { id: 'in_progress', title: '进行中', color: '#3b82f6', limit: 3 },
    { id: 'review', title: '待审核', color: '#f59e0b' },
    { id: 'done', title: '已完成', color: '#10b981' }
  ];

  // 模拟数据加载
  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      
      // 模拟API调用
      setTimeout(() => {
        const mockTasks: Task[] = [
          {
            id: 'task-001',
            title: '客户需求分析',
            description: '分析客户反馈，提取关键需求点',
            status: 'todo',
            priority: 'high',
            assignee: {
              id: 'user-001',
              name: '张三',
              avatar: '👨‍💼'
            },
            aiAgent: {
              id: 'ai-001',
              name: 'AI-Analyst',
              status: 'idle'
            },
            dueDate: '2024-01-20',
            tags: ['分析', '客户'],
            createdAt: '2024-01-15',
            updatedAt: '2024-01-15',
            progress: 0,
            estimatedHours: 4
          },
          {
            id: 'task-002',
            title: 'UI设计优化',
            description: '根据用户反馈优化界面设计',
            status: 'in_progress',
            priority: 'medium',
            assignee: {
              id: 'user-002',
              name: '李四',
              avatar: '🎨'
            },
            aiAgent: {
              id: 'ai-002',
              name: 'AI-Designer',
              status: 'working'
            },
            dueDate: '2024-01-22',
            tags: ['设计', 'UI'],
            createdAt: '2024-01-14',
            updatedAt: '2024-01-16',
            progress: 65,
            estimatedHours: 6,
            actualHours: 3.5
          },
          {
            id: 'task-003',
            title: '性能测试报告',
            description: '生成系统性能测试完整报告',
            status: 'review',
            priority: 'low',
            assignee: {
              id: 'user-003',
              name: '王五',
              avatar: '🔧'
            },
            dueDate: '2024-01-18',
            tags: ['测试', '性能'],
            createdAt: '2024-01-10',
            updatedAt: '2024-01-17',
            progress: 90,
            estimatedHours: 8,
            actualHours: 7.2
          },
          {
            id: 'task-004',
            title: '文档整理',
            description: '整理项目相关文档',
            status: 'done',
            priority: 'low',
            assignee: {
              id: 'user-001',
              name: '张三',
              avatar: '👨‍💼'
            },
            dueDate: '2024-01-15',
            tags: ['文档'],
            createdAt: '2024-01-12',
            updatedAt: '2024-01-16',
            progress: 100,
            estimatedHours: 2,
            actualHours: 2.5
          }
        ];
        
        setTasks(mockTasks);
        setIsLoading(false);
      }, 1000);
    };

    loadTasks();
  }, [workflowId]);

  // 获取优先级颜色
  const getPriorityColor = (priority: TaskPriority) => {
    const colors = {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#ef4444',
      urgent: '#dc2626'
    };
    return colors[priority];
  };

  // 处理任务状态更新
  const handleTaskStatusUpdate = useCallback((taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
        : task
    ));
    
    onTaskUpdate?.(tasks.find(t => t.id === taskId)!);
  }, [tasks, onTaskUpdate]);

  // AI智能协助
  const handleAIAssist = useCallback((taskId: string, action: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId && task.aiAgent
        ? { 
            ...task, 
            aiAgent: { ...task.aiAgent, status: 'working' as const }
          }
        : task
    ));
    
    onAIAssist?.(taskId, action);
    
    // 模拟AI处理
    setTimeout(() => {
      setTasks(prev => prev.map(task => 
        task.id === taskId && task.aiAgent
          ? { 
              ...task, 
              aiAgent: { ...task.aiAgent, status: 'idle' as const },
              progress: Math.min(task.progress + 20, 100)
            }
          : task
      ));
    }, 3000);
  }, [onAIAssist]);

  // 任务卡片组件
  const TaskCard: React.FC<{ task: Task }> = ({ task }) => (
    <Card
      sx={{
        mb: 2,
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
        }
      }}
      onClick={() => {
        setSelectedTask(task);
        setIsTaskDialogOpen(true);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenu({
          mouseX: e.clientX - 2,
          mouseY: e.clientY - 4,
          taskId: task.id
        });
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {/* 任务头部 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Chip
            size="small"
            label={task.priority}
            sx={{
              backgroundColor: alpha(getPriorityColor(task.priority), 0.1),
              color: getPriorityColor(task.priority),
              border: `1px solid ${alpha(getPriorityColor(task.priority), 0.3)}`,
              fontWeight: 600,
              fontSize: '0.7rem'
            }}
          />
          <IconButton size="small" onClick={(e) => e.stopPropagation()}>
            <MoreVertOutlined fontSize="small" />
          </IconButton>
        </Box>

        {/* 任务标题 */}
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>
          {task.title}
        </Typography>

        {/* 任务描述 */}
        <Typography variant="body2" sx={{ color: '#64748b', mb: 2, fontSize: '0.8rem' }}>
          {task.description}
        </Typography>

        {/* 进度条 */}
        {task.progress > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                进度
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                {task.progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={task.progress}
              sx={{
                height: 4,
                borderRadius: 2,
                backgroundColor: alpha(getPriorityColor(task.priority), 0.1),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getPriorityColor(task.priority),
                  borderRadius: 2
                }
              }}
            />
          </Box>
        )}

        {/* AI智能体状态 */}
        {task.aiAgent && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            p: 1,
            borderRadius: '8px',
            background: alpha('#6366f1', 0.1),
            border: `1px solid ${alpha('#6366f1', 0.2)}`
          }}>
            <SmartToyOutlined sx={{ fontSize: '1rem', mr: 1, color: '#6366f1' }} />
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#6366f1' }}>
              {task.aiAgent.name}
            </Typography>
            <Chip
              size="small"
              label={task.aiAgent.status}
              sx={{
                ml: 'auto',
                height: '16px',
                fontSize: '0.6rem',
                backgroundColor: task.aiAgent.status === 'working' 
                  ? alpha('#f59e0b', 0.1) 
                  : alpha('#10b981', 0.1),
                color: task.aiAgent.status === 'working' ? '#f59e0b' : '#10b981'
              }}
            />
          </Box>
        )}

        {/* 任务底部信息 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {task.assignee && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ width: 20, height: 20, mr: 1, fontSize: '0.7rem' }}>
                {task.assignee.avatar}
              </Avatar>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                {task.assignee.name}
              </Typography>
            </Box>
          )}
          
          {task.dueDate && (
            <Typography variant="caption" sx={{ color: '#9ca3af' }}>
              {task.dueDate}
            </Typography>
          )}
        </Box>

        {/* 标签 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
          {task.tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              variant="outlined"
              sx={{
                fontSize: '0.6rem',
                height: '18px',
                borderColor: alpha('#64748b', 0.3),
                color: '#64748b'
              }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  // 列组件
  const KanbanColumn: React.FC<{ column: Column }> = ({ column }) => {
    const columnTasks = tasks.filter(task => task.status === column.id);
    
    return (
      <Card
        sx={{
          minHeight: '600px',
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)'
        }}
      >
        <CardContent sx={{ p: 2 }}>
          {/* 列头部 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: column.color,
                  mr: 1
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                {column.title}
              </Typography>
              <Chip
                label={columnTasks.length}
                size="small"
                sx={{ ml: 1, backgroundColor: alpha(column.color, 0.1), color: column.color }}
              />
            </Box>
            
            {column.limit && (
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                限制: {column.limit}
              </Typography>
            )}
          </Box>

          {/* 添加任务按钮 */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<AddOutlined />}
            onClick={() => setIsCreateTaskOpen(true)}
            sx={{
              mb: 2,
              borderRadius: '8px',
              borderStyle: 'dashed',
              borderColor: alpha(column.color, 0.3),
              color: column.color,
              '&:hover': {
                borderColor: column.color,
                backgroundColor: alpha(column.color, 0.05)
              }
            }}
          >
            添加任务
          </Button>

          {/* 任务列表 */}
          <Box>
            {columnTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ p: 3, minHeight: '100vh', background: '#f8fafc' }}>
      {/* 头部工具栏 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
          智能看板
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<ChatOutlined />}
            onClick={() => setAiChatOpen(true)}
            sx={{ borderRadius: '10px' }}
          >
            AI助手
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshOutlined />}
            sx={{ borderRadius: '10px' }}
          >
            刷新
          </Button>
        </Box>
      </Box>

      {/* 看板网格 */}
      <Grid container spacing={2}>
        {columns.map((column) => (
          <Grid item xs={12} sm={6} md={3} key={column.id}>
            <KanbanColumn column={column} />
          </Grid>
        ))}
      </Grid>

      {/* 浮动AI助手按钮 */}
      <Fab
        color="primary"
        aria-label="AI智能助手"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          }
        }}
        onClick={() => setAiChatOpen(true)}
      >
        <AutoAwesomeOutlined />
      </Fab>

      {/* 右键菜单 */}
      <Menu
        open={contextMenu !== null}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={() => {
          if (contextMenu) {
            handleAIAssist(contextMenu.taskId, 'analyze');
          }
          setContextMenu(null);
        }}>
          <PsychologyOutlined sx={{ mr: 1 }} />
          AI分析
        </MenuItem>
        <MenuItem onClick={() => setContextMenu(null)}>
          <EditOutlined sx={{ mr: 1 }} />
          编辑
        </MenuItem>
        <MenuItem onClick={() => setContextMenu(null)}>
          <DeleteOutlined sx={{ mr: 1 }} />
          删除
        </MenuItem>
      </Menu>

      {/* AI聊天抽屉 */}
      <Drawer
        anchor="right"
        open={aiChatOpen}
        onClose={() => setAiChatOpen(false)}
        PaperProps={{
          sx: {
            width: 400,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)'
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            AI智能助手
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            您好！我是您的AI工作流助手，可以帮助您：
          </Typography>
          <List sx={{ mt: 2 }}>
            <ListItem>
              <ListItemText 
                primary="任务优化建议"
                secondary="分析当前任务并提供优化建议"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="智能分配"
                secondary="根据团队成员能力智能分配任务"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="进度预测"
                secondary="基于历史数据预测项目完成时间"
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default IntelligentKanbanBoard; 