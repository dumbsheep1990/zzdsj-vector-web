import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Typography, 
  Tag, 
  Avatar, 
  Switch, 
  message,
  Dropdown,
  Menu,
  Tabs,
  Progress,
  Space,
  Divider,
  Upload,
  Select,
  Input,
  Row,
  Col,
  Spin
} from 'antd';
import {
  PlusOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  DeleteOutlined,
  MoreOutlined,
  CloudServerOutlined,
  SyncOutlined,
  KeyOutlined,
  DisconnectOutlined,
  DownloadOutlined,
  UploadOutlined,
  PlayCircleOutlined,
  StopOutlined,
  MonitorOutlined,
  ThunderboltOutlined,
  DatabaseOutlined,
  RocketOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import PageHeader from '../components/layout/PageHeader';
import CreateProviderModal from '../components/modals/CreateProviderModal';

const { Title, Text, Paragraph } = Typography;

// 自定义样式来强制覆盖背景色
const customStyles = `
  .model-settings-override .ant-card {
    background: rgba(255, 255, 255, 0.8) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
  }
  .model-settings-override .ant-card-body {
    background: rgba(255, 255, 255, 0.8) !important;
    backdrop-filter: blur(12px) !important;
  }
  .model-settings-override div[style*="background"] {
    background: rgba(255, 255, 255, 0.8) !important;
    backdrop-filter: blur(12px) !important;
  }
  .model-settings-override .ant-tabs-content-holder {
    background: rgba(255, 255, 255, 0.8) !important;
  }
  .model-settings-override .ant-tabs-tab-btn {
    background: rgba(255, 255, 255, 0.8) !important;
  }
  .model-settings-override div[class*="p-6"][class*="border"] {
    background: rgba(255, 255, 255, 0.8) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
  }
`;

// 在头部注入样式
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = customStyles;
  document.head.appendChild(styleElement);
}

interface ModelProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error';
  modelsCount: number;
  apiKeyConfigured: boolean;
  lastSync: string;
  category: 'chinese' | 'international';
  popularModels: string[];
  maxContextLength: number;
  pricing: 'free' | 'paid' | 'freemium';
}

interface LocalModel {
  id: string;
  name: string;
  size: string;
  type: 'llm' | 'embedding' | 'multimodal';
  status: 'running' | 'stopped' | 'loading' | 'error' | 'downloaded';
  progress?: number;
  memoryUsage: string;
  downloadUrl?: string;
  path?: string;
  quantization: 'Q4_0' | 'Q5_0' | 'Q8_0' | 'F16' | 'F32';
  architecture: string;
  contextLength: number;
  description: string;
}

const ModelSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('cloud');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLocalModel, setSelectedLocalModel] = useState<string | null>(null);

  // 渐变样式
  const gradientStyles = {
    cloudTab: "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50",
    localTab: "bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50",
    cardGradient: "bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/30",
    headerGradient: "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600",
    localHeaderGradient: "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600"
  };

  // 第三方厂商数据
  const providers: ModelProvider[] = [
    {
      id: 'zhipu',
      name: '智谱AI',
      logo: '/zhipu-logo.png',
      description: '提供GLM系列大语言模型，擅长中文理解和代码生成',
      status: 'connected',
      modelsCount: 8,
      apiKeyConfigured: true,
      lastSync: '2024-07-25 14:30',
      category: 'chinese',
      popularModels: ['GLM-4', 'GLM-4V', 'GLM-3-Turbo'],
      maxContextLength: 128000,
      pricing: 'paid'
    },
    {
      id: 'deepseek',
      name: 'DeepSeek',
      logo: '/deepseek-logo.png',
      description: '深度求索开发的大语言模型，专注于代码生成和推理',
      status: 'connected',
      modelsCount: 6,
      apiKeyConfigured: true,
      lastSync: '2024-07-25 16:15',
      category: 'chinese',
      popularModels: ['DeepSeek-Coder', 'DeepSeek-Chat'],
      maxContextLength: 64000,
      pricing: 'paid'
    },
    {
      id: 'baidu',
      name: '百度文心',
      logo: '/baidu-logo.png',
      description: '百度研发的知识增强大语言模型',
      status: 'disconnected',
      modelsCount: 6,
      apiKeyConfigured: false,
      lastSync: '未配置',
      category: 'chinese',
      popularModels: ['文心一言4.0', '文心一言3.5'],
      maxContextLength: 8000,
      pricing: 'freemium'
    },
    {
      id: 'alibaba',
      name: '阿里通义',
      logo: '/alibaba-logo.png',
      description: '阿里巴巴达摩院开发的通义千问系列模型',
      status: 'connected',
      modelsCount: 5,
      apiKeyConfigured: true,
      lastSync: '2024-07-25 12:45',
      category: 'chinese',
      popularModels: ['通义千问Max', '通义千问Plus'],
      maxContextLength: 6000,
      pricing: 'freemium'
    },
    {
      id: 'tencent',
      name: '腾讯混元',
      logo: '/tencent-logo.png',
      description: '腾讯开发的大语言模型，擅长中文创作和多轮对话',
      status: 'disconnected',
      modelsCount: 3,
      apiKeyConfigured: false,
      lastSync: '未配置',
      category: 'chinese',
      popularModels: ['混元-Pro', '混元-Standard'],
      maxContextLength: 32000,
      pricing: 'freemium'
    },
    {
      id: 'iflytek',
      name: '讯飞星火',
      logo: '/iflytek-logo.png',
      description: '科大讯飞开发的大语言模型，专注于认知智能和语音交互',
      status: 'connected',
      modelsCount: 4,
      apiKeyConfigured: true,
      lastSync: '2024-07-25 11:20',
      category: 'chinese',
      popularModels: ['星火认知v3.5', '星火代码'],
      maxContextLength: 8000,
      pricing: 'freemium'
    }
  ];

  // 本地模型数据 - 接口对接模式（Ollama/vLLM）
  const localModels: LocalModel[] = [
    {
      id: 'llama2-7b',
      name: 'Llama 2 7B Chat',
      size: '7B',
      type: 'llm',
      status: 'running',
      memoryUsage: '4.2 GB',
      path: 'ollama://llama2:7b-chat',
      quantization: 'Q4_0',
      architecture: 'Llama',
      contextLength: 4096,
      description: 'Meta开发的开源大语言模型，通过Ollama接口提供服务'
    },
    {
      id: 'mistral-7b',
      name: 'Mistral 7B Instruct',
      size: '7B',
      type: 'llm',
      status: 'stopped',
      memoryUsage: '0 GB',
      path: 'ollama://mistral:7b-instruct',
      quantization: 'Q4_0',
      architecture: 'Mistral',
      contextLength: 8192,
      description: '高效的7B参数模型，通过Ollama接口部署'
    },
    {
      id: 'qwen-7b',
      name: '通义千问 7B Chat',
      size: '7B',
      type: 'llm',
      status: 'downloaded',
      memoryUsage: '0 GB',
      path: 'vllm://qwen:7b-chat',
      quantization: 'Q4_0',
      architecture: 'Qwen',
      contextLength: 8192,
      description: '阿里巴巴开源的中文大语言模型，通过vLLM接口部署'
    },
    {
      id: 'baichuan2-7b',
      name: 'Baichuan2 7B Chat',
      size: '7B',
      type: 'llm',
      status: 'loading',
      progress: 65,
      memoryUsage: '0 GB',
      downloadUrl: 'https://huggingface.co/baichuan-inc/Baichuan2-7B-Chat',
      quantization: 'Q4_0',
      architecture: 'Baichuan',
      contextLength: 4096,
      description: '百川智能开发的中文大语言模型，正在配置Ollama接口'
    },
    {
      id: 'embeddings',
      name: 'BGE Large ZH',
      size: '1.3B',
      type: 'embedding',
      status: 'running',
      memoryUsage: '1.4 GB',
      path: 'ollama://bge-large-zh',
      quantization: 'F16',
      architecture: 'BGE',
      contextLength: 512,
      description: '智源研究院开发的中文文本嵌入模型，支持语义检索'
    }
  ];

  // 工具函数
  const getStatusIcon = (status: ModelProvider['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircleOutlined className="text-green-500" />;
      case 'disconnected':
        return <DisconnectOutlined className="text-gray-400" />;
      case 'error':
        return <ExclamationCircleOutlined className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: ModelProvider['status']) => {
    switch (status) {
      case 'connected':
        return { text: '已连接', color: 'success' };
      case 'disconnected':
        return { text: '未配置', color: 'default' };
      case 'error':
        return { text: '连接错误', color: 'error' };
      default:
        return { text: '未知', color: 'default' };
    }
  };

  const getLocalModelStatusIcon = (status: LocalModel['status']) => {
    switch (status) {
      case 'running':
        return <PlayCircleOutlined className="text-green-500" />;
      case 'stopped':
        return <StopOutlined className="text-gray-400" />;
      case 'loading':
        return <DownloadOutlined className="text-blue-500 animate-pulse" />;
      case 'downloaded':
        return <DatabaseOutlined className="text-orange-500" />;
      case 'error':
        return <ExclamationCircleOutlined className="text-red-500" />;
      default:
        return null;
    }
  };

  const getLocalModelStatusText = (status: LocalModel['status']) => {
    switch (status) {
      case 'running':
        return { text: '运行中', color: 'success' };
      case 'stopped':
        return { text: '已停止', color: 'default' };
      case 'loading':
        return { text: '下载中', color: 'processing' };
      case 'downloaded':
        return { text: '已下载', color: 'warning' };
      case 'error':
        return { text: '错误', color: 'error' };
      default:
        return { text: '未知', color: 'default' };
    }
  };

  const getModelTypeIcon = (type: LocalModel['type']) => {
    switch (type) {
      case 'llm':
        return <RocketOutlined className="text-blue-500" />;
      case 'embedding':
        return <DatabaseOutlined className="text-purple-500" />;
      case 'multimodal':
        return <MonitorOutlined className="text-orange-500" />;
      default:
        return null;
    }
  };

  const handleMoreActions = (provider: ModelProvider, action: string) => {
    switch (action) {
      case 'config':
        message.info(`配置 ${provider.name} API密钥`);
        break;
      case 'sync':
        message.loading(`正在同步 ${provider.name} 模型列表...`, 2);
        break;
      case 'view':
        message.info(`查看 ${provider.name} 详情`);
        break;
      case 'delete':
        message.warning(`删除 ${provider.name}`);
        break;
    }
  };

  const handleLocalModelAction = (model: LocalModel, action: string) => {
    switch (action) {
      case 'start':
        message.loading(`正在启动 ${model.name}...`, 2);
        break;
      case 'stop':
        message.info(`已停止 ${model.name}`);
        break;
      case 'download':
        message.info(`开始下载 ${model.name}`);
        break;
      case 'delete':
        message.warning(`删除 ${model.name}`);
        break;
      case 'config':
        message.info(`配置 ${model.name} 参数`);
        break;
    }
  };

  // 统计数据
  const cloudStats = {
    totalProviders: providers.length,
    connectedProviders: providers.filter(p => p.status === 'connected').length,
    totalModels: providers.reduce((sum, p) => sum + p.modelsCount, 0),
    configuredProviders: providers.filter(p => p.apiKeyConfigured).length
  };

  const localStats = {
    totalModels: localModels.length,
    runningModels: localModels.filter(m => m.status === 'running').length,
    deployedModels: localModels.filter(m => m.status === 'downloaded' || m.status === 'running' || m.status === 'stopped').length,
    ollamaModels: localModels.filter(m => m.path?.includes('ollama')).length,
    vllmModels: localModels.filter(m => m.path?.includes('vllm')).length,
    memoryUsage: localModels
      .filter(m => m.status === 'running')
      .reduce((sum, m) => sum + parseFloat(m.memoryUsage), 0)
      .toFixed(1)
  };

  return (
    <div className="min-h-screen bg-white model-settings-override">
      <PageHeader 
        title="模型设置"
        parentTitle="系统设置"
        description="管理 AI 模型厂商配置和本地模型部署"
        primaryActions={[
          {
            icon: <PlusOutlined />,
            label: activeTab === 'cloud' ? '添加厂商' : '添加模型',
            onClick: () => {
              if (activeTab === 'cloud') {
                setShowCreateModal(true);
              } else {
                message.info('添加本地模型功能开发中...');
              }
            }
          }
        ]}
        secondaryActions={[
          {
            icon: <SyncOutlined />,
            label: '刷新状态',
            onClick: () => message.loading('正在刷新状态...', 2)
          }
        ]}
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* TAB切换 */}
        <Card 
          className="shadow-xl border-0 rounded-2xl overflow-hidden backdrop-blur-lg"
          style={{ 
            background: 'rgba(255, 255, 255, 0.8)', 
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            size="large"
            className="model-settings-tabs"
            items={[
              {
                key: 'cloud',
                label: (
                  <div className="flex items-center space-x-2 px-4 py-2">
                    <GlobalOutlined className="text-lg" />
                    <span className="font-medium">第三方模型</span>
                    <Tag color="blue" className="ml-2">{cloudStats.connectedProviders}/{cloudStats.totalProviders}</Tag>
                  </div>
                ),
                children: null
              },
              {
                key: 'local',
                label: (
                  <div className="flex items-center space-x-2 px-4 py-2">
                    <DatabaseOutlined className="text-lg" />
                    <span className="font-medium">本地模型</span>
                    <Tag color="green" className="ml-2">{localStats.runningModels}/{localStats.totalModels}</Tag>
                  </div>
                ),
                children: null
              }
            ]}
          />
        </Card>

        {/* 第三方模型内容 */}
        {activeTab === 'cloud' && (
          <>
            {/* 第三方模型统计卡片 - 精致化设计 */}
            <Row gutter={[20, 20]}>
              <Col span={6}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <Card 
                    className="relative text-center border-2 border-blue-200 hover:border-blue-300 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(12px)'
                    }}
                  >
                    <div className="flex items-center justify-center space-x-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                        <CloudServerOutlined className="text-white text-lg" />
                      </div>
                      <div className="text-3xl font-bold text-blue-600">
                        {cloudStats.totalProviders}
                      </div>
                    </div>
                    <div className="text-gray-700 font-medium">接入厂商</div>
                  </Card>
                </div>
              </Col>
              <Col span={6}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <Card 
                    className="relative text-center border-2 border-green-200 hover:border-green-300 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(12px)'
                    }}
                  >
                    <div className="flex items-center justify-center space-x-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                        <CheckCircleOutlined className="text-white text-lg" />
                      </div>
                      <div className="text-3xl font-bold text-green-600">
                        {cloudStats.connectedProviders}
                      </div>
                    </div>
                    <div className="text-gray-700 font-medium">已连接</div>
                  </Card>
                </div>
              </Col>
              <Col span={6}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <Card 
                    className="relative text-center border-2 border-purple-200 hover:border-purple-300 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(12px)'
                    }}
                  >
                    <div className="flex items-center justify-center space-x-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <RocketOutlined className="text-white text-lg" />
                      </div>
                      <div className="text-3xl font-bold text-purple-600">
                        {cloudStats.totalModels}
                      </div>
                    </div>
                    <div className="text-gray-700 font-medium">可用模型</div>
                  </Card>
                </div>
              </Col>
              <Col span={6}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <Card 
                    className="relative text-center border-2 border-orange-200 hover:border-orange-300 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(12px)'
                    }}
                  >
                    <div className="flex items-center justify-center space-x-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center">
                        <KeyOutlined className="text-white text-lg" />
                      </div>
                      <div className="text-3xl font-bold text-orange-600">
                        {cloudStats.configuredProviders}
                      </div>
                    </div>
                    <div className="text-gray-700 font-medium">已配置密钥</div>
                  </Card>
                </div>
              </Col>
            </Row>

            {/* 厂商Logo墙 - 优化版本 */}
            <Card 
              className="shadow-xl border-0 rounded-2xl overflow-hidden backdrop-blur-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <Title level={4} className="mb-2 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                    厂商概览
                  </Title>
                  <Text type="secondary">已接入的AI模型服务提供商快速状态</Text>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>{cloudStats.connectedProviders} 已连接</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    <span>{cloudStats.totalProviders - cloudStats.connectedProviders} 未配置</span>
                  </span>
                </div>
              </div>
              
              {/* 紧凑的Logo网格 */}
              <div className="grid grid-cols-6 md:grid-cols-8 gap-3">
                {providers.map((provider) => (
                  <div key={provider.id} className="relative">
                    <div className={`
                      w-full aspect-square rounded-xl border flex items-center justify-center p-2
                      transition-all duration-200 hover:scale-105
                      ${provider.status === 'connected' 
                        ? 'border-green-200 bg-gradient-to-br from-green-50 to-green-100 shadow-sm' 
                        : provider.status === 'error'
                        ? 'border-red-200 bg-gradient-to-br from-red-50 to-red-100'
                        : 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100'
                      }
                    `}>
                      <Avatar 
                        src={provider.logo} 
                        size={32}
                        className="border-0"
                      />
                    </div>
                    
                    {/* 状态指示器 */}
                    <div className="absolute -top-1 -right-1">
                      <div className={`w-3 h-3 rounded-full border-2 border-white ${
                        provider.status === 'connected' 
                          ? 'bg-green-500' 
                          : provider.status === 'error'
                          ? 'bg-red-500'
                          : 'bg-gray-400'
                      }`}></div>
                    </div>
                    
                    {/* 厂商名称 */}
                    <div className="text-center mt-1">
                      <Text className="text-xs text-gray-600 block truncate">
                        {provider.name}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* 厂商配置列表 */}
            <Card 
              className="shadow-xl border-0 rounded-2xl overflow-hidden backdrop-blur-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <Title level={4} className="mb-2 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                    厂商配置
                  </Title>
                  <Text type="secondary">管理API密钥和连接配置</Text>
                </div>
                <Button 
                  icon={<SyncOutlined />} 
                  onClick={() => message.loading('正在刷新所有厂商状态...', 2)}
                  className="border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 rounded-lg"
                >
                  刷新状态
                </Button>
              </div>

              <div className="space-y-4">
                {providers.map((provider) => {
                  const statusInfo = getStatusText(provider.status);
                  const moreMenu = (
                    <Menu>
                      <Menu.Item 
                        key="config" 
                        icon={<KeyOutlined />}
                        onClick={() => handleMoreActions(provider, 'config')}
                      >
                        配置API密钥
                      </Menu.Item>
                      <Menu.Item 
                        key="sync" 
                        icon={<SyncOutlined />}
                        onClick={() => handleMoreActions(provider, 'sync')}
                        disabled={!provider.apiKeyConfigured}
                      >
                        同步模型列表
                      </Menu.Item>
                      <Menu.Item 
                        key="view" 
                        icon={<EyeOutlined />}
                        onClick={() => handleMoreActions(provider, 'view')}
                      >
                        查看详情
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item 
                        key="delete" 
                        icon={<DeleteOutlined />}
                        onClick={() => handleMoreActions(provider, 'delete')}
                        className="text-red-500"
                      >
                        删除厂商
                      </Menu.Item>
                    </Menu>
                  );

                  return (
                    <div 
                      key={provider.id}
                      className="p-6 border border-gray-200/50 rounded-2xl backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:border-blue-300/60"
                      style={{ 
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-5 flex-1">
                          <Avatar 
                            src={provider.logo} 
                            size={64}
                            className="border-4 border-white shadow-lg mt-1"
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <Title level={4} className="mb-0 text-gray-800">
                                  {provider.name}
                                </Title>
                                <Tag color={statusInfo.color} className="rounded-full px-3 font-medium">
                                  {statusInfo.text}
                                </Tag>
                              </div>
                            </div>
                            
                            <Paragraph className="text-gray-600 mb-4 text-sm leading-relaxed">
                              {provider.description}
                            </Paragraph>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${provider.apiKeyConfigured ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                                <span className="text-gray-700 font-medium">
                                  {provider.apiKeyConfigured ? 'API已配置' : '待配置API'}
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-gray-700 font-medium">{provider.modelsCount} 个模型</span>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                <span className="text-gray-700 font-medium">{provider.lastSync}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-3 ml-4">
                          {!provider.apiKeyConfigured ? (
                            <Button 
                              type="primary"
                              size="large"
                              onClick={() => handleMoreActions(provider, 'config')}
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 rounded-xl px-8 font-medium"
                            >
                              配置API密钥
                            </Button>
                          ) : (
                            <div className="flex items-center space-x-3">
                              <Switch 
                                checked={provider.status === 'connected'}
                                onChange={(checked) => {
                                  message.info(`${checked ? '启用' : '禁用'} ${provider.name}`);
                                }}
                                size="default"
                              />
                              
                              <Button
                                onClick={() => handleMoreActions(provider, 'config')}
                                className="border-gray-300 hover:border-blue-500 hover:text-blue-600 rounded-lg"
                              >
                                编辑配置
                              </Button>
                            </div>
                          )}
                          
                          <Dropdown overlay={moreMenu} trigger={['click']} placement="bottomRight">
                            <Button 
                              type="text"
                              icon={<MoreOutlined />}
                              className="text-gray-400 hover:text-gray-600"
                            />
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </>
        )}

        {/* 本地模型内容 */}
        {activeTab === 'local' && (
          <>
            {/* 本地模型统计卡片 - 接口对接模式 */}
            <Row gutter={[20, 20]}>
              <Col span={6}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <Card 
                    className="relative text-center border-2 border-emerald-200 hover:border-emerald-300 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(12px)'
                    }}
                  >
                    <div className="flex items-center justify-center space-x-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                        <DatabaseOutlined className="text-white text-lg" />
                      </div>
                      <div className="text-3xl font-bold text-emerald-600">
                        {localStats.totalModels}
                      </div>
                    </div>
                    <div className="text-gray-700 font-medium">接口模型</div>
                  </Card>
                </div>
              </Col>
              <Col span={6}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <Card 
                    className="relative text-center border-2 border-green-200 hover:border-green-300 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(12px)'
                    }}
                  >
                    <div className="flex items-center justify-center space-x-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                        <PlayCircleOutlined className="text-white text-lg" />
                      </div>
                      <div className="text-3xl font-bold text-green-600">
                        {localStats.runningModels}
                      </div>
                    </div>
                    <div className="text-gray-700 font-medium">运行中</div>
                  </Card>
                </div>
              </Col>
              <Col span={6}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <Card 
                    className="relative text-center border-2 border-blue-200 hover:border-blue-300 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(12px)'
                    }}
                  >
                    <div className="flex items-center justify-center space-x-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                        <img src="https://ollama.ai/public/ollama.png" alt="Ollama" className="w-6 h-6" />
                      </div>
                      <div className="text-3xl font-bold text-blue-600">
                        {localStats.ollamaModels}
                      </div>
                    </div>
                    <div className="text-gray-700 font-medium">Ollama接口</div>
                  </Card>
                </div>
              </Col>
              <Col span={6}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <Card 
                    className="relative text-center border-2 border-purple-200 hover:border-purple-300 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(12px)'
                    }}
                  >
                    <div className="flex items-center justify-center space-x-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <ThunderboltOutlined className="text-white text-lg" />
                      </div>
                      <div className="text-3xl font-bold text-purple-600">
                        {localStats.vllmModels}
                      </div>
                    </div>
                    <div className="text-gray-700 font-medium">vLLM接口</div>
                  </Card>
                </div>
              </Col>
            </Row>

            {/* 模型类型概览 */}
            <Card 
              className="shadow-xl border-0 rounded-2xl overflow-hidden backdrop-blur-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <Title level={4} className="mb-2 bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                    模型类型分布
                  </Title>
                  <Text type="secondary">按用途分类的本地模型概览</Text>
                </div>
              </div>
              
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                    <RocketOutlined className="text-3xl text-blue-600 mb-2" />
                    <div className="text-xl font-bold text-blue-700">
                      {localModels.filter(m => m.type === 'llm').length}
                    </div>
                    <div className="text-sm text-blue-600 font-medium">大语言模型</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                    <DatabaseOutlined className="text-3xl text-purple-600 mb-2" />
                    <div className="text-xl font-bold text-purple-700">
                      {localModels.filter(m => m.type === 'embedding').length}
                    </div>
                    <div className="text-sm text-purple-600 font-medium">向量模型</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
                    <MonitorOutlined className="text-3xl text-orange-600 mb-2" />
                    <div className="text-xl font-bold text-orange-700">
                      {localModels.filter(m => m.type === 'multimodal').length}
                    </div>
                    <div className="text-sm text-orange-600 font-medium">多模态模型</div>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* 本地模型列表 */}
            <Card 
              className="shadow-xl border-0 rounded-2xl overflow-hidden backdrop-blur-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <Title level={4} className="mb-2 bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                    模型管理
                  </Title>
                  <Text type="secondary">本地部署的AI模型列表</Text>
                </div>
                <Space>
                  <Button 
                    icon={<UploadOutlined />} 
                    onClick={() => message.info('上传模型功能开发中...')}
                    className="border-gray-300 text-gray-600 hover:border-emerald-500 hover:text-emerald-600 rounded-lg"
                  >
                    上传模型
                  </Button>
                  <Button 
                    icon={<DownloadOutlined />} 
                    onClick={() => message.info('下载模型功能开发中...')}
                    className="border-gray-300 text-gray-600 hover:border-emerald-500 hover:text-emerald-600 rounded-lg"
                  >
                    下载模型
                  </Button>
                </Space>
              </div>

              <div className="space-y-4">
                {localModels.map((model) => {
                  const statusInfo = getLocalModelStatusText(model.status);
                  const typeIcon = getModelTypeIcon(model.type);
                  const statusIcon = getLocalModelStatusIcon(model.status);
                  
                  const moreMenu = (
                    <Menu>
                      {model.status === 'stopped' || model.status === 'downloaded' ? (
                        <Menu.Item 
                          key="start" 
                          icon={<PlayCircleOutlined />}
                          onClick={() => handleLocalModelAction(model, 'start')}
                        >
                          启动模型
                        </Menu.Item>
                      ) : model.status === 'running' ? (
                        <Menu.Item 
                          key="stop" 
                          icon={<StopOutlined />}
                          onClick={() => handleLocalModelAction(model, 'stop')}
                        >
                          停止模型
                        </Menu.Item>
                      ) : model.status === 'loading' ? (
                        <Menu.Item 
                          key="config" 
                          icon={<KeyOutlined />}
                          onClick={() => handleLocalModelAction(model, 'config')}
                        >
                          模型配置
                        </Menu.Item>
                      ) : null}
                      
                      <Menu.Item 
                        key="view" 
                        icon={<EyeOutlined />}
                        onClick={() => handleLocalModelAction(model, 'view')}
                      >
                        查看详情
                      </Menu.Item>
                      
                      <Menu.Divider />
                      <Menu.Item 
                        key="delete" 
                        icon={<DeleteOutlined />}
                        onClick={() => handleLocalModelAction(model, 'delete')}
                        className="text-red-500"
                      >
                        删除模型
                      </Menu.Item>
                    </Menu>
                  );

                  return (
                    <div 
                      key={model.id}
                      className="p-6 border border-emerald-200/50 rounded-2xl backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:border-emerald-300/60"
                      style={{ 
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-5 flex-1">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 border-2 border-emerald-200 flex items-center justify-center">
                              {typeIcon}
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <Title level={4} className="mb-0 text-gray-800">
                                  {model.name}
                                </Title>
                                <Tag color={statusInfo.color} className="rounded-full px-3 font-medium">
                                  {statusIcon}
                                  <span className="ml-1">{statusInfo.text}</span>
                                </Tag>
                                <Tag color="blue" className="rounded-full px-2 text-xs">
                                  {model.type.toUpperCase()}
                                </Tag>
                              </div>
                            </div>
                            
                            <Paragraph className="text-gray-600 mb-4 text-sm leading-relaxed">
                              {model.description}
                            </Paragraph>
                            
                            {/* 配置进度条 */}
                            {model.status === 'loading' && model.progress && (
                              <div className="mb-4">
                                <div className="flex justify-between items-center mb-1">
                                  <Text className="text-sm text-gray-600">接口配置进度</Text>
                                  <Text className="text-sm text-blue-600 font-medium">{model.progress}%</Text>
                                </div>
                                <Progress 
                                  percent={model.progress} 
                                  showInfo={false}
                                  strokeColor={{
                                    '0%': '#10B981',
                                    '100%': '#059669',
                                  }}
                                  className="mb-2"
                                />
                              </div>
                            )}
                            
                            {/* 模型信息网格 */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <ThunderboltOutlined className="text-orange-500" />
                                <span className="text-gray-700 font-medium">{model.size} 参数</span>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <MonitorOutlined className="text-blue-500" />
                                <span className="text-gray-700 font-medium">{model.memoryUsage} 内存</span>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <DatabaseOutlined className="text-purple-500" />
                                <span className="text-gray-700 font-medium">{model.path?.includes('ollama') ? 'Ollama' : 'vLLM'}</span>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <GlobalOutlined className="text-green-500" />
                                <span className="text-gray-700 font-medium">{model.contextLength.toLocaleString()} tokens</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-3 ml-4">
                          {model.status === 'stopped' || model.status === 'downloaded' ? (
                            <Button 
                              type="primary"
                              size="large"
                              icon={<PlayCircleOutlined />}
                              onClick={() => handleLocalModelAction(model, 'start')}
                              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 border-0 rounded-xl px-8 font-medium"
                            >
                              启动模型
                            </Button>
                          ) : model.status === 'running' ? (
                            <Button 
                              size="large"
                              icon={<StopOutlined />}
                              onClick={() => handleLocalModelAction(model, 'stop')}
                              className="border-red-300 text-red-600 hover:border-red-500 hover:text-red-700 rounded-xl px-8 font-medium"
                            >
                              停止模型
                            </Button>
                          ) : model.status === 'loading' ? (
                            <Button 
                              size="large"
                              loading
                              className="rounded-xl px-8 font-medium"
                            >
                              配置中...
                            </Button>
                          ) : null}
                          
                          <Dropdown overlay={moreMenu} trigger={['click']} placement="bottomRight">
                            <Button 
                              type="text"
                              icon={<MoreOutlined />}
                              className="text-gray-400 hover:text-gray-600"
                            />
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </>
        )}

        {/* 使用说明 */}
        <Card 
          className="shadow-xl border-0 rounded-2xl backdrop-blur-lg"
          style={{ 
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <div className="flex items-start space-x-4">
            <div className="text-2xl">💡</div>
            <div>
              <Title level={5} className={`mb-2 ${
                activeTab === 'cloud' ? 'text-blue-800' : 'text-emerald-800'
              }`}>
                {activeTab === 'cloud' ? '第三方模型配置说明' : '本地模型部署说明'}
              </Title>
              <div className={`text-sm space-y-1 ${
                activeTab === 'cloud' ? 'text-blue-700' : 'text-emerald-700'
              }`}>
                {activeTab === 'cloud' ? (
                  <>
                    <div>• 添加厂商后需要配置对应的API密钥才能使用模型服务</div>
                    <div>• 配置完成后系统会自动同步该厂商的可用模型列表</div>
                    <div>• 在基础设置中可以选择启用的具体模型进行使用</div>
                    <div>• 建议优先配置国内厂商，网络延迟更低，响应更快</div>
                  </>
                ) : (
                  <>
                    <div>• 本地模型通过Ollama或vLLM接口提供服务，需要先部署对应的服务</div>
                    <div>• 启动模型会占用系统内存，建议根据机器配置选择合适的模型大小</div>
                    <div>• 支持多种接口方式：Ollama适合快速部署，vLLM适合高性能推理</div>
                    <div>• 可以同时运行多个不同类型的模型，如LLM + 向量模型组合使用</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 创建厂商模态框 */}
      <CreateProviderModal 
        visible={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          message.success('厂商添加成功');
        }}
      />
    </div>
  );
};

export default ModelSettings; 