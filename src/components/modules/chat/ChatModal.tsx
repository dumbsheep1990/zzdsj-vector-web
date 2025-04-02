import React from 'react';
import { Layout, theme } from 'antd';
import { RobotOutlined, UserOutlined, SettingOutlined, CloseOutlined, SendOutlined, PictureOutlined, FileAddOutlined, SoundOutlined, SearchOutlined, PlusOutlined, MessageOutlined, DeleteOutlined, ClearOutlined, AudioOutlined } from '@ant-design/icons';
import { Button, Avatar, Space, Typography, Badge, Upload, Input, Modal } from 'antd';

const { Title, Text } = Typography;
const { Header, Content, Footer, Sider } = Layout;

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

interface Assistant {
  id: string;
  name: string;
  avatar: string;
  description: string;
  status: 'online' | 'offline';
}

interface ChatHistoryItem {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  unread?: number;
}

interface ChatModalProps {
  assistant: Assistant | null;
  messages: Message[];
  chatHistory: ChatHistoryItem[];
  inputValue: string;
  sending: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onClose: () => void;
  onSettingsClick: () => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string, e: React.MouseEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onClearHistory?: () => void;
  onSelectChat: (chatId: string) => void;
}

const ChatModal: React.FC<ChatModalProps> = ({
  assistant,
  messages,
  chatHistory,
  inputValue,
  sending,
  onInputChange,
  onSend,
  onClose,
  onSettingsClick,
  onNewChat,
  onDeleteChat,
  messagesEndRef,
  onClearHistory,
  onSelectChat
}) => {
  const { token } = theme.useToken();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const renderMessageContent = (msg: Message) => {
    return msg.content;
  };

  const handleClearHistory = () => {
    Modal.confirm({
      title: '确认清除历史对话',
      content: '是否确认清除当前对话的历史上下文？清除后将无法恢复。',
      okText: '确认',
      cancelText: '取消',
      okButtonProps: {
        style: { background: '#1677ff' }
      },
      onOk: () => {
        onClearHistory?.();
      }
    });
  };

  return (
    <Modal
      open={true}
      onCancel={onClose}
      footer={null}
      width="90%"
      style={{ top: 40 }}
      closeIcon={null}
      className="chat-modal"
      rootClassName="chat-modal-root"
      styles={{
        mask: {
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        },
        content: {
          padding: 0,
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        }
      }}
    >
      <style>
        {`
          .chat-modal-root .ant-modal-mask {
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
          }
        `}
      </style>
      <Layout style={{ height: 'calc(100vh - 80px)', background: 'transparent' }}>
        <Sider
          width={280}
          style={{
            background: 'transparent',
            borderRight: `1px solid ${token.colorBorderSecondary}`,
            overflow: 'hidden',
            height: '100%'
          }}
        >
          <div style={{
            padding: '16px',
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Title level={4} style={{ margin: 0 }}>对话历史</Title>
            <Button 
              type="primary"
              icon={<PlusOutlined />}
              onClick={onNewChat}
              style={{ background: '#1677ff' }}
            >
              新建对话
            </Button>
          </div>
          <div style={{
            height: 'calc(100% - 65px)',
            overflowY: 'auto',
            padding: '8px'
          }}>
            {chatHistory.map(chat => (
              <div
                key={chat.id}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  background: chat.id === assistant?.id ? token.colorBgTextHover : '#fff',
                  border: `1px solid ${chat.id === assistant?.id ? token.colorPrimary : token.colorBorder}`,
                }}
                onClick={() => onSelectChat(chat.id)}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center', 
                  marginBottom: '4px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flex: 1,
                    overflow: 'hidden'
                  }}>
                    <MessageOutlined style={{ color: token.colorPrimary }} />
                    <Text strong style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {chat.title}
                    </Text>
                    {chat.unread && (
                      <Badge count={chat.unread} />
                    )}
                  </div>
                  <Button
                    type="text"
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={(e) => onDeleteChat(chat.id, e)}
                  />
                </div>
                <Text type="secondary" style={{
                  fontSize: '12px',
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {chat.lastMessage}
                </Text>
              </div>
            ))}
          </div>
        </Sider>

        <Layout style={{ background: 'transparent' }}>
          <Header style={{ 
            background: 'transparent',
            padding: '0 24px',
            height: '64px',
            lineHeight: '64px',
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Space>
              <Avatar
                size={36}
                icon={<RobotOutlined />}
                src={assistant?.avatar}
                style={{
                  background: assistant?.avatar ? 'transparent' : token.colorPrimary
                }}
              />
              <Title level={4} style={{ margin: 0 }}>
                {assistant?.name || '加载中...'}
              </Title>
            </Space>
            <Space>
              <Button
                icon={<ClearOutlined />}
                onClick={handleClearHistory}
                type="text"
                title="清除历史对话"
              />
              <Button 
                icon={<SettingOutlined />} 
                onClick={onSettingsClick}
                type="text"
              />
              <Button
                icon={<CloseOutlined />}
                onClick={onClose}
                type="text"
              />
            </Space>
          </Header>

          <Content style={{ 
            padding: '24px', 
            height: 'calc(100% - 128px)',
            overflowY: 'auto',
            background: 'transparent'
          }}>
            <div style={{ maxWidth: '850px', margin: '0 auto' }}>
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  style={{ 
                    marginBottom: '24px',
                    display: 'flex',
                    flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-start'
                  }}
                >
                  <Avatar 
                    size={36}
                    icon={msg.sender === 'user' ? <UserOutlined /> : <RobotOutlined />}
                    src={msg.sender === 'assistant' ? assistant?.avatar : undefined}
                    style={{ 
                      background: msg.sender === 'user' ? token.colorPrimaryBg : token.colorPrimary,
                      marginRight: msg.sender === 'user' ? 0 : '12px',
                      marginLeft: msg.sender === 'user' ? '12px' : 0
                    }}
                  />
                  <div
                    style={{ 
                      maxWidth: '80%',
                      background: msg.sender === 'user' ? token.colorPrimary : token.colorBgTextHover,
                      padding: '12px 16px',
                      borderRadius: '8px',
                      color: msg.sender === 'user' ? '#fff' : token.colorText
                    }}
                  >
                    {renderMessageContent(msg)}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </Content>

          <Footer style={{  
            padding: '16px 24px',
            background: 'transparent',
            borderTop: 'none'
          }}>
            <div style={{ 
              maxWidth: '850px',
              margin: '0 auto'
            }}>
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
              }}>
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '12px',
                  boxShadow: '0 8px 28px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)',
                }}>
                  <Input.TextArea
                    value={inputValue}
                    onChange={(e) => onInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Send a message..."
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    style={{ 
                      background: 'transparent',
                      boxShadow: 'none',
                      resize: 'none',
                      padding: '8px 0',
                      minHeight: '48px',
                      border: 'none',
                      flex: 1
                    }}
                  />
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '4px'
                  }}>
                    <Space size={4}>
                      <Upload>
                        <Button type="text" icon={<PictureOutlined />} />
                      </Upload>
                      <Upload>
                        <Button type="text" icon={<FileAddOutlined />} />
                      </Upload>
                      <Button type="text" icon={<SoundOutlined />} />
                      <Button type="text" icon={<SearchOutlined />} />
                    </Space>
                    <Space size={8}>
                      <Button
                        icon={<AudioOutlined />}
                        type="text"
                        shape="circle"
                        style={{
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `1px solid ${token.colorBorder}`
                        }}
                        title="语音输入"
                      />
                      <Button 
                        type="primary"
                        icon={<SendOutlined />} 
                        onClick={onSend}
                        loading={sending}
                        shape="circle"
                        style={{ 
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#1677ff'
                        }}
                      />
                    </Space>
                  </div>
                </div>
              </div>
            </div>
          </Footer>
        </Layout>
      </Layout>
    </Modal>
  );
};

export default ChatModal; 