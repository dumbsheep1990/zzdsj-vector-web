import React, { useState } from 'react';
import { Card, Form, InputNumber, Select, Button, Space, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

interface ModelConfig {
  modelName: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  stopSequences: string[];
}

const ModelConfig: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const initialValues: ModelConfig = {
    modelName: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 2000,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    stopSequences: []
  };

  const handleSave = async (values: ModelConfig) => {
    setLoading(true);
    try {
      // 这里添加保存配置的逻辑
      console.log('保存配置:', values);
      message.success('配置保存成功');
    } catch {
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card title="模型参数配置">
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={handleSave}
        >
          <Form.Item
            name="modelName"
            label="模型名称"
            rules={[{ required: true, message: '请输入模型名称' }]}
          >
            <Select>
              <Select.Option value="gpt-3.5-turbo">GPT-3.5 Turbo</Select.Option>
              <Select.Option value="gpt-4">GPT-4</Select.Option>
              <Select.Option value="llama2">Llama 2</Select.Option>
              <Select.Option value="mistral">Mistral</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="temperature"
            label="温度 (Temperature)"
            tooltip="控制输出的随机性，值越高输出越随机"
            rules={[{ required: true, message: '请输入温度值' }]}
          >
            <InputNumber
              min={0}
              max={2}
              step={0.1}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="maxTokens"
            label="最大令牌数 (Max Tokens)"
            tooltip="控制生成文本的最大长度"
            rules={[{ required: true, message: '请输入最大令牌数' }]}
          >
            <InputNumber
              min={1}
              max={4000}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="topP"
            label="Top P"
            tooltip="控制输出的多样性，值越低输出越保守"
            rules={[{ required: true, message: '请输入Top P值' }]}
          >
            <InputNumber
              min={0}
              max={1}
              step={0.1}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="frequencyPenalty"
            label="频率惩罚 (Frequency Penalty)"
            tooltip="降低重复词出现的概率"
            rules={[{ required: true, message: '请输入频率惩罚值' }]}
          >
            <InputNumber
              min={-2}
              max={2}
              step={0.1}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="presencePenalty"
            label="存在惩罚 (Presence Penalty)"
            tooltip="增加新话题出现的概率"
            rules={[{ required: true, message: '请输入存在惩罚值' }]}
          >
            <InputNumber
              min={-2}
              max={2}
              step={0.1}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="stopSequences"
            label="停止序列"
            tooltip="当生成文本包含这些序列时停止生成"
          >
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="输入停止序列，按回车确认"
              tokenSeparators={[',']}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
              >
                保存配置
              </Button>
              <Button onClick={() => form.resetFields()}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ModelConfig; 