import React, { useEffect } from 'react';
import { Form, Input, Select, Button, Space, FormInstance } from 'antd';
import { Assistant } from './types';
import { AssistantType } from './AssistantTypeSelector';

const { TextArea } = Input;
const { Option } = Select;

interface AssistantFormProps {
  form: FormInstance;
  isEdit: boolean;
  onFinish: (values: Partial<Assistant>) => void;
  onCancel: () => void;
  initialValues?: Assistant;
  assistantType?: AssistantType | null;
}

const AssistantForm: React.FC<AssistantFormProps> = ({ 
  form, 
  isEdit, 
  onFinish, 
  onCancel, 
  initialValues,
  assistantType = 'regular'
}) => {
  useEffect(() => {
    if (initialValues && isEdit) {
      form.setFieldsValue({
        name: initialValues.name,
        description: initialValues.description,
        model: initialValues.model,
        capabilities: initialValues.capabilities,
        status: initialValues.status,
        type: initialValues.type || 'regular'
      });
    } else if (assistantType) {
      // Set default capabilities based on assistant type
      let defaultCapabilities: string[] = [];
      
      switch(assistantType) {
        case 'knowledge':
          defaultCapabilities = ['知识检索', '问答系统'];
          break;
        case 'planning':
          defaultCapabilities = ['任务规划', '工具调用', '多步执行'];
          break;
        case 'regular':
        default:
          defaultCapabilities = ['内容生成', '文本分析'];
          break;
      }
      
      form.setFieldsValue({
        capabilities: defaultCapabilities,
        type: assistantType
      });
    }
  }, [form, initialValues, isEdit, assistantType]);

  // 基于助手类型获取模型选项
  const getModelOptions = () => {
    switch(assistantType) {
      case 'knowledge':
        return [
          { value: 'GPT-4', label: 'GPT-4' },
          { value: '文心一言', label: '文心一言' },
          { value: '讯飞星火', label: '讯飞星火' },
          { value: '通义千问', label: '通义千问' },
        ];
      case 'planning':
        return [
          { value: 'GPT-4', label: 'GPT-4' },
          { value: 'Claude-3', label: 'Claude-3' },
        ];
      case 'regular':
      default:
        return [
          { value: 'GPT-4', label: 'GPT-4' },
          { value: 'GPT-3.5', label: 'GPT-3.5' },
          { value: '文心一言', label: '文心一言' },
          { value: '讯飞星火', label: '讯飞星火' },
          { value: '通义千问', label: '通义千问' },
        ];
    }
  };

  // 基于助手类型获取能力选项
  const getCapabilityOptions = () => {
    const baseOptions = [
      { value: '文本分析', label: '文本分析' },
      { value: '内容生成', label: '内容生成' },
    ];

    switch(assistantType) {
      case 'knowledge':
        return [
          ...baseOptions,
          { value: '知识检索', label: '知识检索' },
          { value: '问答系统', label: '问答系统' },
          { value: '数据处理', label: '数据处理' },
        ];
      case 'planning':
        return [
          ...baseOptions,
          { value: '任务规划', label: '任务规划' },
          { value: '工具调用', label: '工具调用' },
          { value: '多步执行', label: '多步执行' },
          { value: '代码执行', label: '代码执行' },
        ];
      case 'regular':
      default:
        return [
          ...baseOptions,
          { value: '数据处理', label: '数据处理' },
          { value: '代码辅助', label: '代码辅助' },
          { value: '多模态', label: '多模态' },
          { value: '问答系统', label: '问答系统' },
        ];
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        status: 'online',
        capabilities: [],
        type: assistantType
      }}
    >
      <Form.Item
        name="type"
        hidden
      >
        <Input />
      </Form.Item>

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
          {getModelOptions().map(option => (
            <Option key={option.value} value={option.value}>{option.label}</Option>
          ))}
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
          {getCapabilityOptions().map(option => (
            <Option key={option.value} value={option.value} label={option.label}>
              {option.label}
            </Option>
          ))}
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
