import React from 'react';
import { Drawer, Form, Input, Select, Button } from 'antd';
import { FormValues } from '../../pages/workflow/types';
import { FormInstance } from 'antd/lib/form';

interface NodePropertiesDrawerProps {
  visible: boolean;
  onClose: () => void;
  form: FormInstance;
  onFinish: (values: FormValues) => void;
}

const NodePropertiesDrawer: React.FC<NodePropertiesDrawerProps> = ({
  visible,
  onClose,
  form,
  onFinish
}) => {
  return (
    <Drawer
      title="节点属性"
      placement="right"
      onClose={onClose}
      open={visible}
      width={400}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item name="label" label="名称" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        
        <Form.Item name="type" label="类型">
          <Select>
            <Select.Option value="agent">智能体</Select.Option>
            <Select.Option value="tool">工具</Select.Option>
            <Select.Option value="application">应用</Select.Option>
          </Select>
        </Form.Item>
        
        <Form.Item name="description" label="描述">
          <Input.TextArea rows={4} />
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default NodePropertiesDrawer; 