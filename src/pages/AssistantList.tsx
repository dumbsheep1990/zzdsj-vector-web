import React from 'react';
import { List, Modal, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// 布局组件
import PageHeader from '../components/layout/PageHeader';

// 助手相关组件
import { 
  AssistantCard, 
  AssistantFilter, 
  AssistantForm, 
  ModifiedAssistant as Assistant
} from '../components/modules/assistants';
import AssistantTypeSelector from '../components/modules/assistants/AssistantTypeSelector';
import { AssistantListSkeleton } from '../components/skeleton';

// 自定义Hooks - 使用集成的助手页面管理Hook
import { useAssistantPage } from '../hooks/assistants/useAssistantPage';

/**
 * 助手列表页面组件
 * 展示所有助手，并提供创建、编辑、删除和状态管理功能
 */
const AssistantList: React.FC = () => {
  // 使用Form实例
  const [form] = Form.useForm();
  
  // 使用集成的助手页面管理Hook
  const {
    // 数据状态
    assistants,
    filteredAssistants,
    isLoading,
    isDeleting,
    isSubmitting,
    error,
    errors,
    filterOptions,
    currentAssistant,
    
    // 模态框状态
    isTypeSelectModalVisible,
    isCreateModalVisible,
    isEditModalVisible,
    selectedAssistantType,
    
    // 方法
    handleCreate,
    handleTypeSelect,
    handleDelete,
    handleStatusChange,
    handleFormSubmit,
    handleFormCancel,
    handleFilterStatusChange,
    handleSortOrderChange,
    getAssistantTypeTitle,
    handleEdit,
    _setFormValues,
    
    // 搜索相关
    setSearchText
  } = useAssistantPage();
  
  // 我们需要将handleEdit和_setFormValues结合起来使用
  const handleEditWithForm = (assistant: Assistant) => {
    handleEdit(assistant);
    _setFormValues(assistant, form);
  };
  
  // 处理API错误 - 只记录错误，不阻止界面渲染
  if (error) {
    // 可以根据错误类型显示不同的错误信息
    console.error('助手管理API错误:', error);
    // 实际项目中可考虑显示错误通知或提示重试
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="shrink-0">
        <PageHeader 
          title="助手列表" 
          parentTitle="问答助手"
          description={isLoading ? '加载中...' : `共 ${assistants.length} 个助手`}
          primaryActions={[
            {
              icon: <PlusOutlined />,
              label: '新建助手',
              onClick: handleCreate,
              disabled: isLoading
            }
          ]}
          filterComponent={
            isLoading ? null : (
              <AssistantFilter 
                filterStatus={filterOptions.searchText}
                setFilterStatus={handleFilterStatusChange}
                sortOrder={'newest'} 
                setSortOrder={handleSortOrderChange}
                onSearch={(value) => setSearchText(value)}
              />
            )
          }
        />
      </div>
      
      <div className="flex-1 min-h-0 overflow-auto bg-gray-50 p-6" data-testid="assistant-list-container">
        {isLoading ? (
          <AssistantListSkeleton count={8} columns={4} />
        ) : (
          <List<Assistant>
            grid={{ gutter: 12, xs: 1, sm: 1, md: 1, lg: 2, xl: 3, xxl: 4 }}
            dataSource={filteredAssistants}
            renderItem={(item) => (
              <List.Item className="mb-3">
                <AssistantCard
                  assistant={item}
                  handleEdit={handleEditWithForm}
                  handleDelete={handleDelete}
                  handleStatusChange={handleStatusChange}
                />
              </List.Item>
            )}
          />
        )}
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
          errors={errors}
          isSubmitting={isSubmitting}
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
          errors={errors}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default AssistantList;
