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
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import PageHeader from '../../components/layout/PageHeader';
import { Button, Card, Input, Select, Typography, Drawer, Form, message, Modal, Table, Tag } from 'antd';

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

// 节点数据类型定义
interface NodeData {
  label: string;
  type: string;
  description?: string;
  config?: AgentConfig;
}

// 自定义节点类型组件
const AgentNode = ({ data }: { data: NodeData }) => {
  return (
    <div style={{
      padding: '10px',
      borderRadius: '5px',
      background: 'linear-gradient(to right, #667eea, #764ba2)',
      color: 'white',
      width: '200px',
      height: '100px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      position: 'relative'
    }}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555', width: '12px', height: '12px' }}
      />
      <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{data.label}</div>
      <div style={{ fontSize: '12px', marginTop: '5px' }}>{data.type}</div>
      {data.config?.tools && data.config.tools.length > 0 && (
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

const ToolNode = ({ data }: { data: NodeData }) => {
  return (
    <div style={{
      padding: '10px',
      borderRadius: '5px',
      background: 'linear-gradient(to right, #4facfe, #00f2fe)',
      color: 'white',
      width: '200px',
      height: '80px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      position: 'relative'
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

const ApplicationNode = ({ data }: { data: NodeData }) => {
  return (
    <div style={{
      padding: '10px',
      borderRadius: '5px',
      background: 'linear-gradient(to right, #f6d365, #fda085)',
      color: 'white',
      width: '200px',
      height: '80px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      position: 'relative'
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
const availableAgents: AgentConfig[] = [
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
const availableTools = [
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

const TaskOrchestrationPage: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [agentModalVisible, setAgentModalVisible] = useState(false);
  const [toolModalVisible, setToolModalVisible] = useState(false);
  const [nodeForm] = Form.useForm();

  // 加载已有智能体数据
  useEffect(() => {
    // 在实际应用中，这里应该是从API获取数据
    console.log('加载智能体数据');
    // fetchAgents().then(data => setAvailableAgents(data));
  }, []);

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
  const handleSelectTool = (tool: any) => {
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
  const saveWorkflow = () => {
    const workflow = {
      nodes,
      edges,
    };
    console.log('保存工作流:', workflow);
    // 这里实际项目中应该调用API保存
    message.success('工作流已保存');
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
      render: (text: string, record: AgentConfig) => (
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
      render: (text: string, record: AgentConfig) => (
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
      render: (text: string, record: any) => (
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
              onInit={setReactFlowInstance}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
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
              
              <Panel position="bottom-right">
                <Button type="primary" onClick={saveWorkflow}>
                  保存工作流
                </Button>
              </Panel>
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
      </div>
    </>
  );
};

export default TaskOrchestrationPage; 