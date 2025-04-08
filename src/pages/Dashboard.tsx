import React from 'react';
import { Row, Col, Button, Typography } from 'antd';
import { 
  User, 
  Activity, 
  MessageSquare, 
  Clock, 
  Database, 
  TrendingUp, 
  Lightbulb, 
  Book, 
  ChevronRight,
  BarChart2,
  Code,
  BookOpen,
  FileText,
  HelpCircle
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import './Dashboard.css';

const { Title } = Typography;

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
    <div className="dashboard-container">
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
              <div className="frosted-glass-card stat-card assistant-stats">
                <div className="flex items-center mb-4">
                  <User size={24} className="text-blue-500 mr-3" />
                  <h3>助手统计</h3>
                </div>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div className="frosted-glass-subcard">
                      <div className="text-gray-400 text-sm">总助手数</div>
                      <div className="flex items-center text-xl font-semibold mt-2">
                        <User size={20} className="text-blue-500 mr-2" />
                        {stats.assistants.total}
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="frosted-glass-subcard">
                      <div className="text-gray-400 text-sm">活跃助手</div>
                      <div className="flex items-center text-xl font-semibold mt-2">
                        <Activity size={20} className="text-blue-500 mr-2" />
                        {stats.assistants.active}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>

            {/* 调用统计 */}
            <Col span={8}>
              <div className="frosted-glass-card stat-card call-stats">
                <div className="flex items-center mb-4">
                  <MessageSquare size={24} className="text-blue-500 mr-3" />
                  <h3>调用统计</h3>
                </div>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div className="frosted-glass-subcard">
                      <div className="text-gray-400 text-sm">总调用次数</div>
                      <div className="flex items-center text-xl font-semibold mt-2">
                        <MessageSquare size={20} className="text-blue-500 mr-2" />
                        {stats.calls.total}
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="frosted-glass-subcard">
                      <div className="text-gray-400 text-sm">今日调用</div>
                      <div className="flex items-center text-xl font-semibold mt-2">
                        <Clock size={20} className="text-blue-500 mr-2" />
                        {stats.calls.today}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>

            {/* 模型统计 */}
            <Col span={8}>
              <div className="frosted-glass-card stat-card model-stats">
                <div className="flex items-center mb-4">
                  <Database size={24} className="text-blue-500 mr-3" />
                  <h3>模型统计</h3>
                </div>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div className="frosted-glass-subcard">
                      <div className="text-gray-400 text-sm">模型数量</div>
                      <div className="flex items-center text-xl font-semibold mt-2">
                        <Database size={20} className="text-blue-500 mr-2" />
                        {stats.models.total}
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="frosted-glass-subcard">
                      <div className="text-gray-400 text-sm">Token使用量</div>
                      <div className="flex items-center text-xl font-semibold mt-2">
                        <TrendingUp size={20} className="text-blue-500 mr-2" />
                        {stats.models.tokensUsed}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
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
                <div className={`frosted-glass-card practice-card ${index === 0 ? 'optimization' : 'usage'}`}>
                  <div className="flex items-center mb-4">
                    <Lightbulb size={24} className="text-blue-500 mr-3" />
                    <h3>{practice.title}</h3>
                  </div>
                  <div className="text-gray-400 mb-4">{practice.description}</div>
                  <div className="flex flex-wrap gap-2">
                    {practice.items.map((item, idx) => (
                      <span key={idx} className="frosted-glass-tag">{item}</span>
                    ))}
                  </div>
                </div>
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
            <Col span={6}>
              <div className="frosted-glass-card doc-card api-docs">
                <div className="flex items-center mb-4">
                  <Code size={24} className="text-blue-500 mr-3" />
                  <h3>API 接口文档</h3>
                </div>
                <div className="text-gray-400">详细的 API 接口说明和使用方法</div>
              </div>
            </Col>
            <Col span={6}>
              <div className="frosted-glass-card doc-card user-guide">
                <div className="flex items-center mb-4">
                  <BookOpen size={24} className="text-blue-500 mr-3" />
                  <h3>使用指南</h3>
                </div>
                <div className="text-gray-400">系统功能使用说明和最佳实践</div>
              </div>
            </Col>
            <Col span={6}>
              <div className="frosted-glass-card doc-card dev-docs">
                <div className="flex items-center mb-4">
                  <FileText size={24} className="text-blue-500 mr-3" />
                  <h3>开发文档</h3>
                </div>
                <div className="text-gray-400">系统架构和开发规范说明</div>
              </div>
            </Col>
            <Col span={6}>
              <div className="frosted-glass-card doc-card faq">
                <div className="flex items-center mb-4">
                  <HelpCircle size={24} className="text-blue-500 mr-3" />
                  <h3>常见问题</h3>
                </div>
                <div className="text-gray-400">常见问题解答和故障排除</div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 