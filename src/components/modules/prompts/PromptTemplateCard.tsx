import React from 'react';
import { Card, Tag, Tooltip, Button, Divider } from 'antd';
import { 
  EditOutlined, 
  LinkOutlined, 
  DisconnectOutlined, 
  CalendarOutlined
} from '@ant-design/icons';
import { PromptTemplate } from '../../../pages/PromptTemplates';

// 将英文类别转换为中文显示
const categoryMap: Record<string, string> = {
  'general': '通用场景',
  'policy': '政策场景',
  'customer_service': '智能客服',
  'qa_system': '问答系统'
};

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const PromptTemplateCard: React.FC<PromptTemplateCardProps> = ({ 
  template, 
  onBind,
  onUnbind,
  onEdit
}) => {
  const { title, content, category, tags, updatedAt, isBound } = template;
  
  return (
    <Card 
      className="prompt-template-card"
      style={{
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        border: '1px solid #f0f0f0',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      bodyStyle={{ padding: '16px', flex: 1 }}
    >
      <div className="flex flex-col h-full">
        {/* 卡片头部 - 类别标签 */}
        <div className="mb-3">
          <Tag 
            color="blue" 
            className="mb-2"
            style={{ borderRadius: '4px', padding: '0 8px' }}
          >
            {categoryMap[category] || category}
          </Tag>
          {isBound && (
            <Tag 
              color="green" 
              className="mb-2 ml-2"
              style={{ borderRadius: '4px', padding: '0 8px' }}
            >
              已绑定
            </Tag>
          )}
        </div>
        
        {/* 卡片标题 */}
        <div className="mb-2">
          <h3 style={{ 
            margin: 0, 
            fontSize: '16px', 
            fontWeight: 600, 
            color: '#000',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {title}
          </h3>
        </div>
        
        {/* 卡片内容 */}
        <div className="mb-3" style={{ flex: 1 }}>
          <p style={{ 
            margin: 0, 
            fontSize: '14px', 
            lineHeight: 1.6, 
            color: '#000',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {content}
          </p>
        </div>
        
        {/* 标签区域 */}
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, index) => (
            <Tag 
              key={index} 
              style={{ 
                background: 'rgba(240, 240, 250, 0.8)', 
                border: 'none', 
                borderRadius: '4px',
                color: '#666',
                fontSize: '12px',
                padding: '0 8px'
              }}
            >
              {tag}
            </Tag>
          ))}
        </div>
        
        {/* 卡片底部信息 */}
        <div className="mt-auto pt-2">
          <Divider style={{ margin: '12px 0' }} />
          
          <div className="flex items-center justify-between">
            {/* 日期信息 */}
            <div className="text-xs text-gray-500 flex items-center">
              <CalendarOutlined className="mr-1" />
              <span>{formatDate(updatedAt)}</span>
            </div>
            
            {/* 操作按钮 */}
            <div className="flex items-center">
              <Tooltip title={isBound ? '解除绑定' : '绑定模板'}>
                <Button 
                  type="text" 
                  icon={isBound ? <DisconnectOutlined /> : <LinkOutlined />}
                  onClick={isBound ? onUnbind : onBind}
                  size="small"
                  style={{ color: isBound ? '#f5222d' : '#1890ff' }}
                >
                  {isBound ? '解绑' : '绑定'}
                </Button>
              </Tooltip>
              <Tooltip title="编辑模板">
                <Button 
                  type="text" 
                  icon={<EditOutlined />} 
                  onClick={onEdit}
                  size="small"
                  style={{ color: '#52c41a' }}
                >
                  编辑
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

interface PromptTemplateCardProps {
  template: PromptTemplate;
  onBind: () => void;
  onUnbind: () => void;
  onEdit: () => void;
}

export default PromptTemplateCard;
