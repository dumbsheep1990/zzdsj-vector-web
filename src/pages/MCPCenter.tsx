import React from 'react';
import { Card, Row, Col, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageHeader from '../components/layout/PageHeader';

const { Search } = Input;

// 模拟 MCP 服务数据
const mcpServices = [
  {
    id: 'amap',
    icon: '🗺️',
    name: 'Amap Maps',
    description: '高德地图MCP Server将已覆盖12大核心接口，提供全场景覆盖的地理信息服务，包括地图展示、路线规划、地点搜索等功能。',
    type: '地图服务'
  },
  {
    id: 'everart',
    icon: '🎨',
    name: 'EverArt',
    description: '基于 EverArt API 的 AI 图像生成工具，可以使用 SD、Flux 等各种模型生成图像。',
    type: '内容生成'
  },
  {
    id: 'notion',
    icon: '📝',
    name: 'Notion',
    description: '开源社区开发者基于 Notion API 封装，使用 AI 能够与 Notion 工作区进行交互。',
    type: '内容生成'
  },
  {
    id: 'github',
    icon: '💻',
    name: 'GitHub',
    description: 'GitHub 官方提供的服务，为开发人员和工具提供连接 GitHub 的完整自动化和权限功能。',
    type: '源码管理'
  },
  {
    id: 'firecrawl',
    icon: '🔥',
    name: 'Firecrawl',
    description: 'FireCrawl 官方提供的服务，实现大规模、复杂的网页数据的爬取和数据解析。',
    type: '网页搜索'
  },
  {
    id: 'perplexity',
    icon: '🔍',
    name: 'Perplexity Ask',
    description: 'Perplexity 官方提供的服务，通过自然语言查询实现搜索和知识问答的功能。',
    type: '网页搜索'
  },
  {
    id: 'quickchart',
    icon: '📊',
    name: 'QuickChart',
    description: '开源社区开发者封装，使用 QuickChart.io 生成各类特定的图表。',
    type: '内容生成'
  },
  {
    id: 'flomo',
    icon: '📓',
    name: 'Flomo',
    description: 'Flomo 浮墨笔记官方提供的服务，用户可通过 AI 驱动文本与 Flomo 中的笔记记录、整理和分析进行交互。',
    type: '内容生成'
  }
];

const MCPCenter: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="MCP 集成"
        parentTitle="工具广场"
        description="探索阿里云百炼全周期 MCP 服务"
      />
      <div className="p-6">
        <div className="mb-6">
          <Search
            placeholder="搜索你感兴趣的MCP服务"
            allowClear
            enterButton={<PlusOutlined />}
            size="large"
            style={{ maxWidth: 600 }}
          />
        </div>
        <Row gutter={[16, 16]}>
          {mcpServices.map(service => (
            <Col key={service.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                className="h-full"
                bodyStyle={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <div className="flex items-start mb-3">
                  <span className="text-2xl mr-3" role="img" aria-label={service.name}>
                    {service.icon}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium text-base mb-1">{service.name}</div>
                    <div className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full inline-block">
                      {service.type}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {service.description}
                  </p>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default MCPCenter; 