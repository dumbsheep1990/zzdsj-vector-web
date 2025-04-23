import React, { useState } from 'react';
import { Card, Row, Col, Input, Button, Tag, Typography } from 'antd';
import { PlusOutlined, SearchOutlined, PlayCircleOutlined } from '@ant-design/icons';
import PageHeader from '../components/layout/PageHeader';

const { Search } = Input;

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
    tags: ['地图', '导航', '位置服务']
  },
  {
    id: 'everart',
    icon: '🎨',
    name: 'EverArt',
    description: '基于 EverArt API 的 AI 图像生成工具，可以使用 SD、Flux 等各种模型生成图像。',
    type: '内容生成',
    usageCount: 768,
    version: '2.1.0',
    tags: ['AI', '图像生成', '艺术']
  },
  {
    id: 'notion',
    icon: '📝',
    name: 'Notion',
    description: '开源社区开发者基于 Notion API 封装，使用 AI 能够与 Notion 工作区进行交互。',
    type: '内容生成',
    usageCount: 512,
    version: '1.5.0',
    tags: ['笔记', '协作', '知识管理']
  },
  {
    id: 'github',
    icon: '💻',
    name: 'GitHub',
    description: 'GitHub 官方提供的服务，为开发人员和工具提供连接 GitHub 的完整自动化和权限功能。',
    type: '源码管理',
    usageCount: 2048,
    version: '3.0.0',
    tags: ['代码', '版本控制', '协作']
  },
  {
    id: 'firecrawl',
    icon: '🔥',
    name: 'Firecrawl',
    description: 'FireCrawl 官方提供的服务，实现大规模、复杂的网页数据的爬取和数据解析。',
    type: '网页搜索',
    usageCount: 256,
    version: '1.2.0',
    tags: ['爬虫', '数据采集', '解析']
  },
  {
    id: 'perplexity',
    icon: '🔍',
    name: 'Perplexity Ask',
    description: 'Perplexity 官方提供的服务，通过自然语言查询实现搜索和知识问答的功能。',
    type: '网页搜索',
    usageCount: 384,
    version: '1.8.0',
    tags: ['搜索', '问答', '知识库']
  },
  {
    id: 'quickchart',
    icon: '📊',
    name: 'QuickChart',
    description: '开源社区开发者封装，使用 QuickChart.io 生成各类特定的图表。',
    type: '内容生成',
    usageCount: 640,
    version: '1.3.0',
    tags: ['图表', '可视化', '数据分析']
  },
  {
    id: 'flomo',
    icon: '📓',
    name: 'Flomo',
    description: 'Flomo 浮墨笔记官方提供的服务，用户可通过 AI 驱动文本与 Flomo 中的笔记记录、整理和分析进行交互。',
    type: '内容生成',
    usageCount: 896,
    version: '2.0.0',
    tags: ['笔记', '知识管理', 'AI']
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

  const getCurrentServices = () => {
    return mcpServices.filter(service => {
      return service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    });
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
          <Search
            placeholder="搜索你感兴趣的MCP服务"
            allowClear
            enterButton={
              <Button 
                type="primary" 
                style={{
                  background: 'linear-gradient(135deg, #1890ff, #40a9ff)',
                  border: 'none',
                  boxShadow: '0 2px 6px rgba(24, 144, 255, 0.2)'
                }}
              >
                <SearchOutlined />
              </Button>
            }
            size="large"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="max-w-md"
            style={{ width: '400px' }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{
              background: 'linear-gradient(135deg, #52c41a, #73d13d)',
              border: 'none',
              height: '40px',
              boxShadow: '0 2px 6px rgba(82, 196, 26, 0.2)'
            }}
          >
            添加服务
          </Button>
        </div>

        <Row gutter={[16, 16]}>
          {getCurrentServices().map(service => {
            const typeStyle = getTypeStyle(service.type);
            return (
              <Col key={service.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  style={{
                    width: "100%",
                    borderRadius: "12px",
                    overflow: "hidden",
                    height: '280px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(220, 230, 240, 0.8)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    background: typeStyle.gradient,
                    position: 'relative'
                  }}
                  bodyStyle={{
                    padding: '16px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
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
                        fontSize: '24px'
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
                          marginTop: '4px'
                        }}
                      >
                        {service.type}
                      </Tag>
                    </div>
                    <Button
                      type="primary"
                      icon={<PlayCircleOutlined />}
                      style={{
                        background: typeStyle.buttonBg,
                        borderColor: typeStyle.buttonBg,
                        borderRadius: '6px',
                        padding: '4px 8px',
                        height: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = typeStyle.buttonHoverBg;
                        e.currentTarget.style.borderColor = typeStyle.buttonHoverBg;
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = typeStyle.buttonBg;
                        e.currentTarget.style.borderColor = typeStyle.buttonBg;
                      }}
                    >
                      使用
                    </Button>
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
                          marginBottom: '4px'
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
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};

export default MCPCenter; 