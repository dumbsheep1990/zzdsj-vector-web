import React, { useState, useRef } from 'react';
import { Send, Settings, Download, Trash2, ChevronDown, MessageSquare, Bot, User, Image, FileText, Mic, X, Paperclip, Code, Share2, Check, ArrowRight } from 'lucide-react';

interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  attachmentType?: 'image' | 'file' | 'voice';
  attachmentUrl?: string;
  attachmentName?: string;
}

interface ChatTestingPanelProps {
  // Props from left panel configuration
  imageSupport: boolean;
  voiceSupport: boolean;
  documentParsing: boolean;
  webSearch: boolean;
}

const ChatTestingPanel: React.FC<ChatTestingPanelProps> = ({
  imageSupport = false,
  voiceSupport = false,
  documentParsing = false,
  webSearch = false
}) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [maxContextLength, setMaxContextLength] = useState(10);
  const [showTimestamps, setShowTimestamps] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileAttachment, setFileAttachment] = useState<File | null>(null);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [publishType, setPublishType] = useState<'api' | 'assistant' | null>(null);
  const [publishName, setPublishName] = useState('');
  const [publishDescription, setPublishDescription] = useState('');
  const [publishSuccess, setPublishSuccess] = useState(false);
  
  // Refs for file inputs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Styles
  const rightPanelStyle: React.CSSProperties = {
    flex: '1.5',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f1f5f9',
    height: '100%',
    position: 'relative',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  };

  const publishBarStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    border: '1px solid #e5e7eb',
  };

  const publishButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '6px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
  };

  const publishOptionButtonStyle = (selected: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 16px',
    borderRadius: '6px',
    backgroundColor: selected ? '#3b82f6' : '#e5e7eb',
    color: selected ? 'white' : '#64748b',
    border: 'none',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
  });

  const publishModalOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  };

  const publishModalStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    width: '400px',
    maxWidth: '90%',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  };

  const modalHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  };

  const formGroupStyle: React.CSSProperties = {
    marginBottom: '16px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: '#334155',
    marginBottom: '6px',
  };

  const inputFieldStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    fontSize: '14px',
    color: '#334155',
    outline: 'none',
  };

  const successBannerStyle: React.CSSProperties = {
    backgroundColor: '#dcfce7',
    border: '1px solid #86efac',
    color: '#166534',
    padding: '12px 16px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    marginTop: '20px',
  };

  const modalActionsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
  };

  const cancelButtonStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '6px',
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    border: 'none',
    fontSize: '14px',
    cursor: 'pointer',
  };

  const confirmButtonStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '6px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
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
    flexDirection: 'column',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: 'white',
    padding: '4px',
  };

  const attachmentPreviewStyle: React.CSSProperties = {
    padding: '8px 12px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#64748b',
  };

  const inputContainerStyle: React.CSSProperties = {
    display: 'flex',
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

  const toolbarStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0 8px',
  };

  const toolButtonStyle = (active: boolean = false): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '4px',
    backgroundColor: active ? '#eff6ff' : 'transparent',
    border: 'none',
    color: active ? '#3b82f6' : '#64748b',
    cursor: 'pointer',
  });

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

  const imagePreviewStyle: React.CSSProperties = {
    maxWidth: '120px',
    maxHeight: '80px',
    borderRadius: '4px',
    objectFit: 'contain',
    marginRight: '12px',
  };

  const attachmentImageStyle: React.CSSProperties = {
    maxWidth: '100%',
    maxHeight: '200px',
    borderRadius: '4px',
    marginTop: '8px',
  };

  const fileAttachmentStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px',
    backgroundColor: '#f8fafc',
    borderRadius: '4px',
    marginTop: '8px',
    fontSize: '13px',
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFileAttachment(files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleRemoveFile = () => {
    setFileAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    // Here would be actual voice recording logic
    if (isRecording) {
      // Stop recording and process the audio
      console.log('Stopping voice recording');
    } else {
      // Start recording
      console.log('Starting voice recording');
    }
  };

  const createAttachmentMessage = (): Partial<ChatMessage> | null => {
    if (imagePreview) {
      return {
        attachmentType: 'image',
        attachmentUrl: imagePreview,
      };
    } else if (fileAttachment) {
      return {
        attachmentType: 'file',
        attachmentName: fileAttachment.name,
      };
    } else if (isRecording) {
      return {
        attachmentType: 'voice',
        attachmentName: '录音.mp3',
      };
    }
    return null;
  };

  const getAssistantResponse = (content: string, attachmentType?: string): string => {
    let response = `收到您的问题: "${content}"`;
    
    if (attachmentType === 'image') {
      response = '我收到了您的图片，这是在分析图片后的回复。';
    } else if (attachmentType === 'file') {
      response = '我已经分析了您上传的文件，下面是我的解析结果。';
    } else if (attachmentType === 'voice') {
      response = '我已识别您的语音信息，这是我的回复。';
    }
    
    if (webSearch) {
      response += '\n\n我已通过联网搜索查找到相关信息...';
    }
    
    return response;
  };

  const handleSend = () => {
    const content = inputText.trim();
    const attachment = createAttachmentMessage();
    
    if (content || attachment) {
      // Add user message
      const userMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        content,
        type: 'user',
        timestamp: new Date(),
        ...attachment,
      };
      
      // Simulate bot response
      const botMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        content: getAssistantResponse(content, attachment?.attachmentType),
        type: 'assistant',
        timestamp: new Date(),
      };
      
      // Update messages
      setMessages(prevMessages => {
        const allMessages = [...prevMessages, userMessage, botMessage];
        if (allMessages.length > maxContextLength * 2) {
          return allMessages.slice(-maxContextLength * 2);
        }
        return allMessages;
      });
      
      // Reset state
      setInputText('');
      setImagePreview(null);
      setFileAttachment(null);
      if (isRecording) setIsRecording(false);
      
      // Reset file inputs
      if (imageInputRef.current) imageInputRef.current.value = '';
      if (fileInputRef.current) fileInputRef.current.value = '';
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
      .map(msg => {
        let content = `[${msg.type === 'user' ? '用户' : '助手'}] ${msg.content}`;
        if (msg.attachmentType) {
          content += ` [附件类型: ${
            msg.attachmentType === 'image' ? '图片' : 
            msg.attachmentType === 'file' ? '文件' : '语音'
          }]`;
          if (msg.attachmentName) {
            content += ` [${msg.attachmentName}]`;
          }
        }
        return content;
      })
      .join('\n\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_export_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderMessageAttachment = (message: ChatMessage) => {
    if (message.attachmentType === 'image' && message.attachmentUrl) {
      return (
        <img 
          src={message.attachmentUrl} 
          alt="用户上传的图片" 
          style={attachmentImageStyle} 
        />
      );
    } else if (message.attachmentType === 'file' && message.attachmentName) {
      return (
        <div style={fileAttachmentStyle}>
          <FileText size={16} />
          <span>{message.attachmentName}</span>
        </div>
      );
    } else if (message.attachmentType === 'voice' && message.attachmentName) {
      return (
        <div style={fileAttachmentStyle}>
          <Mic size={16} />
          <span>{message.attachmentName}</span>
        </div>
      );
    }
    return null;
  };

  const handlePublishClick = () => {
    setPublishType(null);
    setPublishName('');
    setPublishDescription('');
    setPublishSuccess(false);
    setPublishModalOpen(true);
  };

  const handlePublishTypeSelect = (type: 'api' | 'assistant') => {
    setPublishType(type);
  };

  const handlePublishConfirm = () => {
    // Here you would implement the actual publishing logic
    console.log(`Publishing as ${publishType}:`, {
      name: publishName,
      description: publishDescription,
    });
    
    // Show success message
    setPublishSuccess(true);
    
    // Close modal after delay when successful
    setTimeout(() => {
      setPublishModalOpen(false);
      setPublishSuccess(false);
    }, 2000);
  };

  return (
    <div style={rightPanelStyle}>
      {/* Publish modal */}
      {publishModalOpen && (
        <div style={publishModalOverlayStyle} onClick={() => !publishSuccess && setPublishModalOpen(false)}>
          <div style={publishModalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              {publishType === 'api' ? (
                <Code size={20} color="#3b82f6" />
              ) : publishType === 'assistant' ? (
                <Bot size={20} color="#3b82f6" />
              ) : (
                <Share2 size={20} color="#3b82f6" />
              )}
              <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0, color: '#1e293b' }}>
                {publishType === 'api' ? '发布为API' : 
                 publishType === 'assistant' ? '发布为助手' : 
                 '选择发布方式'}
              </h3>
            </div>
            
            {!publishType ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    gap: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                  }}
                  onClick={() => handlePublishTypeSelect('api')}
                >
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '8px', 
                    backgroundColor: '#eff6ff', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#3b82f6'
                  }}>
                    <Code size={24} />
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontSize: '16px', fontWeight: 500, color: '#334155' }}>发布为API</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>将配置发布为API接口，可供其他系统调用</div>
                  </div>
                  <ArrowRight size={18} color="#64748b" />
                </button>
                
                <button 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    gap: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                  }}
                  onClick={() => handlePublishTypeSelect('assistant')}
                >
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '8px', 
                    backgroundColor: '#eff6ff', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#3b82f6'
                  }}>
                    <Bot size={24} />
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontSize: '16px', fontWeight: 500, color: '#334155' }}>发布为助手</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>将配置发布为助手，提供交互式对话服务</div>
                  </div>
                  <ArrowRight size={18} color="#64748b" />
                </button>
              </div>
            ) : publishSuccess ? (
              <div style={successBannerStyle}>
                <Check size={18} />
                <span>发布成功！</span>
              </div>
            ) : (
              <>
                <div style={formGroupStyle}>
                  <label style={labelStyle} htmlFor="publish-name">名称</label>
                  <input 
                    id="publish-name"
                    type="text" 
                    style={inputFieldStyle} 
                    placeholder={publishType === 'api' ? "API名称" : "助手名称"}
                    value={publishName}
                    onChange={(e) => setPublishName(e.target.value)}
                  />
                </div>
                
                <div style={formGroupStyle}>
                  <label style={labelStyle} htmlFor="publish-description">描述</label>
                  <textarea 
                    id="publish-description"
                    style={{ ...inputFieldStyle, minHeight: '80px', resize: 'vertical' }} 
                    placeholder="简要描述功能和用途"
                    value={publishDescription}
                    onChange={(e) => setPublishDescription(e.target.value)}
                  ></textarea>
                </div>
                
                <div style={modalActionsStyle}>
                  <button 
                    style={cancelButtonStyle} 
                    onClick={() => setPublishModalOpen(false)}
                  >
                    取消
                  </button>
                  <button 
                    style={confirmButtonStyle}
                    onClick={handlePublishConfirm}
                  >
                    <Share2 size={16} />
                    确认发布
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Header section */}
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

      {/* Publish bar */}
      <div style={publishBarStyle}>
        <div style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>
          完成配置后，您可以将此应用发布为API或助手
        </div>
        <button
          style={publishButtonStyle}
          onClick={handlePublishClick}
        >
          <Share2 size={16} />
          发布
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
            
            {/* Status indicators for features enabled in left panel */}
            {(imageSupport || voiceSupport || documentParsing || webSearch) && (
              <>
                <div style={{ marginTop: '16px', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#334155' }}>
                  已启用功能
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {imageSupport && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px', 
                      padding: '4px 8px', 
                      backgroundColor: '#eff6ff', 
                      color: '#3b82f6', 
                      borderRadius: '4px',
                      fontSize: '12px' 
                    }}>
                      <Image size={14} />
                      <span>图片支持</span>
                    </div>
                  )}
                  
                  {voiceSupport && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px', 
                      padding: '4px 8px', 
                      backgroundColor: '#eff6ff', 
                      color: '#3b82f6', 
                      borderRadius: '4px',
                      fontSize: '12px' 
                    }}>
                      <Mic size={14} />
                      <span>语音支持</span>
                    </div>
                  )}
                  
                  {documentParsing && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px', 
                      padding: '4px 8px', 
                      backgroundColor: '#eff6ff', 
                      color: '#3b82f6', 
                      borderRadius: '4px',
                      fontSize: '12px' 
                    }}>
                      <FileText size={14} />
                      <span>文件解析</span>
                    </div>
                  )}
                  
                  {webSearch && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px', 
                      padding: '4px 8px', 
                      backgroundColor: '#eff6ff', 
                      color: '#3b82f6', 
                      borderRadius: '4px',
                      fontSize: '12px' 
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3.0 0 1 4-10z"></path>
                      </svg>
                      <span>联网搜索</span>
                    </div>
                  )}
                </div>
              </>
            )}
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
            
            {(imageSupport || voiceSupport || documentParsing) && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '16px' }}>
                <p style={{ fontSize: '12px', marginBottom: '8px' }}>可用功能:</p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {imageSupport && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div style={{ 
                        width: '36px', 
                        height: '36px', 
                        borderRadius: '50%', 
                        backgroundColor: '#eff6ff', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#3b82f6'
                      }}>
                        <Image size={18} />
                      </div>
                      <span style={{ fontSize: '11px' }}>图片</span>
                    </div>
                  )}
                  
                  {documentParsing && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div style={{ 
                        width: '36px', 
                        height: '36px', 
                        borderRadius: '50%', 
                        backgroundColor: '#eff6ff', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#3b82f6'
                      }}>
                        <FileText size={18} />
                      </div>
                      <span style={{ fontSize: '11px' }}>文件</span>
                    </div>
                  )}
                  
                  {voiceSupport && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div style={{ 
                        width: '36px', 
                        height: '36px', 
                        borderRadius: '50%', 
                        backgroundColor: '#eff6ff', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#3b82f6'
                      }}>
                        <Mic size={18} />
                      </div>
                      <span style={{ fontSize: '11px' }}>语音</span>
                    </div>
                  )}
                </div>
              </div>
            )}
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
                  {renderMessageAttachment(message)}
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
        {/* Preview area for selected files/images */}
        {(imagePreview || fileAttachment) && (
          <div style={attachmentPreviewStyle}>
            {imagePreview && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={imagePreview} alt="Preview" style={imagePreviewStyle} />
                <span>图片预览</span>
              </div>
            )}
            
            {fileAttachment && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FileText size={16} style={{ marginRight: '8px' }} />
                <span>{fileAttachment.name}</span>
              </div>
            )}
            
            <button 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '4px',
              }}
              onClick={imagePreview ? handleRemoveImage : handleRemoveFile}
            >
              <X size={16} />
            </button>
          </div>
        )}
        
        {/* Recording indicator */}
        {isRecording && (
          <div style={attachmentPreviewStyle}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                backgroundColor: '#ef4444',
                marginRight: '8px'
              }}></div>
              <span>正在录音...</span>
            </div>
            <button 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '4px',
              }}
              onClick={handleToggleRecording}
            >
              <X size={16} />
            </button>
          </div>
        )}
        
        <div style={inputContainerStyle}>
          <input
            type="text"
            placeholder="请输入您想问的问题"
            style={inputStyle}
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          
          {/* Hidden file inputs */}
          <input 
            type="file" 
            accept="image/*" 
            style={{ display: 'none' }} 
            ref={imageInputRef}
            onChange={handleImageSelect}
          />
          
          <input 
            type="file" 
            accept=".pdf,.doc,.docx,.txt,.xlsx,.xls" 
            style={{ display: 'none' }} 
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
          
          {/* Attachment options */}
          <div style={toolbarStyle}>
            {imageSupport && (
              <button 
                style={toolButtonStyle(!!imagePreview)} 
                title="上传图片"
                onClick={() => imageInputRef.current?.click()}
              >
                <Image size={18} />
              </button>
            )}
            
            {documentParsing && (
              <button 
                style={toolButtonStyle(!!fileAttachment)} 
                title="上传文件"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip size={18} />
              </button>
            )}
            
            {voiceSupport && (
              <button 
                style={toolButtonStyle(isRecording)} 
                title={isRecording ? "停止录音" : "开始录音"}
                onClick={handleToggleRecording}
              >
                <Mic size={18} />
              </button>
            )}
          </div>
          
          <button style={sendButtonStyle} onClick={handleSend}>
            <Send size={16} />
            发送
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatTestingPanel; 