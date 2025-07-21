import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckSquare, 
  Play, 
  Pause, 
  Square, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  RotateCcw,
  Users,
  FileText,
  ArrowRight,
  Calendar,
  User,
  Zap
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import DropdownMenu from '../../components/ui/DropdownMenu';
import { StatsCard } from '../../components/ui/StatsCard';
import { Tabs } from '../../components/ui/Tabs';

// 任务状态枚举
enum TaskStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  BLOCKED = 'blocked',
  CANCELLED = 'cancelled',
  FAILED = 'failed'
}

// 任务优先级枚举
enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

interface TaskStep {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedAgent: string;
  estimatedTime: number;
  actualTime?: number;
  startTime?: string;
  endTime?: string;
  dependencies: string[];
  result?: string;
  error?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  reportId: string;
  reportTitle: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: string;
  steps: TaskStep[];
  progress: number;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
  estimatedDuration: number;
  actualDuration?: number;
  userId: string;
  userDisplayName: string;
  agentId: string;
  agentName: string;
  tags: string[];
  config: any;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: '人工智能趋势分析报告生成',
    description: '分析当前AI技术发展趋势，生成专业分析报告',
    reportId: 'r1',
    reportTitle: '2024年人工智能发展趋势分析报告',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    type: 'analysis',
    steps: [
      {
        id: 's1',
        title: '需求分析',
        description: '分析报告生成需求',
        status: TaskStatus.COMPLETED,
        assignedAgent: 'TaskPlannerAgent',
        estimatedTime: 5,
        actualTime: 4,
        startTime: '10:00',
        endTime: '10:04',
        dependencies: [],
        result: '需求分析完成，确定报告结构'
      },
      {
        id: 's2',
        title: '数据收集',
        description: '收集AI发展相关数据',
        status: TaskStatus.IN_PROGRESS,
        assignedAgent: 'TaskActorAgent',
        estimatedTime: 15,
        startTime: '10:05',
        dependencies: ['s1']
      },
      {
        id: 's3',
        title: '内容生成',
        description: '基于数据生成报告内容',
        status: TaskStatus.NOT_STARTED,
        assignedAgent: 'TaskActorAgent',
        estimatedTime: 20,
        dependencies: ['s2']
      }
    ],
    progress: 45,
    createdAt: '2024-01-16 09:30:00',
    updatedAt: '2024-01-16 10:05:00',
    startedAt: '2024-01-16 10:00:00',
    estimatedDuration: 40,
    userId: 'user1',
    userDisplayName: '张三',
    agentId: 'agent1',
    agentName: 'Multi-Agent Collaborator',
    tags: ['AI', '趋势分析', '报告生成'],
    config: {}
  },
  {
    id: '2',
    title: '市场竞争分析报告',
    description: '分析市场竞争格局，生成竞争分析报告',
    reportId: 'r2',
    reportTitle: '智能制造市场竞争分析报告',
    status: TaskStatus.COMPLETED,
    priority: TaskPriority.MEDIUM,
    type: 'research',
    steps: [
      {
        id: 's4',
        title: '市场调研',
        description: '收集市场数据',
        status: TaskStatus.COMPLETED,
        assignedAgent: 'TaskActorAgent',
        estimatedTime: 30,
        actualTime: 28,
        startTime: '14:00',
        endTime: '14:28',
        dependencies: [],
        result: '市场数据收集完成'
      },
      {
        id: 's5',
        title: '竞争分析',
        description: '分析竞争对手',
        status: TaskStatus.COMPLETED,
        assignedAgent: 'TaskActorAgent',
        estimatedTime: 25,
        actualTime: 30,
        startTime: '14:30',
        endTime: '15:00',
        dependencies: ['s4'],
        result: '竞争分析完成'
      },
      {
        id: 's6',
        title: '报告整理',
        description: '整理生成最终报告',
        status: TaskStatus.COMPLETED,
        assignedAgent: 'TaskActorAgent',
        estimatedTime: 15,
        actualTime: 12,
        startTime: '15:00',
        endTime: '15:12',
        dependencies: ['s5'],
        result: '报告生成完成'
      }
    ],
    progress: 100,
    createdAt: '2024-01-15 13:45:00',
    updatedAt: '2024-01-15 15:12:00',
    startedAt: '2024-01-15 14:00:00',
    completedAt: '2024-01-15 15:12:00',
    estimatedDuration: 70,
    actualDuration: 72,
    userId: 'user2',
    userDisplayName: '李四',
    agentId: 'agent2',
    agentName: 'Research Agent',
    tags: ['市场分析', '竞争研究', '制造业'],
    config: {}
  },
  {
    id: '3',
    title: '产品功能对比报告',
    description: '对比分析多个产品功能特性',
    reportId: 'r3',
    reportTitle: '产品功能对比分析报告',
    status: TaskStatus.BLOCKED,
    priority: TaskPriority.LOW,
    type: 'comparison',
    steps: [
      {
        id: 's7',
        title: '产品信息收集',
        description: '收集产品功能信息',
        status: TaskStatus.COMPLETED,
        assignedAgent: 'TaskActorAgent',
        estimatedTime: 10,
        actualTime: 12,
        startTime: '11:00',
        endTime: '11:12',
        dependencies: [],
        result: '产品信息收集完成'
      },
      {
        id: 's8',
        title: '功能对比分析',
        description: '进行功能对比分析',
        status: TaskStatus.BLOCKED,
        assignedAgent: 'TaskActorAgent',
        estimatedTime: 20,
        dependencies: ['s7'],
        error: '缺少关键产品数据'
      }
    ],
    progress: 30,
    createdAt: '2024-01-16 10:30:00',
    updatedAt: '2024-01-16 11:15:00',
    startedAt: '2024-01-16 11:00:00',
    estimatedDuration: 50,
    userId: 'user1',
    userDisplayName: '张三',
    agentId: 'agent1',
    agentName: 'Comparison Agent',
    tags: ['产品对比', '功能分析'],
    config: {}
  }
];

const TaskManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | 'all'>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCompleted, setShowCompleted] = useState(true);

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED: return 'bg-green-100 text-green-800 border-green-200';
      case TaskStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-800 border-blue-200';
      case TaskStatus.BLOCKED: return 'bg-red-100 text-red-800 border-red-200';
      case TaskStatus.FAILED: return 'bg-red-100 text-red-800 border-red-200';
      case TaskStatus.CANCELLED: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED: return '已完成';
      case TaskStatus.IN_PROGRESS: return '进行中';
      case TaskStatus.BLOCKED: return '被阻塞';
      case TaskStatus.FAILED: return '失败';
      case TaskStatus.CANCELLED: return '已取消';
      default: return '未开始';
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED: return <CheckCircle className="w-4 h-4 text-green-600" />;
      case TaskStatus.IN_PROGRESS: return <Clock className="w-4 h-4 text-blue-600" />;
      case TaskStatus.BLOCKED: return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case TaskStatus.FAILED: return <XCircle className="w-4 h-4 text-red-600" />;
      case TaskStatus.CANCELLED: return <XCircle className="w-4 h-4 text-yellow-600" />;
      default: return <Square className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.URGENT: return 'bg-red-100 text-red-800 border-red-200';
      case TaskPriority.HIGH: return 'bg-orange-100 text-orange-800 border-orange-200';
      case TaskPriority.MEDIUM: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case TaskPriority.LOW: return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityText = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.URGENT: return '紧急';
      case TaskPriority.HIGH: return '高';
      case TaskPriority.MEDIUM: return '中';
      case TaskPriority.LOW: return '低';
      default: return '未知';
    }
  };

  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    const matchesCompleted = showCompleted || task.status !== TaskStatus.COMPLETED;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCompleted;
  });

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setActiveTab('detail');
  };

  const handleEditTask = (task: Task) => {
    // 实现编辑任务功能
    console.log('Edit task:', task.id);
  };

  const handleDeleteTask = (task: Task) => {
    // 实现删除任务功能
    console.log('Delete task:', task.id);
  };

  const handleRestartTask = (task: Task) => {
    // 实现重启任务功能
    console.log('Restart task:', task.id);
  };

  const handlePauseTask = (task: Task) => {
    // 实现暂停任务功能
    console.log('Pause task:', task.id);
  };

  const handleResumeTask = (task: Task) => {
    // 实现恢复任务功能
    console.log('Resume task:', task.id);
  };

  const handleViewReport = (reportId: string) => {
    navigate(`/intelligent-reports/report/${reportId}`);
  };

  // 计算统计数据
  const totalTasks = mockTasks.length;
  const completedTasks = mockTasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  const inProgressTasks = mockTasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
  const blockedTasks = mockTasks.filter(t => t.status === TaskStatus.BLOCKED).length;
  const avgCompletionTime = mockTasks
    .filter(t => t.actualDuration)
    .reduce((sum, t) => sum + t.actualDuration!, 0) / (completedTasks || 1);

  const tabs = [
    { id: 'list', label: '任务列表', icon: CheckSquare },
    { id: 'detail', label: '任务详情', icon: Eye },
    { id: 'analytics', label: '数据分析', icon: FileText }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 页面标题 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CheckSquare className="w-8 h-8 text-blue-600" />
            任务管理中心
          </h1>
          <p className="text-gray-600 mt-1">监控和管理所有报告生成任务</p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="总任务数"
          value={totalTasks.toString()}
          subtitle="全部任务"
          icon={CheckSquare}
          color="blue"
        />
        <StatsCard
          title="已完成"
          value={completedTasks.toString()}
          subtitle="成功完成"
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="进行中"
          value={inProgressTasks.toString()}
          subtitle="正在执行"
          icon={Clock}
          color="yellow"
        />
        <StatsCard
          title="被阻塞"
          value={blockedTasks.toString()}
          subtitle="需要处理"
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* 标签页 */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* 任务列表 */}
      {activeTab === 'list' && (
        <div className="mt-6 space-y-6">
          {/* 搜索和过滤 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="搜索任务标题或描述..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <DropdownMenu
                  trigger={
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      状态: {selectedStatus === 'all' ? '全部' : getStatusText(selectedStatus as TaskStatus)}
                    </Button>
                  }
                >
                  <div className="py-1">
                    <button
                      onClick={() => setSelectedStatus('all')}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      全部状态
                    </button>
                    {Object.values(TaskStatus).map(status => (
                      <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        {getStatusText(status)}
                      </button>
                    ))}
                  </div>
                </DropdownMenu>
                
                <DropdownMenu
                  trigger={
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      优先级: {selectedPriority === 'all' ? '全部' : getPriorityText(selectedPriority as TaskPriority)}
                    </Button>
                  }
                >
                  <div className="py-1">
                    <button
                      onClick={() => setSelectedPriority('all')}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      全部优先级
                    </button>
                    {Object.values(TaskPriority).map(priority => (
                      <button
                        key={priority}
                        onClick={() => setSelectedPriority(priority)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        {getPriorityText(priority)}
                      </button>
                    ))}
                  </div>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showCompleted}
                  onChange={(e) => setShowCompleted(e.target.checked)}
                  className="rounded"
                />
                <span>显示已完成任务</span>
              </label>
            </div>
          </div>

          {/* 任务列表 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(task.status)}
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {task.title}
                        </h3>
                        <Badge className={getStatusColor(task.status)}>
                          {getStatusText(task.status)}
                        </Badge>
                        <Badge className={getPriorityColor(task.priority)}>
                          {getPriorityText(task.priority)}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {task.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          <button
                            onClick={() => handleViewReport(task.reportId)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            {task.reportTitle}
                          </button>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{task.agentName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{task.userDisplayName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{task.createdAt}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>进度</span>
                            <span>{task.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                task.status === TaskStatus.COMPLETED ? 'bg-green-600' :
                                task.status === TaskStatus.BLOCKED ? 'bg-red-600' :
                                'bg-blue-600'
                              }`}
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {task.actualDuration ? `${task.actualDuration}分钟` : `预计${task.estimatedDuration}分钟`}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {task.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewTask(task)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {task.status === TaskStatus.IN_PROGRESS && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePauseTask(task)}
                          className="text-orange-600 hover:text-orange-700"
                        >
                          <Pause className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {(task.status === TaskStatus.BLOCKED || task.status === TaskStatus.FAILED) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRestartTask(task)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTask(task)}
                        className="text-gray-600 hover:text-gray-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTask(task)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 任务详情 */}
      {activeTab === 'detail' && selectedTask && (
        <div className="mt-6 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {selectedTask.title}
                </h2>
                <p className="text-gray-600">{selectedTask.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(selectedTask.status)}>
                  {getStatusText(selectedTask.status)}
                </Badge>
                <Badge className={getPriorityColor(selectedTask.priority)}>
                  {getPriorityText(selectedTask.priority)}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">任务信息</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">关联报告：</span>
                    <button
                      onClick={() => handleViewReport(selectedTask.reportId)}
                      className="text-blue-600 hover:text-blue-700 ml-1"
                    >
                      {selectedTask.reportTitle}
                    </button>
                  </div>
                  <div><span className="font-medium">执行智能体：</span>{selectedTask.agentName}</div>
                  <div><span className="font-medium">创建者：</span>{selectedTask.userDisplayName}</div>
                  <div><span className="font-medium">创建时间：</span>{selectedTask.createdAt}</div>
                  <div><span className="font-medium">更新时间：</span>{selectedTask.updatedAt}</div>
                  {selectedTask.startedAt && (
                    <div><span className="font-medium">开始时间：</span>{selectedTask.startedAt}</div>
                  )}
                  {selectedTask.completedAt && (
                    <div><span className="font-medium">完成时间：</span>{selectedTask.completedAt}</div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">执行统计</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">总步骤数</div>
                    <div className="text-xl font-bold">{selectedTask.steps.length}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">完成步骤</div>
                    <div className="text-xl font-bold text-green-600">
                      {selectedTask.steps.filter(s => s.status === TaskStatus.COMPLETED).length}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">预计时间</div>
                    <div className="text-xl font-bold">{selectedTask.estimatedDuration}分钟</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">实际时间</div>
                    <div className="text-xl font-bold text-blue-600">
                      {selectedTask.actualDuration || '进行中'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">整体进度</h3>
                <span className="text-sm text-gray-600">{selectedTask.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    selectedTask.status === TaskStatus.COMPLETED ? 'bg-green-600' :
                    selectedTask.status === TaskStatus.BLOCKED ? 'bg-red-600' :
                    'bg-blue-600'
                  }`}
                  style={{ width: `${selectedTask.progress}%` }}
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">执行步骤</h3>
              <div className="space-y-3">
                {selectedTask.steps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(step.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900">{step.title}</h4>
                        <Badge className={getStatusColor(step.status)} variant="outline">
                          {getStatusText(step.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>智能体: {step.assignedAgent}</span>
                        <span>预计: {step.estimatedTime}分钟</span>
                        {step.actualTime && <span>实际: {step.actualTime}分钟</span>}
                        {step.startTime && <span>开始: {step.startTime}</span>}
                        {step.endTime && <span>完成: {step.endTime}</span>}
                      </div>
                      {step.dependencies.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          依赖: {step.dependencies.join(', ')}
                        </div>
                      )}
                      {step.result && (
                        <div className="text-xs text-green-600 mt-1">
                          结果: {step.result}
                        </div>
                      )}
                      {step.error && (
                        <div className="text-xs text-red-600 mt-1">
                          错误: {step.error}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 数据分析 */}
      {activeTab === 'analytics' && (
        <div className="mt-6 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">任务统计分析</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">成功率</div>
                <div className="text-2xl font-bold text-green-600">
                  {((completedTasks / totalTasks) * 100).toFixed(1)}%
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">平均完成时间</div>
                <div className="text-2xl font-bold text-blue-600">
                  {avgCompletionTime.toFixed(1)}分钟
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">阻塞率</div>
                <div className="text-2xl font-bold text-red-600">
                  {((blockedTasks / totalTasks) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">任务类型分布</h3>
            <div className="space-y-3">
              {['analysis', 'research', 'comparison', 'summary'].map(type => {
                const count = mockTasks.filter(t => t.type === type).length;
                const percentage = (count / totalTasks) * 100;
                return (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 capitalize">{type}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;