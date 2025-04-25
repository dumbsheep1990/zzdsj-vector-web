import React from 'react';
import { Modal, Tabs, Button, Input, Form, Select, Checkbox, Upload } from 'antd';
import { FolderOutlined } from '@ant-design/icons';

interface AddMCPModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: () => void;
}

const { TextArea } = Input;

const AddMCPModal: React.FC<AddMCPModalProps> = ({ open, onCancel, onOk }) => {
  const [form] = Form.useForm();

  const items = [
    {
      key: 'json',
      label: '文件配置',
      children: (
        <div className="p-4">
          <Form.Item
            label="JSON配置"
            name="jsonConfig"
            rules={[{ required: true, message: '请输入JSON配置' }]}
          >
            <TextArea
              placeholder={`mcp配置示例
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        ...
      ]
    },
    "sseServer":{
      "url": "https://your-sse-server-url"
    }
  }
}`}
              style={{ height: 400 }}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      key: 'params',
      label: '参数配置',
      children: (
        <div className="p-4">
          <Form.Item
            label="服务器名称"
            name="serverName"
            rules={[{ required: true, message: '请输入服务器名称' }]}
          >
            <Input placeholder="输入服务器名称" />
          </Form.Item>

          <Form.Item
            label="图标"
            name="icon"
          >
            <Upload
              accept="image/*"
              maxCount={1}
              listType="picture-card"
            >
              <div>
                <FolderOutlined />
                <div style={{ marginTop: 8 }}>选择图标</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item
            label="服务器类型"
            name="serverType"
            rules={[{ required: true, message: '请选择服务器类型' }]}
          >
            <Select placeholder="标准输入输出(Stdio)">
              <Select.Option value="stdio">标准输入输出(Stdio)</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="命令"
            name="command"
            rules={[{ required: true, message: '请输入命令' }]}
          >
            <Input placeholder="npx" />
          </Form.Item>

          <Form.Item
            label="参数"
            name="args"
          >
            <Input placeholder="输入参数，用空格分隔" />
          </Form.Item>

          <Form.Item
            label="环境变量"
            name="env"
          >
            <TextArea placeholder="{}" />
          </Form.Item>

          <Form.Item
            label="描述"
            name="description"
          >
            <Input placeholder="输入服务器描述" />
          </Form.Item>

          <Form.Item
            label="自动授权"
            name="autoAuth"
          >
            <Checkbox.Group>
              <Checkbox value="all">全部</Checkbox>
              <Checkbox value="read">读取</Checkbox>
              <Checkbox value="write">写入</Checkbox>
            </Checkbox.Group>
          </Form.Item>
        </div>
      ),
    },
  ];

  return (
    <Modal
      title="添加服务器"
      open={open}
      onCancel={onCancel}
      width={800}
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onCancel}>
            取消
          </Button>
          <Button 
            type="primary" 
            onClick={onOk}
            style={{
              background: '#1890ff'
            }}
          >
            提交
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Tabs
          defaultActiveKey="json"
          items={items}
          className="mt-4"
        />
      </Form>
    </Modal>
  );
};

export default AddMCPModal; 