import React, { useState, useEffect } from 'react';
import { Layout, List, Typography, Button, Space, Tooltip, theme } from 'antd';
import { DeleteOutlined, MessageOutlined, HistoryOutlined, PlusOutlined } from '@ant-design/icons';
import { formatTime } from '../../utils/timeUtils';

const { Text } = Typography;
const { Sider } = Layout;

export interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  unread?: number;
}

interface ChatSidebarProps {
  chatHistory: ChatHistory[];
  activeChatId?: string;
  onChatSelect: (chatId: string) => void;
  onChatDelete: (chatId: string) => void;
  onCreateChat?: () => void;
}

// Helper function to truncate text with ellipsis
const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chatHistory,
  activeChatId,
  onChatSelect,
  onChatDelete,
  onCreateChat,
}) => {
  const { token } = theme.useToken();
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(activeChatId);

  // Update local state when prop changes
  useEffect(() => {
    console.log(`ChatSidebar: activeChatId changed to ${activeChatId}`);
    setSelectedChatId(activeChatId);
  }, [activeChatId]);

  // Define theme colors for consistent styling
  const sidebarBgColor = '#f0f2f5';
  const headerBgColor = '#e6f4ff';
  const cardHoverBgColor = '#e6f7ff';
  const activeCardBgColor = 'rgba(22, 119, 255, 0.1)';
  const defaultCardBgColor = '#ffffff';
  const borderColor = '#eaeaea';
  
  // Maximum length for chat titles
  const MAX_TITLE_LENGTH = 15;

  // Handle chat selection with local state
  const handleChatClick = (chatId: string) => {
    console.log(`ChatSidebar: Chat clicked: ${chatId}, current activeChatId: ${activeChatId}`);
    setSelectedChatId(chatId);
    onChatSelect(chatId);
  };

  return (
    <Sider
      width={320}
      style={{
        background: sidebarBgColor,
        borderRight: `1px solid ${borderColor}`,
        overflow: 'auto',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        height: '100vh',
      }}
    >
      <div style={{ 
        padding: '16px 16px',
        borderBottom: `1px solid ${borderColor}`,
        background: headerBgColor,
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        height: '64px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Space align="center">
          <HistoryOutlined style={{ fontSize: 18, color: token.colorPrimary }} />
          <Text strong style={{ fontSize: 16 }}>对话历史</Text>
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onCreateChat}
          style={{
            borderRadius: '4px',
            boxShadow: '0 2px 0 rgba(0, 0, 0, 0.045)',
            background: token.colorPrimary,
            borderColor: token.colorPrimaryBorder,
          }}
        >
          新建对话
        </Button>
      </div>
      
      <List
        dataSource={chatHistory}
        style={{ padding: '8px' }}
        renderItem={(chat) => {
          // Strict equality check - convert both to string to ensure consistency
          const isActive = String(chat.id) === String(selectedChatId);
          
          return (
            <List.Item
              key={chat.id}
              className={isActive ? 'active-chat-item' : ''}
              style={{
                padding: '12px',
                cursor: 'pointer',
                margin: '8px 0',
                borderRadius: '8px',
                background: isActive ? activeCardBgColor : defaultCardBgColor,
                border: `1px solid ${isActive ? token.colorPrimaryBorder : borderColor}`,
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 2px 4px rgba(0,0,0,0.1)' : '0 1px 2px rgba(0,0,0,0.05)',
                position: 'relative',
                zIndex: isActive ? 2 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = cardHoverBgColor;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = defaultCardBgColor;
                }
              }}
              actions={[
                <Tooltip title="删除" key="delete">
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onChatDelete(chat.id);
                    }}
                    style={{ 
                      opacity: 0.6,
                    }}
                  />
                </Tooltip>,
              ]}
              onClick={() => handleChatClick(chat.id)}
            >
              <List.Item.Meta
                avatar={
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '6px',
                    background: `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryActive} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                  }}>
                    <MessageOutlined style={{ fontSize: 18 }} />
                  </div>
                }
                title={
                  <Space align="center">
                    <Text strong style={{ 
                      fontSize: 14,
                      color: isActive ? token.colorPrimary : token.colorText,
                    }}>
                      {truncateText(chat.title, MAX_TITLE_LENGTH)}
                    </Text>
                    {/* 删除消息数量显示 */}
                  </Space>
                }
                description={
                  <Text type="secondary" style={{ 
                    fontSize: '12px',
                    color: token.colorTextSecondary,
                  }}>
                    {formatTime(chat.timestamp)}
                  </Text>
                }
              />
            </List.Item>
          );
        }}
      />
    </Sider>
  );
};

export default ChatSidebar;