import React, { useEffect } from 'react';
import { Form, Input, Select, Button, Space } from 'antd';
import { Assistant } from './types';

const { TextArea } = Input;
const { Option } = Select;

interface AssistantFormProps {
  form: any;
  isEdit: boolean;
  onFinish: (values: any) => void;
  onCancel: () => void;
  initialValues?: Assistant;
}

const AssistantForm: React.FC<AssistantFormProps> = ({ 
  form, 
  isEdit, 
  onFinish, 
  onCancel, 
  initialValues 
}) => {
  useEffect(() => {
    if (initialValues && isEdit) {
      form.setFieldsValue({
        name: initialValues.name,
        description: initialValues.description,
        model: initialValues.model,
        capabilities: initialValues.capabilities,
        status: initialValues.status
      });
    }
  }, [form, initialValues, isEdit]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        status: 'online',
        capabilities: []
      }}
    >
      <Form.Item
        name="name"
        label="助手名称"
        rules={[{ required: true, message: '请输入助手名称' }]}
      >
        <Input placeholder="请输入助手名称" />
      </Form.Item>

      <Form.Item
        name="description"
        label="助手描述"
        rules={[{ required: true, message: '请输入助手描述' }]}
      >
        <TextArea 
          placeholder="请输入助手描述" 
          autoSize={{ minRows: 3, maxRows: 5 }} 
        />
      </Form.Item>

      <Form.Item
        name="model"
        label="基础模型"
        rules={[{ required: true, message: '请选择基础模型' }]}
      >
        <Select placeholder="请选择基础模型">
          <Option value="GPT-4">GPT-4</Option>
          <Option value="GPT-3.5">GPT-3.5</Option>
          <Option value="文心一言">文心一言</Option>
          <Option value="讯飞星火">讯飞星火</Option>
          <Option value="通义千问">通义千问</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="capabilities"
        label="助手能力"
      >
        <Select 
          mode="multiple" 
          placeholder="请选择助手能力"
          optionLabelProp="label"
        >
          <Option value="文本分析" label="文本分析">文本分析</Option>
          <Option value="内容生成" label="内容生成">内容生成</Option>
          <Option value="数据处理" label="数据处理">数据处理</Option>
          <Option value="代码辅助" label="代码辅助">代码辅助</Option>
          <Option value="多模态" label="多模态">多模态</Option>
          <Option value="问答系统" label="问答系统">问答系统</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="status"
        label="助手状态"
        rules={[{ required: true, message: '请选择助手状态' }]}
      >
        <Select placeholder="请选择助手状态">
          <Option value="online">在线</Option>
          <Option value="offline">离线</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Space className="w-full justify-end">
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" htmlType="submit">
            {isEdit ? '保存' : '创建'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AssistantForm;
