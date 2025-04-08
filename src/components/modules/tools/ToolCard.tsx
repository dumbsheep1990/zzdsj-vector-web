import React from 'react';
import { Card, Tag, Button, Typography } from 'antd';
import { PlayCircleOutlined, ToolOutlined, RobotOutlined, ApiOutlined, DatabaseOutlined } from '@ant-design/icons';
import type { Tool as DataProcessingTool } from '../../../utils/mockToolsData';

// 工具类型定义
export interface Tool {
  id: string;
  name: string;
  icon?: React.ReactNode;
  description?: string;
  category: '数据爬取' | '数据清洗' | '数据格式化' | '数据集生成';
  subCategory: string;
  tags: string[];
  usageCount?: number;
  isFavorite?: boolean;
  version?: string;
}

interface ToolCardProps {
  tool: DataProcessingTool;
  onFavorite: (id: string) => void;
}

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'ToolOutlined':
      return <ToolOutlined style={{ fontSize: '24px' }} />;
    case 'RobotOutlined':
      return <RobotOutlined style={{ fontSize: '24px' }} />;
    case 'ApiOutlined':
      return <ApiOutlined style={{ fontSize: '24px' }} />;
    case 'DatabaseOutlined':
      return <DatabaseOutlined style={{ fontSize: '24px' }} />;
    default:
      return <ToolOutlined style={{ fontSize: '24px' }} />;
  }
};

const ToolCard: React.FC<ToolCardProps> = ({ tool, onFavorite }) => {
  const getCategoryStyle = () => {
    switch (tool.category) {
      case 'crawler':
        return {
          gradient: 'linear-gradient(135deg, #e6f4ff, #f6fbff)',
          tagBg: 'rgba(24, 144, 255, 0.1)',
          tagBorder: 'rgba(24, 144, 255, 0.2)',
          tagText: '#1890ff',
          iconBg: 'rgba(24, 144, 255, 0.1)',
          iconColor: '#1890ff',
          buttonBg: '#1890ff',
          buttonHoverBg: '#40a9ff'
        };
      case 'cleaner':
        return {
          gradient: 'linear-gradient(135deg, #e6faf4, #f5fffa)',
          tagBg: 'rgba(82, 196, 26, 0.1)',
          tagBorder: 'rgba(82, 196, 26, 0.2)',
          tagText: '#52c41a',
          iconBg: 'rgba(82, 196, 26, 0.1)',
          iconColor: '#52c41a',
          buttonBg: '#52c41a',
          buttonHoverBg: '#73d13d'
        };
      case 'formatter':
        return {
          gradient: 'linear-gradient(135deg, #ebf0ff, #f5f8ff)',
          tagBg: 'rgba(114, 46, 209, 0.1)',
          tagBorder: 'rgba(114, 46, 209, 0.2)',
          tagText: '#722ed1',
          iconBg: 'rgba(114, 46, 209, 0.1)',
          iconColor: '#722ed1',
          buttonBg: '#722ed1',
          buttonHoverBg: '#9254de'
        };
      case 'generator':
        return {
          gradient: 'linear-gradient(135deg, #ebf7fa, #f6fdff)',
          tagBg: 'rgba(19, 194, 194, 0.1)',
          tagBorder: 'rgba(19, 194, 194, 0.2)',
          tagText: '#13c2c2',
          iconBg: 'rgba(19, 194, 194, 0.1)',
          iconColor: '#13c2c2',
          buttonBg: '#13c2c2',
          buttonHoverBg: '#36cfc9'
        };
      default:
        return {
          gradient: 'linear-gradient(135deg, #e6f4ff, #f6fbff)',
          tagBg: 'rgba(24, 144, 255, 0.1)',
          tagBorder: 'rgba(24, 144, 255, 0.2)',
          tagText: '#1890ff',
          iconBg: 'rgba(24, 144, 255, 0.1)',
          iconColor: '#1890ff',
          buttonBg: '#1890ff',
          buttonHoverBg: '#40a9ff'
        };
    }
  };

  const categoryStyle = getCategoryStyle();

  return (
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
          {getIconComponent(tool.icon)}
        </div>
        <div style={{ flex: 1 }}>
          <Typography.Title level={5} style={{ margin: 0, color: '#1f1f1f' }}>
            {tool.name}
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
            {tool.subCategory}
          </Typography.Text>
        </div>
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={() => onFavorite(tool.id)}
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
  );
};

export default ToolCard;
