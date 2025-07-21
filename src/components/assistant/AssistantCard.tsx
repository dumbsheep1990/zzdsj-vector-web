import React from 'react';
import { Button, Tag, Switch, message, Tooltip } from 'antd';
import { 
  RobotOutlined, MessageOutlined, SettingOutlined,
  CheckCircleFilled, CloseCircleFilled, BookOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AssistantCategory, AssistantCardProps } from '../../types/assistant';
import { getCategoryConfig } from '../../constants/assistantCategories';

const AssistantCard: React.FC<AssistantCardProps> = ({ 
  assistant, 
  onSelect,
  showCategoryBadge = false
}) => {
  const navigate = useNavigate(); 
  
  const categoryConfig = getCategoryConfig(assistant.category);
  const CategoryIcon = categoryConfig?.icon || RobotOutlined;

  const getCategoryColor = (category: AssistantCategory) => {
    switch (category) {
      case AssistantCategory.BASIC_CHAT:
        return { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' };
      case AssistantCategory.KNOWLEDGE_QA:
        return { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' };
      case AssistantCategory.AUTONOMOUS_PLANNING:
        return { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.1)', border: 'rgba(107, 114, 128, 0.2)', color: '#6b7280' };
    }
  };

  const categoryColors = getCategoryColor(assistant.category);

  // Status switch handler
  const onStatusChange = (checked: boolean) => {
    message.success(`助手已${checked ? '上线' : '下线'}`);
  };
  
  // Handle card click
  const handleCardClick = () => {
    onSelect(assistant);
  };

  // Handle edit
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    message.info('编辑功能待实现');
  };

  return (
    <div 
      className="group bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer hover:-translate-y-1 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`选择助手 ${assistant.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <div 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0"
              style={{ 
                background: `linear-gradient(135deg, ${categoryColors.color}15, ${categoryColors.color}08)`,
                border: `1px solid ${categoryColors.color}20`
              }}
            >
              <CategoryIcon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: categoryColors.color }} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                {assistant.name}
              </h3>
              <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs text-gray-500 mt-1">
                {assistant.status === 'online' ? (
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
                    <span>在线</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full"></div>
                    <span>离线</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <Switch
            size="small"
            checked={assistant.status === 'online'}
            onChange={onStatusChange}
            onClick={(checked, e) => e.stopPropagation()}
          />
        </div>

        {/* Category Badge */}
        {showCategoryBadge && categoryConfig && (
          <div className="mb-3">
            <Tag 
              className="text-xs px-2 py-1 rounded-md border-0"
              style={{
                background: categoryColors.bg,
                color: categoryColors.color,
              }}
            >
              {categoryConfig.name}
            </Tag>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
        {/* Description */}
        <p 
          className="text-gray-600 text-sm leading-relaxed"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.5rem'
          }}
        >
          {assistant.description}
        </p>

        {/* Model Info */}
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: categoryColors.color }}
          ></div>
          <span>模型: {assistant.model}</span>
        </div>

        {/* Capabilities */}
        <div className="flex flex-wrap gap-1.5">
          {assistant.capabilities.slice(0, 3).map((cap: string) => (
            <Tag 
              key={cap} 
              className="text-xs px-2 py-0.5 rounded-md border-0"
              style={{ 
                background: categoryColors.bg,
                color: categoryColors.color
              }}
            >
              {cap}
            </Tag>
          ))}
          {assistant.capabilities.length > 3 && (
            <Tag className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border-0">
              +{assistant.capabilities.length - 3}
            </Tag>
          )}
        </div>

        {/* Knowledge Base */}
        {assistant.knowledgeBases && assistant.knowledgeBases.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
              <BookOutlined style={{ color: categoryColors.color }} />
              <span>知识库</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {assistant.knowledgeBases.slice(0, 2).map(kb => (
                <Tooltip key={kb.id} title={`${kb.name} (${kb.documentCount}个文档)`}>
                  <Tag 
                    className="text-xs px-2 py-0.5 rounded-md border-0"
                    style={{ 
                      background: categoryColors.bg,
                      color: categoryColors.color
                    }}
                  >
                    {kb.name}
                  </Tag>
                </Tooltip>
              ))}
              {assistant.knowledgeBases.length > 2 && (
                <Tag className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border-0">
                  +{assistant.knowledgeBases.length - 2}
                </Tag>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-3 sm:p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex space-x-2">
          <Button 
            icon={<SettingOutlined />}
            onClick={handleEdit}
            className="flex-1 h-7 sm:h-8 text-xs font-medium rounded-lg border-0 hover:opacity-90"
            style={{
              background: `linear-gradient(135deg, ${categoryColors.color}, ${categoryColors.color}dd)`,
              color: 'white'
            }}
          >
            <span className="hidden sm:inline">配置</span>
          </Button>
          
          <Button 
            icon={<MessageOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/chat/${assistant.id}`);
            }}
            disabled={assistant.status === 'offline'}
            className="flex-1 h-7 sm:h-8 text-xs font-medium rounded-lg border-0 hover:opacity-90"
            style={{
              background: assistant.status === 'online' 
                ? 'linear-gradient(135deg, #06b6d4, #0891b2)'
                : '#e5e7eb',
              color: assistant.status === 'online' ? 'white' : '#9ca3af'
            }}
          >
            {assistant.status === 'online' ? '对话' : '离线'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssistantCard;