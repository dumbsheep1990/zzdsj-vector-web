import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, Typography, message } from 'antd';
import { 
  ApiOutlined, 
  GlobalOutlined, 
  DesktopOutlined,
  LinkOutlined
} from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

interface CreateProviderModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const CreateProviderModal: React.FC<CreateProviderModalProps> = ({
  visible,
  onCancel,
  onSuccess
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      message.success('厂商添加成功！');
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error('表单验证失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const providerTemplates = [
    {
      value: 'openai',
      label: 'OpenAI',
      icon: <GlobalOutlined />,
      description: 'GPT系列模型',
      apiBase: 'https://api.openai.com/v1'
    },
    {
      value: 'zhipu',
      label: '智谱AI',
      icon: <ApiOutlined />,
      description: 'GLM系列模型', 
      apiBase: 'https://open.bigmodel.cn/api/paas/v4'
    },
    {
      value: 'custom',
      label: '自定义厂商',
      icon: <DesktopOutlined />,
      description: '配置自定义API服务',
      apiBase: ''
    }
  ];

  const handleTemplateChange = (value: string) => {
    const template = providerTemplates.find(t => t.value === value);
    if (template) {
      form.setFieldsValue({
        name: template.label,
        apiBase: template.apiBase,
        description: template.description
      });
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-3 text-lg font-semibold text-gray-800">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <ApiOutlined className="text-blue-600" />
          </div>
          <span>添加模型厂商</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      centered
      maskClosable={false}
      className="create-provider-modal"
      styles={{
        mask: {
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.45)'
        },
        content: {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        }
      }}
    >
      <div className="p-2">
        <div className="mb-6">
          <Text type="secondary" className="text-sm">
            配置新的AI模型服务提供商，支持多种主流厂商API
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          className="space-y-6"
        >
          <Form.Item
            name="template"
            label={<span className="text-sm font-medium text-gray-700">选择厂商模板</span>}
            rules={[{ required: true, message: '请选择厂商模板' }]}
          >
            <Select
              placeholder="选择厂商模板或自定义"
              size="large"
              onChange={handleTemplateChange}
              className="w-full"
            >
              {providerTemplates.map(template => (
                <Option key={template.value} value={template.value}>
                  <div className="flex items-center space-x-3 py-1">
                    {template.icon}
                    <div>
                      <div className="font-medium">{template.label}</div>
                      <div className="text-xs text-gray-500">{template.description}</div>
                    </div>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="name"
            label={<span className="text-sm font-medium text-gray-700">厂商名称</span>}
            rules={[
              { required: true, message: '请输入厂商名称' },
              { min: 2, max: 50, message: '名称长度应在2-50个字符之间' }
            ]}
          >
            <Input
              placeholder="输入厂商名称"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span className="text-sm font-medium text-gray-700">厂商描述</span>}
            rules={[{ max: 200, message: '描述不能超过200个字符' }]}
          >
            <Input.TextArea
              placeholder="输入厂商描述（可选）"
              rows={3}
              className="rounded-lg"
              showCount
              maxLength={200}
            />
          </Form.Item>

          <Form.Item
            name="apiBase"
            label={<span className="text-sm font-medium text-gray-700">API Base URL</span>}
            rules={[
              { required: true, message: '请输入API Base URL' },
              { type: 'url', message: '请输入有效的URL地址' }
            ]}
          >
            <Input
              placeholder="https://api.example.com/v1"
              size="large"
              prefix={<LinkOutlined className="text-gray-400" />}
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="apiKey"
            label={<span className="text-sm font-medium text-gray-700">API Key</span>}
            rules={[{ required: true, message: '请输入API Key' }]}
          >
            <Input.Password
              placeholder="输入API Key"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="text-blue-500 mt-0.5">💡</div>
              <div className="text-blue-700 text-sm">
                <div className="font-medium mb-1">配置提示</div>
                <div className="space-y-1 text-xs">
                  <div>• API Key将被加密存储，仅用于模型调用</div>
                  <div>• 添加后系统将自动测试连接并同步可用模型</div>
                  <div>• 可在厂商列表中随时修改配置或禁用厂商</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button
              onClick={handleCancel}
              size="large"
              className="px-6 rounded-lg"
            >
              取消
            </Button>
            <Button
              type="primary"
              loading={loading}
              onClick={handleSubmit}
              size="large"
              className="px-6 bg-blue-600 hover:bg-blue-700 border-0 rounded-lg shadow-md"
            >
              {loading ? '正在添加...' : '添加厂商'}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default CreateProviderModal; 