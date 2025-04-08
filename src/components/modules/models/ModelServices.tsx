import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Modal, Form, Select, Input, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface ModelService {
  id: string;
  name: string;
  type: 'third-party' | 'ollama' | 'vllms';
  endpoint: string;
  status: 'active' | 'inactive';
  description: string;
}

const ModelServices: React.FC = () => {
  const [services, setServices] = useState<ModelService[]>([
    {
      id: '1',
      name: 'OpenAI API',
      type: 'third-party',
      endpoint: 'https://api.openai.com/v1',
      status: 'active',
      description: 'OpenAI官方API服务'
    },
    {
      id: '2',
      name: 'Local Ollama',
      type: 'ollama',
      endpoint: 'http://localhost:11434',
      status: 'active',
      description: '本地Ollama服务'
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingService, setEditingService] = useState<ModelService | null>(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: '服务名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '服务类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap = {
          'third-party': { color: 'blue', text: '第三方服务' },
          'ollama': { color: 'green', text: 'Ollama' },
          'vllms': { color: 'purple', text: 'VLLMs' }
        };
        const { color, text } = typeMap[type as keyof typeof typeMap];
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: '服务地址',
      dataIndex: 'endpoint',
      key: 'endpoint',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? '运行中' : '已停用'}
        </Tag>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: ModelService) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingService(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (service: ModelService) => {
    setEditingService(service);
    form.setFieldsValue(service);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个服务配置吗？',
      onOk: () => {
        setServices(services.filter(service => service.id !== id));
        message.success('删除成功');
      }
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingService) {
        // 编辑现有服务
        setServices(services.map(service => 
          service.id === editingService.id ? { ...service, ...values } : service
        ));
        message.success('更新成功');
      } else {
        // 添加新服务
        const newService = {
          ...values,
          id: Date.now().toString(),
          status: 'active'
        };
        setServices([...services, newService]);
        message.success('添加成功');
      }
      setIsModalVisible(false);
    });
  };

  return (
    <div className="p-6">
      <Card
        title="模型服务管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加服务
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={services}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true
          }}
        />
      </Card>

      <Modal
        title={editingService ? '编辑服务' : '添加服务'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="服务名称"
            rules={[{ required: true, message: '请输入服务名称' }]}
          >
            <Input placeholder="请输入服务名称" />
          </Form.Item>

          <Form.Item
            name="type"
            label="服务类型"
            rules={[{ required: true, message: '请选择服务类型' }]}
          >
            <Select placeholder="请选择服务类型">
              <Select.Option value="third-party">第三方服务</Select.Option>
              <Select.Option value="ollama">Ollama</Select.Option>
              <Select.Option value="vllms">VLLMs</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="endpoint"
            label="服务地址"
            rules={[{ required: true, message: '请输入服务地址' }]}
          >
            <Input placeholder="请输入服务地址" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea rows={4} placeholder="请输入服务描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ModelServices; 