import React from 'react';
import { Form, Input, InputNumber, Switch, Button, Card, Space } from 'antd';
import { Assistant } from '../../../utils/mockData';

interface QASettingsFormValues {
  maxTokens: number;
  temperature: number;
  topK: number;
  similarityThreshold: number;
  enableCache: boolean;
  cacheExpiration: number;
}

interface QASettingsProps {
  assistantId: string;
  assistant: Assistant | undefined;
}

export const QASettings: React.FC<QASettingsProps> = ({ assistantId, assistant }) => {
  const [form] = Form.useForm<QASettingsFormValues>();

  const handleSave = (values: QASettingsFormValues) => {
    console.log('Save settings:', values);
  };

  return (
    <div className="p-4">
      <Card title={`${assistant?.name || '助手'} 的问答设置`}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            maxTokens: 2048,
            temperature: 0.7,
            topK: 3,
            similarityThreshold: 0.8,
            enableCache: true,
            cacheExpiration: 24
          }}
          onFinish={handleSave}
        >
          <Form.Item
            label="最大 Token 数"
            name="maxTokens"
            rules={[{ required: true, message: '请输入最大 Token 数' }]}
          >
            <InputNumber min={1} max={4096} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="温度"
            name="temperature"
            rules={[{ required: true, message: '请输入温度值' }]}
          >
            <InputNumber min={0} max={1} step={0.1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Top-K 检索数量"
            name="topK"
            rules={[{ required: true, message: '请输入检索数量' }]}
          >
            <InputNumber min={1} max={10} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="相似度阈值"
            name="similarityThreshold"
            rules={[{ required: true, message: '请输入相似度阈值' }]}
          >
            <InputNumber min={0} max={1} step={0.1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="启用缓存"
            name="enableCache"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="缓存过期时间（小时）"
            name="cacheExpiration"
            rules={[{ required: true, message: '请输入缓存过期时间' }]}
          >
            <InputNumber min={1} max={720} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存设置
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