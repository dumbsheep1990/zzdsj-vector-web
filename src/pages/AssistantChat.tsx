import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message, Modal, Form, Select, Switch, Slider, InputNumber } from 'antd';
import ChatModal from '../components/modules/chat/ChatModal';

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

// 对话历史记录类型
interface ChatHistoryItem {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  unread?: number;
}

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
const sendMessageToAPI = async (assistantId: string, message: string): Promise<Message> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: `msg_${Date.now()}`,
    content: `这是助手 ${assistantId.substring(0, 4)} 的回复：${message}`,
    sender: 'assistant',
    timestamp: new Date(),
    status: 'sent'
  };
};

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
      title={<div style={{ fontSize: '17px', fontWeight: 600, color: '#1677ff' }}>对话设置</div>}
      open={visible}
      onCancel={onClose}
      onOk={handleSave}
      okText="确定"
      cancelText="取消"
      okButtonProps={{ 
        style: { 
          background: '#1677ff', 
          borderColor: '#1677ff',
          boxShadow: '0 2px 4px rgba(24, 144, 255, 0.35)',
          fontWeight: 500
        } 
      }}
      width={600}
      destroyOnClose
      styles={{
        header: {
          background: '#1677ff',
          borderRadius: '10px 10px 0 0',
          padding: '16px 24px',
          borderBottom: '1px solid #d9d9d9',
        },
        body: {
          padding: '24px',
        },
        footer: {
          borderTop: '1px solid #d9d9d9',
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
  const [sending, setSending] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([
    {
      id: 'chat1',
      title: '关于向量检索的讨论',
      lastMessage: '向量检索的原理是...',
      timestamp: new Date(Date.now() - 86400000),
    },
    {
      id: 'chat2',
      title: 'Embedding模型选择',
      lastMessage: '根据您的使用场景...',
      timestamp: new Date(Date.now() - 86400000 * 2),
      unread: 2,
    },
  ]);
  
  useEffect(() => {
    if (!assistantId) return;

    const loadAssistantInfo = async () => {
      try {
        const assistantInfo = await fetchAssistantInfo(assistantId);
        setAssistant(assistantInfo);
      } catch (error) {
        console.error('获取助手信息失败:', error);
        message.error('获取助手信息失败');
      }
    };

    loadAssistantInfo();
  }, [assistantId]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !assistantId) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setSending(true);
    scrollToBottom();

    try {
      const response = await sendMessageToAPI(assistantId, userMessage.content);
      setMessages(prev => [
        ...prev.map(msg => msg.id === userMessage.id ? { ...msg, status: 'sent' as const } : msg),
        response
      ]);
    } catch (error) {
      console.error('发送消息失败:', error);
      message.error('发送消息失败');
      setMessages(prev => 
        prev.map(msg => msg.id === userMessage.id ? { ...msg, status: 'error' as const } : msg)
      );
    } finally {
      setSending(false);
      scrollToBottom();
    }
  };

  const handleSettingsSave = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    message.success('对话已删除');
  };

  const handleNewChat = () => {
    const newChatId = `chat_${Date.now()}`;
    setChatHistory(prev => [{
      id: newChatId,
      title: '新对话',
      lastMessage: '开始一个新的对话',
      timestamp: new Date(),
    }, ...prev]);
    navigate(`/chat/${newChatId}`);
  };

  return (
    <>
      <ChatModal
        assistant={assistant}
        messages={messages}
        chatHistory={chatHistory} 
        inputValue={inputValue}
        sending={sending}
        onInputChange={setInputValue}
        onSend={handleSend}
        onClose={handleClose}
        onSettingsClick={() => setSettingsVisible(true)}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        messagesEndRef={messagesEndRef}
      />

      {/* 设置对话框 */}
      <SettingsModal 
        visible={settingsVisible} 
        onClose={() => setSettingsVisible(false)}
        settings={settings}
        onSave={handleSettingsSave}
      />
    </>
  );
};

export default AssistantChat;
