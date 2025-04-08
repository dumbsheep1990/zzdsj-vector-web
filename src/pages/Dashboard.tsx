import React from 'react';
import { Card, Row, Col, Statistic, Typography, Space, Tag, Button } from 'antd';
import { 
  User, 
  MessageSquare, 
  Database, 
  Activity, 
  Clock, 
  TrendingUp,
  BookOpen,
  FileText,
  Code,
  HelpCircle,
  BarChart2,
  Book,
  Lightbulb,
  ChevronRight
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  // 模拟数据
  const stats = {
    assistants: {
      total: 12,
      active: 8,
      inactive: 4
    },
    calls: {
      total: 1560,
      today: 120,
      averageResponseTime: '1.2s'
    },
    models: {
      total: 5,
      active: 3,
      tokensUsed: '1.2M'
    }
  };

  // 文档卡片数据
  const docs = [
    {
      title: 'API 接口文档',
      description: '详细的 API 接口说明和使用方法',
      icon: <Code className="w-6 h-6 text-blue-500" />,
      link: '/docs/api'
    },
    {
      title: '使用指南',
      description: '系统功能使用说明和最佳实践',
      icon: <BookOpen className="w-6 h-6 text-green-500" />,
      link: '/docs/guide'
    },
    {
      title: '开发文档',
      description: '系统架构和开发规范说明',
      icon: <FileText className="w-6 h-6 text-purple-500" />,
      link: '/docs/development'
    },
    {
      title: '常见问题',
      description: '常见问题解答和故障排除',
      icon: <HelpCircle className="w-6 h-6 text-orange-500" />,
      link: '/docs/faq'
    }
  ];

  // 最佳实践数据
  const bestPractices = [
    {
      title: '助手优化建议',
      description: '根据当前助手使用情况，建议优化以下方面：',
      items: [
        '增加助手训练数据量',
        '优化问答响应时间',
        '完善知识库覆盖范围'
      ],
      icon: <Lightbulb className="w-5 h-5 text-yellow-500" />
    },
    {
      title: '模型使用建议',
      description: '基于当前模型使用情况，建议：',
      items: [
        '合理分配模型资源',
        '优化Token使用效率',
        '定期更新模型版本'
      ],
      icon: <Lightbulb className="w-5 h-5 text-yellow-500" />
    }
  ];

  return (
    <div className="flex flex-col h-full">
      <PageHeader 
        title="统计看板" 
        description="系统运行状态和关键指标概览"
      />
      
      <div className="flex-1 p-6 overflow-auto">
        {/* 统计卡片区域 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-blue-50">
                <BarChart2 className="w-5 h-5 text-blue-600" />
              </div>
              <Title level={5} className="mb-0 text-gray-800">系统概览</Title>
            </div>
          </div>
          <Row gutter={[16, 16]}>
            {/* 助手统计 */}
            <Col span={8}>
              <Card 
                title="助手统计" 
                className="h-full bg-gradient-to-br from-blue-100/90 to-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                headStyle={{ 
                  borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                  padding: '16px 24px'
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic
                      title="总助手数"
                      value={stats.assistants.total}
                      prefix={<User className="text-blue-500" />}
                      className="hover:bg-blue-50 p-3 rounded-lg transition-colors"
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="活跃助手"
                      value={stats.assistants.active}
                      prefix={<Activity className="text-green-500" />}
                      className="hover:bg-blue-50 p-3 rounded-lg transition-colors"
                    />
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* 调用统计 */}
            <Col span={8}>
              <Card 
                title="调用统计" 
                className="h-full bg-gradient-to-br from-purple-100/90 to-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                headStyle={{ 
                  borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                  padding: '16px 24px'
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic
                      title="总调用次数"
                      value={stats.calls.total}
                      prefix={<MessageSquare className="text-purple-500" />}
                      className="hover:bg-purple-50 p-3 rounded-lg transition-colors"
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="今日调用"
                      value={stats.calls.today}
                      prefix={<Clock className="text-orange-500" />}
                      className="hover:bg-purple-50 p-3 rounded-lg transition-colors"
                    />
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* 模型统计 */}
            <Col span={8}>
              <Card 
                title="模型统计" 
                className="h-full bg-gradient-to-br from-red-100/90 to-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                headStyle={{ 
                  borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                  padding: '16px 24px'
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic
                      title="模型数量"
                      value={stats.models.total}
                      prefix={<Database className="text-red-500" />}
                      className="hover:bg-red-50 p-3 rounded-lg transition-colors"
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Token使用量"
                      value={stats.models.tokensUsed}
                      prefix={<TrendingUp className="text-yellow-500" />}
                      className="hover:bg-red-50 p-3 rounded-lg transition-colors"
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>

        {/* 最佳实践区域 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-indigo-50">
                <Lightbulb className="w-5 h-5 text-indigo-600" />
              </div>
              <Title level={5} className="mb-0 text-gray-800">最佳实践</Title>
            </div>
          </div>
          <Row gutter={[16, 16]}>
            {bestPractices.map((practice, index) => (
              <Col span={12} key={index}>
                <Card 
                  className="h-full bg-gradient-to-br from-indigo-100/90 to-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  bodyStyle={{ padding: '20px' }}
                >
                  <Space direction="vertical" size="middle" className="w-full">
                    <div className="flex items-center">
                      <Lightbulb className="w-5 h-5 text-indigo-500" />
                      <Title level={5} className="mb-0 ml-2 text-gray-800">
                        {practice.title}
                      </Title>
                    </div>
                    <Text type="secondary" className="block text-gray-600">
                      {practice.description}
                    </Text>
                    <div className="flex flex-wrap gap-2">
                      {practice.items.map((item, idx) => (
                        <Tag key={idx} color="blue" className="m-0">
                          {item}
                        </Tag>
                      ))}
                    </div>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* 文档卡片区域 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-gray-50">
                <Book className="w-5 h-5 text-gray-600" />
              </div>
              <Title level={5} className="mb-0 text-gray-800">官方文档</Title>
            </div>
            <Button 
              type="text" 
              className="flex items-center text-gray-500 hover:text-blue-500"
              onClick={() => window.open('/docs', '_blank')}
            >
              查看全部
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <Row gutter={[16, 16]}>
            {docs.map((doc, index) => (
              <Col span={6} key={index}>
                <Card 
                  className={`h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1
                    ${index % 4 === 0 ? 'bg-gradient-to-br from-blue-100/90 to-white' : 
                      index % 4 === 1 ? 'bg-gradient-to-br from-green-100/90 to-white' :
                      index % 4 === 2 ? 'bg-gradient-to-br from-purple-100/90 to-white' :
                      'bg-gradient-to-br from-orange-100/90 to-white'}`}
                  onClick={() => window.open(doc.link, '_blank')}
                  bodyStyle={{ padding: '20px' }}
                >
                  <Space direction="vertical" size="middle" className="w-full">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg transition-colors
                        ${index % 4 === 0 ? 'bg-blue-100 group-hover:bg-blue-200' : 
                          index % 4 === 1 ? 'bg-green-100 group-hover:bg-green-200' :
                          index % 4 === 2 ? 'bg-purple-100 group-hover:bg-purple-200' :
                          'bg-orange-100 group-hover:bg-orange-200'}`}>
                        {doc.icon}
                      </div>
                      <Title level={5} className="mb-0 ml-3 group-hover:text-blue-500 transition-colors">
                        {doc.title}
                      </Title>
                    </div>
                    <Text type="secondary" className="block text-gray-500 group-hover:text-gray-700 transition-colors">
                      {doc.description}
                    </Text>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 