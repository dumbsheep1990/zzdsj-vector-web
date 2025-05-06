import React from 'react';
import { Tabs, Button, Input, Form, Select, Checkbox, Upload } from 'antd';
import { FolderOutlined, CloseOutlined } from '@ant-design/icons';

interface AddMCPModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: () => void;
}

const { TextArea } = Input;

const AddMCPModal: React.FC<AddMCPModalProps> = ({ open, onCancel, onOk }) => {
  const [form] = Form.useForm();

  // 如果未打开，不渲染任何内容
  if (!open) return null;

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

  // 自定义遮罩层样式 - 参考登录页面风格
  const maskStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  // 自定义模态框容器样式
  const modalContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: '800px',
    maxWidth: '95vw',
    maxHeight: '90vh',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15), 0 1px 8px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    animation: 'fadeIn 0.3s ease'
  };

  // 模态框背景样式 - 半透明渐变背景加模糊效果
  const modalBackgroundStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(120deg, rgba(245, 247, 250, 0.95) 0%, rgba(228, 236, 247, 0.95) 100%)',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    zIndex: -1
  };

  // 自定义标题区样式
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: 'none'
  };

  // 自定义内容区样式
  const bodyStyle: React.CSSProperties = {
    padding: '20px 24px',
    overflow: 'auto',
    maxHeight: 'calc(90vh - 110px)',
    background: 'rgba(255, 255, 255, 0.5)'
  };

  // 自定义底部区样式
  const footerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    padding: '10px 24px 20px',
    borderTop: 'none'
  };

  // CSS动画样式
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(styleTag);

  // 阻止事件冒泡
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      style={maskStyle} 
      onClick={onCancel}
    >
      <div 
        style={modalContainerStyle} 
        onClick={stopPropagation}
      >
        {/* 背景模糊层 */}
        <div style={modalBackgroundStyle} />
        
        {/* 标题栏 */}
        <div style={headerStyle}>
          <span style={{ fontSize: 16, fontWeight: 600 }}>添加服务器</span>
          <Button 
            type="text" 
            icon={<CloseOutlined />} 
            onClick={onCancel}
            style={{ marginRight: -8 }}
          />
        </div>
        
        {/* 内容区 */}
        <div style={bodyStyle}>
          <Form
            form={form}
            layout="vertical"
          >
            <Tabs
              defaultActiveKey="json"
              items={items}
              className="mt-4"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
              }}
            />
          </Form>
        </div>
        
        {/* 底部按钮区 */}
        <div style={footerStyle}>
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
      </div>
    </div>
  );
};

export default AddMCPModal;