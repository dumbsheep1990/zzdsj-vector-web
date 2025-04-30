import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Row, Col, Typography, Modal, Divider, Tag, Tooltip, Empty, Input, Space } from 'antd';
import { PlusOutlined, EditOutlined, CopyOutlined, DeleteOutlined, SearchOutlined, SaveOutlined, DownloadOutlined, UploadOutlined, CloudUploadOutlined, CheckOutlined, FileSearchOutlined, SettingOutlined } from '@ant-design/icons';
import { getWorkflows, saveWorkflow, deleteWorkflow } from '../../utils/workflowStorage';
import PageHeader from '../../components/layout/PageHeader';
import FlowEditor from './FlowEditor';
import { Node, Edge } from '@xyflow/react';
import { message } from 'antd';

const { Title, Text } = Typography;

// 工作流数据类型
interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: string;
  updatedAt: string;
}

const TaskOrchestrationPage: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState<string>('');
  const [editorTools, setEditorTools] = useState<any>(null);
  const editorRef = useRef<any>(null);

  // 加载工作流列表
  useEffect(() => {
    const storedWorkflows = getWorkflows();
    if (storedWorkflows && storedWorkflows.length > 0) {
      setWorkflows(storedWorkflows);
    }
  }, []);

  // 过滤后的工作流
  const filteredWorkflows = workflows.filter(
    workflow => workflow.name.toLowerCase().includes(searchText.toLowerCase()) || 
               workflow.description.toLowerCase().includes(searchText.toLowerCase())
  );

  // 创建新工作流
  const handleCreateWorkflow = () => {
    setSelectedWorkflow(null);
    setIsCreateMode(true);
    setIsEditorVisible(true);
  };

  // 编辑工作流
  const handleEditWorkflow = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setIsCreateMode(false);
    setIsEditorVisible(true);
  };

  // 复制工作流
  const handleDuplicateWorkflow = (workflow: Workflow) => {
    const newWorkflow = {
      ...workflow,
      id: `workflow_${Date.now()}`,
      name: `${workflow.name} (复制)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    saveWorkflow(newWorkflow);
    setWorkflows([...workflows, newWorkflow]);
  };

  // 删除工作流确认
  const handleDeleteConfirm = (id: string) => {
    setWorkflowToDelete(id);
    setConfirmDeleteVisible(true);
  };

  // 删除工作流
  const handleDeleteWorkflow = () => {
    deleteWorkflow(workflowToDelete);
    setWorkflows(workflows.filter(w => w.id !== workflowToDelete));
    setConfirmDeleteVisible(false);
  };

  // 关闭编辑器
  const handleCloseEditor = () => {
    setIsEditorVisible(false);
  };

  // 保存工作流
  const handleSaveWorkflow = (updatedWorkflow: Workflow) => {
    saveWorkflow(updatedWorkflow);
    
    if (isCreateMode) {
      setWorkflows([...workflows, updatedWorkflow]);
    } else {
      setWorkflows(workflows.map(w => 
        w.id === updatedWorkflow.id ? updatedWorkflow : w
      ));
    }
    
    setIsEditorVisible(false);
  };

  // 处理工具栏引用
  const handleEditorRef = (tools: any) => {
    setEditorTools(tools);
  };

  return (
    <>
      <PageHeader title="任务编排" />
      <div style={{ padding: '24px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center', 
          marginBottom: '24px' 
        }}>
          <Title level={4} style={{ margin: 0 }}>所有任务流</Title>
          <Space>
            <Input
              placeholder="搜索任务流"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleCreateWorkflow}
            >
              创建任务流
            </Button>
          </Space>
        </div>
        
        {filteredWorkflows.length > 0 ? (
          <Row gutter={[16, 16]}>
            {filteredWorkflows.map(workflow => (
              <Col key={workflow.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  style={{ height: '100%' }}
                  actions={[
                    <Tooltip title="编辑" key="edit">
                      <EditOutlined onClick={() => handleEditWorkflow(workflow)} />
                    </Tooltip>,
                    <Tooltip title="复制" key="copy">
                      <CopyOutlined onClick={() => handleDuplicateWorkflow(workflow)} />
                    </Tooltip>,
                    <Tooltip title="删除" key="delete">
                      <DeleteOutlined onClick={() => handleDeleteConfirm(workflow.id)} />
                    </Tooltip>,
                  ]}
                >
                  <div 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => handleEditWorkflow(workflow)}
                  >
                    <Title level={5} ellipsis={{ tooltip: workflow.name }}>{workflow.name}</Title>
                    <Divider style={{ margin: '12px 0' }} />
                    <Text type="secondary" ellipsis={{ tooltip: workflow.description }}>
                      {workflow.description || '无描述'}
                    </Text>
                    <div style={{ marginTop: '16px' }}>
                      <Tag color="blue">{workflow.nodes.length} 节点</Tag>
                      <Tag color="green">{workflow.edges.length} 连接</Tag>
                      <Tag color="orange">
                        {new Date(workflow.updatedAt).toLocaleDateString()}
                      </Tag>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty 
            description="暂无任务流" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={handleCreateWorkflow}>
              创建第一个任务流
            </Button>
          </Empty>
        )}
      </div>

      {/* 删除确认对话框 */}
      <Modal
        title="确认删除"
        open={confirmDeleteVisible}
        onOk={handleDeleteWorkflow}
        onCancel={() => setConfirmDeleteVisible(false)}
        okText="删除"
        cancelText="取消"
      >
        <p>确定要删除此任务流吗？此操作不可恢复。</p>
      </Modal>

      {/* 任务流编辑器 */}
      <Modal
        title={
          <div style={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '0 8px'
          }}>
            <span>{isCreateMode ? "创建新任务流" : "编辑任务流"}</span>
            {editorTools && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={editorTools.handleSave}
                >
                  保存
                </Button>
                <Button
                  icon={<EditOutlined />}
                  onClick={editorTools.handleEdit}
                >
                  编辑信息
                </Button>
                <Divider type="vertical" />
                <Button
                  icon={<DownloadOutlined />}
                  onClick={editorTools.handleExport}
                >
                  导出
                </Button>
                <Button
                  icon={<UploadOutlined />}
                  onClick={editorTools.handleImport}
                >
                  导入
                </Button>
                <Divider type="vertical" />
                <Button 
                  type="primary"
                  icon={<CloudUploadOutlined />}
                  onClick={editorTools.handlePublish}
                >
                  发布
                </Button>
                <Button
                  icon={<CheckOutlined />}
                  onClick={editorTools.handleValidate}
                >
                  验证
                </Button>
                <Space style={{ marginLeft: '8px' }}>
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
                </Space>
              </div>
            )}
          </div>
        }
        open={isEditorVisible}
        onCancel={handleCloseEditor}
        footer={null}
        width="95%"
        style={{ top: 20 }}
        bodyStyle={{ height: 'calc(95vh - 108px)', padding: 0 }}
        className="flow-editor-modal"
        maskClosable={false}
        keyboard={false}
        destroyOnClose={false}
      >
        <FlowEditor 
          ref={editorRef}
          workflow={selectedWorkflow}
          isCreateMode={isCreateMode}
          onSave={handleSaveWorkflow}
          onCancel={handleCloseEditor}
          headerMode={true}
          renderHeaderTools={(tools) => {
            handleEditorRef(tools);
            return null;
          }}
        />
      </Modal>
    </>
  );
};

export default TaskOrchestrationPage; 