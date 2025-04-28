import React, { useState } from 'react';
import { List, Modal, Form, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageHeader from '../components/layout/PageHeader';
import { 
  AssistantCard, 
  AssistantFilter, 
  AssistantForm, 
  ModifiedAssistant as Assistant
} from '../components/modules/assistants';
import AssistantTypeSelector, { AssistantType } from '../components/modules/assistants/AssistantTypeSelector';
import { mockAssistants } from '../utils/mockData';

// Helper function to map old types to AssistantType
const mapOldTypeToAssistantType = (oldType: 'qa' | 'chat' | 'custom'): AssistantType => {
  switch (oldType) {
    case 'qa': return 'knowledge';
    case 'chat': return 'regular';
    case 'custom': return 'planning';
  }
};

const AssistantList: React.FC = () => {
  // 状态管理
  const [assistants, setAssistants] = useState<Assistant[]>(
    mockAssistants.map(a => ({
      ...a,
      model: a.config.model,
      status: a.status === 'training' ? 'offline' : a.status,
      type: mapOldTypeToAssistantType(a.type) // Map the type here
    }))
  );
  const [isTypeSelectModalVisible, setIsTypeSelectModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedAssistantType, setSelectedAssistantType] = useState<AssistantType | null>(null);
  const [currentAssistant, setCurrentAssistant] = useState<Assistant | null>(null);
  const [form] = Form.useForm();
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');
  const [searchText] = useState<string>('');

  // 切换在线状态
  const handleStatusChange = (id: string, status: 'online' | 'offline') => {
    setAssistants(prevAssistants => 
      prevAssistants.map(assistant => 
        assistant.id === id 
          ? { ...assistant, status }
          : assistant
      )
    );
    message.success(`${status === 'online' ? '已启用' : '已停用'}助手服务`);
  };

  // 编辑助手
  const handleEdit = (assistant: Assistant) => {
    setCurrentAssistant(assistant);
    setIsEditModalVisible(true);
  };

  // 删除助手
  const handleDelete = (id: string) => {
    const assistant = assistants.find(a => a.id === id);
    if (!assistant) return;
    
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除助手 "${assistant.name}" 吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        setAssistants(assistants.filter(a => a.id !== id));
        message.success('助手已删除');
      }
    });
  };

  // 打开类型选择模态框
  const handleCreate = () => {
    setIsTypeSelectModalVisible(true);
  };

  // 处理类型选择
  const handleTypeSelect = (type: AssistantType) => {
    setSelectedAssistantType(type);
    setIsTypeSelectModalVisible(false);
    setIsCreateModalVisible(true);
  };

  // 表单提交
  const handleFormSubmit = (values: Partial<Assistant>) => {
    if (isEditModalVisible && currentAssistant) {
      // 处理编辑
      const updatedAssistants = assistants.map(assistant => 
        assistant.id === currentAssistant.id 
          ? { ...assistant, ...values }
          : assistant
      );
      setAssistants(updatedAssistants);
      message.success('助手已更新');
      setIsEditModalVisible(false);
    } else {
      // 处理创建
      const newAssistant: Assistant = {
        id: `assistant-${Date.now()}`,
        name: values.name!,
        description: values.description!,
        model: values.model!,
        status: values.status || 'offline',
        createTime: new Date().toISOString().split('T')[0] + ' 00:00:00',
        capabilities: values.capabilities || [],
        type: selectedAssistantType || 'regular', // 添加助手类型
      };
      setAssistants([...assistants, newAssistant]);
      message.success('助手已创建');
      setIsCreateModalVisible(false);
      setSelectedAssistantType(null);
    }
    form.resetFields();
  };

  // 关闭模态框
  const handleFormCancel = () => {
    setIsTypeSelectModalVisible(false);
    setIsCreateModalVisible(false);
    setIsEditModalVisible(false);
    setSelectedAssistantType(null);
    form.resetFields();
  };

  // 获取过滤后的助手列表
  const filteredAssistants = assistants
    .filter(a => {
      // 根据状态筛选
      if (filterStatus && a.status !== filterStatus) return false;
      
      // 根据搜索文本筛选
      if (searchText && !a.name.toLowerCase().includes(searchText.toLowerCase())) return false;
      
      return true;
    })
    .sort((a, b) => {
      // 根据排序方式排序
      if (sortOrder === 'alphabetical') {
        return a.name.localeCompare(b.name);
      } else if (sortOrder === 'newest') {
        // 使用 id 属性进行排序
        return (b.id || '').localeCompare(a.id || '');
      } else {
        // 使用 id 属性进行排序
        return (a.id || '').localeCompare(b.id || '');
      }
    });

  // 获取类型标题和表单标题
  const getAssistantTypeTitle = (type: AssistantType | null) => {
    switch (type) {
      case 'regular': return '普通问答助手';
      case 'knowledge': return '知识问答助手';
      case 'planning': return '自主规划助手';
      default: return '新建助手';
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="shrink-0">
        <PageHeader 
          title="助手列表" 
          parentTitle="问答助手"
          description={`共 ${assistants.length} 个助手`}
          primaryActions={[
            {
              icon: <PlusOutlined />,
              label: '新建助手',
              onClick: handleCreate
            }
          ]}
          filterComponent={
            <AssistantFilter 
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
          }
        />
      </div>
      
      <div className="flex-1 min-h-0 overflow-auto bg-gray-50 p-6">
        <List<Assistant>
          grid={{ gutter: 12, xs: 1, sm: 1, md: 1, lg: 2, xl: 3, xxl: 4 }}
          dataSource={filteredAssistants}
          renderItem={(item) => (
            <List.Item className="mb-3">
              <AssistantCard
                assistant={item}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleStatusChange={handleStatusChange}
              />
            </List.Item>
          )}
        />
      </div>

      {/* 助手类型选择模态框 */}
      <Modal
        title="选择助手类型"
        open={isTypeSelectModalVisible}
        onCancel={handleFormCancel}
        footer={null}
        width={800}
        centered
        bodyStyle={{ padding: '24px 32px 32px' }}
      >
        <AssistantTypeSelector onTypeSelect={handleTypeSelect} />
      </Modal>

      {/* 创建助手模态框 */}
      <Modal
        title={`新建${getAssistantTypeTitle(selectedAssistantType)}`}
        open={isCreateModalVisible}
        onCancel={handleFormCancel}
        footer={null}
        width={600}
      >
        <AssistantForm
          form={form}
          isEdit={false}
          assistantType={selectedAssistantType}
          onFinish={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </Modal>

      {/* 编辑助手模态框 */}
      <Modal
        title="编辑助手"
        open={isEditModalVisible}
        onCancel={handleFormCancel}
        footer={null}
        width={600}
      >
        <AssistantForm
          form={form}
          isEdit={true}
          onFinish={handleFormSubmit}
          onCancel={handleFormCancel}
          initialValues={currentAssistant || undefined}
        />
      </Modal>
    </div>
  );
};

export default AssistantList;
