import React, { useState, useCallback, useEffect } from 'react';
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
  Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './FlowEditor.css';
import { Button, Card, Input, Select, Typography, Drawer, Form, message, Modal, Table, Tag, Input as AntInput, Tooltip, Divider, Switch } from 'antd';
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
  SaveOutlined,
  CloseOutlined,
  DownloadOutlined,
  UploadOutlined,
  CloudUploadOutlined,
  SettingOutlined,
  FileSearchOutlined,
  CheckOutlined,
  EditOutlined,
  CopyOutlined,
  NodeIndexOutlined
} from '@ant-design/icons';
import { getAgents } from '../../utils/workflowStorage';

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
  nodeId?: string;
  showToolbar?: boolean;
}

// 工作流类型定义
interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: string;
  updatedAt: string;
}

// 工作流表单值类型
interface WorkflowFormValues {
  name: string;
  description: string;
}

// 组件属性
interface FlowEditorProps {
  workflow: Workflow | null;
  isCreateMode: boolean;
  onSave: (workflow: Workflow) => void;
  onCancel: () => void;
}

// 节点工具条组件
interface NodeToolbarProps {
  nodeId: string;
  onEdit: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onDuplicate: (nodeId: string) => void;
  onConnect: (nodeId: string) => void;
}

const NodeToolbar: React.FC<NodeToolbarProps> = ({ 
  nodeId, 
  onEdit, 
  onDelete, 
  onDuplicate,
  onConnect 
}) => {
  return (
    <div className="node-toolbar" onClick={(e) => e.stopPropagation()}>
      <Tooltip title="编辑节点">
        <Button 
          size="small" 
          icon={<EditOutlined />} 
          onClick={() => onEdit(nodeId)}
        />
      </Tooltip>
      <Tooltip title="复制节点">
        <Button 
          size="small" 
          icon={<CopyOutlined />} 
          onClick={() => onDuplicate(nodeId)}
        />
      </Tooltip>
      <Tooltip title="连接节点">
        <Button 
          size="small" 
          icon={<NodeIndexOutlined />} 
          onClick={() => onConnect(nodeId)}
        />
      </Tooltip>
      <Tooltip title="删除节点">
        <Button 
          size="small" 
          danger
          icon={<DeleteOutlined />} 
          onClick={() => onDelete(nodeId)}
        />
      </Tooltip>
    </div>
  );
};

// 自定义节点类型组件
const AgentNode = ({ data, selected }: { data: NodeData; selected: boolean }) => {
  return (
    <div className={`agent-node ${selected ? 'selected' : ''}`}>
      {selected && data.showToolbar && data.nodeId && (
        <NodeToolbar 
          nodeId={data.nodeId}
          onEdit={(id) => window.editNode && window.editNode(id)}
          onDelete={(id) => window.deleteNode && window.deleteNode(id)}
          onDuplicate={(id) => window.duplicateNode && window.duplicateNode(id)}
          onConnect={(id) => window.connectNode && window.connectNode(id)}
        />
      )}
      <div className="node-header">
        <div>{data.label}</div>
        <div className="node-icon">A</div>
      </div>
      <div className="node-type">{data.type}</div>
      {data.description && (
        <div className="node-description">{data.description}</div>
      )}
      {data.config && 'tools' in data.config && data.config.tools && data.config.tools.length > 0 && (
        <div className="node-tools">
          {data.config.tools.map(tool => (
            <span key={tool.id} className="node-tool-tag">
              {tool.name}
            </span>
          ))}
        </div>
      )}
      <Handle
        type="target"
        position={Position.Left}
        className="react-flow__handle-left"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="react-flow__handle-right"
      />
    </div>
  );
};

const ToolNode = ({ data, selected }: { data: NodeData; selected: boolean }) => {
  return (
    <div className={`tool-node ${selected ? 'selected' : ''}`}>
      {selected && data.showToolbar && data.nodeId && (
        <NodeToolbar 
          nodeId={data.nodeId}
          onEdit={(id) => window.editNode && window.editNode(id)}
          onDelete={(id) => window.deleteNode && window.deleteNode(id)}
          onDuplicate={(id) => window.duplicateNode && window.duplicateNode(id)}
          onConnect={(id) => window.connectNode && window.connectNode(id)}
        />
      )}
      <div className="node-header">
        <div>{data.label}</div>
        <div className="node-icon">T</div>
      </div>
      <div className="node-type">{data.type}</div>
      {data.description && (
        <div className="node-description">{data.description}</div>
      )}
      <Handle
        type="target"
        position={Position.Left}
        className="react-flow__handle-left"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="react-flow__handle-right"
      />
    </div>
  );
};

const ApplicationNode = ({ data, selected }: { data: NodeData; selected: boolean }) => {
  return (
    <div className={`application-node ${selected ? 'selected' : ''}`}>
      {selected && data.showToolbar && data.nodeId && (
        <NodeToolbar 
          nodeId={data.nodeId}
          onEdit={(id) => window.editNode && window.editNode(id)}
          onDelete={(id) => window.deleteNode && window.deleteNode(id)}
          onDuplicate={(id) => window.duplicateNode && window.duplicateNode(id)}
          onConnect={(id) => window.connectNode && window.connectNode(id)}
        />
      )}
      <div className="node-header">
        <div>{data.label}</div>
        <div className="node-icon">C</div>
      </div>
      <div className="node-type">{data.type}</div>
      {data.description && (
        <div className="node-description">{data.description}</div>
      )}
      <Handle
        type="target"
        position={Position.Left}
        className="react-flow__handle-left"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="react-flow__handle-right"
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
  onSave,
  onCancel,
  isLocked,
  hasSelectedNode,
  canUndo,
  canRedo
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
  onCancel: () => void;
  isLocked: boolean;
  hasSelectedNode: boolean;
  canUndo: boolean;
  canRedo: boolean;
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
      <Tooltip title={canUndo ? "撤销" : "没有可撤销的操作"}>
        <Button 
          icon={<UndoOutlined />} 
          onClick={onUndo} 
          disabled={!canUndo}
          type={canUndo ? "default" : "text"}
        />
      </Tooltip>
      <Tooltip title={canRedo ? "重做" : "没有可重做的操作"}>
        <Button 
          icon={<RedoOutlined />} 
          onClick={onRedo} 
          disabled={!canRedo}
          type={canRedo ? "default" : "text"}
        />
      </Tooltip>
      {isLocked ? (
        <Tooltip title="解锁节点">
          <Button 
            icon={<UnlockOutlined />} 
            onClick={onUnlock} 
            type="primary"
          />
        </Tooltip>
      ) : (
        <Tooltip title="锁定节点">
          <Button 
            icon={<LockOutlined />} 
            onClick={onLock}
          />
        </Tooltip>
      )}
      <Tooltip title={hasSelectedNode ? "删除选中节点" : "请先选择节点"}>
        <Button 
          icon={<DeleteOutlined />} 
          onClick={onDeleteNode}
          disabled={!hasSelectedNode}
          danger={hasSelectedNode}
        />
      </Tooltip>
      <Tooltip title="清空所有">
        <Button 
          icon={<ClearOutlined />} 
          onClick={onClearAll}
          danger
        />
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
      <Tooltip title="取消">
        <Button icon={<CloseOutlined />} onClick={onCancel} />
      </Tooltip>
      <Tooltip title="保存工作流">
        <Button type="primary" icon={<SaveOutlined />} onClick={onSave} />
      </Tooltip>
    </div>
  );
};

const FlowEditor: React.FC<FlowEditorProps> = ({ workflow, isCreateMode, onSave, onCancel }) => {
  // 初始化节点和边
  const initialState = workflow ? { 
    nodes: workflow.nodes, 
    edges: workflow.edges 
  } : { 
    nodes: initialNodes, 
    edges: initialEdges 
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(initialState.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialState.edges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [agentModalVisible, setAgentModalVisible] = useState(false);
  const [toolModalVisible, setToolModalVisible] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [workflowFormValues, setWorkflowFormValues] = useState<WorkflowFormValues>(
    workflow ? {
      name: workflow.name,
      description: workflow.description
    } : {
      name: '',
      description: ''
    }
  );
  const [availableAgents, setAvailableAgents] = useState<AgentConfig[]>(mockAgents);
  const [availableTools] = useState<ToolConfig[]>(mockTools);
  const [nodeForm] = Form.useForm();
  const [workflowForm] = Form.useForm();
  
  // 历史状态管理，用于撤销和重做
  const [history, setHistory] = useState<Array<{nodes: Node[]; edges: Edge[]}>>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [nodesLocked, setNodesLocked] = useState(false);
  const [isConnectingMode, setIsConnectingMode] = useState(false);
  const [connectionSource, setConnectionSource] = useState<Node | null>(null);

  // 工具栏状态
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const reactFlowWrapper = useCallback((instance: ReactFlowInstance | null) => {
    if (instance) {
      setReactFlowInstance(instance);
      
      // 初始化历史记录
      setHistory([{ nodes: initialState.nodes, edges: initialState.edges }]);
      setHistoryIndex(0);
    }
  }, [initialState.edges, initialState.nodes]);

  // 加载已有智能体数据
  useEffect(() => {
    const agents = getAgents();
    if (agents && agents.length > 0) {
      setAvailableAgents(agents);
    }
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

  // 复制节点
  const handleDuplicateNode = useCallback((node: Node) => {
    const newNode = {
      ...node,
      id: `node_${Date.now()}`,
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50,
      }
    };
    
    setNodes((nds) => [...nds, newNode]);
    message.success('节点已复制');
  }, [setNodes]);
  
  // 进入连接模式
  const handleConnectNode = useCallback((node: Node) => {
    setIsConnectingMode(true);
    setConnectionSource(node);
    message.info('请选择要连接的目标节点');
  }, []);
  
  // 修改节点处理逻辑
  const handleEditNode = useCallback((node: Node) => {
    setSelectedNode(node);
    nodeForm.setFieldsValue({
      label: node.data.label,
      type: node.type,
      description: node.data.description || '',
    });
    setDrawerVisible(true);
  }, [nodeForm]);

  // 修改节点点击事件处理
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (isConnectingMode) {
      // 如果处于连接模式，则创建一个从源节点到目标节点的连接
      if (connectionSource && connectionSource.id !== node.id) {
        setEdges((eds) => addEdge(
          { 
            source: connectionSource.id, 
            target: node.id, 
            animated: true, 
            label: '处理结果' 
          }, 
          eds
        ));
        setIsConnectingMode(false);
        setConnectionSource(null);
        message.success('节点已连接');
      }
      return;
    }
    
    // 更新所有节点，隐藏其他节点的工具条
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === node.id) {
          // 对于当前点击的节点，展示工具条
          return {
            ...n,
            data: {
              ...n.data,
              nodeId: n.id,
              showToolbar: true,
              onEdit: handleEditNode,
              onDelete: handleDeleteNode,
              onDuplicate: handleDuplicateNode,
              onConnect: handleConnectNode
            }
          };
        } else {
          // 对于其他节点，隐藏工具条
          return {
            ...n,
            data: {
              ...n.data,
              showToolbar: false
            }
          };
        }
      })
    );
    
    setSelectedNode(node);
  }, [handleEditNode, handleDeleteNode, handleDuplicateNode, handleConnectNode, setNodes, isConnectingMode, connectionSource]);

  // 点击画布背景时，隐藏所有工具条
  const onPaneClick = useCallback(() => {
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          showToolbar: false
        }
      }))
    );
    
    setSelectedNode(null);
    
    if (isConnectingMode) {
      setIsConnectingMode(false);
      setConnectionSource(null);
      message.info('已取消连接模式');
    }
  }, [setNodes, isConnectingMode]);

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
    const currentWorkflow = {
      id: workflow ? workflow.id : `workflow_${Date.now()}`,
      name: values.name,
      description: values.description,
      nodes,
      edges,
      createdAt: workflow ? workflow.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(currentWorkflow);
    setSaveModalVisible(false);
  };

  // 保存操作
  const handleSave = () => {
    // 如果没有设置名称和描述，打开保存对话框
    if (!workflowFormValues.name) {
      openSaveModal();
      return;
    }
    
    // 否则直接保存
    handleSaveWorkflow(workflowFormValues);
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
    <div style={{ 
      height: '100%', 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column' 
    }}
    className="flow-editor-container"
    >
      {/* 顶部操作栏 */}
      <div className="editor-toolbar">
        <div className="toolbar-section">
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
          >
            保存
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={openSaveModal}
          >
            编辑信息
          </Button>
        </div>
        
        <Divider type="vertical" className="toolbar-divider" />
        
        <div className="toolbar-section">
          <Tooltip title="导出为JSON">
            <Button
              icon={<DownloadOutlined />}
              onClick={() => {
                if (!reactFlowInstance) return;
                const flowExport = reactFlowInstance.toObject();
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(flowExport));
                const downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", dataStr);
                downloadAnchorNode.setAttribute("download", `${workflowFormValues.name || "workflow"}.json`);
                document.body.appendChild(downloadAnchorNode);
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
              }}
            >
              导出
            </Button>
          </Tooltip>
          <Tooltip title="导入JSON">
            <Button
              icon={<UploadOutlined />}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = (e: Event) => {
                  const target = e.target as HTMLInputElement;
                  if (!target.files) return;
                  
                  const file = target.files[0];
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      const flow = JSON.parse(event.target?.result as string);
                      if (flow.nodes && flow.edges) {
                        setNodes(flow.nodes);
                        setEdges(flow.edges);
                        message.success('成功导入工作流');
                      }
                    } catch (_) {
                      message.error('导入失败，无效的工作流文件');
                    }
                  };
                  reader.readAsText(file);
                };
                input.click();
              }}
            >
              导入
            </Button>
          </Tooltip>
        </div>
        
        <Divider type="vertical" className="toolbar-divider" />
        
        <div className="toolbar-section">
          <Tooltip title="发布到生产环境">
            <Button 
              type="primary"
              icon={<CloudUploadOutlined />}
              onClick={() => message.info('工作流发布功能即将上线')}
            >
              发布
            </Button>
          </Tooltip>
          <Tooltip title="验证工作流">
            <Button
              icon={<CheckOutlined />}
              onClick={() => {
                const hasStartNode = nodes.some(n => n.type === 'agent');
                const hasEndConnection = edges.length > 0;
                
                if (!hasStartNode) {
                  message.warning('工作流至少需要一个智能体节点');
                  return;
                }
                
                if (!hasEndConnection) {
                  message.warning('节点之间需要建立连接');
                  return;
                }
                
                message.success('工作流验证通过');
              }}
            >
              验证
            </Button>
          </Tooltip>
        </div>
        
        <Divider type="vertical" className="toolbar-divider" />
        
        <div className="toolbar-section">
          <Tooltip title="查看文档">
            <Button 
              icon={<FileSearchOutlined />}
              onClick={() => message.info('文档功能即将上线')}
            />
          </Tooltip>
          <Tooltip title="高级设置">
            <Button 
              icon={<SettingOutlined />}
              onClick={() => message.info('高级设置功能即将上线')}
            />
          </Tooltip>
        </div>
        
        <div className="toolbar-right">
          <div className="toggle-group">
            <span>自动布局</span>
            <Switch size="small" onChange={v => message.info(v ? '自动布局已开启' : '自动布局已关闭')} />
          </div>
          <div className="toggle-group">
            <span>调试模式</span>
            <Switch size="small" onChange={v => message.info(v ? '调试模式已开启' : '调试模式已关闭')} />
          </div>
        </div>
      </div>

      <ReactFlowProvider>
        <div style={{ flex: 1, position: 'relative' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={reactFlowWrapper}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            deleteKeyCode="Delete"
          >
            <Background />
            <Controls />
            <MiniMap />
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
              onSave={handleSave}
              onCancel={onCancel}
              isLocked={nodesLocked}
              hasSelectedNode={selectedNode !== null}
              canUndo={canUndo}
              canRedo={canRedo}
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
        title={isCreateMode ? "保存新工作流" : "更新工作流"}
        open={saveModalVisible}
        onCancel={() => setSaveModalVisible(false)}
        footer={null}
      >
        <Form 
          form={workflowForm}
          layout="vertical"
          onFinish={handleSaveWorkflow}
          onValuesChange={(_, allValues) => setWorkflowFormValues(allValues as WorkflowFormValues)}
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
  );
};

export default FlowEditor; 