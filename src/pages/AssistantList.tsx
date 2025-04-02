import React, { useState } from 'react';
import { List, Badge, Modal, Form, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageHeader from '../components/layout/PageHeader';
import { 
  AssistantCard, 
  AssistantFilter, 
  AssistantForm, 
  getFilteredAssistants,
  ModifiedAssistant as Assistant
} from '../components/modules/assistants';
import { mockAssistants } from '../utils/mockData';

const AssistantList: React.FC = () => {
  // 状态管理
  const [assistants, setAssistants] = useState<Assistant[]>(mockAssistants);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentAssistant, setCurrentAssistant] = useState<Assistant | null>(null);
  const [form] = Form.useForm();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');
  const [searchText, setSearchText] = useState<string>('');

  // 切换收藏状态
  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fav => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

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

  // 创建助手
  const handleCreate = () => {
    setIsCreateModalVisible(true);
  };

  // 表单提交
  const handleFormSubmit = (values: any) => {
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
        name: values.name,
        description: values.description,
        model: values.model,
        status: values.status,
        createTime: new Date().toISOString().split('T')[0] + ' 00:00:00',
        capabilities: values.capabilities || [],
      };
      setAssistants([...assistants, newAssistant]);
      message.success('助手已创建');
      setIsCreateModalVisible(false);
    }
    form.resetFields();
  };

  // 关闭模态框
  const handleFormCancel = () => {
    setIsCreateModalVisible(false);
    setIsEditModalVisible(false);
    form.resetFields();
  };

  // 获取过滤后的助手列表
  const filteredAssistants = getFilteredAssistants(assistants, filterStatus, sortOrder, searchText);

  return (
    <div className="flex-1 flex flex-col overflow-auto">
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
      
      <div className="p-6 flex-1 overflow-auto bg-gray-50">
        <List<Assistant>
          grid={{ gutter: 12, xs: 1, sm: 1, md: 1, lg: 2, xl: 3, xxl: 4 }}
          dataSource={filteredAssistants}
          renderItem={(item) => (
            <List.Item className="mb-3">
              <Badge.Ribbon 
                text={favorites.includes(item.id) ? '已收藏' : null} 
                color="gold" 
                style={{ display: favorites.includes(item.id) ? 'block' : 'none' }}
              >
                <AssistantCard
                  assistant={item}
                  isFavorite={favorites.includes(item.id)}
                  toggleFavorite={toggleFavorite}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  handleStatusChange={handleStatusChange}
                />
              </Badge.Ribbon>
            </List.Item>
          )}
        />
      </div>

      {/* 创建助手模态框 */}
      <Modal
        title="新建助手"
        open={isCreateModalVisible}
        onCancel={handleFormCancel}
        footer={null}
        width={600}
      >
        <AssistantForm
          form={form}
          isEdit={false}
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
