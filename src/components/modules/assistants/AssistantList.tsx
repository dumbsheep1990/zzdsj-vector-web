import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Button, Input, Table, Typography, Tag, Space } from 'antd';
import { AssistantType } from './AssistantTypeSelector';
import AssistantTypeModal from './AssistantTypeModal';

// Define interface for Assistant data
interface Assistant {
  id: string;
  name: string;
  description: string;
  type: AssistantType;
  createdAt: string;
}

// Dummy data for assistants - Use correct AssistantType values
const initialData: Assistant[] = [
  { id: '1', name: '客服助手', description: '处理客户咨询', type: 'knowledge', createdAt: '2024-01-15' },
  { id: '2', name: '销售助手', description: '辅助销售流程', type: 'planning', createdAt: '2024-01-16' },
  { id: '3', name: '通用助手', description: '通用问答和任务', type: 'regular', createdAt: '2024-01-17' },
];

// 助手列表组件
const AssistantList = () => {
  const [searchText, setSearchText] = useState('');
  const [isTypeSelectModalVisible, setIsTypeSelectModalVisible] = useState(false);

  // Columns configuration for the table
  const columns = [
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
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: AssistantType) => {
        let color = 'geekblue';
        if (type === 'knowledge') color = 'green';
        if (type === 'planning') color = 'volcano';
        return <Tag color={color}>{type.toUpperCase()}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (record: Assistant) => (
        <Space size="middle">
          <a onClick={() => console.log('Edit:', record.id)}>编辑</a>
          <a onClick={() => console.log('Delete:', record.id)}>删除</a>
        </Space>
      ),
    },
  ];

  // Filter data based on search text
  const filteredData = initialData.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.description.toLowerCase().includes(searchText.toLowerCase())
  );

  // 处理创建助手按钮点击
  const handleCreateClick = () => {
    setIsTypeSelectModalVisible(true);
  };

  // 处理表单取消
  const handleFormCancel = () => {
    setIsTypeSelectModalVisible(false);
  };

  // 处理类型选择
  const handleTypeSelect = (type: AssistantType) => {
    setIsTypeSelectModalVisible(false);
    console.log(`Navigate to create new assistant of type: ${type}`);
  };

  return (
    <div className="p-6">
      {/* 标题与操作区 */}
      <div className="flex justify-between items-center mb-6">
        <Typography.Title level={3} className="!mb-0">AI助手管理</Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateClick}>
          创建助手
        </Button>
      </div>

      {/* 搜索与筛选区 */}
      <div className="mb-6">
        <Input.Search
          placeholder="搜索助手名称或描述"
          allowClear
          enterButton
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: 300 }}
        />
      </div>

      {/* 助手列表表格 */}
      <Table 
        dataSource={filteredData} 
        columns={columns} 
        rowKey="id"
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 个助手`
        }}
      />

      {/* 助手类型选择模态框 */}
      <AssistantTypeModal
        open={isTypeSelectModalVisible}
        onCancel={handleFormCancel}
        onTypeSelect={handleTypeSelect}
      />
    </div>
  );
};

export default AssistantList; 