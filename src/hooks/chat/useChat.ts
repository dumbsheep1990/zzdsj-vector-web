import { useState, useRef, useEffect } from 'react';
import { Message } from '../../utils/types';

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

/**
 * 聊天管理Hook
 * 
 * 管理消息列表、发送状态和消息发送逻辑
 * 
 * @param assistantId 助手ID
 * @returns {object} 包含聊天相关状态和方法的对象
 */
export const useChat = (assistantId: string | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 每当消息更新时，滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 发送消息
  const sendMessage = async () => {
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

    try {
      const response = await sendMessageToAPI(assistantId, userMessage.content);
      setMessages(prev => [
        ...prev.map(msg => msg.id === userMessage.id ? { ...msg, status: 'sent' as const } : msg),
        response
      ]);
    } catch (error) {
      console.error('发送消息失败:', error);
      setMessages(prev => 
        prev.map(msg => msg.id === userMessage.id ? { ...msg, status: 'error' as const } : msg)
      );
    } finally {
      setSending(false);
    }
  };

  // 重置聊天
  const resetChat = () => {
    setMessages([]);
  };

  // 加载聊天历史
  const loadChatHistory = (chatMessages: Message[]) => {
    setMessages(chatMessages);
  };

  return {
    messages,
    inputValue,
    sending,
    messagesEndRef,
    setInputValue,
    sendMessage,
    resetChat,
    loadChatHistory,
    scrollToBottom
  };
};
