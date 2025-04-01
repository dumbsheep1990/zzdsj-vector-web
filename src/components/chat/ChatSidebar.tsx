import React from 'react';
import { Layout, List, Typography, Button, Space, Tooltip, theme } from 'antd';
import { EditOutlined, DeleteOutlined, MessageOutlined, HistoryOutlined } from '@ant-design/icons';
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
  onChatEdit: (chatId: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chatHistory,
  activeChatId,
  onChatSelect,
  onChatDelete,
  onChatEdit,
}) => {
  const { token } = theme.useToken();

  return (
    <Sider
      width={320}
      style={{
        background: '#fff',
        borderRight: `1px solid ${token.colorBorderSecondary}`,
        overflow: 'auto',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ 
        padding: '16px 24px',
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 1,
      }}>
        <Space align="center">
          <HistoryOutlined style={{ fontSize: 18, color: token.colorPrimary }} />
          <Text strong style={{ fontSize: 16 }}>对话历史</Text>
        </Space>
      </div>
      <List
        dataSource={chatHistory}
        style={{ padding: '8px 0' }}
        renderItem={(chat) => (
          <List.Item
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              margin: '4px 8px',
              borderRadius: '8px',
              background: activeChatId === chat.id 
                ? `linear-gradient(90deg, ${token.colorPrimaryBg} 0%, ${token.colorPrimaryBgHover} 100%)`
                : 'transparent',
              border: activeChatId === chat.id 
                ? `1px solid ${token.colorPrimaryBorder}`
                : '1px solid transparent',
              transition: 'all 0.3s ease',
            }}
            actions={[
              <Tooltip title="编辑">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChatEdit(chat.id);
                  }}
                  style={{ 
                    color: token.colorTextSecondary,
                    opacity: 0.6,
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.color = token.colorPrimary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.6';
                    e.currentTarget.style.color = token.colorTextSecondary;
                  }}
                />
              </Tooltip>,
              <Tooltip title="删除">
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
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.6';
                  }}
                />
              </Tooltip>,
            ]}
            onClick={() => onChatSelect(chat.id)}
          >
            <List.Item.Meta
              avatar={
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '8px',
                  background: `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryHover} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}>
                  <MessageOutlined style={{ fontSize: 20 }} />
                </div>
              }
              title={
                <Space>
                  <Text strong style={{ 
                    fontSize: 14,
                    color: activeChatId === chat.id ? token.colorPrimary : token.colorText,
                  }}>
                    {chat.title}
                  </Text>
                  {chat.unread && chat.unread > 0 && (
                    <span style={{
                      background: token.colorError,
                      color: '#fff',
                      borderRadius: '10px',
                      padding: '0 6px',
                      fontSize: '12px',
                      lineHeight: '16px',
                      minWidth: '20px',
                      textAlign: 'center',
                    }}>
                      {chat.unread}
                    </span>
                  )}
                </Space>
              }
              description={
                <Space direction="vertical" size={0} style={{ marginTop: 4 }}>
                  <Text type="secondary" ellipsis style={{ 
                    maxWidth: 200,
                    fontSize: 13,
                    lineHeight: '18px',
                  }}>
                    {chat.lastMessage}
                  </Text>
                  <Text type="secondary" style={{ 
                    fontSize: '12px',
                    color: token.colorTextSecondary,
                  }}>
                    {formatTime(chat.timestamp)}
                  </Text>
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </Sider>
  );
};

export default ChatSidebar; 