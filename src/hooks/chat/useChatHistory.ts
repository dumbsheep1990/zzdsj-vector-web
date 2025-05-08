import { useState } from 'react';
import { ChatHistoryItem } from '../../utils/types';

/**
 * 聊天历史管理Hook
 * 
 * 管理聊天历史记录，提供历史聊天的选择、删除、创建等操作
 * 
 * @param initialHistory 初始聊天历史记录
 * @returns {object} 包含聊天历史相关状态和方法的对象
 */
export const useChatHistory = (initialHistory: ChatHistoryItem[] = []) => {
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>(
    initialHistory.length > 0 ? initialHistory : [
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
    ]
  );

  // 创建新聊天
  const createNewChat = (): string => {
    const newChatId = `chat_${Date.now()}`;
    setChatHistory(prev => [{
      id: newChatId,
      title: '新对话',
      lastMessage: '开始一个新的对话',
      timestamp: new Date(),
    }, ...prev]);
    return newChatId;
  };

  // 删除聊天
  const deleteChat = (chatId: string) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
  };

  // 更新聊天标题
  const updateChatTitle = (chatId: string, title: string) => {
    setChatHistory(prev => 
      prev.map(chat => chat.id === chatId ? { ...chat, title } : chat)
    );
  };

  // 更新最后一条消息
  const updateLastMessage = (chatId: string, message: string) => {
    setChatHistory(prev => 
      prev.map(chat => chat.id === chatId ? { 
        ...chat, 
        lastMessage: message,
        timestamp: new Date()
      } : chat)
    );
  };

  // 清除未读消息
  const clearUnread = (chatId: string) => {
    setChatHistory(prev => 
      prev.map(chat => chat.id === chatId ? { ...chat, unread: 0 } : chat)
    );
  };

  // 增加未读消息计数
  const incrementUnread = (chatId: string) => {
    setChatHistory(prev => 
      prev.map(chat => chat.id === chatId ? { 
        ...chat, 
        unread: (chat.unread || 0) + 1 
      } : chat)
    );
  };

  // 获取指定聊天
  const getChat = (chatId: string): ChatHistoryItem | undefined => {
    return chatHistory.find(chat => chat.id === chatId);
  };

  return {
    chatHistory,
    createNewChat,
    deleteChat,
    updateChatTitle,
    updateLastMessage,
    clearUnread,
    incrementUnread,
    getChat,
  };
};
