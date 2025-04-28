import React, { useState } from 'react';
import {
  Card,
  Tabs,
  Typography,
  Space,
  Button,
  Tag,
  Avatar,
  Tooltip,
  Modal,
  Form,
  Input,
  message,
  Collapse,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  ApiOutlined,
  CloudServerOutlined,
  SettingOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import PageHeader from '../components/layout/PageHeader';
import '../styles/modelSettings.css';

const { Text } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;

interface Model {
  id: string;
  name: string;
  type: 'embedding' | 'chat' | 'rerank';
  provider?: string;
  logo?: string;
  status: 'active' | 'inactive';
  lastUpdated: string;
  description?: string;
}

interface ModelProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  models: Model[];
  apiKey?: string;
  apiBase?: string;
}

// Add this after the interfaces
const MODEL_TYPE_CONFIG = {
  embedding: {
    color: '#13c2c2',          // cyan color
    bg: '#e6fffb',             // light cyan background
    borderColor: '#87e8de',    // border color
    tagColor: 'cyan',          // Ant Design tag color
    label: '嵌入',
    icon: '📊',
  },
  chat: {
    color: '#1890ff',          // blue color
    bg: '#e6f7ff',             // light blue background
    borderColor: '#91d5ff',    // border color
    tagColor: 'blue',          // Ant Design tag color
    label: '对话',
    icon: '💬',
  },
  rerank: {
    color: '#722ed1',          // purple color
    bg: '#f9f0ff',             // light purple background
    borderColor: '#d3adf7',    // border color
    tagColor: 'purple',        // Ant Design tag color
    label: '重排',
    icon: '🔄',
  },
};

// Simple model row display
const ModelRow: React.FC<{ model: Model; onDelete: () => void }> = ({ model, onDelete }) => {
  const typeMap: Record<Model['type'], { label: string; color: string }> = {
    embedding: { label: '嵌入模型', color: 'cyan' },
    chat: { label: '对话模型', color: 'blue' },
    rerank: { label: '重排模型', color: 'purple' },
  };

  return (
    <div className="flex items-center justify-between py-3 px-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
      <div className="flex items-center">
        <span className="font-medium mr-3">{model.name}</span>
        <Tag color={typeMap[model.type].color} className="mr-0">{typeMap[model.type].label}</Tag>
      </div>
      <Tooltip title="删除模型">
        <Button 
          size="small" 
          type="text" 
          danger 
          icon={<DeleteOutlined style={{ fontSize: '14px' }} />} 
          onClick={onDelete}
          className="flex items-center justify-center w-6 h-6 p-0 hover:bg-red-50"
        />
      </Tooltip>
    </div>
  );
};

const ModelSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('local');
  const [isConfigModalVisible, setIsConfigModalVisible] = useState(false);
  const [isModelModalVisible, setIsModelModalVisible] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<ModelProvider | null>(null);
  const [configForm] = Form.useForm();

  // 本地模型数据
  const localModels: Model[] = [
    {
      id: 'local-1',
      name: 'Local Embedding BERT',
      type: 'embedding',
      status: 'active',
      lastUpdated: '2024-07-25',
      description: '本地部署的BERT嵌入模型'
    },
    {
      id: 'local-2',
      name: 'Local Llama3 Chat',
      type: 'chat',
      status: 'inactive',
      lastUpdated: '2024-07-24',
      description: '本地部署的Llama 3对话模型'
    },
  ];

  // 第三方模型按提供商分组
  const [modelProviders, setModelProviders] = useState<ModelProvider[]>([
    {
      id: 'zhipu',
      name: '智谱AI',
      logo: '/zhipu-logo.png',
      description: '智谱AI是一家专注于大模型研发的中国人工智能公司，提供GLM系列模型。',
      apiKey: '',
      apiBase: 'https://open.bigmodel.cn/api/paas/v4',
      models: [
        {
          id: 'zhipu-1',
          name: 'GLM-4',
          provider: '智谱AI',
          type: 'chat',
          status: 'active',
          lastUpdated: '2024-07-20',
          description: '智谱AI的旗舰大语言模型，支持多轮对话和复杂推理'
        },
        {
          id: 'zhipu-2',
          name: 'GLM 嵌入模型',
          provider: '智谱AI',
          type: 'embedding',
          status: 'active',
          lastUpdated: '2024-07-18',
          description: '智谱AI开发的文本嵌入模型'
        }
      ]
    },
    {
      id: 'baidu',
      name: '百度文心',
      logo: '/baidu-logo.png',
      description: '百度文心大模型是百度研发的知识增强大语言模型，具有中文理解和知识覆盖优势。',
      models: [
        {
          id: 'baidu-1',
          name: '文心一言',
          provider: '百度',
          type: 'chat',
          status: 'active',
          lastUpdated: '2024-07-15',
          description: '百度的旗舰大语言模型，支持多轮对话和知识问答'
        }
      ]
    },
    {
      id: 'alibaba',
      name: '阿里通义',
      logo: '/alibaba-logo.png',
      description: '阿里巴巴人工智能实验室开发的大语言模型，具有强大的中文理解能力。',
      models: [
        {
          id: 'ali-1',
          name: '通义千问',
          provider: '阿里巴巴',
          type: 'chat',
          status: 'active',
          lastUpdated: '2024-07-10',
          description: '阿里巴巴的旗舰大语言模型'
        },
        {
          id: 'ali-2',
          name: '通义Embedding',
          provider: '阿里巴巴',
          type: 'embedding',
          status: 'active',
          lastUpdated: '2024-07-08',
          description: '阿里巴巴的文本嵌入模型'
        }
      ]
    },
    {
      id: 'tencent',
      name: '腾讯混元',
      logo: '/tencent-logo.png',
      description: '腾讯开发的大语言模型，擅长中文创作和多轮对话。',
      models: [
        {
          id: 'tencent-1',
          name: '混元',
          provider: '腾讯',
          type: 'chat',
          status: 'active',
          lastUpdated: '2024-07-05',
          description: '腾讯的大语言模型，支持创意写作和内容生成'
        }
      ]
    },
    {
      id: 'iflytek',
      name: '讯飞星火',
      logo: '/iflytek-logo.png',
      description: '科大讯飞开发的大语言模型，在语音交互和垂直领域应用方面具有优势。',
      models: [
        {
          id: 'iflytek-1',
          name: '星火认知',
          provider: '科大讯飞',
          type: 'chat',
          status: 'active',
          lastUpdated: '2024-07-01',
          description: '科大讯飞的大语言模型，专注于认知智能和语音交互'
        }
      ]
    },
    {
      id: 'openai',
      name: 'OpenAI',
      logo: '/openai-logo.png',
      description: 'OpenAI是全球领先的AI研究实验室，提供GPT系列模型。',
      models: [
        {
          id: 'openai-1',
          name: 'GPT-4 Turbo',
          provider: 'OpenAI',
          type: 'chat',
          status: 'active',
          lastUpdated: '2024-07-20',
          description: 'OpenAI\'s flagship large language model.'
        },
        {
          id: 'openai-2',
          name: 'text-embedding-3-large',
          provider: 'OpenAI',
          type: 'embedding',
          status: 'active',
          lastUpdated: '2024-07-18',
          description: 'OpenAI的高性能文本嵌入模型'
        }
      ]
    },
    {
      id: 'cohere',
      name: 'Cohere',
      logo: '/cohere-logo.png',
      description: 'Cohere专注于NLP和文本理解，提供对话和嵌入模型。',
      models: [
        {
          id: 'cohere-1',
          name: 'Command R+',
          provider: 'Cohere',
          type: 'chat',
          status: 'active',
          lastUpdated: '2024-07-15',
          description: 'Cohere的对话模型，擅长工具使用和信息检索'
        },
        {
          id: 'cohere-2',
          name: 'Rerank',
          provider: 'Cohere',
          type: 'rerank',
          status: 'active',
          lastUpdated: '2024-07-18',
          description: 'Cohere\'s reranking model for improving search relevance.'
        }
      ]
    },
  ]);

  // 打开配置模态框
  const showConfigModal = (provider: ModelProvider, e: React.MouseEvent) => {
    e.stopPropagation(); // 防止触发折叠面板
    setCurrentProvider(provider);
    configForm.setFieldsValue({
      apiKey: provider.apiKey || '',
      apiBase: provider.apiBase || '',
    });
    setIsConfigModalVisible(true);
  };

  // 保存配置
  const handleConfigSave = async () => {
    try {
      const values = await configForm.validateFields();
      
      // 测试接口
      message.loading('正在测试接口连接...', 1.5);
      
      // 这里应该是实际的接口测试逻辑
      // 模拟异步接口测试
      setTimeout(() => {
        // 成功后更新提供商信息
        if (currentProvider) {
          setModelProviders(prev => 
            prev.map(p => 
              p.id === currentProvider.id 
                ? {...p, apiKey: values.apiKey, apiBase: values.apiBase} 
                : p
            )
          );
          message.success('配置保存成功且接口测试通过');
          setIsConfigModalVisible(false);
        }
      }, 1500);
      
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 打开模型选择模态框
  const showModelModal = (provider: ModelProvider, e: React.MouseEvent) => {
    e.stopPropagation(); // 防止触发折叠面板
    
    // 检查是否有API密钥配置
    if (!provider.apiKey) {
      message.warning('请先配置API密钥');
      return;
    }
    
    setCurrentProvider(provider);
    // 这里应该请求厂商的模型列表
    message.loading('正在获取可用模型列表...', 1.5);
    
    // 模拟异步获取模型
    setTimeout(() => {
      setIsModelModalVisible(true);
    }, 1500);
  };

  // 渲染本地模型列表
  const renderLocalModels = () => (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 mb-4 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <Text strong>本地模型列表</Text>
          <Button type="primary" icon={<PlusOutlined />} size="small">
            添加模型
          </Button>
        </div>
        {localModels.map((model) => (
          <ModelRow 
            key={model.id}
            model={model} 
            onDelete={() => console.log('Delete', model.id)} 
          />
        ))}
        {localModels.length === 0 && (
          <div className="py-8 text-center text-gray-400">
            暂无本地模型，请点击"添加模型"按钮添加
          </div>
        )}
      </div>
    </div>
  );

  // 渲染第三方模型提供商列表
  const renderThirdPartyModels = () => (
    <div>
      <div className="mb-5 flex justify-between items-center bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <div>
          <Text strong className="text-lg mb-1 block">第三方模型管理</Text>
          <Text type="secondary">按提供商分组显示第三方模型，可配置API密钥并选择启用的模型</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>
          添加第三方模型
        </Button>
      </div>
      
      <Collapse 
        defaultActiveKey={['zhipu', 'baidu']} 
        className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden provider-collapse"
        expandIcon={() => null}
        ghost
      >
        {modelProviders.map((provider) => (
          <Panel 
            key={provider.id} 
            className="provider-panel"
            header={
              <div className="flex items-center justify-between w-full py-4">
                <div className="flex items-center">
                  <Avatar src={provider.logo} size={32} className="mr-4" />
                  <div>
                    <span className="font-medium text-base">{provider.name}</span>
                    <div className="flex items-center mt-1">
                      {provider.apiKey ? (
                        <Tag className="mr-2" color="success">
                          <CheckCircleOutlined className="mr-1" />已配置
                        </Tag>
                      ) : (
                        <Tag className="mr-2" color="default">未配置API</Tag>
                      )}
                      <Tag color="blue">{provider.models.length} 个模型</Tag>
                    </div>
                  </div>
                </div>
                <div className="flex items-center" onClick={e => e.stopPropagation()}>
                  <Tooltip title="配置 API">
                    <Button 
                      type="text"
                      className="mr-2"
                      size="small"
                      icon={<SettingOutlined />} 
                      onClick={(e) => showConfigModal(provider, e)}
                    >
                      配置
                    </Button>
                  </Tooltip>
                  <Tooltip title="选择模型">
                    <Button 
                      type="text"
                      disabled={!provider.apiKey}
                      size="small"
                      icon={<AppstoreOutlined />} 
                      onClick={(e) => showModelModal(provider, e)}
                    >
                      模型
                    </Button>
                  </Tooltip>
                </div>
              </div>
            }
          >
            <div className="px-5 pb-4 pt-1">
              {provider.models.length > 0 ? (
                <div>
                  <div className="flex items-center mb-2">
                    <Tag color="blue" className="mr-2 text-xs">已启用模型</Tag>
                    <span className="text-xs text-gray-400">{provider.models.length} 个模型</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {provider.models.map(model => {
                      const typeConfig = MODEL_TYPE_CONFIG[model.type];
                      return (
                        <div 
                          key={model.id} 
                          className="inline-flex items-center justify-between rounded-md pl-2 pr-1 py-1 shadow-sm"
                          style={{ 
                            backgroundColor: typeConfig.bg,
                            borderColor: typeConfig.borderColor,
                            border: `1px solid ${typeConfig.borderColor}` 
                          }}
                        >
                          <span className="mr-1 text-sm">{typeConfig.icon}</span>
                          <span className="mr-2 text-sm font-medium" style={{ color: typeConfig.color }}>
                            {model.name}
                          </span>
                          <Tag 
                            color={typeConfig.tagColor}
                            className="text-xs m-0"
                          >
                            {typeConfig.label}
                          </Tag>
                          <Button 
                            size="small" 
                            type="text" 
                            danger 
                            icon={<DeleteOutlined style={{ fontSize: '14px' }} />} 
                            onClick={() => console.log('Delete', model.id)}
                            className="flex items-center justify-center w-5 h-5 p-0 ml-1"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-gray-400">
                  {provider.apiKey ? 
                    '暂无模型，请点击"模型"按钮选择启用的模型' : 
                    '请先配置API密钥，然后选择启用的模型'
                  }
                </div>
              )}
            </div>
          </Panel>
        ))}
      </Collapse>

      {/* 配置接口模态框 */}
      <Modal
        title={
          <div className="flex items-center">
            {currentProvider?.logo && (
              <Avatar src={currentProvider.logo} size="small" className="mr-2" />
            )}
            <span>配置 {currentProvider?.name} API</span>
          </div>
        }
        open={isConfigModalVisible}
        onOk={handleConfigSave}
        onCancel={() => setIsConfigModalVisible(false)}
        okText="测试并保存"
        okButtonProps={{ type: 'primary' }}
        cancelText="取消"
        maskClosable={false}
        centered
        bodyStyle={{ padding: '24px' }}
      >
        <Form
          form={configForm}
          layout="vertical"
        >
          <Form.Item
            name="apiKey"
            label="API Key"
            rules={[{ required: true, message: '请输入API Key' }]}
          >
            <Input.Password placeholder="请输入API Key" />
          </Form.Item>
          <Form.Item
            name="apiBase"
            label="API Base URL"
            rules={[{ required: true, message: '请输入API Base URL' }]}
          >
            <Input placeholder="请输入API Base URL" />
          </Form.Item>
          <div className="text-sm text-gray-400 mt-2">
            <p>配置完成后，系统将自动测试API连接，测试成功后可选择启用的模型。</p>
          </div>
        </Form>
      </Modal>

      {/* 模型选择模态框 */}
      <Modal
        title={
          <div className="flex items-center">
            {currentProvider?.logo && (
              <Avatar src={currentProvider.logo} size="small" className="mr-2" />
            )}
            <span>选择 {currentProvider?.name} 可用模型</span>
          </div>
        }
        open={isModelModalVisible}
        onOk={() => setIsModelModalVisible(false)}
        onCancel={() => setIsModelModalVisible(false)}
        okText="确认选择"
        okButtonProps={{ type: 'primary' }}
        cancelText="取消"
        width={600}
        maskClosable={false}
        centered
        bodyStyle={{ padding: '16px' }}
      >
        <div className="bg-gray-50 p-3 mb-4 rounded-md text-sm">
          请选择要启用的模型，系统将根据模型类型自动匹配使用场景
        </div>
        <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
          {[
            { id: 'model-1', name: 'GLM-4-Vision', type: 'chat' },
            { id: 'model-2', name: 'GLM-4', type: 'chat' },
            { id: 'model-3', name: 'GLM-3-Turbo', type: 'chat' },
            { id: 'model-4', name: 'embedding-2', type: 'embedding' },
          ].map(model => (
            <div key={model.id} className="flex items-center justify-between py-3 px-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex items-center">
                <Form.Item 
                  name={`model-${model.id}`} 
                  valuePropName="checked" 
                  style={{ marginBottom: 0 }}
                >
                  <input 
                    type="checkbox" 
                    className="mr-3" 
                  />
                </Form.Item>
                <span className="font-medium mr-3">{model.name}</span>
                <Tag color={model.type === 'chat' ? 'blue' : 'cyan'}>
                  {model.type === 'chat' ? '对话模型' : '嵌入模型'}
                </Tag>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="sticky top-0 z-10">
        <PageHeader 
          title="模型设置"
          parentTitle="系统设置"
          description="管理和配置本地及第三方 AI 模型"
        />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-6xl mx-auto">
          <Card className="mb-6 shadow-md rounded-lg overflow-hidden border-0">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              className="custom-tabs"
              tabBarStyle={{ marginBottom: 24 }}
            >
              <TabPane 
                tab={<Space><CloudServerOutlined /> 本地模型</Space>} 
                key="local"
              />
              <TabPane 
                tab={<Space><ApiOutlined /> 第三方模型</Space>} 
                key="third-party"
              />
            </Tabs>

            {activeTab === 'local' && renderLocalModels()}
            {activeTab === 'third-party' && renderThirdPartyModels()}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModelSettings; 