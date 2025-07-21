import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Tag, Typography, Space, Input, Select, message, Spin, Modal } from 'antd';
import { 
  SearchOutlined, 
  GlobalOutlined, 
  BugOutlined, 
  PlayCircleOutlined,
  SettingOutlined,
  StarOutlined,
  StarFilled,
  InfoCircleOutlined,
  ApiOutlined
} from '@ant-design/icons';
import PageHeader from '../components/layout/PageHeader';
import { useAPI } from '../hooks/common';
import { newToolsAPI } from '../utils/api/tools';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

// 工具卡片接口
interface ToolCard {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'search' | 'scraper' | 'ai' | 'data';
  status: 'active' | 'inactive' | 'maintenance';
  version: string;
  tags: string[];
  favorite: boolean;
  usage: {
    count: number;
    lastUsed?: string;
  };
  features: string[];
  configurable: boolean;
}

// 工具数据
const toolsData: ToolCard[] = [
  {
    id: 'websailor',
    name: 'WebSailor',
    description: '阿里巴巴WebSailor智能搜索工具，支持批量搜索和智能网页内容提取',
    icon: <GlobalOutlined className="text-2xl text-blue-500" />,
    category: 'search',
    status: 'active',
    version: '1.0.0',
    tags: ['搜索', '智能', '批量', 'AI'],
    favorite: false,
    usage: {
      count: 125,
      lastUsed: '2024-01-15 14:30'
    },
    features: [
      '智能批量搜索',
      '网页内容提取',
      '目标导向分析',
      'Serper API集成',
      'Jina Reader支持'
    ],
    configurable: true
  },
  {
    id: 'scraperr',
    name: 'Scraperr',
    description: '自托管网页爬取解决方案，支持XPath元素提取和域名爬取',
    icon: <BugOutlined className="text-2xl text-green-500" />,
    category: 'scraper',
    status: 'active',
    version: '1.0.0',
    tags: ['爬虫', 'XPath', '自托管', '数据提取'],
    favorite: true,
    usage: {
      count: 89,
      lastUsed: '2024-01-15 10:15'
    },
    features: [
      'XPath元素提取',
      '域名爬取',
      '媒体文件下载',
      '任务队列管理',
      '结果导出'
    ],
    configurable: true
  }
];

// 状态颜色映射
const statusColors = {
  active: 'green',
  inactive: 'red',
  maintenance: 'orange'
};

// 状态文本映射
const statusTexts = {
  active: '运行中',
  inactive: '已停用',
  maintenance: '维护中'
};

// 类别颜色映射
const categoryColors = {
  search: 'blue',
  scraper: 'green',
  ai: 'purple',
  data: 'orange'
};

// 类别文本映射
const categoryTexts = {
  search: '搜索工具',
  scraper: '爬虫工具',
  ai: 'AI工具',
  data: '数据工具'
};

interface ToolConfigModalProps {
  tool: ToolCard | null;
  visible: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
}

// 工具配置弹窗
const ToolConfigModal: React.FC<ToolConfigModalProps> = ({ tool, visible, onClose, onSave }) => {
  const [config, setConfig] = useState<any>({});

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  if (!tool) return null;

  return (
    <Modal
      title={
        <div className="flex items-center">
          {tool.icon}
          <span className="ml-2">{tool.name} 配置</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      onOk={handleSave}
      width={600}
    >
      <div className="space-y-4">
        {tool.id === 'websailor' && (
          <>
            <div>
              <Text strong>API 密钥配置</Text>
              <Input.Group className="mt-2">
                <Input
                  placeholder="Google Search API Key (Serper)"
                  value={config.googleSearchKey || ''}
                  onChange={(e) => setConfig({...config, googleSearchKey: e.target.value})}
                />
              </Input.Group>
              <Input.Group className="mt-2">
                <Input
                  placeholder="Jina API Keys (逗号分隔)"
                  value={config.jinaApiKeys || ''}
                  onChange={(e) => setConfig({...config, jinaApiKeys: e.target.value})}
                />
              </Input.Group>
            </div>
            <div>
              <Text strong>搜索设置</Text>
              <div className="mt-2">
                <Text>默认搜索结果数量:</Text>
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={config.defaultResults || 10}
                  onChange={(e) => setConfig({...config, defaultResults: parseInt(e.target.value)})}
                  className="ml-2 w-20"
                />
              </div>
            </div>
          </>
        )}
        
        {tool.id === 'scraperr' && (
          <>
            <div>
              <Text strong>爬取配置</Text>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.spiderDomain || false}
                    onChange={(e) => setConfig({...config, spiderDomain: e.target.checked})}
                    className="mr-2"
                  />
                  <Text>启用域名爬取</Text>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.downloadMedia || false}
                    onChange={(e) => setConfig({...config, downloadMedia: e.target.checked})}
                    className="mr-2"
                  />
                  <Text>下载媒体文件</Text>
                </div>
              </div>
            </div>
            <div>
              <Text strong>并发设置</Text>
              <div className="mt-2">
                <Text>最大并发数:</Text>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={config.maxConcurrent || 3}
                  onChange={(e) => setConfig({...config, maxConcurrent: parseInt(e.target.value)})}
                  className="ml-2 w-20"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

const ToolPlaza: React.FC = () => {
  const [tools, setTools] = useState<ToolCard[]>(toolsData);
  const [filteredTools, setFilteredTools] = useState<ToolCard[]>(toolsData);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [currentTool, setCurrentTool] = useState<ToolCard | null>(null);

  // 不使用通用的request，直接使用newToolsAPI

  // 过滤工具
  useEffect(() => {
    let filtered = tools;

    // 按搜索文本过滤
    if (searchText) {
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchText.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchText.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    // 按类别过滤
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }

    setFilteredTools(filtered);
  }, [searchText, selectedCategory, tools]);

  // 切换收藏状态
  const toggleFavorite = (toolId: string) => {
    setTools(prev =>
      prev.map(tool =>
        tool.id === toolId ? { ...tool, favorite: !tool.favorite } : tool
      )
    );
  };

  // 启动工具
  const launchTool = async (tool: ToolCard) => {
    setLoading(true);
    try {
      // 检查工具健康状态
      const response = await newToolsAPI.healthCheck();

      const toolStatus = response.tools[tool.id];
      if (toolStatus?.status === 'active') {
        message.success(`${tool.name} 启动成功！`);
        
        // 更新使用统计
        setTools(prev =>
          prev.map(t =>
            t.id === tool.id
              ? {
                  ...t,
                  usage: {
                    count: t.usage.count + 1,
                    lastUsed: new Date().toLocaleString()
                  }
                }
              : t
          )
        );
        
        // 工具启动成功，显示配置对话框或直接使用
        message.success(`${tool.name} 已启动，可以开始使用！`);
      } else {
        message.error(`${tool.name} 启动失败：${toolStatus?.error_message || '工具不可用'}`);
      }
    } catch (error) {
      message.error(`启动 ${tool.name} 时发生错误`);
    } finally {
      setLoading(false);
    }
  };

  // 配置工具
  const configureTool = (tool: ToolCard) => {
    setCurrentTool(tool);
    setConfigModalVisible(true);
  };

  // 保存配置
  const saveConfig = async (config: any) => {
    if (currentTool) {
      try {
        // 这里可以扩展为调用实际的配置API
        // await toolConfigAPI.updateConfig(currentTool.id, config);
        message.success(`${currentTool.name} 配置已保存`);
        console.log('工具配置:', config);
      } catch (error) {
        message.error('配置保存失败');
      }
    }
  };

  // 工具卡片组件
  const renderToolCard = (tool: ToolCard) => (
    <Card
      key={tool.id}
      className="h-full hover:shadow-lg transition-shadow duration-300"
      bodyStyle={{ padding: '20px' }}
      actions={[
        <Button
          key="launch"
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={() => launchTool(tool)}
          loading={loading}
          style={{
            background: 'linear-gradient(135deg, #1890ff, #096dd9)',
            border: 'none'
          }}
        >
          启动
        </Button>,
        <Button
          key="config"
          icon={<SettingOutlined />}
          onClick={() => configureTool(tool)}
          disabled={!tool.configurable}
        >
          配置
        </Button>,
        <Button
          key="favorite"
          icon={tool.favorite ? <StarFilled /> : <StarOutlined />}
          onClick={() => toggleFavorite(tool.id)}
          style={{
            color: tool.favorite ? '#faad14' : undefined
          }}
        >
          {tool.favorite ? '已收藏' : '收藏'}
        </Button>
      ]}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          {tool.icon}
          <div className="ml-3">
            <Title level={4} className="mb-1">{tool.name}</Title>
            <div className="flex items-center space-x-2">
              <Tag color={statusColors[tool.status]}>
                {statusTexts[tool.status]}
              </Tag>
              <Tag color={categoryColors[tool.category]}>
                {categoryTexts[tool.category]}
              </Tag>
              <Text type="secondary" className="text-xs">v{tool.version}</Text>
            </div>
          </div>
        </div>
        {tool.favorite && (
          <StarFilled className="text-yellow-500 text-lg" />
        )}
      </div>

      <Paragraph
        className="text-gray-600 mb-3"
        ellipsis={{ rows: 2, tooltip: tool.description }}
      >
        {tool.description}
      </Paragraph>

      <div className="mb-3">
        <Text strong className="text-xs">核心功能：</Text>
        <div className="mt-1">
          {tool.features.slice(0, 3).map((feature, index) => (
            <Tag key={index} className="mb-1 text-xs">
              {feature}
            </Tag>
          ))}
          {tool.features.length > 3 && (
            <Tag className="text-xs">+{tool.features.length - 3}更多</Tag>
          )}
        </div>
      </div>

      <div className="mb-3">
        <Text strong className="text-xs">标签：</Text>
        <div className="mt-1">
          {tool.tags.map((tag, index) => (
            <Tag key={index} color="blue" className="mb-1 text-xs">
              {tag}
            </Tag>
          ))}
        </div>
      </div>

      <div className="text-xs text-gray-500">
        <div className="flex justify-between">
          <span>使用次数: {tool.usage.count}</span>
          {tool.usage.lastUsed && (
            <span>最后使用: {tool.usage.lastUsed}</span>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="工具广场"
        description="发现和使用强大的AI工具"
        extra={
          <Button
            type="primary"
            icon={<ApiOutlined />}
            onClick={() => window.open('/tool-factory', '_blank')}
            style={{
              background: 'linear-gradient(135deg, #1890ff, #096dd9)',
              border: 'none'
            }}
          >
            创建工具
          </Button>
        }
      />

      <div className="flex-1 min-h-0 overflow-auto p-6">
        {/* 搜索和过滤 */}
        <div className="mb-6">
          <Row gutter={16} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="搜索工具..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined />}
                className="w-full"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                value={selectedCategory}
                onChange={setSelectedCategory}
                className="w-full"
                placeholder="选择类别"
              >
                <Option value="all">全部类别</Option>
                <Option value="search">搜索工具</Option>
                <Option value="scraper">爬虫工具</Option>
                <Option value="ai">AI工具</Option>
                <Option value="data">数据工具</Option>
              </Select>
            </Col>
            <Col xs={24} sm={24} md={10}>
              <Space>
                <Text type="secondary">
                  共找到 {filteredTools.length} 个工具
                </Text>
                <Button
                  icon={<InfoCircleOutlined />}
                  type="text"
                  onClick={() => {
                    Modal.info({
                      title: '工具广场说明',
                      content: (
                        <div>
                          <p>欢迎使用工具广场！这里集成了各种强大的AI工具：</p>
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            <li><strong>WebSailor</strong>: 阿里巴巴的智能搜索工具</li>
                            <li><strong>Scraperr</strong>: 自托管网页爬取解决方案</li>
                          </ul>
                          <p className="mt-2">点击"启动"按钮开始使用工具，点击"配置"按钮设置工具参数。</p>
                        </div>
                      ),
                      width: 500
                    });
                  }}
                >
                  使用说明
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        {/* 工具卡片网格 */}
        <Spin spinning={loading}>
          <Row gutter={[24, 24]}>
            {filteredTools.map(tool => (
              <Col key={tool.id} xs={24} sm={12} lg={8} xl={6}>
                {renderToolCard(tool)}
              </Col>
            ))}
          </Row>
        </Spin>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">
              <SearchOutlined />
            </div>
            <Title level={4} type="secondary">
              未找到匹配的工具
            </Title>
            <Text type="secondary">
              尝试调整搜索条件或浏览其他类别
            </Text>
          </div>
        )}
      </div>

      {/* 工具配置弹窗 */}
      <ToolConfigModal
        tool={currentTool}
        visible={configModalVisible}
        onClose={() => setConfigModalVisible(false)}
        onSave={saveConfig}
      />
    </div>
  );
};

export default ToolPlaza;