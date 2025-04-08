import React from 'react';
import { Modal, Row, Col, Typography, Divider } from 'antd';
import { 
  MessageOutlined, 
  ApiOutlined, 
  BookOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { ModifiedAssistant } from './AssistantCard';

const { Text } = Typography;

interface AssistantStatsModalProps {
  visible: boolean;
  assistant: ModifiedAssistant;
  onClose: () => void;
}

const AssistantStatsModal: React.FC<AssistantStatsModalProps> = ({
  visible,
  assistant,
  onClose
}) => {
  const StatCard = ({ 
    icon: Icon, 
    title, 
    value, 
    gradient 
  }: { 
    icon: typeof MessageOutlined; 
    title: string; 
    value: string | number;
    gradient: string;
  }) => (
    <div style={{ 
      background: 'linear-gradient(145deg, #ffffff, #fafafa)',
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
      border: '1px solid rgba(0, 0, 0, 0.06)',
      height: '100%'
    }}>
      <div style={{ 
        color: '#8c8c8c',
        fontSize: '14px',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <Icon style={{ fontSize: '16px' }} />
        {title}
      </div>
      <div style={{ 
        fontSize: '24px',
        fontWeight: '600',
        background: gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        {value}
      </div>
    </div>
  );

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChartOutlined />
          <span>使用统计</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div style={{ padding: '20px 0' }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <StatCard
              icon={MessageOutlined}
              title="对话次数"
              value={assistant.usageStats?.totalChats.toLocaleString() || '0'}
              gradient="linear-gradient(90deg, #1890ff, #69c0ff)"
            />
          </Col>
          <Col span={8}>
            <StatCard
              icon={ApiOutlined}
              title="Token消耗"
              value={
                assistant.usageStats?.tokenUsage
                  ? (assistant.usageStats.tokenUsage > 1000000
                    ? `${(assistant.usageStats.tokenUsage / 1000000).toFixed(1)}M`
                    : `${(assistant.usageStats.tokenUsage / 1000).toFixed(0)}K`)
                  : '0'
              }
              gradient="linear-gradient(90deg, #722ed1, #b37feb)"
            />
          </Col>
          <Col span={8}>
            <StatCard
              icon={BookOutlined}
              title="API调用"
              value={assistant.usageStats?.apiCalls?.toLocaleString() || '0'}
              gradient="linear-gradient(90deg, #13c2c2, #5cdbd3)"
            />
          </Col>
        </Row>

        <Divider style={{ margin: '24px 0' }} />

        <div style={{ 
          background: 'linear-gradient(145deg, #f8f9fa, #f0f2f5)',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '13px',
          color: '#8c8c8c'
        }}>
          <Text type="secondary">
            统计数据更新时间：{new Date().toLocaleString()}
          </Text>
        </div>
      </div>
    </Modal>
  );
};

export default AssistantStatsModal; 