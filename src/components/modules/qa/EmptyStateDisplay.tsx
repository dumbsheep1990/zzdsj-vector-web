import React from 'react';
import { Empty, Button } from 'antd';
import { QuestionCircleOutlined, FileTextOutlined, InboxOutlined } from '@ant-design/icons';

interface EmptyStateDisplayProps {
  /**
   * 空状态类型
   */
  type: 'no-assistant' | 'no-question' | 'no-search-result';
  /**
   * 点击按钮的回调函数
   */
  onAction?: () => void;
  /**
   * 按钮文本
   */
  actionText?: string;
}

/**
 * 自定义空状态显示组件
 */
const EmptyStateDisplay: React.FC<EmptyStateDisplayProps> = ({
  type,
  onAction,
  actionText
}) => {
  const getEmptyConfig = () => {
    switch (type) {
      case 'no-assistant':
        return {
          icon: <InboxOutlined style={{ fontSize: '48px', color: '#8c8c8c' }} />,
          title: '还没有问答助手',
          description: '创建一个问答助手来开始添加问题',
          defaultActionText: '创建助手'
        };
      case 'no-question':
        return {
          icon: <QuestionCircleOutlined style={{ fontSize: '48px', color: '#8c8c8c' }} />,
          title: '还没有添加问题',
          description: '添加问题来充实您的问答库',
          defaultActionText: '添加问题'
        };
      case 'no-search-result':
        return {
          icon: <FileTextOutlined style={{ fontSize: '48px', color: '#8c8c8c' }} />,
          title: '未找到匹配的问题',
          description: '尝试使用其他关键词搜索',
          defaultActionText: '清除筛选'
        };
      default:
        return {
          icon: <Empty.PRESENTED_IMAGE_SIMPLE />,
          title: '暂无数据',
          description: '没有找到相关数据',
          defaultActionText: '刷新'
        };
    }
  };

  const { icon, title, description, defaultActionText } = getEmptyConfig();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 h-full">
      <div className="text-center max-w-sm">
        <div className="mb-6 opacity-80">{icon}</div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">{title}</h3>
        <p className="text-gray-500 mb-6">{description}</p>
        {onAction && (
          <Button 
            type="primary" 
            onClick={onAction}
            className="shadow-sm hover:shadow-md transition-all"
          >
            {actionText || defaultActionText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyStateDisplay;
