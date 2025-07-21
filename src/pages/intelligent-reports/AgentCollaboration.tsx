import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Play,
  Pause,
  Square,
  Settings,
  Eye,
  Edit,
  Trash2,
  MessageCircle,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Zap,
  ArrowRight,
  User,
  Calendar,
  FileText,
  Bot
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import DropdownMenu from '../../components/ui/DropdownMenu';
import { StatsCard } from '../../components/ui/StatsCard';
import { Tabs } from '../../components/ui/Tabs';

// 智能体状态枚举
enum AgentStatus {
  IDLE = 'idle',
  ACTIVE = 'active',
  BUSY = 'busy',
  ERROR = 'error',
  OFFLINE = 'offline'
}

// 协作会话状态枚举
enum SessionStatus {
  PLANNING = 'planning',
  EXECUTING = 'executing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  PAUSED = 'paused'
}

// 消息类型枚举
enum MessageType {
  SYSTEM = 'system',
  AGENT = 'agent',
  USER = 'user',
  TASK = 'task',
  RESULT = 'result'
}

interface Agent {
  id: string;
  name: string;
  type: string;
  description: string;
  status: AgentStatus;
  capabilities: string[];
  currentTask?: string;
  performance: {
    tasksCompleted: number;
    successRate: number;
    avgResponseTime: number;
  };
  lastActive: string;
  isOnline: boolean;
}

interface CollaborationMessage {
  id: string;
  type: MessageType;
  sender: string;
  content: string;
  timestamp: string;
  sessionId: string;
  metadata?: any;
}

interface CollaborationSession {
  id: string;
  title: string;
  description: string;
  status: SessionStatus;
  participants: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  progress: number;
  currentStep: string;
  totalSteps: number;
  createdBy: string;
  reportId?: string;
}

const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'TaskPlannerAgent',
    type: 'planner',
    description: '任务规划智能体，负责分析需求和制定执行计划',
    status: AgentStatus.ACTIVE,
    capabilities: ['需求分析', '任务拆解', '计划制定', '资源调度'],
    currentTask: '分析报告生成需求',
    performance: {
      tasksCompleted: 245,
      successRate: 95.2,
      avgResponseTime: 2.3
    },
    lastActive: '2024-01-16 10:30:00',
    isOnline: true
  },
  {
    id: '2',
    name: 'TaskActorAgent',
    type: 'executor',
    description: '任务执行智能体，负责具体任务的执行和结果输出',
    status: AgentStatus.BUSY,
    capabilities: ['数据收集', '信息处理', '内容生成', '结果输出'],
    currentTask: '收集AI发展趋势数据',
    performance: {
      tasksCompleted: 189,
      successRate: 92.7,
      avgResponseTime: 5.6
    },
    lastActive: '2024-01-16 10:25:00',
    isOnline: true
  },
  {
    id: '3',
    name: 'QualityControlAgent',
    type: 'reviewer',
    description: '质量控制智能体，负责检查和优化生成内容',
    status: AgentStatus.IDLE,
    capabilities: ['质量检查', '内容优化', '格式校验', '错误修正'],
    performance: {
      tasksCompleted: 156,
      successRate: 98.1,
      avgResponseTime: 3.2
    },
    lastActive: '2024-01-16 10:15:00',
    isOnline: true
  },
  {
    id: '4',
    name: 'CoordinatorAgent',
    type: 'coordinator',
    description: '协调管理智能体，负责整体流程协调和异常处理',
    status: AgentStatus.ACTIVE,
    capabilities: ['流程协调', '异常处理', '资源管理', '状态监控'],
    currentTask: '监控整体协作进度',
    performance: {
      tasksCompleted: 78,
      successRate: 94.8,
      avgResponseTime: 1.8
    },
    lastActive: '2024-01-16 10:32:00',
    isOnline: true
  }
];

const mockSessions: CollaborationSession[] = [
  {
    id: '1',
    title: 'AI趋势分析报告协作',
    description: '多智能体协作生成人工智能发展趋势分析报告',
    status: SessionStatus.EXECUTING,
    participants: ['1', '2', '3', '4'],
    createdAt: '2024-01-16 10:00:00',
    updatedAt: '2024-01-16 10:30:00',
    progress: 65,
    currentStep: '数据收集与分析',
    totalSteps: 6,
    createdBy: '张三',
    reportId: 'r1'
  },
  {
    id: '2',
    title: '市场竞争分析协作',
    description: '智能体协作完成市场竞争格局分析',
    status: SessionStatus.COMPLETED,
    participants: ['1', '2', '3'],
    createdAt: '2024-01-15 14:00:00',
    updatedAt: '2024-01-15 16:30:00',
    completedAt: '2024-01-15 16:30:00',
    progress: 100,
    currentStep: '已完成',
    totalSteps: 5,
    createdBy: '李四',
    reportId: 'r2'
  }
];

const mockMessages: CollaborationMessage[] = [
  {
    id: '1',
    type: MessageType.SYSTEM,
    sender: 'System',
    content: '协作会话已启动，开始任务规划阶段',
    timestamp: '10:00:00',
    sessionId: '1'
  },
  {
    id: '2',
    type: MessageType.AGENT,
    sender: 'TaskPlannerAgent',
    content: '已完成需求分析，识别出6个主要任务步骤：1.需求分析 2.数据收集 3.信息处理 4.内容生成 5.质量检查 6.格式整理',
    timestamp: '10:02:00',
    sessionId: '1'
  },
  {
    id: '3',
    type: MessageType.AGENT,
    sender: 'TaskActorAgent',
    content: '收到任务分配，开始执行数据收集任务。预计完成时间：15分钟',
    timestamp: '10:05:00',
    sessionId: '1'
  },
  {
    id: '4',
    type: MessageType.TASK,
    sender: 'TaskActorAgent',
    content: '数据收集进度：已完成65%，收集到AI发展相关数据123条',
    timestamp: '10:15:00',
    sessionId: '1'
  },
  {
    id: '5',
    type: MessageType.AGENT,
    sender: 'CoordinatorAgent',
    content: '协调状态更新：当前整体进度65%，所有智能体运行正常',
    timestamp: '10:20:00',
    sessionId: '1'
  }
];

const AgentCollaboration: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<AgentStatus | 'all'>('all');
  const [selectedSession, setSelectedSession] = useState<CollaborationSession | null>(null);
  const [messages, setMessages] = useState<CollaborationMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case AgentStatus.ACTIVE: return 'bg-green-100 text-green-800 border-green-200';
      case AgentStatus.BUSY: return 'bg-blue-100 text-blue-800 border-blue-200';
      case AgentStatus.IDLE: return 'bg-gray-100 text-gray-800 border-gray-200';
      case AgentStatus.ERROR: return 'bg-red-100 text-red-800 border-red-200';
      case AgentStatus.OFFLINE: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: AgentStatus) => {
    switch (status) {
      case AgentStatus.ACTIVE: return '活跃';
      case AgentStatus.BUSY: return '忙碌';
      case AgentStatus.IDLE: return '空闲';
      case AgentStatus.ERROR: return '错误';
      case AgentStatus.OFFLINE: return '离线';
      default: return '未知';
    }
  };

  const getStatusIcon = (status: AgentStatus) => {
    switch (status) {
      case AgentStatus.ACTIVE: return <CheckCircle className="w-4 h-4 text-green-600" />;
      case AgentStatus.BUSY: return <Clock className="w-4 h-4 text-blue-600 animate-spin" />;
      case AgentStatus.IDLE: return <Clock className="w-4 h-4 text-gray-600" />;
      case AgentStatus.ERROR: return <XCircle className="w-4 h-4 text-red-600" />;
      case AgentStatus.OFFLINE: return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
    }
  };

  const getSessionStatusColor = (status: SessionStatus) => {
    switch (status) {
      case SessionStatus.COMPLETED: return 'bg-green-100 text-green-800 border-green-200';
      case SessionStatus.EXECUTING: return 'bg-blue-100 text-blue-800 border-blue-200';
      case SessionStatus.PLANNING: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case SessionStatus.FAILED: return 'bg-red-100 text-red-800 border-red-200';
      case SessionStatus.PAUSED: return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSessionStatusText = (status: SessionStatus) => {
    switch (status) {
      case SessionStatus.COMPLETED: return '已完成';
      case SessionStatus.EXECUTING: return '执行中';
      case SessionStatus.PLANNING: return '规划中';
      case SessionStatus.FAILED: return '失败';
      case SessionStatus.PAUSED: return '暂停';
      default: return '未知';
    }
  };

  const getMessageTypeColor = (type: MessageType) => {
    switch (type) {
      case MessageType.SYSTEM: return 'bg-gray-100 text-gray-800';
      case MessageType.AGENT: return 'bg-blue-100 text-blue-800';
      case MessageType.USER: return 'bg-green-100 text-green-800';
      case MessageType.TASK: return 'bg-yellow-100 text-yellow-800';
      case MessageType.RESULT: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAgents = mockAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || agent.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateSession = () => {
    // 实现创建协作会话功能
    console.log('Create collaboration session');
  };

  const handleJoinSession = (sessionId: string) => {
    // 实现加入会话功能
    console.log('Join session:', sessionId);
  };

  const handleViewSession = (session: CollaborationSession) => {
    setSelectedSession(session);
    setActiveTab('session');
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: CollaborationMessage = {
      id: Date.now().toString(),
      type: MessageType.USER,
      sender: 'Current User',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString(),
      sessionId: selectedSession?.id || '1'
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleControlSession = (action: 'start' | 'pause' | 'stop') => {
    console.log(`Session ${action}:`, selectedSession?.id);
  };

  const handleViewReport = (reportId: string) => {
    navigate(`/intelligent-reports/report/${reportId}`);
  };

  // 计算统计数据
  const totalAgents = mockAgents.length;
  const activeAgents = mockAgents.filter(a => a.status === AgentStatus.ACTIVE).length;
  const busyAgents = mockAgents.filter(a => a.status === AgentStatus.BUSY).length;
  const activeSessions = mockSessions.filter(s => s.status === SessionStatus.EXECUTING).length;

  const tabs = [
    { id: 'overview', label: '概览', icon: Users },
    { id: 'agents', label: '智能体', icon: Bot },
    { id: 'sessions', label: '协作会话', icon: MessageCircle },
    { id: 'session', label: '会话详情', icon: Eye }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 页面标题 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-8 h-8 text-blue-600" />
            智能体协作中心
          </h1>
          <p className="text-gray-600 mt-1">管理和监控多智能体协作任务</p>
        </div>
        <Button 
          onClick={handleCreateSession}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          创建协作会话
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="总智能体数"
          value={totalAgents.toString()}
          subtitle="可用智能体"
          icon={Bot}
          color="blue"
        />
        <StatsCard
          title="活跃智能体"
          value={activeAgents.toString()}
          subtitle="正在运行"
          icon={Activity}
          color="green"
        />
        <StatsCard
          title="忙碌智能体"
          value={busyAgents.toString()}
          subtitle="执行任务中"
          icon={Zap}
          color="yellow"
        />
        <StatsCard
          title="活跃会话"
          value={activeSessions.toString()}
          subtitle="协作进行中"
          icon={MessageCircle}
          color="purple"
        />
      </div>

      {/* 标签页 */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* 概览页面 */}
      {activeTab === 'overview' && (
        <div className="mt-6 space-y-6">
          {/* 实时状态监控 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">实时状态监控</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">智能体状态分布</h4>
                <div className="space-y-2">
                  {Object.values(AgentStatus).map(status => {
                    const count = mockAgents.filter(a => a.status === status).length;
                    const percentage = (count / totalAgents) * 100;
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 flex items-center gap-2">
                          {getStatusIcon(status)}
                          {getStatusText(status)}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
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
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">协作会话状态</h4>
                <div className="space-y-2">
                  {Object.values(SessionStatus).map(status => {
                    const count = mockSessions.filter(s => s.status === status).length;
                    const percentage = (count / mockSessions.length) * 100;
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                          {getSessionStatusText(status)}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full"
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
          </div>

          {/* 最近活动 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">最近活动</h3>
            <div className="space-y-3">
              {mockMessages.slice(0, 5).map(message => (
                <div key={message.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Badge className={getMessageTypeColor(message.type)} variant="outline">
                    {message.type}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{message.sender}</span>
                      <span className="text-xs text-gray-500">{message.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 智能体页面 */}
      {activeTab === 'agents' && (
        <div className="mt-6 space-y-6">
          {/* 搜索和过滤 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="搜索智能体名称或描述..."
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
                      状态: {selectedStatus === 'all' ? '全部' : getStatusText(selectedStatus as AgentStatus)}
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
                    {Object.values(AgentStatus).map(status => (
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
              </div>
            </div>
          </div>

          {/* 智能体列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map(agent => (
              <div key={agent.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                      <p className="text-sm text-gray-500">{agent.type}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(agent.status)}>
                    {getStatusText(agent.status)}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{agent.description}</p>
                
                {agent.currentTask && (
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700">当前任务:</span>
                    <p className="text-sm text-gray-600">{agent.currentTask}</p>
                  </div>
                )}
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">核心能力</h4>
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.map(capability => (
                      <Badge key={capability} variant="outline" className="text-xs">
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">完成任务:</span>
                    <div className="font-medium">{agent.performance.tasksCompleted}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">成功率:</span>
                    <div className="font-medium text-green-600">{agent.performance.successRate}%</div>
                  </div>
                  <div>
                    <span className="text-gray-600">响应时间:</span>
                    <div className="font-medium">{agent.performance.avgResponseTime}s</div>
                  </div>
                  <div>
                    <span className="text-gray-600">最后活跃:</span>
                    <div className="font-medium">{agent.lastActive}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 协作会话页面 */}
      {activeTab === 'sessions' && (
        <div className="mt-6 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">协作会话列表</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {mockSessions.map(session => (
                <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">{session.title}</h4>
                        <Badge className={getSessionStatusColor(session.status)}>
                          {getSessionStatusText(session.status)}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">{session.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {session.participants.length} 个智能体
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {session.createdBy}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {session.createdAt}
                        </span>
                        {session.reportId && (
                          <button
                            onClick={() => handleViewReport(session.reportId!)}
                            className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            <FileText className="w-4 h-4" />
                            查看报告
                          </button>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>进度: {session.currentStep}</span>
                            <span>{session.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${session.progress}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {session.currentStep} / {session.totalSteps}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewSession(session)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleJoinSession(session.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 会话详情页面 */}
      {activeTab === 'session' && selectedSession && (
        <div className="mt-6 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedSession.title}</h3>
                <p className="text-gray-600 mt-1">{selectedSession.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getSessionStatusColor(selectedSession.status)}>
                  {getSessionStatusText(selectedSession.status)}
                </Badge>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleControlSession('start')}
                    className="text-green-600 hover:text-green-700"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleControlSession('pause')}
                    className="text-yellow-600 hover:text-yellow-700"
                  >
                    <Pause className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleControlSession('stop')}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Square className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">参与智能体</div>
                <div className="text-2xl font-bold">{selectedSession.participants.length}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">完成进度</div>
                <div className="text-2xl font-bold text-blue-600">{selectedSession.progress}%</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">当前步骤</div>
                <div className="text-xl font-bold">{selectedSession.currentStep}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 参与智能体 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">参与智能体</h4>
              <div className="space-y-3">
                {selectedSession.participants.map(agentId => {
                  const agent = mockAgents.find(a => a.id === agentId);
                  if (!agent) return null;
                  
                  return (
                    <div key={agentId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{agent.name}</div>
                          <div className="text-sm text-gray-500">{agent.type}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(agent.status)}
                        <span className="text-sm text-gray-600">{getStatusText(agent.status)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 实时消息 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">实时消息</h4>
              <div className="h-64 overflow-y-auto mb-4 space-y-2">
                {messages.filter(m => m.sessionId === selectedSession.id).map(message => (
                  <div key={message.id} className="p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getMessageTypeColor(message.type)} variant="outline">
                        {message.type}
                      </Badge>
                      <span className="text-sm font-medium text-gray-900">{message.sender}</span>
                      <span className="text-xs text-gray-500">{message.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600">{message.content}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="输入消息..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>
                  发送
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentCollaboration;