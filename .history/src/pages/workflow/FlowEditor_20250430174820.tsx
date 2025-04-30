import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  NodeTypes,
  Connection,
  Node,
  ReactFlowProvider,
  ReactFlowInstance,
  Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './FlowEditor.css';
import { message, Form, Modal } from 'antd';
import { getAgents } from '../../utils/workflowStorage';

// 导入类型
import { 
  FlowEditorProps, 
  Workflow, 
  WorkflowFormValues, 
  FormValues, 
  ToolsRef, 
  AgentConfig, 
  ToolConfig 
} from './types';

// 导入模拟数据
import { 
  initialNodes, 
  initialEdges, 
  mockAgents, 
  mockTools, 
  mockApplications 
} from './mockData';

// 导入组件
import AgentNode from '../../components/workflow/AgentNode';
import ToolNode from '../../components/workflow/ToolNode';
import ApplicationNode from '../../components/workflow/ApplicationNode';
import FlowToolbar from '../../components/workflow/FlowToolbar';
import NodePropertiesDrawer from '../../components/workflow/NodePropertiesDrawer';
import AgentSelectionModal from '../../components/workflow/AgentSelectionModal';
import ToolSelectionModal from '../../components/workflow/ToolSelectionModal';
import WorkflowSaveModal from '../../components/workflow/WorkflowSaveModal';
import AddNodePanel from '../../components/workflow/AddNodePanel';
import DefaultToolbar from '../../components/workflow/DefaultToolbar';

// 注册自定义节点类型
const nodeTypes: NodeTypes = {
  agent: AgentNode,
  tool: ToolNode,
  application: ApplicationNode,
};

const FlowEditor: React.FC<FlowEditorProps> = ({
  workflow,
  isCreateMode,
  onSave,
  onCancel,
  renderHeaderTools,
  headerMode = false
}) => {
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
  const [connectionSource, setConnectionSource] = useState<string | null>(null);
  
  // 提前声明toolsRef，但先不初始化具体内容
  const toolsRef = useRef<ToolsRef>({
    handleSave: () => {},
    handleEdit: () => {},
    handleExport: () => {},
    handleImport: () => {},
    handlePublish: () => {},
    handleValidate: () => false,
    isValid: false,
    workflowName: ''
  });

  // 打开保存工作流模态框
  const openSaveModal = () => {
    workflowForm.setFieldsValue(workflowFormValues);
    setSaveModalVisible(true);
  };

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
  const handleDuplicateNode = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    
    if (!node) return;
    
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
  }, [nodes, setNodes]);
  
  // 进入连接模式
  const handleConnectNode = useCallback((nodeId: string) => {
    setIsConnectingMode(true);
    setConnectionSource(nodeId);
    message.info('请选择要连接的目标节点');
  }, []);
  
  // 编辑节点处理逻辑
  const handleEditNode = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    
    if (!node) return;
    
    setSelectedNode(node);
    nodeForm.setFieldsValue({
      label: node.data.label,
      type: node.type,
      description: node.data.description || '',
    });
    setDrawerVisible(true);
  }, [nodeForm, nodes]);

  // 删除节点处理逻辑
  const handleDeleteSelectedNode = useCallback((nodeId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该节点吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        setNodes(nds => nds.filter(node => node.id !== nodeId));
        setEdges(eds => eds.filter(edge => 
          edge.source !== nodeId && edge.target !== nodeId
        ));
        message.success('节点已删除');
      }
    });
  }, [setNodes, setEdges]);

  // 修改节点点击事件处理
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (isConnectingMode) {
      // 如果处于连接模式，则创建一个从源节点到目标节点的连接
      if (connectionSource && connectionSource !== node.id) {
        const newEdge: Connection = {
          source: connectionSource,
          target: node.id,
          sourceHandle: null,
          targetHandle: null
        };
        
        setEdges((eds) => addEdge(
          {
            ...newEdge,
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
              showToolbar: true
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
  }, [setNodes, isConnectingMode, connectionSource, setEdges]);

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
        type: type === 'agent' ? 'Agent' : type === 'tool' ? 'Tool' : 'Application',
        config: type === 'application' ? {
          ...mockApplications[1],
          id: `app_${Date.now()}`
        } : undefined
      },
      position: {
        x: Math.random() * 300 + 50,
        y: Math.random() * 300 + 50,
      },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  // 导出工作流为JSON
  const handleExportJson = useCallback(() => {
    if (!reactFlowInstance) return;
    const flowExport = reactFlowInstance.toObject();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(flowExport));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${workflowFormValues.name || "workflow"}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }, [reactFlowInstance, workflowFormValues.name]);

  // 导入JSON工作流
  const handleImportJson = useCallback(() => {
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
        } catch {
          message.error('导入失败，无效的工作流文件');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [setNodes, setEdges]);

  // 验证工作流
  const handleValidateWorkflow = useCallback(() => {
    const hasStartNode = nodes.some(n => n.type === 'agent');
    const hasEndConnection = edges.length > 0;
    
    if (!hasStartNode) {
      message.warning('工作流至少需要一个智能体节点');
      return false;
    }
    
    if (!hasEndConnection) {
      message.warning('节点之间需要建立连接');
      return false;
    }
    
    message.success('工作流验证通过');
    return true;
  }, [nodes, edges]);

  // 发布工作流
  const handlePublishWorkflow = useCallback(() => {
    if (handleValidateWorkflow()) {
      message.info('工作流发布功能即将上线');
    }
  }, [handleValidateWorkflow]);

  // 保存工作流
  const handleSaveWorkflow = (values: WorkflowFormValues) => {
    const currentWorkflow: Workflow = {
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
    // 更新本地状态
    setWorkflowFormValues(values);
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

  // 现在函数都已定义好，更新toolsRef的值
  useEffect(() => {
    toolsRef.current = {
      handleSave,
      handleEdit: openSaveModal,
      handleExport: handleExportJson,
      handleImport: handleImportJson,
      handlePublish: handlePublishWorkflow,
      handleValidate: handleValidateWorkflow,
      isValid: nodes.length > 0 && edges.length > 0,
      workflowName: workflowFormValues.name
    };
  }, [
    handleSave,
    handleExportJson,
    handleImportJson,
    handlePublishWorkflow,
    handleValidateWorkflow,
    nodes.length,
    edges.length,
    workflowFormValues.name
  ]);

  // 如果提供了头部工具渲染函数，则调用它
  useEffect(() => {
    if (renderHeaderTools) {
      renderHeaderTools(toolsRef.current);
    }
  }, [renderHeaderTools]);

  // 设置全局处理函数
  useEffect(() => {
    window.editNode = handleEditNode;
    window.deleteNode = handleDeleteSelectedNode;
    window.duplicateNode = handleDuplicateNode;
    window.connectNode = handleConnectNode;
    
    return () => {
      // 清理全局函数
      window.editNode = undefined;
      window.deleteNode = undefined;
      window.duplicateNode = undefined;
      window.connectNode = undefined;
    };
  }, [handleEditNode, handleDeleteSelectedNode, handleDuplicateNode, handleConnectNode]);

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

  // 工具栏状态
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div style={{ 
      height: '100%', 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative'
    }}
    className="flow-editor-container"
    >
      {/* 添加默认工具栏，当renderHeaderTools未提供或不是headerMode时显示 */}
      {!headerMode && !renderHeaderTools && (
        <DefaultToolbar
          handleSave={handleSave}
          handleEdit={openSaveModal}
          handleExport={handleExportJson}
          handleImport={handleImportJson}
          handlePublish={handlePublishWorkflow}
          handleValidate={handleValidateWorkflow}
        />
      )}

      <ReactFlowProvider>
        <div style={{ 
          flex: 1, 
          position: 'relative',
          height: headerMode || renderHeaderTools ? '100%' : 'calc(100% - 44px)', // 减去工具栏高度
          width: '100%',
          minHeight: '500px' // 确保最小高度
        }}>
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
            style={{ 
              background: '#f8f9fa',
              height: '100%',
              width: '100%'
            }}
          >
            <Background />
            <MiniMap />
            
            {/* 添加节点面板 */}
            <AddNodePanel 
              onOpenAgentModal={openAgentModal}
              onOpenToolModal={openToolModal}
              onAddCustomNode={addCustomNode}
            />
            
            {/* 底部工具栏 */}
            <FlowToolbar 
              onUndo={handleUndo}
              onRedo={handleRedo}
              onLock={handleLockNodes}
              onUnlock={handleUnlockNodes}
              onDeleteNode={() => selectedNode && handleDeleteSelectedNode(selectedNode.id)}
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
      <NodePropertiesDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        form={nodeForm}
        onFinish={updateNodeData}
      />

      {/* 智能体选择模态框 */}
      <AgentSelectionModal
        visible={agentModalVisible}
        onCancel={() => setAgentModalVisible(false)}
        agents={availableAgents}
        onSelectAgent={handleSelectAgent}
      />

      {/* 工具选择模态框 */}
      <ToolSelectionModal
        visible={toolModalVisible}
        onCancel={() => setToolModalVisible(false)}
        tools={availableTools}
        onSelectTool={handleSelectTool}
      />

      {/* 保存工作流模态框 */}
      <WorkflowSaveModal
        visible={saveModalVisible}
        onCancel={() => setSaveModalVisible(false)}
        onFinish={handleSaveWorkflow}
        form={workflowForm}
        isCreateMode={isCreateMode}
      />
    </div>
  );
};

export default FlowEditor; 