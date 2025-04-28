import React from 'react';

const ApplicationOrchestrationPage: React.FC = () => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    height: 'calc(100vh - 56px)', // Adjust based on header height if necessary
    width: '100%',
    backgroundColor: '#f8fafc', // Light background for the page
  };

  const leftPanelStyle: React.CSSProperties = {
    flex: '2', // Configuration panel takes more space initially
    borderRight: '1px solid #e5e7eb',
    padding: '24px',
    overflowY: 'auto',
    backgroundColor: 'white',
  };

  const rightPanelStyle: React.CSSProperties = {
    flex: '1',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f1f5f9', // Slightly different background for the chat area
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: '24px',
    padding: '16px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: 'white',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 600,
    color: '#334155',
    marginBottom: '12px',
  };

  const chatAreaStyle: React.CSSProperties = {
    flexGrow: 1,
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    marginBottom: '16px',
    backgroundColor: 'white',
    padding: '12px',
    overflowY: 'auto', // For displaying messages
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

  return (
    <div style={containerStyle}>
      {/* Left Panel: Configuration */}
      <div style={leftPanelStyle}>
        <h1 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px', color: '#1e293b' }}>
          应用编排 - 配置
        </h1>

        {/* Placeholder Sections */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>API 配置</h2>
          {/* Content for API Config */}
          <p style={{color: '#64748b', fontSize: '14px'}}>模型选择、API密钥等设置。</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>指令 (Prompt)</h2>
          {/* Content for Prompt Config */}
           <textarea 
             style={{width: '100%', minHeight: '100px', border: '1px solid #d1d5db', borderRadius: '4px', padding: '8px', fontSize: '14px'}}
             placeholder="编辑系统提示词..."
           />
           <div style={{marginTop: '8px', color: '#64748b', fontSize: '12px'}}>提示词中变量的选项来自于下方"变量配置"。</div>
        </div>
        
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>变量</h2>
          {/* Content for Variables Config */}
           <p style={{color: '#64748b', fontSize: '14px'}}>配置应用运行所需的输入变量。</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>知识库</h2>
          {/* Content for Knowledge Base Config */}
           <p style={{color: '#64748b', fontSize: '14px'}}>关联知识库，为应用提供专业知识。</p>
        </div>
        
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>技能 (Tools/Functions)</h2>
          {/* Content for Tools/Skills Config */}
          <p style={{color: '#64748b', fontSize: '14px'}}>添加工具或函数调用能力。</p>
        </div>

        {/* Add other sections like 流程, 记忆 as needed */}

      </div>

      {/* Right Panel: Testing/Chat */}
      <div style={rightPanelStyle}>
         <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#1e293b' }}>
           文本对话测试
         </h2>
        <div style={chatAreaStyle}>
          {/* Chat messages will appear here */}
           <p style={{color: '#64748b', fontSize: '14px', textAlign: 'center', marginTop: '20px'}}>对话历史</p>
        </div>
        <div style={inputAreaStyle}>
          <input
            type="text"
            placeholder="请输入您想问的问题"
            style={inputStyle}
          />
          <button style={sendButtonStyle}>发送</button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationOrchestrationPage; 