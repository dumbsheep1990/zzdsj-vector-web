import React, { useState } from 'react';
import { Send, Settings, Download, Trash2, ChevronDown, MessageSquare, Bot, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
}

const ChatTestingPanel: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [maxContextLength, setMaxContextLength] = useState(10);
  const [showTimestamps, setShowTimestamps] = useState(false);

  // Styles
  const rightPanelStyle: React.CSSProperties = {
    flex: '1.5',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f1f5f9',
    height: '100%',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  };

  const settingsContainerStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '16px',
    border: '1px solid #e5e7eb',
  };

  const settingsHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    color: '#334155',
  };

  const settingsContentStyle: React.CSSProperties = {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #f1f5f9',
  };

  const optionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
    fontSize: '14px',
    color: '#64748b',
  };

  const toggleStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    width: '40px',
    height: '20px',
  };

  const toggleInputStyle: React.CSSProperties = {
    opacity: 0,
    width: 0,
    height: 0,
  };

  const toggleSliderStyle = (isChecked: boolean): React.CSSProperties => ({
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: isChecked ? '#3b82f6' : '#cbd5e1',
    transition: '0.4s',
    borderRadius: '10px',
  });

  const sliderButtonStyle = (isChecked: boolean): React.CSSProperties => ({
    position: 'absolute',
    content: '',
    height: '16px',
    width: '16px',
    left: isChecked ? '20px' : '4px',
    bottom: '2px',
    backgroundColor: 'white',
    transition: '0.4s',
    borderRadius: '50%',
  });

  const rangeContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const rangeInputStyle: React.CSSProperties = {
    width: '100%',
    accentColor: '#3b82f6',
  };

  const rangeValueStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#94a3b8',
    textAlign: 'right',
  };

  const chatAreaStyle: React.CSSProperties = {
    flexGrow: 1,
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    marginBottom: '16px',
    backgroundColor: 'white',
    padding: '12px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const chatActionsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    padding: '8px 0',
  };

  const actionButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px',
    borderRadius: '4px',
    backgroundColor: '#f1f5f9',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
  };

  const messageContainerStyle = (type: 'user' | 'assistant'): React.CSSProperties => ({
    display: 'flex',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: type === 'user' ? '#f8fafc' : '#eff6ff',
    borderLeft: type === 'user' ? '3px solid #64748b' : '3px solid #3b82f6',
    marginLeft: type === 'user' ? 'auto' : '0',
    marginRight: type === 'assistant' ? 'auto' : '0',
    maxWidth: '80%',
  });

  const avatarStyle = (type: 'user' | 'assistant'): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: type === 'user' ? '#64748b' : '#3b82f6',
    color: 'white',
    flexShrink: 0,
  });

  const messageContentStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#334155',
    flexGrow: 1,
    wordBreak: 'break-word',
  };

  const timestampStyle: React.CSSProperties = {
    fontSize: '11px',
    color: '#94a3b8',
    marginTop: '4px',
  };

  const inputAreaStyle: React.CSSProperties = {
    display: 'flex',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: 'white',
    padding: '4px',
  };

  const inputStyle: React.CSSProperties = {
    flexGrow: 1,
    border: 'none',
    padding: '12px',
    outline: 'none',
    fontSize: '14px',
    backgroundColor: 'transparent',
    color: '#334155',
  };

  const sendButtonStyle: React.CSSProperties = {
    padding: '8px 16px',
    margin: '4px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#3b82f6',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSend = () => {
    if (inputText.trim()) {
      // Add user message
      const userMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        content: inputText.trim(),
        type: 'user',
        timestamp: new Date(),
      };
      
      // Simulate bot response (would be replaced with actual API call)
      const botMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        content: `收到您的问题: "${inputText.trim()}"，这是智能助手的回复。`,
        type: 'assistant',
        timestamp: new Date(),
      };
      
      // Update messages, keeping only up to maxContextLength
      setMessages(prevMessages => {
        const allMessages = [...prevMessages, userMessage, botMessage];
        if (allMessages.length > maxContextLength * 2) {
          return allMessages.slice(-maxContextLength * 2);
        }
        return allMessages;
      });
      
      setInputText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleExportChat = () => {
    const chatContent = messages
      .map(msg => `[${msg.type === 'user' ? '用户' : '助手'}] ${msg.content}`)
      .join('\n\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_export_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={rightPanelStyle}>
      <div style={headerStyle}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>
          文本对话测试
        </h2>
        <button 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px 12px',
            borderRadius: '4px',
            backgroundColor: '#eff6ff',
            border: 'none',
            color: '#3b82f6',
            fontSize: '14px',
            cursor: 'pointer',
          }}
          onClick={() => setSettingsExpanded(!settingsExpanded)}
        >
          <Settings size={16} style={{ marginRight: '6px' }} />
          设置
        </button>
      </div>

      {settingsExpanded && (
        <div style={settingsContainerStyle}>
          <div style={settingsHeaderStyle} onClick={() => setSettingsExpanded(!settingsExpanded)}>
            <span>对话设置</span>
            <ChevronDown 
              size={16} 
              style={{ 
                color: '#64748b',
                transform: 'rotate(180deg)', 
                transition: 'transform 0.3s',
              }} 
            />
          </div>
          <div style={settingsContentStyle}>
            <div style={optionStyle}>
              <span>显示时间戳</span>
              <label style={toggleStyle}>
                <input 
                  type="checkbox" 
                  style={toggleInputStyle} 
                  checked={showTimestamps}
                  onChange={() => setShowTimestamps(!showTimestamps)}
                />
                <span style={toggleSliderStyle(showTimestamps)}></span>
                <span style={sliderButtonStyle(showTimestamps)}></span>
              </label>
            </div>
            <div style={optionStyle}>
              <span>对话历史长度</span>
              <div style={rangeContainerStyle}>
                <input 
                  type="range" 
                  min="5" 
                  max="30" 
                  step="5"
                  value={maxContextLength}
                  onChange={(e) => setMaxContextLength(parseInt(e.target.value))}
                  style={rangeInputStyle}
                />
                <span style={rangeValueStyle}>{maxContextLength} 条消息</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={chatAreaStyle}>
        {messages.length === 0 ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            color: '#94a3b8', 
            fontSize: '14px'
          }}>
            <MessageSquare size={36} style={{ marginBottom: '12px', opacity: 0.5 }} />
            <p>对话历史为空</p>
            <p style={{ fontSize: '12px' }}>在下方输入框中发送消息开始对话</p>
          </div>
        ) : (
          <>
            <div style={chatActionsStyle}>
              <button 
                style={actionButtonStyle} 
                title="导出对话"
                onClick={handleExportChat}
              >
                <Download size={16} />
              </button>
              <button 
                style={actionButtonStyle} 
                title="清空对话"
                onClick={handleClearChat}
              >
                <Trash2 size={16} />
              </button>
            </div>
            {messages.map((message) => (
              <div key={message.id} style={messageContainerStyle(message.type)}>
                <div style={avatarStyle(message.type)}>
                  {message.type === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div style={{ width: '100%' }}>
                  <div style={messageContentStyle}>{message.content}</div>
                  {showTimestamps && (
                    <div style={timestampStyle}>{formatTimestamp(message.timestamp)}</div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      
      <div style={inputAreaStyle}>
        <input
          type="text"
          placeholder="请输入您想问的问题"
          style={inputStyle}
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button style={sendButtonStyle} onClick={handleSend}>
          <Send size={16} />
          发送
        </button>
      </div>
    </div>
  );
};

export default ChatTestingPanel; 