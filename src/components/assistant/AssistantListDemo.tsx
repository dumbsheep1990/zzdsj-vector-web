import React from 'react';
import { Card, Typography, Space, Button } from 'antd';
import { EyeOutlined, CodeOutlined } from '@ant-design/icons';
import AssistantListRedesigned from '../../pages/AssistantListRedesigned';

const { Title, Paragraph } = Typography;

/**
 * Demo component to showcase the redesigned assistant list
 */
const AssistantListDemo: React.FC = () => {
  const [showDemo, setShowDemo] = React.useState(false);

  if (showDemo) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ 
          padding: '16px', 
          background: '#f0f2f5', 
          borderBottom: '1px solid #d9d9d9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Title level={4} style={{ margin: 0 }}>
            助手列表重设计 - 演示
          </Title>
          <Button onClick={() => setShowDemo(false)}>
            返回介绍
          </Button>
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <AssistantListRedesigned />
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      background: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Title level={1} style={{ color: '#1890ff' }}>
          助手列表重设计
        </Title>
        <Paragraph style={{ fontSize: '18px', color: '#666' }}>
          基于现代化设计理念的助手分类管理界面
        </Paragraph>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {/* Feature Cards */}
        <Card title="🎯 分类导航" hoverable>
          <Paragraph>
            使用现代化的 TubeLight 导航栏，将助手按功能分为三大类：
          </Paragraph>
          <ul>
            <li><strong>基础对话</strong> - 日常交流助手</li>
            <li><strong>知识库问答</strong> - 专业问答助手</li>
            <li><strong>自主规划智能体</strong> - 高级任务处理</li>
          </ul>
        </Card>

        <Card title="🎨 视觉设计" hoverable>
          <Paragraph>
            采用渐变背景和毛玻璃效果，提供现代化的视觉体验：
          </Paragraph>
          <ul>
            <li>分类特定的颜色主题</li>
            <li>流畅的动画过渡</li>
            <li>响应式布局设计</li>
            <li>优雅的空状态提示</li>
          </ul>
        </Card>

        <Card title="⚡ 交互体验" hoverable>
          <Paragraph>
            优化的用户交互流程：
          </Paragraph>
          <ul>
            <li>平滑的分类切换动画</li>
            <li>智能的状态管理</li>
            <li>URL 同步和状态持久化</li>
            <li>错误处理和重试机制</li>
          </ul>
        </Card>

        <Card title="🔧 技术特性" hoverable>
          <Paragraph>
            基于现代前端技术栈：
          </Paragraph>
          <ul>
            <li>TypeScript 类型安全</li>
            <li>Framer Motion 动画</li>
            <li>React Hooks 状态管理</li>
            <li>Ant Design 组件库</li>
          </ul>
        </Card>
      </div>

      {/* Demo Actions */}
      <div style={{ textAlign: 'center' }}>
        <Space size="large">
          <Button 
            type="primary" 
            size="large" 
            icon={<EyeOutlined />}
            onClick={() => setShowDemo(true)}
            style={{
              background: 'linear-gradient(135deg, #1890ff, #40a9ff)',
              borderColor: 'transparent',
              height: '48px',
              padding: '0 32px',
              fontSize: '16px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
            }}
          >
            查看演示
          </Button>
          
          <Button 
            size="large" 
            icon={<CodeOutlined />}
            onClick={() => {
              window.open('https://github.com/your-repo/assistant-redesign', '_blank');
            }}
            style={{
              height: '48px',
              padding: '0 32px',
              fontSize: '16px',
              borderRadius: '8px'
            }}
          >
            查看代码
          </Button>
        </Space>
      </div>

      {/* Implementation Details */}
      <Card 
        title="实现细节" 
        style={{ marginTop: '40px' }}
        bodyStyle={{ background: '#fafafa' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div>
            <Title level={4}>组件结构</Title>
            <pre style={{ 
              background: '#f6f8fa', 
              padding: '16px', 
              borderRadius: '8px',
              fontSize: '12px',
              overflow: 'auto'
            }}>
{`AssistantListRedesigned
├── AssistantCategoryTabs
│   └── TubeLight NavBar
├── AssistantGrid
│   ├── AssistantCard[]
│   └── EmptyState
└── CategoryStats`}
            </pre>
          </div>
          
          <div>
            <Title level={4}>状态管理</Title>
            <pre style={{ 
              background: '#f6f8fa', 
              padding: '16px', 
              borderRadius: '8px',
              fontSize: '12px',
              overflow: 'auto'
            }}>
{`useAssistantCategories()
├── activeCategory
├── switchCategory()
└── URL sync

useAssistants()
├── filteredAssistants
├── loading/error states
└── category filtering`}
            </pre>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AssistantListDemo;