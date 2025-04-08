import React from 'react';
import { Modal, Form, Input, Select, Button, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import type { ToolCategory } from '../../../utils/mockToolsData';

const { TextArea } = Input;

interface CustomToolModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (values: CustomToolValues) => void;
}

export interface CustomToolValues {
  name: string;
  category: ToolCategory;
  description: string;
  command: string;
  parameters: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean';
    required: boolean;
    description: string;
  }>;
}

const CustomToolModal: React.FC<CustomToolModalProps> = ({
  open,
  onCancel,
  onOk
}) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then(values => {
      onOk(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title="创建自定义工具"
      open={open}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          parameters: [{ name: '', type: 'string', required: true, description: '' }]
        }}
      >
        <Form.Item
          name="name"
          label="工具名称"
          rules={[{ required: true, message: '请输入工具名称' }]}
        >
          <Input placeholder="请输入工具名称" />
        </Form.Item>

        <Form.Item
          name="category"
          label="工具类别"
          rules={[{ required: true, message: '请选择工具类别' }]}
        >
          <Select placeholder="请选择工具类别">
            <Select.Option value="crawler">数据爬取</Select.Option>
            <Select.Option value="cleaner">数据清洗</Select.Option>
            <Select.Option value="formatter">数据格式化</Select.Option>
            <Select.Option value="generator">数据集生成</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="工具描述"
          rules={[{ required: true, message: '请输入工具描述' }]}
        >
          <TextArea rows={4} placeholder="请输入工具描述" />
        </Form.Item>

        <Form.Item
          name="command"
          label="执行命令"
          rules={[{ required: true, message: '请输入执行命令' }]}
        >
          <Input placeholder="请输入执行命令，例如: python script.py" />
        </Form.Item>

        <Form.List name="parameters">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'name']}
                    rules={[{ required: true, message: '参数名称必填' }]}
                  >
                    <Input placeholder="参数名称" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'type']}
                    rules={[{ required: true, message: '参数类型必填' }]}
                  >
                    <Select style={{ width: 120 }}>
                      <Select.Option value="string">字符串</Select.Option>
                      <Select.Option value="number">数字</Select.Option>
                      <Select.Option value="boolean">布尔值</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'required']}
                    valuePropName="checked"
                  >
                    <Select style={{ width: 120 }}>
                      <Select.Option value={true}>必填</Select.Option>
                      <Select.Option value={false}>选填</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'description']}
                  >
                    <Input placeholder="参数描述" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  添加参数
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default CustomToolModal; 