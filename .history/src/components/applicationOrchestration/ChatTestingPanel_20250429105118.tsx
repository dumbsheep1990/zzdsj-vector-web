import React, { useState } from 'react';

const ChatTestingPanel: React.FC = () => {
  const [inputText, setInputText] = useState('');

  // Styles
  const rightPanelStyle: React.CSSProperties = {
    flex: '1.5',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f1f5f9',
  };

  const chatAreaStyle: React.CSSProperties = {
    flexGrow: 1,
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    marginBottom: '16px',
    backgroundColor: 'white',
    padding: '12px',
    overflowY: 'auto',
  };

  const inputAreaStyle: React.CSSProperties = {
    display: 'flex',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: 'white',
  };

  const inputStyle: React.CSSProperties = {
    flexGrow: 1,
    border: 'none',
    padding: '12px',
    outline: 'none',
    fontSize: '14px',
    backgroundColor: 'transparent',
  };

  const sendButtonStyle: React.CSSProperties = {
    padding: '8px 16px',
    margin: '4px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#2563eb',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSend = () => {
    if (inputText.trim()) {
      // Handle sending the message
      console.log('Sending message:', inputText);
      setInputText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={rightPanelStyle}>
      <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#1e293b' }}>
        文本对话测试
      </h2>
      <div style={chatAreaStyle}>
        {/* Chat messages will appear here */}
        <p style={{color: '#94a3b8', fontSize: '14px', textAlign: 'center', marginTop: '20px'}}>对话历史</p>
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
        <button style={sendButtonStyle} onClick={handleSend}>发送</button>
      </div>
    </div>
  );
};

export default ChatTestingPanel; 