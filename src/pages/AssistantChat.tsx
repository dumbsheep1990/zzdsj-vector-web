import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Button, Avatar, Spin, Space, message, Tooltip, Layout, theme, Typography, 
  Modal, Form, Select, Switch, Slider, Badge, InputNumber
} from 'antd';
import { 
  SettingOutlined, RobotOutlined, LeftOutlined, UserOutlined, 
  SendOutlined, MessageOutlined, PictureOutlined, FileAddOutlined,
  SoundOutlined, SearchOutlined, AudioOutlined, ClearOutlined
} from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import ChatSidebar, { ChatHistory } from '../components/chat/ChatSidebar';
import { formatTime as formatTimeUtil } from '../utils/timeUtils';

const { Text, Title } = Typography;
const { Header, Content, Footer } = Layout;

// 对话消息类型
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

// 设置类型
interface Settings {
  model: string;
  temperature: number;
  maxTokens: number;
  historyRounds: number;
  autoScroll: boolean;
}

const defaultSettings: Settings = {
  model: 'deepseek-coder',
  temperature: 0.7,
  maxTokens: 2048,
  historyRounds: 3,
  autoScroll: true,
};

// 模拟获取助手信息的函数
const fetchAssistantInfo = async (assistantId: string): Promise<Assistant> => {
  return {
    id: assistantId,
    name: `助手 ${assistantId.substring(0, 4)}`,
    avatar: '',
    description: '高级AI助手',
    status: 'online'
  };
};

// 模拟发送消息到API的函数
const sendMessageToAPI = async (assistantId: string, message: string) => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: `msg_${Date.now()}`,
    content: `这是助手 ${assistantId.substring(0, 4)} 的回复：${message}`,
    sender: 'assistant' as const,
    timestamp: new Date()
  };
};

// 格式化时间函数
const formatTime = (date: Date) => {
  return formatTimeUtil(date);
};

const SettingsModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (settings: Settings) => void;
}> = ({ visible, onClose, settings, onSave }) => {
  const [form] = Form.useForm();
  const { token } = theme.useToken();

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(settings);
    }
  }, [visible, settings, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      onSave(values);
      onClose();
      message.success('设置已保存');
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Modal
      title={<div style={{ fontSize: '17px', fontWeight: 600, color: token.colorTextHeading }}>对话设置</div>}
      open={visible}
      onCancel={onClose}
      onOk={handleSave}
      okText="确定"
      cancelText="取消"
      okButtonProps={{ 
        style: { 
          background: token.colorPrimary, 
          borderColor: token.colorPrimary,
          boxShadow: '0 2px 4px rgba(24, 144, 255, 0.35)',
          fontWeight: 500
        } 
      }}
      width={600}
      destroyOnClose
      styles={{
        header: {
          background: token.colorPrimaryBg,
          borderRadius: '10px 10px 0 0',
          padding: '16px 24px',
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        },
        body: {
          padding: '24px',
        },
        footer: {
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          padding: '12px 24px',
        },
        mask: {
          background: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(3px)'
        },
        content: {
          borderRadius: '10px',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
        }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={settings}
      >
        <Form.Item
          label="语言模型"
          name="model"
          tooltip="选择不同的语言模型将影响回答的质量和速度"
        >
          <Select>
            <Select.Option value="deepseek-coder">Deepseek Coder</Select.Option>
            <Select.Option value="deepseek-chat">Deepseek Chat</Select.Option>
            <Select.Option value="qwen-plus">Qwen Plus</Select.Option>
            <Select.Option value="qwen-max">Qwen Max</Select.Option>
            <Select.Option value="qwen-turbo">Qwen Turbo</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="温度"
          name="temperature"
          tooltip="较高的值会使输出更加随机，较低的值会使其更加集中和确定"
        >
          <Slider
            min={0}
            max={1}
            step={0.1}
            marks={{
              0: '精确',
              0.5: '平衡',
              1: '创造'
            }}
          />
        </Form.Item>

        <Form.Item
          label="最大Token数"
          name="maxTokens"
          tooltip="单次回复的最大字符数量"
        >
          <InputNumber
            min={500}
            max={8000}
            defaultValue={2048}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label="历史轮数"
          name="historyRounds"
          tooltip="设置固定数量的历史轮数，超过该数量的轮数将被删除"
        >
          <Slider
            min={1}
            max={12}
            step={1}
            marks={{
              1: '1',
              6: '6',
              12: '12'
            }}
          />
        </Form.Item>

        <Form.Item
          label="自动滚动"
          name="autoScroll"
          valuePropName="checked"
          tooltip="新消息出现时是否自动滚动到底部"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const AssistantChat: React.FC = () => {
  const { assistantId } = useParams<{ assistantId: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sending, setSending] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const { token } = theme.useToken();
  
  // 保持当前选中的聊天ID
  const [currentChatId, setCurrentChatId] = useState<string | undefined>(assistantId);
  
  useEffect(() => {
    if (!assistantId) return;

    // 当URL参数改变时更新当前选中的聊天ID
    setCurrentChatId(assistantId);
    console.log('URL参数改变:', assistantId);
    
    // 获取当前助手信息
    const loadAssistantInfo = async () => {
      try {
        setLoading(true);
        const assistantInfo = await fetchAssistantInfo(assistantId);
        setAssistant(assistantInfo);

        // 重置当前聊天的消息
        setMessages([]);

        // 检查当前聊天ID是否已存在于历史记录中
        const existingChatIndex = chatHistory.findIndex(chat => chat.id === assistantId);

        // 如果是新的聊天ID，就添加到历史记录，但不重排序
        if (existingChatIndex === -1) {
          setChatHistory(prev => [
            {
              id: assistantId,
              title: '新对话',
              lastMessage: '您好，我是AI助手，有什么可以帮助您的吗？',
              timestamp: new Date(),
            },
            ...prev
          ]);
        }

        setLoading(false);
      } catch (error) {
        console.error('获取助手信息失败:', error);
        message.error('获取助手信息失败');
        setLoading(false);
      }
    };

    loadAssistantInfo();
    
    console.log('当前活动聊天ID:', assistantId);
  }, [assistantId]);

  useEffect(() => {
    if (settings.autoScroll) {
      scrollToBottom();
    }
  }, [messages, settings.autoScroll]);

  useEffect(() => {
    if (chatHistory.length === 0) {
      // 创建两个ID以保持一致性
      const chat1Id = 'chat_' + Date.now();
      const chat2Id = 'chat_' + (Date.now() + 1);
      
      setChatHistory([
        {
          id: chat1Id,
          title: '如何实现向量检索',
          lastMessage: '向量检索的原理是...',
          timestamp: new Date(Date.now() - 86400000 * 2),
        },
        {
          id: chat2Id,
          title: 'Embedding模型选择',
          lastMessage: '根据您的使用场景...',
          timestamp: new Date(Date.now() - 86400000),
          unread: 2
        }
      ]);
      
      // 如果没有当前选中的聊天ID，则导航到第一个聊天
      if (!assistantId) {
        navigate(`/chat/${chat1Id}`, { replace: true });
      }
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!inputValue.trim() || sending || !assistant) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setSending(true);

    try {
      // 发送用户消息到API并获取助手回复
      const assistantMessage = await sendMessageToAPI(assistant.id, inputValue);
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('发送消息失败:', error);
      message.error('发送消息失败');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSettingsSave = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  const handleCreateChat = () => {
    const newChatId = `chat_${Date.now()}`;
    
    // 将新聊天添加到历史记录最前面
    setChatHistory(prev => [
      {
        id: newChatId,
        title: '新对话',
        lastMessage: '开始一个新的对话',
        timestamp: new Date(),
      },
      ...prev
    ]);
    
    // 更新当前选中的聊天ID
    setCurrentChatId(newChatId);
    
    // 重置消息列表
    setMessages([]);
    
    // 导航到新聊天，并确保URL参数更新
    navigate(`/chat/${newChatId}`, { replace: true });
    
    console.log('新聊天创建:', newChatId);
  };

  const handleChatSelect = (chatId: string) => {
    if (chatId !== currentChatId) {
      // 更新当前选中的聊天ID
      setCurrentChatId(chatId);
      
      // 重置消息列表
      setMessages([]);
      
      // 导航到选中的聊天
      navigate(`/chat/${chatId}`, { replace: true });
      
      console.log('选中聊天:', chatId);
    }
  };

  const handleChatDelete = (chatId: string) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    if (chatId === currentChatId) {
      // 如果删除的是当前对话，则导航到第一个对话或返回助手列表
      if (chatHistory.length > 1) {
        const firstChat = chatHistory.find(chat => chat.id !== chatId);
        if (firstChat) {
          navigate(`/chat/${firstChat.id}`);
          return;
        }
      }
      navigate('/');
    }
  };

  const handleClearContext = () => {
    // 保存用户消息
    const userMessages = messages.filter(msg => msg.sender === 'user');
    // 如果用户消息列表不为空，则保留最新的一条用户消息
    const lastUserMessage = userMessages.length > 0 ? [userMessages[userMessages.length - 1]] : [];
    // 添加一条系统消息
    const systemMessage: Message = {
      id: `system-${Date.now()}`,
      content: '对话内容已清除，您可以开始新的对话。',
      sender: 'assistant',
      timestamp: new Date(),
    };
    
    // 更新消息列表
    setMessages([...lastUserMessage, systemMessage]);
    message.success('对话内容已清除');
  };

  const renderMessageContent = (msg: Message) => {
    return (
      <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {msg.content}
      </div>
    );
  };

  return (
    <Layout style={{ height: '100vh', background: '#f0f2f5' }}>
      <ChatSidebar 
        chatHistory={chatHistory} 
        activeChatId={currentChatId} 
        onChatSelect={handleChatSelect} 
        onChatDelete={handleChatDelete} 
        onCreateChat={handleCreateChat} 
      />

      <Layout style={{ marginLeft: 320, height: '100vh', background: '#f7f9fc' }}>
        <Header style={{ 
          height: '64px',
          padding: '0 24px', 
          background: '#e6f4ff',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          borderBottom: `1px solid #eaeaea`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', maxWidth: '70%' }}>
            <Button 
              icon={<LeftOutlined />} 
              onClick={() => navigate('/')}
              type="text"
              style={{
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                marginRight: '12px'
              }}
            >
              返回
            </Button>
            
            {assistant && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                width: '240px',
              }}>
                <Avatar 
                  icon={<RobotOutlined />} 
                  style={{ 
                    backgroundColor: token.colorPrimary,
                    marginRight: '10px',
                    flexShrink: 0
                  }} 
                  size={32}
                />
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  flex: '1',
                  minWidth: 0,
                  overflow: 'hidden'
                }}>
                  <div style={{
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: '16px',
                    marginRight: '8px',
                    maxWidth: '130px'
                  }}>
                    {assistant.name}
                  </div>
                  <Badge 
                    status={assistant.status === 'online' ? 'success' : 'default'} 
                    text={assistant.status === 'online' ? '在线' : '离线'}
                    style={{ fontSize: '12px' }}
                  />
                </div>
              </div>
            )}
          </div>

          <Space>
            <Tooltip title="清除对话">
              <Button 
                icon={<ClearOutlined />} 
                onClick={handleClearContext}
                type="text"
                style={{
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              />
            </Tooltip>
            <Tooltip title="设置">
              <Button 
                icon={<SettingOutlined />} 
                onClick={() => setSettingsVisible(true)}
                type="text"
                shape="circle"
                style={{ fontSize: '16px' }}
              />
            </Tooltip>
          </Space>
        </Header>

        <Content style={{ 
          padding: '24px', 
          height: 'calc(100vh - 64px - 100px)',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {loading ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%' 
            }}>
              <Spin size="large" tip="加载中..." />
            </div>
          ) : messages.length > 0 ? (
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {messages.map(msg => (
                <div 
                  key={msg.id} 
                  style={{ 
                    marginBottom: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Space 
                    align="start" 
                    style={{ 
                      maxWidth: '80%',
                    }}
                  >
                    {msg.sender === 'assistant' && (
                      <Avatar 
                        icon={<RobotOutlined />}
                        style={{ 
                          backgroundColor: token.colorPrimary,
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <div>
                      <Bubble 
                        style={{ 
                          maxWidth: '100%',
                          background: msg.sender === 'user' ? token.colorPrimaryBg : '#f2f3f5',
                          color: msg.sender === 'user' ? token.colorPrimaryText : token.colorText,
                          border: `1px solid ${msg.sender === 'user' ? token.colorPrimaryBorder : '#eaeaea'}`,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                          padding: '12px 16px',
                          borderRadius: msg.sender === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                        }}
                        content={renderMessageContent(msg)}
                      />
                      <div style={{ 
                        fontSize: '12px', 
                        color: token.colorTextSecondary,
                        marginTop: '4px',
                        textAlign: msg.sender === 'user' ? 'right' : 'left',
                      }}>
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                    {msg.sender === 'user' && (
                      <Avatar 
                        icon={<UserOutlined />}
                        style={{ 
                          backgroundColor: token.colorInfo,
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </Space>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div style={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center',
              padding: '40px 0'
            }}>
              <div style={{
                maxWidth: '400px',
                textAlign: 'center',
                padding: '40px',
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px'
              }}>
                <MessageOutlined style={{ fontSize: '48px', color: token.colorPrimary, marginBottom: '16px' }} />
                <Title level={3} style={{ margin: 0, fontSize: '20px' }}>
                  开始一次对话
                </Title>
                <Text style={{ color: token.colorTextSecondary, fontSize: '16px' }}>
                  输入您的问题，AI助手将为您提供帮助和答案
                </Text>
              </div>
            </div>
          )}
        </Content>

        <Footer style={{  
          padding: '16px 24px',
          background: '#fff',
          borderTop: '1px solid #eaeaea',
          boxShadow: '0 -2px 8px rgba(0,0,0,0.03)',
        }}>
          <div style={{ 
            display: 'flex', 
            gap: '12px',
            maxWidth: '1000px',
            margin: '0 auto',
          }}>
            <div style={{ 
              flex: 1,
              border: `1px solid #eaeaea`,
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div style={{
                display: 'flex',
                padding: '12px 16px',
                borderBottom: '1px solid #f0f0f0',
              }}>
                <Space size="small">
                  <Tooltip title="上传图片">
                    <Button 
                      type="text" 
                      icon={<PictureOutlined style={{ fontSize: '16px', color: token.colorTextSecondary }} />} 
                      size="small"
                      disabled={sending}
                    />
                  </Tooltip>
                  <Tooltip title="上传文件">
                    <Button 
                      type="text" 
                      icon={<FileAddOutlined style={{ fontSize: '16px', color: token.colorTextSecondary }} />} 
                      size="small"
                      disabled={sending}
                    />
                  </Tooltip>
                  <Tooltip title="语音播报">
                    <Button 
                      type="text" 
                      icon={<SoundOutlined style={{ fontSize: '16px', color: token.colorTextSecondary }} />} 
                      size="small"
                      disabled={sending}
                    />
                  </Tooltip>
                  <Tooltip title="语音对话">
                    <Button 
                      type="text" 
                      icon={<AudioOutlined style={{ fontSize: '16px', color: token.colorTextSecondary }} />} 
                      size="small"
                      disabled={sending}
                    />
                  </Tooltip>
                  <Tooltip title="联网搜索">
                    <Button 
                      type="text" 
                      icon={<SearchOutlined style={{ fontSize: '16px', color: token.colorTextSecondary }} />} 
                      size="small"
                      disabled={sending}
                    />
                  </Tooltip>
                </Space>
              </div>
              <div style={{ 
                display: 'flex',
                padding: '0 16px 16px',
              }}>
                <textarea
                  id="message-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入您的问题..."
                  style={{ 
                    width: '100%', 
                    height: '60px', 
                    border: 'none',
                    resize: 'none',
                    padding: '12px 0',
                    outline: 'none',
                    fontSize: '14px',
                    lineHeight: 1.5,
                    backgroundColor: 'transparent',
                  }}
                  disabled={loading || sending}
                />
                <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '12px', gap: '8px' }}>
                  <Tooltip title="语音对话">
                    <Button 
                      type="default" 
                      icon={<AudioOutlined />} 
                      style={{ 
                        height: '36px',
                        width: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        borderRadius: '8px',
                      }}
                      disabled={loading || sending}
                    />
                  </Tooltip>
                  <Tooltip title="发送">
                    <Button 
                      type="default"
                      icon={<SendOutlined />} 
                      onClick={handleSend}
                      loading={sending}
                      disabled={!inputValue.trim() || loading}
                      style={{ 
                        height: '36px',
                        width: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        borderRadius: '8px',
                        border: inputValue.trim() ? 'none' : undefined,
                        backgroundColor: inputValue.trim() ? '#1677ff' : undefined,
                        color: inputValue.trim() ? '#fff' : undefined,
                      }}
                    />
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </Footer>
      </Layout>
      
      <SettingsModal 
        visible={settingsVisible} 
        onClose={() => setSettingsVisible(false)}
        settings={settings}
        onSave={handleSettingsSave}
      />
    </Layout>
  );
};

export default AssistantChat;
