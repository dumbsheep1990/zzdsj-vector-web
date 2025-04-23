import React, { useState } from 'react';
import { Tabs, Input, Button, Space, Card, Row, Col, Tag, Typography } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined,
  ImportOutlined,
  RobotOutlined,
  ApiOutlined,
  CodeOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';
import PageHeader from '../components/layout/PageHeader';

const { TabPane } = Tabs;
const { Search } = Input;

interface AgentTool {
  id: string;
  name: string;
  description: string;
  category: 'automation' | 'api' | 'code' | 'custom';
  icon: React.ReactNode;
  tags: string[];
  usageCount?: number;
  version?: string;
}

const mockAgentTools: AgentTool[] = [
  {
    id: '1',
    name: '自动化工作流',
    description: '创建和管理自动化工作流程，支持复杂任务编排和智能调度',
    category: 'automation',
    icon: <RobotOutlined />,
    tags: ['自动化', '工作流', '任务编排'],
    usageCount: 128,
    version: '1.2.0'
  },
  {
    id: '2',
    name: 'API集成',
    description: '连接和管理外部API服务，支持智能路由和负载均衡',
    category: 'api',
    icon: <ApiOutlined />,
    tags: ['API', '集成', '智能路由'],
    usageCount: 256,
    version: '2.0.1'
  },
  {
    id: '3',
    name: '代码生成器',
    description: '自动生成代码模板和框架，支持多种编程语言和框架',
    category: 'code',
    icon: <CodeOutlined />,
    tags: ['代码', '生成', '智能模板'],
    usageCount: 512,
    version: '1.5.0'
  }
];

const getCategoryStyle = (category: string) => {
  switch (category) {
    case 'automation':
      return {
        gradient: 'linear-gradient(135deg, #f0f5ff, #f6f9ff)',
        tagBg: 'rgba(64, 158, 255, 0.1)',
        tagBorder: 'rgba(64, 158, 255, 0.2)',
        tagText: '#409eff',
        iconBg: 'rgba(64, 158, 255, 0.1)',
        iconColor: '#409eff',
        buttonBg: '#409eff',
        buttonHoverBg: '#66b1ff'
      };
    case 'api':
      return {
        gradient: 'linear-gradient(135deg, #f0f9eb, #f6ffed)',
        tagBg: 'rgba(103, 194, 58, 0.1)',
        tagBorder: 'rgba(103, 194, 58, 0.2)',
        tagText: '#67c23a',
        iconBg: 'rgba(103, 194, 58, 0.1)',
        iconColor: '#67c23a',
        buttonBg: '#67c23a',
        buttonHoverBg: '#85ce61'
      };
    case 'code':
      return {
        gradient: 'linear-gradient(135deg, #fdf6ec, #fff6ed)',
        tagBg: 'rgba(230, 162, 60, 0.1)',
        tagBorder: 'rgba(230, 162, 60, 0.2)',
        tagText: '#e6a23c',
        iconBg: 'rgba(230, 162, 60, 0.1)',
        iconColor: '#e6a23c',
        buttonBg: '#e6a23c',
        buttonHoverBg: '#ebb563'
      };
    default:
      return {
        gradient: 'linear-gradient(135deg, #f0f5ff, #f6f9ff)',
        tagBg: 'rgba(64, 158, 255, 0.1)',
        tagBorder: 'rgba(64, 158, 255, 0.2)',
        tagText: '#409eff',
        iconBg: 'rgba(64, 158, 255, 0.1)',
        iconColor: '#409eff',
        buttonBg: '#409eff',
        buttonHoverBg: '#66b1ff'
      };
  }
};

const AgentTools: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getCurrentTools = () => {
    return mockAgentTools.filter(tool => {
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <PageHeader
        title="Agent工具"
        description="管理和使用各类Agent工具"
      />

      <div className="flex-1 min-h-0 overflow-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <Search
            placeholder="搜索工具..."
            allowClear
            enterButton={
              <Button 
                type="primary" 
                style={{
                  background: 'linear-gradient(135deg, #409eff, #66b1ff)',
                  border: 'none',
                  boxShadow: '0 2px 6px rgba(64, 158, 255, 0.2)'
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
          <Space>
            <Button
              type="primary"
              icon={<ImportOutlined />}
              style={{
                background: 'linear-gradient(135deg, #409eff, #66b1ff)',
                border: 'none',
                height: '40px',
                boxShadow: '0 2px 6px rgba(64, 158, 255, 0.2)'
              }}
            >
              导入工具
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{
                background: 'linear-gradient(135deg, #67c23a, #85ce61)',
                border: 'none',
                height: '40px',
                boxShadow: '0 2px 6px rgba(103, 194, 58, 0.2)'
              }}
            >
              创建工具
            </Button>
          </Space>
        </div>

        <Tabs
          activeKey={selectedCategory}
          onChange={key => setSelectedCategory(key)}
          className="flex-1"
        >
          <TabPane tab="全部" key="all">
            <Row gutter={[16, 16]}>
              {getCurrentTools().map(tool => {
                const categoryStyle = getCategoryStyle(tool.category);
                return (
                  <Col xs={24} sm={12} md={8} lg={6} key={tool.id}>
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
                        background: categoryStyle.gradient,
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
                            background: categoryStyle.iconBg,
                            marginRight: '12px'
                          }}
                        >
                          {tool.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <Typography.Title level={5} style={{ margin: 0, color: '#1f1f1f' }}>
                            {tool.name}
                          </Typography.Title>
                          <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                            {tool.category}
                          </Typography.Text>
                        </div>
                        <Button
                          type="primary"
                          icon={<PlayCircleOutlined />}
                          style={{
                            background: categoryStyle.buttonBg,
                            borderColor: categoryStyle.buttonBg,
                            borderRadius: '6px',
                            padding: '4px 8px',
                            height: 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = categoryStyle.buttonHoverBg;
                            e.currentTarget.style.borderColor = categoryStyle.buttonHoverBg;
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = categoryStyle.buttonBg;
                            e.currentTarget.style.borderColor = categoryStyle.buttonBg;
                          }}
                        >
                          使用
                        </Button>
                      </div>

                      <Typography.Paragraph
                        ellipsis={{ rows: 2 }}
                        style={{ color: '#595959', marginBottom: '12px', flex: 1 }}
                      >
                        {tool.description}
                      </Typography.Paragraph>

                      <div style={{ marginBottom: '12px' }}>
                        {tool.tags.map(tag => (
                          <Tag
                            key={tag}
                            style={{
                              background: categoryStyle.tagBg,
                              borderColor: categoryStyle.tagBorder,
                              color: categoryStyle.tagText,
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
                          使用次数: {tool.usageCount}
                        </Typography.Text>
                        {tool.version && (
                          <Tag color="default" style={{ fontSize: '12px' }}>
                            v{tool.version}
                          </Tag>
                        )}
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </TabPane>
          <TabPane tab="自动化" key="automation">
            <Row gutter={[16, 16]}>
              {getCurrentTools().map(tool => {
                const categoryStyle = getCategoryStyle(tool.category);
                return (
                  <Col xs={24} sm={12} md={8} lg={6} key={tool.id}>
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
                        background: categoryStyle.gradient,
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
                            background: categoryStyle.iconBg,
                            marginRight: '12px'
                          }}
                        >
                          {tool.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <Typography.Title level={5} style={{ margin: 0, color: '#1f1f1f' }}>
                            {tool.name}
                          </Typography.Title>
                          <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                            {tool.category}
                          </Typography.Text>
                        </div>
                        <Button
                          type="primary"
                          icon={<PlayCircleOutlined />}
                          style={{
                            background: categoryStyle.buttonBg,
                            borderColor: categoryStyle.buttonBg,
                            borderRadius: '6px',
                            padding: '4px 8px',
                            height: 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = categoryStyle.buttonHoverBg;
                            e.currentTarget.style.borderColor = categoryStyle.buttonHoverBg;
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = categoryStyle.buttonBg;
                            e.currentTarget.style.borderColor = categoryStyle.buttonBg;
                          }}
                        >
                          使用
                        </Button>
                      </div>

                      <Typography.Paragraph
                        ellipsis={{ rows: 2 }}
                        style={{ color: '#595959', marginBottom: '12px', flex: 1 }}
                      >
                        {tool.description}
                      </Typography.Paragraph>

                      <div style={{ marginBottom: '12px' }}>
                        {tool.tags.map(tag => (
                          <Tag
                            key={tag}
                            style={{
                              background: categoryStyle.tagBg,
                              borderColor: categoryStyle.tagBorder,
                              color: categoryStyle.tagText,
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
                          使用次数: {tool.usageCount}
                        </Typography.Text>
                        {tool.version && (
                          <Tag color="default" style={{ fontSize: '12px' }}>
                            v{tool.version}
                          </Tag>
                        )}
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </TabPane>
          <TabPane tab="API集成" key="api">
            <Row gutter={[16, 16]}>
              {getCurrentTools().map(tool => {
                const categoryStyle = getCategoryStyle(tool.category);
                return (
                  <Col xs={24} sm={12} md={8} lg={6} key={tool.id}>
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
                        background: categoryStyle.gradient,
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
                            background: categoryStyle.iconBg,
                            marginRight: '12px'
                          }}
                        >
                          {tool.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <Typography.Title level={5} style={{ margin: 0, color: '#1f1f1f' }}>
                            {tool.name}
                          </Typography.Title>
                          <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                            {tool.category}
                          </Typography.Text>
                        </div>
                        <Button
                          type="primary"
                          icon={<PlayCircleOutlined />}
                          style={{
                            background: categoryStyle.buttonBg,
                            borderColor: categoryStyle.buttonBg,
                            borderRadius: '6px',
                            padding: '4px 8px',
                            height: 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = categoryStyle.buttonHoverBg;
                            e.currentTarget.style.borderColor = categoryStyle.buttonHoverBg;
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = categoryStyle.buttonBg;
                            e.currentTarget.style.borderColor = categoryStyle.buttonBg;
                          }}
                        >
                          使用
                        </Button>
                      </div>

                      <Typography.Paragraph
                        ellipsis={{ rows: 2 }}
                        style={{ color: '#595959', marginBottom: '12px', flex: 1 }}
                      >
                        {tool.description}
                      </Typography.Paragraph>

                      <div style={{ marginBottom: '12px' }}>
                        {tool.tags.map(tag => (
                          <Tag
                            key={tag}
                            style={{
                              background: categoryStyle.tagBg,
                              borderColor: categoryStyle.tagBorder,
                              color: categoryStyle.tagText,
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
                          使用次数: {tool.usageCount}
                        </Typography.Text>
                        {tool.version && (
                          <Tag color="default" style={{ fontSize: '12px' }}>
                            v{tool.version}
                          </Tag>
                        )}
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </TabPane>
          <TabPane tab="代码工具" key="code">
            <Row gutter={[16, 16]}>
              {getCurrentTools().map(tool => {
                const categoryStyle = getCategoryStyle(tool.category);
                return (
                  <Col xs={24} sm={12} md={8} lg={6} key={tool.id}>
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
                        background: categoryStyle.gradient,
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
                            background: categoryStyle.iconBg,
                            marginRight: '12px'
                          }}
                        >
                          {tool.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <Typography.Title level={5} style={{ margin: 0, color: '#1f1f1f' }}>
                            {tool.name}
                          </Typography.Title>
                          <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                            {tool.category}
                          </Typography.Text>
                        </div>
                        <Button
                          type="primary"
                          icon={<PlayCircleOutlined />}
                          style={{
                            background: categoryStyle.buttonBg,
                            borderColor: categoryStyle.buttonBg,
                            borderRadius: '6px',
                            padding: '4px 8px',
                            height: 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = categoryStyle.buttonHoverBg;
                            e.currentTarget.style.borderColor = categoryStyle.buttonHoverBg;
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = categoryStyle.buttonBg;
                            e.currentTarget.style.borderColor = categoryStyle.buttonBg;
                          }}
                        >
                          使用
                        </Button>
                      </div>

                      <Typography.Paragraph
                        ellipsis={{ rows: 2 }}
                        style={{ color: '#595959', marginBottom: '12px', flex: 1 }}
                      >
                        {tool.description}
                      </Typography.Paragraph>

                      <div style={{ marginBottom: '12px' }}>
                        {tool.tags.map(tag => (
                          <Tag
                            key={tag}
                            style={{
                              background: categoryStyle.tagBg,
                              borderColor: categoryStyle.tagBorder,
                              color: categoryStyle.tagText,
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
                          使用次数: {tool.usageCount}
                        </Typography.Text>
                        {tool.version && (
                          <Tag color="default" style={{ fontSize: '12px' }}>
                            v{tool.version}
                          </Tag>
                        )}
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default AgentTools; 