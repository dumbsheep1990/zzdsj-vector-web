import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  NodeTypes,
  Connection,
  Node,
  ReactFlowProvider,
  ReactFlowInstance,
  Handle,
  Position,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import PageHeader from '../../components/layout/PageHeader';
import { Button, Card, Input, Select, Typography, Drawer, Form, message, Modal, Table, Tag, Input as AntInput, Tooltip } from 'antd';
import { saveWorkflow, getWorkflows, getAgents } from '../../utils/workflowStorage';
import { 
  UndoOutlined, 
  RedoOutlined, 
  LockOutlined, 
  UnlockOutlined, 
  DeleteOutlined, 
  ClearOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  FullscreenOutlined,
  DragOutlined,
  SaveOutlined
} from '@ant-design/icons';

// Agent数据结构定义
interface AgentConfig {
  id: string;
  name: string;
  description: string;
  type: 'agent' | 'tool' | 'application';
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  knowledgeBase?: boolean;
  webSearch?: boolean;
  imageSupport?: boolean;
  voiceSupport?: boolean;
  tools?: Array<{
    id: string;
    name: string;
    type: string;
  }>;
}

// 工具数据结构定义
interface ToolConfig {
  id: string;
  name: string;
  type: string;
  description: string;
}

// 节点数据类型定义
interface NodeData {
  label: string;
  type: string;
  description?: string;
  config?: AgentConfig | ToolConfig;
}

// 自定义节点类型组件
const AgentNode = ({ data, selected }: { data: NodeData; selected: boolean }) => {
  return (
    <div style={{
      padding: '10px',
      borderRadius: '5px',
      background: selected 
        ? 'linear-gradient(to right, #8a5cf6, #9b66ff)' 
        : 'linear-gradient(to right, #667eea, #764ba2)',
      color: 'white',
      width: '200px',
      height: '100px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: selected 
        ? '0 0 0 2px #8a5cf6, 0 4px 10px rgba(0, 0, 0, 0.3)' 
        : '0 4px 6px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      transition: 'all 0.2s ease'
    }}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555', width: '12px', height: '12px' }}
      />
      <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{data.label}</div>
      <div style={{ fontSize: '12px', marginTop: '5px' }}>{data.type}</div>
      {data.config && 'tools' in data.config && data.config.tools && data.config.tools.length > 0 && (
        <div style={{ marginTop: '8px', fontSize: '10px' }}>
          工具: {data.config.tools.map(tool => tool.name).join(', ')}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#555', width: '12px', height: '12px' }}
      />
    </div>
  );
};

const ToolNode = ({ data, selected }: { data: NodeData; selected: boolean }) => {
  return (
    <div style={{
      padding: '10px',
      borderRadius: '5px',
      background: selected 
        ? 'linear-gradient(to right, #0dcaf3, #38d9f8)' 
        : 'linear-gradient(to right, #4facfe, #00f2fe)',
      color: 'white',
      width: '200px',
      height: '80px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: selected 
        ? '0 0 0 2px #0dcaf3, 0 4px 10px rgba(0, 0, 0, 0.3)' 
        : '0 4px 6px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      transition: 'all 0.2s ease'
    }}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555', width: '12px', height: '12px' }}
      />
      <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{data.label}</div>
      <div style={{ fontSize: '12px', marginTop: '5px' }}>{data.type}</div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#555', width: '12px', height: '12px' }}
      />
    </div>
  );
};

const ApplicationNode = ({ data, selected }: { data: NodeData; selected: boolean }) => {
  return (
    <div style={{
      padding: '10px',
      borderRadius: '5px',
      background: selected 
        ? 'linear-gradient(to right, #ffae3a, #ffc069)' 
        : 'linear-gradient(to right, #f6d365, #fda085)',
      color: 'white',
      width: '200px',
      height: '80px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: selected 
        ? '0 0 0 2px #ffae3a, 0 4px 10px rgba(0, 0, 0, 0.3)' 
        : '0 4px 6px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      transition: 'all 0.2s ease'
    }}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555', width: '12px', height: '12px' }}
      />
      <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{data.label}</div>
      <div style={{ fontSize: '12px', marginTop: '5px' }}>{data.type}</div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#555', width: '12px', height: '12px' }}
      />
    </div>
  );
};

// 注册自定义节点类型
const nodeTypes: NodeTypes = {
  agent: AgentNode,
  tool: ToolNode,
  application: ApplicationNode,
};

// 初始节点
const initialNodes = [
  {
    id: '1',
    type: 'agent',
    data: { 
      label: '智能体 1', 
      type: 'Agent',
      config: {
        id: 'agent1',
        name: '智能体 1',
        description: '处理初始输入的智能体',
        type: 'agent',
        model: 'gpt-4',
        temperature: 0.7,
        knowledgeBase: true,
        webSearch: false
      }
    },
    position: { x: 100, y: 100 },
  },
  {
    id: '2',
    type: 'agent',
    data: { 
      label: '智能体 2', 
      type: 'Agent',
      config: {
        id: 'agent2',
        name: '智能体 2',
        description: '处理后续任务的智能体',
        type: 'agent',
        model: 'gpt-3.5-turbo',
        temperature: 0.5,
        knowledgeBase: false,
        webSearch: true
      }
    },
    position: { x: 500, y: 100 },
  },
];

// 初始边
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, label: '处理结果' },
];

// Mock数据：可用的智能体列表
const mockAgents: AgentConfig[] = [
  {
    id: 'agent1',
    name: '通用问答智能体',
    description: '处理一般性问题的智能体',
    type: 'agent',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 4096,
    systemPrompt: '你是一个助手，帮助用户回答问题。',
    knowledgeBase: true,
    webSearch: true,
    imageSupport: true,
    voiceSupport: false,
    tools: [
      { id: 'tool1', name: '搜索工具', type: 'search' },
      { id: 'tool2', name: '计算器', type: 'calculator' }
    ]
  },
  {
    id: 'agent2',
    name: '数据分析智能体',
    description: '专门处理数据分析任务',
    type: 'agent',
    model: 'gpt-4',
    temperature: 0.2,
    maxTokens: 8192,
    systemPrompt: '你是一个数据分析专家，帮助用户分析数据。',
    knowledgeBase: true,
    webSearch: false,
    imageSupport: true,
    voiceSupport: false,
    tools: [
      { id: 'tool3', name: '数据可视化', type: 'visualization' },
      { id: 'tool4', name: '统计分析', type: 'statistics' }
    ]
  },
  {
    id: 'agent3',
    name: '代码助手',
    description: '帮助编写和修改代码',
    type: 'agent',
    model: 'gpt-4',
    temperature: 0.3,
    maxTokens: 8192,
    systemPrompt: '你是一个编程助手，帮助用户解决代码问题。',
    knowledgeBase: false,
    webSearch: true,
    imageSupport: false,
    voiceSupport: false,
    tools: [
      { id: 'tool5', name: '代码补全', type: 'code-completion' },
      { id: 'tool6', name: '代码审查', type: 'code-review' }
    ]
  }
];

// Mock数据：可用的工具
const mockTools: ToolConfig[] = [
  { id: 'tool1', name: '搜索工具', type: 'search', description: '在互联网上搜索信息' },
  { id: 'tool2', name: '计算器', type: 'calculator', description: '执行数学计算' },
  { id: 'tool3', name: '数据可视化', type: 'visualization', description: '将数据转换为图表' },
  { id: 'tool4', name: '统计分析', type: 'statistics', description: '执行统计分析' },
  { id: 'tool5', name: '代码补全', type: 'code-completion', description: '提供代码补全建议' },
  { id: 'tool6', name: '代码审查', type: 'code-review', description: '检查和审查代码质量' }
];

// 表单值类型
interface FormValues {
  label: string;
  type: string;
  description: string;
}

// 工作流表单值类型
interface WorkflowFormValues {
  name: string;
  description: string;
}

// 底部工具栏组件
const FlowToolbar = ({ 
  onUndo, 
  onRedo, 
  onLock, 
  onUnlock, 
  onDeleteNode, 
  onClearAll,
  onZoomIn,
  onZoomOut,
  onFitView,
  onSave
}: {
  onUndo: () => void;
  onRedo: () => void;
  onLock: () => void;
  onUnlock: () => void;
  onDeleteNode: () => void;
  onClearAll: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onSave: () => void;
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
        background: 'white',
        padding: '10px 15px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        zIndex: 10
      }}
    >
      <Tooltip title="撤销">
        <Button icon={<UndoOutlined />} onClick={onUndo} />
      </Tooltip>
      <Tooltip title="重做">
        <Button icon={<RedoOutlined />} onClick={onRedo} />
      </Tooltip>
      <Tooltip title="锁定节点">
        <Button icon={<LockOutlined />} onClick={onLock} />
      </Tooltip>
      <Tooltip title="解锁节点">
        <Button icon={<UnlockOutlined />} onClick={onUnlock} />
      </Tooltip>
      <Tooltip title="删除选中节点">
        <Button icon={<DeleteOutlined />} onClick={onDeleteNode} />
      </Tooltip>
      <Tooltip title="清空所有">
        <Button icon={<ClearOutlined />} onClick={onClearAll} />
      </Tooltip>
      <div style={{ width: '1px', background: '#eee', margin: '0 5px' }}></div>
      <Tooltip title="放大">
        <Button icon={<ZoomInOutlined />} onClick={onZoomIn} />
      </Tooltip>
      <Tooltip title="缩小">
        <Button icon={<ZoomOutOutlined />} onClick={onZoomOut} />
      </Tooltip>
      <Tooltip title="适应视图">
        <Button icon={<FullscreenOutlined />} onClick={onFitView} />
      </Tooltip>
      <div style={{ width: '1px', background: '#eee', margin: '0 5px' }}></div>
      <Tooltip title="保存工作流">
        <Button type="primary" icon={<SaveOutlined />} onClick={onSave} />
      </Tooltip>
    </div>
  );
};

const TaskOrchestrationPage: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [agentModalVisible, setAgentModalVisible] = useState(false);
  const [toolModalVisible, setToolModalVisible] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [workflowFormValues, setWorkflowFormValues] = useState<WorkflowFormValues>({
    name: '',
    description: ''
  });
  const [availableAgents, setAvailableAgents] = useState<AgentConfig[]>(mockAgents);
  const [availableTools] = useState<ToolConfig[]>(mockTools);
  const [nodeForm] = Form.useForm();
  const [workflowForm] = Form.useForm();
  
  // 历史状态管理，用于撤销和重做
  const [history, setHistory] = useState<Array<{nodes: Node[]; edges: Edge[]}>>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [nodesLocked, setNodesLocked] = useState(false);

  const reactFlowWrapper = useCallback((instance: ReactFlowInstance | null) => {
    if (instance) {
      setReactFlowInstance(instance);
      
      // 初始化历史记录
      setHistory([{ nodes: initialNodes, edges: initialEdges }]);
      setHistoryIndex(0);
    }
  }, []);

  // 加载已有智能体数据
  useEffect(() => {
    // 在实际应用中，这里应该是从API获取数据
    console.log('加载智能体数据');
    
    // 从本地存储加载智能体数据
    const agents = getAgents();
    if (agents && agents.length > 0) {
      setAvailableAgents(agents);
    }
    
    // 这里先使用mock数据，实际应用中应该调用API
    // fetchAgents().then(data => setAvailableAgents(data));
  }, []);

  // 记录历史状态的函数
  const recordHistory = useCallback(() => {
    if (nodes && edges) {
      setHistory(prev => {
        // 如果当前不是最新状态，则清除之后的历史记录
        const newHistory = prev.slice(0, historyIndex + 1);
        return [...newHistory, { nodes: nodes, edges: edges }];
      });
      setHistoryIndex(prev => prev + 1);
    }
  }, [nodes, edges, historyIndex]);

  // 在节点或边发生变化时记录历史
  useEffect(() => {
    // 初始加载时不记录
    if (historyIndex >= 0) {
      recordHistory();
    }
  }, [nodes, edges, recordHistory]);

  // 处理连接节点
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(
      { ...params, animated: true, label: '处理结果' }, 
      eds
    )),
    [setEdges]
  );

  // 处理节点选择
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    nodeForm.setFieldsValue({
      label: node.data.label,
      type: node.type,
      description: node.data.description || '',
    });
    setDrawerVisible(true);
  }, [nodeForm]);

  // 更新节点数据
  const updateNodeData = (values: FormValues) => {
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            return {
              ...node,
              data: {
                ...node.data,
                label: values.label,
                description: values.description,
              },
              type: values.type,
            };
          }
          return node;
        })
      );
      setDrawerVisible(false);
      message.success('节点已更新');
    }
  };

  // 撤销操作
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(historyIndex - 1);
    } else {
      message.info('没有可撤销的操作');
    }
  }, [history, historyIndex, setEdges, setNodes]);

  // 重做操作
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(historyIndex + 1);
    } else {
      message.info('没有可重做的操作');
    }
  }, [history, historyIndex, setEdges, setNodes]);

  // 锁定节点
  const handleLockNodes = useCallback(() => {
    setNodes(nds =>
      nds.map(node => ({
        ...node,
        draggable: false,
      }))
    );
    setNodesLocked(true);
    message.success('节点已锁定');
  }, [setNodes]);

  // 解锁节点
  const handleUnlockNodes = useCallback(() => {
    setNodes(nds =>
      nds.map(node => ({
        ...node,
        draggable: true,
      }))
    );
    setNodesLocked(false);
    message.success('节点已解锁');
  }, [setNodes]);

  // 删除选中节点
  const handleDeleteNode = useCallback(() => {
    if (selectedNode) {
      setNodes(nds => nds.filter(node => node.id !== selectedNode.id));
      setEdges(eds => eds.filter(edge => 
        edge.source !== selectedNode.id && edge.target !== selectedNode.id
      ));
      setSelectedNode(null);
      setDrawerVisible(false);
      message.success('节点已删除');
    } else {
      message.info('请先选择要删除的节点');
    }
  }, [selectedNode, setNodes, setEdges]);

  // 清空所有节点和连线
  const handleClearAll = useCallback(() => {
    Modal.confirm({
      title: '确认清空',
      content: '确定要清空所有节点和连线吗？此操作不可撤销。',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        setNodes([]);
        setEdges([]);
        message.success('已清空所有节点和连线');
      }
    });
  }, [setNodes, setEdges]);

  // 放大
  const handleZoomIn = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomIn();
    }
  }, [reactFlowInstance]);

  // 缩小
  const handleZoomOut = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomOut();
    }
  }, [reactFlowInstance]);

  // 适应视图
  const handleFitView = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView();
    }
  }, [reactFlowInstance]);

  // 打开智能体选择模态框
  const openAgentModal = () => {
    setAgentModalVisible(true);
  };

  // 打开工具选择模态框
  const openToolModal = () => {
    setToolModalVisible(true);
  };

  // 打开保存工作流模态框
  const openSaveModal = () => {
    workflowForm.setFieldsValue(workflowFormValues);
    setSaveModalVisible(true);
  };

  // 从智能体列表中选择并添加节点
  const handleSelectAgent = (agent: AgentConfig) => {
    const newNode = {
      id: `node_${Date.now()}`,
      type: 'agent',
      data: { 
        label: agent.name, 
        type: 'Agent',
        description: agent.description,
        config: agent
      },
      position: {
        x: Math.random() * 300 + 50,
        y: Math.random() * 300 + 50,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setAgentModalVisible(false);
    message.success(`已添加智能体: ${agent.name}`);
  };

  // 从工具列表中选择并添加节点
  const handleSelectTool = (tool: ToolConfig) => {
    const newNode = {
      id: `node_${Date.now()}`,
      type: 'tool',
      data: { 
        label: tool.name, 
        type: 'Tool',
        description: tool.description,
        config: tool
      },
      position: {
        x: Math.random() * 300 + 50,
        y: Math.random() * 300 + 50,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setToolModalVisible(false);
    message.success(`已添加工具: ${tool.name}`);
  };

  // 添加新自定义节点
  const addCustomNode = (type: string) => {
    const newNode = {
      id: `node_${Date.now()}`,
      type,
      data: { 
        label: `新${type === 'agent' ? '智能体' : type === 'tool' ? '工具' : '应用'}`, 
        type: type === 'agent' ? 'Agent' : type === 'tool' ? 'Tool' : 'Application' 
      },
      position: {
        x: Math.random() * 300 + 50,
        y: Math.random() * 300 + 50,
      },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  // 保存工作流
  const handleSaveWorkflow = (values: WorkflowFormValues) => {
    const workflow = {
      id: `workflow_${Date.now()}`,
      name: values.name,
      description: values.description,
      nodes,
      edges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const success = saveWorkflow(workflow);
    if (success) {
      message.success('工作流已保存');
      setWorkflowFormValues(values); // 保存表单值以便下次使用
      setSaveModalVisible(false);
    } else {
      message.error('保存工作流失败');
    }
  };

  // 智能体列表的列定义
  const agentColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '模型',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: '能力',
      key: 'capabilities',
      render: (_: string, record: AgentConfig) => (
        <>
          {record.knowledgeBase && <Tag color="blue">知识库</Tag>}
          {record.webSearch && <Tag color="green">网络搜索</Tag>}
          {record.imageSupport && <Tag color="purple">图像支持</Tag>}
          {record.voiceSupport && <Tag color="orange">语音支持</Tag>}
        </>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: string, record: AgentConfig) => (
        <Button type="primary" size="small" onClick={() => handleSelectAgent(record)}>
          添加
        </Button>
      ),
    },
  ];

  // 工具列表的列定义
  const toolColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: string, record: ToolConfig) => (
        <Button type="primary" size="small" onClick={() => handleSelectTool(record)}>
          添加
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="任务编排" />
      <div
        style={{
          height: 'calc(100vh - 56px)',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        <ReactFlowProvider>
          <div style={{ flex: 1 }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={reactFlowWrapper}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              deleteKeyCode="Delete"
            >
              <Background />
              <Panel position="top-right">
                <Card style={{ width: 200 }}>
                  <Typography.Title level={5}>添加节点</Typography.Title>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Button type="primary" onClick={openAgentModal}>
                      选择智能体
                    </Button>
                    <Button type="primary" onClick={openToolModal}>
                      选择工具
                    </Button>
                    <Button onClick={() => addCustomNode('application')}>
                      添加自定义应用
                    </Button>
                  </div>
                </Card>
              </Panel>
              
              {/* 底部工具栏 */}
              <FlowToolbar 
                onUndo={handleUndo}
                onRedo={handleRedo}
                onLock={handleLockNodes}
                onUnlock={handleUnlockNodes}
                onDeleteNode={handleDeleteNode}
                onClearAll={handleClearAll}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onFitView={handleFitView}
                onSave={openSaveModal}
              />
            </ReactFlow>
          </div>
        </ReactFlowProvider>

        {/* 节点属性抽屉 */}
        <Drawer
          title="节点属性"
          placement="right"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={400}
        >
          <Form
            form={nodeForm}
            layout="vertical"
            onFinish={updateNodeData}
          >
            <Form.Item name="label" label="名称" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            
            <Form.Item name="type" label="类型">
              <Select>
                <Select.Option value="agent">智能体</Select.Option>
                <Select.Option value="tool">工具</Select.Option>
                <Select.Option value="application">应用</Select.Option>
              </Select>
            </Form.Item>
            
            <Form.Item name="description" label="描述">
              <Input.TextArea rows={4} />
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Form.Item>
          </Form>
        </Drawer>

        {/* 智能体选择模态框 */}
        <Modal
          title="选择智能体"
          open={agentModalVisible}
          onCancel={() => setAgentModalVisible(false)}
          footer={null}
          width={800}
        >
          <Table 
            dataSource={availableAgents} 
            columns={agentColumns} 
            rowKey="id"
            pagination={false}
          />
        </Modal>

        {/* 工具选择模态框 */}
        <Modal
          title="选择工具"
          open={toolModalVisible}
          onCancel={() => setToolModalVisible(false)}
          footer={null}
          width={800}
        >
          <Table 
            dataSource={availableTools} 
            columns={toolColumns} 
            rowKey="id"
            pagination={false}
          />
        </Modal>

        {/* 保存工作流模态框 */}
        <Modal
          title="保存工作流"
          open={saveModalVisible}
          onCancel={() => setSaveModalVisible(false)}
          footer={null}
        >
          <Form 
            form={workflowForm}
            layout="vertical"
            onFinish={handleSaveWorkflow}
          >
            <Form.Item 
              name="name" 
              label="工作流名称" 
              rules={[{ required: true, message: '请输入工作流名称' }]}
            >
              <AntInput placeholder="输入工作流名称" />
            </Form.Item>
            
            <Form.Item 
              name="description" 
              label="工作流描述"
            >
              <AntInput.TextArea rows={4} placeholder="描述此工作流的用途和功能" />
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default TaskOrchestrationPage; 