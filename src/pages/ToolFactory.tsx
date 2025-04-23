import React, { useState } from 'react';
import { Tabs, Card, Form, Input, Select, Tag, Button, Space, message, Typography, Divider } from 'antd';
import { PlusOutlined, PlayCircleOutlined, CodeOutlined, TagOutlined, InfoCircleOutlined } from '@ant-design/icons';
import PageHeader from '../components/layout/PageHeader';
import MonacoEditor from '@monaco-editor/react';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

// 工具类别选项
const categories = [
  { value: 'general', label: '通用工具' },
  { value: 'data', label: '数据处理' },
  { value: 'api', label: 'API 集成' },
  { value: 'ai', label: 'AI 工具' },
];

// 标签颜色映射
const tagColors = {
  '数据处理': 'blue',
  'API': 'green',
  'AI': 'purple',
  '通用': 'default',
};

interface FormValues {
  name: string;
  description?: string;
  category: string;
}

const MCPToolForm: React.FC = () => {
  const [form] = Form.useForm();
  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [code, setCode] = useState('');

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter(tag => tag !== removedTag);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      // TODO: 实现提交逻辑
      console.log('Form values:', { ...values, tags, code });
      message.success('工具创建成功！');
    } catch {
      message.error('工具创建失败，请重试！');
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-1/2 pr-4">
        <Card 
          title={
            <div className="flex items-center">
              <CodeOutlined className="text-blue-500 mr-2" />
              <span>创建 MCP 工具</span>
            </div>
          }
          className="h-full"
          headStyle={{
            background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.05), rgba(9, 109, 217, 0.05))',
            borderBottom: '1px solid rgba(24, 144, 255, 0.1)'
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="h-full"
          >
            <Form.Item
              name="name"
              label={
                <div className="flex items-center">
                  <span>工具名称</span>
                  <Text type="secondary" className="ml-2 text-xs">(必填)</Text>
                </div>
              }
              rules={[{ required: true, message: '请输入工具名称' }]}
            >
              <Input 
                placeholder="请输入工具名称" 
                className="rounded-md"
                prefix={<InfoCircleOutlined className="text-gray-400" />}
              />
            </Form.Item>

            <Form.Item
              name="description"
              label={
                <div className="flex items-center">
                  <span>工具描述</span>
                  <Text type="secondary" className="ml-2 text-xs">(选填)</Text>
                </div>
              }
            >
              <TextArea 
                rows={4} 
                placeholder="请输入工具描述" 
                className="rounded-md"
              />
            </Form.Item>

            <Form.Item
              name="category"
              label="工具类别"
              initialValue="general"
            >
              <Select className="rounded-md">
                {categories.map(category => (
                  <Option key={category.value} value={category.value}>
                    {category.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label={
              <div className="flex items-center">
                <TagOutlined className="mr-2" />
                <span>工具标签</span>
              </div>
            }>
              <div className="p-3 bg-gray-50 rounded-md">
                {tags.map((tag) => {
                  const isLongTag = tag.length > 20;
                  const tagElem = (
                    <Tag
                      key={tag}
                      closable
                      onClose={() => handleClose(tag)}
                      color={tagColors[tag as keyof typeof tagColors] || 'default'}
                      className="mb-2 mr-2"
                    >
                      {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                    </Tag>
                  );
                  return tagElem;
                })}
                {inputVisible && (
                  <Input
                    type="text"
                    size="small"
                    style={{ width: 78 }}
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                    className="rounded-md"
                  />
                )}
                {!inputVisible && (
                  <Tag 
                    onClick={showInput} 
                    style={{ background: '#fff', borderStyle: 'dashed' }}
                    className="cursor-pointer"
                  >
                    <PlusOutlined /> 添加标签
                  </Tag>
                )}
              </div>
            </Form.Item>

            <Form.Item
              label={
                <div className="flex items-center">
                  <CodeOutlined className="mr-2" />
                  <span>工具代码</span>
                  <Text type="secondary" className="ml-2 text-xs">(必填)</Text>
                </div>
              }
              required
            >
              <div className="rounded-md overflow-hidden border border-gray-200">
                <MonacoEditor
                  height="300px"
                  defaultLanguage="python"
                  theme="vs-dark"
                  value={code}
                  onChange={(value: string | undefined) => setCode(value || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 10 },
                  }}
                />
              </div>
            </Form.Item>

            <Divider />

            <Form.Item>
              <Space>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<PlayCircleOutlined />}
                  style={{
                    background: 'linear-gradient(135deg, #1890ff, #096dd9)',
                    border: 'none',
                    boxShadow: '0 2px 6px rgba(24, 144, 255, 0.2)'
                  }}
                  className="rounded-md"
                >
                  创建并调试
                </Button>
                <Button className="rounded-md">取消</Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>

      <div className="w-1/2 pl-4">
        <Card 
          title={
            <div className="flex items-center">
              <PlayCircleOutlined className="text-blue-500 mr-2" />
              <span>调试面板</span>
            </div>
          }
          className="h-full"
          headStyle={{
            background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.05), rgba(9, 109, 217, 0.05))',
            borderBottom: '1px solid rgba(24, 144, 255, 0.1)'
          }}
        >
          <div className="flex flex-col h-full">
            <div className="flex-1 bg-gray-50 p-6 rounded-md border border-gray-200">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <Text>调试状态：就绪</Text>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <Text>运行环境：Python 3.11</Text>
                </div>
                <Divider />
                <div>
                  <Text strong>调试日志：</Text>
                  <div className="mt-2 p-3 bg-gray-100 rounded-md">
                    <Text type="secondary">等待开始调试...</Text>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-4">
              <Button 
                type="primary"
                style={{
                  background: 'linear-gradient(135deg, #1890ff, #096dd9)',
                  border: 'none',
                  boxShadow: '0 2px 6px rgba(24, 144, 255, 0.2)'
                }}
                className="rounded-md"
              >
                开始调试
              </Button>
              <Button 
                type="primary"
                style={{
                  background: 'linear-gradient(135deg, #1890ff, #096dd9)',
                  border: 'none',
                  boxShadow: '0 2px 6px rgba(24, 144, 255, 0.2)'
                }}
                className="rounded-md"
              >
                部署工具
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const ToolFactory: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="工具工厂"
        parentTitle="工具广场"
        description="创建和管理您的自定义工具"
      />

      <div className="flex-1 min-h-0 overflow-auto p-6">
        <Tabs defaultActiveKey="mcp">
          <TabPane tab="MCP 工具" key="mcp">
            <MCPToolForm />
          </TabPane>
          <TabPane tab="自定义 API 工具" key="api">
            <div className="text-center py-8">
              <p className="text-gray-500">自定义 API 工具功能开发中...</p>
            </div>
          </TabPane>
          <TabPane tab="Agent 工具" key="agent">
            <div className="text-center py-8">
              <p className="text-gray-500">Agent 工具功能开发中...</p>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default ToolFactory; 