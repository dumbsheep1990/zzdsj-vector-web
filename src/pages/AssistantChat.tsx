import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Button, Avatar, Spin, Space, message, Tooltip, Layout, theme, Typography, 
  Modal, Form, Select, Switch, Slider, Badge
} from 'antd';
import { 
  RobotOutlined, UserOutlined, SettingOutlined, 
  LeftOutlined, MessageOutlined, BulbOutlined, FileTextOutlined,
  PictureOutlined, FileAddOutlined, SendOutlined
} from '@ant-design/icons';
import { Bubble, Sender } from '@ant-design/x';
import ChatSidebar, { ChatHistory } from '../components/chat/ChatSidebar';

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
  saveHistory: boolean;
  autoScroll: boolean;
}

const defaultSettings: Settings = {
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 2000,
  saveHistory: true,
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
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays > 0) {
    return `${diffDays}天前`;
  }
  
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours > 0) {
    return `${diffHours}小时前`;
  }
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes > 0) {
    return `${diffMinutes}分钟前`;
  }
  
  return '刚刚';
};

const EmptyStateCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description
}) => (
  <div style={{
    padding: '24px',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    textAlign: 'center',
    margin: '8px 0'
  }}>
    <div style={{ fontSize: '28px', color: '#1677ff', marginBottom: '16px' }}>
      {icon}
    </div>
    <Title level={5} style={{ marginBottom: '8px' }}>{title}</Title>
    <Text type="secondary">{description}</Text>
  </div>
);

const SettingsModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (settings: Settings) => void;
}> = ({ visible, onClose, settings, onSave }) => {
  const [form] = Form.useForm();

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
      title="对话设置"
      open={visible}
      onCancel={onClose}
      onOk={handleSave}
      width={600}
      destroyOnClose
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
            <Select.Option value="gpt-4">GPT-4（推荐）</Select.Option>
            <Select.Option value="gpt-3.5-turbo">GPT-3.5 Turbo</Select.Option>
            <Select.Option value="claude-3">Claude 3</Select.Option>
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
          label="最大令牌数"
          name="maxTokens"
          tooltip="单次回复的最大字符数量"
        >
          <Slider
            min={500}
            max={4000}
            step={100}
            marks={{
              500: '简短',
              2000: '中等',
              4000: '详细'
            }}
          />
        </Form.Item>

        <Form.Item
          label="保存历史记录"
          name="saveHistory"
          valuePropName="checked"
          tooltip="是否保存对话历史记录"
        >
          <Switch />
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
  const { token } = theme.useToken();
  
  // 状态管理
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>();
  
  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      if (!assistantId) {
        message.error('助手ID不存在');
        return;
      }
      
      try {
        setLoading(true);
        const assistantInfo = await fetchAssistantInfo(assistantId);
        setAssistant(assistantInfo);
      } catch (error) {
        console.error('加载数据失败:', error);
        message.error('加载数据失败');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [assistantId]);
  
  // 滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // 加载聊天历史
  useEffect(() => {
    const loadChatHistory = async () => {
      // 模拟加载聊天历史
      const mockHistory: ChatHistory[] = [
        {
          id: '1',
          title: '关于项目开发的讨论',
          lastMessage: '好的，我明白了，让我帮你分析一下这个问题',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          unread: 2,
        },
        {
          id: '2',
          title: '技术架构设计咨询',
          lastMessage: '这种情况下我建议使用微服务架构',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        },
        {
          id: '3',
          title: '代码优化建议',
          lastMessage: '可以考虑使用设计模式来优化这部分代码',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        },
      ];
      setChatHistory(mockHistory);
      setActiveChatId(mockHistory[0].id);
    };
    loadChatHistory();
  }, []);
  
  // 发送消息
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !assistantId) return;
    
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      content: content,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setSending(true);
    
    try {
      const response = await sendMessageToAPI(assistantId, content);
      const assistantMessage: Message = {
        id: response.id,
        content: response.content,
        sender: response.sender,
        timestamp: response.timestamp,
        status: 'sent'
      };
      
      setMessages(prev => [
        ...prev.map(msg => msg.id === userMessage.id ? { ...msg, status: 'sent' as const } : msg),
        assistantMessage
      ]);
    } catch (error) {
      console.error('发送消息失败:', error);
      setMessages(prev => 
        prev.map(msg => msg.id === userMessage.id ? { ...msg, status: 'error' as const } : msg)
      );
      message.error('发送消息失败');
    } finally {
      setSending(false);
    }
  };
  
  const items = messages.map((message) => ({
    key: message.id,
    content: message.content,
    avatar: message.sender === 'user' ? <UserOutlined /> : <RobotOutlined />,
    position: message.sender === 'user' ? 'right' : 'left',
    extra: (
      <div style={{ 
        fontSize: 12, 
        color: token.colorTextSecondary,
        textAlign: message.sender === 'user' ? 'right' : 'left'
      }}>
        {formatTime(message.timestamp)}
      </div>
    )
  }));
  
  const renderEmptyState = () => (
    <div style={{ 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={3}>欢迎使用AI助手</Title>
        <Text type="secondary">开始一段新的对话，探索无限可能</Text>
      </div>
      
      <EmptyStateCard
        icon={<MessageOutlined />}
        title="自然对话"
        description="像与朋友聊天一样自然，AI助手会理解您的需求并提供帮助"
      />

      <EmptyStateCard
        icon={<BulbOutlined />}
        title="智能解答"
        description="无论是技术问题还是创意想法，都能得到专业的解答和建议"
      />

      <EmptyStateCard
        icon={<FileTextOutlined />}
        title="知识沉淀"
        description="对话内容可以保存和回顾，帮助您积累知识和经验"
      />

      <div style={{ 
        marginTop: '32px',
        textAlign: 'center',
        padding: '16px',
        background: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <Text type="secondary">
          💡 提示：试试问我"你能帮我做什么？"
        </Text>
                </div>
              </div>
  );

  const handleChatSelect = (chatId: string) => {
    setActiveChatId(chatId);
    // TODO: 加载选中的聊天记录
  };

  const handleChatDelete = (chatId: string) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    message.success('删除成功');
  };

  const handleChatEdit = (chatId: string) => {
    // TODO: 实现编辑功能
    message.info('编辑功能开发中');
  };

  return (
    <Layout style={{ 
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      background: token.colorBgLayout,
      overflow: 'hidden',
    }}>
      <ChatSidebar
        chatHistory={chatHistory}
        activeChatId={activeChatId}
        onChatSelect={handleChatSelect}
        onChatDelete={handleChatDelete}
        onChatEdit={handleChatEdit}
      />
      <Layout>
        <Header style={{ 
          padding: '0 32px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'fixed',
          top: 0,
          left: 320,
          right: 0,
          zIndex: 100,
        }}>
          <Space size={24}>
            <Button 
              type="text" 
              icon={<LeftOutlined />} 
              onClick={() => navigate(-1)}
              style={{ fontSize: 16 }}
            />
            {assistant && (
              <Space align="center" style={{ height: 40 }}>
                <Badge 
                  status={assistant.status === 'online' ? 'success' : 'default'}
                  offset={[-6, 34]}
                >
                  <Avatar 
                    size={40}
                    icon={<RobotOutlined />} 
                    style={{ 
                      backgroundColor: token.colorPrimary,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                  />
                </Badge>
                <div>
                  <Text strong style={{ 
                    fontSize: 16,
                    display: 'block',
                    lineHeight: '22px',
                  }}>
                    {assistant.name}
                  </Text>
                  <Text type="secondary" style={{ 
                    fontSize: 12,
                    lineHeight: '18px',
                    display: 'block',
                    marginTop: -1,
                    fontFamily: 'monospace',
                  }}>
                    ID: {assistant.id}
                  </Text>
                </div>
              </Space>
            )}
          </Space>
          
          <Space size={16}>
            <Select
              value={settings.model}
              onChange={(value) => setSettings({ ...settings, model: value })}
              style={{ width: 120 }}
              options={[
                { label: 'GPT-4', value: 'gpt-4' },
                { label: 'GPT-3.5', value: 'gpt-3.5-turbo' },
                { label: 'Claude 3', value: 'claude-3' },
              ]}
              bordered={false}
            />
            <Tooltip title="设置">
              <Button 
                type="text" 
                icon={<SettingOutlined />} 
                onClick={() => setSettingsVisible(true)}
                style={{ fontSize: 16 }}
              />
            </Tooltip>
          </Space>
        </Header>
        
        <Content style={{ 
          height: 'calc(100vh - 128px)',
          padding: '88px 24px 24px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          marginLeft: 320,
        }}>
          <div style={{
            maxWidth: '1000px',
            width: '100%',
            margin: '0 auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}>
            {loading ? (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100%' 
              }}>
                <Spin size="large" />
              </div>
            ) : messages.length === 0 ? (
              renderEmptyState()
            ) : (
              <div style={{ 
                flex: 1, 
                overflow: 'auto',
                padding: '0 0 24px',
              }}>
                <Bubble.List 
                  items={items}
                  style={{
                    background: token.colorBgElevated,
                    borderRadius: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  }}
                />
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </Content>
        
        <Footer style={{ 
          padding: '16px 32px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          position: 'fixed',
          bottom: 0,
          left: 320,
          right: 0,
          zIndex: 100,
        }}>
          <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            gap: 16,
            alignItems: 'flex-end'
          }}>
            <div style={{
              flex: 1,
              background: token.colorBgElevated,
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              border: `1px solid ${token.colorBorderSecondary}`,
              padding: '12px 16px',
              position: 'relative',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 8,
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
                paddingBottom: 8,
              }}>
                <Tooltip title="上传图片">
                  <Button 
                    type="text" 
                    icon={<PictureOutlined />}
                    style={{ fontSize: 16 }}
                    onClick={() => message.info('上传图片功能开发中')}
                  />
                </Tooltip>
                <Tooltip title="上传文件">
                  <Button 
                    type="text" 
                    icon={<FileAddOutlined />}
                    style={{ fontSize: 16 }}
                    onClick={() => message.info('上传文件功能开发中')}
                  />
                </Tooltip>
              </div>
              <Sender 
                onSubmit={handleSendMessage} 
                loading={sending}
                placeholder="输入消息，按 Enter 发送..."
              />
              <Button 
                type="primary" 
                icon={<SendOutlined />}
                loading={sending}
                style={{ 
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  borderRadius: '8px',
                }}
                onClick={() => handleSendMessage('')}
              />
            </div>
          </div>
        </Footer>
      </Layout>

      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        settings={settings}
        onSave={setSettings}
      />
    </Layout>
  );
};

export default AssistantChat;
