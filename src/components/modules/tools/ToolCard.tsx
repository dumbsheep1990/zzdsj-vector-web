import React from 'react';
import { Card, Avatar, Button, Typography, Tag, Space, Tooltip } from 'antd';
import { 
  ToolOutlined, 
  ArrowRightOutlined,
  StarOutlined, 
  StarFilled
} from '@ant-design/icons';

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
}

interface ToolCardProps {
  tool: Tool;
  isFavorite: boolean;
  toggleFavorite: (id: string) => void;
  onUse: (tool: Tool) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ 
  tool,
  isFavorite,
  toggleFavorite,
  onUse
}) => {
  const cardStyle = { 
    width: "100%",
    borderRadius: "16px",
    overflow: "hidden",
    height: '350px', 
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06), 0 0 1px rgba(0, 0, 0, 0.12)', 
    border: '1px solid rgba(220, 230, 240, 0.8)', 
    transition: 'all 0.3s ease', 
    display: 'flex',
    flexDirection: 'column' as const,
  };

  const getHeaderGradient = () => {
    // 更轻量化的现代渐变色组合 - 根据不同的工具类别使用不同的渐变色
    const gradients = {
      '数据爬取': 'linear-gradient(120deg, rgba(230, 244, 255, 0.95), rgba(246, 251, 255, 0.95))', // 蓝色系
      '数据清洗': 'linear-gradient(120deg, rgba(230, 250, 244, 0.95), rgba(245, 255, 250, 0.95))', // 绿色系
      '数据格式化': 'linear-gradient(120deg, rgba(235, 240, 255, 0.95), rgba(245, 248, 255, 0.95))', // 紫蓝色系
      '数据集生成': 'linear-gradient(120deg, rgba(235, 247, 250, 0.95), rgba(246, 253, 255, 0.95))' // 青色系
    };
    
    return gradients[tool.category] || gradients['数据爬取'];
  };

  const getCategoryColor = () => {
    const colors = {
      '数据爬取': {
        bg: 'rgba(24, 144, 255, 0.1)',
        border: 'rgba(24, 144, 255, 0.2)',
        text: '#1890ff'
      },
      '数据清洗': {
        bg: 'rgba(82, 196, 26, 0.1)',
        border: 'rgba(82, 196, 26, 0.2)',
        text: '#52c41a'
      },
      '数据格式化': {
        bg: 'rgba(114, 46, 209, 0.1)',
        border: 'rgba(114, 46, 209, 0.2)',
        text: '#722ed1'
      },
      '数据集生成': {
        bg: 'rgba(19, 194, 194, 0.1)',
        border: 'rgba(19, 194, 194, 0.2)',
        text: '#13c2c2'
      }
    };

    return colors[tool.category] || colors['数据爬取'];
  };

  const headerGradient = getHeaderGradient();
  const categoryColor = getCategoryColor();

  return (
    <Card
      style={{
        ...cardStyle,
        background: headerGradient,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
      title={
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          width: '100%' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              size={36} 
              icon={tool.icon || <ToolOutlined />} 
              style={{ 
                marginRight: '12px', 
                background: 'linear-gradient(135deg, #1890ff, #69c0ff)', 
                boxShadow: '0 2px 6px rgba(24, 144, 255, 0.2)' 
              }}
            />
            <div>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                marginBottom: '2px'
              }}>
                <Tooltip title={tool.name}>
                  <div style={{ 
                    fontWeight: 500, 
                    fontSize: '16px',
                    color: '#333',
                    marginRight: '8px',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    maxWidth: '140px'
                  }}>
                    {tool.name}
                  </div>
                </Tooltip>
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: categoryColor.text,
                display: 'flex',
                alignItems: 'center'
              }}>
                {tool.subCategory}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* 收藏按钮 */}
            <Button 
              type="text" 
              icon={isFavorite ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />} 
              onClick={() => toggleFavorite(tool.id)}
              style={{ marginRight: '4px' }}
            />
          </div>
        </div>
      }
      headStyle={{
        padding: '12px 16px',
        background: headerGradient,
        borderBottom: '1px solid rgba(0, 0, 0, 0.03)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px'
      }}
      bodyStyle={{ 
        padding: '0', 
        flex: '1',
        display: 'flex',
        flexDirection: 'column' as const,
        background: 'transparent',
        overflow: 'hidden', 
        minHeight: '0',
        position: 'relative',
      }}
    >
      <div style={{ 
        padding: '14px',
        background: 'rgba(250, 251, 255, 0.35)', 
        backdropFilter: 'blur(20px)', 
        WebkitBackdropFilter: 'blur(20px)', 
        borderRadius: '16px',
        boxShadow: `
          0 10px 30px rgba(0, 0, 0, 0.08), 
          0 4px 12px rgba(31, 38, 135, 0.07), 
          inset 0 2px 0 rgba(255, 255, 255, 0.8),
          inset 0 0 8px rgba(255, 255, 255, 0.4)
        `, 
        margin: '12px 12px 8px 12px', 
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'column' as const,
        border: '1px solid rgba(255, 255, 255, 0.9)', 
        position: 'relative', 
        zIndex: 1,
        transform: 'translateZ(0)', 
        transition: 'all 0.3s ease',
        minHeight: '0',
        overflow: 'auto'
      }}>
        <Typography.Paragraph 
          ellipsis={{ rows: 4 }}
          style={{ margin: '0 0 12px 0', minHeight: '78px' }}
        >
          {tool.description || '暂无描述'}
        </Typography.Paragraph>
        
        <Space wrap style={{ marginBottom: '8px' }}>
          {tool.tags.map((tag: string) => (
            <Tag key={tag} style={{ 
              borderRadius: '12px',
              background: categoryColor.bg,
              border: `1px solid ${categoryColor.border}`,
              color: categoryColor.text
            }}>{tag}</Tag>
          ))}
        </Space>

        {tool.usageCount !== undefined && (
          <div style={{ 
            marginTop: 'auto', 
            fontSize: '12px', 
            color: '#8c8c8c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
          }}>
            <Typography.Text type="secondary">
              使用次数: {tool.usageCount.toLocaleString()}
            </Typography.Text>
          </div>
        )}
      </div>
      
      {/* 底部操作区域 */}
      <div style={{ 
        padding: '8px 16px 12px', 
        background: 'transparent',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        borderBottomLeftRadius: '16px',
        borderBottomRightRadius: '16px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
        height: '52px', 
        position: 'relative', 
        zIndex: 2,
        marginBottom: 0
      }}>
        <Button
          size="middle"
          icon={<ArrowRightOutlined />}
          onClick={() => onUse(tool)}
          style={{ 
            background: `linear-gradient(135deg, ${categoryColor.text}, ${categoryColor.text}99)`, 
            borderColor: 'transparent', 
            color: 'white',
            borderRadius: '8px',
            fontSize: '14px',
            padding: '0 20px',
            height: '34px', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 2px 10px ${categoryColor.bg}`,
            transition: 'all 0.3s ease',
            width: 'calc(100% - 16px)', 
            maxWidth: '500px', 
            margin: '0 auto', 
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = `linear-gradient(135deg, ${categoryColor.text}99, ${categoryColor.text})`;
            e.currentTarget.style.boxShadow = `0 4px 12px ${categoryColor.bg}`;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = `linear-gradient(135deg, ${categoryColor.text}, ${categoryColor.text}99)`;
            e.currentTarget.style.boxShadow = `0 2px 10px ${categoryColor.bg}`;
          }}
        >
          使用工具
        </Button>
      </div>
    </Card>
  );
};

export default ToolCard;
