import React, { useState, useCallback } from 'react';
import ReactFlow, {
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
  ReactFlowInstance
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import PageHeader from '../../components/layout/PageHeader';
import { Button, Card, Input, Select, Typography, Drawer, Form, message } from 'antd';

// 节点数据类型定义
interface NodeData {
  label: string;
  type: string;
  description?: string;
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
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{data.label}</div>
      <div style={{ fontSize: '12px', marginTop: '5px' }}>{data.type}</div>
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
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{data.label}</div>
      <div style={{ fontSize: '12px', marginTop: '5px' }}>{data.type}</div>
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
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{data.label}</div>
      <div style={{ fontSize: '12px', marginTop: '5px' }}>{data.type}</div>
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
    data: { label: '智能体 1', type: 'Agent' },
    position: { x: 100, y: 100 },
  },
  {
    id: '2',
    type: 'agent',
    data: { label: '智能体 2', type: 'Agent' },
    position: { x: 500, y: 100 },
  },
];

// 初始边
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, label: '处理结果' },
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
  const [nodeForm] = Form.useForm();

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

  // 添加新节点
  const addNode = (type: string) => {
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
                    <Button type="primary" onClick={() => addNode('agent')}>
                      添加智能体
                    </Button>
                    <Button type="primary" onClick={() => addNode('tool')}>
                      添加工具
                    </Button>
                    <Button type="primary" onClick={() => addNode('application')}>
                      添加应用
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
      </div>
    </>
  );
};

export default TaskOrchestrationPage; 