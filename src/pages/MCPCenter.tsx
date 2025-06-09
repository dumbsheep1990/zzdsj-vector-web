import React, { useState } from 'react';
import { Card, Row, Col, Button, Tag, Typography, Switch } from 'antd';
import { PlusOutlined, InfoCircleOutlined, ToolOutlined, SettingOutlined } from '@ant-design/icons';
import PageHeader from '../components/layout/PageHeader';
import AddMCPModal from '../components/mcp/AddMCPModal';
import MCPServiceDrawer from '../components/mcp/MCPServiceDrawer';
import CustomSearchBox from '../components/common/CustomSearchBox';

// 模拟 MCP 服务数据
const mcpServices = [
  {
    id: 'amap',
    icon: '🗺️',
    name: 'Amap Maps',
    description: '高德地图MCP Server将已覆盖12大核心接口，提供全场景覆盖的地理信息服务，包括地图展示、路线规划、地点搜索等功能。',
    type: '地图服务',
    usageCount: 1024,
    version: '1.0.0',
    tags: ['地图', '导航', '位置服务'],
    toolsCount: 12
  },
  {
    id: 'everart',
    icon: '🎨',
    name: 'EverArt',
    description: '基于 EverArt API 的 AI 图像生成工具，可以使用 SD、Flux 等各种模型生成图像。',
    type: '内容生成',
    usageCount: 768,
    version: '2.1.0',
    tags: ['AI', '图像生成', '艺术'],
    toolsCount: 8
  },
  {
    id: 'notion',
    icon: '📝',
    name: 'Notion',
    description: '开源社区开发者基于 Notion API 封装，使用 AI 能够与 Notion 工作区进行交互。',
    type: '内容生成',
    usageCount: 512,
    version: '1.5.0',
    tags: ['笔记', '协作', '知识管理'],
    toolsCount: 6
  },
  {
    id: 'github',
    icon: '💻',
    name: 'GitHub',
    description: 'GitHub 官方提供的服务，为开发人员和工具提供连接 GitHub 的完整自动化和权限功能。',
    type: '源码管理',
    usageCount: 2048,
    version: '3.0.0',
    tags: ['代码', '版本控制', '协作'],
    toolsCount: 15
  },
  {
    id: 'firecrawl',
    icon: '🔥',
    name: 'Firecrawl',
    description: 'FireCrawl 官方提供的服务，实现大规模、复杂的网页数据的爬取和数据解析。',
    type: '网页搜索',
    usageCount: 256,
    version: '1.2.0',
    tags: ['爬虫', '数据采集', '解析'],
    toolsCount: 5
  },
  {
    id: 'perplexity',
    icon: '🔍',
    name: 'Perplexity Ask',
    description: 'Perplexity 官方提供的服务，通过自然语言查询实现搜索和知识问答的功能。',
    type: '网页搜索',
    usageCount: 384,
    version: '1.8.0',
    tags: ['搜索', '问答', '知识库'],
    toolsCount: 7
  },
  {
    id: 'quickchart',
    icon: '📊',
    name: 'QuickChart',
    description: '开源社区开发者封装，使用 QuickChart.io 生成各类特定的图表。',
    type: '内容生成',
    usageCount: 640,
    version: '1.3.0',
    tags: ['图表', '可视化', '数据分析'],
    toolsCount: 9
  },
  {
    id: 'flomo',
    icon: '📓',
    name: 'Flomo',
    description: 'Flomo 浮墨笔记官方提供的服务，用户可通过 AI 驱动文本与 Flomo 中的笔记记录、整理和分析进行交互。',
    type: '内容生成',
    usageCount: 896,
    version: '2.0.0',
    tags: ['笔记', '知识管理', 'AI'],
    toolsCount: 4
  }
];

const getTypeStyle = (type: string) => {
  switch (type) {
    case '地图服务':
      return {
        gradient: 'linear-gradient(135deg, #e6f7ff, #f0f9ff)',
        tagBg: 'rgba(24, 144, 255, 0.1)',
        tagBorder: 'rgba(24, 144, 255, 0.2)',
        tagText: '#1890ff',
        iconBg: 'rgba(24, 144, 255, 0.1)',
        iconColor: '#1890ff',
        buttonBg: '#1890ff',
        buttonHoverBg: '#40a9ff'
      };
    case '内容生成':
      return {
        gradient: 'linear-gradient(135deg, #f6ffed, #f0f9eb)',
        tagBg: 'rgba(82, 196, 26, 0.1)',
        tagBorder: 'rgba(82, 196, 26, 0.2)',
        tagText: '#52c41a',
        iconBg: 'rgba(82, 196, 26, 0.1)',
        iconColor: '#52c41a',
        buttonBg: '#52c41a',
        buttonHoverBg: '#73d13d'
      };
    case '源码管理':
      return {
        gradient: 'linear-gradient(135deg, #fff1f0, #fff2f0)',
        tagBg: 'rgba(245, 34, 45, 0.1)',
        tagBorder: 'rgba(245, 34, 45, 0.2)',
        tagText: '#f5222d',
        iconBg: 'rgba(245, 34, 45, 0.1)',
        iconColor: '#f5222d',
        buttonBg: '#f5222d',
        buttonHoverBg: '#ff4d4f'
      };
    case '网页搜索':
      return {
        gradient: 'linear-gradient(135deg, #fff7e6, #fff7e6)',
        tagBg: 'rgba(250, 173, 20, 0.1)',
        tagBorder: 'rgba(250, 173, 20, 0.2)',
        tagText: '#faad14',
        iconBg: 'rgba(250, 173, 20, 0.1)',
        iconColor: '#faad14',
        buttonBg: '#faad14',
        buttonHoverBg: '#ffc53d'
      };
    default:
      return {
        gradient: 'linear-gradient(135deg, #f9f0ff, #f9f0ff)',
        tagBg: 'rgba(114, 46, 209, 0.1)',
        tagBorder: 'rgba(114, 46, 209, 0.2)',
        tagText: '#722ed1',
        iconBg: 'rgba(114, 46, 209, 0.1)',
        iconColor: '#722ed1',
        buttonBg: '#722ed1',
        buttonHoverBg: '#9254de'
      };
  }
};

const MCPCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [flipped, setFlipped] = useState<{ [id: string]: boolean }>({});
  const [serviceTools, setServiceTools] = useState<{ [id: string]: { id: string; name: string; enabled: boolean }[] }>({
    amap: [
      { id: 'maps_regeocode', name: 'maps_regeocode', enabled: true },
      { id: 'maps_geo', name: 'maps_geo', enabled: true },
      { id: 'maps_ip_location', name: 'maps_ip_location', enabled: true },
      { id: 'maps_weather', name: 'maps_weather', enabled: true },
      { id: 'maps_search_detail', name: 'maps_search_detail', enabled: true },
      { id: 'maps_bicycling', name: 'maps_bicycling', enabled: true },
      { id: 'maps_direction_walking', name: 'maps_direction_walking', enabled: true },
      { id: 'maps_direction_driving', name: 'maps_direction_driving', enabled: true },
      { id: 'maps_direction_transit_integrated', name: 'maps_direction_transit_integrated', enabled: true },
      { id: 'maps_distance', name: 'maps_distance', enabled: true },
      { id: 'maps_text_search', name: 'maps_text_search', enabled: true },
      { id: 'maps_around_search', name: 'maps_around_search', enabled: true },
    ],
    everart: [
      { id: 'everart_gen', name: 'everart_gen', enabled: true },
      { id: 'everart_style', name: 'everart_style', enabled: true },
    ],
    notion: [
      { id: 'notion_content', name: 'notion_content', enabled: false },
    ],
    // 其他服务...
  });
  const [dirty, setDirty] = useState<{ [id: string]: boolean }>({});

  const handleFlip = (id: string) => {
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
    if (flipped[id]) setDirty(prev => ({ ...prev, [id]: false }));
  };

  const handleToolToggle = (serviceId: string, toolId: string, checked: boolean) => {
    setServiceTools(prev => ({
      ...prev,
      [serviceId]: prev[serviceId].map(tool =>
        tool.id === toolId ? { ...tool, enabled: checked } : tool
      ),
    }));
    setDirty(prev => ({ ...prev, [serviceId]: true }));
  };

  const handleConfirm = (serviceId: string) => {
    setDirty(prev => ({ ...prev, [serviceId]: false }));
    setFlipped(prev => ({ ...prev, [serviceId]: false }));
    setDrawerServices(genDrawerServices());
  };

  const [drawerServices, setDrawerServices] = useState(() => genDrawerServices());
  function genDrawerServices() {
    return [
      {
        id: 'amap',
        name: 'Amap Maps',
        status: true,
        subServices: serviceTools['amap']?.map(t => ({ id: t.id, status: t.enabled })) || [],
      },
      {
        id: 'everart',
        name: 'EverArt',
        status: true,
        subServices: serviceTools['everart']?.map(t => ({ id: t.id, status: t.enabled })) || [],
      },
      {
        id: 'notion',
        name: 'Notion',
        status: false,
        subServices: serviceTools['notion']?.map(t => ({ id: t.id, status: t.enabled })) || [],
      },
    ];
  }

  const getCurrentServices = () => {
    return mcpServices.filter(service => {
      return service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    });
  };

  const handleAddService = () => {
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleModalOk = () => {
    // TODO: 处理表单提交
    setIsModalOpen(false);
  };

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <PageHeader
        title="MCP 集成"
        parentTitle="工具广场"
        description=" 连接更多可能"
      />

      <div className="flex-1 min-h-0 overflow-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <CustomSearchBox
            placeholder="搜索你感兴趣的MCP服务"
            allowClear
            size="large"
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={setSearchTerm}
            style={{ width: '400px' }}
          />
          <div className="flex gap-2">
            <Button
              type="primary"
              icon={<SettingOutlined />}
              onClick={handleDrawerOpen}
              style={{
                background: '#1890ff',
                border: 'none',
                height: '40px'
              }}
            >
              服务管理
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddService}
              style={{
                background: '#1890ff',
                border: 'none',
                height: '40px'
              }}
            >
              添加服务
            </Button>
          </div>
        </div>

        <Row gutter={[16, 16]}>
          {getCurrentServices().map(service => {
            const typeStyle = getTypeStyle(service.type);
            return (
              <Col key={service.id} xs={24} sm={12} md={8} lg={6}>
                <div
                  style={{
                    perspective: '1000px',
                    width: '100%',
                    height: '280px',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'relative',
                      transition: 'transform 0.6s',
                      transformStyle: 'preserve-3d',
                      transform: flipped[service.id] ? 'rotateY(180deg)' : 'none',
                    }}
                  >
                    {/* 正面 */}
                    <div
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        zIndex: flipped[service.id] ? 1 : 2,
                      }}
                    >
                      <Card
                        style={{
                          width: '100%',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          height: '280px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
                          border: '1px solid rgba(220, 230, 240, 0.8)',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          background: typeStyle.gradient,
                          position: 'relative',
                        }}
                        bodyStyle={{
                          padding: '16px',
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: typeStyle.iconBg,
                              marginRight: '12px',
                              fontSize: '24px',
                            }}
                          >
                            {service.icon}
                          </div>
                          <div style={{ flex: 1 }}>
                            <Typography.Title level={5} style={{ margin: 0, color: '#1f1f1f' }}>
                              {service.name}
                            </Typography.Title>
                            <Tag
                              style={{
                                background: typeStyle.tagBg,
                                borderColor: typeStyle.tagBorder,
                                color: typeStyle.tagText,
                                borderRadius: '4px',
                                marginTop: '4px',
                              }}
                            >
                              {service.type}
                            </Tag>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              background: 'transparent',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: `1px solid ${typeStyle.buttonBg}`,
                            }}
                          >
                            <Button
                              type="text"
                              icon={<InfoCircleOutlined />}
                              style={{
                                color: '#1f1f1f',
                                padding: '0 8px',
                                height: 'auto',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '13px',
                                background: 'transparent',
                                border: 'none',
                              }}
                              onClick={() => handleFlip(service.id)}
                            >
                              详情
                            </Button>
                            <Button
                              type="primary"
                              icon={<ToolOutlined />}
                              style={{
                                color: '#fff',
                                padding: '0 8px',
                                height: 'auto',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '13px',
                                background: typeStyle.buttonBg,
                                border: 'none',
                                borderRadius: '4px',
                              }}
                            >
                              {service.toolsCount}
                            </Button>
                          </div>
                        </div>
                        <Typography.Paragraph
                          ellipsis={{ rows: 2 }}
                          style={{ color: '#595959', marginBottom: '12px', flex: 1 }}
                        >
                          {service.description}
                        </Typography.Paragraph>
                        <div style={{ marginBottom: '12px' }}>
                          {service.tags.map(tag => (
                            <Tag
                              key={tag}
                              style={{
                                background: typeStyle.tagBg,
                                borderColor: typeStyle.tagBorder,
                                color: typeStyle.tagText,
                                borderRadius: '4px',
                                marginBottom: '4px',
                              }}
                            >
                              {tag}
                            </Tag>
                          ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                            使用次数: {service.usageCount}
                          </Typography.Text>
                          {service.version && (
                            <Tag color="default" style={{ fontSize: '12px' }}>
                              v{service.version}
                            </Tag>
                          )}
                        </div>
                      </Card>
                    </div>
                    {/* 背面 */}
                    <div
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        zIndex: flipped[service.id] ? 2 : 1,
                        background: '#fff',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: 24,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <Typography.Title level={5} style={{ margin: 0 }}>
                          {service.name} 工具配置
                        </Typography.Title>
                        {dirty[service.id] ? (
                          <Button
                            type="primary"
                            size="small"
                            onClick={() => handleConfirm(service.id)}
                            style={{
                              background: '#1677ff',
                              color: '#fff',
                              borderColor: '#1677ff',
                              boxShadow: 'none',
                            }}
                          >
                            确认
                          </Button>
                        ) : (
                          <Button size="small" onClick={() => handleFlip(service.id)}>
                            返回
                          </Button>
                        )}
                      </div>
                      <div style={{ flex: 1, overflowY: 'auto' }}>
                        {(serviceTools[service.id] || []).map(tool => (
                          <div key={tool.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                            <Switch
                              checked={tool.enabled}
                              onChange={checked => handleToolToggle(service.id, tool.id, checked)}
                              style={{ marginRight: 12 }}
                            />
                            <span style={{ fontSize: 15 }}>{tool.name}</span>
                          </div>
                        ))}
                        {(serviceTools[service.id] || []).length === 0 && (
                          <Typography.Text type="secondary">暂无可配置子工具</Typography.Text>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>

      <AddMCPModal
        open={isModalOpen}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
      />

      <MCPServiceDrawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        services={drawerServices}
      />
    </div>
  );
};

export default MCPCenter; 